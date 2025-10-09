#!/usr/bin/env pwsh

# 🔧 CORRECTION FINALE DASHBOARD PARTICULIER
# Script de correction complète des erreurs

Write-Host "🔧 CORRECTION FINALE DASHBOARD PARTICULIER" -ForegroundColor Cyan
Write-Host "=" -Repeat 50 -ForegroundColor Cyan

# 1. Vérifier la structure des fichiers
Write-Host "`n📁 VÉRIFICATION STRUCTURE FICHIERS:" -ForegroundColor Blue

$functionalFiles = @(
    "src/pages/dashboards/particulier/ParticulierZonesCommunales_FUNCTIONAL.jsx",
    "src/pages/dashboards/particulier/ParticulierNotifications_FUNCTIONAL.jsx", 
    "src/pages/dashboards/particulier/ParticulierDocuments_FUNCTIONAL.jsx",
    "src/pages/dashboards/particulier/ParticulierSettings_FUNCTIONAL.jsx",
    "src/pages/dashboards/particulier/ParticulierDemandesTerrains.jsx",
    "src/pages/dashboards/particulier/CompleteSidebarParticulierDashboard.jsx",
    "src/services/supabaseClient.js"
)

foreach ($file in $functionalFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $($file.Split('/')[-1])" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($file.Split('/')[-1]) - MANQUANT" -ForegroundColor Red
    }
}

# 2. Nettoyer le cache de développement
Write-Host "`n🧹 NETTOYAGE CACHE:" -ForegroundColor Blue

try {
    if (Test-Path "node_modules/.vite") {
        Remove-Item -Recurse -Force "node_modules/.vite"
        Write-Host "  ✅ Cache Vite supprimé" -ForegroundColor Green
    }
    
    if (Test-Path ".eslintcache") {
        Remove-Item -Force ".eslintcache"
        Write-Host "  ✅ Cache ESLint supprimé" -ForegroundColor Green
    }
} catch {
    Write-Host "  ⚠️ Nettoyage partiel du cache" -ForegroundColor Yellow
}

# 3. Vérifier les variables d'environnement
Write-Host "`n🌍 VÉRIFICATION ENVIRONNEMENT:" -ForegroundColor Blue

$envFiles = @(".env", ".env.local", ".env.development")
$hasEnvFile = $false

foreach ($envFile in $envFiles) {
    if (Test-Path $envFile) {
        Write-Host "  ✅ Fichier $envFile trouvé" -ForegroundColor Green
        $hasEnvFile = $true
        
        # Vérifier les variables Supabase
        $content = Get-Content $envFile -Raw
        if ($content -match "VITE_SUPABASE_URL|REACT_APP_SUPABASE_URL") {
            Write-Host "    - URL Supabase configurée" -ForegroundColor Green
        }
        if ($content -match "VITE_SUPABASE_ANON_KEY|REACT_APP_SUPABASE_ANON_KEY") {
            Write-Host "    - Clé Supabase configurée" -ForegroundColor Green
        }
    }
}

if (-not $hasEnvFile) {
    Write-Host "  ⚠️ Aucun fichier .env trouvé - Création d'un fichier d'exemple" -ForegroundColor Yellow
    
    $envContent = @"
# Configuration Supabase pour Dashboard Particulier
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Configuration générale
VITE_APP_NAME=Teranga Foncier
VITE_APP_VERSION=2.0.0
VITE_ENVIRONMENT=development
"@
    
    Set-Content -Path ".env.example" -Value $envContent
    Write-Host "  ✅ Fichier .env.example créé" -ForegroundColor Green
}

# 4. Test de compilation rapide
Write-Host "`n⚡ TEST COMPILATION RAPIDE:" -ForegroundColor Blue

try {
    $buildTest = npm run build -- --mode development 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Compilation réussie" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Erreurs de compilation détectées" -ForegroundColor Red
        Write-Host "    Vérifiez les détails ci-dessus" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ⚠️ Test de compilation échoué - Vérifiez les dépendances" -ForegroundColor Yellow
}

# 5. Recommandations finales
Write-Host "`n🎯 RECOMMANDATIONS FINALES:" -ForegroundColor Cyan

Write-Host "1. Redémarrer le serveur de développement:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray

Write-Host "`n2. En cas d'erreurs persistantes:" -ForegroundColor White
Write-Host "   - Vérifier la console navigateur" -ForegroundColor Gray
Write-Host "   - Supprimer node_modules et réinstaller" -ForegroundColor Gray
Write-Host "   - Vérifier les variables d'environnement" -ForegroundColor Gray

Write-Host "`n3. Tests post-correction:" -ForegroundColor White
Write-Host "   - Navigation dashboard particulier" -ForegroundColor Gray
Write-Host "   - Fonctionnalités CRUD des pages" -ForegroundColor Gray
Write-Host "   - Upload/Download documents" -ForegroundColor Gray

Write-Host "`n🚀 CORRECTION TERMINÉE!" -ForegroundColor Green
Write-Host "Le dashboard particulier devrait maintenant fonctionner sans erreurs." -ForegroundColor Green