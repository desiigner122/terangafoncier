/**
 * Service de calcul des frais de notaire
 * Calcule les frais selon la réglementation sénégalaise
 * 
 * Frais standard:
 * - Droits d'enregistrement: 10%
 * - Honoraires notaire: 5%
 * - Taxes et timbres: 2.5%
 * - Total: 17.5% du prix de vente
 */

import { supabase } from '@/lib/supabaseClient';

export class NotaryFeesCalculator {
  // Taux standard (%)
  static RATES = {
    REGISTRATION_FEES: 0.10,    // Droits d'enregistrement (10%)
    NOTARY_FEES: 0.05,          // Honoraires notaire (5%)
    TAXES_STAMPS: 0.025,        // Taxes et timbres (2.5%)
    DEPOSIT: 0.10,              // Arrhes (10%)
  };

  /**
   * Calculer tous les frais de notaire
   * @param {number} purchasePrice - Prix de vente de la propriété
   * @returns {Object} Détails des frais
   */
  static calculateNotaryFees(purchasePrice) {
    if (!purchasePrice || purchasePrice <= 0) {
      throw new Error('Prix de vente invalide');
    }

    const registrationFees = Math.round(purchasePrice * this.RATES.REGISTRATION_FEES);
    const notaryFees = Math.round(purchasePrice * this.RATES.NOTARY_FEES);
    const taxesStamps = Math.round(purchasePrice * this.RATES.TAXES_STAMPS);
    const total = registrationFees + notaryFees + taxesStamps;

    return {
      purchase_price: purchasePrice,
      registration_fees: registrationFees,
      registration_fees_percentage: this.RATES.REGISTRATION_FEES * 100,
      notary_fees: notaryFees,
      notary_fees_percentage: this.RATES.NOTARY_FEES * 100,
      taxes_stamps: taxesStamps,
      taxes_stamps_percentage: this.RATES.TAXES_STAMPS * 100,
      total: total,
      total_percentage: (total / purchasePrice) * 100,
      breakdown: {
        'Droits d\'enregistrement': registrationFees,
        'Honoraires notaire': notaryFees,
        'Taxes et timbres': taxesStamps
      }
    };
  }

  /**
   * Calculer le montant des arrhes
   * @param {number} purchasePrice - Prix de vente
   * @returns {Object} Détails des arrhes
   */
  static calculateDeposit(purchasePrice) {
    if (!purchasePrice || purchasePrice <= 0) {
      throw new Error('Prix de vente invalide');
    }

    const deposit = Math.round(purchasePrice * this.RATES.DEPOSIT);
    
    return {
      purchase_price: purchasePrice,
      deposit: deposit,
      deposit_percentage: this.RATES.DEPOSIT * 100,
      remaining_balance: purchasePrice - deposit,
      breakdown: {
        'Arrhes (10%)': deposit,
        'Solde restant': purchasePrice - deposit
      }
    };
  }

  /**
   * Calculer le solde final à payer
   * @param {number} purchasePrice - Prix de vente total
   * @param {number} depositPaid - Montant des arrhes déjà versées
   * @returns {Object} Détails du solde
   */
  static calculateFinalPayment(purchasePrice, depositPaid = 0) {
    if (!purchasePrice || purchasePrice <= 0) {
      throw new Error('Prix de vente invalide');
    }

    const balance = purchasePrice - depositPaid;

    return {
      purchase_price: purchasePrice,
      deposit_paid: depositPaid,
      final_balance: balance,
      percentage_paid: (depositPaid / purchasePrice) * 100,
      percentage_remaining: (balance / purchasePrice) * 100,
      breakdown: {
        'Prix total': purchasePrice,
        'Arrhes versées': depositPaid,
        'Solde à payer': balance
      }
    };
  }

  /**
   * Calculer tous les coûts totaux de la transaction
   * @param {number} purchasePrice - Prix de vente
   * @returns {Object} Coûts totaux
   */
  static calculateTotalTransactionCost(purchasePrice) {
    const notaryFees = this.calculateNotaryFees(purchasePrice);
    const deposit = this.calculateDeposit(purchasePrice);

    return {
      purchase_price: purchasePrice,
      notary_fees_total: notaryFees.total,
      deposit_amount: deposit.deposit,
      total_buyer_cost: purchasePrice + notaryFees.total,
      breakdown: {
        'Prix de vente': purchasePrice,
        'Frais de notaire': notaryFees.total,
        'Total à payer': purchasePrice + notaryFees.total
      },
      payment_schedule: {
        'Arrhes (à verser immédiatement)': deposit.deposit,
        'Frais de notaire (avant signature)': notaryFees.total,
        'Solde du prix (à la signature)': deposit.remaining_balance
      }
    };
  }

  /**
   * Formatter un montant en FCFA
   * @param {number} amount - Montant à formater
   * @returns {string} Montant formaté
   */
  static formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  }

  /**
   * Créer une demande de paiement dans la base de données
   * @param {Object} params - Paramètres de la demande
   * @returns {Promise<Object>} Demande créée
   */
  static async createPaymentRequest({
    caseId,
    requestType, // 'deposit', 'notary_fees', 'final_payment'
    payerId,
    payerRole = 'buyer',
    notaryId,
    purchasePrice,
    description,
    instructions,
    dueDate
  }) {
    try {
      let amount, breakdown;

      // Calculer selon le type
      switch (requestType) {
        case 'deposit':
          const depositCalc = this.calculateDeposit(purchasePrice);
          amount = depositCalc.deposit;
          breakdown = {
            deposit_percentage: depositCalc.deposit_percentage,
            total: amount
          };
          break;

        case 'notary_fees':
          const feesCalc = this.calculateNotaryFees(purchasePrice);
          amount = feesCalc.total;
          breakdown = {
            registration_fees: feesCalc.registration_fees,
            notary_fees: feesCalc.notary_fees,
            taxes_stamps: feesCalc.taxes_stamps,
            total: amount
          };
          break;

        case 'final_payment':
          // Récupérer le montant des arrhes déjà versées
          const { data: depositRequest } = await supabase
            .from('notary_payment_requests')
            .select('amount')
            .eq('case_id', caseId)
            .eq('request_type', 'deposit')
            .eq('status', 'paid')
            .maybeSingle();

          const depositPaid = depositRequest?.amount || 0;
          const finalCalc = this.calculateFinalPayment(purchasePrice, depositPaid);
          amount = finalCalc.final_balance;
          breakdown = {
            purchase_price: purchasePrice,
            deposit_paid: depositPaid,
            final_balance: amount
          };
          break;

        default:
          throw new Error(`Type de paiement invalide: ${requestType}`);
      }

      // Créer la demande
      const { data, error } = await supabase
        .from('notary_payment_requests')
        .insert({
          case_id: caseId,
          request_type: requestType,
          amount: amount,
          breakdown: breakdown,
          payer_id: payerId,
          payer_role: payerRole,
          notary_id: notaryId,
          description: description || this.getDefaultDescription(requestType),
          instructions: instructions,
          due_date: dueDate,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ [NOTARY FEES] Demande de paiement créée:', data.id);
      return { success: true, data };

    } catch (error) {
      console.error('❌ [NOTARY FEES] Erreur création demande:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtenir une description par défaut selon le type
   * @param {string} requestType - Type de paiement
   * @returns {string} Description
   */
  static getDefaultDescription(requestType) {
    const descriptions = {
      deposit: 'Versement des arrhes (10% du prix de vente)',
      notary_fees: 'Paiement des frais de notaire (droits, honoraires, taxes)',
      final_payment: 'Paiement du solde du prix de vente'
    };
    return descriptions[requestType] || 'Paiement requis';
  }

  /**
   * Obtenir toutes les demandes de paiement pour un dossier
   * @param {string} caseId - ID du dossier
   * @returns {Promise<Array>} Liste des demandes
   */
  static async getPaymentRequests(caseId) {
    try {
      const { data, error } = await supabase
        .from('notary_payment_requests')
        .select('*')
        .eq('case_id', caseId)
        .order('requested_at', { ascending: true });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('❌ [NOTARY FEES] Erreur chargement demandes:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * Obtenir les demandes de paiement en attente pour un utilisateur
   * @param {string} userId - ID de l'utilisateur (payer)
   * @returns {Promise<Array>} Liste des demandes en attente
   */
  static async getPendingPaymentRequests(userId) {
    try {
      const { data, error } = await supabase
        .from('notary_payment_requests')
        .select(`
          *,
          purchase_cases (
            case_number,
            status,
            buyer_id,
            seller_id
          )
        `)
        .eq('payer_id', userId)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('❌ [NOTARY FEES] Erreur chargement demandes en attente:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * Marquer une demande comme payée
   * @param {string} requestId - ID de la demande
   * @param {Object} paymentDetails - Détails du paiement
   * @returns {Promise<Object>} Résultat
   */
  static async markAsPaid(requestId, paymentDetails = {}) {
    try {
      const { data, error } = await supabase
        .from('notary_payment_requests')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString(),
          payment_method: paymentDetails.payment_method,
          transaction_reference: paymentDetails.transaction_reference,
          payment_proof_url: paymentDetails.payment_proof_url
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ [NOTARY FEES] Demande marquée comme payée:', requestId);
      return { success: true, data };

    } catch (error) {
      console.error('❌ [NOTARY FEES] Erreur mise à jour paiement:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Annuler une demande de paiement
   * @param {string} requestId - ID de la demande
   * @param {string} reason - Raison de l'annulation
   * @returns {Promise<Object>} Résultat
   */
  static async cancelPaymentRequest(requestId, reason = null) {
    try {
      const { data, error } = await supabase
        .from('notary_payment_requests')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          notary_notes: reason
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ [NOTARY FEES] Demande annulée:', requestId);
      return { success: true, data };

    } catch (error) {
      console.error('❌ [NOTARY FEES] Erreur annulation:', error);
      return { success: false, error: error.message };
    }
  }
}

export default NotaryFeesCalculator;
