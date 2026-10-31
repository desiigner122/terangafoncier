-- ========================================
-- COMPLÉTER LA STRUCTURE DE LA TABLE requests
-- ========================================

-- 1. Ajouter payment_type si manquant
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'payment_type'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN payment_type TEXT CHECK (payment_type IN ('one_time', 'installments', 'bank_financing'));
        RAISE NOTICE '✅ Colonne payment_type ajoutée';
    END IF;
END $$;

-- 2. Ajouter installment_plan si manquant
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'installment_plan'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN installment_plan JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE '✅ Colonne installment_plan ajoutée';
    END IF;
END $$;

-- 3. Ajouter bank_details si manquant
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'bank_details'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN bank_details JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE '✅ Colonne bank_details ajoutée';
    END IF;
END $$;

-- 4. Ajouter message si manquant
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'message'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN message TEXT;
        RAISE NOTICE '✅ Colonne message ajoutée';
    END IF;
END $$;

-- 5. Mettre à jour payment_type basé sur type existant
UPDATE public.requests 
SET payment_type = CASE 
    WHEN type = 'one_time' THEN 'one_time'
    WHEN type = 'installment_payment' THEN 'installments'
    WHEN type = 'bank_financing' THEN 'bank_financing'
    ELSE 'one_time'
END
WHERE payment_type IS NULL;

-- 6. Vérifier la structure finale
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'requests'
ORDER BY ordinal_position;

-- 7. Afficher quelques exemples
SELECT 
    id, 
    type, 
    payment_type, 
    status, 
    offered_price,
    CASE 
        WHEN installment_plan IS NOT NULL AND installment_plan::text != '{}'::text THEN '✅ Oui'
        ELSE '❌ Non'
    END as has_installment_plan,
    CASE 
        WHEN bank_details IS NOT NULL AND bank_details::text != '{}'::text THEN '✅ Oui'
        ELSE '❌ Non'
    END as has_bank_details,
    created_at
FROM public.requests
ORDER BY created_at DESC
LIMIT 10;
