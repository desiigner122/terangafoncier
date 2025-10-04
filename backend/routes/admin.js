// Routes admin pour le dashboard
import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Alias pour compatibilité
const authenticate = authenticateToken;

// ===============================
// REVENUE MANAGEMENT ENDPOINTS
// ===============================

// Dashboard revenus détaillé
router.get('/admin/revenue/detailed', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    
    // Simulation de données - remplacer par vraie DB plus tard
    const mockData = {
      totalRevenue: 850000,
      monthlyGrowth: 12.5,
      revenueByCategory: [
        { category: 'Ventes terrains', amount: 450000, percentage: 52.9 },
        { category: 'Commissions', amount: 230000, percentage: 27.1 },
        { category: 'Services premium', amount: 170000, percentage: 20.0 }
      ],
      revenueBySource: [
        { source: 'Particuliers', amount: 380000, count: 156 },
        { source: 'Promoteurs', amount: 290000, count: 23 },
        { source: 'Investisseurs', amount: 180000, count: 45 }
      ],
      recentTransactions: [
        {
          id: 1,
          type: 'Vente terrain',
          amount: 45000,
          buyer: 'Moussa Diallo',
          property: 'Terrain Almadies 250m²',
          date: new Date().toISOString(),
          status: 'completed'
        }
      ]
    };

    res.json({
      success: true,
      data: mockData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des données de revenus'
    });
  }
});

// Export des revenus
router.post('/admin/revenue/export', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { format, startDate, endDate, categories } = req.body;
    
    // Simulation d'export
    const exportData = {
      filename: `revenue_export_${Date.now()}.${format}`,
      downloadUrl: `/downloads/revenue_export_${Date.now()}.${format}`,
      recordCount: 1250,
      totalAmount: 850000
    };

    res.json({
      success: true,
      data: exportData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'export des revenus'
    });
  }
});

// ===============================
// USER MANAGEMENT ENDPOINTS
// ===============================

// Liste des utilisateurs avec filtres avancés
router.get('/admin/users/advanced', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role, 
      status, 
      sortBy = 'created_at',
      sortOrder = 'desc',
      search 
    } = req.query;

    // Simulation de données utilisateurs
    const mockUsers = [
      {
        id: 1,
        firstName: 'Admin',
        lastName: 'Teranga',
        email: 'admin@teranga.com',
        role: 'admin',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-15',
        propertiesCount: 0,
        totalSpent: 0
      },
      {
        id: 2,
        firstName: 'Fatou',
        lastName: 'Sarr',
        email: 'fatou.sarr@email.com',
        role: 'user',
        status: 'active',
        lastLogin: '2024-12-20',
        createdAt: '2024-06-10',
        propertiesCount: 3,
        totalSpent: 125000
      }
    ];

    res.json({
      success: true,
      data: {
        users: mockUsers,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(mockUsers.length / limit),
          count: mockUsers.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});

// Bannir/débannir utilisateur
router.put('/admin/users/:id/ban', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'ban' ou 'unban'

    // Simulation
    res.json({
      success: true,
      message: `Utilisateur ${action === 'ban' ? 'banni' : 'débanni'} avec succès`,
      data: {
        userId: id,
        action,
        reason,
        updatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la modification du statut utilisateur'
    });
  }
});

// ===============================
// PROPERTY MANAGEMENT ENDPOINTS
// ===============================

// Propriétés en attente de validation
router.get('/admin/properties/pending', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const mockPendingProperties = [
      {
        id: 1,
        title: 'Villa Almadies 4 chambres',
        owner: 'Amadou Ba',
        price: 95000000,
        location: 'Almadies, Dakar',
        submittedAt: '2024-12-28',
        status: 'pending_review',
        documents: ['titre_foncier.pdf', 'plan_cadastre.pdf']
      }
    ];

    res.json({
      success: true,
      data: mockPendingProperties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des propriétés en attente'
    });
  }
});

// Valider/rejeter propriété
router.put('/admin/properties/:id/review', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comments } = req.body; // action: 'approve' ou 'reject'

    res.json({
      success: true,
      message: `Propriété ${action === 'approve' ? 'approuvée' : 'rejetée'} avec succès`,
      data: {
        propertyId: id,
        action,
        comments,
        reviewedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la validation de la propriété'
    });
  }
});

// ===============================
// SUPPORT TICKETS ENDPOINTS
// ===============================

// Liste des tickets de support
router.get('/admin/support/tickets', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { status, priority, page = 1 } = req.query;

    const mockTickets = [
      {
        id: 1,
        subject: 'Problème de paiement',
        user: 'Mamadou Diop',
        email: 'mamadou.diop@email.com',
        status: 'open',
        priority: 'high',
        category: 'payment',
        createdAt: '2024-12-29',
        lastResponse: '2024-12-29',
        messages: 3
      }
    ];

    res.json({
      success: true,
      data: {
        tickets: mockTickets,
        stats: {
          total: 25,
          open: 8,
          inProgress: 12,
          resolved: 5
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des tickets'
    });
  }
});

// Répondre à un ticket
router.post('/admin/support/tickets/:id/reply', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { message, status } = req.body;

    res.json({
      success: true,
      message: 'Réponse envoyée avec succès',
      data: {
        ticketId: id,
        reply: message,
        status,
        repliedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi de la réponse'
    });
  }
});

// ===============================
// ANALYTICS ENDPOINTS
// ===============================

// Statistiques générales de la plateforme
router.get('/admin/analytics/overview', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const overview = {
      users: {
        total: 1247,
        active: 892,
        new: 45,
        growth: 8.2
      },
      properties: {
        total: 578,
        active: 456,
        pending: 23,
        sold: 99
      },
      transactions: {
        total: 156,
        volume: 850000000,
        pending: 12,
        completed: 144
      },
      revenue: {
        total: 850000,
        monthly: 125000,
        growth: 12.5,
        target: 1000000
      }
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Export en masse
router.post('/admin/export/bulk', authenticate, requireRole(['admin']), async (req, res) => {
  try {
    const { types, format, dateRange } = req.body;

    const exportJob = {
      id: `export_${Date.now()}`,
      status: 'processing',
      progress: 0,
      estimatedTime: '5 minutes',
      types,
      format
    };

    res.json({
      success: true,
      message: 'Export en cours de traitement',
      data: exportJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors du lancement de l\'export'
    });
  }
});

export default router;