#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Script de build et déploiement production pour TerangaFoncier

.DESCRIPTION
    Ce script prépare l'application pour la production en:
    1. Vérifiant les pré-requis
    2. Installant les dépendances
    3. Buildant l'application
    4. Vérifiant la qualité du build
    5. Préparant le déploiement

.NOTES
    Auteur: TerangaFoncier DevOps
    Date: 2025
#>

$ErrorActionPreference = "Stop"

# Couleurs
$colors = @{
    Reset = "`e[0m"
    Green = "`e[32m"
    Red = "`e[31m"
    Yellow = "`e[33m"
    Cyan = "`e[36m"
    Magenta = "`e[35m"
    Bold = "`e[1m"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "Reset"
    )
    Write-Host "$($colors[$Color])$Message$($colors.Reset)"
}

function Write-Step {
    param([string]$Message)
    Write-ColorOutput "`n══════════════════════════════════════════════════════════════" "Magenta"
    Write-ColorOutput "  $Message" "Magenta"
    Write-ColorOutput "══════════════════════════════════════════════════════════════`n" "Magenta"
}

function Test-Command {
    param([string]$Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Banner
Write-ColorOutput "`n╔═══════════════════════════════════════════════════════════════╗" "Bold"
Write-ColorOutput "║         BUILD & DÉPLOIEMENT PRODUCTION                      ║" "Bold"
Write-ColorOutput "║         TerangaFoncier Platform                             ║" "Bold"
Write-ColorOutput "╚═══════════════════════════════════════════════════════════════╝`n" "Bold"

# ÉTAPE 1: Vérification des pré-requis
Write-Step "ÉTAPE 1/5: Vérification des pré-requis"

Write-Host "Vérification Node.js... " -NoNewline
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-ColorOutput "✓ $nodeVersion" "Green"
} else {
    Write-ColorOutput "✗ Node.js non installé" "Red"
    Write-ColorOutput "Installez Node.js depuis https://nodejs.org" "Yellow"
    exit 1
}

Write-Host "Vérification npm... " -NoNewline
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-ColorOutput "✓ v$npmVersion" "Green"
} else {
    Write-ColorOutput "✗ npm non installé" "Red"
    exit 1
}

Write-Host "Vérification fichier .env... " -NoNewline
if (Test-Path ".env") {
    Write-ColorOutput "✓ Présent" "Green"
    
    # Vérifier les variables critiques
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "VITE_SUPABASE_URL" -and $envContent -match "VITE_SUPABASE_ANON_KEY") {
        Write-ColorOutput "  ✓ Variables Supabase configurées" "Green"
    } else {
        Write-ColorOutput "  ✗ Variables Supabase manquantes" "Red"
        exit 1
    }
} else {
    Write-ColorOutput "✗ Fichier .env manquant" "Red"
    Write-ColorOutput "Créez un fichier .env avec vos variables Supabase" "Yellow"
    exit 1
}

# ÉTAPE 2: Installation des dépendances
Write-Step "ÉTAPE 2/5: Installation des dépendances"

Write-ColorOutput "Installation en cours..." "Cyan"
try {
    npm install --silent
    Write-ColorOutput "✓ Dépendances installées avec succès" "Green"
} catch {
    Write-ColorOutput "✗ Erreur lors de l'installation des dépendances" "Red"
    Write-ColorOutput $_.Exception.Message "Red"
    exit 1
}

# ÉTAPE 3: Build de production
Write-Step "ÉTAPE 3/5: Build de production"

Write-ColorOutput "Build en cours (cela peut prendre 2-3 minutes)..." "Cyan"
Write-ColorOutput "Mode: Production" "Yellow"
Write-ColorOutput "Optimisations: Minification, Tree-shaking, Code-splitting`n" "Yellow"

$buildStartTime = Get-Date

try {
    npm run build 2>&1 | Out-Null
    
    $buildEndTime = Get-Date
    $buildDuration = ($buildEndTime - $buildStartTime).TotalSeconds
    
    Write-ColorOutput "✓ Build réussi en $([math]::Round($buildDuration, 2)) secondes" "Green"
} catch {
    Write-ColorOutput "✗ Erreur lors du build" "Red"
    Write-ColorOutput "Exécutez 'npm run build' manuellement pour voir les détails" "Yellow"
    exit 1
}

# ÉTAPE 4: Vérification du build
Write-Step "ÉTAPE 4/5: Vérification de la qualité du build"

if (Test-Path "dist") {
    Write-ColorOutput "✓ Dossier dist/ créé" "Green"
    
    # Vérifier les fichiers critiques
    $criticalFiles = @("index.html", "assets")
    $allFound = $true
    
    foreach ($file in $criticalFiles) {
        $path = Join-Path "dist" $file
        if (Test-Path $path) {
            Write-ColorOutput "  ✓ $file présent" "Green"
        } else {
            Write-ColorOutput "  ✗ $file manquant" "Red"
            $allFound = $false
        }
    }
    
    if (-not $allFound) {
        Write-ColorOutput "`n✗ Build incomplet" "Red"
        exit 1
    }
    
    # Taille du build
    $distSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
    $distSizeMB = [math]::Round($distSize / 1MB, 2)
    Write-ColorOutput "`n📦 Taille du build: $distSizeMB MB" "Cyan"
    
    if ($distSizeMB -gt 50) {
        Write-ColorOutput "⚠️  Build volumineux (>50MB) - Considérez l'optimisation" "Yellow"
    } else {
        Write-ColorOutput "✓ Taille optimale" "Green"
    }
    
} else {
    Write-ColorOutput "✗ Dossier dist/ non créé" "Red"
    exit 1
}

# ÉTAPE 5: Préparation déploiement
Write-Step "ÉTAPE 5/5: Options de déploiement"

Write-ColorOutput "Votre build est prêt à être déployé ! 🚀`n" "Green"
Write-ColorOutput "Choisissez votre plateforme de déploiement:`n" "Cyan"

Write-ColorOutput "Option 1: Vercel (Recommandé)" "Bold"
Write-ColorOutput "  • Installation: npm install -g vercel" "White"
Write-ColorOutput "  • Déploiement: vercel --prod" "White"
Write-ColorOutput "  • Durée: ~2 minutes`n" "White"

Write-ColorOutput "Option 2: Netlify" "Bold"
Write-ColorOutput "  • Installation: npm install -g netlify-cli" "White"
Write-ColorOutput "  • Déploiement: netlify deploy --prod --dir=dist" "White"
Write-ColorOutput "  • Durée: ~3 minutes`n" "White"

Write-ColorOutput "Option 3: Déploiement manuel" "Bold"
Write-ColorOutput "  • Uploadez le dossier dist/ sur votre serveur" "White"
Write-ColorOutput "  • Configurez un serveur web (Nginx, Apache)" "White"
Write-ColorOutput "  • Durée: ~15 minutes`n" "White"

Write-ColorOutput "Option 4: GitHub Pages" "Bold"
Write-ColorOutput "  • Commit et push le dossier dist/" "White"
Write-ColorOutput "  • Activez GitHub Pages dans les settings du repo" "White"
Write-ColorOutput "  • Durée: ~5 minutes`n" "White"

# Résumé final
Write-ColorOutput "══════════════════════════════════════════════════════════════" "Magenta"
Write-ColorOutput "  ✓ BUILD PRODUCTION TERMINÉ AVEC SUCCÈS" "Green"
Write-ColorOutput "══════════════════════════════════════════════════════════════`n" "Magenta"

Write-ColorOutput "📋 CHECKLIST AVANT DÉPLOIEMENT:" "Yellow"
Write-ColorOutput "  ☑ Variables d'environnement configurées" "Green"
Write-ColorOutput "  ☑ Build production créé" "Green"
Write-ColorOutput "  ☑ Fichiers critiques vérifiés" "Green"
Write-ColorOutput "  ☐ Schema SQL déployé dans Supabase" "Cyan"
Write-ColorOutput "  ☐ Bucket Storage créé" "Cyan"
Write-ColorOutput "  ☐ Tests utilisateurs effectués" "Cyan"
Write-ColorOutput "  ☐ Monitoring activé`n" "Cyan"

Write-ColorOutput "🎯 PROCHAINES ÉTAPES:" "Yellow"
Write-ColorOutput "  1. Déployez avec la commande de votre choix ci-dessus" "White"
Write-ColorOutput "  2. Configurez le domaine personnalisé" "White"
Write-ColorOutput "  3. Testez l'application en production" "White"
Write-ColorOutput "  4. Activez le monitoring (MonitoringService.js)"`n "White"

Write-ColorOutput "Documentation complète: docs/DEPLOIEMENT_PRODUCTION.md`n" "Cyan"

exit 0
