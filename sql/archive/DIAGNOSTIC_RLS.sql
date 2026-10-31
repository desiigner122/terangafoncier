-- Diagnostic des permissions RLS
-- Exécutez ces requêtes en tant qu'admin Supabase

-- 1. Vérifier les RLS sur la table transactions
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('transactions', 'purchase_cases', 'profiles')
ORDER BY tablename;

-- 2. Vérifier les politiques RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('transactions', 'purchase_cases', 'profiles')
ORDER BY tablename, policyname;

-- 3. Vérifier que l'utilisateur heritage.fall@teranga-foncier.sn peut lire les transactions
-- A exécuter en tant que cet utilisateur
SELECT id, status, created_at FROM transactions LIMIT 1;

-- 4. Vérifier la structure de la table transactions
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'transactions'
ORDER BY ordinal_position;

-- 5. Vérifier si la requête de JOIN fonctionne
SELECT 
  t.id,
  t.status,
  b.id as buyer_id,
  s.id as seller_id,
  p.id as parcel_id
FROM transactions t
LEFT JOIN profiles b ON t.buyer_id = b.id
LEFT JOIN profiles s ON t.seller_id = s.id
LEFT JOIN parcels p ON t.parcel_id = p.id
LIMIT 1;

-- 6. Vérifier les colonnes qui existent réellement dans profiles
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
