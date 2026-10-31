-- ========================================
-- NETTOYER LES REQUESTS ORPHELINES
-- ========================================
-- Ce script supprime les requests sans parcel_id (orphelines)
-- ATTENTION: Vérifiez d'abord si certaines doivent être conservées

-- 1. Voir combien de requests orphelines existent
SELECT 
    '📊 STATISTIQUES' as info,
    COUNT(*) as total_orphelines,
    MIN(created_at) as plus_ancienne,
    MAX(created_at) as plus_recente
FROM public.requests
WHERE parcel_id IS NULL;

-- 2. Voir le détail par user
SELECT 
    '👤 PAR UTILISATEUR' as info,
    user_id,
    COUNT(*) as nb_orphelines,
    string_agg(DISTINCT type, ', ') as types,
    string_agg(DISTINCT status, ', ') as statuts
FROM public.requests
WHERE parcel_id IS NULL
GROUP BY user_id
ORDER BY nb_orphelines DESC;

-- 3. OPTION A: Supprimer TOUTES les requests orphelines
-- DÉCOMMENTEZ si vous voulez tout nettoyer
/*
DELETE FROM public.requests
WHERE parcel_id IS NULL;
*/

-- 4. OPTION B: Supprimer uniquement les tests (metadata->>'test' = 'true')
/*
DELETE FROM public.requests
WHERE parcel_id IS NULL
AND metadata->>'test' = 'true';
*/

-- 5. OPTION C: Supprimer uniquement les anciennes (plus de 7 jours)
/*
DELETE FROM public.requests
WHERE parcel_id IS NULL
AND created_at < NOW() - INTERVAL '7 days';
*/

-- 6. Vérifier après suppression
SELECT 
    '✅ APRÈS NETTOYAGE' as info,
    CASE 
        WHEN parcel_id IS NULL THEN 'Orphelines'
        ELSE 'Liées'
    END as categorie,
    COUNT(*) as nb_requests
FROM public.requests
GROUP BY 
    CASE 
        WHEN parcel_id IS NULL THEN 'Orphelines'
        ELSE 'Liées'
    END;

-- 7. Voir les requests bien liées
SELECT 
    '🏠 REQUESTS BIEN LIÉES' as info,
    r.id,
    r.type,
    r.status,
    p.title as parcelle,
    p.seller_id,
    r.created_at
FROM public.requests r
INNER JOIN public.parcels p ON p.id = r.parcel_id
ORDER BY r.created_at DESC
LIMIT 10;
