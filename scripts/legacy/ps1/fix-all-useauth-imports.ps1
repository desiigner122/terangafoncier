# Script pour corriger tous les imports useAuth
Write-Host "🔧 CORRECTION MASSIVE DES IMPORTS USEAUTH" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Yellow

$files = @(
    "src/components/layout/ModernHeader.jsx",
    "src/components/notifications/AISmartNotifications.jsx", 
    "src/pages/AutonomousAIDashboard.jsx",
    "src/pages/PromoterConstructionRequestsPageNew.jsx",
    "src/pages/PromoterConstructionRequestsPage.jsx",
    "src/pages/LoginPage.jsx",
    "src/pages/AddParcelPage.jsx",
    "src/pages/BecomeSellerPage.jsx",
    "src/pages/BlockchainLoginPage.jsx",
    "src/pages/BlockchainRegisterPage.jsx",
    "src/pages/ModernLoginPage.jsx",
    "src/pages/MyListingsPage.jsx",
    "src/pages/MyFavoritesPage.jsx",
    "src/pages/MyRequestsPage.jsx",
    "src/pages/ModernLoginPageFixed.jsx",
    "src/pages/NotificationsPage.jsx",
    "src/pages/SavedSearchesPage.jsx",
    "src/pages/SellPropertyPage.jsx",
    "src/pages/SecureMessagingPage.jsx",
    "src/pages/SettingsPage.jsx",
    "src/pages/TestAccountsPage.jsx",
    "src/pages/VendorVerificationPage.jsx",
    "src/pages/VerificationPage.jsx",
    "src/pages/TestAuthPage.jsx"
)

$corrected = 0
$total = $files.Count

foreach ($file in $files) {
    $fullPath = Join-Path -Path "." -ChildPath $file
    
    if (Test-Path $fullPath) {
        Write-Host "📝 Correction: $file" -ForegroundColor Cyan
        
        $content = Get-Content $fullPath -Raw
        $newContent = $content -replace "import\s*{\s*useAuth\s*}\s*from\s*'@/contexts/AuthProvider';?", "import { useAuth } from '@/contexts/SupabaseAuthContext';"
        
        if ($content -ne $newContent) {
            Set-Content -Path $fullPath -Value $newContent -NoNewline
            $corrected++
            Write-Host "   ✅ Corrigé" -ForegroundColor Green
        } else {
            Write-Host "   ⚪ Déjà correct" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ❌ Fichier introuvable: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 RESULTATS:" -ForegroundColor Yellow
Write-Host "   📊 Total fichiers: $total" -ForegroundColor White
Write-Host "   ✅ Corrigés: $corrected" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Tous les imports useAuth sont maintenant corrigés !" -ForegroundColor Green
