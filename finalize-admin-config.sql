-- FINALISER LA CONFIGURATION ADMIN
-- Script à exécuter après création via l'interface Supabase

-- 1. Mettre à jour les métadonnées utilisateur
UPDATE auth.users 
SET raw_user_meta_data = jsonb_build_object(
    'role', 'admin',
    'user_type', 'admin',
    'full_name', 'Administrateur Système'
)
WHERE email = 'admin@terangafoncier.sn';

-- 2. Mettre à jour le profil (seulement les colonnes qui existent)
UPDATE public.profiles 
SET role = 'admin'
WHERE email = 'admin@terangafoncier.sn';

-- 3. Vérification complète
SELECT 
    '=== COMPTE ADMIN CONFIGURÉ ===' as status;

SELECT 
    'AUTH.USERS' as table_name,
    email,
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'full_name' as full_name,
    email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users 
WHERE email = 'admin@terangafoncier.sn'

UNION ALL

SELECT 
    'PUBLIC.PROFILES' as table_name,
    email,
    role,
    full_name,
    true as placeholder
FROM public.profiles 
WHERE email = 'admin@terangafoncier.sn';

-- 4. Test final des permissions
SELECT 
    'RÉSUMÉ FINAL' as info,
    u.email,
    u.raw_user_meta_data->>'role' as metadata_role,
    p.role as profile_role,
    CASE 
        WHEN u.raw_user_meta_data->>'role' = 'admin' AND p.role = 'admin' 
        THEN '✅ ADMIN PRÊT' 
        ELSE '❌ CONFIGURATION INCOMPLÈTE' 
    END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@terangafoncier.sn';