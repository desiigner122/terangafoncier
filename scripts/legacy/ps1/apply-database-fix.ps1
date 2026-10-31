# ============================================
# SCRIPT D'AIDE POUR CORRIGER SUPABASE
# ============================================

Write-Host ""
Write-Host "🔧 CORRECTION DES ERREURS SUPABASE" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 ERREURS DÉTECTÉES:" -ForegroundColor Yellow
Write-Host "  1. ❌ Profil manquant pour user 3f3083ba-4f40-4045-b6e6-7f009a6c2cb2" -ForegroundColor Red
Write-Host "  2. ❌ Colonne 'metadata' manquante dans table 'requests'" -ForegroundColor Red
Write-Host "  3. ❌ Table 'tickets' n'existe pas (devrait être 'support_tickets')" -ForegroundColor Red
Write-Host ""

Write-Host "✅ SOLUTION: Exécuter le script SQL fix-database-errors.sql" -ForegroundColor Green
Write-Host ""

# Copier le script dans le presse-papier
$scriptPath = Join-Path $PSScriptRoot "fix-database-errors.sql"

if (Test-Path $scriptPath) {
    Write-Host "📋 Copie du script dans le presse-papier..." -ForegroundColor Cyan
    Get-Content $scriptPath | Set-Clipboard
    Write-Host "✅ Script copié!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⚠️  Fichier fix-database-errors.sql introuvable" -ForegroundColor Yellow
    Write-Host "   Chemin attendu: $scriptPath" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "📖 INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "ÉTAPE 1: Ouvrir Supabase Dashboard" -ForegroundColor White
Write-Host "  → Visitez: https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns" -ForegroundColor Gray
Write-Host ""

Write-Host "ÉTAPE 2: Aller dans SQL Editor" -ForegroundColor White
Write-Host "  → Menu gauche: 'SQL Editor' ou icône '{ }'" -ForegroundColor Gray
Write-Host ""

Write-Host "ÉTAPE 3: Créer une nouvelle requête" -ForegroundColor White
Write-Host "  → Cliquer sur 'New query' ou '+'" -ForegroundColor Gray
Write-Host ""

Write-Host "ÉTAPE 4: Coller le script" -ForegroundColor White
Write-Host "  → Ctrl+V (le script est déjà dans votre presse-papier!)" -ForegroundColor Gray
Write-Host ""

Write-Host "ÉTAPE 5: Exécuter le script" -ForegroundColor White
Write-Host "  → Cliquer sur 'Run' ou appuyer sur Ctrl+Enter" -ForegroundColor Gray
Write-Host ""

Write-Host "ÉTAPE 6: Vérifier les résultats" -ForegroundColor White
Write-Host "  → Vous devriez voir:" -ForegroundColor Gray
Write-Host "     ✓ 'Profil créé pour user...'" -ForegroundColor Green
Write-Host "     ✓ 'Colonne metadata ajoutée...'" -ForegroundColor Green
Write-Host "     ✓ Plusieurs tables affichées" -ForegroundColor Green
Write-Host ""

Write-Host "ÉTAPE 7: Retourner dans votre application" -ForegroundColor White
Write-Host "  → Rafraîchir la page (Ctrl+Shift+R)" -ForegroundColor Gray
Write-Host "  → Les erreurs devraient disparaître!" -ForegroundColor Green
Write-Host ""

Write-Host "💡 ASTUCE: Si vous avez des erreurs lors de l'exécution:" -ForegroundColor Cyan
Write-Host "  → C'est normal si certaines tables existent déjà" -ForegroundColor Gray
Write-Host "  → Le script utilise 'IF NOT EXISTS' et 'CREATE OR REPLACE'" -ForegroundColor Gray
Write-Host "  → Continuez jusqu'à la fin du script!" -ForegroundColor Gray
Write-Host ""

# Demander si on doit ouvrir le navigateur
$response = Read-Host "Voulez-vous ouvrir Supabase Dashboard maintenant? (O/N)"

if ($response -eq "O" -or $response -eq "o" -or $response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "🌐 Ouverture de Supabase Dashboard..." -ForegroundColor Cyan
    Start-Process "https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns/editor"
    Write-Host "✅ Dashboard ouvert dans votre navigateur!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Le script SQL est déjà dans votre presse-papier." -ForegroundColor Yellow
    Write-Host "   Collez-le simplement avec Ctrl+V dans l'éditeur SQL!" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "👍 Pas de problème!" -ForegroundColor Green
    Write-Host "   Quand vous serez prêt, ouvrez:" -ForegroundColor Gray
    Write-Host "   https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns/editor" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎯 SCRIPT PRÊT À ÊTRE EXÉCUTÉ!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Attendre une touche pour fermer
Write-Host "Appuyez sur une touche pour continuer..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
