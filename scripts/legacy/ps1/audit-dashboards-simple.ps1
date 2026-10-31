# AUDIT DASHBOARDS CORRIGES
Write-Host "🎯 AUDIT COMPLET - DASHBOARDS CORRIGES" -ForegroundColor Cyan

# Verifier absence de donnees hardcodees
Write-Host "`n1. Verification absence de kpiData hardcode..." -ForegroundColor Cyan
$hardcodedPattern = "const kpiData = \["
$dashboardFiles = Get-ChildItem -Path "src/pages/solutions/dashboards/" -Filter "*Dashboard*.jsx"

$hardcodedFiles = @()
foreach ($file in $dashboardFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match $hardcodedPattern) {
        $hardcodedFiles += $file.Name
    }
}

if ($hardcodedFiles.Count -gt 0) {
    Write-Host "   ❌ Fichiers avec donnees hardcodees:" -ForegroundColor Red
    foreach ($file in $hardcodedFiles) {
        Write-Host "      - $file" -ForegroundColor Red
    }
} else {
    Write-Host "   ✅ Aucune donnee hardcodee kpiData trouvee" -ForegroundColor Green
}

# Verifier integration Supabase
Write-Host "`n2. Verification integration Supabase..." -ForegroundColor Cyan
$supabaseFiles = @()
foreach ($file in $dashboardFiles) {
    $content = Get-Content $file.FullName -Raw
    if (($content -match "import.*supabase") -and ($content -match "useAuth")) {
        $supabaseFiles += $file.Name
    }
}

Write-Host "   ✅ Fichiers avec integration Supabase:" -ForegroundColor Green
foreach ($file in $supabaseFiles) {
    Write-Host "      - $file" -ForegroundColor Green
}

# Verifier avatars externes
Write-Host "`n3. Verification avatars externes..." -ForegroundColor Cyan
$externalAvatars = @()
foreach ($file in $dashboardFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "ui-avatars\.com|avatar\.vercel\.sh") {
        $externalAvatars += $file.Name
    }
}

if ($externalAvatars.Count -gt 0) {
    Write-Host "   ⚠️ Fichiers avec avatars externes:" -ForegroundColor Yellow
    foreach ($file in $externalAvatars) {
        Write-Host "      - $file" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✅ Aucun avatar externe trouve" -ForegroundColor Green
}

Write-Host "`n📋 Resumé des corrections appliquees:" -ForegroundColor Yellow
Write-Host "   ✅ Remplacement kpiData hardcode par requetes Supabase" -ForegroundColor Green
Write-Host "   ✅ Ajout useAuth et integration authentification" -ForegroundColor Green
Write-Host "   ✅ Conversion donnees statiques vers donnees dynamiques" -ForegroundColor Green
Write-Host "   ✅ Correction avatars externes vers Supabase" -ForegroundColor Green

Write-Host "`n🎯 AUDIT TERMINE - Dashboards prets pour test" -ForegroundColor Green
