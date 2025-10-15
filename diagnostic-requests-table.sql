-- ========================================
-- DIAGNOSTIC TABLE REQUESTS
-- ========================================
-- Exécutez ce script dans Supabase pour voir l'état actuel

-- 1. Voir toutes les colonnes de la table requests
SELECT 
    '📋 COLONNES ACTUELLES' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'requests'
ORDER BY ordinal_position;

-- 2. Voir les contraintes CHECK
SELECT 
    '🔒 CONTRAINTES CHECK' as info,
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.requests'::regclass
    AND contype = 'c'
ORDER BY conname;

-- 3. Compter les requests par type
SELECT 
    '📊 REQUESTS PAR TYPE' as info,
    type,
    COUNT(*) as nombre,
    MIN(created_at) as premiere,
    MAX(created_at) as derniere
FROM public.requests
GROUP BY type
ORDER BY nombre DESC;

-- 4. Compter les requests par status
SELECT 
    '📊 REQUESTS PAR STATUS' as info,
    status,
    COUNT(*) as nombre
FROM public.requests
GROUP BY status
ORDER BY nombre DESC;

-- 5. Voir les 10 dernières requests
SELECT 
    '📝 DERNIÈRES REQUESTS' as info,
    id,
    type,
    status,
    offered_price,
    parcel_id,
    user_id,
    created_at
FROM public.requests
ORDER BY created_at DESC
LIMIT 10;

-- 6. Vérifier si les colonnes manquantes existent
SELECT 
    '❓ COLONNES MANQUANTES' as info,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'requests' AND column_name = 'payment_type') 
        THEN '✅ payment_type existe' 
        ELSE '❌ payment_type MANQUANTE' 
    END as payment_type_status,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'requests' AND column_name = 'installment_plan') 
        THEN '✅ installment_plan existe' 
        ELSE '❌ installment_plan MANQUANTE' 
    END as installment_plan_status,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'requests' AND column_name = 'bank_details') 
        THEN '✅ bank_details existe' 
        ELSE '❌ bank_details MANQUANTE' 
    END as bank_details_status,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'requests' AND column_name = 'message') 
        THEN '✅ message existe' 
        ELSE '❌ message MANQUANTE' 
    END as message_status;
