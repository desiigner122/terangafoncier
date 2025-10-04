#!/usr/bin/env pwsh

Write-Host "DEMARRAGE SERVEUR TERANGA FONCIER..." -ForegroundColor Cyan

# Nettoyer les anciens processus
taskkill /F /IM node.exe 2>$null
Start-Sleep 2

# Démarrer le serveur
cd "c:\Users\Smart Business\Desktop\terangafoncier\backend"
Write-Host "Lancement de server-complete.js..." -ForegroundColor Yellow

# Démarrer en arrière-plan et maintenir la connexion
Start-Process -FilePath "node" -ArgumentList "server-complete.js" -WindowStyle Hidden -PassThru

Start-Sleep 5

# Test de connectivité
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 10
    Write-Host "SERVEUR DEMARRE AVEC SUCCES!" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor Gray
    Write-Host "Message: $($response.message)" -ForegroundColor Gray
    Write-Host "Accedez a: http://localhost:3000/health" -ForegroundColor Cyan
} catch {
    Write-Host "ECHEC DEMARRAGE SERVEUR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Le serveur fonctionne en arriere-plan" -ForegroundColor Green