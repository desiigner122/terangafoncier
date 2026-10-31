-- ============================================
-- CRÉATION DES TABLES ESSENTIELLES
-- ============================================
-- Date: 11 octobre 2025
-- Objectif: Créer toutes les tables nécessaires pour remplacer les données mockées
-- ============================================

-- ================================================
-- TABLE 1: PROPERTIES (Propriétés Immobilières)
-- ================================================

CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Propriétaire
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Informations générales
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT NOT NULL, -- 'terrain', 'villa', 'appartement', 'immeuble', 'bureau', 'commerce'
    status TEXT DEFAULT 'disponible', -- 'disponible', 'en_negociation', 'vendu', 'loue', 'retire'
    
    -- Prix et surface
    price NUMERIC NOT NULL,
    surface NUMERIC NOT NULL, -- m²
    price_per_sqm NUMERIC GENERATED ALWAYS AS (price / NULLIF(surface, 0)) STORED,
    
    -- Localisation
    location TEXT NOT NULL,
    address TEXT,
    city TEXT,
    region TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    
    -- Caractéristiques
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    floors INTEGER DEFAULT 1,
    parking_spaces INTEGER DEFAULT 0,
    year_built INTEGER,
    condition TEXT, -- 'neuf', 'excellent', 'bon', 'a_renover'
    
    -- Features et équipements
    features TEXT[], -- ['piscine', 'jardin', 'garage', 'climatisation', 'securite']
    amenities TEXT[], -- ['ecole', 'hopital', 'supermarche', 'transport']
    
    -- Médias
    images TEXT[], -- URLs des images
    videos TEXT[], -- URLs des vidéos
    virtual_tour_url TEXT,
    main_image TEXT, -- URL de l'image principale
    
    -- Blockchain & AI
    blockchain_verified BOOLEAN DEFAULT false,
    blockchain_hash TEXT,
    blockchain_network TEXT, -- 'ethereum', 'polygon'
    blockchain_verified_at TIMESTAMPTZ,
    ai_score NUMERIC, -- Score IA (0-100)
    ai_price_recommendation NUMERIC,
    ai_analysis JSONB, -- Analyse IA détaillée
    
    -- Statistiques
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    inquiries_count INTEGER DEFAULT 0,
    
    -- Documents administratifs
    has_titre_foncier BOOLEAN DEFAULT false,
    titre_foncier_number TEXT,
    has_permis_construire BOOLEAN DEFAULT false,
    permis_construire_number TEXT,
    
    -- SEO
    slug TEXT UNIQUE,
    meta_title TEXT,
    meta_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    sold_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

-- Index pour properties
CREATE INDEX idx_properties_owner ON public.properties(owner_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_created_at ON public.properties(created_at DESC);
CREATE INDEX idx_properties_location ON public.properties USING gin(to_tsvector('french', location || ' ' || COALESCE(address, '')));

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_updated_at();

-- ================================================
-- TABLE 2: OFFERS (Offres d'achat/vente)
-- ================================================

CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Références
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Montant de l'offre
    amount NUMERIC NOT NULL,
    initial_amount NUMERIC, -- Montant initial si contre-offre
    
    -- Statut
    status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'counter_offer', 'expired', 'withdrawn', 'completed'
    
    -- Message et conditions
    message TEXT,
    conditions TEXT,
    financing_type TEXT, -- 'cash', 'mortgage', 'mixed'
    
    -- Dates
    expires_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    rejected_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Notes
    buyer_notes TEXT,
    seller_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour offers
CREATE INDEX idx_offers_property ON public.offers(property_id);
CREATE INDEX idx_offers_buyer ON public.offers(buyer_id);
CREATE INDEX idx_offers_seller ON public.offers(seller_id);
CREATE INDEX idx_offers_status ON public.offers(status);
CREATE INDEX idx_offers_created_at ON public.offers(created_at DESC);

-- Trigger pour updated_at
CREATE TRIGGER trigger_update_offers_updated_at
    BEFORE UPDATE ON public.offers
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_updated_at();

-- ================================================
-- TABLE 3: DOCUMENTS (Documents administratifs)
-- ================================================

CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Références
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Type de document
    document_type TEXT NOT NULL, -- 'titre_foncier', 'permis_construire', 'cadastre', 'contrat', 'facture', 'certificat'
    category TEXT, -- 'legal', 'technical', 'financial', 'administrative'
    
    -- Informations
    title TEXT NOT NULL,
    description TEXT,
    document_number TEXT,
    
    -- Fichier
    file_url TEXT NOT NULL,
    file_name TEXT,
    file_size BIGINT,
    mime_type TEXT,
    
    -- Vérification
    status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'expired'
    verified_by UUID REFERENCES public.profiles(id),
    verified_at TIMESTAMPTZ,
    verification_notes TEXT,
    
    -- Dates importantes
    issue_date DATE,
    expiry_date DATE,
    
    -- Sécurité
    is_confidential BOOLEAN DEFAULT false,
    password_protected BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Index pour documents
CREATE INDEX idx_documents_property ON public.documents(property_id);
CREATE INDEX idx_documents_owner ON public.documents(owner_id);
CREATE INDEX idx_documents_type ON public.documents(document_type);
CREATE INDEX idx_documents_status ON public.documents(status);
CREATE INDEX idx_documents_created_at ON public.documents(created_at DESC);

-- Trigger pour updated_at
CREATE TRIGGER trigger_update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_updated_at();

-- ================================================
-- TABLE 4: NOTIFICATIONS (Notifications utilisateurs)
-- ================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Destinataire
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Type et priorité
    type TEXT NOT NULL, -- 'offer', 'document', 'message', 'system', 'alert', 'reminder'
    priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    
    -- Contenu
    title TEXT NOT NULL,
    message TEXT,
    icon TEXT, -- Nom de l'icône
    color TEXT, -- Couleur de la notification
    
    -- Données additionnelles
    data JSONB, -- Données structurées (property_id, offer_id, etc.)
    action_url TEXT, -- URL vers laquelle rediriger
    
    -- État
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    archived BOOLEAN DEFAULT false,
    archived_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Index pour notifications
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_type ON public.notifications(type);

-- ================================================
-- TABLE 5: CONVERSATIONS (Messagerie)
-- ================================================

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Participants
    participant_1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    participant_2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Contexte
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    subject TEXT,
    
    -- Dernier message
    last_message_at TIMESTAMPTZ,
    last_message_preview TEXT,
    
    -- État
    archived_by_1 BOOLEAN DEFAULT false,
    archived_by_2 BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(participant_1_id, participant_2_id, property_id)
);

-- Index pour conversations
CREATE INDEX idx_conversations_participant1 ON public.conversations(participant_1_id);
CREATE INDEX idx_conversations_participant2 ON public.conversations(participant_2_id);
CREATE INDEX idx_conversations_property ON public.conversations(property_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- ================================================
-- TABLE 6: MESSAGES (Messages)
-- ================================================

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Conversation
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    
    -- Expéditeur/Destinataire
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Contenu
    content TEXT NOT NULL,
    attachments TEXT[], -- URLs des fichiers joints
    
    -- État
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    edited_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

-- Index pour messages
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_read ON public.messages(read);

-- ================================================
-- TABLE 7: TRANSACTIONS (Transactions immobilières)
-- ================================================

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Références
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES public.offers(id),
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    notaire_id UUID REFERENCES public.profiles(id),
    
    -- Montant
    amount NUMERIC NOT NULL,
    commission_amount NUMERIC,
    notaire_fees NUMERIC,
    taxes NUMERIC,
    total_amount NUMERIC GENERATED ALWAYS AS (amount + COALESCE(commission_amount, 0) + COALESCE(notaire_fees, 0) + COALESCE(taxes, 0)) STORED,
    
    -- Type et statut
    transaction_type TEXT NOT NULL, -- 'vente', 'location', 'tokenisation'
    status TEXT DEFAULT 'initiated', -- 'initiated', 'in_progress', 'signed', 'completed', 'cancelled'
    
    -- Blockchain
    blockchain_hash TEXT,
    blockchain_network TEXT,
    blockchain_verified BOOLEAN DEFAULT false,
    blockchain_verified_at TIMESTAMPTZ,
    
    -- Signatures électroniques
    signature_buyer TEXT, -- Hash de la signature
    signature_seller TEXT,
    signature_notaire TEXT,
    signed_at TIMESTAMPTZ,
    
    -- Documents
    contract_url TEXT,
    deed_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

-- Index pour transactions
CREATE INDEX idx_transactions_property ON public.transactions(property_id);
CREATE INDEX idx_transactions_buyer ON public.transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON public.transactions(seller_id);
CREATE INDEX idx_transactions_notaire ON public.transactions(notaire_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at DESC);

-- ================================================
-- TABLE 8: FAVORITES (Favoris utilisateurs)
-- ================================================

CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Références
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    
    -- Notes personnelles
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, property_id)
);

-- Index pour favorites
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_favorites_property ON public.favorites(property_id);
CREATE INDEX idx_favorites_created_at ON public.favorites(created_at DESC);

-- ================================================
-- TABLE 9: PROPERTY_VIEWS (Vues des propriétés)
-- ================================================

CREATE TABLE IF NOT EXISTS public.property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Références
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Métadonnées
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    device_type TEXT, -- 'mobile', 'tablet', 'desktop'
    
    -- Timestamps
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour property_views
CREATE INDEX idx_property_views_property ON public.property_views(property_id);
CREATE INDEX idx_property_views_viewer ON public.property_views(viewer_id);
CREATE INDEX idx_property_views_date ON public.property_views(viewed_at DESC);

-- ================================================
-- TABLE 10: PROJECTS (Projets promoteurs)
-- ================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Promoteur
    promoteur_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Informations générales
    title TEXT NOT NULL,
    description TEXT,
    project_type TEXT, -- 'residential', 'commercial', 'mixed', 'infrastructure'
    
    -- Localisation
    location TEXT NOT NULL,
    address TEXT,
    city TEXT,
    region TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    
    -- Budget et financement
    total_budget NUMERIC,
    invested_amount NUMERIC DEFAULT 0,
    funding_status TEXT DEFAULT 'seeking', -- 'seeking', 'partially_funded', 'fully_funded'
    
    -- Progression
    status TEXT DEFAULT 'planning', -- 'planning', 'approved', 'in_progress', 'completed', 'on_hold', 'cancelled'
    progress_percentage INTEGER DEFAULT 0,
    
    -- Dates
    start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    
    -- Caractéristiques
    total_units INTEGER,
    units_sold INTEGER DEFAULT 0,
    unit_types JSONB, -- {studio: 10, f2: 20, f3: 15, etc.}
    
    -- Médias
    images TEXT[],
    videos TEXT[],
    documents TEXT[],
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Index pour projects
CREATE INDEX idx_projects_promoteur ON public.projects(promoteur_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_city ON public.projects(city);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);

-- Trigger pour updated_at
CREATE TRIGGER trigger_update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_updated_at();

-- ================================================
-- TABLE 11: INVESTMENTS (Investissements)
-- ================================================

CREATE TABLE IF NOT EXISTS public.investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Investisseur
    investor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Cible (propriété ou projet)
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    
    -- Montant
    amount NUMERIC NOT NULL,
    shares INTEGER, -- Nombre de parts/tokens
    share_price NUMERIC, -- Prix par part
    
    -- Rendement
    roi_percentage NUMERIC, -- ROI annuel estimé
    returns_to_date NUMERIC DEFAULT 0,
    
    -- Statut
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'withdrawn', 'pending'
    
    -- Dates
    invested_at TIMESTAMPTZ DEFAULT NOW(),
    maturity_date DATE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CHECK (property_id IS NOT NULL OR project_id IS NOT NULL)
);

-- Index pour investments
CREATE INDEX idx_investments_investor ON public.investments(investor_id);
CREATE INDEX idx_investments_property ON public.investments(property_id);
CREATE INDEX idx_investments_project ON public.investments(project_id);
CREATE INDEX idx_investments_status ON public.investments(status);
CREATE INDEX idx_investments_created_at ON public.investments(created_at DESC);

-- Trigger pour updated_at
CREATE TRIGGER trigger_update_investments_updated_at
    BEFORE UPDATE ON public.investments
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_updated_at();

-- ================================================
-- TABLE 12: BLOCKCHAIN_CERTIFICATES (Certificats blockchain)
-- ================================================

CREATE TABLE IF NOT EXISTS public.blockchain_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Référence
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id),
    
    -- Certificat
    certificate_type TEXT NOT NULL, -- 'ownership', 'transaction', 'valuation'
    certificate_hash TEXT NOT NULL UNIQUE,
    certificate_url TEXT,
    
    -- Blockchain
    blockchain_network TEXT NOT NULL, -- 'ethereum', 'polygon', 'binance'
    transaction_hash TEXT NOT NULL UNIQUE,
    block_number BIGINT,
    
    -- Émission
    issuer_id UUID REFERENCES public.profiles(id),
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Vérification
    verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verification_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Index pour blockchain_certificates
CREATE INDEX idx_blockchain_certificates_property ON public.blockchain_certificates(property_id);
CREATE INDEX idx_blockchain_certificates_transaction ON public.blockchain_certificates(transaction_id);
CREATE INDEX idx_blockchain_certificates_hash ON public.blockchain_certificates(certificate_hash);
CREATE INDEX idx_blockchain_certificates_network ON public.blockchain_certificates(blockchain_network);
CREATE INDEX idx_blockchain_certificates_created_at ON public.blockchain_certificates(created_at DESC);

-- ================================================
-- VÉRIFICATION FINALE
-- ================================================

-- Compter les tables créées
SELECT 
    'TABLES CRÉÉES' as status,
    COUNT(*) as total
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
AND table_name IN (
    'properties', 'offers', 'documents', 'notifications',
    'conversations', 'messages', 'transactions', 'favorites',
    'property_views', 'projects', 'investments', 'blockchain_certificates'
);

-- ================================================
-- ✅ FIN DU SCRIPT
-- ================================================
