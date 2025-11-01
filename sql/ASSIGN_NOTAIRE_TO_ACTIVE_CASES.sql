-- Assign the existing notaire to all active purchase_cases
-- Run this in Supabase SQL editor

-- Step 1: Find the notaire user
DO $$
DECLARE
  notaire_user_id UUID;
  case_record RECORD;
  assigned_count INT := 0;
BEGIN
  -- Find notaire by role in profiles
  SELECT id INTO notaire_user_id 
  FROM profiles 
  WHERE role = 'notaire' 
  LIMIT 1;

  IF notaire_user_id IS NULL THEN
    RAISE NOTICE 'No notaire found in profiles table';
    RETURN;
  END IF;

  RAISE NOTICE 'Found notaire: %', notaire_user_id;

  -- Step 2: Assign to all active purchase_cases that don't have notaire participant yet
  FOR case_record IN 
    SELECT id, case_number 
    FROM purchase_cases 
    WHERE status NOT IN ('completed', 'cancelled', 'archived')
  LOOP
    -- Check if notaire already assigned
    IF NOT EXISTS (
      SELECT 1 FROM purchase_case_participants 
      WHERE case_id = case_record.id 
      AND user_id = notaire_user_id 
      AND role = 'notary'
    ) THEN
      -- Insert notaire as participant
      INSERT INTO purchase_case_participants (
        case_id, 
        user_id, 
        role, 
        status, 
        joined_at
      ) VALUES (
        case_record.id,
        notaire_user_id,
        'notary',
        'active',
        NOW()
      );
      assigned_count := assigned_count + 1;
      RAISE NOTICE 'Assigned notaire to case %', case_record.case_number;
    END IF;
  END LOOP;

  RAISE NOTICE 'Total cases assigned: %', assigned_count;
END $$;

-- Verify assignments
SELECT 
  pc.case_number,
  pc.status,
  pcp.role,
  pcp.status as participant_status,
  p.full_name as notaire_name
FROM purchase_cases pc
JOIN purchase_case_participants pcp ON pc.id = pcp.case_id
JOIN profiles p ON pcp.user_id = p.id
WHERE pcp.role = 'notary'
ORDER BY pc.created_at DESC;
