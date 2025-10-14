-- ============================================
-- MISE À JOUR DES TABLES EXISTANTES
-- ============================================
-- Date: 11 octobre 2025
-- Objectif: Ajouter les colonnes manquantes aux tables existantes
-- ============================================

-- ================================================
-- MISE À JOUR: PROPERTIES
-- ================================================

-- Ajouter les colonnes AI si elles n'existent pas
DO $$ 
BEGIN
    -- ai_score
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'ai_score'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN ai_score NUMERIC;
        RAISE NOTICE '✅ Colonne ai_score ajoutée à properties';
    END IF;

    -- ai_price_recommendation
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'ai_price_recommendation'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN ai_price_recommendation NUMERIC;
        RAISE NOTICE '✅ Colonne ai_price_recommendation ajoutée à properties';
    END IF;

    -- ai_analysis
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'ai_analysis'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN ai_analysis JSONB;
        RAISE NOTICE '✅ Colonne ai_analysis ajoutée à properties';
    END IF;

    -- blockchain_verified_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'blockchain_verified_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN blockchain_verified_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Colonne blockchain_verified_at ajoutée à properties';
    END IF;

    -- inquiries_count
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'inquiries_count'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN inquiries_count INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Colonne inquiries_count ajoutée à properties';
    END IF;

    -- main_image
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'main_image'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN main_image TEXT;
        RAISE NOTICE '✅ Colonne main_image ajoutée à properties';
    END IF;

    -- virtual_tour_url
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'virtual_tour_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN virtual_tour_url TEXT;
        RAISE NOTICE '✅ Colonne virtual_tour_url ajoutée à properties';
    END IF;

    -- condition
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'condition'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN condition TEXT;
        RAISE NOTICE '✅ Colonne condition ajoutée à properties';
    END IF;

    -- floors
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'floors'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN floors INTEGER DEFAULT 1;
        RAISE NOTICE '✅ Colonne floors ajoutée à properties';
    END IF;

    -- parking_spaces
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'parking_spaces'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN parking_spaces INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Colonne parking_spaces ajoutée à properties';
    END IF;

    -- year_built
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'year_built'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN year_built INTEGER;
        RAISE NOTICE '✅ Colonne year_built ajoutée à properties';
    END IF;

    -- has_permis_construire
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'has_permis_construire'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN has_permis_construire BOOLEAN DEFAULT false;
        RAISE NOTICE '✅ Colonne has_permis_construire ajoutée à properties';
    END IF;

    -- permis_construire_number
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'permis_construire_number'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN permis_construire_number TEXT;
        RAISE NOTICE '✅ Colonne permis_construire_number ajoutée à properties';
    END IF;

    -- slug
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'slug'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN slug TEXT UNIQUE;
        RAISE NOTICE '✅ Colonne slug ajoutée à properties';
    END IF;

    -- meta_title
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'meta_title'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN meta_title TEXT;
        RAISE NOTICE '✅ Colonne meta_title ajoutée à properties';
    END IF;

    -- meta_description
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'meta_description'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN meta_description TEXT;
        RAISE NOTICE '✅ Colonne meta_description ajoutée à properties';
    END IF;

    -- sold_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'sold_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN sold_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Colonne sold_at ajoutée à properties';
    END IF;

    -- deleted_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'properties' 
        AND column_name = 'deleted_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.properties ADD COLUMN deleted_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Colonne deleted_at ajoutée à properties';
    END IF;

END $$;

-- ================================================
-- MISE À JOUR: CONVERSATIONS
-- ================================================

DO $$ 
BEGIN
    -- last_message_preview
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conversations' 
        AND column_name = 'last_message_preview'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.conversations ADD COLUMN last_message_preview TEXT;
        RAISE NOTICE '✅ Colonne last_message_preview ajoutée à conversations';
    END IF;

    -- archived_by_1
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conversations' 
        AND column_name = 'archived_by_1'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.conversations ADD COLUMN archived_by_1 BOOLEAN DEFAULT false;
        RAISE NOTICE '✅ Colonne archived_by_1 ajoutée à conversations';
    END IF;

    -- archived_by_2
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'conversations' 
        AND column_name = 'archived_by_2'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.conversations ADD COLUMN archived_by_2 BOOLEAN DEFAULT false;
        RAISE NOTICE '✅ Colonne archived_by_2 ajoutée à conversations';
    END IF;

END $$;

-- ================================================
-- MISE À JOUR: MESSAGES
-- ================================================

DO $$ 
BEGIN
    -- receiver_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' 
        AND column_name = 'receiver_id'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
        RAISE NOTICE '✅ Colonne receiver_id ajoutée à messages';
    END IF;

    -- attachments
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' 
        AND column_name = 'attachments'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN attachments TEXT[];
        RAISE NOTICE '✅ Colonne attachments ajoutée à messages';
    END IF;

    -- edited_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' 
        AND column_name = 'edited_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN edited_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Colonne edited_at ajoutée à messages';
    END IF;

    -- deleted_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'messages' 
        AND column_name = 'deleted_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.messages ADD COLUMN deleted_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Colonne deleted_at ajoutée à messages';
    END IF;

END $$;

-- ================================================
-- MISE À JOUR: PROJECTS
-- ================================================

DO $$ 
BEGIN
    -- deleted_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'deleted_at'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.projects ADD COLUMN deleted_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Colonne deleted_at ajoutée à projects';
    END IF;

END $$;

-- ================================================
-- CRÉER INDEX MANQUANTS
-- ================================================

DO $$ 
BEGIN
    -- Index pour properties.ai_score
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'properties' 
        AND indexname = 'idx_properties_ai_score'
    ) THEN
        CREATE INDEX idx_properties_ai_score ON public.properties(ai_score DESC) WHERE ai_score IS NOT NULL;
        RAISE NOTICE '✅ Index idx_properties_ai_score créé';
    END IF;

    -- Index pour properties.blockchain_verified
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'properties' 
        AND indexname = 'idx_properties_blockchain_verified'
    ) THEN
        CREATE INDEX idx_properties_blockchain_verified ON public.properties(blockchain_verified) WHERE blockchain_verified = true;
        RAISE NOTICE '✅ Index idx_properties_blockchain_verified créé';
    END IF;

    -- Index pour properties.slug
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'properties' 
        AND indexname = 'idx_properties_slug'
    ) THEN
        CREATE INDEX idx_properties_slug ON public.properties(slug) WHERE slug IS NOT NULL;
        RAISE NOTICE '✅ Index idx_properties_slug créé';
    END IF;

END $$;

-- ================================================
-- VÉRIFICATION FINALE
-- ================================================

SELECT 
    'properties' as table_name,
    COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_name = 'properties'
AND table_schema = 'public'
UNION ALL
SELECT 
    'conversations',
    COUNT(*)
FROM information_schema.columns
WHERE table_name = 'conversations'
AND table_schema = 'public'
UNION ALL
SELECT 
    'messages',
    COUNT(*)
FROM information_schema.columns
WHERE table_name = 'messages'
AND table_schema = 'public';

-- Liste des colonnes ajoutées aujourd'hui
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('properties', 'conversations', 'messages', 'projects')
AND column_name IN (
    'ai_score', 'ai_price_recommendation', 'ai_analysis',
    'blockchain_verified_at', 'inquiries_count', 'main_image',
    'virtual_tour_url', 'condition', 'floors', 'parking_spaces',
    'year_built', 'has_permis_construire', 'permis_construire_number',
    'slug', 'meta_title', 'meta_description', 'sold_at', 'deleted_at',
    'last_message_preview', 'archived_by_1', 'archived_by_2',
    'receiver_id', 'attachments', 'edited_at'
)
ORDER BY table_name, column_name;
