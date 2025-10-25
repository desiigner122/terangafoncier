-- ============================================================
-- DIAGNOSTIC: Vérifier la synchronisation acheteur-vendeur
-- Exécuter dans Supabase SQL Editor avec service_role
-- ============================================================

-- 1. Vérifier la structure de purchase_cases
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_cases'
ORDER BY ordinal_position;

-- 2. Vérifier un dossier spécifique
SELECT 
  id,
  case_number,
  buyer_id,
  seller_id,
  request_id,
  status,
  created_at
FROM public.purchase_cases
WHERE case_number LIKE 'TF-2025%'
LIMIT 5;

-- 3. Vérifier les messages associés
SELECT 
  id,
  case_id,
  sender_id,
  message,
  message_type,
  created_at
FROM public.purchase_case_messages
WHERE case_id = (
  SELECT id FROM public.purchase_cases 
  WHERE case_number = 'TF-20251021-0001' 
  LIMIT 1
)
ORDER BY created_at DESC;

-- 4. Vérifier les documents
SELECT 
  id,
  case_id,
  uploaded_by,
  file_name,
  created_at
FROM public.purchase_case_documents
WHERE case_id = (
  SELECT id FROM public.purchase_cases 
  WHERE case_number = 'TF-20251021-0001' 
  LIMIT 1
)
ORDER BY created_at DESC;

-- 5. Vérifier les RLS policies pour purchase_case_messages
SELECT 
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'purchase_case_messages'
ORDER BY policyname;

-- 6. Vérifier les RLS policies pour purchase_case_documents
SELECT 
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'purchase_case_documents'
ORDER BY policyname;

-- 7. Vérifier les RLS policies pour storage.objects
SELECT 
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;
