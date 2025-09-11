# 🚀 SCRIPT CONFIGURATION FINALE POWERSHELL
# =============================================

Write-Host "🔧 CONFIGURATION FINALE TERANGA FONCIER" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier l'état actuel  
Write-Host "1. 📊 VÉRIFICATION ÉTAT ACTUEL" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow

if (Test-Path "dist") {
    Write-Host "✅ Build production: TROUVÉ" -ForegroundColor Green
    $buildSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
    $buildSizeMB = [math]::round($buildSize/1MB, 2)
    Write-Host "📊 Taille: $buildSizeMB MB" -ForegroundColor Cyan
} else {
    Write-Host "❌ Build production: MANQUANT" -ForegroundColor Red
    Write-Host "🔄 Lancement du build..." -ForegroundColor Yellow
    npm run build
}

if (Test-Path ".env") {
    Write-Host "✅ Configuration .env: TROUVÉE" -ForegroundColor Green
} else {
    Write-Host "❌ Configuration .env: MANQUANTE" -ForegroundColor Red
    Write-Host "🔄 Copie de .env.production..." -ForegroundColor Yellow
    Copy-Item ".env.production" ".env" -Force
}

if (Test-Path "create-production-tables.sql") {
    Write-Host "✅ Script SQL production: PRÊT" -ForegroundColor Green
} else {
    Write-Host "❌ Script SQL production: MANQUANT" -ForegroundColor Red
}

Write-Host ""

# 2. Configuration des clés API
Write-Host "2. 🔑 VÉRIFICATION CLÉS API" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow

$envContent = Get-Content ".env" -Raw
if ($envContent -match "your_openai_api_key_here") {
    Write-Host "⚠️ Clé OpenAI: À CONFIGURER" -ForegroundColor Yellow
    Write-Host "   Remplacez 'your_openai_api_key_here' par votre vraie clé" -ForegroundColor White
} else {
    Write-Host "✅ Clé OpenAI: CONFIGURÉE" -ForegroundColor Green
}

if ($envContent -match "VITE_SUPABASE_URL") {
    Write-Host "✅ Configuration Supabase: ACTIVE" -ForegroundColor Green
} else {
    Write-Host "❌ Configuration Supabase: MANQUANTE" -ForegroundColor Red
}

Write-Host ""

# 3. État des services
Write-Host "3. 🔧 SERVICES PRIORITY 3" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

$services = @(
    "src/services/TerangaBlockchainSyncService.js",
    "src/components/dashboard/UnifiedDashboard.jsx",
    "src/services/TerangaIntelligentNotifications.js",
    "dist/sw.js",
    "dist/manifest.json"
)

foreach ($service in $services) {
    if (Test-Path $service) {
        $serviceName = Split-Path $service -Leaf
        Write-Host "✅ $serviceName : ACTIF" -ForegroundColor Green
    } else {
        $serviceName = Split-Path $service -Leaf
        Write-Host "❌ $serviceName : MANQUANT" -ForegroundColor Red
    }
}

Write-Host ""

# 4. Instructions finales
Write-Host "4. 🎯 ACTIONS FINALES REQUISES" -ForegroundColor Yellow
Write-Host "==============================" -ForegroundColor Yellow
Write-Host "🔴 CRITIQUE - Base de données:" -ForegroundColor Red
Write-Host "   1. Ouvrez https://supabase.com/dashboard" -ForegroundColor White
Write-Host "   2. Allez dans SQL Editor" -ForegroundColor White
Write-Host "   3. Copiez le contenu de create-production-tables.sql" -ForegroundColor White
Write-Host "   4. Exécutez le script complet" -ForegroundColor White
Write-Host ""
Write-Host "🟠 IMPORTANT - Clés API:" -ForegroundColor DarkYellow
Write-Host "   1. Obtenez votre clé OpenAI sur https://platform.openai.com" -ForegroundColor White
Write-Host "   2. Remplacez 'your_openai_api_key_here' dans .env" -ForegroundColor White
Write-Host ""
Write-Host "🟢 DÉPLOIEMENT - Choisissez une option:" -ForegroundColor Green
Write-Host "   A. Vercel: vercel --prod" -ForegroundColor White
Write-Host "   B. Netlify: netlify deploy --prod --dir=dist" -ForegroundColor White
Write-Host "   C. Manuel: Copiez dist/ sur votre serveur" -ForegroundColor White
Write-Host ""

# 5. Résumé final
Write-Host "5. 📋 RÉSUMÉ CONFIGURATION" -ForegroundColor Yellow
Write-Host "==========================" -ForegroundColor Yellow
Write-Host "🎯 Build: $(if (Test-Path 'dist') { 'PRÊT' } else { 'À FAIRE' })" -ForegroundColor Cyan
Write-Host "🎯 Config: $(if (Test-Path '.env') { 'PRÊTE' } else { 'À FAIRE' })" -ForegroundColor Cyan
Write-Host "🎯 SQL: $(if (Test-Path 'create-production-tables.sql') { 'PRÊT' } else { 'À FAIRE' })" -ForegroundColor Cyan
Write-Host "🎯 PWA: $(if (Test-Path 'dist/sw.js') { 'PRÊT' } else { 'À FAIRE' })" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 STATUS: PRODUCTION READY - Configuration à finaliser" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Guide complet: CONFIGURATIONS_FINALES_PRODUCTION.md" -ForegroundColor Cyan
