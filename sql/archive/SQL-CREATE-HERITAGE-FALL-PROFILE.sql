-- =====================================================
-- FIX: Créer le profil manquant pour Heritage Fall
-- =====================================================
-- Date: 13 octobre 2025
-- Problème: User existe dans auth.users mais pas dans profiles
-- Solution: Insérer le profil manquant

-- 1. Vérifier si l'user existe dans auth.users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users
WHERE id = '06125976-5ea1-403a-b09e-aebbe1311111';

-- 2. Vérifier si le profil existe déjà
SELECT * FROM profiles 
WHERE id = '06125976-5ea1-403a-b09e-aebbe1311111';

-- 3. Créer le profil s'il n'existe pas
INSERT INTO profiles (
    id,
    email,
    full_name,
    role,
    phone,
    created_at,
    updated_at
)
VALUES (
    '06125976-5ea1-403a-b09e-aebbe1311111',
    'heritage.fall@teranga-foncier.sn',
    'Heritage Fall',
    'vendeur-particulier',
    '+221 77 123 45 67',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 4. Vérifier la création
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles
WHERE id = '06125976-5ea1-403a-b09e-aebbe1311111';

-- ✅ Résultat attendu:
-- id: 06125976-5ea1-403a-b09e-aebbe1311111
-- email: heritage.fall@teranga-foncier.sn
-- full_name: Heritage Fall
-- role: vendeur-particulier
-- created_at: (timestamp)
