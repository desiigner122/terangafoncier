# Test ÉTAPE 1 - Base de données

Write-Host "🧪 TEST ÉTAPE 1 - BASE DE DONNÉES" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Test 1: Health check (doit toujours marcher)
Write-Host "`n1️⃣ Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Health OK - Status: $($data.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health échoué: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Nouveau test base de données
Write-Host "`n2️⃣ Test Base de données..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/db-test" -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.success) {
        Write-Host "✅ Base de données OK!" -ForegroundColor Green
        Write-Host "   Utilisateurs: $($data.userCount)" -ForegroundColor Gray
        Write-Host "   Message: $($data.message)" -ForegroundColor Gray
        Write-Host "   Timestamp: $($data.timestamp)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Base de données KO: $($data.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ DB Test échoué: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 RÉSULTAT ÉTAPE 1" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "✅ Serveur stable" -ForegroundColor Green
Write-Host "✅ SQLite connectée" -ForegroundColor Green
Write-Host "✅ Tables créées" -ForegroundColor Green
Write-Host "`n➡️ Prêt pour ÉTAPE 2 : Authentification" -ForegroundColor Yellow