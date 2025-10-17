/**
 * Integration script pour connecter les demandes d'achat au nouveau système de workflow
 * Automatise la création de dossiers chronologiques à partir des pages de paiement
 * @author Teranga Foncier Team
 */

import PurchaseWorkflowService from './PurchaseWorkflowService';
import NotificationService from './NotificationService';
import { supabase } from '@/lib/supabaseClient';

export class PurchaseIntegrationService {
  /**
   * Créer automatiquement un dossier d'achat depuis une page de paiement
   * (OneTimePaymentPage, BankFinancingPage, InstallmentsPaymentPage)
   */
  static async createPurchaseCaseFromPayment(requestData, paymentMethod, additionalData = {}) {
    try {
      // Vérifier si un dossier existe déjà
      const { data: existingCase } = await supabase
        .from('purchase_cases')
        .select('id')
        .eq('request_id', requestData.request_id)
        .single();

      if (existingCase) {
        return { success: true, case: existingCase, message: 'Dossier existant' };
      }

      // Préparer les données du dossier d'achat
      const purchaseData = {
        request_id: requestData.request_id,
        buyer_id: requestData.user_id,
        seller_id: requestData.seller_id || null,
        parcelle_id: requestData.parcelle_id,
        purchase_price: requestData.offered_price || requestData.price,
        negotiated_price: additionalData.negotiated_price || null,
        payment_method: paymentMethod,
        metadata: {
          initiation_method: 'web_payment_form',
          payment_form_data: {
            payment_method: paymentMethod,
            verification_level: additionalData.verification_level,
            additional_services: additionalData.additional_services,
            insurance_included: additionalData.include_insurance,
            urgent_payment: additionalData.urgent_payment,
            payment_source: additionalData.payment_source
          },
          cost_breakdown: additionalData.cost_breakdown,
          original_request_data: requestData
        }
      };

      // Créer le dossier d'achat avec workflow
      const result = await PurchaseWorkflowService.createPurchaseCase(purchaseData);

      if (result.success) {
        console.log(`Dossier d'achat créé: ${result.case.id} pour la demande ${requestData.request_id}`);
        
        // Créer la transaction liée
        await this.createLinkedTransaction(result.case, requestData, additionalData);

        return { 
          success: true, 
          case: result.case,
          message: 'Dossier d\'achat créé avec succès'
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Erreur création dossier depuis paiement:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Créer une transaction liée au dossier d'achat
   */
  static async createLinkedTransaction(purchaseCase, requestData, additionalData) {
    try {
      const totalAmount = additionalData.cost_breakdown?.finalTotal || requestData.offered_price || 0;
      
      const transactionData = {
        user_id: purchaseCase.buyer_id,
        request_id: requestData.request_id,
        case_id: purchaseCase.id,
        status: 'pending',
        amount: totalAmount,
        currency: 'XOF',
        description: this.generateTransactionDescription(purchaseCase, additionalData),
        payment_method: purchaseCase.payment_method,
        metadata: {
          purchase_case_id: purchaseCase.id,
          payment_breakdown: additionalData.cost_breakdown,
          workflow_created: true,
          parcelle_info: requestData.parcelle_info
        }
      };

      const { error } = await supabase
        .from('transactions')
        .insert([transactionData]);

      if (error) throw error;

      console.log(`Transaction créée pour le dossier ${purchaseCase.id}`);
    } catch (error) {
      console.error('Erreur création transaction liée:', error);
    }
  }

  /**
   * Générer une description de transaction contextuelle
   */
  static generateTransactionDescription(purchaseCase, additionalData) {
    const paymentMethodLabels = {
      'one_time': 'Paiement comptant',
      'bank_financing': 'Financement bancaire',
      'installments': 'Paiement échelonné',
      'mixed': 'Paiement mixte'
    };

    let description = paymentMethodLabels[purchaseCase.payment_method] || 'Achat immobilier';
    
    if (additionalData.parcelle_title) {
      description += ` - ${additionalData.parcelle_title}`;
    }
    
    if (additionalData.parcelle_location) {
      description += ` (${additionalData.parcelle_location})`;
    }

    return description;
  }

  /**
   * Mettre à jour un dossier existant avec de nouvelles informations de paiement
   */
  static async updatePurchaseCaseWithPayment(caseId, paymentData, newStatus = null) {
    try {
      const updateData = {
        negotiated_price: paymentData.negotiated_price,
        last_updated: new Date().toISOString(),
        metadata: {
          ...paymentData.metadata,
          last_payment_update: new Date().toISOString()
        }
      };

      const { error } = await supabase
        .from('purchase_cases')
        .update(updateData)
        .eq('id', caseId);

      if (error) throw error;

      // Faire évoluer le statut si spécifié
      if (newStatus) {
        await PurchaseWorkflowService.updateCaseStatus(
          caseId, 
          newStatus, 
          'System', 
          'Mise à jour suite à modification de paiement'
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur mise à jour dossier:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Gérer l'abandon d'un processus de paiement
   */
  static async handlePaymentAbandonment(requestId, reason = 'Abandon utilisateur') {
    try {
      // Trouver le dossier lié
      const { data: purchaseCase } = await supabase
        .from('purchase_cases')
        .select('id, status')
        .eq('request_id', requestId)
        .single();

      if (purchaseCase && purchaseCase.status === 'initiated') {
        // Annuler le dossier s'il est encore au stade initial
        await PurchaseWorkflowService.updateCaseStatus(
          purchaseCase.id,
          'cancelled',
          'System',
          `Dossier annulé: ${reason}`
        );
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur gestion abandon:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer le statut d'un dossier depuis une demande
   * FIX: REST API cannot join auth.users directly, removed nested relationships
   */
  static async getPurchaseCaseFromRequest(requestId) {
    try {
      const { data: purchaseCase, error } = await supabase
        .from('purchase_cases')
        .select('*, parcelle:parcelle_id(*)')
        .eq('request_id', requestId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return { 
        success: true, 
        case: purchaseCase,
        exists: !!purchaseCase 
      };
    } catch (error) {
      console.error('Erreur récupération dossier:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Synchroniser les anciens requests avec le nouveau système
   */
  static async migrateExistingRequests() {
    try {
      console.log('Début migration des demandes existantes...');

      // Récupérer les demandes d'achat sans dossier associé
      const { data: requests, error } = await supabase
        .from('requests')
        .select('*')
        .in('type', ['one_time', 'installments', 'bank_financing'])
        .is('case_id', null);

      if (error) throw error;

      let migrated = 0;
      let errors = 0;

      for (const request of requests) {
        try {
          // Déterminer le payment_method depuis le type
          const paymentMethodMap = {
            'one_time': 'one_time',
            'installments': 'installments', 
            'bank_financing': 'bank_financing'
          };

          const purchaseData = {
            request_id: request.id,
            buyer_id: request.user_id,
            seller_id: null, // À déterminer depuis le contexte
            parcelle_id: request.parcelle_id,
            purchase_price: request.offered_price,
            payment_method: paymentMethodMap[request.type] || 'one_time',
            metadata: {
              migrated_from_old_system: true,
              original_request: request,
              migration_date: new Date().toISOString()
            }
          };

          const result = await PurchaseWorkflowService.createPurchaseCase(purchaseData);
          
          if (result.success) {
            // Lier la demande au nouveau dossier
            await supabase
              .from('requests')
              .update({ case_id: result.case.id })
              .eq('id', request.id);
            
            migrated++;
            console.log(`✅ Demande ${request.id} migrée vers dossier ${result.case.id}`);
          } else {
            errors++;
            console.error(`❌ Échec migration demande ${request.id}:`, result.error);
          }
        } catch (requestError) {
          errors++;
          console.error(`❌ Erreur migration demande ${request.id}:`, requestError);
        }
      }

      console.log(`Migration terminée: ${migrated} succès, ${errors} erreurs`);
      return { success: true, migrated, errors };
    } catch (error) {
      console.error('Erreur migration globale:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Helper pour intégrer facilement depuis les pages de paiement
   */
  static async integrateWithPaymentForm(formData, paymentMethod, context = {}) {
    try {
      // Créer la demande de base
      const requestData = {
        request_id: context.request_id || `REQ-${Date.now()}`,
        user_id: formData.user_id,
        type: paymentMethod,
        status: 'pending',
        parcelle_id: context.parcelleId,
        offered_price: formData.negotiated_price || formData.price,
        note: formData.note,
        metadata: formData.metadata
      };

      // Insérer la demande si elle n'existe pas
      let request;
      if (context.request_id) {
        const { data } = await supabase
          .from('requests')
          .select('*')
          .eq('id', context.request_id)
          .single();
        request = data;
      } else {
        const { data: newRequest, error } = await supabase
          .from('requests')
          .insert([requestData])
          .select()
          .single();
          
        if (error) throw error;
        request = newRequest;
      }

      // Créer le dossier d'achat avec workflow
      const caseResult = await this.createPurchaseCaseFromPayment(
        { ...request, request_id: request.id },
        paymentMethod,
        formData
      );

      return {
        success: true,
        request,
        case: caseResult.case,
        workflow_initiated: caseResult.success
      };
    } catch (error) {
      console.error('Erreur intégration formulaire paiement:', error);
      return { success: false, error: error.message };
    }
  }
}

export default PurchaseIntegrationService;