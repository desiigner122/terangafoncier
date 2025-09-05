# Script pour créer la table user_avatars dans Supabase
# Ce script doit être exécuté dans le SQL Editor de Supabase

Write-Host "🚀 Déploiement de la table user_avatars..." -ForegroundColor Green

$sqlContent = Get-Content -Path "create-user-avatars-table.sql" -Raw

Write-Host "📋 Contenu SQL à exécuter dans Supabase:" -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow
Write-Host $sqlContent -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Yellow

Write-Host ""
Write-Host "✅ Instructions:" -ForegroundColor Green
Write-Host "1. Copiez le contenu SQL ci-dessus" -ForegroundColor White
Write-Host "2. Ouvrez https://ndenqikcogzrkrjnlvns.supabase.co/project/ndenqikcogzrkrjnlvns/sql" -ForegroundColor White
Write-Host "3. Collez le SQL dans l'éditeur" -ForegroundColor White
Write-Host "4. Cliquez sur 'Run'" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Une fois exécuté, l'upload d'avatar fonctionnera parfaitement!" -ForegroundColor Green
