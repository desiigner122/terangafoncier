# Script PowerShell pour deployer les corrections de la base de donnees
# Deployment script pour les corrections urgentes de la table users

Write-Host "Deploiement des corrections de la base de donnees..." -ForegroundColor Cyan

# Lire les variables d'environnement du fichier .env
Write-Host "Lecture des variables d'environnement..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^(.+)=(.*)$") {
            $name = $matches[1]
            $value = $matches[2]
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
    Write-Host "Variables d'environnement chargees" -ForegroundColor Green
} else {
    Write-Host "Fichier .env non trouve" -ForegroundColor Red
    Write-Host "Veuillez creer un fichier .env avec vos variables Supabase" -ForegroundColor Yellow
    exit 1
}

# Construire l'URL de connexion Supabase
$supabaseUrl = $env:VITE_SUPABASE_URL
$supabaseKey = $env:VITE_SUPABASE_ANON_KEY

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "Variables Supabase manquantes" -ForegroundColor Red
    Write-Host "Assurez-vous que VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont definis" -ForegroundColor Yellow
    exit 1
}

# Extraire les informations de connexion de l'URL Supabase
if ($supabaseUrl -match "https://(.+)\.supabase\.co") {
    $projectId = $matches[1]
    $supabaseHost = "$projectId.supabase.co"
    
    Write-Host "Connexion a Supabase..." -ForegroundColor Yellow
    Write-Host "   Projet: $projectId" -ForegroundColor Gray
    Write-Host "   Host: $supabaseHost" -ForegroundColor Gray
    
    # Instructions pour l'utilisateur
    Write-Host ""
    Write-Host "INSTRUCTIONS DE DEPLOIEMENT:" -ForegroundColor Cyan
    Write-Host "1. Ouvrez le tableau de bord Supabase (https://app.supabase.com)" -ForegroundColor White
    Write-Host "2. Allez dans votre projet > SQL Editor" -ForegroundColor White
    Write-Host "3. Copiez et executez le contenu du fichier 'fix-users-table-urgent.sql'" -ForegroundColor White
    Write-Host ""
    
    # Afficher le contenu du script
    Write-Host "CONTENU DU SCRIPT A EXECUTER:" -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Gray
    Get-Content "fix-users-table-urgent.sql"
    Write-Host "======================================" -ForegroundColor Gray
    
} else {
    Write-Host "Format d'URL Supabase invalide" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Une fois le script execute dans Supabase:" -ForegroundColor Cyan
Write-Host "1. Les boutons d'actions fonctionneront correctement" -ForegroundColor White
Write-Host "2. Le wizard intelligent sera operationnel" -ForegroundColor White
Write-Host "3. Toutes les colonnes manquantes seront ajoutees" -ForegroundColor White
Write-Host ""
Write-Host "Testez l'application sur http://localhost:5175" -ForegroundColor Green
