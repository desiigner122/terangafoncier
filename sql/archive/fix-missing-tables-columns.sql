-- ========================================
-- CORRIGER TABLES ET COLONNES MANQUANTES
-- ========================================

-- PROBLÈME 1: Table 'contact_requests' n'existe pas
-- Message: "Could not find the table 'public.contact_requests'"
-- Hint: "Perhaps you meant the table 'public.construction_requests'"

-- 1.1 Vérifier si contact_requests existe
SELECT 
    '📋 TABLE contact_requests' as info,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'contact_requests'
    ) as existe;

-- 1.2 Vérifier si construction_requests existe
SELECT 
    '📋 TABLE construction_requests' as info,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'construction_requests'
    ) as existe;

-- SOLUTION PROBLÈME 1:
-- Si contact_requests n'existe pas, le code doit utiliser construction_requests
-- OU créer la table contact_requests si nécessaire

-- ========================================

-- PROBLÈME 2: Colonne 'messages.conversation_id' n'existe pas
-- Message: "column messages.conversation_id does not exist"

-- 2.1 Voir les colonnes de la table messages
SELECT 
    '📋 COLONNES DE messages' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'messages'
ORDER BY ordinal_position;

-- 2.2 Voir un exemple de message
SELECT 
    '📨 EXEMPLE MESSAGE' as info,
    *
FROM public.messages
LIMIT 1;

-- SOLUTION PROBLÈME 2:
-- Si la colonne n'est pas 'conversation_id', trouver le nom correct
-- Options possibles: chat_id, room_id, thread_id, etc.

-- ========================================

-- PROBLÈME 3: Colonne 'crm_contacts.owner_id' n'existe pas
-- Message: "column crm_contacts.owner_id does not exist"

-- 3.1 Voir les colonnes de la table crm_contacts
SELECT 
    '📋 COLONNES DE crm_contacts' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'crm_contacts'
ORDER BY ordinal_position;

-- 3.2 Voir un exemple de contact CRM
SELECT 
    '👤 EXEMPLE CRM CONTACT' as info,
    *
FROM public.crm_contacts
LIMIT 1;

-- SOLUTION PROBLÈME 3:
-- Si la colonne n'est pas 'owner_id', trouver le nom correct
-- Options possibles: user_id, created_by, vendor_id, etc.

-- ========================================

-- RÉSUMÉ DES CORRECTIONS À FAIRE DANS LE CODE:
-- 
-- 1. Remplacer 'contact_requests' par 'construction_requests'
--    Fichiers à vérifier:
--    - VendeurCRMRealData.jsx
--    - VendeurOverviewRealData.jsx
--    - Autres composants utilisant contact_requests
--
-- 2. Remplacer 'messages.conversation_id' par le bon nom de colonne
--    Fichiers à vérifier:
--    - Components de messagerie/chat
--
-- 3. Remplacer 'crm_contacts.owner_id' par le bon nom de colonne
--    Fichiers à vérifier:
--    - VendeurCRMRealData.jsx
--    - Components CRM
