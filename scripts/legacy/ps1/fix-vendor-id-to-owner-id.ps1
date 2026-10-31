# Script de correction global: vendor_id → owner_id
# Corrige toutes les occurrences dans les fichiers vendeur

$files = @(
    "src\pages\dashboards\vendeur\VendeurPurchaseRequests.jsx",
    "src\pages\dashboards\vendeur\VendeurAntiFraudSystem.jsx",
    "src\pages\dashboards\vendeur\VendeurBlockchainIntegration.jsx",
    "src\pages\dashboards\vendeur\VendeurAnalyticsRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurCRMRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurMessagingRealData.jsx",
    "src\pages\dashboards\vendeur\VendeurGPSTrackingSystem.jsx"
)

$totalFixed = 0

foreach ($file in $files) {
    $fullPath = "c:\Users\Smart Business\Desktop\terangafoncier\$file"
    
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        $originalContent = $content
        
        # Remplacer vendor_id par owner_id dans les queries
        $content = $content -replace 'vendor_id=eq\.', 'owner_id=eq.'
        $content = $content -replace '&vendor_id=eq\.', '&owner_id=eq.'
        $content = $content -replace 'vendor_id\)', 'owner_id)'
        $content = $content -replace '\.vendor_id', '.owner_id'
        $content = $content -replace 'vendor_id:', 'owner_id:'
        $content = $content -replace 'vendor_id ', 'owner_id '
        
        if ($content -ne $originalContent) {
            $content | Out-File $fullPath -Encoding UTF8 -NoNewline
            $occurrences = ([regex]::Matches($originalContent, 'vendor_id')).Count
            Write-Host "✅ $file - $occurrences occurrences corrigées" -ForegroundColor Green
            $totalFixed += $occurrences
        } else {
            Write-Host "⏭️  $file - Déjà correct" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ $file - Fichier introuvable" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 TERMINÉ! $totalFixed occurrences de vendor_id corrigées" -ForegroundColor Cyan
Write-Host "Rafraîchissez votre navigateur (Ctrl+Shift+R)" -ForegroundColor Yellow
