-- ======================================================================
-- FIX DATABASE SCHEMA - AVEC NETTOYAGE AUTOMATIQUE DES ORPHELINS
-- ======================================================================
-- Ce script combine diagnostic + nettoyage + création FK
-- ======================================================================

-- ÉTAPE 1: DIAGNOSTIC COMPLET
-- ============================

SELECT '🔍 ÉTAPE 1: DIAGNOSTIC DES DONNÉES ORPHELINES' as etape;

-- Compter les orphelins dans transactions (user_id)
DO $$
DECLARE
    orphan_count integer;
BEGIN
    SELECT COUNT(*) INTO orphan_count
    FROM transactions t
    LEFT JOIN profiles p ON t.user_id = p.id
    WHERE t.user_id IS NOT NULL AND p.id IS NULL;
    
    RAISE NOTICE '❌ Transactions avec user_id orphelin: %', orphan_count;
END $$;

-- Compter les orphelins dans transactions (property_id)
DO $$
DECLARE
    orphan_count integer;
BEGIN
    SELECT COUNT(*) INTO orphan_count
    FROM transactions t
    LEFT JOIN properties prop ON t.property_id = prop.id
    WHERE t.property_id IS NOT NULL AND prop.id IS NULL;
    
    RAISE NOTICE '❌ Transactions avec property_id orphelin: %', orphan_count;
END $$;

-- Compter les orphelins dans properties (owner_id)
DO $$
DECLARE
    orphan_count integer;
BEGIN
    SELECT COUNT(*) INTO orphan_count
    FROM properties prop
    LEFT JOIN profiles p ON prop.owner_id = p.id
    WHERE prop.owner_id IS NOT NULL AND p.id IS NULL;
    
    RAISE NOTICE '❌ Properties avec owner_id orphelin: %', orphan_count;
END $$;

-- Compter les orphelins dans support_tickets (user_id)
DO $$
DECLARE
    orphan_count integer;
BEGIN
    SELECT COUNT(*) INTO orphan_count
    FROM support_tickets st
    LEFT JOIN profiles p ON st.user_id = p.id
    WHERE st.user_id IS NOT NULL AND p.id IS NULL;
    
    RAISE NOTICE '❌ Support tickets avec user_id orphelin: %', orphan_count;
END $$;

-- Compter les orphelins dans support_tickets (assigned_to)
DO $$
DECLARE
    orphan_count integer;
BEGIN
    SELECT COUNT(*) INTO orphan_count
    FROM support_tickets st
    LEFT JOIN profiles p ON st.assigned_to = p.id
    WHERE st.assigned_to IS NOT NULL AND p.id IS NULL;
    
    RAISE NOTICE '❌ Support tickets avec assigned_to orphelin: %', orphan_count;
END $$;

-- ÉTAPE 2: NETTOYAGE AUTOMATIQUE
-- ================================

SELECT '🧹 ÉTAPE 2: NETTOYAGE DES DONNÉES ORPHELINES' as etape;

-- Option choisie: Mettre à NULL les références orphelines
-- (Plus sûr que de supprimer les enregistrements)

-- Transactions: Mettre user_id orphelins à NULL
UPDATE transactions 
SET user_id = NULL
WHERE user_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = transactions.user_id);

-- Transactions: Mettre property_id orphelins à NULL
UPDATE transactions 
SET property_id = NULL
WHERE property_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM properties prop WHERE prop.id = transactions.property_id);

-- Properties: Mettre owner_id orphelins à NULL
UPDATE properties 
SET owner_id = NULL
WHERE owner_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = properties.owner_id);

-- Support Tickets: Mettre user_id orphelins à NULL
UPDATE support_tickets 
SET user_id = NULL
WHERE user_id IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = support_tickets.user_id);

-- Support Tickets: Mettre assigned_to orphelins à NULL
UPDATE support_tickets 
SET assigned_to = NULL
WHERE assigned_to IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = support_tickets.assigned_to);

DO $$
BEGIN
    RAISE NOTICE '✅ Données orphelines nettoyées (références mises à NULL)';
END $$;

-- ÉTAPE 3: CRÉATION DES CONTRAINTES FK
-- =====================================

SELECT '🔗 ÉTAPE 3: CRÉATION DES CONTRAINTES FOREIGN KEY' as etape;

-- Properties -> Profiles (owner_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'properties' 
          AND constraint_name = 'properties_owner_id_fkey'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'properties' AND column_name = 'owner_id'
        ) THEN
            ALTER TABLE public.properties 
            ADD CONSTRAINT properties_owner_id_fkey 
            FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
            
            RAISE NOTICE '✅ Created FK: properties.owner_id -> profiles.id';
        ELSE
            RAISE NOTICE '⚠️  Column properties.owner_id does NOT exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ FK already exists: properties.owner_id -> profiles.id';
    END IF;
END $$;

-- Transactions -> Profiles (user_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'transactions' 
          AND constraint_name = 'transactions_user_id_fkey'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'transactions' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE public.transactions 
            ADD CONSTRAINT transactions_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
            
            RAISE NOTICE '✅ Created FK: transactions.user_id -> profiles.id';
        ELSE
            RAISE NOTICE '⚠️  Column transactions.user_id does NOT exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ FK already exists: transactions.user_id -> profiles.id';
    END IF;
END $$;

-- Transactions -> Properties (property_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'transactions' 
          AND constraint_name = 'transactions_property_id_fkey'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'transactions' AND column_name = 'property_id'
        ) THEN
            ALTER TABLE public.transactions 
            ADD CONSTRAINT transactions_property_id_fkey 
            FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE SET NULL;
            
            RAISE NOTICE '✅ Created FK: transactions.property_id -> properties.id';
        ELSE
            RAISE NOTICE '⚠️  Column transactions.property_id does NOT exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ FK already exists: transactions.property_id -> properties.id';
    END IF;
END $$;

-- Support Tickets -> Profiles (user_id)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'support_tickets' 
          AND constraint_name = 'support_tickets_user_id_fkey'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'support_tickets' AND column_name = 'user_id'
        ) THEN
            ALTER TABLE public.support_tickets 
            ADD CONSTRAINT support_tickets_user_id_fkey 
            FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
            
            RAISE NOTICE '✅ Created FK: support_tickets.user_id -> profiles.id';
        ELSE
            RAISE NOTICE '⚠️  Column support_tickets.user_id does NOT exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ FK already exists: support_tickets.user_id -> profiles.id';
    END IF;
END $$;

-- Support Tickets -> Profiles (assigned_to)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'support_tickets' 
          AND constraint_name = 'support_tickets_assigned_to_fkey'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'support_tickets' AND column_name = 'assigned_to'
        ) THEN
            ALTER TABLE public.support_tickets 
            ADD CONSTRAINT support_tickets_assigned_to_fkey 
            FOREIGN KEY (assigned_to) REFERENCES public.profiles(id) ON DELETE SET NULL;
            
            RAISE NOTICE '✅ Created FK: support_tickets.assigned_to -> profiles.id';
        ELSE
            RAISE NOTICE '⚠️  Column support_tickets.assigned_to does NOT exist';
        END IF;
    ELSE
        RAISE NOTICE '✅ FK already exists: support_tickets.assigned_to -> profiles.id';
    END IF;
END $$;

-- ÉTAPE 4: RAFRAÎCHIR LE CACHE POSTGREST
-- =======================================

SELECT '🔄 ÉTAPE 4: RAFRAÎCHISSEMENT DU CACHE SUPABASE' as etape;

NOTIFY pgrst, 'reload schema';

DO $$
BEGIN
    RAISE NOTICE '✅ Cache PostgREST rafraîchi';
END $$;

-- ÉTAPE 5: VÉRIFICATION FINALE
-- =============================

SELECT '✅ ÉTAPE 5: VÉRIFICATION FINALE' as etape;

-- Afficher toutes les FK créées
SELECT 
    '✅ FOREIGN KEYS CRÉÉES' as status,
    tc.table_name, 
    kcu.column_name,
    '->' as arrow,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column
FROM information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('properties', 'transactions', 'support_tickets')
ORDER BY tc.table_name;

-- Vérifier qu'il n'y a plus d'orphelins
SELECT 
    '✅ VÉRIFICATION: AUCUNE DONNÉE ORPHELINE RESTANTE' as status,
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

SELECT '🎉 MIGRATION TERMINÉE AVEC SUCCÈS!' as resultat;
