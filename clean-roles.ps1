# Script pour nettoyer et corriger les rôles - Teranga Foncier Blockchain
# Rôles corrects: admin notaire, agent foncier, mairie, géomètre, banque, 
# vendeur particulier, vendeur promoteur, investisseurs, 
# particuliers (Sénégalais au Sénégal), diaspora

Write-Host "🧹 Nettoyage et correction des rôles utilisateurs..." -ForegroundColor Cyan

# 1. Supprimer les anciens dashboards obsolètes
$oldDashboards = @(
    "src\pages\AdminDashboard.jsx",
    "src\pages\Dashboard.jsx", 
    "src\pages\DashboardPage.jsx",
    "src\pages\UserDashboard.jsx",
    "src\pages\OldDashboard.jsx",
    "src\pages\LegacyDashboard.jsx"
)

foreach ($dashboard in $oldDashboards) {
    if (Test-Path $dashboard) {
        Write-Host "🗑️ Suppression: $dashboard" -ForegroundColor Red
        Remove-Item $dashboard -Force
    }
}

# 2. Supprimer les anciennes pages non-blockchain
$oldPages = @(
    "src\pages\OldHomePage.jsx",
    "src\pages\LegacyPage.jsx",
    "src\pages\ClassicPage.jsx",
    "src\pages\NonBlockchainPage.jsx"
)

foreach ($page in $oldPages) {
    if (Test-Path $page) {
        Write-Host "🗑️ Suppression page obsolète: $page" -ForegroundColor Red
        Remove-Item $page -Force
    }
}

# 3. Lister les dashboards modernes à conserver
$modernDashboards = @(
    "src\pages\AdminDashboard.jsx",
    "src\pages\AgentDashboard.jsx", 
    "src\pages\BanqueDashboard.jsx",
    "src\pages\MairieDashboard.jsx",
    "src\pages\ParticulierDashboard.jsx",
    "src\pages\PromoteurDashboard.jsx",
    "src\pages\InvestisseurDashboard.jsx",
    "src\pages\DiasporaDashboard.jsx",
    "src\pages\GeometreDashboard.jsx",
    "src\pages\NotaireDashboard.jsx"
)

Write-Host ""
Write-Host "📋 Dashboards modernes requis:" -ForegroundColor Green
foreach ($dashboard in $modernDashboards) {
    if (Test-Path $dashboard) {
        Write-Host "✅ $dashboard" -ForegroundColor Green
    } else {
        Write-Host "❌ $dashboard (manquant)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎯 Rôles utilisateurs corrects:" -ForegroundColor Cyan
Write-Host "1. admin (admin notaire)" -ForegroundColor White
Write-Host "2. agent_foncier" -ForegroundColor White  
Write-Host "3. mairie" -ForegroundColor White
Write-Host "4. geometre" -ForegroundColor White
Write-Host "5. banque" -ForegroundColor White
Write-Host "6. vendeur_particulier" -ForegroundColor White
Write-Host "7. vendeur_promoteur (ou promoteur)" -ForegroundColor White
Write-Host "8. investisseur" -ForegroundColor White
Write-Host "9. particulier (Sénégalais au Sénégal)" -ForegroundColor White
Write-Host "10. diaspora (Sénégalais à l'étranger)" -ForegroundColor White

Write-Host ""
Write-Host "✅ Nettoyage terminé!" -ForegroundColor Green
