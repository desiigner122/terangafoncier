# Script de migration complète vers UnifiedAuthContext
Write-Host "🔄 Migration TempSupabaseAuthContext → UnifiedAuthContext" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow

$sourceDir = "src"
$oldContext = "TempSupabaseAuthContext"
$newContext = "UnifiedAuthContext"
$filesChanged = 0

# Fonction pour traiter un fichier
function Update-AuthImport {
    param([string]$filePath)
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Remplacer l'import du contexte
        $content = $content -replace "import \{ useAuth \} from '@/contexts/$oldContext';", "import { useAuth } from '@/contexts/$newContext';"
        
        if ($content -ne $originalContent) {
            Set-Content $filePath $content -Encoding UTF8 -NoNewline
            Write-Host "✅ $($filePath -replace '.*\\', '')" -ForegroundColor Green
            return $true
        }
    }
    return $false
}

# Rechercher tous les fichiers .jsx et .js dans src/
$files = Get-ChildItem -Path $sourceDir -Recurse -Include "*.jsx", "*.js" | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.FullName -notlike "*dist*" -and
    $_.FullName -notlike "*build*"
}

Write-Host "📁 Traitement de $($files.Count) fichiers..." -ForegroundColor Cyan

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content -and $content.Contains($oldContext)) {
        if (Update-AuthImport -filePath $file.FullName) {
            $filesChanged++
        }
    }
}

Write-Host "`n📊 RÉSUMÉ DE LA MIGRATION" -ForegroundColor Green
Write-Host "═══════════════════════════" -ForegroundColor Yellow
Write-Host "📄 Fichiers traités: $($files.Count)" -ForegroundColor White
Write-Host "✅ Fichiers modifiés: $filesChanged" -ForegroundColor Green
Write-Host "🔄 $oldContext → $newContext" -ForegroundColor Cyan

if ($filesChanged -gt 0) {
    Write-Host "`n🎉 Migration terminée avec succès !" -ForegroundColor Green
    Write-Host "🔄 Redémarrez le serveur de développement pour appliquer les changements" -ForegroundColor Yellow
} else {
    Write-Host "`n✨ Aucune modification nécessaire - Migration déjà effectuée" -ForegroundColor Cyan
}

Write-Host "`n🌐 Services à redémarrer:" -ForegroundColor Cyan
Write-Host "- Frontend: Ctrl+C puis npm run dev" -ForegroundColor White
Write-Host "- Backend: Déjà actif sur port 3000" -ForegroundColor White