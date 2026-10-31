# Script pour résoudre l'erreur de contrainte NOT NULL
Write-Host "Resolution de l'erreur role NOT NULL..." -ForegroundColor Green

# Ouvrir le script de nettoyage
Write-Host "1. Script de nettoyage des comptes problematiques..." -ForegroundColor Cyan
Start-Process "cleanup-problematic-accounts.sql"

Start-Sleep -Seconds 1

# Ouvrir le script corrigé
Write-Host "2. Script de creation corrige..." -ForegroundColor Cyan
Start-Process "create-accounts-simple.sql"

Start-Sleep -Seconds 1

# Ouvrir Supabase
Write-Host "3. Ouverture Supabase..." -ForegroundColor Cyan
Start-Process "https://supabase.com/dashboard"

Write-Host ""
Write-Host "ORDRE D'EXECUTION OBLIGATOIRE:" -ForegroundColor Red
Write-Host "1. cleanup-problematic-accounts.sql (NETTOYER D'ABORD)" -ForegroundColor White
Write-Host "2. create-accounts-simple.sql (CREER ENSUITE)" -ForegroundColor White
Write-Host ""
Write-Host "Probleme detecte:" -ForegroundColor Yellow
Write-Host "  - Compte test.urgent@terangafoncier.com sans role" -ForegroundColor White
Write-Host "  - Violation contrainte NOT NULL sur profiles.role" -ForegroundColor White
Write-Host ""
Write-Host "Solution:" -ForegroundColor Green
Write-Host "  - Nettoyage des comptes problematiques" -ForegroundColor White
Write-Host "  - Attribution de roles par defaut" -ForegroundColor White
Write-Host "  - Verification avant insertion" -ForegroundColor White
Write-Host ""
Write-Host "Teste ensuite sur:" -ForegroundColor Cyan
Write-Host "  https://terangafoncier.vercel.app/" -ForegroundColor White
