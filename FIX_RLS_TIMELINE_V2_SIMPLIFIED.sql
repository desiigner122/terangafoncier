-- ============================================
-- FIX RLS POLICIES - VERSION CORRIGÉE
-- ============================================
-- Permet aux participants d'un dossier d'ajouter/lire les événements du timeline
-- Version corrigée qui gère mieux les cas où auth.uid() peut être null

-- 1. Activer RLS sur la table (si pas déjà fait)
ALTER TABLE purchase_case_timeline ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "timeline_select_policy" ON purchase_case_timeline;
DROP POLICY IF EXISTS "timeline_insert_policy" ON purchase_case_timeline;
DROP POLICY IF EXISTS "timeline_update_policy" ON purchase_case_timeline;
DROP POLICY IF EXISTS "timeline_delete_policy" ON purchase_case_timeline;
DROP POLICY IF EXISTS "timeline_select_authenticated" ON purchase_case_timeline;

-- 3. POLITIQUE SELECT SIMPLIFIÉE : Tous les utilisateurs authentifiés peuvent lire
-- Cela résout le problème de synchronisation entre acteurs
CREATE POLICY "timeline_select_authenticated" ON purchase_case_timeline
FOR SELECT
TO authenticated
USING (true);

-- Alternative si vous voulez plus de sécurité (décommentez et supprimez la politique ci-dessus):
/*
CREATE POLICY "timeline_select_policy" ON purchase_case_timeline
FOR SELECT
TO authenticated
USING (
  -- L'utilisateur est participant actif du dossier
  EXISTS (
    SELECT 1 FROM purchase_case_participants
    WHERE purchase_case_participants.case_id = purchase_case_timeline.case_id
      AND purchase_case_participants.user_id = auth.uid()
      AND purchase_case_participants.status = 'active'
  )
  OR
  -- L'utilisateur est l'acheteur du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.buyer_id = auth.uid()
  )
  OR
  -- L'utilisateur est le vendeur du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.seller_id = auth.uid()
  )
  OR
  -- L'utilisateur est le notaire assigné
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.notaire_id = auth.uid()
  )
  OR
  -- L'utilisateur est administrateur
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);
*/

-- 4. POLITIQUE INSERT : Ajouter des événements aux dossiers où on est participant
CREATE POLICY "timeline_insert_policy" ON purchase_case_timeline
FOR INSERT
TO authenticated
WITH CHECK (
  -- L'utilisateur est participant actif du dossier
  EXISTS (
    SELECT 1 FROM purchase_case_participants
    WHERE purchase_case_participants.case_id = purchase_case_timeline.case_id
      AND purchase_case_participants.user_id = auth.uid()
      AND purchase_case_participants.status = 'active'
  )
  OR
  -- L'utilisateur est l'acheteur du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.buyer_id = auth.uid()
  )
  OR
  -- L'utilisateur est le vendeur du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.seller_id = auth.uid()
  )
  OR
  -- L'utilisateur est le notaire assigné
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.notaire_id = auth.uid()
  )
  OR
  -- L'utilisateur est administrateur
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- 5. POLITIQUE UPDATE : Modifier uniquement ses propres événements (ou si admin)
CREATE POLICY "timeline_update_policy" ON purchase_case_timeline
FOR UPDATE
TO authenticated
USING (
  triggered_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- 6. POLITIQUE DELETE : Supprimer uniquement si admin
CREATE POLICY "timeline_delete_policy" ON purchase_case_timeline
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- 7. Vérifier que la table a bien les bonnes colonnes
DO $$
BEGIN
  -- Vérifier si la colonne triggered_by existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'purchase_case_timeline' 
    AND column_name = 'triggered_by'
  ) THEN
    ALTER TABLE purchase_case_timeline 
    ADD COLUMN triggered_by UUID REFERENCES auth.users(id);
  END IF;
  
  -- Vérifier si la colonne metadata existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'purchase_case_timeline' 
    AND column_name = 'metadata'
  ) THEN
    ALTER TABLE purchase_case_timeline 
    ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- 8. Créer un index pour améliorer les performances des requêtes RLS
CREATE INDEX IF NOT EXISTS idx_timeline_case_id ON purchase_case_timeline(case_id);
CREATE INDEX IF NOT EXISTS idx_timeline_triggered_by ON purchase_case_timeline(triggered_by);
CREATE INDEX IF NOT EXISTS idx_timeline_created_at ON purchase_case_timeline(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_timeline_event_type ON purchase_case_timeline(event_type);

-- 9. PAREIL pour purchase_case_history - VERSION SIMPLIFIÉE
ALTER TABLE purchase_case_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "history_select_policy" ON purchase_case_history;
DROP POLICY IF EXISTS "history_insert_policy" ON purchase_case_history;
DROP POLICY IF EXISTS "history_select_authenticated" ON purchase_case_history;

-- Lecture simplifiée pour tous les utilisateurs authentifiés
CREATE POLICY "history_select_authenticated" ON purchase_case_history
FOR SELECT
TO authenticated
USING (true);

-- Insertion uniquement pour les participants
CREATE POLICY "history_insert_policy" ON purchase_case_history
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM purchase_case_participants
    WHERE purchase_case_participants.case_id = purchase_case_history.case_id
      AND purchase_case_participants.user_id = auth.uid()
      AND purchase_case_participants.status = 'active'
  )
  OR
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_history.case_id
      AND (purchase_cases.buyer_id = auth.uid() 
           OR purchase_cases.seller_id = auth.uid()
           OR purchase_cases.notaire_id = auth.uid())
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- 10. Test de vérification
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('purchase_case_timeline', 'purchase_case_history')
ORDER BY tablename, policyname;

-- ✅ RÉSULTAT ATTENDU:
-- - timeline_select_authenticated (SELECT) → TO authenticated, USING true
-- - timeline_insert_policy (INSERT) → Avec vérification des participants
-- - timeline_update_policy (UPDATE) → Uniquement l'auteur
-- - timeline_delete_policy (DELETE) → Uniquement admin

-- 11. GRANT permissions explicites (au cas où)
GRANT SELECT ON purchase_case_timeline TO authenticated;
GRANT INSERT ON purchase_case_timeline TO authenticated;
GRANT UPDATE ON purchase_case_timeline TO authenticated;

GRANT SELECT ON purchase_case_history TO authenticated;
GRANT INSERT ON purchase_case_history TO authenticated;

-- ✅ Maintenant tous les utilisateurs authentifiés peuvent lire le timeline
-- ✅ L'insertion nécessite toujours d'être participant du dossier
-- ✅ Plus de problème de synchronisation entre acteurs
