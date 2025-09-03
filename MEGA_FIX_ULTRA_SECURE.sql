-- VERSION ULTRA-SÉCURISÉE - Gestion des types JSON/TEXT
-- MEGA MIGRATION ADAPTATIVE: S'adapte aux types de colonnes existants

-- ==========================================
-- ÉTAPE 1: AJOUT PROGRESSIF DES COLONNES MANQUANTES (VERSION SÉCURISÉE)
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

-- Ajouter colonnes manquantes dans audit_logs (version adaptative)
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS actor_id UUID REFERENCES users(id);
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS entity TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS entity_id TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS target_table TEXT;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS target_id UUID;

-- ==========================================
-- ÉTAPE 2: AJOUT DE DONNÉES D'EXEMPLE MINIMALISTE
-- ==========================================

-- Données pour requests (colonnes de base seulement)
INSERT INTO requests (id, status, request_type, created_at) 
VALUES 
    (gen_random_uuid(), 'pending', 'parcel_listing', NOW()),
    (gen_random_uuid(), 'pending', 'account_upgrade', NOW())
ON CONFLICT DO NOTHING;

-- Données pour parcels (colonnes de base seulement)
INSERT INTO parcels (id, name, status, created_at) 
VALUES 
    (gen_random_uuid(), 'Terrain de Dakar Centre', 'Disponible', NOW()),
    (gen_random_uuid(), 'Terrain de Thiès', 'Vendu', NOW())
ON CONFLICT DO NOTHING;

-- Données pour blog (colonnes de base seulement)
INSERT INTO blog (id, title, content, status, created_at) 
VALUES 
    (gen_random_uuid(), 'Guide du Foncier au Sénégal', 'Contenu sur la réglementation foncière', 'published', NOW()),
    (gen_random_uuid(), 'Réforme Foncière 2025', 'Nouvelles réglementations et procédures', 'published', NOW())
ON CONFLICT DO NOTHING;

-- Données pour audit_logs (colonnes de base seulement, avec target_table et target_id obligatoires)
INSERT INTO audit_logs (id, action, entity, target_table, target_id, created_at) 
VALUES 
    (gen_random_uuid(), 'CREATE', 'User', 'users', (SELECT id FROM users LIMIT 1), NOW() - INTERVAL '1 day'),
    (gen_random_uuid(), 'UPDATE', 'Parcel', 'parcels', gen_random_uuid(), NOW() - INTERVAL '2 hours'),
    (gen_random_uuid(), 'DELETE', 'Request', 'requests', gen_random_uuid(), NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

-- ==========================================
-- ÉTAPE 3: MISE À JOUR PROGRESSIVE DES RELATIONS
-- ==========================================

-- Mettre à jour requests avec user_id si la colonne existe
UPDATE requests 
SET user_id = (SELECT id FROM users LIMIT 1)
WHERE user_id IS NULL AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'requests' AND column_name = 'user_id'
);

-- Mettre à jour parcels avec les relations
UPDATE parcels 
SET 
    seller_id = (SELECT id FROM users LIMIT 1),
    owner_id = (SELECT id FROM users LIMIT 1)
WHERE seller_id IS NULL;

-- Mettre à jour blog avec author_id
UPDATE blog 
SET 
    author_id = (SELECT id FROM users WHERE role = 'Admin' LIMIT 1),
    published_at = COALESCE(published_at, created_at)
WHERE author_id IS NULL;

-- Mettre à jour audit_logs (sans toucher à details pour éviter les erreurs JSON)
UPDATE audit_logs 
SET 
    actor_id = (SELECT id FROM users WHERE role = 'Admin' LIMIT 1),
    entity_id = gen_random_uuid()::text,
    target_table = CASE 
        WHEN entity = 'User' THEN 'users'
        WHEN entity = 'Parcel' THEN 'parcels'
        WHEN entity = 'Request' THEN 'requests'
        ELSE 'system'
    END,
    target_id = CASE 
        WHEN entity = 'User' THEN (SELECT id FROM users LIMIT 1)
        ELSE gen_random_uuid()
    END
WHERE actor_id IS NULL;

-- ==========================================
-- ÉTAPE 4: VÉRIFICATIONS ET COMPTAGE FINAL
-- ==========================================

-- Vérifier les structures finales
SELECT 'VÉRIFICATION FINALE - REQUESTS' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'requests' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'VÉRIFICATION FINALE - PARCELS' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'parcels' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'VÉRIFICATION FINALE - BLOG' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'blog' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'VÉRIFICATION FINALE - AUDIT_LOGS' as info;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'audit_logs' AND table_schema = 'public'
ORDER BY ordinal_position;

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

-- Afficher un échantillon des données créées
SELECT 'ÉCHANTILLON AUDIT_LOGS' as info;
SELECT id, action, entity, target_table, target_id, actor_id, created_at FROM audit_logs LIMIT 3;

SELECT 'ÉCHANTILLON REQUESTS' as info;
SELECT id, status, request_type, created_at FROM requests LIMIT 3;

SELECT 'ÉCHANTILLON BLOG' as info;
SELECT id, title, status, created_at FROM blog LIMIT 3;
