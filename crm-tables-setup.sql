-- =====================================================
-- SUPABASE SETUP: Tables CRM Complètes
-- =====================================================
-- À exécuter une seule fois dans Supabase SQL Editor
-- Date: 18 Octobre 2025

-- =====================================================
-- 1. TABLE: CRM_CONTACTS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(100),
  company VARCHAR(255),
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'prospect', -- prospect, lead, client, inactive
  score INTEGER DEFAULT 0, -- 0-100
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  avatar_url TEXT,
  source VARCHAR(50), -- manual, form, import, etc
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  custom_fields JSONB DEFAULT '{}'::JSONB,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  contact_frequency VARCHAR(50) DEFAULT 'monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_crm_contacts_email ON public.crm_contacts(email);
CREATE INDEX idx_crm_contacts_status ON public.crm_contacts(status);
CREATE INDEX idx_crm_contacts_assigned_to ON public.crm_contacts(assigned_to);
CREATE INDEX idx_crm_contacts_created_at ON public.crm_contacts(created_at);

-- =====================================================
-- 2. TABLE: CRM_DEALS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  value DECIMAL(15, 2) DEFAULT 0,
  stage VARCHAR(50) NOT NULL, -- Prospection, Qualification, Proposition, Négociation, Fermeture
  probability INTEGER DEFAULT 0, -- 0-100
  expected_close_date DATE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}'::JSONB,
  documents TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_crm_deals_contact_id ON public.crm_deals(contact_id);
CREATE INDEX idx_crm_deals_stage ON public.crm_deals(stage);
CREATE INDEX idx_crm_deals_assigned_to ON public.crm_deals(assigned_to);
CREATE INDEX idx_crm_deals_expected_close_date ON public.crm_deals(expected_close_date);

-- =====================================================
-- 3. TABLE: CRM_ACTIVITIES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- call, email, meeting, note, task
  title VARCHAR(255),
  description TEXT,
  outcome VARCHAR(100), -- Positive, Negative, Neutral, Sent, Scheduled, etc
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  duration_minutes INTEGER,
  participants TEXT[] DEFAULT ARRAY[]::TEXT[],
  attachments TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_crm_activities_contact_id ON public.crm_activities(contact_id);
CREATE INDEX idx_crm_activities_deal_id ON public.crm_activities(deal_id);
CREATE INDEX idx_crm_activities_type ON public.crm_activities(type);
CREATE INDEX idx_crm_activities_created_at ON public.crm_activities(created_at);

-- =====================================================
-- 4. TABLE: CRM_TASKS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date DATE NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  status VARCHAR(20) DEFAULT 'open', -- open, in_progress, completed, cancelled
  category VARCHAR(50), -- follow-up, reminder, meeting, call, etc
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_crm_tasks_assigned_to ON public.crm_tasks(assigned_to);
CREATE INDEX idx_crm_tasks_status ON public.crm_tasks(status);
CREATE INDEX idx_crm_tasks_due_date ON public.crm_tasks(due_date);
CREATE INDEX idx_crm_tasks_priority ON public.crm_tasks(priority);

-- =====================================================
-- 5. RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_tasks ENABLE ROW LEVEL SECURITY;

-- CRM_CONTACTS Policies
CREATE POLICY "Authenticated users can view contacts"
  ON public.crm_contacts
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create contacts"
  ON public.crm_contacts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their assigned contacts"
  ON public.crm_contacts
  FOR UPDATE
  USING (auth.uid() = assigned_to OR auth.role() = 'admin')
  WITH CHECK (auth.uid() = assigned_to OR auth.role() = 'admin');

CREATE POLICY "Only assigned user or admin can delete contacts"
  ON public.crm_contacts
  FOR DELETE
  USING (auth.uid() = assigned_to OR auth.role() = 'admin');

-- CRM_DEALS Policies
CREATE POLICY "Authenticated users can view deals"
  ON public.crm_deals
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create deals"
  ON public.crm_deals
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their assigned deals"
  ON public.crm_deals
  FOR UPDATE
  USING (auth.uid() = assigned_to OR auth.role() = 'admin')
  WITH CHECK (auth.uid() = assigned_to OR auth.role() = 'admin');

-- CRM_ACTIVITIES Policies
CREATE POLICY "Authenticated users can view activities"
  ON public.crm_activities
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create activities"
  ON public.crm_activities
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- CRM_TASKS Policies
CREATE POLICY "Users can view their tasks"
  ON public.crm_tasks
  FOR SELECT
  USING (auth.uid() = assigned_to OR auth.role() = 'admin');

CREATE POLICY "Authenticated users can create tasks"
  ON public.crm_tasks
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their tasks"
  ON public.crm_tasks
  FOR UPDATE
  USING (auth.uid() = assigned_to OR auth.role() = 'admin')
  WITH CHECK (auth.uid() = assigned_to OR auth.role() = 'admin');

-- =====================================================
-- 6. PERMISSIONS & GRANTS
-- =====================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.crm_contacts TO authenticated;
GRANT ALL ON public.crm_deals TO authenticated;
GRANT ALL ON public.crm_activities TO authenticated;
GRANT ALL ON public.crm_tasks TO authenticated;

-- =====================================================
-- 7. VERIFICATION
-- =====================================================
-- Vérifier que les tables sont bien créées
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename LIKE 'crm_%'
ORDER BY tablename;

-- Vérifier les indexes
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename LIKE 'crm_%'
ORDER BY tablename, indexname;

-- Vérifier les policies
SELECT 
  tablename,
  policyname,
  permissive
FROM pg_policies
WHERE tablename LIKE 'crm_%'
ORDER BY tablename, policyname;
