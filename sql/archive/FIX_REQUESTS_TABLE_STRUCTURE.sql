-- 🔧 CORRECTION STRUCTURE TABLE REQUESTS - DASHBOARD PARTICULIER
-- Fichier: FIX_REQUESTS_TABLE_STRUCTURE.sql
-- Date: 3 Septembre 2025
-- Objectif: Corriger les erreurs de colonnes manquantes et foreign keys

-- ====================================
-- ÉTAPE 1: VÉRIFICATION DE LA STRUCTURE ACTUELLE
-- ====================================

-- Vérifier les colonnes existantes dans la table requests
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'requests' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier les foreign keys existantes
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'requests'
    AND tc.table_schema = 'public';

-- ====================================
-- ÉTAPE 2: AJOUT DE LA COLONNE RECIPIENT_ID
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

-- ====================================
-- ÉTAPE 3: CRÉATION DE LA FOREIGN KEY RECIPIENT_ID
-- ====================================

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
-- ÉTAPE 4: VÉRIFICATION DES AUTRES FOREIGN KEYS
-- ====================================

-- Vérifier/créer foreign key pour user_id si nécessaire
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'requests_user_id_fkey' 
        AND table_name = 'requests'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE requests 
        ADD CONSTRAINT requests_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        RAISE NOTICE 'Foreign key requests_user_id_fkey créée';
    ELSE
        RAISE NOTICE 'Foreign key requests_user_id_fkey existe déjà';
    END IF;
END $$;

-- ====================================
-- ÉTAPE 5: CRÉATION D'INDEX POUR PERFORMANCE
-- ====================================

-- Index sur recipient_id pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_requests_recipient_id 
ON requests(recipient_id);

-- Index sur user_id pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_requests_user_id 
ON requests(user_id);

-- Index sur status pour filtrer les demandes
CREATE INDEX IF NOT EXISTS idx_requests_status 
ON requests(status);

-- ====================================
-- ÉTAPE 6: MISE À JOUR DES POLITIQUES RLS (Row Level Security)
-- ====================================

-- Activer RLS sur la table requests si pas encore fait
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs voient leurs propres demandes envoyées
DROP POLICY IF EXISTS "Users can view their own sent requests" ON requests;
CREATE POLICY "Users can view their own sent requests" ON requests
    FOR SELECT USING (auth.uid() = user_id);

-- Politique pour que les utilisateurs voient leurs demandes reçues
DROP POLICY IF EXISTS "Users can view received requests" ON requests;
CREATE POLICY "Users can view received requests" ON requests
    FOR SELECT USING (auth.uid() = recipient_id);

-- Politique pour que les utilisateurs puissent créer des demandes
DROP POLICY IF EXISTS "Users can create requests" ON requests;
CREATE POLICY "Users can create requests" ON requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent modifier leurs demandes
DROP POLICY IF EXISTS "Users can update their requests" ON requests;
CREATE POLICY "Users can update their requests" ON requests
    FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = recipient_id);

-- ====================================
-- ÉTAPE 7: VÉRIFICATION FINALE
-- ====================================

-- Afficher la structure finale de la table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'requests' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Afficher les foreign keys créées
SELECT
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'requests'
    AND tc.table_schema = 'public';

-- Afficher les index créés
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'requests' 
    AND schemaname = 'public';

-- Message de succès
SELECT 'STRUCTURE TABLE REQUESTS CORRIGÉE AVEC SUCCÈS ✅' AS status;
