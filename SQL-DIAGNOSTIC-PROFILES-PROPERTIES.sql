-- =====================================================
-- DIAGNOSTIC: Vérifier la cohérence profiles/properties
-- =====================================================
-- Date: 13 octobre 2025

-- 1. Vérifier que Heritage Fall existe dans profiles
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles
WHERE id = '06125976-5ea1-403a-b09e-aebbe1311111';

-- 2. Vérifier toutes les properties et leurs owner_id
SELECT 
    id,
    title,
    owner_id,
    status,
    verification_status,
    created_at
FROM properties
ORDER BY created_at DESC
LIMIT 20;

-- 3. Vérifier s'il y a des owner_id qui N'EXISTENT PAS dans profiles
SELECT 
    p.id as property_id,
    p.title,
    p.owner_id,
    'ORPHAN - NO PROFILE' as status
FROM properties p
LEFT JOIN profiles pr ON p.owner_id = pr.id
WHERE p.owner_id IS NOT NULL 
  AND pr.id IS NULL;

-- 4. Compter combien de properties ont un owner_id NULL
SELECT 
    COUNT(*) as properties_sans_proprietaire
FROM properties
WHERE owner_id IS NULL;

-- 5. Vérifier si la FK existe déjà
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'properties'
  AND kcu.column_name = 'owner_id';

-- 6. Vérifier la structure de la table profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. Vérifier la structure de la table properties
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'properties'
  AND table_schema = 'public'
  AND column_name IN ('id', 'owner_id', 'title', 'status', 'verification_status')
ORDER BY ordinal_position;
