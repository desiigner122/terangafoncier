Write-Host "Correction finale de tous les YOUR_API_KEY restants..." -ForegroundColor Green

$files = Get-ChildItem -Recurse -Path "src" -Include "*.jsx","*.js" | Where-Object { $_.Name -notlike "*.backup*" }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Corrections spécifiques pour les props React
    $content = $content -replace 'YOUR_API_KEY="([^"]*)"', 'placeholder="$1"'
    $content = $content -replace "YOUR_API_KEY='([^']*)'", "placeholder='`$1'"
    $content = $content -replace 'YOUR_API_KEY=\{([^}]*)\}', 'placeholder={$1}'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        Write-Host "Corrige: $($file.Name)" -ForegroundColor Cyan
    }
}

Write-Host "Correction terminee !" -ForegroundColor Green