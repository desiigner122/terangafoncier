import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { db } from '../database.js';

const router = express.Router();

// Liste des tickets support
router.get('/admin/support/tickets', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority } = req.query;

    // Simulation des tickets support
    const mockTickets = [
      {
        id: 201,
        subject: 'Problème de connexion à mon compte',
        description: 'Je n\'arrive plus à me connecter à mon compte depuis hier. J\'ai essayé de réinitialiser mon mot de passe mais je ne reçois pas l\'email.',
        category: 'Technique',
        status: 'open',
        priority: 'high',
        user_id: 15,
        user_first_name: 'Mamadou',
        user_last_name: 'Diallo',
        user_email: 'mamadou.diallo@gmail.com',
        assigned_to: null,
        assigned_admin_name: null,
        created_at: '2024-01-15T09:30:00Z',
        updated_at: '2024-01-15T09:30:00Z',
        last_response_at: null
      },
      {
        id: 202,
        subject: 'Ma propriété n\'apparaît pas dans les résultats',
        description: 'J\'ai publié ma propriété il y a 3 jours mais elle n\'apparaît toujours pas dans les résultats de recherche. Pouvez-vous vérifier ?',
        category: 'Propriété',
        status: 'in_progress',
        priority: 'medium',
        user_id: 22,
        user_first_name: 'Aissatou',
        user_last_name: 'Ba',
        user_email: 'aissatou.ba@yahoo.fr',
        assigned_to: 1,
        assigned_admin_name: 'Admin Teranga',
        created_at: '2024-01-14T16:20:00Z',
        updated_at: '2024-01-15T10:15:00Z',
        last_response_at: '2024-01-15T10:15:00Z'
      },
      {
        id: 203,
        subject: 'Erreur de paiement lors de l\'upgrade Premium',
        description: 'J\'essaie de passer mon compte en Premium mais j\'obtiens une erreur lors du paiement avec Orange Money.',
        category: 'Paiement',
        status: 'resolved',
        priority: 'high',
        user_id: 18,
        user_first_name: 'Jean-Pierre',
        user_last_name: 'Martin',
        user_email: 'jp.martin@hotmail.com',
        assigned_to: 1,
        assigned_admin_name: 'Admin Teranga',
        created_at: '2024-01-13T11:45:00Z',
        updated_at: '2024-01-14T09:30:00Z',
        last_response_at: '2024-01-14T09:30:00Z'
      },
      {
        id: 204,
        subject: 'Demande de modification d\'informations',
        description: 'Je souhaiterais modifier les informations de contact de mon agence. Comment puis-je procéder ?',
        category: 'Compte',
        status: 'open',
        priority: 'low',
        user_id: 25,
        user_first_name: 'Fatou',
        user_last_name: 'Sow',
        user_email: 'fatou.sow@agenceimmobiliere.com',
        assigned_to: null,
        assigned_admin_name: null,
        created_at: '2024-01-12T14:20:00Z',
        updated_at: '2024-01-12T14:20:00Z',
        last_response_at: null
      }
    ];

    // Filtrer selon les critères
    let filteredTickets = mockTickets;
    
    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }

    if (priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
    }

    // Trier par priorité puis par date
    filteredTickets.sort((a, b) => {
      const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

    console.log('🎫 Tickets support consultés:', { 
      count: paginatedTickets.length, 
      filters: { status, priority },
      user: req.user.email 
    });

    res.json({
      success: true,
      data: paginatedTickets,
      meta: {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredTickets.length,
          pages: Math.ceil(filteredTickets.length / limit)
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
router.post('/admin/support/tickets/:id/respond', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { message, status = 'in_progress', internal_note = '' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: { code: 'MESSAGE_REQUIRED', message: 'Message de réponse requis' }
      });
    }

    console.log('💬 Réponse ticket support:', {
      ticketId: id,
      status,
      messageLength: message.length,
      hasInternalNote: !!internal_note,
      admin: req.user.email
    });

    res.json({
      success: true,
      data: { 
        ticketId: id, 
        status, 
        message: 'Réponse ajoutée avec succès' 
      }
    });

  } catch (error) {
    console.error('Erreur réponse ticket:', error);
    res.status(500).json({
      success: false,
      error: { code: 'RESPONSE_ERROR', message: 'Erreur lors de la réponse' }
    });
  }
});

export default router;