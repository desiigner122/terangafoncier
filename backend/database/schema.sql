-- 🏦 BASE DE DONNÉES TERANGA FONCIER
-- Schéma PostgreSQL complet pour la plateforme foncière sénégalaise
-- Version: 1.0
-- Date: 2024

-- Extensions PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Pour les données géospatiales
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Pour la recherche textuelle

-- 👥 TABLE UTILISATEURS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'particulier' CHECK (role IN ('particulier', 'agent_foncier', 'geometre', 'admin', 'banque')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'pending')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    profile_image VARCHAR(500),
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100) DEFAULT 'Dakar',
    country VARCHAR(100) DEFAULT 'Sénégal',
    date_of_birth DATE,
    id_document_type VARCHAR(50), -- CNI, Passeport, etc.
    id_document_number VARCHAR(100),
    subscription_type VARCHAR(20) DEFAULT 'basic' CHECK (subscription_type IN ('basic', 'premium', 'enterprise')),
    subscription_expires_at TIMESTAMP,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    blocked_until TIMESTAMP,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🏡 TABLE PROPRIÉTÉS
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('terrain', 'maison', 'appartement', 'commerce', 'industriel', 'agricole')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'reserved', 'suspended', 'pending_verification')),
    price DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'XOF',
    surface DECIMAL(10,2), -- en m²
    surface_unit VARCHAR(10) DEFAULT 'm²',
    location TEXT NOT NULL,
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    postal_code VARCHAR(10),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    geom GEOMETRY(POINT, 4326), -- PostGIS pour géolocalisation
    images JSONB DEFAULT '[]', -- URLs des images
    documents JSONB DEFAULT '[]', -- Documents associés
    amenities JSONB DEFAULT '[]', -- Commodités (école, hôpital, etc.)
    features JSONB DEFAULT '{}', -- Caractéristiques (chambres, salles de bain, etc.)
    blockchain_hash VARCHAR(66), -- Hash de la transaction blockchain
    blockchain_network VARCHAR(50) DEFAULT 'polygon',
    blockchain_verified BOOLEAN DEFAULT FALSE,
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in_progress', 'verified', 'rejected')),
    verification_paid BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT,
    ai_analysis JSONB DEFAULT '{}', -- Analyse IA du bien
    market_value DECIMAL(15,2), -- Valeur estimée par IA
    energy_rating VARCHAR(10), -- DPE si applicable
    construction_year INTEGER,
    last_renovation_year INTEGER,
    legal_status VARCHAR(100), -- Statut juridique
    land_registry_ref VARCHAR(100), -- Référence cadastrale
    title_deed_number VARCHAR(100), -- Numéro titre foncier
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    contact_requests_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    search_vector TSVECTOR, -- Pour recherche full-text
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 💰 TABLE TRANSACTIONS
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id),
    seller_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('sale', 'rent', 'lease', 'transfer')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'failed')),
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    commission DECIMAL(15,2),
    commission_rate DECIMAL(5,4), -- Pourcentage
    down_payment DECIMAL(15,2),
    remaining_balance DECIMAL(15,2),
    payment_method VARCHAR(50),
    payment_schedule JSONB DEFAULT '[]', -- Échéancier de paiement
    contract_terms JSONB DEFAULT '{}',
    blockchain_hash VARCHAR(66),
    blockchain_network VARCHAR(50) DEFAULT 'polygon',
    blockchain_confirmed BOOLEAN DEFAULT FALSE,
    smart_contract_address VARCHAR(42),
    escrow_address VARCHAR(42),
    escrow_amount DECIMAL(15,2),
    legal_documents JSONB DEFAULT '[]',
    signatures JSONB DEFAULT '[]', -- Signatures électroniques
    notary_id UUID REFERENCES users(id),
    notary_fees DECIMAL(15,2),
    registration_fees DECIMAL(15,2),
    taxes DECIMAL(15,2),
    total_fees DECIMAL(15,2),
    completion_date DATE,
    transfer_date DATE,
    cancellation_reason TEXT,
    refund_amount DECIMAL(15,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📄 TABLE DOCUMENTS
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- titre_foncier, cni, contrat, etc.
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    file_hash VARCHAR(64), -- SHA-256
    status VARCHAR(50) DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'analyzed', 'verified', 'rejected')),
    ai_analysis JSONB DEFAULT '{}', -- Résultats analyse IA
    ai_confidence DECIMAL(5,4), -- Score de confiance IA
    ocr_text TEXT, -- Texte extrait par OCR
    fraud_score DECIMAL(5,4), -- Score de détection de fraude
    is_authentic BOOLEAN,
    verification_status VARCHAR(50) DEFAULT 'pending',
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT,
    blockchain_hash VARCHAR(66), -- Hash du document sur blockchain
    ipfs_hash VARCHAR(100), -- Hash IPFS si stockage décentralisé
    access_permissions JSONB DEFAULT '[]', -- Qui peut accéder
    expiry_date DATE,
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔔 TABLE NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success', 'property', 'transaction', 'document', 'payment', 'system')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    action_url VARCHAR(500),
    action_text VARCHAR(100),
    data JSONB DEFAULT '{}', -- Données contextuelles
    expires_at TIMESTAMP,
    channels JSONB DEFAULT '["web"]', -- web, email, sms, push
    sent_channels JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 💳 TABLE PAIEMENTS
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    transaction_id UUID REFERENCES transactions(id),
    reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    type VARCHAR(50) NOT NULL, -- verification_fee, premium_subscription, commission, etc.
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    payment_method VARCHAR(50), -- mobile_money, card, bank_transfer, crypto
    provider VARCHAR(50), -- orange, wave, free, visa, etc.
    phone_number VARCHAR(20),
    external_transaction_id VARCHAR(255),
    payment_data JSONB DEFAULT '{}',
    webhook_data JSONB DEFAULT '{}',
    fees DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2),
    refund_amount DECIMAL(15,2),
    refund_reason TEXT,
    completed_at TIMESTAMP,
    failed_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ⭐ TABLE FAVORIS
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- 📍 TABLE LIEUX FAVORIS UTILISATEUR
CREATE TABLE user_favorite_places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    category VARCHAR(50), -- home, work, school, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔍 TABLE RECHERCHES SAUVEGARDÉES
CREATE TABLE saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    search_criteria JSONB NOT NULL,
    alert_enabled BOOLEAN DEFAULT FALSE,
    alert_frequency VARCHAR(20) DEFAULT 'daily', -- immediate, daily, weekly
    last_alert_sent TIMESTAMP,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📊 TABLE STATISTIQUES
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    referer VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔑 TABLE SESSIONS
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}',
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📝 TABLE LOGS SYSTÈME
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level VARCHAR(20) NOT NULL, -- error, warn, info, debug
    message TEXT NOT NULL,
    category VARCHAR(100), -- auth, payment, blockchain, ai, etc.
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    ip_address INET,
    data JSONB DEFAULT '{}',
    stack_trace TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔒 TABLE TOKENS API
CREATE TABLE api_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    permissions JSONB DEFAULT '[]',
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 📧 TABLE COMMUNICATIONS
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'message', -- message, inquiry, offer, etc.
    status VARCHAR(20) DEFAULT 'sent', -- sent, delivered, read, archived
    read_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🏷️ TABLE TAGS
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50), -- location, feature, type, etc.
    color VARCHAR(7), -- Hex color
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🏷️ TABLE LIAISON PROPRIÉTÉS-TAGS
CREATE TABLE property_tags (
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, tag_id)
);

-- 📊 TABLE ÉVALUATIONS PROPRIÉTÉS
CREATE TABLE property_valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    valuator_id UUID REFERENCES users(id),
    valuation_type VARCHAR(50) NOT NULL, -- ai, expert, market, insurance
    estimated_value DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    confidence_score DECIMAL(5,4),
    methodology TEXT,
    factors JSONB DEFAULT '{}', -- Facteurs pris en compte
    comparable_properties JSONB DEFAULT '[]',
    market_trends JSONB DEFAULT '{}',
    valid_until DATE,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES POUR PERFORMANCES
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_region ON users(region);

CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_region ON properties(region);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_surface ON properties(surface);
CREATE INDEX idx_properties_geom ON properties USING GIST(geom);
CREATE INDEX idx_properties_blockchain ON properties(blockchain_hash);
CREATE INDEX idx_properties_search ON properties USING GIN(search_vector);

CREATE INDEX idx_transactions_property ON transactions(property_id);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);

CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_property ON documents(property_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_status ON documents(status);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_read ON notifications(read);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_reference ON payments(reference);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_type ON payments(type);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_property ON favorites(property_id);

CREATE INDEX idx_analytics_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at);

CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_sessions_active ON user_sessions(is_active);

CREATE INDEX idx_logs_level ON system_logs(level);
CREATE INDEX idx_logs_category ON system_logs(category);
CREATE INDEX idx_logs_created ON system_logs(created_at);

-- TRIGGERS POUR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- TRIGGER POUR SEARCH_VECTOR
CREATE OR REPLACE FUNCTION update_property_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('french', 
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.location, '') || ' ' ||
        COALESCE(NEW.city, '') || ' ' ||
        COALESCE(NEW.region, '') || ' ' ||
        COALESCE(NEW.property_type, '')
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_property_search_vector_trigger 
    BEFORE INSERT OR UPDATE ON properties 
    FOR EACH ROW EXECUTE FUNCTION update_property_search_vector();

-- VUES UTILES
CREATE VIEW property_stats AS
SELECT 
    property_type,
    region,
    COUNT(*) as total_properties,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price,
    AVG(surface) as avg_surface
FROM properties 
WHERE status = 'active'
GROUP BY property_type, region;

CREATE VIEW user_stats AS
SELECT 
    role,
    region,
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE status = 'active') as active_users,
    COUNT(*) FILTER (WHERE last_login > CURRENT_TIMESTAMP - INTERVAL '30 days') as active_last_30d
FROM users
GROUP BY role, region;

CREATE VIEW transaction_stats AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    type,
    COUNT(*) as total_transactions,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount
FROM transactions
WHERE status = 'completed'
GROUP BY month, type
ORDER BY month DESC;

-- DONNÉES INITIALES
INSERT INTO users (id, email, password_hash, full_name, role, status, email_verified) VALUES
(uuid_generate_v4(), 'admin@teranga-foncier.com', '$2a$12$placeholder_hash', 'Administrateur Teranga', 'admin', 'active', true),
(uuid_generate_v4(), 'demo@teranga-foncier.com', '$2a$12$placeholder_hash', 'Utilisateur Demo', 'particulier', 'active', true);

INSERT INTO tags (name, category, color) VALUES
('Proche école', 'amenity', '#4CAF50'),
('Vue mer', 'feature', '#2196F3'),
('Transport public', 'transport', '#FF9800'),
('Centre ville', 'location', '#9C27B0'),
('Parking', 'feature', '#607D8B'),
('Jardin', 'feature', '#8BC34A'),
('Climatisé', 'feature', '#00BCD4'),
('Sécurisé', 'security', '#F44336');

-- COMMENTAIRES
COMMENT ON TABLE users IS 'Table des utilisateurs de la plateforme';
COMMENT ON TABLE properties IS 'Table des propriétés immobilières';
COMMENT ON TABLE transactions IS 'Table des transactions immobilières';
COMMENT ON TABLE documents IS 'Table des documents associés aux propriétés et transactions';
COMMENT ON TABLE notifications IS 'Table des notifications utilisateurs';
COMMENT ON TABLE payments IS 'Table des paiements et transactions financières';
COMMENT ON COLUMN properties.blockchain_hash IS 'Hash de la transaction blockchain pour la propriété';
COMMENT ON COLUMN properties.geom IS 'Géométrie PostGIS pour géolocalisation précise';
COMMENT ON COLUMN documents.ai_analysis IS 'Résultats de l analyse IA du document';
COMMENT ON COLUMN properties.search_vector IS 'Vecteur de recherche full-text automatiquement généré';

COMMIT;