-- ============================================
-- FIX RLS POLICIES FOR purchase_case_timeline
-- ============================================
-- Permet aux participants d'un dossier d'ajouter/lire les événements du timeline

-- 1. Activer RLS sur la table (si pas déjà fait)
ALTER TABLE purchase_case_timeline ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "timeline_select_policy" ON purchase_case_timeline;
DROP POLICY IF EXISTS "timeline_insert_policy" ON purchase_case_timeline;
DROP POLICY IF EXISTS "timeline_update_policy" ON purchase_case_timeline;
DROP POLICY IF EXISTS "timeline_delete_policy" ON purchase_case_timeline;

-- 3. POLITIQUE SELECT : Voir les événements des dossiers où on est participant
CREATE POLICY "timeline_select_policy" ON purchase_case_timeline
FOR SELECT
USING (
  -- Cas 1: L'utilisateur est participant actif du dossier
  EXISTS (
    SELECT 1 FROM purchase_case_participants
    WHERE purchase_case_participants.case_id = purchase_case_timeline.case_id
      AND purchase_case_participants.user_id = auth.uid()
      AND purchase_case_participants.status = 'active'
  )
  OR
  -- Cas 2: L'utilisateur est l'acheteur du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.buyer_id = auth.uid()
  )
  OR
  -- Cas 3: L'utilisateur est le vendeur du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.seller_id = auth.uid()
  )
  OR
  -- Cas 4: L'utilisateur est le notaire assigné
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.notaire_id = auth.uid()
  )
  OR
  -- Cas 5: L'utilisateur est administrateur
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- 4. POLITIQUE INSERT : Ajouter des événements aux dossiers où on est participant
CREATE POLICY "timeline_insert_policy" ON purchase_case_timeline
FOR INSERT
WITH CHECK (
  -- Cas 1: L'utilisateur est participant actif du dossier
  EXISTS (
    SELECT 1 FROM purchase_case_participants
    WHERE purchase_case_participants.case_id = purchase_case_timeline.case_id
      AND purchase_case_participants.user_id = auth.uid()
      AND purchase_case_participants.status = 'active'
  )
  OR
  -- Cas 2: L'utilisateur est l'acheteur du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.buyer_id = auth.uid()
  )
  OR
  -- Cas 3: L'utilisateur est le vendeur du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.seller_id = auth.uid()
  )
  OR
  -- Cas 4: L'utilisateur est le notaire assigné
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE purchase_cases.id = purchase_case_timeline.case_id
      AND purchase_cases.notaire_id = auth.uid()
  )
  OR
  -- Cas 5: L'utilisateur est administrateur
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- 5. POLITIQUE UPDATE : Modifier uniquement ses propres événements (ou si admin)
CREATE POLICY "timeline_update_policy" ON purchase_case_timeline
FOR UPDATE
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

-- 9. PAREIL pour purchase_case_history
ALTER TABLE purchase_case_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "history_select_policy" ON purchase_case_history;
DROP POLICY IF EXISTS "history_insert_policy" ON purchase_case_history;

CREATE POLICY "history_select_policy" ON purchase_case_history
FOR SELECT
USING (
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

CREATE POLICY "history_insert_policy" ON purchase_case_history
FOR INSERT
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
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('purchase_case_timeline', 'purchase_case_history')
ORDER BY tablename, policyname;

-- ✅ RÉSULTAT ATTENDU:
-- Les politiques devraient permettre:
-- - SELECT: Tous les participants du dossier
-- - INSERT: Tous les participants actifs
-- - UPDATE: Uniquement l'auteur ou admin
-- - DELETE: Uniquement admin
