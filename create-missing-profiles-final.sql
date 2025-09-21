-- ======================================================================
-- SOLUTION RAPIDE: CRÉER TOUS LES PROFILS MANQUANTS
-- Créer automatiquement des profils pour tous les utilisateurs auth 
-- qui n'en ont pas dans public.users et public.profiles
-- ======================================================================

-- 1) Insérer dans public.users tous les comptes auth qui n'y sont pas
INSERT INTO public.users (
  id, 
  email, 
  name, 
  role, 
  phone, 
  created_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1)) as name,
  CASE 
    WHEN au.email LIKE '%admin%' THEN 'admin'
    WHEN au.email LIKE '%geometre%' THEN 'geometre'
    WHEN au.email LIKE '%investisseur%' OR au.email LIKE '%capital%' OR au.email LIKE '%fonds%' THEN 'investisseur'
    WHEN au.email LIKE '%mairie%' THEN 'mairie'
    WHEN au.email LIKE '%banque%' OR au.email LIKE '%boa%' OR au.email LIKE '%credit%' THEN 'banque'
    WHEN au.email LIKE '%notaire%' OR au.email LIKE '%etude%' OR au.email LIKE '%chambre%' THEN 'notaire'
    WHEN au.email LIKE '%agent%' OR au.email LIKE '%foncier%' OR au.email LIKE '%immobilier%' THEN 'agent_foncier'
    WHEN au.email LIKE '%promoteur%' OR au.email LIKE '%urban%' OR au.email LIKE '%construction%' THEN 'promoteur'
    WHEN au.email LIKE '%vendeur%' OR au.email LIKE '%domaine%' OR au.email LIKE '%heritage%' THEN 'vendeur'
    ELSE 'particulier'
  END as role,
  COALESCE(au.raw_user_meta_data->>'phone', '+221700000000') as phone,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL
  AND (au.email LIKE '%teranga%' OR au.email LIKE '%terangafoncier%');

-- 2) Insérer dans public.profiles tous les comptes auth qui n'y sont pas
INSERT INTO public.profiles (
  id, 
  email, 
  name, 
  role, 
  phone, 
  created_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', SPLIT_PART(au.email, '@', 1)) as name,
  CASE 
    WHEN au.email LIKE '%admin%' THEN 'admin'
    WHEN au.email LIKE '%geometre%' THEN 'geometre'
    WHEN au.email LIKE '%investisseur%' OR au.email LIKE '%capital%' OR au.email LIKE '%fonds%' THEN 'investisseur'
    WHEN au.email LIKE '%mairie%' THEN 'mairie'
    WHEN au.email LIKE '%banque%' OR au.email LIKE '%boa%' OR au.email LIKE '%credit%' THEN 'banque'
    WHEN au.email LIKE '%notaire%' OR au.email LIKE '%etude%' OR au.email LIKE '%chambre%' THEN 'notaire'
    WHEN au.email LIKE '%agent%' OR au.email LIKE '%foncier%' OR au.email LIKE '%immobilier%' THEN 'agent_foncier'
    WHEN au.email LIKE '%promoteur%' OR au.email LIKE '%urban%' OR au.email LIKE '%construction%' THEN 'promoteur'
    WHEN au.email LIKE '%vendeur%' OR au.email LIKE '%domaine%' OR au.email LIKE '%heritage%' THEN 'vendeur'
    ELSE 'particulier'
  END as role,
  COALESCE(au.raw_user_meta_data->>'phone', '+221700000000') as phone,
  au.created_at
FROM auth.users au
LEFT JOIN public.profiles pp ON pp.id = au.id
WHERE pp.id IS NULL
  AND (au.email LIKE '%teranga%' OR au.email LIKE '%terangafoncier%');

-- 3) Vérification finale - compter les profils créés
SELECT 'USERS CREATED' as section, COUNT(*) as total 
FROM public.users 
WHERE email LIKE '%teranga%' OR email LIKE '%terangafoncier%';

SELECT 'PROFILES CREATED' as section, COUNT(*) as total 
FROM public.profiles 
WHERE email LIKE '%teranga%' OR email LIKE '%terangafoncier%';

-- 4) Vérifier que tous les comptes de test ont maintenant des données
SELECT 
  'VERIFICATION' AS section,
  email,
  CASE WHEN EXISTS(SELECT 1 FROM public.users WHERE email = vals.email) THEN 'YES' ELSE 'NO' END AS in_users,
  CASE WHEN EXISTS(SELECT 1 FROM public.profiles WHERE email = vals.email) THEN 'YES' ELSE 'NO' END AS in_profiles
FROM (VALUES 
  ('test.admin@terangafoncier.sn'),
  ('family.diallo@teranga-foncier.sn'),
  ('ahmadou.ba@teranga-foncier.sn'),
  ('heritage.fall@teranga-foncier.sn'),
  ('domaine.seck@teranga-foncier.sn'),
  ('urban.developers@teranga-foncier.sn'),
  ('sahel.construction@teranga-foncier.sn'),
  ('financement.boa@teranga-foncier.sn'),
  ('credit.agricole@teranga-foncier.sn'),
  ('etude.diouf@teranga-foncier.sn'),
  ('chambre.notaires@teranga-foncier.sn'),
  ('foncier.expert@teranga-foncier.sn'),
  ('teranga.immobilier@teranga-foncier.sn')
) AS vals(email);