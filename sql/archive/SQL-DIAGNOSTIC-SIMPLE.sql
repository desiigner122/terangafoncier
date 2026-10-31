-- DIAGNOSTIC SIMPLIFIÉ: Parcelle invisible
-- Exécutez ces queries UNE PAR UNE

-- ========================================
-- Query #1: Voir TOUTES les properties actives et vérifiées
-- ========================================
SELECT 
    id, 
    title, 
    owner_id, 
    status, 
    verification_status,
    created_at
FROM properties
WHERE status = 'active' 
  AND verification_status = 'verified'
ORDER BY created_at DESC;
-- Votre parcelle DOIT apparaître ici


-- ========================================
-- Query #2: Voir TOUTES vos properties (Heritage Fall)
-- ========================================
SELECT 
    id, 
    title, 
    owner_id,
    status, 
    verification_status,
    created_at
FROM properties
WHERE owner_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY created_at DESC;
-- Liste toutes vos parcelles, peu importe le status


-- ========================================
-- Query #3: Détails COMPLETS de votre parcelle
-- ========================================
SELECT *
FROM properties
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
-- Affiche TOUTES les colonnes pour diagnostic


-- ========================================
-- Query #4: Vérifier la structure de la table properties
-- ========================================
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'properties'
  AND column_name IN ('status', 'verification_status', 'is_published', 'is_active', 'published', 'visible')
ORDER BY column_name;
-- Vérifie quelles colonnes existent vraiment


-- ========================================
-- Query #5: Compter par status
-- ========================================
SELECT 
    status,
    verification_status,
    COUNT(*) as total
FROM properties
GROUP BY status, verification_status
ORDER BY total DESC;
-- Vue d'ensemble de toutes les properties
