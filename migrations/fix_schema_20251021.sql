-- ============================================================================
-- CRITICAL SCHEMA FIXES FOR TERANGAFONCIER
-- ============================================================================

-- 1. ADD MISSING 'phone' COLUMN TO profiles TABLE
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- 2. ADD MISSING 'body' COLUMN TO messages TABLE  
ALTER TABLE IF EXISTS public.messages
ADD COLUMN IF NOT EXISTS body TEXT NOT NULL DEFAULT '';

-- 3. ADD MISSING COLUMNS TO messages IF NEEDED
ALTER TABLE IF EXISTS public.messages
ADD COLUMN IF NOT EXISTS sender_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS recipient_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- 4. ENSURE request_id EXISTS IN transactions TABLE
-- (This should already exist, just verifying)
ALTER TABLE IF EXISTS public.transactions
ADD COLUMN IF NOT EXISTS request_id UUID REFERENCES public.requests(id);

-- 5. VERIFY purchase_cases TABLE HAS CORRECT FOREIGN KEY
-- First, drop the old constraint if it's wrong
ALTER TABLE IF EXISTS public.purchase_cases
DROP CONSTRAINT IF EXISTS purchase_cases_request_id_fkey CASCADE;

-- 6. ADD CORRECT FOREIGN KEY TO purchase_cases
ALTER TABLE IF EXISTS public.purchase_cases
ADD CONSTRAINT purchase_cases_request_id_fkey 
FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

-- 7. ENSURE purchase_cases HAS ALL REQUIRED COLUMNS
ALTER TABLE IF EXISTS public.purchase_cases
ADD COLUMN IF NOT EXISTS request_id UUID,
ADD COLUMN IF NOT EXISTS buyer_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS parcelle_id UUID REFERENCES public.parcels(id),
ADD COLUMN IF NOT EXISTS purchase_price NUMERIC,
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'initiated',
ADD COLUMN IF NOT EXISTS phase VARCHAR(50),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 8. CREATE INDEX FOR BETTER QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_request_id ON public.purchase_cases(request_id);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_buyer_id ON public.purchase_cases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_request_id ON public.transactions(request_id);

-- 9. GRANT PERMISSIONS (if needed for RLS)
ALTER TABLE public.profiles OWNER TO postgres;
ALTER TABLE public.messages OWNER TO postgres;
ALTER TABLE public.purchase_cases OWNER TO postgres;
ALTER TABLE public.transactions OWNER TO postgres;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to check if fixes worked)
-- ============================================================================

-- Check profiles table structure
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'profiles' ORDER BY ordinal_position;

-- Check messages table structure
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'messages' ORDER BY ordinal_position;

-- Check purchase_cases table structure  
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'purchase_cases' ORDER BY ordinal_position;

-- Check foreign keys
-- SELECT constraint_name, table_name, column_name 
-- FROM information_schema.referential_constraints 
-- WHERE table_name IN ('purchase_cases', 'transactions', 'messages');
