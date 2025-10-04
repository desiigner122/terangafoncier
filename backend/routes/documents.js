import express from 'express';
import { authenticateToken, requireRole, uploadRateLimit } from '../middleware/auth.js';
import { asyncErrorHandler, AppError } from '../middleware/errorHandler.js';
import { logBusiness } from '../utils/logger.js';
import { analyzeDocumentAI } from '../config/ai.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import db from '../config/database.js';

const router = express.Router();

// Configuration Multer pour upload documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `doc-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new AppError('Type de fichier non autorisé', 400));
    }
  }
});

// 📄 UPLOADER UN DOCUMENT
router.post('/upload', authenticateToken, uploadRateLimit, upload.single('document'), asyncErrorHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Aucun fichier fourni', 400);
  }

  const { propertyId, documentType = 'general', description } = req.body;
  const userId = req.user.id;

  try {
    await db.query('BEGIN');

    // Sauvegarder document en base
    const documentQuery = `
      INSERT INTO documents (
        user_id, property_id, filename, original_name, file_path,
        file_size, mime_type, document_type, description, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING id, filename, original_name, file_size, document_type, created_at
    `;

    const documentResult = await db.query(documentQuery, [
      userId,
      propertyId || null,
      req.file.filename,
      req.file.originalname,
      req.file.path,
      req.file.size,
      req.file.mimetype,
      documentType,
      description || null,
      'uploaded'
    ]);

    const document = documentResult.rows[0];
    const documentId = document.id;

    await db.query('COMMIT');

    // Analyser document avec IA en arrière-plan
    if (req.file.mimetype.includes('image') || req.file.mimetype.includes('pdf')) {
      try {
        const analysis = await analyzeDocumentAI(req.file.path, documentType);
        
        // Sauvegarder résultats analyse
        await db.query(
          'UPDATE documents SET ai_analysis = $1, status = $2 WHERE id = $3',
          [JSON.stringify(analysis), 'analyzed', documentId]
        );

        logBusiness('document_ai_analyzed', { 
          documentId, 
          userId, 
          analysisSuccess: analysis.success 
        });
      } catch (aiError) {
        logBusiness('document_ai_failed', { 
          documentId, 
          userId, 
          error: aiError.message 
        });
      }
    }

    logBusiness('document_uploaded', { 
      documentId, 
      userId, 
      propertyId, 
      documentType 
    });

    res.status(201).json({
      success: true,
      message: 'Document uploadé avec succès',
      data: {
        document: {
          id: document.id,
          filename: document.filename,
          originalName: document.original_name,
          fileSize: document.file_size,
          documentType: document.document_type,
          createdAt: document.created_at
        }
      }
    });

  } catch (error) {
    await db.query('ROLLBACK');
    
    // Supprimer fichier en cas d'erreur
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      logBusiness('file_cleanup_failed', { 
        filePath: req.file.path, 
        error: unlinkError.message 
      });
    }
    
    throw error;
  }
}));

// 📋 LISTER DOCUMENTS
router.get('/', authenticateToken, asyncErrorHandler(async (req, res) => {
  const { page = 1, limit = 20, propertyId, documentType, status } = req.query;
  const offset = (page - 1) * limit;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  // Construire query selon permissions
  let whereConditions = [];
  let queryParams = [];
  let paramIndex = 1;

  // Non-admin: voir seulement ses documents
  if (!isAdmin) {
    whereConditions.push(`d.user_id = $${paramIndex}`);
    queryParams.push(userId);
    paramIndex++;
  }

  if (propertyId) {
    whereConditions.push(`d.property_id = $${paramIndex}`);
    queryParams.push(propertyId);
    paramIndex++;
  }

  if (documentType) {
    whereConditions.push(`d.document_type = $${paramIndex}`);
    queryParams.push(documentType);
    paramIndex++;
  }

  if (status) {
    whereConditions.push(`d.status = $${paramIndex}`);
    queryParams.push(status);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const documentsQuery = `
    SELECT 
      d.id, d.filename, d.original_name, d.file_size, d.mime_type,
      d.document_type, d.description, d.status, d.ai_analysis, d.created_at,
      p.title as property_title, p.location as property_location,
      u.profile->>'firstName' as user_first_name,
      u.profile->>'lastName' as user_last_name
    FROM documents d
    LEFT JOIN properties p ON d.property_id = p.id
    LEFT JOIN users u ON d.user_id = u.id
    ${whereClause}
    ORDER BY d.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  queryParams.push(limit, offset);

  const documentsResult = await db.query(documentsQuery, queryParams);

  // Count total
  const countQuery = `SELECT COUNT(*) FROM documents d ${whereClause}`;
  const countResult = await db.query(countQuery, queryParams.slice(0, -2));
  const total = parseInt(countResult.rows[0].count);

  const documents = documentsResult.rows.map(row => ({
    id: row.id,
    filename: row.filename,
    originalName: row.original_name,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    documentType: row.document_type,
    description: row.description,
    status: row.status,
    aiAnalysis: row.ai_analysis ? JSON.parse(row.ai_analysis) : null,
    createdAt: row.created_at,
    property: row.property_title ? {
      title: row.property_title,
      location: row.property_location
    } : null,
    user: {
      firstName: row.user_first_name,
      lastName: row.user_last_name
    }
  }));

  res.json({
    success: true,
    data: {
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
}));

// 🔍 DÉTAILS DOCUMENT
router.get('/:id', authenticateToken, asyncErrorHandler(async (req, res) => {
  const documentId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  const documentQuery = `
    SELECT 
      d.*,
      p.title as property_title, p.location as property_location,
      u.email as user_email, u.profile as user_profile
    FROM documents d
    LEFT JOIN properties p ON d.property_id = p.id
    LEFT JOIN users u ON d.user_id = u.id
    WHERE d.id = $1
  `;

  const documentResult = await db.query(documentQuery, [documentId]);

  if (documentResult.rows.length === 0) {
    throw new AppError('Document non trouvé', 404);
  }

  const document = documentResult.rows[0];

  // Vérifier permissions
  if (!isAdmin && document.user_id !== userId) {
    throw new AppError('Accès non autorisé', 403);
  }

  res.json({
    success: true,
    data: {
      document: {
        id: document.id,
        filename: document.filename,
        originalName: document.original_name,
        filePath: document.file_path,
        fileSize: document.file_size,
        mimeType: document.mime_type,
        documentType: document.document_type,
        description: document.description,
        status: document.status,
        aiAnalysis: document.ai_analysis ? JSON.parse(document.ai_analysis) : null,
        createdAt: document.created_at,
        property: document.property_title ? {
          title: document.property_title,
          location: document.property_location
        } : null,
        user: {
          id: document.user_id,
          email: document.user_email,
          profile: JSON.parse(document.user_profile || '{}')
        }
      }
    }
  });
}));

// 📥 TÉLÉCHARGER DOCUMENT
router.get('/:id/download', authenticateToken, asyncErrorHandler(async (req, res) => {
  const documentId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  // Vérifier document et permissions
  const documentQuery = 'SELECT user_id, file_path, original_name, mime_type FROM documents WHERE id = $1';
  const documentResult = await db.query(documentQuery, [documentId]);

  if (documentResult.rows.length === 0) {
    throw new AppError('Document non trouvé', 404);
  }

  const document = documentResult.rows[0];

  if (!isAdmin && document.user_id !== userId) {
    throw new AppError('Accès non autorisé', 403);
  }

  try {
    // Vérifier que le fichier existe
    await fs.access(document.file_path);
    
    // Définir headers pour téléchargement
    res.setHeader('Content-Disposition', `attachment; filename="${document.original_name}"`);
    res.setHeader('Content-Type', document.mime_type);
    
    // Envoyer fichier
    res.sendFile(path.resolve(document.file_path));

    logBusiness('document_downloaded', { 
      documentId, 
      userId 
    });

  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new AppError('Fichier non trouvé sur le serveur', 404);
    }
    throw error;
  }
}));

// ❌ SUPPRIMER DOCUMENT
router.delete('/:id', authenticateToken, asyncErrorHandler(async (req, res) => {
  const documentId = req.params.id;
  const userId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  // Vérifier document et permissions
  const documentQuery = 'SELECT user_id, file_path, original_name FROM documents WHERE id = $1';
  const documentResult = await db.query(documentQuery, [documentId]);

  if (documentResult.rows.length === 0) {
    throw new AppError('Document non trouvé', 404);
  }

  const document = documentResult.rows[0];

  if (!isAdmin && document.user_id !== userId) {
    throw new AppError('Accès non autorisé', 403);
  }

  try {
    await db.query('BEGIN');

    // Soft delete en base
    await db.query(
      'UPDATE documents SET status = $1, updated_at = NOW() WHERE id = $2',
      ['deleted', documentId]
    );

    await db.query('COMMIT');

    // Supprimer fichier physique (optionnel)
    try {
      await fs.unlink(document.file_path);
    } catch (unlinkError) {
      logBusiness('file_deletion_failed', { 
        documentId, 
        filePath: document.file_path, 
        error: unlinkError.message 
      });
    }

    logBusiness('document_deleted', { 
      documentId, 
      userId, 
      originalName: document.original_name 
    });

    res.json({
      success: true,
      message: 'Document supprimé'
    });

  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}));

// 🤖 ANALYSER DOCUMENT AVEC IA
router.post('/:id/analyze', authenticateToken, requireRole(['admin', 'geometre', 'agent_foncier']), asyncErrorHandler(async (req, res) => {
  const documentId = req.params.id;
  const { documentType = 'general' } = req.body;

  // Récupérer document
  const documentQuery = 'SELECT file_path, mime_type, original_name FROM documents WHERE id = $1';
  const documentResult = await db.query(documentQuery, [documentId]);

  if (documentResult.rows.length === 0) {
    throw new AppError('Document non trouvé', 404);
  }

  const document = documentResult.rows[0];

  // Vérifier que le fichier existe
  try {
    await fs.access(document.file_path);
  } catch (error) {
    throw new AppError('Fichier non trouvé sur le serveur', 404);
  }

  // Analyser avec IA
  const analysis = await analyzeDocumentAI(document.file_path, documentType);

  if (!analysis.success) {
    throw new AppError(`Erreur analyse IA: ${analysis.error}`, 500);
  }

  // Sauvegarder résultats
  await db.query(
    'UPDATE documents SET ai_analysis = $1, status = $2 WHERE id = $3',
    [JSON.stringify(analysis), 'analyzed', documentId]
  );

  logBusiness('document_manual_analysis', { 
    documentId, 
    userId: req.user.id, 
    documentType 
  });

  res.json({
    success: true,
    message: 'Document analysé avec succès',
    data: { analysis }
  });
}));

// 📊 STATISTIQUES DOCUMENTS
router.get('/stats/overview', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_documents,
      COUNT(*) FILTER (WHERE status = 'uploaded') as uploaded,
      COUNT(*) FILTER (WHERE status = 'analyzed') as analyzed,
      COUNT(*) FILTER (WHERE status = 'verified') as verified,
      COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
      COUNT(*) FILTER (WHERE document_type = 'titre_foncier') as titres_fonciers,
      COUNT(*) FILTER (WHERE document_type = 'acte_vente') as actes_vente,
      COUNT(*) FILTER (WHERE document_type = 'attestation_residence') as attestations,
      SUM(file_size) as total_size,
      COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as recent_uploads
    FROM documents
    WHERE status != 'deleted'
  `;

  const statsResult = await db.query(statsQuery);
  const stats = statsResult.rows[0];

  res.json({
    success: true,
    data: {
      stats: {
        totalDocuments: parseInt(stats.total_documents),
        documentsByStatus: {
          uploaded: parseInt(stats.uploaded),
          analyzed: parseInt(stats.analyzed),
          verified: parseInt(stats.verified),
          rejected: parseInt(stats.rejected)
        },
        documentsByType: {
          titresFonciers: parseInt(stats.titres_fonciers),
          actesVente: parseInt(stats.actes_vente),
          attestations: parseInt(stats.attestations)
        },
        totalSize: parseInt(stats.total_size),
        recentUploads: parseInt(stats.recent_uploads)
      }
    }
  });
}));

export default router;