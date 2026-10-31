-- ============================================
-- FIX: Créer le profil manquant pour l'utilisateur
-- ============================================
-- Date: 11 octobre 2025
-- Problème: PGRST116 - "The result contains 0 rows"
-- User ID: 4089e51f-85e4-4348-ae0c-f00e4f8ff497
-- ============================================

-- 1. Vérifier si l'utilisateur existe dans auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497';

-- 2. Vérifier si le profil existe déjà
SELECT * FROM public.profiles 
WHERE id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497';

-- 3. Créer le profil s'il n'existe pas
INSERT INTO public.profiles (id, role, email, full_name, created_at, updated_at)
SELECT 
    id,
    'admin' as role, -- Changez selon le rôle souhaité: 'admin', 'vendeur', 'acheteur', 'notaire', 'banque', 'agent_foncier'
    email,
    COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
    created_at,
    NOW() as updated_at
FROM auth.users
WHERE id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497'
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

-- 4. Vérifier que le profil a été créé
SELECT id, role, email, full_name, created_at 
FROM public.profiles 
WHERE id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497';

-- 5. ALTERNATIVE: Créer tous les profils manquants pour TOUS les utilisateurs
INSERT INTO public.profiles (id, role, email, full_name, created_at, updated_at)
SELECT 
    au.id,
    'acheteur' as role, -- Rôle par défaut pour nouveaux utilisateurs
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
    au.created_at,
    NOW() as updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL -- Seulement les utilisateurs sans profil
ON CONFLICT (id) DO NOTHING;

-- 6. Compter les profils créés
SELECT 
    COUNT(*) as total_users,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles,
    COUNT(*) - (SELECT COUNT(*) FROM public.profiles) as missing_profiles
FROM auth.users;

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Copier tout ce script
-- 2. Ouvrir Supabase Dashboard → SQL Editor
-- 3. Coller et exécuter
-- 4. Rafraîchir le navigateur (Ctrl+Shift+R)
-- ============================================

-- ✅ FIN DU SCRIPT
