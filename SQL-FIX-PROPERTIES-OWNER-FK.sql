-- =====================================================
-- FIX: Ajouter Foreign Key owner_id → profiles(id)
-- =====================================================
-- Date: 13 octobre 2025
-- Problème: PGRST200 - No relationship between properties and owner_id
-- Solution: Créer la contrainte FK manquante

-- ÉTAPE 0: VÉRIFICATIONS PRÉALABLES
-- ===================================

-- 0.1. Lister tous les owner_id dans properties
SELECT DISTINCT 
    owner_id,
    COUNT(*) as nb_properties
FROM properties
WHERE owner_id IS NOT NULL
GROUP BY owner_id
ORDER BY nb_properties DESC;

-- 0.2. Vérifier quels owner_id n'ont PAS de profil correspondant
SELECT DISTINCT p.owner_id
FROM properties p
LEFT JOIN profiles pr ON p.owner_id = pr.id
WHERE p.owner_id IS NOT NULL 
  AND pr.id IS NULL;

-- 0.3. Si des owner_id orphelins existent, les mettre à NULL temporairement
-- ⚠️ ATTENTION: Ceci supprime la référence au propriétaire!
-- Décommentez seulement si vous voulez perdre cette info
/*
UPDATE properties
SET owner_id = NULL
WHERE owner_id NOT IN (SELECT id FROM profiles);
*/

-- MIEUX: Créer les profils manquants d'abord!
-- Exécuter d'abord SQL-CREATE-HERITAGE-FALL-PROFILE.sql


-- ÉTAPE 1: VÉRIFICATION FK EXISTANTE
-- ===================================

-- 1. Vérifier si la FK existe déjà
SELECT 
    conname AS constraint_name,
    conrelid::regclass AS table_name,
    confrelid::regclass AS foreign_table
FROM pg_constraint
WHERE conname LIKE '%owner%'
  AND conrelid = 'properties'::regclass;

-- ÉTAPE 2: CRÉATION DE LA FK
-- ===========================

-- 2. Supprimer l'ancienne FK si elle existe (au cas où)
ALTER TABLE properties 
DROP CONSTRAINT IF EXISTS properties_owner_id_fkey;

-- 3. Créer la nouvelle Foreign Key avec CASCADE
-- ⚠️ IMPORTANT: Tous les owner_id doivent exister dans profiles!
ALTER TABLE properties
ADD CONSTRAINT properties_owner_id_fkey 
FOREIGN KEY (owner_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE
ON UPDATE CASCADE;

-- 4. Créer un index pour améliorer les performances des JOINs
CREATE INDEX IF NOT EXISTS idx_properties_owner_id 
ON properties(owner_id);


-- ÉTAPE 3: VÉRIFICATIONS FINALES
-- ===============================

-- 5. Vérifier la création de la FK
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    rc.update_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'properties'
  AND kcu.column_name = 'owner_id';

-- ✅ Résultat attendu:
-- constraint_name: properties_owner_id_fkey
-- table_name: properties
-- column_name: owner_id
-- foreign_table_name: profiles
-- foreign_column_name: id
-- delete_rule: CASCADE
-- update_rule: CASCADE
