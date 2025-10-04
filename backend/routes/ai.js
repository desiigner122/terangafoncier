import express from 'express';
import { authenticateToken, requireRole, uploadRateLimit } from '../middleware/auth.js';
import { asyncErrorHandler, AppError } from '../middleware/errorHandler.js';
import { logAI } from '../utils/logger.js';
import { analyzeDocumentAI, evaluatePropertyAI, generateReportAI } from '../config/ai.js';
import { setAIAnalysisCache, getAIAnalysisCache } from '../config/redis.js';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import db from '../config/database.js';

const router = express.Router();

// Configuration Multer pour upload temporaire
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new AppError('Type de fichier non supporté pour analyse IA', 400));
    }
  }
});

// 🤖 ANALYSER DOCUMENT AVEC IA
router.post('/analyze-document', authenticateToken, requireRole(['admin', 'geometre', 'agent_foncier']), uploadRateLimit, upload.single('document'), asyncErrorHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Aucun document fourni', 400);
  }

  const { documentType = 'general' } = req.body;
  const userId = req.user.id;

  // Générer hash du fichier pour cache
  const fileBuffer = require('fs').readFileSync(req.file.path);
  const fileHash = crypto.createHash('md5').update(fileBuffer).digest('hex');

  try {
    // Vérifier cache
    let analysis = await getAIAnalysisCache(fileHash);

    if (!analysis) {
      // Analyser avec IA
      analysis = await analyzeDocumentAI(req.file.path, documentType);
      
      // Mettre en cache
      if (analysis.success) {
        await setAIAnalysisCache(fileHash, analysis);
      }
    }

    logAI('document_analyzed', req.file.filename, {
      userId,
      documentType,
      fromCache: !!analysis,
      success: analysis.success
    });

    res.json({
      success: true,
      message: 'Document analysé avec succès',
      data: { analysis }
    });

  } catch (error) {
    logAI('document_analysis_failed', req.file.filename, {
      userId,
      error: error.message
    });
    throw error;
  } finally {
    // Nettoyer fichier temporaire
    try {
      require('fs').unlinkSync(req.file.path);
    } catch (cleanupError) {
      // Ignorer erreurs de nettoyage
    }
  }
}));

// 💰 ÉVALUER PROPRIÉTÉ AVEC IA
router.post('/evaluate-property', authenticateToken, requireRole(['admin', 'geometre', 'agent_foncier']), asyncErrorHandler(async (req, res) => {
  const { location, area, propertyType, condition, amenities } = req.body;

  if (!location || !area || !propertyType) {
    throw new AppError('Localisation, superficie et type requis', 400);
  }

  const propertyData = {
    location,
    area: parseFloat(area),
    type: propertyType,
    condition: condition || 'bon',
    amenities: amenities || []
  };

  const evaluation = await evaluatePropertyAI(propertyData);

  if (!evaluation.success) {
    throw new AppError(`Erreur évaluation IA: ${evaluation.error}`, 500);
  }

  logAI('property_evaluated', null, {
    userId: req.user.id,
    location,
    area,
    propertyType
  });

  res.json({
    success: true,
    message: 'Propriété évaluée avec succès',
    data: { evaluation }
  });
}));

// 📊 GÉNÉRER RAPPORT IA
router.post('/generate-report', authenticateToken, requireRole(['admin', 'geometre', 'agent_foncier']), asyncErrorHandler(async (req, res) => {
  const { reportType, data } = req.body;

  const validReportTypes = ['due_diligence', 'market_analysis', 'risk_assessment'];
  
  if (!reportType || !validReportTypes.includes(reportType)) {
    throw new AppError('Type de rapport invalide', 400);
  }

  if (!data) {
    throw new AppError('Données pour le rapport requises', 400);
  }

  const report = await generateReportAI(reportType, data);

  if (!report.success) {
    throw new AppError(`Erreur génération rapport: ${report.error}`, 500);
  }

  logAI('report_generated', null, {
    userId: req.user.id,
    reportType,
    dataKeys: Object.keys(data)
  });

  res.json({
    success: true,
    message: 'Rapport généré avec succès',
    data: { report }
  });
}));

// 📋 ANALYSER DOCUMENT EXISTANT
router.post('/analyze-existing/:documentId', authenticateToken, requireRole(['admin', 'geometre', 'agent_foncier']), asyncErrorHandler(async (req, res) => {
  const documentId = req.params.documentId;
  const { documentType = 'general' } = req.body;
  const userId = req.user.id;

  // Récupérer document
  const documentQuery = 'SELECT file_path, mime_type, original_name, ai_analysis FROM documents WHERE id = $1';
  const documentResult = await db.query(documentQuery, [documentId]);

  if (documentResult.rows.length === 0) {
    throw new AppError('Document non trouvé', 404);
  }

  const document = documentResult.rows[0];

  // Vérifier si déjà analysé récemment
  if (document.ai_analysis) {
    const existingAnalysis = JSON.parse(document.ai_analysis);
    const analysisAge = Date.now() - new Date(existingAnalysis.processedAt).getTime();
    
    // Si analyse < 24h, retourner résultat existant
    if (analysisAge < 24 * 60 * 60 * 1000) {
      return res.json({
        success: true,
        message: 'Analyse existante trouvée',
        data: { 
          analysis: existingAnalysis,
          fromCache: true
        }
      });
    }
  }

  // Vérifier que le fichier existe
  try {
    require('fs').accessSync(document.file_path);
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

  logAI('existing_document_analyzed', documentId, {
    userId,
    documentType,
    originalName: document.original_name
  });

  res.json({
    success: true,
    message: 'Document analysé avec succès',
    data: { analysis }
  });
}));

// 📈 ANALYSE DE MARCHÉ IA
router.post('/market-analysis', authenticateToken, requireRole(['admin', 'geometre', 'agent_foncier']), asyncErrorHandler(async (req, res) => {
  const { location, radius = 5, propertyType } = req.body;

  if (!location) {
    throw new AppError('Localisation requise', 400);
  }

  // Récupérer propriétés similaires dans la zone
  const similarPropertiesQuery = `
    SELECT title, location, area, price, property_type, created_at
    FROM properties 
    WHERE location ILIKE $1 
      AND status = 'active'
      ${propertyType ? 'AND property_type = $2' : ''}
    ORDER BY created_at DESC
    LIMIT 20
  `;

  const queryParams = [`%${location}%`];
  if (propertyType) {
    queryParams.push(propertyType);
  }

  const propertiesResult = await db.query(similarPropertiesQuery, queryParams);
  const properties = propertiesResult.rows;

  // Préparer données pour IA
  const marketData = {
    location,
    radius,
    propertyType: propertyType || 'tous',
    properties: properties.map(p => ({
      area: p.area,
      price: p.price,
      type: p.property_type,
      age: Math.floor((Date.now() - new Date(p.created_at).getTime()) / (1000 * 60 * 60 * 24))
    }))
  };

  // Générer analyse marché avec IA
  const marketAnalysis = await generateReportAI('market_analysis', marketData);

  if (!marketAnalysis.success) {
    throw new AppError(`Erreur analyse marché: ${marketAnalysis.error}`, 500);
  }

  logAI('market_analysis_generated', null, {
    userId: req.user.id,
    location,
    propertyType: propertyType || 'tous',
    propertiesCount: properties.length
  });

  res.json({
    success: true,
    message: 'Analyse de marché générée',
    data: {
      marketAnalysis,
      properties: properties.length,
      location
    }
  });
}));

// 🔍 DÉTECTION FRAUDE DOCUMENT
router.post('/fraud-detection', authenticateToken, requireRole(['admin', 'geometre']), uploadRateLimit, upload.single('document'), asyncErrorHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Aucun document fourni', 400);
  }

  const userId = req.user.id;

  try {
    // Analyser spécifiquement pour fraude
    const analysis = await analyzeDocumentAI(req.file.path, 'fraud_detection');

    if (!analysis.success) {
      throw new AppError(`Erreur analyse fraude: ${analysis.error}`, 500);
    }

    const fraudDetection = analysis.fraudDetection || {
      fraud_probability: 0,
      risk_level: 'LOW',
      checks: {},
      recommendation: 'DOCUMENT_VALIDE'
    };

    logAI('fraud_detection_performed', req.file.filename, {
      userId,
      fraudProbability: fraudDetection.fraud_probability,
      riskLevel: fraudDetection.risk_level
    });

    res.json({
      success: true,
      message: 'Analyse de fraude terminée',
      data: {
        fraudDetection,
        extractedText: analysis.extractedText,
        confidence: analysis.confidence
      }
    });

  } finally {
    // Nettoyer fichier temporaire
    try {
      require('fs').unlinkSync(req.file.path);
    } catch (cleanupError) {
      // Ignorer erreurs de nettoyage
    }
  }
}));

// 📊 STATISTIQUES IA
router.get('/stats', authenticateToken, requireRole(['admin']), asyncErrorHandler(async (req, res) => {
  const analyticsQuery = `
    SELECT 
      COUNT(*) FILTER (WHERE ai_analysis IS NOT NULL) as analyzed_documents,
      COUNT(*) as total_documents,
      COUNT(*) FILTER (WHERE ai_evaluation IS NOT NULL) as evaluated_properties
    FROM documents d
    FULL OUTER JOIN properties p ON d.property_id = p.id
  `;

  const recentActivityQuery = `
    SELECT 
      COUNT(*) as recent_analyses
    FROM documents 
    WHERE ai_analysis IS NOT NULL 
      AND updated_at > NOW() - INTERVAL '7 days'
  `;

  const [analyticsResult, recentResult] = await Promise.all([
    db.query(analyticsQuery),
    db.query(recentActivityQuery)
  ]);

  const stats = analyticsResult.rows[0];
  const recent = recentResult.rows[0];

  res.json({
    success: true,
    data: {
      stats: {
        analyzedDocuments: parseInt(stats.analyzed_documents || 0),
        totalDocuments: parseInt(stats.total_documents || 0),
        evaluatedProperties: parseInt(stats.evaluated_properties || 0),
        recentAnalyses: parseInt(recent.recent_analyses || 0),
        analysisRate: stats.total_documents > 0 ? 
          ((stats.analyzed_documents / stats.total_documents) * 100).toFixed(2) : 0
      }
    }
  });
}));

// 🧠 PRÉDICTIONS IMMOBILIÈRES
router.post('/predictions', authenticateToken, requireRole(['admin', 'geometre', 'agent_foncier']), asyncErrorHandler(async (req, res) => {
  const { location, propertyType, timeframe = '12_months' } = req.body;

  if (!location) {
    throw new AppError('Localisation requise', 400);
  }

  // Récupérer données historiques
  const historicalQuery = `
    SELECT 
      EXTRACT(MONTH FROM created_at) as month,
      EXTRACT(YEAR FROM created_at) as year,
      AVG(price) as avg_price,
      COUNT(*) as transactions
    FROM properties 
    WHERE location ILIKE $1 
      ${propertyType ? 'AND property_type = $2' : ''}
      AND created_at > NOW() - INTERVAL '2 years'
    GROUP BY year, month
    ORDER BY year, month
  `;

  const queryParams = [`%${location}%`];
  if (propertyType) {
    queryParams.push(propertyType);
  }

  const historicalResult = await db.query(historicalQuery, queryParams);
  
  // Préparer données pour prédictions IA
  const predictionData = {
    location,
    propertyType: propertyType || 'tous',
    timeframe,
    historicalData: historicalResult.rows
  };

  // Générer prédictions avec IA
  const predictions = await generateReportAI('market_predictions', predictionData);

  logAI('predictions_generated', null, {
    userId: req.user.id,
    location,
    propertyType: propertyType || 'tous',
    timeframe
  });

  res.json({
    success: true,
    message: 'Prédictions générées',
    data: { 
      predictions,
      historicalDataPoints: historicalResult.rows.length
    }
  });
}));

export default router;