# =====================================================
# SCRIPT DE CRÉATION DES BUCKETS SUPABASE STORAGE
# Dashboard Vendeur - Teranga Foncier
# Date: 6 Octobre 2025
# =====================================================

Write-Host "🚀 Création des buckets Supabase Storage..." -ForegroundColor Cyan
Write-Host ""

# Vérifier les variables d'environnement
$SUPABASE_URL = $env:VITE_SUPABASE_URL
$SUPABASE_KEY = $env:VITE_SUPABASE_SERVICE_ROLE_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_KEY) {
    Write-Host "❌ ERREUR: Variables d'environnement manquantes!" -ForegroundColor Red
    Write-Host "Veuillez définir:" -ForegroundColor Yellow
    Write-Host "  - VITE_SUPABASE_URL" -ForegroundColor Yellow
    Write-Host "  - VITE_SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ou utilisez la console Supabase directement." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Variables d'environnement détectées" -ForegroundColor Green
Write-Host "📍 URL: $SUPABASE_URL" -ForegroundColor Gray
Write-Host ""

# Fonction pour créer un bucket
function Create-StorageBucket {
    param(
        [string]$BucketId,
        [string]$BucketName,
        [bool]$IsPublic,
        [int]$FileSizeLimit,
        [string[]]$AllowedMimeTypes
    )
    
    Write-Host "📦 Création du bucket: $BucketName..." -ForegroundColor Cyan
    
    $body = @{
        id = $BucketId
        name = $BucketName
        public = $IsPublic
        file_size_limit = $FileSizeLimit
        allowed_mime_types = $AllowedMimeTypes
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/storage/v1/bucket" `
            -Method Post `
            -Headers @{
                "apikey" = $SUPABASE_KEY
                "Authorization" = "Bearer $SUPABASE_KEY"
                "Content-Type" = "application/json"
            } `
            -Body $body
        
        Write-Host "  ✅ Bucket '$BucketName' créé avec succès!" -ForegroundColor Green
        return $true
    }
    catch {
        if ($_.Exception.Response.StatusCode -eq 409) {
            Write-Host "  ⚠️  Bucket '$BucketName' existe déjà (ignoré)" -ForegroundColor Yellow
        }
        else {
            Write-Host "  ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        }
        return $false
    }
}

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  CRÉATION DES BUCKETS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# 1. parcel-images (Public - 10 MB)
Create-StorageBucket `
    -BucketId "parcel-images" `
    -BucketName "parcel-images" `
    -IsPublic $true `
    -FileSizeLimit 10485760 `
    -AllowedMimeTypes @(
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/heic",
        "image/heif"
    )

Start-Sleep -Milliseconds 500

# 2. parcel-documents (Privé - 20 MB)
Create-StorageBucket `
    -BucketId "parcel-documents" `
    -BucketName "parcel-documents" `
    -IsPublic $false `
    -FileSizeLimit 20971520 `
    -AllowedMimeTypes @(
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/jpg",
        "image/png"
    )

Start-Sleep -Milliseconds 500

# 3. profile-avatars (Public - 5 MB)
Create-StorageBucket `
    -BucketId "profile-avatars" `
    -BucketName "profile-avatars" `
    -IsPublic $true `
    -FileSizeLimit 5242880 `
    -AllowedMimeTypes @(
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    )

Start-Sleep -Milliseconds 500

# 4. transaction-receipts (Privé - 10 MB)
Create-StorageBucket `
    -BucketId "transaction-receipts" `
    -BucketName "transaction-receipts" `
    -IsPublic $false `
    -FileSizeLimit 10485760 `
    -AllowedMimeTypes @(
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png"
    )

Start-Sleep -Milliseconds 500

# 5. verification-documents (Privé - 15 MB)
Create-StorageBucket `
    -BucketId "verification-documents" `
    -BucketName "verification-documents" `
    -IsPublic $false `
    -FileSizeLimit 15728640 `
    -AllowedMimeTypes @(
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png"
    )

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  RÉSUMÉ DES BUCKETS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Lister les buckets
Write-Host "📋 Liste des buckets créés:" -ForegroundColor Cyan
Write-Host ""

try {
    $buckets = Invoke-RestMethod -Uri "$SUPABASE_URL/storage/v1/bucket" `
        -Method Get `
        -Headers @{
            "apikey" = $SUPABASE_KEY
            "Authorization" = "Bearer $SUPABASE_KEY"
        }
    
    $buckets | ForEach-Object {
        $visibility = if ($_.public) { "🌍 Public" } else { "🔒 Privé" }
        $sizeInMB = [math]::Round($_.file_size_limit / 1048576, 1)
        
        Write-Host "  ✅ $($_.name)" -ForegroundColor Green
        Write-Host "     Visibilité: $visibility" -ForegroundColor Gray
        Write-Host "     Taille max: ${sizeInMB} MB" -ForegroundColor Gray
        Write-Host "     Créé le: $($_.created_at)" -ForegroundColor Gray
        Write-Host ""
    }
}
catch {
    Write-Host "  ⚠️  Impossible de lister les buckets" -ForegroundColor Yellow
}

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  PROCHAINES ÉTAPES" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Exécuter le script SQL pour les RLS policies:" -ForegroundColor Yellow
Write-Host "   supabase-migrations/CREATE_STORAGE_BUCKETS.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Tester l'upload depuis le dashboard vendeur:" -ForegroundColor Yellow
Write-Host "   - Ajouter un terrain avec photos" -ForegroundColor Gray
Write-Host "   - Vérifier l'upload des documents" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Vérifier les permissions dans Supabase Dashboard:" -ForegroundColor Yellow
Write-Host "   Storage > Policies" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Script terminé avec succès!" -ForegroundColor Green
Write-Host ""
