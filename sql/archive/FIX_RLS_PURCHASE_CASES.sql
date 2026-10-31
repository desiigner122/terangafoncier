-- 🔴 ISSUE: Buyer cannot see purchase_cases (loads 0 while vendor has 3)
-- This is an RLS (Row-Level Security) policy issue

-- First, let's check existing RLS policies on purchase_cases table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'purchase_cases' 
ORDER BY tablename, policyname;

-- ✅ FIX: Add RLS policy to allow buyers to read their own purchase_cases
-- Buyers should be able to see purchase_cases where buyer_id matches their auth.uid()

CREATE POLICY "Buyers can read their own purchase_cases"
  ON public.purchase_cases
  FOR SELECT
  USING (buyer_id = auth.uid());

-- ✅ Also allow sellers to read their own purchase_cases
CREATE POLICY "Sellers can read their own purchase_cases"
  ON public.purchase_cases
  FOR SELECT
  USING (seller_id = auth.uid());

-- ✅ Allow creating purchase_cases (for sellers accepting requests)
CREATE POLICY "Sellers can create purchase_cases"
  ON public.purchase_cases
  FOR INSERT
  WITH CHECK (seller_id = auth.uid());

-- ✅ Allow updating purchase_cases (for status changes)
CREATE POLICY "Sellers and Buyers can update their own purchase_cases"
  ON public.purchase_cases
  FOR UPDATE
  USING (seller_id = auth.uid() OR buyer_id = auth.uid())
  WITH CHECK (seller_id = auth.uid() OR buyer_id = auth.uid());

-- Verify RLS is enabled on purchase_cases table
ALTER TABLE public.purchase_cases ENABLE ROW LEVEL SECURITY;

-- Check after:
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'purchase_cases' 
ORDER BY tablename, policyname;
