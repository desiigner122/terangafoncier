-- ============================================
-- PEUPLER LE TIMELINE À PARTIR DE L'HISTORIQUE
-- ============================================
-- Ce script crée des événements de timeline pour tous les changements
-- de statut historiques afin d'avoir un timeline complet

-- 1. Vérifier l'état actuel
SELECT 
  'Événements timeline actuels' as info,
  COUNT(*) as total
FROM purchase_case_timeline;

SELECT 
  'Entrées historiques disponibles' as info,
  COUNT(*) as total
FROM purchase_case_history;

-- 2. Créer des événements timeline pour TOUS les changements de statut historiques
-- Note: Cette requête utilise COALESCE pour gérer les cas où updated_by pourrait être NULL
INSERT INTO purchase_case_timeline (
  case_id,
  event_type,
  title,
  description,
  metadata,
  triggered_by,
  created_at
)
SELECT 
  pch.case_id,
  'status_change' as event_type,
  CONCAT('Statut historique: ', 
    CASE pch.status
      WHEN 'initiated' THEN 'Initié'
      WHEN 'buyer_verification' THEN 'Vérification acheteur'
      WHEN 'seller_notification' THEN 'Notification vendeur'
      WHEN 'negotiation' THEN 'Négociation'
      WHEN 'preliminary_agreement' THEN 'Accord préliminaire'
      WHEN 'contract_preparation' THEN 'Préparation contrat'
      WHEN 'legal_verification' THEN 'Vérification légale'
      WHEN 'document_audit' THEN 'Audit documents'
      WHEN 'property_evaluation' THEN 'Évaluation propriété'
      WHEN 'notary_appointment' THEN 'Rendez-vous notaire'
      WHEN 'signing_process' THEN 'Processus signature'
      WHEN 'payment_processing' THEN 'Traitement paiement'
      WHEN 'property_transfer' THEN 'Transfert propriété'
      WHEN 'completed' THEN 'Complété'
      ELSE pch.status
    END
  ) as title,
  jsonb_build_object(
    'old_status', pch.previous_status,
    'new_status', pch.status,
    'to_status', pch.status,
    'changed_by', pch.updated_by_role,
    'notes', pch.notes,
    'source', 'migrated_from_history'
  )::text as description,
  jsonb_build_object(
    'old_status', pch.previous_status,
    'new_status', pch.status,
    'to_status', pch.status,
    'changed_by', pch.updated_by_role,
    'notes', pch.notes,
    'source', 'migrated_from_history'
  ) as metadata,
  COALESCE(pch.updated_by, 
    (SELECT notaire_id FROM purchase_cases WHERE id = pch.case_id),
    (SELECT buyer_id FROM purchase_cases WHERE id = pch.case_id)
  ) as triggered_by,
  pch.created_at
FROM purchase_case_history pch
WHERE NOT EXISTS (
  -- Ne pas créer de doublon si l'événement existe déjà
  SELECT 1 FROM purchase_case_timeline pct
  WHERE pct.case_id = pch.case_id
    AND pct.event_type = 'status_change'
    AND pct.metadata->>'to_status' = pch.status
    AND pct.created_at = pch.created_at
)
ORDER BY pch.created_at ASC;

-- 3. Vérifier le résultat
SELECT 
  '✅ Timeline après migration' as info,
  COUNT(*) as total
FROM purchase_case_timeline;

-- 4. Afficher un exemple de dossier avec timeline complet
SELECT 
  pc.case_number,
  pc.status as current_status,
  COUNT(pct.id) as timeline_events
FROM purchase_cases pc
LEFT JOIN purchase_case_timeline pct ON pc.id = pct.case_id
WHERE pct.event_type = 'status_change'
GROUP BY pc.id, pc.case_number, pc.status
ORDER BY timeline_events DESC
LIMIT 5;

-- 5. Voir le détail d'un dossier
SELECT 
  pct.created_at,
  pct.title,
  pct.metadata->>'old_status' as old_status,
  pct.metadata->>'new_status' as new_status,
  pct.metadata->>'to_status' as to_status
FROM purchase_case_timeline pct
WHERE pct.case_id = (
  SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002'
)
AND pct.event_type = 'status_change'
ORDER BY pct.created_at ASC;

-- ============================================
-- ALTERNATIVE: Si vous voulez repartir de zéro
-- ============================================

-- ATTENTION: Décommenter UNIQUEMENT si vous voulez tout recommencer
/*
-- Supprimer TOUS les événements du timeline
DELETE FROM purchase_case_timeline;

-- Recréer TOUT le timeline depuis l'historique
INSERT INTO purchase_case_timeline (
  case_id,
  event_type,
  title,
  description,
  metadata,
  triggered_by,
  created_at
)
SELECT 
  pch.case_id,
  'status_change' as event_type,
  CONCAT('Statut: ', 
    CASE pch.status
      WHEN 'initiated' THEN 'Initié'
      WHEN 'buyer_verification' THEN 'Vérification acheteur'
      WHEN 'seller_notification' THEN 'Notification vendeur'
      WHEN 'negotiation' THEN 'Négociation'
      WHEN 'preliminary_agreement' THEN 'Accord préliminaire'
      WHEN 'contract_preparation' THEN 'Préparation contrat'
      WHEN 'legal_verification' THEN 'Vérification légale'
      WHEN 'document_audit' THEN 'Audit documents'
      WHEN 'property_evaluation' THEN 'Évaluation propriété'
      WHEN 'notary_appointment' THEN 'Rendez-vous notaire'
      WHEN 'signing_process' THEN 'Processus signature'
      WHEN 'payment_processing' THEN 'Traitement paiement'
      WHEN 'property_transfer' THEN 'Transfert propriété'
      WHEN 'completed' THEN 'Complété'
      ELSE pch.status
    END
  ) as title,
  jsonb_build_object(
    'old_status', pch.previous_status,
    'new_status', pch.status,
    'to_status', pch.status,
    'changed_by', pch.updated_by_role,
    'notes', pch.notes,
    'source', 'full_migration'
  )::text as description,
  jsonb_build_object(
    'old_status', pch.previous_status,
    'new_status', pch.status,
    'to_status', pch.status,
    'changed_by', pch.updated_by_role,
    'notes', pch.notes,
    'source', 'full_migration'
  ) as metadata,
  COALESCE(pch.updated_by, 
    (SELECT notaire_id FROM purchase_cases WHERE id = pch.case_id),
    (SELECT buyer_id FROM purchase_cases WHERE id = pch.case_id)
  ) as triggered_by,
  pch.created_at
FROM purchase_case_history pch
ORDER BY pch.case_id, pch.created_at ASC;

-- Vérifier
SELECT 
  '✅ Timeline complètement reconstruit' as info,
  COUNT(*) as total
FROM purchase_case_timeline;
*/

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Après exécution, chaque changement de statut dans purchase_case_history
-- aura un événement correspondant dans purchase_case_timeline
-- 
-- Cela permettra à TimelineTrackerModern d'afficher correctement
-- TOUTES les étapes complétées, pas seulement les récentes
