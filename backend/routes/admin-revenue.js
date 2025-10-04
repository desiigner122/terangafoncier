import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { db } from '../database.js';

const router = express.Router();

// Dashboard revenus détaillé
router.get('/admin/revenue/detailed', authenticateToken, requireRole(['admin']), async (req, res) => { 
  try {
    const { period = 'month', startDate, endDate } = req.query;
    
    // Simulation des données de revenus
    const mockRevenueData = {
      summary: {
        totalRevenue: 2450000,
        totalTransactions: 156,
        averageTransaction: 15705,
        period: period,
        dateRange: { 
          startDate: startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
          endDate: endDate || new Date().toISOString()
        }
      },
      revenueByCategory: {
        'Commission Vente': 1200000,
        'Frais Listing': 650000,
        'Abonnements Premium': 380000,
        'Services Blockchain': 220000
      },
      dailyRevenue: [
        { date: '2024-01-01', amount: 125000 },
        { date: '2024-01-02', amount: 150000 },
        { date: '2024-01-03', amount: 180000 },
        { date: '2024-01-04', amount: 195000 },
        { date: '2024-01-05', amount: 220000 }
      ],
      transactions: [
        {
          date: '2024-01-05',
          category: 'Commission Vente',
          subcategory: 'Vente Résidentielle',
          total_amount: 45000,
          transaction_count: 3
        },
        {
          date: '2024-01-04',
          category: 'Frais Listing',  
          subcategory: 'Propriété Premium',
          total_amount: 25000,
          transaction_count: 5
        },
        {
          date: '2024-01-04',
          category: 'Abonnements Premium',
          subcategory: 'Agence Pro',
          total_amount: 15000,
          transaction_count: 2
        }
      ]
    };

    console.log('📊 Dashboard revenus consulté:', { period, user: req.user.email });

    res.json({
      success: true,
      data: mockRevenueData
    });

  } catch (error) {
    console.error('Erreur récupération revenus détaillés:', error);
    res.status(500).json({
      success: false,
      error: { code: 'REVENUE_FETCH_ERROR', message: 'Impossible de récupérer les revenus' }
    });
  }
});

export default router;