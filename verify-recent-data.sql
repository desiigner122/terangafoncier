-- ============================================
-- VÉRIFIER SI LES REQUESTS ET TRANSACTIONS ONT ÉTÉ CRÉÉES
-- ============================================

-- 1. Vérifier les requests créées récemment (dernières 10 minutes)
SELECT 
  '✅ REQUESTS RÉCENTES:' as info,
  id,
  user_id,
  type,
  status,
  offered_price,
  parcelle_id,
  created_at
FROM public.requests
WHERE created_at > NOW() - INTERVAL '10 minutes'
ORDER BY created_at DESC
LIMIT 5;

-- 2. Vérifier les transactions créées récemment (dernières 10 minutes)
SELECT 
  '✅ TRANSACTIONS RÉCENTES:' as info,
  id,
  user_id,
  request_id,
  amount,
  currency,
  status,
  description,
  created_at
FROM public.transactions
WHERE created_at > NOW() - INTERVAL '10 minutes'
ORDER BY created_at DESC
LIMIT 5;

-- 3. Compter le nombre total de requests
SELECT 
  '📊 STATISTIQUES:' as info,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 hour' THEN 1 END) as requests_derniere_heure,
  COUNT(CASE WHEN type = 'one_time' THEN 1 END) as requests_one_time
FROM public.requests;

-- 4. Compter le nombre total de transactions
SELECT 
  '📊 STATISTIQUES TRANSACTIONS:' as info,
  COUNT(*) as total_transactions,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '1 hour' THEN 1 END) as transactions_derniere_heure
FROM public.transactions;


-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Si le bouton a fonctionné, tu devrais voir:
-- - Au moins 1 request récente avec type='one_time'
-- - Au moins 1 transaction récente liée à cette request
-- 
-- Si tu ne vois rien, le bouton n'a pas réussi à insérer dans la base
