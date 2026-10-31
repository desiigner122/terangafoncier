-- DIAGNOSTIC COMPLET: Pourquoi la parcelle n'apparaît pas sur /parcelles-vendeurs
-- Exécutez ces queries une par une pour identifier le problème

-- ========================================
-- 1. VÉRIFIER LA PARCELLE EXISTE
-- ========================================
SELECT 
    id,
    title,
    owner_id,
    status,
    verification_status,
    is_published,
    created_at
FROM properties
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
-- Doit retourner: status='active', verification_status='verified', is_published=true

-- ========================================
-- 2. VÉRIFIER LE PROFIL HERITAGE FALL
-- ========================================
SELECT 
    id,
    email,
    full_name,
    role,
    is_active,
    created_at
FROM profiles
WHERE id = '06125976-5ea1-403a-b09e-aebbe1311111';
-- Doit retourner: role='vendeur', is_active=true

-- ========================================
-- 3. VÉRIFIER LA FOREIGN KEY
-- ========================================
SELECT 
    p.id as property_id,
    p.title,
    p.owner_id,
    prof.full_name as owner_name,
    prof.email as owner_email
FROM properties p
LEFT JOIN profiles prof ON p.owner_id = prof.id
WHERE p.id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
-- Le JOIN doit fonctionner et afficher "Heritage Fall"

-- ========================================
-- 4. LISTER TOUTES LES PROPERTIES ACTIVES
-- ========================================
SELECT 
    id,
    title,
    owner_id,
    status,
    verification_status,
    is_published,
    created_at
FROM properties
WHERE status = 'active'
  AND verification_status = 'verified'
ORDER BY created_at DESC;
-- Votre parcelle DOIT apparaître ici

-- ========================================
-- 5. VÉRIFIER LA COLONNE is_published
-- ========================================
-- Si cette colonne existe, elle pourrait bloquer l'affichage
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'properties'
  AND column_name = 'is_published';
-- Si elle existe, vérifiez qu'elle est TRUE

-- ========================================
-- 6. UPDATE is_published SI NÉCESSAIRE
-- ========================================
-- Décommentez et exécutez si is_published = false
-- UPDATE properties
-- SET is_published = true
-- WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';

-- ========================================
-- 7. VÉRIFIER LES IMAGES
-- ========================================
SELECT 
    id,
    title,
    images,
    main_image,
    array_length(images, 1) as nb_images
FROM properties
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
-- Si images = NULL ou [], la parcelle pourrait ne pas s'afficher

-- ========================================
-- 8. COMPTER LES PROPERTIES PAR STATUS
-- ========================================
SELECT 
    status,
    verification_status,
    COUNT(*) as total
FROM properties
GROUP BY status, verification_status
ORDER BY total DESC;
-- Vérifiez combien de properties sont vraiment actives

-- ========================================
-- 9. VOIR TOUTES VOS PROPERTIES
-- ========================================
SELECT 
    id,
    title,
    status,
    verification_status,
    is_published,
    created_at
FROM properties
WHERE owner_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY created_at DESC;
-- Liste toutes les parcelles de Heritage Fall
