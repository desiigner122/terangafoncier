Write-Host "Correction automatique des imports useAuth restants..." -ForegroundColor Green

$filesToFix = @(
    "src\pages\VerificationPage.jsx",
    "src\pages\VendorVerificationPage.jsx", 
    "src\pages\TransactionsPage.jsx",
    "src\pages\TestAccountsPage.jsx",
    "src\pages\solutions\SolutionsBanquesPage.jsx",
    "src\pages\solutions\dashboards\ParticulierDashboard.jsx",
    "src\pages\SettingsPage.jsx",
    "src\pages\SellPropertyPage.jsx",
    "src\pages\SecureMessagingPage.jsx",
    "src\pages\SavedSearchesPage.jsx",
    "src\pages\PendingVerificationPage.jsx",
    "src\pages\ParcelDetailPage.jsx",
    "src\pages\NotificationsPage.jsx",
    "src\pages\MyListingsPage.jsx",
    "src\pages\MyFavoritesPage.jsx",
    "src\pages\MyRequestsPage.jsx"
)

$corrected = 0

foreach ($file in $filesToFix) {
    $fullPath = "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\$file"
    
    if (Test-Path $fullPath) {
        try {
            $content = Get-Content $fullPath -Raw
            
            # Remplacement des imports
            $newContent = $content -replace "import \{ useAuth \} from '@/context/SupabaseAuthContext';", "import { useSupabaseAuth } from '@/contexts/SupabaseAuthContextFixed';"
            $newContent = $newContent -replace "const \{ ([^}]+) \} = useAuth\(\);", "const { `$1 } = useSupabaseAuth();"
            
            if ($content -ne $newContent) {
                Set-Content -Path $fullPath -Value $newContent -Encoding UTF8
                Write-Host "OK: $($file.Split('\')[-1])" -ForegroundColor Green
                $corrected++
            }
        } catch {
            Write-Host "ERREUR: $($file.Split('\')[-1])" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Fichiers corriges: $corrected" -ForegroundColor Cyan
Write-Host "Correction terminee !" -ForegroundColor Green
