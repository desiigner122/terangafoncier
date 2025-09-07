# Script pour désactiver complètement Supabase et utiliser uniquement les comptes de test
# Version: 2025-09-07

Write-Host "🔄 Désactivation complète de Supabase..." -ForegroundColor Cyan

# 1. Créer un mock Supabase pour remplacer les imports
$mockSupabaseContent = @"
// Mock Supabase pour désactiver temporairement les appels DB
console.warn('⚠️ Supabase désactivé - Mode comptes de test uniquement');

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase désactivé') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: new Error('DB désactivée') }),
    update: () => ({ data: null, error: new Error('DB désactivée') }),
    delete: () => ({ data: null, error: new Error('DB désactivée') }),
    upsert: () => ({ data: null, error: new Error('DB désactivée') })
  })
};

export const createClient = () => supabase;
export default supabase;
"@

# Créer le mock dans tous les emplacements
$supabaseFiles = @(
    "src\lib\supabase.js",
    "src\lib\supabaseClient.js", 
    "src\lib\customSupabaseClient.js"
)

foreach ($file in $supabaseFiles) {
    $fullPath = $file
    if (Test-Path $fullPath) {
        Write-Host "📝 Désactivation: $fullPath" -ForegroundColor Yellow
        Set-Content -Path $fullPath -Value $mockSupabaseContent -Encoding UTF8
    } else {
        Write-Host "➕ Création mock: $fullPath" -ForegroundColor Green
        New-Item -Path $fullPath -Force | Out-Null
        Set-Content -Path $fullPath -Value $mockSupabaseContent -Encoding UTF8
    }
}

# 2. Remplacer les contexts Supabase problématiques
$problematicContexts = @(
    "src\contexts\TerangaAuthContext.jsx",
    "src\context\SupabaseAuthContext.jsx"
)

foreach ($context in $problematicContexts) {
    if (Test-Path $context) {
        Write-Host "🚫 Désactivation context: $context" -ForegroundColor Red
        $content = Get-Content $context -Raw -Encoding UTF8
        
        # Commenter tout le contenu du fichier
        $disabledContent = @"
// TEMPORAIREMENT DÉSACTIVÉ - Mode comptes de test uniquement
// Fichier original sauvegardé automatiquement

/* 
$content
*/

// Context désactivé - utiliser AuthProvider uniquement
export const useTerangaAuth = () => {
  throw new Error('TerangaAuth désactivé - utiliser AuthProvider');
};

export const useAuth = () => {
  throw new Error('SupabaseAuth désactivé - utiliser AuthProvider de ./contexts/AuthProvider');
};

export default {};
"@
        Set-Content -Path $context -Value $disabledContent -Encoding UTF8
    }
}

# 3. Corriger la page qui cause l'erreur Select.Item
$modifyPages = @(
    "src\pages\ModernTerrainsPage.jsx"
)

foreach ($page in $modifyPages) {
    if (Test-Path $page) {
        Write-Host "🔧 Correction Select.Item: $page" -ForegroundColor Magenta
        $content = Get-Content $page -Raw -Encoding UTF8
        
        # Corriger les SelectItem sans value ou avec value vide
        $content = $content -replace '<SelectItem\s+value=""', '<SelectItem value="empty"'
        $content = $content -replace '<SelectItem(?!\s+value=)', '<SelectItem value="default"'
        
        Set-Content -Path $page -Value $content -Encoding UTF8
    }
}

# 4. Désactiver les pages qui utilisent massivement Supabase
$pagesToDisable = @(
    "src\pages\AdminLoginPage.jsx",
    "src\pages\ParcelDetailPage.jsx"
)

foreach ($page in $pagesToDisable) {
    if (Test-Path $page) {
        Write-Host "⏸️ Désactivation temporaire: $page" -ForegroundColor DarkYellow
        $content = Get-Content $page -Raw -Encoding UTF8
        
        # Remplacer les imports supabase par des mocks
        $content = $content -replace "import\s*\{\s*supabase\s*\}\s*from.*?;", "// import supabase désactivé"
        
        # Désactiver les requêtes supabase
        $content = $content -replace "await supabase", "// await supabase"
        $content = $content -replace "supabase\.", "// supabase."
        
        Set-Content -Path $page -Value $content -Encoding UTF8
    }
}

# 5. Nettoyer les services qui utilisent Supabase
$servicesToClean = @(
    "src\services\notaireService.js"
)

foreach ($service in $servicesToClean) {
    if (Test-Path $service) {
        Write-Host "🧹 Nettoyage service: $service" -ForegroundColor Blue
        $content = Get-Content $service -Raw -Encoding UTF8
        
        # Remplacer par des mocks
        $content = $content -replace "import\s*\{\s*supabase\s*\}\s*from.*?;", "// supabase désactivé"
        $content = $content -replace "await supabase", "// await supabase - retour mock"
        $content = $content -replace "supabase\.auth\.user\(\)", "null"
        
        Set-Content -Path $service -Value $content -Encoding UTF8
    }
}

Write-Host ""
Write-Host "✅ Supabase complètement désactivé!" -ForegroundColor Green
Write-Host "🎯 Seuls les comptes de test AuthProvider fonctionnent maintenant" -ForegroundColor Cyan
Write-Host "🔐 Comptes disponibles:" -ForegroundColor White
Write-Host "   - particulier@test.com / test123" -ForegroundColor Gray
Write-Host "   - agent@test.com / test123" -ForegroundColor Gray  
Write-Host "   - banque@test.com / test123" -ForegroundColor Gray
Write-Host "   - promoteur@test.com / test123" -ForegroundColor Gray
Write-Host "   - mairie@test.com / test123" -ForegroundColor Gray
Write-Host "   - investisseur@test.com / test123" -ForegroundColor Gray
Write-Host "   - diaspora@test.com / test123" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Redémarrage du serveur recommandé..." -ForegroundColor Yellow
