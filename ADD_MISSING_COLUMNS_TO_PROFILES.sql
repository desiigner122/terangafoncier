-- ============================================================
-- ADD MISSING COLUMNS TO EXISTING profiles TABLE
-- Execute in Supabase SQL Editor with service_role
-- ============================================================

-- The profiles table already exists, we just need to add missing columns

-- Add missing columns if they don't exist
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS role VARCHAR(50),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'unverified',
ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS business_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Enable RLS if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create policies
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid() OR auth.role() = 'service_role')
WITH CHECK (id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view other profiles"
ON public.profiles FOR SELECT
USING (auth.role() = 'authenticated');

-- Create index for performance if not exists
CREATE INDEX IF NOT EXISTS idx_profiles_id 
  ON public.profiles(id);

CREATE INDEX IF NOT EXISTS idx_profiles_role 
  ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_profiles_email 
  ON public.profiles(email);

-- Verify the final structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
