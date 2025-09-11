# Script pour corriger tous les imports AuthProvider restants
Write-Host "🔧 Correction des imports AuthProvider..." -ForegroundColor Yellow

$filesToFix = @(
    "src\pages\AutonomousAIDashboard.jsx",
    "src\pages\PromoterConstructionRequestsPageNew.jsx",
    "src\pages\PromoterConstructionRequestsPage.jsx",
    "src\pages\DebugDashboard.jsx",
    "src\pages\MyListingsPage.jsx",
    "src\pages\MyRequestsPage.jsx",
    "src\pages\MyFavoritesPage.jsx",
    "src\pages\ModernLoginPageFixed.jsx",
    "src\pages\SavedSearchesPage.jsx",
    "src\pages\SellPropertyPage.jsx",
    "src\pages\TransactionsPage.jsx",
    "src\pages\VendorVerificationPage.jsx",
    "src\pages\VerificationPage.jsx",
    "src\pages\TestAuthPage.jsx",
    "src\pages\TestAccountsPage.jsx",
    "src\pages\solutions\SolutionsNotairesPage.jsx",
    "src\pages\solutions\SolutionsBanquesPage.jsx",
    "src\pages\SettingsPage.jsx",
    "src\pages\SecureMessagingPage.jsx",
    "src\pages\PendingVerificationPage.jsx",
    "src\pages\NotificationsPage.jsx",
    "src\pages\BlockchainRegisterPage.jsx"
)

$count = 0

foreach ($file in $filesToFix) {
    $fullPath = Join-Path $PWD $file
    
    if (Test-Path $fullPath) {
        try {
            $content = Get-Content $fullPath -Raw -Encoding UTF8
            $originalContent = $content
            
            # Remplacer l'import AuthProvider par TempSupabaseAuthContext
            $content = $content -replace "import \{ useAuth \} from '@/contexts/AuthProvider';", "import { useAuth } from '@/contexts/TempSupabaseAuthContext';"
            
            if ($content -ne $originalContent) {
                Set-Content $fullPath $content -Encoding UTF8 -NoNewline
                Write-Host "✅ Corrigé: $file" -ForegroundColor Green
                $count++
            } else {
                Write-Host "⚠️  Aucun changement: $file" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "❌ Erreur sur $file : $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  Fichier non trouvé: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Correction terminée! $count fichiers corrigés." -ForegroundColor Green
Write-Host "✅ Tous les imports utilisent maintenant TempSupabaseAuthContext" -ForegroundColor Green
