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

-- 5. If appointment_date exists and start_time doesn't have data, copy it
UPDATE public.calendar_appointments 
SET start_time = appointment_date 
WHERE start_time = NOW() AND appointment_date IS NOT NULL;

-- 6. Verify the structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'calendar_appointments'
ORDER BY ordinal_position;
