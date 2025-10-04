import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncErrorHandler, AppError } from '../middleware/errorHandler.js';
import { logBusiness } from '../utils/logger.js';
import db from '../config/database.js';

const router = express.Router();

// 👥 LISTER TOUS LES UTILISATEURS (Admin seulement)
router.get('/', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const { page = 1, limit = 20, role, status, search } = req.query;
  const offset = (page - 1) * limit;

  // Construire query dynamique
  let whereConditions = [];
  let queryParams = [];
  let paramIndex = 1;

  if (role) {
    whereConditions.push(`role = $${paramIndex}`);
    queryParams.push(role);
    paramIndex++;
  }

  if (status) {
    whereConditions.push(`status = $${paramIndex}`);
    queryParams.push(status);
    paramIndex++;
  }

  if (search) {
    whereConditions.push(`(email ILIKE $${paramIndex} OR profile->>'firstName' ILIKE $${paramIndex} OR profile->>'lastName' ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Query utilisateurs
  const usersQuery = `
    SELECT 
      id, email, role, status, profile, created_at, last_login,
      (SELECT COUNT(*) FROM properties WHERE owner_id = users.id) as properties_count
    FROM users 
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  queryParams.push(limit, offset);

  const usersResult = await db.query(usersQuery, queryParams);

  // Count total
  const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`;
  const countResult = await db.query(countQuery, queryParams.slice(0, -2));
  const total = parseInt(countResult.rows[0].count);

  const users = usersResult.rows.map(user => ({
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    profile: JSON.parse(user.profile || '{}'),
    createdAt: user.created_at,
    lastLogin: user.last_login,
    propertiesCount: parseInt(user.properties_count)
  }));

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// 👤 DÉTAILS UTILISATEUR
router.get('/:id', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.params.id;
  const requesterId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  // Vérifier permissions (admin ou propriétaire du compte)
  if (userId !== requesterId && !isAdmin) {
    throw new AppError('Accès non autorisé', 403);
  }

  const userQuery = `
    SELECT 
      id, email, role, status, profile, created_at, last_login,
      (SELECT COUNT(*) FROM properties WHERE owner_id = $1) as properties_count,
      (SELECT COUNT(*) FROM transactions WHERE buyer_id = $1 OR seller_id = $1) as transactions_count,
      (SELECT COUNT(*) FROM documents WHERE user_id = $1) as documents_count
    FROM users 
    WHERE id = $1
  `;

  const userResult = await db.query(userQuery, [userId]);

  if (userResult.rows.length === 0) {
    throw new AppError('Utilisateur non trouvé', 404);
  }

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
        lastLogin: user.last_login,
        stats: {
          propertiesCount: parseInt(user.properties_count),
          transactionsCount: parseInt(user.transactions_count),
          documentsCount: parseInt(user.documents_count)
        }
      }
    }
  });
}));

// ✏️ MODIFIER UTILISATEUR (Admin seulement)
router.put('/:id', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const userId = req.params.id;
  const { role, status } = req.body;

  // Vérifier que l'utilisateur existe
  const existingQuery = 'SELECT id, email FROM users WHERE id = $1';
  const existingResult = await db.query(existingQuery, [userId]);

  if (existingResult.rows.length === 0) {
    throw new AppError('Utilisateur non trouvé', 404);
  }

  const updateFields = [];
  const queryParams = [];
  let paramIndex = 1;

  if (role !== undefined) {
    const validRoles = ['particulier', 'agent_foncier', 'geometre', 'banque', 'notaire', 'admin'];
    if (!validRoles.includes(role)) {
      throw new AppError('Rôle invalide', 400);
    }
    updateFields.push(`role = $${paramIndex}`);
    queryParams.push(role);
    paramIndex++;
  }

  if (status !== undefined) {
    const validStatuses = ['active', 'inactive', 'banned'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Statut invalide', 400);
    }
    updateFields.push(`status = $${paramIndex}`);
    queryParams.push(status);
    paramIndex++;
  }

  if (updateFields.length === 0) {
    throw new AppError('Aucune donnée à mettre à jour', 400);
  }

  updateFields.push(`updated_at = NOW()`);
  queryParams.push(userId);

  const updateQuery = `
    UPDATE users 
    SET ${updateFields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, email, role, status, updated_at
  `;

  const updateResult = await db.query(updateQuery, queryParams);
  const updatedUser = updateResult.rows[0];

  logBusiness('user_updated_by_admin', {
    targetUserId: userId,
    adminId: req.user.id,
    changes: { role, status }
  });

  res.json({
    success: true,
    message: 'Utilisateur mis à jour',
    data: {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        updatedAt: updatedUser.updated_at
      }
    }
  });
}));

// 🚫 BANNIR/DÉBANNIR UTILISATEUR
router.patch('/:id/ban', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const userId = req.params.id;
  const { banned = true, reason } = req.body;

  // Vérifier que l'utilisateur existe
  const userQuery = 'SELECT id, email, status FROM users WHERE id = $1';
  const userResult = await db.query(userQuery, [userId]);

  if (userResult.rows.length === 0) {
    throw new AppError('Utilisateur non trouvé', 404);
  }

  const user = userResult.rows[0];
  const newStatus = banned ? 'banned' : 'active';

  if (user.status === newStatus) {
    const message = banned ? 'Utilisateur déjà banni' : 'Utilisateur déjà actif';
    return res.json({
      success: true,
      message
    });
  }

  // Mettre à jour statut
  await db.query('UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2', [newStatus, userId]);

  logBusiness(banned ? 'user_banned' : 'user_unbanned', {
    targetUserId: userId,
    adminId: req.user.id,
    reason
  });

  res.json({
    success: true,
    message: banned ? 'Utilisateur banni' : 'Utilisateur débanni'
  });
}));

// 📊 STATISTIQUES UTILISATEURS (Admin)
router.get('/stats/overview', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_users,
      COUNT(*) FILTER (WHERE status = 'active') as active_users,
      COUNT(*) FILTER (WHERE status = 'banned') as banned_users,
      COUNT(*) FILTER (WHERE status = 'inactive') as inactive_users,
      COUNT(*) FILTER (WHERE role = 'particulier') as particuliers,
      COUNT(*) FILTER (WHERE role = 'agent_foncier') as agents,
      COUNT(*) FILTER (WHERE role = 'geometre') as geometres,
      COUNT(*) FILTER (WHERE role = 'banque') as banques,
      COUNT(*) FILTER (WHERE role = 'notaire') as notaires,
      COUNT(*) FILTER (WHERE role = 'admin') as admins,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
      COUNT(*) FILTER (WHERE last_login > NOW() - INTERVAL '7 days') as active_last_7d
    FROM users
  `;

  const statsResult = await db.query(statsQuery);
  const stats = statsResult.rows[0];

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers: parseInt(stats.total_users),
        activeUsers: parseInt(stats.active_users),
        bannedUsers: parseInt(stats.banned_users),
        inactiveUsers: parseInt(stats.inactive_users),
        usersByRole: {
          particuliers: parseInt(stats.particuliers),
          agents: parseInt(stats.agents),
          geometres: parseInt(stats.geometres),
          banques: parseInt(stats.banques),
          notaires: parseInt(stats.notaires),
          admins: parseInt(stats.admins)
        },
        newUsers30d: parseInt(stats.new_users_30d),
        activeLast7d: parseInt(stats.active_last_7d)
      }
    }
  });
}));

// 🔍 RECHERCHER UTILISATEURS
router.get('/search/:query', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const searchQuery = req.params.query;
  const { limit = 10 } = req.query;

  const usersQuery = `
    SELECT id, email, role, status, profile, created_at
    FROM users 
    WHERE 
      email ILIKE $1 OR 
      profile->>'firstName' ILIKE $1 OR 
      profile->>'lastName' ILIKE $1 OR
      profile->>'companyName' ILIKE $1
    ORDER BY 
      CASE 
        WHEN email ILIKE $1 THEN 1
        WHEN profile->>'firstName' ILIKE $1 OR profile->>'lastName' ILIKE $1 THEN 2
        ELSE 3
      END,
      created_at DESC
    LIMIT $2
  `;

  const usersResult = await db.query(usersQuery, [`%${searchQuery}%`, limit]);

  const users = usersResult.rows.map(user => ({
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    profile: JSON.parse(user.profile || '{}'),
    createdAt: user.created_at
  }));

  res.json({
    success: true,
    data: { users }
  });
}));

export default router;