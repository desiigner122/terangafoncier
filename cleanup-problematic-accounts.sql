-- Script pour nettoyer et corriger les comptes problématiques
-- À exécuter avant create-accounts-simple.sql

-- 1. Identifier les comptes avec des problèmes
SELECT 
  'Comptes avec problèmes détectés:' as status;

SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as role_in_meta,
  u.created_at,
  CASE 
    WHEN u.raw_user_meta_data->>'role' IS NULL THEN 'Rôle manquant'
    WHEN u.raw_user_meta_data->>'role' = '' THEN 'Rôle vide'
    ELSE 'OK'
  END as problem
FROM auth.users u 
WHERE u.email LIKE '%@terangafoncier.com'
ORDER BY u.email;

-- 2. Corriger le compte test.urgent@terangafoncier.com
UPDATE auth.users 
SET raw_user_meta_data = '{"role": "admin", "name": "Admin Test"}'::jsonb
WHERE email = 'test.urgent@terangafoncier.com'
  AND (raw_user_meta_data->>'role' IS NULL OR raw_user_meta_data->>'role' = '');

-- 3. Supprimer les profils orphelins (sans rôle valide)
DELETE FROM profiles 
WHERE id IN (
  SELECT p.id 
  FROM profiles p
  JOIN auth.users u ON p.id = u.id
  WHERE u.email LIKE '%@terangafoncier.com'
    AND (u.raw_user_meta_data->>'role' IS NULL OR u.raw_user_meta_data->>'role' = '')
);

-- 4. Vérifier le résultat
SELECT 
  'Après nettoyage:' as status;

SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as role,
  u.raw_user_meta_data->>'name' as name,
  CASE WHEN p.id IS NOT NULL THEN 'Profil existe' ELSE 'Profil manquant' END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email LIKE '%@terangafoncier.com'
ORDER BY u.email;

-- 5. Compter les comptes par type
SELECT 
  'Résumé par rôle:' as status;

SELECT 
  COALESCE(u.raw_user_meta_data->>'role', 'Sans rôle') as role,
  COUNT(*) as count
FROM auth.users u 
WHERE u.email LIKE '%@terangafoncier.com'
GROUP BY u.raw_user_meta_data->>'role'
ORDER BY count DESC;
