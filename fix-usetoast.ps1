# Script pour remplacer tous les imports useToast
# À exécuter dans PowerShell

$files = @(
    "src/pages/SecureMessagingPage.jsx",
    "src/pages/PaymentPage.jsx",
    "src/pages/solutions/dashboards/PromoteursDashboardPage.jsx",
    "src/pages/solutions/dashboards/ParticulierDashboard.jsx",
    "src/pages/solutions/dashboards/InvestisseursDashboardPage.jsx",
    "src/pages/solutions/dashboards/BanquesDashboardPage.jsx",
    "src/pages/solutions/dashboards/AgriculteursDashboardPage.jsx",
    "src/pages/dashboards/ParticulierDashboard.jsx",
    "src/pages/DashboardMunicipalRequestPage.jsx",
    "src/pages/agent/AgentDashboardPage.jsx",
    "src/pages/admin/components/AddUserWizard.jsx",
    "src/pages/admin/AdminReportsPage.jsx",
    "src/pages/admin/AdminContractsPage.jsx",
    "src/pages/admin/AdminBlogPage.jsx",
    "src/pages/admin/AdminBlogFormPage.jsx",
    "src/pages/admin/AdminAgentsPage.jsx",
    "src/pages/ParcelDetailPage.jsx",
    "src/components/parcels/ParcelCard.jsx",
    "src/pages/ProfilePage.jsx",
    "src/pages/VerificationPage.jsx",
    "src/pages/TransactionsPage.jsx",
    "src/pages/TestAccountsPage.jsx",
    "src/pages/solutions/dashboards/NotairesDashboardPage.jsx",
    "src/pages/solutions/dashboards/VendeurDashboardPage.jsx",
    "src/pages/solutions/dashboards/MairiesDashboardPage.jsx",
    "src/pages/solutions/dashboards/mairies/MairiesDashboardModals.jsx",
    "src/pages/solutions/dashboards/mairies/MairiesDashboardPage.jsx",
    "src/pages/SettingsPage.jsx",
    "src/pages/SavedSearchesPage.jsx",
    "src/pages/RegisterPage.jsx",
    "src/pages/ProductDetailPage.jsx",
    "src/pages/ParcelsListPage.jsx",
    "src/pages/parcel-detail/ParcelActionsCard.jsx",
    "src/pages/parcels/ParcelCard.jsx",
    "src/pages/NotificationsPage.jsx",
    "src/pages/MyRequestsPage.jsx",
    "src/pages/MyFavoritesPage.jsx",
    "src/pages/MyListingsPage.jsx",
    "src/pages/MunicipalLandRequestPage.jsx",
    "src/pages/LoginPage.jsx",
    "src/pages/DigitalVaultPage.jsx"
)

foreach ($file in $files) {
    $fullPath = "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\$file"
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        $newContent = $content -replace "@/components/ui/use-toast", "@/components/ui/use-toast-simple"
        Set-Content $fullPath $newContent -NoNewline
        Write-Host "Updated: $file"
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "All files updated!"
