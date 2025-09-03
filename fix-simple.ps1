# Script simple pour corriger les useToast
Write-Host "Correction des useToast..." -ForegroundColor Green

# Chercher tous les fichiers avec useToast
$files = Get-ChildItem -Path "src" -Recurse -Name "*.jsx" | Where-Object { (Get-Content "src\$_" -Raw) -match "useToast" }

Write-Host "Fichiers trouvés avec useToast:" -ForegroundColor Yellow
$files | ForEach-Object { Write-Host "  $_" }

Write-Host "`nRemplacement en cours..." -ForegroundColor Cyan

foreach ($file in $files) {
    $fullPath = "src\$file"
    if (Test-Path $fullPath) {
        try {
            $content = Get-Content $fullPath -Raw -Encoding UTF8
            
            # Remplacements simples
            $content = $content -replace 'const \{ toast \} = useToast\(\);', '// toast remplacé par window.safeGlobalToast'
            $content = $content -replace 'import \{ useToast \}.*?;', '// useToast import supprimé - utilisation window.safeGlobalToast'
            $content = $content -replace 'toast\(', 'window.safeGlobalToast('
            
            # Sauvegarder
            $content | Out-File -FilePath $fullPath -Encoding UTF8 -Force
            Write-Host "  Corrigé: $file" -ForegroundColor Green
        } catch {
            Write-Host "  Erreur: $file - $_" -ForegroundColor Red
        }
    }
}

Write-Host "`nTerminé!" -ForegroundColor Green
