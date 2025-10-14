-- =====================================================
-- SOLUTION: Créer le profil Heritage Fall manquant
-- =====================================================
-- Date: 13 octobre 2025
-- Problème: owner_id existe mais pas le profil correspondant

-- Étape 1: Créer le profil manquant pour Heritage Fall
-- Essayer différents rôles jusqu'à trouver le bon
INSERT INTO profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
)
VALUES (
    '06125976-5ea1-403a-b09e-aebbe1311111',
    'heritage.fall@teranga-foncier.sn',
    'Heritage Fall',
    'vendeur',  -- Changé de vendeur-particulier à vendeur
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Étape 2: Vérifier que le profil a été créé
SELECT 
    id,
    email,
    full_name,
    role,
    created_at
FROM profiles
WHERE id = '06125976-5ea1-403a-b09e-aebbe1311111';

-- Étape 3: Vérifier qu'il n'y a plus d'orphelins
SELECT 
    p.id as property_id,
    p.title,
    p.owner_id,
    'ORPHAN - NO PROFILE' as status
FROM properties p
LEFT JOIN profiles pr ON p.owner_id = pr.id
WHERE p.owner_id IS NOT NULL 
  AND pr.id IS NULL;

-- ✅ Si la requête retourne 0 lignes, on peut créer la FK!

-- Étape 4: Créer la Foreign Key
ALTER TABLE properties 
DROP CONSTRAINT IF EXISTS properties_owner_id_fkey;

ALTER TABLE properties
ADD CONSTRAINT properties_owner_id_fkey 
FOREIGN KEY (owner_id) 
REFERENCES profiles(id) 
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Étape 5: Créer l'index
CREATE INDEX IF NOT EXISTS idx_properties_owner_id 
ON properties(owner_id);

-- Étape 6: Vérification finale
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

-- ✅ TERMINÉ! La page /parcelles-vendeurs devrait maintenant fonctionner
