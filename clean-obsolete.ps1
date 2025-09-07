# Nettoyage des anciennes pages non-blockchain

Write-Host "Nettoyage pages obsoletes..." -ForegroundColor Cyan

# Pages obsoletes a supprimer
$obsoletePages = @(
    "src\pages\DashboardPage.jsx",
    "src\components\DashboardRedirect.jsx",
    "src\components\DashboardRedirectFixed.jsx",
    "src\components\layout\DashboardLayoutClean.jsx"
)

foreach ($page in $obsoletePages) {
    if (Test-Path $page) {
        Write-Host "Suppression: $page" -ForegroundColor Red
        Remove-Item $page -Force
    }
}

# Verifier quels dashboards modernes existent
$modernDashboards = @(
    "src\pages\AdminDashboard.jsx",
    "src\pages\AgentDashboard.jsx",
    "src\pages\BanqueDashboard.jsx",
    "src\pages\MairieDashboard.jsx",
    "src\pages\GeometreDashboard.jsx",
    "src\pages\PromoteurDashboard.jsx",
    "src\pages\InvestisseurDashboard.jsx",
    "src\pages\DiasporaDashboard.jsx",
    "src\pages\ParticulierDashboard.jsx"
)

Write-Host ""
Write-Host "Dashboards modernes:" -ForegroundColor Green
foreach ($dashboard in $modernDashboards) {
    if (Test-Path $dashboard) {
        Write-Host "Existe: $dashboard" -ForegroundColor Green
    } else {
        Write-Host "Manque: $dashboard" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Nettoyage termine!" -ForegroundColor Green
