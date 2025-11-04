/**
 * @file paymentRoutes.js
 * @description API routes pour paiements Wave & Orange Money
 * @created 2025-11-03
 * @week 2 - Day 4-5
 */

const express = require('express');
const router = express.Router();
const waveService = require('../services/waveService');
const orangeMoneyService = require('../services/orangeMoneyService');
const { authenticateToken } = require('../middleware/auth');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * POST /api/payments/create
 * Créer lien paiement (Wave ou Orange Money)
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const {
      caseId,
      amount,
      paymentMethod, // 'wave' ou 'orange_money'
      paymentType, // 'deposit', 'full', 'installment'
      installmentNumber,
    } = req.body;

    const userId = req.user.id;

    // 1. Récupérer purchase_case
    const { data: purchaseCase, error: caseError } = await supabase
      .from('purchase_cases')
      .select(`
        *,
        properties (title, price, location),
        buyer:buyer_id (id, email, first_name, last_name, phone_number)
      `)
      .eq('id', caseId)
      .single();

    if (caseError || !purchaseCase) {
      return res.status(404).json({ error: 'Dossier non trouvé' });
    }

    // 2. Vérifier autorisation (acheteur uniquement)
    if (userId !== purchaseCase.buyer_id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // 3. Préparer données paiement
    const paymentData = {
      amount,
      currency: 'XOF',
      customerName: `${purchaseCase.buyer.first_name} ${purchaseCase.buyer.last_name}`,
      customerPhone: purchaseCase.buyer.phone_number,
      customerEmail: purchaseCase.buyer.email,
      orderId: caseId,
      description: `${paymentType === 'deposit' ? 'Acompte' : 'Paiement'} - ${purchaseCase.properties.title}`,
      metadata: {
        case_id: caseId,
        property_id: purchaseCase.property_id,
        buyer_id: purchaseCase.buyer_id,
        payment_type: paymentType,
        installment_number: installmentNumber || null,
      },
    };

    let paymentResult;
    let paymentProvider;

    // 4. Créer paiement selon méthode
    if (paymentMethod === 'wave') {
      paymentResult = await waveService.createPaymentLink(paymentData);
      paymentProvider = 'wave';
    } else if (paymentMethod === 'orange_money') {
      paymentResult = await orangeMoneyService.createPayment(paymentData);
      paymentProvider = 'orange_money';
    } else {
      return res.status(400).json({ error: 'Méthode paiement invalide' });
    }

    // 5. Sauvegarder transaction dans DB
    const { data: transaction, error: insertError } = await supabase
      .from('transactions')
      .insert({
        case_id: caseId,
        property_id: purchaseCase.property_id,
        buyer_id: purchaseCase.buyer_id,
        seller_id: purchaseCase.seller_id,
        amount,
        currency: 'XOF',
        transaction_type: paymentType,
        payment_method: paymentProvider,
        payment_provider_id: paymentResult.transactionId || paymentResult.paymentToken,
        payment_provider_reference: paymentResult.reference || paymentResult.orderReference,
        status: 'pending',
        installment_number: installmentNumber,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error saving transaction:', insertError);
      throw insertError;
    }

    // 6. Mettre à jour purchase_case
    await supabase
      .from('purchase_cases')
      .update({
        payment_status: paymentType === 'deposit' ? 'acompte_en_attente' : 'paiement_en_attente',
        updated_at: new Date().toISOString(),
      })
      .eq('id', caseId);

    res.json({
      success: true,
      transaction: transaction,
      paymentUrl: paymentResult.checkoutUrl || paymentResult.paymentUrl,
      provider: paymentProvider,
      message: 'Lien de paiement créé avec succès',
    });

  } catch (error) {
    console.error('❌ Error creating payment:', error);
    res.status(500).json({
      error: 'Erreur création paiement',
      details: error.message,
    });
  }
});

/**
 * GET /api/payments/status/:transactionId
 * Vérifier statut paiement
 */
router.get('/status/:transactionId', authenticateToken, async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Récupérer transaction depuis DB
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (error || !transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    // Vérifier statut selon provider
    let providerStatus;

    if (transaction.payment_method === 'wave') {
      providerStatus = await waveService.getPaymentStatus(transaction.payment_provider_id);
    } else if (transaction.payment_method === 'orange_money') {
      providerStatus = await orangeMoneyService.getPaymentStatus(transaction.payment_provider_id);
    } else {
      return res.status(400).json({ error: 'Provider inconnu' });
    }

    // Mapper statut provider → notre statut
    const statusMapping = {
      // Wave
      'pending': 'pending',
      'success': 'completed',
      'failed': 'failed',
      'cancelled': 'cancelled',
      // Orange Money
      'PENDING': 'pending',
      'SUCCESS': 'completed',
      'FAILED': 'failed',
      'EXPIRED': 'expired',
      'CANCELLED': 'cancelled',
    };

    const newStatus = statusMapping[providerStatus.status] || 'pending';

    // Mettre à jour DB si statut changé
    if (newStatus !== transaction.status) {
      await supabase
        .from('transactions')
        .update({
          status: newStatus,
          payment_provider_transaction_id: providerStatus.transactionId,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', transactionId);

      transaction.status = newStatus;

      // Si succès, mettre à jour purchase_case
      if (newStatus === 'completed') {
        await handlePaymentSuccess(transaction);
      }
    }

    res.json({
      success: true,
      transaction: transaction,
      providerStatus: providerStatus,
    });

  } catch (error) {
    console.error('❌ Error getting payment status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/webhook/wave
 * Webhook Wave Money
 */
router.post('/webhook/wave', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-wave-signature'];
    const payload = req.body.toString();

    // Vérifier signature
    const isValid = waveService.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(payload);

    console.log('📩 Wave webhook received:', event.type);

    // Traiter événement
    if (event.type === 'checkout.session.completed') {
      await handleWavePaymentCompleted(event.data);
    } else if (event.type === 'checkout.session.failed') {
      await handleWavePaymentFailed(event.data);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Wave webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/webhook/orange-money
 * Webhook Orange Money
 */
router.post('/webhook/orange-money', express.json(), async (req, res) => {
  try {
    const signature = req.headers['x-orange-signature'];
    const payload = req.body;

    // Vérifier signature
    const isValid = orangeMoneyService.verifyWebhookSignature(payload, signature);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('📩 Orange Money webhook received:', payload.status);

    if (payload.status === 'SUCCESS') {
      await handleOrangeMoneyPaymentCompleted(payload);
    } else if (payload.status === 'FAILED') {
      await handleOrangeMoneyPaymentFailed(payload);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Orange Money webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== HANDLERS =====

async function handleWavePaymentCompleted(data) {
  const { id: waveTransactionId, merchant_reference } = data;

  // Trouver transaction
  const { data: transaction } = await supabase
    .from('transactions')
    .update({
      status: 'completed',
      payment_provider_transaction_id: waveTransactionId,
      completed_at: new Date().toISOString(),
    })
    .eq('payment_provider_id', waveTransactionId)
    .select()
    .single();

  if (transaction) {
    await handlePaymentSuccess(transaction);
  }
}

async function handleWavePaymentFailed(data) {
  await supabase
    .from('transactions')
    .update({ status: 'failed' })
    .eq('payment_provider_id', data.id);
}

async function handleOrangeMoneyPaymentCompleted(data) {
  const { payment_token, transaction_id } = data;

  const { data: transaction } = await supabase
    .from('transactions')
    .update({
      status: 'completed',
      payment_provider_transaction_id: transaction_id,
      completed_at: new Date().toISOString(),
    })
    .eq('payment_provider_id', payment_token)
    .select()
    .single();

  if (transaction) {
    await handlePaymentSuccess(transaction);
  }
}

async function handleOrangeMoneyPaymentFailed(data) {
  await supabase
    .from('transactions')
    .update({ status: 'failed' })
    .eq('payment_provider_id', data.payment_token);
}

async function handlePaymentSuccess(transaction) {
  const { case_id, transaction_type, amount } = transaction;

  // Mettre à jour purchase_case selon type paiement
  if (transaction_type === 'deposit') {
    await supabase
      .from('purchase_cases')
      .update({
        payment_status: 'acompte_paye',
        deposit_amount: amount,
        deposit_paid_at: new Date().toISOString(),
        status: 'acompte_paye',
        updated_at: new Date().toISOString(),
      })
      .eq('id', case_id);
  } else if (transaction_type === 'full') {
    await supabase
      .from('purchase_cases')
      .update({
        payment_status: 'paye_complet',
        status: 'paiement_termine',
        total_paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', case_id);
  } else if (transaction_type === 'installment') {
    // Mise à jour mensualité payée
    await supabase
      .from('purchase_cases')
      .update({
        payment_status: 'mensualites_en_cours',
        updated_at: new Date().toISOString(),
      })
      .eq('id', case_id);
  }

  console.log(`✅ Payment success handled for case ${case_id}`);
}

module.exports = router;
