-- ========================================
-- ADD MISSING COLUMNS TO marketing_leads TABLE
-- ========================================
-- Date: October 18, 2025
-- Purpose: Add category and urgency columns to capture all contact form data

-- 1. Add 'category' column (text, nullable)
ALTER TABLE public.marketing_leads
ADD COLUMN IF NOT EXISTS category TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.marketing_leads.category IS 'Contact category: blockchain, investment, diaspora, construction, technical, partnership, other';

-- 2. Add 'urgency' column (text, nullable with default)
ALTER TABLE public.marketing_leads
ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'normal';

-- Add check constraint for urgency values
ALTER TABLE public.marketing_leads
ADD CONSTRAINT urgency_check CHECK (urgency IN ('low', 'normal', 'high', 'urgent'));

-- Add comment for clarity
COMMENT ON COLUMN public.marketing_leads.urgency IS 'Contact urgency level: low, normal, high, urgent';

-- 3. Create index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_marketing_leads_category ON public.marketing_leads(category);

-- 4. Create index on urgency for faster queries
CREATE INDEX IF NOT EXISTS idx_marketing_leads_urgency ON public.marketing_leads(urgency);

-- 5. Verify the columns were added
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM 
  information_schema.columns
WHERE 
  table_name = 'marketing_leads'
  AND column_name IN ('category', 'urgency')
ORDER BY 
  column_name;
