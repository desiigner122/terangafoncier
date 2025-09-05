# Script PowerShell simplifié pour corriger les icônes lucide-react invalides
Write-Host "Correction des icônes lucide-react invalides..." -ForegroundColor Yellow

$iconMappings = @{
    'Handshake' = 'Users'
    'Document'  = 'FileText'
    'ChartBar'  = 'BarChart3'
}

function Repair-IconImports {
    param(
        [string]$FilePath,
        [hashtable]$Mappings
    )

    $content = Get-Content $FilePath -Raw -Encoding UTF8
    $original = $content
    $changed = $false

    foreach ($invalid in $Mappings.Keys) {
        $valid = $Mappings[$invalid]
        $wordPattern = '\b' + [Regex]::Escape($invalid) + '\b'
        if ([Regex]::IsMatch($content, $wordPattern)) {
            $content = [Regex]::Replace($content, $wordPattern, $valid)
            $changed = $true
            Write-Host "  Remplacement: $invalid -> $valid" -ForegroundColor Green
        }
        # alias patterns
        $alias1 = 'HeartHandshake\s+as\s+' + [Regex]::Escape($invalid)
        $alias2 = 'HeartUsers\s+as\s+' + [Regex]::Escape($invalid)
        if ([Regex]::IsMatch($content, $alias1)) {
            $content = [Regex]::Replace($content, $alias1, $valid)
            $changed = $true
        }
        if ([Regex]::IsMatch($content, $alias2)) {
            $content = [Regex]::Replace($content, $alias2, $valid)
            $changed = $true
        }
    }

    if ($changed) {
        Set-Content $FilePath -Value $content -Encoding UTF8 -NoNewline
        return $true
    }
    return $false
}

$files = Get-ChildItem -Path "src" -Include "*.jsx", "*.js", "*.ts", "*.tsx" -Recurse

$total = 0
$fixed = 0
foreach ($f in $files) {
    $total++
    $content = Get-Content $f.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    if ($content -and $content -match "lucide-react") {
        $needs = $false
        foreach ($k in $iconMappings.Keys) {
            if ($content -match ('\b' + [Regex]::Escape($k) + '\b')) { $needs = $true; break }
        }
        if ($needs) {
            Write-Host "Correction: $($f.FullName.Replace((Get-Location).Path + '\\', ''))" -ForegroundColor Magenta
            if (Repair-IconImports -FilePath $f.FullName -Mappings $iconMappings) {
                $fixed++
                Write-Host "  Fichier corrigé" -ForegroundColor Green
            }
        }
    }
}

Write-Host "`nResume: $fixed fichiers corriges sur $total analysés" -ForegroundColor Cyan

if ($fixed -gt 0) {
    if (Test-Path "node_modules\.vite") { Remove-Item "node_modules\.vite" -Recurse -Force -ErrorAction SilentlyContinue }
    if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue }
    Write-Host "Lancement du build..." -ForegroundColor Yellow
    try { npm run build } catch { Write-Host "Build a echoue" -ForegroundColor Red; Write-Host $_.Exception.Message -ForegroundColor Red }
} else { Write-Host "Aucune correction nécessaire" -ForegroundColor Green }

Write-Host "Script termine." -ForegroundColor Cyan
