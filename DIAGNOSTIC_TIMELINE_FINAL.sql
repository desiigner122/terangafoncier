-- ============================================
-- DIAGNOSTIC FINAL - COMPARAISON METADATA VS WORKFLOW
-- ============================================
-- Ce script compare les IDs de statuts dans la BD vs ceux attendus par le code

-- 1. Afficher les metadata->>'to_status' réels dans la BD
SELECT 
  '📊 Statuts to_status dans la BD' as diagnostic,
  pct.metadata->>'to_status' as to_status_value,
  COUNT(*) as count
FROM purchase_case_timeline pct
WHERE pct.case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
  AND pct.event_type = 'status_change'
GROUP BY pct.metadata->>'to_status'
ORDER BY MIN(pct.created_at);

-- 2. Liste des statuts attendus par WorkflowStatusService.chronologicalOrder
WITH expected_statuses AS (
  SELECT unnest(ARRAY[
    'initiated',
    'buyer_verification',
    'seller_notification',
    'negotiation',
    'preliminary_agreement',
    'contract_preparation',
    'legal_verification',
    'document_audit',
    'property_evaluation',
    'notary_appointment',
    'signing_process',
    'payment_processing',
    'property_transfer',
    'completed'
  ]) as status_id,
  generate_series(1, 14) as ordre
)
SELECT 
  '🎯 Statuts attendus par le code' as diagnostic,
  es.ordre,
  es.status_id as expected_status,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM purchase_case_timeline pct2
      WHERE pct2.case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
        AND pct2.event_type = 'status_change'
        AND pct2.metadata->>'to_status' = es.status_id
    ) THEN '✅ Trouvé dans BD'
    ELSE '❌ Manquant dans BD'
  END as presence_bd
FROM expected_statuses es
ORDER BY es.ordre;

-- 3. Détail complet de CHAQUE événement avec debug
SELECT 
  '🔍 Debug détaillé des événements' as diagnostic,
  pct.created_at,
  pct.title,
  pct.metadata->>'to_status' as to_status,
  pct.metadata->>'new_status' as new_status,
  pct.metadata->>'old_status' as old_status,
  pct.description,
  pct.metadata as metadata_full
FROM purchase_case_timeline pct
WHERE pct.case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
  AND pct.event_type = 'status_change'
ORDER BY pct.created_at ASC;

-- 4. Statut actuel du dossier
SELECT 
  '📋 État du dossier' as diagnostic,
  pc.case_number,
  pc.status as current_status,
  pc.phase as current_phase
FROM purchase_cases pc
WHERE pc.case_number = 'TF-20251021-0002';

-- 5. Test de correspondance : Est-ce que le code peut trouver les événements ?
SELECT 
  '🧪 Test de matching code ↔ BD' as diagnostic,
  pct.title,
  pct.metadata->>'to_status' as to_status_bd,
  CASE 
    WHEN pct.metadata->>'to_status' IN (
      'initiated',
      'buyer_verification',
      'seller_notification',
      'negotiation',
      'preliminary_agreement',
      'contract_preparation',
      'legal_verification',
      'document_audit',
      'property_evaluation'
    ) THEN '✅ ID reconnu par le code'
    ELSE '❌ ID NON reconnu par le code'
  END as matching_status
FROM purchase_case_timeline pct
WHERE pct.case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
  AND pct.event_type = 'status_change'
ORDER BY pct.created_at ASC;
