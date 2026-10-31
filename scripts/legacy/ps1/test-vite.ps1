$ErrorActionPreference = "Continue"

Write-Host "=== DIAGNOSTIC SERVEUR TERANGA FONCIER ===" -ForegroundColor Cyan
Write-Host ""

cd "C:\Users\Smart Business\Desktop\terangafoncier"

Write-Host "1. Test de syntaxe vite.config.js..." -ForegroundColor Yellow
$configTest = node -c vite.config.js 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ vite.config.js syntaxe OK" -ForegroundColor Green
} else {
    Write-Host "   ❌ Erreur de syntaxe dans vite.config.js:" -ForegroundColor Red
    Write-Host "   $configTest" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Test npm run dev avec détails..." -ForegroundColor Yellow

$output = npm run dev 2>&1
Write-Host "   Sortie npm run dev:" -ForegroundColor Magenta
$output | ForEach-Object { Write-Host "   $_" }

Write-Host ""
Write-Host "=== FIN DIAGNOSTIC ===" -ForegroundColor Cyan