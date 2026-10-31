# Script pour nettoyer et corriger les roles - Teranga Foncier Blockchain

Write-Host "Nettoyage et correction des roles utilisateurs..." -ForegroundColor Cyan

# Supprimer les anciens dashboards obsoletes
$oldDashboards = @(
    "src\pages\OldDashboard.jsx",
    "src\pages\LegacyDashboard.jsx",
    "src\pages\ClassicDashboard.jsx"
)

foreach ($dashboard in $oldDashboards) {
    if (Test-Path $dashboard) {
        Write-Host "Suppression: $dashboard" -ForegroundColor Red
        Remove-Item $dashboard -Force
    }
}

Write-Host ""
Write-Host "Roles utilisateurs corrects:" -ForegroundColor Cyan
Write-Host "1. admin (admin notaire)" -ForegroundColor White
Write-Host "2. agent_foncier" -ForegroundColor White  
Write-Host "3. mairie" -ForegroundColor White
Write-Host "4. geometre" -ForegroundColor White
Write-Host "5. banque" -ForegroundColor White
Write-Host "6. vendeur_particulier" -ForegroundColor White
Write-Host "7. promoteur" -ForegroundColor White
Write-Host "8. investisseur" -ForegroundColor White
Write-Host "9. particulier (Senegalais au Senegal)" -ForegroundColor White
Write-Host "10. diaspora (Senegalais a l'etranger)" -ForegroundColor White

Write-Host ""
Write-Host "Nettoyage termine!" -ForegroundColor Green
