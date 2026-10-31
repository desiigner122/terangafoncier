# Script de correction simple sans caracteres speciaux
Write-Host "CORRECTION SELON IA SUPABASE" -ForegroundColor Green
Write-Host ""
Write-Host "PROBLEMES DETECTES:" -ForegroundColor Yellow
Write-Host "1. Bucket avatars manquant ou mal configure" -ForegroundColor White
Write-Host "2. Colonne phone manquante dans public.users" -ForegroundColor White  
Write-Host "3. Politiques RLS insuffisantes" -ForegroundColor White
Write-Host ""
Write-Host "INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "1. Ouvrez https://app.supabase.com" -ForegroundColor White
Write-Host "2. SQL Editor > New Query" -ForegroundColor White
Write-Host "3. Copiez fix-supabase-ai-recommendations.sql" -ForegroundColor White
Write-Host "4. Executez le script" -ForegroundColor White
Write-Host ""
Write-Host "RESULTAT ATTENDU:" -ForegroundColor Green
Write-Host "CORRECTIONS APPLIQUEES SELON RECOMMANDATIONS IA SUPABASE" -ForegroundColor White
Write-Host ""
Write-Host "OUVERTURE AUTOMATIQUE DE SUPABASE..." -ForegroundColor Green
Start-Process "https://app.supabase.com"
Write-Host ""
Write-Host "FICHIER A COPIER:" -ForegroundColor Yellow
Write-Host "fix-supabase-ai-recommendations.sql" -ForegroundColor Cyan
