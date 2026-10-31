-- 🔍 CHERCHER VOS DEMANDES PARTOUT

-- 1. Compter dans chaque table pertinente
SELECT 
  '📊 NOMBRE D''ENREGISTREMENTS PAR TABLE' as info,
  'requests' as table_name,
  COUNT(*) as total
FROM requests
WHERE created_at >= '2025-10-14'::date
UNION ALL
SELECT 
  '📊 NOMBRE D''ENREGISTREMENTS PAR TABLE',
  'transactions',
  COUNT(*)
FROM transactions
WHERE created_at >= '2025-10-14'::date
UNION ALL
SELECT 
  '📊 NOMBRE D''ENREGISTREMENTS PAR TABLE',
  'payments',
  COUNT(*)
FROM payments
WHERE created_at >= '2025-10-14'::date
UNION ALL
SELECT 
  '📊 NOMBRE D''ENREGISTREMENTS PAR TABLE',
  'offers',
  COUNT(*)
FROM offers
WHERE created_at >= '2025-10-14'::date;

-- 2. Chercher par user_id (family.diallo) dans requests
SELECT 
  '👤 REQUESTS DE FAMILY.DIALLO' as info,
  *
FROM requests
WHERE user_id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'
ORDER BY created_at DESC;

-- 3. Chercher par user_id dans transactions
SELECT 
  '👤 TRANSACTIONS DE FAMILY.DIALLO' as info,
  *
FROM transactions
WHERE user_id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'
ORDER BY created_at DESC;

-- 4. Toutes les requests récentes (depuis le 14 oct)
SELECT 
  '📅 TOUTES REQUESTS RÉCENTES' as info,
  r.*,
  prof.email as acheteur_email
FROM requests r
LEFT JOIN profiles prof ON prof.id = r.user_id
WHERE r.created_at >= '2025-10-14'::date
ORDER BY r.created_at DESC;
