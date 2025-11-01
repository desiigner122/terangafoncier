-- ============================================
-- TRIGGER AUTOMATIQUE - SYNCHRONISATION TIMELINE
-- ============================================
-- Ce trigger crée automatiquement un événement de timeline
-- chaque fois que le statut d'un dossier change

-- 1. Créer la fonction trigger
CREATE OR REPLACE FUNCTION sync_timeline_on_status_change()
RETURNS TRIGGER AS $$
DECLARE
  status_label TEXT;
  user_id_to_use UUID;
BEGIN
  -- Ne rien faire si le statut n'a pas changé
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  -- Obtenir le label du nouveau statut
  status_label := CASE NEW.status
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
    WHEN 'cancelled' THEN 'Annulé'
    WHEN 'on_hold' THEN 'En attente'
    ELSE NEW.status
  END;

  -- Déterminer l'utilisateur (auth.uid() ou notaire ou buyer)
  user_id_to_use := COALESCE(
    auth.uid(),
    NEW.notaire_id,
    NEW.buyer_id
  );

  -- Insérer l'événement dans le timeline
  INSERT INTO purchase_case_timeline (
    case_id,
    event_type,
    title,
    description,
    metadata,
    triggered_by,
    created_at
  ) VALUES (
    NEW.id,
    'status_change',
    'Statut mis à jour: ' || status_label,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'to_status', NEW.status,
      'changed_by', 'system_trigger',
      'automatic', true
    )::text,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'to_status', NEW.status,
      'changed_by', 'system_trigger',
      'automatic', true
    ),
    user_id_to_use,
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Créer le trigger
DROP TRIGGER IF EXISTS trigger_sync_timeline_on_status_change ON purchase_cases;

CREATE TRIGGER trigger_sync_timeline_on_status_change
  AFTER UPDATE OF status ON purchase_cases
  FOR EACH ROW
  EXECUTE FUNCTION sync_timeline_on_status_change();

-- 3. Tester le trigger
-- Essayons de changer manuellement un statut pour voir si ça fonctionne

-- Avant le test, vérifier le nombre actuel d'événements
SELECT 
  '📊 Événements timeline avant test' as info,
  COUNT(*) as total
FROM purchase_case_timeline;

-- Simuler un changement de statut (DÉCOMMENTER pour tester)
/*
UPDATE purchase_cases
SET status = 'notary_appointment'
WHERE case_number = 'TF-20251021-0002';

-- Vérifier qu'un événement a été créé
SELECT 
  '✅ Nouvel événement créé par trigger' as info,
  pct.*
FROM purchase_case_timeline pct
WHERE pct.case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
  AND pct.metadata->>'automatic' = 'true'
ORDER BY pct.created_at DESC
LIMIT 1;
*/

-- 4. Vérifier que le trigger est actif
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_sync_timeline_on_status_change';

-- ============================================
-- ALTERNATIVE : Trigger avec historique également
-- ============================================
-- Si vous voulez AUSSI garder purchase_case_history à jour

CREATE OR REPLACE FUNCTION sync_timeline_and_history_on_status_change()
RETURNS TRIGGER AS $$
DECLARE
  status_label TEXT;
  user_id_to_use UUID;
BEGIN
  -- Ne rien faire si le statut n'a pas changé
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  -- Obtenir le label du nouveau statut
  status_label := CASE NEW.status
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
    WHEN 'cancelled' THEN 'Annulé'
    WHEN 'on_hold' THEN 'En attente'
    ELSE NEW.status
  END;

  -- Déterminer l'utilisateur
  user_id_to_use := COALESCE(
    auth.uid(),
    NEW.notaire_id,
    NEW.buyer_id
  );

  -- 1. Insérer dans timeline
  INSERT INTO purchase_case_timeline (
    case_id,
    event_type,
    title,
    description,
    metadata,
    triggered_by,
    created_at
  ) VALUES (
    NEW.id,
    'status_change',
    'Statut mis à jour: ' || status_label,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'to_status', NEW.status,
      'changed_by', 'system_trigger',
      'automatic', true
    )::text,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'to_status', NEW.status,
      'changed_by', 'system_trigger',
      'automatic', true
    ),
    user_id_to_use,
    NOW()
  );

  -- 2. Insérer dans history également
  INSERT INTO purchase_case_history (
    case_id,
    old_status,
    new_status,
    changed_by,
    notes,
    created_at
  ) VALUES (
    NEW.id,
    OLD.status,
    NEW.status,
    user_id_to_use,
    'Changement automatique par trigger: ' || OLD.status || ' → ' || NEW.status,
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activer ce trigger à la place (DÉCOMMENTER pour utiliser cette version)
/*
DROP TRIGGER IF EXISTS trigger_sync_timeline_on_status_change ON purchase_cases;
DROP TRIGGER IF EXISTS trigger_sync_timeline_and_history_on_status_change ON purchase_cases;

CREATE TRIGGER trigger_sync_timeline_and_history_on_status_change
  AFTER UPDATE OF status ON purchase_cases
  FOR EACH ROW
  EXECUTE FUNCTION sync_timeline_and_history_on_status_change();
*/

-- ============================================
-- DÉSACTIVER LE TRIGGER (si besoin)
-- ============================================
-- DÉCOMMENTER pour désactiver temporairement
/*
DROP TRIGGER IF EXISTS trigger_sync_timeline_on_status_change ON purchase_cases;
DROP TRIGGER IF EXISTS trigger_sync_timeline_and_history_on_status_change ON purchase_cases;
*/

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Après activation du trigger :
-- 1. Chaque UPDATE de purchase_cases.status créera automatiquement un événement dans purchase_case_timeline
-- 2. Plus besoin d'appeler manuellement AdvancedCaseTrackingService.logTimelineEvent()
-- 3. Garantit la cohérence entre purchase_cases.status et purchase_case_timeline
-- 4. Évite les oublis d'enregistrement d'événements

-- ⚠️ NOTE : Si vous gardez AUSSI l'appel manuel dans NotaireCaseDetailModern.jsx,
-- vous aurez 2 événements par changement de statut (un manuel, un automatique).
-- Choisissez l'une des deux approches :
-- - Option A : Trigger automatique seul (supprimer logTimelineEvent du code)
-- - Option B : Appel manuel seul (ne pas créer ce trigger)
-- - Option C : Les deux (accepter les doublons, utile pour redondance)
