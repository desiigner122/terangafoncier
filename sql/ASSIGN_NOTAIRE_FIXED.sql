-- FIXED: Assign notaire to all active purchase_cases
-- profiles table uses 'id' column only

DO $$
DECLARE
  notaire_profile_id UUID;
  case_record RECORD;
  assigned_count INT := 0;
BEGIN
  -- Find notaire by role in profiles
  SELECT id INTO notaire_profile_id 
  FROM profiles 
  WHERE role = 'notaire' 
  LIMIT 1;

  IF notaire_profile_id IS NULL THEN
    RAISE NOTICE '❌ No notaire found in profiles table';
    RETURN;
  END IF;

  RAISE NOTICE '✅ Found notaire profile id: %', notaire_profile_id;

  -- Verify this ID exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = notaire_profile_id) THEN
    RAISE NOTICE '❌ Notaire profile id does not match any auth.users.id';
    RETURN;
  END IF;

  RAISE NOTICE '✅ Notaire auth.users verified';

  -- Step 2: Assign to all active purchase_cases
  FOR case_record IN 
    SELECT id, case_number, status
    FROM purchase_cases 
    WHERE status NOT IN ('completed', 'cancelled', 'archived')
  LOOP
    -- Check if notaire already assigned
    IF NOT EXISTS (
      SELECT 1 FROM purchase_case_participants 
      WHERE case_id = case_record.id 
      AND user_id = notaire_profile_id 
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
        notaire_profile_id,
        'notary',
        'active',
        NOW()
      );
      assigned_count := assigned_count + 1;
      RAISE NOTICE '✅ Assigned notaire to case % (status: %)', case_record.case_number, case_record.status;
    ELSE
      RAISE NOTICE '⏭️  Notaire already assigned to case %', case_record.case_number;
    END IF;
  END LOOP;

  RAISE NOTICE '🎉 Total cases assigned: %', assigned_count;
END $$;

-- Verify assignments
SELECT 
  pc.case_number,
  pc.status as case_status,
  pcp.role,
  pcp.status as participant_status,
  p.full_name as notaire_name,
  p.email as notaire_email
FROM purchase_cases pc
JOIN purchase_case_participants pcp ON pc.id = pcp.case_id
JOIN profiles p ON pcp.user_id = p.id
WHERE pcp.role = 'notary'
ORDER BY pc.created_at DESC;
