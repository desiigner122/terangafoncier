-- Correction de la structure de la base de données
-- Ajout des colonnes manquantes et mise à jour du schéma

-- 1. Ajouter les colonnes manquantes à la table users
DO $$ 
BEGIN
    -- Ajouter la colonne phone si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'phone') THEN
        ALTER TABLE users ADD COLUMN phone VARCHAR(20);
    END IF;
    
    -- Ajouter la colonne status si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'status') THEN
        ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
    
    -- Ajouter la colonne verification_status si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'verification_status') THEN
        ALTER TABLE users ADD COLUMN verification_status VARCHAR(20) DEFAULT 'pending';
    END IF;
    
    -- Ajouter la colonne region si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'region') THEN
        ALTER TABLE users ADD COLUMN region VARCHAR(100);
    END IF;
    
    -- Ajouter la colonne departement si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'departement') THEN
        ALTER TABLE users ADD COLUMN departement VARCHAR(100);
    END IF;
    
    -- Ajouter la colonne commune si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'commune') THEN
        ALTER TABLE users ADD COLUMN commune VARCHAR(100);
    END IF;
    
    -- Ajouter la colonne address si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'address') THEN
        ALTER TABLE users ADD COLUMN address TEXT;
    END IF;
    
    -- Ajouter la colonne company_name si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'company_name') THEN
        ALTER TABLE users ADD COLUMN company_name VARCHAR(255);
    END IF;
    
    -- Ajouter la colonne professional_id si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'professional_id') THEN
        ALTER TABLE users ADD COLUMN professional_id VARCHAR(100);
    END IF;
    
    -- Ajouter les colonnes de timestamp pour le bannissement
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'banned_at') THEN
        ALTER TABLE users ADD COLUMN banned_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'ban_reason') THEN
        ALTER TABLE users ADD COLUMN ban_reason TEXT;
    END IF;
    
    -- Ajouter les colonnes de timestamp pour la vérification
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'verified_at') THEN
        ALTER TABLE users ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'rejected_at') THEN
        ALTER TABLE users ADD COLUMN rejected_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'rejection_reason') THEN
        ALTER TABLE users ADD COLUMN rejection_reason TEXT;
    END IF;
    
    -- Ajouter updated_at si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
END $$;

-- 2. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_region ON users(region);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 3. Créer une fonction trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer le trigger si il n'existe pas
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Mettre à jour les enregistrements existants avec des valeurs par défaut
UPDATE users 
SET 
    status = COALESCE(status, 'active'),
    verification_status = COALESCE(verification_status, 'pending'),
    updated_at = COALESCE(updated_at, created_at)
WHERE status IS NULL OR verification_status IS NULL OR updated_at IS NULL;

-- 5. Créer une table d'audit pour tracer les actions administratives
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id BIGSERIAL PRIMARY KEY,
    admin_user_id UUID REFERENCES auth.users(id),
    target_user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour la table d'audit
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_user ON admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target_user ON admin_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at);

-- 6. Créer une table pour les notifications système
CREATE TABLE IF NOT EXISTS system_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les notifications
CREATE INDEX IF NOT EXISTS idx_system_notifications_user_id ON system_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_system_notifications_is_read ON system_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_system_notifications_created_at ON system_notifications(created_at);

-- 7. Créer une vue pour les statistiques utilisateurs
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
    COUNT(CASE WHEN status = 'banned' THEN 1 END) as banned_users,
    COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified_users,
    COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_users,
    COUNT(CASE WHEN verification_status = 'rejected' THEN 1 END) as rejected_users,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_users,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as monthly_users
FROM users;

-- 8. Créer une fonction pour nettoyer les anciennes données d'audit
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM admin_audit_log 
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 9. Assurer les contraintes de données
ALTER TABLE users 
ADD CONSTRAINT chk_status CHECK (status IN ('active', 'banned', 'suspended'));

ALTER TABLE users 
ADD CONSTRAINT chk_verification_status CHECK (verification_status IN ('pending', 'verified', 'rejected'));

-- 10. Insérer des données de test si la table est vide
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM users LIMIT 1) THEN
        INSERT INTO users (
            id, full_name, email, phone, role, region, departement, commune, 
            address, status, verification_status, created_at, updated_at
        ) VALUES 
        (
            gen_random_uuid(),
            'Administrateur Système',
            'admin@teranga-foncier.sn',
            '+221 33 123 45 67',
            'Admin',
            'Dakar',
            'Dakar',
            'Dakar Plateau',
            'Rue de la République, Dakar',
            'active',
            'verified',
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Jean-Baptiste Diop',
            'jb.diop@example.sn',
            '+221 77 123 45 67',
            'Particulier',
            'Thiès',
            'Thiès',
            'Thiès Nord',
            'Quartier HLM, Thiès',
            'active',
            'pending',
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '2 days'
        ),
        (
            gen_random_uuid(),
            'Mairie de Saint-Louis',
            'contact@mairie-saintlouis.sn',
            '+221 33 961 23 45',
            'Mairie',
            'Saint-Louis',
            'Saint-Louis',
            'Saint-Louis',
            'Place Faidherbe, Saint-Louis',
            'active',
            'verified',
            NOW() - INTERVAL '5 days',
            NOW() - INTERVAL '1 day'
        );
    END IF;
END $$;

-- Message de confirmation
SELECT 'Structure de base de données mise à jour avec succès!' as status;
