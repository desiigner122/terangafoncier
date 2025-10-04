import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { db } from '../database.js';

const router = express.Router();

// Propriétés en attente d'approbation
router.get('/admin/properties/pending-approval', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    // Simulation des propriétés en attente
    const mockProperties = [
      {
        id: 101,
        title: 'Villa moderne avec piscine - Almadies',
        location: 'Almadies, Dakar',
        price: 250000000,
        surface: 350,
        type: 'Villa',
        status: 'pending_approval',
        description: 'Magnifique villa moderne avec vue sur mer, 4 chambres, piscine et jardin tropical.',
        owner_first_name: 'Mamadou',
        owner_last_name: 'Diallo',
        owner_email: 'mamadou.diallo@gmail.com',
        owner_phone: '+221 77 123 4567',
        created_at: '2024-01-10T10:30:00Z',
        user_id: 15
      },
      {
        id: 102,
        title: 'Appartement F4 - Plateau',
        location: 'Plateau, Dakar',
        price: 120000000,
        surface: 120,
        type: 'Appartement',
        status: 'pending_approval',
        description: 'Appartement F4 au cœur du plateau, proche des commodités, 3ème étage avec ascenseur.',
        owner_first_name: 'Aissatou',
        owner_last_name: 'Ba',
        owner_email: 'aissatou.ba@yahoo.fr',
        owner_phone: '+221 76 987 6543',
        created_at: '2024-01-12T14:15:00Z',
        user_id: 22
      },
      {
        id: 103,
        title: 'Terrain constructible - Saly',
        location: 'Saly, Mbour',
        price: 45000000,
        surface: 800,
        type: 'Terrain',
        status: 'pending_approval',
        description: 'Terrain de 800m² proche de la plage, idéal pour construction de résidence secondaire.',
        owner_first_name: 'Jean-Pierre',
        owner_last_name: 'Martin',
        owner_email: 'jp.martin@hotmail.com',
        owner_phone: '+221 78 555 4444',
        created_at: '2024-01-11T16:45:00Z',
        user_id: 18
      }
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedProperties = mockProperties.slice(startIndex, endIndex);

    console.log('🏠 Propriétés en attente consultées:', { count: paginatedProperties.length, user: req.user.email });

    res.json({
      success: true,
      data: paginatedProperties,
      meta: {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: mockProperties.length,
          pages: Math.ceil(mockProperties.length / limit)
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
router.post('/admin/properties/approve/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comments = '' } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ACTION', message: 'Action doit être approve ou reject' }
      });
    }

    // Simulation de la mise à jour
    const newStatus = action === 'approve' ? 'active' : 'rejected';
    
    console.log('✅ Propriété traitée:', { 
      propertyId: id, 
      action, 
      newStatus, 
      comments,
      admin: req.user.email 
    });

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

export default router;