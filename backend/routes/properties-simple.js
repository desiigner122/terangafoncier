import express from 'express';
import { getDatabase } from '../config/database.js';

const router = express.Router();

// Middleware simple d'authentification
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token requis' });
  }
  
  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'teranga-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

// 🏠 LISTER TOUTES LES PROPRIÉTÉS (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, prix_min, prix_max, localisation } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM properties WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    // Filtres
    if (type) {
      query += ` AND type_propriete = ?`;
      params.push(type);
    }
    
    if (prix_min) {
      query += ` AND prix >= ?`;
      params.push(prix_min);
    }
    
    if (prix_max) {
      query += ` AND prix <= ?`;
      params.push(prix_max);
    }
    
    if (localisation) {
      query += ` AND localisation LIKE ?`;
      params.push(`%${localisation}%`);
    }

    query += ` ORDER BY date_creation DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const db = await getDatabase();
    const properties = await db.all(query, params);
    
    // Compter total pour pagination
    let countQuery = 'SELECT COUNT(*) as total FROM properties WHERE 1=1';
    let countParams = [];
    
    if (type) {
      countQuery += ` AND type_propriete = ?`;
      countParams.push(type);
    }
    if (prix_min) {
      countQuery += ` AND prix >= ?`;
      countParams.push(prix_min);
    }
    if (prix_max) {
      countQuery += ` AND prix <= ?`;
      countParams.push(prix_max);
    }
    if (localisation) {
      countQuery += ` AND localisation LIKE ?`;
      countParams.push(`%${localisation}%`);
    }

    const countResult = await db.get(countQuery, countParams);
    const total = countResult.total;

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur liste propriétés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// 🏠 CRÉER UNE PROPRIÉTÉ
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      titre,
      description,
      prix,
      type_propriete,
      surface,
      localisation,
      coordonnees_gps
    } = req.body;

    if (!titre || !prix || !type_propriete || !localisation) {
      return res.status(400).json({
        success: false,
        message: 'Titre, prix, type et localisation sont requis'
      });
    }

    const db = await getDatabase();
    
    const result = await db.run(`
      INSERT INTO properties (
        titre, description, prix, type_propriete, surface, 
        localisation, coordonnees_gps, proprietaire_id, date_creation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [
      titre, description, prix, type_propriete, surface,
      localisation, coordonnees_gps, req.user.id
    ]);

    const propertyId = result.lastID;

    // Récupérer la propriété créée
    const property = await db.get('SELECT * FROM properties WHERE id = ?', [propertyId]);

    res.status(201).json({
      success: true,
      message: 'Propriété créée avec succès',
      data: { property }
    });

  } catch (error) {
    console.error('Erreur création propriété:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création'
    });
  }
});

// 🏠 OBTENIR UNE PROPRIÉTÉ SPÉCIFIQUE
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    
    const property = await db.get(`
      SELECT p.*, u.nom as proprietaire_nom, u.email as proprietaire_email
      FROM properties p
      LEFT JOIN users u ON p.proprietaire_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriété non trouvée'
      });
    }

    res.json({
      success: true,
      data: { property }
    });

  } catch (error) {
    console.error('Erreur récupération propriété:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// 🏠 METTRE À JOUR UNE PROPRIÉTÉ
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    
    // Vérifier propriétaire
    const property = await db.get('SELECT proprietaire_id FROM properties WHERE id = ?', [id]);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriété non trouvée'
      });
    }

    if (property.proprietaire_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette propriété'
      });
    }

    const {
      titre,
      description,
      prix,
      type_propriete,
      surface,
      localisation,
      coordonnees_gps,
      statut
    } = req.body;

    await db.run(`
      UPDATE properties SET
        titre = COALESCE(?, titre),
        description = COALESCE(?, description),
        prix = COALESCE(?, prix),
        type_propriete = COALESCE(?, type_propriete),
        surface = COALESCE(?, surface),
        localisation = COALESCE(?, localisation),
        coordonnees_gps = COALESCE(?, coordonnees_gps),
        statut = COALESCE(?, statut)
      WHERE id = ?
    `, [titre, description, prix, type_propriete, surface, localisation, coordonnees_gps, statut, id]);

    // Récupérer propriété mise à jour
    const updatedProperty = await db.get('SELECT * FROM properties WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Propriété mise à jour',
      data: { property: updatedProperty }
    });

  } catch (error) {
    console.error('Erreur mise à jour propriété:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
});

// 🏠 SUPPRIMER UNE PROPRIÉTÉ
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    
    // Vérifier propriétaire
    const property = await db.get('SELECT proprietaire_id FROM properties WHERE id = ?', [id]);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriété non trouvée'
      });
    }

    if (property.proprietaire_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer cette propriété'
      });
    }

    await db.run('DELETE FROM properties WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Propriété supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression propriété:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
});

// 🔍 RECHERCHE AVANCÉE
router.get('/search/advanced', async (req, res) => {
  try {
    const {
      q, // terme de recherche
      type,
      prix_min,
      prix_max,
      surface_min,
      surface_max,
      localisation,
      sort = 'date_creation',
      order = 'DESC',
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM properties WHERE 1=1';
    let params = [];

    // Recherche textuelle
    if (q) {
      query += ` AND (titre LIKE ? OR description LIKE ? OR localisation LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    // Filtres
    if (type) {
      query += ` AND type_propriete = ?`;
      params.push(type);
    }
    
    if (prix_min) {
      query += ` AND prix >= ?`;
      params.push(prix_min);
    }
    
    if (prix_max) {
      query += ` AND prix <= ?`;
      params.push(prix_max);
    }

    if (surface_min) {
      query += ` AND surface >= ?`;
      params.push(surface_min);
    }
    
    if (surface_max) {
      query += ` AND surface <= ?`;
      params.push(surface_max);
    }

    if (localisation) {
      query += ` AND localisation LIKE ?`;
      params.push(`%${localisation}%`);
    }

    // Tri
    const validSortFields = ['prix', 'surface', 'date_creation', 'titre'];
    const sortField = validSortFields.includes(sort) ? sort : 'date_creation';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const db = await getDatabase();
    const properties = await db.all(query, params);

    res.json({
      success: true,
      data: {
        properties,
        searchParams: { q, type, prix_min, prix_max, surface_min, surface_max, localisation }
      }
    });

  } catch (error) {
    console.error('Erreur recherche propriétés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche'
    });
  }
});

// 📊 STATISTIQUES PROPRIÉTÉS
router.get('/stats/overview', async (req, res) => {
  try {
    const db = await getDatabase();
    
    const stats = await db.get(`
      SELECT 
        COUNT(*) as total_proprietes,
        COUNT(CASE WHEN statut = 'disponible' THEN 1 END) as disponibles,
        COUNT(CASE WHEN statut = 'vendu' THEN 1 END) as vendues,
        AVG(prix) as prix_moyen,
        MIN(prix) as prix_min,
        MAX(prix) as prix_max,
        AVG(surface) as surface_moyenne
      FROM properties
    `);

    // Stats par type
    const statsByType = await db.all(`
      SELECT type_propriete, COUNT(*) as count, AVG(prix) as prix_moyen
      FROM properties 
      GROUP BY type_propriete
    `);

    res.json({
      success: true,
      data: {
        overview: stats,
        byType: statsByType
      }
    });

  } catch (error) {
    console.error('Erreur stats propriétés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du calcul des statistiques'
    });
  }
});

export default router;