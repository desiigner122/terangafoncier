# Script PowerShell pour corriger automatiquement les icones lucide-react invalides
# Executer depuis le repertoire racine du projet

Write-Host "Correction automatique des icones lucide-react invalides..." -ForegroundColor Yellow

# Definition des mappings de remplacement des icones invalides
$iconMappings = @{
    'Handshake' = 'Users'
    'Document' = 'FileText'
    'ChartBar' = 'BarChart3'
}

# Fonction pour remplacer les icones dans les imports
function Repair-IconImports {
    param(
        [string]$FilePath,
        [hashtable]$Mappings
    )
    
    $content = Get-Content $FilePath -Raw -Encoding UTF8
    $changed = $false
    
    foreach ($invalidIcon in $Mappings.Keys) {
        $validIcon = $Mappings[$invalidIcon]
        
        # Remplacer les imports directs simples
        if ($content -match $invalidIcon) {
            $content = $content -replace $invalidIcon, $validIcon
            $changed = $true
            Write-Host "  Remplacement: $invalidIcon -> $validIcon" -ForegroundColor Green
        }
    }
    
    if ($changed) {
        Set-Content $FilePath $content -Encoding UTF8 -NoNewline
        return $true
    }
    
    return $false
}

# Lister tous les fichiers JSX et JS dans src/
$files = Get-ChildItem -Path "src" -Include "*.jsx", "*.js", "*.ts", "*.tsx" -Recurse

$totalFiles = 0
$fixedFiles = 0

Write-Host "Analyse de $($files.Count) fichiers..." -ForegroundColor Cyan

foreach ($file in $files) {
    $totalFiles++
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    
    # Verifier si le fichier contient des imports lucide-react avec des icones invalides
    $content = Get-Content $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    
    if ($content -and $content -match "from.*lucide-react") {
        $hasInvalidIcons = $false
        
        foreach ($invalidIcon in $iconMappings.Keys) {
            if ($content -match $invalidIcon) {
                $hasInvalidIcons = $true
                break
            }
        }
        
        if ($hasInvalidIcons) {
            Write-Host "Correction: $relativePath" -ForegroundColor Magenta
            
            if (Repair-IconImports -FilePath $file.FullName -Mappings $iconMappings) {
                $fixedFiles++
                Write-Host "  Fichier corrige" -ForegroundColor Green
            }
        }
    }
}

Write-Host ""
Write-Host "Resume:" -ForegroundColor Cyan
Write-Host "  Fichiers analyses: $totalFiles" -ForegroundColor White
Write-Host "  Fichiers corriges: $fixedFiles" -ForegroundColor Green

if ($fixedFiles -gt 0) {
    Write-Host ""
    Write-Host "Nettoyage du cache..." -ForegroundColor Yellow
    
    # Nettoyer le cache Vite
    if (Test-Path "node_modules\.vite") {
        Remove-Item "node_modules\.vite" -Recurse -Force
        Write-Host "  Cache Vite supprime" -ForegroundColor Green
    }
    
    # Nettoyer le dossier dist
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force
        Write-Host "  Dossier dist supprime" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "Test de compilation..." -ForegroundColor Yellow
    
    try {
        $buildResult = npm run build 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Compilation reussie!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Toutes les icones ont ete corrigees avec succes!" -ForegroundColor Green
        } else {
            Write-Host "  Erreurs de compilation detectees:" -ForegroundColor Red
            Write-Host $buildResult -ForegroundColor Red
            Write-Host ""
            Write-Host "Des erreurs supplementaires peuvent necessiter une correction manuelle." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  Erreur lors de l'execution de npm run build" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "Aucune correction necessaire - tous les fichiers sont deja corrects!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Script termine." -ForegroundColor Cyan
