-- ===============================================
-- TABLE PURCHASE_REQUESTS
-- Gestion complète des demandes d'achat
-- ===============================================

CREATE TABLE IF NOT EXISTS purchase_requests (
    -- Identifiants
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Informations acheteur (copie pour historique)
    buyer_name VARCHAR(255),
    buyer_email VARCHAR(255),
    buyer_phone VARCHAR(50),
    
    -- Type de demande
    request_type VARCHAR(50) NOT NULL DEFAULT 'inquiry', 
    -- 'inquiry' = simple demande d'infos
    -- 'offer' = offre d'achat
    -- 'viewing' = demande de visite
    -- 'negotiation' = négociation en cours
    
    -- Statut
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    -- 'pending' = en attente de réponse vendeur
    -- 'accepted' = acceptée par vendeur
    -- 'rejected' = refusée par vendeur
    -- 'negotiating' = en négociation
    -- 'contract_pending' = contrat en préparation
    -- 'completed' = transaction terminée
    -- 'cancelled' = annulée
    
    priority VARCHAR(20) DEFAULT 'normal', -- 'normal', 'urgent', 'high'
    
    -- Prix et négociation
    offer_price NUMERIC(15, 2), -- Offre initiale acheteur
    counter_offer_price NUMERIC(15, 2), -- Contre-offre vendeur
    final_price NUMERIC(15, 2), -- Prix final accepté
    
    -- Messages
    message TEXT, -- Message initial acheteur
    vendor_response TEXT, -- Réponse vendeur
    rejection_reason TEXT, -- Raison du refus
    
    -- Historique négociation (JSONB pour flexibilité)
    negotiation_history JSONB DEFAULT '[]'::jsonb,
    -- Format: [{"type": "counter_offer", "from": "vendor", "price": 45000000, "message": "...", "timestamp": "..."}]
    
    -- Visite planifiée
    viewing_date TIMESTAMP WITH TIME ZONE,
    viewing_status VARCHAR(50), -- 'scheduled', 'completed', 'cancelled'
    viewing_notes TEXT,
    
    -- Contrat
    contract_generated_at TIMESTAMP WITH TIME ZONE,
    contract_signed_at TIMESTAMP WITH TIME ZONE,
    contract_url TEXT, -- URL du contrat PDF
    
    -- Paiement
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'deposit_paid', 'fully_paid'
    deposit_amount NUMERIC(15, 2),
    deposit_paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Blockchain (si applicable)
    blockchain_tx_hash VARCHAR(255),
    blockchain_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Communication
    unread_messages_vendor INTEGER DEFAULT 0,
    unread_messages_buyer INTEGER DEFAULT 0,
    last_message_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE, -- Quand vendeur a répondu
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Index
    CONSTRAINT valid_status CHECK (status IN (
        'pending', 'accepted', 'rejected', 'negotiating', 
        'contract_pending', 'completed', 'cancelled'
    )),
    CONSTRAINT valid_request_type CHECK (request_type IN (
        'inquiry', 'offer', 'viewing', 'negotiation'
    )),
    CONSTRAINT valid_priority CHECK (priority IN ('normal', 'urgent', 'high'))
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_purchase_requests_vendor ON purchase_requests(vendor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_buyer ON purchase_requests(buyer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_property ON purchase_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_created ON purchase_requests(created_at DESC);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_purchase_requests_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_purchase_requests_timestamp
    BEFORE UPDATE ON purchase_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_purchase_requests_timestamp();

-- RLS (Row Level Security)
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;

-- Politique: Vendeurs voient leurs demandes
CREATE POLICY "Vendors can view their purchase requests"
    ON purchase_requests FOR SELECT
    USING (vendor_id = auth.uid());

-- Politique: Acheteurs voient leurs demandes
CREATE POLICY "Buyers can view their purchase requests"
    ON purchase_requests FOR SELECT
    USING (buyer_id = auth.uid());

-- Politique: Acheteurs peuvent créer
CREATE POLICY "Buyers can create purchase requests"
    ON purchase_requests FOR INSERT
    WITH CHECK (buyer_id = auth.uid());

-- Politique: Vendeurs peuvent modifier leurs demandes
CREATE POLICY "Vendors can update their purchase requests"
    ON purchase_requests FOR UPDATE
    USING (vendor_id = auth.uid());

-- Politique: Acheteurs peuvent modifier leurs demandes
CREATE POLICY "Buyers can update their purchase requests"
    ON purchase_requests FOR UPDATE
    USING (buyer_id = auth.uid());

-- Vue statistiques vendeur
CREATE OR REPLACE VIEW vendor_purchase_stats AS
SELECT 
    vendor_id,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COUNT(*) FILTER (WHERE status = 'accepted') as accepted_count,
    COUNT(*) FILTER (WHERE status = 'negotiating') as negotiating_count,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
    SUM(final_price) FILTER (WHERE status = 'completed') as total_revenue,
    AVG(EXTRACT(EPOCH FROM (responded_at - created_at)) / 3600) as avg_response_hours,
    MAX(created_at) as last_request_date
FROM purchase_requests
GROUP BY vendor_id;

-- Fonction pour calculer urgence
CREATE OR REPLACE FUNCTION calculate_request_urgency(request purchase_requests)
RETURNS VARCHAR AS $$
DECLARE
    hours_since_creation NUMERIC;
BEGIN
    hours_since_creation := EXTRACT(EPOCH FROM (NOW() - request.created_at)) / 3600;
    
    IF request.status = 'pending' AND hours_since_creation > 48 THEN
        RETURN 'urgent';
    ELSIF request.priority = 'high' OR request.offer_price > 100000000 THEN
        RETURN 'urgent';
    ELSIF hours_since_creation > 24 THEN
        RETURN 'high';
    ELSE
        RETURN 'normal';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Commentaires
COMMENT ON TABLE purchase_requests IS 'Gestion complète des demandes d''achat avec workflow de négociation';
COMMENT ON COLUMN purchase_requests.negotiation_history IS 'Historique JSON de toutes les offres/contre-offres';
COMMENT ON COLUMN purchase_requests.request_type IS 'Type: inquiry, offer, viewing, negotiation';
COMMENT ON COLUMN purchase_requests.status IS 'Workflow: pending -> negotiating -> accepted -> contract_pending -> completed';

-- Données de test (optionnel)
/*
INSERT INTO purchase_requests (
    property_id, vendor_id, buyer_id, buyer_name, buyer_email, buyer_phone,
    request_type, status, offer_price, message
) VALUES
    (
        (SELECT id FROM properties WHERE owner_id = 'VENDOR_UUID' LIMIT 1),
        'VENDOR_UUID',
        'BUYER_UUID',
        'Jean Dupont',
        'jean@example.com',
        '+221775551234',
        'offer',
        'pending',
        45000000,
        'Je suis très intéressé par ce terrain. Mon offre est de 45M FCFA.'
    );
*/
