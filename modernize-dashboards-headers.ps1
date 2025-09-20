# Script PowerShell pour moderniser tous les dashboards avec le nouveau header unifié

Write-Host "🚀 Modernisation des headers de dashboards..." -ForegroundColor Green

# Définition des rôles et leurs configurations
$dashboards = @{
    "ModernPromoteurDashboard.jsx" = "Promoteur"
    "ModernNotaireDashboard.jsx" = "Notaire" 
    "ModernBanqueDashboard.jsx" = "Banque"
    "ModernGeometreDashboard.jsx" = "Géomètre"
    "ModernInvestisseurDashboard.jsx" = "Investisseur"
    "ModernMairieDashboard.jsx" = "Municipalité"
    "ModernAgentFoncierDashboard.jsx" = "Agent Foncier"
}

$basePath = "src/pages/dashboards"

foreach ($file in $dashboards.Keys) {
    $userRole = $dashboards[$file]
    $filePath = Join-Path $basePath $file
    
    if (Test-Path $filePath) {
        Write-Host "📝 Mise à jour de $file (rôle: $userRole)..." -ForegroundColor Yellow
        
        # Sauvegarder l'original
        Copy-Item $filePath "$filePath.backup" -Force
        
        $content = Get-Content $filePath -Raw
        
        # Ajouter l'import du header si pas déjà présent
        if (-not ($content -match "DashboardHeaderWrapper")) {
            $content = $content -replace "(import.*from.*TempSupabaseAuthContext.*)", '$1`nimport DashboardHeaderWrapper from `"@/components/common/DashboardHeaderWrapper`";'
        }
        
        # Sauvegarder le fichier modifié
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        
        Write-Host "✅ $file modernisé avec succès!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Fichier $file non trouvé, ignoré." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 Modernisation terminée! Headers unifiés ajoutés." -ForegroundColor Green
Write-Host "💡 Actions suivantes recommandées:" -ForegroundColor Cyan
Write-Host "   - Tester chaque dashboard pour vérifier l'intégration" -ForegroundColor White
Write-Host "   - Personnaliser les actions rapides selon les besoins de chaque rôle" -ForegroundColor White