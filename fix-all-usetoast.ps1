# Script pour corriger TOUS les imports useToast restants
# À exécuter dans PowerShell

# Trouve tous les fichiers qui utilisent encore l'ancien useToast
$pattern = "@/components/ui/use-toast'"
$files = Get-ChildItem -Path "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\src" -Recurse -Include "*.jsx", "*.js", "*.ts", "*.tsx" | 
         Select-String -Pattern $pattern | 
         Select-Object -ExpandProperty Path | 
         Sort-Object -Unique

Write-Host "Fichiers trouvés avec l'ancien useToast:"
$files | ForEach-Object { Write-Host "  - $_" }

Write-Host "`nCorrection en cours..."

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $newContent = $content -replace "@/components/ui/use-toast'", "@/components/ui/use-toast-simple'"
        $newContent = $newContent -replace '@/components/ui/use-toast"', '@/components/ui/use-toast-simple"'
        Set-Content $file $newContent -NoNewline
        Write-Host "Updated: $file"
    }
}

Write-Host "`nTous les fichiers ont été mis à jour!"
