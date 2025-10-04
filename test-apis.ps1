# 🧪 SCRIPT DE TEST DES APIS TERANGA FONCIER
# Usage: .\test-apis.ps1

Write-Host "🧪 TEST DES APIS TERANGA FONCIER" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Yellow

$API_BASE = "http://localhost:5000/api"
$HEALTH_URL = "http://localhost:5000/health"

# Variables pour stocker les tokens et IDs
$authToken = ""
$userId = ""
$propertyId = ""

# Fonction pour faire des requêtes HTTP
function Invoke-APIRequest {
    param(
        [string]$Method = "GET",
        [string]$Url,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [string]$Description = ""
    )
    
    Write-Host "`n🔍 $Description" -ForegroundColor Yellow
    Write-Host "   $Method $Url" -ForegroundColor Gray
    
    try {
        $requestParams = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            if ($Body -is [hashtable] -or $Body -is [psobject]) {
                $requestParams.Body = $Body | ConvertTo-Json -Depth 3
            } else {
                $requestParams.Body = $Body
            }
        }
        
        $response = Invoke-RestMethod @requestParams
        Write-Host "   ✅ Succès" -ForegroundColor Green
        
        # Afficher un résumé de la réponse
        if ($response.success) {
            Write-Host "   📊 Status: $($response.success)" -ForegroundColor White
            if ($response.message) {
                Write-Host "   💬 Message: $($response.message)" -ForegroundColor White
            }
        }
        
        return $response
    }
    catch {
        Write-Host "   ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.Value__
            Write-Host "   📊 Status Code: $statusCode" -ForegroundColor Red
        }
        return $null
    }
}

Write-Host "`n🏥 1. TEST HEALTH CHECK" -ForegroundColor Magenta
Write-Host "========================" -ForegroundColor Yellow

$healthResponse = Invoke-APIRequest -Method "GET" -Url $HEALTH_URL -Description "Health Check"

if (!$healthResponse) {
    Write-Host "❌ Le serveur ne répond pas!" -ForegroundColor Red
    Write-Host "Assurez-vous que le serveur backend est démarré:" -ForegroundColor Yellow
    Write-Host "  cd backend && npm start" -ForegroundColor White
    exit 1
}

Write-Host "`n🔐 2. TEST AUTHENTIFICATION" -ForegroundColor Magenta
Write-Host "============================" -ForegroundColor Yellow

# Test d'inscription
$registerData = @{
    email = "test@teranga-foncier.com"
    password = "TestPassword123!"
    fullName = "Utilisateur Test"
    phone = "+221701234567"
    role = "particulier"
}

$registerResponse = Invoke-APIRequest -Method "POST" -Url "$API_BASE/auth/register" -Body $registerData -Description "Inscription utilisateur"

if ($registerResponse -and $registerResponse.success) {
    $userId = $registerResponse.data.user.id
    Write-Host "   👤 User ID: $userId" -ForegroundColor White
}

# Test de connexion
$loginData = @{
    email = "test@teranga-foncier.com"
    password = "TestPassword123!"
}

$loginResponse = Invoke-APIRequest -Method "POST" -Url "$API_BASE/auth/login" -Body $loginData -Description "Connexion utilisateur"

if ($loginResponse -and $loginResponse.success) {
    $authToken = $loginResponse.data.token
    Write-Host "   🔑 Token obtenu" -ForegroundColor White
} else {
    Write-Host "❌ Impossible d'obtenir le token d'authentification" -ForegroundColor Red
    Write-Host "Tests suivants seront limités" -ForegroundColor Yellow
}

# Headers avec authentification
$authHeaders = @{
    "Authorization" = "Bearer $authToken"
    "Content-Type" = "application/json"
}

Write-Host "`n👤 3. TEST GESTION UTILISATEURS" -ForegroundColor Magenta
Write-Host "===============================" -ForegroundColor Yellow

if ($authToken) {
    # Test profile utilisateur
    $profileResponse = Invoke-APIRequest -Method "GET" -Url "$API_BASE/users/profile" -Headers $authHeaders -Description "Récupération profil"
    
    # Test mise à jour profil
    $updateData = @{
        fullName = "Utilisateur Test Modifié"
        city = "Dakar"
        region = "Dakar"
    }
    
    $updateResponse = Invoke-APIRequest -Method "PUT" -Url "$API_BASE/users/profile" -Headers $authHeaders -Body $updateData -Description "Mise à jour profil"
}

Write-Host "`n🏡 4. TEST GESTION PROPRIÉTÉS" -ForegroundColor Magenta
Write-Host "=============================" -ForegroundColor Yellow

if ($authToken) {
    # Créer une propriété test
    $propertyData = @{
        title = "Villa Test à Dakar"
        description = "Belle villa de test pour les APIs"
        propertyType = "maison"
        price = 50000000
        surface = 150
        location = "Almadies, Dakar"
        city = "Dakar"
        region = "Dakar"
        latitude = 14.7167
        longitude = -17.4833
        features = @{
            bedrooms = 3
            bathrooms = 2
            parking = "yes"
        }
    }
    
    $createPropertyResponse = Invoke-APIRequest -Method "POST" -Url "$API_BASE/properties" -Headers $authHeaders -Body $propertyData -Description "Création propriété"
    
    if ($createPropertyResponse -and $createPropertyResponse.success) {
        $propertyId = $createPropertyResponse.data.property.id
        Write-Host "   🏠 Property ID: $propertyId" -ForegroundColor White
    }
    
    # Lister les propriétés
    $listResponse = Invoke-APIRequest -Method "GET" -Url "$API_BASE/properties?page=1&limit=10" -Headers $authHeaders -Description "Liste des propriétés"
    
    # Recherche de propriétés
    $searchResponse = Invoke-APIRequest -Method "GET" -Url "$API_BASE/properties/search?query=villa&city=Dakar" -Headers $authHeaders -Description "Recherche propriétés"
}

Write-Host "`n📄 5. TEST GESTION DOCUMENTS" -ForegroundColor Magenta
Write-Host "============================" -ForegroundColor Yellow

if ($authToken) {
    # Simuler upload document (sans fichier réel)
    $documentData = @{
        documentType = "titre_foncier"
        description = "Document de test"
        propertyId = $propertyId
    }
    
    # Note: Test sans fichier réel pour éviter les erreurs
    $documentsListResponse = Invoke-APIRequest -Method "GET" -Url "$API_BASE/documents" -Headers $authHeaders -Description "Liste des documents"
}

Write-Host "`n🔔 6. TEST NOTIFICATIONS" -ForegroundColor Magenta
Write-Host "=========================" -ForegroundColor Yellow

if ($authToken) {
    # Lister notifications
    $notificationsResponse = Invoke-APIRequest -Method "GET" -Url "$API_BASE/notifications" -Headers $authHeaders -Description "Liste des notifications"
    
    # Créer une notification test
    $notificationData = @{
        title = "Test Notification"
        message = "Ceci est une notification de test"
        type = "info"
        priority = "normal"
    }
    
    # Note: Endpoint pour créer notification (admin uniquement)
}

Write-Host "`n📊 7. TEST DASHBOARD" -ForegroundColor Magenta
Write-Host "====================" -ForegroundColor Yellow

if ($authToken) {
    # Vue d'ensemble dashboard
    $dashboardResponse = Invoke-APIRequest -Method "GET" -Url "$API_BASE/dashboard/overview" -Headers $authHeaders -Description "Vue d'ensemble dashboard"
    
    # Statistiques
    $statsResponse = Invoke-APIRequest -Method "GET" -Url "$API_BASE/dashboard/stats/30d" -Headers $authHeaders -Description "Statistiques 30 jours"
}

Write-Host "`n🗺️ 8. TEST CARTES" -ForegroundColor Magenta
Write-Host "=================" -ForegroundColor Yellow

if ($authToken) {
    # Recherche propriétés par zone
    $mapSearchResponse = Invoke-APIRequest -Method "GET" -Url "$API_BASE/maps/properties/zone?bounds=14.6,17.3,14.8,17.5" -Headers $authHeaders -Description "Propriétés par zone"
    
    # Géocodage
    $geocodeData = @{
        address = "Place de l'Indépendance, Dakar"
    }
    
    $geocodeResponse = Invoke-APIRequest -Method "POST" -Url "$API_BASE/maps/geocode" -Headers $authHeaders -Body $geocodeData -Description "Géocodage adresse"
}

Write-Host "`n💳 9. TEST PAIEMENTS" -ForegroundColor Magenta
Write-Host "====================" -ForegroundColor Yellow

if ($authToken) {
    # Historique paiements
    $paymentsResponse = Invoke-APIRequest -Method "GET" -Url "$API_BASE/payments/history" -Headers $authHeaders -Description "Historique paiements"
    
    # Initier un paiement test
    $paymentData = @{
        amount = 1000
        type = "verification_fee"
        description = "Test de paiement API"
        propertyId = $propertyId
    }
    
    $paymentResponse = Invoke-APIRequest -Method "POST" -Url "$API_BASE/payments/initiate" -Headers $authHeaders -Body $paymentData -Description "Initiation paiement"
}

Write-Host "`n🔗 10. TEST BLOCKCHAIN" -ForegroundColor Magenta
Write-Host "======================" -ForegroundColor Yellow

if ($authToken) {
    # Statut blockchain
    $blockchainStatusResponse = Invoke-APIRequest -Method "GET" -Url "$API_BASE/blockchain/status" -Headers $authHeaders -Description "Statut blockchain"
    
    # Vérification propriété (simulation)
    if ($propertyId) {
        $verifyResponse = Invoke-APIRequest -Method "POST" -Url "$API_BASE/blockchain/verify-property/$propertyId" -Headers $authHeaders -Description "Vérification propriété blockchain"
    }
}

Write-Host "`n🤖 11. TEST IA" -ForegroundColor Magenta
Write-Host "===============" -ForegroundColor Yellow

if ($authToken) {
    # Test évaluation propriété
    if ($propertyId) {
        $evaluationData = @{
            propertyId = $propertyId
            analysisType = "market_value"
        }
        
        $aiResponse = Invoke-APIRequest -Method "POST" -Url "$API_BASE/ai/evaluate-property" -Headers $authHeaders -Body $evaluationData -Description "Évaluation IA propriété"
    }
    
    # Test génération description
    $descriptionData = @{
        propertyType = "maison"
        surface = 150
        location = "Dakar"
        features = @{
            bedrooms = 3
            bathrooms = 2
        }
    }
    
    $descriptionResponse = Invoke-APIRequest -Method "POST" -Url "$API_BASE/ai/generate-description" -Headers $authHeaders -Body $descriptionData -Description "Génération description IA"
}

Write-Host "`n📈 RÉSUMÉ DES TESTS" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Yellow

$totalTests = 11
$successfulTests = 0

# Comptage approximatif basé sur les réponses reçues
if ($healthResponse) { $successfulTests++ }
if ($registerResponse -and $registerResponse.success) { $successfulTests++ }
if ($loginResponse -and $loginResponse.success) { $successfulTests++ }

Write-Host "🎯 Tests effectués: $totalTests modules" -ForegroundColor White
Write-Host "✅ Connexions réussies: $successfulTests" -ForegroundColor Green

if ($authToken) {
    Write-Host "🔑 Authentification: ✅ Fonctionnelle" -ForegroundColor Green
} else {
    Write-Host "🔑 Authentification: ❌ Problème détecté" -ForegroundColor Red
}

if ($propertyId) {
    Write-Host "🏠 Propriétés: ✅ Création réussie" -ForegroundColor Green
} else {
    Write-Host "🏠 Propriétés: ⚠️ Tests limités" -ForegroundColor Yellow
}

Write-Host "`n🔧 RECOMMANDATIONS:" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Yellow

Write-Host "1️⃣ Si des tests échouent:" -ForegroundColor White
Write-Host "   • Vérifiez que la base de données est configurée" -ForegroundColor Gray
Write-Host "   • Vérifiez les variables .env" -ForegroundColor Gray
Write-Host "   • Consultez les logs du serveur" -ForegroundColor Gray

Write-Host "`n2️⃣ Pour tests complets:" -ForegroundColor White
Write-Host "   • Configurez les API Keys (OpenAI, Google AI)" -ForegroundColor Gray
Write-Host "   • Configurez Redis pour le cache" -ForegroundColor Gray
Write-Host "   • Configurez les paramètres blockchain" -ForegroundColor Gray

Write-Host "`n3️⃣ Tests avancés:" -ForegroundColor White
Write-Host "   • Upload de fichiers réels" -ForegroundColor Gray
Write-Host "   • Intégration paiements mobiles" -ForegroundColor Gray
Write-Host "   • Tests de performance" -ForegroundColor Gray

Write-Host "`n✅ TESTS TERMINÉS!" -ForegroundColor Green

Write-Host "`n📚 DOCUMENTATION API:" -ForegroundColor Cyan
Write-Host "Créez un fichier README-API.md avec tous les endpoints disponibles" -ForegroundColor White