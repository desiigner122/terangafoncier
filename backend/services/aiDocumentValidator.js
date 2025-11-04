/**
 * @file aiDocumentValidator.js
 * @description Intégration IA pour validation automatique documents
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

const TerangaAIService = require('./TerangaAIService');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

class AIDocumentValidator {
  constructor() {
    this.aiService = TerangaAIService;
  }

  /**
   * Valider document automatiquement avec IA
   * @param {Object} documentData - Données document
   * @returns {Promise<Object>} - Résultat validation
   */
  async validateDocument(documentData) {
    try {
      const {
        documentId,
        documentType, // 'title_deed', 'building_permit', 'identity_card', 'tax_certificate'
        documentUrl,
        userId,
        caseId,
      } = documentData;

      console.log(`🤖 AI validating document ${documentId} (type: ${documentType})`);

      // 1. Analyser document avec TerangaAI
      const aiAnalysis = await this.aiService.validateDocument({
        document_url: documentUrl,
        document_type: documentType,
        user_id: userId,
      });

      // 2. Extraire résultats
      const {
        is_valid,
        confidence_score,
        issues,
        extracted_data,
        fraud_indicators,
        recommendations,
      } = aiAnalysis;

      // 3. Sauvegarder résultat validation
      const { data: validation, error } = await supabase
        .from('document_validations')
        .insert({
          document_id: documentId,
          case_id: caseId,
          validation_type: 'ai_automatic',
          status: is_valid ? 'approved' : 'rejected',
          confidence_score,
          ai_analysis: {
            is_valid,
            issues,
            extracted_data,
            fraud_indicators,
            recommendations,
          },
          validated_at: new Date().toISOString(),
          validated_by: 'ai_system',
        })
        .select()
        .single();

      if (error) throw error;

      // 4. Mettre à jour document
      await supabase
        .from('documents')
        .update({
          validation_status: is_valid ? 'validated' : 'rejected',
          ai_validated: true,
          ai_confidence: confidence_score,
          validation_notes: issues.length > 0 ? issues.join('; ') : 'Aucun problème détecté',
          updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);

      // 5. Si validation échoue (confidence < 70%), notifier notaire pour révision manuelle
      if (confidence_score < 0.7 || !is_valid) {
        await this.flagForManualReview(documentId, caseId, issues);
      }

      // 6. Si fraude détectée, alerte immédiate
      if (fraud_indicators && fraud_indicators.length > 0) {
        await this.createFraudAlert(documentId, caseId, userId, fraud_indicators);
      }

      console.log(`✅ AI validation complete: ${is_valid ? 'VALID' : 'INVALID'} (confidence: ${Math.round(confidence_score * 100)}%)`);

      return {
        success: true,
        validation,
        is_valid,
        confidence_score,
        requires_manual_review: confidence_score < 0.7 || !is_valid,
        fraud_detected: fraud_indicators && fraud_indicators.length > 0,
      };

    } catch (error) {
      console.error('❌ AI document validation error:', error);
      
      // En cas d'erreur IA, fallback sur révision manuelle
      await this.flagForManualReview(documentData.documentId, documentData.caseId, ['Erreur analyse IA']);
      
      throw error;
    }
  }

  /**
   * Valider tous les documents d'un dossier
   * @param {String} caseId - ID dossier
   */
  async validateCaseDocuments(caseId) {
    try {
      // Récupérer documents non validés
      const { data: documents, error } = await supabase
        .from('documents')
        .select('*')
        .eq('case_id', caseId)
        .in('validation_status', ['pending', 'submitted'])
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!documents || documents.length === 0) {
        return {
          success: true,
          message: 'Aucun document à valider',
          results: [],
        };
      }

      console.log(`🤖 Validating ${documents.length} documents for case ${caseId}`);

      const results = [];

      // Valider chaque document séquentiellement
      for (const doc of documents) {
        try {
          const result = await this.validateDocument({
            documentId: doc.id,
            documentType: doc.document_type,
            documentUrl: doc.file_url,
            userId: doc.uploaded_by,
            caseId,
          });

          results.push({
            documentId: doc.id,
            documentType: doc.document_type,
            ...result,
          });

          // Pause 2 secondes entre validations (rate limiting IA)
          await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
          console.error(`❌ Error validating document ${doc.id}:`, error);
          results.push({
            documentId: doc.id,
            documentType: doc.document_type,
            success: false,
            error: error.message,
          });
        }
      }

      // Calculer statistiques
      const stats = {
        total: results.length,
        approved: results.filter(r => r.is_valid).length,
        rejected: results.filter(r => !r.is_valid && r.success).length,
        manual_review: results.filter(r => r.requires_manual_review).length,
        fraud_detected: results.filter(r => r.fraud_detected).length,
        errors: results.filter(r => !r.success).length,
      };

      // Mettre à jour statut dossier
      if (stats.approved === stats.total) {
        await supabase
          .from('purchase_cases')
          .update({
            document_validation_status: 'all_validated',
            status: 'documents_valides',
            updated_at: new Date().toISOString(),
          })
          .eq('id', caseId);
      } else if (stats.manual_review > 0 || stats.fraud_detected > 0) {
        await supabase
          .from('purchase_cases')
          .update({
            document_validation_status: 'requires_review',
            status: 'verification_documents',
            updated_at: new Date().toISOString(),
          })
          .eq('id', caseId);
      }

      return {
        success: true,
        results,
        stats,
      };

    } catch (error) {
      console.error('❌ Error validating case documents:', error);
      throw error;
    }
  }

  /**
   * Marquer pour révision manuelle par notaire
   */
  async flagForManualReview(documentId, caseId, issues) {
    try {
      // Créer notification pour notaire
      const { data: purchaseCase } = await supabase
        .from('purchase_cases')
        .select('notaire_id')
        .eq('id', caseId)
        .single();

      if (purchaseCase?.notaire_id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: purchaseCase.notaire_id,
            type: 'document_review_required',
            title: 'Document nécessite révision manuelle',
            message: `IA demande révision: ${issues.join(', ')}`,
            related_case_id: caseId,
            related_document_id: documentId,
            priority: 'high',
          });
      }

      console.log(`⚠️ Document ${documentId} flagged for manual review`);

    } catch (error) {
      console.error('❌ Error flagging for manual review:', error);
    }
  }

  /**
   * Créer alerte fraude
   */
  async createFraudAlert(documentId, caseId, userId, fraudIndicators) {
    try {
      await supabase
        .from('fraud_alerts')
        .insert({
          case_id: caseId,
          user_id: userId,
          document_id: documentId,
          alert_type: 'document_fraud',
          severity: 'critical',
          indicators: fraudIndicators,
          status: 'open',
          detected_by: 'ai_system',
          detected_at: new Date().toISOString(),
        });

      // Notifier admins immédiatement
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .in('role', ['admin', 'super_admin']);

      if (admins) {
        const notifications = admins.map(admin => ({
          user_id: admin.id,
          type: 'fraud_alert',
          title: '🚨 ALERTE FRAUDE DÉTECTÉE',
          message: `Document suspect détecté: ${fraudIndicators.join(', ')}`,
          related_case_id: caseId,
          related_document_id: documentId,
          priority: 'critical',
        }));

        await supabase.from('notifications').insert(notifications);
      }

      console.log(`🚨 FRAUD ALERT created for document ${documentId}`);

    } catch (error) {
      console.error('❌ Error creating fraud alert:', error);
    }
  }

  /**
   * Extraire données structurées d'un document (OCR + parsing)
   */
  async extractDocumentData(documentUrl, documentType) {
    try {
      const extracted = await this.aiService.extractDocumentData({
        document_url: documentUrl,
        document_type: documentType,
      });

      return {
        success: true,
        data: extracted,
      };

    } catch (error) {
      console.error('❌ Error extracting document data:', error);
      throw error;
    }
  }

  /**
   * Comparer deux documents pour vérifier cohérence
   */
  async compareDocuments(doc1Url, doc2Url, comparisonType) {
    try {
      const comparison = await this.aiService.compareDocuments({
        document1_url: doc1Url,
        document2_url: doc2Url,
        comparison_type: comparisonType, // 'name_match', 'address_match', 'date_coherence'
      });

      return {
        success: true,
        is_coherent: comparison.is_match,
        confidence: comparison.confidence,
        differences: comparison.differences,
      };

    } catch (error) {
      console.error('❌ Error comparing documents:', error);
      throw error;
    }
  }
}

module.exports = new AIDocumentValidator();
