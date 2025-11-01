-- ============================================
-- DIAGNOSTIC COMPLET DU TIMELINE
-- ============================================
-- À exécuter dans Supabase SQL Editor pour comprendre pourquoi les étapes restent en attente

-- ========================================
-- PARTIE 1: VÉRIFICATION DE LA STRUCTURE
-- ========================================

-- 1.1 Vérifier que la table purchase_case_timeline existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name IN ('purchase_case_timeline', 'purchase_case_history')
ORDER BY table_name;

-- Résultat attendu: 2 lignes (les deux tables doivent exister)

-- 1.2 Vérifier la structure de purchase_case_timeline
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'purchase_case_timeline'
ORDER BY ordinal_position;

-- Résultat attendu: Colonnes incluant id, case_id, event_type, title, triggered_by, metadata, created_at

-- ========================================
-- PARTIE 2: VÉRIFICATION DES POLITIQUES RLS
-- ========================================

-- 2.1 Vérifier que RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('purchase_case_timeline', 'purchase_case_history')
ORDER BY tablename;

-- Résultat attendu: rowsecurity = true pour les deux tables

-- 2.2 Lister toutes les politiques RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  CASE 
    WHEN cmd = 'SELECT' THEN 'Lecture'
    WHEN cmd = 'INSERT' THEN 'Insertion'
    WHEN cmd = 'UPDATE' THEN 'Modification'
    WHEN cmd = 'DELETE' THEN 'Suppression'
    ELSE cmd
  END as action
FROM pg_policies
WHERE tablename IN ('purchase_case_timeline', 'purchase_case_history')
ORDER BY tablename, cmd;

-- Résultat attendu: 
-- - timeline_select_policy (SELECT)
-- - timeline_insert_policy (INSERT)
-- - timeline_update_policy (UPDATE)
-- - timeline_delete_policy (DELETE)
-- + 2 politiques pour purchase_case_history

-- ========================================
-- PARTIE 3: VÉRIFICATION DES DONNÉES
-- ========================================

-- 3.1 Compter les événements dans purchase_case_timeline
SELECT 
  COUNT(*) as total_events,
  COUNT(DISTINCT case_id) as total_cases_with_events,
  COUNT(DISTINCT event_type) as distinct_event_types
FROM purchase_case_timeline;

-- 3.2 Voir les types d'événements enregistrés
SELECT 
  event_type,
  COUNT(*) as count
FROM purchase_case_timeline
GROUP BY event_type
ORDER BY count DESC;

-- Résultat attendu: Si 0 événements → PROBLÈME : Rien n'est enregistré !

-- 3.3 Voir les derniers événements enregistrés (si il y en a)
SELECT 
  pct.created_at,
  pc.case_number,
  pct.event_type,
  pct.title,
  pct.metadata,
  p.full_name as triggered_by_name,
  p.role as triggered_by_role
FROM purchase_case_timeline pct
JOIN purchase_cases pc ON pc.id = pct.case_id
LEFT JOIN profiles p ON p.id = pct.triggered_by
ORDER BY pct.created_at DESC
LIMIT 10;

-- ========================================
-- PARTIE 4: VÉRIFICATION DES DOSSIERS
-- ========================================

-- 4.1 Lister les dossiers et leur statut
SELECT 
  case_number,
  status,
  buyer_id,
  seller_id,
  notaire_id,
  created_at,
  updated_at,
  (SELECT COUNT(*) FROM purchase_case_timeline WHERE case_id = purchase_cases.id) as timeline_events_count
FROM purchase_cases
ORDER BY created_at DESC
LIMIT 10;

-- 4.2 Vérifier un dossier spécifique (remplacer TF-20251021-0002 par votre dossier)
SELECT 
  pc.case_number,
  pc.status,
  pc.buyer_id,
  pc.seller_id,
  pc.notaire_id,
  buyer.full_name as acheteur,
  seller.full_name as vendeur,
  notaire.full_name as notaire_nom,
  (SELECT COUNT(*) FROM purchase_case_timeline WHERE case_id = pc.id) as timeline_events
FROM purchase_cases pc
LEFT JOIN profiles buyer ON buyer.id = pc.buyer_id
LEFT JOIN profiles seller ON seller.id = pc.seller_id
LEFT JOIN profiles notaire ON notaire.id = pc.notaire_id
WHERE pc.case_number = 'TF-20251021-0002'; -- Remplacer par votre dossier

-- 4.3 Voir les participants de ce dossier
SELECT 
  pcp.role,
  pcp.status,
  p.full_name,
  p.email,
  p.role as profile_role
FROM purchase_case_participants pcp
JOIN profiles p ON p.id = pcp.user_id
WHERE pcp.case_id = (SELECT id FROM purchase_cases WHERE case_number = 'TF-20251021-0002')
ORDER BY pcp.created_at;

-- ========================================
-- PARTIE 5: TEST D'INSERTION (DIAGNOSTIC)
-- ========================================

-- 5.1 Tester si on peut insérer un événement de test
-- ATTENTION: Cette commande va créer un événement de test !
-- Ne l'exécutez QUE si vous êtes connecté et que vous voulez tester

-- Décommentez cette section pour tester:
/*
INSERT INTO purchase_case_timeline (
  case_id,
  event_type,
  title,
  description,
  metadata,
  triggered_by
)
SELECT 
  id,
  'test_diagnostic',
  'Test d''insertion depuis diagnostic',
  'Cet événement est créé pour tester les politiques RLS',
  '{"test": true, "source": "diagnostic"}'::jsonb,
  auth.uid()
FROM purchase_cases
WHERE case_number = 'TF-20251021-0002'
LIMIT 1;
*/

-- Si cette insertion échoue avec "row-level security policy", 
-- cela signifie que les politiques RLS ne sont pas correctement configurées

-- ========================================
-- PARTIE 6: RÉSUMÉ DES PROBLÈMES POTENTIELS
-- ========================================

-- 6.1 Vérifier si l'utilisateur actuel peut voir les dossiers
SELECT 
  COUNT(*) as cases_visible,
  auth.uid() as current_user_id
FROM purchase_cases
WHERE buyer_id = auth.uid() 
   OR seller_id = auth.uid() 
   OR notaire_id = auth.uid()
   OR EXISTS (
     SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
   );

-- 6.2 Vérifier si l'utilisateur actuel est participant d'un dossier
SELECT 
  pc.case_number,
  pcp.role as participant_role,
  pcp.status as participant_status
FROM purchase_case_participants pcp
JOIN purchase_cases pc ON pc.id = pcp.case_id
WHERE pcp.user_id = auth.uid()
ORDER BY pc.created_at DESC
LIMIT 5;

-- ========================================
-- RÉSUMÉ DES VÉRIFICATIONS
-- ========================================
/*
CHECKLIST:
☐ La table purchase_case_timeline existe ?
☐ RLS est activé sur purchase_case_timeline ?
☐ Les 4 politiques RLS existent (SELECT, INSERT, UPDATE, DELETE) ?
☐ Il y a des événements dans purchase_case_timeline ?
☐ Le dossier TF-20251021-0002 existe ?
☐ L'utilisateur actuel est participant du dossier ?
☐ Le notaire est bien assigné au dossier ?

SI TOUS OUI → Le problème est dans le code frontend
SI UN NON → Exécuter FIX_PURCHASE_CASE_TIMELINE_RLS.sql
*/
