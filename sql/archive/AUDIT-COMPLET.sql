-- ===================================================================
-- SCRIPT D'AUDIT COMPLET - TERANGAFONCIER
-- ===================================================================
-- Objectif: Fournir une vue d'ensemble complète de la base de données
--           pour diagnostiquer les problèmes d'accès et de données.
-- Date: 12 Octobre 2025
-- ===================================================================

-- 1️⃣ LISTE DE TOUTES LES TABLES AVEC COMPTAGE
-- Donne une vue rapide de ce qui existe et du volume de données. (Version corrigée)
SELECT 
    t.table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count,
    c.reltuples::BIGINT as estimated_rows
FROM 
    information_schema.tables t
JOIN 
    pg_class c ON c.relname = t.table_name
JOIN 
    pg_namespace n ON n.oid = c.relnamespace
WHERE 
    t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND n.nspname = 'public'
ORDER BY 
    t.table_name;

-- 2️⃣ VÉRIFICATION DU PROFIL ADMIN
-- Confirme si le profil admin existe et a le bon rôle.
SELECT 
    id,
    full_name,
    email,
    role,
    created_at
FROM 
    public.profiles 
WHERE 
    email ILIKE '%admin%' OR role = 'admin';

-- 3️⃣ PROPRIÉTÉS EN ATTENTE DE VALIDATION
-- Trouve les propriétés qui nécessitent une action de l'admin.
-- Assumant que 'en_attente' ou un statut similaire existe.
SELECT 
    id,
    title,
    status,
    owner_id,
    price,
    created_at
FROM 
    public.properties
WHERE 
    status NOT IN ('disponible', 'vendu', 'loue', 'retire')
ORDER BY 
    created_at DESC;

-- 4️⃣ TICKETS DE SUPPORT OU DEMANDES
-- Recherche une table de tickets (nom supposé : support_tickets)
-- Si cette requête échoue, la table a un nom différent.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'support_tickets' AND table_schema = 'public') THEN
        RAISE NOTICE '--- Contenu de la table support_tickets ---';
        -- La requête réelle sera exécutée manuellement si la table existe
        -- SELECT * FROM public.support_tickets ORDER BY created_at DESC;
    ELSE
        RAISE NOTICE '--- La table support_tickets n''existe pas. Vérification d''autres tables... ---';
    END IF;
END $$;

-- 5️⃣ LEADS MARKETING RÉCENTS
-- Vérifie les 10 derniers leads pour confirmer que la table fonctionne.
SELECT 
    id,
    full_name,
    email,
    phone,
    subject,
    created_at
FROM 
    public.marketing_leads
ORDER BY 
    created_at DESC
LIMIT 10;

-- 6️⃣ POLITIQUES DE SÉCURITÉ (RLS) ACTIVES
-- Crucial pour diagnostiquer les problèmes d'accès.
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM 
    pg_policies
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, policyname;

-- 7️⃣ FONCTIONS PERSONNALISÉES (TRIGGERS POTENTIELS)
-- Liste les fonctions qui ne sont pas des fonctions système.
SELECT 
    p.proname as function_name,
    pg_get_function_result(p.oid) as result_data_type,
    pg_get_function_arguments(p.oid) as argument_data_types
FROM 
    pg_proc p
JOIN 
    pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public'
ORDER BY 
    function_name;

-- 8️⃣ TRIGGERS ACTIFS
-- Montre quelles fonctions sont exécutées automatiquement.
SELECT 
    event_object_table as table_name,
    trigger_name,
    event_manipulation as event,
    action_statement as action
FROM 
    information_schema.triggers
WHERE 
    trigger_schema = 'public'
ORDER BY 
    table_name, event;
