-- ====================================
-- TABLES DASHBOARD NOTAIRE - PRODUCTION
-- Système complet de gestion notariale
-- ====================================

-- 1. Actes notariés principaux
CREATE TABLE IF NOT EXISTS notarial_acts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    act_number VARCHAR(20) UNIQUE NOT NULL,
    act_type VARCHAR(50) NOT NULL CHECK (act_type IN (
        'vente_immobiliere', 'succession', 'donation', 'acte_propriete', 
        'hypotheque', 'servitude', 'partage', 'constitution_societe'
    )),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_description TEXT,
    property_address TEXT,
    property_value BIGINT,
    property_surface VARCHAR(50),
    notary_fees BIGINT DEFAULT 0,
    tax_amount BIGINT DEFAULT 0,
    total_amount BIGINT GENERATED ALWAYS AS (COALESCE(property_value, 0) + COALESCE(notary_fees, 0) + COALESCE(tax_amount, 0)) STORED,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN (
        'draft', 'draft_review', 'documentation', 'signature_pending', 
        'registration', 'completed', 'archived', 'rejected'
    )),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    parties JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estimated_completion TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    next_action TEXT,
    blockchain_hash VARCHAR(66),
    blockchain_verified BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    
    -- Metadata pour analytics
    estimated_duration_days INTEGER,
    actual_duration_days INTEGER,
    client_satisfaction INTEGER CHECK (client_satisfaction >= 1 AND client_satisfaction <= 5)
);

-- 2. Dossiers clients (cases)
CREATE TABLE IF NOT EXISTS notarial_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    case_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    case_type VARCHAR(50) NOT NULL,
    platform_ref VARCHAR(50), -- Référence vers transaction plateforme
    
    -- Parties impliquées
    client_buyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    client_seller_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    buyer_name VARCHAR(255),
    buyer_phone VARCHAR(20),
    buyer_email VARCHAR(255),
    seller_name VARCHAR(255),
    seller_phone VARCHAR(20),
    seller_email VARCHAR(255),
    
    -- Statut et suivi
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN (
        'open', 'in_progress', 'waiting_documents', 'waiting_signatures', 
        'completed', 'suspended', 'cancelled'
    )),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Dates importantes
    opened_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_date TIMESTAMP WITH TIME ZONE,
    
    -- Progression
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    next_action TEXT,
    
    -- Propriété concernée
    property_address TEXT,
    property_area VARCHAR(50),
    property_value BIGINT,
    
    -- Compteurs
    documents_count INTEGER DEFAULT 0,
    completed_documents INTEGER DEFAULT 0,
    
    -- Frais
    notary_fees BIGINT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Documents notariaux
CREATE TABLE IF NOT EXISTS notarial_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    act_id UUID REFERENCES notarial_acts(id) ON DELETE CASCADE,
    case_id UUID REFERENCES notarial_cases(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
        'titre_propriete', 'acte_vente', 'certificat_propriete', 
        'plan_cadastral', 'attestation_fiscale', 'piece_identite',
        'acte_deces', 'testament', 'certificat_heredite', 'autre'
    )),
    file_path TEXT,
    file_url TEXT,
    file_size BIGINT,
    file_type VARCHAR(10),
    
    -- Statuts
    status VARCHAR(50) DEFAULT 'uploaded' CHECK (status IN (
        'uploaded', 'pending_review', 'approved', 'rejected', 'authenticated'
    )),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_date TIMESTAMP WITH TIME ZONE,
    reviewer_id UUID REFERENCES profiles(id),
    
    -- Authentification
    authenticated BOOLEAN DEFAULT FALSE,
    authentication_date TIMESTAMP WITH TIME ZONE,
    blockchain_hash VARCHAR(66),
    verification_status VARCHAR(50) DEFAULT 'pending',
    
    -- Metadata
    uploaded_by UUID REFERENCES profiles(id),
    notes TEXT,
    required BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Communications tripartites (Notaire-Banque-Client)
CREATE TABLE IF NOT EXISTS tripartite_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES notarial_cases(id) ON DELETE CASCADE,
    thread_id UUID, -- Pour grouper les messages
    
    -- Participants
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    sender_type VARCHAR(20) CHECK (sender_type IN ('notaire', 'banque', 'client')),
    
    -- Recipients (peut être multiple)
    recipients JSONB DEFAULT '[]'::jsonb, -- [{id: uuid, type: 'notaire|banque|client', read: boolean}]
    
    -- Contenu
    subject VARCHAR(255),
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'message' CHECK (message_type IN (
        'message', 'information', 'request', 'approval', 'document_request', 
        'status_update', 'urgent'
    )),
    
    -- Statut
    status VARCHAR(50) DEFAULT 'sent',
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Fichiers joints
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Timestamps
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_by JSONB DEFAULT '{}'::jsonb, -- {user_id: timestamp}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CRM Clients notaire
CREATE TABLE IF NOT EXISTS clients_notaire (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Informations client
    client_type VARCHAR(50) CHECK (client_type IN (
        'particulier', 'entreprise', 'promoteur', 'investisseur', 'banque'
    )),
    company_name VARCHAR(255), -- Si entreprise
    
    -- Historique relationnel
    first_contact TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact TIMESTAMP WITH TIME ZONE,
    contact_frequency VARCHAR(20) DEFAULT 'occasional', -- occasional, regular, frequent
    
    -- Métriques business
    total_acts INTEGER DEFAULT 0,
    active_acts INTEGER DEFAULT 0,
    completed_acts INTEGER DEFAULT 0,
    total_revenue BIGINT DEFAULT 0,
    avg_act_value BIGINT DEFAULT 0,
    
    -- Satisfaction et relation
    satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
    client_rating VARCHAR(20) CHECK (client_rating IN ('excellent', 'tres_bien', 'bien', 'moyen', 'mauvais')),
    client_status VARCHAR(50) DEFAULT 'active' CHECK (client_status IN ('active', 'inactive', 'prospect', 'vip')),
    
    -- Notes et préférences
    notes TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    communication_preference VARCHAR(20) DEFAULT 'email', -- email, phone, sms, postal
    
    -- Metadata
    source VARCHAR(50), -- Comment le client a été acquis
    referral_source VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(notaire_id, client_id)
);

-- 6. Partenaires bancaires
CREATE TABLE IF NOT EXISTS banking_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Informations banque
    bank_name VARCHAR(255) NOT NULL,
    bank_code VARCHAR(10),
    bank_logo_url TEXT,
    
    -- Contact principal
    contact_person VARCHAR(255),
    contact_title VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Adresse
    address TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(10),
    
    -- Partenariat
    partnership_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    partnership_type VARCHAR(50) DEFAULT 'standard', -- standard, preferential, exclusive
    active BOOLEAN DEFAULT TRUE,
    
    -- Services
    services_offered TEXT[], -- Types de prêts et services
    loan_types JSONB DEFAULT '[]'::jsonb, -- Détails des types de prêts
    
    -- Conditions financières
    commission_rate DECIMAL(4,2),
    min_loan_amount BIGINT,
    max_loan_amount BIGINT,
    avg_processing_days INTEGER,
    
    -- Métriques
    total_referrals INTEGER DEFAULT 0,
    successful_loans INTEGER DEFAULT 0,
    success_rate DECIMAL(4,2),
    total_commission BIGINT DEFAULT 0,
    
    -- Notes
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Archives notariales
CREATE TABLE IF NOT EXISTS archived_acts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_act_id UUID, -- Référence à l'acte original (peut être supprimé)
    notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Identification unique
    archive_reference VARCHAR(50) UNIQUE NOT NULL,
    archive_number VARCHAR(20),
    
    -- Contenu archivé
    title VARCHAR(255) NOT NULL,
    act_type VARCHAR(50) NOT NULL,
    client_name VARCHAR(255),
    client_type VARCHAR(50),
    
    -- Dates importantes
    archive_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    original_date TIMESTAMP WITH TIME ZONE,
    archive_year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM archive_date)) STORED,
    
    -- Valeurs
    property_value BIGINT,
    notary_fees BIGINT,
    
    -- Classification
    confidentiality_level VARCHAR(20) DEFAULT 'standard' CHECK (
        confidentiality_level IN ('public', 'standard', 'confidential', 'secret')
    ),
    category VARCHAR(50),
    
    -- Stockage
    storage_location TEXT, -- Localisation physique ou numérique
    storage_format VARCHAR(20) DEFAULT 'digital', -- digital, physical, both
    
    -- Accès
    retrieval_count INTEGER DEFAULT 0,
    last_retrieved TIMESTAMP WITH TIME ZONE,
    retrieved_by UUID REFERENCES profiles(id),
    
    -- Métadonnées de recherche
    tags TEXT[] DEFAULT '{}',
    keywords TEXT,
    search_vector tsvector,
    
    -- Statut
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'destroyed', 'transferred')),
    retention_until TIMESTAMP WITH TIME ZONE, -- Date limite de conservation
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Authentification documents blockchain
CREATE TABLE IF NOT EXISTS document_authentication (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES notarial_documents(id) ON DELETE CASCADE,
    notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Méthode d'authentification
    authentication_method VARCHAR(50) DEFAULT 'blockchain' CHECK (
        authentication_method IN ('blockchain', 'digital_signature', 'timestamp', 'hybrid')
    ),
    
    -- Blockchain data
    blockchain_network VARCHAR(20) DEFAULT 'polygon',
    transaction_hash VARCHAR(66) UNIQUE,
    block_number BIGINT,
    block_timestamp TIMESTAMP WITH TIME ZONE,
    gas_used INTEGER,
    gas_price BIGINT,
    
    -- Coûts
    authentication_fee BIGINT DEFAULT 0,
    network_fee BIGINT DEFAULT 0,
    total_cost BIGINT GENERATED ALWAYS AS (COALESCE(authentication_fee, 0) + COALESCE(network_fee, 0)) STORED,
    
    -- Hash du document
    document_hash VARCHAR(64) NOT NULL,
    hash_algorithm VARCHAR(20) DEFAULT 'SHA256',
    
    -- Statut de vérification
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (
        verification_status IN ('pending', 'verified', 'failed', 'expired')
    ),
    
    -- Métadonnées
    authenticated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- IPFS (si utilisé)
    ipfs_hash VARCHAR(64),
    ipfs_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Conformité réglementaire
CREATE TABLE IF NOT EXISTS compliance_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    act_id UUID REFERENCES notarial_acts(id) ON DELETE CASCADE,
    case_id UUID REFERENCES notarial_cases(id) ON DELETE SET NULL,
    
    -- Type de vérification
    check_type VARCHAR(50) NOT NULL CHECK (check_type IN (
        'titre_verification', 'cadastral_check', 'tax_compliance', 
        'aml_check', 'identity_verification', 'legal_capacity',
        'property_rights', 'liens_charges'
    )),
    
    -- Statut
    check_status VARCHAR(50) DEFAULT 'pending' CHECK (check_status IN (
        'pending', 'in_progress', 'completed', 'failed', 'waived'
    )),
    
    -- Résultats
    compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
    issues_found INTEGER DEFAULT 0,
    critical_issues INTEGER DEFAULT 0,
    
    -- Détails
    checker_name VARCHAR(255),
    checking_authority VARCHAR(255),
    
    -- Dates
    check_initiated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checked_at TIMESTAMP WITH TIME ZONE,
    next_check_due TIMESTAMP WITH TIME ZONE,
    
    -- Résultats détaillés
    findings JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    remarks TEXT,
    
    -- Actions correctives
    corrective_actions JSONB DEFAULT '[]'::jsonb,
    action_deadline TIMESTAMP WITH TIME ZONE,
    actions_completed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Configuration notaire
CREATE TABLE IF NOT EXISTS notaire_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    
    -- Informations de l'étude
    office_name VARCHAR(255),
    office_address TEXT,
    office_phone VARCHAR(20),
    office_email VARCHAR(255),
    office_website TEXT,
    siret_number VARCHAR(20),
    
    -- Tarification
    hourly_rate BIGINT,
    vente_fee_rate DECIMAL(4,3) DEFAULT 0.015, -- 1.5%
    succession_fee_rate DECIMAL(4,3) DEFAULT 0.012, -- 1.2%
    donation_fee_rate DECIMAL(4,3) DEFAULT 0.010, -- 1.0%
    min_fee BIGINT DEFAULT 150000, -- 150k FCFA minimum
    max_fee BIGINT DEFAULT 5000000, -- 5M FCFA maximum
    
    -- Délais standards
    standard_delay_days INTEGER DEFAULT 30,
    urgent_delay_days INTEGER DEFAULT 15,
    complex_delay_days INTEGER DEFAULT 45,
    
    -- Intégrations
    sigmatis_integration BOOLEAN DEFAULT FALSE,
    sigmatis_api_key TEXT,
    blockchain_enabled BOOLEAN DEFAULT FALSE,
    blockchain_network VARCHAR(20) DEFAULT 'polygon',
    ai_assistant_enabled BOOLEAN DEFAULT TRUE,
    
    -- Préférences
    working_hours JSONB DEFAULT '{"start": "08:00", "end": "18:00", "days": [1,2,3,4,5]}'::jsonb,
    vacation_mode BOOLEAN DEFAULT FALSE,
    max_concurrent_cases INTEGER DEFAULT 50,
    
    -- Notifications
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    
    -- Sécurité
    require_2fa BOOLEAN DEFAULT FALSE,
    session_timeout INTEGER DEFAULT 480, -- 8 heures en minutes
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Analytics et métriques
CREATE TABLE IF NOT EXISTS notaire_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Période
    metric_date DATE DEFAULT CURRENT_DATE,
    metric_type VARCHAR(20) DEFAULT 'daily' CHECK (metric_type IN ('daily', 'weekly', 'monthly', 'yearly')),
    
    -- Métriques d'activité
    total_acts INTEGER DEFAULT 0,
    new_acts INTEGER DEFAULT 0,
    active_cases INTEGER DEFAULT 0,
    completed_acts INTEGER DEFAULT 0,
    cancelled_acts INTEGER DEFAULT 0,
    
    -- Métriques financières
    monthly_revenue BIGINT DEFAULT 0,
    fees_collected BIGINT DEFAULT 0,
    avg_act_value BIGINT DEFAULT 0,
    
    -- Métriques de performance
    avg_completion_days INTEGER,
    on_time_completion_rate DECIMAL(4,2),
    client_satisfaction DECIMAL(3,2), -- 4.5/5.0
    compliance_score INTEGER DEFAULT 100,
    
    -- Métriques clients
    new_clients INTEGER DEFAULT 0,
    active_clients INTEGER DEFAULT 0,
    client_retention_rate DECIMAL(4,2),
    
    -- Métriques techniques
    documents_authenticated INTEGER DEFAULT 0,
    blockchain_transactions INTEGER DEFAULT 0,
    ai_assistant_queries INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(notaire_id, metric_date, metric_type)
);

-- ====================================
-- INDEX POUR PERFORMANCE
-- ====================================

-- Index pour notarial_acts
CREATE INDEX IF NOT EXISTS idx_notarial_acts_notaire_id ON notarial_acts(notaire_id);
CREATE INDEX IF NOT EXISTS idx_notarial_acts_client_id ON notarial_acts(client_id);
CREATE INDEX IF NOT EXISTS idx_notarial_acts_status ON notarial_acts(status);
CREATE INDEX IF NOT EXISTS idx_notarial_acts_created_at ON notarial_acts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notarial_acts_act_number ON notarial_acts(act_number);

-- Index pour notarial_cases
CREATE INDEX IF NOT EXISTS idx_notarial_cases_notaire_id ON notarial_cases(notaire_id);
CREATE INDEX IF NOT EXISTS idx_notarial_cases_status ON notarial_cases(status);
CREATE INDEX IF NOT EXISTS idx_notarial_cases_opened_date ON notarial_cases(opened_date DESC);
CREATE INDEX IF NOT EXISTS idx_notarial_cases_case_number ON notarial_cases(case_number);

-- Index pour documents
CREATE INDEX IF NOT EXISTS idx_notarial_documents_act_id ON notarial_documents(act_id);
CREATE INDEX IF NOT EXISTS idx_notarial_documents_case_id ON notarial_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_notarial_documents_status ON notarial_documents(status);

-- Index pour communications
CREATE INDEX IF NOT EXISTS idx_tripartite_communications_case_id ON tripartite_communications(case_id);
CREATE INDEX IF NOT EXISTS idx_tripartite_communications_sender_id ON tripartite_communications(sender_id);
CREATE INDEX IF NOT EXISTS idx_tripartite_communications_sent_at ON tripartite_communications(sent_at DESC);

-- Index pour CRM
CREATE INDEX IF NOT EXISTS idx_clients_notaire_notaire_id ON clients_notaire(notaire_id);
CREATE INDEX IF NOT EXISTS idx_clients_notaire_client_id ON clients_notaire(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_notaire_status ON clients_notaire(client_status);

-- Index pour archives (avec recherche textuelle)
CREATE INDEX IF NOT EXISTS idx_archived_acts_notaire_id ON archived_acts(notaire_id);
CREATE INDEX IF NOT EXISTS idx_archived_acts_archive_year ON archived_acts(archive_year);
CREATE INDEX IF NOT EXISTS idx_archived_acts_search_vector ON archived_acts USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_archived_acts_tags ON archived_acts USING GIN(tags);

-- Index pour analytics
CREATE INDEX IF NOT EXISTS idx_notaire_analytics_notaire_id ON notaire_analytics(notaire_id);
CREATE INDEX IF NOT EXISTS idx_notaire_analytics_date ON notaire_analytics(metric_date DESC);

-- ====================================
-- TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- ====================================

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Application des triggers
CREATE OR REPLACE TRIGGER update_notarial_acts_updated_at BEFORE UPDATE ON notarial_acts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_notarial_cases_updated_at BEFORE UPDATE ON notarial_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_notarial_documents_updated_at BEFORE UPDATE ON notarial_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_clients_notaire_updated_at BEFORE UPDATE ON clients_notaire FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_banking_partners_updated_at BEFORE UPDATE ON banking_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_compliance_checks_updated_at BEFORE UPDATE ON compliance_checks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_notaire_settings_updated_at BEFORE UPDATE ON notaire_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour search_vector des archives
CREATE OR REPLACE FUNCTION update_archive_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('french', 
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(NEW.client_name, '') || ' ' ||
        COALESCE(NEW.keywords, '') || ' ' ||
        COALESCE(array_to_string(NEW.tags, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_archived_acts_search_vector 
    BEFORE INSERT OR UPDATE ON archived_acts 
    FOR EACH ROW EXECUTE FUNCTION update_archive_search_vector();

-- ====================================
-- ROW LEVEL SECURITY (RLS)
-- ====================================

-- Activer RLS sur toutes les tables
ALTER TABLE notarial_acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notarial_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE notarial_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tripartite_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients_notaire ENABLE ROW LEVEL SECURITY;
ALTER TABLE banking_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE archived_acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_authentication ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notaire_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notaire_analytics ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour notarial_acts
CREATE POLICY "Notaires voient leurs actes" ON notarial_acts
    FOR ALL USING (notaire_id = auth.uid());
    
CREATE POLICY "Clients voient leurs actes" ON notarial_acts
    FOR SELECT USING (client_id = auth.uid());

-- Politiques RLS pour notarial_cases
CREATE POLICY "Notaires voient leurs dossiers" ON notarial_cases
    FOR ALL USING (notaire_id = auth.uid());
    
CREATE POLICY "Clients voient leurs dossiers" ON notarial_cases
    FOR SELECT USING (client_buyer_id = auth.uid() OR client_seller_id = auth.uid());

-- Politiques RLS pour documents
CREATE POLICY "Accès documents via acte" ON notarial_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM notarial_acts na 
            WHERE na.id = notarial_documents.act_id 
            AND (na.notaire_id = auth.uid() OR na.client_id = auth.uid())
        )
    );

-- Politiques RLS pour communications
CREATE POLICY "Accès communications via case" ON tripartite_communications
    FOR ALL USING (
        sender_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM notarial_cases nc 
            WHERE nc.id = tripartite_communications.case_id 
            AND (nc.notaire_id = auth.uid() OR nc.client_buyer_id = auth.uid() OR nc.client_seller_id = auth.uid())
        )
    );

-- Politiques RLS pour CRM (notaires seulement)
CREATE POLICY "Notaires voient leur CRM" ON clients_notaire
    FOR ALL USING (notaire_id = auth.uid());

-- Politiques RLS pour partenaires bancaires (notaires seulement)
CREATE POLICY "Notaires voient leurs partenaires" ON banking_partners
    FOR ALL USING (notaire_id = auth.uid());

-- Politiques RLS pour archives (notaires seulement)
CREATE POLICY "Notaires voient leurs archives" ON archived_acts
    FOR ALL USING (notaire_id = auth.uid());

-- Politiques RLS pour authentification documents
CREATE POLICY "Accès authentification via notaire" ON document_authentication
    FOR ALL USING (notaire_id = auth.uid());

-- Politiques RLS pour conformité
CREATE POLICY "Notaires voient leur conformité" ON compliance_checks
    FOR ALL USING (notaire_id = auth.uid());

-- Politiques RLS pour settings (notaires seulement)
CREATE POLICY "Notaires voient leurs paramètres" ON notaire_settings
    FOR ALL USING (notaire_id = auth.uid());

-- Politiques RLS pour analytics (notaires seulement)
CREATE POLICY "Notaires voient leurs analytics" ON notaire_analytics
    FOR ALL USING (notaire_id = auth.uid());

-- ====================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ====================================

-- Fonction pour générer des numéros d'acte automatiques
CREATE OR REPLACE FUNCTION generate_act_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
    sequence_part TEXT;
    result TEXT;
BEGIN
    -- Trouver le prochain numéro de séquence pour l'année
    SELECT LPAD((COALESCE(MAX(CAST(SUBSTRING(act_number FROM 6) AS INTEGER)), 0) + 1)::TEXT, 3, '0')
    INTO sequence_part
    FROM notarial_acts 
    WHERE act_number LIKE year_part || '-%';
    
    result := year_part || '-' || sequence_part;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour générer des numéros de dossier automatiques
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TEXT AS $$
DECLARE
    year_part TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
    month_part TEXT := LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0');
    sequence_part TEXT;
    result TEXT;
BEGIN
    SELECT LPAD((COALESCE(MAX(CAST(SUBSTRING(case_number FROM 9) AS INTEGER)), 0) + 1)::TEXT, 3, '0')
    INTO sequence_part
    FROM notarial_cases 
    WHERE case_number LIKE 'CASE-' || year_part || month_part || '-%';
    
    result := 'CASE-' || year_part || month_part || '-' || sequence_part;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- VUES UTILES POUR LE DASHBOARD
-- ====================================

-- Vue des statistiques notaire
CREATE OR REPLACE VIEW notaire_dashboard_stats AS
SELECT 
    n.notaire_id,
    COUNT(na.id) as total_acts,
    COUNT(CASE WHEN na.status IN ('draft', 'draft_review', 'documentation', 'signature_pending') THEN 1 END) as active_cases,
    COUNT(CASE WHEN na.status = 'completed' THEN 1 END) as completed_acts,
    SUM(CASE WHEN na.status = 'completed' THEN na.notary_fees ELSE 0 END) as monthly_revenue,
    COUNT(DISTINCT na.client_id) as unique_clients,
    AVG(CASE WHEN na.status = 'completed' AND na.actual_duration_days IS NOT NULL THEN na.actual_duration_days END) as avg_completion_days,
    AVG(CASE WHEN na.client_satisfaction IS NOT NULL THEN na.client_satisfaction::DECIMAL END) as avg_satisfaction,
    COUNT(CASE WHEN da.verification_status = 'verified' THEN 1 END) as documents_authenticated
FROM notaire_settings n
LEFT JOIN notarial_acts na ON n.notaire_id = na.notaire_id 
    AND na.created_at >= DATE_TRUNC('month', CURRENT_DATE)
LEFT JOIN document_authentication da ON na.id = da.document_id
GROUP BY n.notaire_id;

COMMENT ON SCHEMA public IS 'Tables dashboard notaire - Système complet de gestion notariale pour Teranga Foncier';