/**
 * @file orangeMoneyService.js
 * @description Service Orange Money pour paiements mobiles Sénégal
 * @created 2025-11-03
 * @week 2 - Day 4-5
 */

const axios = require('axios');
const crypto = require('crypto');

class OrangeMoneyService {
  constructor() {
    this.clientId = process.env.ORANGE_MONEY_CLIENT_ID;
    this.clientSecret = process.env.ORANGE_MONEY_CLIENT_SECRET;
    this.merchantKey = process.env.ORANGE_MONEY_MERCHANT_KEY;
    this.baseURL = process.env.ORANGE_MONEY_BASE_URL || 'https://api.orange.com/orange-money-webpay/v1';
    this.authURL = process.env.ORANGE_MONEY_AUTH_URL || 'https://api.orange.com/oauth/v3/token';
    
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }

  /**
   * Obtenir access token OAuth2
   */
  async authenticate() {
    try {
      // Si token valide existe, le réutiliser
      if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt) {
        return this.accessToken;
      }

      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await axios.post(
        this.authURL,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiresAt = Date.now() + (response.data.expires_in * 1000) - 60000; // -1 minute de sécurité

      console.log('✅ Orange Money authenticated');
      return this.accessToken;

    } catch (error) {
      console.error('❌ Orange Money authentication failed:', error.response?.data || error.message);
      throw new Error('Orange Money auth error');
    }
  }

  /**
   * Créer paiement Orange Money
   * @param {Object} paymentData - Données paiement
   */
  async createPayment(paymentData) {
    try {
      await this.authenticate();

      const {
        amount,
        currency = 'XOF',
        customerPhone,
        customerName,
        customerEmail,
        orderId,
        description,
        metadata = {},
      } = paymentData;

      // Validation
      if (!amount || amount <= 0) {
        throw new Error('Montant invalide');
      }

      if (!customerPhone) {
        throw new Error('Numéro téléphone requis');
      }

      // Générer order_id unique
      const orderReference = `TF-OM-${orderId}-${Date.now()}`;

      // Formater numéro
      const formattedPhone = this.formatPhoneNumber(customerPhone);

      const payload = {
        merchant_key: this.merchantKey,
        currency,
        order_id: orderReference,
        amount: Math.round(amount),
        return_url: `${process.env.FRONTEND_URL}/payment/success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        notif_url: `${process.env.BACKEND_URL}/api/payments/webhook/orange-money`,
        lang: 'fr',
        reference: orderReference,
        payment_method: 'orange-money',
        customer: {
          name: customerName,
          phone: formattedPhone,
          email: customerEmail,
        },
        description: description || `Paiement Teranga Foncier - ${orderId}`,
        metadata: {
          ...metadata,
          order_id: orderId,
          platform: 'teranga_foncier',
        },
      };

      const response = await axios.post(
        `${this.baseURL}/webpayment`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Orange Money payment created: ${response.data.payment_token}`);

      return {
        success: true,
        paymentToken: response.data.payment_token,
        paymentUrl: response.data.payment_url,
        orderReference,
        amount,
        currency,
        expiresAt: response.data.expires_at,
      };

    } catch (error) {
      console.error('❌ Orange Money payment creation failed:', error.response?.data || error.message);
      throw new Error(`Orange Money API error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Vérifier statut paiement
   * @param {String} paymentToken - Token paiement Orange Money
   */
  async getPaymentStatus(paymentToken) {
    try {
      await this.authenticate();

      const response = await axios.get(
        `${this.baseURL}/webpayment/${paymentToken}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      const payment = response.data;

      return {
        paymentToken: payment.payment_token,
        status: payment.status, // 'PENDING', 'SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED'
        orderReference: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        customerPhone: payment.customer?.phone,
        transactionId: payment.transaction_id, // ID transaction Orange Money
        paidAt: payment.payment_date,
        paymentMethod: payment.payment_method,
      };

    } catch (error) {
      console.error('❌ Error getting Orange Money payment status:', error);
      throw error;
    }
  }

  /**
   * Initier paiement push (sans redirection, notification mobile)
   * @param {Object} paymentData - Données paiement
   */
  async initiatePushPayment(paymentData) {
    try {
      await this.authenticate();

      const {
        amount,
        currency = 'XOF',
        customerPhone,
        orderId,
        description,
      } = paymentData;

      const formattedPhone = this.formatPhoneNumber(customerPhone);
      const orderReference = `TF-OM-${orderId}-${Date.now()}`;

      const payload = {
        merchant_key: this.merchantKey,
        order_id: orderReference,
        amount: Math.round(amount),
        currency,
        phone_number: formattedPhone,
        description: description || `Paiement Teranga Foncier`,
        notif_url: `${process.env.BACKEND_URL}/api/payments/webhook/orange-money`,
        metadata: {
          order_id: orderId,
          platform: 'teranga_foncier',
        },
      };

      const response = await axios.post(
        `${this.baseURL}/push-payment`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Orange Money push payment initiated: ${response.data.transaction_id}`);

      return {
        success: true,
        transactionId: response.data.transaction_id,
        status: response.data.status,
        orderReference,
        message: 'Le client va recevoir une notification de paiement sur son téléphone.',
      };

    } catch (error) {
      console.error('❌ Orange Money push payment failed:', error.response?.data || error);
      throw new Error(`Orange Money push error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Rembourser paiement
   * @param {String} transactionId - ID transaction Orange Money
   * @param {Number} amount - Montant à rembourser
   * @param {String} reason - Raison
   */
  async refundPayment(transactionId, amount, reason = '') {
    try {
      await this.authenticate();

      const payload = {
        transaction_id: transactionId,
        amount: Math.round(amount),
        reason: reason || 'Remboursement demandé',
      };

      const response = await axios.post(
        `${this.baseURL}/refunds`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ Orange Money refund created: ${response.data.refund_id}`);

      return {
        success: true,
        refundId: response.data.refund_id,
        status: response.data.status,
        amount: response.data.amount,
        originalTransactionId: transactionId,
      };

    } catch (error) {
      console.error('❌ Orange Money refund failed:', error);
      throw error;
    }
  }

  /**
   * Vérifier signature webhook
   * @param {Object} payload - Corps webhook
   * @param {String} signature - Header X-Orange-Signature
   */
  verifyWebhookSignature(payload, signature) {
    try {
      const payloadString = JSON.stringify(payload);
      
      const expectedSignature = crypto
        .createHmac('sha256', this.clientSecret)
        .update(payloadString)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

    } catch (error) {
      console.error('❌ Orange Money webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Formater numéro téléphone pour Orange Money
   */
  formatPhoneNumber(phone) {
    // Supprimer espaces, tirets, parenthèses
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');

    // Format Orange Money: +221XXXXXXXXX (Sénégal)
    if (!cleaned.startsWith('+')) {
      if (cleaned.startsWith('221')) {
        cleaned = '+' + cleaned;
      } else if (cleaned.startsWith('0')) {
        // 077 123 45 67 → +221 77 123 45 67
        cleaned = '+221' + cleaned.substring(1);
      } else {
        cleaned = '+221' + cleaned;
      }
    }

    return cleaned;
  }

  /**
   * Obtenir solde marchand
   */
  async getMerchantBalance() {
    try {
      await this.authenticate();

      const response = await axios.get(
        `${this.baseURL}/merchant/${this.merchantKey}/balance`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      return {
        balance: response.data.balance,
        currency: response.data.currency,
        availableBalance: response.data.available_balance,
      };

    } catch (error) {
      console.error('❌ Error getting Orange Money merchant balance:', error);
      throw error;
    }
  }

  /**
   * Lister transactions
   * @param {Object} filters - Filtres (startDate, endDate, status)
   */
  async listTransactions(filters = {}) {
    try {
      await this.authenticate();

      const { startDate, endDate, status, limit = 50, offset = 0 } = filters;

      const params = {
        merchant_key: this.merchantKey,
        limit,
        offset,
      };

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (status) params.status = status;

      const response = await axios.get(
        `${this.baseURL}/transactions`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
          params,
        }
      );

      return {
        transactions: response.data.data || [],
        total: response.data.total || 0,
        hasMore: response.data.has_more || false,
      };

    } catch (error) {
      console.error('❌ Error listing Orange Money transactions:', error);
      throw error;
    }
  }
}

module.exports = new OrangeMoneyService();
