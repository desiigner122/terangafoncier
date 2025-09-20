-- VÉRIFIER LA STRUCTURE DE LA TABLE PROFILES
-- Ce script affiche la structure exacte de la table profiles

-- Voir les colonnes de la table profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Voir aussi les contraintes
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
  AND table_name = 'profiles';