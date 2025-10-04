import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncErrorHandler, AppError } from '../middleware/errorHandler.js';
import { logBusiness } from '../utils/logger.js';
import { publishNotification } from '../config/redis.js';
import db from '../config/database.js';

const router = express.Router();

// 📋 LISTER NOTIFICATIONS UTILISATEUR
router.get('/', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  const offset = (page - 1) * limit;
  const userId = req.user.id;

  let whereClause = 'WHERE user_id = $1';
  const queryParams = [userId];

  if (unreadOnly === 'true') {
    whereClause += ' AND read = false';
  }

  const notificationsQuery = `
    SELECT id, type, title, message, data, read, priority, created_at
    FROM notifications 
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
  `;

  queryParams.push(limit, offset);

  const notificationsResult = await db.query(notificationsQuery, queryParams);

  // Count total
  const countQuery = `SELECT COUNT(*) FROM notifications ${whereClause}`;
  const countResult = await db.query(countQuery, [userId]);
  const total = parseInt(countResult.rows[0].count);

  // Count unread
  const unreadQuery = 'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false';
  const unreadResult = await db.query(unreadQuery, [userId]);
  const unreadCount = parseInt(unreadResult.rows[0].count);

  const notifications = notificationsResult.rows.map(row => ({
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    data: row.data ? JSON.parse(row.data) : null,
    read: row.read,
    priority: row.priority,
    createdAt: row.created_at
  }));

  res.json({
    success: true,
    data: {
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    }
  });
}));

// 📬 CRÉER NOTIFICATION
router.post('/', authenticateToken, requireRole(['admin', 'geometre', 'agent_foncier']), asyncErrorHandler(async (req, res) => {
  const { userId, type, title, message, data, priority = 'normal' } = req.body;

  if (!userId || !type || !title || !message) {
    throw new AppError('Utilisateur, type, titre et message requis', 400);
  }

  // Vérifier que l'utilisateur existe
  const userQuery = 'SELECT id FROM users WHERE id = $1';
  const userResult = await db.query(userQuery, [userId]);

  if (userResult.rows.length === 0) {
    throw new AppError('Utilisateur non trouvé', 404);
  }

  // Créer notification
  const notificationQuery = `
    INSERT INTO notifications (user_id, type, title, message, data, priority, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING id, type, title, message, data, priority, created_at
  `;

  const notificationResult = await db.query(notificationQuery, [
    userId,
    type,
    title,
    message,
    data ? JSON.stringify(data) : null,
    priority
  ]);

  const notification = notificationResult.rows[0];

  // Publier notification temps réel
  await publishNotification(`user_${userId}`, {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data ? JSON.parse(notification.data) : null,
    priority: notification.priority,
    createdAt: notification.created_at
  });

  logBusiness('notification_created', {
    notificationId: notification.id,
    recipientId: userId,
    senderId: req.user.id,
    type: notification.type
  });

  res.status(201).json({
    success: true,
    message: 'Notification créée',
    data: {
      notification: {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data ? JSON.parse(notification.data) : null,
        priority: notification.priority,
        createdAt: notification.created_at
      }
    }
  });
}));

// ✅ MARQUER COMME LUE
router.patch('/:id/read', authenticateToken, asyncErrorHandler(async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user.id;

  // Vérifier que la notification appartient à l'utilisateur
  const notificationQuery = 'SELECT id, read FROM notifications WHERE id = $1 AND user_id = $2';
  const notificationResult = await db.query(notificationQuery, [notificationId, userId]);

  if (notificationResult.rows.length === 0) {
    throw new AppError('Notification non trouvée', 404);
  }

  const notification = notificationResult.rows[0];

  if (notification.read) {
    return res.json({
      success: true,
      message: 'Notification déjà lue'
    });
  }

  // Marquer comme lue
  await db.query('UPDATE notifications SET read = true, read_at = NOW() WHERE id = $1', [notificationId]);

  res.json({
    success: true,
    message: 'Notification marquée comme lue'
  });
}));

// ✅ MARQUER TOUTES COMME LUES
router.patch('/mark-all-read', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;

  // Marquer toutes les notifications non lues comme lues
  const updateResult = await db.query(
    'UPDATE notifications SET read = true, read_at = NOW() WHERE user_id = $1 AND read = false',
    [userId]
  );

  const updatedCount = updateResult.rowCount;

  res.json({
    success: true,
    message: `${updatedCount} notification(s) marquée(s) comme lue(s)`
  });
}));

// ❌ SUPPRIMER NOTIFICATION
router.delete('/:id', authenticateToken, asyncErrorHandler(async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user.id;

  // Vérifier que la notification appartient à l'utilisateur
  const notificationQuery = 'SELECT id FROM notifications WHERE id = $1 AND user_id = $2';
  const notificationResult = await db.query(notificationQuery, [notificationId, userId]);

  if (notificationResult.rows.length === 0) {
    throw new AppError('Notification non trouvée', 404);
  }

  // Supprimer notification
  await db.query('DELETE FROM notifications WHERE id = $1', [notificationId]);

  res.json({
    success: true,
    message: 'Notification supprimée'
  });
}));

// 🔔 PRÉFÉRENCES NOTIFICATIONS
router.get('/preferences', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;

  // Récupérer préférences (stockées dans profile utilisateur)
  const userQuery = 'SELECT profile FROM users WHERE id = $1';
  const userResult = await db.query(userQuery, [userId]);

  const profile = JSON.parse(userResult.rows[0].profile || '{}');
  const preferences = profile.notificationPreferences || {
    email: true,
    push: true,
    sms: false,
    types: {
      property_updates: true,
      transaction_updates: true,
      ai_analysis: true,
      blockchain_updates: true,
      system_alerts: true
    }
  };

  res.json({
    success: true,
    data: { preferences }
  });
}));

// ⚙️ METTRE À JOUR PRÉFÉRENCES
router.put('/preferences', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const { email, push, sms, types } = req.body;

  // Récupérer profil actuel
  const userQuery = 'SELECT profile FROM users WHERE id = $1';
  const userResult = await db.query(userQuery, [userId]);
  const currentProfile = JSON.parse(userResult.rows[0].profile || '{}');

  // Mettre à jour préférences
  const updatedProfile = {
    ...currentProfile,
    notificationPreferences: {
      email: email !== undefined ? email : true,
      push: push !== undefined ? push : true,
      sms: sms !== undefined ? sms : false,
      types: types || {
        property_updates: true,
        transaction_updates: true,
        ai_analysis: true,
        blockchain_updates: true,
        system_alerts: true
      }
    }
  };

  // Sauvegarder
  await db.query('UPDATE users SET profile = $1 WHERE id = $2', [JSON.stringify(updatedProfile), userId]);

  res.json({
    success: true,
    message: 'Préférences mises à jour',
    data: {
      preferences: updatedProfile.notificationPreferences
    }
  });
}));

// 📊 STATISTIQUES NOTIFICATIONS (Admin)
router.get('/stats/overview', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_notifications,
      COUNT(*) FILTER (WHERE read = true) as read_notifications,
      COUNT(*) FILTER (WHERE read = false) as unread_notifications,
      COUNT(*) FILTER (WHERE priority = 'high') as high_priority,
      COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_notifications,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as recent_24h,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as recent_7d
    FROM notifications
  `;

  const typeStatsQuery = `
    SELECT 
      type,
      COUNT(*) as count
    FROM notifications
    GROUP BY type
    ORDER BY count DESC
  `;

  const [statsResult, typeStatsResult] = await Promise.all([
    db.query(statsQuery),
    db.query(typeStatsQuery)
  ]);

  const stats = statsResult.rows[0];
  const typeStats = typeStatsResult.rows;

  res.json({
    success: true,
    data: {
      stats: {
        totalNotifications: parseInt(stats.total_notifications),
        readNotifications: parseInt(stats.read_notifications),
        unreadNotifications: parseInt(stats.unread_notifications),
        highPriority: parseInt(stats.high_priority),
        urgentNotifications: parseInt(stats.urgent_notifications),
        recent24h: parseInt(stats.recent_24h),
        recent7d: parseInt(stats.recent_7d)
      },
      typeDistribution: typeStats.map(row => ({
        type: row.type,
        count: parseInt(row.count)
      }))
    }
  });
}));

// 📢 NOTIFICATION BROADCAST (Admin)
router.post('/broadcast', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const { title, message, type = 'system_alert', priority = 'normal', targetRole } = req.body;

  if (!title || !message) {
    throw new AppError('Titre et message requis', 400);
  }

  // Récupérer utilisateurs cibles
  let userQuery = 'SELECT id FROM users WHERE status = $1';
  const queryParams = ['active'];

  if (targetRole) {
    userQuery += ' AND role = $2';
    queryParams.push(targetRole);
  }

  const usersResult = await db.query(userQuery, queryParams);
  const users = usersResult.rows;

  if (users.length === 0) {
    throw new AppError('Aucun utilisateur cible trouvé', 404);
  }

  // Créer notifications pour tous les utilisateurs
  const notificationPromises = users.map(async (user) => {
    const notificationQuery = `
      INSERT INTO notifications (user_id, type, title, message, priority, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id
    `;

    const result = await db.query(notificationQuery, [user.id, type, title, message, priority]);

    // Publier notification temps réel
    await publishNotification(`user_${user.id}`, {
      id: result.rows[0].id,
      type,
      title,
      message,
      priority,
      createdAt: new Date().toISOString()
    });

    return result.rows[0].id;
  });

  const notificationIds = await Promise.all(notificationPromises);

  logBusiness('broadcast_notification_sent', {
    senderId: req.user.id,
    recipientCount: users.length,
    type,
    title
  });

  res.json({
    success: true,
    message: `Notification diffusée à ${users.length} utilisateur(s)`,
    data: {
      recipientCount: users.length,
      notificationIds
    }
  });
}));

// 🔍 RECHERCHER NOTIFICATIONS
router.get('/search/:query', authenticateToken, asyncErrorHandler(async (req, res) => {
  const searchQuery = req.params.query;
  const userId = req.user.id;
  const { limit = 10 } = req.query;

  const notificationsQuery = `
    SELECT id, type, title, message, data, read, priority, created_at
    FROM notifications 
    WHERE user_id = $1 
      AND (title ILIKE $2 OR message ILIKE $2)
    ORDER BY created_at DESC
    LIMIT $3
  `;

  const notificationsResult = await db.query(notificationsQuery, [
    userId,
    `%${searchQuery}%`,
    limit
  ]);

  const notifications = notificationsResult.rows.map(row => ({
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.message,
    data: row.data ? JSON.parse(row.data) : null,
    read: row.read,
    priority: row.priority,
    createdAt: row.created_at
  }));

  res.json({
    success: true,
    data: {
      query: searchQuery,
      notifications
    }
  });
}));

export default router;