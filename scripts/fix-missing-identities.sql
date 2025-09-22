-- Create missing email identities for users that have 0 identities
-- Use in Supabase SQL Editor if you can't run the Admin API script.
-- Safe: inserts only when identity is missing.

WITH targets AS (
  SELECT * FROM (
    VALUES
      ('ahmadou.ba@teranga-foncier.sn'),
      ('chambre.notaires@teranga-foncier.sn'),
      ('credit.agricole@teranga-foncier.sn'),
      ('domaine.seck@teranga-foncier.sn'),
      ('etude.diouf@teranga-foncier.sn'),
      ('family.diallo@teranga-foncier.sn'),
      ('financement.boa@teranga-foncier.sn'),
      ('foncier.expert@teranga-foncier.sn'),
      ('heritage.fall@teranga-foncier.sn'),
      ('sahel.construction@teranga-foncier.sn'),
      ('teranga.immobilier@teranga-foncier.sn'),
      ('test.admin@terangafoncier.sn'),
      ('urban.developers@teranga-foncier.sn')
  ) AS t(email)
)
, missing AS (
  SELECT au.id AS user_id, au.email
  FROM targets t
  JOIN auth.users au ON lower(au.email) = lower(t.email)
  LEFT JOIN auth.identities ai ON ai.user_id = au.id
  GROUP BY au.id, au.email
  HAVING COUNT(ai.*) = 0
)
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  m.user_id,
  jsonb_build_object('sub', m.user_id::text, 'email', lower(m.email)),
  'email',
  lower(m.email) AS provider_id,
  NOW(),
  NOW()
FROM missing m;

-- Verify identities are now present
SELECT u.email, COUNT(i.*) AS identities_count
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id
WHERE u.email IN (
  'ahmadou.ba@teranga-foncier.sn','chambre.notaires@teranga-foncier.sn','credit.agricole@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn','etude.diouf@teranga-foncier.sn','family.diallo@teranga-foncier.sn',
  'financement.boa@teranga-foncier.sn','foncier.expert@teranga-foncier.sn','heritage.fall@teranga-foncier.sn',
  'sahel.construction@teranga-foncier.sn','teranga.immobilier@teranga-foncier.sn','test.admin@terangafoncier.sn',
  'urban.developers@teranga-foncier.sn'
)
GROUP BY u.email
ORDER BY u.email;