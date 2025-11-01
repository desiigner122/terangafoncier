-- ============================================================================
-- CRITICAL SCHEMA FIXES FOR TERANGAFONCIER
-- Created: 2025-10-21 09:28:56
-- Purpose: Add missing columns and fix foreign key constraints
-- ============================================================================

-- 1. ADD MISSING 'phone' COLUMN TO profiles TABLE
ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- 2. ADD MISSING 'body' COLUMN TO messages TABLE  
ALTER TABLE IF EXISTS public.messages
ADD COLUMN IF NOT EXISTS body TEXT NOT NULL DEFAULT '';

-- 3. ENSURE messages TABLE HAS REQUIRED COLUMNS
ALTER TABLE IF EXISTS public.messages
ADD COLUMN IF NOT EXISTS sender_id UUID,
ADD COLUMN IF NOT EXISTS recipient_id UUID,
ADD COLUMN IF NOT EXISTS subject TEXT,
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- 4. ADD FOREIGN KEY CONSTRAINTS IF MISSING
ALTER TABLE IF EXISTS public.messages
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.messages
ADD CONSTRAINT messages_recipient_id_fkey 
FOREIGN KEY (recipient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 5. ENSURE request_id EXISTS IN transactions TABLE
ALTER TABLE IF EXISTS public.transactions
ADD COLUMN IF NOT EXISTS request_id UUID;

-- 6. CREATE OR UPDATE FOREIGN KEY FOR transactions.request_id
ALTER TABLE IF EXISTS public.transactions
ADD CONSTRAINT transactions_request_id_fkey 
FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

-- 7. VERIFY purchase_cases TABLE HAS CORRECT FOREIGN KEY
-- First ensure request_id column exists
ALTER TABLE IF EXISTS public.purchase_cases
ADD COLUMN IF NOT EXISTS request_id UUID;

-- Drop old incorrect foreign key if it exists
ALTER TABLE IF EXISTS public.purchase_cases
DROP CONSTRAINT IF EXISTS purchase_cases_request_id_fkey;

-- Add correct foreign key
ALTER TABLE IF EXISTS public.purchase_cases
ADD CONSTRAINT purchase_cases_request_id_fkey 
FOREIGN KEY (request_id) REFERENCES public.requests(id) ON DELETE CASCADE;

-- 8. ENSURE purchase_cases HAS ALL REQUIRED COLUMNS
ALTER TABLE IF EXISTS public.purchase_cases
ADD COLUMN IF NOT EXISTS buyer_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS parcelle_id UUID REFERENCES public.parcels(id),
ADD COLUMN IF NOT EXISTS purchase_price NUMERIC,
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'initiated',
ADD COLUMN IF NOT EXISTS phase VARCHAR(50),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- 9. CREATE INDEXES FOR BETTER QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_messages_sender_recipient ON public.messages(sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_request_id ON public.purchase_cases(request_id);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_buyer_id ON public.purchase_cases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_seller_id ON public.purchase_cases(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_request_id ON public.transactions(request_id);

-- ============================================================================
-- END OF MIGRATION - All columns and constraints should now be in place
-- ============================================================================
