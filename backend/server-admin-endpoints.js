// Endpoints backend manquants pour Dashboard Admin
// À ajouter au serveur Express

const express = require('express');
const router = express.Router();

// ===============================
// REVENUE MANAGEMENT ENDPOINTS
// ===============================

// Dashboard revenus détaillé
router.get('/admin/revenue/detailed', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    
    // Calcul des revenus par catégorie
    const revenueQuery = `
      SELECT 
        category,
        subcategory,
        SUM(amount) as total_amount,
        COUNT(*) as transaction_count,
        AVG(amount) as avg_amount,
        DATE(created_at) as date
      FROM revenue_analytics 
      WHERE created_at >= ? AND created_at <= ?
      GROUP BY category, subcategory, DATE(created_at)
      ORDER BY created_at DESC
    `;

    const startOfPeriod = startDate || (period === 'month' ? 
      new Date(new Date().getFullYear(), new Date().getMonth(), 1) :
      new Date(new Date().getFullYear(), 0, 1)
    );
    const endOfPeriod = endDate || new Date();

    const revenueData = db.prepare(revenueQuery).all(
      startOfPeriod.toISOString(),
      endOfPeriod.toISOString()
    );

    // Calcul des KPIs
    const totalRevenue = revenueData.reduce((sum, row) => sum + row.total_amount, 0);
    const totalTransactions = revenueData.reduce((sum, row) => sum + row.transaction_count, 0);
    
    // Revenus par catégorie
    const revenueByCategory = {};
    revenueData.forEach(row => {
      if (!revenueByCategory[row.category]) {
        revenueByCategory[row.category] = 0;
      }
      revenueByCategory[row.category] += row.total_amount;
    });

    // Évolution quotidienne
    const dailyRevenue = {};
    revenueData.forEach(row => {
      if (!dailyRevenue[row.date]) {
        dailyRevenue[row.date] = 0;
      }
      dailyRevenue[row.date] += row.total_amount;
    });

    logAction(req.user.id, 'VIEW_REVENUE_DASHBOARD', { period });

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalTransactions,
          averageTransaction: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
          period: period,
          dateRange: { startDate: startOfPeriod, endDate: endOfPeriod }
        },
        revenueByCategory,
        dailyRevenue: Object.keys(dailyRevenue).map(date => ({
          date,
          amount: dailyRevenue[date]
        })),
        transactions: revenueData.slice(0, 100) // Limiter pour la performance
      }
    });

  } catch (error) {
    console.error('Erreur récupération revenus détaillés:', error);
    res.status(500).json({
      success: false,
      error: { code: 'REVENUE_FETCH_ERROR', message: 'Impossible de récupérer les revenus' }
    });
  }
});

// ===============================
// PROPERTY APPROVAL ENDPOINTS
// ===============================

// Propriétés en attente d'approbation
router.get('/admin/properties/pending-approval', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        p.*,
        u.first_name as owner_first_name,
        u.last_name as owner_last_name,
        u.email as owner_email,
        u.phone as owner_phone
      FROM properties p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.status = 'pending_approval'
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM properties
      WHERE status = 'pending_approval'
    `;

    const properties = db.prepare(query).all(limit, offset);
    const { total } = db.prepare(countQuery).get();

    logAction(req.user.id, 'VIEW_PENDING_PROPERTIES', { count: properties.length });

    res.json({
      success: true,
      data: properties,
      meta: {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération propriétés en attente:', error);
    res.status(500).json({
      success: false,
      error: { code: 'PROPERTIES_FETCH_ERROR', message: 'Impossible de récupérer les propriétés' }
    });
  }
});

// Approuver/rejeter une propriété
router.post('/admin/properties/approve/:id', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comments = '' } = req.body; // action: 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ACTION', message: 'Action doit être approve ou reject' }
      });
    }

    const newStatus = action === 'approve' ? 'active' : 'rejected';
    
    // Mettre à jour la propriété
    const updateQuery = `
      UPDATE properties 
      SET status = ?, 
          approved_by = ?, 
          approval_date = ?, 
          approval_comments = ?,
          updated_at = ?
      WHERE id = ?
    `;

    const result = db.prepare(updateQuery).run(
      newStatus,
      req.user.id,
      new Date().toISOString(),
      comments,
      new Date().toISOString(),
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROPERTY_NOT_FOUND', message: 'Propriété non trouvée' }
      });
    }

    // Récupérer les détails de la propriété pour notification
    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
    
    // Créer une notification pour le propriétaire
    if (property && property.user_id) {
      const notificationQuery = `
        INSERT INTO notifications (user_id, title, message, type, data, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      const title = action === 'approve' ? 'Propriété approuvée' : 'Propriété rejetée';
      const message = action === 'approve' ? 
        `Votre propriété "${property.title}" a été approuvée et est maintenant visible` :
        `Votre propriété "${property.title}" a été rejetée. ${comments}`;

      db.prepare(notificationQuery).run(
        property.user_id,
        title,
        message,
        'property_status',
        JSON.stringify({ propertyId: id, action, comments }),
        new Date().toISOString()
      );
    }

    logAction(req.user.id, 'PROPERTY_APPROVAL', { propertyId: id, action, comments });

    res.json({
      success: true,
      data: { 
        propertyId: id, 
        newStatus, 
        action,
        message: `Propriété ${action === 'approve' ? 'approuvée' : 'rejetée'} avec succès`
      }
    });

  } catch (error) {
    console.error('Erreur approbation propriété:', error);
    res.status(500).json({
      success: false,
      error: { code: 'APPROVAL_ERROR', message: 'Erreur lors de l\'approbation' }
    });
  }
});

// ===============================
// SUPPORT TICKETS ENDPOINTS
// ===============================

// Liste des tickets support
router.get('/admin/support/tickets', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (status) {
      whereClause += ' AND st.status = ?';
      params.push(status);
    }

    if (priority) {
      whereClause += ' AND st.priority = ?';
      params.push(priority);
    }

    const query = `
      SELECT 
        st.*,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.email as user_email,
        admin.first_name as assigned_admin_name
      FROM support_tickets st
      LEFT JOIN users u ON st.user_id = u.id
      LEFT JOIN users admin ON st.assigned_to = admin.id
      ${whereClause}
      ORDER BY 
        CASE st.priority
          WHEN 'high' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 3
        END,
        st.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    const tickets = db.prepare(query).all(...params);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM support_tickets st
      ${whereClause}
    `;

    const { total } = db.prepare(countQuery).get(...params.slice(0, -2));

    logAction(req.user.id, 'VIEW_SUPPORT_TICKETS', { count: tickets.length });

    res.json({
      success: true,
      data: tickets,
      meta: {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération tickets:', error);
    res.status(500).json({
      success: false,
      error: { code: 'TICKETS_FETCH_ERROR', message: 'Impossible de récupérer les tickets' }
    });
  }
});

// Répondre à un ticket
router.post('/admin/support/tickets/:id/respond', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { message, status = 'in_progress', internal_note = '' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: { code: 'MESSAGE_REQUIRED', message: 'Message de réponse requis' }
      });
    }

    // Mettre à jour le ticket
    const updateTicketQuery = `
      UPDATE support_tickets 
      SET status = ?, assigned_to = ?, updated_at = ?, last_response_at = ?
      WHERE id = ?
    `;

    const ticketResult = db.prepare(updateTicketQuery).run(
      status,
      req.user.id,
      new Date().toISOString(),
      new Date().toISOString(),
      id
    );

    if (ticketResult.changes === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'TICKET_NOT_FOUND', message: 'Ticket non trouvé' }
      });
    }

    // Ajouter la réponse
    const responseQuery = `
      INSERT INTO support_responses (ticket_id, admin_id, message, internal_note, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.prepare(responseQuery).run(
      id,
      req.user.id,
      message,
      internal_note,
      new Date().toISOString()
    );

    // Récupérer le ticket pour notification
    const ticket = db.prepare('SELECT * FROM support_tickets WHERE id = ?').get(id);
    
    // Notifier l'utilisateur
    if (ticket && ticket.user_id) {
      const notificationQuery = `
        INSERT INTO notifications (user_id, title, message, type, data, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.prepare(notificationQuery).run(
        ticket.user_id,
        'Réponse à votre ticket support',
        `Nous avons répondu à votre ticket #${id}. Consultez votre espace client.`,
        'support_response',
        JSON.stringify({ ticketId: id }),
        new Date().toISOString()
      );
    }

    logAction(req.user.id, 'RESPOND_SUPPORT_TICKET', { ticketId: id, status });

    res.json({
      success: true,
      data: { ticketId: id, status, message: 'Réponse ajoutée avec succès' }
    });

  } catch (error) {
    console.error('Erreur réponse ticket:', error);
    res.status(500).json({
      success: false,
      error: { code: 'RESPONSE_ERROR', message: 'Erreur lors de la réponse' }
    });
  }
});

module.exports = router;