# ======================================================================
# EXÉCUTION DU SCRIPT DE CRÉATION DES PROFILS
# Exécute create-profiles-only-new-roles.sql via Supabase
# ======================================================================

Write-Host "📋 === CRÉATION DES PROFILS POUR LES NOUVEAUX COMPTES ===" -ForegroundColor Green
Write-Host ""

# Configuration Supabase
$SUPABASE_URL = Read-Host "🔗 Entrez votre URL Supabase (ex: https://votre-projet.supabase.co)"
$SUPABASE_SERVICE_KEY = Read-Host "🔑 Entrez votre Service Role Key Supabase" -AsSecureString
$SERVICE_KEY = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($SUPABASE_SERVICE_KEY))

Write-Host ""
Write-Host "⚙️ Lecture du script SQL..." -ForegroundColor Yellow

# Lire le contenu du script SQL
if (Test-Path "create-profiles-only-new-roles.sql") {
    $sqlScript = Get-Content "create-profiles-only-new-roles.sql" -Raw
    Write-Host "✅ Script SQL chargé ($(($sqlScript.Length)) caractères)" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur: create-profiles-only-new-roles.sql non trouvé" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Exécution du script de création des profils..." -ForegroundColor Cyan

# Préparer les headers pour l'API
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $SERVICE_KEY"
    "apikey" = $SERVICE_KEY
}

# Préparer le body avec le script SQL
$body = @{
    query = $sqlScript
} | ConvertTo-Json -Depth 3

try {
    # Exécuter le script SQL via l'API Supabase
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec" -Method Post -Body $body -Headers $headers -ErrorAction Stop
    
    Write-Host "✅ Script exécuté avec succès !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Résultat de l'exécution:" -ForegroundColor Yellow
    if ($response) {
        $response | ConvertTo-Json -Depth 3 | Write-Host
    }
    
} catch {
    Write-Host "⚠️ Exécution via API échouée. Tentative alternative..." -ForegroundColor Yellow
    
    # Alternative : utiliser psql si disponible
    try {
        Write-Host "🔄 Tentative d'exécution via psql..." -ForegroundColor Cyan
        
        # Construire l'URL de connexion PostgreSQL
        $dbUrl = $SUPABASE_URL -replace "https://", ""
        $dbUrl = "postgresql://postgres:$SERVICE_KEY@$dbUrl:5432/postgres"
        
        # Exécuter avec psql
        $result = & psql $dbUrl -f "create-profiles-only-new-roles.sql" 2>&1
        
        Write-Host "✅ Script exécuté via psql !" -ForegroundColor Green
        Write-Host $result
        
    } catch {
        Write-Host "❌ Erreur lors de l'exécution: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "🔧 Solutions manuelles:" -ForegroundColor Yellow
        Write-Host "1. Ouvrez Supabase Dashboard" -ForegroundColor White
        Write-Host "2. Allez dans SQL Editor" -ForegroundColor White
        Write-Host "3. Copiez le contenu de create-profiles-only-new-roles.sql" -ForegroundColor White
        Write-Host "4. Exécutez le script manuellement" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "✨ === FIN DE L'EXÉCUTION ===" -ForegroundColor Green