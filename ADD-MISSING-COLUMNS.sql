-- ======================================================================
-- AJOUT DES COLONNES MANQUANTES DANS PROFILES
-- ======================================================================
-- Ce script ajoute les colonnes full_name et nom si elles n'existent pas
-- ======================================================================

SELECT '🔍 ÉTAPE 1: VÉRIFICATION DES COLONNES EXISTANTES' as etape;

-- Vérifier les colonnes actuelles de la table profiles
DO $$
DECLARE
    col_record RECORD;
BEGIN
    RAISE NOTICE '📋 Colonnes existantes dans profiles:';
    FOR col_record IN 
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'profiles'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  - % (%, nullable: %)', col_record.column_name, col_record.data_type, col_record.is_nullable;
    END LOOP;
END $$;

SELECT '➕ ÉTAPE 2: AJOUT DES COLONNES MANQUANTES' as etape;

-- Ajouter la colonne full_name si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
          AND column_name = 'full_name'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
        RAISE NOTICE '✅ Colonne full_name ajoutée';
    ELSE
        RAISE NOTICE '✅ Colonne full_name existe déjà';
    END IF;
END $$;

-- Ajouter la colonne nom si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
          AND column_name = 'nom'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN nom TEXT;
        RAISE NOTICE '✅ Colonne nom ajoutée';
    ELSE
        RAISE NOTICE '✅ Colonne nom existe déjà';
    END IF;
END $$;

-- Ajouter la colonne first_name si elle n'existe pas (au cas où)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
          AND column_name = 'first_name'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN first_name TEXT;
        RAISE NOTICE '✅ Colonne first_name ajoutée';
    ELSE
        RAISE NOTICE '✅ Colonne first_name existe déjà';
    END IF;
END $$;

-- Ajouter la colonne last_name si elle n'existe pas (au cas où)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
          AND column_name = 'last_name'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN last_name TEXT;
        RAISE NOTICE '✅ Colonne last_name ajoutée';
    ELSE
        RAISE NOTICE '✅ Colonne last_name existe déjà';
    END IF;
END $$;

SELECT '🔄 ÉTAPE 3: MIGRATION DES DONNÉES EXISTANTES' as etape;

-- Migrer les données depuis auth.users.raw_user_meta_data si disponibles
DO $$
DECLARE
    updated_count integer := 0;
BEGIN
    -- Mettre à jour full_name depuis raw_user_meta_data
    UPDATE profiles p
    SET full_name = COALESCE(
        (SELECT u.raw_user_meta_data->>'full_name' FROM auth.users u WHERE u.id = p.id),
        (SELECT u.raw_user_meta_data->>'name' FROM auth.users u WHERE u.id = p.id),
        p.email
    )
    WHERE p.full_name IS NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE '✅ % profils mis à jour avec full_name', updated_count;
    
    -- Mettre à jour nom comme fallback (alias de full_name)
    UPDATE profiles
    SET nom = full_name
    WHERE nom IS NULL AND full_name IS NOT NULL;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RAISE NOTICE '✅ % profils mis à jour avec nom', updated_count;
    
END $$;

SELECT '🔄 ÉTAPE 4: RAFRAÎCHIR LE CACHE SUPABASE' as etape;

NOTIFY pgrst, 'reload schema';

DO $$
BEGIN
    RAISE NOTICE '✅ Cache PostgREST rafraîchi';
END $$;

SELECT '✅ ÉTAPE 5: VÉRIFICATION FINALE' as etape;

-- Afficher un échantillon des données
SELECT 
    '✅ ÉCHANTILLON DES DONNÉES' as status,
    id,
    email,
    full_name,
    nom,
    first_name,
    last_name
FROM profiles
LIMIT 5;

SELECT '🎉 COLONNES AJOUTÉES AVEC SUCCÈS!' as resultat;
