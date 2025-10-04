import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncErrorHandler } from '../middleware/errorHandler.js';
import { logBusiness } from '../utils/logger.js';
import db from '../config/database.js';

const router = express.Router();

// 📊 DASHBOARD GÉNÉRAL
router.get('/overview', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let dashboardData = {};

  // Données communes
  const commonStatsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM properties WHERE owner_id = $1) as my_properties,
      (SELECT COUNT(*) FROM transactions WHERE buyer_id = $1 OR seller_id = $1) as my_transactions,
      (SELECT COUNT(*) FROM documents WHERE user_id = $1) as my_documents,
      (SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false) as unread_notifications
  `;

  const commonStatsResult = await db.query(commonStatsQuery, [userId]);
  const commonStats = commonStatsResult.rows[0];

  dashboardData.personalStats = {
    properties: parseInt(commonStats.my_properties),
    transactions: parseInt(commonStats.my_transactions),
    documents: parseInt(commonStats.my_documents),
    unreadNotifications: parseInt(commonStats.unread_notifications)
  };

  // Données spécifiques par rôle
  if (userRole === 'admin') {
    const adminStatsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
        (SELECT COUNT(*) FROM properties) as total_properties,
        (SELECT COUNT(*) FROM transactions) as total_transactions,
        (SELECT COUNT(*) FROM properties WHERE blockchain_hash IS NOT NULL) as blockchain_properties,
        (SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '30 days') as new_users_30d,
        (SELECT COUNT(*) FROM properties WHERE created_at > NOW() - INTERVAL '30 days') as new_properties_30d
    `;

    const adminStatsResult = await db.query(adminStatsQuery);
    const adminStats = adminStatsResult.rows[0];

    dashboardData.adminStats = {
      totalUsers: parseInt(adminStats.total_users),
      totalProperties: parseInt(adminStats.total_properties),
      totalTransactions: parseInt(adminStats.total_transactions),
      blockchainProperties: parseInt(adminStats.blockchain_properties),
      newUsers30d: parseInt(adminStats.new_users_30d),
      newProperties30d: parseInt(adminStats.new_properties_30d)
    };
  }

  if (['geometre', 'agent_foncier'].includes(userRole)) {
    const professionalStatsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM properties WHERE status = 'pending_verification') as pending_verifications,
        (SELECT COUNT(*) FROM documents WHERE status = 'uploaded' AND document_type = 'titre_foncier') as pending_documents,
        (SELECT COUNT(*) FROM transactions WHERE status = 'pending') as pending_transactions
    `;

    const professionalStatsResult = await db.query(professionalStatsQuery);
    const professionalStats = professionalStatsResult.rows[0];

    dashboardData.professionalStats = {
      pendingVerifications: parseInt(professionalStats.pending_verifications),
      pendingDocuments: parseInt(professionalStats.pending_documents),
      pendingTransactions: parseInt(professionalStats.pending_transactions)
    };
  }

  // Activité récente
  const recentActivityQuery = `
    SELECT 'property' as type, title as description, created_at
    FROM properties 
    WHERE owner_id = $1
    UNION ALL
    SELECT 'transaction' as type, 'Transaction ' || type as description, created_at
    FROM transactions 
    WHERE buyer_id = $1 OR seller_id = $1
    UNION ALL
    SELECT 'document' as type, 'Document: ' || original_name as description, created_at
    FROM documents 
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 10
  `;

  const recentActivityResult = await db.query(recentActivityQuery, [userId]);
  
  dashboardData.recentActivity = recentActivityResult.rows.map(row => ({
    type: row.type,
    description: row.description,
    createdAt: row.created_at
  }));

  res.json({
    success: true,
    data: dashboardData
  });
}));

// 📈 STATISTIQUES DÉTAILLÉES
router.get('/stats/:period', authenticateToken, asyncErrorHandler(async (req, res) => {
  const period = req.params.period; // '7d', '30d', '90d', '1y'
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  let intervalClause;
  switch (period) {
    case '7d':
      intervalClause = '7 days';
      break;
    case '30d':
      intervalClause = '30 days';
      break;
    case '90d':
      intervalClause = '90 days';
      break;
    case '1y':
      intervalClause = '1 year';
      break;
    default:
      intervalClause = '30 days';
  }

  const timeSeriesQuery = isAdmin ? `
    SELECT 
      DATE_TRUNC('day', created_at) as date,
      COUNT(*) FILTER (WHERE table_name = 'properties') as properties,
      COUNT(*) FILTER (WHERE table_name = 'users') as users,
      COUNT(*) FILTER (WHERE table_name = 'transactions') as transactions
    FROM (
      SELECT created_at, 'properties' as table_name FROM properties
      UNION ALL
      SELECT created_at, 'users' as table_name FROM users
      UNION ALL
      SELECT created_at, 'transactions' as table_name FROM transactions
    ) combined
    WHERE created_at > NOW() - INTERVAL '${intervalClause}'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date
  ` : `
    SELECT 
      DATE_TRUNC('day', created_at) as date,
      COUNT(*) FILTER (WHERE table_name = 'properties') as properties,
      COUNT(*) FILTER (WHERE table_name = 'transactions') as transactions,
      COUNT(*) FILTER (WHERE table_name = 'documents') as documents
    FROM (
      SELECT created_at, 'properties' as table_name FROM properties WHERE owner_id = $1
      UNION ALL
      SELECT created_at, 'transactions' as table_name FROM transactions WHERE buyer_id = $1 OR seller_id = $1
      UNION ALL
      SELECT created_at, 'documents' as table_name FROM documents WHERE user_id = $1
    ) combined
    WHERE created_at > NOW() - INTERVAL '${intervalClause}'
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date
  `;

  const queryParams = isAdmin ? [] : [userId];
  const timeSeriesResult = await db.query(timeSeriesQuery, queryParams);

  const timeSeries = timeSeriesResult.rows.map(row => ({
    date: row.date.toISOString().split('T')[0],
    properties: parseInt(row.properties || 0),
    transactions: parseInt(row.transactions || 0),
    ...(isAdmin ? { users: parseInt(row.users || 0) } : { documents: parseInt(row.documents || 0) })
  }));

  res.json({
    success: true,
    data: {
      period,
      timeSeries
    }
  });
}));

// 🎯 MÉTRIQUES PERFORMANCE
router.get('/metrics', authenticateToken, requireRole(['admin', 'geometre', 'agent_foncier']), asyncErrorHandler(async (req, res) => {
  const userRole = req.user.role;

  let metrics = {};

  if (userRole === 'admin') {
    // Métriques système
    const systemMetricsQuery = `
      SELECT 
        COUNT(*) as total_properties,
        COUNT(*) FILTER (WHERE status = 'active') as active_properties,
        COUNT(*) FILTER (WHERE blockchain_hash IS NOT NULL) as blockchain_properties,
        AVG(price) as avg_property_price,
        COUNT(DISTINCT owner_id) as unique_property_owners
      FROM properties
    `;

    const userMetricsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE status = 'active') as active_users,
        COUNT(*) FILTER (WHERE last_login > NOW() - INTERVAL '7 days') as active_last_7d,
        COUNT(*) FILTER (WHERE role = 'particulier') as particuliers,
        COUNT(*) FILTER (WHERE role = 'agent_foncier') as agents,
        COUNT(*) FILTER (WHERE role = 'geometre') as geometres
      FROM users
    `;

    const [systemResult, userResult] = await Promise.all([
      db.query(systemMetricsQuery),
      db.query(userMetricsQuery)
    ]);

    metrics.system = {
      properties: {
        total: parseInt(systemResult.rows[0].total_properties),
        active: parseInt(systemResult.rows[0].active_properties),
        onBlockchain: parseInt(systemResult.rows[0].blockchain_properties),
        avgPrice: parseFloat(systemResult.rows[0].avg_property_price || 0),
        uniqueOwners: parseInt(systemResult.rows[0].unique_property_owners)
      },
      users: {
        total: parseInt(userResult.rows[0].total_users),
        active: parseInt(userResult.rows[0].active_users),
        activeLast7d: parseInt(userResult.rows[0].active_last_7d),
        byRole: {
          particuliers: parseInt(userResult.rows[0].particuliers),
          agents: parseInt(userResult.rows[0].agents),
          geometres: parseInt(userResult.rows[0].geometres)
        }
      }
    };
  }

  if (['geometre', 'agent_foncier'].includes(userRole)) {
    // Métriques professionnelles
    const workloadQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending_verification') as pending_verifications,
        COUNT(*) FILTER (WHERE status = 'verified') as completed_verifications,
        COUNT(*) FILTER (WHERE updated_at > NOW() - INTERVAL '7 days') as recent_activity
      FROM properties
    `;

    const documentsQuery = `
      SELECT 
        COUNT(*) as total_documents,
        COUNT(*) FILTER (WHERE status = 'analyzed') as analyzed_documents,
        COUNT(*) FILTER (WHERE ai_analysis IS NOT NULL) as ai_analyzed
      FROM documents
    `;

    const [workloadResult, documentsResult] = await Promise.all([
      db.query(workloadQuery),
      db.query(documentsQuery)
    ]);

    metrics.professional = {
      workload: {
        pendingVerifications: parseInt(workloadResult.rows[0].pending_verifications),
        completedVerifications: parseInt(workloadResult.rows[0].completed_verifications),
        recentActivity: parseInt(workloadResult.rows[0].recent_activity)
      },
      documents: {
        total: parseInt(documentsResult.rows[0].total_documents),
        analyzed: parseInt(documentsResult.rows[0].analyzed_documents),
        aiAnalyzed: parseInt(documentsResult.rows[0].ai_analyzed)
      }
    };
  }

  res.json({
    success: true,
    data: { metrics }
  });
}));

// 📊 GRAPHIQUES DASHBOARD
router.get('/charts/:chartType', authenticateToken, asyncErrorHandler(async (req, res) => {
  const chartType = req.params.chartType;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  let chartData = {};

  switch (chartType) {
    case 'properties_by_location':
      const locationQuery = isAdmin ? 
        'SELECT location, COUNT(*) as count FROM properties GROUP BY location ORDER BY count DESC LIMIT 10' :
        'SELECT location, COUNT(*) as count FROM properties WHERE owner_id = $1 GROUP BY location ORDER BY count DESC LIMIT 10';
      
      const locationParams = isAdmin ? [] : [userId];
      const locationResult = await db.query(locationQuery, locationParams);
      
      chartData = {
        labels: locationResult.rows.map(row => row.location),
        data: locationResult.rows.map(row => parseInt(row.count))
      };
      break;

    case 'transactions_by_month':
      const transactionQuery = isAdmin ?
        `SELECT 
          EXTRACT(MONTH FROM created_at) as month,
          EXTRACT(YEAR FROM created_at) as year,
          COUNT(*) as count
        FROM transactions 
        WHERE created_at > NOW() - INTERVAL '12 months'
        GROUP BY year, month 
        ORDER BY year, month` :
        `SELECT 
          EXTRACT(MONTH FROM created_at) as month,
          EXTRACT(YEAR FROM created_at) as year,
          COUNT(*) as count
        FROM transactions 
        WHERE (buyer_id = $1 OR seller_id = $1) 
          AND created_at > NOW() - INTERVAL '12 months'
        GROUP BY year, month 
        ORDER BY year, month`;

      const transactionParams = isAdmin ? [] : [userId];
      const transactionResult = await db.query(transactionQuery, transactionParams);
      
      chartData = {
        labels: transactionResult.rows.map(row => `${row.year}-${String(row.month).padStart(2, '0')}`),
        data: transactionResult.rows.map(row => parseInt(row.count))
      };
      break;

    case 'property_types':
      const typeQuery = isAdmin ?
        'SELECT property_type, COUNT(*) as count FROM properties GROUP BY property_type ORDER BY count DESC' :
        'SELECT property_type, COUNT(*) as count FROM properties WHERE owner_id = $1 GROUP BY property_type ORDER BY count DESC';
      
      const typeParams = isAdmin ? [] : [userId];
      const typeResult = await db.query(typeQuery, typeParams);
      
      chartData = {
        labels: typeResult.rows.map(row => row.property_type),
        data: typeResult.rows.map(row => parseInt(row.count))
      };
      break;

    default:
      chartData = { error: 'Type de graphique non reconnu' };
  }

  res.json({
    success: true,
    data: {
      chartType,
      chartData
    }
  });
}));

// 🚨 ALERTES DASHBOARD
router.get('/alerts', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let alerts = [];

  // Alertes communes
  const notificationsQuery = `
    SELECT COUNT(*) as count 
    FROM notifications 
    WHERE user_id = $1 AND read = false AND priority IN ('high', 'urgent')
  `;
  
  const notificationsResult = await db.query(notificationsQuery, [userId]);
  const unreadHighPriority = parseInt(notificationsResult.rows[0].count);

  if (unreadHighPriority > 0) {
    alerts.push({
      type: 'notifications',
      level: 'warning',
      message: `${unreadHighPriority} notification(s) importante(s) non lue(s)`,
      action: 'Voir notifications'
    });
  }

  // Alertes pour professionnels
  if (['geometre', 'agent_foncier'].includes(userRole)) {
    const pendingQuery = `
      SELECT COUNT(*) as count 
      FROM properties 
      WHERE status = 'pending_verification'
    `;
    
    const pendingResult = await db.query(pendingQuery);
    const pendingVerifications = parseInt(pendingResult.rows[0].count);

    if (pendingVerifications > 10) {
      alerts.push({
        type: 'workload',
        level: 'warning',
        message: `${pendingVerifications} propriétés en attente de vérification`,
        action: 'Voir propriétés'
      });
    }
  }

  // Alertes pour admin
  if (userRole === 'admin') {
    const systemAlertsQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE status = 'banned') as banned_users,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_transactions
      FROM users u
      FULL OUTER JOIN transactions t ON true
    `;

    const systemResult = await db.query(systemAlertsQuery);
    const bannedUsers = parseInt(systemResult.rows[0].banned_users || 0);
    const pendingTransactions = parseInt(systemResult.rows[0].pending_transactions || 0);

    if (bannedUsers > 0) {
      alerts.push({
        type: 'security',
        level: 'error',
        message: `${bannedUsers} utilisateur(s) banni(s)`,
        action: 'Gérer utilisateurs'
      });
    }

    if (pendingTransactions > 5) {
      alerts.push({
        type: 'transactions',
        level: 'info',
        message: `${pendingTransactions} transaction(s) en attente`,
        action: 'Voir transactions'
      });
    }
  }

  res.json({
    success: true,
    data: { alerts }
  });
}));

// 🔄 ACTUALISER CACHE DASHBOARD
router.post('/refresh', authenticateToken, asyncErrorHandler(async (req, res) => {
  // Cette route pourrait déclencher un rafraîchissement du cache
  // Pour l'instant, on retourne juste un succès
  
  logBusiness('dashboard_refreshed', { userId: req.user.id });

  res.json({
    success: true,
    message: 'Dashboard actualisé',
    timestamp: new Date().toISOString()
  });
}));

export default router;