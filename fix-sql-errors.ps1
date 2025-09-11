# Script pour la version corrigée - sans erreurs de structure
Write-Host "Solutions corrigées pour les erreurs SQL..." -ForegroundColor Green

# Ouvrir le script de vérification de structure
Write-Host "1. Verification de la structure des tables..." -ForegroundColor Cyan
Start-Process "check-table-structure.sql"

Start-Sleep -Seconds 1

# Ouvrir le script simple
Write-Host "2. Script simple sans erreurs..." -ForegroundColor Cyan
Start-Process "create-accounts-simple.sql"

Start-Sleep -Seconds 1

# Ouvrir Supabase
Write-Host "3. Ouverture Supabase..." -ForegroundColor Cyan
Start-Process "https://supabase.com/dashboard"

Write-Host ""
Write-Host "Scripts corriges ouverts:" -ForegroundColor Yellow
Write-Host "  - check-table-structure.sql (verification)" -ForegroundColor White
Write-Host "  - create-accounts-simple.sql (creation sans erreur)" -ForegroundColor White
Write-Host ""
Write-Host "ORDRE RECOMMANDE:" -ForegroundColor Green
Write-Host "1. Execute check-table-structure.sql pour voir la structure" -ForegroundColor White
Write-Host "2. Execute create-accounts-simple.sql pour creer les comptes" -ForegroundColor White
Write-Host ""
Write-Host "Les erreurs suivantes sont corrigees:" -ForegroundColor Cyan
Write-Host "  - Column company_name manquante" -ForegroundColor White
Write-Host "  - Conversion JSONB corrigee" -ForegroundColor White
Write-Host "  - Script simplifie sans boucles complexes" -ForegroundColor White
Write-Host ""
Write-Host "Teste ensuite sur:" -ForegroundColor Green
Write-Host "  https://terangafoncier.vercel.app/" -ForegroundColor White
