import { supabase } from '@/lib/supabaseClient';

/**
 * PaymentGatewayService - Service d'intégration des passerelles de paiement
 * 
 * Supporte :
 * - Wave Money (Sénégal)
 * - Orange Money (Sénégal)
 * - Virements bancaires
 * - Cartes bancaires (via Stripe/PayTech)
 * 
 * Phase 4 : Intégration réelle des APIs
 * Pour Phase 3, les paiements sont simulés
 */
class PaymentGatewayService {
  // =====================================================
  // CONFIGURATION - Variables d'environnement
  // =====================================================
  
  // Wave API Configuration
  static WAVE_API_URL = import.meta.env.VITE_WAVE_API_URL || 'https://api.wave.com/v1';
  static WAVE_API_KEY = import.meta.env.VITE_WAVE_API_KEY || '';
  static WAVE_SECRET_KEY = import.meta.env.VITE_WAVE_SECRET_KEY || '';
  
  // Orange Money API Configuration
  static ORANGE_API_URL = import.meta.env.VITE_ORANGE_API_URL || 'https://api.orange.com/orange-money-webpay/sl/v1';
  static ORANGE_MERCHANT_KEY = import.meta.env.VITE_ORANGE_MERCHANT_KEY || '';
  static ORANGE_CLIENT_ID = import.meta.env.VITE_ORANGE_CLIENT_ID || '';
  static ORANGE_CLIENT_SECRET = import.meta.env.VITE_ORANGE_CLIENT_SECRET || '';
  
  // PayTech (cartes bancaires) Configuration
  static PAYTECH_API_URL = import.meta.env.VITE_PAYTECH_API_URL || 'https://paytech.sn/api/payment';
  static PAYTECH_API_KEY = import.meta.env.VITE_PAYTECH_API_KEY || '';
  static PAYTECH_API_SECRET = import.meta.env.VITE_PAYTECH_API_SECRET || '';
  
  // Webhook URLs
  static WEBHOOK_BASE_URL = import.meta.env.VITE_WEBHOOK_BASE_URL || window.location.origin;
  static SUCCESS_URL = `${window.location.origin}/payment/success`;
  static CANCEL_URL = `${window.location.origin}/payment/cancel`;
  static WEBHOOK_URL = `${this.WEBHOOK_BASE_URL}/api/webhooks/payment`;

  // =====================================================
  // WAVE MONEY INTEGRATION
  // =====================================================

  /**
   * Initier un paiement Wave
   * Documentation: https://developers.wave.com/docs
   * 
   * @param {Object} transaction - Détails de la transaction
   * @returns {Object} { success, data, error }
   */
  static async initiateWavePayment(transaction) {
    try {
      console.log('💳 [WAVE] Initiation paiement:', transaction);

      // Vérifier que les clés API sont configurées
      if (!this.WAVE_API_KEY) {
        throw new Error('Wave API Key non configurée. Ajoutez VITE_WAVE_API_KEY dans .env');
      }

      // Créer la transaction dans notre DB d'abord
      const { data: dbTransaction, error: dbError } = await supabase
        .from('payment_transactions')
        .insert({
          notary_request_id: transaction.notary_request_id,
          case_id: transaction.case_id,
          amount: transaction.amount,
          payment_method: 'wave',
          status: 'pending',
          payer_id: transaction.payer_id,
          metadata: {
            wave_initiated: true,
            initiated_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Appel à l'API Wave
      const waveResponse = await fetch(`${this.WAVE_API_URL}/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.WAVE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: transaction.amount,
          currency: 'XOF', // Franc CFA
          error_url: this.CANCEL_URL,
          success_url: this.SUCCESS_URL,
          webhook_url: this.WEBHOOK_URL,
          metadata: {
            transaction_id: dbTransaction.id,
            notary_request_id: transaction.notary_request_id,
            case_id: transaction.case_id,
            payer_id: transaction.payer_id
          }
        })
      });

      const waveData = await waveResponse.json();

      if (!waveResponse.ok) {
        throw new Error(waveData.message || 'Erreur Wave API');
      }

      // Mettre à jour la transaction avec l'ID Wave
      await supabase
        .from('payment_transactions')
        .update({
          external_transaction_id: waveData.id,
          payment_url: waveData.wave_launch_url,
          metadata: {
            ...dbTransaction.metadata,
            wave_session_id: waveData.id,
            wave_launch_url: waveData.wave_launch_url
          }
        })
        .eq('id', dbTransaction.id);

      console.log('✅ [WAVE] Paiement initié:', waveData);

      return {
        success: true,
        data: {
          transaction_id: dbTransaction.id,
          wave_session_id: waveData.id,
          payment_url: waveData.wave_launch_url,
          qr_code: waveData.qrcode // QR code pour scanner avec l'app Wave
        }
      };
    } catch (error) {
      console.error('❌ [WAVE] Erreur:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Vérifier le statut d'un paiement Wave
   * 
   * @param {string} waveSessionId - ID de session Wave
   * @returns {Object} { success, status, data }
   */
  static async checkWavePaymentStatus(waveSessionId) {
    try {
      const response = await fetch(`${this.WAVE_API_URL}/checkout/sessions/${waveSessionId}`, {
        headers: {
          'Authorization': `Bearer ${this.WAVE_API_KEY}`
        }
      });

      const data = await response.json();

      return {
        success: true,
        status: data.status, // 'pending', 'success', 'failed', 'cancelled'
        data
      };
    } catch (error) {
      console.error('❌ [WAVE] Erreur vérification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =====================================================
  // ORANGE MONEY INTEGRATION
  // =====================================================

  /**
   * Obtenir un token OAuth Orange Money
   * Requis avant chaque paiement
   */
  static async getOrangeAccessToken() {
    try {
      const response = await fetch(`${this.ORANGE_API_URL}/oauth/v3/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.ORANGE_CLIENT_ID}:${this.ORANGE_CLIENT_SECRET}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('❌ [ORANGE] Erreur token:', error);
      throw error;
    }
  }

  /**
   * Initier un paiement Orange Money
   * Documentation: https://developer.orange.com/apis/orange-money-webpay
   * 
   * @param {Object} transaction - Détails de la transaction
   * @returns {Object} { success, data, error }
   */
  static async initiateOrangeMoneyPayment(transaction) {
    try {
      console.log('🟠 [ORANGE] Initiation paiement:', transaction);

      if (!this.ORANGE_MERCHANT_KEY) {
        throw new Error('Orange Money API non configurée. Ajoutez VITE_ORANGE_MERCHANT_KEY dans .env');
      }

      // Obtenir token OAuth
      const accessToken = await this.getOrangeAccessToken();

      // Créer la transaction dans notre DB
      const { data: dbTransaction, error: dbError } = await supabase
        .from('payment_transactions')
        .insert({
          notary_request_id: transaction.notary_request_id,
          case_id: transaction.case_id,
          amount: transaction.amount,
          payment_method: 'orange_money',
          status: 'pending',
          payer_id: transaction.payer_id,
          metadata: {
            orange_initiated: true,
            initiated_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Appel API Orange Money
      const orderNumber = `TF-${Date.now()}-${dbTransaction.id.substring(0, 8)}`;
      
      const orangeResponse = await fetch(`${this.ORANGE_API_URL}/webpayment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          merchant_key: this.ORANGE_MERCHANT_KEY,
          currency: 'OUV', // Orange Money currency code
          order_id: orderNumber,
          amount: transaction.amount,
          return_url: this.SUCCESS_URL,
          cancel_url: this.CANCEL_URL,
          notif_url: this.WEBHOOK_URL,
          lang: 'fr',
          reference: dbTransaction.id
        })
      });

      const orangeData = await orangeResponse.json();

      if (!orangeResponse.ok) {
        throw new Error(orangeData.message || 'Erreur Orange Money API');
      }

      // Mettre à jour la transaction
      await supabase
        .from('payment_transactions')
        .update({
          external_transaction_id: orangeData.payment_token,
          payment_url: orangeData.payment_url,
          metadata: {
            ...dbTransaction.metadata,
            orange_payment_token: orangeData.payment_token,
            orange_order_number: orderNumber
          }
        })
        .eq('id', dbTransaction.id);

      console.log('✅ [ORANGE] Paiement initié:', orangeData);

      return {
        success: true,
        data: {
          transaction_id: dbTransaction.id,
          payment_token: orangeData.payment_token,
          payment_url: orangeData.payment_url,
          ussd_code: '#144#', // Code USSD pour Orange Money Sénégal
          instructions: [
            'Composez #144# sur votre téléphone Orange',
            'Sélectionnez "Payer un marchand"',
            `Entrez le code: ${orangeData.payment_token}`,
            'Confirmez avec votre code PIN'
          ]
        }
      };
    } catch (error) {
      console.error('❌ [ORANGE] Erreur:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =====================================================
  // VIREMENT BANCAIRE
  // =====================================================

  /**
   * Créer une demande de virement bancaire
   * Pas d'API, juste générer les instructions
   * 
   * @param {Object} transaction - Détails de la transaction
   * @returns {Object} { success, data }
   */
  static async initiateBankTransfer(transaction) {
    try {
      console.log('🏦 [BANK] Création demande virement:', transaction);

      // Créer la transaction dans notre DB
      const { data: dbTransaction, error: dbError } = await supabase
        .from('payment_transactions')
        .insert({
          notary_request_id: transaction.notary_request_id,
          case_id: transaction.case_id,
          amount: transaction.amount,
          payment_method: 'bank_transfer',
          status: 'pending_verification', // Nécessite vérification manuelle
          payer_id: transaction.payer_id,
          metadata: {
            bank_transfer: true,
            initiated_at: new Date().toISOString(),
            requires_manual_verification: true
          }
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Informations bancaires de Teranga Foncier
      const bankDetails = {
        bank_name: 'Banque de l\'Habitat du Sénégal (BHS)',
        account_holder: 'Teranga Foncier SARL',
        account_number: 'SN08 SN01 0100 0123 4567 8901 234',
        swift_code: 'BHSNSNDX',
        reference: `TF-${dbTransaction.id.substring(0, 13).toUpperCase()}`
      };

      console.log('✅ [BANK] Demande créée:', bankDetails);

      return {
        success: true,
        data: {
          transaction_id: dbTransaction.id,
          bank_details: bankDetails,
          instructions: [
            'Connectez-vous à votre espace bancaire en ligne ou rendez-vous en agence',
            `Effectuez un virement vers le compte: ${bankDetails.account_number}`,
            `Utilisez impérativement la référence: ${bankDetails.reference}`,
            'Le virement sera vérifié sous 24-48h ouvrées',
            'Vous recevrez une notification dès la validation'
          ],
          verification_note: 'Le paiement sera vérifié manuellement par notre équipe comptable'
        }
      };
    } catch (error) {
      console.error('❌ [BANK] Erreur:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =====================================================
  // CARTE BANCAIRE (via PayTech)
  // =====================================================

  /**
   * Initier un paiement par carte bancaire via PayTech
   * PayTech est la principale passerelle CB au Sénégal
   * 
   * @param {Object} transaction - Détails de la transaction
   * @returns {Object} { success, data, error }
   */
  static async initiateCardPayment(transaction) {
    try {
      console.log('💳 [CARD] Initiation paiement carte:', transaction);

      if (!this.PAYTECH_API_KEY) {
        throw new Error('PayTech API non configurée. Ajoutez VITE_PAYTECH_API_KEY dans .env');
      }

      // Créer la transaction dans notre DB
      const { data: dbTransaction, error: dbError } = await supabase
        .from('payment_transactions')
        .insert({
          notary_request_id: transaction.notary_request_id,
          case_id: transaction.case_id,
          amount: transaction.amount,
          payment_method: 'card',
          status: 'pending',
          payer_id: transaction.payer_id,
          metadata: {
            card_payment: true,
            initiated_at: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Appel API PayTech
      const paytechResponse = await fetch(this.PAYTECH_API_URL, {
        method: 'POST',
        headers: {
          'API-KEY': this.PAYTECH_API_KEY,
          'API-SECRET': this.PAYTECH_API_SECRET,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item_name: `Paiement Teranga Foncier - ${transaction.description || 'Transaction'}`,
          item_price: transaction.amount,
          currency: 'XOF',
          ref_command: dbTransaction.id,
          command_name: `TF-${Date.now()}`,
          success_url: this.SUCCESS_URL,
          cancel_url: this.CANCEL_URL,
          ipn_url: this.WEBHOOK_URL, // Instant Payment Notification
          env: import.meta.env.VITE_PAYTECH_ENV || 'test' // 'test' or 'prod'
        })
      });

      const paytechData = await paytechResponse.json();

      if (paytechData.success !== 1) {
        throw new Error(paytechData.message || 'Erreur PayTech API');
      }

      // Mettre à jour la transaction
      await supabase
        .from('payment_transactions')
        .update({
          external_transaction_id: paytechData.token,
          payment_url: paytechData.redirect_url,
          metadata: {
            ...dbTransaction.metadata,
            paytech_token: paytechData.token
          }
        })
        .eq('id', dbTransaction.id);

      console.log('✅ [CARD] Paiement initié:', paytechData);

      return {
        success: true,
        data: {
          transaction_id: dbTransaction.id,
          payment_token: paytechData.token,
          payment_url: paytechData.redirect_url
        }
      };
    } catch (error) {
      console.error('❌ [CARD] Erreur:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // =====================================================
  // MÉTHODES UTILITAIRES
  // =====================================================

  /**
   * Router vers la bonne méthode de paiement
   * 
   * @param {string} method - 'wave', 'orange_money', 'bank_transfer', 'card'
   * @param {Object} transaction - Détails de la transaction
   * @returns {Object} Résultat de l'initiation
   */
  static async initiatePayment(method, transaction) {
    switch (method) {
      case 'wave':
        return await this.initiateWavePayment(transaction);
      
      case 'orange_money':
        return await this.initiateOrangeMoneyPayment(transaction);
      
      case 'bank_transfer':
        return await this.initiateBankTransfer(transaction);
      
      case 'card':
        return await this.initiateCardPayment(transaction);
      
      default:
        return {
          success: false,
          error: `Méthode de paiement non supportée: ${method}`
        };
    }
  }

  /**
   * Vérifier le statut d'une transaction
   * 
   * @param {string} transactionId - ID de notre transaction
   * @returns {Object} { success, status, data }
   */
  static async checkPaymentStatus(transactionId) {
    try {
      const { data: transaction, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) throw error;

      return {
        success: true,
        status: transaction.status,
        data: transaction
      };
    } catch (error) {
      console.error('❌ Erreur vérification statut:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Annuler un paiement en cours
   * 
   * @param {string} transactionId - ID de la transaction
   * @returns {Object} { success, message }
   */
  static async cancelPayment(transactionId) {
    try {
      const { error } = await supabase
        .from('payment_transactions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) throw error;

      return {
        success: true,
        message: 'Paiement annulé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur annulation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default PaymentGatewayService;
