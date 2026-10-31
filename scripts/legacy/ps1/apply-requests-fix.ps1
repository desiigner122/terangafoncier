#!/usr/bin/env pwsh
# ========================================
# Script pour appliquer les colonnes manquantes à la table requests
# ========================================

Write-Host "`n🔧 CORRECTION TABLE REQUESTS - AJOUT COLONNES" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "📋 Instructions:" -ForegroundColor Yellow
Write-Host "1. Ouvrez Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Sélectionnez votre projet: terangafoncier" -ForegroundColor White
Write-Host "3. Allez dans SQL Editor" -ForegroundColor White
Write-Host "4. Copiez et exécutez le script ci-dessous`n" -ForegroundColor White

Write-Host "📄 Script SQL à exécuter:" -ForegroundColor Green
Write-Host "─────────────────────────────────────────────────────`n" -ForegroundColor Gray

$sqlScript = @"
-- ========================================
-- COMPLÉTER LA STRUCTURE DE LA TABLE requests
-- ========================================

-- 1. Ajouter payment_type si manquant
DO `$`$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'payment_type'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN payment_type TEXT CHECK (payment_type IN ('one_time', 'installments', 'bank_financing'));
        RAISE NOTICE '✅ Colonne payment_type ajoutée';
    END IF;
END `$`$;

-- 2. Ajouter installment_plan si manquant
DO `$`$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'installment_plan'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN installment_plan JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE '✅ Colonne installment_plan ajoutée';
    END IF;
END `$`$;

-- 3. Ajouter bank_details si manquant
DO `$`$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'bank_details'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN bank_details JSONB DEFAULT '{}'::jsonb;
        RAISE NOTICE '✅ Colonne bank_details ajoutée';
    END IF;
END `$`$;

-- 4. Ajouter message si manquant
DO `$`$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'requests' AND column_name = 'message'
    ) THEN
        ALTER TABLE public.requests 
        ADD COLUMN message TEXT;
        RAISE NOTICE '✅ Colonne message ajoutée';
    END IF;
END `$`$;

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
"@

Write-Host $sqlScript -ForegroundColor Cyan

Write-Host "`n─────────────────────────────────────────────────────`n" -ForegroundColor Gray

# Copier dans le presse-papiers si possible
try {
    Set-Clipboard -Value $sqlScript
    Write-Host "✅ Script copié dans le presse-papiers!" -ForegroundColor Green
    Write-Host "   Utilisez Ctrl+V dans l'éditeur SQL de Supabase`n" -ForegroundColor White
} catch {
    Write-Host "⚠️  Impossible de copier automatiquement." -ForegroundColor Yellow
    Write-Host "   Copiez manuellement le script ci-dessus`n" -ForegroundColor White
}

Write-Host "📝 Après exécution du script:" -ForegroundColor Yellow
Write-Host "1. Vérifiez que toutes les colonnes sont créées" -ForegroundColor White
Write-Host "2. Rechargez votre application (Ctrl+R)" -ForegroundColor White
Write-Host "3. Testez à nouveau le formulaire de paiement échelonné`n" -ForegroundColor White

Write-Host "✨ Les erreurs 'payment_type' et autres colonnes manquantes seront résolues!" -ForegroundColor Green
