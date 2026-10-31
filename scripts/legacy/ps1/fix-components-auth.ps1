# Correction des imports AuthProvider vers TempSupabaseAuthContext pour les composants
# Script simple et robuste

$files = @(
    "src/components/SecurityDiagnosticTool.jsx",
    "src/components/layout/SidebarResponsiveSimple.jsx",
    "src/components/layout/SidebarResponsive.jsx",
    "src/components/layout/Sidebar.jsx",
    "src/components/layout/header/MobileMenu.jsx",
    "src/components/layout/header/DashboardMenu.jsx",
    "src/components/layout/header/AuthSection.jsx",
    "src/components/auth/BecomeSellerButton.jsx",
    "src/components/ai/TerrangaFoncierChatbot.jsx",
    "src/components/AccessDeniedPage.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Correction de $file..."
        try {
            $content = Get-Content $file -Raw
            $originalContent = $content
            
            # Remplacer l'import AuthProvider par TempSupabaseAuthContext
            $content = $content -replace "import { useAuth } from '@/contexts/AuthProvider';", "import { useAuth } from '@/contexts/TempSupabaseAuthContext';"
            
            # Sauvegarder seulement si des changements ont été faits
            if ($content -ne $originalContent) {
                $content | Set-Content $file -NoNewline
                Write-Host "✅ $file corrigé"
            } else {
                Write-Host "⏭️ $file déjà correct"
            }
        }
        catch {
            Write-Host "❌ Erreur avec $file : $($_.Exception.Message)"
        }
    } else {
        Write-Host "⚠️ Fichier non trouvé : $file"
    }
}

Write-Host "`n🎉 Correction des composants terminée!"
