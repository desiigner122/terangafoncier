-- ============================================================
-- FIX SYNCHRONISATION VENDEUR-ACHETEUR
-- Résoudre les problèmes:
-- 1. Upload documents bloqué (RLS)
-- 2. Messagerie ne fonctionne pas (colonnes/RLS)
-- 3. Vendeur ne voit pas les messages
-- 4. Timeline pas synchronisée
-- ============================================================

-- ============================================================
-- ÉTAPE 1: AJOUTER LES POLICIES STORAGE POUR BUCKET "documents"
-- ============================================================

-- Policy 1: Authenticated users can upload to documents bucket
DROP POLICY IF EXISTS "Authenticated users can upload to documents" ON storage.objects;
CREATE POLICY "Authenticated users can upload to documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Policy 2: Users can view documents in their cases
DROP POLICY IF EXISTS "Users can view documents in their cases" ON storage.objects;
CREATE POLICY "Users can view documents in their cases"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- Policy 3: Users can delete their own documents
DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'documents' AND owner = auth.uid());

-- ============================================================
-- ÉTAPE 2: CORRIGER LES RLS POLICIES POUR purchase_case_messages
-- ============================================================

-- Enable RLS
ALTER TABLE public.purchase_case_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view messages in their cases" ON public.purchase_case_messages;
DROP POLICY IF EXISTS "Users can insert messages in their cases" ON public.purchase_case_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.purchase_case_messages;
DROP POLICY IF EXISTS "service_role full access messages" ON public.purchase_case_messages;

-- Policy 1: ACHETEUR et VENDEUR peuvent VOIR les messages
CREATE POLICY "Buyer and seller can view case messages"
ON public.purchase_case_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_messages.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  OR auth.role() = 'service_role'
);

CREATE POLICY "Only sender can insert messages"
ON public.purchase_case_messages FOR INSERT
WITH CHECK (
  (sent_by = auth.uid() OR sender_id = auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_messages.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
);

-- Policy 3: ACHETEUR et VENDEUR peuvent UPDATER les messages
CREATE POLICY "Buyer and seller can update messages"
ON public.purchase_case_messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_messages.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  OR auth.role() = 'service_role'
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_messages.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  OR auth.role() = 'service_role'
);

-- ============================================================
-- ÉTAPE 3: CORRIGER LES RLS POLICIES POUR purchase_case_documents
-- ============================================================

-- Enable RLS
ALTER TABLE public.purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view documents in their cases" ON public.purchase_case_documents;
DROP POLICY IF EXISTS "Users can insert documents in their cases" ON public.purchase_case_documents;
DROP POLICY IF EXISTS "Users can delete documents" ON public.purchase_case_documents;

-- Policy 1: ACHETEUR et VENDEUR peuvent VOIR les documents
CREATE POLICY "Buyer and seller can view case documents"
ON public.purchase_case_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_documents.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  OR auth.role() = 'service_role'
);

-- Policy 2: ACHETEUR et VENDEUR peuvent INSÉRER des documents
CREATE POLICY "Buyer and seller can insert documents"
ON public.purchase_case_documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_documents.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  AND uploaded_by = auth.uid()
);

-- Policy 3: ACHETEUR et VENDEUR peuvent SUPPRIMER les documents
CREATE POLICY "Buyer and seller can delete documents"
ON public.purchase_case_documents FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.purchase_cases
    WHERE id = purchase_case_documents.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  OR auth.role() = 'service_role'
);

-- ============================================================
-- ÉTAPE 4: VÉRIFIER LES COLONNES MANQUANTES
-- ============================================================

-- S'assurer que purchase_case_messages a toutes les colonnes
ALTER TABLE public.purchase_case_messages
ADD COLUMN IF NOT EXISTS case_id UUID,
ADD COLUMN IF NOT EXISTS sent_by UUID,
ADD COLUMN IF NOT EXISTS sender_id UUID,
ADD COLUMN IF NOT EXISTS message TEXT,
ADD COLUMN IF NOT EXISTS message_type VARCHAR(50) DEFAULT 'text',
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ajouter FK constraints si manquantes
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.purchase_case_messages
    ADD CONSTRAINT fk_messages_case
    FOREIGN KEY (case_id) REFERENCES public.purchase_cases(id) ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER TABLE public.purchase_case_messages
    ADD CONSTRAINT fk_messages_sender
    FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER TABLE public.purchase_case_messages
    ADD CONSTRAINT fk_messages_sent_by
    FOREIGN KEY (sent_by) REFERENCES auth.users(id) ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END;
$$;

-- S'assurer que purchase_case_documents a toutes les colonnes
ALTER TABLE public.purchase_case_documents
ADD COLUMN IF NOT EXISTS case_id UUID,
ADD COLUMN IF NOT EXISTS uploaded_by UUID,
ADD COLUMN IF NOT EXISTS file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS file_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ajouter FK constraints si manquantes
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.purchase_case_documents
    ADD CONSTRAINT fk_documents_case
    FOREIGN KEY (case_id) REFERENCES public.purchase_cases(id) ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
  BEGIN
    ALTER TABLE public.purchase_case_documents
    ADD CONSTRAINT fk_documents_uploader
    FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END;
$$;

-- ============================================================
-- ÉTAPE 5: CRÉER LES INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_messages_case_id 
  ON public.purchase_case_messages(case_id);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id 
  ON public.purchase_case_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_messages_sent_by 
  ON public.purchase_case_messages(sent_by);

CREATE INDEX IF NOT EXISTS idx_messages_created_at 
  ON public.purchase_case_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_documents_case_id 
  ON public.purchase_case_documents(case_id);

CREATE INDEX IF NOT EXISTS idx_documents_uploader 
  ON public.purchase_case_documents(uploaded_by);

-- ============================================================
-- ÉTAPE 6: VÉRIFICATION
-- ============================================================

-- Afficher les policies créées
SELECT 
  policyname,
  permissive,
  roles,
  SUBSTRING(qual::text, 1, 100) as qual_preview,
  SUBSTRING(with_check::text, 1, 100) as check_preview
FROM pg_policies
WHERE tablename IN ('purchase_case_messages', 'purchase_case_documents')
ORDER BY tablename, policyname;

-- Afficher les colonnes finales pour purchase_case_messages
SELECT 
  'purchase_case_messages' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_case_messages'
ORDER BY ordinal_position;

-- Afficher les colonnes finales pour purchase_case_documents
SELECT 
  'purchase_case_documents' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_case_documents'
ORDER BY ordinal_position;

-- Afficher les storage policies pour bucket 'documents'
SELECT 
  policyname,
  permissive,
  roles,
  SUBSTRING(qual::text, 1, 100) as qual_preview,
  SUBSTRING(with_check::text, 1, 100) as check_preview
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND (
  qual::text LIKE '%documents%' 
  OR with_check::text LIKE '%documents%'
)
ORDER BY policyname;
