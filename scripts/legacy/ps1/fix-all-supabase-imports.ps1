# Script de remplacement global des imports Supabase
# Centralise tous les imports vers le nouveau client unique

$projectRoot = "C:\Users\Smart Business\Desktop\terangafoncier\src"

Write-Host "🔍 Recherche des imports Supabase à remplacer..." -ForegroundColor Cyan

# Pattern 1: customSupabaseClient
$pattern1 = "from '@/lib/customSupabaseClient'"
$replacement1 = "from '@/lib/supabaseClient'"

# Pattern 2: supabase sans Client
$pattern2 = "from '@/lib/supabase'"
$replacement2 = "from '@/lib/supabaseClient'"

$files = Get-ChildItem -Path $projectRoot -Include *.js,*.jsx,*.ts,*.tsx -Recurse

$totalChanges = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Skip le fichier supabaseClient.js lui-même
    if ($file.Name -eq "supabaseClient.js") {
        continue
    }
    
    # Remplacer pattern 1: customSupabaseClient
    $content = $content -replace [regex]::Escape("from '@/lib/customSupabaseClient'"), "from '@/lib/supabaseClient'"
    $content = $content -replace [regex]::Escape('from "./customSupabaseClient"'), 'from "./supabaseClient"'
    $content = $content -replace [regex]::Escape("from './customSupabaseClient'"), "from './supabaseClient'"
    
    # Remplacer pattern 2: from '@/lib/supabase' (exact match)
    $content = $content -replace "from '@/lib/supabase';", "from '@/lib/supabaseClient';"
    $content = $content -replace 'from "@/lib/supabase";', 'from "@/lib/supabaseClient";'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $changes = (($originalContent -split "`n").Count - ($content -split "`n").Count)
        Write-Host "✅ $($file.Name)" -ForegroundColor Green
        $totalChanges++
    }
}

Write-Host ""
Write-Host "✅ Remplacement terminé: $totalChanges fichiers modifiés" -ForegroundColor Green
Write-Host "📝 Tous les imports pointent maintenant vers @/lib/supabaseClient" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️ ÉTAPE SUIVANTE:" -ForegroundColor Red
Write-Host "Vérifiez que customSupabaseClient.js et supabase.js ne sont plus utilisés" -ForegroundColor Yellow
Write-Host "Si oui, supprimez-les:" -ForegroundColor Yellow
Write-Host "  Remove-Item 'src\lib\customSupabaseClient.js'" -ForegroundColor Cyan
Write-Host "  Remove-Item 'src\lib\supabase.js'" -ForegroundColor Cyan
