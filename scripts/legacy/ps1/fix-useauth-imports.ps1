# Script pour corriger les imports useAuth vers le bon contexte
Write-Host "Correction des imports useAuth vers AuthProvider..." -ForegroundColor Cyan

$projectPath = "C:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier"
$srcPath = Join-Path $projectPath "src"

# Rechercher tous les fichiers .jsx et .js dans src/
$files = Get-ChildItem -Path $srcPath -Recurse -Include "*.jsx", "*.js"

$correctedFiles = 0

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $originalContent = $content
        
        # Remplacer les imports useAuth depuis @/lib/auth
        $content = $content -replace "import\s*{\s*useAuth\s*}\s*from\s*'@/lib/auth';?", "import { useAuth } from '@/contexts/AuthProvider';"
        
        # Si le contenu a changé, écrire le fichier
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "Corrigé: $($file.Name)" -ForegroundColor Green
            $correctedFiles++
        }
    }
    catch {
        Write-Host "Erreur avec: $($file.Name)" -ForegroundColor Red
    }
}

Write-Host "$correctedFiles fichiers corriges pour useAuth!" -ForegroundColor Green
