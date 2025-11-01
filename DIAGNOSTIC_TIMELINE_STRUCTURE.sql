-- ============================================
-- DIAGNOSTIC TIMELINE - STRUCTURE DES ÉVÉNEMENTS
-- ============================================
-- Ce script vérifie la structure des événements timeline
-- pour identifier pourquoi certaines étapes ne sont pas reconnues

-- 1. Vérifier TOUS les événements du dossier TF-20251021-0002
SELECT 
  '📊 Structure complète des événements' as diagnostic,
  pct.id,
  pct.created_at,
  pct.event_type,
  pct.title,
  pct.description as description_raw,
  pct.metadata as metadata_json,
  pct.metadata->>'old_status' as meta_old_status,
  pct.metadata->>'new_status' as meta_new_status,
  pct.metadata->>'to_status' as meta_to_status,
  pct.metadata->>'source' as meta_source
FROM purchase_case_timeline pct
WHERE pct.case_id = (
  SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002'
)
AND pct.event_type = 'status_change'
ORDER BY pct.created_at ASC;

-- 2. Vérifier les types de metadata
SELECT 
  '🔍 Types de données metadata' as diagnostic,
  COUNT(*) as total_events,
  COUNT(CASE WHEN metadata IS NOT NULL THEN 1 END) as with_metadata,
  COUNT(CASE WHEN metadata->>'to_status' IS NOT NULL THEN 1 END) as with_to_status,
  COUNT(CASE WHEN metadata->>'new_status' IS NOT NULL THEN 1 END) as with_new_status
FROM purchase_case_timeline pct
WHERE pct.case_id = (
  SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002'
)
AND pct.event_type = 'status_change';

-- 3. Liste des étapes trouvées vs étapes manquantes
WITH expected_stages AS (
  SELECT unnest(ARRAY[
    'initiated',
    'buyer_verification',
    'seller_notification',
    'negotiation',
    'preliminary_agreement',
    'contract_preparation',
    'legal_verification',
    'document_audit',
    'property_evaluation'
  ]) as stage_id
),
found_stages AS (
  SELECT DISTINCT
    pct.metadata->>'to_status' as stage_id
  FROM purchase_case_timeline pct
  WHERE pct.case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
    AND pct.event_type = 'status_change'
    AND pct.metadata->>'to_status' IS NOT NULL
)
SELECT 
  '✅ Comparaison étapes attendues vs trouvées' as diagnostic,
  es.stage_id,
  CASE 
    WHEN fs.stage_id IS NOT NULL THEN '✅ Trouvé'
    ELSE '❌ Manquant'
  END as status
FROM expected_stages es
LEFT JOIN found_stages fs ON es.stage_id = fs.stage_id
ORDER BY 
  CASE es.stage_id
    WHEN 'initiated' THEN 1
    WHEN 'buyer_verification' THEN 2
    WHEN 'seller_notification' THEN 3
    WHEN 'negotiation' THEN 4
    WHEN 'preliminary_agreement' THEN 5
    WHEN 'contract_preparation' THEN 6
    WHEN 'legal_verification' THEN 7
    WHEN 'document_audit' THEN 8
    WHEN 'property_evaluation' THEN 9
  END;

-- 4. Vérifier si description contient des données JSON valides
SELECT 
  '🔎 Analyse du champ description' as diagnostic,
  pct.title,
  pct.description as description_string,
  pct.metadata as metadata_object,
  CASE 
    WHEN pct.description::text ~ '^\{.*\}$' THEN '✅ JSON valide'
    ELSE '⚠️ Non-JSON'
  END as description_type
FROM purchase_case_timeline pct
WHERE pct.case_id = (
  SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002'
)
AND pct.event_type = 'status_change'
ORDER BY pct.created_at ASC;

-- 5. Test de parsing du metadata pour chaque événement
SELECT 
  '🧪 Test de lecture metadata' as diagnostic,
  pct.title,
  pct.metadata->>'to_status' as to_status_extracted,
  pct.metadata->>'new_status' as new_status_extracted,
  CASE 
    WHEN pct.metadata->>'to_status' IS NOT NULL THEN '✅ to_status OK'
    WHEN pct.metadata->>'new_status' IS NOT NULL THEN '⚠️ Uniquement new_status'
    ELSE '❌ Aucun statut trouvé'
  END as extraction_status
FROM purchase_case_timeline pct
WHERE pct.case_id = (
  SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002'
)
AND pct.event_type = 'status_change'
ORDER BY pct.created_at ASC;

-- 6. Statut actuel du dossier
SELECT 
  '📋 Statut actuel du dossier' as diagnostic,
  pc.case_number,
  pc.status as current_status,
  pc.created_at as dossier_created_at
FROM purchase_cases pc
WHERE pc.case_number = 'TF-20251021-0002';

-- ============================================
-- SOLUTION : Corriger les événements malformés
-- ============================================
-- Si certains événements n'ont pas de metadata->>'to_status',
-- ce script les corrige

-- Vérifier d'abord s'il y a des événements à corriger
SELECT 
  '⚠️ Événements nécessitant correction' as info,
  COUNT(*) as events_to_fix
FROM purchase_case_timeline pct
WHERE pct.case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
  AND pct.event_type = 'status_change'
  AND (pct.metadata->>'to_status' IS NULL OR pct.metadata->>'to_status' = '');

-- DÉCOMMENTER pour corriger les événements malformés
/*
UPDATE purchase_case_timeline pct
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{to_status}',
  to_jsonb(COALESCE(
    pct.metadata->>'new_status',
    (pct.description::jsonb)->>'new_status',
    (pct.description::jsonb)->>'status'
  ))
)
WHERE pct.case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
  AND pct.event_type = 'status_change'
  AND (pct.metadata->>'to_status' IS NULL OR pct.metadata->>'to_status' = '')
  AND (
    pct.metadata->>'new_status' IS NOT NULL 
    OR (pct.description::jsonb)->>'new_status' IS NOT NULL
  );

-- Vérifier le résultat
SELECT 
  '✅ Correction effectuée' as info,
  COUNT(*) as corrected_events
FROM purchase_case_timeline pct
WHERE pct.case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
  AND pct.event_type = 'status_change'
  AND pct.metadata->>'to_status' IS NOT NULL;
*/
