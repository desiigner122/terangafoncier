-- Vérifier l'état actuel de la base de données
-- Exécutez ces queries une par une

-- 1. Le profil Heritage Fall existe-t-il ?
SELECT id, email, full_name, role, created_at
FROM profiles
WHERE id = '06125976-5ea1-403a-b09e-aebbe1311111';
-- Doit retourner 1 ligne

-- 2. La FK existe-t-elle ?
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'properties'
  AND constraint_name = 'properties_owner_id_fkey';
-- Doit retourner: properties_owner_id_fkey | FOREIGN KEY

-- 3. La propriété existe-t-elle avec owner_id ?
SELECT 
    id,
    title,
    owner_id,
    status,
    verification_status
FROM properties
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
-- Doit retourner 1 ligne avec owner_id = 06125976-5ea1-403a-b09e-aebbe1311111

-- 4. Combien de properties actives et vérifiées ?
SELECT COUNT(*) as total_properties
FROM properties
WHERE status = 'active'
  AND verification_status = 'verified';
-- Doit retourner au moins 1
