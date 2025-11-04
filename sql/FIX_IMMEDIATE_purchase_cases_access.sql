-- ============================================================
-- FIX IMMÉDIAT: Accès aux dossiers purchase_cases
-- ============================================================
-- Créer des policies SIMPLES sans récursion
-- ============================================================

-- Désactiver temporairement RLS pour vérifier
ALTER TABLE purchase_cases DISABLE ROW LEVEL SECURITY;

-- Vérifier que les policies actuelles sont correctes
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'purchase_cases'
ORDER BY policyname;

-- Si vous voulez réactiver RLS avec policies simples:
-- ALTER TABLE purchase_cases ENABLE ROW LEVEL SECURITY;

-- Créer policies simples SANS vérification de role
-- (évite la récursion infinie)

-- Policy 1: Acheteurs voient leurs dossiers
DROP POLICY IF EXISTS "Acheteurs voient leurs dossiers" ON purchase_cases;
CREATE POLICY "Acheteurs voient leurs dossiers"
ON purchase_cases FOR SELECT
USING (buyer_id = auth.uid());

-- Policy 2: Vendeurs voient leurs dossiers
DROP POLICY IF EXISTS "Vendeurs voient leurs dossiers" ON purchase_cases;
CREATE POLICY "Vendeurs voient leurs dossiers"
ON purchase_cases FOR SELECT
USING (seller_id = auth.uid());

-- Policy 3: Notaires voient leurs dossiers assignés (SANS vérifier role)
DROP POLICY IF EXISTS "Notaires voient dossiers assignés" ON purchase_cases;
CREATE POLICY "Notaires voient dossiers assignés"
ON purchase_cases FOR SELECT
USING (notaire_id = auth.uid());

-- Policy 4: Acheteurs peuvent mettre à jour leurs dossiers
DROP POLICY IF EXISTS "Acheteurs update leurs dossiers" ON purchase_cases;
CREATE POLICY "Acheteurs update leurs dossiers"
ON purchase_cases FOR UPDATE
USING (buyer_id = auth.uid());

-- Policy 5: Vendeurs peuvent mettre à jour leurs dossiers
DROP POLICY IF EXISTS "Vendeurs update leurs dossiers" ON purchase_cases;
CREATE POLICY "Vendeurs update leurs dossiers"
ON purchase_cases FOR UPDATE
USING (seller_id = auth.uid());

-- Policy 6: Notaires peuvent mettre à jour leurs dossiers
DROP POLICY IF EXISTS "Notaires update dossiers assignés" ON purchase_cases;
CREATE POLICY "Notaires update dossiers assignés"
ON purchase_cases FOR UPDATE
USING (notaire_id = auth.uid());

-- Réactiver RLS
ALTER TABLE purchase_cases ENABLE ROW LEVEL SECURITY;

-- Vérifier les nouvelles policies
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename = 'purchase_cases'
ORDER BY policyname;

-- Message de confirmation
DO $$ 
BEGIN
    RAISE NOTICE 'Policies simples créées. Les dossiers sont maintenant accessibles.';
END $$;
