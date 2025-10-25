-- ============================================================
-- FIX CALENDAR_APPOINTMENTS SCHEMA
-- Corrige les colonnes manquantes et les noms incorrects
-- ============================================================

-- 1. Vérifier la structure actuelle
DO $$
BEGIN
  RAISE NOTICE 'Vérification de la table calendar_appointments...';
END;
$$;

-- 2. Ajouter les colonnes manquantes si nécessaire
-- Note: Si la table n'existe pas, elle sera créée par le script complet

ALTER TABLE IF EXISTS public.calendar_appointments
ADD COLUMN IF NOT EXISTS purchase_request_id UUID;

-- Ajouter la contrainte de FK si elle n'existe pas
DO $$
BEGIN
  ALTER TABLE IF EXISTS public.calendar_appointments
  ADD CONSTRAINT fk_calendar_appointments_request 
  FOREIGN KEY (purchase_request_id) REFERENCES public.requests(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'FK constraint already exists';
END;
$$;

-- 3. S'assurer que start_time existe (pas appointment_date)
DO $$
BEGIN
  -- Si appointment_date existe et start_time n'existe pas, renommer
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'calendar_appointments' AND column_name = 'appointment_date'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'calendar_appointments' AND column_name = 'start_time'
  ) THEN
    ALTER TABLE public.calendar_appointments 
    RENAME COLUMN appointment_date TO start_time;
    RAISE NOTICE 'Column appointment_date renamed to start_time';
  END IF;
END;
$$;

-- 4. Ajouter les colonnes essentielles si manquantes
ALTER TABLE IF EXISTS public.calendar_appointments
ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS appointment_type VARCHAR(50) DEFAULT 'meeting' 
  CHECK (appointment_type IN ('viewing', 'meeting', 'signing', 'inspection', 'consultation', 'other')),
ADD COLUMN IF NOT EXISTS location VARCHAR(500),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'scheduled' 
  CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Créer les indexes s'ils n'existent pas
CREATE INDEX IF NOT EXISTS idx_calendar_appointments_purchase_request_id 
  ON public.calendar_appointments(purchase_request_id);

CREATE INDEX IF NOT EXISTS idx_calendar_appointments_start_time 
  ON public.calendar_appointments(start_time);

CREATE INDEX IF NOT EXISTS idx_calendar_appointments_status 
  ON public.calendar_appointments(status);

CREATE INDEX IF NOT EXISTS idx_calendar_appointments_created_at 
  ON public.calendar_appointments(created_at DESC);

-- 6. Afficher le résultat final
DO $$
BEGIN
  RAISE NOTICE '✅ Schéma calendar_appointments corrigé';
END;
$$;

-- Vérification de la structure finale
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'calendar_appointments'
ORDER BY ordinal_position;
