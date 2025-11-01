-- Fix RLS policies for purchase_cases
-- Date: 2024
-- Description: Corriger les policies RLS qui bloquent la création de dossiers

-- =====================================================
-- DIAGNOSTIC
-- =====================================================

-- Voir les policies actuelles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'purchase_cases'
ORDER BY cmd, policyname;

-- =====================================================
-- SUPPRESSION DES POLICIES RESTRICTIVES
-- =====================================================

-- Supprimer toutes les policies existantes pour recréer proprement
DROP POLICY IF EXISTS "Authenticated users can create cases" ON purchase_cases;
DROP POLICY IF EXISTS "Parties can update their cases" ON purchase_cases;
DROP POLICY IF EXISTS "Users can view their cases" ON purchase_cases;
DROP POLICY IF EXISTS "Admins can view all cases" ON purchase_cases;
DROP POLICY IF EXISTS "Users can delete their own cases" ON purchase_cases;

-- =====================================================
-- RECRÉATION DES POLICIES CORRECTES
-- =====================================================

-- Policy 1: SELECT - Parties peuvent voir leurs dossiers + admins
CREATE POLICY "purchase_cases_select_policy"
  ON purchase_cases FOR SELECT
  USING (
    -- Acheteur peut voir ses achats
    buyer_id = auth.uid()
    OR
    -- Vendeur peut voir ses ventes
    seller_id = auth.uid()
    OR
    -- Notaire assigné peut voir
    notaire_id = auth.uid()
    OR
    -- Admins peuvent tout voir
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy 2: INSERT - Tout utilisateur authentifié peut créer un dossier
CREATE POLICY "purchase_cases_insert_policy"
  ON purchase_cases FOR INSERT
  WITH CHECK (
    -- Utilisateur authentifié
    auth.uid() IS NOT NULL
    AND
    (
      -- L'utilisateur est soit le buyer
      buyer_id = auth.uid()
      OR
      -- Soit le seller
      seller_id = auth.uid()
      OR
      -- Soit un notaire
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('notaire', 'Notaire')
      )
      OR
      -- Soit un admin
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  );

-- Policy 3: UPDATE - Parties et notaire peuvent mettre à jour
CREATE POLICY "purchase_cases_update_policy"
  ON purchase_cases FOR UPDATE
  USING (
    buyer_id = auth.uid()
    OR
    seller_id = auth.uid()
    OR
    notaire_id = auth.uid()
    OR
    updated_by = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy 4: DELETE - Seulement admins et créateurs (avant signatures)
CREATE POLICY "purchase_cases_delete_policy"
  ON purchase_cases FOR DELETE
  USING (
    -- Admin
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR
    -- Buyer/Seller AVANT signature (status = 'initiated')
    (
      (buyer_id = auth.uid() OR seller_id = auth.uid())
      AND status = 'initiated'
    )
  );

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Voir les nouvelles policies
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK'
    WHEN qual IS NOT NULL THEN 'USING'
    ELSE 'NONE'
  END as clause_type
FROM pg_policies
WHERE tablename = 'purchase_cases'
ORDER BY cmd, policyname;

-- Test de permissions (exécuter en tant qu'utilisateur connecté)
-- SELECT current_user, current_setting('request.jwt.claims', true)::json->>'sub' as user_id;

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON POLICY "purchase_cases_select_policy" ON purchase_cases IS 
  'Permet aux buyers, sellers, notaires et admins de voir les dossiers concernés';

COMMENT ON POLICY "purchase_cases_insert_policy" ON purchase_cases IS 
  'Permet aux users authentifiés (buyers, sellers, notaires, admins) de créer des dossiers';

COMMENT ON POLICY "purchase_cases_update_policy" ON purchase_cases IS 
  'Permet aux parties concernées et notaires de mettre à jour les dossiers';

COMMENT ON POLICY "purchase_cases_delete_policy" ON purchase_cases IS 
  'Permet aux admins et aux parties de supprimer (avant signature seulement)';

-- =====================================================
-- FIN DE MIGRATION
-- =====================================================

-- Résultat attendu: 4 policies créées
-- Pour vérifier que RLS fonctionne, connectez-vous en frontend et créez un dossier
