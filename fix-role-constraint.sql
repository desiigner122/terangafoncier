-- Script pour identifier et corriger les contraintes de rôle
-- À exécuter en premier pour comprendre les règles

-- 1. Vérifier la contrainte profiles_role_check
SELECT 
  'Contrainte profiles_role_check:' as info;

SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'profiles_role_check';

-- 2. Voir tous les rôles actuellement utilisés
SELECT 
  'Rôles existants dans profiles:' as info;

SELECT 
  role,
  COUNT(*) as count
FROM profiles 
GROUP BY role
ORDER BY count DESC;

-- 3. Voir les comptes problématiques
SELECT 
  'Comptes avec problèmes de rôle:' as info;

SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as meta_role,
  p.role as profile_role,
  CASE 
    WHEN u.raw_user_meta_data->>'role' IS NULL THEN 'Métadonnées NULL'
    WHEN u.raw_user_meta_data->>'role' = 'user' THEN 'Rôle user non autorisé'
    WHEN u.raw_user_meta_data->>'role' NOT IN ('admin', 'particular', 'vendeur', 'investisseur', 'municipalite', 'notaire', 'geometre', 'banque', 'promoteur') THEN 'Rôle non autorisé'
    ELSE 'OK'
  END as problem
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email LIKE '%@terangafoncier.com'
ORDER BY u.email;

-- 4. Corriger les comptes problématiques
-- Corriger test.dashboard@terangafoncier.com
UPDATE auth.users 
SET raw_user_meta_data = '{"role": "admin", "name": "Admin Dashboard Test"}'::jsonb
WHERE email = 'test.dashboard@terangafoncier.com';

-- Corriger test.urgent@terangafoncier.com s'il existe encore
UPDATE auth.users 
SET raw_user_meta_data = '{"role": "admin", "name": "Admin Urgent Test"}'::jsonb
WHERE email = 'test.urgent@terangafoncier.com'
  AND (raw_user_meta_data->>'role' IS NULL OR raw_user_meta_data->>'role' = '');

-- 5. Supprimer tous les profils avec des rôles non conformes
DELETE FROM profiles 
WHERE role IS NULL 
   OR role = 'user' 
   OR role NOT IN ('admin', 'particular', 'vendeur', 'investisseur', 'municipalite', 'notaire', 'geometre', 'banque', 'promoteur');

-- 6. Supprimer les comptes de test problématiques complètement
DELETE FROM profiles WHERE email LIKE 'test.%@terangafoncier.com';
DELETE FROM auth.users WHERE email LIKE 'test.%@terangafoncier.com';

-- 7. Vérifier le nettoyage
SELECT 
  'Après nettoyage:' as status;

SELECT 
  u.email,
  u.raw_user_meta_data->>'role' as role,
  u.raw_user_meta_data->>'name' as name,
  CASE WHEN p.id IS NOT NULL THEN 'Profil OK' ELSE 'Profil manquant' END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email LIKE '%@terangafoncier.com'
ORDER BY u.email;
