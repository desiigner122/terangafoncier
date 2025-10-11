# ========================================
# SCRIPT: Appliquer migration Phase 1 Admin
# ========================================
# Date: 10 Octobre 2025
# Objectif: Créer 8 tables SQL via Supabase

Write-Host "🚀 Application de la migration Phase 1 Admin..." -ForegroundColor Cyan
Write-Host ""

# Lire le fichier SQL
$sqlFile = "supabase/migrations/20251010_phase1_admin_tables.sql"

if (-Not (Test-Path $sqlFile)) {
    Write-Host "❌ Fichier SQL introuvable: $sqlFile" -ForegroundColor Red
    exit 1
}

$sqlContent = Get-Content $sqlFile -Raw
Write-Host "✅ Fichier SQL chargé ($($sqlContent.Length) caractères)" -ForegroundColor Green

# Charger les variables d'environnement
$envFile = ".env"
if (-Not (Test-Path $envFile)) {
    Write-Host "❌ Fichier .env introuvable" -ForegroundColor Red
    exit 1
}

# Parser .env
$env:VITE_SUPABASE_URL = (Get-Content $envFile | Where-Object { $_ -match "^VITE_SUPABASE_URL=" }) -replace "VITE_SUPABASE_URL=", ""
$env:VITE_SUPABASE_ANON_KEY = (Get-Content $envFile | Where-Object { $_ -match "^VITE_SUPABASE_ANON_KEY=" }) -replace "VITE_SUPABASE_ANON_KEY=", ""

if (-Not $env:VITE_SUPABASE_URL -or -Not $env:VITE_SUPABASE_ANON_KEY) {
    Write-Host "❌ Variables Supabase manquantes dans .env" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Configuration Supabase chargée" -ForegroundColor Green
Write-Host "   URL: $($env:VITE_SUPABASE_URL.Substring(0, 30))..." -ForegroundColor Gray

# Fonction pour exécuter SQL via REST API
function Invoke-SupabaseSql {
    param(
        [string]$Sql
    )
    
    $url = "$($env:VITE_SUPABASE_URL)/rest/v1/rpc/exec_sql"
    $headers = @{
        "apikey" = $env:VITE_SUPABASE_ANON_KEY
        "Authorization" = "Bearer $($env:VITE_SUPABASE_ANON_KEY)"
        "Content-Type" = "application/json"
        "Prefer" = "return=representation"
    }
    
    $body = @{
        "sql" = $Sql
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
        return $response
    } catch {
        Write-Host "❌ Erreur API: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

Write-Host ""
Write-Host "📝 Exécution du script SQL..." -ForegroundColor Cyan

# Note: Supabase REST API ne supporte pas l'exécution directe de SQL
# On va créer les tables via un script Node.js ou via le Dashboard Supabase

Write-Host ""
Write-Host "⚠️  INSTRUCTIONS MANUELLES:" -ForegroundColor Yellow
Write-Host "   1. Ouvrir Supabase Dashboard: https://app.supabase.com" -ForegroundColor Gray
Write-Host "   2. Aller dans 'SQL Editor'" -ForegroundColor Gray
Write-Host "   3. Copier-coller le contenu de: $sqlFile" -ForegroundColor Gray
Write-Host "   4. Cliquer 'Run' pour exécuter" -ForegroundColor Gray
Write-Host ""
Write-Host "   OU via CLI Supabase:" -ForegroundColor Gray
Write-Host "   npm install -g supabase" -ForegroundColor Gray
Write-Host "   supabase login" -ForegroundColor Gray
Write-Host "   supabase db push" -ForegroundColor Gray
Write-Host ""

# Alternative: Créer script Node.js pour exécution automatique
Write-Host "💡 Création d'un script Node.js alternatif..." -ForegroundColor Cyan

$nodeScript = @"
// Script Node.js pour appliquer migration Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Lecture du fichier SQL...');
const sql = fs.readFileSync('$($sqlFile.Replace('\', '/'))  ', 'utf-8');

console.log('📝 Exécution de la migration...');

// Note: Supabase JS Client ne supporte pas l'exécution directe de migrations
// Utiliser supabase CLI ou Dashboard pour exécuter manuellement

console.log('⚠️  Utiliser Supabase Dashboard ou CLI pour exécuter:');
console.log('   supabase db push');
"@

$nodeScriptPath = "scripts/apply-migration-phase1.mjs"
New-Item -Path (Split-Path $nodeScriptPath) -ItemType Directory -Force | Out-Null
Set-Content -Path $nodeScriptPath -Value $nodeScript

Write-Host "✅ Script Node.js créé: $nodeScriptPath" -ForegroundColor Green

Write-Host ""
Write-Host "📋 RÉSUMÉ MIGRATION:" -ForegroundColor Cyan
Write-Host "   • 8 tables à créer:" -ForegroundColor White
Write-Host "     - cms_pages (pages site)" -ForegroundColor Gray
Write-Host "     - cms_sections (blocs réutilisables)" -ForegroundColor Gray
Write-Host "     - media_assets (bibliothèque médias)" -ForegroundColor Gray
Write-Host "     - marketing_leads (inbox leads)" -ForegroundColor Gray
Write-Host "     - team_members (équipe contact)" -ForegroundColor Gray
Write-Host "     - page_events (tracking comportement)" -ForegroundColor Gray
Write-Host "     - page_views (analytics pages)" -ForegroundColor Gray
Write-Host "     - pricing_config (tarifs dynamiques)" -ForegroundColor Gray
Write-Host ""
Write-Host "   • RLS Policies configurées" -ForegroundColor White
Write-Host "   • Triggers auto-update created" -ForegroundColor White
Write-Host "   • Données initiales (seed)" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Prochaine étape: Exécuter manuellement le SQL dans Supabase Dashboard" -ForegroundColor Green
