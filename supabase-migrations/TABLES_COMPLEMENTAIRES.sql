-- =============================================
-- TABLES COMPLÉMENTAIRES - ABONNEMENTS + NOTIFICATIONS
-- À exécuter APRÈS SCRIPT_COMPLET_UNIQUE.sql
-- =============================================

-- =============================================
-- NETTOYAGE : Supprimer les tables existantes pour repartir à zéro
-- =============================================

DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- =============================================
-- PARTIE 1 : TABLE SUBSCRIPTIONS (ABONNEMENTS)
-- =============================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Plan et statut
    plan VARCHAR(50) DEFAULT 'gratuit' CHECK (plan IN ('gratuit', 'basique', 'pro', 'premium')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'suspended')),
    
    -- Limitations
    max_properties INTEGER DEFAULT 3, -- Selon le plan : Gratuit=3, Basique=5, Pro=20, Premium=illimité
    current_properties INTEGER DEFAULT 0,
    
    -- Tarification
    price DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'XOF',
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, yearly
    
    -- Dates
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP,
    next_billing_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    
    -- Paiement
    payment_method VARCHAR(50), -- orange_money, wave, carte, virement
    payment_phone VARCHAR(20),
    last_payment_date TIMESTAMP,
    last_payment_amount DECIMAL(10,2),
    
    -- Options
    auto_renew BOOLEAN DEFAULT TRUE,
    is_trial BOOLEAN DEFAULT FALSE,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan);
CREATE INDEX IF NOT EXISTS idx_subscriptions_end_date ON subscriptions(end_date);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscriptions_updated_at ON subscriptions;
CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_subscriptions_updated_at();

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their subscription" ON subscriptions;
CREATE POLICY "Users can view their subscription"
ON subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their subscription" ON subscriptions;
CREATE POLICY "Users can update their subscription"
ON subscriptions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- PARTIE 2 : TABLE NOTIFICATIONS
-- =============================================

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contenu
    type VARCHAR(50) NOT NULL, -- property_approved, property_rejected, new_inquiry, new_message, payment_success, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Action
    action_url VARCHAR(500), -- URL vers laquelle rediriger au clic
    action_label VARCHAR(100), -- "Voir la propriété", "Répondre", etc.
    
    -- Statut
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Priorité
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    
    -- Données liées
    related_property_id UUID, -- REFERENCES properties(id) ON DELETE SET NULL (ajouté après si properties existe)
    related_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP -- Pour notifications temporaires
);

-- Index
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = FALSE;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
-- Index sur related_property_id créé plus tard avec la contrainte

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
CREATE POLICY "Users can view their notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their notifications" ON notifications;
CREATE POLICY "Users can update their notifications"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their notifications" ON notifications;
CREATE POLICY "Users can delete their notifications"
ON notifications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================
-- PARTIE 3 : TABLE MESSAGES
-- =============================================

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Participants
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contenu
    subject VARCHAR(255),
    body TEXT NOT NULL,
    
    -- Statut
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    archived_by_sender BOOLEAN DEFAULT FALSE,
    archived_by_recipient BOOLEAN DEFAULT FALSE,
    deleted_by_sender BOOLEAN DEFAULT FALSE,
    deleted_by_recipient BOOLEAN DEFAULT FALSE,
    
    -- Contexte
    property_id UUID, -- REFERENCES properties(id) ON DELETE SET NULL (ajouté après si properties existe)
    parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL, -- Pour les réponses
    
    -- Pièces jointes
    attachments JSONB DEFAULT '[]',
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_unread ON messages(recipient_id, read) WHERE read = FALSE;
-- Index sur property_id créé plus tard avec la contrainte
CREATE INDEX IF NOT EXISTS idx_messages_parent ON messages(parent_message_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS messages_updated_at ON messages;
CREATE TRIGGER messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their messages" ON messages;
CREATE POLICY "Users can view their messages"
ON messages FOR SELECT
TO authenticated
USING (
    auth.uid() = sender_id 
    OR auth.uid() = recipient_id
);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update their messages" ON messages;
CREATE POLICY "Users can update their messages"
ON messages FOR UPDATE
TO authenticated
USING (
    auth.uid() = sender_id 
    OR auth.uid() = recipient_id
);

-- =============================================
-- PARTIE 4 : AJOUT CONTRAINTES PROPERTIES (SI EXISTE)
-- =============================================

-- Ajouter les clés étrangères vers properties si la table existe
DO $$ 
BEGIN
    -- Vérifier si la table properties existe
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'properties') THEN
        -- Ajouter contrainte pour notifications.related_property_id
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'notifications_related_property_id_fkey'
        ) THEN
            ALTER TABLE notifications 
            ADD CONSTRAINT notifications_related_property_id_fkey 
            FOREIGN KEY (related_property_id) REFERENCES properties(id) ON DELETE SET NULL;
            
            -- Créer l'index sur related_property_id
            CREATE INDEX IF NOT EXISTS idx_notifications_property ON notifications(related_property_id);
            
            RAISE NOTICE '✅ Contrainte notifications.related_property_id ajoutée';
            RAISE NOTICE '✅ Index notifications.related_property_id créé';
        END IF;
        
        -- Ajouter contrainte pour messages.property_id
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'messages_property_id_fkey'
        ) THEN
            ALTER TABLE messages 
            ADD CONSTRAINT messages_property_id_fkey 
            FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL;
            
            -- Créer l'index sur property_id
            CREATE INDEX IF NOT EXISTS idx_messages_property ON messages(property_id);
            
            RAISE NOTICE '✅ Contrainte messages.property_id ajoutée';
            RAISE NOTICE '✅ Index messages.property_id créé';
        END IF;
    ELSE
        RAISE NOTICE '⚠️ Table properties non trouvée. Exécutez SCRIPT_COMPLET_UNIQUE.sql d''abord.';
        RAISE NOTICE '⚠️ Les contraintes property_id seront ajoutées ultérieurement.';
    END IF;
END $$;

-- =============================================
-- PARTIE 5 : DONNÉES INITIALES POUR TESTS
-- =============================================

-- Créer un abonnement gratuit par défaut pour chaque vendeur existant
INSERT INTO subscriptions (user_id, plan, status, max_properties, price)
SELECT 
    id,
    'gratuit',
    'active',
    3,
    0
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT DO NOTHING;

-- =============================================
-- VÉRIFICATION FINALE
-- =============================================

SELECT 
    'TABLES COMPLÉMENTAIRES CRÉÉES' as info,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name IN ('subscriptions', 'notifications', 'messages');

SELECT '✅ TABLES COMPLÉMENTAIRES CRÉÉES !' as status;
