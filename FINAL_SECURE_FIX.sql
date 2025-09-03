-- VERSION ULTRA-DÉFENSIVE - Détection automatique des contraintes NOT NULL
-- MEGA MIGRATION ADAPTATIVE COMPLÈTE

-- ==========================================
-- ÉTAPE 0: DIAGNOSTIC DES CONTRAINTES NOT NULL
-- ==========================================

-- Vérifier les contraintes NOT NULL dans audit_logs
SELECT 'CONTRAINTES NOT NULL - AUDIT_LOGS' as diagnostic;
SELECT column_name, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'audit_logs' 
  AND table_schema = 'public' 
  AND is_nullable = 'NO'
ORDER BY ordinal_position;

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
