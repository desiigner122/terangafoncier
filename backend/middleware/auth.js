import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { logAuth, logSecurity, logError } from '../utils/logger.js';
import { getUserSession } from '../config/redis.js';
import db from '../config/database.js';

// 🔐 MIDDLEWARE D'AUTHENTIFICATION JWT
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logSecurity('missing_token', { ip: req.ip, url: req.originalUrl });
      return res.status(401).json({ 
        success: false, 
        message: 'Token d\'accès requis' 
      });
    }

    // Vérifier le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier si l'utilisateur existe toujours
    const userQuery = 'SELECT id, email, role, status, profile FROM users WHERE id = $1';
    const userResult = await db.query(userQuery, [decoded.userId]);
    
    if (userResult.rows.length === 0) {
      logSecurity('user_not_found', { userId: decoded.userId, ip: req.ip });
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur invalide' 
      });
    }

    const user = userResult.rows[0];
    
    // Vérifier le statut du compte
    if (user.status === 'banned') {
      logSecurity('banned_user_access', { userId: user.id, ip: req.ip });
      return res.status(403).json({ 
        success: false, 
        message: 'Compte suspendu' 
      });
    }

    if (user.status === 'inactive') {
      logSecurity('inactive_user_access', { userId: user.id, ip: req.ip });
      return res.status(403).json({ 
        success: false, 
        message: 'Compte inactif' 
      });
    }

    // Vérifier session Redis (optionnel, pour révocation rapide)
    const session = await getUserSession(user.id);
    if (session && session.revoked) {
      logSecurity('revoked_session', { userId: user.id, ip: req.ip });
      return res.status(401).json({ 
        success: false, 
        message: 'Session expirée' 
      });
    }

    // Ajouter utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      profile: user.profile
    };

    logAuth(user.id, 'token_validated', { ip: req.ip, url: req.originalUrl });
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logSecurity('token_expired', { ip: req.ip });
      return res.status(401).json({ 
        success: false, 
        message: 'Token expiré' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      logSecurity('invalid_token', { ip: req.ip, error: error.message });
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide' 
      });
    }

    logError(error, { middleware: 'authenticateToken', ip: req.ip });
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur d\'authentification' 
    });
  }
};

// 🛡️ MIDDLEWARE DE VÉRIFICATION DES RÔLES
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentification requise' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logSecurity('insufficient_permissions', { 
        userId: req.user.id, 
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        url: req.originalUrl
      });
      return res.status(403).json({ 
        success: false, 
        message: 'Permissions insuffisantes' 
      });
    }

    next();
  };
};

// 🚦 LIMITATION DE TAUX (RATE LIMITING)
export const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Trop de tentatives, réessayez plus tard'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logSecurity('rate_limit_exceeded', {
        ip: req.ip,
        url: req.originalUrl,
        userAgent: req.get('User-Agent')
      });
      res.status(429).json({
        success: false,
        message: message || 'Trop de tentatives, réessayez plus tard'
      });
    }
  });
};

// Rate limits spécifiques
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 tentatives max
  'Trop de tentatives de connexion'
);

export const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requêtes max
  'Limite d\'API atteinte'
);

export const uploadRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 heure
  10, // 10 uploads max
  'Limite d\'upload atteinte'
);

// 🔐 UTILITAIRES DE SÉCURITÉ
export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateJWT = (userId, email, role) => {
  const payload = {
    userId,
    email,
    role,
    iat: Date.now()
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// 🛡️ VALIDATION DES ENTRÉES
export const validateInput = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      logSecurity('invalid_input', {
        userId: req.user?.id,
        ip: req.ip,
        url: req.originalUrl,
        errors: error.details
      });
      
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

// 🚨 MIDDLEWARE DE DÉTECTION D'INTRUSION
export const detectSuspiciousActivity = (req, res, next) => {
  const suspiciousPatterns = [
    /(<script|javascript:|vbscript:|onload=|onerror=)/i, // XSS
    /(union\s+select|drop\s+table|delete\s+from)/i, // SQL Injection
    /(\.\.\/)/, // Path Traversal
    /(cmd=|exec=|system\()/i // Command Injection
  ];

  const checkValue = (value) => {
    if (typeof value === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  const suspicious = 
    checkValue(req.body) || 
    checkValue(req.query) || 
    checkValue(req.params);

  if (suspicious) {
    logSecurity('suspicious_activity_detected', {
      userId: req.user?.id,
      ip: req.ip,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      body: req.body,
      query: req.query,
      params: req.params
    }, 'error');

    return res.status(400).json({
      success: false,
      message: 'Requête suspecte détectée'
    });
  }

  next();
};

// 📱 MIDDLEWARE DE VÉRIFICATION 2FA (future implémentation)
export const require2FA = async (req, res, next) => {
  // TODO: Implémenter vérification 2FA
  // Pour l'instant, passer directement
  next();
};

// 🔍 MIDDLEWARE DE LOG D'AUDIT
export const auditLog = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log après réponse
      logAuth(req.user?.id || 'anonymous', action, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        statusCode: res.statusCode,
        userAgent: req.get('User-Agent'),
        body: req.body,
        query: req.query,
        params: req.params
      });
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// 🔐 MIDDLEWARE DE VÉRIFICATION DE SESSION
export const verifySession = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  try {
    const session = await getUserSession(req.user.id);
    
    if (!session) {
      // Créer une nouvelle session
      await setUserSession(req.user.id, {
        loginTime: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
    } else if (session.revoked) {
      return res.status(401).json({
        success: false,
        message: 'Session révoquée'
      });
    }
    
    next();
  } catch (error) {
    logError(error, { middleware: 'verifySession' });
    next(); // Continuer même en cas d'erreur Redis
  }
};

// 🛡️ MIDDLEWARE CSRF (Cross-Site Request Forgery)
export const csrfProtection = (req, res, next) => {
  // Vérifier origine pour requêtes sensibles
  const sensitiveRoutes = ['/api/auth/', '/api/properties/', '/api/payments/'];
  const isSensitive = sensitiveRoutes.some(route => req.path.startsWith(route));
  
  if (isSensitive && req.method !== 'GET') {
    const origin = req.get('Origin');
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if (!origin || !allowedOrigins.includes(origin)) {
      logSecurity('csrf_attempt', {
        ip: req.ip,
        origin: origin,
        url: req.originalUrl
      });
      
      return res.status(403).json({
        success: false,
        message: 'Origine non autorisée'
      });
    }
  }
  
  next();
};