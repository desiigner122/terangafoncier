# Script de validation des routes critiques
# Teste les fonctionnalités essentielles pour le MVP

Write-Host "🎯 VALIDATION ROUTES PRIORITAIRES" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

$baseUrl = "http://localhost:5000/api"
$token = ""

# 1. Test authentification complète
Write-Host "`n1️⃣ Test Authentification" -ForegroundColor Yellow
$userData = '{"nom":"Admin Test","email":"admin@teranga.com","mot_de_passe":"admin123"}'
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/inscription" -Method POST -Body $userData -ContentType "application/json" -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    if ($result.success) {
        $token = $result.data.token
        Write-Host "✅ Authentification opérationnelle" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Problème authentification: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Test endpoints avec authentification
if ($token) {
    $headers = @{"Authorization" = "Bearer $token"}
    
    Write-Host "`n2️⃣ Test Routes Protégées" -ForegroundColor Yellow
    $protectedRoutes = @(
        "/users",
        "/properties", 
        "/transactions",
        "/dashboard"
    )
    
    foreach ($route in $protectedRoutes) {
        try {
            $response = Invoke-WebRequest -Uri "$baseUrl$route" -Headers $headers -UseBasicParsing -ErrorAction Stop
            Write-Host "✅ $route - Accessible" -ForegroundColor Green
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            if ($statusCode -eq 401) {
                Write-Host "🔒 $route - Auth requise (normal)" -ForegroundColor Yellow
            } else {
                Write-Host "⚠️ $route - Status: $statusCode" -ForegroundColor DarkYellow
            }
        }
    }
}

# 3. Test endpoints publics
Write-Host "`n3️⃣ Test Routes Publiques" -ForegroundColor Yellow
$publicRoutes = @(
    "/properties?public=true",
    "/maps/search",
    "/ai/analyze"
)

foreach ($route in $publicRoutes) {
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$route" -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ $route - Public accessible" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ $route - Nécessite implémentation" -ForegroundColor DarkYellow
    }
}

Write-Host "`n🎯 ACTIONS PRIORITAIRES:" -ForegroundColor Cyan
Write-Host "1. Configurer clés API (.env)" -ForegroundColor White
Write-Host "2. Implémenter logique métier dans routes" -ForegroundColor White
Write-Host "3. Tester avec données réelles" -ForegroundColor White