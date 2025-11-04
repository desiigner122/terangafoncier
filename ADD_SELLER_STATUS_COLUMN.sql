-- =============================================================
-- Add seller_status column to purchase_cases table
-- This column tracks the seller's decision on purchase requests
-- =============================================================

-- Check if column exists before adding
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'purchase_cases' AND column_name = 'seller_status'
    ) THEN
        ALTER TABLE public.purchase_cases
        ADD COLUMN seller_status TEXT DEFAULT 'pending';
        
        -- Add constraint for valid values
        ALTER TABLE public.purchase_cases
        ADD CONSTRAINT purchase_cases_seller_status_check
        CHECK (seller_status IN ('pending', 'accepted', 'declined'));
        
        -- Add index for filtering queries
        CREATE INDEX purchase_cases_seller_status_idx
        ON public.purchase_cases (seller_status);
        
        RAISE NOTICE 'Column seller_status added to purchase_cases';
    ELSE
        RAISE NOTICE 'Column seller_status already exists in purchase_cases';
    END IF;
END$$;
