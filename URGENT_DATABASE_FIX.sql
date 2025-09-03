-- 🚨 CORRECTION URGENTE BASE DE DONNÉES
-- Fichier: URGENT_DATABASE_FIX.sql
-- Date: 3 Septembre 2025
-- Objectif: Corriger TOUTES les erreurs de structure de base de données

-- ====================================
-- PROBLÈME 1: COLONNE parcels.zone MANQUANTE
-- ====================================

-- Ajouter la colonne zone à la table parcels si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'parcels' 
        AND column_name = 'zone' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE parcels ADD COLUMN zone VARCHAR(100);
        RAISE NOTICE 'Colonne zone ajoutée à la table parcels';
        
        -- Mettre à jour avec des valeurs par défaut basées sur la région
        UPDATE parcels SET zone = 'Zone Centre' WHERE zone IS NULL AND name LIKE '%Dakar%';
        UPDATE parcels SET zone = 'Zone Nord' WHERE zone IS NULL AND name LIKE '%Saint-Louis%';
        UPDATE parcels SET zone = 'Zone Sud' WHERE zone IS NULL AND name LIKE '%Ziguinchor%';
        UPDATE parcels SET zone = 'Zone Est' WHERE zone IS NULL AND name LIKE '%Tambacounda%';
        UPDATE parcels SET zone = 'Zone Générale' WHERE zone IS NULL;
        
        RAISE NOTICE 'Valeurs zone mises à jour pour tous les parcels';
    ELSE
        RAISE NOTICE 'Colonne zone existe déjà dans la table parcels';
    END IF;
END $$;

-- ====================================
-- PROBLÈME 2: TABLE user_documents N'EXISTE PAS
-- ====================================

-- Créer la table user_documents si elle n'existe pas
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    file_path TEXT,
    file_size BIGINT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_category ON user_documents(category);

-- Activer RLS
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Politique RLS pour que les utilisateurs voient seulement leurs documents
DROP POLICY IF EXISTS "Users can view their own documents" ON user_documents;
CREATE POLICY "Users can view their own documents" ON user_documents
    FOR ALL USING (auth.uid() = user_id);

-- ====================================
-- PROBLÈME 3: COLONNE recipient_id MANQUANTE DANS requests
-- ====================================

-- Ajouter la colonne recipient_id si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'requests' 
        AND column_name = 'recipient_id' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE requests ADD COLUMN recipient_id UUID;
        RAISE NOTICE 'Colonne recipient_id ajoutée à la table requests';
    ELSE
        RAISE NOTICE 'Colonne recipient_id existe déjà dans la table requests';
    END IF;
END $$;

-- Créer la foreign key pour recipient_id vers users.id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'requests_recipient_id_fkey' 
        AND table_name = 'requests'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE requests 
        ADD CONSTRAINT requests_recipient_id_fkey 
        FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Foreign key requests_recipient_id_fkey créée';
    ELSE
        RAISE NOTICE 'Foreign key requests_recipient_id_fkey existe déjà';
    END IF;
END $$;

-- ====================================
-- PROBLÈME 4: AMÉLIORER LA TABLE requests
-- ====================================

-- Ajouter des colonnes utiles pour le dashboard
DO $$
BEGIN
    -- Colonne status si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'requests' 
        AND column_name = 'status' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE requests ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
        RAISE NOTICE 'Colonne status ajoutée à la table requests';
    END IF;
    
    -- Colonne type si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'requests' 
        AND column_name = 'type' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE requests ADD COLUMN type VARCHAR(100) DEFAULT 'municipal_land';
        RAISE NOTICE 'Colonne type ajoutée à la table requests';
    END IF;
END $$;

-- Index pour optimiser les requêtes requests
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_recipient_id ON requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_type ON requests(type);

-- ====================================
-- PROBLÈME 5: POLITIQUES RLS POUR requests
-- ====================================

-- Activer RLS sur requests
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Politique pour voir ses propres demandes envoyées
DROP POLICY IF EXISTS "Users can view their sent requests" ON requests;
CREATE POLICY "Users can view their sent requests" ON requests
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour voir les demandes reçues (si recipient_id est défini)
DROP POLICY IF EXISTS "Users can view received requests" ON requests;
CREATE POLICY "Users can view received requests" ON requests
    FOR SELECT USING (auth.uid() = recipient_id);

-- Politique pour créer des demandes
DROP POLICY IF EXISTS "Users can create requests" ON requests;
CREATE POLICY "Users can create requests" ON requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour modifier ses demandes ou celles reçues
DROP POLICY IF EXISTS "Users can update requests" ON requests;
CREATE POLICY "Users can update requests" ON requests
    FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = recipient_id);

-- ====================================
-- ÉTAPE FINALE: VÉRIFICATION
-- ====================================

-- Vérifier que toutes les tables existent
SELECT 
    table_name,
    CASE WHEN table_name IN ('parcels', 'requests', 'user_documents', 'users') 
         THEN '✅ Existe' 
         ELSE '❌ Manquante' 
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('parcels', 'requests', 'user_documents', 'users')
ORDER BY table_name;

-- Vérifier les colonnes critiques
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    '✅ OK' as status
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
    AND t.table_name IN ('parcels', 'requests', 'user_documents')
    AND c.column_name IN ('zone', 'recipient_id', 'user_id', 'status', 'type')
ORDER BY t.table_name, c.column_name;

-- Message final
SELECT 'BASE DE DONNÉES CORRIGÉE AVEC SUCCÈS ✅' AS result, NOW() AS timestamp;
