# Script pour nettoyer ParcellesVendeursPage.jsx et retirer les données mockées

$file = "c:\Users\Smart Business\Desktop\terangafoncier\src\pages\ParcellesVendeursPage.jsx"
$backup = "c:\Users\Smart Business\Desktop\terangafoncier\src\pages\ParcellesVendeursPage.jsx.backup"

# Faire un backup
Copy-Item $file $backup -Force
Write-Host "✓ Backup créé: $backup" -ForegroundColor Green

# Lire tout le fichier
$content = Get-Content $file -Raw

# Pattern pour supprimer tout le mock data entre les lignes
# On va supprimer de "const matchesRegion" jusqu'au `];` qui clôt le mock array

# Premier nettoyage: trouver et supprimer les objets mock entre "{" et "}"
$pattern1 = @'
(?s)const matchesCity.*?(?=\s+const matchesType = selectedType === 'Tous')
'@

$content = $content -replace $pattern1, ""

# Afficher combien de lignes on a maintenant
$lines = ($content -split "`n").Count
Write-Host "Fichier maintenant: $lines lignes" -ForegroundColor Cyan

# Sauvegarder le fichier nettoyé
$content | Out-File $file -Encoding UTF8 -NoNewline

Write-Host "✓ Fichier nettoyé sauvegardé" -ForegroundColor Green
Write-Host "" 
Write-Host "Vérifiez maintenant le fichier pour confirmer." -ForegroundColor Yellow
