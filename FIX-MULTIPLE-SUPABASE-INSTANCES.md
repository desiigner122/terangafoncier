# 🔧 FIX - INSTANCES MULTIPLES SUPABASE

**Date:** 11 octobre 2025  
**Problème:** 19 instances de GoTrueClient détectées  
**Impact:** Comportement imprévisible, erreurs RLS, performances dégradées

---

## 🐛 PROBLÈME DÉTECTÉ

### Erreur Console
```
Multiple GoTrueClient instances detected in the same browser context. 
It is not an error, but this should be avoided as it may produce 
undefined behavior when used concurrently under the same storage key.
```

### Cause
**19 fichiers créent leur propre instance Supabase** au lieu d'utiliser l'instance partagée !

```javascript
// ❌ MAUVAIS (19 fois)
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ BON (à utiliser partout)
import { supabase } from '@/lib/supabaseClient';
```

---

## 📁 FICHIERS À CORRIGER

### Fichiers avec instances multiples (19)

1. ✅ **src/lib/supabaseClient.js** - Instance principale (garder)
2. ❌ **src/lib/supabase.js** - Dupliquer (supprimer ou fusionner)
3. ❌ **src/lib/customSupabaseClient.js** - Dupliquer (supprimer)
4. ❌ **src/lib/senegalDataManager.js** - Créé sa propre instance
5. ❌ **src/services/supabaseClient.js** - Doublon (supprimer)
6. ❌ **src/services/TerangaIntelligentNotifications.js** - Créé instance
7. ❌ **src/services/TerangaBlockchainSyncService.js** - Créé instance
8. ❌ **src/services-backup/TerangaIntelligentNotifications.js** - Backup (ignorer)
9. ❌ **src/services-backup/TerangaBlockchainSyncService.js** - Backup (ignorer)
10. ❌ **src/pages/dashboards/particulier/ParticulierMesOffres.jsx** - Créé instance
11. ❌ **src/pages/dashboards/particulier/ParticulierTickets.jsx** - Créé instance
12. ❌ **src/pages/dashboards/particulier/ParticulierVisites.jsx** - Créé instance
13. ❌ **src/pages/dashboards/notaire/NotaireOverview_REAL_DATA.jsx** - Créé instance
14. ❌ **src/pages/dashboards/notaire/CompleteSidebarNotaireDashboard.jsx** - Créé instance

---

## ✅ SOLUTION

### Étape 1: Garder UNE SEULE instance partagée

**Fichier:** `src/lib/supabaseClient.js` (à garder tel quel)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL et Anon Key sont requis');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
```

### Étape 2: Importer depuis `@/lib/supabaseClient` PARTOUT

**Dans TOUS les autres fichiers:**

```javascript
// ❌ AVANT
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ APRÈS
import { supabase } from '@/lib/supabaseClient';
```

---

## 🛠️ CORRECTIONS À APPLIQUER

### 1. src/lib/supabase.js
**Action:** Supprimer ou remplacer par alias

**Option A: Supprimer le fichier**
```powershell
Remove-Item "src/lib/supabase.js"
```

**Option B: Le transformer en alias**
```javascript
// src/lib/supabase.js
export { supabase, default } from './supabaseClient';
```

### 2. src/lib/customSupabaseClient.js
**Action:** Supprimer le fichier (doublon inutile)

```powershell
Remove-Item "src/lib/customSupabaseClient.js"
```

### 3. src/services/supabaseClient.js
**Action:** Remplacer par alias

```javascript
// src/services/supabaseClient.js
export { supabase as default, supabase } from '@/lib/supabaseClient';
```

### 4. src/lib/senegalDataManager.js
**Action:** Modifier l'import

```javascript
// AVANT
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// APRÈS
import { supabase } from '@/lib/supabaseClient';
```

### 5-7. Services (TerangaIntelligentNotifications, TerangaBlockchainSyncService)
**Action:** Modifier les imports

```javascript
// AVANT
import { createClient } from '@supabase/supabase-js';
// ... config ...
const supabase = createClient(...);

// APRÈS
import { supabase } from '@/lib/supabaseClient';
```

### 8-14. Pages dashboard
**Action:** Modifier les imports dans tous les fichiers

```javascript
// AVANT
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// APRÈS
import { supabase } from '@/lib/supabaseClient';
```

---

## 🚀 SCRIPT AUTOMATIQUE

### PowerShell - Remplacer tous les imports

```powershell
# Sauvegarder les fichiers à modifier
$filesToFix = @(
    "src/lib/senegalDataManager.js",
    "src/services/TerangaIntelligentNotifications.js",
    "src/services/TerangaBlockchainSyncService.js",
    "src/pages/dashboards/particulier/ParticulierMesOffres.jsx",
    "src/pages/dashboards/particulier/ParticulierTickets.jsx",
    "src/pages/dashboards/particulier/ParticulierVisites.jsx",
    "src/pages/dashboards/notaire/NotaireOverview_REAL_DATA.jsx",
    "src/pages/dashboards/notaire/CompleteSidebarNotaireDashboard.jsx"
)

foreach ($file in $filesToFix) {
    if (Test-Path $file) {
        Write-Host "🔧 Correction de $file..."
        
        # Lire le contenu
        $content = Get-Content $file -Raw
        
        # Pattern à remplacer
        $pattern = "import \{ createClient \} from '@supabase/supabase-js';\s*const supabaseUrl = import\.meta\.env\.VITE_SUPABASE_URL;\s*const supabaseAnonKey = import\.meta\.env\.VITE_SUPABASE_ANON_KEY;\s*(if \(!supabaseUrl \|\| !supabaseAnonKey\) \{[^}]+\}\s*)?const supabase = createClient\(supabaseUrl, supabaseAnonKey\);"
        
        $replacement = "import { supabase } from '@/lib/supabaseClient';"
        
        # Remplacer
        $newContent = $content -replace $pattern, $replacement
        
        # Sauvegarder
        $newContent | Set-Content $file -NoNewline
        
        Write-Host "✅ $file corrigé"
    } else {
        Write-Host "⚠️ $file non trouvé"
    }
}

Write-Host "`n✅ Tous les fichiers ont été corrigés!"
Write-Host "Redémarrez le serveur: npm run dev"
```

---

## 📊 VÉRIFICATION

### Après corrections, vérifier:

1. **Console navigateur (F12)**
   - ❌ Plus de warning "Multiple GoTrueClient instances"
   - ✅ Une seule instance Supabase initialisée

2. **Recherche dans le code**
```powershell
# Compter les instances restantes
Select-String -Path "src/**/*.{js,jsx}" -Pattern "createClient.*supabase" | Measure-Object
# Résultat attendu: 1 (seulement dans supabaseClient.js)
```

3. **Performance**
   - ✅ Temps de chargement réduit
   - ✅ Moins de requêtes d'authentification
   - ✅ Comportement RLS cohérent

---

## 🎯 RÉSULTAT ATTENDU

### Avant
```
❌ 19 instances GoTrueClient
❌ 19 connexions Supabase
❌ Comportement imprévisible
❌ Erreurs RLS aléatoires
```

### Après
```
✅ 1 seule instance GoTrueClient
✅ 1 connexion Supabase partagée
✅ Comportement cohérent
✅ Erreurs RLS résolues
```

---

## 📝 AUTRES ERREURS À CORRIGER

### 1. HTTP 406 - Profiles RLS
```sql
-- Dans Supabase SQL Editor
-- Vérifier les policies sur profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### 2. HTTP 404 - Images API
```javascript
// Remplacer
https://www.terangafoncier.sn/api/YOUR_API_KEY/150/100

// Par
https://ui-avatars.com/api/?name=User&size=150&background=random
```

### 3. marketing_leads - Colonne email manquante
**Solution:** Exécuter `FIX-MARKETING-LEADS-TABLE.sql` dans Supabase

---

## 🚀 ORDRE D'EXÉCUTION

1. ✅ **Exécuter FIX-MARKETING-LEADS-TABLE.sql** (Supabase SQL Editor)
2. ⏳ **Corriger les instances Supabase** (script PowerShell ci-dessus)
3. ⏳ **Redémarrer le serveur** (`npm run dev`)
4. ⏳ **Tester le formulaire de contact**
5. ⏳ **Vérifier la console** (plus de warnings)
6. ⏳ **Commit et push**

---

**Priorité:** HAUTE  
**Impact:** Résout comportements imprévisibles et erreurs RLS  
**Temps estimé:** 15 minutes
