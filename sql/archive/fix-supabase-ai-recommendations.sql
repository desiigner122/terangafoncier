-- ================================================
-- SCRIPT COMPLEMENTAIRE SUPABASE AI RECOMMENDATIONS
-- Basé sur l'analyse de l'IA Supabase
-- ================================================

-- 1. CREATION EXPLICITE DU BUCKET AVATARS (selon recommandation IA)
-- Vérifier d'abord si le bucket existe
DO $$
DECLARE
    bucket_exists boolean;
BEGIN
    SELECT EXISTS(SELECT 1 FROM storage.buckets WHERE name = 'avatars') INTO bucket_exists;
    
    IF NOT bucket_exists THEN
        -- Créer le bucket comme recommandé par l'IA Supabase
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'avatars',
            'avatars',
            false, -- Privé comme recommandé par l'IA (RLS pour protéger l'accès)
            5242880, -- 5MB
            ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        );
        RAISE NOTICE 'Bucket avatars créé (privé avec RLS)';
    ELSE
        RAISE NOTICE 'Bucket avatars existe déjà';
    END IF;
END $$;

-- 2. AJOUT EXPLICITE COLONNE PHONE (selon recommandation IA)
-- Add a nullable phone column to the users table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'phone'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN phone text;
        RAISE NOTICE 'Colonne phone ajoutée à public.users';
    ELSE
        RAISE NOTICE 'Colonne phone existe déjà';
    END IF;
END $$;

-- 3. VERIFICATION ET AJOUT DES AUTRES COLONNES ESSENTIELLES
DO $$
BEGIN
    -- full_name
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'full_name' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN full_name text;
        RAISE NOTICE 'Colonne full_name ajoutée';
    END IF;

    -- role
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN role text DEFAULT 'Particulier';
        RAISE NOTICE 'Colonne role ajoutée';
    END IF;

    -- status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'status' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN status text DEFAULT 'active';
        RAISE NOTICE 'Colonne status ajoutée';
    END IF;

    -- verification_status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'verification_status' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN verification_status text DEFAULT 'pending';
        RAISE NOTICE 'Colonne verification_status ajoutée';
    END IF;

    -- avatar_url
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'avatar_url' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN avatar_url text;
        RAISE NOTICE 'Colonne avatar_url ajoutée';
    END IF;

    -- country
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'country' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN country text DEFAULT 'Senegal';
        RAISE NOTICE 'Colonne country ajoutée';
    END IF;

    -- region
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'region' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN region text;
        RAISE NOTICE 'Colonne region ajoutée';
    END IF;

    -- last_active_at
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'last_active_at' AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users ADD COLUMN last_active_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Colonne last_active_at ajoutée';
    END IF;
END $$;

-- 4. ACTIVATION RLS SUR LA TABLE USERS (comme recommandé par l'IA)
-- Enable RLS if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 5. POLITIQUES RLS POUR PHONE (selon recommandation IA Supabase)
-- SELECT policy - users can view own phone
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'users can view own phone'
        AND schemaname = 'public'
    ) THEN
        CREATE POLICY "users can view own phone"
        ON public.users
        FOR SELECT TO authenticated
        USING ((SELECT auth.uid()) = id);
        RAISE NOTICE 'Politique RLS phone SELECT créée';
    END IF;
END $$;

-- INSERT policy - users can set own phone
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'users can set own phone'
        AND schemaname = 'public'
    ) THEN
        CREATE POLICY "users can set own phone"
        ON public.users
        FOR INSERT TO authenticated
        WITH CHECK ((SELECT auth.uid()) = id);
        RAISE NOTICE 'Politique RLS phone INSERT créée';
    END IF;
END $$;

-- UPDATE policy - users can update own phone
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'users can update own phone'
        AND schemaname = 'public'
    ) THEN
        CREATE POLICY "users can update own phone"
        ON public.users
        FOR UPDATE TO authenticated
        USING ((SELECT auth.uid()) = id)
        WITH CHECK ((SELECT auth.uid()) = id);
        RAISE NOTICE 'Politique RLS phone UPDATE créée';
    END IF;
END $$;

-- 6. POLITIQUES RLS POUR LE BUCKET AVATARS (sécurisé comme recommandé)
DO $$
BEGIN
    -- Policy pour voir ses propres avatars
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can view own avatars'
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Users can view own avatars" ON storage.objects
        FOR SELECT USING (
            bucket_id = 'avatars' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );
        RAISE NOTICE 'Politique RLS avatars SELECT créée';
    END IF;

    -- Policy pour uploader ses propres avatars
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can upload own avatars'
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Users can upload own avatars" ON storage.objects
        FOR INSERT WITH CHECK (
            bucket_id = 'avatars' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );
        RAISE NOTICE 'Politique RLS avatars INSERT créée';
    END IF;

    -- Policy pour mettre à jour ses propres avatars
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Users can update own avatars'
        AND schemaname = 'storage'
    ) THEN
        CREATE POLICY "Users can update own avatars" ON storage.objects
        FOR UPDATE USING (
            bucket_id = 'avatars' 
            AND auth.uid()::text = (storage.foldername(name))[1]
        );
        RAISE NOTICE 'Politique RLS avatars UPDATE créée';
    END IF;
END $$;

-- 7. CREATION TABLE ANALYTICS SI MANQUANTE
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type text NOT NULL,
    event_data jsonb,
    page text,
    ip_address inet,
    user_agent text,
    country text,
    region text,
    city text,
    created_at timestamp with time zone DEFAULT now()
);

-- RLS pour analytics
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 8. VERIFICATION FINALE COMPLETE
SELECT 'VERIFICATION COMPLETE' as status;

-- Vérifier buckets
SELECT 'BUCKETS:' as type, name, public, file_size_limit 
FROM storage.buckets 
WHERE name = 'avatars';

-- Vérifier colonnes users
SELECT 'COLONNES USERS:' as type, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
AND column_name IN ('phone', 'full_name', 'role', 'status', 'verification_status', 'avatar_url')
ORDER BY column_name;

-- Vérifier politiques RLS
SELECT 'POLITIQUES RLS:' as type, schemaname, tablename, policyname, permissive
FROM pg_policies 
WHERE tablename IN ('users', 'objects') 
AND (policyname LIKE '%phone%' OR policyname LIKE '%avatar%')
ORDER BY tablename, policyname;

-- Confirmation finale
SELECT '✅ CORRECTIONS APPLIQUEES SELON RECOMMANDATIONS IA SUPABASE' as resultat;
