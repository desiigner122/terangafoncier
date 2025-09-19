Write-Host "Correction finale des imports useAuth incorrects..." -ForegroundColor Green

$files = @(
    "src/pages/GeometreDashboard.jsx",
    "src/pages/ProfilePageFixed.jsx", 
    "src/pages/ProfilePage.jsx",
    "src/pages/parcel-detail/ParcelActionsCard.jsx",
    "src/pages/NotaireDashboard.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Correction de $file..." -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw -Encoding UTF8
        
        if ($content -match "import.*useAuth.*from.*@/context/AuthContext") {
            Write-Host "  -> Import incorrect trouvé, correction..." -ForegroundColor Red
            $content = $content -replace "import\s*{[^}]*useAuth[^}]*}\s*from\s*'@/context/AuthContext';?", "import { useAuth } from '@/contexts/TempSupabaseAuthContext';"
            Set-Content $file $content -Encoding UTF8
            Write-Host "  -> ✅ Corrigé" -ForegroundColor Green
        } else {
            Write-Host "  -> Aucune correction nécessaire" -ForegroundColor Gray
        }
    }
}

Write-Host "✅ Correction finale terminée!" -ForegroundColor Green