import { logError, logCritical, logSecurity } from '../utils/logger.js';

// 🚨 GESTIONNAIRE D'ERREURS GLOBAL
export const globalErrorHandler = (err, req, res, next) => {
  // Log l'erreur
  logError(err, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id,
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Erreurs spécifiques avec codes
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Données de validation invalides',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Format d\'ID invalide'
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} déjà existant`
    });
  }

  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    });
  }

  // Erreurs PostgreSQL
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Données en doublon détectées'
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Référence invalide'
    });
  }

  if (err.code === '42703') {
    return res.status(400).json({
      success: false,
      message: 'Colonne inexistante'
    });
  }

  // Erreurs de fichier/upload
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Fichier trop volumineux'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Type de fichier non autorisé'
    });
  }

  // Erreurs blockchain
  if (err.message?.includes('blockchain') || err.message?.includes('contract')) {
    return res.status(503).json({
      success: false,
      message: 'Service blockchain temporairement indisponible',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Erreurs IA
  if (err.message?.includes('OpenAI') || err.message?.includes('AI service')) {
    return res.status(503).json({
      success: false,
      message: 'Service IA temporairement indisponible',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Erreurs de sécurité - traitement spécial
  if (err.message?.includes('security') || err.message?.includes('unauthorized')) {
    logSecurity('security_error', {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      ip: req.ip,
      url: req.originalUrl
    }, 'error');

    return res.status(403).json({
      success: false,
      message: 'Accès refusé pour des raisons de sécurité'
    });
  }

  // Erreurs critiques
  if (err.message?.includes('CRITICAL') || err.statusCode >= 500) {
    logCritical('Critical error in application', {
      error: err.message,
      stack: err.stack,
      userId: req.user?.id,
      ip: req.ip,
      url: req.originalUrl
    });
  }

  // Erreur générique 500
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message: isProduction 
      ? 'Une erreur interne s\'est produite' 
      : err.message,
    error: isProduction ? undefined : {
      name: err.name,
      message: err.message,
      stack: err.stack
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};

// 🔍 MIDDLEWARE DE VALIDATION D'ERREURS ASYNC
export const asyncErrorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 🚫 GESTIONNAIRE 404 - ROUTE NON TROUVÉE
export const notFoundHandler = (req, res, next) => {
  logSecurity('route_not_found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`,
    timestamp: new Date().toISOString()
  });
};

// 🛡️ GESTIONNAIRE D'ERREURS DE SÉCURITÉ
export const securityErrorHandler = (err, req, res, next) => {
  const securityErrors = [
    'EBADCSRFTOKEN',
    'invalid signature',
    'jwt malformed',
    'suspicious activity'
  ];

  const isSecurityError = securityErrors.some(error => 
    err.message?.toLowerCase().includes(error.toLowerCase())
  );

  if (isSecurityError) {
    logSecurity('security_violation', {
      error: err.message,
      userId: req.user?.id,
      ip: req.ip,
      url: req.originalUrl,
      userAgent: req.get('User-Agent')
    }, 'error');

    return res.status(403).json({
      success: false,
      message: 'Violation de sécurité détectée'
    });
  }

  next(err);
};

// ⚡ GESTIONNAIRE D'ERREURS DE PERFORMANCE
export const performanceErrorHandler = (err, req, res, next) => {
  if (err.message?.includes('timeout') || err.code === 'ETIMEDOUT') {
    logError(err, {
      type: 'timeout',
      url: req.originalUrl,
      method: req.method
    });

    return res.status(408).json({
      success: false,
      message: 'Délai d\'attente dépassé, réessayez'
    });
  }

  if (err.message?.includes('memory') || err.message?.includes('heap')) {
    logCritical('Memory error detected', {
      error: err.message,
      memoryUsage: process.memoryUsage()
    });

    return res.status(503).json({
      success: false,
      message: 'Service temporairement surchargé'
    });
  }

  next(err);
};

// 🔄 GESTIONNAIRE D'ERREURS DE BASE DE DONNÉES
export const databaseErrorHandler = (err, req, res, next) => {
  // Erreurs de connexion PostgreSQL
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    logCritical('Database connection failed', {
      error: err.message,
      code: err.code
    });

    return res.status(503).json({
      success: false,
      message: 'Service de base de données indisponible'
    });
  }

  // Erreurs de contrainte de base de données
  if (err.code?.startsWith('23')) {
    const constraintErrors = {
      '23502': 'Champ requis manquant',
      '23503': 'Référence invalide - élément lié introuvable',
      '23505': 'Cette valeur existe déjà',
      '23514': 'Valeur non conforme aux règles'
    };

    return res.status(400).json({
      success: false,
      message: constraintErrors[err.code] || 'Erreur de contrainte de données'
    });
  }

  next(err);
};

// 🚧 GESTIONNAIRE D'ERREURS DE DÉVELOPPEMENT
export const developmentErrorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return next(err);
  }

  // En développement, on donne plus de détails
  console.error('🚨 DEVELOPMENT ERROR:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
    user: req.user
  });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      query: req.query,
      params: req.params
    },
    timestamp: new Date().toISOString()
  });
};

// 📊 GESTIONNAIRE D'ERREURS AVEC MÉTRIQUES
export const metricsErrorHandler = (err, req, res, next) => {
  // Incrémenter compteur d'erreurs
  const errorType = err.name || 'UnknownError';
  const statusCode = err.statusCode || 500;
  
  // TODO: Intégrer avec système de métriques (Prometheus, etc.)
  logError(err, {
    type: 'metric',
    errorType,
    statusCode,
    endpoint: req.originalUrl,
    method: req.method
  });

  next(err);
};

// 🔔 GESTIONNAIRE DE NOTIFICATIONS D'ERREURS
export const notificationErrorHandler = (err, req, res, next) => {
  // Envoyer notifications pour erreurs critiques
  if (err.statusCode >= 500 || err.message?.includes('CRITICAL')) {
    // TODO: Intégrer notifications (Slack, email, SMS)
    logCritical('Critical error notification needed', {
      error: err.message,
      url: req.originalUrl,
      userId: req.user?.id
    });
  }

  next(err);
};

// 🛠️ UTILITAIRES D'ERREUR
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createError = (message, statusCode = 500) => {
  return new AppError(message, statusCode);
};

export const handleValidationError = (errors) => {
  const message = Object.values(errors).map(err => err.message).join(', ');
  return new AppError(`Erreur de validation: ${message}`, 400);
};

export const handleDuplicateError = (field) => {
  return new AppError(`${field} déjà existant`, 409);
};

export const handleNotFoundError = (resource) => {
  return new AppError(`${resource} non trouvé`, 404);
};

export const handleUnauthorizedError = (message = 'Accès non autorisé') => {
  return new AppError(message, 401);
};

export const handleForbiddenError = (message = 'Accès interdit') => {
  return new AppError(message, 403);
};