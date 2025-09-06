#!/usr/bin/env pwsh

Write-Host "=== DEPLOIEMENT GIT - MODERNISATION DASHBOARDS ===" -ForegroundColor Green
Write-Host "Repertoire: $(Get-Location)" -ForegroundColor Cyan

# 1. Vérifier l'état Git
Write-Host "`n1. Verification de l'etat Git..." -ForegroundColor Yellow
try {
    $gitStatus = git status --porcelain 2>&1
    if ($LASTEXITCODE -eq 0) {
        if ($gitStatus) {
            Write-Host "✓ Modifications detectees:" -ForegroundColor Green
            $gitStatus | ForEach-Object { Write-Host "  $($_)" -ForegroundColor White }
        } else {
            Write-Host "✓ Aucune modification en attente" -ForegroundColor Green
        }
    } else {
        Write-Host "✗ Erreur Git: $gitStatus" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Git non disponible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Ajouter tous les fichiers
Write-Host "`n2. Ajout des fichiers..." -ForegroundColor Yellow
try {
    git add . 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Fichiers ajoutes avec succes" -ForegroundColor Green
    } else {
        Write-Host "✗ Erreur lors de l'ajout des fichiers" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Erreur git add: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 3. Créer le commit
Write-Host "`n3. Creation du commit..." -ForegroundColor Yellow
$commitMessage = @"
🚀 Dashboard Modernization Complete - Final Build Fix

✨ Features:
- Complete RBAC system with 15 roles and granular permissions
- 11 specialized dashboards with intelligent routing
- Enhanced solution pages with pricing integration
- Systematic error resolution across all components

🔧 Technical Fixes:
- Fixed lucide-react icon imports (Drafting→PenTool, HandCoins→Coins)
- Resolved JavaScript structure errors in solution pages
- Corrected CSS class conflicts in admin pages
- Updated dashboard routing with DashboardRedirect component

📋 Modified Files:
- src/lib/enhancedRbacConfig.js - Enhanced RBAC configuration
- src/pages/dashboards/* - All dashboard components updated
- src/pages/solutions/* - Solution pages modernized
- src/pages/admin/* - Admin interface improvements
- Multiple component fixes for build optimization

🎯 Ready for Production
"@

try {
    git commit -m $commitMessage 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Commit cree avec succes" -ForegroundColor Green
    } elseif ($LASTEXITCODE -eq 1) {
        Write-Host "ℹ Aucune modification a commiter" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Erreur lors du commit" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Erreur git commit: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Push vers origin
Write-Host "`n4. Push vers le repository..." -ForegroundColor Yellow
try {
    $pushOutput = git push origin main 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Push reussi vers origin/main" -ForegroundColor Green
        Write-Host $pushOutput -ForegroundColor White
    } else {
        Write-Host "✗ Erreur lors du push: $pushOutput" -ForegroundColor Red
        
        # Essayer de pull d'abord en cas de conflit
        Write-Host "`nTentative de pull avant push..." -ForegroundColor Yellow
        $pullOutput = git pull origin main 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Pull reussi, nouveau tentative de push..." -ForegroundColor Green
            $retryPush = git push origin main 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ Push reussi apres pull" -ForegroundColor Green
            } else {
                Write-Host "✗ Push echoue meme apres pull: $retryPush" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "✗ Pull egalement echoue: $pullOutput" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "✗ Erreur git push: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== DEPLOIEMENT TERMINE AVEC SUCCES ===" -ForegroundColor Green
Write-Host "Repository mis a jour avec la modernisation complete des dashboards!" -ForegroundColor Cyan
