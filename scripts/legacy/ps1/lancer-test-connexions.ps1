# ======================================================================
# SCRIPT POWERSHELL - TEST DE CONNEXION SUPABASE
# Automatise l'installation et l'exécution du test
# ======================================================================

Write-Host "🚀 LANCEMENT DU TEST DE CONNEXION SUPABASE" -ForegroundColor Green
Write-Host "=" * 50

# Vérification de Node.js
Write-Host "🔍 Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host "   Téléchargez Node.js depuis: https://nodejs.org/"
    exit 1
}

# Installation des dépendances
Write-Host "`n🔄 Installation des dépendances..." -ForegroundColor Yellow
try {
    npm install @supabase/supabase-js --save
    Write-Host "✅ Dépendances installées" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

# Vérification de la configuration
Write-Host "`n🔧 CONFIGURATION REQUISE:" -ForegroundColor Yellow
Write-Host "Pour continuer, vous devez configurer:"
Write-Host "1. SUPABASE_URL dans test-connexions-supabase.js" -ForegroundColor Cyan
Write-Host "2. SUPABASE_ANON_KEY dans test-connexions-supabase.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "📍 Récupérez ces valeurs depuis:" -ForegroundColor Yellow
Write-Host "   Dashboard Supabase > Settings > API" -ForegroundColor White
Write-Host ""

# Demande de confirmation
$confirmation = Read-Host "Avez-vous configuré les variables? (y/N)"
if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host "❌ Configuration annulée" -ForegroundColor Red
    Write-Host "Modifiez le fichier test-connexions-supabase.js puis relancez ce script"
    exit 1
}

# Exécution du test
Write-Host "`n🚀 Lancement du test de connexion..." -ForegroundColor Green
Write-Host "=" * 50

try {
    node test-connexions-supabase.js
    Write-Host "`n✅ Test terminé!" -ForegroundColor Green
    
    # Vérification du rapport
    if (Test-Path "rapport-test-connexions.json") {
        Write-Host "📄 Rapport généré: rapport-test-connexions.json" -ForegroundColor Cyan
        
        # Lecture et affichage du résumé
        $rapport = Get-Content "rapport-test-connexions.json" | ConvertFrom-Json
        Write-Host "`n📊 RÉSUMÉ FINAL:" -ForegroundColor Yellow
        Write-Host "   Total testés: $($rapport.total_testes)" -ForegroundColor White
        Write-Host "   Succès: $($rapport.succes)" -ForegroundColor Green
        Write-Host "   Échecs: $($rapport.echecs)" -ForegroundColor Red
        Write-Host "   Taux de réussite: $($rapport.pourcentage_reussite)%" -ForegroundColor $(if ($rapport.pourcentage_reussite -gt 80) { "Green" } else { "Yellow" })
    }
    
} catch {
    Write-Host "❌ Erreur lors de l'exécution du test" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "`n🎯 PROCHAINES ÉTAPES RECOMMANDÉES:" -ForegroundColor Yellow
Write-Host "1. Analyser le rapport: rapport-test-connexions.json"
Write-Host "2. Corriger les comptes en échec si nécessaire"
Write-Host "3. Retester les comptes problématiques"

Write-Host "`n✨ Test de connexion terminé!" -ForegroundColor Green