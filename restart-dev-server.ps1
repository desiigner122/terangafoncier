# SCRIPT DE REDÉMARRAGE COMPLET DU SERVEUR DE DÉVELOPPEMENT
# Résout les problèmes de HMR et cache corrompu

Write-Host "🔄 REDÉMARRAGE COMPLET SERVEUR DÉVELOPPEMENT..." -ForegroundColor Yellow

# 1. Tuer tous les processus Node.js
Write-Host "⚡ Arrêt de tous les processus Node.js..." -ForegroundColor Cyan
try {
    taskkill /f /im node.exe 2>$null
    Write-Host "✅ Processus Node.js arrêtés" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Aucun processus Node.js en cours" -ForegroundColor Gray
}

# 2. Nettoyer le cache Vite
Write-Host "🧹 Nettoyage du cache Vite..." -ForegroundColor Cyan
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✅ Cache Vite supprimé" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Pas de cache Vite trouvé" -ForegroundColor Gray
}

# 3. Nettoyer le cache npm
Write-Host "🧹 Nettoyage du cache npm..." -ForegroundColor Cyan
npm cache clean --force
Write-Host "✅ Cache npm nettoyé" -ForegroundColor Green

# 4. Attendre un moment
Write-Host "⏳ Attente 3 secondes..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# 5. Redémarrer le serveur de développement
Write-Host "🚀 Redémarrage du serveur de développement..." -ForegroundColor Yellow
Write-Host "📝 Commande: npm run dev" -ForegroundColor Gray

# Lancer npm run dev
npm run dev