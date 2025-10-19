-- ============================================
-- CRÉATION DES TABLES UNIQUEMENT - SANS RLS
-- Date: 18 Oct 2025
-- Objectif: Isoler l'erreur de création de table.
-- ============================================

-- ============================================
-- 0. SUPPRESSION DES TABLES EXISTANTES
-- ============================================
DROP TABLE IF EXISTS public.purchase_requests CASCADE;
DROP TABLE IF EXISTS public.case_tracking CASCADE;
DROP TABLE IF EXISTS public.fraud_checks CASCADE;
DROP TABLE IF EXISTS public.gps_verifications CASCADE;
DROP TABLE IF EXISTS public.analytics_logs CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;
DROP TABLE IF EXISTS public.digital_services CASCADE;

-- ============================================
-- 1. TABLE: PURCHASE_REQUESTS
-- ============================================
CREATE TABLE public.purchase_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID,
  property_id UUID,
  quantity INTEGER DEFAULT 1,
  offer_price NUMERIC,
  proposed_terms TEXT,
  urgency TEXT,
  financing_method TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. TABLE: CASE_TRACKING
-- ============================================
CREATE TABLE public.case_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID,
  buyer_id UUID,
  case_number TEXT UNIQUE,
  case_status TEXT DEFAULT 'in_progress',
  documents_status JSONB DEFAULT '{}'::jsonb,
  payment_status TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. TABLE: FRAUD_CHECKS
-- ============================================
CREATE TABLE public.fraud_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID,
  user_id UUID,
  property_id UUID,
  check_type TEXT,
  status TEXT DEFAULT 'pending',
  risk_level TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 4. TABLE: GPS_VERIFICATIONS
-- ============================================
CREATE TABLE public.gps_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID,
  verified_latitude NUMERIC,
  verified_longitude NUMERIC,
  accuracy_meters NUMERIC,
  verification_method TEXT,
  verified_by UUID,
  verification_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. TABLE: ANALYTICS_LOGS
-- ============================================
CREATE TABLE public.analytics_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_type TEXT,
  event_category TEXT,
  event_data JSONB DEFAULT '{}'::jsonb,
  page_url TEXT,
  referrer TEXT,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 6. TABLE: SUPPORT_TICKETS
-- ============================================
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  assigned_to UUID,
  subject TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'open',
  attachments JSONB DEFAULT '[]'::jsonb,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 7. TABLE: DIGITAL_SERVICES
-- ============================================
CREATE TABLE public.digital_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  property_id UUID,
  service_type TEXT,
  status TEXT DEFAULT 'pending',
  cost NUMERIC,
  provider TEXT,
  completion_date TIMESTAMP WITH TIME ZONE,
  files JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ✅ SCRIPT DE CRÉATION DE TABLES (SANS RLS) TERMINÉ
-- ============================================
