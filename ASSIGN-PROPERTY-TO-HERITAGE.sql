-- Assigner le bien à Heritage Fall (vendeur) SANS changer le status
UPDATE properties
SET 
    owner_id = '06125976-5ea1-403a-b09e-aebbe1311111'  -- Heritage Fall
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';

-- Vérifier que ça a marché
SELECT 
    id,
    title,
    owner_id,
    status,
    verification_status,
    verified_at
FROM properties
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
