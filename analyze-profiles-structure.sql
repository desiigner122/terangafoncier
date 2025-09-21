-- ======================================================================
-- ANALYSE DE LA STRUCTURE DE LA TABLE PROFILES
-- Identifier les colonnes exactes disponibles
-- ======================================================================

-- Voir la structure complète de la table profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Voir un exemple de profil existant pour comprendre la structure
SELECT *
FROM public.profiles 
LIMIT 1;