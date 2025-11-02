-- ============================================================
-- ROLLBACK COMPLET: Supprimer toutes les policies Phase 4
-- ============================================================
-- Ce script supprime TOUTES les policies créées en Phase 4
-- pour restaurer l'état fonctionnel précédent
-- ============================================================

-- Supprimer TOUTES les policies de purchase_cases liées aux notaires
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'purchase_cases' 
        AND policyname LIKE '%otaire%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON purchase_cases', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Supprimer policies de notaire_case_assignments
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'notaire_case_assignments'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON notaire_case_assignments', r.policyname);
        RAISE NOTICE 'Dropped policy: %', r.policyname;
    END LOOP;
END $$;

-- Supprimer policies timeline
DROP POLICY IF EXISTS "Notaires ajoutent timeline à leurs dossiers" ON purchase_case_timeline;
DROP POLICY IF EXISTS "Notaires ajoutent timeline" ON purchase_case_timeline;

-- Supprimer policies documents
DROP POLICY IF EXISTS "Notaires voient documents de leurs dossiers" ON purchase_case_documents;
DROP POLICY IF EXISTS "Notaires voient documents" ON purchase_case_documents;

-- Supprimer policies messages
DROP POLICY IF EXISTS "Notaires voient messages de leurs dossiers" ON purchase_case_messages;
DROP POLICY IF EXISTS "Notaires envoient messages dans leurs dossiers" ON purchase_case_messages;
DROP POLICY IF EXISTS "Notaires voient messages" ON purchase_case_messages;
DROP POLICY IF EXISTS "Notaires envoient messages" ON purchase_case_messages;

-- Lister les policies restantes
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename IN (
    'purchase_cases',
    'notaire_case_assignments',
    'purchase_case_timeline',
    'purchase_case_documents',
    'purchase_case_messages'
)
ORDER BY tablename, policyname;

RAISE NOTICE 'Rollback complet terminé. Les anciennes policies sont restaurées.';

-- Fin du rollback
