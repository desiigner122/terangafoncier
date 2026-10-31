# Script de diagnostic d'accès au dashboard

Write-Host "🔍 Diagnostic d'accès au dashboard particulier" -ForegroundColor Cyan

# Vérifier si l'application est accessible
Write-Host "`n1. Test d'accès général à l'application:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5174/" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Application accessible - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Application non accessible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Vérifier l'accès au dashboard
Write-Host "`n2. Test d'accès au dashboard:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5174/dashboard/" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Dashboard accessible - Status: $($response.StatusCode)" -ForegroundColor Green
    
    # Vérifier si le contenu contient des erreurs JavaScript
    if ($response.Content -like "*visual-editor-config*") {
        Write-Host "⚠️  Référence à visual-editor-config trouvée dans le contenu" -ForegroundColor Yellow
    }
    if ($response.Content -like "*error*" -or $response.Content -like "*404*") {
        Write-Host "⚠️  Erreurs potentielles détectées dans le contenu" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Dashboard non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Vérifier l'accès direct au dashboard particulier
Write-Host "`n3. Test d'accès direct au dashboard particulier:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5174/particulier" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Dashboard particulier accessible - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Dashboard particulier non accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Vérifier les fichiers critiques
Write-Host "`n4. Vérification des fichiers critiques:" -ForegroundColor Yellow

$criticalFiles = @(
    "src\components\DashboardRedirect.jsx",
    "src\pages\ParticularDashboard.jsx",
    "src\App.jsx"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file existe" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
    }
}

# Rechercher des erreurs dans les logs
Write-Host "`n5. Recherche d'erreurs courantes:" -ForegroundColor Yellow

# Vérifier les imports manquants
$importErrors = Select-String -Path "src\**\*.jsx" -Pattern "import.*visual-editor" -ErrorAction SilentlyContinue
if ($importErrors) {
    Write-Host "⚠️  Imports visual-editor trouvés:" -ForegroundColor Yellow
    $importErrors | ForEach-Object { Write-Host "   $($_.Filename):$($_.LineNumber) - $($_.Line)" }
}

Write-Host "`n🏁 Diagnostic terminé" -ForegroundColor Cyan