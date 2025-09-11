@echo off
echo.
echo ================================================
echo   TERANGA FONCIER - OPTION AUTOMATIQUE
echo   Creation des comptes de demonstration
echo ================================================
echo.

echo Demarrage de l'application...
start cmd /k "cd /d '%~dp0' && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo Ouverture du navigateur...
start http://localhost:5174

timeout /t 2 /nobreak > nul

echo.
echo ================================================
echo   CREATION AUTOMATIQUE DES COMPTES
echo ================================================
echo.
echo Choisissez votre methode :
echo.
echo [1] Script PowerShell interactif (Recommande)
echo [2] Connexion temporaire (sans Supabase)
echo [3] Ouvrir la documentation
echo [Q] Quitter
echo.

set /p choice="Votre choix (1/2/3/Q): "

if /i "%choice%"=="1" (
    echo.
    echo Lancement du script PowerShell...
    powershell -ExecutionPolicy Bypass -File "%~dp0create-demo-accounts.ps1"
) else if /i "%choice%"=="2" (
    echo.
    echo Redirection vers la page de connexion temporaire...
    start http://localhost:5174/temp-login
    echo.
    echo Comptes disponibles :
    echo - admin@terangafoncier.com / demo123
    echo - particulier@terangafoncier.com / demo123
    echo - agent@terangafoncier.com / demo123
    echo (et tous les autres roles...)
) else if /i "%choice%"=="3" (
    echo.
    echo Ouverture de la documentation...
    start notepad "%~dp0OPTION_AUTOMATIQUE_COMPTES_DEMO.md"
) else if /i "%choice%"=="Q" (
    echo Au revoir !
    exit /b
) else (
    echo Choix invalide.
    timeout /t 2 /nobreak > nul
    goto :eof
)

echo.
echo ================================================
echo   VOTRE PLATEFORME EST PRETE !
echo ================================================
echo.
echo URL: http://localhost:5174
echo.
echo Dashboards disponibles :
echo - Admin Dashboard
echo - Particulier Dashboard  
echo - Agent Foncier Dashboard
echo - Notaire Dashboard
echo - Geometre Dashboard
echo - Banque Dashboard
echo - Promoteur Dashboard
echo - Lotisseur Dashboard
echo - Mairie Dashboard
echo.
echo Bon demo ! 🚀
echo.
pause
