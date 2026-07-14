// Service de gestion des abonnements — aligné sur le schéma réel (base V1).
//
// Tables réelles :
//   subscription_plans(id, name, description, price, currency, duration_months,
//     max_properties, max_images_per_property, priority_support, featured_listings,
//     analytics_access, api_access, custom_branding, status, created_at)
//   user_subscriptions(id, user_id, plan_id, status, start_date, end_date,
//     auto_renew, amount_paid, last_payment, created_at)
//
// Le logging d'action utilise la table `audit_logs`.
// Les limites d'usage sont calculées en direct (pas de table `usage_limits`).

import { supabase } from '../lib/supabaseClient';

export class SubscriptionService {

  // Récupérer tous les plans actifs
  static async getSubscriptionPlans() {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('status', 'active')
        .order('price', { ascending: true });

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Erreur récupération plans:', error);
      return { success: false, error: error.message };
    }
  }

  // Récupérer l'abonnement actif d'un utilisateur (avec le plan)
  static async getUserSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans (*)')
        .eq('user_id', userId)
        .in('status', ['active', 'pending'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return { success: true, data: data || null };
    } catch (error) {
      console.error('Erreur récupération abonnement:', error);
      return { success: false, error: error.message };
    }
  }

  // Créer un nouvel abonnement.
  // paid=false → statut "pending" (en attente de validation/paiement).
  static async createSubscription(userId, planId, { paid = false } = {}) {
    try {
      const { data: plan, error: planErr } = await supabase
        .from('subscription_plans')
        .select('price, duration_months')
        .eq('id', planId)
        .single();
      if (planErr) throw planErr;
      if (!plan) throw new Error('Plan non trouvé');

      // Clôturer les abonnements en cours
      await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .in('status', ['active', 'pending']);

      const start = new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + (plan.duration_months || 12));

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: paid ? 'active' : 'pending',
          start_date: start.toISOString().slice(0, 10),
          end_date: end.toISOString().slice(0, 10),
          auto_renew: false,
          amount_paid: paid ? Number(plan.price) : 0,
          last_payment: paid ? start.toISOString().slice(0, 10) : null,
        })
        .select('*, subscription_plans (*)')
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur création abonnement:', error);
      return { success: false, error: error.message };
    }
  }

  // Mettre à jour le statut d'un abonnement
  static async updateSubscriptionStatus(subscriptionId, status) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({ status })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur mise à jour abonnement:', error);
      return { success: false, error: error.message };
    }
  }

  // Statistiques d'abonnements (admin)
  static async getSubscriptionStats() {
    try {
      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('status, amount_paid, subscription_plans(price)');

      if (error) throw error;

      const rows = subscriptions || [];
      const stats = {
        total: rows.length,
        active: rows.filter((s) => s.status === 'active').length,
        pending: rows.filter((s) => s.status === 'pending').length,
        expired: rows.filter((s) => s.status === 'expired').length,
        cancelled: rows.filter((s) => s.status === 'cancelled').length,
        revenue: rows.reduce((sum, s) => sum + Number(s.amount_paid || 0), 0),
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Erreur statistiques abonnements:', error);
      return { success: false, error: error.message };
    }
  }

  // Enregistrer une action utilisateur (journal d'audit)
  static async logUserAction(userId, actionType, details = {}) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          action: actionType,
          details,
        });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erreur enregistrement action:', error);
      return { success: false, error: error.message };
    }
  }

  // Vérifier les limites d'usage d'un utilisateur (calcul en direct)
  // Actuellement supporté : resourceType = 'properties'
  static async checkUsageLimits(userId, resourceType = 'properties') {
    try {
      const { data: sub } = await supabase
        .from('user_subscriptions')
        .select('subscription_plans (max_properties)')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const limit = sub?.subscription_plans?.max_properties ?? null;

      let current = 0;
      if (resourceType === 'properties') {
        const { count } = await supabase
          .from('properties')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', userId);
        current = count || 0;
      }

      return {
        success: true,
        data: {
          resource_type: resourceType,
          current_usage: current,
          limit_value: limit,
          exceeded: limit != null ? current >= limit : false,
        },
      };
    } catch (error) {
      console.error('Erreur vérification limites:', error);
      return { success: false, error: error.message };
    }
  }
}

export default SubscriptionService;
