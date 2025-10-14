-- ============================================
-- FIX URGENT: CRÉER LE PROFIL MANQUANT
-- ============================================
-- Exécutez ce script IMMÉDIATEMENT dans Supabase SQL Editor
-- ============================================

-- 1️⃣ VÉRIFIER SI LE PROFIL EXISTE
SELECT 
    'AVANT FIX' as status,
    COUNT(*) as profile_count,
    CASE 
        WHEN COUNT(*) = 0 THEN '❌ PROFIL MANQUANT - DOIT ÊTRE CRÉÉ'
        ELSE '✅ PROFIL EXISTE'
    END as result
FROM public.profiles
WHERE id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497';

-- 2️⃣ CRÉER LE PROFIL MANQUANT
INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
)
VALUES (
    '4089e51f-85e4-4348-ae0c-f00e4f8ff497',
    'admin@terangafoncier.com',
    'Administrateur',
    'admin',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    updated_at = NOW();

-- 3️⃣ VÉRIFIER LA CRÉATION
SELECT 
    'APRÈS FIX' as status,
    id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
WHERE id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497';

-- 4️⃣ VÉRIFIER TOUS LES PROFILS
SELECT 
    '📋 TOUS LES PROFILS' as info,
    COUNT(*) as total
FROM public.profiles;

-- 5️⃣ LISTER TOUS LES PROFILS
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
ORDER BY created_at DESC;
