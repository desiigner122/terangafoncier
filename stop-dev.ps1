# ================================================================
# SCRIPT ARRÊT - ENVIRONNEMENT DÉVELOPPEMENT
# ================================================================

Write-Host "🛑 ARRÊT SERVICES TERANGA FONCIER" -ForegroundColor Red
Write-Host "===================================" -ForegroundColor Red
Write-Host ""

# Fonction pour tuer processus sur port
function Stop-ProcessOnPort {
    param([int]$Port, [string]$ServiceName)
    
    Write-Host "Recherche processus sur port $Port ($ServiceName)..." -ForegroundColor Yellow
    
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    
    if ($connections) {
        $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        
        foreach ($processId in $processes) {
            try {
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "  Arrêt processus: $($process.ProcessName) (PID: $processId)" -ForegroundColor Gray
                    Stop-Process -Id $processId -Force
                }
            } catch {
                Write-Host "  ⚠️  Impossible d'arrêter PID $processId" -ForegroundColor Yellow
            }
        }
        
        Write-Host "✅ Port $Port libéré" -ForegroundColor Green
    } else {
        Write-Host "  Aucun processus sur port $Port" -ForegroundColor Gray
    }
}

# Arrêter jobs PowerShell actifs
Write-Host "Arrêt jobs PowerShell..." -ForegroundColor Cyan
Get-Job | Where-Object { $_.Name -like "*backend*" -or $_.Name -like "*frontend*" } | ForEach-Object {
    Write-Host "  Arrêt job: $($_.Name) (ID: $($_.Id))" -ForegroundColor Gray
    Stop-Job -Job $_ -ErrorAction SilentlyContinue
    Remove-Job -Job $_ -ErrorAction SilentlyContinue
}

Write-Host ""

# Arrêter processus sur ports
Stop-ProcessOnPort -Port 5000 -ServiceName "Backend API"
Stop-ProcessOnPort -Port 3000 -ServiceName "Frontend React"
Stop-ProcessOnPort -Port 5173 -ServiceName "Frontend Vite"

Write-Host ""
Write-Host "✅ Tous les services sont arrêtés" -ForegroundColor Green
Write-Host ""
