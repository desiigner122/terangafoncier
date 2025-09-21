# ======================================================================
# SCRIPT AUTOMATIQUE DE CRÉATION DES COMPTES - NOUVEAUX RÔLES
# Création automatique via API Supabase des 6 comptes manquants
# ======================================================================

Write-Host "🚀 === CRÉATION AUTOMATIQUE DES COMPTES TERANGA FONCIER ===" -ForegroundColor Green
Write-Host ""

# Configuration Supabase - À RENSEIGNER
$SUPABASE_URL = Read-Host "🔗 Entrez votre URL Supabase (ex: https://votre-projet.supabase.co)"
$SUPABASE_SERVICE_KEY = Read-Host "🔑 Entrez votre Service Role Key Supabase" -AsSecureString
$SERVICE_KEY = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($SUPABASE_SERVICE_KEY))

Write-Host ""
Write-Host "⚙️ Configuration Supabase validée" -ForegroundColor Yellow
Write-Host ""

# Fonction pour créer un compte via API Supabase
function Create-SupabaseUser {
    param(
        [string]$Email,
        [string]$Password,
        [string]$FullName,
        [string]$Role,
        [hashtable]$ExtraMetadata = @{}
    )
    
    $metadata = @{
        full_name = $FullName
        role = $Role
    }
    
    # Ajouter les métadonnées supplémentaires
    foreach ($key in $ExtraMetadata.Keys) {
        $metadata[$key] = $ExtraMetadata[$key]
    }
    
    $body = @{
        email = $Email
        password = $Password
        email_confirm = $true
        user_metadata = $metadata
    } | ConvertTo-Json -Depth 3
    
    $headers = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $SERVICE_KEY"
        "apikey" = $SERVICE_KEY
    }
    
    try {
        Write-Host "   📧 Création: $Email ($FullName)" -ForegroundColor Cyan
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users" -Method Post -Body $body -Headers $headers
        Write-Host "   ✅ Compte créé avec succès - ID: $($response.id)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "   ❌ Erreur lors de la création: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# ======================================================================
# CRÉATION DES COMPTES PAR RÔLE
# ======================================================================

Write-Host "🏛️ === CRÉATION DES COMPTES MAIRIES ===" -ForegroundColor Blue
Write-Host ""

# MAIRIE 1 : Dakar
$mairie1 = Create-SupabaseUser -Email "mairie.dakar@teranga-foncier.sn" -Password "password123" -FullName "Mairie de Dakar" -Role "mairie" -ExtraMetadata @{
    commune = "Dakar"
    region = "Dakar"
    population = 1278469
    maire = "Barthélémy Dias"
}

Start-Sleep -Seconds 1

# MAIRIE 2 : Thiès
$mairie2 = Create-SupabaseUser -Email "mairie.thies@teranga-foncier.sn" -Password "password123" -FullName "Mairie de Thiès" -Role "mairie" -ExtraMetadata @{
    commune = "Thiès"
    region = "Thiès"
    population = 320000
    maire = "Talla Sylla"
}

Write-Host ""
Write-Host "💰 === CRÉATION DES COMPTES INVESTISSEURS ===" -ForegroundColor Blue
Write-Host ""

Start-Sleep -Seconds 1

# INVESTISSEUR 1 : Fonds Souverain
$investisseur1 = Create-SupabaseUser -Email "fonds.souverain@teranga-foncier.sn" -Password "password123" -FullName "Fonds Souverain d'Investissement du Sénégal" -Role "investisseur" -ExtraMetadata @{
    type_investisseur = "Fonds Souverain"
    capital_disponible = 50000000000
    secteurs_preferes = "Immobilier,Infrastructure,Agriculture"
    risk_profile = "Modéré"
}

Start-Sleep -Seconds 1

# INVESTISSEUR 2 : Groupe Privé
$investisseur2 = Create-SupabaseUser -Email "atlantique.capital@teranga-foncier.sn" -Password "password123" -FullName "Atlantique Capital Partners" -Role "investisseur" -ExtraMetadata @{
    type_investisseur = "Fonds Privé"
    capital_disponible = 15000000000
    secteurs_preferes = "Immobilier Résidentiel,Commercial"
    risk_profile = "Agressif"
}

Write-Host ""
Write-Host "📐 === CRÉATION DES COMPTES GÉOMÈTRES ===" -ForegroundColor Blue
Write-Host ""

Start-Sleep -Seconds 1

# GÉOMÈTRE 1 : Cabinet Sénégal
$geometre1 = Create-SupabaseUser -Email "cabinet.ndiaye@teranga-foncier.sn" -Password "password123" -FullName "Cabinet Géomètre Ndiaye & Associés" -Role "geometre" -ExtraMetadata @{
    numero_ordre = "GEO-001-SN"
    specialites = "Cadastre,Topographie,Expertise Foncière"
    experience_annees = 15
    zone_intervention = "Dakar,Thiès,Saint-Louis"
}

Start-Sleep -Seconds 1

# GÉOMÈTRE 2 : Cabinet International
$geometre2 = Create-SupabaseUser -Email "geowest.africa@teranga-foncier.sn" -Password "password123" -FullName "GeoWest Africa SARL" -Role "geometre" -ExtraMetadata @{
    numero_ordre = "GEO-002-SN"
    specialites = "Géodésie,SIG,Photogrammétrie"
    experience_annees = 8
    zone_intervention = "Tout le Sénégal"
}

# ======================================================================
# RÉSUMÉ DE LA CRÉATION
# ======================================================================

Write-Host ""
Write-Host "📊 === RÉSUMÉ DE LA CRÉATION AUTOMATIQUE ===" -ForegroundColor Green
Write-Host ""

$comptes_crees = 0
$comptes_echecs = 0

# Compter les succès et échecs
$comptes = @($mairie1, $mairie2, $investisseur1, $investisseur2, $geometre1, $geometre2)
foreach ($compte in $comptes) {
    if ($compte -ne $null) {
        $comptes_crees++
    } else {
        $comptes_echecs++
    }
}

Write-Host "✅ Comptes créés avec succès: $comptes_crees/6" -ForegroundColor Green
Write-Host "❌ Échecs de création: $comptes_echecs/6" -ForegroundColor $(if($comptes_echecs -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($comptes_crees -eq 6) {
    Write-Host "🎉 CRÉATION AUTOMATIQUE RÉUSSIE !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
    Write-Host "1. Exécuter create-profiles-only-new-roles.sql dans Supabase" -ForegroundColor White
    Write-Host "2. Lancer verify-complete-system.sql pour vérification" -ForegroundColor White
    Write-Host "3. Tester la connexion avec chaque compte (password123)" -ForegroundColor White
    Write-Host ""
    Write-Host "🔑 IDENTIFIANTS CRÉÉS:" -ForegroundColor Yellow
    Write-Host "mairie.dakar@teranga-foncier.sn | password123" -ForegroundColor White
    Write-Host "mairie.thies@teranga-foncier.sn | password123" -ForegroundColor White
    Write-Host "fonds.souverain@teranga-foncier.sn | password123" -ForegroundColor White
    Write-Host "atlantique.capital@teranga-foncier.sn | password123" -ForegroundColor White
    Write-Host "cabinet.ndiaye@teranga-foncier.sn | password123" -ForegroundColor White
    Write-Host "geowest.africa@teranga-foncier.sn | password123" -ForegroundColor White
} else {
    Write-Host "⚠️ CRÉATION PARTIELLE - Vérifiez les erreurs ci-dessus" -ForegroundColor Yellow
    Write-Host "Relancez le script ou créez manuellement les comptes manquants" -ForegroundColor White
}

Write-Host ""
Write-Host "✨ === FIN DE LA CRÉATION AUTOMATIQUE ===" -ForegroundColor Green