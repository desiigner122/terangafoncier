-- ========================================
-- FIX RLS POLICIES - VERSION SAFE
-- ========================================
-- Supprime les anciennes politiques et en crée de nouvelles

-- ========================================
-- 1. SUPPRIMER TOUTES LES ANCIENNES POLITIQUES
-- ========================================

-- Parcels policies
DROP POLICY IF EXISTS "parcels_select_all" ON public.parcels;
DROP POLICY IF EXISTS "parcels_select_authenticated" ON public.parcels;
DROP POLICY IF EXISTS "parcels_select_public" ON public.parcels;
DROP POLICY IF EXISTS "parcels_insert_authenticated" ON public.parcels;
DROP POLICY IF EXISTS "parcels_update_owner" ON public.parcels;
DROP POLICY IF EXISTS "parcels_delete_owner" ON public.parcels;

-- Transactions policies
DROP POLICY IF EXISTS "transactions_select_own" ON public.transactions;
DROP POLICY IF EXISTS "transactions_select_authenticated" ON public.transactions;
DROP POLICY IF EXISTS "transactions_select_system" ON public.transactions;
DROP POLICY IF EXISTS "transactions_insert_authenticated" ON public.transactions;
DROP POLICY IF EXISTS "transactions_update_own" ON public.transactions;

-- Requests policies
DROP POLICY IF EXISTS "requests_select_own" ON public.requests;
DROP POLICY IF EXISTS "requests_select_authenticated" ON public.requests;
DROP POLICY IF EXISTS "requests_insert_authenticated" ON public.requests;
DROP POLICY IF EXISTS "requests_update_own" ON public.requests;

-- Fraud analysis policies
DROP POLICY IF EXISTS "fraud_analysis_select_admin" ON public.fraud_analysis;
DROP POLICY IF EXISTS "fraud_analysis_select_authenticated" ON public.fraud_analysis;
DROP POLICY IF EXISTS "fraud_analysis_insert_system" ON public.fraud_analysis;

-- ========================================
-- 2. ENABLE RLS (au cas où)
-- ========================================

ALTER TABLE public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Créer fraud_analysis si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.fraud_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  fraud_score NUMERIC(3,2) DEFAULT 0,
  risk_level TEXT,
  flags JSONB DEFAULT '[]'::jsonb,
  analysis_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.fraud_analysis ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. CRÉER LES NOUVELLES POLITIQUES
-- ========================================

-- PARCELS: Lecture pour tous les authentifiés
CREATE POLICY "parcels_select_authenticated"
ON public.parcels
FOR SELECT
TO authenticated
USING (true);

-- PARCELS: Lecture publique pour parcelles disponibles
CREATE POLICY "parcels_select_public"
ON public.parcels
FOR SELECT
TO anon
USING (status = 'available' OR status = 'verified');

-- PARCELS: Insertion pour authentifiés
CREATE POLICY "parcels_insert_authenticated"
ON public.parcels
FOR INSERT
TO authenticated
WITH CHECK (true);

-- PARCELS: Mise à jour par propriétaire
CREATE POLICY "parcels_update_owner"
ON public.parcels
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- TRANSACTIONS: Lecture pour système (fraud check)
CREATE POLICY "transactions_select_system"
ON public.transactions
FOR SELECT
TO authenticated
USING (true);

-- TRANSACTIONS: Lecture pour propriétaire
CREATE POLICY "transactions_select_own"
ON public.transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- TRANSACTIONS: Insertion pour authentifiés
CREATE POLICY "transactions_insert_authenticated"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- TRANSACTIONS: Mise à jour par propriétaire
CREATE POLICY "transactions_update_own"
ON public.transactions
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- REQUESTS: Lecture pour propriétaire
CREATE POLICY "requests_select_own"
ON public.requests
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- REQUESTS: Insertion pour authentifiés
CREATE POLICY "requests_insert_authenticated"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- REQUESTS: Mise à jour par propriétaire
CREATE POLICY "requests_update_own"
ON public.requests
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- FRAUD_ANALYSIS: Insertion système
CREATE POLICY "fraud_analysis_insert_system"
ON public.fraud_analysis
FOR INSERT
TO authenticated
WITH CHECK (true);

-- FRAUD_ANALYSIS: Lecture pour authentifiés
CREATE POLICY "fraud_analysis_select_authenticated"
ON public.fraud_analysis
FOR SELECT
TO authenticated
USING (true);

-- ========================================
-- 4. GRANT PERMISSIONS
-- ========================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.parcels TO authenticated;
GRANT SELECT ON public.parcels TO anon;
GRANT SELECT, INSERT, UPDATE ON public.transactions TO authenticated;
GRANT SELECT, INSERT ON public.fraud_analysis TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.requests TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ========================================
-- 5. VÉRIFICATION
-- ========================================

SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('parcels', 'transactions', 'requests', 'fraud_analysis')
ORDER BY tablename, policyname;

-- ========================================
-- MESSAGE DE SUCCÈS
-- ========================================

DO $$ 
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅✅✅ POLITIQUES RLS CONFIGURÉES ✅✅✅';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Politiques créées pour:';
  RAISE NOTICE '  - parcels (SELECT, INSERT, UPDATE)';
  RAISE NOTICE '  - transactions (SELECT, INSERT, UPDATE)';
  RAISE NOTICE '  - requests (SELECT, INSERT, UPDATE)';
  RAISE NOTICE '  - fraud_analysis (SELECT, INSERT)';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Les erreurs CORS devraient être résolues';
  RAISE NOTICE '';
END $$;
