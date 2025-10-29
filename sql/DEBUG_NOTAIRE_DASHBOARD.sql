-- Diagnostic complet pour le dashboard notaire etude.diouf@teranga-foncier.sn

-- 1. Vérifier le profil notaire
SELECT 'PROFIL NOTAIRE' as check_type, id, full_name, email, role 
FROM profiles 
WHERE id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee';

-- 2. Vérifier les dossiers actifs
SELECT 'DOSSIERS ACTIFS' as check_type, id, case_number, status, buyer_id, seller_id, created_at
FROM purchase_cases
WHERE status NOT IN ('completed', 'cancelled', 'archived')
ORDER BY created_at DESC;

-- 3. Vérifier les participants notaire
SELECT 'PARTICIPANTS NOTAIRE' as check_type, 
  pcp.case_id, 
  pcp.user_id, 
  pcp.role, 
  pcp.status,
  pc.case_number,
  pc.status as case_status
FROM purchase_case_participants pcp
JOIN purchase_cases pc ON pcp.case_id = pc.id
WHERE pcp.user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee'
  AND pcp.role = 'notary';

-- 4. Vérifier toutes les colonnes de purchase_case_participants pour détecter des problèmes
SELECT 'STRUCTURE PARTICIPANTS' as check_type, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_case_participants'
ORDER BY ordinal_position;

-- 5. Compter les assignations
SELECT 'COMPTAGE' as check_type,
  COUNT(*) as total_participations,
  COUNT(CASE WHEN role = 'notary' THEN 1 END) as notary_participations,
  COUNT(CASE WHEN user_id = '6b222cf1-0bc0-42b3-a360-5fc1ca1c7eee' THEN 1 END) as etude_diouf_participations
FROM purchase_case_participants;

-- 6. Vérifier la contrainte unique qui pourrait bloquer
SELECT 'CONTRAINTES' as check_type, conname, contype, confupdtype
FROM pg_constraint 
WHERE conrelid = 'purchase_case_participants'::regclass;
