import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { asyncErrorHandler } from '../middleware/errorHandler.js';
import { logBusiness } from '../utils/logger.js';
import db from '../config/database.js';

const router = express.Router();

// 💳 INITIER PAIEMENT
router.post('/initiate', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { amount, propertyId, type, description } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Montant invalide'
    });
  }

  // Créer un enregistrement de paiement
  const paymentQuery = `
    INSERT INTO payments (
      user_id, property_id, amount, type, description, 
      status, payment_method, created_at
    ) VALUES ($1, $2, $3, $4, $5, 'pending', 'mobile_money', NOW())
    RETURNING *
  `;

  const paymentResult = await db.query(paymentQuery, [
    userId, propertyId, amount, type, description
  ]);

  const payment = paymentResult.rows[0];

  // Générer référence de paiement
  const reference = `TER${Date.now()}${userId}`;

  // Simulation d'intégration avec service de paiement mobile (Orange Money, etc.)
  const paymentData = {
    reference,
    amount: parseFloat(amount),
    currency: 'XOF',
    description: description || `Paiement Teranga Foncier - ${type}`,
    returnUrl: `${process.env.FRONTEND_URL}/payments/return`,
    cancelUrl: `${process.env.FRONTEND_URL}/payments/cancel`,
    webhookUrl: `${process.env.BACKEND_URL}/api/payments/webhook`
  };

  // Mettre à jour avec la référence
  await db.query(
    'UPDATE payments SET reference = $1, payment_data = $2 WHERE id = $3',
    [reference, JSON.stringify(paymentData), payment.id]
  );

  logBusiness('payment_initiated', { 
    userId, 
    paymentId: payment.id, 
    amount, 
    type, 
    reference 
  });

  res.json({
    success: true,
    data: {
      paymentId: payment.id,
      reference,
      amount: parseFloat(amount),
      redirectUrl: `/payments/mobile-money?ref=${reference}`,
      ...paymentData
    }
  });
}));

// 📱 PAIEMENT MOBILE MONEY
router.post('/mobile-money', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { reference, phoneNumber, provider } = req.body;
  const userId = req.user.id;

  if (!reference || !phoneNumber || !provider) {
    return res.status(400).json({
      success: false,
      message: 'Paramètres manquants'
    });
  }

  // Vérifier que le paiement existe
  const paymentQuery = 'SELECT * FROM payments WHERE reference = $1 AND user_id = $2';
  const paymentResult = await db.query(paymentQuery, [reference, userId]);

  if (paymentResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Paiement non trouvé'
    });
  }

  const payment = paymentResult.rows[0];

  // Simulation d'appel API Orange Money / Wave / Free Money
  const mobileMoneyData = {
    reference,
    phoneNumber,
    provider, // 'orange', 'wave', 'free'
    amount: payment.amount,
    currency: 'XOF',
    timestamp: new Date().toISOString()
  };

  // Simulation de réponse (en production, ceci serait un vrai appel API)
  const simulatedResponse = {
    success: Math.random() > 0.1, // 90% de succès pour la simulation
    transactionId: `MM${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
    status: Math.random() > 0.1 ? 'pending' : 'failed',
    message: Math.random() > 0.1 ? 'Paiement en cours de traitement' : 'Échec du paiement'
  };

  // Mettre à jour le paiement
  await db.query(`
    UPDATE payments 
    SET 
      payment_method = 'mobile_money',
      provider = $1,
      phone_number = $2,
      external_transaction_id = $3,
      status = $4,
      updated_at = NOW()
    WHERE id = $5
  `, [
    provider,
    phoneNumber,
    simulatedResponse.transactionId,
    simulatedResponse.status,
    payment.id
  ]);

  logBusiness('mobile_money_payment', { 
    userId, 
    paymentId: payment.id, 
    provider, 
    status: simulatedResponse.status 
  });

  res.json({
    success: simulatedResponse.success,
    data: {
      paymentId: payment.id,
      transactionId: simulatedResponse.transactionId,
      status: simulatedResponse.status,
      message: simulatedResponse.message,
      ...mobileMoneyData
    }
  });
}));

// 🔔 WEBHOOK PAIEMENTS
router.post('/webhook', asyncErrorHandler(async (req, res) => {
  const { reference, status, transactionId, amount } = req.body;

  if (!reference || !status) {
    return res.status(400).json({
      success: false,
      message: 'Paramètres webhook manquants'
    });
  }

  // Trouver le paiement
  const paymentQuery = 'SELECT * FROM payments WHERE reference = $1';
  const paymentResult = await db.query(paymentQuery, [reference]);

  if (paymentResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Paiement non trouvé'
    });
  }

  const payment = paymentResult.rows[0];

  // Mettre à jour le statut
  await db.query(`
    UPDATE payments 
    SET 
      status = $1,
      external_transaction_id = $2,
      webhook_data = $3,
      completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END,
      updated_at = NOW()
    WHERE id = $4
  `, [
    status,
    transactionId,
    JSON.stringify(req.body),
    payment.id
  ]);

  // Si paiement confirmé, traiter les actions
  if (status === 'completed') {
    // Créer notification
    await db.query(`
      INSERT INTO notifications (
        user_id, title, message, type, priority, data
      ) VALUES ($1, $2, $3, 'payment', 'high', $4)
    `, [
      payment.user_id,
      'Paiement confirmé',
      `Votre paiement de ${payment.amount} XOF a été confirmé`,
      JSON.stringify({ paymentId: payment.id, amount: payment.amount })
    ]);

    // Actions selon le type de paiement
    if (payment.type === 'property_verification') {
      await db.query(
        'UPDATE properties SET verification_paid = true WHERE id = $1',
        [payment.property_id]
      );
    }

    if (payment.type === 'premium_subscription') {
      await db.query(`
        UPDATE users 
        SET 
          subscription_type = 'premium',
          subscription_expires_at = NOW() + INTERVAL '1 year'
        WHERE id = $1
      `, [payment.user_id]);
    }
  }

  logBusiness('payment_webhook', { 
    paymentId: payment.id, 
    status, 
    transactionId 
  });

  res.json({ success: true });
}));

// 📊 HISTORIQUE PAIEMENTS
router.get('/history', authenticateToken, asyncErrorHandler(async (req, res) => {
  const userId = req.user.id;
  const { status, type, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE user_id = $1';
  const queryParams = [userId];
  let paramCount = 1;

  if (status) {
    whereClause += ` AND status = $${++paramCount}`;
    queryParams.push(status);
  }

  if (type) {
    whereClause += ` AND type = $${++paramCount}`;
    queryParams.push(type);
  }

  const paymentsQuery = `
    SELECT 
      p.*,
      pr.title as property_title
    FROM payments p
    LEFT JOIN properties pr ON p.property_id = pr.id
    ${whereClause}
    ORDER BY p.created_at DESC
    LIMIT $${++paramCount} OFFSET $${++paramCount}
  `;

  queryParams.push(limit, offset);

  const countQuery = `
    SELECT COUNT(*) as total 
    FROM payments p 
    ${whereClause}
  `;

  const [paymentsResult, countResult] = await Promise.all([
    db.query(paymentsQuery, queryParams),
    db.query(countQuery, queryParams.slice(0, -2)) // Remove limit and offset
  ]);

  const payments = paymentsResult.rows.map(payment => ({
    id: payment.id,
    reference: payment.reference,
    amount: parseFloat(payment.amount),
    type: payment.type,
    description: payment.description,
    status: payment.status,
    paymentMethod: payment.payment_method,
    provider: payment.provider,
    propertyTitle: payment.property_title,
    createdAt: payment.created_at,
    completedAt: payment.completed_at
  }));

  const total = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: {
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
}));

// 💰 DÉTAIL PAIEMENT
router.get('/:paymentId', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { paymentId } = req.params;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  let whereClause = 'WHERE p.id = $1';
  const queryParams = [paymentId];

  if (!isAdmin) {
    whereClause += ' AND p.user_id = $2';
    queryParams.push(userId);
  }

  const paymentQuery = `
    SELECT 
      p.*,
      u.full_name as user_name,
      u.email as user_email,
      pr.title as property_title,
      pr.location as property_location
    FROM payments p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN properties pr ON p.property_id = pr.id
    ${whereClause}
  `;

  const paymentResult = await db.query(paymentQuery, queryParams);

  if (paymentResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Paiement non trouvé'
    });
  }

  const payment = paymentResult.rows[0];

  const paymentDetail = {
    id: payment.id,
    reference: payment.reference,
    amount: parseFloat(payment.amount),
    type: payment.type,
    description: payment.description,
    status: payment.status,
    paymentMethod: payment.payment_method,
    provider: payment.provider,
    phoneNumber: payment.phone_number,
    externalTransactionId: payment.external_transaction_id,
    paymentData: payment.payment_data ? JSON.parse(payment.payment_data) : null,
    webhookData: payment.webhook_data ? JSON.parse(payment.webhook_data) : null,
    user: {
      name: payment.user_name,
      email: payment.user_email
    },
    property: payment.property_title ? {
      title: payment.property_title,
      location: payment.property_location
    } : null,
    createdAt: payment.created_at,
    updatedAt: payment.updated_at,
    completedAt: payment.completed_at
  };

  res.json({
    success: true,
    data: { payment: paymentDetail }
  });
}));

// 🔄 RETRY PAIEMENT
router.post('/:paymentId/retry', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { paymentId } = req.params;
  const userId = req.user.id;

  const paymentQuery = `
    SELECT * FROM payments 
    WHERE id = $1 AND user_id = $2 AND status IN ('failed', 'cancelled')
  `;

  const paymentResult = await db.query(paymentQuery, [paymentId, userId]);

  if (paymentResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Paiement non trouvé ou non éligible au retry'
    });
  }

  const payment = paymentResult.rows[0];

  // Nouvelle référence pour le retry
  const newReference = `TER${Date.now()}${userId}R`;

  await db.query(`
    UPDATE payments 
    SET 
      reference = $1,
      status = 'pending',
      external_transaction_id = NULL,
      webhook_data = NULL,
      updated_at = NOW()
    WHERE id = $2
  `, [newReference, paymentId]);

  logBusiness('payment_retry', { 
    userId, 
    paymentId, 
    oldReference: payment.reference, 
    newReference 
  });

  res.json({
    success: true,
    data: {
      paymentId,
      newReference,
      amount: parseFloat(payment.amount),
      redirectUrl: `/payments/mobile-money?ref=${newReference}`
    }
  });
}));

// 📈 STATISTIQUES PAIEMENTS (Admin)
router.get('/admin/stats', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const { period = '30d' } = req.query;

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
    default:
      intervalClause = '30 days';
  }

  const statsQuery = `
    SELECT 
      COUNT(*) as total_payments,
      COUNT(*) FILTER (WHERE status = 'completed') as successful_payments,
      COUNT(*) FILTER (WHERE status = 'failed') as failed_payments,
      COUNT(*) FILTER (WHERE status = 'pending') as pending_payments,
      SUM(amount) FILTER (WHERE status = 'completed') as total_revenue,
      AVG(amount) FILTER (WHERE status = 'completed') as avg_payment_amount,
      COUNT(DISTINCT user_id) as unique_payers
    FROM payments 
    WHERE created_at > NOW() - INTERVAL '${intervalClause}'
  `;

  const byMethodQuery = `
    SELECT 
      payment_method,
      COUNT(*) as count,
      SUM(amount) FILTER (WHERE status = 'completed') as revenue
    FROM payments 
    WHERE created_at > NOW() - INTERVAL '${intervalClause}'
    GROUP BY payment_method
  `;

  const byTypeQuery = `
    SELECT 
      type,
      COUNT(*) as count,
      SUM(amount) FILTER (WHERE status = 'completed') as revenue
    FROM payments 
    WHERE created_at > NOW() - INTERVAL '${intervalClause}'
    GROUP BY type
  `;

  const [statsResult, methodResult, typeResult] = await Promise.all([
    db.query(statsQuery),
    db.query(byMethodQuery),
    db.query(byTypeQuery)
  ]);

  const stats = statsResult.rows[0];
  
  res.json({
    success: true,
    data: {
      period,
      overview: {
        totalPayments: parseInt(stats.total_payments),
        successfulPayments: parseInt(stats.successful_payments),
        failedPayments: parseInt(stats.failed_payments),
        pendingPayments: parseInt(stats.pending_payments),
        totalRevenue: parseFloat(stats.total_revenue || 0),
        avgPaymentAmount: parseFloat(stats.avg_payment_amount || 0),
        uniquePayers: parseInt(stats.unique_payers),
        successRate: stats.total_payments > 0 ? 
          (parseInt(stats.successful_payments) / parseInt(stats.total_payments) * 100).toFixed(2) : 0
      },
      byMethod: methodResult.rows.map(row => ({
        method: row.payment_method,
        count: parseInt(row.count),
        revenue: parseFloat(row.revenue || 0)
      })),
      byType: typeResult.rows.map(row => ({
        type: row.type,
        count: parseInt(row.count),
        revenue: parseFloat(row.revenue || 0)
      }))
    }
  });
}));

export default router;