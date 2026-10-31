-- ======================================================================
-- CORRECTION IMMÉDIATE DES CONTRAINTES DE RÔLES
-- Mise à jour de profiles_role_check pour inclure les nouveaux rôles
-- ======================================================================

-- Supprimer l'ancienne contrainte
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Créer la nouvelle contrainte avec tous les rôles (7 existants + 3 nouveaux)
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY(ARRAY[
    'admin'::text, 
    'particulier'::text, 
    'vendeur'::text, 
    'promoteur'::text, 
    'banque'::text, 
    'notaire'::text, 
    'agent_foncier'::text,
    'mairie'::text,
    'investisseur'::text,
    'geometre'::text
]));

-- Vérifier que la contrainte a été créée correctement
SELECT 
    '✅ === CONTRAINTE MISE À JOUR ===' as section;

SELECT 
    con.conname as constraint_name,
    pg_get_constraintdef(con.oid) as constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE nsp.nspname = 'public'
  AND rel.relname = 'profiles'
  AND con.conname = 'profiles_role_check';

SELECT 
    '📋 Nouveaux rôles maintenant autorisés: mairie, investisseur, geometre' as status;