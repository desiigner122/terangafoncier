/**
 * @file aiRoutes.js
 * @description Routes API pour services IA (validation, fraud, recommendations)
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { createClient } from '@supabase/supabase-js';
import { analyzeDocumentAI, evaluatePropertyAI } from '../config/ai.js';
import db from '../config/database.js';

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * POST /api/ai/validate-document
 * Valider document unique avec IA
 */
router.post('/validate-document', authenticateToken, async (req, res) => {
  try {
    const { documentId, documentType } = req.body;
    const userId = req.user.id;

    // 1. Récupérer document
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    // 2. Vérifier autorisation
    const { data: purchaseCase } = await supabase
      .from('purchase_cases')
      .select('buyer_id, seller_id, notaire_id')
      .eq('id', document.case_id)
      .single();

    const isAuthorized = 
      userId === purchaseCase?.buyer_id ||
      userId === purchaseCase?.seller_id ||
      userId === purchaseCase?.notaire_id;

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // 3. Validation IA selon type
    let validationResult;

    switch (documentType) {
      case 'cni':
      case 'passport':
        validationResult = await TerangaAIService.validateIdentityDocument(
          document.file_url,
          documentType
        );
        break;

      case 'title_deed':
        validationResult = await TerangaAIService.validateTitleDeed(
          document.file_url
        );
        break;

      case 'contract':
        validationResult = await TerangaAIService.validateContract(
          document.file_url
        );
        break;

      default:
        validationResult = await TerangaAIService.validateGenericDocument(
          document.file_url,
          documentType
        );
    }

    // 4. Sauvegarder résultat validation
    await supabase
      .from('documents')
      .update({
        ai_validation_status: validationResult.isValid ? 'valid' : 'invalid',
        ai_validation_score: validationResult.confidenceScore,
        ai_validation_issues: validationResult.issues,
        ai_validated_at: new Date().toISOString(),
        ai_validated_by: 'teranga_ai_v1',
      })
      .eq('id', documentId);

    // 5. Si document critique invalide, alerter
    if (!validationResult.isValid && ['cni', 'passport', 'title_deed'].includes(documentType)) {
      // Créer notification pour notaire
      await supabase.from('notifications').insert({
        user_id: purchaseCase.notaire_id,
        type: 'document_validation_failed',
        title: 'Document invalide détecté',
        message: `IA a détecté des problèmes sur ${documentType}: ${validationResult.issues.join(', ')}`,
        data: { documentId, caseId: document.case_id },
      });
    }

    res.json({
      success: true,
      validation: validationResult,
      documentId,
    });

  } catch (error) {
    console.error('❌ Error AI validation:', error);
    res.status(500).json({
      error: 'Erreur validation IA',
      details: error.message,
    });
  }
});

/**
 * POST /api/ai/validate-case-documents
 * Valider tous documents d'un dossier
 */
router.post('/validate-case-documents', authenticateToken, async (req, res) => {
  try {
    const { caseId } = req.body;
    const userId = req.user.id;

    // 1. Vérifier autorisation
    const { data: purchaseCase } = await supabase
      .from('purchase_cases')
      .select('buyer_id, seller_id, notaire_id')
      .eq('id', caseId)
      .single();

    if (!purchaseCase) {
      return res.status(404).json({ error: 'Dossier non trouvé' });
    }

    const isAuthorized = 
      userId === purchaseCase.buyer_id ||
      userId === purchaseCase.seller_id ||
      userId === purchaseCase.notaire_id;

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // 2. Récupérer documents
    const { data: documents } = await supabase
      .from('documents')
      .select('*')
      .eq('case_id', caseId)
      .in('status', ['uploaded', 'pending_validation']);

    if (!documents || documents.length === 0) {
      return res.json({
        success: true,
        results: [],
        message: 'Aucun document à valider',
      });
    }

    // 3. Valider chaque document
    const results = [];

    for (const doc of documents) {
      try {
        const validation = await TerangaAIService.validateDocument(
          doc.file_url,
          doc.document_type
        );

        // Update DB
        await supabase
          .from('documents')
          .update({
            ai_validation_status: validation.isValid ? 'valid' : 'invalid',
            ai_validation_score: validation.confidenceScore,
            ai_validation_issues: validation.issues,
            ai_validated_at: new Date().toISOString(),
          })
          .eq('id', doc.id);

        results.push({
          documentId: doc.id,
          documentType: doc.document_type,
          ...validation,
        });

      } catch (error) {
        console.error(`❌ Error validating document ${doc.id}:`, error);
        results.push({
          documentId: doc.id,
          documentType: doc.document_type,
          isValid: false,
          issues: ['Erreur validation IA'],
          confidenceScore: 0,
        });
      }
    }

    // 4. Calculer score global
    const validCount = results.filter(r => r.isValid).length;
    const avgScore = results.reduce((sum, r) => sum + r.confidenceScore, 0) / results.length;

    // 5. Update purchase_case
    await supabase
      .from('purchase_cases')
      .update({
        ai_documents_validated: true,
        ai_documents_score: avgScore,
        ai_documents_valid_count: validCount,
        ai_documents_total_count: results.length,
      })
      .eq('id', caseId);

    res.json({
      success: true,
      results,
      summary: {
        totalDocuments: results.length,
        validDocuments: validCount,
        invalidDocuments: results.length - validCount,
        averageScore: avgScore,
      },
    });

  } catch (error) {
    console.error('❌ Error validating case documents:', error);
    res.status(500).json({
      error: 'Erreur validation documents',
      details: error.message,
    });
  }
});

/**
 * POST /api/ai/detect-fraud
 * Détecter fraude sur dossier
 */
router.post('/detect-fraud', authenticateToken, async (req, res) => {
  try {
    const { caseId } = req.body;
    const userId = req.user.id;

    // Vérifier autorisation (notaire/admin uniquement)
    const { data: user } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!['notaire', 'admin', 'super_admin'].includes(user?.role)) {
      return res.status(403).json({ error: 'Notaires/admins uniquement' });
    }

    // Récupérer données complètes du dossier
    const { data: purchaseCase } = await supabase
      .from('purchase_cases')
      .select(`
        *,
        buyer:buyer_id (*),
        seller:seller_id (*),
        property:property_id (*),
        documents (*),
        transactions (*)
      `)
      .eq('id', caseId)
      .single();

    if (!purchaseCase) {
      return res.status(404).json({ error: 'Dossier non trouvé' });
    }

    // Analyse fraude multi-couches
    const fraudAnalysis = await FraudDetectionAI.analyzePurchaseCase(purchaseCase);

    // Sauvegarder résultat
    await supabase
      .from('purchase_cases')
      .update({
        fraud_risk_score: fraudAnalysis.riskScore,
        fraud_flags: fraudAnalysis.flags,
        fraud_analyzed_at: new Date().toISOString(),
      })
      .eq('id', caseId);

    // Si risque élevé, créer alerte
    if (fraudAnalysis.riskLevel === 'high' || fraudAnalysis.riskLevel === 'critical') {
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'fraud_alert',
        title: `⚠️ Risque fraude ${fraudAnalysis.riskLevel}`,
        message: `Dossier ${purchaseCase.case_number}: ${fraudAnalysis.flags.length} signaux détectés`,
        data: { caseId, riskScore: fraudAnalysis.riskScore },
        priority: 'high',
      });
    }

    res.json({
      success: true,
      fraudAnalysis,
    });

  } catch (error) {
    console.error('❌ Error fraud detection:', error);
    res.status(500).json({
      error: 'Erreur détection fraude',
      details: error.message,
    });
  }
});

/**
 * GET /api/ai/recommendations/:userId
 * Recommandations propriétés personnalisées
 */
router.get('/recommendations/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const requesterId = req.user.id;

    // Vérifier autorisation
    if (userId !== requesterId) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Récupérer profil user
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Récupérer historique (favoris, recherches, vues)
    const { data: favorites } = await supabase
      .from('favorites')
      .select('property_id, properties (*)')
      .eq('user_id', userId);

    const { data: searches } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Générer recommendations avec IA
    const recommendations = await RecommendationEngine.generateRecommendations({
      userId,
      profile,
      favorites: favorites?.map(f => f.properties) || [],
      searchHistory: searches || [],
    });

    res.json({
      success: true,
      recommendations,
      count: recommendations.length,
    });

  } catch (error) {
    console.error('❌ Error generating recommendations:', error);
    res.status(500).json({
      error: 'Erreur recommandations',
      details: error.message,
    });
  }
});

/**
 * POST /api/ai/evaluate-property
 * Évaluer prix propriété par IA
 */
router.post('/evaluate-property', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.body;

    // Récupérer propriété
    const { data: property } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (!property) {
      return res.status(404).json({ error: 'Propriété non trouvée' });
    }

    // Évaluation IA
    const evaluation = await TerangaAIService.evaluatePropertyPrice(property);

    // Sauvegarder
    await supabase
      .from('properties')
      .update({
        ai_estimated_price: evaluation.estimatedPrice,
        ai_price_confidence: evaluation.confidence,
        ai_price_range_min: evaluation.priceRange.min,
        ai_price_range_max: evaluation.priceRange.max,
        ai_evaluated_at: new Date().toISOString(),
      })
      .eq('id', propertyId);

    res.json({
      success: true,
      evaluation,
    });

  } catch (error) {
    console.error('❌ Error property evaluation:', error);
    res.status(500).json({
      error: 'Erreur évaluation propriété',
      details: error.message,
    });
  }
});

export default router;
