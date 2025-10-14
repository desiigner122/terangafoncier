-- OPTION 1 : Assigner le bien à l'admin (temporaire pour tester)
UPDATE properties
SET 
    owner_id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497',  -- Admin
    status = 'disponible'
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';

-- Vérifier
SELECT id, title, owner_id, status, verification_status
FROM properties
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
