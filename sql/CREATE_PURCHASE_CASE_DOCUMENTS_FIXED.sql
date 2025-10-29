-- Create purchase_case_documents table if missing
-- Run this in Supabase SQL editor with service_role role
-- This version includes support for all roles (buyer, seller, notary, agent, surveyor)

CREATE TABLE IF NOT EXISTS public.purchase_case_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.purchase_cases(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  document_name VARCHAR(255),
  document_url TEXT NOT NULL,
  document_type VARCHAR(100),
  file_size BIGINT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on case_id for faster queries
CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_case_id ON public.purchase_case_documents(case_id);

-- Enable RLS
ALTER TABLE public.purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Users can view documents for their cases
-- Includes: buyer, seller, and anyone in purchase_case_participants
DROP POLICY IF EXISTS "Users can view documents for their cases" ON public.purchase_case_documents;
CREATE POLICY "Users can view documents for their cases"
  ON public.purchase_case_documents FOR SELECT
  TO authenticated
  USING (
    -- Buyer or seller
    case_id IN (
      SELECT id FROM public.purchase_cases 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
    OR
    -- Notary, agent, surveyor via purchase_case_participants
    case_id IN (
      SELECT case_id FROM public.purchase_case_participants 
      WHERE user_id = auth.uid() AND status IN ('active', 'accepted', 'invited')
    )
  );

-- RLS Policy 2: Users can upload documents for their cases
DROP POLICY IF EXISTS "Users can upload documents for their cases" ON public.purchase_case_documents;
CREATE POLICY "Users can upload documents for their cases"
  ON public.purchase_case_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND (
      -- Buyer or seller
      case_id IN (
        SELECT id FROM public.purchase_cases 
        WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
      )
      OR
      -- Notary, agent, surveyor via purchase_case_participants
      case_id IN (
        SELECT case_id FROM public.purchase_case_participants 
        WHERE user_id = auth.uid() AND status IN ('active', 'accepted', 'invited')
      )
    )
  );

-- Done!
