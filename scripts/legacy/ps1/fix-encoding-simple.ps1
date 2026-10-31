# Script PowerShell pour corriger les problemes d'encodage
Write-Host "Correction des problemes d'encodage..." -ForegroundColor Green

# Mappings simples des caracteres mal encodes
$replacements = @{
    'Ã¨' = 'è'
    'Ã©' = 'é'
    'Ã ' = 'à'
    'Ã´' = 'ô'
    'Ã¢' = 'â'
    'Ã¹' = 'ù'
    'Ã»' = 'û'
    'Ã®' = 'î'
    'Ã§' = 'ç'
    'Ã‰' = 'É'
    'Ã©' = 'é'
    'Ã¯' = 'ï'
    'Ã«' = 'ë'
}

# Trouver les fichiers JS, JSX, HTML
$files = Get-ChildItem -Path "." -Include "*.js", "*.jsx", "*.html", "*.css" -Recurse | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.FullName -notlike "*.git*"
}

$modified = 0
foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Encoding UTF8 -Raw
    $original = $content
    
    foreach ($bad in $replacements.Keys) {
        $good = $replacements[$bad]
        $content = $content.Replace($bad, $good)
    }
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Corrige: $($file.Name)" -ForegroundColor Yellow
        $modified++
    }
}

Write-Host "Fichiers corriges: $modified" -ForegroundColor Green