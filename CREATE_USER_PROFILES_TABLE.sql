-- ============================================================
-- CREATE user_profiles TABLE IF NOT EXISTS
-- Execute in Supabase SQL Editor with service_role
-- ============================================================

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50),
  avatar_url TEXT,
  bio TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  region TEXT,
  phone TEXT,
  verification_status VARCHAR(50) DEFAULT 'unverified',
  business_type VARCHAR(100),
  business_data JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.user_profiles;

-- Create policies
CREATE POLICY "Users can view own profile"
ON public.user_profiles FOR SELECT
USING (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE
USING (user_id = auth.uid() OR auth.role() = 'service_role')
WITH CHECK (user_id = auth.uid() OR auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view other profiles"
ON public.user_profiles FOR SELECT
USING (auth.role() = 'authenticated');

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id 
  ON public.user_profiles(user_id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_role 
  ON public.user_profiles(role);

-- Verify table creation
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;
