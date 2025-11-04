/**
 * @file docusignRoutes.js
 * @description API routes pour DocuSign e-signature
 * @created 2025-11-03
 * @week 2 - Day 1-3
 */

const express = require('express');
const router = express.Router();
const docusignService = require('../services/docusignService');
const { authenticateToken } = require('../middleware/auth');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * POST /api/docusign/create-contract
 * Créer contrat signature pour purchase_case
 */
router.post('/create-contract', authenticateToken, async (req, res) => {
  try {
    const { caseId, contractType = 'PURCHASE_CONTRACT' } = req.body;
    const userId = req.user.id;

    // 1. Récupérer données case
    const { data: purchaseCase, error: caseError } = await supabase
      .from('purchase_cases')
      .select(`
        *,
        properties (
          title,
          price,
          location,
          city,
          address
        ),
        buyer:buyer_id (
          id,
          email,
          first_name,
          last_name
        ),
        seller:seller_id (
          id,
          email,
          first_name,
          last_name
        ),
        notaire:notaire_id (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('id', caseId)
      .single();

    if (caseError || !purchaseCase) {
      return res.status(404).json({ error: 'Dossier non trouvé' });
    }

    // 2. Vérifier que user est acheteur, vendeur ou notaire du dossier
    const isAuthorized = 
      userId === purchaseCase.buyer_id ||
      userId === purchaseCase.seller_id ||
      userId === purchaseCase.notaire_id;

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // 3. Préparer données contrat
    const contractData = {
      caseId: purchaseCase.id,
      caseNumber: purchaseCase.case_number,
      propertyId: purchaseCase.property_id,
      propertyAddress: purchaseCase.properties.address || purchaseCase.properties.location,
      price: purchaseCase.total_price || purchaseCase.properties.price,
      paymentMethod: purchaseCase.payment_method || 'À définir',
      
      buyerEmail: purchaseCase.buyer.email,
      buyerName: `${purchaseCase.buyer.first_name} ${purchaseCase.buyer.last_name}`,
      
      sellerEmail: purchaseCase.seller.email,
      sellerName: `${purchaseCase.seller.first_name} ${purchaseCase.seller.last_name}`,
      
      notaireEmail: purchaseCase.notaire?.email || process.env.DEFAULT_NOTAIRE_EMAIL,
      notaireName: purchaseCase.notaire 
        ? `${purchaseCase.notaire.first_name} ${purchaseCase.notaire.last_name}`
        : 'Notaire Teranga Foncier',
    };

    // 4. Créer enveloppe DocuSign
    const result = await docusignService.createPurchaseEnvelope(contractData);

    // 5. Sauvegarder dans DB
    const { data: contract, error: insertError } = await supabase
      .from('contracts')
      .insert({
        case_id: caseId,
        property_id: purchaseCase.property_id,
        buyer_id: purchaseCase.buyer_id,
        seller_id: purchaseCase.seller_id,
        notaire_id: purchaseCase.notaire_id,
        contract_type: contractType,
        docusign_envelope_id: result.envelopeId,
        status: 'pending_signatures',
        buyer_signing_url: result.signingUrls.buyer,
        seller_signing_url: result.signingUrls.seller,
        notaire_signing_url: result.signingUrls.notaire,
        contract_amount: purchaseCase.total_price,
        created_by: userId,
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Error saving contract:', insertError);
      throw insertError;
    }

    // 6. Mettre à jour purchase_case status
    await supabase
      .from('purchase_cases')
      .update({ 
        contract_status: 'signature_en_cours',
        status: 'signature',
        updated_at: new Date().toISOString(),
      })
      .eq('id', caseId);

    res.json({
      success: true,
      contract: contract,
      envelopeId: result.envelopeId,
      signingUrls: result.signingUrls,
      message: 'Contrat créé avec succès. Emails de signature envoyés.',
    });

  } catch (error) {
    console.error('❌ Error creating contract:', error);
    res.status(500).json({ 
      error: 'Erreur création contrat',
      details: error.message 
    });
  }
});

/**
 * GET /api/docusign/status/:envelopeId
 * Obtenir statut signature
 */
router.get('/status/:envelopeId', authenticateToken, async (req, res) => {
  try {
    const { envelopeId } = req.params;

    // Récupérer statut DocuSign
    const status = await docusignService.getEnvelopeStatus(envelopeId);

    // Mettre à jour DB
    const { data: contract } = await supabase
      .from('contracts')
      .update({
        docusign_status: status.status,
        buyer_signed: status.recipients.find(r => r.roleName === 'Acheteur')?.status === 'completed',
        seller_signed: status.recipients.find(r => r.roleName === 'Vendeur')?.status === 'completed',
        notaire_signed: status.recipients.find(r => r.roleName === 'Notaire')?.status === 'completed',
        buyer_signed_at: status.recipients.find(r => r.roleName === 'Acheteur')?.signedDateTime,
        seller_signed_at: status.recipients.find(r => r.roleName === 'Vendeur')?.signedDateTime,
        notaire_signed_at: status.recipients.find(r => r.roleName === 'Notaire')?.signedDateTime,
        completed_at: status.status === 'completed' ? status.completedDateTime : null,
      })
      .eq('docusign_envelope_id', envelopeId)
      .select()
      .single();

    res.json({
      success: true,
      envelopeStatus: status,
      contract: contract,
    });

  } catch (error) {
    console.error('❌ Error getting status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/docusign/download/:envelopeId
 * Télécharger document signé
 */
router.get('/download/:envelopeId', authenticateToken, async (req, res) => {
  try {
    const { envelopeId } = req.params;
    const userId = req.user.id;

    // Vérifier autorisation
    const { data: contract } = await supabase
      .from('contracts')
      .select('*')
      .eq('docusign_envelope_id', envelopeId)
      .single();

    if (!contract) {
      return res.status(404).json({ error: 'Contrat non trouvé' });
    }

    const isAuthorized = 
      userId === contract.buyer_id ||
      userId === contract.seller_id ||
      userId === contract.notaire_id;

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Télécharger PDF
    const pdfBuffer = await docusignService.downloadSignedDocument(envelopeId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="contract_${envelopeId}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('❌ Error downloading document:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/docusign/void/:envelopeId
 * Annuler enveloppe
 */
router.post('/void/:envelopeId', authenticateToken, async (req, res) => {
  try {
    const { envelopeId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    // Vérifier autorisation (notaire ou admin uniquement)
    const { data: user } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!['notaire', 'admin', 'super_admin'].includes(user?.role)) {
      return res.status(403).json({ error: 'Seuls notaires et admins peuvent annuler' });
    }

    // Annuler sur DocuSign
    await docusignService.voidEnvelope(envelopeId, reason);

    // Mettre à jour DB
    await supabase
      .from('contracts')
      .update({
        status: 'cancelled',
        docusign_status: 'voided',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        cancelled_by: userId,
      })
      .eq('docusign_envelope_id', envelopeId);

    res.json({
      success: true,
      message: 'Contrat annulé avec succès',
    });

  } catch (error) {
    console.error('❌ Error voiding envelope:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/docusign/webhook
 * Webhook DocuSign pour événements signature
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = req.body;

    console.log('📩 DocuSign webhook received:', event.event);

    const envelopeId = event.data?.envelopeId;
    if (!envelopeId) {
      return res.status(400).json({ error: 'Missing envelopeId' });
    }

    // Traiter selon type d'événement
    switch (event.event) {
      case 'envelope-sent':
        await handleEnvelopeSent(envelopeId);
        break;

      case 'envelope-delivered':
        await handleEnvelopeDelivered(envelopeId);
        break;

      case 'recipient-sent':
        await handleRecipientSent(envelopeId, event.data);
        break;

      case 'recipient-completed':
        await handleRecipientCompleted(envelopeId, event.data);
        break;

      case 'envelope-completed':
        await handleEnvelopeCompleted(envelopeId);
        break;

      case 'envelope-voided':
        await handleEnvelopeVoided(envelopeId);
        break;

      default:
        console.log(`ℹ️ Unhandled event: ${event.event}`);
    }

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handlers webhook
async function handleEnvelopeSent(envelopeId) {
  await supabase
    .from('contracts')
    .update({ docusign_status: 'sent' })
    .eq('docusign_envelope_id', envelopeId);
}

async function handleEnvelopeDelivered(envelopeId) {
  await supabase
    .from('contracts')
    .update({ docusign_status: 'delivered' })
    .eq('docusign_envelope_id', envelopeId);
}

async function handleRecipientCompleted(envelopeId, data) {
  const recipientRole = data.recipientRole;
  const signedAt = new Date().toISOString();

  const updates = { docusign_status: 'signing' };

  if (recipientRole === 'Acheteur') {
    updates.buyer_signed = true;
    updates.buyer_signed_at = signedAt;
  } else if (recipientRole === 'Vendeur') {
    updates.seller_signed = true;
    updates.seller_signed_at = signedAt;
  } else if (recipientRole === 'Notaire') {
    updates.notaire_signed = true;
    updates.notaire_signed_at = signedAt;
  }

  await supabase
    .from('contracts')
    .update(updates)
    .eq('docusign_envelope_id', envelopeId);
}

async function handleEnvelopeCompleted(envelopeId) {
  const completedAt = new Date().toISOString();

  // Mettre à jour contrat
  await supabase
    .from('contracts')
    .update({
      status: 'signed',
      docusign_status: 'completed',
      completed_at: completedAt,
    })
    .eq('docusign_envelope_id', envelopeId);

  // Mettre à jour purchase_case
  const { data: contract } = await supabase
    .from('contracts')
    .select('case_id')
    .eq('docusign_envelope_id', envelopeId)
    .single();

  if (contract?.case_id) {
    await supabase
      .from('purchase_cases')
      .update({
        contract_status: 'signe',
        status: 'contrat_signe',
        updated_at: completedAt,
      })
      .eq('id', contract.case_id);

    console.log(`✅ Contract completed for case ${contract.case_id}`);
  }
}

async function handleEnvelopeVoided(envelopeId) {
  await supabase
    .from('contracts')
    .update({
      status: 'cancelled',
      docusign_status: 'voided',
    })
    .eq('docusign_envelope_id', envelopeId);
}

module.exports = router;
