-- ======================================================================
-- DÉSACTIVER LA CONFIRMATION EMAIL ET CONFIRMER TOUS LES UTILISATEURS
-- Objectif: permettre la connexion immédiate sans validation email
-- ======================================================================

-- =====================
-- 1) DÉSACTIVER LA CONFIRMATION EMAIL POUR LES NOUVEAUX UTILISATEURS
-- =====================
-- Note: Ceci doit être fait via le Dashboard Supabase > Authentication > Settings
-- Mais on peut vérifier/forcer la config via SQL si nécessaire

-- Vérifier la config actuelle
SELECT 
  'AUTH CONFIG' AS section,
  'email_confirm_required' AS setting,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM auth.config 
      WHERE parameter = 'EMAIL_CONFIRM_REQUIRED' 
      AND value = 'false'
    ) THEN 'DISABLED'
    ELSE 'ENABLED (needs fix)'
  END AS status;

-- =====================
-- 2) MARQUER TOUS LES UTILISATEURS EXISTANTS COMME CONFIRMÉS
-- =====================
-- Mettre email_confirmed_at à now() pour tous les utilisateurs non confirmés
UPDATE auth.users 
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  updated_at = now()
WHERE email_confirmed_at IS NULL;

-- =====================
-- 3) VÉRIFICATIONS
-- =====================
-- a) Compter les utilisateurs confirmés vs non confirmés
SELECT 
  'EMAIL STATUS' AS section,
  CASE WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMED' ELSE 'NOT_CONFIRMED' END AS status,
  COUNT(*) AS total
FROM auth.users
GROUP BY CASE WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMED' ELSE 'NOT_CONFIRMED' END
ORDER BY status;

-- b) Vérifier nos comptes de test spécifiquement
SELECT 
  'TEST ACCOUNTS' AS section,
  email,
  CASE WHEN email_confirmed_at IS NOT NULL THEN 'CONFIRMED' ELSE 'NOT_CONFIRMED' END AS email_status,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email IN (
  'admin@terangafoncier.sn',
  'ahmadou.ba@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn',
  'financement.boa@teranga-foncier.sn',
  'etude.diouf@teranga-foncier.sn',
  'geowest.africa@teranga-foncier.sn',
  'cabinet.ndiaye@teranga-foncier.sn',
  'atlantique.capital@teranga-foncier.sn',
  'fonds.souverain@teranga-foncier.sn',
  'mairie.thies@teranga-foncier.sn',
  'mairie.dakar@teranga-foncier.sn'
)
ORDER BY email;

-- c) Compter le total d'utilisateurs
SELECT 'TOTAL USERS' AS section, COUNT(*) AS total FROM auth.users;

-- =====================
-- 4) INSTRUCTIONS POUR LE DASHBOARD SUPABASE
-- =====================
-- Pour désactiver complètement la confirmation email :
-- 1. Allez dans Dashboard Supabase > Authentication > Settings
-- 2. Dans "Email" section, désactivez "Enable email confirmations"
-- 3. Sauvegardez les changements
-- 
-- Alternative via SQL (si vous avez les permissions) :
-- INSERT INTO auth.config (parameter, value) 
-- VALUES ('EMAIL_CONFIRM_REQUIRED', 'false')
-- ON CONFLICT (parameter) DO UPDATE SET value = 'false';

-- ======================================================================
-- FIN DU SCRIPT CONFIRMATION EMAIL
-- ======================================================================