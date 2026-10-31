# Script PowerShell pour corriger les problèmes d'encodage des caractères accentués
# Utilise les mappings d'encodage double UTF-8

Write-Host "🔧 Correction des problèmes d'encodage des caractères accentués..." -ForegroundColor Green

# Mappings des caractères mal encodés vers les bons caractères
$encodingMap = @{
    'Ã¨' = 'è'
    'Ã©' = 'é'
    'Ã ' = 'à'
    'Ã«' = 'ë'
    'Ãª' = 'ê'
    'Ã´' = 'ô'
    'Ã¢' = 'â'
    'Ã¹' = 'ù'
    'Ã»' = 'û'
    'Ã®' = 'î'
    'Ã¯' = 'ï'
    'Ã§' = 'ç'
    'Ã±' = 'ñ'
    'Ã€' = 'À'
    'Ã‰' = 'É'
    'Ãˆ' = 'È'
    'ÃŠ' = 'Ê'
    'Ã‡' = 'Ç'
    'Ã"' = 'Ô'
    'Ã‚' = 'Â'
    'Ã™' = 'Ù'
    'Ã›' = 'Û'
    'ÃŽ' = 'Î'
    'Ã' = 'Ï'
    'â€™' = "'"
    'â€œ' = '"'
    'â€' = '"'
    'â€"' = '–'
    'â€"' = '—'
    'â€¢' = '•'
    'âœ…' = '✅'
    'âŒ' = '❌'
    'ðŸšª' = '🚪'
    'ðŸ"„' = '🔄'
}

# Extensions de fichiers à traiter
$extensions = @('*.js', '*.jsx', '*.ts', '*.tsx', '*.html', '*.css', '*.json', '*.md')

# Trouver tous les fichiers à traiter
$filesToProcess = @()
foreach ($ext in $extensions) {
    $filesToProcess += Get-ChildItem -Path "." -Filter $ext -Recurse | Where-Object { 
        $_.FullName -notlike "*node_modules*" -and 
        $_.FullName -notlike "*.git*" -and
        $_.FullName -notlike "*dist*" -and
        $_.FullName -notlike "*build*"
    }
}

Write-Host "📁 $($filesToProcess.Count) fichiers trouvés à traiter..." -ForegroundColor Yellow

$filesModified = 0
$totalReplacements = 0

foreach ($file in $filesToProcess) {
    try {
        # Lire le contenu du fichier en UTF-8
        $content = Get-Content -Path $file.FullName -Encoding UTF8 -Raw
        $originalContent = $content
        $replacements = 0
        
        # Appliquer toutes les corrections d'encodage
        foreach ($badChar in $encodingMap.Keys) {
            $goodChar = $encodingMap[$badChar]
            if ($content.Contains($badChar)) {
                $content = $content.Replace($badChar, $goodChar)
                $replacements++
                $totalReplacements++
            }
        }
        
        # Sauvegarder seulement si des changements ont été effectués
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            Write-Host "✅ $($file.Name) - $replacements corrections" -ForegroundColor Green
            $filesModified++
        }
    }
    catch {
        Write-Host "❌ Erreur avec $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n📊 RÉSUMÉ:" -ForegroundColor Cyan
Write-Host "   • Fichiers traités: $($filesToProcess.Count)" -ForegroundColor White
Write-Host "   • Fichiers modifiés: $filesModified" -ForegroundColor Green
Write-Host "   • Total corrections: $totalReplacements" -ForegroundColor Yellow

if ($filesModified -gt 0) {
    Write-Host "`n🎉 Correction terminée avec succès!" -ForegroundColor Green
    Write-Host "   Tous les caractères accentués ont été corrigés." -ForegroundColor White
} else {
    Write-Host "`n✨ Aucune correction nécessaire - encodage déjà correct!" -ForegroundColor Green
}

Write-Host "`n💡 Pour vérifier les résultats, rechargez votre application." -ForegroundColor Cyan