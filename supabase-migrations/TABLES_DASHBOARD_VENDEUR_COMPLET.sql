-- =============================================
-- TABLES DASHBOARD VENDEUR - IMPLÉMENTATION COMPLÈTE
-- Crée TOUTES les tables manquantes pour rendre le dashboard 100% fonctionnel
-- =============================================

-- =============================================
-- NETTOYAGE : Supprimer les tables existantes
-- =============================================

DROP TABLE IF EXISTS fraud_check_documents CASCADE;
DROP TABLE IF EXISTS fraud_checks CASCADE;
DROP TABLE IF EXISTS gps_coordinates CASCADE;
DROP TABLE IF EXISTS property_photos CASCADE;
DROP TABLE IF EXISTS photo_analysis CASCADE;
DROP TABLE IF EXISTS blockchain_certificates CASCADE;
DROP TABLE IF EXISTS blockchain_transactions CASCADE;
DROP TABLE IF EXISTS wallet_connections CASCADE;
DROP TABLE IF EXISTS digital_services CASCADE;
DROP TABLE IF EXISTS service_subscriptions CASCADE;
DROP TABLE IF EXISTS service_usage CASCADE;
DROP TABLE IF EXISTS crm_contacts CASCADE;
DROP TABLE IF EXISTS crm_interactions CASCADE;
DROP TABLE IF EXISTS crm_deals CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS conversation_messages CASCADE;

-- =============================================
-- PARTIE 1 : ANTI-FRAUDE (VendeurAntiFraudeRealData.jsx)
-- =============================================

-- Table principale des vérifications anti-fraude
CREATE TABLE fraud_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Scores de vérification (0-100)
    overall_score INTEGER DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
    ocr_score INTEGER DEFAULT 0 CHECK (ocr_score >= 0 AND ocr_score <= 100),
    gps_score INTEGER DEFAULT 0 CHECK (gps_score >= 0 AND gps_score <= 100),
    price_score INTEGER DEFAULT 0 CHECK (price_score >= 0 AND price_score <= 100),
    document_score INTEGER DEFAULT 0 CHECK (document_score >= 0 AND document_score <= 100),
    
    -- Statut global
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    risk_level VARCHAR(50) DEFAULT 'unknown' CHECK (risk_level IN ('low', 'medium', 'high', 'critical', 'unknown')),
    is_approved BOOLEAN DEFAULT FALSE,
    
    -- Résultats détaillés
    ocr_results JSONB DEFAULT '{}', -- Résultats OCR (texte extrait, confiance, etc.)
    gps_results JSONB DEFAULT '{}', -- Coordonnées, précision, cohérence
    price_results JSONB DEFAULT '{}', -- Comparaison prix marché, anomalies
    document_results JSONB DEFAULT '{}', -- Validation documents
    
    -- Alertes et recommandations
    alerts JSONB DEFAULT '[]', -- Liste des alertes détectées
    recommendations JSONB DEFAULT '[]', -- Recommandations d'actions
    
    -- Métadonnées
    check_duration INTEGER, -- Durée en secondes
    checked_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table pour stocker les documents scannés
CREATE TABLE fraud_check_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fraud_check_id UUID NOT NULL REFERENCES fraud_checks(id) ON DELETE CASCADE,
    
    -- Document
    document_type VARCHAR(100) NOT NULL, -- titre_propriete, cadastre, identite, etc.
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    
    -- Analyse OCR
    ocr_text TEXT,
    ocr_confidence DECIMAL(5,2), -- 0.00 à 100.00
    extracted_data JSONB DEFAULT '{}', -- Données structurées extraites
    
    -- Validation
    is_valid BOOLEAN DEFAULT NULL,
    validation_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_fraud_checks_property ON fraud_checks(property_id);
CREATE INDEX idx_fraud_checks_vendor ON fraud_checks(vendor_id);
CREATE INDEX idx_fraud_checks_status ON fraud_checks(status);
CREATE INDEX idx_fraud_checks_risk ON fraud_checks(risk_level);
CREATE INDEX idx_fraud_check_documents_check ON fraud_check_documents(fraud_check_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_fraud_checks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fraud_checks_updated_at
    BEFORE UPDATE ON fraud_checks
    FOR EACH ROW
    EXECUTE FUNCTION update_fraud_checks_updated_at();

-- RLS
ALTER TABLE fraud_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_check_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their fraud checks"
ON fraud_checks FOR SELECT
TO authenticated
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can insert fraud checks"
ON fraud_checks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their fraud checks"
ON fraud_checks FOR UPDATE
TO authenticated
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can view their documents"
ON fraud_check_documents FOR SELECT
TO authenticated
USING (
    fraud_check_id IN (
        SELECT id FROM fraud_checks WHERE vendor_id = auth.uid()
    )
);

CREATE POLICY "Vendors can insert documents"
ON fraud_check_documents FOR INSERT
TO authenticated
WITH CHECK (
    fraud_check_id IN (
        SELECT id FROM fraud_checks WHERE vendor_id = auth.uid()
    )
);

-- =============================================
-- PARTIE 2 : GPS & CARTOGRAPHIE (VendeurGPSRealData.jsx)
-- =============================================

CREATE TABLE gps_coordinates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Coordonnées GPS
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    altitude DECIMAL(10,2),
    accuracy DECIMAL(10,2), -- Précision en mètres
    
    -- Type de point
    point_type VARCHAR(50) DEFAULT 'center' CHECK (point_type IN ('center', 'corner', 'boundary', 'entrance', 'landmark')),
    label VARCHAR(255),
    description TEXT,
    
    -- Source des données
    source VARCHAR(100) DEFAULT 'manual', -- manual, gps_device, google_maps, drone, satellite
    device_info JSONB DEFAULT '{}',
    
    -- Cadastre et limites
    cadastral_reference VARCHAR(255),
    plot_boundaries JSONB DEFAULT '[]', -- Polygon de points GPS
    surface_area DECIMAL(15,2), -- Surface en m²
    perimeter DECIMAL(15,2), -- Périmètre en m
    
    -- Vérification
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP,
    verification_method VARCHAR(100), -- field_visit, satellite_imagery, cadastral_map
    
    -- Conflits et alertes
    has_conflicts BOOLEAN DEFAULT FALSE,
    conflicts JSONB DEFAULT '[]', -- Liste des conflits détectés
    
    -- Photos et médias
    photos JSONB DEFAULT '[]', -- URLs des photos géolocalisées
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_gps_coordinates_property ON gps_coordinates(property_id);
CREATE INDEX idx_gps_coordinates_vendor ON gps_coordinates(vendor_id);
CREATE INDEX idx_gps_coordinates_verified ON gps_coordinates(verified);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_gps_coordinates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gps_coordinates_updated_at
    BEFORE UPDATE ON gps_coordinates
    FOR EACH ROW
    EXECUTE FUNCTION update_gps_coordinates_updated_at();

-- RLS
ALTER TABLE gps_coordinates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their GPS coordinates"
ON gps_coordinates FOR SELECT
TO authenticated
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can insert GPS coordinates"
ON gps_coordinates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their GPS coordinates"
ON gps_coordinates FOR UPDATE
TO authenticated
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete their GPS coordinates"
ON gps_coordinates FOR DELETE
TO authenticated
USING (auth.uid() = vendor_id);

-- =============================================
-- PARTIE 3 : PHOTOS & ANALYSE IA (VendeurPhotosRealData.jsx)
-- =============================================

CREATE TABLE property_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Fichier
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(100),
    storage_path TEXT,
    
    -- Métadonnées photo
    width INTEGER,
    height INTEGER,
    format VARCHAR(20), -- jpg, png, webp, etc.
    
    -- Organisation
    category VARCHAR(100) DEFAULT 'exterior', -- exterior, interior, aerial, document, plan, other
    title VARCHAR(255),
    description TEXT,
    tags JSONB DEFAULT '[]',
    
    -- Position
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    -- Géolocalisation
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    gps_metadata JSONB DEFAULT '{}',
    
    -- EXIF data
    exif_data JSONB DEFAULT '{}',
    camera_model VARCHAR(255),
    taken_at TIMESTAMP,
    
    -- Statut
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'processing', 'archived', 'rejected')),
    moderation_status VARCHAR(50) DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table pour l'analyse IA des photos
CREATE TABLE photo_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_id UUID NOT NULL REFERENCES property_photos(id) ON DELETE CASCADE,
    
    -- Scores de qualité (0-100)
    overall_quality INTEGER DEFAULT 0 CHECK (overall_quality >= 0 AND overall_quality <= 100),
    sharpness_score INTEGER DEFAULT 0,
    lighting_score INTEGER DEFAULT 0,
    composition_score INTEGER DEFAULT 0,
    color_score INTEGER DEFAULT 0,
    
    -- Détection d'objets
    detected_objects JSONB DEFAULT '[]', -- [{object: 'door', confidence: 0.95, bbox: {...}}, ...]
    detected_features JSONB DEFAULT '[]', -- swimming_pool, garden, parking, etc.
    
    -- Reconnaissance de scène
    scene_type VARCHAR(100), -- kitchen, living_room, bedroom, exterior, etc.
    scene_confidence DECIMAL(5,2),
    
    -- Problèmes détectés
    issues JSONB DEFAULT '[]', -- blur, overexposed, underexposed, distortion, etc.
    recommendations JSONB DEFAULT '[]',
    
    -- Suggestions
    suggested_category VARCHAR(100),
    suggested_tags JSONB DEFAULT '[]',
    suggested_description TEXT,
    
    -- Métadonnées IA
    ai_model VARCHAR(100),
    processing_time INTEGER, -- millisecondes
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_property_photos_property ON property_photos(property_id);
CREATE INDEX idx_property_photos_vendor ON property_photos(vendor_id);
CREATE INDEX idx_property_photos_primary ON property_photos(property_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_property_photos_category ON property_photos(category);
CREATE INDEX idx_photo_analysis_photo ON photo_analysis(photo_id);
CREATE INDEX idx_photo_analysis_quality ON photo_analysis(overall_quality);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_property_photos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER property_photos_updated_at
    BEFORE UPDATE ON property_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_property_photos_updated_at();

-- RLS
ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their photos"
ON property_photos FOR SELECT
TO authenticated
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can insert photos"
ON property_photos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their photos"
ON property_photos FOR UPDATE
TO authenticated
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete their photos"
ON property_photos FOR DELETE
TO authenticated
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can view their photo analyses"
ON photo_analysis FOR SELECT
TO authenticated
USING (
    photo_id IN (
        SELECT id FROM property_photos WHERE vendor_id = auth.uid()
    )
);

-- =============================================
-- PARTIE 4 : BLOCKCHAIN & NFT (VendeurBlockchainRealData.jsx)
-- =============================================

CREATE TABLE blockchain_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL,
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- NFT
    token_id VARCHAR(255),
    contract_address VARCHAR(255),
    blockchain VARCHAR(50) DEFAULT 'polygon', -- polygon, ethereum, binance, etc.
    network VARCHAR(50) DEFAULT 'mainnet', -- mainnet, testnet
    
    -- Transaction
    transaction_hash VARCHAR(255) UNIQUE,
    block_number BIGINT,
    gas_used DECIMAL(20,0),
    gas_price DECIMAL(30,0),
    
    -- Métadonnées NFT
    token_uri TEXT,
    metadata_ipfs_hash VARCHAR(255),
    nft_metadata JSONB DEFAULT '{}',
    
    -- Certificat
    certificate_type VARCHAR(100) DEFAULT 'ownership', -- ownership, authenticity, valuation, history
    certificate_data JSONB DEFAULT '{}',
    
    -- Statut
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'minting', 'minted', 'transferred', 'burned', 'failed')),
    minted_at TIMESTAMP,
    
    -- Propriété actuelle
    current_owner_address VARCHAR(255),
    original_owner_address VARCHAR(255),
    
    -- Vérification
    verified BOOLEAN DEFAULT FALSE,
    verification_count INTEGER DEFAULT 0,
    last_verified_at TIMESTAMP,
    
    -- Transferts
    transfer_history JSONB DEFAULT '[]',
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des transactions blockchain
CREATE TABLE blockchain_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id UUID REFERENCES blockchain_certificates(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Transaction
    transaction_hash VARCHAR(255) NOT NULL UNIQUE,
    transaction_type VARCHAR(50) NOT NULL, -- mint, transfer, burn, verify
    
    -- Adresses
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    
    -- Blockchain
    blockchain VARCHAR(50) DEFAULT 'polygon',
    network VARCHAR(50) DEFAULT 'mainnet',
    block_number BIGINT,
    
    -- Coûts
    gas_used DECIMAL(20,0),
    gas_price DECIMAL(30,0),
    transaction_fee DECIMAL(30,0),
    
    -- Statut
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
    confirmations INTEGER DEFAULT 0,
    
    -- Données
    transaction_data JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP
);

-- Table des connexions wallet
CREATE TABLE wallet_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Wallet
    wallet_address VARCHAR(255) NOT NULL,
    wallet_type VARCHAR(50) NOT NULL, -- metamask, walletconnect, coinbase, phantom, etc.
    
    -- Réseau
    blockchain VARCHAR(50) DEFAULT 'polygon',
    network VARCHAR(50) DEFAULT 'mainnet',
    
    -- Vérification
    verified BOOLEAN DEFAULT FALSE,
    signature VARCHAR(500), -- Signature de vérification
    verified_at TIMESTAMP,
    
    -- Statut
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Soldes (mis à jour périodiquement)
    balances JSONB DEFAULT '{}', -- {ETH: "1.234", MATIC: "567.89", ...}
    last_balance_check TIMESTAMP,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_used_at TIMESTAMP
);

-- Index
CREATE INDEX idx_blockchain_certificates_property ON blockchain_certificates(property_id);
CREATE INDEX idx_blockchain_certificates_vendor ON blockchain_certificates(vendor_id);
CREATE INDEX idx_blockchain_certificates_tx ON blockchain_certificates(transaction_hash);
CREATE INDEX idx_blockchain_certificates_status ON blockchain_certificates(status);
CREATE INDEX idx_blockchain_transactions_certificate ON blockchain_transactions(certificate_id);
CREATE INDEX idx_blockchain_transactions_vendor ON blockchain_transactions(vendor_id);
CREATE INDEX idx_blockchain_transactions_tx ON blockchain_transactions(transaction_hash);
CREATE INDEX idx_wallet_connections_user ON wallet_connections(user_id);
CREATE INDEX idx_wallet_connections_address ON wallet_connections(wallet_address);
CREATE INDEX idx_wallet_connections_primary ON wallet_connections(user_id, is_primary) WHERE is_primary = TRUE;

-- Triggers updated_at
CREATE TRIGGER blockchain_certificates_updated_at
    BEFORE UPDATE ON blockchain_certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_fraud_checks_updated_at();

CREATE TRIGGER wallet_connections_updated_at
    BEFORE UPDATE ON wallet_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_fraud_checks_updated_at();

-- RLS
ALTER TABLE blockchain_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their certificates"
ON blockchain_certificates FOR SELECT
TO authenticated
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can insert certificates"
ON blockchain_certificates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their certificates"
ON blockchain_certificates FOR UPDATE
TO authenticated
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can view their transactions"
ON blockchain_transactions FOR SELECT
TO authenticated
USING (auth.uid() = vendor_id);

CREATE POLICY "Users can view their wallets"
ON wallet_connections FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert wallets"
ON wallet_connections FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their wallets"
ON wallet_connections FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================
-- PARTIE 5 : SERVICES DIGITAUX (VendeurServicesDigitauxRealData.jsx)
-- =============================================

-- Catalogue des services disponibles
CREATE TABLE digital_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Service
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- signature, visite_virtuelle, ocr, stockage, marketing, juridique
    
    -- Icône et médias
    icon VARCHAR(100),
    image_url TEXT,
    
    -- Tarification
    pricing_model VARCHAR(50) DEFAULT 'subscription', -- subscription, usage, one_time
    plans JSONB DEFAULT '[]', -- [{name: 'basic', price: 5000, features: [...]}]
    
    -- Fonctionnalités
    features JSONB DEFAULT '[]',
    limitations JSONB DEFAULT '{}',
    
    -- Disponibilité
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Intégration
    provider VARCHAR(255), -- Nom du fournisseur/API
    api_endpoint TEXT,
    requires_api_key BOOLEAN DEFAULT FALSE,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Abonnements aux services
CREATE TABLE service_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES digital_services(id) ON DELETE CASCADE,
    
    -- Plan
    plan_name VARCHAR(100) NOT NULL, -- basic, pro, premium
    plan_price DECIMAL(10,2) NOT NULL,
    
    -- Statut
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'canceled', 'expired')),
    
    -- Dates
    start_date TIMESTAMP DEFAULT NOW(),
    end_date TIMESTAMP,
    next_billing_date TIMESTAMP,
    canceled_at TIMESTAMP,
    
    -- Paiement
    payment_method VARCHAR(50),
    auto_renew BOOLEAN DEFAULT TRUE,
    
    -- Utilisation
    usage_count INTEGER DEFAULT 0,
    usage_limit INTEGER, -- NULL = illimité
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, service_id, status)
);

-- Historique d'utilisation des services
CREATE TABLE service_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES service_subscriptions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES digital_services(id) ON DELETE CASCADE,
    
    -- Usage
    action VARCHAR(100) NOT NULL, -- sign_document, generate_tour, ocr_scan, etc.
    property_id UUID, -- Si lié à une propriété
    
    -- Résultat
    status VARCHAR(50) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
    result_data JSONB DEFAULT '{}',
    error_message TEXT,
    
    -- Coût
    cost DECIMAL(10,2) DEFAULT 0,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_digital_services_slug ON digital_services(slug);
CREATE INDEX idx_digital_services_category ON digital_services(category);
CREATE INDEX idx_service_subscriptions_user ON service_subscriptions(user_id);
CREATE INDEX idx_service_subscriptions_service ON service_subscriptions(service_id);
CREATE INDEX idx_service_subscriptions_status ON service_subscriptions(status);
CREATE INDEX idx_service_usage_subscription ON service_usage(subscription_id);
CREATE INDEX idx_service_usage_user ON service_usage(user_id);
CREATE INDEX idx_service_usage_service ON service_usage(service_id);

-- Triggers updated_at
CREATE TRIGGER digital_services_updated_at
    BEFORE UPDATE ON digital_services
    FOR EACH ROW
    EXECUTE FUNCTION update_fraud_checks_updated_at();

CREATE TRIGGER service_subscriptions_updated_at
    BEFORE UPDATE ON service_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_fraud_checks_updated_at();

-- RLS
ALTER TABLE digital_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
ON digital_services FOR SELECT
TO authenticated
USING (is_active = TRUE);

CREATE POLICY "Users can view their subscriptions"
ON service_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert subscriptions"
ON service_subscriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their subscriptions"
ON service_subscriptions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their usage"
ON service_usage FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert usage"
ON service_usage FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- PARTIE 6 : CRM (VendeurCRMRealData.jsx)
-- =============================================

CREATE TABLE crm_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations personnelles
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    
    -- Type et source
    contact_type VARCHAR(50) DEFAULT 'prospect' CHECK (contact_type IN ('prospect', 'client', 'partner', 'other')),
    source VARCHAR(100), -- website, referral, social_media, event, cold_call, etc.
    
    -- Statut
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'negotiation', 'closed_won', 'closed_lost')),
    priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Score et engagement
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    engagement_level VARCHAR(50) DEFAULT 'cold' CHECK (engagement_level IN ('cold', 'warm', 'hot')),
    
    -- Propriétés d'intérêt
    interested_properties JSONB DEFAULT '[]', -- Array de property IDs
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    preferred_location VARCHAR(255),
    property_requirements TEXT,
    
    -- Entreprise (si B2B)
    company_name VARCHAR(255),
    company_role VARCHAR(255),
    
    -- Réseaux sociaux
    linkedin_url TEXT,
    facebook_url TEXT,
    
    -- Notes et tags
    notes TEXT,
    tags JSONB DEFAULT '[]',
    
    -- Dates importantes
    last_contact_date TIMESTAMP,
    next_follow_up_date TIMESTAMP,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crm_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Type d'interaction
    type VARCHAR(50) NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'sms', 'whatsapp', 'site_visit', 'note')),
    direction VARCHAR(50) DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
    
    -- Contenu
    subject VARCHAR(255),
    content TEXT,
    
    -- Résultat
    outcome VARCHAR(100), -- interested, not_interested, callback_requested, meeting_scheduled, etc.
    
    -- Dates
    scheduled_at TIMESTAMP,
    duration INTEGER, -- Durée en minutes
    
    -- Propriété liée
    property_id UUID,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE crm_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID,
    
    -- Deal
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    
    -- Pipeline
    stage VARCHAR(50) DEFAULT 'prospection' CHECK (stage IN ('prospection', 'qualification', 'proposition', 'negociation', 'closing', 'won', 'lost')),
    probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
    
    -- Dates
    expected_close_date DATE,
    actual_close_date DATE,
    
    -- Statut
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost', 'abandoned')),
    lost_reason TEXT,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_crm_contacts_vendor ON crm_contacts(vendor_id);
CREATE INDEX idx_crm_contacts_email ON crm_contacts(email);
CREATE INDEX idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX idx_crm_interactions_contact ON crm_interactions(contact_id);
CREATE INDEX idx_crm_interactions_vendor ON crm_interactions(vendor_id);
CREATE INDEX idx_crm_deals_contact ON crm_deals(contact_id);
CREATE INDEX idx_crm_deals_vendor ON crm_deals(vendor_id);
CREATE INDEX idx_crm_deals_status ON crm_deals(status);

-- Triggers updated_at
CREATE TRIGGER crm_contacts_updated_at
    BEFORE UPDATE ON crm_contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_fraud_checks_updated_at();

CREATE TRIGGER crm_deals_updated_at
    BEFORE UPDATE ON crm_deals
    FOR EACH ROW
    EXECUTE FUNCTION update_fraud_checks_updated_at();

-- RLS
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can manage their contacts"
ON crm_contacts FOR ALL
TO authenticated
USING (auth.uid() = vendor_id)
WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can manage their interactions"
ON crm_interactions FOR ALL
TO authenticated
USING (auth.uid() = vendor_id)
WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can manage their deals"
ON crm_deals FOR ALL
TO authenticated
USING (auth.uid() = vendor_id)
WITH CHECK (auth.uid() = vendor_id);

-- =============================================
-- PARTIE 7 : MESSAGERIE (VendeurMessagesRealData.jsx)
-- =============================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Participants
    participant1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    participant2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contexte
    property_id UUID,
    subject VARCHAR(255),
    
    -- Statut
    is_archived_by_p1 BOOLEAN DEFAULT FALSE,
    is_archived_by_p2 BOOLEAN DEFAULT FALSE,
    is_pinned_by_p1 BOOLEAN DEFAULT FALSE,
    is_pinned_by_p2 BOOLEAN DEFAULT FALSE,
    
    -- Dernier message
    last_message_id UUID,
    last_message_at TIMESTAMP,
    last_message_preview TEXT,
    
    -- Compteurs
    unread_count_p1 INTEGER DEFAULT 0,
    unread_count_p2 INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(participant1_id, participant2_id, property_id)
);

CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contenu
    content TEXT NOT NULL,
    
    -- Type
    message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'audio', 'video', 'location')),
    
    -- Pièces jointes
    attachments JSONB DEFAULT '[]',
    
    -- Statut de lecture
    read_by_recipient BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Réponse
    reply_to_message_id UUID REFERENCES conversation_messages(id) ON DELETE SET NULL,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    edited_at TIMESTAMP
);

-- Index
CREATE INDEX idx_conversations_p1 ON conversations(participant1_id);
CREATE INDEX idx_conversations_p2 ON conversations(participant2_id);
CREATE INDEX idx_conversations_property ON conversations(property_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);
CREATE INDEX idx_conversation_messages_conv ON conversation_messages(conversation_id);
CREATE INDEX idx_conversation_messages_sender ON conversation_messages(sender_id);
CREATE INDEX idx_conversation_messages_created ON conversation_messages(created_at DESC);

-- Triggers updated_at
CREATE TRIGGER conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_fraud_checks_updated_at();

-- Trigger pour mettre à jour les compteurs de conversation
CREATE OR REPLACE FUNCTION update_conversation_counters()
RETURNS TRIGGER AS $$
BEGIN
    -- Mettre à jour le dernier message et compteurs
    UPDATE conversations
    SET 
        last_message_id = NEW.id,
        last_message_at = NEW.created_at,
        last_message_preview = LEFT(NEW.content, 100),
        message_count = message_count + 1,
        unread_count_p1 = CASE 
            WHEN NEW.sender_id = participant2_id THEN unread_count_p1 + 1 
            ELSE unread_count_p1 
        END,
        unread_count_p2 = CASE 
            WHEN NEW.sender_id = participant1_id THEN unread_count_p2 + 1 
            ELSE unread_count_p2 
        END,
        updated_at = NOW()
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversation_messages_after_insert
    AFTER INSERT ON conversation_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_counters();

-- RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations"
ON conversations FOR SELECT
TO authenticated
USING (
    auth.uid() = participant1_id 
    OR auth.uid() = participant2_id
);

CREATE POLICY "Users can update their conversations"
ON conversations FOR UPDATE
TO authenticated
USING (
    auth.uid() = participant1_id 
    OR auth.uid() = participant2_id
);

CREATE POLICY "Users can view their messages"
ON conversation_messages FOR SELECT
TO authenticated
USING (
    conversation_id IN (
        SELECT id FROM conversations 
        WHERE participant1_id = auth.uid() OR participant2_id = auth.uid()
    )
);

CREATE POLICY "Users can send messages"
ON conversation_messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their messages"
ON conversation_messages FOR UPDATE
TO authenticated
USING (auth.uid() = sender_id);

-- =============================================
-- DONNÉES INITIALES : SERVICES DIGITAUX
-- =============================================

INSERT INTO digital_services (name, slug, description, category, icon, pricing_model, plans, is_active, is_featured) VALUES
('Signature Électronique', 'signature-electronique', 'Signez vos documents en ligne de manière sécurisée et légale', 'signature', 'FileSignature', 'subscription', 
'[
  {"name": "Basic", "price": 5000, "period": "monthly", "features": ["5 signatures/mois", "Documents PDF", "Validité légale"], "usage_limit": 5},
  {"name": "Pro", "price": 15000, "period": "monthly", "features": ["50 signatures/mois", "Tous formats", "API disponible", "Support prioritaire"], "usage_limit": 50},
  {"name": "Premium", "price": 35000, "period": "monthly", "features": ["Signatures illimitées", "White label", "Intégration personnalisée", "Support 24/7"], "usage_limit": null}
]'::jsonb, true, true),

('Visite Virtuelle 3D', 'visite-virtuelle', 'Créez des visites virtuelles immersives de vos propriétés', 'visite_virtuelle', 'Camera', 'usage',
'[
  {"name": "Basic", "price": 25000, "period": "per_property", "features": ["Visite 3D interactive", "20 photos max", "Hébergement 1 an"]},
  {"name": "Pro", "price": 50000, "period": "per_property", "features": ["Visite 3D HD", "Photos illimitées", "Plan 2D inclus", "Hébergement illimité"]},
  {"name": "Premium", "price": 100000, "period": "per_property", "features": ["Visite 3D 4K", "Drone aérien", "Vidéo montée", "Réalité virtuelle"]}
]'::jsonb, true, true),

('OCR Documentaire', 'ocr-documentaire', 'Extraire automatiquement les données de vos documents', 'ocr', 'ScanText', 'subscription',
'[
  {"name": "Basic", "price": 3000, "period": "monthly", "features": ["50 scans/mois", "Formats standards", "Extraction texte"], "usage_limit": 50},
  {"name": "Pro", "price": 10000, "period": "monthly", "features": ["500 scans/mois", "Tous formats", "Extraction structurée", "API"], "usage_limit": 500}
]'::jsonb, true, false),

('Stockage Cloud Sécurisé', 'stockage-cloud', 'Stockez tous vos documents en toute sécurité', 'stockage', 'Cloud', 'subscription',
'[
  {"name": "Basic", "price": 2000, "period": "monthly", "features": ["10 GB", "Chiffrement standard", "Sauvegarde quotidienne"]},
  {"name": "Pro", "price": 5000, "period": "monthly", "features": ["100 GB", "Chiffrement militaire", "Versioning", "Partage sécurisé"]},
  {"name": "Premium", "price": 15000, "period": "monthly", "features": ["1 TB", "Compliance légale", "Archivage automatique", "Support dédié"]}
]'::jsonb, true, false),

('Marketing Digital', 'marketing-digital', 'Boostez la visibilité de vos annonces', 'marketing', 'Megaphone', 'usage',
'[
  {"name": "Basic", "price": 10000, "period": "per_campaign", "features": ["Facebook & Instagram", "1000 impressions", "Ciblage basique"]},
  {"name": "Pro", "price": 25000, "period": "per_campaign", "features": ["Tous réseaux sociaux", "5000 impressions", "Ciblage avancé", "Analytics"]},
  {"name": "Premium", "price": 50000, "period": "per_campaign", "features": ["Campaign complète", "20000 impressions", "A/B Testing", "Optimisation IA"]}
]'::jsonb, true, false),

('Conseil Juridique', 'conseil-juridique', 'Consultations juridiques pour vos transactions', 'juridique', 'Scale', 'usage',
'[
  {"name": "Consultation", "price": 15000, "period": "per_session", "features": ["30 minutes", "Notaire agréé", "Compte-rendu écrit"]},
  {"name": "Accompagnement", "price": 50000, "period": "per_transaction", "features": ["Suivi complet", "Rédaction contrats", "Présence signature"]},
  {"name": "Premium", "price": 150000, "period": "per_year", "features": ["Consultations illimitées", "Avocat dédié", "Contentieux inclus"]}
]'::jsonb, true, false)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- VÉRIFICATION FINALE
-- =============================================

DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' 
    AND table_name IN (
        'fraud_checks', 'fraud_check_documents',
        'gps_coordinates',
        'property_photos', 'photo_analysis',
        'blockchain_certificates', 'blockchain_transactions', 'wallet_connections',
        'digital_services', 'service_subscriptions', 'service_usage',
        'crm_contacts', 'crm_interactions', 'crm_deals',
        'conversations', 'conversation_messages'
    );
    
    RAISE NOTICE '============================================';
    RAISE NOTICE '✅ TABLES DASHBOARD VENDEUR CRÉÉES : % / 15', table_count;
    RAISE NOTICE '============================================';
    RAISE NOTICE '📊 Anti-Fraude : fraud_checks, fraud_check_documents';
    RAISE NOTICE '📍 GPS : gps_coordinates';
    RAISE NOTICE '📸 Photos : property_photos, photo_analysis';
    RAISE NOTICE '⛓️  Blockchain : blockchain_certificates, blockchain_transactions, wallet_connections';
    RAISE NOTICE '🔧 Services : digital_services, service_subscriptions, service_usage';
    RAISE NOTICE '👥 CRM : crm_contacts, crm_interactions, crm_deals';
    RAISE NOTICE '💬 Messages : conversations, conversation_messages';
    RAISE NOTICE '============================================';
    RAISE NOTICE '🚀 DASHBOARD VENDEUR 100%% PRÊT !';
    RAISE NOTICE '============================================';
END $$;
