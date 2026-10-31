-- ========================================
-- FIX: RLS Policies for marketing_leads Table
-- ========================================
-- Date: October 18, 2025
-- Issue: Contact form blocked by "new row violates row-level security policy"
-- Solution: Allow public/anonymous inserts via RLS policies

-- 1. Enable RLS on marketing_leads table (if not already enabled)
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;

-- ========================================
-- DROP EXISTING POLICIES (if any)
-- ========================================
DROP POLICY IF EXISTS "Allow anonymous inserts for leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated inserts for leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated read leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated update leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Allow authenticated delete leads" ON public.marketing_leads;
DROP POLICY IF EXISTS "marketing_leads_insert" ON public.marketing_leads;
DROP POLICY IF EXISTS "marketing_leads_select" ON public.marketing_leads;
DROP POLICY IF EXISTS "marketing_leads_update" ON public.marketing_leads;
DROP POLICY IF EXISTS "marketing_leads_delete" ON public.marketing_leads;
DROP POLICY IF EXISTS "enable_read_for_all" ON public.marketing_leads;
DROP POLICY IF EXISTS "enable_insert_for_all" ON public.marketing_leads;
DROP POLICY IF EXISTS "enable_update_for_all" ON public.marketing_leads;

-- ========================================
-- CREATE NEW PERMISSIVE POLICIES
-- ========================================

-- Policy 1: Allow ANYONE (anonymous + authenticated) to INSERT leads
-- This is essential for the public contact form to work
CREATE POLICY "Allow anyone to create leads"
  ON public.marketing_leads
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow AUTHENTICATED users to READ all leads
-- Only admins and team members (authenticated) can view leads
CREATE POLICY "Allow authenticated to read leads"
  ON public.marketing_leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy 3: Allow AUTHENTICATED users to UPDATE leads
-- Only admins can update lead status, assignments, notes
CREATE POLICY "Allow authenticated to update leads"
  ON public.marketing_leads
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: Allow AUTHENTICATED users to DELETE leads
-- Only admins can delete old leads
CREATE POLICY "Allow authenticated to delete leads"
  ON public.marketing_leads
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ========================================
-- VERIFY POLICIES
-- ========================================
-- To verify policies were created correctly, run:
-- SELECT * FROM pg_policies WHERE tablename = 'marketing_leads';

SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'marketing_leads'
ORDER BY policyname;
