-- =====================================================
-- FIX COMPLET: Foreign Key owner_id avec nettoyage
-- =====================================================
-- Date: 13 octobre 2025
-- Approche: Nettoyer d'abord, puis créer la FK

-- PHASE 1: DIAGNOSTIC
-- ====================

-- Trouver les owner_id orphelins (qui n'ont pas de profil)
SELECT 
    p.id as property_id,
    p.title,
    p.owner_id as orphan_owner_id,
    p.status,
    p.verification_status
FROM properties p
LEFT JOIN profiles pr ON p.owner_id = pr.id
WHERE p.owner_id IS NOT NULL 
  AND pr.id IS NULL;

-- PHASE 2: NETTOYAGE (3 OPTIONS)
-- ===============================

-- OPTION A: Mettre les owner_id orphelins à NULL
-- ⚠️ Cela enlève le lien propriétaire, mais permet de créer la FK
/*
UPDATE properties
SET owner_id = NULL
WHERE owner_id NOT IN (SELECT id FROM profiles);
*/

-- OPTION B: Créer des profils "fantômes" pour les owner_id orphelins
-- ✅ Recommandé si vous voulez garder la cohérence
/*
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT DISTINCT 
    p.owner_id,
    'unknown-' || p.owner_id || '@teranga-foncier.sn',
    'Utilisateur Inconnu',
    'vendeur-particulier',
    NOW(),
    NOW()
FROM properties p
LEFT JOIN profiles pr ON p.owner_id = pr.id
WHERE p.owner_id IS NOT NULL 
  AND pr.id IS NULL
ON CONFLICT (id) DO NOTHING;
*/

-- OPTION C: Assigner les properties orphelines à l'admin
-- 🔧 Temporaire, pour débloquer la situation
/*
UPDATE properties
SET owner_id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497' -- ID admin
WHERE owner_id NOT IN (SELECT id FROM profiles)
  AND owner_id IS NOT NULL;
*/

-- PHASE 3: CRÉATION DE LA FK
-- ===========================

-- Supprimer l'ancienne FK si elle existe
ALTER TABLE properties 
DROP CONSTRAINT IF EXISTS properties_owner_id_fkey;

-- Créer la nouvelle FK SEULEMENT si aucun owner_id orphelin
-- PostgreSQL va automatiquement rejeter si des références invalides existent
ALTER TABLE properties
ADD CONSTRAINT properties_owner_id_fkey 
FOREIGN KEY (owner_id) 
REFERENCES profiles(id) 
ON DELETE SET NULL  -- ⚠️ Changé de CASCADE à SET NULL pour éviter suppressions en cascade
ON UPDATE CASCADE;

-- Créer index
CREATE INDEX IF NOT EXISTS idx_properties_owner_id 
ON properties(owner_id);

-- PHASE 4: VÉRIFICATION
-- ======================

-- Vérifier la FK
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table,
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

-- Compter les properties par propriétaire
SELECT 
    pr.id,
    pr.full_name,
    pr.email,
    pr.role,
    COUNT(p.id) as nb_properties
FROM profiles pr
LEFT JOIN properties p ON pr.id = p.owner_id
GROUP BY pr.id, pr.full_name, pr.email, pr.role
HAVING COUNT(p.id) > 0
ORDER BY nb_properties DESC;
