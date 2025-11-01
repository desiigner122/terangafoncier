-- ============================================
-- TEST DES POLITIQUES RLS purchase_case_timeline
-- ============================================
-- Exécutez ce script APRÈS avoir appliqué FIX_PURCHASE_CASE_TIMELINE_RLS.sql

-- 1. Vérifier que les politiques existent
SELECT 
  tablename,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE tablename = 'purchase_case_timeline'
ORDER BY policyname;

-- ✅ ATTENDU: 4 politiques
-- - timeline_delete_policy (DELETE)
-- - timeline_insert_policy (INSERT)
-- - timeline_select_policy (SELECT)
-- - timeline_update_policy (UPDATE)

-- 2. Vérifier la structure de la table
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_case_timeline'
ORDER BY ordinal_position;

-- ✅ ATTENDU: Colonnes incluant
-- - id (uuid)
-- - case_id (uuid)
-- - event_type (text)
-- - title (text)
-- - triggered_by (uuid)
-- - metadata (jsonb)
-- - created_at (timestamp)

-- 3. Compter les événements existants
SELECT 
  event_type,
  COUNT(*) as count
FROM purchase_case_timeline
GROUP BY event_type
ORDER BY count DESC;

-- 4. Voir les derniers événements par dossier
SELECT 
  pc.case_number,
  pct.event_type,
  pct.title,
  pct.created_at,
  p.full_name as triggered_by_name
FROM purchase_case_timeline pct
JOIN purchase_cases pc ON pc.id = pct.case_id
LEFT JOIN profiles p ON p.id = pct.triggered_by
ORDER BY pct.created_at DESC
LIMIT 20;

-- 5. Vérifier les dossiers et leurs participants
SELECT 
  pc.case_number,
  pc.status,
  buyer.full_name as acheteur,
  seller.full_name as vendeur,
  notaire.full_name as notaire_nom,
  (SELECT COUNT(*) FROM purchase_case_timeline WHERE case_id = pc.id) as timeline_events
FROM purchase_cases pc
LEFT JOIN profiles buyer ON buyer.id = pc.buyer_id
LEFT JOIN profiles seller ON seller.id = pc.seller_id
LEFT JOIN profiles notaire ON notaire.id = pc.notaire_id
ORDER BY pc.created_at DESC
LIMIT 10;

-- ✅ SI TOUT EST OK:
-- - Les politiques sont créées
-- - La table a les bonnes colonnes
-- - Les événements sont visibles
-- - Les participants peuvent lire/écrire dans le timeline
