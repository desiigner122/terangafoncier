# Correction automatique de tous les imports useAuth

Write-Host "🔧 Correction automatique de tous les imports useAuth..." -ForegroundColor Green
Write-Host ""

# Rechercher tous les fichiers qui utilisent l'ancien contexte
$searchResult = Get-ChildItem -Path "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\src" -Recurse -Filter "*.jsx" | Select-String -Pattern "useAuth.*from.*SupabaseAuthContext" | Select-Object -ExpandProperty Path | Sort-Object | Get-Unique

Write-Host "Fichiers trouvés avec l'ancien import :" -ForegroundColor Yellow
$searchResult | ForEach-Object { Write-Host "  - $($_.Replace('c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\', ''))" -ForegroundColor Gray }
Write-Host ""

$corrected = 0
$errors = 0

foreach ($filePath in $searchResult) {
    try {
        $relativePath = $filePath.Replace("c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\", "")
        Write-Host "Correction de: $relativePath" -ForegroundColor Cyan
        
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Remplacements nécessaires
        $newContent = $content
        $newContent = $newContent -replace "import \{ useAuth \} from '@/context/SupabaseAuthContext';", "import { useSupabaseAuth } from '@/contexts/SupabaseAuthContextFixed';"
        $newContent = $newContent -replace "import \{([^}]*), useAuth([^}]*)\} from '@/context/SupabaseAuthContext';", "import {`$1, useSupabaseAuth`$2} from '@/contexts/SupabaseAuthContextFixed';"
        $newContent = $newContent -replace "const \{ ([^}]+) \} = useAuth\(\);", "const { `$1 } = useSupabaseAuth();"
        $newContent = $newContent -replace "= useAuth\(\)", "= useSupabaseAuth()"
        
        if ($content -ne $newContent) {
            Set-Content -Path $filePath -Value $newContent -Encoding UTF8
            Write-Host "  ✅ Corrigé" -ForegroundColor Green
            $corrected++
        } else {
            Write-Host "  ➡️  Aucun changement nécessaire" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  ❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "📊 Résultats :" -ForegroundColor Cyan
Write-Host "  Fichiers corrigés : $corrected" -ForegroundColor Green
Write-Host "  Erreurs : $errors" -ForegroundColor Red

# Vérification post-correction
Write-Host ""
Write-Host "🔍 Vérification post-correction..." -ForegroundColor Yellow
$remainingIssues = Get-ChildItem -Path "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\src" -Recurse -Filter "*.jsx" | Select-String -Pattern "useAuth.*from.*SupabaseAuthContext" | Measure-Object | Select-Object -ExpandProperty Count

if ($remainingIssues -eq 0) {
    Write-Host "  ✅ Tous les imports ont été corrigés !" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  $remainingIssues imports restent à corriger" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Correction terminée !" -ForegroundColor Green
