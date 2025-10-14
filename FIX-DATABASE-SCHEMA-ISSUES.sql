-- ============================================
-- FIX DATABASE SCHEMA ISSUES
-- ============================================
-- Ce script corrige les problèmes de schéma détectés :
-- 1. Ajoute la foreign key manquante : support_tickets.user_id → profiles.id
-- 
-- Note: property_photos utilise déjà les bonnes colonnes :
--   - file_url (pas photo_url)
--   - is_primary (pas is_main)  
--   - display_order (pas order_index)
-- Les fichiers JavaScript ont été corrigés pour utiliser ces noms.
-- ============================================

-- 1️⃣ AJOUTER FOREIGN KEY sur support_tickets.user_id
-- ============================================

-- Vérifier si la FK existe déjà
DO $$ 
BEGIN
    -- Supprimer la contrainte si elle existe déjà (pour réexécution)
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'support_tickets_user_id_fkey' 
        AND table_name = 'support_tickets'
    ) THEN
        ALTER TABLE support_tickets DROP CONSTRAINT support_tickets_user_id_fkey;
    END IF;
END $$;

-- Créer la foreign key
ALTER TABLE support_tickets
ADD CONSTRAINT support_tickets_user_id_fkey
FOREIGN KEY (user_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

COMMENT ON CONSTRAINT support_tickets_user_id_fkey ON support_tickets 
IS 'Foreign key linking support ticket creator to their profile';

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que les 2 foreign keys existent maintenant
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'support_tickets'
AND tc.table_schema = 'public'
ORDER BY kcu.column_name;

-- Devrait afficher 2 lignes :
-- support_tickets_assigned_to_fkey | support_tickets | assigned_to | profiles | id
-- support_tickets_user_id_fkey     | support_tickets | user_id     | profiles | id
