# =====================================================
# DÉPLOIEMENT AUTOMATIQUE - SCHÉMA COMPLET DASHBOARD NOTAIRE
# Teranga Foncier - Octobre 2025
# =====================================================

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                        ║" -ForegroundColor Cyan
Write-Host "║     🚀 DÉPLOIEMENT SCHÉMA BASE DE DONNÉES 🚀        ║" -ForegroundColor Green
Write-Host "║          Teranga Foncier - Dashboard Notaire           ║" -ForegroundColor Cyan
Write-Host "║                                                        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration Supabase
$SUPABASE_URL = "https://ndenqikcogzrkrjnlvns.supabase.co"
$SUPABASE_PROJECT_ID = "ndenqikcogzrkrjnlvns"

Write-Host "📊 CONFIGURATION:" -ForegroundColor Yellow
Write-Host "  • Projet: $SUPABASE_PROJECT_ID" -ForegroundColor White
Write-Host "  • URL: $SUPABASE_URL" -ForegroundColor White
Write-Host ""

# Vérifier que le fichier SQL existe
$SQL_FILE = ".\database\notaire-complete-features-schema.sql"
if (-not (Test-Path $SQL_FILE)) {
    Write-Host "❌ ERREUR: Fichier SQL introuvable: $SQL_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichier SQL trouvé: $SQL_FILE" -ForegroundColor Green
$fileSize = [math]::Round((Get-Item $SQL_FILE).Length / 1KB, 2)
Write-Host "  • Taille: $fileSize KB" -ForegroundColor White
Write-Host ""

# Lire le contenu SQL
$SQL_CONTENT = Get-Content $SQL_FILE -Raw

# Compter les instructions
$createTableCount = ([regex]::Matches($SQL_CONTENT, "CREATE TABLE")).Count
$createIndexCount = ([regex]::Matches($SQL_CONTENT, "CREATE INDEX")).Count
$insertCount = ([regex]::Matches($SQL_CONTENT, "INSERT INTO")).Count

Write-Host "📋 CONTENU DU SCHÉMA:" -ForegroundColor Yellow
Write-Host "  • Tables à créer: $createTableCount" -ForegroundColor White
Write-Host "  • Index à créer: $createIndexCount" -ForegroundColor White
Write-Host "  • Données demo: $insertCount insertions" -ForegroundColor White
Write-Host ""

# Demander confirmation
Write-Host "⚠️  ATTENTION: Ce script va modifier la base de données" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Voulez-vous continuer? (o/n)"

if ($confirm -ne "o" -and $confirm -ne "O") {
    Write-Host "`n❌ Déploiement annulé par l'utilisateur" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 DÉMARRAGE DU DÉPLOIEMENT..." -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Instructions pour le déploiement manuel (Supabase CLI pas installé)
Write-Host "📝 INSTRUCTIONS DE DÉPLOIEMENT:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1 - VIA SUPABASE DASHBOARD (RECOMMANDÉ):" -ForegroundColor Cyan
Write-Host "  1. Ouvrir: $SUPABASE_URL" -ForegroundColor White
Write-Host "  2. Aller dans: SQL Editor" -ForegroundColor White
Write-Host "  3. Créer une nouvelle query" -ForegroundColor White
Write-Host "  4. Copier/coller le contenu de: $SQL_FILE" -ForegroundColor White
Write-Host "  5. Exécuter (Run)" -ForegroundColor White
Write-Host ""

Write-Host "Option 2 - COPIER LE SQL DANS LE PRESSE-PAPIERS:" -ForegroundColor Cyan
Write-Host "  • Exécutez: Get-Content '$SQL_FILE' -Raw | Set-Clipboard" -ForegroundColor White
Write-Host "  • Puis collez dans le SQL Editor de Supabase" -ForegroundColor White
Write-Host ""

# Copier automatiquement dans le presse-papiers
try {
    Set-Clipboard -Value $SQL_CONTENT
    Write-Host "✅ SQL copié dans le presse-papiers!" -ForegroundColor Green
    Write-Host "  → Vous pouvez maintenant coller directement dans Supabase SQL Editor" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "⚠️  Impossible de copier dans le presse-papiers" -ForegroundColor Yellow
}

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Ouvrir automatiquement le dashboard Supabase
Write-Host "🌐 Ouverture du Dashboard Supabase..." -ForegroundColor Green
$supabaseDashboardUrl = "$SUPABASE_URL"
Start-Process $supabaseDashboardUrl

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ PRÉPARATION TERMINÉE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📊 VÉRIFICATION APRÈS DÉPLOIEMENT:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Exécutez ces requêtes SQL pour vérifier:" -ForegroundColor White
Write-Host ""
Write-Host "-- Compter les nouvelles tables" -ForegroundColor Gray
Write-Host "SELECT table_name FROM information_schema.tables" -ForegroundColor Gray
Write-Host "WHERE table_schema = 'public'" -ForegroundColor Gray
Write-Host "AND table_name IN (" -ForegroundColor Gray
Write-Host "  'support_tickets', 'subscription_plans', 'notifications'," -ForegroundColor Gray
Write-Host "  'video_meetings', 'elearning_courses', 'marketplace_products'" -ForegroundColor Gray
Write-Host ");" -ForegroundColor Gray
Write-Host ""

Write-Host "-- Vérifier les données demo" -ForegroundColor Gray
Write-Host "SELECT 'subscription_plans' as table, count(*) as count FROM subscription_plans" -ForegroundColor Gray
Write-Host "UNION ALL SELECT 'help_articles', count(*) FROM help_articles;" -ForegroundColor Gray
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 DÉPLOIEMENT PRÉPARÉ AVEC SUCCÈS!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host "  1. ✅ Schéma SQL copié dans presse-papiers" -ForegroundColor White
Write-Host "  2. 🌐 Dashboard Supabase ouvert" -ForegroundColor White
Write-Host "  3. 📝 Coller et exécuter le SQL" -ForegroundColor White
Write-Host "  4. ✅ Vérifier les tables créées" -ForegroundColor White
Write-Host "  5. 🚀 Corriger les pages mockées" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
