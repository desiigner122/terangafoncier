# Script pour corriger tous les imports useAuth vers TempSupabaseAuthContext

Write-Host "Correction des imports useAuth..." -ForegroundColor Yellow

$rootPath = "C:\Users\Smart Business\Desktop\terangafoncier"
$srcPath = Join-Path $rootPath "src"

# Trouver tous les fichiers .jsx et .js dans src/
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.jsx", "*.js" | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and
    $_.FullName -notlike "*\.git*"
}

$fixedCount = 0

foreach ($file in $files) {
    try {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # Verifier s'il y a l'ancien import AuthProvider
        if ($content -match "import\s*{\s*useAuth\s*}\s*from\s*['\`"]@/contexts/AuthProvider['\`"];?") {
            # Remplacer par TempSupabaseAuthContext
            $newContent = $content -replace "import\s*{\s*useAuth\s*}\s*from\s*['\`"]@/contexts/AuthProvider['\`"];?", "import { useAuth } from '@/contexts/TempSupabaseAuthContext';"
            
            # Sauvegarder le fichier
            Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
            Write-Host "Corrige: $($file.Name)" -ForegroundColor Green
            $fixedCount++
        }
    }
    catch {
        Write-Host "Erreur avec $($file.Name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Correction terminee! $fixedCount fichiers corriges." -ForegroundColor Cyan