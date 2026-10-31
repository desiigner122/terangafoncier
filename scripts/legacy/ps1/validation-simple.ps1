# VALIDATION FINALE - TERANGA FONCIER

Write-Host "VALIDATION FINALE - PLATEFORME TERANGA FONCIER" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verifier le serveur
Write-Host "1. Test du serveur..." -ForegroundColor Yellow
$serverStatus = (Test-NetConnection -ComputerName localhost -Port 5174 -WarningAction SilentlyContinue).TcpTestSucceeded

if ($serverStatus) {
    Write-Host "   Serveur Vite : ACTIF" -ForegroundColor Green
} else {
    Write-Host "   Serveur Vite : INACTIF" -ForegroundColor Red
}

# 2. Verifier les pages
Write-Host ""
Write-Host "2. Pages sidebar creees..." -ForegroundColor Yellow

$pages = @(
    "src\pages\common\MessagesPage.jsx",
    "src\pages\common\DocumentsPage.jsx",
    "src\pages\common\NotificationsPage.jsx", 
    "src\pages\common\CalendarPage.jsx",
    "src\pages\common\SettingsPageNew.jsx",
    "src\pages\common\MesTerrainsPage.jsx"
)

$allPagesExist = $true
foreach ($page in $pages) {
    $fullPath = "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\$page"
    if (Test-Path $fullPath) {
        $size = (Get-Item $fullPath).Length
        $sizeKB = [math]::Round($size/1KB, 1)
        Write-Host "   OK $($page.Split('\')[-1]) - $sizeKB KB" -ForegroundColor Green
    } else {
        Write-Host "   MANQUE $($page.Split('\')[-1])" -ForegroundColor Red
        $allPagesExist = $false
    }
}

# 3. Test build
Write-Host ""
Write-Host "3. Test build..." -ForegroundColor Yellow
$buildOutput = npm run build 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "   Build : SUCCES" -ForegroundColor Green
} else {
    Write-Host "   Build : ECHEC" -ForegroundColor Red
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "RESUME FINAL" -ForegroundColor Green

if ($allPagesExist -and $serverStatus) {
    Write-Host "STATUT : SUCCES COMPLET" -ForegroundColor Green
    Write-Host "La plateforme Teranga Foncier est operationnelle!" -ForegroundColor Green
    Write-Host "Acces : http://localhost:5174/" -ForegroundColor Yellow
} else {
    Write-Host "STATUT : ATTENTION REQUISE" -ForegroundColor Yellow
}

Write-Host "=============================================" -ForegroundColor Cyan
