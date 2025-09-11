# Script pour ouvrir les solutions aux comptes existants
Write-Host "Resolution du probleme de comptes existants..." -ForegroundColor Green

# Ouvrir la solution
Write-Host "1. Ouverture de la solution..." -ForegroundColor Cyan
Start-Process "SOLUTION_COMPTES_EXISTANTS.md"

Start-Sleep -Seconds 1

# Ouvrir le script de verification
Write-Host "2. Ouverture du script de verification..." -ForegroundColor Cyan
Start-Process "check-existing-accounts.sql"

Start-Sleep -Seconds 1

# Ouvrir le script de creation des manquants
Write-Host "3. Ouverture du script de creation..." -ForegroundColor Cyan
Start-Process "create-missing-demo-accounts.sql"

Start-Sleep -Seconds 1

# Ouvrir Supabase
Write-Host "4. Ouverture de Supabase..." -ForegroundColor Cyan
Start-Process "https://supabase.com/dashboard"

Write-Host ""
Write-Host "Solutions ouvertes:" -ForegroundColor Yellow
Write-Host "  - Guide de resolution" -ForegroundColor White
Write-Host "  - Script de verification" -ForegroundColor White
Write-Host "  - Script de creation intelligente" -ForegroundColor White
Write-Host "  - Supabase Dashboard" -ForegroundColor White
Write-Host ""
Write-Host "ORDRE D'EXECUTION:" -ForegroundColor Green
Write-Host "1. check-existing-accounts.sql (voir ce qui existe)" -ForegroundColor White
Write-Host "2. create-missing-demo-accounts.sql (creer les manquants)" -ForegroundColor White
Write-Host ""
Write-Host "Teste immediatement sur:" -ForegroundColor Cyan
Write-Host "  https://terangafoncier.vercel.app/" -ForegroundColor White
Write-Host "  admin@terangafoncier.com / demo123" -ForegroundColor White
