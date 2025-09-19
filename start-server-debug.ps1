Write-Host "🚀 Démarrage du serveur Teranga Foncier..." -ForegroundColor Green

cd "C:\Users\Smart Business\Desktop\terangafoncier"

Write-Host "📂 Répertoire de travail: $(Get-Location)" -ForegroundColor Cyan

# Vérifier que npm est disponible
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "✅ npm disponible" -ForegroundColor Green
} else {
    Write-Host "❌ npm non trouvé" -ForegroundColor Red
    exit 1
}

# Vérifier que package.json existe
if (Test-Path "package.json") {
    Write-Host "✅ package.json trouvé" -ForegroundColor Green
} else {
    Write-Host "❌ package.json manquant" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Démarrage du serveur de développement..." -ForegroundColor Yellow

try {
    # Démarrer le serveur avec output détaillé
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow -Wait
} catch {
    Write-Host "❌ Erreur lors du démarrage: $($_.Exception.Message)" -ForegroundColor Red
    
    # Essayer de voir les erreurs détaillées
    Write-Host "🔍 Tentative de diagnostic des erreurs..." -ForegroundColor Yellow
    npm run dev 2>&1 | Tee-Object -Variable output
    Write-Host "Output: $output" -ForegroundColor Magenta
}