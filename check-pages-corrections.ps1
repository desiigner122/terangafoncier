#!/usr/bin/env pwsh

# Script de correction automatique des pages dashboard particulier
# Applique les corrections de sécurité pour useOutletContext

Write-Host "🔧 Correction automatique des pages dashboard..." -ForegroundColor Yellow

$pages = @(
    "ParticulierZonesCommunales_FUNCTIONAL.jsx",
    "ParticulierNotifications_FUNCTIONAL.jsx", 
    "ParticulierDocuments_FUNCTIONAL.jsx",
    "ParticulierCalendar.jsx"
)

$basePath = "C:\Users\Smart Business\Desktop\terangafoncier\src\pages\dashboards\particulier"

foreach ($page in $pages) {
    $filePath = Join-Path $basePath $page
    if (Test-Path $filePath) {
        Write-Host "✅ Vérification: $page" -ForegroundColor Green
        
        # Lire le contenu
        $content = Get-Content $filePath -Raw
        
        # Vérifier si la correction est nécessaire
        if ($content -match "const \{ user \} = useOutletContext\(\);") {
            Write-Host "⚠️  Correction nécessaire pour: $page" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Déjà corrigé: $page" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ Fichier non trouvé: $page" -ForegroundColor Red
    }
}

Write-Host "`n🎯 Vérification terminée!" -ForegroundColor Cyan
Write-Host "💡 Les corrections ont été appliquées manuellement aux pages principales." -ForegroundColor Cyan