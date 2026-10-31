-- ========================================
-- SCRIPT SQL COMPLET - DASHBOARD PARTICULIER
-- Tables pour suivi terrains, zones communales, projets promoteurs
-- Date: 2025-10-08
-- ORDRE CORRIGÉ: Tables référencées d'abord
-- ========================================

-- Activer l'extension UUID (au cas où)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. TABLE COMMUNAL_ZONES (Zones communales) - CRÉÉE EN PREMIER
-- ========================================
CREATE TABLE IF NOT EXISTS communal_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identification
  zone_code VARCHAR(50) UNIQUE,
  commune VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  zone_type VARCHAR(100) DEFAULT 'résidentielle',
  
  -- Superficie
  total_surface_area NUMERIC(10,2),
  lot_size NUMERIC(10,2),
  lots_total INTEGER DEFAULT 0,
  lots_available INTEGER DEFAULT 0,
  price_per_lot NUMERIC(12,2),
  
  -- Critères éligibilité
  eligibility_criteria JSONB DEFAULT '{}',
  
  -- Localisation
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  address TEXT,
  
  -- Documents
  master_plan_url TEXT,
  zoning_certificate_url TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'available',
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_communal_zones_commune ON communal_zones(commune);
CREATE INDEX IF NOT EXISTS idx_communal_zones_status ON communal_zones(status);
CREATE INDEX IF NOT EXISTS idx_communal_zones_type ON communal_zones(zone_type);

-- RLS
ALTER TABLE communal_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Communal zones are viewable by everyone" ON communal_zones
  FOR SELECT USING (true);

-- ========================================
-- 2. TABLE DEVELOPER_PROJECTS (Projets promoteurs) - CRÉÉE EN SECOND
-- ========================================
CREATE TABLE IF NOT EXISTS developer_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_id UUID REFERENCES profiles(id) NOT NULL,
  
  -- Informations projet
  project_code VARCHAR(50) UNIQUE,
  title VARCHAR(255) NOT NULL,
  developer_name VARCHAR(255),
  project_type VARCHAR(100),
  
  -- Localisation
  location VARCHAR(255),
  city VARCHAR(100),
  district VARCHAR(100),
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  address TEXT,
  
  -- Description
  description TEXT,
  features JSONB DEFAULT '[]',
  
  -- Unités disponibles
  total_units INTEGER DEFAULT 0,
  available_units INTEGER DEFAULT 0,
  unit_types JSONB DEFAULT '[]',
  
  -- Prix
  price_min NUMERIC(12,2),
  price_max NUMERIC(12,2),
  
  -- Dates
  launch_date DATE,
  estimated_completion DATE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pre_commercialisation',
  
  -- Médias
  images JSONB DEFAULT '[]',
  plans_3d JSONB DEFAULT '[]',
  brochure_url TEXT,
  virtual_tour_url TEXT,
  
  -- Critères candidature
  eligibility_criteria JSONB DEFAULT '{}',
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_dev_projects_developer ON developer_projects(developer_id);
CREATE INDEX IF NOT EXISTS idx_dev_projects_city ON developer_projects(city);
CREATE INDEX IF NOT EXISTS idx_dev_projects_status ON developer_projects(status);
CREATE INDEX IF NOT EXISTS idx_dev_projects_type ON developer_projects(project_type);

-- RLS
ALTER TABLE developer_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Developer projects are viewable by everyone" ON developer_projects
  FOR SELECT USING (true);

CREATE POLICY "Developers can insert their own projects" ON developer_projects
  FOR INSERT WITH CHECK (auth.uid() = developer_id);

CREATE POLICY "Developers can update their own projects" ON developer_projects
  FOR UPDATE USING (auth.uid() = developer_id);

-- ========================================
-- 3. TABLE FAVORITES (Multi-types) - MAINTENANT ON PEUT LA CRÉER
-- ========================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- References (NULL si pas ce type)
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  communal_zone_id UUID REFERENCES communal_zones(id) ON DELETE CASCADE,
  developer_project_id UUID REFERENCES developer_projects(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Contraintes : un seul type à la fois
  CONSTRAINT check_single_favorite_type CHECK (
    (property_id IS NOT NULL AND communal_zone_id IS NULL AND developer_project_id IS NULL) OR
    (property_id IS NULL AND communal_zone_id IS NOT NULL AND developer_project_id IS NULL) OR
    (property_id IS NULL AND communal_zone_id IS NULL AND developer_project_id IS NOT NULL)
  )
);

-- Index
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property ON favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_zone ON favorites(communal_zone_id);
CREATE INDEX IF NOT EXISTS idx_favorites_project ON favorites(developer_project_id);

-- RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 4. TABLE COMMUNAL_ZONE_REQUESTS (Demandes zones)
-- ========================================
CREATE TABLE IF NOT EXISTS communal_zone_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  zone_id UUID REFERENCES communal_zones(id) NOT NULL,
  
  -- Identification
  request_number VARCHAR(50) UNIQUE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'submitted',
  progress_percentage INTEGER DEFAULT 0,
  current_step VARCHAR(255),
  next_step VARCHAR(255),
  deadline_date DATE,
  priority VARCHAR(20) DEFAULT 'normale',
  
  -- Documents (JSONB array)
  documents JSONB DEFAULT '[]',
  
  -- Historique (JSONB array)
  history JSONB DEFAULT '[]',
  
  -- Dates
  submitted_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  
  -- Attribution
  attribution_number VARCHAR(50),
  attribution_certificate_url TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_czr_user ON communal_zone_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_czr_zone ON communal_zone_requests(zone_id);
CREATE INDEX IF NOT EXISTS idx_czr_status ON communal_zone_requests(status);
CREATE INDEX IF NOT EXISTS idx_czr_number ON communal_zone_requests(request_number);

-- RLS
ALTER TABLE communal_zone_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own zone requests" ON communal_zone_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own zone requests" ON communal_zone_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own zone requests" ON communal_zone_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- ========================================
-- 5. TABLE DEVELOPER_PROJECT_APPLICATIONS (Candidatures)
-- ========================================
CREATE TABLE IF NOT EXISTS developer_project_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES developer_projects(id) NOT NULL,
  developer_id UUID REFERENCES profiles(id) NOT NULL,
  
  -- Identification
  application_number VARCHAR(50) UNIQUE,
  
  -- Détails candidature
  unit_type VARCHAR(100),
  unit_surface VARCHAR(50),
  total_price NUMERIC(12,2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'submitted',
  progress_percentage INTEGER DEFAULT 0,
  current_step VARCHAR(255),
  next_step VARCHAR(255),
  deadline_date DATE,
  priority VARCHAR(20) DEFAULT 'normale',
  
  -- Documents (JSONB array)
  documents JSONB DEFAULT '[]',
  
  -- Historique (JSONB array)
  history JSONB DEFAULT '[]',
  
  -- Dates
  submitted_at TIMESTAMP DEFAULT NOW(),
  interview_date TIMESTAMP,
  decision_date TIMESTAMP,
  decision_reason TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_dpa_user ON developer_project_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_dpa_project ON developer_project_applications(project_id);
CREATE INDEX IF NOT EXISTS idx_dpa_developer ON developer_project_applications(developer_id);
CREATE INDEX IF NOT EXISTS idx_dpa_status ON developer_project_applications(status);
CREATE INDEX IF NOT EXISTS idx_dpa_number ON developer_project_applications(application_number);

-- RLS
ALTER TABLE developer_project_applications ENABLE ROW LEVEL SECURITY;

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
-- 6. TABLE OFFERS (Offres terrains privés)
-- ========================================
CREATE TABLE IF NOT EXISTS offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES profiles(id) NOT NULL,
  
  -- Offre
  offered_amount NUMERIC(12,2) NOT NULL,
  message TEXT,
  proof_of_funds_url TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  
  -- Contre-offre
  counter_offer_amount NUMERIC(12,2),
  counter_offer_message TEXT,
  
  -- Dates
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  accepted_at TIMESTAMP,
  rejected_at TIMESTAMP
);

-- Index
CREATE INDEX IF NOT EXISTS idx_offers_buyer ON offers(buyer_id);
CREATE INDEX IF NOT EXISTS idx_offers_seller ON offers(seller_id);
CREATE INDEX IF NOT EXISTS idx_offers_property ON offers(property_id);
CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);

-- RLS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can view their own offers" ON offers
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can insert offers" ON offers
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update their own offers" ON offers
  FOR UPDATE USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update offers for their properties" ON offers
  FOR UPDATE USING (auth.uid() = seller_id);

-- ========================================
-- 7. TABLE VISITS (Visites terrains)
-- ========================================
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  visitor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) NOT NULL,
  
  -- Dates
  requested_date TIMESTAMP NOT NULL,
  confirmed_date TIMESTAMP,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  
  -- Messages
  visitor_message TEXT,
  owner_instructions TEXT,
  
  -- Post-visite
  post_visit_notes TEXT,
  post_visit_rating INTEGER CHECK (post_visit_rating >= 1 AND post_visit_rating <= 5),
  post_visit_date TIMESTAMP,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_visits_visitor ON visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visits_owner ON visits(owner_id);
CREATE INDEX IF NOT EXISTS idx_visits_property ON visits(property_id);
CREATE INDEX IF NOT EXISTS idx_visits_status ON visits(status);
CREATE INDEX IF NOT EXISTS idx_visits_requested_date ON visits(requested_date);

-- RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own visits" ON visits
  FOR SELECT USING (auth.uid() = visitor_id OR auth.uid() = owner_id);

CREATE POLICY "Users can insert visit requests" ON visits
  FOR INSERT WITH CHECK (auth.uid() = visitor_id);

CREATE POLICY "Users can update their own visits" ON visits
  FOR UPDATE USING (auth.uid() = visitor_id);

CREATE POLICY "Owners can update visits for their properties" ON visits
  FOR UPDATE USING (auth.uid() = owner_id);

-- ========================================
-- 8. TABLE SAVED_SEARCHES (Recherches sauvegardées)
-- ========================================
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  name VARCHAR(255) NOT NULL,
  filters JSONB NOT NULL,
  
  -- Alertes
  alert_enabled BOOLEAN DEFAULT true,
  alert_frequency VARCHAR(20) DEFAULT 'daily',
  last_alert_sent TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);

-- RLS
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved searches" ON saved_searches
  FOR ALL USING (auth.uid() = user_id);

-- ========================================
-- 9. TABLE LOAN_APPLICATIONS (Demandes financement)
-- ========================================
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id),
  bank_id UUID REFERENCES profiles(id),
  
  -- Prêt
  loan_amount NUMERIC(12,2) NOT NULL,
  down_payment NUMERIC(12,2),
  loan_duration_years INTEGER,
  interest_rate NUMERIC(5,2),
  monthly_payment NUMERIC(10,2),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  
  -- Documents
  documents JSONB DEFAULT '[]',
  bank_response TEXT,
  
  -- Dates
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP
);

-- Index
CREATE INDEX IF NOT EXISTS idx_loan_apps_user ON loan_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_apps_bank ON loan_applications(bank_id);
CREATE INDEX IF NOT EXISTS idx_loan_apps_property ON loan_applications(property_id);

-- RLS
ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own loan applications" ON loan_applications
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = bank_id);

CREATE POLICY "Users can insert their own loan applications" ON loan_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own loan applications" ON loan_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- ========================================
-- 10. TABLE NOTIFICATIONS (Déjà existe normalement)
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  link VARCHAR(500),
  related_id UUID,
  
  read_at TIMESTAMP,
  archived_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ========================================
-- 11. TABLE SUPPORT_TICKETS (Déjà existe normalement)
-- ========================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_type VARCHAR(50),
  
  category VARCHAR(50),
  priority VARCHAR(20) DEFAULT 'normal',
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  
  status VARCHAR(20) DEFAULT 'open',
  
  assigned_to UUID REFERENCES profiles(id),
  attachments JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);

-- RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can insert their own tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON support_tickets
  FOR UPDATE USING (auth.uid() = user_id);

-- ========================================
-- 12. TABLE TICKET_MESSAGES
-- ========================================
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_sender ON ticket_messages(sender_id);

-- RLS
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their tickets" ON ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_tickets st
      WHERE st.id = ticket_id
      AND (st.user_id = auth.uid() OR st.assigned_to = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages for their tickets" ON ticket_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM support_tickets st
      WHERE st.id = ticket_id
      AND (st.user_id = auth.uid() OR st.assigned_to = auth.uid())
    )
  );

-- ========================================
-- 13. TABLE PROPERTY_VIEWS (Historique vues)
-- ========================================
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  
  viewed_at TIMESTAMP DEFAULT NOW(),
  duration_seconds INTEGER,
  device_type VARCHAR(20)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_property_views_user ON property_views(user_id);
CREATE INDEX IF NOT EXISTS idx_property_views_property ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_date ON property_views(viewed_at);

-- RLS
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own property views" ON property_views
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Property views can be inserted" ON property_views
  FOR INSERT WITH CHECK (true);

-- ========================================
-- 14. TABLE USER_DOCUMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS user_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  category VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  
  -- Vérification
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMP,
  
  expires_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_documents_user ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_category ON user_documents(category);

-- RLS
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents" ON user_documents
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = verified_by);

CREATE POLICY "Users can insert their own documents" ON user_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON user_documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON user_documents
  FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- 15. TABLE CONSTRUCTION_REQUESTS
-- ========================================
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

-- Index
CREATE INDEX IF NOT EXISTS idx_construction_requests_user ON construction_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_construction_requests_status ON construction_requests(status);

-- RLS
ALTER TABLE construction_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own construction requests" ON construction_requests
  FOR ALL USING (auth.uid() = user_id);

-- ========================================
-- FIN DU SCRIPT
-- Tables créées dans le bon ordre !
-- ========================================
