-- Script SQL pour ajouter les colonnes manquantes dans la table users
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Ajouter la colonne user_type
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type TEXT;

-- 2. Ajouter la colonne verification_status
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'verified';

-- 3. Mettre à jour le profil admin avec les nouvelles colonnes
UPDATE users 
SET 
    user_type = 'Admin',
    verification_status = 'verified'
WHERE email = 'palaye122@gmail.com';

-- 4. Vérifier la mise à jour
SELECT id, email, role, user_type, verification_status, full_name 
FROM users 
WHERE email = 'palaye122@gmail.com';
