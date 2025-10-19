-- ============================================
-- ACTIVATION RLS ET POLITIQUES DE SÉCURITÉ
-- Date: 19 Oct 2025
-- Étape 2: Appliquer la sécurité sur les tables nouvellement créées.
-- ============================================

-- On active RLS et on définit des politiques simples pour chaque table.
-- Pour commencer, on autorise la lecture à tout le monde (pour que l'application puisse afficher les données)
-- et on restreint l'écriture aux utilisateurs connectés.

-- ============================================
-- 1. TABLE: purchase_requests
-- ============================================
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on purchase requests"
  ON public.purchase_requests FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to create purchase requests"
  ON public.purchase_requests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own purchase requests"
  ON public.purchase_requests FOR UPDATE
  USING (auth.uid() = buyer_id);

-- ============================================
-- 2. TABLE: case_tracking
-- ============================================
ALTER TABLE public.case_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on case tracking"
  ON public.case_tracking FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to create case tracking"
  ON public.case_tracking FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Allow users to update their own cases"
  ON public.case_tracking FOR UPDATE
  USING (auth.uid() = buyer_id);

-- ============================================
-- 3. TABLE: fraud_checks
-- ============================================
ALTER TABLE public.fraud_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admin read access on fraud checks"
  ON public.fraud_checks FOR SELECT
  USING (true); -- Simplifié pour l'instant

CREATE POLICY "Allow authenticated users to create fraud checks"
  ON public.fraud_checks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow owner to update their fraud checks"
  ON public.fraud_checks FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. TABLE: gps_verifications
-- ============================================
ALTER TABLE public.gps_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on gps verifications"
  ON public.gps_verifications FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to create gps verifications"
  ON public.gps_verifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- 5. TABLE: analytics_logs
-- ============================================
ALTER TABLE public.analytics_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert for authenticated users on analytics"
  ON public.analytics_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Pas de SELECT/UPDATE/DELETE pour les logs par défaut pour les utilisateurs
-- Seul le service role (backend) devrait pouvoir y accéder.

-- ============================================
-- 6. TABLE: support_tickets
-- ============================================
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to see their own support tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create support tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own support tickets"
  ON public.support_tickets FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. TABLE: digital_services
-- ============================================
ALTER TABLE public.digital_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to see their own digital services"
  ON public.digital_services FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to create digital services"
  ON public.digital_services FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own digital services"
  ON public.digital_services FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- ✅ SCRIPT DE SÉCURITÉ TERMINÉ
-- ============================================
