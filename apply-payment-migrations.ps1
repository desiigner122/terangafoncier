# Script PowerShell pour appliquer les migrations de paiement
# Usage: .\apply-payment-migrations.ps1

Write-Host "🔧 APPLICATION DES MIGRATIONS PAIEMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que les fichiers de migration existent
$migration1 = ".\migrations\create_notary_payment_system.sql"
$migration2 = ".\migrations\create_payment_transactions_table.sql"

if (-not (Test-Path $migration1)) {
    Write-Host "❌ Erreur: $migration1 introuvable" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $migration2)) {
    Write-Host "❌ Erreur: $migration2 introuvable" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichiers de migration trouvés" -ForegroundColor Green
Write-Host ""

# Instructions pour l'utilisateur
Write-Host "📋 INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Ouvrir Supabase Studio: https://app.supabase.com" -ForegroundColor White
Write-Host "2. Sélectionner votre projet 'terangafoncier'" -ForegroundColor White
Write-Host "3. Aller dans 'SQL Editor' > '+ New Query'" -ForegroundColor White
Write-Host ""

# Migration 1
Write-Host "📝 MIGRATION 1: Système Notaire" -ForegroundColor Magenta
Write-Host "─────────────────────────────────" -ForegroundColor Magenta
Write-Host ""
Write-Host "Fichier: $migration1" -ForegroundColor Gray
Write-Host "Contenu:" -ForegroundColor Gray
Write-Host "  - Table notary_payment_requests (14 colonnes)" -ForegroundColor White
Write-Host "  - 5 indexes" -ForegroundColor White
Write-Host "  - 4 RLS policies" -ForegroundColor White
Write-Host "  - 1 trigger" -ForegroundColor White
Write-Host "  - 1 vue (notary_payments_summary)" -ForegroundColor White
Write-Host "  - 1 fonction (create_notary_payment_request)" -ForegroundColor White
Write-Host ""

# Copier Migration 1 dans le presse-papier
try {
    Get-Content $migration1 | Set-Clipboard
    Write-Host "✅ Migration 1 copiée dans le presse-papier!" -ForegroundColor Green
    Write-Host "   → Coller dans l'éditeur SQL Supabase (Ctrl+V)" -ForegroundColor Yellow
    Write-Host "   → Cliquer sur 'Run' (ou Ctrl+Enter)" -ForegroundColor Yellow
} catch {
    Write-Host "⚠️  Impossible de copier dans le presse-papier" -ForegroundColor Yellow
    Write-Host "   → Ouvrir manuellement: $migration1" -ForegroundColor White
}

Write-Host ""
$response = Read-Host "Appuyez sur [Entrée] après avoir exécuté Migration 1"

# Migration 2
Write-Host ""
Write-Host "📝 MIGRATION 2: Transactions Paiement" -ForegroundColor Magenta
Write-Host "─────────────────────────────────────" -ForegroundColor Magenta
Write-Host ""
Write-Host "Fichier: $migration2" -ForegroundColor Gray
Write-Host "Contenu:" -ForegroundColor Gray
Write-Host "  - Table payment_transactions (15 colonnes)" -ForegroundColor White
Write-Host "  - 6 indexes" -ForegroundColor White
Write-Host "  - 4 RLS policies" -ForegroundColor White
Write-Host "  - 1 trigger" -ForegroundColor White
Write-Host "  - 1 vue (payment_statistics)" -ForegroundColor White
Write-Host "  - 2 fonctions (mark_as_paid, mark_as_failed)" -ForegroundColor White
Write-Host ""

# Copier Migration 2 dans le presse-papier
try {
    Get-Content $migration2 | Set-Clipboard
    Write-Host "✅ Migration 2 copiée dans le presse-papier!" -ForegroundColor Green
    Write-Host "   → Coller dans l'éditeur SQL Supabase (Ctrl+V)" -ForegroundColor Yellow
    Write-Host "   → Cliquer sur 'Run' (ou Ctrl+Enter)" -ForegroundColor Yellow
} catch {
    Write-Host "⚠️  Impossible de copier dans le presse-papier" -ForegroundColor Yellow
    Write-Host "   → Ouvrir manuellement: $migration2" -ForegroundColor White
}

Write-Host ""
$response = Read-Host "Appuyez sur [Entrée] après avoir exécuté Migration 2"

# Vérifications
Write-Host ""
Write-Host "🔍 VÉRIFICATIONS RECOMMANDÉES" -ForegroundColor Cyan
Write-Host "─────────────────────────────" -ForegroundColor Cyan
Write-Host ""

$verificationSQL = @"
-- Vérifier les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('notary_payment_requests', 'payment_transactions')
ORDER BY table_name;

-- Vérifier la colonne payer_id
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'notary_payment_requests'
  AND column_name = 'payer_id';

-- Vérifier les RLS policies
SELECT tablename, policyname
FROM pg_policies
WHERE tablename IN ('notary_payment_requests', 'payment_transactions')
ORDER BY tablename, policyname;

-- Vérifier les fonctions
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE '%payment%'
ORDER BY routine_name;
"@

try {
    $verificationSQL | Set-Clipboard
    Write-Host "✅ Requêtes de vérification copiées!" -ForegroundColor Green
    Write-Host "   → Coller dans l'éditeur SQL pour vérifier" -ForegroundColor Yellow
} catch {
    Write-Host "⚠️  Impossible de copier les vérifications" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Résultats Attendus:" -ForegroundColor White
Write-Host "  ✓ 2 tables (notary_payment_requests, payment_transactions)" -ForegroundColor Green
Write-Host "  ✓ colonne payer_id existe (type: uuid)" -ForegroundColor Green
Write-Host "  ✓ 8 policies RLS (4 par table)" -ForegroundColor Green
Write-Host "  ✓ 3 fonctions (create_request, mark_paid, mark_failed)" -ForegroundColor Green

Write-Host ""
$response = Read-Host "Appuyez sur [Entrée] après vérification"

# Résumé final
Write-Host ""
Write-Host "✅ MIGRATIONS APPLIQUÉES AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "═══════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Tester en frontend:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Se connecter comme notaire" -ForegroundColor White
Write-Host ""
Write-Host "3. Créer une demande de paiement" -ForegroundColor White
Write-Host "   → Ouvrir dossier en statut 'deposit_payment'" -ForegroundColor Gray
Write-Host "   → Cliquer 'Demander versement des arrhes'" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Se connecter comme buyer" -ForegroundColor White
Write-Host "   → Vérifier alerte rouge visible" -ForegroundColor Gray
Write-Host "   → Tester paiement Wave" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation complète:" -ForegroundColor Cyan
Write-Host "  → APPLY_PAYMENT_MIGRATIONS.md" -ForegroundColor White
Write-Host "  → DOCUMENTATION_SYSTEME_PAIEMENT.md" -ForegroundColor White
Write-Host "  → RECAP_COMPLET_SYSTEME_PAIEMENT.md" -ForegroundColor White
Write-Host ""
