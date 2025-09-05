-- ================================================================
-- SOLUTION UTILISATEURS ÉTAPE 2 - FIX DATABASE STRUCTURE  
-- Résout: Création utilisateur bloquée à l'étape 2
-- ================================================================

-- 1. VÉRIFICATION STRUCTURE ACTUELLE
SELECT '🔍 STRUCTURE ACTUELLE TABLE USERS:' as check_type;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. AJOUT COLONNES MANQUANTES (si elles n'existent pas)
DO $$
BEGIN
    -- Colonne région
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'region') THEN
        ALTER TABLE public.users ADD COLUMN region VARCHAR(100);
        RAISE NOTICE '✅ Colonne region ajoutée';
    ELSE
        RAISE NOTICE '✅ Colonne region existe déjà';
    END IF;

    -- Colonne département
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'departement') THEN
        ALTER TABLE public.users ADD COLUMN departement VARCHAR(100);
        RAISE NOTICE '✅ Colonne departement ajoutée';
    ELSE
        RAISE NOTICE '✅ Colonne departement existe déjà';
    END IF;

    -- Colonne commune
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'commune') THEN
        ALTER TABLE public.users ADD COLUMN commune VARCHAR(100);
        RAISE NOTICE '✅ Colonne commune ajoutée';
    ELSE
        RAISE NOTICE '✅ Colonne commune existe déjà';
    END IF;

    -- Colonne adresse
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'address') THEN
        ALTER TABLE public.users ADD COLUMN address TEXT;
        RAISE NOTICE '✅ Colonne address ajoutée';
    ELSE
        RAISE NOTICE '✅ Colonne address existe déjà';
    END IF;

END $$;

-- 3. OPTIMISATION COLONNES EXISTANTES
-- S'assurer que phone permet les numéros sénégalais
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'users' AND column_name = 'phone' 
               AND character_maximum_length < 20) THEN
        ALTER TABLE public.users ALTER COLUMN phone TYPE VARCHAR(20);
        RAISE NOTICE '✅ Colonne phone élargie pour numéros sénégalais';
    END IF;
END $$;

-- 4. CRÉATION INDEX POUR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_region ON public.users(region);
CREATE INDEX IF NOT EXISTS idx_users_departement ON public.users(departement);
CREATE INDEX IF NOT EXISTS idx_users_commune ON public.users(commune);

-- 5. VALEURS PAR DÉFAUT POUR DONNÉES EXISTANTES
UPDATE public.users 
SET region = 'Dakar',
    departement = 'Dakar', 
    commune = 'Dakar'
WHERE region IS NULL OR region = '';

-- 6. VÉRIFICATION FINALE
SELECT '🔍 STRUCTURE FINALE TABLE USERS:' as check_type;
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
  AND column_name IN ('region', 'departement', 'commune', 'address', 'phone', 'email', 'full_name', 'role')
ORDER BY 
    CASE column_name
        WHEN 'full_name' THEN 1
        WHEN 'email' THEN 2  
        WHEN 'phone' THEN 3
        WHEN 'role' THEN 4
        WHEN 'region' THEN 5
        WHEN 'departement' THEN 6
        WHEN 'commune' THEN 7
        WHEN 'address' THEN 8
        ELSE 9
    END;

-- 7. TEST INSERTION UTILISATEUR
INSERT INTO public.users (
    full_name, email, phone, role, region, departement, commune, address
) VALUES (
    'Test Utilisateur', 
    'test@example.com', 
    '+221771234567', 
    'particulier',
    'Dakar',
    'Dakar', 
    'Plateau',
    'Rue de la République'
) ON CONFLICT (email) DO NOTHING;

-- Vérifier que l'insertion a fonctionné
SELECT '🧪 TEST INSERTION:' as check_type;
SELECT full_name, email, role, region, departement, commune, 
       CASE WHEN address IS NOT NULL THEN 'Adresse OK' ELSE 'Pas d''adresse' END as address_status
FROM public.users 
WHERE email = 'test@example.com';

-- 8. NETTOYAGE TEST
DELETE FROM public.users WHERE email = 'test@example.com';

-- 9. STATISTIQUES FINALES
SELECT '📊 STATISTIQUES USERS:' as check_type;
SELECT 
    COUNT(*) as total_users,
    COUNT(region) as users_with_region,
    COUNT(DISTINCT region) as regions_distinctes,
    COUNT(DISTINCT role) as roles_distincts
FROM public.users;

-- 10. CONFIRMATION SUCCÈS
SELECT '✅ TABLE USERS COMPLÈTEMENT CONFIGURÉE' as status,
       'Création utilisateurs étape 2 devrait maintenant fonctionner' as message;
