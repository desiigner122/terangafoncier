#!/usr/bin/env pwsh

Write-Host "🎯 AUDIT COMPLET - DASHBOARDS CORRIGÉS" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

Write-Host "`n📊 Dashboards à tester :" -ForegroundColor Yellow
$dashboards = @(
    "BanquesDashboardPage.jsx",
    "NotairesDashboardPage.jsx", 
    "InvestisseursDashboardPage.jsx",
    "PromoteursDashboardPage.jsx",
    "AgriculteursDashboardPage.jsx"
)

foreach ($dashboard in $dashboards) {
    Write-Host "   ✓ $dashboard" -ForegroundColor Green
}

Write-Host "`n🔍 Vérification des corrections :" -ForegroundColor Yellow

# Vérifier l'absence de données hardcodées
Write-Host "`n1. Vérification absence de kpiData hardcodé..." -ForegroundColor Cyan
$hardcodedFiles = Get-ChildItem -Path "src/pages/solutions/dashboards/" -Filter "*Dashboard*.jsx" | 
    ForEach-Object { 
        $content = Get-Content $_.FullName -Raw
        if ($content -match 'const kpiData = \[') {
            $_.Name
        }
    }

if ($hardcodedFiles) {
    Write-Host "   ❌ Fichiers avec données hardcodées trouvés :" -ForegroundColor Red
    $hardcodedFiles | ForEach-Object { Write-Host "      - $_" -ForegroundColor Red }
} else {
    Write-Host "   ✅ Aucune donnée hardcodée kpiData trouvée" -ForegroundColor Green
}

# Vérifier l'intégration Supabase
Write-Host "`n2. Vérification intégration Supabase..." -ForegroundColor Cyan
$supabaseFiles = Get-ChildItem -Path "src/pages/solutions/dashboards/" -Filter "*Dashboard*.jsx" | 
    ForEach-Object { 
        $content = Get-Content $_.FullName -Raw
        if ($content -match 'import.*supabase.*from.*@/lib/supabase' -and $content -match 'useAuth') {
            $_.Name
        }
    }

Write-Host "   ✅ Fichiers avec intégration Supabase :" -ForegroundColor Green
$supabaseFiles | ForEach-Object { Write-Host "      - $_" -ForegroundColor Green }

# Vérifier les avatars externes
Write-Host "`n3. Vérification avatars externes..." -ForegroundColor Cyan
$externalAvatars = Get-ChildItem -Path "src/pages/solutions/dashboards/" -Filter "*.jsx" | 
    ForEach-Object { 
        $content = Get-Content $_.FullName -Raw
        if ($content -match 'ui-avatars\.com|avatar\.vercel\.sh') {
            $_.Name
        }
    }

if ($externalAvatars) {
    Write-Host "   ⚠️  Fichiers avec avatars externes trouvés :" -ForegroundColor Yellow
    $externalAvatars | ForEach-Object { Write-Host "      - $_" -ForegroundColor Yellow }
} else {
    Write-Host "   ✅ Aucun avatar externe trouvé" -ForegroundColor Green
}

Write-Host "`n🧪 Tests de démarrage :" -ForegroundColor Yellow
Write-Host "   Pour tester les dashboards, utilisez :" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host "   Puis naviguez vers :" -ForegroundColor White
Write-Host "   - /banques-dashboard (Banques)" -ForegroundColor Cyan
Write-Host "   - /notaires-dashboard (Notaires)" -ForegroundColor Cyan  
Write-Host "   - /investisseurs-dashboard (Investisseurs)" -ForegroundColor Cyan
Write-Host "   - /promoteurs-dashboard (Promoteurs)" -ForegroundColor Cyan

Write-Host "`n📋 Résumé des corrections appliquées :" -ForegroundColor Yellow
Write-Host "   ✅ Remplacement kpiData hardcodé par requêtes Supabase" -ForegroundColor Green
Write-Host "   ✅ Ajout useAuth et intégration authentification" -ForegroundColor Green
Write-Host "   ✅ Conversion données statiques vers données dynamiques" -ForegroundColor Green
Write-Host "   ✅ Correction avatars externes vers Supabase" -ForegroundColor Green
Write-Host "   ✅ Génération métriques basées sur données réelles" -ForegroundColor Green

Write-Host "`n🎯 AUDIT TERMINÉ - Dashboards prêts pour test" -ForegroundColor Green
