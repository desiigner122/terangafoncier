# ======================================================================
# CRÉATION AUTOMATIQUE DES COMPTES POUR LES RÔLES RESTANTS
# Script PowerShell pour créer les comptes manquants
# ======================================================================

# Configuration Supabase
$SUPABASE_URL = "https://rpwsqgpyzdxcjkgixhqd.supabase.co"
$SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwd3NxZ3B5emR4Y2prZ2l4aHFkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDc0NTczNSwiZXhwIjoyMDMwMzIxNzM1fQ.0iyJ9RCf9e9vv3OdKXs4MQaIOr5_4WRQ0dKYRWOx_rw"

Write-Host "🚀 CRÉATION DES COMPTES POUR LES RÔLES RESTANTS" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Yellow

# Définir les comptes manquants pour chaque rôle
$comptesACreer = @(
    # PARTICULIERS (2 comptes)
    @{
        role = "particulier"
        email = "family.diallo@teranga-foncier.sn"
        full_name = "Famille Diallo"
        phone = "+221 77 123 45 01"
        organization = "Famille Diallo"
    },
    @{
        role = "particulier"
        email = "ahmadou.ba@teranga-foncier.sn"
        full_name = "Ahmadou Ba"
        phone = "+221 77 123 45 02"
        organization = "Particulier"
    },

    # VENDEURS (2 comptes)
    @{
        role = "vendeur"
        email = "heritage.fall@teranga-foncier.sn"
        full_name = "Héritage Fall"
        phone = "+221 77 123 45 03"
        organization = "Succession Fall"
    },
    @{
        role = "vendeur"
        email = "domaine.seck@teranga-foncier.sn"
        full_name = "Domaine Seck"
        phone = "+221 77 123 45 04"
        organization = "Propriété Familiale Seck"
    },

    # PROMOTEURS (2 comptes)
    @{
        role = "promoteur"
        email = "urban.developers@teranga-foncier.sn"
        full_name = "Urban Developers Sénégal"
        phone = "+221 33 123 45 05"
        organization = "Urban Developers"
    },
    @{
        role = "promoteur"
        email = "sahel.construction@teranga-foncier.sn"
        full_name = "Sahel Construction"
        phone = "+221 33 123 45 06"
        organization = "Sahel Construction SARL"
    },

    # BANQUES (2 comptes)
    @{
        role = "banque"
        email = "financement.boa@teranga-foncier.sn"
        full_name = "BOA Sénégal - Financement"
        phone = "+221 33 123 45 07"
        organization = "Bank of Africa Sénégal"
    },
    @{
        role = "banque"
        email = "credit.agricole@teranga-foncier.sn"
        full_name = "Crédit Agricole Sénégal"
        phone = "+221 33 123 45 08"
        organization = "Crédit Agricole du Sénégal"
    },

    # NOTAIRES (2 comptes)
    @{
        role = "notaire"
        email = "etude.diouf@teranga-foncier.sn"
        full_name = "Étude Notariale Diouf"
        phone = "+221 33 123 45 09"
        organization = "Étude Me Diouf"
    },
    @{
        role = "notaire"
        email = "chambre.notaires@teranga-foncier.sn"
        full_name = "Chambre des Notaires"
        phone = "+221 33 123 45 10"
        organization = "Chambre Régionale des Notaires"
    },

    # AGENTS FONCIERS (2 comptes)
    @{
        role = "agent_foncier"
        email = "foncier.expert@teranga-foncier.sn"
        full_name = "Foncier Expert Conseil"
        phone = "+221 77 123 45 11"
        organization = "Cabinet Foncier Expert"
    },
    @{
        role = "agent_foncier"
        email = "teranga.immobilier@teranga-foncier.sn"
        full_name = "Teranga Immobilier"
        phone = "+221 77 123 45 12"
        organization = "Agence Teranga Immobilier"
    }
)

Write-Host "📋 COMPTES À CRÉER: $($comptesACreer.Count) comptes" -ForegroundColor Cyan
Write-Host "🎯 RÔLES COUVERTS: particulier, vendeur, promoteur, banque, notaire, agent_foncier" -ForegroundColor Cyan
Write-Host ""

$comptesCreesAvecSucces = 0
$erreursRencontrees = 0

foreach ($compte in $comptesACreer) {
    Write-Host "⏳ Création: $($compte.full_name) [$($compte.role)]..." -ForegroundColor Yellow
    
    $userData = @{
        email = $compte.email
        password = "password123"
        email_confirm = $true
        user_metadata = @{
            full_name = $compte.full_name
            role = $compte.role
            phone = $compte.phone
            organization = $compte.organization
        }
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/auth/v1/admin/users" `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $SUPABASE_SERVICE_KEY"
                "Content-Type" = "application/json"
            } `
            -Body $userData
            
        if ($response.id) {
            Write-Host "   ✅ SUCCÈS: $($compte.full_name)" -ForegroundColor Green
            $comptesCreesAvecSucces++
        }
    }
    catch {
        Write-Host "   ❌ ERREUR: $($compte.full_name) - $($_.Exception.Message)" -ForegroundColor Red
        $erreursRencontrees++
    }
    
    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "📊 RÉSUMÉ DE LA CRÉATION:" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Yellow
Write-Host "✅ Comptes créés avec succès: $comptesCreesAvecSucces" -ForegroundColor Green
Write-Host "❌ Erreurs rencontrées: $erreursRencontrees" -ForegroundColor Red
Write-Host "📋 Total traité: $($comptesACreer.Count)" -ForegroundColor Cyan

if ($comptesCreesAvecSucces -eq $comptesACreer.Count) {
    Write-Host ""
    Write-Host "🎉 MISSION ACCOMPLIE! TOUS LES COMPTES CRÉÉS!" -ForegroundColor Green
    Write-Host "🔑 Mot de passe pour tous: password123" -ForegroundColor Yellow
    Write-Host "📧 Les emails sont confirmés automatiquement" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "⚠️  ATTENTION: Certains comptes n'ont pas pu être créés" -ForegroundColor Yellow
    Write-Host "🔄 Vérifiez les erreurs et relancez si nécessaire" -ForegroundColor Yellow
}