-- ========================================
-- AJOUTER LA COLONNE payment_type À LA TABLE requests
-- ========================================

-- Vérifier si la colonne existe déjà
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'requests' 
        AND column_name = 'payment_type'
    ) THEN
        -- Ajouter la colonne payment_type
        ALTER TABLE public.requests 
        ADD COLUMN payment_type TEXT CHECK (payment_type IN ('one_time', 'installments', 'bank_financing'));
        
        RAISE NOTICE '✅ Colonne payment_type ajoutée avec succès';
    ELSE
        RAISE NOTICE 'ℹ️ La colonne payment_type existe déjà';
    END IF;
END $$;

-- Mettre à jour les enregistrements existants basés sur le champ 'type'
UPDATE public.requests 
SET payment_type = CASE 
    WHEN type = 'one_time' THEN 'one_time'
    WHEN type = 'installment_payment' THEN 'installments'
    WHEN type = 'bank_financing' THEN 'bank_financing'
    ELSE 'one_time' -- Valeur par défaut
END
WHERE payment_type IS NULL;

-- Vérifier le résultat
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'requests'
    AND column_name = 'payment_type';

-- Afficher quelques exemples
SELECT id, type, payment_type, status, offered_price, created_at
FROM public.requests
ORDER BY created_at DESC
LIMIT 5;
