#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Déploiement automatique sur Vercel

.DESCRIPTION
    Script complet pour déployer TerangaFoncier sur Vercel en une commande
#>

$ErrorActionPreference = "Stop"

Write-Host "`n╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║         DÉPLOIEMENT AUTOMATIQUE VERCEL                      ║" -ForegroundColor Magenta
Write-Host "╚═══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Magenta

# Vérifier si Vercel CLI est installé
Write-Host "Vérification Vercel CLI... " -NoNewline
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "✗ Non installé" -ForegroundColor Red
    Write-Host "`nInstallation de Vercel CLI..." -ForegroundColor Yellow
    
    try {
        npm install -g vercel
        Write-Host "✓ Vercel CLI installé avec succès" -ForegroundColor Green
    } catch {
        Write-Host "✗ Erreur lors de l'installation" -ForegroundColor Red
        Write-Host "Installez manuellement: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✓ Installé" -ForegroundColor Green
}

# Vérifier que le build existe
if (-not (Test-Path "dist")) {
    Write-Host "`n⚠️  Dossier dist/ non trouvé" -ForegroundColor Yellow
    Write-Host "Lancement du build..." -ForegroundColor Cyan
    
    try {
        npm run build
        Write-Host "✓ Build terminé" -ForegroundColor Green
    } catch {
        Write-Host "✗ Erreur lors du build" -ForegroundColor Red
        exit 1
    }
}

# Configuration Vercel
Write-Host "`n📝 Configuration du projet..." -ForegroundColor Cyan

# Créer vercel.json si nécessaire
$vercelConfig = @{
    "version" = 2
    "builds" = @(
        @{
            "src" = "package.json"
            "use" = "@vercel/static-build"
            "config" = @{
                "distDir" = "dist"
            }
        }
    )
    "routes" = @(
        @{
            "src" = "/(.*)"
            "dest" = "/"
        }
    )
    "env" = @{
        "VITE_SUPABASE_URL" = "@vite_supabase_url"
        "VITE_SUPABASE_ANON_KEY" = "@vite_supabase_anon_key"
    }
} | ConvertTo-Json -Depth 10

$vercelConfig | Out-File -FilePath "vercel.json" -Encoding UTF8
Write-Host "✓ vercel.json créé" -ForegroundColor Green

# Instructions pour les variables d'environnement
Write-Host "`n⚠️  IMPORTANT: Configuration des variables d'environnement" -ForegroundColor Yellow
Write-Host "Après le premier déploiement:" -ForegroundColor White
Write-Host "1. Allez sur: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "2. Sélectionnez votre projet" -ForegroundColor Cyan
Write-Host "3. Settings > Environment Variables" -ForegroundColor Cyan
Write-Host "4. Ajoutez ces variables:" -ForegroundColor Cyan
Write-Host ""

$envContent = Get-Content ".env" -Raw
if ($envContent -match 'VITE_SUPABASE_URL="([^"]+)"') {
    $supabaseUrl = $Matches[1]
    Write-Host "   VITE_SUPABASE_URL = $supabaseUrl" -ForegroundColor Green
}
if ($envContent -match 'VITE_SUPABASE_ANON_KEY="([^"]+)"') {
    $supabaseKey = $Matches[1]
    Write-Host "   VITE_SUPABASE_ANON_KEY = $supabaseKey" -ForegroundColor Green
}

Write-Host "`n5. Redéployez le projet`n" -ForegroundColor Cyan

# Demander confirmation
Write-Host "Prêt à déployer sur Vercel ?" -ForegroundColor Yellow
Write-Host "Appuyez sur ENTRÉE pour continuer, ou Ctrl+C pour annuler..." -ForegroundColor White
$null = Read-Host

# Déploiement
Write-Host "`n🚀 Déploiement en cours..." -ForegroundColor Cyan
Write-Host "Cela peut prendre 2-3 minutes`n" -ForegroundColor White

try {
    # Premier déploiement (preview)
    Write-Host "📦 Déploiement preview..." -ForegroundColor Cyan
    vercel --yes
    
    Write-Host "`n✓ Preview déployé avec succès !" -ForegroundColor Green
    Write-Host "`n⚠️  Pour déployer en PRODUCTION:" -ForegroundColor Yellow
    Write-Host "1. Configurez les variables d'environnement (voir ci-dessus)" -ForegroundColor White
    Write-Host "2. Exécutez: " -NoNewline -ForegroundColor White
    Write-Host "vercel --prod" -ForegroundColor Green -BackgroundColor DarkGray
    Write-Host ""
    
} catch {
    Write-Host "✗ Erreur lors du déploiement" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         ✓ DÉPLOIEMENT RÉUSSI                                ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

exit 0
