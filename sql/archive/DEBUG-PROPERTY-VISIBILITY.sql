-- ===================================================================
-- DIAGNOSTIC : Pourquoi le vendeur ne voit pas son bien approuvé ?
-- ===================================================================

-- 1️⃣ Vérifier les propriétés dans la base
SELECT 
    id,
    title,
    owner_id,
    status,
    verification_status,
    created_at
FROM properties
ORDER BY created_at DESC
LIMIT 5;

-- 2️⃣ Vérifier le profil du vendeur (remplace avec son ID)
-- Trouve l'ID du vendeur en regardant le owner_id ci-dessus
SELECT 
    id,
    email,
    full_name,
    role
FROM profiles
WHERE role = 'vendeur'
ORDER BY created_at DESC
LIMIT 5;

-- 3️⃣ Vérifier les policies actuelles sur properties
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual as using_clause,
    with_check
FROM pg_policies 
WHERE tablename = 'properties'
ORDER BY policyname;

-- 4️⃣ Tester si le vendeur PEUT voir ses propres biens (simule auth.uid())
-- Remplace 'VENDOR_USER_ID' par l'ID du vendeur
-- SELECT * FROM properties WHERE owner_id = 'VENDOR_USER_ID';

-- 5️⃣ Vérifier le status exact du bien approuvé
SELECT 
    id,
    title,
    status,
    verification_status,
    owner_id,
    verified_by,
    verified_at,
    CASE 
        WHEN status = 'disponible' THEN '✅ Status OK'
        WHEN status = 'available' THEN '✅ Status OK (EN)'
        ELSE '❌ Status: ' || COALESCE(status, 'NULL')
    END as status_check,
    CASE 
        WHEN verification_status = 'approved' THEN '✅ Verification OK'
        WHEN verification_status = 'verified' THEN '✅ Verification OK (alt)'
        WHEN verification_status = 'validé' THEN '✅ Verification OK (FR)'
        ELSE '❌ Verification: ' || COALESCE(verification_status, 'NULL')
    END as verification_check
FROM properties
WHERE verification_status IN ('approved', 'verified', 'validé', 'pending')
   OR status != 'brouillon'
ORDER BY created_at DESC;
