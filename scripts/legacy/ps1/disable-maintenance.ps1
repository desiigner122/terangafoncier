#!/usr/bin/env pwsh
# ================================================================
# SCRIPT DE DÉSACTIVATION MODE MAINTENANCE
# ================================================================
# Ouvre le navigateur avec un script JS pour désactiver maintenance
# ================================================================

Write-Host "🔧 DÉSACTIVATION MODE MAINTENANCE" -ForegroundColor Cyan
Write-Host "=" * 60

$scriptJS = @"
// Désactiver le mode maintenance
localStorage.removeItem('maintenanceMode');
localStorage.removeItem('maintenanceConfig');

console.log('✅ Mode maintenance désactivé depuis localStorage');
console.log('🔄 Rafraîchissement de la page...');

// Rafraîchir après 1 seconde
setTimeout(() => {
    location.reload();
}, 1000);
"@

# Créer un fichier HTML temporaire
$htmlContent = @"
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Désactivation Maintenance</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        h1 {
            margin-bottom: 20px;
        }
        .success {
            color: #4ade80;
            font-size: 48px;
            margin-bottom: 20px;
        }
        .info {
            font-size: 18px;
            margin: 10px 0;
        }
        .btn {
            background: #4ade80;
            color: #1a1a1a;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s;
        }
        .btn:hover {
            background: #22c55e;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success">✅</div>
        <h1>Mode Maintenance Désactivé</h1>
        <p class="info">Le mode maintenance a été désactivé avec succès.</p>
        <p class="info">La page va se rafraîchir automatiquement...</p>
        <button class="btn" onclick="goToApp()">Aller à l'application →</button>
    </div>

    <script>
        $scriptJS

        function goToApp() {
            window.location.href = 'http://localhost:5173';
        }
    </script>
</body>
</html>
"@

# Sauvegarder le fichier HTML
$tempFile = "$env:TEMP\disable-maintenance.html"
$htmlContent | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host ""
Write-Host "✅ Fichier HTML créé: $tempFile" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Ouverture du navigateur..." -ForegroundColor Yellow

# Ouvrir dans le navigateur par défaut
Start-Process $tempFile

Write-Host ""
Write-Host "✅ Mode maintenance désactivé!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Actions effectuées:" -ForegroundColor Cyan
Write-Host "   - localStorage.removeItem('maintenanceMode')" -ForegroundColor Gray
Write-Host "   - localStorage.removeItem('maintenanceConfig')" -ForegroundColor Gray
Write-Host ""
Write-Host "🔄 La page se rafraîchira automatiquement" -ForegroundColor Yellow
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
