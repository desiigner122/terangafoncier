# Script PowerShell robuste pour corriger TOUTES les duplications d'icones lucide-react
Write-Host "Correction complete des duplications d'icones..." -ForegroundColor Yellow

function Fix-LucideImportDuplicates {
    param([string]$FilePath)
    
    $content = Get-Content $FilePath -Raw -Encoding UTF8
    $originalContent = $content
    
    # Rechercher les imports lucide-react avec pattern flexible
    $pattern = '(?s)import\s*\{([^}]+)\}\s*from\s*[''"]lucide-react[''"];?'
    
    if ($content -match $pattern) {
        $importBlock = $matches[1]
        
        # Extraire tous les imports (gerer les sauts de ligne et espaces)
        $items = $importBlock -split ',' | ForEach-Object { $_.Trim() -replace '\s+', ' ' }
        
        # Suivre les icones uniques
        $uniqueIcons = @{}
        $cleanItems = @()
        
        foreach ($item in $items) {
            if ($item -match '^\s*(\w+)(\s+as\s+(\w+))?\s*$') {
                $iconName = $matches[1]
                $alias = if ($matches[3]) { $matches[3] } else { $iconName }
                
                # Utiliser l'alias comme cle unique
                if (-not $uniqueIcons.ContainsKey($alias)) {
                    $uniqueIcons[$alias] = $true
                    $cleanItems += $item.Trim()
                }
            }
        }
        
        if ($cleanItems.Count -gt 0) {
            # Reconstruire l'import proprement
            $newImport = "import { `n  " + ($cleanItems -join ", `n  ") + "`n} from 'lucide-react';"
            
            $newContent = $content -replace $pattern, $newImport
            
            if ($newContent -ne $originalContent) {
                Set-Content $FilePath $newContent -Encoding UTF8 -NoNewline
                return $true
            }
        }
    }
    
    return $false
}

# Traiter tous les fichiers
$files = Get-ChildItem -Path "src" -Include "*.jsx", "*.js" -Recurse
$fixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    
    if ($content -and $content -match "lucide-react") {
        $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
        
        if (Fix-LucideImportDuplicates -FilePath $file.FullName) {
            Write-Host "Corrige: $relativePath" -ForegroundColor Green
            $fixed++
        }
    }
}

Write-Host "Fichiers corriges: $fixed" -ForegroundColor Cyan

if ($fixed -gt 0) {
    Write-Host "Nettoyage du cache..." -ForegroundColor Yellow
    
    if (Test-Path "node_modules\.vite") {
        Remove-Item "node_modules\.vite" -Recurse -Force
    }
    
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force
    }
    
    Write-Host "Test de compilation..." -ForegroundColor Yellow
    npm run build
} else {
    Write-Host "Compilation directe..." -ForegroundColor Yellow
    npm run build
}
