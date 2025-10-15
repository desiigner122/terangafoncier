-- ========================================
-- TEST INSERTION REQUESTS
-- ========================================
-- Ce script teste si l'insertion fonctionne

-- 1. Voir un exemple de parcelle pour les tests
SELECT 
    '🏠 PARCELLE TEST' as info,
    id,
    title,
    price,
    seller_id,
    status
FROM public.parcels
WHERE status = 'active'
LIMIT 1;

-- 2. Tester insertion paiement échelonné
-- REMPLACEZ les UUIDs par vos vraies valeurs
INSERT INTO public.requests (
    user_id,
    type,
    payment_type,
    status,
    parcel_id,
    offered_price,
    installment_plan,
    metadata
) VALUES (
    '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2', -- Votre user_id
    'installment_payment',
    'installments',
    'pending',
    '9a2dce41-8e2c-4888-b3d8-0dce41339b5a', -- ID parcelle test
    10000000,
    '{"total_amount": 10000000, "down_payment": 2000000, "number_of_installments": 12}'::jsonb,
    '{"test": true}'::jsonb
)
RETURNING id, type, payment_type, status, created_at;

-- 3. Voir la dernière request créée
SELECT 
    '✅ DERNIÈRE REQUEST' as info,
    id,
    type,
    payment_type,
    status,
    offered_price,
    installment_plan,
    created_at
FROM public.requests
ORDER BY created_at DESC
LIMIT 1;

-- 4. Supprimer la request test (optionnel)
-- DELETE FROM public.requests WHERE metadata->>'test' = 'true';
