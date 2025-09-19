@echo off
echo ===============================================
echo      DIAGNOSTIC DASHBOARD TERANGA FONCIER
echo ===============================================
echo.

cd /d "C:\Users\Smart Business\Desktop\terangafoncier"

echo 1. Verification des fichiers critiques...
echo.

REM Verifier les fichiers essentiels
if exist "src\components\DashboardRedirect.jsx" (
    echo [OK] DashboardRedirect.jsx existe
) else (
    echo [ERROR] DashboardRedirect.jsx manquant
)

if exist "src\pages\ParticularDashboard.jsx" (
    echo [OK] ParticularDashboard.jsx existe
) else (
    echo [ERROR] ParticularDashboard.jsx manquant
)

if exist "src\App.jsx" (
    echo [OK] App.jsx existe
) else (
    echo [ERROR] App.jsx manquant
)

echo.
echo 2. Recherche d'erreurs dans les imports...
echo.

REM Chercher des imports problematiques
findstr /s /i "visual-editor-config" src\*.jsx src\*.js 2>nul
if %errorlevel% equ 0 (
    echo [WARNING] References a visual-editor-config trouvees
) else (
    echo [OK] Aucune reference problematique trouvee
)

echo.
echo 3. Test de demarrage de l'application...
echo.

REM Demarrer le serveur en arriere-plan
start /b npm run dev

REM Attendre que le serveur demarre
timeout /t 5 /nobreak > nul

REM Tester l'acces
echo Testing localhost connection...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 5; Write-Host '[OK] Application accessible sur port 5173 - Status:' $response.StatusCode } catch { try { $response = Invoke-WebRequest -Uri 'http://localhost:5174' -UseBasicParsing -TimeoutSec 5; Write-Host '[OK] Application accessible sur port 5174 - Status:' $response.StatusCode } catch { Write-Host '[ERROR] Application non accessible sur les ports 5173/5174' } }"

echo.
echo ===============================================
echo               DIAGNOSTIC TERMINE
echo ===============================================
pause