# Script simple pour verifier et corriger les duplications d'icones
Write-Host "Verification des duplications d'icones..." -ForegroundColor Yellow

# Chercher des duplications dans les imports lucide-react
$duplicateFiles = @()

$files = Get-ChildItem -Path "src" -Include "*.jsx", "*.js" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    
    if ($content -and $content -match "lucide-react") {
        # Verifier les duplications communes
        if ($content -match "Users.*Users" -or 
            $content -match "Document.*Document" -or 
            $content -match "HeartUsers as Users.*Users") {
            $duplicateFiles += $file.FullName
            $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
            Write-Host "Duplication detectee: $relativePath" -ForegroundColor Red
        }
    }
}

if ($duplicateFiles.Count -eq 0) {
    Write-Host "Aucune duplication detectee!" -ForegroundColor Green
    Write-Host "Test de compilation finale..." -ForegroundColor Yellow
    npm run build
} else {
    Write-Host "Duplications trouvees dans $($duplicateFiles.Count) fichiers" -ForegroundColor Red
}

Write-Host "Verification terminee." -ForegroundColor Cyan
