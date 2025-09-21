-- ======================================================================
-- CORRECTION SIMPLE: CONFIRMER TOUS LES EMAILS
-- À exécuter dans Supabase SQL Editor avec les privilèges service_role
-- ======================================================================

-- 1) Confirmer tous les utilisateurs non confirmés
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email_confirmed_at IS NULL;

-- 2) Vérification: compter les confirmés vs non confirmés
SELECT 
  CASE WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMED' ELSE 'NOT_CONFIRMED' END AS status,
  COUNT(*) AS total
FROM auth.users
GROUP BY CASE WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMED' ELSE 'NOT_CONFIRMED' END
ORDER BY status;

-- 3) Afficher le détail des emails confirmés récemment
SELECT 
  email,
  email_confirmed_at,
  CASE WHEN email_confirmed_at > now() - interval '5 minutes' THEN 'JUST_CONFIRMED' ELSE 'ALREADY_CONFIRMED' END AS confirmation_status
FROM auth.users
ORDER BY email_confirmed_at DESC
LIMIT 20;