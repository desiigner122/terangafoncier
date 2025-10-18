-- ============================================
-- CRÉATION DE TOUTES LES TABLES MANQUANTES
-- Pour le dashboard vendeur complet
-- Date: 18 Oct 2025
-- ============================================

-- ============================================
-- 1. TABLE: PURCHASE_REQUESTS (Demandes d'achat)
-- ============================================
CREATE TABLE IF NOT EXISTS public.purchase_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  
  quantity INTEGER DEFAULT 1,
  offer_price NUMERIC,
  proposed_terms TEXT,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'urgent')),
  financing_method TEXT,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'negotiating')),
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_purchase_requests_buyer ON public.purchase_requests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_property ON public.purchase_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_status ON public.purchase_requests(status);

-- ============================================
-- 2. TABLE: CASE_TRACKING (Suivi de dossiers)
-- ============================================
CREATE TABLE IF NOT EXISTS public.case_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  case_number TEXT UNIQUE,
  case_status TEXT DEFAULT 'in_progress' CHECK (case_status IN (
    'in_progress', 
    'pending_docs', 
    'pending_payment',
    'pending_signature',
    'completed', 
    'cancelled'
  )),
  
  documents_status JSONB DEFAULT '{}'::jsonb,
  payment_status TEXT,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_tracking_property ON public.case_tracking(property_id);
CREATE INDEX IF NOT EXISTS idx_case_tracking_buyer ON public.case_tracking(buyer_id);
CREATE INDEX IF NOT EXISTS idx_case_tracking_number ON public.case_tracking(case_number);

-- ============================================
-- 3. TABLE: FRAUD_CHECKS (Vérifications antifraud)
-- ============================================
CREATE TABLE IF NOT EXISTS public.fraud_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  
  check_type TEXT CHECK (check_type IN ('identity', 'payment', 'property', 'behavior')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'passed', 'warning', 'failed')),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  
  details JSONB DEFAULT '{}'::jsonb,
  recommendation TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_fraud_checks_user ON public.fraud_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_checks_status ON public.fraud_checks(status);
CREATE INDEX IF NOT EXISTS idx_fraud_checks_risk ON public.fraud_checks(risk_level);

-- ============================================
-- 4. TABLE: GPS_VERIFICATIONS (Vérifications GPS)
-- ============================================
CREATE TABLE IF NOT EXISTS public.gps_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  
  verified_latitude NUMERIC,
  verified_longitude NUMERIC,
  accuracy_meters NUMERIC,
  
  verification_method TEXT, -- mobile_gps, drone, satellite, on_site
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verification_date TIMESTAMP WITH TIME ZONE,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'needs_revision')),
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gps_verifications_property ON public.gps_verifications(property_id);
CREATE INDEX IF NOT EXISTS idx_gps_verifications_status ON public.gps_verifications(status);

-- ============================================
-- 5. TABLE: ANALYTICS_LOGS (Logs analytique)
-- ============================================
CREATE TABLE IF NOT EXISTS public.analytics_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  event_type TEXT,
  event_category TEXT,
  
  event_data JSONB DEFAULT '{}'::jsonb,
  page_url TEXT,
  referrer TEXT,
  
  ip_address TEXT,
  user_agent TEXT,
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_logs_user ON public.analytics_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_logs_type ON public.analytics_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_logs_timestamp ON public.analytics_logs(timestamp DESC);

-- ============================================
-- 6. TABLE: SUPPORT_TICKETS (Tickets support)
-- ============================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  subject TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN (
    'technical', 
    'billing', 
    'legal', 
    'general',
    'bug_report'
  )),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')),
  
  attachments JSONB DEFAULT '[]'::jsonb,
  resolution_notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON public.support_tickets(priority);

-- ============================================
-- 7. TABLE: DIGITAL_SERVICES (Services digitaux)
-- ============================================
CREATE TABLE IF NOT EXISTS public.digital_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  
  service_type TEXT CHECK (service_type IN (
    'virtual_tour',
    'drone_video',
    'professional_photos',
    'legal_review',
    'title_verification',
    'survey_report'
  )),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  
  cost NUMERIC,
  provider TEXT,
  completion_date TIMESTAMP WITH TIME ZONE,
  
  files JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_digital_services_user ON public.digital_services(user_id);
CREATE INDEX IF NOT EXISTS idx_digital_services_property ON public.digital_services(property_id);
CREATE INDEX IF NOT EXISTS idx_digital_services_type ON public.digital_services(service_type);

-- ============================================
-- 8. ENABLE RLS ON ALL NEW TABLES
-- ============================================
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gps_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_services ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 9. RLS POLICIES
-- ============================================

-- Purchase Requests: Users can view their own requests
DROP POLICY IF EXISTS "users_view_own_purchase_requests" ON public.purchase_requests;
CREATE POLICY "users_view_own_purchase_requests" ON public.purchase_requests
  FOR SELECT USING (buyer_id = auth.uid() OR property_id IN (
    SELECT id FROM public.properties WHERE owner_id = auth.uid()
  ));

-- Case Tracking: Users can view their own cases
DROP POLICY IF EXISTS "users_view_own_cases" ON public.case_tracking;
CREATE POLICY "users_view_own_cases" ON public.case_tracking
  FOR SELECT USING (buyer_id = auth.uid() OR property_id IN (
    SELECT id FROM public.properties WHERE owner_id = auth.uid()
  ));

-- Fraud Checks: Admins can view all, users can view their own
DROP POLICY IF EXISTS "fraud_checks_policy" ON public.fraud_checks;
CREATE POLICY "fraud_checks_policy" ON public.fraud_checks
  FOR SELECT USING (user_id = auth.uid());

-- GPS Verifications: Property owners can view
DROP POLICY IF EXISTS "gps_verifications_policy" ON public.gps_verifications;
CREATE POLICY "gps_verifications_policy" ON public.gps_verifications
  FOR SELECT USING (property_id IN (
    SELECT id FROM public.properties WHERE owner_id = auth.uid()
  ));

-- Analytics Logs: Users can view their own logs
DROP POLICY IF EXISTS "analytics_logs_policy" ON public.analytics_logs;
CREATE POLICY "analytics_logs_policy" ON public.analytics_logs
  FOR SELECT USING (user_id = auth.uid());

-- Support Tickets: Users can view their own tickets
DROP POLICY IF EXISTS "support_tickets_policy" ON public.support_tickets;
CREATE POLICY "support_tickets_policy" ON public.support_tickets
  FOR SELECT USING (user_id = auth.uid());

-- Digital Services: Users can view their own services
DROP POLICY IF EXISTS "digital_services_policy" ON public.digital_services;
CREATE POLICY "digital_services_policy" ON public.digital_services
  FOR SELECT USING (user_id = auth.uid());

-- ============================================
-- ✅ TOUTES LES TABLES MANQUANTES CRÉÉES!
-- ============================================
