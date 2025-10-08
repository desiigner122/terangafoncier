# 🚀 SCRIPT D'EXÉCUTION SQL - Tables CRM et Analytics
# Date: 5 Octobre 2025
# Auteur: Pape Alioune Yague

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  📊 CRÉATION TABLES CRM ET ANALYTICS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$SQL_FILE = "supabase-migrations\create-crm-analytics-tables.sql"
$PROJECT_ROOT = "c:\Users\Smart Business\Desktop\terangafoncier"

Set-Location $PROJECT_ROOT

# Vérifier que le fichier SQL existe
if (-not (Test-Path $SQL_FILE)) {
    Write-Host "❌ Erreur: Fichier SQL non trouvé: $SQL_FILE" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichier SQL trouvé: $SQL_FILE" -ForegroundColor Green
Write-Host ""

# Afficher les tables qui seront créées
Write-Host "📋 Tables à créer:" -ForegroundColor Yellow
Write-Host "  1. crm_contacts" -ForegroundColor White
Write-Host "  2. crm_interactions" -ForegroundColor White
Write-Host "  3. activity_logs" -ForegroundColor White
Write-Host "  4. property_views" -ForegroundColor White
Write-Host "  5. messages" -ForegroundColor White
Write-Host "  6. conversations" -ForegroundColor White
Write-Host ""

Write-Host "🔒 Policies RLS à créer:" -ForegroundColor Yellow
Write-Host "  - Vendors can view/insert/update/delete their contacts" -ForegroundColor White
Write-Host "  - Vendors can view/insert their interactions" -ForegroundColor White
Write-Host "  - Users can view their activity logs" -ForegroundColor White
Write-Host "  - Admins can view all activity logs" -ForegroundColor White
Write-Host "  - Anyone can insert property views" -ForegroundColor White
Write-Host "  - Property owners can view their property views" -ForegroundColor White
Write-Host "  - Users can view/insert/update their messages/conversations" -ForegroundColor White
Write-Host ""

Write-Host "⚡ Fonctions Helper à créer:" -ForegroundColor Yellow
Write-Host "  - get_vendor_monthly_stats(vendor_uuid, months_ago)" -ForegroundColor White
Write-Host "  - get_vendor_top_properties(vendor_uuid, limit_count)" -ForegroundColor White
Write-Host ""

# Instructions
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  📝 INSTRUCTIONS D'EXÉCUTION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "OPTION 1 - Supabase Dashboard (Recommandé):" -ForegroundColor Green
Write-Host "  1. Ouvrir https://supabase.com/dashboard" -ForegroundColor White
Write-Host "  2. Sélectionner votre projet 'terangafoncier'" -ForegroundColor White
Write-Host "  3. Aller dans 'SQL Editor'" -ForegroundColor White
Write-Host "  4. Créer 'New query'" -ForegroundColor White
Write-Host "  5. Copier le contenu de:" -ForegroundColor White
Write-Host "     $SQL_FILE" -ForegroundColor Cyan
Write-Host "  6. Coller dans l'éditeur" -ForegroundColor White
Write-Host "  7. Cliquer 'Run' (Ctrl+Enter)" -ForegroundColor White
Write-Host "  8. Vérifier les messages de succès ✅" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 2 - Supabase CLI:" -ForegroundColor Yellow
Write-Host "  1. Installer Supabase CLI:" -ForegroundColor White
Write-Host "     npm install -g supabase" -ForegroundColor Cyan
Write-Host "  2. Se connecter:" -ForegroundColor White
Write-Host "     supabase login" -ForegroundColor Cyan
Write-Host "  3. Lier le projet:" -ForegroundColor White
Write-Host "     supabase link --project-ref YOUR_PROJECT_REF" -ForegroundColor Cyan
Write-Host "  4. Exécuter le script:" -ForegroundColor White
Write-Host "     supabase db push" -ForegroundColor Cyan
Write-Host ""

Write-Host "OPTION 3 - psql (PostgreSQL CLI):" -ForegroundColor Yellow
Write-Host "  1. Obtenir la connection string depuis Supabase Dashboard" -ForegroundColor White
Write-Host "  2. Exécuter:" -ForegroundColor White
Write-Host "     psql 'postgresql://...' -f $SQL_FILE" -ForegroundColor Cyan
Write-Host ""

# Ouvrir le fichier SQL dans l'éditeur par défaut
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
$response = Read-Host "Voulez-vous ouvrir le fichier SQL maintenant? (O/N)"

if ($response -eq "O" -or $response -eq "o") {
    Write-Host ""
    Write-Host "📝 Ouverture du fichier SQL..." -ForegroundColor Green
    Start-Process $SQL_FILE
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  🔗 LIENS RAPIDES" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Supabase Dashboard:" -ForegroundColor Yellow
Write-Host "  https://supabase.com/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentation Supabase SQL:" -ForegroundColor Yellow
Write-Host "  https://supabase.com/docs/guides/database/sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "Documentation RLS:" -ForegroundColor Yellow
Write-Host "  https://supabase.com/docs/guides/database/postgres/row-level-security" -ForegroundColor Cyan
Write-Host ""

# Vérification post-exécution
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ✅ VÉRIFICATION POST-EXÉCUTION" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Après l'exécution du SQL, vérifiez que:" -ForegroundColor Yellow
Write-Host "  ✓ Les 6 tables sont créées" -ForegroundColor White
Write-Host "  ✓ Les RLS policies sont actives (bouclier vert)" -ForegroundColor White
Write-Host "  ✓ Les index sont créés" -ForegroundColor White
Write-Host "  ✓ Les triggers sont actifs" -ForegroundColor White
Write-Host "  ✓ Les fonctions helper existent" -ForegroundColor White
Write-Host "  ✓ Les données de test sont insérées (3 contacts)" -ForegroundColor White
Write-Host ""

Write-Host "Pour vérifier dans Supabase Dashboard:" -ForegroundColor Yellow
Write-Host "  1. Table Editor → Vérifier présence des tables" -ForegroundColor White
Write-Host "  2. Database → Policies → Vérifier les RLS" -ForegroundColor White
Write-Host "  3. SQL Editor → Tester les fonctions:" -ForegroundColor White
Write-Host "     SELECT * FROM crm_contacts;" -ForegroundColor Cyan
Write-Host "     SELECT get_vendor_monthly_stats('USER_UUID', 0);" -ForegroundColor Cyan
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  📞 SUPPORT" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Email: palaye122@gmail.com" -ForegroundColor White
Write-Host "Téléphone: +221 77 593 42 41" -ForegroundColor White
Write-Host ""

Write-Host "✨ Script terminé avec succès!" -ForegroundColor Green
Write-Host ""

# Pause pour lire les instructions
Read-Host "Appuyez sur Entrée pour fermer..."
