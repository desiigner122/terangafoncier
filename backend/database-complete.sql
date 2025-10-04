-- ===============================
-- BASE DE DONNÉES COMPLÈTE TERANGA FONCIER
-- Architecture pour 88 pages admin + toutes fonctionnalités
-- ===============================

-- ===============================
-- SYSTÈME D'AUTHENTIFICATION & RÔLES
-- ===============================

-- Table des rôles étendus
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    hierarchy_level INTEGER DEFAULT 0,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions granulaires
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Association rôles-permissions
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INTEGER REFERENCES users(id),
    PRIMARY KEY (role_id, permission_id)
);

-- Utilisateurs étendus
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Association utilisateurs-rôles
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- Profils utilisateurs détaillés
CREATE TABLE user_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    avatar_url VARCHAR(500),
    bio TEXT,
    company VARCHAR(200),
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Sénégal',
    date_of_birth DATE,
    gender VARCHAR(20),
    profession VARCHAR(100),
    website VARCHAR(500),
    linkedin VARCHAR(500),
    facebook VARCHAR(500),
    twitter VARCHAR(500),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Paramètres utilisateurs
CREATE TABLE user_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    notifications JSONB DEFAULT '{}',
    privacy JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    theme VARCHAR(20) DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'fr',
    timezone VARCHAR(50) DEFAULT 'Africa/Dakar',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions utilisateurs
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500),
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- MODULE FINANCIER - ABONNEMENTS & REVENUS
-- ===============================

-- Plans d'abonnement
CREATE TABLE subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, yearly, lifetime
    features JSONB DEFAULT '[]',
    limitations JSONB DEFAULT '{}',
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    trial_days INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Abonnements utilisateurs
CREATE TABLE user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES subscription_plans(id),
    status VARCHAR(20) DEFAULT 'active',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP,
    trial_ends_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    payment_method VARCHAR(50),
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promotions et codes promo
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL, -- percentage, fixed, free_trial
    discount_value DECIMAL(10,2) NOT NULL,
    min_amount DECIMAL(12,2),
    max_discount DECIMAL(12,2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    per_user_limit INTEGER DEFAULT 1,
    applicable_plans JSONB DEFAULT '[]',
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions financières
CREATE TABLE financial_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    subscription_id INTEGER REFERENCES user_subscriptions(id),
    type VARCHAR(50) NOT NULL, -- subscription, commission, refund, payout
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_gateway VARCHAR(50),
    gateway_transaction_id VARCHAR(200),
    gateway_response JSONB,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Revenus de la plateforme
CREATE TABLE platform_revenues (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    revenue_type VARCHAR(50) NOT NULL, -- subscriptions, commissions, ads, featured
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    transactions_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Taux de commission par rôle
CREATE TABLE commission_rates (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    rate_type VARCHAR(20) DEFAULT 'percentage', -- percentage, fixed
    rate_value DECIMAL(5,4) NOT NULL,
    min_amount DECIMAL(12,2),
    max_amount DECIMAL(12,2),
    region_code VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    effective_until TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- PROPRIÉTÉS & TERRAINS ÉTENDUS
-- ===============================

-- Propriétés principales
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    property_type VARCHAR(50) NOT NULL,
    listing_type VARCHAR(20) DEFAULT 'sale', -- sale, rent, lease
    price DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    negotiable BOOLEAN DEFAULT TRUE,
    price_per_sqm DECIMAL(10,2),
    
    -- Localisation
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    commune VARCHAR(100),
    neighborhood VARCHAR(100),
    postal_code VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    
    -- Caractéristiques
    surface_area DECIMAL(10,2),
    built_area DECIMAL(10,2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    parking_spaces INTEGER,
    floors INTEGER,
    year_built INTEGER,
    
    -- Statuts et modération
    status VARCHAR(20) DEFAULT 'draft', -- draft, pending, active, sold, expired, rejected
    featured BOOLEAN DEFAULT FALSE,
    premium BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    moderation_status VARCHAR(20) DEFAULT 'pending',
    rejection_reason TEXT,
    
    -- SEO et métadonnées
    meta_title VARCHAR(300),
    meta_description VARCHAR(500),
    meta_keywords TEXT,
    
    -- Statistiques
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    
    -- Dates
    available_from DATE,
    expires_at TIMESTAMP,
    featured_until TIMESTAMP,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Images des propriétés
CREATE TABLE property_images (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    alt_text VARCHAR(200),
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    file_size INTEGER,
    dimensions VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Caractéristiques des propriétés
CREATE TABLE property_features (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    feature_value TEXT,
    is_highlight BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents des propriétés
CREATE TABLE property_documents (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(300) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vues des propriétés
CREATE TABLE property_views (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    referrer VARCHAR(500),
    session_id VARCHAR(100),
    duration_seconds INTEGER,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favoris des utilisateurs
CREATE TABLE property_favorites (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, property_id)
);

-- ===============================
-- MODULE COMMUNICATIONS
-- ===============================

-- Templates de notifications
CREATE TABLE notification_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- email, sms, push, in_app
    subject VARCHAR(300),
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications utilisateurs
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    channels VARCHAR(100) DEFAULT 'in_app', -- in_app,email,sms,push
    priority VARCHAR(20) DEFAULT 'normal',
    read_at TIMESTAMP,
    clicked_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campagnes email
CREATE TABLE email_campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    subject VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    template_id INTEGER REFERENCES notification_templates(id),
    target_audience JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    recipients_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campagnes SMS
CREATE TABLE sms_campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    target_audience JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    recipients_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    cost DECIMAL(10,2),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages de contact
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'new',
    assigned_to INTEGER REFERENCES users(id),
    responded_at TIMESTAMP,
    response TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets
CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    subject VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'open',
    assigned_to INTEGER REFERENCES users(id),
    resolution TEXT,
    resolved_at TIMESTAMP,
    satisfaction_rating INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- MODULE CONTENU & BLOG
-- ===============================

-- Articles de blog
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    category VARCHAR(100),
    tags JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'draft',
    seo_title VARCHAR(300),
    seo_description VARCHAR(500),
    seo_keywords TEXT,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    reading_time INTEGER,
    featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles d'actualités
CREATE TABLE news_articles (
    id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    summary VARCHAR(500),
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'draft',
    expires_at TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Témoignages
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
    client_name VARCHAR(200) NOT NULL,
    client_title VARCHAR(200),
    client_company VARCHAR(200),
    client_avatar VARCHAR(500),
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pages statiques (FAQ, guides, etc.)
CREATE TABLE static_pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'page',
    parent_id INTEGER REFERENCES static_pages(id),
    sort_order INTEGER DEFAULT 0,
    seo_title VARCHAR(300),
    seo_description VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- MODULE ANALYTICS & RAPPORTS
-- ===============================

-- Analytics des utilisateurs
CREATE TABLE user_analytics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    sessions_count INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    properties_viewed INTEGER DEFAULT 0,
    searches_performed INTEGER DEFAULT 0,
    contacts_made INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics des propriétés
CREATE TABLE property_analytics (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views_count INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    favorites_added INTEGER DEFAULT 0,
    inquiries_received INTEGER DEFAULT 0,
    phone_reveals INTEGER DEFAULT 0,
    email_reveals INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Métriques globales de la plateforme
CREATE TABLE platform_metrics (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(12,2) NOT NULL,
    metric_type VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, metric_name)
);

-- ===============================
-- MODULE GESTION MARKETPLACE
-- ===============================

-- Modération des propriétés
CREATE TABLE property_moderations (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    moderator_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    reason TEXT,
    notes TEXT,
    previous_status VARCHAR(20),
    new_status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vérification des vendeurs
CREATE TABLE vendor_verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    documents JSONB DEFAULT '[]',
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    expires_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Résolution des litiges
CREATE TABLE disputes (
    id SERIAL PRIMARY KEY,
    dispute_number VARCHAR(50) UNIQUE NOT NULL,
    property_id INTEGER REFERENCES properties(id),
    complainant_id INTEGER REFERENCES users(id),
    respondent_id INTEGER REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    subject VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open',
    priority VARCHAR(20) DEFAULT 'normal',
    assigned_to INTEGER REFERENCES users(id),
    resolution TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- MODULE GÉOGRAPHIQUE SÉNÉGAL
-- ===============================

-- Régions du Sénégal
CREATE TABLE senegal_regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    capital VARCHAR(100),
    area_km2 DECIMAL(10,2),
    population INTEGER,
    coordinates JSONB,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communes du Sénégal
CREATE TABLE senegal_communes (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES senegal_regions(id),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50), -- commune, communauté rurale, etc.
    population INTEGER,
    area_km2 DECIMAL(10,2),
    coordinates JSONB,
    postal_codes JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Zonage urbain
CREATE TABLE urban_zoning (
    id SERIAL PRIMARY KEY,
    commune_id INTEGER REFERENCES senegal_communes(id),
    zone_name VARCHAR(200) NOT NULL,
    zone_type VARCHAR(50), -- résidentiel, commercial, industriel, mixte
    regulations JSONB DEFAULT '{}',
    restrictions JSONB DEFAULT '{}',
    max_height DECIMAL(5,2),
    max_coverage_ratio DECIMAL(3,2),
    coordinates JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- MODULE IA & AUTOMATION
-- ===============================

-- Recommandations IA
CREATE TABLE ai_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL,
    data JSONB NOT NULL,
    score DECIMAL(5,4),
    model_version VARCHAR(50),
    context JSONB DEFAULT '{}',
    clicked BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics IA
CREATE TABLE ai_analytics (
    id SERIAL PRIMARY KEY,
    analysis_type VARCHAR(50) NOT NULL,
    input_data JSONB NOT NULL,
    results JSONB NOT NULL,
    model_version VARCHAR(50),
    processing_time_ms INTEGER,
    confidence_score DECIMAL(5,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs de sécurité et fraude
CREATE TABLE security_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'info',
    description TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- AUDIT & TRAÇABILITÉ
-- ===============================

-- Logs d'audit système
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id INTEGER,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Événements système
CREATE TABLE system_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) DEFAULT 'info',
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- INDEXES POUR PERFORMANCE
-- ===============================

-- Indexes pour les propriétés
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_location ON properties(city, region);
CREATE INDEX idx_properties_featured ON properties(featured, created_at DESC);
CREATE INDEX idx_properties_owner ON properties(owner_id);

-- Indexes pour les utilisateurs
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);

-- Indexes pour les analytics
CREATE INDEX idx_property_views_property ON property_views(property_id);
CREATE INDEX idx_property_views_date ON property_views(viewed_at);
CREATE INDEX idx_notifications_user ON notifications(user_id, read_at);

-- Indexes pour les finances
CREATE INDEX idx_financial_transactions_user ON financial_transactions(user_id);
CREATE INDEX idx_financial_transactions_status ON financial_transactions(status);
CREATE INDEX idx_platform_revenues_date ON platform_revenues(date);

-- ===============================
-- DONNÉES INITIALES
-- ===============================

-- Insertion des rôles de base
INSERT INTO roles (name, display_name, description, hierarchy_level) VALUES
('admin', 'Administrateur', 'Accès complet au système', 10),
('agent_foncier', 'Agent Foncier', 'Agent immobilier certifié', 8),
('banque', 'Banque', 'Institution bancaire', 7),
('particulier', 'Particulier', 'Utilisateur standard', 1),
('vendeur_particulier', 'Vendeur Particulier', 'Vendeur individuel', 3),
('vendeur_professionnel', 'Vendeur Professionnel', 'Vendeur professionnel', 5),
('investisseur', 'Investisseur', 'Investisseur immobilier', 4),
('promoteur', 'Promoteur', 'Promoteur immobilier', 6),
('notaire', 'Notaire', 'Notaire certifié', 7),
('geometre', 'Géomètre', 'Géomètre expert', 6),
('mairie', 'Mairie', 'Administration municipale', 8),
('agriculteur', 'Agriculteur', 'Exploitant agricole', 2);

-- Insertion des plans d'abonnement
INSERT INTO subscription_plans (name, slug, description, price, billing_cycle, features, trial_days) VALUES
('Basic', 'basic', 'Plan de base pour particuliers', 15000, 'monthly', '["5 propriétés", "Support email", "Recherche standard"]', 7),
('Pro', 'pro', 'Plan professionnel pour agents', 35000, 'monthly', '["25 propriétés", "CRM intégré", "Analytics avancées", "Support prioritaire"]', 14),
('Enterprise', 'enterprise', 'Plan entreprise pour grandes structures', 75000, 'monthly', '["Propriétés illimitées", "API access", "White label", "Support dédié", "Formation"]', 30);

-- Insertion des régions du Sénégal
INSERT INTO senegal_regions (name, code, capital, area_km2, population) VALUES
('Dakar', 'DK', 'Dakar', 547, 3732284),
('Thiès', 'TH', 'Thiès', 6670, 1789000),
('Saint-Louis', 'SL', 'Saint-Louis', 19241, 1029000),
('Diourbel', 'DB', 'Diourbel', 4824, 1497000),
('Louga', 'LG', 'Louga', 24847, 897000),
('Fatick', 'FK', 'Fatick', 7935, 714000),
('Kolda', 'KD', 'Kolda', 21011, 679000),
('Kaolack', 'KL', 'Kaolack', 16010, 960000),
('Tambacounda', 'TC', 'Tambacounda', 42364, 682000),
('Ziguinchor', 'ZG', 'Ziguinchor', 7339, 550000),
('Matam', 'MT', 'Matam', 29445, 562000),
('Kaffrine', 'KF', 'Kaffrine', 11262, 567000),
('Kédougou', 'KE', 'Kédougou', 16896, 152000),
('Sédhiou', 'SE', 'Sédhiou', 7341, 453000);

COMMIT;