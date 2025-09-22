-- Check for missing identities which cause 'Database error querying schema'
WITH failing AS (
  SELECT unnest(ARRAY[
    'test.admin@terangafoncier.sn',
    'family.diallo@teranga-foncier.sn',
    'ahmadou.ba@teranga-foncier.sn',
    'heritage.fall@teranga-foncier.sn',
    'domaine.seck@teranga-foncier.sn',
    'urban.developers@teranga-foncier.sn',
    'sahel.construction@teranga-foncier.sn',
    'financement.boa@teranga-foncier.sn',
    'credit.agricole@teranga-foncier.sn',
    'etude.diouf@teranga-foncier.sn',
    'chambre.notaires@teranga-foncier.sn',
    'foncier.expert@teranga-foncier.sn',
    'teranga.immobilier@teranga-foncier.sn'
  ]) AS email
)
SELECT 
  f.email,
  au.id AS auth_user_id,
  au.email_confirmed_at IS NOT NULL AS email_confirmed,
  au.banned_until,
  pg_typeof(au.raw_user_meta_data) AS meta_type,
  (SELECT COUNT(*) FROM auth.identities i WHERE i.user_id = au.id) AS identities_count,
  (SELECT COUNT(*) FROM public.users u WHERE u.id = au.id) AS users_count,
  (SELECT COUNT(*) FROM public.profiles p WHERE p.id = au.id) AS profiles_count,
  au.raw_user_meta_data->>'role' AS role_meta,
  pu.role AS users_role,
  pr.role AS profiles_role
FROM failing f
LEFT JOIN auth.users au ON au.email = f.email
LEFT JOIN public.users pu ON pu.id = au.id
LEFT JOIN public.profiles pr ON pr.id = au.id
ORDER BY f.email;