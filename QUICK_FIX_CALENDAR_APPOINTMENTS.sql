-- ============================================================
-- QUICK FIX: calendar_appointments table corrections
-- Execute this in Supabase SQL Editor with service_role
-- ============================================================

-- 1. Ensure purchase_request_id column exists (FK to requests)
ALTER TABLE public.calendar_appointments
ADD COLUMN IF NOT EXISTS purchase_request_id UUID;

-- 2. Add FK constraint if not exists
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.calendar_appointments
    ADD CONSTRAINT fk_calendar_appointments_purchase_request
    FOREIGN KEY (purchase_request_id) REFERENCES public.requests(id) ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END;
$$;

-- 3. Ensure all required columns exist
ALTER TABLE public.calendar_appointments
ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS appointment_type VARCHAR(50) DEFAULT 'meeting',
ADD COLUMN IF NOT EXISTS location VARCHAR(500),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'scheduled',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_appointments_purchase_request_id 
  ON public.calendar_appointments(purchase_request_id);

CREATE INDEX IF NOT EXISTS idx_calendar_appointments_start_time 
  ON public.calendar_appointments(start_time);

CREATE INDEX IF NOT EXISTS idx_calendar_appointments_status 
  ON public.calendar_appointments(status);

-- 5. Verify the structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'calendar_appointments'
ORDER BY ordinal_position;

-- ============================================================
-- FIXES FOR purchase_case_messages TABLE
-- ============================================================

-- 1. Ensure message_type column exists
ALTER TABLE IF EXISTS public.purchase_case_messages
ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'text' 
  CHECK (message_type IN ('text', 'system', 'announcement'));

-- 2. Ensure all required columns exist
ALTER TABLE IF EXISTS public.purchase_case_messages
ADD COLUMN IF NOT EXISTS case_id UUID,
ADD COLUMN IF NOT EXISTS sender_id UUID,
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Add FK constraints if not exists
DO $$
BEGIN
  BEGIN
    ALTER TABLE IF EXISTS public.purchase_case_messages
    ADD CONSTRAINT fk_purchase_case_messages_case
    FOREIGN KEY (case_id) REFERENCES public.purchase_cases(id) ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER TABLE IF EXISTS public.purchase_case_messages
    ADD CONSTRAINT fk_purchase_case_messages_sender
    FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END;
$$;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_purchase_case_messages_case_id 
  ON public.purchase_case_messages(case_id);

CREATE INDEX IF NOT EXISTS idx_purchase_case_messages_sender_id 
  ON public.purchase_case_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_purchase_case_messages_created_at 
  ON public.purchase_case_messages(created_at DESC);

-- 5. Verify the structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_case_messages'
ORDER BY ordinal_position;
