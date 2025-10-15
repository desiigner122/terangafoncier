#!/usr/bin/env pwsh
# ========================================
# Script FINAL pour corriger la table requests
# ========================================

Write-Host "`n🔧 CORRECTION FINALE TABLE REQUESTS" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

Write-Host "🐛 ERREUR IDENTIFIÉE:" -ForegroundColor Red
Write-Host "   Contrainte 'requests_type_check' rejette 'installment_payment'`n" -ForegroundColor White

Write-Host "✅ CE SCRIPT VA:" -ForegroundColor Green
Write-Host "   1. Corriger la contrainte type (ajouter toutes les valeurs)" -ForegroundColor White
Write-Host "   2. Ajouter payment_type, installment_plan, bank_details, message" -ForegroundColor White
Write-Host "   3. Mettre à jour les données existantes" -ForegroundColor White
Write-Host "   4. Afficher la structure finale`n" -ForegroundColor White

Write-Host "📋 INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Le script SQL complet est copié dans votre presse-papiers" -ForegroundColor White
Write-Host "2. Ouvrez: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "3. Sélectionnez votre projet → SQL Editor" -ForegroundColor White
Write-Host "4. Collez (Ctrl+V) et cliquez sur RUN" -ForegroundColor White
Write-Host "5. Vérifiez les messages de succès ✅`n" -ForegroundColor White

# Lire le contenu du fichier SQL
$sqlScript = Get-Content "fix-requests-final-complete.sql" -Raw

# Copier dans le presse-papiers
try {
    Set-Clipboard -Value $sqlScript
    Write-Host "✅ Script SQL copié dans le presse-papiers!" -ForegroundColor Green
    Write-Host "   Fichier: fix-requests-final-complete.sql`n" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Erreur copie presse-papiers" -ForegroundColor Yellow
    Write-Host "   Ouvrez manuellement: fix-requests-final-complete.sql`n" -ForegroundColor White
}

Write-Host "📝 APRÈS L'EXÉCUTION DU SCRIPT SQL:" -ForegroundColor Yellow
Write-Host "1. ✅ Rechargez l'application (Ctrl+R dans le navigateur)" -ForegroundColor White
Write-Host "2. ✅ Testez le formulaire de paiement échelonné" -ForegroundColor White
Write-Host "3. ✅ Vérifiez 'Mes Achats' - la demande devrait apparaître" -ForegroundColor White
Write-Host "4. ✅ Connectez-vous en tant que vendeur" -ForegroundColor White
Write-Host "5. ✅ Vérifiez 'Demandes d'Achat' - devrait afficher la nouvelle demande`n" -ForegroundColor White

Write-Host "🚀 Les 3 pages de paiement sont maintenant corrigées:" -ForegroundColor Green
Write-Host "   • OneTimePaymentPage → type: 'one_time'" -ForegroundColor White
Write-Host "   • InstallmentsPaymentPage → type: 'installment_payment'" -ForegroundColor White
Write-Host "   • BankFinancingPage → type: 'bank_financing'`n" -ForegroundColor White

Write-Host "💡 RAPPEL: Les demandes s'afficheront uniquement pour les parcelles" -ForegroundColor Cyan
Write-Host "   appartenant au vendeur connecté (seller_id match).`n" -ForegroundColor White
