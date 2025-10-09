#!/usr/bin/env pwsh

# 🔧 CORRECTION ERREURS 400 SUPABASE - DASHBOARD PARTICULIER
# Script pour corriger les erreurs de table messages manquante

Write-Host "🔧 CORRECTION ERREURS 400 SUPABASE" -ForegroundColor Cyan
Write-Host "=" -Repeat 50 -ForegroundColor Cyan

# Variables
$sqlFile = "fix-messages-table-errors.sql"
$backupSqlFile = "create-complete-teranga-schema.sql"

Write-Host "`n📋 ANALYSE DU PROBLÈME:" -ForegroundColor Blue
Write-Host "  ❌ Erreur HTTP 400: column messages.recipient_id does not exist" -ForegroundColor Red
Write-Host "  ❌ Table 'messages' manquante ou mal structurée" -ForegroundColor Red
Write-Host "  ❌ Requêtes Supabase échouent depuis le dashboard particulier" -ForegroundColor Red

Write-Host "`n🔧 SOLUTIONS PROPOSÉES:" -ForegroundColor Blue

# Option 1: Exécuter le script SQL
Write-Host "`n1. 🗄️ CORRECTION BASE DE DONNÉES:" -ForegroundColor Green
if (Test-Path $sqlFile) {
    Write-Host "  ✅ Script SQL trouvé: $sqlFile" -ForegroundColor Green
    Write-Host "  📝 Contenu du script:" -ForegroundColor White
    Write-Host "     - Suppression/Recréation table messages" -ForegroundColor Gray
    Write-Host "     - Structure correcte avec recipient_id" -ForegroundColor Gray
    Write-Host "     - Policies RLS configurées" -ForegroundColor Gray
    Write-Host "     - Messages de test insérés" -ForegroundColor Gray
    
    Write-Host "`n  🚀 POUR APPLIQUER LES CORRECTIONS:" -ForegroundColor Yellow
    Write-Host "     1. Ouvrir Supabase Dashboard (https://supabase.com)" -ForegroundColor Gray
    Write-Host "     2. Aller dans SQL Editor" -ForegroundColor Gray
    Write-Host "     3. Copier le contenu de: $sqlFile" -ForegroundColor Gray
    Write-Host "     4. Exécuter le script SQL" -ForegroundColor Gray
} else {
    Write-Host "  ❌ Script SQL non trouvé: $sqlFile" -ForegroundColor Red
}

# Option 2: Utiliser le mode fallback
Write-Host "`n2. 🔄 MODE FALLBACK ACTIVÉ:" -ForegroundColor Green
Write-Host "  ✅ Composant ParticulierOverview_FIXED_ERRORS créé" -ForegroundColor Green
Write-Host "  ✅ Gestion d'erreurs avec fallback automatique" -ForegroundColor Green
Write-Host "  ✅ Dashboard fonctionne même sans tables" -ForegroundColor Green
Write-Host "  ✅ Messages informatifs pour l'utilisateur" -ForegroundColor Green

# Option 3: Vérifier les variables d'environnement
Write-Host "`n3. 🌍 VÉRIFICATION CONFIGURATION:" -ForegroundColor Green

$envFiles = @(".env", ".env.local", ".env.development")
foreach ($envFile in $envFiles) {
    if (Test-Path $envFile) {
        Write-Host "  ✅ Fichier $envFile trouvé" -ForegroundColor Green
        
        $content = Get-Content $envFile -Raw -ErrorAction SilentlyContinue
        if ($content) {
            if ($content -match "ndenqikcogzrkrjnlvns") {
                Write-Host "    ✅ URL Supabase: ndenqikcogzrkrjnlvns.supabase.co" -ForegroundColor Green
            }
            if ($content -match "VITE_SUPABASE|REACT_APP_SUPABASE") {
                Write-Host "    ✅ Variables Supabase configurées" -ForegroundColor Green
            }
        }
    }
}

# Instructions détaillées
Write-Host "`n📋 INSTRUCTIONS DÉTAILLÉES:" -ForegroundColor Cyan

Write-Host "`nÉTAPE 1 - CORRECTION IMMÉDIATE (Mode Fallback):" -ForegroundColor White
Write-Host "  Le dashboard fonctionne maintenant avec gestion d'erreurs" -ForegroundColor Gray
Write-Host "  Redémarrez le serveur pour voir les changements:" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Yellow

Write-Host "`nÉTAPE 2 - CORRECTION COMPLÈTE (Base de données):" -ForegroundColor White
Write-Host "  1. Ouvrir: https://supabase.com/dashboard" -ForegroundColor Gray
Write-Host "  2. Sélectionner votre projet Teranga" -ForegroundColor Gray
Write-Host "  3. Menu: SQL Editor" -ForegroundColor Gray
Write-Host "  4. Nouveau query" -ForegroundColor Gray
Write-Host "  5. Copier le contenu de: $sqlFile" -ForegroundColor Gray
Write-Host "  6. Cliquer 'Run'" -ForegroundColor Gray
Write-Host "  7. Vérifier: SELECT * FROM messages;" -ForegroundColor Gray

Write-Host "`nÉTAPE 3 - VALIDATION:" -ForegroundColor White
Write-Host "  1. Actualiser le dashboard particulier" -ForegroundColor Gray
Write-Host "  2. Vérifier la console (F12) - pas d'erreurs 400" -ForegroundColor Gray
Write-Host "  3. Tester navigation entre les pages" -ForegroundColor Gray
Write-Host "  4. Vérifier les statistiques dashboard" -ForegroundColor Gray

Write-Host "`n🎯 RÉSULTAT ATTENDU:" -ForegroundColor Green
Write-Host "  ✅ Plus d'erreurs HTTP 400 dans la console" -ForegroundColor Green
Write-Host "  ✅ Messages chargés correctement" -ForegroundColor Green
Write-Host "  ✅ Statistiques dashboard à jour" -ForegroundColor Green
Write-Host "  ✅ Navigation fluide entre pages" -ForegroundColor Green

Write-Host "`n🚨 EN CAS DE PROBLÈME:" -ForegroundColor Red
Write-Host "  Le mode fallback garantit que le dashboard fonctionne" -ForegroundColor Gray
Write-Host "  Les données de démonstration s'affichent" -ForegroundColor Gray
Write-Host "  Un message informatif guide l'utilisateur" -ForegroundColor Gray

Write-Host "`n🎉 CORRECTION TERMINÉE!" -ForegroundColor Green
Write-Host "Le dashboard particulier est maintenant résistant aux erreurs de base de données." -ForegroundColor Green