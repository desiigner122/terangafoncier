/**
 * @file waveService.js
 * @description Service Wave Money pour paiements mobiles Sénégal
 * @created 2025-11-03
 * @week 2 - Day 4-5
 */

const axios = require('axios');
const crypto = require('crypto');

class WaveService {
  constructor() {
    this.apiKey = process.env.WAVE_API_KEY;
    this.apiSecret = process.env.WAVE_API_SECRET;
    this.merchantId = process.env.WAVE_MERCHANT_ID;
    this.baseURL = process.env.WAVE_BASE_URL || 'https://api.wave.com/v1';
    this.webhookSecret = process.env.WAVE_WEBHOOK_SECRET;
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Créer lien de paiement Wave
   * @param {Object} paymentData - Données paiement
   * @returns {Promise<Object>} - URL paiement + transaction ID
   */
  async createPaymentLink(paymentData) {
    try {
      const {
        amount, // En FCFA
        currency = 'XOF',
        customerName,
        customerPhone,
        customerEmail,
        description,
        orderId, // Notre purchase_case_id
        metadata = {},
      } = paymentData;

      // Validation
      if (!amount || amount <= 0) {
        throw new Error('Montant invalide');
      }

      if (!customerPhone) {
        throw new Error('Numéro téléphone requis');
      }

      // Générer référence unique
      const reference = `TF-${orderId}-${Date.now()}`;

      const payload = {
        amount: Math.round(amount), // Wave accepte uniquement entiers
        currency,
        error_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        success_url: `${process.env.FRONTEND_URL}/payment/success`,
        merchant_reference: reference,
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
        },
        description: description || `Paiement Teranga Foncier - ${orderId}`,
        metadata: {
          ...metadata,
          order_id: orderId,
          platform: 'teranga_foncier',
        },
      };

      const response = await this.axiosInstance.post('/checkout/sessions', payload);

      console.log(`✅ Wave payment link created: ${response.data.id}`);

      return {
        success: true,
        transactionId: response.data.id,
        waveTransactionId: response.data.wave_launch_url,
        checkoutUrl: response.data.wave_launch_url, // URL à ouvrir dans navigateur
        reference,
        amount,
        currency,
        expiresAt: response.data.expires_at,
      };

    } catch (error) {
      console.error('❌ Wave payment link creation failed:', error.response?.data || error.message);
      throw new Error(`Wave API error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Vérifier statut paiement
   * @param {String} transactionId - Wave transaction ID
   */
  async getPaymentStatus(transactionId) {
    try {
      const response = await this.axiosInstance.get(`/checkout/sessions/${transactionId}`);

      const payment = response.data;

      return {
        transactionId: payment.id,
        status: payment.status, // 'pending', 'success', 'failed', 'cancelled'
        amount: payment.amount,
        currency: payment.currency,
        customerPhone: payment.customer?.phone,
        paidAt: payment.completed_at,
        paymentMethod: payment.payment_method,
        reference: payment.merchant_reference,
      };

    } catch (error) {
      console.error('❌ Error getting Wave payment status:', error);
      throw error;
    }
  }

  /**
   * Initier paiement direct (sans redirection)
   * @param {Object} paymentData - Données paiement
   */
  async initiateDirectPayment(paymentData) {
    try {
      const {
        amount,
        currency = 'XOF',
        customerPhone,
        orderId,
        description,
      } = paymentData;

      // Formater numéro (format international)
      const formattedPhone = this.formatPhoneNumber(customerPhone);

      const reference = `TF-${orderId}-${Date.now()}`;

      const payload = {
        amount: Math.round(amount),
        currency,
        phone_number: formattedPhone,
        merchant_reference: reference,
        description: description || `Paiement Teranga Foncier`,
        metadata: {
          order_id: orderId,
          platform: 'teranga_foncier',
        },
      };

      const response = await this.axiosInstance.post('/payments/direct', payload);

      console.log(`✅ Wave direct payment initiated: ${response.data.id}`);

      return {
        success: true,
        transactionId: response.data.id,
        status: response.data.status, // 'initiated', 'pending'
        reference,
        message: 'Paiement initié. Le client va recevoir une notification sur son téléphone.',
      };

    } catch (error) {
      console.error('❌ Wave direct payment failed:', error.response?.data || error);
      throw new Error(`Wave direct payment error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Rembourser paiement
   * @param {String} transactionId - Wave transaction ID
   * @param {Number} amount - Montant à rembourser (optionnel, par défaut total)
   * @param {String} reason - Raison remboursement
   */
  async refundPayment(transactionId, amount = null, reason = '') {
    try {
      const payload = {
        transaction_id: transactionId,
        reason: reason || 'Remboursement demandé',
      };

      if (amount) {
        payload.amount = Math.round(amount);
      }

      const response = await this.axiosInstance.post('/refunds', payload);

      console.log(`✅ Wave refund created: ${response.data.id}`);

      return {
        success: true,
        refundId: response.data.id,
        status: response.data.status,
        amount: response.data.amount,
        originalTransactionId: transactionId,
      };

    } catch (error) {
      console.error('❌ Wave refund failed:', error);
      throw error;
    }
  }

  /**
   * Vérifier signature webhook
   * @param {String} payload - Corps requête webhook (string)
   * @param {String} signature - Header X-Wave-Signature
   */
  verifyWebhookSignature(payload, signature) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Formater numéro téléphone pour Wave (format international +221...)
   */
  formatPhoneNumber(phone) {
    // Supprimer espaces, tirets, parenthèses
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // Ajouter +221 si manquant (Sénégal)
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('221')) {
        cleaned = '+' + cleaned;
      } else if (cleaned.startsWith('0')) {
        cleaned = '+221' + cleaned.substring(1);
      } else {
        cleaned = '+221' + cleaned;
      }
    }

    return cleaned;
  }

  /**
   * Obtenir solde marchand (si API le permet)
   */
  async getMerchantBalance() {
    try {
      const response = await this.axiosInstance.get(`/merchants/${this.merchantId}/balance`);

      return {
        balance: response.data.balance,
        currency: response.data.currency,
        availableBalance: response.data.available_balance,
        pendingBalance: response.data.pending_balance,
      };

    } catch (error) {
      console.error('❌ Error getting merchant balance:', error);
      throw error;
    }
  }

  /**
   * Lister transactions marchandes
   * @param {Object} filters - Filtres (startDate, endDate, status, limit)
   */
  async listTransactions(filters = {}) {
    try {
      const { startDate, endDate, status, limit = 50, offset = 0 } = filters;

      const params = {
        limit,
        offset,
      };

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (status) params.status = status;

      const response = await this.axiosInstance.get('/transactions', { params });

      return {
        transactions: response.data.data || [],
        total: response.data.total || 0,
        hasMore: response.data.has_more || false,
      };

    } catch (error) {
      console.error('❌ Error listing transactions:', error);
      throw error;
    }
  }
}

module.exports = new WaveService();
