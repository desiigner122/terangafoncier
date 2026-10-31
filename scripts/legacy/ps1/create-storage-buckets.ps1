# =============================================
# SCRIPT DE CRÉATION DES BUCKETS SUPABASE
# Exécution via API REST Supabase Storage
# =============================================

Write-Host "🚀 CRÉATION DES BUCKETS SUPABASE STORAGE" -ForegroundColor Cyan
Write-Host "=========================================`n"

# Charger les variables d'environnement
$envFile = ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^\s*([^#][^=]+)=(.+)$") {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
} else {
    Write-Host "❌ Fichier .env.local introuvable !" -ForegroundColor Red
    exit 1
}

$SUPABASE_URL = $env:VITE_SUPABASE_URL
$SUPABASE_SERVICE_KEY = $env:VITE_SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_SERVICE_KEY) {
    Write-Host "❌ Variables SUPABASE_URL ou SERVICE_KEY manquantes !" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Configuration chargée" -ForegroundColor Green
Write-Host "   URL: $SUPABASE_URL`n"

# =============================================
# 1. CRÉER LE BUCKET PROPERTY-PHOTOS (Public)
# =============================================

Write-Host "📸 Création du bucket 'property-photos'..." -ForegroundColor Yellow

$bodyPhotos = @{
    id = "property-photos"
    name = "property-photos"
    public = $true
    file_size_limit = 5242880  # 5MB
    allowed_mime_types = @("image/jpeg", "image/png", "image/webp", "image/jpg")
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod `
        -Uri "$SUPABASE_URL/storage/v1/bucket" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
            "Content-Type" = "application/json"
            "apikey" = $SUPABASE_SERVICE_KEY
        } `
        -Body $bodyPhotos `
        -ErrorAction Stop

    Write-Host "✅ Bucket 'property-photos' créé avec succès !" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*409*" -or $_.Exception.Message -like "*already exists*") {
        Write-Host "⚠️  Bucket 'property-photos' existe déjà" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erreur lors de la création: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# =============================================
# 2. CRÉER LE BUCKET PROPERTY-DOCUMENTS (Privé)
# =============================================

Write-Host "`n📄 Création du bucket 'property-documents'..." -ForegroundColor Yellow

$bodyDocs = @{
    id = "property-documents"
    name = "property-documents"
    public = $false  # Privé !
    file_size_limit = 10485760  # 10MB
    allowed_mime_types = @("application/pdf", "image/jpeg", "image/png", "image/jpg")
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod `
        -Uri "$SUPABASE_URL/storage/v1/bucket" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
            "Content-Type" = "application/json"
            "apikey" = $SUPABASE_SERVICE_KEY
        } `
        -Body $bodyDocs `
        -ErrorAction Stop

    Write-Host "✅ Bucket 'property-documents' créé avec succès !" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*409*" -or $_.Exception.Message -like "*already exists*") {
        Write-Host "⚠️  Bucket 'property-documents' existe déjà" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Erreur lors de la création: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# =============================================
# 3. VÉRIFIER LES BUCKETS CRÉÉS
# =============================================

Write-Host "`n🔍 Vérification des buckets..." -ForegroundColor Cyan

try {
    $buckets = Invoke-RestMethod `
        -Uri "$SUPABASE_URL/storage/v1/bucket" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
            "apikey" = $SUPABASE_SERVICE_KEY
        } `
        -ErrorAction Stop

    Write-Host "`n📦 BUCKETS DISPONIBLES:" -ForegroundColor Green
    $buckets | Where-Object { $_.id -in @("property-photos", "property-documents") } | ForEach-Object {
        $publicStatus = if ($_.public) { "Public ✅" } else { "Privé 🔒" }
        $sizeLimit = [math]::Round($_.file_size_limit / 1MB, 2)
        Write-Host "   • $($_.name) - $publicStatus - Limite: $sizeLimit MB"
    }
} catch {
    Write-Host "❌ Erreur lors de la vérification: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ TERMINÉ !" -ForegroundColor Green
Write-Host "Les buckets sont prêts pour l'upload de photos et documents.`n"
