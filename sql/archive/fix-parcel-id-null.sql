-- ========================================
-- CORRIGER PARCEL_ID NULL DANS REQUESTS
-- ========================================

-- 1. Voir les requests avec parcel_id NULL
SELECT 
    '❌ REQUESTS SANS PARCELLE' as info,
    id,
    type,
    payment_type,
    user_id,
    parcel_id,
    offered_price,
    status,
    created_at,
    metadata
FROM public.requests
WHERE parcel_id IS NULL
ORDER BY created_at DESC;

-- 2. Vérifier si metadata contient parcel_id
SELECT 
    '🔍 METADATA ANALYSIS' as info,
    id,
    metadata->>'parcel_id' as metadata_parcel_id,
    metadata->>'parcelle_id' as metadata_parcelle_id,
    metadata
FROM public.requests
WHERE parcel_id IS NULL
LIMIT 5;

-- 3. Voir les users qui ont fait ces requests
SELECT 
    '👤 USERS DES REQUESTS NULL' as info,
    r.user_id,
    p.first_name,
    p.last_name,
    p.email,
    COUNT(*) as nb_requests_null
FROM public.requests r
LEFT JOIN public.profiles p ON p.id = r.user_id
WHERE r.parcel_id IS NULL
GROUP BY r.user_id, p.first_name, p.last_name, p.email
ORDER BY nb_requests_null DESC;

-- 4. Si vous connaissez le parcel_id correct, vous pouvez le mettre à jour
-- EXEMPLE: Mettre à jour les requests NULL avec le parcel_id de test
-- ATTENTION: Remplacez '9a2dce41-8e2c-4888-b3d8-0dce41339b5a' par le bon ID

-- UPDATE public.requests 
-- SET parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
-- WHERE parcel_id IS NULL 
-- AND user_id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';

-- 5. Vérifier les requests après correction
-- SELECT 
--     '✅ APRÈS CORRECTION' as info,
--     parcel_id,
--     COUNT(*) as nb_requests
-- FROM public.requests
-- GROUP BY parcel_id
-- ORDER BY nb_requests DESC;

-- 6. IMPORTANT: Identifier la cause dans le code
-- Les formulaires de paiement doivent TOUJOURS envoyer parcel_id
-- Vérifier dans:
-- - InstallmentsPaymentPage.jsx
-- - OneTimePaymentPage.jsx  
-- - BankFinancingPage.jsx
-- 
-- Le payload doit contenir:
-- parcel_id: context.parcelleId || context.parcelle?.id
