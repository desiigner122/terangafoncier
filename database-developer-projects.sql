-- Base de données spécialisée pour projets promoteurs
-- Support VEFA, construction, livraison

-- Table des promoteurs/développeurs
CREATE TABLE IF NOT EXISTS developer_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  developer_id UUID REFERENCES auth.users(id) NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  project_description TEXT,
  location JSONB NOT NULL, -- adresse, coordonnées, quartier
  project_type VARCHAR(50) NOT NULL, -- 'RESIDENCE', 'VILLA', 'COMMERCIAL'
  construction_phase VARCHAR(50) DEFAULT 'PRE_COMMERCIALISATION',
  total_units INTEGER NOT NULL,
  available_units INTEGER NOT NULL,
  price_range JSONB NOT NULL, -- {min: number, max: number, currency: 'XOF'}
  delivery_estimate DATE,
  construction_start_date DATE,
  project_images JSONB DEFAULT '[]'::jsonb, -- URLs des images/rendus
  technical_specs JSONB DEFAULT '{}'::jsonb, -- spécifications techniques
  certifications JSONB DEFAULT '[]'::jsonb, -- certifications environnementales
  amenities JSONB DEFAULT '[]'::jsonb, -- équipements/services
  project_status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT valid_construction_phase CHECK (
    construction_phase IN (
      'PRE_COMMERCIALISATION', 'COMMERCIALISATION', 'CONSTRUCTION_STARTED',
      'FOUNDATIONS', 'STRUCTURE', 'ROOFING', 'CLOSING', 'INTERIOR_WORKS',
      'FINISHING', 'DELIVERED', 'COMPLETED'
    )
  ),
  CONSTRAINT valid_project_type CHECK (
    project_type IN ('RESIDENCE', 'VILLA', 'COMMERCIAL', 'MIXED')
  )
);

-- Table des unités/lots dans chaque projet
CREATE TABLE IF NOT EXISTS project_units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES developer_projects(id) ON DELETE CASCADE,
  unit_number VARCHAR(20) NOT NULL,
  unit_type VARCHAR(50) NOT NULL, -- 'APARTMENT', 'VILLA', 'STUDIO'
  floor_number INTEGER,
  surface_area DECIMAL(8,2) NOT NULL, -- m²
  rooms_count INTEGER,
  bedrooms_count INTEGER,
  bathrooms_count INTEGER,
  balcony_area DECIMAL(6,2) DEFAULT 0,
  parking_spaces INTEGER DEFAULT 0,
  storage_included BOOLEAN DEFAULT FALSE,
  orientation VARCHAR(20), -- 'NORTH', 'SOUTH', 'EAST', 'WEST'
  sale_price DECIMAL(15,2) NOT NULL,
  reservation_amount DECIMAL(15,2) NOT NULL,
  unit_status VARCHAR(50) DEFAULT 'AVAILABLE',
  unit_plans JSONB DEFAULT '[]'::jsonb, -- plans 2D/3D
  specific_features JSONB DEFAULT '[]'::jsonb,
  energy_label VARCHAR(10), -- A, B, C, D, E, F, G
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(project_id, unit_number),
  CONSTRAINT valid_unit_status CHECK (
    unit_status IN ('AVAILABLE', 'RESERVED', 'SOLD', 'CONSTRUCTION', 'DELIVERED')
  )
);

-- Table des cas d'achat VEFA (extension de purchase_cases)
CREATE TABLE IF NOT EXISTS vefa_purchase_cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id VARCHAR(50) UNIQUE NOT NULL, -- lien avec purchase_cases
  project_id UUID REFERENCES developer_projects(id) NOT NULL,
  unit_id UUID REFERENCES project_units(id) NOT NULL,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  developer_id UUID REFERENCES auth.users(id) NOT NULL,
  
  -- Données VEFA spécifiques
  reservation_date TIMESTAMP WITH TIME ZONE,
  vefa_contract_date TIMESTAMP WITH TIME ZONE,
  expected_delivery_date DATE NOT NULL,
  actual_delivery_date DATE,
  
  -- Paiements échelonnés VEFA
  payment_schedule JSONB NOT NULL DEFAULT '[]'::jsonb, -- échéancier
  payments_made JSONB DEFAULT '[]'::jsonb, -- paiements effectués
  
  -- Suivi construction
  construction_progress INTEGER DEFAULT 0, -- pourcentage 0-100
  construction_milestones JSONB DEFAULT '[]'::jsonb, -- étapes validées
  construction_photos JSONB DEFAULT '[]'::jsonb, -- photos par étape
  technical_inspections JSONB DEFAULT '[]'::jsonb, -- contrôles techniques
  
  -- Documents VEFA
  reservation_contract_url TEXT,
  vefa_contract_url TEXT,
  delivery_guarantee_url TEXT,
  insurance_damage_url TEXT, -- assurance dommages-ouvrage
  completion_certificate_url TEXT,
  
  -- Garanties
  warranty_start_date DATE,
  warranty_completion_date DATE, -- garantie de parfait achèvement (1 an)
  warranty_biennial_date DATE, -- garantie biennale (2 ans)
  warranty_decennial_date DATE, -- garantie décennale (10 ans)
  
  current_status VARCHAR(50) DEFAULT 'PROSPECT',
  status_history JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_vefa_status CHECK (
    current_status IN (
      'PROSPECT', 'RESERVATION', 'VEFA_CONTRACT', 'CONSTRUCTION_STARTED',
      'FOUNDATIONS', 'STRUCTURE', 'ROOFING', 'CLOSING', 'INTERIOR_WORKS',
      'FINISHING', 'PRE_DELIVERY', 'DELIVERED', 'WARRANTY_PERIOD', 'COMPLETED',
      'RESERVATION_CANCELLED', 'CONSTRUCTION_DELAYED', 'CONSTRUCTION_RESUMED'
    )
  )
);

-- Table des étapes de construction avec validation
CREATE TABLE IF NOT EXISTS construction_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vefa_case_id UUID REFERENCES vefa_purchase_cases(id) ON DELETE CASCADE,
  milestone_type VARCHAR(50) NOT NULL,
  milestone_name VARCHAR(100) NOT NULL,
  planned_date DATE NOT NULL,
  actual_date DATE,
  completion_percentage DECIMAL(5,2) NOT NULL,
  validation_status VARCHAR(50) DEFAULT 'PENDING',
  
  -- Validation et contrôles
  validated_by UUID REFERENCES auth.users(id), -- inspecteur/architecte
  validation_date TIMESTAMP WITH TIME ZONE,
  validation_documents JSONB DEFAULT '[]'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  technical_notes TEXT,
  
  -- Blockchain hash pour intégrité
  blockchain_hash VARCHAR(64),
  blockchain_block_number INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_milestone_type CHECK (
    milestone_type IN (
      'FOUNDATIONS', 'STRUCTURE', 'ROOFING', 'CLOSING', 
      'INTERIOR_WORKS', 'FINISHING', 'TECHNICAL_INSPECTION',
      'DELIVERY_PREPARATION', 'FINAL_INSPECTION'
    )
  ),
  CONSTRAINT valid_validation_status CHECK (
    validation_status IN ('PENDING', 'VALIDATED', 'REJECTED', 'REQUIRES_FIX')
  )
);

-- Table des notifications spécialisées projets
CREATE TABLE IF NOT EXISTS project_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vefa_case_id UUID REFERENCES vefa_purchase_cases(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  
  -- Données spécifiques
  milestone_data JSONB, -- pour notifications étapes
  photo_urls JSONB DEFAULT '[]'::jsonb,
  document_urls JSONB DEFAULT '[]'::jsonb,
  
  -- État
  status VARCHAR(20) DEFAULT 'unread',
  read_at TIMESTAMP WITH TIME ZONE,
  archived_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_notification_type CHECK (
    notification_type IN (
      'VEFA_SIGNED', 'CONSTRUCTION_STARTED', 'CONSTRUCTION_MILESTONE',
      'CONSTRUCTION_DELAY', 'PRE_DELIVERY', 'PROJECT_DELIVERED',
      'WARRANTY_REMINDER', 'PAYMENT_DUE', 'INSPECTION_SCHEDULED'
    )
  )
);

-- Table des paiements VEFA échelonnés
CREATE TABLE IF NOT EXISTS vefa_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vefa_case_id UUID REFERENCES vefa_purchase_cases(id) ON DELETE CASCADE,
  payment_order INTEGER NOT NULL, -- 1, 2, 3...
  payment_type VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  
  -- Conditions de déclenchement
  trigger_milestone VARCHAR(50), -- étape qui déclenche le paiement
  trigger_date DATE,
  
  -- Montants
  amount_due DECIMAL(15,2) NOT NULL,
  amount_paid DECIMAL(15,2) DEFAULT 0,
  payment_percentage DECIMAL(5,2), -- % du prix total
  
  -- Dates
  due_date DATE NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE,
  
  -- Statut
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  transaction_reference VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_payment_type CHECK (
    payment_type IN (
      'RESERVATION', 'CONTRACT_SIGNING', 'CONSTRUCTION_START',
      'FOUNDATIONS', 'STRUCTURE', 'CLOSING', 'DELIVERY', 'FINAL'
    )
  ),
  CONSTRAINT valid_payment_status CHECK (
    payment_status IN ('pending', 'paid', 'overdue', 'cancelled', 'refunded')
  )
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_developer_projects_location ON developer_projects USING GIN (location);
CREATE INDEX IF NOT EXISTS idx_developer_projects_status ON developer_projects (project_status, construction_phase);
CREATE INDEX IF NOT EXISTS idx_project_units_project ON project_units (project_id, unit_status);
CREATE INDEX IF NOT EXISTS idx_project_units_price ON project_units (sale_price);
CREATE INDEX IF NOT EXISTS idx_vefa_cases_client ON vefa_purchase_cases (client_id, current_status);
CREATE INDEX IF NOT EXISTS idx_vefa_cases_project ON vefa_purchase_cases (project_id, current_status);
CREATE INDEX IF NOT EXISTS idx_construction_milestones_case ON construction_milestones (vefa_case_id, milestone_type);
CREATE INDEX IF NOT EXISTS idx_project_notifications_recipient ON project_notifications (recipient_id, status);
CREATE INDEX IF NOT EXISTS idx_vefa_payments_case ON vefa_payments (vefa_case_id, payment_status);

-- Fonctions de mise à jour automatique
CREATE OR REPLACE FUNCTION update_developer_projects_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_project_units_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_vefa_cases_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_developer_projects_timestamp_trigger
  BEFORE UPDATE ON developer_projects
  FOR EACH ROW EXECUTE FUNCTION update_developer_projects_timestamp();

CREATE TRIGGER update_project_units_timestamp_trigger
  BEFORE UPDATE ON project_units
  FOR EACH ROW EXECUTE FUNCTION update_project_units_timestamp();

CREATE TRIGGER update_vefa_cases_timestamp_trigger
  BEFORE UPDATE ON vefa_purchase_cases
  FOR EACH ROW EXECUTE FUNCTION update_vefa_cases_timestamp();

-- Fonction pour créer automatiquement les étapes de construction
CREATE OR REPLACE FUNCTION create_construction_milestones(case_id UUID, expected_delivery DATE)
RETURNS VOID AS $$
DECLARE
  construction_start DATE := CURRENT_DATE + INTERVAL '30 days';
  total_duration INTERVAL := expected_delivery - construction_start;
BEGIN
  -- Créer les étapes avec répartition temporelle
  INSERT INTO construction_milestones (vefa_case_id, milestone_type, milestone_name, planned_date, completion_percentage) VALUES
    (case_id, 'FOUNDATIONS', 'Fondations et terrassement', construction_start + (total_duration * 0.15), 15.00),
    (case_id, 'STRUCTURE', 'Gros œuvre et structure', construction_start + (total_duration * 0.35), 35.00),
    (case_id, 'ROOFING', 'Toiture et étanchéité', construction_start + (total_duration * 0.50), 50.00),
    (case_id, 'CLOSING', 'Clos et couvert', construction_start + (total_duration * 0.65), 65.00),
    (case_id, 'INTERIOR_WORKS', 'Second œuvre', construction_start + (total_duration * 0.80), 80.00),
    (case_id, 'FINISHING', 'Finitions et équipements', construction_start + (total_duration * 0.95), 95.00),
    (case_id, 'FINAL_INSPECTION', 'Inspection finale', expected_delivery - INTERVAL '7 days', 100.00);
END;
$$ LANGUAGE plpgsql;

-- Politiques RLS (Row Level Security)
ALTER TABLE developer_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE vefa_purchase_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vefa_payments ENABLE ROW LEVEL SECURITY;

-- Politique pour les promoteurs (peuvent voir leurs projets)
CREATE POLICY developer_projects_policy ON developer_projects
  FOR ALL USING (developer_id = auth.uid() OR auth.uid() IN (
    SELECT client_id FROM vefa_purchase_cases WHERE project_id = developer_projects.id
  ));

-- Politique pour les clients (peuvent voir les projets où ils ont un cas)
CREATE POLICY vefa_cases_policy ON vefa_purchase_cases
  FOR ALL USING (client_id = auth.uid() OR developer_id = auth.uid());

-- Politique pour les étapes de construction
CREATE POLICY construction_milestones_policy ON construction_milestones
  FOR ALL USING (
    vefa_case_id IN (
      SELECT id FROM vefa_purchase_cases 
      WHERE client_id = auth.uid() OR developer_id = auth.uid()
    )
  );

-- Politique pour les notifications
CREATE POLICY project_notifications_policy ON project_notifications
  FOR ALL USING (recipient_id = auth.uid());

-- Politique pour les paiements
CREATE POLICY vefa_payments_policy ON vefa_payments
  FOR ALL USING (
    vefa_case_id IN (
      SELECT id FROM vefa_purchase_cases 
      WHERE client_id = auth.uid() OR developer_id = auth.uid()
    )
  );