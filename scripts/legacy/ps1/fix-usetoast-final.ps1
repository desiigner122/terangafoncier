# 🛡️ SCRIPT FINAL POUR ÉLIMINER TOUS LES USETOAST
# Date: 3 Septembre 2025
# Objectif: Remplacer TOUS les useToast par safeToast

Write-Host "🛡️ REMPLACEMENT MASSIF USETOAST → SAFETOAST" -ForegroundColor Red
Write-Host "=============================================" -ForegroundColor Red

# Liste des fichiers à corriger
$filesToFix = @(
    "src\pages\PaymentPage.jsx",
    "src\pages\solutions\dashboards\PromoteursDashboardPage.jsx",
    "src\pages\solutions\dashboards\InvestisseursDashboardPage.jsx",
    "src\pages\solutions\dashboards\BanquesDashboardPage.jsx",
    "src\pages\solutions\dashboards\AgriculteursDashboardPage.jsx",
    "src\pages\agent\AgentDashboardPage.jsx",
    "src\pages\admin\components\AddUserWizard.jsx",
    "src\pages\admin\AdminReportsPage.jsx",
    "src\pages\admin\AdminContractsPage.jsx",
    "src\pages\admin\AdminBlogPage.jsx",
    "src\pages\admin\AdminBlogFormPage.jsx",
    "src\pages\admin\AdminAgentsPage.jsx",
    "src\context\SupabaseAuthContext.jsx",
    "src\pages\admin\AdminUserRequestsPage.jsx",
    "src\pages\ParcelDetailPage.jsx",
    "src\pages\admin\AdminDashboardPage.jsx",
    "src\components\parcels\ParcelCard.jsx",
    "src\pages\ProfilePage.jsx",
    "src\pages\VerificationPage.jsx",
    "src\context\SimpleSupabaseAuthContext.jsx",
    "src\components\layout\ProtectedRoute.jsx",
    "src\hooks\useUserStatusMonitor.jsx"
)

$totalFixed = 0
$totalErrors = 0

foreach ($file in $filesToFix) {
    Write-Host "`n📄 Traitement: $file" -ForegroundColor Cyan
    
    if (Test-Path $file) {
        try {
            $content = Get-Content $file -Raw -Encoding UTF8
            $originalContent = $content
            
            # Vérifier si le fichier contient useToast
            if ($content -match "useToast") {
                Write-Host "   🔍 useToast détecté, remplacement par safeToast..." -ForegroundColor Yellow
                
                # Simple remplacement pour éviter les erreurs
                $content = $content -replace "const \{ toast \} = useToast\(\);", "// Remplacement toast par safeToast global"
                $content = $content -replace "import \{ useToast \} from.*?;", "// Import useToast supprimé - utilisation safeToast global"
                $content = $content -replace "toast\(", "window.safeGlobalToast("
                
                # Écrire le fichier modifié
                $content | Out-File -FilePath $file -Encoding UTF8 -Force
                Write-Host "   ✅ Corrigé avec succès" -ForegroundColor Green
                $totalFixed++
            } else {
                Write-Host "   ℹ️  Aucun useToast trouvé" -ForegroundColor Gray
            }
            
        } catch {
            Write-Host "   ❌ Erreur: $_" -ForegroundColor Red
            $totalErrors++
        }
    } else {
        Write-Host "   ⚠️  Fichier non trouvé" -ForegroundColor Yellow
    }
}

Write-Host "`n📊 RÉSUMÉ:" -ForegroundColor Yellow
Write-Host "   ✅ Fichiers corrigés: $totalFixed" -ForegroundColor Green
Write-Host "   ❌ Erreurs: $totalErrors" -ForegroundColor Red

Write-Host "`n🛡️ REMPLACEMENT TERMINÉ!" -ForegroundColor Green
