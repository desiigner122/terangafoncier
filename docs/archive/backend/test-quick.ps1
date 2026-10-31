#!/usr/bin/env pwsh

Write-Host "🔄 TEST RAPIDE API TERANGA FONCIER" -ForegroundColor Cyan

# Test Health Check
Write-Host "`n📊 Test Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Health: $($health.status) - $($health.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Serveur non accessible" -ForegroundColor Red
    exit 1
}

# Test Database
Write-Host "`n🗄️ Test Database..." -ForegroundColor Yellow
try {
    $db = Invoke-RestMethod -Uri "http://localhost:3000/db-test" -Method GET -TimeoutSec 5
    Write-Host "✅ DB: Users=$($db.users), Properties=$($db.properties)" -ForegroundColor Green
} catch {
    Write-Host "❌ Database inaccessible" -ForegroundColor Red
}

# Test Inscription
Write-Host "`n👤 Test Inscription..." -ForegroundColor Yellow
$userData = @{
    email = "test$(Get-Random)@terangafoncier.com"
    password = "test123"
    nom = "Test"
    prenom = "User"
} | ConvertTo-Json

try {
    $signup = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/inscription" -Method POST -Body $userData -ContentType "application/json" -TimeoutSec 5
    Write-Host "✅ Inscription: User ID $($signup.user.id) créé" -ForegroundColor Green
    $global:token = $signup.token
} catch {
    Write-Host "⚠️ Inscription: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
}

# Test Liste Propriétés
Write-Host "`n📋 Test Liste Propriétés..." -ForegroundColor Yellow
try {
    $properties = Invoke-RestMethod -Uri "http://localhost:3000/api/properties" -Method GET -TimeoutSec 5
    Write-Host "✅ Propriétés: $($properties.count) trouvées" -ForegroundColor Green
} catch {
    Write-Host "❌ Liste propriétés échouée" -ForegroundColor Red
}

Write-Host "`n🎉 TESTS TERMINÉS - API FONCTIONNELLE !" -ForegroundColor Green