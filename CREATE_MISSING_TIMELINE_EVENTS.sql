-- ============================================
-- CRÉER LES ÉVÉNEMENTS TIMELINE MANQUANTS
-- ============================================
-- Ce script génère rétroactivement les événements de timeline manquants
-- pour les dossiers qui ont des étapes non documentées

-- ============================================
-- OPTION 1 : Création automatique basée sur le statut actuel
-- ============================================
-- Pour chaque dossier, crée tous les événements jusqu'au statut actuel

DO $$
DECLARE
  case_record RECORD;
  status_order TEXT[] := ARRAY[
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
  ];
  current_status_index INT;
  i INT;
  base_date TIMESTAMP WITH TIME ZONE;
  event_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Pour chaque dossier
  FOR case_record IN 
    SELECT 
      pc.id,
      pc.case_number,
      pc.status,
      pc.created_at,
      pc.notaire_id,
      pc.buyer_id
    FROM purchase_cases pc
    WHERE pc.status != 'cancelled'
  LOOP
    -- Trouver l'index du statut actuel
    SELECT array_position(status_order, case_record.status) INTO current_status_index;
    
    -- Si on ne trouve pas le statut, passer au suivant
    IF current_status_index IS NULL THEN
      CONTINUE;
    END IF;
    
    -- Date de base : première entrée timeline ou created_at du dossier
    SELECT COALESCE(MIN(created_at), case_record.created_at)
    INTO base_date
    FROM purchase_case_timeline
    WHERE case_id = case_record.id;
    
    -- Créer les événements pour chaque étape jusqu'au statut actuel
    FOR i IN 1..current_status_index LOOP
      -- Vérifier si l'événement existe déjà
      IF NOT EXISTS (
        SELECT 1 FROM purchase_case_timeline
        WHERE case_id = case_record.id
          AND event_type = 'status_change'
          AND metadata->>'to_status' = status_order[i]
      ) THEN
        -- Calculer une date progressive (1 jour entre chaque étape)
        event_date := base_date + ((i - 1) * INTERVAL '1 day');
        
        -- Insérer l'événement
        INSERT INTO purchase_case_timeline (
          case_id,
          event_type,
          title,
          description,
          metadata,
          triggered_by,
          created_at
        ) VALUES (
          case_record.id,
          'status_change',
          'Statut: ' || CASE status_order[i]
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
            ELSE status_order[i]
          END,
          jsonb_build_object(
            'old_status', CASE WHEN i > 1 THEN status_order[i-1] ELSE NULL END,
            'new_status', status_order[i],
            'to_status', status_order[i],
            'changed_by', 'auto_generated',
            'source', 'retroactive_generation'
          )::text,
          jsonb_build_object(
            'old_status', CASE WHEN i > 1 THEN status_order[i-1] ELSE NULL END,
            'new_status', status_order[i],
            'to_status', status_order[i],
            'changed_by', 'auto_generated',
            'source', 'retroactive_generation'
          ),
          COALESCE(case_record.notaire_id, case_record.buyer_id),
          event_date
        );
        
        RAISE NOTICE 'Événement créé: % - % - %', 
          case_record.case_number, 
          status_order[i], 
          event_date;
      END IF;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE '✅ Génération d''événements terminée';
END $$;

-- Vérifier le résultat
SELECT 
  pc.case_number,
  pc.status as current_status,
  COUNT(pct.id) as timeline_events,
  STRING_AGG(pct.metadata->>'to_status', ' → ' ORDER BY pct.created_at) as progression
FROM purchase_cases pc
LEFT JOIN purchase_case_timeline pct ON pc.id = pct.case_id
WHERE pct.event_type = 'status_change'
GROUP BY pc.id, pc.case_number, pc.status
ORDER BY pc.case_number;

-- ============================================
-- OPTION 2 : Création manuelle pour un dossier spécifique
-- ============================================
-- Si vous préférez créer manuellement les événements pour TF-20251021-0002

/*
-- Supprimer les événements auto-générés si besoin
DELETE FROM purchase_case_timeline
WHERE case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
  AND metadata->>'source' = 'retroactive_generation';

-- Créer les événements manquants avec des dates réalistes
WITH case_info AS (
  SELECT 
    id,
    notaire_id,
    buyer_id,
    created_at
  FROM purchase_cases
  WHERE case_number = 'TF-20251021-0002'
)
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
  case_info.id,
  'status_change',
  event_data.title,
  event_data.metadata::text,
  event_data.metadata,
  COALESCE(case_info.notaire_id, case_info.buyer_id),
  event_data.event_date
FROM case_info
CROSS JOIN (
  VALUES
    (
      'Statut: Initié',
      jsonb_build_object('old_status', null, 'new_status', 'initiated', 'to_status', 'initiated', 'changed_by', 'manual_creation', 'source', 'manual_retroactive'),
      TIMESTAMP '2025-10-21 08:00:00+00'
    ),
    (
      'Statut: Vérification acheteur',
      jsonb_build_object('old_status', 'initiated', 'new_status', 'buyer_verification', 'to_status', 'buyer_verification', 'changed_by', 'manual_creation', 'source', 'manual_retroactive'),
      TIMESTAMP '2025-10-21 09:00:00+00'
    ),
    (
      'Statut: Notification vendeur',
      jsonb_build_object('old_status', 'buyer_verification', 'new_status', 'seller_notification', 'to_status', 'seller_notification', 'changed_by', 'manual_creation', 'source', 'manual_retroactive'),
      TIMESTAMP '2025-10-21 09:30:00+00'
    ),
    (
      'Statut: Négociation',
      jsonb_build_object('old_status', 'seller_notification', 'new_status', 'negotiation', 'to_status', 'negotiation', 'changed_by', 'manual_creation', 'source', 'manual_retroactive'),
      TIMESTAMP '2025-10-21 10:00:00+00'
    ),
    (
      'Statut: Préparation contrat',
      jsonb_build_object('old_status', 'preliminary_agreement', 'new_status', 'contract_preparation', 'to_status', 'contract_preparation', 'changed_by', 'manual_creation', 'source', 'manual_retroactive'),
      TIMESTAMP '2025-10-21 11:00:00+00'
    )
) AS event_data(title, metadata, event_date)
WHERE NOT EXISTS (
  SELECT 1 FROM purchase_case_timeline
  WHERE case_id = case_info.id
    AND event_type = 'status_change'
    AND metadata->>'to_status' = event_data.metadata->>'to_status'
);

-- Vérifier le résultat pour ce dossier
SELECT 
  pct.created_at,
  pct.title,
  pct.metadata->>'old_status' as old_status,
  pct.metadata->>'new_status' as new_status,
  pct.metadata->>'to_status' as to_status,
  pct.metadata->>'source' as source
FROM purchase_case_timeline pct
WHERE pct.case_id = (
  SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002'
)
AND pct.event_type = 'status_change'
ORDER BY pct.created_at ASC;
*/

-- ============================================
-- NETTOYAGE : Supprimer les événements générés automatiquement
-- ============================================
-- Si vous voulez recommencer avec la création manuelle
/*
DELETE FROM purchase_case_timeline
WHERE metadata->>'source' IN ('retroactive_generation', 'auto_generated');
*/
