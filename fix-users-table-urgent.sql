-- Script de correction urgente de la base de données
-- Ajout des colonnes manquantes dans la table users

-- Ajouter la colonne phone si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(20);
        RAISE NOTICE 'Colonne phone ajoutée';
    ELSE
        RAISE NOTICE 'Colonne phone existe déjà';
    END IF;
END $$;

-- Ajouter la colonne full_name si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='full_name') THEN
        ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
        RAISE NOTICE 'Colonne full_name ajoutée';
    ELSE
        RAISE NOTICE 'Colonne full_name existe déjà';
    END IF;
END $$;

-- Ajouter la colonne role si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'Particulier';
        RAISE NOTICE 'Colonne role ajoutée';
    ELSE
        RAISE NOTICE 'Colonne role existe déjà';
    END IF;
END $$;

-- Ajouter la colonne status si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='status') THEN
        ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
        RAISE NOTICE 'Colonne status ajoutée';
    ELSE
        RAISE NOTICE 'Colonne status existe déjà';
    END IF;
END $$;

-- Ajouter la colonne verification_status si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='verification_status') THEN
        ALTER TABLE users ADD COLUMN verification_status VARCHAR(20) DEFAULT 'pending';
        RAISE NOTICE 'Colonne verification_status ajoutée';
    ELSE
        RAISE NOTICE 'Colonne verification_status existe déjà';
    END IF;
END $$;

-- Ajouter la colonne country si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='country') THEN
        ALTER TABLE users ADD COLUMN country VARCHAR(100) DEFAULT 'Sénégal';
        RAISE NOTICE 'Colonne country ajoutée';
    ELSE
        RAISE NOTICE 'Colonne country existe déjà';
    END IF;
END $$;

-- Ajouter la colonne region si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='region') THEN
        ALTER TABLE users ADD COLUMN region VARCHAR(100);
        RAISE NOTICE 'Colonne region ajoutée';
    ELSE
        RAISE NOTICE 'Colonne region existe déjà';
    END IF;
END $$;

-- Ajouter la colonne department si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='department') THEN
        ALTER TABLE users ADD COLUMN department VARCHAR(100);
        RAISE NOTICE 'Colonne department ajoutée';
    ELSE
        RAISE NOTICE 'Colonne department existe déjà';
    END IF;
END $$;

-- Ajouter la colonne commune si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='commune') THEN
        ALTER TABLE users ADD COLUMN commune VARCHAR(100);
        RAISE NOTICE 'Colonne commune ajoutée';
    ELSE
        RAISE NOTICE 'Colonne commune existe déjà';
    END IF;
END $$;

-- Ajouter la colonne address si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='address') THEN
        ALTER TABLE users ADD COLUMN address TEXT;
        RAISE NOTICE 'Colonne address ajoutée';
    ELSE
        RAISE NOTICE 'Colonne address existe déjà';
    END IF;
END $$;

-- Ajouter la colonne last_active_at si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_active_at') THEN
        ALTER TABLE users ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Colonne last_active_at ajoutée';
    ELSE
        RAISE NOTICE 'Colonne last_active_at existe déjà';
    END IF;
END $$;

-- Mettre à jour les données existantes pour éviter les valeurs NULL
UPDATE users SET 
    full_name = COALESCE(full_name, email),
    role = COALESCE(role, 'Particulier'),
    status = COALESCE(status, 'active'),
    verification_status = COALESCE(verification_status, 'pending'),
    country = COALESCE(country, 'Sénégal'),
    last_active_at = COALESCE(last_active_at, NOW())
WHERE full_name IS NULL OR role IS NULL OR status IS NULL OR verification_status IS NULL OR country IS NULL OR last_active_at IS NULL;

-- Créer un index sur les colonnes importantes
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active_at);

-- Afficher la structure finale de la table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
