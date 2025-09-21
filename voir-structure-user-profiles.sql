-- ======================================================================
-- DIAGNOSTIC : STRUCTURE DE LA TABLE user_profiles
-- Voir quelles colonnes existent vraiment
-- ======================================================================

-- REQUÊTE 1: Voir la structure de user_profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'user_profiles'
ORDER BY ordinal_position;

-- REQUÊTE 2: Voir quelques données existantes dans user_profiles
SELECT *
FROM public.user_profiles
LIMIT 5;

-- REQUÊTE 3: Comparer avec la structure de profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;