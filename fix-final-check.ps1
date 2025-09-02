# Script pour vérifier et corriger toutes les références de conversation et useToast
# À exécuter dans PowerShell

Write-Host "=== VERIFICATION COMPLETE DES ERREURS ==="

# 1. Vérifier s'il y a encore des imports useToast problématiques
Write-Host "`n1. Vérification des imports useToast..."
$oldToastFiles = Get-ChildItem -Path "src" -Recurse -Include "*.jsx","*.js","*.ts","*.tsx" | 
    Where-Object { (Get-Content $_.FullName -Raw) -match '@/components/ui/use-toast[^-]' }

if ($oldToastFiles) {
    Write-Host "❌ Fichiers avec imports useToast incorrects trouvés:"
    $oldToastFiles | ForEach-Object { Write-Host "  - $($_.FullName)" }
    
    # Corriger automatiquement
    foreach ($file in $oldToastFiles) {
        $content = Get-Content $file.FullName -Raw
        $newContent = $content -replace '@/components/ui/use-toast"', '@/components/ui/use-toast-simple"'
        $newContent = $newContent -replace "@/components/ui/use-toast'", "@/components/ui/use-toast-simple'"
        Set-Content $file.FullName $newContent -NoNewline
        Write-Host "  ✅ Corrigé: $($file.FullName)"
    }
} else {
    Write-Host "✅ Aucun import useToast incorrect trouvé"
}

# 2. Vérifier les références à 'participants' dans les conversations
Write-Host "`n2. Vérification des références 'participants'..."
$participantFiles = Get-ChildItem -Path "src" -Recurse -Include "*.jsx","*.js","*.ts","*.tsx" | 
    Where-Object { (Get-Content $_.FullName -Raw) -match '\bparticipants\b' -and $_.Name -like "*essag*" }

if ($participantFiles) {
    Write-Host "❌ Fichiers avec références 'participants' trouvés:"
    $participantFiles | ForEach-Object { 
        Write-Host "  - $($_.FullName)"
        # Montrer les lignes concernées
        Select-String -Path $_.FullName -Pattern '\bparticipants\b' | 
            ForEach-Object { Write-Host "    Ligne $($_.LineNumber): $($_.Line.Trim())" }
    }
} else {
    Write-Host "✅ Aucune référence 'participants' problématique trouvée"
}

# 3. Vérifier s'il y a d'autres hooks non importés
Write-Host "`n3. Vérification des hooks potentiellement non importés..."
$suspiciousFiles = Get-ChildItem -Path "src" -Recurse -Include "*.jsx","*.js","*.ts","*.tsx" | 
    Where-Object { 
        $content = Get-Content $_.FullName -Raw
        $content -match 'const\s+\{\s*toast\s*\}' -and $content -notmatch 'useToast'
    }

if ($suspiciousFiles) {
    Write-Host "❌ Fichiers avec hooks toast non importés:"
    $suspiciousFiles | ForEach-Object { Write-Host "  - $($_.FullName)" }
} else {
    Write-Host "✅ Tous les hooks toast semblent correctement importés"
}

Write-Host "`n=== VERIFICATION TERMINEE ==="
