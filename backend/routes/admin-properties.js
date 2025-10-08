import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import { db } from '../database.js';

const router = express.Router();

// Propriétés en attente d'approbation
router.get('/admin/properties/pending-approval', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Charger les vraies propriétés depuis Supabase avec status pending_verification
    const { data: properties, error, count } = await db
      .from('properties')
      .select(`
        id,
        title,
        description,
        property_type,
        status,
        verification_status,
        price,
        currency,
        surface,
        location,
        city,
        region,
        address,
        images,
        features,
        documents,
        ai_analysis,
        market_value,
        created_at,
        owner_id,
        profiles!properties_owner_id_fkey (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `, { count: 'exact' })
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Erreur Supabase:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erreur lors du chargement des propriétés' }
      });
    }

    // Formater les données pour le frontend
    const formattedProperties = properties.map(prop => ({
      id: prop.id,
      title: prop.title,
      location: prop.location || `${prop.city}, ${prop.region}`,
      price: prop.price,
      surface: prop.surface,
      type: prop.property_type,
      status: prop.verification_status,
      description: prop.description,
      owner_first_name: prop.profiles?.first_name || 'N/A',
      owner_last_name: prop.profiles?.last_name || 'N/A',
      owner_email: prop.profiles?.email || 'N/A',
      owner_phone: prop.profiles?.phone || 'N/A',
      created_at: prop.created_at,
      user_id: prop.owner_id,
      images: prop.images || [],
      features: prop.features || {},
      documents: prop.documents || {},
      ai_analysis: prop.ai_analysis || {},
      market_value: prop.market_value
    }));

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: formattedProperties,
      meta: {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: totalPages
        }
      }
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Erreur serveur' }
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

    // Déterminer le nouveau statut
    const newVerificationStatus = action === 'approve' ? 'verified' : 'rejected';
    const newStatus = action === 'approve' ? 'active' : 'suspended';
    
    // Mettre à jour dans Supabase
    const { data, error } = await db
      .from('properties')
      .update({
        verification_status: newVerificationStatus,
        status: newStatus,
        verified_by: req.user.id,
        verified_at: new Date().toISOString(),
        verification_notes: comments
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase update:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Erreur lors de la mise à jour' }
      });
    }

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
        newStatus: newVerificationStatus, 
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