# Script PowerShell pour appliquer le responsive design aux 6 pages notaires restantes

$files = @(
    "src\pages\dashboards\notaire\NotaireTransactionsModernized.jsx",
    "src\pages\dashboards\notaire\NotaireAuthenticationModernized.jsx",
    "src\pages\dashboards\notaire\NotaireCasesModernized.jsx",
    "src\pages\dashboards\notaire\NotaireArchivesModernized.jsx",
    "src\pages\dashboards\notaire\NotaireAnalyticsModernized.jsx",
    "src\pages\dashboards\notaire\NotaireSettingsModernized.jsx"
)

Write-Host "🚀 Application du responsive design aux pages notaires..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        Write-Host "⚠️  Fichier introuvable: $file" -ForegroundColor Yellow
        continue
    }
    
    $fileName = Split-Path $file -Leaf
    Write-Host "✏️  Traitement de $fileName..." -ForegroundColor White
    
    # Backup
    Copy-Item $file "$file.bak" -Force
    
    # Lire le contenu
    $content = Get-Content $file -Raw -Encoding UTF8
    
    # Remplacements
    $content = $content -replace 'className="space-y-6"', 'className="space-y-4 sm:space-y-6"'
    $content = $content -replace 'className="p-6 space-y-6', 'className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6'
    $content = $content -replace 'text-3xl font-bold', 'text-xl sm:text-2xl lg:text-3xl font-bold'
    $content = $content -replace 'text-2xl font-semibold', 'text-lg sm:text-xl lg:text-2xl font-semibold'
    $content = $content -replace 'text-3xl font-bold text-', 'text-xl sm:text-2xl lg:text-3xl font-bold text-'
    $content = $content -replace 'text-2xl font-bold text-', 'text-xl sm:text-2xl font-bold text-'
    $content = $content -replace 'text-2xl font-semibold text-', 'text-xl sm:text-2xl font-semibold text-'
    $content = $content -replace 'h-12 w-12 bg-', 'h-10 w-10 sm:h-12 sm:w-12 bg-'
    $content = $content -replace 'h-12 w-12 text-', 'h-10 w-10 sm:h-12 sm:w-12 text-'
    $content = $content -replace 'h-6 w-6 text-', 'h-5 w-5 sm:h-6 sm:w-6 text-'
    $content = $content -replace 'CardContent className="p-6"', 'CardContent className="p-3 sm:p-4 lg:p-6"'
    $content = $content -replace 'Card className="p-6"', 'Card className="p-3 sm:p-4 lg:p-6"'
    $content = $content -replace 'gap-6', 'gap-3 sm:gap-4 lg:gap-6'
    $content = $content -replace 'gap-4"', 'gap-3 sm:gap-4"'
    $content = $content -replace 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4', 'grid-cols-2 lg:grid-cols-4'
    $content = $content -replace 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5', 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
    $content = $content -replace 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6', 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
    $content = $content -replace 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    $content = $content -replace 'text-sm font-medium text-gray', 'text-xs sm:text-sm font-medium text-gray'
    $content = $content -replace 'grid w-full grid-cols-2"', 'grid w-full grid-cols-2 h-auto"'
    $content = $content -replace 'grid w-full grid-cols-3', 'grid w-full grid-cols-2 sm:grid-cols-3 h-auto'
    $content = $content -replace 'grid w-full grid-cols-4', 'grid w-full grid-cols-2 sm:grid-cols-4 h-auto'
    $content = $content -replace 'grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7', 'grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto'
    $content = $content -replace 'grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4', 'grid gap-3 sm:gap-4 grid-cols-2 xl:grid-cols-4'
    $content = $content -replace 'grid gap-4 grid-cols-1 lg:grid-cols-2', 'grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2'
    $content = $content -replace 'grid gap-4 sm:grid-cols-2', 'grid gap-3 sm:gap-4 sm:grid-cols-2'
    $content = $content -replace 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4', 'grid-cols-2 xl:grid-cols-4'
    $content = $content -replace 'grid grid-cols-1 md:grid-cols-2', 'grid grid-cols-1 sm:grid-cols-2'
    $content = $content -replace 'text-xs text-gray', 'text-[10px] sm:text-xs text-gray'
    
    # Sauvegarder avec encoding UTF8
    $content | Set-Content $file -Encoding UTF8 -NoNewline
    
    Write-Host "✅ $fileName traité" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Responsive design appliqué à toutes les pages !" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Fichiers modifiés:" -ForegroundColor Cyan
foreach ($file in $files) {
    $fileName = Split-Path $file -Leaf
    Write-Host "   - $fileName" -ForegroundColor White
}
Write-Host ""
Write-Host "💾 Backups créés avec extension .bak" -ForegroundColor Yellow
Write-Host "🔍 Vérifiez les changements avec: git diff" -ForegroundColor Cyan
