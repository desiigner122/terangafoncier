# Script pour desactiver completement Supabase et utiliser uniquement les comptes de test
# Version: 2025-09-07

Write-Host "Desactivation complete de Supabase..." -ForegroundColor Cyan

# 1. Creer un mock Supabase pour remplacer les imports
$mockSupabaseContent = @"
// Mock Supabase pour desactiver temporairement les appels DB
console.warn('Supabase desactive - Mode comptes de test uniquement');

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase desactive') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: new Error('DB desactivee') }),
    update: () => ({ data: null, error: new Error('DB desactivee') }),
    delete: () => ({ data: null, error: new Error('DB desactivee') }),
    upsert: () => ({ data: null, error: new Error('DB desactivee') })
  })
};

export const createClient = () => supabase;
export default supabase;
"@

# Creer le mock dans tous les emplacements
$supabaseFiles = @(
    "src\lib\supabase.js",
    "src\lib\supabaseClient.js", 
    "src\lib\customSupabaseClient.js"
)

foreach ($file in $supabaseFiles) {
    if (Test-Path $file) {
        Write-Host "Desactivation: $file" -ForegroundColor Yellow
        Set-Content -Path $file -Value $mockSupabaseContent -Encoding UTF8
    } else {
        Write-Host "Creation mock: $file" -ForegroundColor Green
        New-Item -Path $file -Force | Out-Null
        Set-Content -Path $file -Value $mockSupabaseContent -Encoding UTF8
    }
}

Write-Host ""
Write-Host "Supabase completement desactive!" -ForegroundColor Green
Write-Host "Seuls les comptes de test AuthProvider fonctionnent maintenant" -ForegroundColor Cyan
