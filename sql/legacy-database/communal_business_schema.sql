-- =====================================================
-- SCHEMA BASE DE DONNÉES - BUSINESS MODEL COMMUNAL
-- Teranga Foncier - Système de gestion des demandes communales
-- =====================================================

-- Table des demandes communales
CREATE TABLE IF NOT EXISTS communal_requests (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('terrain_municipal', 'permis_construire', 'terrain_agricole')),
    citizen_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    commune_id BIGINT NOT NULL,
    
    -- Informations de la demande
    description TEXT NOT NULL,
    location JSONB, -- {address, coordinates, zone}
    documents JSONB DEFAULT '[]'::jsonb, -- URLs des documents uploadés
    
    -- Statut et workflow
    status VARCHAR(20) DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'paye', 'en_cours', 'approuve', 'rejete')),
    
    -- Montants et revenus
    total_amount INTEGER NOT NULL, -- Montant total en FCFA
    tf_commission INTEGER NOT NULL, -- Commission Teranga Foncier
    commune_amount INTEGER NOT NULL, -- Montant pour la commune
    
    -- Validation
    validated_by UUID REFERENCES auth.users(id), -- Agent communal qui valide
    validation_comments TEXT,
    validated_at TIMESTAMPTZ,
    
    -- Paiement
    paid_at TIMESTAMPTZ,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des paiements communaux
CREATE TABLE IF NOT EXISTS communal_payments (
    id BIGSERIAL PRIMARY KEY,
    request_id BIGINT REFERENCES communal_requests(id) ON DELETE CASCADE,
    
    -- Montants
    total_amount INTEGER NOT NULL,
    breakdown JSONB NOT NULL, -- {dossier: 15000, commission: 25000, instruction: 10000}
    
    -- Informations de paiement
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(20) DEFAULT 'mobile_money',
    transaction_id VARCHAR(100),
    phone_number VARCHAR(20),
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- Table des communes et informations
CREATE TABLE IF NOT EXISTS communes (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL,
    departement VARCHAR(50) NOT NULL,
    
    -- Contact
    mayor_name VARCHAR(100),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT,
    
    -- Configuration
    is_active BOOLEAN DEFAULT true,
    subscription_plan VARCHAR(20) DEFAULT 'basic',
    max_monthly_requests INTEGER DEFAULT 50,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des abonnements communaux
CREATE TABLE IF NOT EXISTS commune_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    commune_id BIGINT REFERENCES communes(id) ON DELETE CASCADE,
    
    -- Plan d'abonnement
    plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('basic', 'premium', 'enterprise')),
    monthly_price INTEGER NOT NULL, -- Prix mensuel en FCFA
    max_requests INTEGER DEFAULT -1, -- -1 = illimité
    features JSONB DEFAULT '[]'::jsonb, -- Liste des fonctionnalités
    
    -- Période
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount INTEGER NOT NULL, -- Montant total payé
    
    -- Statut
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des utilisateurs communaux (agents municipaux)
CREATE TABLE IF NOT EXISTS commune_users (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    commune_id BIGINT REFERENCES communes(id) ON DELETE CASCADE,
    
    -- Rôle et permissions
    role VARCHAR(20) DEFAULT 'agent' CHECK (role IN ('agent', 'manager', 'admin')),
    permissions JSONB DEFAULT '[]'::jsonb,
    
    -- Informations
    position VARCHAR(100), -- Poste dans la commune
    is_active BOOLEAN DEFAULT true,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, commune_id)
);

-- Table des revenus et analytics
CREATE TABLE IF NOT EXISTS revenue_analytics (
    id BIGSERIAL PRIMARY KEY,
    
    -- Source du revenu
    source VARCHAR(30) NOT NULL CHECK (source IN ('communal_request', 'commune_subscription', 'service_fee')),
    source_id BIGINT, -- ID de la demande ou abonnement
    
    -- Montants
    amount INTEGER NOT NULL, -- Montant en FCFA
    
    -- Catégorisation
    category VARCHAR(20) NOT NULL, -- commission, subscription, service
    subcategory VARCHAR(30), -- type de demande ou plan
    
    -- Géographie
    commune_id BIGINT REFERENCES communes(id),
    region VARCHAR(50),
    
    -- Temporel
    date DATE NOT NULL,
    month INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM date)) STORED,
    year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)) STORED,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    
    -- Destinataire
    recipient_type VARCHAR(10) CHECK (recipient_type IN ('user', 'commune')),
    recipient_id UUID, -- user_id ou commune_id selon le type
    
    -- Contenu
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL, -- new_request, request_update, payment_due, etc.
    data JSONB DEFAULT '{}'::jsonb, -- Données additionnelles
    
    -- Statut
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEX ET OPTIMISATIONS
-- =====================================================

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_communal_requests_citizen ON communal_requests(citizen_id);
CREATE INDEX IF NOT EXISTS idx_communal_requests_commune ON communal_requests(commune_id);
CREATE INDEX IF NOT EXISTS idx_communal_requests_status ON communal_requests(status);
CREATE INDEX IF NOT EXISTS idx_communal_requests_date ON communal_requests(created_at);

CREATE INDEX IF NOT EXISTS idx_communal_payments_request ON communal_payments(request_id);
CREATE INDEX IF NOT EXISTS idx_communal_payments_status ON communal_payments(status);

CREATE INDEX IF NOT EXISTS idx_commune_subscriptions_commune ON commune_subscriptions(commune_id);
CREATE INDEX IF NOT EXISTS idx_commune_subscriptions_status ON commune_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_commune_subscriptions_dates ON commune_subscriptions(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_revenue_analytics_date ON revenue_analytics(date);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_source ON revenue_analytics(source, source_id);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_category ON revenue_analytics(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_commune ON revenue_analytics(commune_id);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_type, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(recipient_type, recipient_id, is_read);

-- =====================================================
-- TRIGGERS ET AUTOMATISATIONS
-- =====================================================

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger aux tables nécessaires
CREATE TRIGGER update_communal_requests_updated_at 
    BEFORE UPDATE ON communal_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communes_updated_at 
    BEFORE UPDATE ON communes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commune_subscriptions_updated_at 
    BEFORE UPDATE ON commune_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commune_users_updated_at 
    BEFORE UPDATE ON commune_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour calculer les revenus mensuels
CREATE OR REPLACE FUNCTION calculate_monthly_revenue(target_month INTEGER, target_year INTEGER)
RETURNS TABLE (
    category VARCHAR(20),
    subcategory VARCHAR(30),
    total_amount BIGINT,
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.category,
        r.subcategory,
        SUM(r.amount)::BIGINT as total_amount,
        COUNT(*)::BIGINT as transaction_count
    FROM revenue_analytics r
    WHERE r.month = target_month AND r.year = target_year
    GROUP BY r.category, r.subcategory
    ORDER BY total_amount DESC;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour obtenir les statistiques d'une commune
CREATE OR REPLACE FUNCTION get_commune_stats(target_commune_id BIGINT)
RETURNS TABLE (
    total_requests BIGINT,
    pending_requests BIGINT,
    approved_requests BIGINT,
    monthly_revenue BIGINT,
    current_plan VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(cr.id)::BIGINT as total_requests,
        COUNT(CASE WHEN cr.status IN ('en_attente', 'paye') THEN 1 END)::BIGINT as pending_requests,
        COUNT(CASE WHEN cr.status = 'approuve' THEN 1 END)::BIGINT as approved_requests,
        COALESCE(SUM(CASE WHEN ra.month = EXTRACT(MONTH FROM NOW()) AND ra.year = EXTRACT(YEAR FROM NOW()) THEN ra.amount END), 0)::BIGINT as monthly_revenue,
        cs.plan_type as current_plan
    FROM communes c
    LEFT JOIN communal_requests cr ON c.id = cr.commune_id
    LEFT JOIN revenue_analytics ra ON c.id = ra.commune_id
    LEFT JOIN commune_subscriptions cs ON c.id = cs.commune_id AND cs.status = 'active'
    WHERE c.id = target_commune_id
    GROUP BY c.id, cs.plan_type;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DONNÉES INITIALES
-- =====================================================

-- Insérer quelques communes principales
INSERT INTO communes (name, region, departement, mayor_name, contact_email, contact_phone) VALUES
('Dakar Plateau', 'Dakar', 'Dakar', 'Alioune Ndoye', 'mairie.plateau@dakar.sn', '+221 33 823 45 67'),
('Thiès Nord', 'Thiès', 'Thiès', 'Fatou Diop', 'mairie@thies-nord.sn', '+221 33 951 23 45'),
('Mbour', 'Thiès', 'Mbour', 'Mamadou Fall', 'contact@mbour.sn', '+221 33 957 11 22'),
('Saint-Louis', 'Saint-Louis', 'Saint-Louis', 'Aminata Ba', 'mairie@saint-louis.sn', '+221 33 961 33 44'),
('Kaolack', 'Kaolack', 'Kaolack', 'Ousmane Sarr', 'mairie.kaolack@gmail.com', '+221 33 941 55 66'),
('Ziguinchor', 'Ziguinchor', 'Ziguinchor', 'Aissatou Sow', 'mairie@ziguinchor.sn', '+221 33 991 77 88')
ON CONFLICT DO NOTHING;

-- Abonnements test pour les communes
INSERT INTO commune_subscriptions (commune_id, plan_type, monthly_price, max_requests, features, start_date, end_date, total_amount) VALUES
(1, 'premium', 150000, -1, '["advanced_dashboard", "phone_support", "geolocation"]', '2024-01-01', '2024-12-31', 1800000),
(2, 'basic', 75000, 50, '["basic_interface", "email_support"]', '2024-01-01', '2024-12-31', 900000),
(3, 'enterprise', 300000, -1, '["api_integration", "multi_users", "dedicated_manager"]', '2024-01-01', '2024-12-31', 3600000),
(4, 'premium', 150000, -1, '["advanced_dashboard", "phone_support", "geolocation"]', '2024-01-01', '2024-12-31', 1800000),
(5, 'basic', 75000, 50, '["basic_interface", "email_support"]', '2024-01-01', '2024-12-31', 900000),
(6, 'premium', 150000, -1, '["advanced_dashboard", "phone_support", "geolocation"]', '2024-01-01', '2024-12-31', 1800000)
ON CONFLICT DO NOTHING;

-- =====================================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- =====================================================

-- Activer RLS sur les tables sensibles
ALTER TABLE communal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE communal_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commune_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commune_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Politique pour les demandes communales (citoyens voient leurs demandes)
CREATE POLICY "Users can view their own requests" ON communal_requests
    FOR SELECT USING (auth.uid() = citizen_id);

CREATE POLICY "Users can create their own requests" ON communal_requests
    FOR INSERT WITH CHECK (auth.uid() = citizen_id);

-- Politique pour les agents communaux (accès aux demandes de leur commune)
CREATE POLICY "Commune users can view commune requests" ON communal_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM commune_users cu 
            WHERE cu.user_id = auth.uid() 
            AND cu.commune_id = communal_requests.commune_id 
            AND cu.is_active = true
        )
    );

CREATE POLICY "Commune users can update commune requests" ON communal_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM commune_users cu 
            WHERE cu.user_id = auth.uid() 
            AND cu.commune_id = communal_requests.commune_id 
            AND cu.is_active = true
        )
    );

-- Politique pour les notifications
CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (
        (recipient_type = 'user' AND recipient_id = auth.uid()) OR
        (recipient_type = 'commune' AND EXISTS (
            SELECT 1 FROM commune_users cu 
            WHERE cu.user_id = auth.uid() 
            AND cu.commune_id::text = recipient_id::text
            AND cu.is_active = true
        ))
    );

-- =====================================================
-- COMMENTAIRES DE DOCUMENTATION
-- =====================================================

COMMENT ON TABLE communal_requests IS 'Demandes de terrains et permis adressées aux communes';
COMMENT ON TABLE communal_payments IS 'Paiements des frais de dossier pour demandes communales';
COMMENT ON TABLE communes IS 'Informations sur les communes partenaires';
COMMENT ON TABLE commune_subscriptions IS 'Abonnements payants des communes à la plateforme';
COMMENT ON TABLE commune_users IS 'Agents municipaux ayant accès à la plateforme';
COMMENT ON TABLE revenue_analytics IS 'Suivi des revenus générés par le secteur communal';
COMMENT ON TABLE notifications IS 'Notifications pour citoyens et communes';

COMMENT ON FUNCTION calculate_monthly_revenue IS 'Calcule les revenus mensuels par catégorie';
COMMENT ON FUNCTION get_commune_stats IS 'Statistiques détaillées pour une commune donnée';
