# Script pour résoudre l'erreur de contrainte de rôle
Write-Host "Resolution de l'erreur profiles_role_check..." -ForegroundColor Green

# Ouvrir le script de correction des contraintes
Write-Host "1. Script de correction des contraintes de role..." -ForegroundColor Cyan
Start-Process "fix-role-constraint.sql"

Start-Sleep -Seconds 1

# Ouvrir le script principal corrigé
Write-Host "2. Script de creation corrige (avec nettoyage)..." -ForegroundColor Cyan
Start-Process "create-accounts-simple.sql"

Start-Sleep -Seconds 1

# Ouvrir Supabase
Write-Host "3. Ouverture Supabase..." -ForegroundColor Cyan
Start-Process "https://supabase.com/dashboard"

Write-Host ""
Write-Host "PROBLEME DETECTE:" -ForegroundColor Red
Write-Host "  - Compte test.dashboard@terangafoncier.com avec role 'user'" -ForegroundColor White
Write-Host "  - Role 'user' non autorise par la contrainte" -ForegroundColor White
Write-Host "  - Contrainte profiles_role_check violee" -ForegroundColor White
Write-Host ""
Write-Host "SOLUTION APPLIQUEE:" -ForegroundColor Green
Write-Host "  - Suppression de tous les comptes test.* problematiques" -ForegroundColor White
Write-Host "  - Validation stricte des roles autorises" -ForegroundColor White
Write-Host "  - Nettoyage automatique avant creation" -ForegroundColor White
Write-Host ""
Write-Host "ROLES AUTORISES:" -ForegroundColor Cyan
Write-Host "  admin, particular, vendeur, investisseur," -ForegroundColor White
Write-Host "  municipalite, notaire, geometre, banque, promoteur" -ForegroundColor White
Write-Host ""
Write-Host "ORDRE D'EXECUTION:" -ForegroundColor Yellow
Write-Host "1. fix-role-constraint.sql (nettoyer les contraintes)" -ForegroundColor White
Write-Host "2. create-accounts-simple.sql (creer avec validation)" -ForegroundColor White
Write-Host ""
Write-Host "Teste ensuite sur:" -ForegroundColor Green
Write-Host "  https://terangafoncier.vercel.app/" -ForegroundColor White
