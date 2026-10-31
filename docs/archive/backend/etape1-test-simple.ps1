# ÉTAPE 1 - Test simple du backend

Write-Host "🧪 ÉTAPE 1 - Test backend local" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# 1. Vérifier que le serveur n'est pas déjà en cours
Write-Host "`n1️⃣ Vérification processus Node.js" -ForegroundColor Yellow
$nodeProcess = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcess) {
    Write-Host "⚠️ Serveur Node.js déjà en cours - PID: $($nodeProcess.Id)" -ForegroundColor Yellow
    Write-Host "Arrêt du processus..." -ForegroundColor Yellow
    taskkill /F /IM node.exe 2>$null
    Start-Sleep 2
} else {
    Write-Host "✅ Aucun processus Node.js en cours" -ForegroundColor Green
}

# 2. Lancer le serveur en arrière-plan
Write-Host "`n2️⃣ Démarrage du serveur" -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "c:\Users\Smart Business\Desktop\terangafoncier\backend" -WindowStyle Hidden -PassThru

Write-Host "Serveur démarré - PID: $($serverProcess.Id)" -ForegroundColor Green
Write-Host "Attente de 3 secondes pour l'initialisation..." -ForegroundColor Gray
Start-Sleep 3

# 3. Test health check
Write-Host "`n3️⃣ Test Health Check" -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
    $healthData = $healthResponse.Content | ConvertFrom-Json
    Write-Host "✅ Health Check OK - Status: $($healthData.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health Check échoué: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Le serveur ne répond pas correctement" -ForegroundColor Red
    # Arrêter le processus si erreur
    if ($serverProcess -and !$serverProcess.HasExited) {
        $serverProcess.Kill()
    }
    exit 1
}

# 4. Test authentification simple
Write-Host "`n4️⃣ Test Authentification" -ForegroundColor Yellow
$userData = '{"nom":"Test Étape 1","email":"etape1@test.com","mot_de_passe":"password123"}'

try {
    $authResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/inscription" -Method POST -Body $userData -ContentType "application/json" -UseBasicParsing -TimeoutSec 5
    $authData = $authResponse.Content | ConvertFrom-Json
    
    if ($authData.success) {
        Write-Host "✅ Authentification OK - Token généré" -ForegroundColor Green
        $token = $authData.data.token
    } else {
        Write-Host "⚠️ Authentification réussie mais pas de token" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Test authentification échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Test route properties simple
Write-Host "`n5️⃣ Test Route Properties" -ForegroundColor Yellow
try {
    $propertiesResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/properties" -UseBasicParsing -TimeoutSec 5
    $propertiesData = $propertiesResponse.Content | ConvertFrom-Json
    
    if ($propertiesData.success) {
        Write-Host "✅ Route Properties OK - $($propertiesData.data.properties.Count) propriétés" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Route Properties répond mais avec erreur: $($propertiesData.message)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Route Properties échouée: $($_.Exception.Message)" -ForegroundColor Red
}

# Résumé
Write-Host "`n📋 RÉSUMÉ ÉTAPE 1" -ForegroundColor Cyan
Write-Host "================" -ForegroundColor Cyan

if ($healthData.status -eq "OK") {
    Write-Host "✅ Serveur opérationnel" -ForegroundColor Green
    Write-Host "✅ Health check fonctionnel" -ForegroundColor Green
    
    if ($token) {
        Write-Host "✅ Authentification fonctionnelle" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Authentification à vérifier" -ForegroundColor Yellow
    }
    
    Write-Host "`n🎯 PROCHAINE ÉTAPE:" -ForegroundColor Green
    Write-Host "Tester et corriger les routes si nécessaire" -ForegroundColor White
    
} else {
    Write-Host "❌ Serveur non opérationnel" -ForegroundColor Red
    Write-Host "Il faut d'abord résoudre les erreurs de base" -ForegroundColor Red
}

Write-Host "`n💡 Pour arrêter le serveur:" -ForegroundColor Gray
Write-Host "taskkill /F /IM node.exe" -ForegroundColor Gray