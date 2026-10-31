# 🧹 Script PowerShell pour nettoyer et recréer les tables CRM

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🧹 NETTOYAGE ET RECRÉATION DES TABLES CRM" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Ce script va:" -ForegroundColor Yellow
Write-Host "  1️⃣  Supprimer toutes les tables CRM existantes" -ForegroundColor White
Write-Host "  2️⃣  Supprimer toutes les politiques RLS" -ForegroundColor White
Write-Host "  3️⃣  Recréer toutes les tables avec les nouvelles structures" -ForegroundColor White
Write-Host ""

$confirmation = Read-Host "Voulez-vous continuer? (O/N)"

if ($confirmation -ne 'O' -and $confirmation -ne 'o') {
    Write-Host "❌ Opération annulée" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "📍 Méthodes d'exécution disponibles:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Supabase Dashboard (RECOMMANDÉ)" -ForegroundColor Green
Write-Host "   → Ouvrir https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host "   → Aller dans SQL Editor" -ForegroundColor Gray
Write-Host "   → Copier/coller cleanup-crm-tables.sql" -ForegroundColor Gray
Write-Host "   → Exécuter" -ForegroundColor Gray
Write-Host "   → Puis copier/coller create-crm-analytics-tables.sql" -ForegroundColor Gray
Write-Host "   → Exécuter" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  Supabase CLI" -ForegroundColor Yellow
Write-Host "   → supabase db reset" -ForegroundColor Gray
Write-Host "   → Ou créer une migration:" -ForegroundColor Gray
Write-Host "   → supabase migration new create_crm_tables" -ForegroundColor Gray
Write-Host ""

Write-Host "3️⃣  psql (Ligne de commande)" -ForegroundColor Yellow
Write-Host "   → psql <connection-string>" -ForegroundColor Gray
Write-Host "   → \i cleanup-crm-tables.sql" -ForegroundColor Gray
Write-Host "   → \i create-crm-analytics-tables.sql" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📁 Fichiers à utiliser:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. cleanup-crm-tables.sql (nettoyage)" -ForegroundColor White
Write-Host "2. create-crm-analytics-tables.sql (création)" -ForegroundColor White
Write-Host ""

$openFiles = Read-Host "Voulez-vous ouvrir les fichiers SQL? (O/N)"

if ($openFiles -eq 'O' -or $openFiles -eq 'o') {
    $scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
    
    Write-Host ""
    Write-Host "📂 Ouverture des fichiers..." -ForegroundColor Green
    
    $cleanupFile = Join-Path $scriptPath "cleanup-crm-tables.sql"
    $createFile = Join-Path $scriptPath "create-crm-analytics-tables.sql"
    
    if (Test-Path $cleanupFile) {
        Start-Process "notepad.exe" $cleanupFile
        Write-Host "✅ cleanup-crm-tables.sql ouvert" -ForegroundColor Green
    } else {
        Write-Host "❌ cleanup-crm-tables.sql non trouvé" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 1
    
    if (Test-Path $createFile) {
        Start-Process "notepad.exe" $createFile
        Write-Host "✅ create-crm-analytics-tables.sql ouvert" -ForegroundColor Green
    } else {
        Write-Host "❌ create-crm-analytics-tables.sql non trouvé" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ ÉTAPES SUIVANTES" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Ouvrez Supabase Dashboard" -ForegroundColor White
Write-Host "2. Allez dans SQL Editor" -ForegroundColor White
Write-Host "3. Exécutez cleanup-crm-tables.sql (suppression)" -ForegroundColor Yellow
Write-Host "4. Exécutez create-crm-analytics-tables.sql (création)" -ForegroundColor Green
Write-Host "5. Vérifiez les tables créées dans Table Editor" -ForegroundColor White
Write-Host ""
Write-Host "📊 Tables qui seront créées:" -ForegroundColor Cyan
Write-Host "   - crm_contacts (Prospects/Clients)" -ForegroundColor White
Write-Host "   - crm_interactions (Historique)" -ForegroundColor White
Write-Host "   - activity_logs (Journal d'activité)" -ForegroundColor White
Write-Host "   - property_views (Analytics détaillés)" -ForegroundColor White
Write-Host "   - messages (Messagerie)" -ForegroundColor White
Write-Host "   - conversations (Conversations)" -ForegroundColor White
Write-Host ""
Write-Host "🔒 Sécurité RLS activée pour toutes les tables" -ForegroundColor Green
Write-Host "⚡ Fonctions helper créées (get_vendor_monthly_stats, get_vendor_top_properties)" -ForegroundColor Green
Write-Host ""

Read-Host "Appuyez sur Entrée pour terminer"
