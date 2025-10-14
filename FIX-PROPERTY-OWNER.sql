-- ===================================================================
-- FIX : Assigner le propriétaire et corriger le status du bien
-- ===================================================================

-- ÉTAPE 1: Trouver l'ID du vendeur
-- (Remplace par l'email ou le nom du vendeur qui a créé le bien)
SELECT 
    id,
    email,
    full_name,
    role
FROM profiles
WHERE role = 'vendeur'
ORDER BY created_at DESC;

-- ÉTAPE 2: Une fois que tu as l'ID du vendeur, décommente et exécute :
-- Remplace 'VENDOR_USER_ID' par l'UUID du vendeur

/*
UPDATE properties
SET 
    owner_id = 'VENDOR_USER_ID',  -- Remplace par l'ID du vendeur
    status = 'disponible'          -- Pour que le bien soit visible publiquement
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
*/

-- ÉTAPE 3: Vérifier que la mise à jour a fonctionné
SELECT 
    id,
    title,
    owner_id,
    status,
    verification_status,
    verified_at
FROM properties
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';

-- ÉTAPE 4: Vérifier que le vendeur peut maintenant voir son bien
-- (Cette query simule ce que voit le vendeur via la RLS policy)
/*
SELECT 
    id,
    title,
    status,
    verification_status
FROM properties
WHERE owner_id = 'VENDOR_USER_ID'  -- Remplace par l'ID du vendeur
ORDER BY created_at DESC;
*/
