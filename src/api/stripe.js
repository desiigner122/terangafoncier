/**
 * API Stripe pour paiements et abonnements
 * 
 * Cet endpoint gère:
 * - Création de sessions de paiement Checkout
 * - Webhooks Stripe
 * - Gestion des abonnements
 */

import { supabase } from '@/lib/supabaseClient';

/**
 * Crée une session de paiement Stripe
 * 
 * @param {string} planName - Nom du plan (free, basic, pro, enterprise)
 * @param {number} amount - Montant en FCFA
 * @param {string} userId - ID de l'utilisateur
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} Session de paiement
 */
export const createCheckoutSession = async (planName, amount, userId, email) => {
  try {
    // Valider les paramètres
    if (!planName || !amount || !userId || !email) {
      throw new Error('Paramètres manquants pour la session de paiement');
    }

    // Créer la session localement (mode test sans Stripe pour le moment)
    const session = {
      id: `session_${Date.now()}_${userId}`,
      url: `/checkout?plan=${planName}&amount=${amount}&user=${userId}`,
      plan: planName,
      amount: amount,
      user_id: userId,
      email: email,
      status: 'pending',
      created_at: new Date().toISOString(),
      mode: process.env.NODE_ENV === 'production' ? 'payment' : 'test'
    };

    // En production, appeler une véritable API backend
    // Pour le moment, retourner une session de test
    if (process.env.REACT_APP_STRIPE_API_KEY) {
      console.log('🔑 Clé Stripe trouvée, utilisation API production');
      // Appel API backend pour Stripe
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`
        },
        body: JSON.stringify({
          plan: planName,
          amount: amount,
          email: email,
          userId: userId
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      return await response.json();
    } else {
      console.warn('⚠️ Clé Stripe non configurée, mode simulation');
      // Retourner session de test
      return {
        ...session,
        url: `/subscription/confirm?plan=${planName}&status=pending`,
        type: 'test'
      };
    }
  } catch (error) {
    console.error('❌ Erreur création session Stripe:', error);
    throw error;
  }
};

/**
 * Sauvegarde une transaction de paiement en base de données
 * 
 * @param {Object} transactionData - Données de la transaction
 * @returns {Promise<Object>} Transaction créée
 */
export const savePaymentTransaction = async (transactionData) => {
  try {
    const {
      user_id,
      plan,
      amount,
      status = 'pending',
      stripe_session_id,
      metadata = {}
    } = transactionData;

    // Vérifier les colonnes requises
    if (!user_id || !plan || !amount) {
      throw new Error('Données de paiement incomplètes');
    }

    // Insérer la transaction
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert([{
        user_id,
        plan_name: plan,
        amount: amount,
        currency: 'XOF', // Franc CFA
        status: status,
        stripe_session_id: stripe_session_id || null,
        metadata: metadata,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur insertion transaction:', error);
      throw error;
    }

    console.log('✅ Transaction sauvegardée:', data.id);
    return data;
  } catch (error) {
    console.error('❌ Erreur sauvegarde transaction:', error);
    throw error;
  }
};

/**
 * Met à jour le statut d'une transaction
 * 
 * @param {string} transactionId - ID de la transaction
 * @param {string} status - Nouveau statut (pending, completed, failed)
 * @returns {Promise<Object>} Transaction mise à jour
 */
export const updatePaymentStatus = async (transactionId, status) => {
  try {
    const { data, error } = await supabase
      .from('payment_transactions')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId)
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Statut transaction ${transactionId} mis à jour: ${status}`);
    return data;
  } catch (error) {
    console.error('❌ Erreur mise à jour statut:', error);
    throw error;
  }
};

/**
 * Crée ou met à jour un abonnement utilisateur
 * 
 * @param {string} userId - ID de l'utilisateur
 * @param {string} planName - Nom du plan
 * @param {number} amount - Montant mensuel
 * @returns {Promise<Object>} Abonnement créé/mis à jour
 */
export const upsertSubscription = async (userId, planName, amount) => {
  try {
    const now = new Date();
    const nextBillingDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 jours

    // Déterminer les limites selon le plan
    const planLimits = {
      free: { properties_limit: 3, storage_gb: 1, features: [] },
      basic: { properties_limit: 10, storage_gb: 10, features: ['messaging', 'basic_stats'] },
      pro: { properties_limit: 50, storage_gb: 50, features: ['messaging', 'advanced_stats', 'blockchain'] },
      enterprise: { properties_limit: 0, storage_gb: 500, features: ['all'] }
    };

    const limits = planLimits[planName.toLowerCase()] || planLimits.free;

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert([{
        user_id: userId,
        plan_name: planName,
        status: 'active',
        amount_monthly: amount,
        properties_limit: limits.properties_limit,
        storage_gb: limits.storage_gb,
        features: limits.features,
        billing_cycle_start: now.toISOString(),
        next_billing_date: nextBillingDate.toISOString(),
        auto_renewal: true,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }], { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Abonnement ${planName} créé pour utilisateur ${userId}`);
    return data;
  } catch (error) {
    console.error('❌ Erreur création abonnement:', error);
    throw error;
  }
};

/**
 * Récupère les détails d'un abonnement
 * 
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object|null>} Détails de l'abonnement
 */
export const getSubscription = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('❌ Erreur récupération abonnement:', error);
    return null;
  }
};

/**
 * Annule un abonnement
 * 
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Abonnement annulé
 */
export const cancelSubscription = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        auto_renewal: false,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    console.log(`✅ Abonnement annulé pour utilisateur ${userId}`);
    return data;
  } catch (error) {
    console.error('❌ Erreur annulation abonnement:', error);
    throw error;
  }
};

export default {
  createCheckoutSession,
  savePaymentTransaction,
  updatePaymentStatus,
  upsertSubscription,
  getSubscription,
  cancelSubscription
};
