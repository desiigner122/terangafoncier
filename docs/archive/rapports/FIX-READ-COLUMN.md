# Correction Globale : Colonne `read` → `is_read`

## Problème
La table `notifications` a une colonne nommée `is_read`, mais plusieurs fichiers utilisent `read`.

## Fichiers à corriger

1. ✅ `src/pages/NotificationsPage.jsx` - CORRIGÉ
2. ⏳ `src/pages/dashboards/vendeur/CompleteSidebarVendeurDashboard.jsx`
3. ⏳ `src/pages/dashboards/particulier/DashboardParticulierRefonte.jsx`
4. ⏳ `src/pages/dashboards/particulier/CompleteSidebarParticulierDashboard.jsx`
5. ⏳ `src/pages/dashboards/admin/CompleteSidebarAdminDashboard.jsx`
6. ⏳ `src/components/layout/SidebarResponsiveSimple.jsx`
7. ⏳ `src/hooks/admin/useAdminStats.js`

## Remplacement à faire

Remplacer partout :
- `.eq('read', false)` → `.eq('is_read', false)`
- `.eq('read', true)` → `.eq('is_read', true)`
- `.update({ read: true })` → `.update({ is_read: true })`
- `.update({ read: false })` → `.update({ is_read: false })`

## Script de correction automatique (PowerShell)

```powershell
# Correction automatique avec PowerShell
$files = @(
    "src/pages/dashboards/vendeur/CompleteSidebarVendeurDashboard.jsx",
    "src/pages/dashboards/particulier/DashboardParticulierRefonte.jsx",
    "src/pages/dashboards/particulier/CompleteSidebarParticulierDashboard.jsx",
    "src/pages/dashboards/admin/CompleteSidebarAdminDashboard.jsx",
    "src/components/layout/SidebarResponsiveSimple.jsx",
    "src/hooks/admin/useAdminStats.js"
)

foreach ($file in $files) {
    $path = "c:\Users\Smart Business\Desktop\terangafoncier\$file"
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $content = $content -replace "\.eq\('read',", ".eq('is_read',"
        $content = $content -replace "\.update\(\{\s*read:", ".update({ is_read:"
        $content = $content -replace "read\s*=\s*eq\.", "is_read=eq."
        Set-Content $path $content
        Write-Host "✅ Corrigé: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Introuvable: $file" -ForegroundColor Red
    }
}
```
