-- ========================================
-- VÉRIFIER COLONNES TABLE PARCELS
-- ========================================

-- 1. Voir les colonnes de la table parcels
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'parcels'
ORDER BY ordinal_position;

-- 2. Voir une parcelle exemple avec toutes ses colonnes
SELECT *
FROM public.parcels
WHERE status = 'active'
LIMIT 1;

-- 3. Vérifier si les parcelles ont un seller_id
SELECT 
    '🏠 PARCELLES PAR VENDEUR' as info,
    seller_id,
    COUNT(*) as nb_parcelles
FROM public.parcels
GROUP BY seller_id
ORDER BY nb_parcelles DESC;

-- 4. Voir les demandes liées aux parcelles
SELECT 
    '📋 REQUESTS PAR PARCELLE' as info,
    r.parcel_id,
    p.title as parcel_title,
    p.seller_id,
    COUNT(*) as nb_requests
FROM public.requests r
LEFT JOIN public.parcels p ON p.id = r.parcel_id
GROUP BY r.parcel_id, p.title, p.seller_id
ORDER BY nb_requests DESC;
