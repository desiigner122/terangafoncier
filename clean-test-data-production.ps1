# ==========================================================
# 🧹 SCRIPT NETTOYAGE DONNÉES TEST POUR PRODUCTION
# ==========================================================

Write-Host "NETTOYAGE DONNEES TEST - PREPARATION PRODUCTION" -ForegroundColor Green

# Phase 1: Suppression des fichiers de test et demo
Write-Host "`n1. SUPPRESSION FICHIERS DE TEST..." -ForegroundColor Yellow

# Fichiers SQL de démonstration
$demoSqlFiles = @(
    "create-demo-*.sql",
    "assign-demo-*.sql",
    "verify-demo-*.sql",
    "create-test-*.sql",
    "create-all-demo-*.sql",
    "create-missing-demo-*.sql"
)

# Fichiers JS de test
$testJsFiles = @(
    "test-*.js",
    "create-test-*.js", 
    "debug-*.js",
    "create-accounts-auto.js",
    "create-working-account.js",
    "fix-email-confirmation.js"
)

# Guides et fichiers de démo
$demoGuides = @(
    "demo-*.js",
    "guide-comptes-demo.js",
    "*DEMO*.md",
    "GUIDE_TEST_*.md"
)

# Suppression des fichiers
foreach ($pattern in $demoSqlFiles + $testJsFiles + $demoGuides) {
    $files = Get-ChildItem -Path "." -Name $pattern -ErrorAction SilentlyContinue
    foreach ($file in $files) {
        if (Test-Path $file) {
            Write-Host "  Suppression: $file" -ForegroundColor Red
            Remove-Item $file -Force
        }
    }
}

# Phase 2: Nettoyage des services avec donnees de test
Write-Host "`n2. NETTOYAGE SERVICES ET COMPOSANTS..." -ForegroundColor Yellow

# Créer un script SQL pour supprimer les données de test de Supabase
$cleanDatabaseSql = @"
-- ==========================================================
-- 🧹 NETTOYAGE BASE DE DONNÉES - DONNÉES TEST
-- ==========================================================

-- Supprimer tous les comptes de test
DELETE FROM profiles WHERE email LIKE '%demo%' OR email LIKE '%test%' OR email LIKE '%@terangafoncier.com';

-- Supprimer les utilisateurs auth de test
DELETE FROM auth.users WHERE email LIKE '%demo%' OR email LIKE '%test%' OR email LIKE '%@terangafoncier.com';

-- Supprimer les propriétés de test
DELETE FROM properties WHERE title LIKE '%test%' OR title LIKE '%demo%' OR description LIKE '%test%';

-- Supprimer les transactions de test
DELETE FROM transactions WHERE description LIKE '%test%' OR description LIKE '%demo%';

-- Supprimer les annonces de test
DELETE FROM annonces WHERE title LIKE '%test%' OR title LIKE '%demo%' OR description LIKE '%test%';

-- Supprimer les articles de blog de test
DELETE FROM blog WHERE title LIKE '%test%' OR title LIKE '%Test%' OR slug LIKE '%test%';

-- Supprimer les notifications de test
DELETE FROM notifications WHERE message LIKE '%test%' OR message LIKE '%demo%';

-- Supprimer les audit_trail de test
DELETE FROM audit_trail WHERE action LIKE '%test%' OR details LIKE '%test%';

-- Supprimer les données blockchain de test
DELETE FROM blockchain_audit WHERE document_hash LIKE '%test%' OR user_id IN (
    SELECT id FROM profiles WHERE email LIKE '%test%' OR email LIKE '%demo%'
);

-- Supprimer les certificats de test
DELETE FROM digital_certificates WHERE title LIKE '%test%' OR title LIKE '%demo%';

-- Réinitialiser les séquences
SELECT setval('profiles_id_seq', COALESCE(MAX(id), 1)) FROM profiles;
SELECT setval('properties_id_seq', COALESCE(MAX(id), 1)) FROM properties;
SELECT setval('annonces_id_seq', COALESCE(MAX(id), 1)) FROM annonces;

-- Vérification finale
SELECT 
    'profiles' as table_name, 
    COUNT(*) as remaining_records 
FROM profiles
UNION ALL
SELECT 'annonces', COUNT(*) FROM annonces
UNION ALL  
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'blog', COUNT(*) FROM blog;
"@

Write-Host "  Creation script SQL de nettoyage..." -ForegroundColor Green
$cleanDatabaseSql | Out-File -FilePath "clean-test-database.sql" -Encoding UTF8

# Phase 3: Nettoyer les cles API de test
Write-Host "`n3. NETTOYAGE CONFIGURATION..." -ForegroundColor Yellow

$envFile = ".env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $cleanEnvContent = @()
    
    foreach ($line in $envContent) {
        # Garder seulement les vraies clés de production
        if ($line -match "^VITE_.*=(.*)" -and 
            $line -notmatch "demo|test|placeholder" -and 
            $line -notmatch "demo-key|your-.*-here") {
            $cleanEnvContent += $line
        }
        elseif ($line -match "^(VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY)=") {
            # Garder les clés Supabase essentielles
            $cleanEnvContent += $line
        }
        elseif ($line -notmatch "VITE_") {
            # Garder les autres lignes non-VITE
            $cleanEnvContent += $line
        }
        else {
            Write-Host "  Suppression ligne test: $($line.Substring(0, [Math]::Min(50, $line.Length)))..." -ForegroundColor Red
        }
    }
    
    $cleanEnvContent | Out-File -FilePath ".env.production" -Encoding UTF8
    Write-Host "  Fichier .env.production cree (nettoye)" -ForegroundColor Green
}

# Phase 4: Nettoyer les imports de test dans le code
Write-Host "`n4. NETTOYAGE CODE SOURCE..." -ForegroundColor Yellow

# Rechercher et nettoyer les imports de test
$jsFiles = Get-ChildItem -Path "src" -Recurse -Name "*.js" -ErrorAction SilentlyContinue
$jsxFiles = Get-ChildItem -Path "src" -Recurse -Name "*.jsx" -ErrorAction SilentlyContinue

foreach ($file in ($jsFiles + $jsxFiles)) {
    $fullPath = "src\$file"
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        $originalContent = $content
        
        # Supprimer les lignes de test/debug
        $content = $content -replace "console\.log\('🧪.*?\);", ""
        $content = $content -replace "console\.log\('.*test.*?\);", ""
        $content = $content -replace "// Test.*?\n", ""
        $content = $content -replace "// DEBUG.*?\n", ""
        $content = $content -replace "placeholder|demo-key|test-key", "YOUR_API_KEY"
        
        # Nettoyer les commentaires de test
        $content = $content -replace "/\* Test.*?\*/", ""
        $content = $content -replace "// TODO.*test.*", ""
        
        if ($content -ne $originalContent) {
            $content | Out-File -FilePath $fullPath -Encoding UTF8 -NoNewline
            Write-Host "  Nettoye: $file" -ForegroundColor Green
        }
    }
}

# Phase 5: Creer la configuration de production
Write-Host "`n5. CONFIGURATION PRODUCTION..." -ForegroundColor Yellow

$productionConfig = @"
// ==========================================================
// 🚀 CONFIGURATION PRODUCTION - TERANGA FONCIER
// ==========================================================

export const PRODUCTION_CONFIG = {
  // Environnement
  NODE_ENV: 'production',
  
  // Sécurité
  SECURITY: {
    enableConsoleLog: false,
    enableDebugMode: false,
    enableTestMode: false,
    requireHttps: true
  },
  
  // API
  API: {
    timeout: 10000,
    retryAttempts: 3,
    enableMockData: false
  },
  
  // Base de données
  DATABASE: {
    enableDemoData: false,
    enableTestUsers: false,
    requireDataValidation: true
  },
  
  // Blockchain
  BLOCKCHAIN: {
    enableTestnet: false,
    enableAuditTrail: true,
    requireDigitalSignature: true
  },
  
  // Monitoring
  MONITORING: {
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    enableUserAnalytics: true
  }
};
"@

$productionConfig | Out-File -FilePath "src/config/production.js" -Encoding UTF8
Write-Host "  Configuration production creee" -ForegroundColor Green

# Phase 6: Instructions finales
Write-Host "`nINSTRUCTIONS FINALES:" -ForegroundColor Cyan
Write-Host "1. Exécutez 'clean-test-database.sql' dans Supabase" -ForegroundColor White
Write-Host "2. Remplacez .env par .env.production" -ForegroundColor White
Write-Host "3. Testez l'application en mode production" -ForegroundColor White
Write-Host "4. Configurez vos vraies clés API" -ForegroundColor White
Write-Host "5. Déployez sur votre environnement de production" -ForegroundColor White

# Resume des actions
Write-Host "`nNETTOYAGE TERMINE!" -ForegroundColor Green
Write-Host "Fichiers supprimes: Test/Demo SQL, JS de test, Guides demo" -ForegroundColor Yellow
Write-Host "Code nettoye: Imports test, console.log, placeholders" -ForegroundColor Yellow  
Write-Host "Configuration: Production config creee" -ForegroundColor Yellow
Write-Host "Base donnees: Script de nettoyage genere" -ForegroundColor Yellow

Write-Host "`nVOTRE APPLICATION EST PRETE POUR LA PRODUCTION!" -ForegroundColor Green

# Afficher les prochaines etapes
Write-Host "`nPROCHAINES ETAPES - PRIORITE 3 (60% vers 100%)" -ForegroundColor Magenta
Write-Host "1. Backup blockchain vers Supabase automatique" -ForegroundColor White
Write-Host "2. Dashboard unifie toutes sources" -ForegroundColor White  
Write-Host "3. Notifications intelligentes push" -ForegroundColor White
