-- =====================================
-- MEGA FIX FINAL: Correction Database Schema
-- =====================================

-- ÉTAPE 1: Diagnostic de la structure actuelle
SELECT 'DIAGNOSTIC: Vérification de la structure de la table users' AS status;

-- ÉTAPE 2: Ajouter TOUTES les colonnes manquantes pour le système de bannissement
DO $$
BEGIN
    -- Ajouter is_banned si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_banned') THEN
        ALTER TABLE users ADD COLUMN is_banned BOOLEAN DEFAULT false;
        RAISE NOTICE 'Colonne is_banned ajoutée';
    ELSE
        RAISE NOTICE 'Colonne is_banned existe déjà';
    END IF;
    
    -- Ajouter ban_reason si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'ban_reason') THEN
        ALTER TABLE users ADD COLUMN ban_reason TEXT;
        RAISE NOTICE 'Colonne ban_reason ajoutée';
    ELSE
        RAISE NOTICE 'Colonne ban_reason existe déjà';
    END IF;
    
    -- Ajouter banned_at si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'banned_at') THEN
        ALTER TABLE users ADD COLUMN banned_at TIMESTAMPTZ;
        RAISE NOTICE 'Colonne banned_at ajoutée';
    ELSE
        RAISE NOTICE 'Colonne banned_at existe déjà';
    END IF;
END $$;

-- ÉTAPE 3: Créer un index pour les utilisateurs bannis (performance)
CREATE INDEX IF NOT EXISTS idx_users_banned ON users(is_banned) WHERE is_banned = true;

-- ÉTAPE 4: Mise à jour des utilisateurs existants bannis (si applicable)
UPDATE users 
SET 
    banned_at = COALESCE(banned_at, updated_at),
    ban_reason = COALESCE(ban_reason, 'Banni administrativement')
WHERE is_banned = true 
AND (banned_at IS NULL OR ban_reason IS NULL);

-- ÉTAPE 5: Vérification finale et notification de succès
DO $$
BEGIN
    RAISE NOTICE '=== VÉRIFICATION FINALE ===';
    
    -- Compter les colonnes ajoutées
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_banned') THEN
        RAISE NOTICE '✓ is_banned: PRÉSENTE';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'ban_reason') THEN
        RAISE NOTICE '✓ ban_reason: PRÉSENTE';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'banned_at') THEN
        RAISE NOTICE '✓ banned_at: PRÉSENTE';
    END IF;
    
    RAISE NOTICE '=== SYSTÈME DE BANNISSEMENT: PRÊT ===';
END $$;

SELECT 'MEGA FIX APPLIQUÉ: Base de données prête pour le système de bannissement' AS status;
