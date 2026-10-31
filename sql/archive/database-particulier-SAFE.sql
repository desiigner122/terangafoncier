-- ========================================
-- SCRIPT SQL COMPLET - DASHBOARD PARTICULIER
-- VERSION SAFE: Drop des policies existantes + CREATE EXTENSION
-- Date: 2025-10-08
-- ========================================

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. TABLE COMMUNAL_ZONES
-- ========================================
CREATE TABLE IF NOT EXISTS communal_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_code VARCHAR(50) UNIQUE,
  commune VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  zone_type VARCHAR(100) DEFAULT 'résidentielle',
  total_surface_area NUMERIC(10,2),
  lot_size NUMERIC(10,2),
  lots_total INTEGER DEFAULT 0,
  lots_available INTEGER DEFAULT 0,
  price_per_lot NUMERIC(12,2),
  eligibility_criteria JSONB DEFAULT '{}',
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  address TEXT,
  master_plan_url TEXT,
  zoning_certificate_url TEXT,
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_communal_zones_commune ON communal_zones(commune);
CREATE INDEX IF NOT EXISTS idx_communal_zones_status ON communal_zones(status);
CREATE INDEX IF NOT EXISTS idx_communal_zones_type ON communal_zones(zone_type);

ALTER TABLE communal_zones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Communal zones are viewable by everyone" ON communal_zones;
CREATE POLICY "Communal zones are viewable by everyone" ON communal_zones
  FOR SELECT USING (true);

-- ========================================
-- 2. TABLE DEVELOPER_PROJECTS
-- ========================================
CREATE TABLE IF NOT EXISTS developer_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_id UUID REFERENCES profiles(id) NOT NULL,
  project_code VARCHAR(50) UNIQUE,
  title VARCHAR(255) NOT NULL,
  developer_name VARCHAR(255),
  project_type VARCHAR(100),
  location VARCHAR(255),
  city VARCHAR(100),
  district VARCHAR(100),
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  address TEXT,
  description TEXT,
  features JSONB DEFAULT '[]',
  total_units INTEGER DEFAULT 0,
  available_units INTEGER DEFAULT 0,
  unit_types JSONB DEFAULT '[]',
  price_min NUMERIC(12,2),
  price_max NUMERIC(12,2),
  launch_date DATE,
  estimated_completion DATE,
  status VARCHAR(50) DEFAULT 'pre_commercialisation',
  images JSONB DEFAULT '[]',
  plans_3d JSONB DEFAULT '[]',
  brochure_url TEXT,
  virtual_tour_url TEXT,
  eligibility_criteria JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dev_projects_developer ON developer_projects(developer_id);
CREATE INDEX IF NOT EXISTS idx_dev_projects_city ON developer_projects(city);
CREATE INDEX IF NOT EXISTS idx_dev_projects_status ON developer_projects(status);
CREATE INDEX IF NOT EXISTS idx_dev_projects_type ON developer_projects(project_type);

ALTER TABLE developer_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Developer projects are viewable by everyone" ON developer_projects;
DROP POLICY IF EXISTS "Developers can insert their own projects" ON developer_projects;
DROP POLICY IF EXISTS "Developers can update their own projects" ON developer_projects;

CREATE POLICY "Developer projects are viewable by everyone" ON developer_projects
  FOR SELECT USING (true);

CREATE POLICY "Developers can insert their own projects" ON developer_projects
  FOR INSERT WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can update their own projects" ON developer_projects
  FOR UPDATE USING (auth.uid() = developer_id);

-- ========================================
-- 3. TABLE FAVORITES
-- ========================================
DROP TABLE IF EXISTS favorites CASCADE;

CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  communal_zone_id UUID REFERENCES communal_zones(id) ON DELETE CASCADE,
  developer_project_id UUID REFERENCES developer_projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ajouter la contrainte APRÈS la création
ALTER TABLE favorites ADD CONSTRAINT check_single_favorite_type CHECK (
  (property_id IS NOT NULL AND communal_zone_id IS NULL AND developer_project_id IS NULL) OR
  (property_id IS NULL AND communal_zone_id IS NOT NULL AND developer_project_id IS NULL) OR
  (property_id IS NULL AND communal_zone_id IS NULL AND developer_project_id IS NOT NULL)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_property ON favorites(property_id);
CREATE INDEX idx_favorites_zone ON favorites(communal_zone_id);
CREATE INDEX idx_favorites_project ON favorites(developer_project_id);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can insert their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;

CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 4. TABLE COMMUNAL_ZONE_REQUESTS
-- ========================================
CREATE TABLE IF NOT EXISTS communal_zone_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  zone_id UUID REFERENCES communal_zones(id) NOT NULL,
  request_number VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'submitted',
  progress_percentage INTEGER DEFAULT 0,
  current_step VARCHAR(255),
  next_step VARCHAR(255),
  deadline_date DATE,
  priority VARCHAR(20) DEFAULT 'normale',
  documents JSONB DEFAULT '[]',
  history JSONB DEFAULT '[]',
  submitted_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  attribution_number VARCHAR(50),
  attribution_certificate_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_czr_user ON communal_zone_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_czr_zone ON communal_zone_requests(zone_id);
CREATE INDEX IF NOT EXISTS idx_czr_status ON communal_zone_requests(status);
CREATE INDEX IF NOT EXISTS idx_czr_number ON communal_zone_requests(request_number);

ALTER TABLE communal_zone_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own zone requests" ON communal_zone_requests;
DROP POLICY IF EXISTS "Users can insert their own zone requests" ON communal_zone_requests;
DROP POLICY IF EXISTS "Users can update their own zone requests" ON communal_zone_requests;

CREATE POLICY "Users can view their own zone requests" ON communal_zone_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own zone requests" ON communal_zone_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own zone requests" ON communal_zone_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- ========================================
-- 5. TABLE DEVELOPER_PROJECT_APPLICATIONS
-- ========================================
CREATE TABLE IF NOT EXISTS developer_project_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES developer_projects(id) NOT NULL,
  developer_id UUID REFERENCES profiles(id) NOT NULL,
  application_number VARCHAR(50) UNIQUE,
  unit_type VARCHAR(100),
  unit_surface VARCHAR(50),
  total_price NUMERIC(12,2),
  status VARCHAR(50) DEFAULT 'submitted',
  progress_percentage INTEGER DEFAULT 0,
  current_step VARCHAR(255),
  next_step VARCHAR(255),
  deadline_date DATE,
  priority VARCHAR(20) DEFAULT 'normale',
  documents JSONB DEFAULT '[]',
  history JSONB DEFAULT '[]',
  submitted_at TIMESTAMP DEFAULT NOW(),
  interview_date TIMESTAMP,
  decision_date TIMESTAMP,
  decision_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dpa_user ON developer_project_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_dpa_project ON developer_project_applications(project_id);
CREATE INDEX IF NOT EXISTS idx_dpa_developer ON developer_project_applications(developer_id);
CREATE INDEX IF NOT EXISTS idx_dpa_status ON developer_project_applications(status);
CREATE INDEX IF NOT EXISTS idx_dpa_number ON developer_project_applications(application_number);

ALTER TABLE developer_project_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own applications" ON developer_project_applications;
DROP POLICY IF EXISTS "Users can insert their own applications" ON developer_project_applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON developer_project_applications;
DROP POLICY IF EXISTS "Developers can view applications for their projects" ON developer_project_applications;
DROP POLICY IF EXISTS "Developers can update applications for their projects" ON developer_project_applications;

CREATE POLICY "Users can view their own applications" ON developer_project_applications
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = developer_id);

CREATE POLICY "Users can insert their own applications" ON developer_project_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON developer_project_applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Developers can view applications for their projects" ON developer_project_applications
  FOR SELECT USING (auth.uid() = developer_id);

CREATE POLICY "Developers can update applications for their projects" ON developer_project_applications
  FOR UPDATE USING (auth.uid() = developer_id);

-- ========================================
-- 6. TABLE OFFERS
-- ========================================
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  offered_amount NUMERIC(12,2) NOT NULL,
  message TEXT,
  proof_of_funds_url TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  counter_offer_amount NUMERIC(12,2),
  counter_offer_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  accepted_at TIMESTAMP,
  rejected_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_offers_buyer ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_offers_seller ON offers(seller_id);
CREATE INDEX IF NOT EXISTS idx_offers_property ON offers(property_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Buyers can view their own offers" ON offers;
DROP POLICY IF EXISTS "Buyers can insert offers" ON offers;
DROP POLICY IF EXISTS "Buyers can update their own offers" ON offers;
DROP POLICY IF EXISTS "Sellers can update offers for their properties" ON offers;

CREATE POLICY "Buyers can view their own offers" ON offers
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can insert offers" ON offers
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own offers" ON offers
  FOR UPDATE USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update offers for their properties" ON offers
  FOR UPDATE USING (auth.uid() = seller_id);

-- ========================================
-- 7. TABLE VISITS
-- ========================================
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  visitor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  requested_date TIMESTAMP NOT NULL,
  confirmed_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending',
  visitor_message TEXT,
  owner_instructions TEXT,
  post_visit_notes TEXT,
  post_visit_rating INTEGER CHECK (post_visit_rating >= 1 AND post_visit_rating <= 5),
  post_visit_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_visitor ON visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visits_owner ON visits(owner_id);
CREATE INDEX IF NOT EXISTS idx_visits_property ON visits(property_id);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);
CREATE INDEX IF NOT EXISTS idx_visits_requested_date ON visits(requested_date);

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own visits" ON visits;
DROP POLICY IF EXISTS "Users can insert visit requests" ON visits;
DROP POLICY IF EXISTS "Users can update their own visits" ON visits;
DROP POLICY IF EXISTS "Owners can update visits for their properties" ON visits;

CREATE POLICY "Users can view their own visits" ON visits
  FOR SELECT USING (auth.uid() = visitor_id OR auth.uid() = owner_id);

CREATE POLICY "Users can insert visit requests" ON visits
  FOR INSERT WITH CHECK (auth.uid() = visitor_id);

CREATE POLICY "Users can update their own visits" ON visits
  FOR UPDATE USING (auth.uid() = visitor_id);

CREATE POLICY "Owners can update visits for their properties" ON visits
  FOR UPDATE USING (auth.uid() = owner_id);

-- ========================================
-- 8-15. TABLES RESTANTES (compactes)
-- ========================================

CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  filters JSONB NOT NULL,
  alert_enabled BOOLEAN DEFAULT true,
  alert_frequency VARCHAR(20) DEFAULT 'daily',
  last_alert_sent TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own saved searches" ON saved_searches;
CREATE POLICY "Users can manage their own saved searches" ON saved_searches FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id),
  bank_id UUID REFERENCES profiles(id),
  loan_amount NUMERIC(12,2) NOT NULL,
  down_payment NUMERIC(12,2),
  loan_duration_years INTEGER,
  interest_rate NUMERIC(5,2),
  monthly_payment NUMERIC(10,2),
  status VARCHAR(20) DEFAULT 'pending',
  documents JSONB DEFAULT '[]',
  bank_response TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_loan_apps_user ON loan_applications(user_id);
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own loan applications" ON loan_applications;
CREATE POLICY "Users can view their own loan applications" ON loan_applications FOR SELECT USING (auth.uid() = user_id OR auth.uid() = bank_id);
DROP POLICY IF EXISTS "Users can insert their own loan applications" ON loan_applications;
CREATE POLICY "Users can insert their own loan applications" ON loan_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS construction_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  request_number VARCHAR(50) UNIQUE,
  project_title VARCHAR(255),
  construction_type VARCHAR(100),
  location VARCHAR(255),
  desired_surface NUMERIC(10,2),
  budget_estimate NUMERIC(12,2),
  description TEXT,
  plans_url TEXT,
  status VARCHAR(50) DEFAULT 'submitted',
  progress_percentage INTEGER DEFAULT 0,
  documents JSONB DEFAULT '[]',
  submitted_at TIMESTAMP DEFAULT NOW(),
  estimated_start_date DATE,
  estimated_completion_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_construction_requests_user ON construction_requests(user_id);
ALTER TABLE construction_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own construction requests" ON construction_requests;
CREATE POLICY "Users can manage their own construction requests" ON construction_requests FOR ALL USING (auth.uid() = user_id);

-- ========================================
-- FIN - VERSION SAFE
-- ========================================
