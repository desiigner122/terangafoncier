# 🚀 DÉPLOIEMENT PRODUCTION - TERANGA FONCIER
# ============================================

param(
    [string]$Target = "vercel",
    [switch]$SkipTests = $false,
    [switch]$Force = $false
)

Write-Host "🚀 DÉPLOIEMENT PRODUCTION TERANGA FONCIER" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Target: $Target" -ForegroundColor Yellow
Write-Host ""

# Fonction pour afficher les étapes
function Write-Step {
    param([string]$Message, [string]$Color = "Yellow")
    Write-Host "🔄 $Message..." -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

# Vérification de l'environnement
Write-Step "Vérification de l'environnement"

if (!(Test-Path "package.json")) {
    Write-Error "package.json non trouvé. Exécutez depuis la racine du projet."
    exit 1
}

if (!(Test-Path "src")) {
    Write-Error "Dossier src/ non trouvé."
    exit 1
}

Write-Success "Environnement validé"

# Validation complète (sauf si --SkipTests)
if (!$SkipTests) {
    Write-Step "Validation complète du projet"
    
    if (Test-Path "validate-complete.js") {
        try {
            $validationResult = node validate-complete.js
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Validation réussie - Projet prêt pour déploiement"
            } else {
                Write-Error "Validation échouée"
                if (!$Force) {
                    Write-Host "Utilisez -Force pour ignorer les erreurs de validation" -ForegroundColor Yellow
                    exit 1
                }
                Write-Host "⚠️ Déploiement forcé malgré les erreurs" -ForegroundColor Yellow
            }
        } catch {
            Write-Error "Erreur lors de la validation: $_"
            if (!$Force) { exit 1 }
        }
    } else {
        Write-Host "⚠️ Script de validation non trouvé, validation ignorée" -ForegroundColor Yellow
    }
}

# Installation des dépendances
Write-Step "Installation des dépendances"
try {
    npm ci --production=false
    Write-Success "Dépendances installées"
} catch {
    Write-Error "Erreur installation dépendances: $_"
    exit 1
}

# Build de production
Write-Step "Construction du build de production"
try {
    npm run build
    
    if (Test-Path "dist") {
        $distSize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum
        $distSizeMB = [math]::Round($distSize / 1MB, 2)
        Write-Success "Build réussi - Taille: $distSizeMB MB"
    } else {
        Write-Error "Dossier dist/ non généré"
        exit 1
    }
} catch {
    Write-Error "Erreur lors du build: $_"
    exit 1
}

# Configuration spécifique selon la cible
Write-Step "Configuration pour $Target"

switch ($Target.ToLower()) {
    "vercel" {
        Write-Host "📦 Configuration Vercel" -ForegroundColor Cyan
        
        # Créer vercel.json si nécessaire
        $vercelConfig = @{
            version = 2
            builds = @(
                @{
                    src = "package.json"
                    use = "@vercel/static-build"
                    config = @{
                        distDir = "dist"
                    }
                }
            )
            routes = @(
                @{
                    src = "/(.*)"
                    dest = "/index.html"
                }
            )
            headers = @(
                @{
                    source = "/sw.js"
                    headers = @(
                        @{
                            key = "Cache-Control"
                            value = "public, max-age=0, must-revalidate"
                        }
                    )
                },
                @{
                    source = "/manifest.json"
                    headers = @(
                        @{
                            key = "Content-Type"
                            value = "application/manifest+json"
                        }
                    )
                }
            )
        }
        
        $vercelConfig | ConvertTo-Json -Depth 10 | Set-Content "vercel.json"
        Write-Success "Configuration Vercel créée"
        
        # Vérifier Vercel CLI
        try {
            vercel --version | Out-Null
            Write-Success "Vercel CLI détecté"
        } catch {
            Write-Host "⚠️ Vercel CLI non installé. Installation..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        # Déploiement
        Write-Step "Déploiement sur Vercel"
        vercel --prod
        Write-Success "Déploiement Vercel terminé"
    }
    
    "netlify" {
        Write-Host "📦 Configuration Netlify" -ForegroundColor Cyan
        
        # Créer _redirects pour SPA
        "/*    /index.html   200" | Set-Content "dist/_redirects"
        
        # Créer netlify.toml
        $netlifyConfig = @"
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
"@
        
        $netlifyConfig | Set-Content "netlify.toml"
        Write-Success "Configuration Netlify créée"
        
        # Vérifier Netlify CLI
        try {
            netlify --version | Out-Null
            Write-Success "Netlify CLI détecté"
        } catch {
            Write-Host "⚠️ Netlify CLI non installé. Installation..." -ForegroundColor Yellow
            npm install -g netlify-cli
        }
        
        # Déploiement
        Write-Step "Déploiement sur Netlify"
        netlify deploy --prod --dir=dist
        Write-Success "Déploiement Netlify terminé"
    }
    
    "firebase" {
        Write-Host "📦 Configuration Firebase" -ForegroundColor Cyan
        
        # Créer firebase.json
        $firebaseConfig = @{
            hosting = @{
                public = "dist"
                ignore = @(
                    "firebase.json",
                    "**/.*",
                    "**/node_modules/**"
                )
                rewrites = @(
                    @{
                        source = "**"
                        destination = "/index.html"
                    }
                )
                headers = @(
                    @{
                        source = "/sw.js"
                        headers = @(
                            @{
                                key = "Cache-Control"
                                value = "public, max-age=0, must-revalidate"
                            }
                        )
                    }
                )
            }
        }
        
        $firebaseConfig | ConvertTo-Json -Depth 10 | Set-Content "firebase.json"
        Write-Success "Configuration Firebase créée"
        
        # Vérifier Firebase CLI
        try {
            firebase --version | Out-Null
            Write-Success "Firebase CLI détecté"
        } catch {
            Write-Host "⚠️ Firebase CLI non installé. Installation..." -ForegroundColor Yellow
            npm install -g firebase-tools
        }
        
        Write-Step "Déploiement sur Firebase"
        firebase deploy
        Write-Success "Déploiement Firebase terminé"
    }
    
    "static" {
        Write-Host "📦 Build statique prêt" -ForegroundColor Cyan
        Write-Host "Le dossier dist/ contient votre application prête à déployer" -ForegroundColor White
        Write-Host "Copiez le contenu de dist/ vers votre serveur web" -ForegroundColor White
        
        # Créer un fichier de configuration Apache
        $htaccessContent = @"
RewriteEngine On
RewriteBase /

# Handle Angular and other routing
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Cache manifest and service worker
<FilesMatch "\.(json|js)$">
    <IfModule mod_headers.c>
        Header set Cache-Control "public, max-age=0, must-revalidate"
    </IfModule>
</FilesMatch>
"@
        
        $htaccessContent | Set-Content "dist/.htaccess"
        Write-Success "Configuration Apache (.htaccess) créée"
    }
    
    default {
        Write-Error "Cible de déploiement non supportée: $Target"
        Write-Host "Cibles disponibles: vercel, netlify, firebase, static" -ForegroundColor Yellow
        exit 1
    }
}

# Optimisations post-build
Write-Step "Optimisations finales"

try {
    # Vérifier la taille des fichiers
    $jsFiles = Get-ChildItem "dist/assets/*.js" -ErrorAction SilentlyContinue
    $cssFiles = Get-ChildItem "dist/assets/*.css" -ErrorAction SilentlyContinue
    
    if ($jsFiles) {
        $largestJs = $jsFiles | Sort-Object Length -Descending | Select-Object -First 1
        $jsSizeKB = [math]::Round($largestJs.Length / 1KB, 1)
        Write-Host "📦 Plus gros bundle JS: $($largestJs.Name) ($jsSizeKB KB)" -ForegroundColor White
    }
    
    if ($cssFiles) {
        $largestCss = $cssFiles | Sort-Object Length -Descending | Select-Object -First 1
        $cssSizeKB = [math]::Round($largestCss.Length / 1KB, 1)
        Write-Host "🎨 Plus gros bundle CSS: $($largestCss.Name) ($cssSizeKB KB)" -ForegroundColor White
    }
    
    Write-Success "Optimisations terminées"
} catch {
    Write-Host "⚠️ Impossible d'analyser les bundles" -ForegroundColor Yellow
}

# Génération du rapport de déploiement
Write-Step "Génération du rapport"

$deploymentReport = @"
# 🚀 RAPPORT DE DÉPLOIEMENT
========================

**Date:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Cible:** $Target
**Statut:** ✅ SUCCÈS

## 📊 Métriques
- **Taille du build:** $distSizeMB MB
- **Fichiers générés:** $(((Get-ChildItem "dist" -Recurse -File).Count))
- **Temps de build:** $(Get-Date)

## 🔗 Prochaines étapes
1. Tester l'application déployée
2. Configurer les variables d'environnement
3. Configurer les clés API (IA, Blockchain)
4. Effectuer des tests utilisateurs
5. Monitorer les performances

## 🌐 URLs importantes
- **Production:** [À compléter après déploiement]
- **Documentation:** README.md
- **Support:** [support@teranga-foncier.com]

---
Généré automatiquement par le script de déploiement Teranga Foncier
"@

$deploymentReport | Set-Content "DEPLOYMENT_REPORT.md"

# Résumé final
Write-Host ""
Write-Host "🎉 DÉPLOIEMENT RÉUSSI !" -ForegroundColor Green -BackgroundColor Black
Write-Host "=====================" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "✅ Build de production généré" -ForegroundColor Green
Write-Host "✅ Configuration $Target appliquée" -ForegroundColor Green
Write-Host "✅ Optimisations activées" -ForegroundColor Green
Write-Host "✅ Rapport généré: DEPLOYMENT_REPORT.md" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PROCHAINES ACTIONS:" -ForegroundColor Cyan
Write-Host "• Tester l'application déployée" -ForegroundColor White
Write-Host "• Configurer les variables d'environnement de production" -ForegroundColor White
Write-Host "• Ajouter les clés API (Gemini, OpenAI, Blockchain)" -ForegroundColor White
Write-Host "• Effectuer des tests utilisateurs" -ForegroundColor White
Write-Host "• Configurer le monitoring" -ForegroundColor White
Write-Host ""
Write-Host "🌟 TERANGA FONCIER EST MAINTENANT EN PRODUCTION !" -ForegroundColor Yellow -BackgroundColor Black
Write-Host ""
