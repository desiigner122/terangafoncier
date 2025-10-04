# Script de génération des secrets JWT sécurisés pour Vercel

Write-Host "🔐 GÉNÉRATION SECRETS JWT POUR VERCEL" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Fonction pour générer un secret aléatoire sécurisé
function Generate-SecureSecret {
    param($length = 64)
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
    $secret = ""
    for ($i = 0; $i -lt $length; $i++) {
        $secret += $chars[(Get-Random -Maximum $chars.Length)]
    }
    return $secret
}

# Générer les secrets
$jwtSecret = Generate-SecureSecret -length 64
$jwtRefreshSecret = Generate-SecureSecret -length 64

Write-Host "`n📋 VARIABLES À AJOUTER SUR VERCEL:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

Write-Host "`n🔑 Authentification (OBLIGATOIRE):" -ForegroundColor Yellow
Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor White
Write-Host "JWT_REFRESH_SECRET=$jwtRefreshSecret" -ForegroundColor White

Write-Host "`n🌐 Configuration serveur:" -ForegroundColor Yellow
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "PORT=5000" -ForegroundColor White
Write-Host "FRONTEND_URL=https://votre-domaine-frontend.vercel.app" -ForegroundColor White

Write-Host "`n🗄️ Base de données (choisir une option):" -ForegroundColor Yellow
Write-Host "# Option 1: Supabase (Recommandé)" -ForegroundColor Gray
Write-Host "DATABASE_TYPE=postgresql" -ForegroundColor White
Write-Host "DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres" -ForegroundColor White

Write-Host "`n# Option 2: Neon Database" -ForegroundColor Gray
Write-Host "DATABASE_URL=postgresql://[user]:[password]@[endpoint]/[dbname]" -ForegroundColor White

Write-Host "`n🤖 Services IA (optionnel au début):" -ForegroundColor Yellow
Write-Host "OPENAI_API_KEY=sk-proj-votre-cle-openai" -ForegroundColor White
Write-Host "GOOGLE_AI_API_KEY=AIza-votre-cle-google" -ForegroundColor White

Write-Host "`n🔗 Blockchain (optionnel):" -ForegroundColor Yellow
Write-Host "POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_INFURA_KEY" -ForegroundColor White
Write-Host "POLYGON_PRIVATE_KEY=0x1234567890abcdef..." -ForegroundColor White

Write-Host "`n🎯 ÉTAPES VERCEL:" -ForegroundColor Green
Write-Host "1. Aller sur https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Sélectionner votre projet" -ForegroundColor White
Write-Host "3. Settings > Environment Variables" -ForegroundColor White
Write-Host "4. Ajouter chaque variable ci-dessus" -ForegroundColor White
Write-Host "5. Redéployer le projet" -ForegroundColor White

Write-Host "`n💡 CONSEIL:" -ForegroundColor Cyan
Write-Host "Commencez avec JWT_SECRET, NODE_ENV et DATABASE_URL uniquement" -ForegroundColor White
Write-Host "Ajoutez les autres services progressivement selon vos besoins" -ForegroundColor White

# Sauvegarder dans un fichier pour référence
$envContent = @"
# Variables d'environnement Vercel - Teranga Foncier
# Générées le $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# OBLIGATOIRE - Authentification
JWT_SECRET=$jwtSecret
JWT_REFRESH_SECRET=$jwtRefreshSecret

# OBLIGATOIRE - Configuration serveur
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://votre-domaine-frontend.vercel.app

# OBLIGATOIRE - Base de données (configurer selon votre choix)
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://user:password@host:5432/database

# OPTIONNEL - Services IA
OPENAI_API_KEY=sk-proj-votre-cle-openai
GOOGLE_AI_API_KEY=AIza-votre-cle-google

# OPTIONNEL - Blockchain
POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_INFURA_KEY
POLYGON_PRIVATE_KEY=0x1234567890abcdef...

# OPTIONNEL - Services externes
MAPBOX_API_KEY=pk.eyJ1...
STRIPE_SECRET_KEY=sk_live_...
CLOUDINARY_CLOUD_NAME=teranga-foncier
"@

$envContent | Out-File -FilePath "vercel-environment-variables.txt" -Encoding UTF8

Write-Host "`n💾 Secrets sauvegardés dans: vercel-environment-variables.txt" -ForegroundColor Green
Write-Host "⚠️  IMPORTANT: Gardez ce fichier sécurisé et ne le commitez pas!" -ForegroundColor Red