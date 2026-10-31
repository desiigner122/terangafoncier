-- =====================================================
-- SYSTÈME CONSTRUCTION À DISTANCE - TERANGA FONCIER
-- Pour la diaspora sénégalaise
-- =====================================================

-- Table des projets de construction à distance
CREATE TABLE IF NOT EXISTS remote_construction_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id VARCHAR(20) UNIQUE NOT NULL, -- REMOTE001, REMOTE002, etc.
    client_id UUID REFERENCES auth.users(id),
    promoteur_id UUID REFERENCES auth.users(id),
    terrain_id UUID REFERENCES land_parcels(id),
    
    -- Informations projet
    client_name VARCHAR(255) NOT NULL,
    client_country VARCHAR(100), -- France, USA, Canada, etc.
    client_contact VARCHAR(20),
    terrain_description TEXT,
    terrain_surface VARCHAR(50),
    
    -- Détails construction
    construction_type VARCHAR(100), -- Villa, Duplex, Commercial, etc.
    budget_total BIGINT NOT NULL,
    budget_utilise BIGINT DEFAULT 0,
    
    -- Statut et progression
    status VARCHAR(30) DEFAULT 'planification', -- planification, fondations, construction, finition, termine
    progression INTEGER DEFAULT 0, -- 0-100%
    phase_actuelle VARCHAR(100),
    
    -- Timeline
    date_debut DATE,
    date_fin_prevue DATE,
    derniere_update TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    prochaine_major_update DATE,
    
    -- Métadonnées
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des phases de construction avec timeline
CREATE TABLE IF NOT EXISTS construction_phases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES remote_construction_projects(id) ON DELETE CASCADE,
    
    phase_name VARCHAR(100) NOT NULL, -- "Fondations", "Élévation murs", "Toiture", etc.
    phase_order INTEGER NOT NULL,
    description TEXT,
    
    -- Statut de la phase
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, delayed
    progression INTEGER DEFAULT 0,
    
    -- Dates
    date_debut_prevue DATE,
    date_fin_prevue DATE,
    date_debut_reel DATE,
    date_fin_reel DATE,
    
    -- Budget de la phase
    budget_phase BIGINT,
    cout_reel BIGINT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des updates/actualités du projet (photos, vidéos, rapports)
CREATE TABLE IF NOT EXISTS construction_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES remote_construction_projects(id) ON DELETE CASCADE,
    phase_id UUID REFERENCES construction_phases(id),
    
    update_type VARCHAR(20) NOT NULL, -- 'photo', 'video', 'report', 'milestone'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Fichiers
    media_urls JSONB, -- Array des URLs des fichiers
    thumbnail_url TEXT,
    
    -- Métadonnées
    posted_by UUID REFERENCES auth.users(id), -- Promoteur qui poste
    is_major_update BOOLEAN DEFAULT false,
    visibility VARCHAR(20) DEFAULT 'client', -- client, internal, public
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de configuration des frais construction à distance (géré par admin)
CREATE TABLE IF NOT EXISTS remote_construction_fees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Type de frais
    fee_type VARCHAR(50) NOT NULL, -- 'management', 'supervision', 'reporting', 'coordination'
    construction_type VARCHAR(50), -- 'villa', 'duplex', 'commercial', 'all'
    
    -- Structure tarifaire
    fee_structure JSONB NOT NULL, -- {"base_fee": 500000, "percentage": 8, "per_phase": 150000}
    currency VARCHAR(10) DEFAULT 'XOF',
    
    -- Applicabilité
    is_active BOOLEAN DEFAULT true,
    applicable_regions JSONB, -- ["Dakar", "Thiès", "all"]
    min_budget BIGINT, -- Budget minimum pour appliquer ces frais
    max_budget BIGINT,
    
    -- Description
    description TEXT,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des notifications/alertes pour la diaspora
CREATE TABLE IF NOT EXISTS diaspora_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES remote_construction_projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id),
    
    notification_type VARCHAR(30) NOT NULL, -- 'phase_complete', 'milestone', 'delay', 'budget_alert'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Métadonnées
    is_read BOOLEAN DEFAULT false,
    priority VARCHAR(10) DEFAULT 'normal', -- low, normal, high, urgent
    action_required BOOLEAN DEFAULT false,
    
    -- Envoi
    sent_via JSONB, -- {"email": true, "sms": false, "whatsapp": true}
    sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des paiements échelonnés par phases
CREATE TABLE IF NOT EXISTS construction_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES remote_construction_projects(id) ON DELETE CASCADE,
    phase_id UUID REFERENCES construction_phases(id),
    
    -- Détails paiement
    payment_type VARCHAR(30) NOT NULL, -- 'advance', 'phase_completion', 'final', 'extra'
    amount BIGINT NOT NULL,
    currency VARCHAR(10) DEFAULT 'XOF',
    
    -- Statut
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    due_date DATE,
    paid_date TIMESTAMP WITH TIME ZONE,
    
    -- Méthode de paiement
    payment_method VARCHAR(30), -- 'bank_transfer', 'mobile_money', 'western_union', 'crypto'
    payment_reference VARCHAR(100),
    
    -- Notes
    description TEXT,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_remote_projects_client ON remote_construction_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_remote_projects_promoteur ON remote_construction_projects(promoteur_id);
CREATE INDEX IF NOT EXISTS idx_remote_projects_status ON remote_construction_projects(status);
CREATE INDEX IF NOT EXISTS idx_construction_phases_project ON construction_phases(project_id);
CREATE INDEX IF NOT EXISTS idx_construction_updates_project ON construction_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_diaspora_notifications_client ON diaspora_notifications(client_id);
CREATE INDEX IF NOT EXISTS idx_construction_payments_project ON construction_payments(project_id);

-- Insérer les frais de base pour construction à distance
INSERT INTO remote_construction_fees (fee_type, construction_type, fee_structure, description) VALUES
('management_fee', 'all', '{"percentage": 8, "min_fee": 500000, "max_fee": 5000000}', 'Frais de gestion globale du projet à distance'),
('supervision_fee', 'all', '{"per_phase": 200000, "site_visits": 50000}', 'Frais de supervision technique par phase'),
('reporting_fee', 'all', '{"monthly": 75000, "photo_package": 25000, "video_package": 50000}', 'Frais de reporting et documentation'),
('coordination_fee', 'all', '{"base_fee": 300000, "per_month": 100000}', 'Frais de coordination avec équipes locales'),
('diaspora_premium', 'villa', '{"percentage": 3, "premium_support": 250000}', 'Services premium pour la diaspora (support 24/7, updates hebdomadaires)')
ON CONFLICT DO NOTHING;

-- Activer RLS (Row Level Security)
ALTER TABLE remote_construction_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE diaspora_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_payments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS
CREATE POLICY "Clients can view their projects" ON remote_construction_projects
    FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Promoteurs can manage their projects" ON remote_construction_projects
    FOR ALL USING (auth.uid() = promoteur_id);

CREATE POLICY "Admins can manage all projects" ON remote_construction_projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Users can view updates of their projects" ON construction_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM remote_construction_projects rcp 
            WHERE rcp.id = construction_updates.project_id 
            AND (rcp.client_id = auth.uid() OR rcp.promoteur_id = auth.uid())
        )
    );

CREATE POLICY "Promoteurs can create updates" ON construction_updates
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM remote_construction_projects rcp 
            WHERE rcp.id = construction_updates.project_id 
            AND rcp.promoteur_id = auth.uid()
        )
    );

CREATE POLICY "Users can view their notifications" ON diaspora_notifications
    FOR SELECT USING (auth.uid() = client_id);

-- Fonctions utilitaires

-- Fonction pour calculer les frais totaux d'un projet
CREATE OR REPLACE FUNCTION calculate_remote_construction_fees(
    p_project_id UUID,
    p_budget BIGINT,
    p_construction_type VARCHAR(50)
)
RETURNS JSON AS $$
DECLARE
    total_fees BIGINT := 0;
    fee_breakdown JSON;
    fee_record RECORD;
BEGIN
    -- Calculer chaque type de frais
    FOR fee_record IN 
        SELECT fee_type, fee_structure 
        FROM remote_construction_fees 
        WHERE is_active = true 
        AND (construction_type = p_construction_type OR construction_type = 'all')
        AND (min_budget IS NULL OR p_budget >= min_budget)
        AND (max_budget IS NULL OR p_budget <= max_budget)
    LOOP
        -- Logique de calcul selon le type de frais
        -- (Simplifié pour l'exemple)
        IF fee_record.fee_structure->>'percentage' IS NOT NULL THEN
            total_fees := total_fees + (p_budget * (fee_record.fee_structure->>'percentage')::INTEGER / 100);
        END IF;
        
        IF fee_record.fee_structure->>'base_fee' IS NOT NULL THEN
            total_fees := total_fees + (fee_record.fee_structure->>'base_fee')::BIGINT;
        END IF;
    END LOOP;
    
    SELECT json_build_object(
        'total_fees', total_fees,
        'percentage_of_budget', ROUND((total_fees::NUMERIC / p_budget::NUMERIC) * 100, 2)
    ) INTO fee_breakdown;
    
    RETURN fee_breakdown;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour obtenir les statistiques d'un projet
CREATE OR REPLACE FUNCTION get_project_construction_stats(p_project_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_phases', (SELECT COUNT(*) FROM construction_phases WHERE project_id = p_project_id),
        'completed_phases', (SELECT COUNT(*) FROM construction_phases WHERE project_id = p_project_id AND status = 'completed'),
        'total_updates', (SELECT COUNT(*) FROM construction_updates WHERE project_id = p_project_id),
        'photos_count', (SELECT COUNT(*) FROM construction_updates WHERE project_id = p_project_id AND update_type = 'photo'),
        'videos_count', (SELECT COUNT(*) FROM construction_updates WHERE project_id = p_project_id AND update_type = 'video'),
        'budget_used_percentage', (
            SELECT ROUND((budget_utilise::NUMERIC / budget_total::NUMERIC) * 100, 1)
            FROM remote_construction_projects 
            WHERE id = p_project_id
        ),
        'next_milestone', (
            SELECT phase_name 
            FROM construction_phases 
            WHERE project_id = p_project_id AND status = 'in_progress' 
            ORDER BY phase_order 
            LIMIT 1
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mise à jour automatique du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_remote_projects_updated_at 
    BEFORE UPDATE ON remote_construction_projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_construction_phases_updated_at 
    BEFORE UPDATE ON construction_phases 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_remote_fees_updated_at 
    BEFORE UPDATE ON remote_construction_fees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_construction_payments_updated_at 
    BEFORE UPDATE ON construction_payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
