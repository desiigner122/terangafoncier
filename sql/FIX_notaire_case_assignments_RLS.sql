-- ============================================================
-- FIX: Policies pour notaire_case_assignments
-- ============================================================
-- Erreur: new row violates row-level security policy for table "notaire_case_assignments"
-- Solution: Créer des policies simples permettant aux acheteurs/vendeurs de proposer des notaires
-- ============================================================

-- Désactiver RLS temporairement pour vérifier l'état actuel
ALTER TABLE notaire_case_assignments DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les anciennes policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'notaire_case_assignments'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON notaire_case_assignments', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Policy 1: Acheteurs peuvent créer des assignments (proposer un notaire)
CREATE POLICY "Acheteurs créent assignments"
ON notaire_case_assignments FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM purchase_cases
        WHERE id = case_id
        AND buyer_id = auth.uid()
    )
);

-- Policy 2: Vendeurs peuvent créer des assignments (proposer un notaire)
CREATE POLICY "Vendeurs créent assignments"
ON notaire_case_assignments FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM purchase_cases
        WHERE id = case_id
        AND seller_id = auth.uid()
    )
);

-- Policy 3: Acheteurs voient les assignments de leurs dossiers
CREATE POLICY "Acheteurs voient assignments"
ON notaire_case_assignments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM purchase_cases
        WHERE id = case_id
        AND buyer_id = auth.uid()
    )
);

-- Policy 4: Vendeurs voient les assignments de leurs dossiers
CREATE POLICY "Vendeurs voient assignments"
ON notaire_case_assignments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM purchase_cases
        WHERE id = case_id
        AND seller_id = auth.uid()
    )
);

-- Policy 5: Notaires voient leurs assignments
CREATE POLICY "Notaires voient leurs assignments"
ON notaire_case_assignments FOR SELECT
USING (notaire_id = auth.uid());

-- Policy 6: Acheteurs peuvent mettre à jour (approuver/refuser)
CREATE POLICY "Acheteurs update assignments"
ON notaire_case_assignments FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM purchase_cases
        WHERE id = case_id
        AND buyer_id = auth.uid()
    )
);

-- Policy 7: Vendeurs peuvent mettre à jour (approuver/refuser)
CREATE POLICY "Vendeurs update assignments"
ON notaire_case_assignments FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM purchase_cases
        WHERE id = case_id
        AND seller_id = auth.uid()
    )
);

-- Policy 8: Notaires peuvent mettre à jour leurs assignments (accepter/refuser, définir frais)
CREATE POLICY "Notaires update leurs assignments"
ON notaire_case_assignments FOR UPDATE
USING (notaire_id = auth.uid());

-- Réactiver RLS
ALTER TABLE notaire_case_assignments ENABLE ROW LEVEL SECURITY;

-- Vérifier les policies créées
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename = 'notaire_case_assignments'
ORDER BY policyname;

-- Message de confirmation
DO $$ 
BEGIN
    RAISE NOTICE '✅ Policies notaire_case_assignments créées avec succès';
END $$;
