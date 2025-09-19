Write-Host "🔧 Correction automatique de tous les YOUR_API_KEY..." -ForegroundColor Green

# Obtenir tous les fichiers jsx/js/ts/tsx
$files = Get-ChildItem -Path "src" -Recurse -Include "*.jsx", "*.js", "*.ts", "*.tsx"

$correctedFiles = 0

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Corrections des patterns courants YOUR_API_KEY
        $content = $content -replace 'YOUR_API_KEY="([^"]*)"', 'placeholder="$1"'
        $content = $content -replace "YOUR_API_KEY='([^']*)'", "placeholder='$1'"
        $content = $content -replace 'YOUR_API_KEY\s*=\s*"([^"]*)"', 'placeholder="$1"'
        $content = $content -replace "YOUR_API_KEY\s*=\s*'([^']*)'", "placeholder='$1'"
        $content = $content -replace 'YOUR_API_KEY\s*=\s*\{YOUR_API_KEY\}', 'placeholder={placeholder}'
        $content = $content -replace 'const\s+YOUR_API_KEY\s*=', 'const placeholder ='
        $content = $content -replace 'YOUR_API_KEY:', 'placeholder:'
        $content = $content -replace 'YOUR_API_KEYImage', 'placeholderImage'
        
        # Si le contenu a changé, sauvegarder
        if ($content -ne $originalContent) {
            Set-Content $file.FullName $content -Encoding UTF8
            Write-Host "  ✅ Corrigé: $($file.Name)" -ForegroundColor Yellow
            $correctedFiles++
        }
    }
    catch {
        Write-Host "  ❌ Erreur avec $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host "🎉 Correction terminée! $correctedFiles fichiers corrigés." -ForegroundColor Green