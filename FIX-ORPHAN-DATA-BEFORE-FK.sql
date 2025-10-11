-- ======================================================================
-- NETTOYAGE DES DONNÉES ORPHELINES AVANT CRÉATION DES FK
-- ======================================================================
-- Exécuter AVANT FIX-DATABASE-SCHEMA-FK.sql
-- ======================================================================

-- 1. DIAGNOSTIC - IDENTIFIER LES DONNÉES ORPHELINES
-- ==================================================

-- A. Transactions avec user_id orphelin
SELECT 
    '❌ TRANSACTIONS ORPHELINES (user_id)' as issue,
    COUNT(*) as count,
    STRING_AGG(DISTINCT t.user_id::text, ', ') as orphan_user_ids
FROM transactions t
LEFT JOIN profiles p ON t.user_id = p.id
WHERE t.user_id IS NOT NULL 
  AND p.id IS NULL;

-- B. Transactions avec property_id orphelin
SELECT 
    '❌ TRANSACTIONS ORPHELINES (property_id)' as issue,
    COUNT(*) as count,
    STRING_AGG(DISTINCT t.property_id::text, ', ') as orphan_property_ids
FROM transactions t
LEFT JOIN properties prop ON t.property_id = prop.id
WHERE t.property_id IS NOT NULL 
  AND prop.id IS NULL;

-- C. Properties avec owner_id orphelin
SELECT 
    '❌ PROPERTIES ORPHELINES (owner_id)' as issue,
    COUNT(*) as count,
    STRING_AGG(DISTINCT prop.owner_id::text, ', ') as orphan_owner_ids
FROM properties prop
LEFT JOIN profiles p ON prop.owner_id = p.id
WHERE prop.owner_id IS NOT NULL 
  AND p.id IS NULL;

-- D. Support tickets avec user_id orphelin
SELECT 
    '❌ SUPPORT TICKETS ORPHELINS (user_id)' as issue,
    COUNT(*) as count,
    STRING_AGG(DISTINCT st.user_id::text, ', ') as orphan_user_ids
FROM support_tickets st
LEFT JOIN profiles p ON st.user_id = p.id
WHERE st.user_id IS NOT NULL 
  AND p.id IS NULL;

-- E. Support tickets avec assigned_to orphelin
SELECT 
    '❌ SUPPORT TICKETS ORPHELINS (assigned_to)' as issue,
    COUNT(*) as count,
    STRING_AGG(DISTINCT st.assigned_to::text, ', ') as orphan_assigned_ids
FROM support_tickets st
LEFT JOIN profiles p ON st.assigned_to = p.id
WHERE st.assigned_to IS NOT NULL 
  AND p.id IS NULL;

-- 2. SOLUTIONS - CHOISIR UNE APPROCHE
-- ====================================

-- OPTION A: SUPPRIMER LES DONNÉES ORPHELINES (RECOMMANDÉ SI DONNÉES DE TEST)
-- ---------------------------------------------------------------------------

-- ⚠️ ATTENTION: Cela supprime les données! Commentez si vous voulez les garder

-- A1. Supprimer transactions orphelines
DELETE FROM transactions t
WHERE t.user_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = t.user_id);

DELETE FROM transactions t
WHERE t.property_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM properties prop WHERE prop.id = t.property_id);

-- A2. Supprimer properties orphelines OU mettre owner_id à NULL
-- Option 1: Supprimer
DELETE FROM properties prop
WHERE prop.owner_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = prop.owner_id);

-- Option 2: Mettre à NULL (décommenter si préféré)
-- UPDATE properties 
-- SET owner_id = NULL
-- WHERE owner_id IS NOT NULL 
--   AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = owner_id);

-- A3. Supprimer support tickets orphelins OU mettre à NULL
DELETE FROM support_tickets st
WHERE st.user_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = st.user_id);

UPDATE support_tickets 
SET assigned_to = NULL
WHERE assigned_to IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = assigned_to);

-- OPTION B: CRÉER DES PROFILS PLACEHOLDER (SI DONNÉES IMPORTANTES)
-- -----------------------------------------------------------------

-- B1. Créer un profil "Utilisateur Supprimé" pour les IDs orphelins
DO $$
DECLARE
    orphan_id uuid;
    deleted_user_id uuid;
BEGIN
    -- Créer un profil "Deleted User" si nécessaire
    INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
        gen_random_uuid(),
        'deleted@teranga-foncier.sn',
        'Utilisateur Supprimé',
        'particulier',
        NOW(),
        NOW()
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO deleted_user_id;

    -- Si le profil existait déjà, récupérer son ID
    IF deleted_user_id IS NULL THEN
        SELECT id INTO deleted_user_id 
        FROM profiles 
        WHERE email = 'deleted@teranga-foncier.sn';
    END IF;

    -- Mettre à jour les transactions orphelines
    UPDATE transactions 
    SET user_id = deleted_user_id
    WHERE user_id IS NOT NULL 
      AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = transactions.user_id);

    -- Mettre à jour les properties orphelines
    UPDATE properties 
    SET owner_id = deleted_user_id
    WHERE owner_id IS NOT NULL 
      AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = properties.owner_id);

    -- Mettre à jour les support tickets orphelins
    UPDATE support_tickets 
    SET user_id = deleted_user_id
    WHERE user_id IS NOT NULL 
      AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = support_tickets.user_id);

    RAISE NOTICE '✅ Profil placeholder créé et données orphelines mises à jour';
END $$;

-- 3. VÉRIFICATION POST-NETTOYAGE
-- ================================

-- Vérifier qu'il n'y a plus d'orphelins
SELECT 
    '✅ VERIFICATION - AUCUNE DONNÉE ORPHELINE' as status,
    (SELECT COUNT(*) FROM transactions t 
     LEFT JOIN profiles p ON t.user_id = p.id 
     WHERE t.user_id IS NOT NULL AND p.id IS NULL) as orphan_transactions_users,
    (SELECT COUNT(*) FROM transactions t 
     LEFT JOIN properties prop ON t.property_id = prop.id 
     WHERE t.property_id IS NOT NULL AND prop.id IS NULL) as orphan_transactions_properties,
    (SELECT COUNT(*) FROM properties prop 
     LEFT JOIN profiles p ON prop.owner_id = p.id 
     WHERE prop.owner_id IS NOT NULL AND p.id IS NULL) as orphan_properties,
    (SELECT COUNT(*) FROM support_tickets st 
     LEFT JOIN profiles p ON st.user_id = p.id 
     WHERE st.user_id IS NOT NULL AND p.id IS NULL) as orphan_tickets_users,
    (SELECT COUNT(*) FROM support_tickets st 
     LEFT JOIN profiles p ON st.assigned_to = p.id 
     WHERE st.assigned_to IS NOT NULL AND p.id IS NULL) as orphan_tickets_assigned;

-- ⚠️ Tous les compteurs doivent être à 0 avant de créer les FK!

-- 4. ENSUITE, EXÉCUTER FIX-DATABASE-SCHEMA-FK.sql
-- ===============================================
-- Une fois les orphelins nettoyés, vous pouvez créer les contraintes FK
