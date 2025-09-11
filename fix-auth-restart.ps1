# Script pour réactiver Supabase et tester l'authentification
Write-Host "Réactivation de Supabase et test d'authentification..." -ForegroundColor Green

Write-Host ""
Write-Host "PROBLEME IDENTIFIE:" -ForegroundColor Red
Write-Host "  - Supabase était complètement désactivé dans supabaseClient.js" -ForegroundColor White
Write-Host "  - Mode mock empêchait toute authentification réelle" -ForegroundColor White
Write-Host ""

Write-Host "SOLUTION APPLIQUEE:" -ForegroundColor Green
Write-Host "  - Réactivation du client Supabase réel" -ForegroundColor White
Write-Host "  - Configuration avec la bonne URL et clé" -ForegroundColor White
Write-Host "  - Test d'authentification disponible" -ForegroundColor White
Write-Host ""

Write-Host "1. Test de l'authentification..." -ForegroundColor Cyan
node test-auth-reactivated.js

Write-Host ""
Write-Host "2. Redémarrage du serveur de développement..." -ForegroundColor Cyan
Write-Host "   (Le serveur va redémarrer pour prendre en compte les changements)" -ForegroundColor Yellow

# Arrêter les processus Node existants
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -like "*node*"}
if ($nodeProcesses) {
    Write-Host "   Arrêt des processus Node existants..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "3. Lancement du nouveau serveur..." -ForegroundColor Cyan
Write-Host "   npm run dev va démarrer..." -ForegroundColor Yellow
Write-Host ""

Write-Host "ETAPES SUIVANTES:" -ForegroundColor Green
Write-Host "1. Le serveur va redémarrer automatiquement" -ForegroundColor White
Write-Host "2. Va sur http://localhost:5173" -ForegroundColor White
Write-Host "3. Connecte-toi avec:" -ForegroundColor White
Write-Host "   Email: admin@terangafoncier.com" -ForegroundColor Cyan
Write-Host "   Mot de passe: demo123" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si ça ne marche toujours pas:" -ForegroundColor Yellow
Write-Host "- Exécute d'abord les scripts SQL de création de comptes" -ForegroundColor White
Write-Host "- Vérifie la console du navigateur pour les erreurs" -ForegroundColor White

# Lancer le serveur de développement
Start-Process -NoNewWindow npm "run dev"
