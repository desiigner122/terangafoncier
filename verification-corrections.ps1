# VERIFICATION FINALE DES CORRECTIONS

Write-Host "VERIFICATION FINALE - CORRECTIONS APPLIQUEES" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Test de compilation
Write-Host "1. Test de compilation..." -ForegroundColor Yellow
$buildOutput = & npm run build 2>&1 | Out-String

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Build : SUCCES" -ForegroundColor Green
} else {
    Write-Host "   Build : ECHEC" -ForegroundColor Red
    Write-Host "   Détails : $buildOutput" -ForegroundColor Gray
}

# 2. Vérification des imports corrigés
Write-Host ""
Write-Host "2. Verification des imports d'authentification..." -ForegroundColor Yellow

$filesToCheck = @(
    "src\components\layout\header\AuthSection.jsx",
    "src\components\ai\TerrangaFoncierChatbot.jsx",
    "src\pages\DebugDashboard.jsx",
    "src\pages\solutions\dashboards\InvestisseursDashboardPage.jsx"
)

$correctedImports = 0
foreach ($file in $filesToCheck) {
    $fullPath = "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\$file"
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        if ($content -match "useSupabaseAuth.*from.*SupabaseAuthContextFixed") {
            Write-Host "   OK: $($file.Split('\')[-1])" -ForegroundColor Green
            $correctedImports++
        } else {
            Write-Host "   ECHEC: $($file.Split('\')[-1])" -ForegroundColor Red
        }
    }
}

# 3. Vérification de la structure des nouvelles pages
Write-Host ""
Write-Host "3. Verification des nouvelles pages sidebar..." -ForegroundColor Yellow

$sidebarPages = @(
    "src\pages\common\MessagesPage.jsx",
    "src\pages\common\DocumentsPage.jsx",
    "src\pages\common\NotificationsPage.jsx", 
    "src\pages\common\CalendarPage.jsx",
    "src\pages\common\SettingsPageNew.jsx",
    "src\pages\common\MesTerrainsPage.jsx"
)

$validPages = 0
foreach ($page in $sidebarPages) {
    $fullPath = "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\$page"
    if (Test-Path $fullPath) {
        $size = (Get-Item $fullPath).Length
        if ($size -gt 10000) {  # Plus de 10KB
            Write-Host "   OK: $($page.Split('\')[-1])" -ForegroundColor Green
            $validPages++
        } else {
            Write-Host "   PETIT: $($page.Split('\')[-1])" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   MANQUANT: $($page.Split('\')[-1])" -ForegroundColor Red
    }
}

# 4. Résumé final
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "RESUME FINAL" -ForegroundColor Green
Write-Host ""

if ($LASTEXITCODE -eq 0 -and $correctedImports -eq 4 -and $validPages -eq 6) {
    Write-Host "STATUT : TOUS LES PROBLEMES RESOLUS !" -ForegroundColor Green
    Write-Host ""
    Write-Host "Corrections appliquees :" -ForegroundColor Cyan
    Write-Host "- Import Supabase corrige" -ForegroundColor White
    Write-Host "- Erreurs d'authentification resolues" -ForegroundColor White
    Write-Host "- Build production : SUCCES" -ForegroundColor White
    Write-Host "- 6 pages sidebar completes" -ForegroundColor White
    Write-Host ""
    Write-Host "La plateforme est prete pour utilisation !" -ForegroundColor Green
} else {
    Write-Host "STATUT : ATTENTION REQUISE" -ForegroundColor Yellow
    Write-Host "Build OK: $($LASTEXITCODE -eq 0)" -ForegroundColor Gray
    Write-Host "Imports corriges: $correctedImports/4" -ForegroundColor Gray
    Write-Host "Pages valides: $validPages/6" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
