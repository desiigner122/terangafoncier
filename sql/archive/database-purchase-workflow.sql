-- Tables SQL pour le système de workflow des achats immobiliers
-- Teranga Foncier - Gestion complète des dossiers d'achat

-- Table principale des dossiers d'achat
CREATE TABLE IF NOT EXISTS purchase_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id UUID REFERENCES requests(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    parcelle_id UUID REFERENCES parcelles(id) ON DELETE SET NULL,
    
    -- Détails financiers
    purchase_price DECIMAL(15,2),
    negotiated_price DECIMAL(15,2),
    payment_method TEXT CHECK (payment_method IN ('one_time', 'installments', 'bank_financing', 'mixed')),
    financing_approved BOOLEAN DEFAULT false,
    
    -- Statut et progression
    status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN (
        'initiated', 'buyer_verification', 'seller_notification', 
        'negotiation', 'preliminary_agreement', 'contract_preparation',
        'legal_verification', 'document_audit', 'property_evaluation',
        'notary_appointment', 'signing_process', 'payment_processing',
        'property_transfer', 'completed',
        'cancelled', 'rejected', 'seller_declined', 'negotiation_failed', 'legal_issues_found'
    )),
    phase INTEGER NOT NULL DEFAULT 1 CHECK (phase IN (0, 1, 2, 3, 4)),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Dates importantes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    estimated_completion TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Métadonnées
    updated_by TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    metadata JSONB DEFAULT '{}',
    
    -- Contraintes
    CONSTRAINT valid_price_range CHECK (purchase_price >= 0 AND negotiated_price >= 0),
    CONSTRAINT completion_date_logic CHECK (completed_at IS NULL OR completed_at >= created_at)
);

-- Historique détaillé des changements de statut
CREATE TABLE IF NOT EXISTS purchase_case_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    
    -- Changement de statut
    previous_status TEXT,
    new_status TEXT NOT NULL,
    status TEXT NOT NULL, -- Compatibilité avec code existant
    
    -- Détails de la mise à jour
    updated_by TEXT NOT NULL,
    notes TEXT,
    attachments JSONB DEFAULT '[]',
    
    -- Informations techniques
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Documents liés aux dossiers d'achat
CREATE TABLE IF NOT EXISTS purchase_case_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    
    -- Informations du document
    document_type TEXT NOT NULL CHECK (document_type IN (
        'identity_proof', 'income_proof', 'bank_statement',
        'title_deed', 'land_certificate', 'tax_clearance',
        'survey_report', 'insurance_policy', 'contract',
        'notary_deed', 'payment_proof', 'other'
    )),
    document_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    
    -- Statut de vérification
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
    verified_by TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    
    -- Métadonnées
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_required BOOLEAN DEFAULT false,
    expiry_date TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

-- Étapes et jalons du processus
CREATE TABLE IF NOT EXISTS purchase_case_milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    
    -- Détails du jalon
    milestone_type TEXT NOT NULL CHECK (milestone_type IN (
        'agreement_signed', 'payment_completed', 'documents_verified',
        'notary_appointment', 'property_transferred', 'case_closed'
    )),
    milestone_name TEXT NOT NULL,
    description TEXT,
    
    -- Statut et dates
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'failed')),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by TEXT,
    
    -- Dépendances
    depends_on_milestone UUID REFERENCES purchase_case_milestones(id),
    blocks_milestone UUID REFERENCES purchase_case_milestones(id),
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Notifications automatiques pour le workflow
CREATE TABLE IF NOT EXISTS purchase_case_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Détails de la notification
    notification_type TEXT NOT NULL CHECK (notification_type IN (
        'status_update', 'document_required', 'payment_due',
        'appointment_reminder', 'deadline_approaching', 'case_completed'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Statut et priorité
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Canaux de notification
    email_sent BOOLEAN DEFAULT false,
    sms_sent BOOLEAN DEFAULT false,
    push_sent BOOLEAN DEFAULT false,
    in_app_read BOOLEAN DEFAULT false,
    
    -- Dates
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'
);

-- Participants au dossier (acheteur, vendeur, agents, notaires, etc.)
CREATE TABLE IF NOT EXISTS purchase_case_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Rôle dans le dossier
    role TEXT NOT NULL CHECK (role IN (
        'buyer', 'seller', 'agent', 'notary', 'legal_advisor',
        'financial_advisor', 'surveyor', 'inspector', 'admin'
    )),
    permissions JSONB DEFAULT '[]',
    
    -- Statut de participation
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'removed', 'blocked')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    left_at TIMESTAMP WITH TIME ZONE,
    
    -- Informations de contact
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}'
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_purchase_cases_buyer ON purchase_cases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_seller ON purchase_cases(seller_id);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_status ON purchase_cases(status);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_phase ON purchase_cases(phase);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_created_at ON purchase_cases(created_at);

CREATE INDEX IF NOT EXISTS idx_purchase_case_history_case_id ON purchase_case_history(case_id);
CREATE INDEX IF NOT EXISTS idx_purchase_case_history_created_at ON purchase_case_history(created_at);

CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_case_id ON purchase_case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_type ON purchase_case_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_verification ON purchase_case_documents(verification_status);

CREATE INDEX IF NOT EXISTS idx_purchase_case_notifications_user ON purchase_case_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_case_notifications_status ON purchase_case_notifications(status);
CREATE INDEX IF NOT EXISTS idx_purchase_case_notifications_scheduled ON purchase_case_notifications(scheduled_for);

-- Triggers pour automatiser certaines actions
CREATE OR REPLACE FUNCTION update_purchase_case_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_purchase_case_timestamp
    BEFORE UPDATE ON purchase_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_purchase_case_timestamp();

-- Trigger pour créer automatiquement l'historique lors des changements de statut
CREATE OR REPLACE FUNCTION log_purchase_case_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO purchase_case_history (
            case_id, previous_status, new_status, status, updated_by, notes
        ) VALUES (
            NEW.id, OLD.status, NEW.status, NEW.status, 
            NEW.updated_by, 'Changement automatique de statut'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_purchase_case_status_change
    AFTER UPDATE ON purchase_cases
    FOR EACH ROW
    EXECUTE FUNCTION log_purchase_case_status_change();

-- Fonction pour calculer automatiquement le pourcentage de progression
CREATE OR REPLACE FUNCTION calculate_purchase_case_progress(case_status TEXT)
RETURNS INTEGER AS $$
BEGIN
    RETURN CASE case_status
        WHEN 'initiated' THEN 7
        WHEN 'buyer_verification' THEN 14
        WHEN 'seller_notification' THEN 21
        WHEN 'negotiation' THEN 29
        WHEN 'preliminary_agreement' THEN 36
        WHEN 'contract_preparation' THEN 43
        WHEN 'legal_verification' THEN 50
        WHEN 'document_audit' THEN 57
        WHEN 'property_evaluation' THEN 64
        WHEN 'notary_appointment' THEN 71
        WHEN 'signing_process' THEN 79
        WHEN 'payment_processing' THEN 86
        WHEN 'property_transfer' THEN 93
        WHEN 'completed' THEN 100
        ELSE 0
    END;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement le pourcentage de progression
CREATE OR REPLACE FUNCTION update_purchase_case_progress()
RETURNS TRIGGER AS $$
BEGIN
    NEW.progress_percentage = calculate_purchase_case_progress(NEW.status);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_purchase_case_progress
    BEFORE INSERT OR UPDATE OF status ON purchase_cases
    FOR EACH ROW
    EXECUTE FUNCTION update_purchase_case_progress();

-- Politique RLS (Row Level Security) pour la sécurité
ALTER TABLE purchase_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_participants ENABLE ROW LEVEL SECURITY;

-- Politiques pour purchase_cases
CREATE POLICY "Users can view their own purchase cases" ON purchase_cases
    FOR SELECT USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id OR
        EXISTS (
            SELECT 1 FROM purchase_case_participants 
            WHERE case_id = purchase_cases.id 
            AND user_id = auth.uid() 
            AND status = 'active'
        )
    );

CREATE POLICY "Users can update their own purchase cases" ON purchase_cases
    FOR UPDATE USING (
        auth.uid() = buyer_id OR 
        auth.uid() = seller_id OR
        EXISTS (
            SELECT 1 FROM purchase_case_participants 
            WHERE case_id = purchase_cases.id 
            AND user_id = auth.uid() 
            AND status = 'active'
            AND role IN ('agent', 'admin', 'notary')
        )
    );

-- Politiques pour purchase_case_history
CREATE POLICY "Users can view history of their cases" ON purchase_case_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = purchase_case_history.case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

-- Politiques pour purchase_case_documents
CREATE POLICY "Users can view documents of their cases" ON purchase_case_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = purchase_case_documents.case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

CREATE POLICY "Users can upload documents to their cases" ON purchase_case_documents
    FOR INSERT WITH CHECK (
        uploaded_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

-- Politiques pour purchase_case_notifications
CREATE POLICY "Users can view their own notifications" ON purchase_case_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON purchase_case_notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Données de test pour démonstration
INSERT INTO purchase_cases (
    id, buyer_id, seller_id, purchase_price, payment_method, 
    status, phase, metadata
) VALUES (
    gen_random_uuid(),
    'user-particulier',
    'user-vendeur-particulier', 
    45000000,
    'one_time',
    'negotiation',
    2,
    '{"initial_offer": 42000000, "negotiation_rounds": 2}'
) ON CONFLICT DO NOTHING;

-- Vue pour simplifier les requêtes complexes
CREATE OR REPLACE VIEW purchase_cases_detailed AS
SELECT 
    pc.*,
    -- Informations sur l'acheteur
    buyer.email as buyer_email,
    buyer_profile.full_name as buyer_name,
    buyer_profile.phone as buyer_phone,
    
    -- Informations sur le vendeur
    seller.email as seller_email,
    seller_profile.full_name as seller_name,
    seller_profile.phone as seller_phone,
    
    -- Informations sur la parcelle
    p.title as parcelle_title,
    p.location as parcelle_location,
    p.surface as parcelle_surface,
    
    -- Statistiques
    (SELECT COUNT(*) FROM purchase_case_history WHERE case_id = pc.id) as history_count,
    (SELECT COUNT(*) FROM purchase_case_documents WHERE case_id = pc.id) as documents_count,
    (SELECT COUNT(*) FROM purchase_case_notifications WHERE case_id = pc.id AND status = 'pending') as pending_notifications
    
FROM purchase_cases pc
LEFT JOIN auth.users buyer ON pc.buyer_id = buyer.id
LEFT JOIN profiles buyer_profile ON pc.buyer_id = buyer_profile.user_id
LEFT JOIN auth.users seller ON pc.seller_id = seller.id
LEFT JOIN profiles seller_profile ON pc.seller_id = seller_profile.user_id
LEFT JOIN parcelles p ON pc.parcelle_id = p.id;

COMMENT ON TABLE purchase_cases IS 'Dossiers d''achat immobilier avec workflow complet';
COMMENT ON TABLE purchase_case_history IS 'Historique détaillé des changements de statut';
COMMENT ON TABLE purchase_case_documents IS 'Documents uploadés pour chaque dossier';
COMMENT ON TABLE purchase_case_notifications IS 'Notifications automatiques du workflow';
COMMENT ON TABLE purchase_case_participants IS 'Participants aux dossiers d''achat';