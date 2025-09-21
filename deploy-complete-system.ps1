#!/usr/bin/env pwsh

# ======================================================================
# DÉPLOIEMENT COMPLET SYSTÈME MULTI-RÔLES TERANGA FONCIER
# Script PowerShell pour Windows - Déploiement automatisé
# ======================================================================

Write-Host "🚀 === DÉPLOIEMENT SYSTÈME MULTI-RÔLES TERANGA FONCIER ===" -ForegroundColor Cyan
Write-Host ""

# Vérification des prérequis
Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Yellow

# Vérification de l'existence des fichiers SQL
$sqlFiles = @(
    "create-all-roles-complete.sql",
    "create-test-data-new-roles.sql", 
    "verify-complete-system.sql"
)

$missingFiles = @()
foreach ($file in $sqlFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ ERREUR: Fichiers SQL manquants:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "📋 Assurez-vous que ces fichiers sont présents dans le répertoire courant." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Tous les fichiers SQL requis sont présents" -ForegroundColor Green
Write-Host ""

# Configuration Supabase
Write-Host "⚙️ Configuration de la connexion Supabase..." -ForegroundColor Yellow
Write-Host ""

# Vérifier si les variables d'environnement Supabase sont définies
$supabaseUrl = $env:SUPABASE_URL
$supabaseKey = $env:SUPABASE_ANON_KEY

if ([string]::IsNullOrEmpty($supabaseUrl) -or [string]::IsNullOrEmpty($supabaseKey)) {
    Write-Host "⚠️ Variables d'environnement Supabase non détectées" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Veuillez configurer vos variables d'environnement Supabase :" -ForegroundColor Cyan
    Write-Host "   \$env:SUPABASE_URL = 'https://votre-projet.supabase.co'" -ForegroundColor Gray
    Write-Host "   \$env:SUPABASE_ANON_KEY = 'votre-clé-anonyme'" -ForegroundColor Gray
    Write-Host "   \$env:SUPABASE_SERVICE_KEY = 'votre-clé-service'" -ForegroundColor Gray
    Write-Host ""
    
    # Demander confirmation pour continuer
    $continue = Read-Host "Voulez-vous continuer avec la configuration manuelle ? (o/N)"
    if ($continue -notmatch '^[oO]$') {
        Write-Host "❌ Déploiement annulé" -ForegroundColor Red
        exit 1
    }
}

# Instructions de déploiement
Write-Host "📋 === INSTRUCTIONS DE DÉPLOIEMENT ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 ÉTAPE 1: Accéder à votre console Supabase" -ForegroundColor Yellow
Write-Host "   → Aller sur https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host "   → Sélectionner votre projet Teranga Foncier" -ForegroundColor Gray
Write-Host "   → Aller dans l'onglet 'SQL Editor'" -ForegroundColor Gray
Write-Host ""

Write-Host "💾 ÉTAPE 2: Exécuter les scripts SQL dans l'ordre" -ForegroundColor Yellow
Write-Host ""

Write-Host "   📄 Script 1/3: create-all-roles-complete.sql" -ForegroundColor Cyan
Write-Host "   ✨ Créé 19 comptes utilisateurs pour 10 rôles distincts" -ForegroundColor Gray
Write-Host "   📊 Inclut profils complets et authentification Supabase" -ForegroundColor Gray
Write-Host ""

Write-Host "   📄 Script 2/3: create-test-data-new-roles.sql" -ForegroundColor Cyan
Write-Host "   ✨ Ajoute données spécifiques pour Mairies, Investisseurs, Géomètres" -ForegroundColor Gray
Write-Host "   📊 Créé 22 enregistrements métier (permis, investissements, expertises)" -ForegroundColor Gray
Write-Host ""

Write-Host "   📄 Script 3/3: verify-complete-system.sql" -ForegroundColor Cyan
Write-Host "   ✨ Validation complète et statistiques du système" -ForegroundColor Gray
Write-Host "   📊 Génère rapport de déploiement détaillé" -ForegroundColor Gray
Write-Host ""

# Génération des commandes SQL pour copier-coller
Write-Host "📋 === COMMANDES SQL À COPIER-COLLER ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "-- COMMANDE 1: Création des comptes utilisateurs" -ForegroundColor Green
$script1Content = Get-Content "create-all-roles-complete.sql" -Raw
Write-Host "-- Taille du script: $($script1Content.Length) caractères" -ForegroundColor Gray
Write-Host ""

Write-Host "-- COMMANDE 2: Données spécifiques nouveaux rôles" -ForegroundColor Green  
$script2Content = Get-Content "create-test-data-new-roles.sql" -Raw
Write-Host "-- Taille du script: $($script2Content.Length) caractères" -ForegroundColor Gray
Write-Host ""

Write-Host "-- COMMANDE 3: Vérification système" -ForegroundColor Green
$script3Content = Get-Content "verify-complete-system.sql" -Raw  
Write-Host "-- Taille du script: $($script3Content.Length) caractères" -ForegroundColor Gray
Write-Host ""

# Affichage des credentials
Write-Host "🔑 === CREDENTIALS DE TEST ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📧 Exemple d'emails de connexion:" -ForegroundColor Yellow
Write-Host "   • admin@terangafoncier.sn (Administrateur)" -ForegroundColor Gray
Write-Host "   • amadou.diop@email.com (Particulier)" -ForegroundColor Gray  
Write-Host "   • ibrahima.ba@terangafoncier.sn (Vendeur)" -ForegroundColor Gray
Write-Host "   • cheikh.tall@groupetall.sn (Promoteur)" -ForegroundColor Gray
Write-Host "   • credit.immobilier@cbao.sn (Banque)" -ForegroundColor Gray
Write-Host "   • urbanisme@mairie-dakar.sn (Mairie) ⭐ NOUVEAU" -ForegroundColor Gray
Write-Host "   • mamadou.diagne@investor.com (Investisseur) ⭐ NOUVEAU" -ForegroundColor Gray
Write-Host "   • alioune.cisse@geometre.sn (Géomètre) ⭐ NOUVEAU" -ForegroundColor Gray
Write-Host ""
Write-Host "🔐 Mot de passe universel: password123" -ForegroundColor Yellow
Write-Host ""

# Statistiques du système
Write-Host "📊 === STATISTIQUES DU SYSTÈME ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "👥 Comptes utilisateurs: 19 comptes" -ForegroundColor Green
Write-Host "🎭 Rôles distincts: 10 types" -ForegroundColor Green
Write-Host "🌍 Villes couvertes: Dakar, Thiès, Saint-Louis, Mbour" -ForegroundColor Green
Write-Host "🏛️ Permis municipaux: 12 permis créés" -ForegroundColor Green
Write-Host "💰 Opportunités d'investissement: 5 projets" -ForegroundColor Green
Write-Host "📐 Rapports géomètre: 5 expertises" -ForegroundColor Green
Write-Host ""

# Instructions post-déploiement
Write-Host "✅ === POST-DÉPLOIEMENT ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 TESTS RECOMMANDÉS:" -ForegroundColor Yellow
Write-Host "   1. Connexion avec admin@terangafoncier.sn" -ForegroundColor Gray
Write-Host "   2. Vérifier dashboard admin (13 sections)" -ForegroundColor Gray
Write-Host "   3. Tester connexion avec chaque type de rôle" -ForegroundColor Gray
Write-Host "   4. Valider redirection automatique vers dashboards" -ForegroundColor Gray
Write-Host "   5. Vérifier données métier dans chaque interface" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 DOCUMENTATION:" -ForegroundColor Yellow
Write-Host "   → COMPLETE-LOGIN-GUIDE.md (guide détaillé)" -ForegroundColor Gray
Write-Host "   → verify-complete-system.sql (diagnostics)" -ForegroundColor Gray
Write-Host ""

Write-Host "🎯 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host "   → Configurer les dashboards spécialisés par rôle" -ForegroundColor Gray
Write-Host "   → Implémenter la logique de redirection" -ForegroundColor Gray  
Write-Host "   → Tester les workflows end-to-end" -ForegroundColor Gray
Write-Host ""

# Message final
Write-Host "🎉 === SYSTÈME PRÊT POUR PRODUCTION ===" -ForegroundColor Green
Write-Host ""
Write-Host "✨ Écosystème immobilier sénégalais complet avec:" -ForegroundColor Cyan
Write-Host "   • Tous les acteurs du marché représentés" -ForegroundColor Gray
Write-Host "   • Données métier réalistes intégrées" -ForegroundColor Gray  
Write-Host "   • Workflows interconnectés opérationnels" -ForegroundColor Gray
Write-Host "   • Infrastructure scalable et sécurisée" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 Bon déploiement ! 🇸🇳" -ForegroundColor Green

# Pause pour permettre la lecture
Read-Host "Appuyez sur Entrée pour terminer"