#!/usr/bin/env pwsh

Write-Host "=== Test de Build - Validation Finale ===" -ForegroundColor Green
Write-Host "Repertoire: $(Get-Location)" -ForegroundColor Cyan

Write-Host "`n1. Verification des dependances..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✓ package.json existe" -ForegroundColor Green
    
    # Vérifier lucide-react
    $packageContent = Get-Content "package.json" | ConvertFrom-Json
    if ($packageContent.dependencies."lucide-react") {
        Write-Host "✓ lucide-react: $($packageContent.dependencies."lucide-react")" -ForegroundColor Green
    } else {
        Write-Host "✗ lucide-react manquant" -ForegroundColor Red
    }
} else {
    Write-Host "✗ package.json manquant" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Verification des fichiers critiques..." -ForegroundColor Yellow
$criticalFiles = @(
    "src\pages\dashboards\PromoteurDashboard.jsx",
    "src\pages\dashboards\AgentFoncierDashboard.jsx", 
    "src\lib\enhancedRbacConfig.js",
    "src\pages\solutions\SolutionsParticuliersPage.jsx",
    "src\pages\solutions\SolutionsPromoteursPage.jsx",
    "src\pages\admin\AdminAgentsPage.jsx"
)

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        Write-Host "✗ $file manquant" -ForegroundColor Red
    }
}

Write-Host "`n3. Recherche d'icones problematiques..." -ForegroundColor Yellow
$problematicIcons = @("Drafting", "HandCoins")
$foundIssues = @()

foreach ($icon in $problematicIcons) {
    $result = Select-String -Path "src\**\*.jsx" -Pattern $icon -ErrorAction SilentlyContinue
    if ($result) {
        $foundIssues += $icon
        Write-Host "✗ Icone problematique trouvee: $icon" -ForegroundColor Red
        $result | ForEach-Object { Write-Host "  - $($_.Filename):$($_.LineNumber)" -ForegroundColor Red }
    }
}

if ($foundIssues.Count -eq 0) {
    Write-Host "✓ Aucune icone problematique trouvee" -ForegroundColor Green
}

Write-Host "`n4. Tentative de build..." -ForegroundColor Yellow
try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Build reussi!" -ForegroundColor Green
        Write-Host "=== SUCCES TOTAL ===" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "✗ Build echoue" -ForegroundColor Red
        Write-Host $buildOutput -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Erreur durant le build: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
