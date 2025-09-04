-- ====================================
-- SCRIPT URGENT DE CORRECTION COMPLETE
-- VERSION SIMPLIFIEE ET CORRIGEE
-- ====================================

-- 1. CREATION DU BUCKET AVATARS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- 2. POLITIQUE RLS POUR LE BUCKET AVATARS (sans erreur si existe déjà)
DO $$ 
BEGIN
    -- Politique de lecture
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Avatar images are publicly accessible.'
    ) THEN
        CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
        FOR SELECT USING (bucket_id = 'avatars');
    END IF;

    -- Politique d'insertion
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Anyone can upload an avatar.'
    ) THEN
        CREATE POLICY "Anyone can upload an avatar." ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'avatars');
    END IF;

    -- Politique de mise à jour
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Anyone can update their own avatar.'
    ) THEN
        CREATE POLICY "Anyone can update their own avatar." ON storage.objects
        FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
END $$;

-- 3. AJOUT DES COLONNES MANQUANTES DANS LA TABLE USERS
DO $$
BEGIN
    -- phone
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(20);
        RAISE NOTICE 'Colonne phone ajoutee';
    END IF;

    -- full_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='full_name') THEN
        ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
        RAISE NOTICE 'Colonne full_name ajoutee';
    END IF;

    -- role
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'Particulier';
        RAISE NOTICE 'Colonne role ajoutee';
    END IF;

    -- status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='status') THEN
        ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
        RAISE NOTICE 'Colonne status ajoutee';
    END IF;

    -- verification_status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='verification_status') THEN
        ALTER TABLE users ADD COLUMN verification_status VARCHAR(20) DEFAULT 'pending';
        RAISE NOTICE 'Colonne verification_status ajoutee';
    END IF;

    -- country
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='country') THEN
        ALTER TABLE users ADD COLUMN country VARCHAR(100) DEFAULT 'Senegal';
        RAISE NOTICE 'Colonne country ajoutee';
    END IF;

    -- region
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='region') THEN
        ALTER TABLE users ADD COLUMN region VARCHAR(100);
        RAISE NOTICE 'Colonne region ajoutee';
    END IF;

    -- department
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='department') THEN
        ALTER TABLE users ADD COLUMN department VARCHAR(100);
        RAISE NOTICE 'Colonne department ajoutee';
    END IF;

    -- commune
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='commune') THEN
        ALTER TABLE users ADD COLUMN commune VARCHAR(100);
        RAISE NOTICE 'Colonne commune ajoutee';
    END IF;

    -- address
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='address') THEN
        ALTER TABLE users ADD COLUMN address TEXT;
        RAISE NOTICE 'Colonne address ajoutee';
    END IF;

    -- last_active_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_active_at') THEN
        ALTER TABLE users ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Colonne last_active_at ajoutee';
    END IF;

    -- avatar_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='avatar_url') THEN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Colonne avatar_url ajoutee';
    END IF;
END $$;

-- 4. MISE A JOUR DES DONNEES EXISTANTES
UPDATE users SET
    full_name = COALESCE(full_name, email),
    role = COALESCE(role, 'Particulier'),
    status = COALESCE(status, 'active'),
    verification_status = COALESCE(verification_status, 'pending'),
    country = COALESCE(country, 'Senegal'),
    last_active_at = COALESCE(last_active_at, NOW())
WHERE full_name IS NULL OR role IS NULL OR status IS NULL OR verification_status IS NULL OR country IS NULL OR last_active_at IS NULL;

-- 5. CREATION DES INDEX
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
CREATE INDEX IF NOT EXISTS idx_users_region ON users(region);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active_at);

-- 6. CREATION DE LA TABLE ANALYTICS POUR LE TRACKING
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    page VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les analytics
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_country ON analytics_events(country);

-- 7. ACTIVATION RLS SUR ANALYTICS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Politique pour les analytics (sécurisée)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'analytics_events' 
        AND policyname = 'Admins can view all analytics'
    ) THEN
        CREATE POLICY "Admins can view all analytics" ON analytics_events
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM users 
                WHERE users.id = auth.uid() 
                AND users.role = 'Admin'
            )
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'analytics_events' 
        AND policyname = 'Anyone can insert analytics'
    ) THEN
        CREATE POLICY "Anyone can insert analytics" ON analytics_events
        FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- 8. VERIFICATION FINALE
SELECT 'VERIFICATION COLONNES USERS:' as message;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name IN ('phone', 'full_name', 'role', 'status', 'verification_status', 'avatar_url')
ORDER BY column_name;

SELECT 'VERIFICATION BUCKETS:' as message;
SELECT name, public FROM storage.buckets WHERE name = 'avatars';

SELECT 'VERIFICATION ANALYTICS:' as message;
SELECT COUNT(*) as table_exists FROM information_schema.tables WHERE table_name = 'analytics_events';

-- Script terminé avec succès
SELECT '✅ SCRIPT EXECUTE AVEC SUCCES - TOUTES LES CORRECTIONS APPLIQUEES' as resultat;
