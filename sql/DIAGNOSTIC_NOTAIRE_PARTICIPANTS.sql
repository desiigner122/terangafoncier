-- Script de diagnostic pour comprendre pourquoi le notaire apparaît "en attente"
-- À exécuter dans Supabase SQL Editor

-- 1. Vérifier la structure de purchase_cases (notaire_id existe?)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'purchase_cases' 
  AND column_name LIKE '%notaire%' OR column_name LIKE '%notary%'
ORDER BY column_name;

-- 2. Voir les dossiers avec leur notaire_id
SELECT 
  id,
  case_number,
  status,
  notaire_id,
  buyer_id,
  seller_id
FROM purchase_cases
ORDER BY created_at DESC
LIMIT 5;

-- 3. Vérifier si les notaires sont dans purchase_case_participants
SELECT 
  pcp.id,
  pcp.case_id,
  pcp.user_id,
  pcp.role,
  pcp.status as participant_status,
  p.full_name,
  p.email,
  pc.case_number
FROM purchase_case_participants pcp
JOIN profiles p ON p.id = pcp.user_id
JOIN purchase_cases pc ON pc.id = pcp.case_id
WHERE pcp.role = 'notary' OR pcp.role = 'notaire'
ORDER BY pcp.created_at DESC
LIMIT 10;

-- 4. Comparer: Notaires dans purchase_cases.notaire_id vs purchase_case_participants
SELECT 
  pc.id as case_id,
  pc.case_number,
  pc.notaire_id as notaire_in_cases_table,
  pcp.user_id as notaire_in_participants_table,
  pcp.status as participant_status,
  CASE 
    WHEN pc.notaire_id IS NOT NULL AND pcp.user_id IS NULL THEN '❌ Notaire manquant dans participants'
    WHEN pc.notaire_id IS NOT NULL AND pcp.user_id IS NOT NULL AND pcp.status = 'pending' THEN '⚠️ Notaire marqué pending'
    WHEN pc.notaire_id IS NOT NULL AND pcp.user_id IS NOT NULL AND pcp.status = 'active' THEN '✅ Notaire actif'
    ELSE '❓ Pas de notaire assigné'
  END as diagnostic
FROM purchase_cases pc
LEFT JOIN purchase_case_participants pcp 
  ON pc.id = pcp.case_id 
  AND pcp.role IN ('notary', 'notaire')
WHERE pc.notaire_id IS NOT NULL
ORDER BY pc.created_at DESC
LIMIT 10;

-- 5. Profils des notaires pour vérifier les rôles
SELECT 
  id,
  full_name,
  email,
  role
FROM profiles
WHERE role = 'notaire' OR role = 'notary'
LIMIT 10;
