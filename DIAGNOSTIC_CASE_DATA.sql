-- ============================================================
-- DIAGNOSTIC: Vérifier les données existantes
-- Exécuter dans Supabase SQL Editor pour diagnostic
-- ============================================================

-- 1. Vérifier les dossiers d'achat existants
SELECT 
  COUNT(*) as total_cases,
  COUNT(CASE WHEN status IS NOT NULL THEN 1 END) as cases_with_status,
  COUNT(CASE WHEN status IS NULL THEN 1 END) as cases_without_status
FROM public.purchase_cases;

-- 2. Vérifier les statuts utilisés
SELECT 
  status,
  COUNT(*) as count,
  MAX(created_at) as last_created
FROM public.purchase_cases
GROUP BY status
ORDER BY count DESC;

-- 3. Vérifier un dossier spécifique (ex: TF-20251021-0002)
SELECT 
  id,
  case_number,
  status,
  phase,
  progress_percentage,
  buyer_id,
  seller_id,
  request_id,
  parcelle_id,
  purchase_price,
  created_at,
  completed_at
FROM public.purchase_cases
WHERE case_number = 'TF-20251021-0002'
LIMIT 1;

-- 4. Vérifier les rendez-vous associés
SELECT 
  ca.id,
  ca.purchase_request_id,
  ca.title,
  ca.start_time,
  ca.end_time,
  ca.status,
  ca.appointment_type
FROM public.calendar_appointments ca
WHERE ca.purchase_request_id = (
  SELECT request_id FROM public.purchase_cases 
  WHERE case_number = 'TF-20251021-0002' 
  LIMIT 1
)
ORDER BY ca.start_time ASC;

-- 5. Vérifier les documents
SELECT 
  COUNT(*) as total_documents,
  COUNT(CASE WHEN created_at IS NOT NULL THEN 1 END) as documents_count
FROM public.purchase_case_documents
WHERE case_id = (
  SELECT id FROM public.purchase_cases 
  WHERE case_number = 'TF-20251021-0002' 
  LIMIT 1
);

-- 6. Vérifier les messages
SELECT 
  COUNT(*) as total_messages
FROM public.purchase_case_messages
WHERE case_id = (
  SELECT id FROM public.purchase_cases 
  WHERE case_number = 'TF-20251021-0002' 
  LIMIT 1
);

-- 7. Vérifier l'historique
SELECT 
  status,
  new_status,
  previous_status,
  updated_by,
  created_at
FROM public.purchase_case_history
WHERE case_id = (
  SELECT id FROM public.purchase_cases 
  WHERE case_number = 'TF-20251021-0002' 
  LIMIT 1
)
ORDER BY created_at DESC
LIMIT 10;

-- 8. Vérifier les paiements
SELECT 
  id,
  status,
  amount,
  currency,
  due_date,
  paid_date,
  created_at
FROM public.payments
WHERE case_id = (
  SELECT id FROM public.purchase_cases 
  WHERE case_number = 'TF-20251021-0002' 
  LIMIT 1
)
ORDER BY created_at DESC;
