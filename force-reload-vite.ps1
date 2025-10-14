# Script pour forcer le rechargement complet de Vite et nettoyer le cache
# Usage: .\force-reload-vite.ps1

Write-Host "🧹 Nettoyage du cache Vite..." -ForegroundColor Yellow

# Supprimer le dossier de cache Vite
$viteCachePath = "node_modules\.vite"
if (Test-Path $viteCachePath) {
    Remove-Item -Recurse -Force $viteCachePath
    Write-Host "✅ Cache Vite supprimé: $viteCachePath" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Pas de cache Vite trouvé" -ForegroundColor Cyan
}

# Supprimer le dossier dist si existe
$distPath = "dist"
if (Test-Path $distPath) {
    Remove-Item -Recurse -Force $distPath
    Write-Host "✅ Dossier dist supprimé" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔄 Instructions pour redémarrer le serveur:" -ForegroundColor Cyan
Write-Host "1. Arrêtez le serveur actuel avec Ctrl+C" -ForegroundColor White
Write-Host "2. Relancez avec: npm run dev" -ForegroundColor White
Write-Host "3. Dans Firefox, faites: Ctrl+Shift+R (hard refresh)" -ForegroundColor White
Write-Host ""
Write-Host "✨ Cache nettoyé! Redémarrez maintenant le serveur." -ForegroundColor Green
