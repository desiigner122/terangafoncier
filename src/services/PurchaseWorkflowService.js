/**
 * Service de gestion du workflow d'achat immobilier
 * Gestion complète du processus depuis l'initiation jusqu'à la finalisation
 * 🔗 Intégration blockchain Teranga pour immutabilité
 * @author Teranga Foncier Team
 */

import { supabase } from '@/lib/supabaseClient';
import NotificationService from './NotificationService';
import { terangaBlockchain } from './TerangaBlockchainService';
import { logger } from '@/lib/logger';

export class PurchaseWorkflowService {
  // Définition des statuts et étapes du workflow
  static WORKFLOW_STATUSES = {
    // Phase 1: Initiation (0-24h)
    INITIATED: {
      key: 'initiated',
      label: 'Demande initiée',
      phase: 1,
      order: 1,
      description: 'L\'acheteur a initié une demande d\'achat',
      duration: '0-2h',
      nextStatuses: ['buyer_verification', 'cancelled', 'seller_declined', 'negotiation', 'preliminary_agreement'],
      color: 'blue',
      icon: 'FileText',
      automated: true
    },
    BUYER_VERIFICATION: {
      key: 'buyer_verification',
      label: 'Vérification acheteur',
      phase: 1,
      order: 2,
      description: 'Vérification des informations et documents de l\'acheteur',
      duration: '2-24h',
      nextStatuses: ['seller_notification', 'rejected'],
      color: 'yellow',
      icon: 'UserCheck',
      automated: true,
      requiredDocuments: ['identity_proof', 'income_proof', 'bank_statement']
    },
    SELLER_NOTIFICATION: {
      key: 'seller_notification',
      label: 'Notification vendeur',
      phase: 1,
      order: 3,
      description: 'Le vendeur a été informé de la demande d\'achat',
      duration: '0-1h',
      nextStatuses: ['negotiation', 'seller_declined'],
      color: 'purple',
      icon: 'Bell',
      automated: true
    },

    // Phase 2: Négociation (1-7 jours)
    NEGOTIATION: {
      key: 'negotiation',
      label: 'En négociation',
      phase: 2,
      order: 4,
      description: 'Négociation du prix et des conditions entre les parties',
      duration: '1-7 jours',
      nextStatuses: ['preliminary_agreement', 'negotiation_failed', 'seller_declined'],
      color: 'orange',
      icon: 'MessageSquare',
      manual: true
    },
    PRELIMINARY_AGREEMENT: {
      key: 'preliminary_agreement',
      label: 'Accord préliminaire',
      phase: 2,
      order: 5,
      description: 'Accord de principe sur le prix et les conditions',
      duration: '0-1h',
      nextStatuses: ['contract_preparation', 'seller_declined'],
      color: 'green',
      icon: 'Heart',
      manual: true,
      milestone: true
    },
    CONTRACT_PREPARATION: {
      key: 'contract_preparation',
      label: 'Préparation contrat',
      phase: 2,
      order: 6,
      description: 'Génération de l\'avant-contrat de vente',
      duration: '2-24h',
      nextStatuses: ['legal_verification'],
      color: 'indigo',
      icon: 'FileSignature',
      automated: true
    },

    // Phase 3: Vérifications (3-15 jours)
    LEGAL_VERIFICATION: {
      key: 'legal_verification',
      label: 'Contrôle juridique',
      phase: 3,
      order: 7,
      description: 'Vérification de la légalité du bien et des documents',
      duration: '2-5 jours',
      nextStatuses: ['document_audit', 'legal_issues_found'],
      color: 'red',
      icon: 'Scale',
      manual: true,
      requiredDocuments: ['title_deed', 'land_certificate', 'tax_clearance']
    },
    DOCUMENT_AUDIT: {
      key: 'document_audit',
      label: 'Audit documentaire',
      phase: 3,
      order: 8,
      description: 'Vérification complète de tous les documents',
      duration: '1-3 jours',
      nextStatuses: ['property_evaluation'],
      color: 'cyan',
      icon: 'FileCheck',
      manual: true
    },
    PROPERTY_EVALUATION: {
      key: 'property_evaluation',
      label: 'Expertise terrain',
      phase: 3,
      order: 9,
      description: 'Évaluation professionnelle du terrain',
      duration: '3-7 jours',
      nextStatuses: ['notary_appointment'],
      color: 'emerald',
      icon: 'MapPin',
      manual: true,
      milestone: true
    },

    // Phase 4: Finalisation (5-10 jours)
    NOTARY_APPOINTMENT: {
      key: 'notary_appointment',
      label: 'RDV notaire programmé',
      phase: 4,
      order: 10,
      description: 'Rendez-vous chez le notaire programmé',
      duration: '1-3 jours',
      nextStatuses: ['signing_process'],
      color: 'violet',
      icon: 'Calendar',
      manual: true
    },
    SIGNING_PROCESS: {
      key: 'signing_process',
      label: 'Signature en cours',
      phase: 4,
      order: 11,
      description: 'Signature de l\'acte de vente chez le notaire',
      duration: '1-2h',
      nextStatuses: ['payment_processing'],
      color: 'pink',
      icon: 'PenTool',
      manual: true,
      milestone: true
    },
    PAYMENT_PROCESSING: {
      key: 'payment_processing',
      label: 'Traitement paiement',
      phase: 4,
      order: 12,
      description: 'Traitement du paiement final',
      duration: '1-24h',
      nextStatuses: ['property_transfer'],
      color: 'green',
      icon: 'CreditCard',
      automated: true
    },
    PROPERTY_TRANSFER: {
      key: 'property_transfer',
      label: 'Transfert propriété',
      phase: 4,
      order: 13,
      description: 'Transfert officiel de la propriété',
      duration: '1-3 jours',
      nextStatuses: ['completed'],
      color: 'blue',
      icon: 'ArrowRightLeft',
      automated: true
    },
    COMPLETED: {
      key: 'completed',
      label: 'Finalisé',
      phase: 4,
      order: 14,
      description: 'Transaction complètement finalisée',
      duration: 'Terminé',
      nextStatuses: [],
      color: 'green',
      icon: 'CheckCircle',
      final: true,
      milestone: true
    },

    // Statuts d'échec
    CANCELLED: {
      key: 'cancelled',
      label: 'Annulé',
      phase: 0,
      order: 99,
      description: 'Dossier annulé par l\'acheteur',
      color: 'gray',
      icon: 'X',
      final: true
    },
    REJECTED: {
      key: 'rejected',
      label: 'Rejeté',
      phase: 0,
      order: 98,
      description: 'Demande rejetée suite à la vérification',
      color: 'red',
      icon: 'XCircle',
      final: true
    },
    SELLER_DECLINED: {
      key: 'seller_declined',
      label: 'Refusé par vendeur',
      phase: 0,
      order: 97,
      description: 'Le vendeur a refusé la demande',
      color: 'red',
      icon: 'UserMinus',
      final: true
    },
    NEGOTIATION_FAILED: {
      key: 'negotiation_failed',
      label: 'Négociation échouée',
      phase: 0,
      order: 96,
      description: 'Impossible de s\'entendre sur les conditions',
      color: 'red',
      icon: 'AlertTriangle',
      final: true
    },
    LEGAL_ISSUES_FOUND: {
      key: 'legal_issues_found',
      label: 'Problèmes juridiques',
      phase: 0,
      order: 95,
      description: 'Problèmes juridiques bloquants identifiés',
      color: 'red',
      icon: 'AlertTriangle',
      final: true
    }
  };

  // Types de documents requis
  static REQUIRED_DOCUMENTS = {
    identity_proof: { name: 'Pièce d\'identité', required: true },
    income_proof: { name: 'Justificatif de revenus', required: true },
    bank_statement: { name: 'Relevé bancaire', required: true },
    title_deed: { name: 'Titre foncier', required: true },
    land_certificate: { name: 'Certificat de propriété', required: true },
    tax_clearance: { name: 'Quitus fiscal', required: true },
    survey_report: { name: 'Rapport d\'arpentage', required: false },
    insurance_policy: { name: 'Police d\'assurance', required: false }
  };

  /**
   * Créer un nouveau dossier d'achat avec workflow
   */
  static async createPurchaseCase(purchaseData) {
    try {
      const { data: existingCase, error: checkError } = await supabase
        .from('purchase_cases')
        .select('id')
        .eq('request_id', purchaseData.request_id)
        .single();

      if (!checkError && existingCase) {
        return { success: false, error: 'Un dossier existe déjà pour cette demande' };
      }

      // Créer le dossier principal
      const caseData = {
        request_id: purchaseData.request_id,
        buyer_id: purchaseData.buyer_id,
        seller_id: purchaseData.seller_id,
        parcelle_id: purchaseData.parcelle_id,
        purchase_price: purchaseData.purchase_price,
        payment_method: purchaseData.payment_method,
        status: 'initiated',
        phase: 1,
        created_at: new Date().toISOString(),
        metadata: {
          initiation_method: purchaseData.initiation_method || 'web',
          browser_info: purchaseData.browser_info || null,
          initial_offer: purchaseData.initial_offer || null
        }
      };

      const { data: newCase, error: caseError } = await supabase
        .from('purchase_cases')
        .insert([caseData])
        .select()
        .single();

      if (caseError) throw caseError;

      // 🔗 ENREGISTREMENT BLOCKCHAIN: Création du dossier
      try {
        await terangaBlockchain.createPropertyCase({
          id: newCase.id,
          case_number: newCase.case_number,
          property_id: newCase.parcelle_id,
          buyer_id: newCase.buyer_id,
          seller_id: newCase.seller_id,
          status: newCase.status,
          purchase_price: newCase.purchase_price,
          property_details: purchaseData.property_details || {},
          ...newCase
        });
        logger.debug('🔗 Dossier enregistré sur blockchain Teranga');
      } catch (blockchainError) {
        logger.warn('⚠️ Erreur blockchain (dossier créé quand même):', blockchainError);
      }

      // Créer l'entrée historique initiale
      await this.addWorkflowHistory(newCase.id, 'initiated', 'System', 'Dossier d\'achat créé automatiquement');

      // Déclencher les étapes automatiques
      await this.processAutomatedSteps(newCase.id);

      return { success: true, case: newCase };
    } catch (error) {
      logger.error('Erreur création dossier d\'achat:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour le statut d'un dossier
   */
  static async updateCaseStatus(caseId, newStatus, updatedBy, notes = '', attachments = []) {
    try {
      const statusInfo = this.WORKFLOW_STATUSES[newStatus.toUpperCase()];
      if (!statusInfo) {
        throw new Error(`Statut invalide: ${newStatus}`);
      }

      // Vérifier que la transition est valide
      const { data: currentCase, error: fetchError } = await supabase
        .from('purchase_cases')
        .select('status, phase')
        .eq('id', caseId)
        .single();

      if (fetchError) throw fetchError;

      const currentStatusInfo = this.WORKFLOW_STATUSES[currentCase.status.toUpperCase()];
      if (currentStatusInfo && !currentStatusInfo.nextStatuses.includes(newStatus)) {
        throw new Error(`Transition invalide de ${currentCase.status} vers ${newStatus}`);
      }

      // Mettre à jour le dossier
      const { error: updateError } = await supabase
        .from('purchase_cases')
        .update({
          status: newStatus,
          phase: statusInfo.phase,
          last_updated: new Date().toISOString(),
          updated_by: updatedBy
        })
        .eq('id', caseId);

      if (updateError) throw updateError;

      // 🔗 ENREGISTREMENT BLOCKCHAIN: Changement de statut
      try {
        await terangaBlockchain.recordStatusUpdate(
          caseId,
          currentCase.status,
          newStatus,
          updatedBy,
          { notes, attachments_count: attachments.length }
        );
        logger.debug(`🔗 Changement statut enregistré sur blockchain: ${currentCase.status} → ${newStatus}`);
      } catch (blockchainError) {
        logger.warn('⚠️ Erreur blockchain (changement de statut effectué):', blockchainError);
      }

      // Ajouter à l'historique
      await this.addWorkflowHistory(caseId, newStatus, updatedBy, notes, attachments);

      // Déclencher les notifications
      await this.triggerNotifications(caseId, newStatus);

      // Traiter les étapes automatiques suivantes
      if (statusInfo.automated) {
        await this.processAutomatedSteps(caseId);
      }

      return { success: true };
    } catch (error) {
      logger.error('Erreur mise à jour statut:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Ajouter une entrée à l'historique du workflow
   */
  static async addWorkflowHistory(caseId, status, updatedBy, notes, attachments = []) {
    try {
      const historyEntry = {
        case_id: caseId,
        status,
        updated_by: updatedBy,
        notes,
        attachments,
        created_at: new Date().toISOString(),
        metadata: {
          status_info: this.WORKFLOW_STATUSES[status.toUpperCase()],
          timestamp: Date.now()
        }
      };

      const { error } = await supabase
        .from('purchase_case_history')
        .insert([historyEntry]);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      logger.error('Erreur ajout historique:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Traiter les étapes automatiques
   */
  static async processAutomatedSteps(caseId) {
    try {
      const { data: caseData, error: fetchError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (fetchError) throw fetchError;

      const currentStatus = this.WORKFLOW_STATUSES[caseData.status.toUpperCase()];
      
      // Traitement automatique selon le statut
      switch (caseData.status) {
        case 'initiated':
          // Passer automatiquement à la vérification de l'acheteur
          setTimeout(() => {
            this.updateCaseStatus(caseId, 'buyer_verification', 'System', 'Vérification automatique de l\'acheteur initiée');
          }, 2000);
          break;

        case 'buyer_verification':
          // Simuler la vérification (en réalité, cela devrait être plus complexe)
          setTimeout(() => {
            this.updateCaseStatus(caseId, 'seller_notification', 'System', 'Vérification acheteur réussie, notification du vendeur');
          }, 5000);
          break;

        case 'seller_notification':
          // Notification automatique au vendeur
          setTimeout(() => {
            this.updateCaseStatus(caseId, 'negotiation', 'System', 'Vendeur informé, négociation ouverte');
          }, 1000);
          break;

        case 'contract_preparation':
          // Génération automatique du contrat
          setTimeout(() => {
            this.updateCaseStatus(caseId, 'legal_verification', 'System', 'Contrat généré, début des vérifications juridiques');
          }, 10000);
          break;

        case 'payment_processing':
          // Traitement automatique du paiement
          setTimeout(() => {
            this.updateCaseStatus(caseId, 'property_transfer', 'System', 'Paiement traité avec succès');
          }, 5000);
          break;

        case 'property_transfer':
          // Finalisation automatique
          setTimeout(() => {
            this.updateCaseStatus(caseId, 'completed', 'System', 'Transfert de propriété finalisé');
          }, 3000);
          break;
      }
    } catch (error) {
      logger.error('Erreur traitement automatique:', error);
    }
  }

  /**
   * Déclencher les notifications
   */
  static async triggerNotifications(caseId, status) {
    try {
      // Utiliser le nouveau service de notifications
      const result = await NotificationService.sendWorkflowNotifications(caseId, status);
      
      if (result.success) {
        logger.debug(`Notifications envoyées pour le dossier ${caseId}, statut ${status}: ${result.sent} notifications`);
      } else {
        logger.error('Erreur envoi notifications:', result.error);
      }

      return result;
    } catch (error) {
      logger.error('Erreur notifications workflow:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer les détails complets d'un dossier
   */
  static async getCaseDetails(caseId) {
    try {
      const { data: caseData, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*, parcelle:parcelle_id(*), request:request_id(*)')
        .eq('id', caseId)
        .single();

      if (caseError) throw caseError;

      const { data: history, error: historyError } = await supabase
        .from('purchase_case_history')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false }).limit(500);

      if (historyError) throw historyError;

      const { data: documents, error: docsError } = await supabase
        .from('purchase_case_documents')
        .select('*')
        .eq('case_id', caseId).limit(500);

      if (docsError) throw docsError;

      return {
        success: true,
        case: {
          ...caseData,
          history: history || [],
          documents: documents || [],
          current_status_info: this.WORKFLOW_STATUSES[caseData.status.toUpperCase()],
          progress_percentage: this.calculateProgress(caseData.status),
          estimated_completion: this.estimateCompletion(caseData.status, caseData.created_at)
        }
      };
    } catch (error) {
      logger.error('Erreur récupération dossier:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculer le pourcentage de progression
   */
  static calculateProgress(currentStatus) {
    const statusInfo = this.WORKFLOW_STATUSES[currentStatus.toUpperCase()];
    if (!statusInfo) return 0;

    const totalSteps = 14; // Nombre total d'étapes
    return Math.round((statusInfo.order / totalSteps) * 100);
  }

  /**
   * Estimer la date de finalisation
   */
  static estimateCompletion(currentStatus, createdAt) {
    const statusInfo = this.WORKFLOW_STATUSES[currentStatus.toUpperCase()];
    if (!statusInfo || statusInfo.final) return null;

    const createdDate = new Date(createdAt);
    const totalDaysEstimate = 30; // 30 jours en moyenne pour un achat complet
    const completionDate = new Date(createdDate.getTime() + (totalDaysEstimate * 24 * 60 * 60 * 1000));
    
    return completionDate.toISOString();
  }

  /**
   * Obtenir les statistiques des dossiers
   */
  static async getCaseStatistics(userId, userRole) {
    try {
      let query = supabase.from('purchase_cases').select('status, phase, created_at').limit(500);
      
      if (userRole === 'buyer') {
        query = query.eq('buyer_id', userId);
      } else if (userRole === 'seller') {
        query = query.eq('seller_id', userId);
      }

      const { data: cases, error } = await query;
      if (error) throw error;

      const stats = {
        total: cases.length,
        by_phase: { 1: 0, 2: 0, 3: 0, 4: 0 },
        by_status: {},
        completed: 0,
        active: 0,
        average_duration: 0
      };

      cases.forEach(caseItem => {
        stats.by_phase[caseItem.phase] = (stats.by_phase[caseItem.phase] || 0) + 1;
        stats.by_status[caseItem.status] = (stats.by_status[caseItem.status] || 0) + 1;
        
        if (caseItem.status === 'completed') {
          stats.completed++;
        } else if (!['cancelled', 'rejected', 'seller_declined', 'negotiation_failed', 'legal_issues_found'].includes(caseItem.status)) {
          stats.active++;
        }
      });

      return { success: true, stats };
    } catch (error) {
      logger.error('Erreur statistiques:', error);
      return { success: false, error: error.message };
    }
  }

  // ========================
  // 🔗 MÉTHODES BLOCKCHAIN
  // ========================

  /**
   * Enregistrer l'upload d'un document sur blockchain
   */
  static async uploadDocumentWithBlockchain(caseId, documentData, userId) {
    try {
      // Upload normal du document
      const { data: uploadedDoc, error: uploadError } = await supabase
        .from('purchase_case_documents')
        .insert({
          case_id: caseId,
          name: documentData.name,
          type: documentData.type,
          size: documentData.size,
          url: documentData.url,
          uploaded_by: userId,
          status: 'pending'
        })
        .select()
        .single();

      if (uploadError) throw uploadError;

      // 🔗 ENREGISTREMENT BLOCKCHAIN: Upload document
      try {
        await terangaBlockchain.recordDocumentUpload(caseId, documentData, userId);
        logger.debug(`🔗 Document enregistré sur blockchain: ${documentData.name}`);
      } catch (blockchainError) {
        logger.warn('⚠️ Erreur blockchain (document uploadé):', blockchainError);
      }

      return { success: true, document: uploadedDoc };
    } catch (error) {
      logger.error('Erreur upload document:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Vérifier l'intégrité d'un dossier sur blockchain
   */
  static async verifyBlockchainIntegrity(caseId) {
    try {
      const integrity = await terangaBlockchain.verifyCaseIntegrity(caseId);
      return {
        success: true,
        integrity: {
          ...integrity,
          is_valid: integrity.integrity_score >= 95,
          confidence_level: integrity.integrity_score >= 99 ? 'Très élevée' : 
                           integrity.integrity_score >= 95 ? 'Élevée' : 
                           integrity.integrity_score >= 80 ? 'Moyenne' : 'Faible'
        }
      };
    } catch (error) {
      logger.error('Erreur vérification blockchain:', error);
      return { success: false, error: error.message };
    }
  }
}

export default PurchaseWorkflowService;