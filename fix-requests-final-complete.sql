-- ========================================
-- SCRIPT COMPLET : CORRIGER TABLE REQUESTS
-- ========================================
-- Ce script corrige toutes les erreurs de la table requests
-- Exécutez-le dans Supabase SQL Editor

-- ÉTAPE 1: Corriger la contrainte type
-- =====================================
DO $$ 
BEGIN
    -- Supprimer l'ancienne contrainte
    ALTER TABLE public.requests DROP CONSTRAINT IF EXISTS requests_type_check;
    RAISE NOTICE '✅ Ancienne contrainte type supprimée';
    
    -- Ajouter la nouvelle contrainte avec toutes les valeurs
    ALTER TABLE public.requests 
    ADD CONSTRAINT requests_type_check 
    CHECK (type IN (
        'one_time', 
        'installment_payment', 
        'installments',
        'bank_financing',
        'purchase_request',
        'sale_request'
    ));
    RAISE NOTICE '✅ Nouvelle contrainte type ajoutée';
END $$;

-- ÉTAPE 2: Ajouter payment_type si manquant
-- ==========================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'payment_type'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN payment_type TEXT CHECK (payment_type IN ('one_time', 'installments', 'bank_financing'));
        RAISE NOTICE '✅ Colonne payment_type ajoutée';
    ELSE
        RAISE NOTICE 'ℹ️ Colonne payment_type existe déjà';
    END IF;
END $$;

-- ÉTAPE 3: Ajouter installment_plan si manquant
-- ==============================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'installment_plan'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN installment_plan JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE '✅ Colonne installment_plan ajoutée';
    ELSE
        RAISE NOTICE 'ℹ️ Colonne installment_plan existe déjà';
    END IF;
END $$;

-- ÉTAPE 4: Ajouter bank_details si manquant
-- ==========================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'bank_details'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN bank_details JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE '✅ Colonne bank_details ajoutée';
    ELSE
        RAISE NOTICE 'ℹ️ Colonne bank_details existe déjà';
    END IF;
END $$;

-- ÉTAPE 5: Ajouter message si manquant
-- =====================================
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'message'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN message TEXT;
        RAISE NOTICE '✅ Colonne message ajoutée';
    ELSE
        RAISE NOTICE 'ℹ️ Colonne message existe déjà';
    END IF;
END $$;

-- ÉTAPE 6: Mettre à jour payment_type basé sur type
-- ==================================================
UPDATE public.requests 
SET payment_type = CASE 
    WHEN type = 'one_time' THEN 'one_time'
    WHEN type = 'installment_payment' THEN 'installments'
    WHEN type = 'installments' THEN 'installments'
    WHEN type = 'bank_financing' THEN 'bank_financing'
    ELSE 'one_time'
END
WHERE payment_type IS NULL;

-- ÉTAPE 7: Vérification finale
-- =============================
SELECT 
    '✅ STRUCTURE TABLE REQUESTS' as titre,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'requests'
ORDER BY ordinal_position;

-- ÉTAPE 8: Afficher les contraintes
-- ==================================
SELECT 
    '✅ CONTRAINTES ACTIVES' as titre,
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.requests'::regclass
    AND conname LIKE '%type%';

-- ÉTAPE 9: Statistiques
-- =====================
SELECT 
    '📊 STATISTIQUES REQUESTS' as titre,
    type,
    payment_type,
    status,
    COUNT(*) as nombre
FROM public.requests
GROUP BY type, payment_type, status
ORDER BY nombre DESC;
