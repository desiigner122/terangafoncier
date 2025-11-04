-- ============================================
-- TEST APRÈS APPLICATION DU FIX RLS V2
-- ============================================
-- À exécuter dans Supabase SQL Editor APRÈS avoir appliqué FIX_RLS_TIMELINE_V2_SIMPLIFIED.sql

-- 1. Vérifier les politiques
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'purchase_case_timeline'
ORDER BY cmd, policyname;

-- Résultat attendu:
-- timeline_select_authenticated | SELECT | {authenticated}
-- timeline_insert_policy | INSERT | {authenticated}
-- timeline_update_policy | UPDATE | {authenticated}
-- timeline_delete_policy | DELETE | {authenticated}

-- 2. Vérifier les GRANTS
SELECT 
  grantee, 
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'purchase_case_timeline'
  AND grantee = 'authenticated'
ORDER BY privilege_type;

-- Résultat attendu:
-- authenticated | SELECT
-- authenticated | INSERT
-- authenticated | UPDATE

-- 3. Compter les événements existants
SELECT COUNT(*) as total_events FROM purchase_case_timeline;

-- 4. Si aucun événement, insérer un événement de test MANUELLEMENT
-- IMPORTANT: Remplacez les valeurs par un vrai case_id et user_id

/*
-- Obtenir un case_id valide
SELECT id, case_number FROM purchase_cases ORDER BY created_at DESC LIMIT 1;

-- Obtenir votre user_id (notaire)
SELECT id, email, role FROM profiles WHERE role = 'notaire' LIMIT 1;

-- Insérer un événement de test (remplacez les UUIDs)
INSERT INTO purchase_case_timeline (
  case_id,
  event_type,
  title,
  description,
  metadata,
  triggered_by
) VALUES (
  'REMPLACER_PAR_CASE_ID'::uuid,
  'status_change',
  'Test: Statut mis à jour',
  'Événement de test créé manuellement',
  '{"old_status": "initiated", "new_status": "document_collection", "to_status": "document_collection"}'::jsonb,
  'REMPLACER_PAR_USER_ID'::uuid
);
*/

-- 5. Vérifier que l'événement a bien été inséré
SELECT 
  event_type,
  title,
  metadata,
  created_at
FROM purchase_case_timeline
ORDER BY created_at DESC
LIMIT 5;

-- ✅ Si l'insertion réussit → Les politiques RLS sont correctes
-- ✅ Si l'insertion échoue → Il y a encore un problème de permissions
