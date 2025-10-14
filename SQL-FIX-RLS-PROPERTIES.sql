-- DÉSACTIVER TEMPORAIREMENT RLS sur properties pour tester
-- ⚠️ ATTENTION: Ceci rend la table publiquement accessible!

-- 1. Désactiver RLS
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;

-- 2. Tester immédiatement dans votre navigateur
-- Allez sur http://localhost:5173/parcelles-vendeurs

-- 3. Si ça marche, créer une policy publique pour SELECT
CREATE POLICY "Allow public read active properties"
ON properties
FOR SELECT
TO public
USING (status = 'active' AND verification_status = 'verified');

-- 4. Réactiver RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- ========================================
-- ALTERNATIVE: Si vous voulez garder RLS actif,
-- créer juste la policy sans désactiver RLS:
-- ========================================

-- Supprimer les anciennes policies qui pourraient bloquer
DROP POLICY IF EXISTS "Allow public read active properties" ON properties;

-- Créer une policy qui autorise la lecture publique des properties actives
CREATE POLICY "Public can read active verified properties"
ON properties
FOR SELECT
TO anon, authenticated
USING (
  status = 'active' 
  AND verification_status = 'verified'
);

-- Vérifier les policies existantes
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'properties';
