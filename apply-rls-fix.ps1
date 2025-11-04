# Script PowerShell pour appliquer le fix RLS
# Exécution: .\apply-rls-fix.ps1

Write-Host "🚨 FIX RLS PURCHASE_CASES - Application automatique" -ForegroundColor Cyan
Write-Host "=" * 60

# Lire le fichier SQL
$sqlFile = ".\migrations\fix_purchase_cases_rls.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Fichier SQL introuvable: $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichier SQL trouvé" -ForegroundColor Green

# Lire le contenu SQL (seulement la partie FIX, pas le diagnostic)
$sqlContent = Get-Content $sqlFile -Raw

# Extraire uniquement la partie fix (suppression + recréation)
$fixSQL = @"
-- =====================================================
-- SUPPRESSION DES POLICIES RESTRICTIVES
-- =====================================================

DROP POLICY IF EXISTS "Authenticated users can create cases" ON purchase_cases;
DROP POLICY IF EXISTS "Parties can update their cases" ON purchase_cases;
DROP POLICY IF EXISTS "Users can view their cases" ON purchase_cases;
DROP POLICY IF EXISTS "Admins can view all cases" ON purchase_cases;
DROP POLICY IF EXISTS "Users can delete their own cases" ON purchase_cases;

-- =====================================================
-- RECRÉATION DES POLICIES CORRECTES
-- =====================================================

CREATE POLICY "purchase_cases_select_policy"
  ON purchase_cases FOR SELECT
  USING (
    buyer_id = auth.uid()
    OR seller_id = auth.uid()
    OR notaire_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "purchase_cases_insert_policy"
  ON purchase_cases FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      buyer_id = auth.uid()
      OR seller_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('notaire', 'Notaire')
      )
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
      )
    )
  );

CREATE POLICY "purchase_cases_update_policy"
  ON purchase_cases FOR UPDATE
  USING (
    buyer_id = auth.uid()
    OR seller_id = auth.uid()
    OR notaire_id = auth.uid()
    OR updated_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "purchase_cases_delete_policy"
  ON purchase_cases FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR (
      (buyer_id = auth.uid() OR seller_id = auth.uid())
      AND status = 'initiated'
    )
  );
"@

Write-Host ""
Write-Host "📋 Copie du SQL dans le presse-papiers..." -ForegroundColor Yellow
Set-Clipboard -Value $fixSQL
Write-Host "✅ SQL copié dans le presse-papiers!" -ForegroundColor Green

Write-Host ""
Write-Host "🌐 Ouverture de Supabase SQL Editor..." -ForegroundColor Yellow
Start-Process "https://supabase.com/dashboard/project/_/sql/new"

Write-Host ""
Write-Host "=" * 60
Write-Host "📝 INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""
Write-Host "1. ✅ Le SQL est déjà copié dans votre presse-papiers" -ForegroundColor Green
Write-Host ""
Write-Host "2. Dans Supabase SQL Editor qui vient de s'ouvrir:" -ForegroundColor White
Write-Host "   - Sélectionnez votre projet 'terangafoncier'" -ForegroundColor Gray
Write-Host "   - Collez le SQL (Ctrl+V)" -ForegroundColor Gray
Write-Host "   - Cliquez 'Run' (ou Ctrl+Enter)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Vérifiez que vous voyez:" -ForegroundColor White
Write-Host "   ✓ DROP POLICY ... (5x)" -ForegroundColor Gray
Write-Host "   ✓ CREATE POLICY ... (4x)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Attendez le message: 'Success. No rows returned'" -ForegroundColor Green
Write-Host ""
Write-Host "=" * 60
Write-Host ""
Write-Host "Voulez-vous voir le SQL qui a été copié? (O/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "O" -or $response -eq "o") {
    Write-Host ""
    Write-Host "SQL copié dans le presse-papiers:" -ForegroundColor Cyan
    Write-Host "=" * 60
    Write-Host $fixSQL -ForegroundColor White
    Write-Host "=" * 60
}

Write-Host ""
Write-Host "✅ Script terminé!" -ForegroundColor Green
Write-Host "🔧 Après avoir exécuté le SQL dans Supabase, testez:" -ForegroundColor Cyan
Write-Host "   - Connectez-vous comme vendeur" -ForegroundColor Gray
Write-Host "   - Acceptez une demande d'achat" -ForegroundColor Gray
Write-Host "   - Le dossier devrait se créer sans erreur RLS" -ForegroundColor Gray
Write-Host ""
