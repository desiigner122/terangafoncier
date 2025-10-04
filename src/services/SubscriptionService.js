// Service complet pour la gestion des abonnements
import { supabase } from '../lib/supabaseClient';

export class SubscriptionService {
  
  // Créer les tables nécessaires (SQL à exécuter dans Supabase Dashboard)
  static getInitializationSQL() {
    return `
-- Table des plans d'abonnement
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  duration_days INTEGER DEFAULT 30,
  features JSONB DEFAULT '[]',
  role_type TEXT NOT NULL,
  max_properties INTEGER DEFAULT 10,
  max_transactions INTEGER DEFAULT 50,
  has_analytics BOOLEAN DEFAULT false,
  has_priority_support BOOLEAN DEFAULT false,
  has_api_access BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des abonnements utilisateurs
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id),
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table pour les analytics utilisateurs
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table pour les limites d'usage
CREATE TABLE IF NOT EXISTS usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  resource_type TEXT NOT NULL, -- 'properties', 'transactions', 'api_calls'
  current_usage INTEGER DEFAULT 0,
  limit_value INTEGER NOT NULL,
  reset_date TIMESTAMP DEFAULT NOW() + INTERVAL '1 month',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, resource_type)
);

-- Insertion des plans par défaut
INSERT INTO subscription_plans (name, description, price, role_type, features, max_properties, max_transactions, has_analytics, has_priority_support) VALUES
('Particulier Basic', 'Plan de base pour particuliers', 5000, 'Particulier', '["Recherche propriétés", "Alertes par email", "Support standard"]', 5, 10, false, false),
('Particulier Premium', 'Plan avancé pour particuliers', 15000, 'Particulier', '["Recherche avancée", "Alertes SMS", "Analytics", "Support prioritaire"]', 20, 50, true, true),
('Vendeur Starter', 'Plan de démarrage pour vendeurs', 25000, 'Vendeur', '["Publier propriétés", "Gestion clients", "Support standard"]', 10, 25, false, false),
('Vendeur Professional', 'Plan professionnel pour vendeurs', 50000, 'Vendeur', '["Publications illimitées", "CRM avancé", "Analytics", "Support 24/7"]', 100, 200, true, true),
('Investisseur Standard', 'Plan standard pour investisseurs', 75000, 'Investisseur', '["Portfolio management", "Market analysis", "Investment tracking"]', 50, 100, true, false),
('Investisseur Premium', 'Plan premium pour investisseurs', 150000, 'Investisseur', '["Advanced analytics", "API access", "Dedicated support", "Custom reports"]', 200, 500, true, true),
('Promoteur Basic', 'Plan de base pour promoteurs', 100000, 'Promoteur', '["Project management", "Sales tracking", "Basic analytics"]', 20, 100, true, false),
('Promoteur Enterprise', 'Plan entreprise pour promoteurs', 250000, 'Promoteur', '["Advanced project tools", "Team collaboration", "Full analytics", "API access"]', 500, 1000, true, true),
('Banque Standard', 'Plan standard pour banques', 200000, 'Banque', '["Loan management", "Client tracking", "Risk assessment"]', 100, 500, true, true),
('Banque Enterprise', 'Plan entreprise pour banques', 500000, 'Banque', '["Advanced analytics", "API integration", "Custom workflows", "Dedicated support"]', 1000, 2000, true, true),
('Notaire Professional', 'Plan professionnel pour notaires', 150000, 'Notaire', '["Document management", "Client portal", "Secure transactions"]', 50, 200, true, true),
('Géomètre Standard', 'Plan standard pour géomètres', 100000, 'Géomètre', '["Survey management", "CAD integration", "Client reports"]', 30, 150, true, false),
('Agent Foncier Pro', 'Plan professionnel pour agents fonciers', 125000, 'Agent Foncier', '["Land registry access", "Legal compliance", "Document templates"]', 40, 200, true, true);

-- Politiques RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;

-- Policies pour subscription_plans (visible par tous)
CREATE POLICY "Plans are viewable by everyone" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Only admins can modify plans" ON subscription_plans FOR ALL USING (auth.jwt()->>'user_type' = 'admin');

-- Policies pour user_subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions FOR SELECT USING (auth.jwt()->>'user_type' = 'admin');
CREATE POLICY "Admins can modify subscriptions" ON user_subscriptions FOR ALL USING (auth.jwt()->>'user_type' = 'admin');

-- Policies pour user_analytics
CREATE POLICY "Users can view own analytics" ON user_analytics FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins can view all analytics" ON user_analytics FOR SELECT USING (auth.jwt()->>'user_type' = 'admin');

-- Policies pour usage_limits
CREATE POLICY "Users can view own limits" ON usage_limits FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Admins can view all limits" ON usage_limits FOR SELECT USING (auth.jwt()->>'user_type' = 'admin');
CREATE POLICY "Admins can modify limits" ON usage_limits FOR ALL USING (auth.jwt()->>'user_type' = 'admin');

-- Vue pour les statistiques complètes des utilisateurs
CREATE OR REPLACE VIEW user_complete_stats AS
SELECT 
  u.id as user_id,
  u.email,
  u.user_metadata->>'user_type' as role,
  u.user_metadata->>'first_name' as first_name,
  u.user_metadata->>'last_name' as last_name,
  u.created_at as registered_at,
  u.last_sign_in_at,
  u.email_confirmed_at,
  
  -- Subscription info
  s.status as subscription_status,
  sp.name as plan_name,
  sp.price as plan_price,
  s.start_date as subscription_start,
  s.end_date as subscription_end,
  s.auto_renew,
  
  -- Usage stats
  (SELECT COUNT(*) FROM properties WHERE owner_id::text = u.id::text) as properties_count,
  (SELECT COUNT(*) FROM transactions WHERE user_id::text = u.id::text) as transactions_count,
  
  -- Last activity
  (SELECT MAX(created_at) FROM user_analytics WHERE user_id::text = u.id::text) as last_activity,
  (SELECT COUNT(*) FROM user_analytics WHERE user_id::text = u.id::text AND created_at > NOW() - INTERVAL '30 days') as monthly_activity
  
FROM auth.users u
LEFT JOIN user_subscriptions s ON u.id::text = s.user_id::text AND s.status = 'active'
LEFT JOIN subscription_plans sp ON s.plan_id = sp.id;
`;
  }

  // Récupérer tous les plans d'abonnement
  static async getSubscriptionPlans(roleType = null) {
    try {
      let query = supabase.from('subscription_plans').select('*').eq('is_active', true);
      
      if (roleType) {
        query = query.eq('role_type', roleType);
      }
      
      const { data, error } = await query.order('price', { ascending: true });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Erreur récupération plans:', error);
      return { success: false, error: error.message };
    }
  }

  // Récupérer l'abonnement actuel d'un utilisateur
  static async getUserSubscription(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Erreur récupération abonnement:', error);
      return { success: false, error: error.message };
    }
  }

  // Créer un nouvel abonnement
  static async createSubscription(userId, planId, paymentStatus = 'pending') {
    try {
      // D'abord récupérer le plan pour calculer end_date
      const { data: plan } = await supabase
        .from('subscription_plans')
        .select('duration_days')
        .eq('id', planId)
        .single();
      
      if (!plan) throw new Error('Plan non trouvé');
      
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + (plan.duration_days * 24 * 60 * 60 * 1000));
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          payment_status: paymentStatus,
          status: paymentStatus === 'paid' ? 'active' : 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Erreur création abonnement:', error);
      return { success: false, error: error.message };
    }
  }

  // Mettre à jour le statut d'un abonnement
  static async updateSubscriptionStatus(subscriptionId, status, paymentStatus = null) {
    try {
      const updateData = { status, updated_at: new Date().toISOString() };
      if (paymentStatus) updateData.payment_status = paymentStatus;
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update(updateData)
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

  // Récupérer les statistiques d'abonnements pour l'admin
  static async getSubscriptionStats() {
    try {
      const { data: stats, error } = await supabase.rpc('get_subscription_stats');
      
      if (error) {
        // Fallback si la fonction n'existe pas
        const { data: subscriptions } = await supabase
          .from('user_subscriptions')
          .select('status, payment_status, subscription_plans(price, role_type)');
        
        const statsData = {
          total: subscriptions?.length || 0,
          active: subscriptions?.filter(s => s.status === 'active').length || 0,
          pending: subscriptions?.filter(s => s.status === 'pending').length || 0,
          expired: subscriptions?.filter(s => s.status === 'expired').length || 0,
          revenue: subscriptions?.reduce((sum, s) => sum + (s.subscription_plans?.price || 0), 0) || 0
        };
        
        return { success: true, data: statsData };
      }
      
      return { success: true, data: stats };
    } catch (error) {
      console.error('Erreur statistiques abonnements:', error);
      return { success: false, error: error.message };
    }
  }

  // Enregistrer une action utilisateur pour les analytics
  static async logUserAction(userId, actionType, details = {}) {
    try {
      const { data, error } = await supabase
        .from('user_analytics')
        .insert({
          user_id: userId,
          action_type: actionType,
          details: details,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Erreur enregistrement action:', error);
      return { success: false, error: error.message };
    }
  }

  // Vérifier les limites d'usage d'un utilisateur
  static async checkUsageLimits(userId, resourceType) {
    try {
      const { data, error } = await supabase
        .from('usage_limits')
        .select('*')
        .eq('user_id', userId)
        .eq('resource_type', resourceType)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return { success: true, data };
    } catch (error) {
      console.error('Erreur vérification limites:', error);
      return { success: false, error: error.message };
    }
  }
}

export default SubscriptionService;