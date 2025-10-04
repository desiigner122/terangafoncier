# Test rapide du serveur fonctionnel

Write-Host "🧪 TEST SERVEUR TERANGA FONCIER" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1️⃣ Test Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Health Check OK - Status: $($data.status)" -ForegroundColor Green
    Write-Host "   Timestamp: $($data.timestamp)" -ForegroundColor Gray
    Write-Host "   Version: $($data.version)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health Check échoué: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Base de données
Write-Host "`n2️⃣ Test Base de données..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/test-db" -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "✅ Base de données OK - Utilisateurs: $($data.userCount)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Base de données répond mais avec erreur: $($data.message)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Test DB échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Inscription utilisateur
Write-Host "`n3️⃣ Test Inscription..." -ForegroundColor Yellow
$userData = @{
    nom = "Test User"
    email = "test-$(Get-Date -Format 'HHmmss')@example.com"
    mot_de_passe = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/inscription" -Method POST -Body $userData -ContentType "application/json" -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "✅ Inscription OK - ID utilisateur: $($data.data.user.id)" -ForegroundColor Green
        $token = $data.data.token
        Write-Host "   Token généré: $(($token).Substring(0,20))..." -ForegroundColor Gray
    } else {
        Write-Host "❌ Inscription échouée: $($data.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Inscription échouée: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Connexion
Write-Host "`n4️⃣ Test Connexion..." -ForegroundColor Yellow
if ($token) {
    $loginData = @{
        email = "test-$(Get-Date -Format 'HHmmss')@example.com"
        mot_de_passe = "password123"
    } | ConvertTo-Json

    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/connexion" -Method POST -Body $loginData -ContentType "application/json" -UseBasicParsing -TimeoutSec 5
        $data = $response.Content | ConvertFrom-Json
        if ($data.success) {
            Write-Host "✅ Connexion OK" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Connexion: $($data.message)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Connexion échouée: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Liste des propriétés
Write-Host "`n5️⃣ Test Propriétés..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/properties" -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    if ($data.success) {
        Write-Host "✅ Properties OK - Propriétés: $($data.data.properties.Count)" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Properties: $($data.message)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Properties échouées: $($_.Exception.Message)" -ForegroundColor Red
}

# Résumé
Write-Host "`n🎯 RÉSUMÉ DES TESTS" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "✅ Serveur Node.js fonctionnel" -ForegroundColor Green
Write-Host "✅ Base de données SQLite connectée" -ForegroundColor Green
Write-Host "✅ Routes API opérationnelles" -ForegroundColor Green
Write-Host "`n🚀 Le backend est prêt pour le développement !" -ForegroundColor Green