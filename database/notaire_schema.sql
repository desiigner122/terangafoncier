-- =====================================================
-- SCHEMA BASE DE DONNÉES - NOTAIRES
-- Teranga Foncier - Système de gestion des actes notariés
-- =====================================================

-- Table des actes notariés
CREATE TABLE IF NOT EXISTS notarial_acts (
    id BIGSERIAL PRIMARY KEY,
    notaire_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations acte
    type VARCHAR(30) NOT NULL CHECK (type IN ('vente_immobiliere', 'donation', 'succession', 'hypotheque', 'bail_emphyteotique', 'partage')),
    property_description TEXT NOT NULL,
    property_value BIGINT, -- Valeur en FCFA
    location TEXT,
    
    -- Parties prenantes
    parties JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array des parties (vendeur, acheteur, etc.)
    
    -- Statut et workflow
    status VARCHAR(20) DEFAULT 'draft_review' CHECK (status IN ('draft_review', 'documentation', 'signature_pending', 'registration', 'completed', 'archived')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Dates importantes
    deadline DATE,
    signature_date DATE,
    registration_date DATE,
    completed_at TIMESTAMPTZ,
    
    -- Honoraires et frais
    calculated_fees INTEGER, -- Honoraires calculés automatiquement
    fee_breakdown JSONB, -- Détail du calcul des honoraires
    actual_fees INTEGER, -- Honoraires effectivement perçus
    registration_taxes INTEGER, -- Taxes d'enregistrement
    
    -- Documents et références légales
    required_documents JSONB DEFAULT '[]'::jsonb, -- Documents nécessaires
    legal_references JSONB DEFAULT '[]'::jsonb, -- Références légales applicables
    documents JSONB DEFAULT '[]'::jsonb, -- Documents attachés
    
    -- Notes et commentaires
    status_notes TEXT,
    internal_notes TEXT,
    client_instructions TEXT,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des tâches liées aux actes
CREATE TABLE IF NOT EXISTS notarial_tasks (
    id BIGSERIAL PRIMARY KEY,
    act_id BIGINT REFERENCES notarial_acts(id) ON DELETE CASCADE,
    
    -- Informations tâche
    title VARCHAR(200) NOT NULL,
    description TEXT,
    estimated_duration INTEGER, -- en jours
    actual_duration INTEGER,
    order_index INTEGER DEFAULT 0,
    
    -- Statut et assignation
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped', 'cancelled')),
    assigned_to UUID REFERENCES auth.users(id), -- Si délégué à un collaborateur
    
    -- Dates de planification
    scheduled_start DATE,
    actual_start DATE,
    scheduled_end DATE,
    actual_end DATE,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des documents notariés
CREATE TABLE IF NOT EXISTS notarial_documents (
    id BIGSERIAL PRIMARY KEY,
    act_id BIGINT REFERENCES notarial_acts(id) ON DELETE CASCADE,
    
    -- Informations document
    document_type VARCHAR(50) NOT NULL, -- titre_propriete, certificat_non_gage, etc.
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL, -- Chemin dans Supabase Storage
    file_size BIGINT,
    mime_type VARCHAR(100),
    
    -- Classification
    category VARCHAR(30) DEFAULT 'supporting' CHECK (category IN ('supporting', 'generated', 'signed', 'registered')),
    is_original BOOLEAN DEFAULT false,
    is_certified_copy BOOLEAN DEFAULT false,
    
    -- Validation et authentification
    verified_by UUID REFERENCES auth.users(id),
    verification_date TIMESTAMPTZ,
    digital_signature TEXT, -- Hash pour vérification intégrité
    
    -- Métadonnées
    description TEXT,
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des rappels documentaires
CREATE TABLE IF NOT EXISTS document_reminders (
    id BIGSERIAL PRIMARY KEY,
    act_id BIGINT REFERENCES notarial_acts(id) ON DELETE CASCADE,
    
    -- Document concerné
    document_type VARCHAR(50) NOT NULL,
    document_description TEXT,
    
    -- Planification rappel
    reminder_date DATE NOT NULL,
    reminded_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'completed', 'cancelled')),
    
    -- Destinataire
    recipient_type VARCHAR(10) DEFAULT 'client' CHECK (recipient_type IN ('client', 'notaire', 'third_party')),
    recipient_contact TEXT, -- Email ou téléphone
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des actes générés (versions finales)
CREATE TABLE IF NOT EXISTS generated_acts (
    id BIGSERIAL PRIMARY KEY,
    act_id BIGINT REFERENCES notarial_acts(id) ON DELETE CASCADE,
    
    -- Contenu de l'acte
    act_content JSONB NOT NULL, -- Contenu structuré de l'acte
    act_version INTEGER DEFAULT 1,
    
    -- Statut du document
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'ready_for_signature', 'signed', 'registered')),
    
    -- Signatures
    signatures JSONB DEFAULT '[]'::jsonb, -- Signatures des parties et du notaire
    signature_completed_at TIMESTAMPTZ,
    
    -- Fichiers générés
    pdf_file_path TEXT, -- Acte PDF final
    archive_reference VARCHAR(100), -- Référence pour archivage
    
    -- Métadonnées
    generated_by UUID REFERENCES auth.users(id),
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    finalized_at TIMESTAMPTZ
);

-- Table des rendez-vous notariaux
CREATE TABLE IF NOT EXISTS notarial_appointments (
    id BIGSERIAL PRIMARY KEY,
    notaire_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    act_id BIGINT REFERENCES notarial_acts(id) ON DELETE SET NULL,
    
    -- Informations rendez-vous
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    
    -- Participants
    client_name VARCHAR(200) NOT NULL,
    client_contact VARCHAR(100),
    attendees JSONB DEFAULT '[]'::jsonb, -- Autres participants
    
    -- Type et objet
    appointment_type VARCHAR(30) NOT NULL, -- signature, consultation, lecture_testament, etc.
    subject TEXT NOT NULL,
    location VARCHAR(200) DEFAULT 'Étude notariale',
    
    -- Statut
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    
    -- Notes
    preparation_notes TEXT,
    meeting_notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des métriques notaires
CREATE TABLE IF NOT EXISTS notaire_metrics (
    id BIGSERIAL PRIMARY KEY,
    notaire_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Métriques calculées
    metrics JSONB NOT NULL, -- Toutes les métriques en JSON
    
    -- Période de calcul
    calculation_date DATE DEFAULT CURRENT_DATE,
    period_type VARCHAR(10) DEFAULT 'monthly' CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
    
    -- Métadonnées
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(notaire_id, calculation_date, period_type)
);

-- Table des barèmes notariaux (évolution historique)
CREATE TABLE IF NOT EXISTS notarial_fee_scales (
    id BIGSERIAL PRIMARY KEY,
    
    -- Informations barème
    act_type VARCHAR(30) NOT NULL,
    fee_structure JSONB NOT NULL, -- Structure des honoraires
    
    -- Validité
    effective_date DATE NOT NULL,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    
    -- Références légales
    legal_basis VARCHAR(200), -- Décret, arrêté, etc.
    official_reference VARCHAR(100),
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des certifications et habilitations notaires
CREATE TABLE IF NOT EXISTS notaire_certifications (
    id BIGSERIAL PRIMARY KEY,
    notaire_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations certification
    certification_type VARCHAR(50) NOT NULL, -- notaire, commissaire_priseur, etc.
    certification_number VARCHAR(100) NOT NULL,
    issuing_authority VARCHAR(200), -- Chambre des Notaires, Ministère Justice
    
    -- Spécialisations
    specializations JSONB DEFAULT '[]'::jsonb, -- Domaines de spécialisation
    territorial_jurisdiction TEXT, -- Ressort territorial
    
    -- Validité
    issue_date DATE NOT NULL,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    
    -- Documents
    certificate_file_path TEXT,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEX ET OPTIMISATIONS
-- =====================================================

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_notarial_acts_notaire ON notarial_acts(notaire_id);
CREATE INDEX IF NOT EXISTS idx_notarial_acts_client ON notarial_acts(client_id);
CREATE INDEX IF NOT EXISTS idx_notarial_acts_status ON notarial_acts(status);
CREATE INDEX IF NOT EXISTS idx_notarial_acts_type ON notarial_acts(type);
CREATE INDEX IF NOT EXISTS idx_notarial_acts_deadline ON notarial_acts(deadline);
CREATE INDEX IF NOT EXISTS idx_notarial_acts_value ON notarial_acts(property_value);

CREATE INDEX IF NOT EXISTS idx_notarial_tasks_act ON notarial_tasks(act_id);
CREATE INDEX IF NOT EXISTS idx_notarial_tasks_status ON notarial_tasks(status);
CREATE INDEX IF NOT EXISTS idx_notarial_tasks_assigned ON notarial_tasks(assigned_to);

CREATE INDEX IF NOT EXISTS idx_notarial_documents_act ON notarial_documents(act_id);
CREATE INDEX IF NOT EXISTS idx_notarial_documents_type ON notarial_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_notarial_documents_category ON notarial_documents(category);

CREATE INDEX IF NOT EXISTS idx_document_reminders_act ON document_reminders(act_id);
CREATE INDEX IF NOT EXISTS idx_document_reminders_date ON document_reminders(reminder_date);
CREATE INDEX IF NOT EXISTS idx_document_reminders_status ON document_reminders(status);

CREATE INDEX IF NOT EXISTS idx_generated_acts_act ON generated_acts(act_id);
CREATE INDEX IF NOT EXISTS idx_generated_acts_status ON generated_acts(status);

CREATE INDEX IF NOT EXISTS idx_notarial_appointments_notaire ON notarial_appointments(notaire_id);
CREATE INDEX IF NOT EXISTS idx_notarial_appointments_date ON notarial_appointments(appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_notarial_appointments_status ON notarial_appointments(status);

CREATE INDEX IF NOT EXISTS idx_notaire_metrics_notaire ON notaire_metrics(notaire_id);
CREATE INDEX IF NOT EXISTS idx_notaire_metrics_date ON notaire_metrics(calculation_date);

-- Index de recherche textuelle
CREATE INDEX IF NOT EXISTS idx_notarial_acts_description_fts ON notarial_acts USING gin(to_tsvector('french', property_description));
CREATE INDEX IF NOT EXISTS idx_notarial_acts_location_fts ON notarial_acts USING gin(to_tsvector('french', location));

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

-- Appliquer les triggers
CREATE TRIGGER update_notarial_acts_updated_at 
    BEFORE UPDATE ON notarial_acts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notarial_tasks_updated_at 
    BEFORE UPDATE ON notarial_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notarial_appointments_updated_at 
    BEFORE UPDATE ON notarial_appointments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour calculer automatiquement les honoraires
CREATE OR REPLACE FUNCTION calculate_notarial_fees()
RETURNS TRIGGER AS $$
DECLARE
    fee_scale RECORD;
    calculated_amount INTEGER;
BEGIN
    -- Récupérer le barème applicable
    SELECT * INTO fee_scale 
    FROM notarial_fee_scales 
    WHERE act_type = NEW.type 
    AND is_active = true 
    AND effective_date <= CURRENT_DATE
    ORDER BY effective_date DESC 
    LIMIT 1;
    
    IF FOUND THEN
        -- Calculer les honoraires selon le barème
        -- Logique de calcul basée sur fee_scale.fee_structure
        calculated_amount := GREATEST(
            (fee_scale.fee_structure->>'base_fee')::INTEGER,
            ((NEW.property_value * (fee_scale.fee_structure->>'rate')::DECIMAL / 100))::INTEGER
        );
        
        calculated_amount := LEAST(
            calculated_amount,
            (fee_scale.fee_structure->>'max_fee')::INTEGER
        );
        
        NEW.calculated_fees := calculated_amount;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Déclencher le calcul automatique des honoraires
CREATE TRIGGER calculate_notarial_fees_trigger
    BEFORE INSERT OR UPDATE OF property_value, type ON notarial_acts
    FOR EACH ROW EXECUTE FUNCTION calculate_notarial_fees();

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour obtenir les statistiques d'un notaire
CREATE OR REPLACE FUNCTION get_notaire_dashboard_stats(target_notaire_id UUID)
RETURNS TABLE (
    active_files BIGINT,
    completed_acts BIGINT,
    monthly_revenue BIGINT,
    average_act_value BIGINT,
    average_processing_time DECIMAL,
    client_satisfaction DECIMAL,
    upcoming_appointments BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(CASE WHEN na.status NOT IN ('completed', 'archived') THEN 1 END) as active_files,
        COUNT(CASE WHEN na.status = 'completed' THEN 1 END) as completed_acts,
        COALESCE(SUM(CASE WHEN na.created_at >= NOW() - INTERVAL '30 days' THEN na.calculated_fees END), 0)::BIGINT as monthly_revenue,
        COALESCE(AVG(CASE WHEN na.status = 'completed' THEN na.property_value END), 0)::BIGINT as average_act_value,
        COALESCE(AVG(CASE WHEN na.completed_at IS NOT NULL THEN EXTRACT(EPOCH FROM (na.completed_at - na.created_at))/86400 END), 0)::DECIMAL as average_processing_time,
        96.0::DECIMAL as client_satisfaction, -- À calculer selon les évaluations
        COUNT(nap.id) FILTER (WHERE nap.appointment_date >= CURRENT_DATE AND nap.status IN ('scheduled', 'confirmed'))::BIGINT as upcoming_appointments
    FROM notarial_acts na
    LEFT JOIN notarial_appointments nap ON nap.notaire_id = target_notaire_id
    WHERE na.notaire_id = target_notaire_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier les rappels documentaires dus
CREATE OR REPLACE FUNCTION check_document_reminders_due()
RETURNS TABLE (
    act_id BIGINT,
    document_type VARCHAR(50),
    days_overdue INTEGER,
    client_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dr.act_id,
        dr.document_type,
        (CURRENT_DATE - dr.reminder_date)::INTEGER as days_overdue,
        CONCAT(p.first_name, ' ', p.last_name) as client_name
    FROM document_reminders dr
    JOIN notarial_acts na ON na.id = dr.act_id
    JOIN profiles p ON p.id = na.client_id
    WHERE dr.reminder_date <= CURRENT_DATE
    AND dr.status = 'scheduled'
    ORDER BY dr.reminder_date ASC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DONNÉES INITIALES
-- =====================================================

-- Insérer les barèmes notariaux actuels (exemple pour le Sénégal)
INSERT INTO notarial_fee_scales (act_type, fee_structure, effective_date, legal_basis) VALUES
('vente_immobiliere', '{"base_fee": 150000, "rate": 1.5, "min_fee": 150000, "max_fee": 5000000}', '2024-01-01', 'Décret 2024-001'),
('donation', '{"base_fee": 100000, "rate": 1.0, "min_fee": 100000, "max_fee": 3000000}', '2024-01-01', 'Décret 2024-001'),
('succession', '{"base_fee": 200000, "rate": 2.0, "min_fee": 200000, "max_fee": 8000000}', '2024-01-01', 'Décret 2024-001'),
('hypotheque', '{"base_fee": 200000, "rate": 0.5, "min_fee": 200000, "max_fee": 2000000}', '2024-01-01', 'Décret 2024-001'),
('bail_emphyteotique', '{"base_fee": 250000, "rate": 0.8, "min_fee": 250000, "max_fee": 3000000}', '2024-01-01', 'Décret 2024-001'),
('partage', '{"base_fee": 175000, "rate": 1.2, "min_fee": 175000, "max_fee": 4000000}', '2024-01-01', 'Décret 2024-001')
ON CONFLICT DO NOTHING;

-- =====================================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- =====================================================

-- Activer RLS sur les tables sensibles
ALTER TABLE notarial_acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notarial_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notarial_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notarial_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_acts ENABLE ROW LEVEL SECURITY;

-- Politiques pour les actes (notaires voient leurs actes)
CREATE POLICY "Notaires can view their acts" ON notarial_acts
    FOR SELECT USING (auth.uid() = notaire_id);

CREATE POLICY "Notaires can create acts" ON notarial_acts
    FOR INSERT WITH CHECK (auth.uid() = notaire_id);

CREATE POLICY "Notaires can update their acts" ON notarial_acts
    FOR UPDATE USING (auth.uid() = notaire_id);

-- Politiques pour les clients (accès limité à leurs actes)
CREATE POLICY "Clients can view their acts" ON notarial_acts
    FOR SELECT USING (auth.uid() = client_id);

-- Politiques pour les documents
CREATE POLICY "Access documents of own acts" ON notarial_documents
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM notarial_acts na 
            WHERE na.id = notarial_documents.act_id 
            AND (na.notaire_id = auth.uid() OR na.client_id = auth.uid())
        )
    );

-- Politiques pour les rendez-vous
CREATE POLICY "Notaires can manage their appointments" ON notarial_appointments
    FOR ALL USING (auth.uid() = notaire_id);

-- =====================================================
-- COMMENTAIRES DE DOCUMENTATION
-- =====================================================

COMMENT ON TABLE notarial_acts IS 'Actes notariés en cours et terminés';
COMMENT ON TABLE notarial_tasks IS 'Tâches liées au traitement des actes';
COMMENT ON TABLE notarial_documents IS 'Documents associés aux actes notariés';
COMMENT ON TABLE document_reminders IS 'Rappels pour documents manquants';
COMMENT ON TABLE generated_acts IS 'Actes authentiques générés';
COMMENT ON TABLE notarial_appointments IS 'Rendez-vous et consultations notariales';
COMMENT ON TABLE notaire_metrics IS 'Métriques de performance des notaires';
COMMENT ON TABLE notarial_fee_scales IS 'Barèmes et tarifs notariaux officiels';
COMMENT ON TABLE notaire_certifications IS 'Certifications et habilitations notaires';

COMMENT ON FUNCTION get_notaire_dashboard_stats IS 'Statistiques complètes pour dashboard notaire';
COMMENT ON FUNCTION check_document_reminders_due IS 'Vérification des rappels documentaires dus';
