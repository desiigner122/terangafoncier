-- Supabase Role Diagnostic - Audit complet des rôles et casse
-- Exécuter dans le SQL Editor Supabase (ou psql) côté projet

-- 1) Aperçu rapide des valeurs distinctes (sensibles à la casse)
SELECT 'profiles.role' AS source, role AS value, COUNT(*) AS cnt
FROM public.profiles
GROUP BY role
ORDER BY cnt DESC;

SELECT 'profiles.user_type' AS source, user_type AS value, COUNT(*) AS cnt
FROM public.profiles
GROUP BY user_type
ORDER BY cnt DESC;

-- 2) Valeurs normalisées en minuscules pour détecter incohérences de casse
SELECT 'profiles.role (normalized)' AS source, lower(coalesce(role,'')) AS value, COUNT(*) AS cnt
FROM public.profiles
GROUP BY lower(coalesce(role,''))
ORDER BY cnt DESC;

SELECT 'profiles.user_type (normalized)' AS source, lower(coalesce(user_type,'')) AS value, COUNT(*) AS cnt
FROM public.profiles
GROUP BY lower(coalesce(user_type,''))
ORDER BY cnt DESC;

-- 3) Récupérer les métadonnées auth (si extension disponible côté SQL: auth.users non accessible en RLS restreint).
-- Attention: sur Supabase, l'accès direct à auth.users nécessite des privilèges (rôle service ou policy spécifique).
-- Ces SELECT peuvent échouer en mode client. À exécuter avec le service_role dans un environnement sécurisé si besoin.
-- Exemple (à adapter) :
-- SELECT 'auth.users.metadata.role' AS source,
--        (raw_user_meta_data->>'role') AS value,
--        COUNT(*)
-- FROM auth.users
-- GROUP BY (raw_user_meta_data->>'role')
-- ORDER BY 3 DESC;

-- 4) Cartographie profiles ↔ auth.users (si accès autorisé) pour comparer roles
-- SELECT p.id, p.email, p.role AS profile_role, p.user_type,
--        (u.raw_user_meta_data->>'role') AS auth_role,
--        lower(coalesce(p.role,'')) AS profile_role_norm,
--        lower(coalesce(u.raw_user_meta_data->>'role','')) AS auth_role_norm,
--        CASE WHEN lower(coalesce(p.role,'')) = lower(coalesce(u.raw_user_meta_data->>'role','')) THEN 'OK' ELSE 'MISMATCH' END AS status
-- FROM public.profiles p
-- LEFT JOIN auth.users u ON u.id = p.id
-- ORDER BY status DESC, p.email;

-- 5) Détection des valeurs suspectes/incohérentes (ex: variations de casse)
WITH vals AS (
  SELECT 'role' AS field, role AS raw, lower(coalesce(role,'')) AS norm FROM public.profiles
  UNION ALL
  SELECT 'user_type', user_type, lower(coalesce(user_type,'')) FROM public.profiles
)
SELECT field, norm, array_agg(DISTINCT raw) AS variants, COUNT(*) AS rows
FROM vals
GROUP BY field, norm
HAVING COUNT(DISTINCT raw) > 1  -- Plusieurs variantes pour une même valeur normalisée
ORDER BY field, norm;

-- 6) Aperçu ciblé des vendeurs/admin selon casse
SELECT id, email, role, user_type
FROM public.profiles
WHERE lower(coalesce(role,'')) IN ('admin','vendeur','vendeur particulier','vendeur pro')
   OR lower(coalesce(user_type,'')) IN ('admin','vendeur','vendeur particulier','vendeur pro')
ORDER BY email;

-- 7) Comptage par couple (role,user_type) pour voir la cohérence interne du profil
SELECT lower(coalesce(role,'')) AS role_norm,
       lower(coalesce(user_type,'')) AS user_type_norm,
       COUNT(*)
FROM public.profiles
GROUP BY 1,2
ORDER BY 3 DESC;

-- 8) Exemple de normalisation (à EXÉCUTER UNIQUEMENT SI VALIDÉE) :
-- UPDATE public.profiles
-- SET role = initcap(lower(role)) -- ex: 'admin' -> 'Admin'
-- WHERE role IS NOT NULL;
-- 
-- UPDATE public.profiles
-- SET user_type = CASE
--   WHEN lower(user_type) IN ('vendeur particulier','vendeur','particulier vendeur') THEN 'Vendeur Particulier'
--   WHEN lower(user_type) IN ('vendeur pro','vendeur professionnel') THEN 'Vendeur Pro'
--   WHEN lower(user_type) IN ('acheteur','particulier') THEN 'Particulier'
--   ELSE user_type
-- END
-- WHERE user_type IS NOT NULL;

-- 9) Si accès service_role: normaliser auth.users.metadata (exemple JSON)
-- UPDATE auth.users
-- SET raw_user_meta_data = jsonb_set(coalesce(raw_user_meta_data,'{}'::jsonb), '{role}', to_jsonb('Admin'))
-- WHERE (raw_user_meta_data->>'role') ILIKE 'admin';

-- NOTE: Préférez un seul champ source de vérité (profiles.role ou profiles.user_type)
-- et adaptez vos guards côté app pour comparer en minuscules tant que la normalisation n'est pas terminée.
