#!/usr/bin/env pwsh

Write-Host "=== TEST API TERANGA FONCIER ===" -ForegroundColor Green

# Test Health Check
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    Write-Host "HEALTH CHECK: OK - Status: $($response.status)" -ForegroundColor Green
    Write-Host "Message: $($response.message)" -ForegroundColor Gray
} catch {
    Write-Host "HEALTH CHECK: ECHEC - $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test Database
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/db-test" -Method GET -TimeoutSec 5
    Write-Host "DATABASE: OK - Users: $($response.users), Properties: $($response.properties)" -ForegroundColor Green
} catch {
    Write-Host "DATABASE: ECHEC" -ForegroundColor Red
}

# Test Liste Propriétés
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/properties" -Method GET -TimeoutSec 5
    Write-Host "PROPRIETES: OK - Nombre: $($response.count)" -ForegroundColor Green
} catch {
    Write-Host "PROPRIETES: ECHEC" -ForegroundColor Red
}

Write-Host "`n=== RESULTAT: API FONCTIONNELLE ===" -ForegroundColor Green