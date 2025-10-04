import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken, authRateLimit, hashPassword, comparePassword, generateJWT, generateRefreshToken } from '../middleware/auth.js';
import { asyncErrorHandler, AppError } from '../middleware/errorHandler.js';
import { logAuth, logSecurity } from '../utils/logger.js';
import { setUserSession, clearUserSession } from '../config/redis.js';
import db from '../config/database.js';

const router = express.Router();

// 🔐 INSCRIPTION UTILISATEUR
router.post('/register', authRateLimit, asyncErrorHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone, role = 'particulier', companyName } = req.body;

  // Validation de base
  if (!email || !password || !firstName || !lastName) {
    throw new AppError('Tous les champs obligatoires doivent être remplis', 400);
  }

  if (password.length < 8) {
    throw new AppError('Le mot de passe doit contenir au moins 8 caractères', 400);
  }

  // Vérifier si email existe déjà
  const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
  const existingUser = await db.query(existingUserQuery, [email.toLowerCase()]);
  
  if (existingUser.rows.length > 0) {
    throw new AppError('Cet email est déjà utilisé', 409);
  }

  try {
    // Commencer transaction
    await db.query('BEGIN');

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password);

    // Insérer l'utilisateur
    const userInsertQuery = `
      INSERT INTO users (email, password, role, status, profile, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, email, role, status, created_at
    `;
    
    const profile = {
      firstName,
      lastName,
      phone,
      ...(companyName && { companyName })
    };

    const userResult = await db.query(userInsertQuery, [
      email.toLowerCase(),
      hashedPassword,
      role,
      'active',
      JSON.stringify(profile)
    ]);

    const user = userResult.rows[0];

    // Générer tokens
    const token = generateJWT(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Sauvegarder session
    await setUserSession(user.id, {
      loginTime: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      refreshToken: refreshToken
    });

    // Commit transaction
    await db.query('COMMIT');

    logAuth(user.id, 'user_registered', { email: user.email, role: user.role });

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          profile: JSON.parse(user.profile || '{}'),
          createdAt: user.created_at
        },
        token,
        refreshToken
      }
    });

  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}));

// 🔑 CONNEXION UTILISATEUR
router.post('/login', authRateLimit, asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email et mot de passe requis', 400);
  }

  // Récupérer utilisateur
  const userQuery = 'SELECT id, email, password, role, status, profile FROM users WHERE email = $1';
  const userResult = await db.query(userQuery, [email.toLowerCase()]);

  if (userResult.rows.length === 0) {
    logSecurity('login_attempt_invalid_email', { email, ip: req.ip });
    throw new AppError('Email ou mot de passe incorrect', 401);
  }

  const user = userResult.rows[0];

  // Vérifier statut du compte
  if (user.status === 'banned') {
    logSecurity('banned_user_login_attempt', { userId: user.id, email, ip: req.ip });
    throw new AppError('Compte suspendu', 403);
  }

  if (user.status === 'inactive') {
    logSecurity('inactive_user_login_attempt', { userId: user.id, email, ip: req.ip });
    throw new AppError('Compte inactif', 403);
  }

  // Vérifier mot de passe
  const isValidPassword = await comparePassword(password, user.password);
  
  if (!isValidPassword) {
    logSecurity('login_attempt_invalid_password', { userId: user.id, email, ip: req.ip });
    throw new AppError('Email ou mot de passe incorrect', 401);
  }

  // Générer tokens
  const token = generateJWT(user.id, user.email, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // Mettre à jour dernière connexion
  await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

  // Sauvegarder session
  await setUserSession(user.id, {
    loginTime: new Date().toISOString(),
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    refreshToken: refreshToken
  });

  logAuth(user.id, 'user_logged_in', { email: user.email, ip: req.ip });

  res.json({
    success: true,
    message: 'Connexion réussie',
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: JSON.parse(user.profile || '{}')
      },
      token,
      refreshToken
    }
  });
}));

// 🚪 DÉCONNEXION
router.post('/logout', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;

  // Supprimer session Redis
  await clearUserSession(userId);

  logAuth(userId, 'user_logged_out', { ip: req.ip });

  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
}));

// 🔄 RAFRAÎCHIR TOKEN
router.post('/refresh', asyncErrorHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Token de rafraîchissement requis', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (decoded.type !== 'refresh') {
      throw new AppError('Token invalide', 401);
    }

    // Vérifier utilisateur
    const userQuery = 'SELECT id, email, role, status FROM users WHERE id = $1';
    const userResult = await db.query(userQuery, [decoded.userId]);

    if (userResult.rows.length === 0 || userResult.rows[0].status !== 'active') {
      throw new AppError('Utilisateur invalide', 401);
    }

    const user = userResult.rows[0];

    // Générer nouveau token
    const newToken = generateJWT(user.id, user.email, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    // Mettre à jour session
    await setUserSession(user.id, {
      loginTime: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      refreshToken: newRefreshToken
    });

    logAuth(user.id, 'token_refreshed', { ip: req.ip });

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token de rafraîchissement expiré', 401);
    }
    throw new AppError('Token invalide', 401);
  }
}));

// 👤 PROFIL UTILISATEUR
router.get('/profile', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;

  const userQuery = `
    SELECT id, email, role, status, profile, created_at, last_login
    FROM users 
    WHERE id = $1
  `;
  
  const userResult = await db.query(userQuery, [userId]);
  const user = userResult.rows[0];

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: JSON.parse(user.profile || '{}'),
        createdAt: user.created_at,
        lastLogin: user.last_login
      }
    }
  });
}));

// ✏️ METTRE À JOUR PROFIL
router.put('/profile', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, phone, companyName, address } = req.body;

  // Récupérer profil actuel
  const currentUserQuery = 'SELECT profile FROM users WHERE id = $1';
  const currentUser = await db.query(currentUserQuery, [userId]);
  const currentProfile = JSON.parse(currentUser.rows[0].profile || '{}');

  // Mettre à jour profil
  const updatedProfile = {
    ...currentProfile,
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(phone && { phone }),
    ...(companyName && { companyName }),
    ...(address && { address }),
    updatedAt: new Date().toISOString()
  };

  const updateQuery = 'UPDATE users SET profile = $1 WHERE id = $2 RETURNING profile';
  await db.query(updateQuery, [JSON.stringify(updatedProfile), userId]);

  logAuth(userId, 'profile_updated', { fields: Object.keys(req.body) });

  res.json({
    success: true,
    message: 'Profil mis à jour',
    data: {
      profile: updatedProfile
    }
  });
}));

// 🔐 CHANGER MOT DE PASSE
router.put('/password', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Mot de passe actuel et nouveau requis', 400);
  }

  if (newPassword.length < 8) {
    throw new AppError('Le nouveau mot de passe doit contenir au moins 8 caractères', 400);
  }

  // Vérifier mot de passe actuel
  const userQuery = 'SELECT password FROM users WHERE id = $1';
  const userResult = await db.query(userQuery, [userId]);
  const user = userResult.rows[0];

  const isValidPassword = await comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    logSecurity('password_change_invalid_current', { userId, ip: req.ip });
    throw new AppError('Mot de passe actuel incorrect', 401);
  }

  // Hasher nouveau mot de passe
  const hashedNewPassword = await hashPassword(newPassword);

  // Mettre à jour
  await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);

  // Supprimer toutes les sessions (forcer reconnexion)
  await clearUserSession(userId);

  logAuth(userId, 'password_changed', { ip: req.ip });

  res.json({
    success: true,
    message: 'Mot de passe modifié avec succès'
  });
}));

// 🔍 VÉRIFIER TOKEN (pour le frontend)
router.get('/verify', authenticateToken, asyncErrorHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
}));

// 📊 STATISTIQUES COMPTE (pour admin)
router.get('/stats/:userId', authenticateToken, asyncErrorHandler(async (req, res) => {
  // Vérifier permissions admin
  if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
    throw new AppError('Accès non autorisé', 403);
  }

  const userId = req.params.userId;

  // Statistiques utilisateur
  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM properties WHERE owner_id = $1) as properties_count,
      (SELECT COUNT(*) FROM transactions WHERE buyer_id = $1 OR seller_id = $1) as transactions_count,
      (SELECT COUNT(*) FROM documents WHERE user_id = $1) as documents_count,
      (SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false) as unread_notifications
  `;

  const statsResult = await db.query(statsQuery, [userId]);
  const stats = statsResult.rows[0];

  res.json({
    success: true,
    data: {
      stats: {
        propertiesCount: parseInt(stats.properties_count),
        transactionsCount: parseInt(stats.transactions_count),
        documentsCount: parseInt(stats.documents_count),
        unreadNotifications: parseInt(stats.unread_notifications)
      }
    }
  });
}));

export default router;