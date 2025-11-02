-- ============================================================
-- Phase 4: Triggers de Synchronisation
-- ============================================================
-- Ce fichier contient les triggers pour:
-- 1. Synchroniser notaire_id quand l'assignation est acceptée
-- 2. Mettre à jour progress_percentage sur changement de status
-- 3. Créer notifications automatiques sur événements timeline
-- ============================================================

-- ============================================================
-- 1. Trigger: Synchroniser notaire_id quand accepté
-- ============================================================

CREATE OR REPLACE FUNCTION sync_notaire_id_on_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le notaire vient d'accepter (notaire_status = 'accepted')
  IF NEW.notaire_status = 'accepted' AND (OLD.notaire_status IS NULL OR OLD.notaire_status != 'accepted') THEN
    
    -- Mettre à jour le notaire_id dans purchase_cases
    UPDATE purchase_cases
    SET 
      notaire_id = NEW.notaire_id,
      updated_at = NOW()
    WHERE id = NEW.case_id;
    
    RAISE NOTICE 'Notaire ID synchronisé: case_id=%, notaire_id=%', NEW.case_id, NEW.notaire_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attacher le trigger
DROP TRIGGER IF EXISTS sync_notaire_on_acceptance ON notaire_case_assignments;

CREATE TRIGGER sync_notaire_on_acceptance
  AFTER UPDATE ON notaire_case_assignments
  FOR EACH ROW
  EXECUTE FUNCTION sync_notaire_id_on_acceptance();

COMMENT ON TRIGGER sync_notaire_on_acceptance ON notaire_case_assignments IS 
'Synchronise automatiquement notaire_id dans purchase_cases quand le notaire accepte';

-- ============================================================
-- 2. Trigger: Mettre à jour progress_percentage
-- ============================================================

CREATE OR REPLACE FUNCTION update_case_progress()
RETURNS TRIGGER AS $$
DECLARE
  new_progress INTEGER;
BEGIN
  -- Calculer le pourcentage basé sur le statut
  new_progress := CASE NEW.status
    WHEN 'initiated' THEN 10
    WHEN 'buyer_verification' THEN 15
    WHEN 'seller_notification' THEN 20
    WHEN 'notary_assignment' THEN 25
    WHEN 'preliminary_agreement' THEN 30
    WHEN 'negotiation' THEN 35
    WHEN 'document_collection' THEN 40
    WHEN 'title_verification' THEN 50
    WHEN 'contract_preparation' THEN 60
    WHEN 'deposit_payment' THEN 65
    WHEN 'deposit_pending' THEN 65
    WHEN 'contract_validation' THEN 70
    WHEN 'appointment_scheduling' THEN 75
    WHEN 'signing_appointment' THEN 80
    WHEN 'final_payment' THEN 85
    WHEN 'final_payment_pending' THEN 85
    WHEN 'signature' THEN 90
    WHEN 'registration' THEN 95
    WHEN 'completed' THEN 100
    WHEN 'cancelled' THEN 0
    WHEN 'rejected' THEN 0
    WHEN 'seller_declined' THEN 0
    ELSE COALESCE(NEW.progress_percentage, 0)
  END;
  
  -- Mettre à jour le progress si différent
  IF NEW.progress_percentage IS DISTINCT FROM new_progress THEN
    NEW.progress_percentage := new_progress;
    RAISE NOTICE 'Progress mis à jour: case_id=%, status=%, progress=%', NEW.id, NEW.status, new_progress;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attacher le trigger
DROP TRIGGER IF EXISTS update_progress_on_status_change ON purchase_cases;

CREATE TRIGGER update_progress_on_status_change
  BEFORE UPDATE ON purchase_cases
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_case_progress();

COMMENT ON TRIGGER update_progress_on_status_change ON purchase_cases IS 
'Met à jour automatiquement progress_percentage quand le status change';

-- ============================================================
-- 3. Trigger: Notifications automatiques sur timeline
-- ============================================================

CREATE OR REPLACE FUNCTION create_notification_on_timeline()
RETURNS TRIGGER AS $$
DECLARE
  case_buyer_id UUID;
  case_seller_id UUID;
  case_notaire_id UUID;
  notification_title TEXT;
  notification_message TEXT;
  notification_type VARCHAR(50);
BEGIN
  -- Récupérer les IDs des participants
  SELECT buyer_id, seller_id, notaire_id
  INTO case_buyer_id, case_seller_id, case_notaire_id
  FROM purchase_cases
  WHERE id = NEW.case_id;
  
  -- Déterminer le type et le message de notification basé sur event_type
  notification_type := CASE 
    WHEN NEW.event_type LIKE '%approved%' THEN 'notaire_approval'
    WHEN NEW.event_type LIKE '%accepted%' THEN 'notaire_accepted'
    WHEN NEW.event_type LIKE '%declined%' THEN 'notaire_declined'
    WHEN NEW.event_type LIKE '%document%' THEN 'document_uploaded'
    WHEN NEW.event_type LIKE '%payment%' THEN 'payment_update'
    WHEN NEW.event_type LIKE '%appointment%' THEN 'appointment_update'
    WHEN NEW.event_type LIKE '%contract%' THEN 'contract_update'
    WHEN NEW.event_type LIKE '%fees%' THEN 'fees_update'
    ELSE 'timeline_update'
  END;
  
  notification_title := NEW.title;
  notification_message := NEW.description;
  
  -- Créer notifications pour l'acheteur (sauf si c'est lui qui a déclenché)
  IF case_buyer_id IS NOT NULL AND case_buyer_id != NEW.triggered_by THEN
    INSERT INTO notifications (
      recipient_id,
      sender_id,
      type,
      title,
      message,
      case_id,
      read,
      created_at
    ) VALUES (
      case_buyer_id,
      NEW.triggered_by,
      notification_type,
      notification_title,
      notification_message,
      NEW.case_id,
      false,
      NOW()
    );
  END IF;
  
  -- Créer notifications pour le vendeur (sauf si c'est lui qui a déclenché)
  IF case_seller_id IS NOT NULL AND case_seller_id != NEW.triggered_by THEN
    INSERT INTO notifications (
      recipient_id,
      sender_id,
      type,
      title,
      message,
      case_id,
      read,
      created_at
    ) VALUES (
      case_seller_id,
      NEW.triggered_by,
      notification_type,
      notification_title,
      notification_message,
      NEW.case_id,
      false,
      NOW()
    );
  END IF;
  
  -- Créer notifications pour le notaire (sauf si c'est lui qui a déclenché)
  IF case_notaire_id IS NOT NULL AND case_notaire_id != NEW.triggered_by THEN
    INSERT INTO notifications (
      recipient_id,
      sender_id,
      type,
      title,
      message,
      case_id,
      read,
      created_at
    ) VALUES (
      case_notaire_id,
      NEW.triggered_by,
      notification_type,
      notification_title,
      notification_message,
      NEW.case_id,
      false,
      NOW()
    );
  END IF;
  
  RAISE NOTICE 'Notifications créées pour timeline event: %', NEW.event_type;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attacher le trigger
DROP TRIGGER IF EXISTS create_notifications_on_timeline ON purchase_case_timeline;

CREATE TRIGGER create_notifications_on_timeline
  AFTER INSERT ON purchase_case_timeline
  FOR EACH ROW
  EXECUTE FUNCTION create_notification_on_timeline();

COMMENT ON TRIGGER create_notifications_on_timeline ON purchase_case_timeline IS 
'Crée automatiquement des notifications pour toutes les parties quand un événement timeline est ajouté';

-- ============================================================
-- 4. Trigger: Mettre à jour updated_at automatiquement
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables principales
DROP TRIGGER IF EXISTS update_purchase_cases_updated_at ON purchase_cases;
CREATE TRIGGER update_purchase_cases_updated_at
  BEFORE UPDATE ON purchase_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notaire_assignments_updated_at ON notaire_case_assignments;
CREATE TRIGGER update_notaire_assignments_updated_at
  BEFORE UPDATE ON notaire_case_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Vérifications
-- ============================================================

-- Lister tous les triggers créés
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name IN (
  'sync_notaire_on_acceptance',
  'update_progress_on_status_change',
  'create_notifications_on_timeline',
  'update_purchase_cases_updated_at',
  'update_notaire_assignments_updated_at'
)
ORDER BY event_object_table, trigger_name;

-- Fin du script
