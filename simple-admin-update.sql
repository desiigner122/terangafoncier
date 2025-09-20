-- MISE À JOUR MANUELLE SIMPLE POUR RÔLE ADMIN
-- Remplacez 'votre-email@domain.com' par l'email du compte que vous avez créé

-- 1. Mise à jour des métadonnées utilisateur (remplacez l'email)
UPDATE auth.users 
SET 
    raw_user_meta_data = '{"role":"admin","user_type":"admin","full_name":"Administrateur Système"}',
    is_super_admin = true,
    updated_at = NOW()
WHERE email = 'admin@terangafoncier.sn'; -- ⚠️ REMPLACEZ PAR VOTRE EMAIL

-- 2. Créer le profil dans public.profiles (remplacez l'email)  
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    phone,
    created_at,
    updated_at,
    is_active
) 
SELECT 
    id,
    'admin@terangafoncier.sn', -- ⚠️ REMPLACEZ PAR VOTRE EMAIL
    'Administrateur Système',
    'admin',
    '+221 77 000 0001',
    NOW(),
    NOW(),
    true
FROM auth.users 
WHERE email = 'admin@terangafoncier.sn' -- ⚠️ REMPLACEZ PAR VOTRE EMAIL
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Administrateur Système',
    phone = '+221 77 000 0001',
    updated_at = NOW(),
    is_active = true;

-- 3. Vérification du résultat
SELECT 
    '=== ADMIN CRÉÉ ===' as statut,
    u.email,
    u.raw_user_meta_data->>'role' as role_auth,
    u.is_super_admin,
    p.role as role_profile,
    p.full_name,
    p.is_active
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@terangafoncier.sn'; -- ⚠️ REMPLACEZ PAR VOTRE EMAIL