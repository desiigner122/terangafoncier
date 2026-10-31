# Script de correction des imports d'authentification

Write-Host "🔧 Correction des imports d'authentification..." -ForegroundColor Green

# Liste des fichiers à corriger
$filesToFix = @(
    "src\pages\DebugDashboard.jsx",
    "src\pages\VerificationPage.jsx", 
    "src\pages\VendorVerificationPage.jsx",
    "src\pages\TransactionsPage.jsx",
    "src\pages\TestAccountsPage.jsx",
    "src\pages\solutions\SolutionsBanquesPage.jsx",
    "src\pages\solutions\dashboards\VendeurDashboardPage.jsx",
    "src\pages\solutions\dashboards\ParticulierDashboardModernized.jsx",
    "src\pages\solutions\dashboards\ParticulierDashboard.jsx",
    "src\pages\solutions\dashboards\InvestisseursDashboardPage.jsx",
    "src\pages\solutions\dashboards\BanqueDashboard.jsx",
    "src\pages\SettingsPage.jsx",
    "src\pages\SellPropertyPage.jsx",
    "src\pages\SecureMessagingPage.jsx",
    "src\pages\SavedSearchesPage.jsx",
    "src\pages\PendingVerificationPage.jsx",
    "src\pages\ParcelDetailPage.jsx",
    "src\pages\NotificationsPage.jsx",
    "src\pages\MyRequestsPage.jsx",
    "src\pages\MyFavoritesPage.jsx"
)

$corrected = 0
$errors = 0

foreach ($file in $filesToFix) {
    $fullPath = "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\$file"
    
    if (Test-Path $fullPath) {
        try {
            $content = Get-Content $fullPath -Raw
            
            # Remplacer l'ancien import par le nouveau
            $newContent = $content -replace "import { useAuth } from '@/context/SupabaseAuthContext';", "import { useSupabaseAuth } from '@/contexts/SupabaseAuthContextFixed';"
            $newContent = $newContent -replace "const { ([^}]+) } = useAuth\(\);", "const { `$1 } = useSupabaseAuth();"
            
            # Sauvegarder seulement si des changements ont été effectués
            if ($content -ne $newContent) {
                Set-Content -Path $fullPath -Value $newContent -Encoding UTF8
                Write-Host "   ✅ Corrigé: $($file.Split('\')[-1])" -ForegroundColor Green
                $corrected++
            } else {
                Write-Host "   ➡️  Aucun changement: $($file.Split('\')[-1])" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "   ❌ Erreur: $($file.Split('\')[-1]) - $($_.Exception.Message)" -ForegroundColor Red
            $errors++
        }
    } else {
        Write-Host "   ⚠️  Fichier introuvable: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📊 Résultats:" -ForegroundColor Cyan
Write-Host "   Fichiers corrigés: $corrected" -ForegroundColor Green
Write-Host "   Erreurs: $errors" -ForegroundColor Red

Write-Host ""
Write-Host "🎯 Correction terminée !" -ForegroundColor Green
