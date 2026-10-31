-- ======================================================================
-- FIX DATABASE SCHEMA - FOREIGN KEY CONSTRAINTS
-- ======================================================================
-- Run this in your Supabase SQL Editor to diagnose and fix FK issues
-- ======================================================================

-- 1. CHECK CURRENT TABLE STRUCTURES
-- ===================================

-- Check profiles table columns
SELECT 
    'PROFILES TABLE STRUCTURE' as info,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check properties table columns
SELECT 
    'PROPERTIES TABLE STRUCTURE' as info,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'properties'
ORDER BY ordinal_position;

-- Check transactions table columns
SELECT 
    'TRANSACTIONS TABLE STRUCTURE' as info,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'transactions'
ORDER BY ordinal_position;

-- Check support_tickets table columns
SELECT 
    'SUPPORT_TICKETS TABLE STRUCTURE' as info,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'support_tickets'
ORDER BY ordinal_position;

-- 2. CHECK EXISTING FOREIGN KEY CONSTRAINTS
-- ==========================================

SELECT
    'EXISTING FOREIGN KEYS' as info,
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('properties', 'transactions', 'support_tickets')
ORDER BY tc.table_name, kcu.column_name;

-- 3. CREATE MISSING FOREIGN KEY CONSTRAINTS
-- ==========================================

-- ⚠️ ONLY RUN IF CONSTRAINTS DON'T EXIST ABOVE ⚠️

-- Properties -> Profiles (owner_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'properties' 
          AND constraint_name = 'properties_owner_id_fkey'
    ) THEN
        -- Check if owner_id column exists
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'properties' AND column_name = 'owner_id'
        ) THEN
            ALTER TABLE public.properties 
            ADD CONSTRAINT properties_owner_id_fkey 
            FOREIGN KEY (owner_id) REFERENCES public.profiles(id);
            
            RAISE NOTICE '✅ Created FK: properties.owner_id -> profiles.id';
        ELSE
            RAISE NOTICE '❌ Column properties.owner_id does NOT exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ FK already exists: properties.owner_id -> profiles.id';
    END IF;
END $$;

-- Transactions -> Profiles (user_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'transactions' 
          AND constraint_name = 'transactions_user_id_fkey'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'transactions' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE public.transactions 
            ADD CONSTRAINT transactions_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES public.profiles(id);
            
            RAISE NOTICE '✅ Created FK: transactions.user_id -> profiles.id';
        ELSE
            RAISE NOTICE '❌ Column transactions.user_id does NOT exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ FK already exists: transactions.user_id -> profiles.id';
    END IF;
END $$;

-- Transactions -> Properties (property_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'transactions' 
          AND constraint_name = 'transactions_property_id_fkey'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'transactions' AND column_name = 'property_id'
        ) THEN
            ALTER TABLE public.transactions 
            ADD CONSTRAINT transactions_property_id_fkey 
            FOREIGN KEY (property_id) REFERENCES public.properties(id);
            
            RAISE NOTICE '✅ Created FK: transactions.property_id -> properties.id';
        ELSE
            RAISE NOTICE '❌ Column transactions.property_id does NOT exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ FK already exists: transactions.property_id -> properties.id';
    END IF;
END $$;

-- Support Tickets -> Profiles (user_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'support_tickets' 
          AND constraint_name = 'support_tickets_user_id_fkey'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'support_tickets' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE public.support_tickets 
            ADD CONSTRAINT support_tickets_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES public.profiles(id);
            
            RAISE NOTICE '✅ Created FK: support_tickets.user_id -> profiles.id';
        ELSE
            RAISE NOTICE '❌ Column support_tickets.user_id does NOT exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ FK already exists: support_tickets.user_id -> profiles.id';
    END IF;
END $$;

-- Support Tickets -> Profiles (assigned_to)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'support_tickets' 
          AND constraint_name = 'support_tickets_assigned_to_fkey'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'support_tickets' AND column_name = 'assigned_to'
        ) THEN
            ALTER TABLE public.support_tickets 
            ADD CONSTRAINT support_tickets_assigned_to_fkey 
            FOREIGN KEY (assigned_to) REFERENCES public.profiles(id);
            
            RAISE NOTICE '✅ Created FK: support_tickets.assigned_to -> profiles.id';
        ELSE
            RAISE NOTICE '❌ Column support_tickets.assigned_to does NOT exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ FK already exists: support_tickets.assigned_to -> profiles.id';
    END IF;
END $$;

-- 4. REFRESH SUPABASE SCHEMA CACHE
-- =================================
-- This tells PostgREST to reload the schema cache so FK joins work

NOTIFY pgrst, 'reload schema';

-- 5. VERIFICATION
-- ===============

SELECT 
    '✅ VERIFICATION - FOREIGN KEYS NOW EXIST' as status,
    tc.table_name, 
    kcu.column_name,
    '->' as arrow,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column
FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('properties', 'transactions', 'support_tickets')
ORDER BY tc.table_name;
