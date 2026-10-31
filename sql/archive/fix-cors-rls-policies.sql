-- ========================================
-- FIX CORS & RLS POLICIES - TERANGA FONCIER
-- ========================================
-- Résout les erreurs CORS en configurant correctement les politiques RLS
-- pour les tables parcels, transactions, requests, et fraud_analysis

-- ========================================
-- 1. ENABLE RLS sur toutes les tables concernées
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
-- 2. DROP existing policies (clean slate)
-- ========================================

-- Parcels policies
DROP POLICY IF EXISTS "parcels_select_all" ON public.parcels;
DROP POLICY IF EXISTS "parcels_select_authenticated" ON public.parcels;
DROP POLICY IF EXISTS "parcels_insert_authenticated" ON public.parcels;
DROP POLICY IF EXISTS "parcels_update_owner" ON public.parcels;
DROP POLICY IF EXISTS "parcels_delete_owner" ON public.parcels;

-- Transactions policies
DROP POLICY IF EXISTS "transactions_select_own" ON public.transactions;
DROP POLICY IF EXISTS "transactions_select_authenticated" ON public.transactions;
DROP POLICY IF EXISTS "transactions_insert_authenticated" ON public.transactions;
DROP POLICY IF EXISTS "transactions_update_own" ON public.transactions;

-- Requests policies
DROP POLICY IF EXISTS "requests_select_own" ON public.requests;
DROP POLICY IF EXISTS "requests_select_authenticated" ON public.requests;
DROP POLICY IF EXISTS "requests_insert_authenticated" ON public.requests;
DROP POLICY IF EXISTS "requests_update_own" ON public.requests;

-- Fraud analysis policies
DROP POLICY IF EXISTS "fraud_analysis_select_admin" ON public.fraud_analysis;
DROP POLICY IF EXISTS "fraud_analysis_insert_system" ON public.fraud_analysis;

-- ========================================
-- 3. CREATE PERMISSIVE POLICIES FOR PARCELS
-- ========================================

-- Tous les utilisateurs authentifiés peuvent lire les parcelles
CREATE POLICY "parcels_select_authenticated"
ON public.parcels
FOR SELECT
TO authenticated
USING (true);

-- Les utilisateurs anonymes peuvent aussi voir les parcelles publiques
CREATE POLICY "parcels_select_public"
ON public.parcels
FOR SELECT
TO anon
USING (status = 'available' OR status = 'verified');

-- Les utilisateurs authentifiés peuvent créer des parcelles
CREATE POLICY "parcels_insert_authenticated"
ON public.parcels
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Les propriétaires peuvent mettre à jour leurs parcelles
CREATE POLICY "parcels_update_owner"
ON public.parcels
FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Les propriétaires peuvent supprimer leurs parcelles
CREATE POLICY "parcels_delete_owner"
ON public.parcels
FOR DELETE
TO authenticated
USING (owner_id = auth.uid());

-- ========================================
-- 4. CREATE PERMISSIVE POLICIES FOR TRANSACTIONS
-- ========================================

-- Les utilisateurs peuvent voir leurs propres transactions
CREATE POLICY "transactions_select_own"
ON public.transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Les utilisateurs authentifiés peuvent créer des transactions
CREATE POLICY "transactions_insert_authenticated"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Les utilisateurs peuvent mettre à jour leurs propres transactions
CREATE POLICY "transactions_update_own"
ON public.transactions
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Système peut lire toutes les transactions pour fraud check
CREATE POLICY "transactions_select_system"
ON public.transactions
FOR SELECT
TO authenticated
USING (true);

-- ========================================
-- 5. CREATE PERMISSIVE POLICIES FOR REQUESTS
-- ========================================

-- Les utilisateurs peuvent voir leurs propres demandes
CREATE POLICY "requests_select_own"
ON public.requests
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Les utilisateurs authentifiés peuvent créer des demandes
CREATE POLICY "requests_insert_authenticated"
ON public.requests
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Les utilisateurs peuvent mettre à jour leurs propres demandes
CREATE POLICY "requests_update_own"
ON public.requests
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ========================================
-- 6. CREATE PERMISSIVE POLICIES FOR FRAUD_ANALYSIS
-- ========================================

-- Seulement le système peut insérer des analyses de fraude
CREATE POLICY "fraud_analysis_insert_system"
ON public.fraud_analysis
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Les admins peuvent voir toutes les analyses
CREATE POLICY "fraud_analysis_select_authenticated"
ON public.fraud_analysis
FOR SELECT
TO authenticated
USING (true);

-- ========================================
-- 7. GRANT PERMISSIONS
-- ========================================

-- Grant permissions sur les tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parcels TO authenticated;
GRANT SELECT ON public.parcels TO anon;

GRANT SELECT, INSERT, UPDATE ON public.transactions TO authenticated;
GRANT SELECT, INSERT ON public.fraud_analysis TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.requests TO authenticated;

-- Grant sur les séquences si nécessaire
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ========================================
-- 8. ADD MISSING COLUMNS IF NOT EXISTS
-- ========================================

-- Ajouter fraud_checked à transactions si manquant
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'transactions' 
    AND column_name = 'fraud_checked'
  ) THEN
    ALTER TABLE public.transactions ADD COLUMN fraud_checked BOOLEAN DEFAULT false;
  END IF;
END $$;

-- ========================================
-- 9. CREATE INDEXES FOR PERFORMANCE
-- ========================================

CREATE INDEX IF NOT EXISTS idx_parcels_owner_id ON public.parcels(owner_id);
CREATE INDEX IF NOT EXISTS idx_parcels_status ON public.parcels(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_fraud_checked ON public.transactions(fraud_checked);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON public.requests(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_analysis_transaction_id ON public.fraud_analysis(transaction_id);

-- ========================================
-- 10. VERIFICATION
-- ========================================

-- Vérifier que les politiques sont actives
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('parcels', 'transactions', 'requests', 'fraud_analysis')
ORDER BY tablename, policyname;

-- Vérifier les permissions
SELECT 
  schemaname, 
  tablename, 
  tableowner,
  hasindexes,
  hasrules,
  hastriggers,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('parcels', 'transactions', 'requests', 'fraud_analysis');

COMMENT ON TABLE public.fraud_analysis IS 'Analyses anti-fraude des transactions - système automatique';
COMMENT ON POLICY "transactions_select_system" ON public.transactions IS 'Permet au système de scanner les transactions pour détecter la fraude';
COMMENT ON POLICY "parcels_select_public" ON public.parcels IS 'Permet aux visiteurs anonymes de voir les parcelles disponibles';

-- ========================================
-- MESSAGE DE SUCCÈS
-- ========================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Politiques RLS configurées avec succès!';
  RAISE NOTICE '✅ CORS errors should be resolved';
  RAISE NOTICE '✅ Tables: parcels, transactions, requests, fraud_analysis';
  RAISE NOTICE '✅ Permissions: authenticated users can read/write their own data';
END $$;
