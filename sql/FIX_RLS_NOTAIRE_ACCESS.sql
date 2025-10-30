-- Fix RLS policies to allow notaires to access assigned purchase_cases
-- Problem: purchase_case_participants has 2 rows but purchase_cases returns 0 (RLS blocked)

-- 1. First verify the case IDs exist
SELECT 
  id, 
  case_number, 
  status,
  buyer_id,
  seller_id
FROM purchase_cases
WHERE id IN (
  'ded322f2-ca48-4acd-9af2-35297732ca0f',
  '2988b1e6-f421-4d27-a60b-4eca0d7a7fbf'
);

-- 2. Check current RLS policies on purchase_cases
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'purchase_cases';

-- 3. First, check and fix purchase_case_participants RLS policies
-- Drop any recursive policies on purchase_case_participants
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'purchase_case_participants';

-- Drop all existing policies on purchase_case_participants to break recursion
DROP POLICY IF EXISTS "Users can view their participations" ON purchase_case_participants;
DROP POLICY IF EXISTS "Participants can view their own records" ON purchase_case_participants;

-- Create simple, non-recursive policy for purchase_case_participants
CREATE POLICY "Allow users to view their participations"
ON purchase_case_participants
FOR SELECT
USING (
  user_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 4. Now fix purchase_cases policies
DROP POLICY IF EXISTS "Users can view their own purchase cases" ON purchase_cases;
DROP POLICY IF EXISTS "Buyers can view their purchase cases" ON purchase_cases;
DROP POLICY IF EXISTS "Sellers can view their purchase cases" ON purchase_cases;
DROP POLICY IF EXISTS "Notaires can view assigned cases" ON purchase_cases;

-- Create comprehensive SELECT policy for purchase_cases
CREATE POLICY "Allow participants to view cases"
ON purchase_cases
FOR SELECT
USING (
  -- User is buyer
  buyer_id = auth.uid()
  OR
  -- User is seller
  seller_id = auth.uid()
  OR
  -- User is admin
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
  OR
  -- User is a participant (notary, agent, etc.)
  -- Use simple exists check without selecting from purchase_cases
  EXISTS (
    SELECT 1 
    FROM purchase_case_participants pcp
    WHERE pcp.case_id = purchase_cases.id 
    AND pcp.user_id = auth.uid()
  )
);

-- 5. Verify policies were created correctly
SELECT 
  tablename,
  policyname, 
  cmd,
  CASE 
    WHEN length(qual) > 100 THEN substring(qual from 1 for 100) || '...'
    ELSE qual
  END as policy_check
FROM pg_policies 
WHERE tablename IN ('purchase_cases', 'purchase_case_participants')
ORDER BY tablename, policyname;

-- 6. Test access after policy fix
-- This should now return 2 cases for the notaire
SELECT 
  pc.id, 
  pc.case_number, 
  pc.status,
  pcp.role,
  pcp.status as participant_status
FROM purchase_cases pc
JOIN purchase_case_participants pcp ON pc.id = pcp.case_id
WHERE pcp.user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND pcp.role = 'notary';

