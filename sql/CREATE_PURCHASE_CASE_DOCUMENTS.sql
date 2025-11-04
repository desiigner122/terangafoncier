-- Create purchase_case_documents table if missing
-- Run this in Supabase SQL editor with service_role role

CREATE TABLE IF NOT EXISTS purchase_case_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID REFERENCES purchase_cases(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id),
  document_name VARCHAR(255),
  document_url TEXT NOT NULL,
  document_type VARCHAR(100),
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Create index on case_id for faster queries
CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_case_id ON purchase_case_documents(case_id);

-- Enable RLS (optional but recommended)
ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: authenticated users can see documents from their cases
DROP POLICY IF EXISTS "users can view case documents" ON purchase_case_documents;
CREATE POLICY "users can view case documents"
  ON purchase_case_documents FOR SELECT
  TO authenticated
  USING (
    case_id IN (
      SELECT id FROM purchase_cases 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

-- Create RLS policy: authenticated users can insert documents to their cases
DROP POLICY IF EXISTS "users can insert case documents" ON purchase_case_documents;
CREATE POLICY "users can insert case documents"
  ON purchase_case_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid() AND
    case_id IN (
      SELECT id FROM purchase_cases 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );
