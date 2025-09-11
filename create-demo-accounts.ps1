# Script PowerShell pour créer automatiquement les comptes de démonstration
# Utilise l'API REST de Supabase pour créer les utilisateurs

param(
    [string]$SupabaseUrl = "",
    [string]$SupabaseKey = "",
    [switch]$CreateAll = $false,
    [switch]$Help = $false
)

if ($Help) {
    Write-Host "=== Script de création automatique des comptes de démonstration ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:"
    Write-Host "  .\create-demo-accounts.ps1 -SupabaseUrl <URL> -SupabaseKey <KEY> [-CreateAll]"
    Write-Host ""
    Write-Host "Paramètres:"
    Write-Host "  -SupabaseUrl    : URL de votre projet Supabase (ex: https://xxx.supabase.co)"
    Write-Host "  -SupabaseKey    : Clé service_role de Supabase"
    Write-Host "  -CreateAll      : Créer tous les comptes d'un coup"
    Write-Host "  -Help           : Afficher cette aide"
    Write-Host ""
    Write-Host "Exemple:"
    Write-Host "  .\create-demo-accounts.ps1 -SupabaseUrl 'https://votre-projet.supabase.co' -SupabaseKey 'votre-service-key' -CreateAll"
    exit 0
}

# Configuration des comptes de démonstration
$demoAccounts = @(
    @{
        email = "admin@terangafoncier.com"
        password = "demo123"
        role = "admin"
        name = "Administrateur Demo"
    },
    @{
        email = "particulier@terangafoncier.com"
        password = "demo123"
        role = "particular"
        name = "Particulier Demo"
    },
    @{
        email = "agent@terangafoncier.com"
        password = "demo123"
        role = "agent_foncier"
        name = "Agent Foncier Demo"
    },
    @{
        email = "notaire@terangafoncier.com"
        password = "demo123"
        role = "notaire"
        name = "Notaire Demo"
    },
    @{
        email = "geometre@terangafoncier.com"
        password = "demo123"
        role = "geometre"
        name = "Géomètre Demo"
    },
    @{
        email = "banque@terangafoncier.com"
        password = "demo123"
        role = "banque"
        name = "Banque Demo"
    },
    @{
        email = "promoteur@terangafoncier.com"
        password = "demo123"
        role = "promoteur"
        name = "Promoteur Demo"
    },
    @{
        email = "lotisseur@terangafoncier.com"
        password = "demo123"
        role = "lotisseur"
        name = "Lotisseur Demo"
    },
    @{
        email = "mairie@terangafoncier.com"
        password = "demo123"
        role = "mairie"
        name = "Mairie Demo"
    }
)

function Write-ColoredOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Create-SupabaseUser {
    param(
        [string]$Email,
        [string]$Password,
        [string]$Role,
        [string]$Name,
        [string]$Url,
        [string]$Key
    )
    
    $headers = @{
        "apikey" = $Key
        "Authorization" = "Bearer $Key"
        "Content-Type" = "application/json"
    }
    
    $body = @{
        email = $Email
        password = $Password
        email_confirm = $true
        user_metadata = @{
            role = $Role
            name = $Name
        }
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$Url/auth/v1/admin/users" -Method POST -Headers $headers -Body $body
        Write-ColoredOutput "✅ Compte créé: $Email ($Role)" "Green"
        return $true
    }
    catch {
        $errorMessage = $_.Exception.Message
        if ($errorMessage -like "*already registered*" -or $errorMessage -like "*User already registered*") {
            Write-ColoredOutput "⚠️  Compte existe déjà: $Email" "Yellow"
        } else {
            Write-ColoredOutput "❌ Erreur pour $Email : $errorMessage" "Red"
        }
        return $false
    }
}

function Show-Menu {
    Clear-Host
    Write-ColoredOutput "=== CRÉATION AUTOMATIQUE DES COMPTES DE DÉMONSTRATION ===" "Cyan"
    Write-ColoredOutput "Plateforme Teranga Foncier - 9 Dashboards" "White"
    Write-Host ""
    
    Write-ColoredOutput "Comptes disponibles:" "Yellow"
    for ($i = 0; $i -lt $demoAccounts.Count; $i++) {
        $account = $demoAccounts[$i]
        Write-Host "  $($i + 1). $($account.name) - $($account.email)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-ColoredOutput "Options:" "Cyan"
    Write-Host "  [A] Créer TOUS les comptes automatiquement"
    Write-Host "  [1-9] Créer un compte spécifique"
    Write-Host "  [T] Tester la connexion Supabase"
    Write-Host "  [Q] Quitter"
    Write-Host ""
}

function Test-SupabaseConnection {
    param([string]$Url, [string]$Key)
    
    $headers = @{
        "apikey" = $Key
        "Authorization" = "Bearer $Key"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "$Url/rest/v1/" -Method GET -Headers $headers
        Write-ColoredOutput "✅ Connexion Supabase réussie!" "Green"
        return $true
    }
    catch {
        Write-ColoredOutput "❌ Erreur de connexion Supabase: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Vérification des paramètres
if (-not $SupabaseUrl -or -not $SupabaseKey) {
    if (-not $SupabaseUrl) {
        $SupabaseUrl = Read-Host "Entrez l'URL de votre projet Supabase (ex: https://xxx.supabase.co)"
    }
    if (-not $SupabaseKey) {
        $SupabaseKey = Read-Host "Entrez votre clé service_role Supabase" -AsSecureString
        $SupabaseKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SupabaseKey))
    }
}

# Création automatique si demandé
if ($CreateAll) {
    Write-ColoredOutput "=== CRÉATION AUTOMATIQUE DE TOUS LES COMPTES ===" "Cyan"
    
    if (-not (Test-SupabaseConnection -Url $SupabaseUrl -Key $SupabaseKey)) {
        Write-ColoredOutput "Impossible de se connecter à Supabase. Vérifiez vos paramètres." "Red"
        exit 1
    }
    
    $successCount = 0
    foreach ($account in $demoAccounts) {
        if (Create-SupabaseUser -Email $account.email -Password $account.password -Role $account.role -Name $account.name -Url $SupabaseUrl -Key $SupabaseKey) {
            $successCount++
        }
        Start-Sleep -Milliseconds 500  # Éviter le rate limiting
    }
    
    Write-Host ""
    Write-ColoredOutput "=== RÉSUMÉ ===" "Cyan"
    Write-ColoredOutput "$successCount/$($demoAccounts.Count) comptes traités avec succès" "Green"
    Write-Host ""
    Write-ColoredOutput "Vous pouvez maintenant vous connecter avec:" "Yellow"
    Write-Host "  Email: admin@terangafoncier.com"
    Write-Host "  Mot de passe: demo123"
    exit 0
}

# Mode interactif
do {
    Show-Menu
    $choice = Read-Host "Votre choix"
    
    switch ($choice.ToUpper()) {
        "A" {
            Write-ColoredOutput "Création de tous les comptes..." "Yellow"
            
            if (-not (Test-SupabaseConnection -Url $SupabaseUrl -Key $SupabaseKey)) {
                Write-ColoredOutput "Impossible de se connecter à Supabase. Vérifiez vos paramètres." "Red"
                Read-Host "Appuyez sur Entrée pour continuer..."
                continue
            }
            
            $successCount = 0
            foreach ($account in $demoAccounts) {
                if (Create-SupabaseUser -Email $account.email -Password $account.password -Role $account.role -Name $account.name -Url $SupabaseUrl -Key $SupabaseKey) {
                    $successCount++
                }
                Start-Sleep -Milliseconds 500
            }
            
            Write-Host ""
            Write-ColoredOutput "✅ $successCount/$($demoAccounts.Count) comptes traités" "Green"
            Read-Host "Appuyez sur Entrée pour continuer..."
        }
        
        "T" {
            Write-ColoredOutput "Test de connexion Supabase..." "Yellow"
            Test-SupabaseConnection -Url $SupabaseUrl -Key $SupabaseKey
            Read-Host "Appuyez sur Entrée pour continuer..."
        }
        
        "Q" {
            Write-ColoredOutput "Au revoir!" "Green"
            break
        }
        
        default {
            $accountIndex = $null
            if ([int]::TryParse($choice, [ref]$accountIndex) -and $accountIndex -ge 1 -and $accountIndex -le $demoAccounts.Count) {
                $account = $demoAccounts[$accountIndex - 1]
                Write-ColoredOutput "Création du compte: $($account.name)..." "Yellow"
                
                if (Test-SupabaseConnection -Url $SupabaseUrl -Key $SupabaseKey) {
                    Create-SupabaseUser -Email $account.email -Password $account.password -Role $account.role -Name $account.name -Url $SupabaseUrl -Key $SupabaseKey
                }
                
                Read-Host "Appuyez sur Entrée pour continuer..."
            } else {
                Write-ColoredOutput "Choix invalide. Utilisez A, T, Q ou un numéro de 1 à 9." "Red"
                Start-Sleep 2
            }
        }
    }
} while ($true)
