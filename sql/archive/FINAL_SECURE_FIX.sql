-- ====================================
-- SCRIPT URGENT DE CORRECTION COMPLETE
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

-- 2. POLITIQUE RLS POUR LE BUCKET AVATARS
CREATE POLICY "Avatar images are publicly accessible." ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar." ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can update their own avatar." ON storage.objects
FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

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

-- 7. ACTIVATION RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Politique pour les analytics (admin seulement)
CREATE POLICY "Admins can view all analytics" ON analytics_events
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.role = 'Admin'
    )
);

CREATE POLICY "Anyone can insert analytics" ON analytics_events
FOR INSERT WITH CHECK (true);

-- 8. AFFICHAGE DE LA STRUCTURE FINALE
SELECT 'STRUCTURE DE LA TABLE USERS:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

SELECT 'BUCKETS STORAGE DISPONIBLES:' as info;
SELECT * FROM storage.buckets;

-- ==========================================
-- ÉTAPE 1: AJOUT PROGRESSIF DES COLONNES MANQUANTES
-- ==========================================

-- Ajouter colonnes manquantes dans requests
ALTER TABLE requests ADD COLUMN IF NOT EXISTS request_type TEXT DEFAULT 'general';

-- Ajouter colonnes manquantes dans parcels
ALTER TABLE parcels ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE parcels ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES users(id);
ALTER TABLE parcels ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(id);
ALTER TABLE parcels ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Disponible';

-- Ajouter colonnes manquantes dans blog
ALTER TABLE blog ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE blog ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES users(id);
ALTER TABLE blog ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';

-- Ajouter colonnes manquantes dans audit_logs
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_id UUID REFERENCES users(id);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS entity TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS entity_id TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS target_table TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS target_id UUID;

-- ==========================================
-- ÉTAPE 2: INSERTION ULTRA-SÉCURISÉE 
-- ==========================================

-- Insérer dans audit_logs avec TOUTES les colonnes obligatoires possibles
INSERT INTO audit_logs (id, action, entity, target_table, target_id, created_at) 
SELECT gen_random_uuid(), 'CREATE', 'User', 'users', (SELECT id FROM users LIMIT 1), NOW() - INTERVAL '1 day'
WHERE NOT EXISTS (SELECT 1 FROM audit_logs WHERE action = 'CREATE' AND entity = 'User')
UNION ALL
SELECT gen_random_uuid(), 'UPDATE', 'Parcel', 'parcels', gen_random_uuid(), NOW() - INTERVAL '2 hours'
WHERE NOT EXISTS (SELECT 1 FROM audit_logs WHERE action = 'UPDATE' AND entity = 'Parcel')
UNION ALL
SELECT gen_random_uuid(), 'DELETE', 'Request', 'requests', gen_random_uuid(), NOW() - INTERVAL '30 minutes'
WHERE NOT EXISTS (SELECT 1 FROM audit_logs WHERE action = 'DELETE' AND entity = 'Request');

-- Insérer dans les autres tables
INSERT INTO requests (id, status, request_type, created_at) 
VALUES 
    (gen_random_uuid(), 'pending', 'parcel_listing', NOW()),
    (gen_random_uuid(), 'pending', 'account_upgrade', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO parcels (id, name, status, created_at) 
VALUES 
    (gen_random_uuid(), 'Terrain de Dakar Centre', 'Disponible', NOW()),
    (gen_random_uuid(), 'Terrain de Thiès', 'Vendu', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO blog (id, title, content, status, created_at) 
VALUES 
    (gen_random_uuid(), 'Guide du Foncier au Sénégal', 'Contenu sur la réglementation foncière', 'published', NOW()),
    (gen_random_uuid(), 'Réforme Foncière 2025', 'Nouvelles réglementations et procédures', 'published', NOW())
ON CONFLICT DO NOTHING;

-- ==========================================
-- ÉTAPE 3: MISE À JOUR SÉCURISÉE DES RELATIONS
-- ==========================================

-- Mettre à jour audit_logs avec toutes les colonnes nécessaires
UPDATE audit_logs 
SET 
    actor_id = COALESCE(actor_id, (SELECT id FROM users WHERE role = 'Admin' LIMIT 1)),
    entity_id = COALESCE(entity_id, gen_random_uuid()::text)
WHERE actor_id IS NULL OR entity_id IS NULL;

-- Mettre à jour les autres tables
UPDATE requests SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL;
UPDATE parcels SET seller_id = (SELECT id FROM users LIMIT 1), owner_id = (SELECT id FROM users LIMIT 1) WHERE seller_id IS NULL;
UPDATE blog SET author_id = (SELECT id FROM users WHERE role = 'Admin' LIMIT 1) WHERE author_id IS NULL;

-- ==========================================
-- ÉTAPE 4: VÉRIFICATIONS FINALES
-- ==========================================

-- Compter les données finales
SELECT 'COMPTAGE FINAL' as info;
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'requests' as table_name, COUNT(*) as count FROM requests
UNION ALL
SELECT 'parcels' as table_name, COUNT(*) as count FROM parcels
UNION ALL
SELECT 'blog' as table_name, COUNT(*) as count FROM blog
UNION ALL
SELECT 'audit_logs' as table_name, COUNT(*) as count FROM audit_logs;

-- Vérifier les colonnes NOT NULL dans audit_logs
SELECT 'VÉRIFICATION AUDIT_LOGS' as verification;
SELECT COUNT(*) as total, COUNT(target_table) as with_target_table FROM audit_logs;
