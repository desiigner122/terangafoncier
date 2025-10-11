-- ======================================================================
-- FIX NOTIFICATIONS - COLONNE READ_AT
-- ======================================================================
-- Ce script ajoute/vérifie la colonne read_at dans notifications
-- et supprime l'ancienne colonne 'read' si elle existe
-- ======================================================================

SELECT '🔍 ÉTAPE 1: VÉRIFICATION DE LA TABLE NOTIFICATIONS' as etape;

-- Vérifier si la table notifications existe
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name = 'notifications'
    ) THEN
        RAISE NOTICE '✅ Table notifications existe';
    ELSE
        RAISE NOTICE '❌ Table notifications n''existe pas - créer la table d''abord';
    END IF;
END $$;

-- Lister les colonnes actuelles
DO $$
DECLARE
    col_record RECORD;
BEGIN
    RAISE NOTICE '📋 Colonnes existantes dans notifications:';
    FOR col_record IN 
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'notifications'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  - % (%, nullable: %)', col_record.column_name, col_record.data_type, col_record.is_nullable;
    END LOOP;
END $$;

SELECT '➕ ÉTAPE 2: AJOUT DE LA COLONNE READ_AT' as etape;

-- Ajouter la colonne read_at si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' 
          AND column_name = 'read_at'
    ) THEN
        ALTER TABLE public.notifications ADD COLUMN read_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Colonne read_at ajoutée';
    ELSE
        RAISE NOTICE '✅ Colonne read_at existe déjà';
    END IF;
END $$;

SELECT '🔄 ÉTAPE 3: MIGRATION DES DONNÉES DEPUIS "READ"' as etape;

-- Si l'ancienne colonne 'read' existe, migrer les données
DO $$
DECLARE
    updated_count integer := 0;
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'notifications' 
          AND column_name = 'read'
    ) THEN
        -- Mettre à jour read_at pour les notifications marquées comme lues
        UPDATE notifications
        SET read_at = COALESCE(updated_at, created_at, NOW())
        WHERE read = true AND read_at IS NULL;
        
        GET DIAGNOSTICS updated_count = ROW_COUNT;
        RAISE NOTICE '✅ % notifications migrées (read=true -> read_at)', updated_count;
        
        -- Supprimer l'ancienne colonne 'read'
        ALTER TABLE notifications DROP COLUMN IF EXISTS read;
        RAISE NOTICE '✅ Ancienne colonne "read" supprimée';
    ELSE
        RAISE NOTICE '✅ Pas de colonne "read" à migrer';
    END IF;
END $$;

SELECT '🔄 ÉTAPE 4: RAFRAÎCHIR LE CACHE SUPABASE' as etape;

NOTIFY pgrst, 'reload schema';

DO $$
BEGIN
    RAISE NOTICE '✅ Cache PostgREST rafraîchi';
END $$;

SELECT '✅ ÉTAPE 5: VÉRIFICATION FINALE' as etape;

-- Afficher les statistiques
SELECT 
    '✅ STATISTIQUES NOTIFICATIONS' as status,
    COUNT(*) as total,
    COUNT(read_at) as lues,
    COUNT(*) - COUNT(read_at) as non_lues
FROM notifications;

-- Afficher un échantillon
SELECT 
    '✅ ÉCHANTILLON DES DONNÉES' as status,
    id,
    user_id,
    type,
    read_at,
    created_at
FROM notifications
ORDER BY created_at DESC
LIMIT 5;

SELECT '🎉 COLONNE READ_AT CONFIGURÉE AVEC SUCCÈS!' as resultat;
