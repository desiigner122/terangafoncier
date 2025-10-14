-- ===================================================================
-- DIAGNOSTIC : Pourquoi le bien approuvé n'apparaît pas ?
-- ===================================================================

-- 1️⃣ Vérifier le bien qui vient d'être approuvé
SELECT 
    id,
    title,
    status,
    owner_id,
    validation_status,
    validated_at,
    validated_by,
    created_at
FROM properties
ORDER BY updated_at DESC
LIMIT 5;

-- 2️⃣ Vérifier quel user_id est le vendeur
SELECT 
    id,
    email,
    full_name,
    role
FROM profiles
WHERE role IN ('vendeur', 'admin')
ORDER BY created_at DESC;

-- 3️⃣ Vérifier les RLS policies sur properties
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'properties'
ORDER BY policyname;

-- 4️⃣ Tester si le vendeur peut voir ses biens (simule la requête du dashboard)
-- REMPLACE 'VENDEUR_USER_ID' par l'ID du vendeur
-- SELECT *
-- FROM properties
-- WHERE owner_id = 'VENDEUR_USER_ID'
-- ORDER BY created_at DESC;

-- 5️⃣ Vérifier les statuts possibles dans la table
SELECT DISTINCT status, validation_status
FROM properties;
