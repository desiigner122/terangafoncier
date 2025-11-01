-- ============================================
-- FIX RLS TIMELINE - ACCÈS TOUS ACTEURS
-- ============================================
-- Permettre à l'acheteur, vendeur et notaire d'accéder aux événements
-- timeline des dossiers auxquels ils participent

-- 1. Supprimer l'ancienne policy restrictive
DROP POLICY IF EXISTS "timeline_select_policy" ON purchase_case_timeline;

-- 2. Créer une policy permissive pour tous les acteurs d'un dossier
CREATE POLICY "timeline_select_all_actors"
ON purchase_case_timeline
FOR SELECT
USING (
  -- Vérifier que l'utilisateur est acteur du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = purchase_case_timeline.case_id
      AND (
        -- L'utilisateur est l'acheteur
        pc.buyer_id = auth.uid()
        OR
        -- L'utilisateur est le vendeur
        pc.seller_id = auth.uid()
        OR
        -- L'utilisateur est le notaire assigné
        pc.notaire_id = auth.uid()
        OR
        -- L'utilisateur est dans l'équipe du notaire
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'notaire'
        )
      )
  )
);

-- 3. Idem pour purchase_case_history
DROP POLICY IF EXISTS "history_select_policy" ON purchase_case_history;

CREATE POLICY "history_select_all_actors"
ON purchase_case_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = purchase_case_history.case_id
      AND (
        pc.buyer_id = auth.uid()
        OR pc.seller_id = auth.uid()
        OR pc.notaire_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
            AND profiles.role = 'notaire'
        )
      )
  )
);

-- 4. Vérification - Afficher les policies actives
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
