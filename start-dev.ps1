# ================================================================
# SCRIPT DÉMARRAGE RAPIDE - ENVIRONNEMENT DÉVELOPPEMENT
# ================================================================

Write-Host "🚀 DÉMARRAGE TERANGA FONCIER - MODE DÉVELOPPEMENT" -ForegroundColor Blue
Write-Host "===================================================" -ForegroundColor Blue
Write-Host ""

# Fonction pour tuer processus sur port
function Stop-ProcessOnPort {
    param([int]$Port)
    
    $process = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    
    if ($process) {
        Write-Host "🛑 Arrêt processus sur port $Port..." -ForegroundColor Yellow
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Nettoyer ports si occupés
Write-Host "🧹 Nettoyage ports..." -ForegroundColor Cyan
Stop-ProcessOnPort -Port 5000  # Backend
Stop-ProcessOnPort -Port 3000  # Frontend
Stop-ProcessOnPort -Port 5173  # Vite
Write-Host ""

# Démarrer Backend
Write-Host "🔧 Démarrage serveur backend (port 5000)..." -ForegroundColor Cyan
Set-Location backend

$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm start
}

Write-Host "✅ Serveur backend démarré (PID: $($backendJob.Id))" -ForegroundColor Green
Start-Sleep -Seconds 5

Set-Location ..

# Démarrer Frontend
Write-Host "🎨 Démarrage serveur frontend (port 3000 ou 5173)..." -ForegroundColor Cyan

$frontendJob = Start-Job -ScriptBlock {
    npm run dev
}

Write-Host "✅ Serveur frontend démarré (PID: $($frontendJob.Id))" -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "================================================" -ForegroundColor Blue
Write-Host "🎉 ENVIRONNEMENT DÉMARRÉ AVEC SUCCÈS!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Blue
Write-Host ""

Write-Host "📡 Services actifs:" -ForegroundColor Cyan
Write-Host "   • Backend API:  http://localhost:5000" -ForegroundColor White
Write-Host "   • Health check: http://localhost:5000/health" -ForegroundColor Gray
Write-Host "   • Frontend:     http://localhost:3000 (ou 5173)" -ForegroundColor White
Write-Host ""

Write-Host "🔍 Jobs PowerShell:" -ForegroundColor Cyan
Write-Host "   • Backend Job ID:  $($backendJob.Id)" -ForegroundColor Gray
Write-Host "   • Frontend Job ID: $($frontendJob.Id)" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 Commandes utiles:" -ForegroundColor Yellow
Write-Host "   • Voir logs backend:  Receive-Job -Id $($backendJob.Id) -Keep" -ForegroundColor Gray
Write-Host "   • Voir logs frontend: Receive-Job -Id $($frontendJob.Id) -Keep" -ForegroundColor Gray
Write-Host "   • Arrêter services:   ./stop-dev.ps1" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 Appuyez sur Ctrl+C pour arrêter tous les services" -ForegroundColor Cyan
Write-Host ""

# Attendre interruption utilisateur
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Vérifier si jobs toujours actifs
        if ((Get-Job -Id $backendJob.Id).State -eq 'Failed') {
            Write-Host "❌ Backend job échoué!" -ForegroundColor Red
            Receive-Job -Id $backendJob.Id
            break
        }
        
        if ((Get-Job -Id $frontendJob.Id).State -eq 'Failed') {
            Write-Host "❌ Frontend job échoué!" -ForegroundColor Red
            Receive-Job -Id $frontendJob.Id
            break
        }
    }
} catch {
    Write-Host ""
    Write-Host "🛑 Arrêt des services..." -ForegroundColor Yellow
} finally {
    # Cleanup
    Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
    
    Write-Host "✅ Services arrêtés" -ForegroundColor Green
}
