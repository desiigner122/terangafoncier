-- MEGA MIGRATION SÉCURISÉE: Correction basée sur la structure réelle
-- EXÉCUTER D'ABORD DIAGNOSTIC_STRUCTURE.sql pour voir les colonnes existantes

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
-- Attention: details peut être JSON ou TEXT selon la configuration
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}';

-- ==========================================
-- ÉTAPE 2: AJOUT DE DONNÉES D'EXEMPLE SÉCURISÉ
-- ==========================================

-- Données pour requests (seulement les colonnes de base)
INSERT INTO requests (id, status, request_type, created_at) 
VALUES 
    (gen_random_uuid(), 'pending', 'parcel_listing', NOW()),
    (gen_random_uuid(), 'pending', 'account_upgrade', NOW())
ON CONFLICT DO NOTHING;

-- Données pour parcels (seulement les colonnes de base)
INSERT INTO parcels (id, name, status, created_at) 
VALUES 
    (gen_random_uuid(), 'Terrain de Dakar Centre', 'Disponible', NOW()),
    (gen_random_uuid(), 'Terrain de Thiès', 'Vendu', NOW())
ON CONFLICT DO NOTHING;

-- Données pour blog (seulement les colonnes de base)
INSERT INTO blog (id, title, content, status, created_at) 
VALUES 
    (gen_random_uuid(), 'Guide du Foncier au Sénégal', 'Contenu de l''article sur la réglementation foncière...', 'published', NOW()),
    (gen_random_uuid(), 'Réforme Foncière 2025', 'Nouvelles réglementations et procédures...', 'published', NOW())
ON CONFLICT DO NOTHING;

-- Données pour audit_logs (seulement les colonnes de base avec JSON correct)
INSERT INTO audit_logs (id, action, details, created_at) 
VALUES 
    (gen_random_uuid(), 'CREATE', '{"message": "Création d''un nouveau compte utilisateur", "type": "user_creation"}', NOW() - INTERVAL '1 day'),
    (gen_random_uuid(), 'UPDATE', '{"message": "Mise à jour d''une annonce de terrain", "type": "parcel_update"}', NOW() - INTERVAL '2 hours'),
    (gen_random_uuid(), 'DELETE', '{"message": "Suppression d''une demande obsolète", "type": "request_deletion"}', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

-- ==========================================
-- ÉTAPE 3: MISE À JOUR AVEC LES RELATIONS (APRÈS VÉRIFICATION)
-- ==========================================

-- Mettre à jour requests avec user_id si la colonne existe
UPDATE requests 
SET user_id = (SELECT id FROM users LIMIT 1)
WHERE user_id IS NULL AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'requests' AND column_name = 'user_id'
);

-- Mettre à jour parcels avec seller_id et owner_id
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

-- Mettre à jour audit_logs avec actor_id et données JSON correctes
UPDATE audit_logs 
SET 
    actor_id = (SELECT id FROM users WHERE role = 'Admin' LIMIT 1),
    entity = CASE 
        WHEN action = 'CREATE' THEN 'User'
        WHEN action = 'UPDATE' THEN 'Parcel'
        WHEN action = 'DELETE' THEN 'Request'
        ELSE 'System'
    END,
    entity_id = gen_random_uuid()::text,
    details = CASE 
        WHEN details IS NULL OR details = '' THEN '{"message": "Action système", "type": "system"}'
        WHEN details::text NOT LIKE '{%' THEN FORMAT('{"message": "%s", "type": "legacy"}', REPLACE(details::text, '"', '\"'))
        ELSE details
    END
WHERE actor_id IS NULL;

-- ==========================================
-- ÉTAPE 4: VÉRIFICATIONS FINALES
-- ==========================================

-- Vérifier les structures finales
SELECT 'VÉRIFICATION FINALE - REQUESTS' as info;
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'requests' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'VÉRIFICATION FINALE - PARCELS' as info;
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'parcels' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'VÉRIFICATION FINALE - BLOG' as info;
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'blog' AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT 'VÉRIFICATION FINALE - AUDIT_LOGS' as info;
SELECT column_name FROM information_schema.columns 
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
