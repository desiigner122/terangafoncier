# Script PowerShell pour appliquer la migration Supabase
# Date: 2025-10-09
# Description: Applique toutes les tables nécessaires pour le dashboard admin

Write-Host "`n🚀 APPLICATION MIGRATION ADMIN DASHBOARD" -ForegroundColor Cyan
Write-Host "=========================================`n" -ForegroundColor Cyan

# Chemin du fichier SQL
$sqlFile = "supabase\migrations\admin_dashboard_complete_tables.sql"

# Vérifier que le fichier existe
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Erreur: Fichier SQL non trouvé: $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Fichier SQL trouvé: $sqlFile" -ForegroundColor Green
Write-Host "📊 Lecture du fichier..." -ForegroundColor Yellow

$sqlContent = Get-Content $sqlFile -Raw

Write-Host "✅ Fichier lu avec succès`n" -ForegroundColor Green

# Note: Pour exécuter ce SQL, vous devez:
# 1. Aller sur votre Dashboard Supabase
# 2. Ouvrir SQL Editor
# 3. Copier-coller le contenu du fichier SQL
# 4. Exécuter

Write-Host "📋 INSTRUCTIONS D'APPLICATION:" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan
Write-Host "1️⃣  Allez sur: https://supabase.com/dashboard/project/YOUR_PROJECT/sql" -ForegroundColor White
Write-Host "2️⃣  Créez une nouvelle query" -ForegroundColor White
Write-Host "3️⃣  Copiez le contenu de: $sqlFile" -ForegroundColor White
Write-Host "4️⃣  Exécutez la migration (Run)`n" -ForegroundColor White

Write-Host "📦 TABLES QUI SERONT CRÉÉES:" -ForegroundColor Cyan
Write-Host "============================`n" -ForegroundColor Cyan
Write-Host "✓ admin_actions           - Logs des actions admin" -ForegroundColor Green
Write-Host "✓ admin_notifications     - Notifications pour admins" -ForegroundColor Green
Write-Host "✓ support_tickets         - Tickets de support" -ForegroundColor Green
Write-Host "✓ ticket_responses        - Réponses aux tickets" -ForegroundColor Green
Write-Host "✓ blog_posts              - Articles de blog" -ForegroundColor Green
Write-Host "✓ platform_settings       - Paramètres plateforme" -ForegroundColor Green
Write-Host "✓ report_actions          - Actions sur signalements" -ForegroundColor Green
Write-Host "✓ property_reports        - Signalements propriétés`n" -ForegroundColor Green

Write-Host "🔧 COLONNES AJOUTÉES:" -ForegroundColor Cyan
Write-Host "====================`n" -ForegroundColor Cyan
Write-Host "✓ profiles.suspended_at" -ForegroundColor Green
Write-Host "✓ profiles.suspension_reason" -ForegroundColor Green
Write-Host "✓ profiles.last_login" -ForegroundColor Green
Write-Host "✓ blockchain_transactions.commission_paid" -ForegroundColor Green
Write-Host "✓ properties.featured" -ForegroundColor Green
Write-Host "✓ properties.report_count`n" -ForegroundColor Green

Write-Host "🛡️  SÉCURITÉ (RLS):" -ForegroundColor Cyan
Write-Host "==================`n" -ForegroundColor Cyan
Write-Host "✓ Policies pour admin_actions" -ForegroundColor Green
Write-Host "✓ Policies pour admin_notifications" -ForegroundColor Green
Write-Host "✓ Policies pour support_tickets" -ForegroundColor Green
Write-Host "✓ Policies pour blog_posts" -ForegroundColor Green
Write-Host "✓ Policies pour platform_settings`n" -ForegroundColor Green

Write-Host "⚡ TRIGGERS AUTOMATIQUES:" -ForegroundColor Cyan
Write-Host "========================`n" -ForegroundColor Cyan
Write-Host "✓ Notification auto nouvel utilisateur" -ForegroundColor Green
Write-Host "✓ Notification auto nouvelle propriété" -ForegroundColor Green
Write-Host "✓ Mise à jour auto des updated_at`n" -ForegroundColor Green

Write-Host "📊 VUES CRÉÉES:" -ForegroundColor Cyan
Write-Host "===============`n" -ForegroundColor Cyan
Write-Host "✓ admin_analytics_overview  - Vue d'ensemble statistiques`n" -ForegroundColor Green

Write-Host "`n🎯 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host "====================`n" -ForegroundColor Yellow
Write-Host "1. Appliquer la migration sur Supabase" -ForegroundColor White
Write-Host "2. Vérifier que toutes les tables sont créées" -ForegroundColor White
Write-Host "3. Tester les RLS policies" -ForegroundColor White
Write-Host "4. Lancer le serveur de développement`n" -ForegroundColor White

Write-Host "✅ Script terminé avec succès !`n" -ForegroundColor Green

# Optionnel: Ouvrir le fichier SQL dans un éditeur
$response = Read-Host "Voulez-vous ouvrir le fichier SQL maintenant? (O/N)"
if ($response -eq "O" -or $response -eq "o") {
    Start-Process notepad $sqlFile
    Write-Host "`n📝 Fichier ouvert dans Notepad" -ForegroundColor Green
}

Write-Host "`nAppuyez sur une touche pour quitter..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
