-- ======================================================================
-- ANALYSE DE LA STRUCTURE DE LA TABLE AUTH.USERS
-- Identifier les colonnes exactes autorisées
-- ======================================================================

-- Voir la structure complète de la table auth.users
SELECT column_name, data_type, is_nullable, column_default, is_generated
FROM information_schema.columns 
WHERE table_schema = 'auth' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Identifier les colonnes générées (à éviter)
SELECT column_name, generation_expression
FROM information_schema.columns 
WHERE table_schema = 'auth' 
  AND table_name = 'users' 
  AND is_generated = 'ALWAYS';

-- Voir un exemple d'utilisateur existant pour comprendre la structure
SELECT 
    id, email, email_confirmed_at, confirmed_at,
    raw_user_meta_data, raw_app_meta_data,
    created_at, updated_at, is_super_admin
FROM auth.users 
LIMIT 1;