# Script de correction COMPLET: vendor_id → owner_id
# Cible uniquement les fichiers avec des erreurs

$files = @(
    "src\pages\dashboards\vendeur\VendeurPhotosRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurPurchaseRequests.jsx",
    "src\pages\dashboards\vendeur\VendeurSettingsRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurMessagesRealData_CLEAN.jsx",
    "src\pages\dashboards\vendeur\VendeurMessagesRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurGPSRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurCRMRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurBlockchainRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurAntiFraudeRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurAIRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurAddTerrainRealData.jsx"
)

$totalFixed = 0
$filesFixed = 0

Write-Host "🔧 Correction de vendor_id → owner_id..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {
    $fullPath = "c:\Users\Smart Business\Desktop\terangafoncier\$file"
    
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        $originalContent = $content
        
        # Remplacer toutes les occurrences de vendor_id par owner_id
        # Dans les queries .eq()
        $content = $content -replace "\.eq\('vendor_id'", ".eq('owner_id'"
        # Dans les objets/inserts
        $content = $content -replace 'vendor_id:', 'owner_id:'
        # Dans les références de colonnes
        $content = $content -replace 'certificate\.vendor_id', 'certificate.owner_id'
        
        if ($content -ne $originalContent) {
            $content | Out-File $fullPath -Encoding UTF8 -NoNewline
            $occurrences = ([regex]::Matches($originalContent, 'vendor_id')).Count
            Write-Host "✅ $(Split-Path $file -Leaf)" -ForegroundColor Green
            Write-Host "   → $occurrences occurrences corrigées" -ForegroundColor Gray
            $totalFixed += $occurrences
            $filesFixed++
        } else {
            Write-Host "⏭️  $(Split-Path $file -Leaf) - Déjà correct" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "❌ $(Split-Path $file -Leaf) - Fichier introuvable" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 TERMINÉ!" -ForegroundColor Green
Write-Host "   $filesFixed fichiers modifiés" -ForegroundColor White
Write-Host "   $totalFixed occurrences de 'vendor_id' corrigées" -ForegroundColor White
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "   1. Rafraîchissez votre navigateur (Ctrl+Shift+R)" -ForegroundColor Gray
Write-Host "   2. Vérifiez la console - les erreurs devraient diminuer" -ForegroundColor Gray
Write-Host "   3. Testez votre dashboard vendeur" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
