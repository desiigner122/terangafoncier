-- ======================================================================
-- DIAGNOSTIC COMPLET - Vérifier toutes les données public.users
-- ======================================================================

-- Vérifier si TOUS les comptes existent dans public.users
SELECT 
  'EXISTENCE_CHECK' AS section,
  email,
  EXISTS (SELECT 1 FROM public.users pu WHERE pu.email = emails.email) AS exists_in_public_users
FROM (VALUES 
  ('geowest.africa@teranga-foncier.sn'),
  ('cabinet.ndiaye@teranga-foncier.sn'),
  ('atlantique.capital@teranga-foncier.sn'),
  ('fonds.souverain@teranga-foncier.sn'),
  ('mairie.thies@teranga-foncier.sn'),
  ('mairie.dakar@teranga-foncier.sn'),
  ('ahmadou.ba@teranga-foncier.sn'),
  ('domaine.seck@teranga-foncier.sn'),
  ('family.diallo@teranga-foncier.sn'),
  ('heritage.fall@teranga-foncier.sn'),
  ('urban.developers@teranga-foncier.sn'),
  ('sahel.construction@teranga-foncier.sn'),
  ('financement.boa@teranga-foncier.sn'),
  ('credit.agricole@teranga-foncier.sn'),
  ('etude.diouf@teranga-foncier.sn'),
  ('chambre.notaires@teranga-foncier.sn'),
  ('foncier.expert@teranga-foncier.sn'),
  ('teranga.immobilier@teranga-foncier.sn'),
  ('test.admin@terangafoncier.sn')
) AS emails(email)
ORDER BY exists_in_public_users DESC, email;