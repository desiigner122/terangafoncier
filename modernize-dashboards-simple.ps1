Write-Host "Modernisation des headers de dashboards..." -ForegroundColor Green

$dashboards = @{
    "ModernPromoteurDashboard.jsx" = "Promoteur"
    "ModernNotaireDashboard.jsx" = "Notaire" 
    "ModernBanqueDashboard.jsx" = "Banque"
    "ModernGeometreDashboard.jsx" = "Geometre"
    "ModernInvestisseurDashboard.jsx" = "Investisseur"
    "ModernMairieDashboard.jsx" = "Municipalite"
    "ModernAgentFoncierDashboard.jsx" = "Agent Foncier"
}

$basePath = "src/pages/dashboards"

foreach ($file in $dashboards.Keys) {
    $userRole = $dashboards[$file]
    $filePath = Join-Path $basePath $file
    
    if (Test-Path $filePath) {
        Write-Host "Mise a jour de $file (role: $userRole)..." -ForegroundColor Yellow
        
        Copy-Item $filePath "$filePath.backup" -Force
        
        $content = Get-Content $filePath -Raw
        
        if (-not ($content -match "DashboardHeaderWrapper")) {
            $importLine = 'import DashboardHeaderWrapper from "@/components/common/DashboardHeaderWrapper";'
            $content = $content -replace "(import.*from.*TempSupabaseAuthContext.*)", "`$1`n$importLine"
        }
        
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        
        Write-Host "OK: $file modernise avec succes!" -ForegroundColor Green
    } else {
        Write-Host "ERREUR: Fichier $file non trouve." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Modernisation terminee!" -ForegroundColor Green