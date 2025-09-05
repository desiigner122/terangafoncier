# Script PowerShell pour corriger automatiquement les icônes lucide-react invalides
# Exécuter depuis le répertoire racine du projet

Write-Host "🔧 Correction automatique des icônes lucide-react invalides..." -ForegroundColor Yellow

# Définir les mappings de remplacement des icônes invalides
$iconMappings = @{
    'Handshake' = 'Users'
    'Document' = 'FileText'
    'ChartBar' = 'BarChart3'
}

Write-Host "📝 Icônes à corriger:" -ForegroundColor Cyan
foreach ($invalid in $iconMappings.Keys) {
    $valid = $iconMappings[$invalid]
    Write-Host "  • $invalid → $valid" -ForegroundColor White
}

# Fonction pour remplacer les icônes dans un fichier
function Fix-IconsInFile {
    param(
        [string]$FilePath,
        [hashtable]$Mappings
    )
    
    try {
        $content = Get-Content $FilePath -Raw -Encoding UTF8
        $originalContent = $content
        $changed = $false
        
        foreach ($invalidIcon in $Mappings.Keys) {
            $validIcon = $Mappings[$invalidIcon]
            
            # Pattern simple pour éviter les problèmes de regex
            if ($content.Contains($invalidIcon)) {
                $content = $content.Replace($invalidIcon, $validIcon)
                $changed = $true
                Write-Host "    ✅ $invalidIcon → $validIcon" -ForegroundColor Green
            }
        }
        
        if ($changed) {
            Set-Content $FilePath $content -Encoding UTF8 -NoNewline
            return $true
        }
        
        return $false
    }
    catch {
        Write-Host "    ❌ Erreur lors du traitement: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Lister tous les fichiers JSX et JS dans src/
Write-Host "`n📁 Recherche des fichiers à corriger..." -ForegroundColor Cyan

$files = Get-ChildItem -Path "src" -Include "*.jsx", "*.js", "*.ts", "*.tsx" -Recurse
$totalFiles = 0
$fixedFiles = 0

foreach ($file in $files) {
    $totalFiles++
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    
    # Vérifier si le fichier contient des imports lucide-react
    try {
        $content = Get-Content $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
        
        if ($content -and $content.Contains("lucide-react")) {
            $hasInvalidIcons = $false
            
            foreach ($invalidIcon in $iconMappings.Keys) {
                if ($content.Contains($invalidIcon)) {
                    $hasInvalidIcons = $true
                    break
                }
            }
            
            if ($hasInvalidIcons) {
                Write-Host "🔍 Correction: $relativePath" -ForegroundColor Magenta
                
                if (Fix-IconsInFile -FilePath $file.FullName -Mappings $iconMappings) {
                    $fixedFiles++
                }
            }
        }
    }
    catch {
        Write-Host "❌ Erreur lecture fichier: $relativePath" -ForegroundColor Red
    }
}

Write-Host "`n📊 Résumé:" -ForegroundColor Cyan
Write-Host "  • Fichiers analysés: $totalFiles" -ForegroundColor White
Write-Host "  • Fichiers corrigés: $fixedFiles" -ForegroundColor Green

if ($fixedFiles -gt 0) {
    Write-Host "`n🧹 Nettoyage du cache..." -ForegroundColor Yellow
    
    # Nettoyer le cache Vite
    if (Test-Path "node_modules\.vite") {
        Remove-Item "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Cache Vite supprimé" -ForegroundColor Green
    }
    
    # Nettoyer le dossier dist
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Dossier dist supprimé" -ForegroundColor Green
    }
    
    Write-Host "`n🚀 Test de compilation..." -ForegroundColor Yellow
    
    try {
        $env:NODE_OPTIONS = "--max-old-space-size=4096"
        & npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Compilation réussie!" -ForegroundColor Green
            Write-Host "🎉 Toutes les icônes ont été corrigées avec succès!" -ForegroundColor Green
        } else {
            Write-Host "❌ Erreurs de compilation détectées" -ForegroundColor Red
            Write-Host "⚠️ Des erreurs supplémentaires peuvent nécessiter une correction manuelle." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Erreur lors de l'exécution de npm run build: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`n✅ Aucune correction nécessaire - tous les fichiers sont déjà corrects!" -ForegroundColor Green
}

Write-Host "`n🏁 Script terminé." -ForegroundColor Cyan
