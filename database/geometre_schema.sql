-- =====================================================
-- SCHEMA BASE DE DONNÉES - GÉOMÈTRES EXPERTS
-- Teranga Foncier - Système de gestion des missions géomètres
-- =====================================================

-- Table des missions géomètres
CREATE TABLE IF NOT EXISTS geometric_missions (
    id BIGSERIAL PRIMARY KEY,
    geometre_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations mission
    type VARCHAR(20) NOT NULL CHECK (type IN ('bornage', 'lotissement', 'topographie', 'cadastre', 'expertise')),
    location TEXT NOT NULL,
    surface DECIMAL(10,2), -- en hectares
    coordinates JSONB, -- {lat, lng, elevation}
    description TEXT,
    
    -- Planification
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    deadline DATE,
    estimated_price INTEGER, -- Prix estimé en FCFA
    actual_cost INTEGER, -- Coût réel
    
    -- Statut et progression
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'survey', 'in_progress', 'review', 'completed', 'cancelled')),
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    
    -- Technique
    precision_target VARCHAR(10), -- 'mm', 'cm', 'm'
    achieved_precision DECIMAL(5,2), -- Précision réelle obtenue
    required_tools JSONB DEFAULT '[]'::jsonb, -- Outils nécessaires
    
    -- Validation et livraison
    status_notes TEXT,
    completed_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    client_validated_at TIMESTAMPTZ,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des tâches de mission
CREATE TABLE IF NOT EXISTS mission_tasks (
    id BIGSERIAL PRIMARY KEY,
    mission_id BIGINT REFERENCES geometric_missions(id) ON DELETE CASCADE,
    
    -- Informations tâche
    title VARCHAR(200) NOT NULL,
    description TEXT,
    estimated_duration INTEGER, -- en jours
    actual_duration INTEGER,
    order_index INTEGER DEFAULT 0,
    
    -- Statut
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    assigned_to UUID REFERENCES auth.users(id), -- Si délégué
    
    -- Dates
    scheduled_start DATE,
    actual_start DATE,
    scheduled_end DATE,
    actual_end DATE,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des mesures terrain
CREATE TABLE IF NOT EXISTS field_measurements (
    id BIGSERIAL PRIMARY KEY,
    mission_id BIGINT REFERENCES geometric_missions(id) ON DELETE CASCADE,
    
    -- Données techniques
    measurements JSONB NOT NULL, -- Coordonnées, angles, distances
    equipment_used JSONB DEFAULT '[]'::jsonb, -- Équipements utilisés
    precision_achieved DECIMAL(5,2), -- Précision obtenue
    
    -- Conditions
    weather_conditions JSONB, -- Météo lors des mesures
    temperature DECIMAL(4,1), -- Température en °C
    humidity INTEGER, -- Humidité en %
    wind_speed DECIMAL(4,1), -- Vitesse vent en km/h
    
    -- Notes techniques
    operator_notes TEXT,
    calculation_method VARCHAR(50),
    coordinate_system VARCHAR(50) DEFAULT 'WGS84',
    
    -- Validation
    verified_by UUID REFERENCES auth.users(id),
    verification_notes TEXT,
    verified_at TIMESTAMPTZ,
    
    -- Métadonnées
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des équipements géomètres
CREATE TABLE IF NOT EXISTS geometre_equipment (
    id BIGSERIAL PRIMARY KEY,
    geometre_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations équipement
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50),
    model VARCHAR(50),
    serial_number VARCHAR(100),
    equipment_type VARCHAR(30) NOT NULL, -- station_totale, gps_rtk, drone, etc.
    
    -- Spécifications techniques
    precision VARCHAR(20), -- '1mm + 1.5ppm'
    range_max INTEGER, -- Portée max en mètres
    battery_life INTEGER, -- Autonomie en heures
    
    -- Maintenance et étalonnage
    purchase_date DATE,
    last_calibration DATE,
    next_calibration DATE,
    calibration_interval INTEGER DEFAULT 180, -- jours
    last_maintenance DATE,
    next_maintenance DATE,
    maintenance_interval INTEGER DEFAULT 365, -- jours
    
    -- État actuel
    status VARCHAR(20) DEFAULT 'operational' CHECK (status IN ('operational', 'maintenance', 'calibration', 'out_of_service')),
    current_precision DECIMAL(5,2), -- Précision actuelle mesurée
    battery_level INTEGER DEFAULT 100, -- Niveau batterie %
    condition_notes TEXT,
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des vérifications équipements
CREATE TABLE IF NOT EXISTS equipment_checks (
    id BIGSERIAL PRIMARY KEY,
    mission_id BIGINT REFERENCES geometric_missions(id) ON DELETE CASCADE,
    equipment_id BIGINT REFERENCES geometre_equipment(id),
    
    -- Type de vérification
    check_type VARCHAR(20) NOT NULL CHECK (check_type IN ('pre_mission', 'post_mission', 'maintenance', 'calibration')),
    equipment_type VARCHAR(30), -- Type si pas lié à équipement spécifique
    equipment_name VARCHAR(100),
    
    -- Résultats
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'passed', 'failed', 'skipped')),
    precision_target VARCHAR(20),
    precision_measured DECIMAL(5,2),
    issues_found TEXT,
    actions_taken TEXT,
    
    -- Planification
    scheduled_date DATE,
    performed_date DATE,
    performed_by UUID REFERENCES auth.users(id),
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des rapports de mission
CREATE TABLE IF NOT EXISTS mission_reports (
    id BIGSERIAL PRIMARY KEY,
    mission_id BIGINT REFERENCES geometric_missions(id) ON DELETE CASCADE,
    
    -- Type et contenu
    report_type VARCHAR(20) NOT NULL CHECK (report_type IN ('technical', 'financial', 'client', 'internal')),
    report_data JSONB NOT NULL, -- Contenu structuré du rapport
    
    -- Fichiers associés
    file_path TEXT, -- Chemin du rapport PDF généré
    attachments JSONB DEFAULT '[]'::jsonb, -- Photos, plans, etc.
    
    -- Validation
    approved_by UUID REFERENCES auth.users(id),
    approval_date TIMESTAMPTZ,
    client_signature TEXT, -- Signature électronique client
    
    -- Métadonnées
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

-- Table des métriques géomètres
CREATE TABLE IF NOT EXISTS geometre_metrics (
    id BIGSERIAL PRIMARY KEY,
    geometre_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Métriques calculées
    metrics JSONB NOT NULL, -- Toutes les métriques en JSON
    
    -- Période de calcul
    calculation_date DATE DEFAULT CURRENT_DATE,
    period_type VARCHAR(10) DEFAULT 'monthly' CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
    
    -- Métadonnées
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(geometre_id, calculation_date, period_type)
);

-- Table des certifications géomètres
CREATE TABLE IF NOT EXISTS geometre_certifications (
    id BIGSERIAL PRIMARY KEY,
    geometre_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations certification
    certification_name VARCHAR(100) NOT NULL,
    issuing_organization VARCHAR(100),
    certification_number VARCHAR(50),
    specialization VARCHAR(50), -- topographie, cadastre, etc.
    
    -- Validité
    issue_date DATE,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT true,
    
    -- Documents
    certificate_file TEXT, -- Chemin du fichier certificat
    verification_url TEXT, -- URL de vérification en ligne
    
    -- Métadonnées
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEX ET OPTIMISATIONS
-- =====================================================

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_geometric_missions_geometre ON geometric_missions(geometre_id);
CREATE INDEX IF NOT EXISTS idx_geometric_missions_client ON geometric_missions(client_id);
CREATE INDEX IF NOT EXISTS idx_geometric_missions_status ON geometric_missions(status);
CREATE INDEX IF NOT EXISTS idx_geometric_missions_deadline ON geometric_missions(deadline);
CREATE INDEX IF NOT EXISTS idx_geometric_missions_location ON geometric_missions USING gin(to_tsvector('french', location));

CREATE INDEX IF NOT EXISTS idx_mission_tasks_mission ON mission_tasks(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_tasks_status ON mission_tasks(status);
CREATE INDEX IF NOT EXISTS idx_mission_tasks_assigned ON mission_tasks(assigned_to);

CREATE INDEX IF NOT EXISTS idx_field_measurements_mission ON field_measurements(mission_id);
CREATE INDEX IF NOT EXISTS idx_field_measurements_timestamp ON field_measurements(timestamp);

CREATE INDEX IF NOT EXISTS idx_geometre_equipment_geometre ON geometre_equipment(geometre_id);
CREATE INDEX IF NOT EXISTS idx_geometre_equipment_status ON geometre_equipment(status);
CREATE INDEX IF NOT EXISTS idx_geometre_equipment_maintenance ON geometre_equipment(next_maintenance);

CREATE INDEX IF NOT EXISTS idx_equipment_checks_mission ON equipment_checks(mission_id);
CREATE INDEX IF NOT EXISTS idx_equipment_checks_equipment ON equipment_checks(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_checks_scheduled ON equipment_checks(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_mission_reports_mission ON mission_reports(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_reports_type ON mission_reports(report_type);

CREATE INDEX IF NOT EXISTS idx_geometre_metrics_geometre ON geometre_metrics(geometre_id);
CREATE INDEX IF NOT EXISTS idx_geometre_metrics_date ON geometre_metrics(calculation_date);

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
CREATE TRIGGER update_geometric_missions_updated_at 
    BEFORE UPDATE ON geometric_missions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mission_tasks_updated_at 
    BEFORE UPDATE ON mission_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_geometre_equipment_updated_at 
    BEFORE UPDATE ON geometre_equipment 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour calculer automatiquement la progression
CREATE OR REPLACE FUNCTION calculate_mission_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_tasks INTEGER;
    completed_tasks INTEGER;
    progress_percent INTEGER;
BEGIN
    -- Compter les tâches
    SELECT COUNT(*) INTO total_tasks
    FROM mission_tasks 
    WHERE mission_id = NEW.mission_id;
    
    SELECT COUNT(*) INTO completed_tasks
    FROM mission_tasks 
    WHERE mission_id = NEW.mission_id AND status = 'completed';
    
    -- Calculer le pourcentage
    IF total_tasks > 0 THEN
        progress_percent = (completed_tasks * 100) / total_tasks;
        
        -- Mettre à jour la mission
        UPDATE geometric_missions 
        SET progress_percent = progress_percent
        WHERE id = NEW.mission_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Déclencher le calcul à chaque modification de tâche
CREATE TRIGGER calculate_mission_progress_trigger
    AFTER INSERT OR UPDATE ON mission_tasks
    FOR EACH ROW EXECUTE FUNCTION calculate_mission_progress();

-- =====================================================
-- FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour obtenir les statistiques d'un géomètre
CREATE OR REPLACE FUNCTION get_geometre_dashboard_stats(target_geometre_id UUID)
RETURNS TABLE (
    active_missions BIGINT,
    completed_missions BIGINT,
    total_revenue BIGINT,
    avg_precision DECIMAL,
    monthly_revenue BIGINT,
    equipment_operational INTEGER,
    certifications_active INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(CASE WHEN gm.status IN ('planning', 'survey', 'in_progress') THEN 1 END) as active_missions,
        COUNT(CASE WHEN gm.status = 'completed' THEN 1 END) as completed_missions,
        COALESCE(SUM(gm.estimated_price), 0)::BIGINT as total_revenue,
        COALESCE(AVG(gm.achieved_precision), 0)::DECIMAL as avg_precision,
        COALESCE(SUM(CASE WHEN gm.created_at >= NOW() - INTERVAL '30 days' THEN gm.estimated_price END), 0)::BIGINT as monthly_revenue,
        COALESCE(COUNT(ge.id) FILTER (WHERE ge.status = 'operational'), 0)::INTEGER as equipment_operational,
        COALESCE(COUNT(gc.id) FILTER (WHERE gc.is_active = true), 0)::INTEGER as certifications_active
    FROM geometric_missions gm
    LEFT JOIN geometre_equipment ge ON ge.geometre_id = target_geometre_id
    LEFT JOIN geometre_certifications gc ON gc.geometre_id = target_geometre_id
    WHERE gm.geometre_id = target_geometre_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour vérifier les maintenances dues
CREATE OR REPLACE FUNCTION check_maintenance_due(target_geometre_id UUID)
RETURNS TABLE (
    equipment_name VARCHAR(100),
    next_maintenance DATE,
    days_overdue INTEGER,
    urgency VARCHAR(10)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ge.name,
        ge.next_maintenance,
        (CURRENT_DATE - ge.next_maintenance)::INTEGER as days_overdue,
        CASE 
            WHEN ge.next_maintenance < CURRENT_DATE THEN 'urgent'
            WHEN ge.next_maintenance <= CURRENT_DATE + INTERVAL '7 days' THEN 'warning'
            ELSE 'ok'
        END as urgency
    FROM geometre_equipment ge
    WHERE ge.geometre_id = target_geometre_id
    AND ge.status = 'operational'
    ORDER BY ge.next_maintenance ASC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DONNÉES INITIALES ET EXEMPLES
-- =====================================================

-- Insérer types d'équipements standards
INSERT INTO geometre_equipment (geometre_id, name, brand, model, equipment_type, precision, purchase_date, last_calibration, next_calibration, next_maintenance) VALUES
('00000000-0000-0000-0000-000000000000', 'Station Totale Leica TS16', 'Leica', 'TS16', 'station_totale', '1mm + 1.5ppm', '2023-01-15', '2024-01-15', '2024-07-15', '2024-12-15'),
('00000000-0000-0000-0000-000000000000', 'GPS RTK Trimble R10', 'Trimble', 'R10', 'gps_rtk', '8mm + 1ppm', '2023-02-01', '2024-02-01', '2024-08-01', '2024-11-01'),
('00000000-0000-0000-0000-000000000000', 'Drone DJI Phantom 4 RTK', 'DJI', 'Phantom 4 RTK', 'drone', '1.5cm + 1ppm', '2023-03-10', '2024-01-20', '2024-04-20', '2024-09-10')
ON CONFLICT DO NOTHING;

-- =====================================================
-- POLITIQUES DE SÉCURITÉ (RLS)
-- =====================================================

-- Activer RLS sur les tables sensibles
ALTER TABLE geometric_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE geometre_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_reports ENABLE ROW LEVEL SECURITY;

-- Politiques pour les missions (géomètres voient leurs missions)
CREATE POLICY "Geometres can view their missions" ON geometric_missions
    FOR SELECT USING (auth.uid() = geometre_id);

CREATE POLICY "Geometres can create missions" ON geometric_missions
    FOR INSERT WITH CHECK (auth.uid() = geometre_id);

CREATE POLICY "Geometres can update their missions" ON geometric_missions
    FOR UPDATE USING (auth.uid() = geometre_id);

-- Politiques pour les tâches
CREATE POLICY "Access tasks of own missions" ON mission_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM geometric_missions gm 
            WHERE gm.id = mission_tasks.mission_id 
            AND gm.geometre_id = auth.uid()
        )
    );

-- Politiques pour les mesures
CREATE POLICY "Access measurements of own missions" ON field_measurements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM geometric_missions gm 
            WHERE gm.id = field_measurements.mission_id 
            AND gm.geometre_id = auth.uid()
        )
    );

-- Politiques pour les équipements
CREATE POLICY "Geometres can manage their equipment" ON geometre_equipment
    FOR ALL USING (auth.uid() = geometre_id);

-- =====================================================
-- COMMENTAIRES DE DOCUMENTATION
-- =====================================================

COMMENT ON TABLE geometric_missions IS 'Missions techniques des géomètres-experts';
COMMENT ON TABLE mission_tasks IS 'Tâches détaillées par mission';
COMMENT ON TABLE field_measurements IS 'Mesures et relevés terrain';
COMMENT ON TABLE geometre_equipment IS 'Équipements techniques des géomètres';
COMMENT ON TABLE equipment_checks IS 'Vérifications et maintenance équipements';
COMMENT ON TABLE mission_reports IS 'Rapports techniques générés';
COMMENT ON TABLE geometre_metrics IS 'Métriques de performance des géomètres';
COMMENT ON TABLE geometre_certifications IS 'Certifications professionnelles';

COMMENT ON FUNCTION get_geometre_dashboard_stats IS 'Statistiques complètes pour dashboard géomètre';
COMMENT ON FUNCTION check_maintenance_due IS 'Vérification des maintenances d équipements dues';
