# Script pour corriger les références is_read vers read
# À exécuter dans PowerShell

$files = @(
    "src/pages/NotificationsPage.jsx",
    "test-notifications.js"
)

foreach ($file in $files) {
    $fullPath = "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\$file"
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        $newContent = $content -replace "is_read", "read"
        Set-Content $fullPath $newContent -NoNewline
        Write-Host "Updated: $file"
    } else {
        Write-Host "File not found: $file"
    }
}

# Aussi corriger message en content et title en type dans userData.js
$userDataPath = "c:\Users\OPEN BIZ AFRIKA\Desktop\Teranga Foncier\src\data\userData.js"
if (Test-Path $userDataPath) {
    $content = Get-Content $userDataPath -Raw
    $newContent = $content -replace "is_read", "read"
    Set-Content $userDataPath $newContent -NoNewline
    Write-Host "Updated: userData.js"
}

Write-Host "All files updated!"
