-- ======================================================================
-- DIAGNOSTIC APPROFONDI - Analyser toutes les différences de métadonnées
-- ======================================================================

-- Comparer TOUTES les clés de métadonnées entre comptes qui marchent vs échouent
SELECT 
  u.email,
  CASE WHEN u.email IN (
    'geowest.africa@teranga-foncier.sn',
    'cabinet.ndiaye@teranga-foncier.sn',
    'atlantique.capital@teranga-foncier.sn',
    'fonds.souverain@teranga-foncier.sn',
    'mairie.thies@teranga-foncier.sn',
    'mairie.dakar@teranga-foncier.sn'
  ) THEN 'WORKING' ELSE 'FAILING' END AS status,
  u.raw_user_meta_data,
  -- Extraire chaque clé possible
  (u.raw_user_meta_data->>'role') AS role,
  (u.raw_user_meta_data->>'full_name') AS full_name,
  (u.raw_user_meta_data->>'email_verified') AS email_verified,
  (u.raw_user_meta_data->>'phone') AS phone,
  (u.raw_user_meta_data->>'organization') AS organization,
  (u.raw_user_meta_data->>'specialites') AS specialites,
  (u.raw_user_meta_data->>'numero_ordre') AS numero_ordre,
  (u.raw_user_meta_data->>'experience_annees') AS experience_annees,
  (u.raw_user_meta_data->>'zone_intervention') AS zone_intervention,
  (u.raw_user_meta_data->>'risk_profile') AS risk_profile,
  (u.raw_user_meta_data->>'secteurs_preferes') AS secteurs_preferes,
  (u.raw_user_meta_data->>'type_investisseur') AS type_investisseur,
  (u.raw_user_meta_data->>'capital_disponible') AS capital_disponible,
  (u.raw_user_meta_data->>'maire') AS maire,
  (u.raw_user_meta_data->>'region') AS region,
  (u.raw_user_meta_data->>'commune') AS commune,
  (u.raw_user_meta_data->>'population') AS population
FROM auth.users u
WHERE u.email IN (
  'geowest.africa@teranga-foncier.sn',
  'cabinet.ndiaye@teranga-foncier.sn',
  'atlantique.capital@teranga-foncier.sn',
  'fonds.souverain@teranga-foncier.sn',
  'mairie.thies@teranga-foncier.sn',
  'mairie.dakar@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn',
  'family.diallo@teranga-foncier.sn',
  'heritage.fall@teranga-foncier.sn',
  'urban.developers@teranga-foncier.sn',
  'sahel.construction@teranga-foncier.sn'
)
ORDER BY status, u.email;