# ========================================
# SCRIPT DE FIX AUTOMATIQUE - TERANGA FONCIER
# ========================================
# Ce script applique les corrections SQL nécessaires

Write-Host "`n🔧 APPLICATION DES CORRECTIONS SUPABASE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Chemins des scripts
$scriptDir = $PSScriptRoot
$rlsPolicyScript = Join-Path $scriptDir "fix-cors-rls-policies.sql"
$parcelsStructureScript = Join-Path $scriptDir "fix-parcels-structure-complete.sql"

# Vérifier que les fichiers existent
if (-not (Test-Path $rlsPolicyScript)) {
    Write-Host "❌ Fichier manquant: fix-cors-rls-policies.sql" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $parcelsStructureScript)) {
    Write-Host "❌ Fichier manquant: fix-parcels-structure-complete.sql" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Instructions d'exécution:" -ForegroundColor Yellow
Write-Host "--------------------------------------------`n" -ForegroundColor Yellow

Write-Host "1️⃣  Ouvrez votre Supabase Dashboard:" -ForegroundColor White
Write-Host "    https://app.supabase.com`n" -ForegroundColor Cyan

Write-Host "2️⃣  Sélectionnez votre projet 'terangafoncier'`n" -ForegroundColor White

Write-Host "3️⃣  Allez dans 'SQL Editor' (barre latérale)`n" -ForegroundColor White

Write-Host "4️⃣  PREMIÈRE REQUÊTE - Copiez et exécutez:" -ForegroundColor White
Write-Host "    Fichier: fix-cors-rls-policies.sql" -ForegroundColor Cyan
Write-Host "    Cette requête configure les politiques RLS`n" -ForegroundColor Gray

# Copier le premier script dans le presse-papier
try {
    Get-Content $rlsPolicyScript -Raw | Set-Clipboard
    Write-Host "    ✅ Script 1 copié dans le presse-papier!" -ForegroundColor Green
    Write-Host "    Collez-le (Ctrl+V) dans SQL Editor et cliquez 'Run'`n" -ForegroundColor Yellow
} catch {
    Write-Host "    ⚠️  Impossible de copier automatiquement" -ForegroundColor Yellow
    Write-Host "    Ouvrez manuellement: $rlsPolicyScript`n" -ForegroundColor Gray
}

Write-Host "    Appuyez sur ENTRÉE quand c'est fait..." -ForegroundColor Yellow
$null = Read-Host

Write-Host "`n5️⃣  DEUXIÈME REQUÊTE - Copiez et exécutez:" -ForegroundColor White
Write-Host "    Fichier: fix-parcels-structure-complete.sql" -ForegroundColor Cyan
Write-Host "    Cette requête corrige la structure et crée la parcelle`n" -ForegroundColor Gray

# Copier le deuxième script dans le presse-papier
try {
    Get-Content $parcelsStructureScript -Raw | Set-Clipboard
    Write-Host "    ✅ Script 2 copié dans le presse-papier!" -ForegroundColor Green
    Write-Host "    Collez-le (Ctrl+V) dans SQL Editor et cliquez 'Run'`n" -ForegroundColor Yellow
} catch {
    Write-Host "    ⚠️  Impossible de copier automatiquement" -ForegroundColor Yellow
    Write-Host "    Ouvrez manuellement: $parcelsStructureScript`n" -ForegroundColor Gray
}

Write-Host "    Appuyez sur ENTRÉE quand c'est fait..." -ForegroundColor Yellow
$null = Read-Host

Write-Host "`n✅ SCRIPTS EXÉCUTÉS!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "📝 VÉRIFICATIONS:" -ForegroundColor Cyan
Write-Host "1. Les politiques RLS devraient être configurées" -ForegroundColor White
Write-Host "2. La parcelle de test devrait être créée/mise à jour" -ForegroundColor White
Write-Host "3. Les erreurs CORS devraient disparaître`n" -ForegroundColor White

Write-Host "🔄 PROCHAINE ÉTAPE:" -ForegroundColor Yellow
Write-Host "1. Retournez à votre navigateur (localhost:5173)" -ForegroundColor White
Write-Host "2. Rafraîchissez la page (F5)" -ForegroundColor White
Write-Host "3. Essayez à nouveau le bouton 'Finaliser la demande'`n" -ForegroundColor White

Write-Host "💡 SI LE PROBLÈME PERSISTE:" -ForegroundColor Magenta
Write-Host "1. Ouvrez la console du navigateur (F12)" -ForegroundColor White
Write-Host "2. Vérifiez les messages d'erreur" -ForegroundColor White
Write-Host "3. Partagez les logs complets`n" -ForegroundColor White

Write-Host "Appuyez sur ENTRÉE pour fermer..." -ForegroundColor Gray
$null = Read-Host
