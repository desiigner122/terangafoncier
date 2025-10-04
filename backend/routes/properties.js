import express from 'express';
import { authenticateToken, requireRole, uploadRateLimit } from '../middleware/auth.js';
import { asyncErrorHandler, AppError } from '../middleware/errorHandler.js';
import { logBusiness, logDatabase } from '../utils/logger.js';
import { setPropertyCache, getPropertyCache, clearPropertyCache } from '../config/redis.js';
import { registerPropertyOnBlockchain, verifyPropertyOnBlockchain } from '../config/blockchain.js';
import { analyzeDocumentAI, evaluatePropertyAI } from '../config/ai.js';
import multer from 'multer';
import path from 'path';
import db from '../config/database.js';

const router = express.Router();

// Configuration Multer pour upload documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/properties/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `property-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new AppError('Type de fichier non autorisé', 400));
    }
  }
});

// 🏠 CRÉER UNE PROPRIÉTÉ
router.post('/', authenticateToken, upload.array('documents', 5), asyncErrorHandler(async (req, res) => {
  const {
    title,
    description,
    location,
    area,
    price,
    propertyType,
    cadastralRef,
    coordinates
  } = req.body;

  const ownerId = req.user.id;

  // Validations de base
  if (!title || !location || !area || !price || !propertyType) {
    throw new AppError('Tous les champs obligatoires doivent être remplis', 400);
  }

  try {
    await db.query('BEGIN');

    // Vérifier unicité référence cadastrale
    if (cadastralRef) {
      const existingQuery = 'SELECT id FROM properties WHERE cadastral_ref = $1';
      const existing = await db.query(existingQuery, [cadastralRef]);
      
      if (existing.rows.length > 0) {
        throw new AppError('Référence cadastrale déjà existante', 409);
      }
    }

    // Insérer propriété
    const propertyQuery = `
      INSERT INTO properties (
        title, description, location, area, price, property_type, owner_id,
        cadastral_ref, coordinates, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING id, title, location, area, price, property_type, cadastral_ref, created_at
    `;

    const propertyResult = await db.query(propertyQuery, [
      title,
      description,
      location,
      parseFloat(area),
      parseFloat(price),
      propertyType,
      ownerId,
      cadastralRef,
      coordinates ? JSON.stringify(coordinates) : null,
      'draft'
    ]);

    const property = propertyResult.rows[0];
    const propertyId = property.id;

    // Traiter documents uploadés
    const documentPromises = req.files?.map(async (file) => {
      const documentQuery = `
        INSERT INTO documents (
          user_id, property_id, filename, original_name, file_path, 
          file_size, mime_type, document_type, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        RETURNING id
      `;

      const documentResult = await db.query(documentQuery, [
        ownerId,
        propertyId,
        file.filename,
        file.originalname,
        file.path,
        file.size,
        file.mimetype,
        'property_document',
        'uploaded'
      ]);

      // Analyser document avec IA (en arrière-plan)
      if (file.mimetype.includes('image') || file.mimetype.includes('pdf')) {
        try {
          const analysis = await analyzeDocumentAI(file.path, 'titre_foncier');
          
          // Sauvegarder résultats analyse
          await db.query(
            'UPDATE documents SET ai_analysis = $1 WHERE id = $2',
            [JSON.stringify(analysis), documentResult.rows[0].id]
          );
        } catch (aiError) {
          logBusiness('ai_analysis_failed', { 
            documentId: documentResult.rows[0].id, 
            error: aiError.message 
          });
        }
      }

      return documentResult.rows[0].id;
    }) || [];

    await Promise.all(documentPromises);

    // Évaluation IA de la propriété
    try {
      const propertyData = {
        location,
        area,
        type: propertyType,
        price
      };
      
      const evaluation = await evaluatePropertyAI(propertyData);
      
      // Sauvegarder évaluation
      if (evaluation.success) {
        await db.query(
          'UPDATE properties SET ai_evaluation = $1 WHERE id = $2',
          [JSON.stringify(evaluation), propertyId]
        );
      }
    } catch (aiError) {
      logBusiness('property_evaluation_failed', { 
        propertyId, 
        error: aiError.message 
      });
    }

    await db.query('COMMIT');

    // Cache propriété
    await setPropertyCache(propertyId, property);

    logBusiness('property_created', { 
      propertyId, 
      ownerId, 
      title, 
      location 
    });

    res.status(201).json({
      success: true,
      message: 'Propriété créée avec succès',
      data: {
        property: {
          id: property.id,
          title: property.title,
          location: property.location,
          area: property.area,
          price: property.price,
          propertyType: property.property_type,
          cadastralRef: property.cadastral_ref,
          createdAt: property.created_at
        }
      }
    });

  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}));

// 📋 LISTER PROPRIÉTÉS
router.get('/', asyncErrorHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    location,
    minPrice,
    maxPrice,
    propertyType,
    status = 'active'
  } = req.query;

  const offset = (page - 1) * limit;

  // Construire query dynamique
  let whereConditions = ['status = $1'];
  let queryParams = [status];
  let paramIndex = 2;

  if (location) {
    whereConditions.push(`location ILIKE $${paramIndex}`);
    queryParams.push(`%${location}%`);
    paramIndex++;
  }

  if (minPrice) {
    whereConditions.push(`price >= $${paramIndex}`);
    queryParams.push(parseFloat(minPrice));
    paramIndex++;
  }

  if (maxPrice) {
    whereConditions.push(`price <= $${paramIndex}`);
    queryParams.push(parseFloat(maxPrice));
    paramIndex++;
  }

  if (propertyType) {
    whereConditions.push(`property_type = $${paramIndex}`);
    queryParams.push(propertyType);
    paramIndex++;
  }

  const whereClause = whereConditions.join(' AND ');

  // Query propriétés avec informations propriétaire
  const propertiesQuery = `
    SELECT 
      p.id, p.title, p.description, p.location, p.area, p.price, 
      p.property_type, p.cadastral_ref, p.coordinates, p.status, p.created_at,
      u.profile->>'firstName' as owner_first_name,
      u.profile->>'lastName' as owner_last_name,
      u.email as owner_email,
      COUNT(d.id) as documents_count
    FROM properties p
    LEFT JOIN users u ON p.owner_id = u.id
    LEFT JOIN documents d ON p.id = d.property_id
    WHERE ${whereClause}
    GROUP BY p.id, u.profile, u.email
    ORDER BY p.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  queryParams.push(limit, offset);

  const propertiesResult = await db.query(propertiesQuery, queryParams);

  // Count total
  const countQuery = `SELECT COUNT(*) FROM properties WHERE ${whereClause}`;
  const countResult = await db.query(countQuery, queryParams.slice(0, -2));
  const total = parseInt(countResult.rows[0].count);

  const properties = propertiesResult.rows.map(row => ({
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    area: row.area,
    price: row.price,
    propertyType: row.property_type,
    cadastralRef: row.cadastral_ref,
    coordinates: row.coordinates ? JSON.parse(row.coordinates) : null,
    status: row.status,
    createdAt: row.created_at,
    owner: {
      firstName: row.owner_first_name,
      lastName: row.owner_last_name,
      email: row.owner_email
    },
    documentsCount: parseInt(row.documents_count)
  }));

  res.json({
    success: true,
    data: {
      properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// 🔍 DÉTAILS PROPRIÉTÉ
router.get('/:id', asyncErrorHandler(async (req, res) => {
  const propertyId = req.params.id;

  // Vérifier cache
  let property = await getPropertyCache(propertyId);

  if (!property) {
    // Query base de données
    const propertyQuery = `
      SELECT 
        p.*,
        u.profile->>'firstName' as owner_first_name,
        u.profile->>'lastName' as owner_last_name,
        u.email as owner_email,
        u.profile->>'phone' as owner_phone
      FROM properties p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.id = $1
    `;

    const propertyResult = await db.query(propertyQuery, [propertyId]);

    if (propertyResult.rows.length === 0) {
      throw new AppError('Propriété non trouvée', 404);
    }

    const row = propertyResult.rows[0];

    // Récupérer documents associés
    const documentsQuery = `
      SELECT id, filename, original_name, file_size, mime_type, 
             document_type, ai_analysis, created_at
      FROM documents 
      WHERE property_id = $1 AND status = 'uploaded'
    `;

    const documentsResult = await db.query(documentsQuery, [propertyId]);

    property = {
      id: row.id,
      title: row.title,
      description: row.description,
      location: row.location,
      area: row.area,
      price: row.price,
      propertyType: row.property_type,
      cadastralRef: row.cadastral_ref,
      coordinates: row.coordinates ? JSON.parse(row.coordinates) : null,
      status: row.status,
      createdAt: row.created_at,
      aiEvaluation: row.ai_evaluation ? JSON.parse(row.ai_evaluation) : null,
      owner: {
        firstName: row.owner_first_name,
        lastName: row.owner_last_name,
        email: row.owner_email,
        phone: row.owner_phone
      },
      documents: documentsResult.rows.map(doc => ({
        id: doc.id,
        filename: doc.filename,
        originalName: doc.original_name,
        fileSize: doc.file_size,
        mimeType: doc.mime_type,
        documentType: doc.document_type,
        aiAnalysis: doc.ai_analysis ? JSON.parse(doc.ai_analysis) : null,
        createdAt: doc.created_at
      }))
    };

    // Mettre en cache
    await setPropertyCache(propertyId, property);
  }

  res.json({
    success: true,
    data: { property }
  });
}));

// ✏️ MODIFIER PROPRIÉTÉ
router.put('/:id', authenticateToken, asyncErrorHandler(async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  // Vérifier propriété existe et permissions
  const existingQuery = 'SELECT owner_id FROM properties WHERE id = $1';
  const existingResult = await db.query(existingQuery, [propertyId]);

  if (existingResult.rows.length === 0) {
    throw new AppError('Propriété non trouvée', 404);
  }

  const ownerId = existingResult.rows[0].owner_id;

  if (ownerId !== userId && !isAdmin) {
    throw new AppError('Accès non autorisé', 403);
  }

  const {
    title,
    description,
    location,
    area,
    price,
    propertyType,
    status
  } = req.body;

  // Construire query update dynamique
  const updateFields = [];
  const queryParams = [];
  let paramIndex = 1;

  if (title !== undefined) {
    updateFields.push(`title = $${paramIndex}`);
    queryParams.push(title);
    paramIndex++;
  }

  if (description !== undefined) {
    updateFields.push(`description = $${paramIndex}`);
    queryParams.push(description);
    paramIndex++;
  }

  if (location !== undefined) {
    updateFields.push(`location = $${paramIndex}`);
    queryParams.push(location);
    paramIndex++;
  }

  if (area !== undefined) {
    updateFields.push(`area = $${paramIndex}`);
    queryParams.push(parseFloat(area));
    paramIndex++;
  }

  if (price !== undefined) {
    updateFields.push(`price = $${paramIndex}`);
    queryParams.push(parseFloat(price));
    paramIndex++;
  }

  if (propertyType !== undefined) {
    updateFields.push(`property_type = $${paramIndex}`);
    queryParams.push(propertyType);
    paramIndex++;
  }

  if (status !== undefined && isAdmin) {
    updateFields.push(`status = $${paramIndex}`);
    queryParams.push(status);
    paramIndex++;
  }

  if (updateFields.length === 0) {
    throw new AppError('Aucune donnée à mettre à jour', 400);
  }

  updateFields.push(`updated_at = NOW()`);
  queryParams.push(propertyId);

  const updateQuery = `
    UPDATE properties 
    SET ${updateFields.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, title, location, area, price, property_type, status, updated_at
  `;

  const updateResult = await db.query(updateQuery, queryParams);
  const updatedProperty = updateResult.rows[0];

  // Supprimer cache
  await clearPropertyCache(propertyId);

  logBusiness('property_updated', { 
    propertyId, 
    userId, 
    fields: Object.keys(req.body) 
  });

  res.json({
    success: true,
    message: 'Propriété mise à jour',
    data: {
      property: {
        id: updatedProperty.id,
        title: updatedProperty.title,
        location: updatedProperty.location,
        area: updatedProperty.area,
        price: updatedProperty.price,
        propertyType: updatedProperty.property_type,
        status: updatedProperty.status,
        updatedAt: updatedProperty.updated_at
      }
    }
  });
}));

// ❌ SUPPRIMER PROPRIÉTÉ
router.delete('/:id', authenticateToken, asyncErrorHandler(async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  // Vérifier propriété et permissions
  const propertyQuery = 'SELECT owner_id, title FROM properties WHERE id = $1';
  const propertyResult = await db.query(propertyQuery, [propertyId]);

  if (propertyResult.rows.length === 0) {
    throw new AppError('Propriété non trouvée', 404);
  }

  const property = propertyResult.rows[0];

  if (property.owner_id !== userId && !isAdmin) {
    throw new AppError('Accès non autorisé', 403);
  }

  try {
    await db.query('BEGIN');

    // Soft delete ou hard delete selon préférence
    await db.query('UPDATE properties SET status = $1, updated_at = NOW() WHERE id = $2', ['deleted', propertyId]);

    await db.query('COMMIT');

    // Supprimer cache
    await clearPropertyCache(propertyId);

    logBusiness('property_deleted', { 
      propertyId, 
      userId, 
      title: property.title 
    });

    res.json({
      success: true,
      message: 'Propriété supprimée'
    });

  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}));

// 🔗 ENREGISTRER SUR BLOCKCHAIN
router.post('/:id/blockchain', authenticateToken, requireRole(['admin', 'geometre']), asyncErrorHandler(async (req, res) => {
  const propertyId = req.params.id;
  const { documentHash } = req.body;

  if (!documentHash) {
    throw new AppError('Hash du document requis', 400);
  }

  // Vérifier propriété
  const propertyQuery = 'SELECT cadastral_ref, owner_id FROM properties WHERE id = $1';
  const propertyResult = await db.query(propertyQuery, [propertyId]);

  if (propertyResult.rows.length === 0) {
    throw new AppError('Propriété non trouvée', 404);
  }

  const property = propertyResult.rows[0];

  if (!property.cadastral_ref) {
    throw new AppError('Référence cadastrale requise pour blockchain', 400);
  }

  // Enregistrer sur blockchain
  const blockchainResult = await registerPropertyOnBlockchain(
    property.cadastral_ref,
    documentHash,
    property.owner_id
  );

  if (!blockchainResult.success) {
    throw new AppError(`Erreur blockchain: ${blockchainResult.error}`, 500);
  }

  // Sauvegarder transaction blockchain
  const txQuery = `
    INSERT INTO transactions (
      property_id, type, blockchain_tx_hash, status, 
      blockchain_data, created_at
    ) VALUES ($1, $2, $3, $4, $5, NOW())
    RETURNING id
  `;

  await db.query(txQuery, [
    propertyId,
    'blockchain_registration',
    blockchainResult.txHash,
    'completed',
    JSON.stringify(blockchainResult)
  ]);

  // Mettre à jour propriété
  await db.query(
    'UPDATE properties SET blockchain_hash = $1, status = $2 WHERE id = $3',
    [blockchainResult.txHash, 'verified', propertyId]
  );

  logBusiness('property_blockchain_registered', { 
    propertyId, 
    txHash: blockchainResult.txHash 
  });

  res.json({
    success: true,
    message: 'Propriété enregistrée sur blockchain',
    data: {
      txHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber
    }
  });
}));

// ✅ VÉRIFIER SUR BLOCKCHAIN
router.get('/:id/verify', asyncErrorHandler(async (req, res) => {
  const propertyId = req.params.id;

  // Récupérer référence cadastrale
  const propertyQuery = 'SELECT cadastral_ref, blockchain_hash FROM properties WHERE id = $1';
  const propertyResult = await db.query(propertyQuery, [propertyId]);

  if (propertyResult.rows.length === 0) {
    throw new AppError('Propriété non trouvée', 404);
  }

  const property = propertyResult.rows[0];

  if (!property.cadastral_ref) {
    return res.json({
      success: true,
      data: {
        verified: false,
        message: 'Référence cadastrale manquante'
      }
    });
  }

  // Vérifier sur blockchain
  const verification = await verifyPropertyOnBlockchain(property.cadastral_ref);

  res.json({
    success: true,
    data: {
      verified: verification.verified,
      blockchainData: verification,
      localHash: property.blockchain_hash
    }
  });
}));

export default router;