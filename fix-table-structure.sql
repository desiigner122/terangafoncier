-- 🔧 CORRECTION STRUCTURE TABLES - TERANGA FONCIER
-- ================================================
-- À exécuter AVANT les scripts de création de données démo

-- Vérifier et ajouter la colonne title à requests si manquante
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='requests' AND column_name='title') THEN
        ALTER TABLE public.requests ADD COLUMN title TEXT;
        RAISE NOTICE '✅ Colonne title ajoutée à requests';
    ELSE
        RAISE NOTICE '✅ Colonne title existe déjà dans requests';
    END IF;
END $$;

-- Vérifier et ajouter la colonne property_id à requests si manquante
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='requests' AND column_name='property_id') THEN
        ALTER TABLE public.requests ADD COLUMN property_id UUID REFERENCES public.properties(id);
        RAISE NOTICE '✅ Colonne property_id ajoutée à requests';
    ELSE
        RAISE NOTICE '✅ Colonne property_id existe déjà dans requests';
    END IF;
END $$;

-- Vérifier et ajouter la colonne municipality_id à requests si manquante
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='requests' AND column_name='municipality_id') THEN
        ALTER TABLE public.requests ADD COLUMN municipality_id UUID REFERENCES public.profiles(id);
        RAISE NOTICE '✅ Colonne municipality_id ajoutée à requests';
    ELSE
        RAISE NOTICE '✅ Colonne municipality_id existe déjà dans requests';
    END IF;
END $$;

-- Vérifier et ajouter la colonne data à requests si manquante
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='requests' AND column_name='data') THEN
        ALTER TABLE public.requests ADD COLUMN data JSONB;
        RAISE NOTICE '✅ Colonne data ajoutée à requests';
    ELSE
        RAISE NOTICE '✅ Colonne data existe déjà dans requests';
    END IF;
END $$;

-- Vérifier et ajouter les colonnes manquantes à favorites
-- Vérifier et ajouter la colonne property_id à favorites si manquante
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='favorites' AND column_name='property_id') THEN
        ALTER TABLE public.favorites ADD COLUMN property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE;
        RAISE NOTICE '✅ Colonne property_id ajoutée à favorites';
    ELSE
        RAISE NOTICE '✅ Colonne property_id existe déjà dans favorites';
    END IF;
END $$;

-- Vérifier et ajouter la contrainte UNIQUE à favorites si manquante
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name='favorites' AND constraint_name LIKE '%user_id%property_id%') THEN
        ALTER TABLE public.favorites ADD CONSTRAINT favorites_user_property_unique UNIQUE(user_id, property_id);
        RAISE NOTICE '✅ Contrainte UNIQUE ajoutée à favorites';
    ELSE
        RAISE NOTICE '✅ Contrainte UNIQUE existe déjà dans favorites';
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE '⚠️ Contrainte UNIQUE favorites déjà existante ou erreur: %', SQLERRM;
END $$;

-- Vérifier et ajouter les types manquants pour requests
DO $$
BEGIN
    -- Vérifier si la contrainte existe
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'requests' AND constraint_name LIKE '%type%check%') THEN
        -- Supprimer l'ancienne contrainte
        ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_type_check;
    END IF;
    
    -- Ajouter la nouvelle contrainte avec tous les types
    ALTER TABLE public.requests ADD CONSTRAINT requests_type_check 
    CHECK (type IN ('visit', 'info', 'offer', 'municipal_land', 'financing'));
    
    RAISE NOTICE '✅ Contrainte type mise à jour pour requests';
END $$;

-- Vérifier et mettre à jour les statuts pour requests  
DO $$
BEGIN
    -- Vérifier si la contrainte existe
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'requests' AND constraint_name LIKE '%status%check%') THEN
        -- Supprimer l'ancienne contrainte
        ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_status_check;
    END IF;
    
    -- Ajouter la nouvelle contrainte avec tous les statuts
    ALTER TABLE public.requests ADD CONSTRAINT requests_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'in_progress'));
    
    RAISE NOTICE '✅ Contrainte status mise à jour pour requests';
END $$;

-- Vérifier et mettre à jour les statuts pour projects
DO $$
BEGIN
    -- Vérifier si la contrainte existe
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE table_name = 'projects' AND constraint_name LIKE '%status%check%') THEN
        -- Supprimer l'ancienne contrainte
        ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_status_check;
    END IF;
    
    -- Ajouter la nouvelle contrainte avec tous les statuts
    ALTER TABLE public.projects ADD CONSTRAINT projects_status_check 
    CHECK (status IN ('planning', 'construction', 'completed', 'sold_out', 'approved'));
    
    RAISE NOTICE '✅ Contrainte status mise à jour pour projects';
END $$;

-- ✅ VALIDATION STRUCTURE
DO $$
DECLARE
    requests_title_exists boolean;
    requests_property_id_exists boolean;
    requests_municipality_id_exists boolean;
    favorites_property_id_exists boolean;
    projects_table_exists boolean;
    requests_table_exists boolean;
    favorites_table_exists boolean;
BEGIN
    -- Vérifier si les colonnes existent dans requests
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='title'
    ) INTO requests_title_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='property_id'
    ) INTO requests_property_id_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='requests' AND column_name='municipality_id'
    ) INTO requests_municipality_id_exists;
    
    -- Vérifier si les colonnes existent dans favorites
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='favorites' AND column_name='property_id'
    ) INTO favorites_property_id_exists;
    
    -- Vérifier si les tables existent
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'projects'
    ) INTO projects_table_exists;
    
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'requests'
    ) INTO requests_table_exists;
    
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'favorites'
    ) INTO favorites_table_exists;
    
    RAISE NOTICE '🎉 Structure corrigée !';
    RAISE NOTICE '📋 Table requests: %', CASE WHEN requests_table_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '📝 requests.title: %', CASE WHEN requests_title_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '🏠 requests.property_id: %', CASE WHEN requests_property_id_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '🏛️ requests.municipality_id: %', CASE WHEN requests_municipality_id_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '❤️ Table favorites: %', CASE WHEN favorites_table_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '🏠 favorites.property_id: %', CASE WHEN favorites_property_id_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '🏗️ Table projects: %', CASE WHEN projects_table_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '';
    RAISE NOTICE '🔧 Prochaine étape: Exécuter create-demo-data-only.sql';
END $$;
