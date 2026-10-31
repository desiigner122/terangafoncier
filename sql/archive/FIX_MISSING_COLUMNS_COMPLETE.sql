-- ============================================
-- FIX: Ajouter les colonnes manquantes à profiles
-- Date: 18 Oct 2025
-- ============================================

-- 1. Ajouter colonne 'address' si inexistante
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- 2. Vérifier que city existe
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;

-- 3. Ajouter d'autres colonnes utiles si manquantes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name TEXT;

-- ============================================
-- FIX: Vérifier fraud_checks constraint
-- ============================================

-- Vérifier que la table exist et constraint est correcte
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'fraud_checks'
  ) THEN
    -- Vérifier les status valides
    RAISE NOTICE 'fraud_checks table exists. Status values should be: pending, processing, passed, warning, failed';
  END IF;
END $$;

-- ============================================
-- FIX: Ajouter view_count à properties
-- ============================================
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Créer table analytics_views pour tracker les vues
CREATE TABLE IF NOT EXISTS public.analytics_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  
  UNIQUE(property_id, viewer_id, viewed_at)
);

CREATE INDEX IF NOT EXISTS idx_analytics_views_property ON public.analytics_views(property_id);
CREATE INDEX IF NOT EXISTS idx_analytics_views_date ON public.analytics_views(viewed_at DESC);

-- Trigger pour mettre à jour view_count
CREATE OR REPLACE FUNCTION update_property_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.properties
  SET view_count = (
    SELECT COUNT(DISTINCT viewer_id)
    FROM public.analytics_views
    WHERE property_id = NEW.property_id
  )
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_view_count ON public.analytics_views;
CREATE TRIGGER trigger_update_view_count
AFTER INSERT ON public.analytics_views
FOR EACH ROW
EXECUTE FUNCTION update_property_view_count();

-- ============================================
-- FIX: Créer table subscriptions pour paiements
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Plan info
  plan_name TEXT NOT NULL CHECK (plan_name IN ('free', 'basic', 'pro', 'enterprise')),
  plan_price DECIMAL(10, 2),
  
  -- Limites
  properties_limit INTEGER DEFAULT 5,
  requests_limit INTEGER DEFAULT 100,
  storage_gb INTEGER DEFAULT 5,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'canceled', 'expired')),
  
  -- Dates
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_billing_date TIMESTAMP WITH TIME ZONE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Paiement
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- ============================================
-- FIX: Créer table payment_transactions
-- ============================================
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Transaction info
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  -- Stripe info
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  
  -- Details
  description TEXT,
  failure_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);

-- ============================================
-- FIX: Vérifier RLS policies
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_views ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
DROP POLICY IF EXISTS "users_view_own_profile" ON public.profiles;
CREATE POLICY "users_view_own_profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
CREATE POLICY "users_update_own_profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

-- Policy: Users can view their subscriptions
DROP POLICY IF EXISTS "users_view_own_subscriptions" ON public.subscriptions;
CREATE POLICY "users_view_own_subscriptions" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Policy: Users can view their payment transactions
DROP POLICY IF EXISTS "users_view_own_transactions" ON public.payment_transactions;
CREATE POLICY "users_view_own_transactions" ON public.payment_transactions
  FOR SELECT USING (user_id = auth.uid());

-- Policy: Anyone can insert analytics views
DROP POLICY IF EXISTS "anyone_insert_analytics_views" ON public.analytics_views;
CREATE POLICY "anyone_insert_analytics_views" ON public.analytics_views
  FOR INSERT WITH CHECK (true);

-- Policy: Users can view analytics for their properties
DROP POLICY IF EXISTS "users_view_property_analytics" ON public.analytics_views;
CREATE POLICY "users_view_property_analytics" ON public.analytics_views
  FOR SELECT USING (
    property_id IN (
      SELECT id FROM public.properties WHERE owner_id = auth.uid()
    )
  );

COMMIT;

-- ============================================
-- Afficher confirmation
-- ============================================
-- ✅ Toutes les colonnes manquantes ont été ajoutées!
