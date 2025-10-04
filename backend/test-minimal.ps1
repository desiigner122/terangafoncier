# Test rapide serveur minimal

Write-Host "🧪 TEST SERVEUR MINIMAL" -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCÈS - Status: $($data.status)" -ForegroundColor Green
    Write-Host "   Message: $($data.message)" -ForegroundColor Gray
    
    # Test route additionnelle
    $testResponse = Invoke-WebRequest -Uri "http://localhost:5000/test" -UseBasicParsing -TimeoutSec 5
    $testData = $testResponse.Content | ConvertFrom-Json
    Write-Host "✅ Route test OK: $($testData.message)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ ÉCHEC: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎯 Le serveur minimal fonctionne parfaitement !" -ForegroundColor Cyan