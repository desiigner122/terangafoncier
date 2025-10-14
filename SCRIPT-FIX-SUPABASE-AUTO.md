# 🚀 SCRIPT DE CORRECTION AUTOMATIQUE - SUPABASE INSTANCES

**Date:** 11 octobre 2025  
**Objectif:** Remplacer toutes les instances Supabase multiples par l'instance partagée

---

## 🔧 COMMANDES POWERSHELL

### Exécuter ce script dans PowerShell

```powershell
# Naviguer vers le projet
cd "C:\Users\Smart Business\Desktop\terangafoncier"

# Fichier 1: src/lib/supabase.js - Transformer en alias
$content = @'
// Alias vers l'instance Supabase partagée
export { supabase, default } from './supabaseClient';
'@
$content | Set-Content "src/lib/supabase.js" -Force

# Fichier 2: src/services/supabaseClient.js - Transformer en alias  
$content = @'
// Alias vers l'instance Supabase partagée
export { supabase as default, supabase } from '@/lib/supabaseClient';
'@
$content | Set-Content "src/services/supabaseClient.js" -Force

# Fichier 3: src/lib/customSupabaseClient.js - Supprimer (doublon inutile)
if (Test-Path "src/lib/customSupabaseClient.js") {
    Remove-Item "src/lib/customSupabaseClient.js" -Force
    Write-Host "✅ customSupabaseClient.js supprimé"
}

Write-Host "`n✅ Corrections terminées!"
Write-Host "🔄 Redémarrez le serveur: npm run dev"
```

---

## 📋 FICHIERS DÉJÀ CORRIGÉS MANUELLEMENT

✅ src/lib/senegalDataManager.js  
✅ src/services/TerangaIntelligentNotifications.js  
✅ src/services/TerangaBlockchainSyncService.js

---

## 📝 FICHIERS RESTANTS À CORRIGER (Pages Dashboard)

Ces fichiers nécessitent une correction manuelle car ils ont des structures différentes:

1. **src/pages/dashboards/particulier/ParticulierMesOffres.jsx**
2. **src/pages/dashboards/particulier/ParticulierTickets.jsx**
3. **src/pages/dashboards/particulier/ParticulierVisites.jsx**
4. **src/pages/dashboards/notaire/NotaireOverview_REAL_DATA.jsx**
5. **src/pages/dashboards/notaire/CompleteSidebarNotaireDashboard.jsx**

**Pattern à remplacer:**
```javascript
// TROUVER
import { createClient } from '@supabase/supabase-js';
// ... quelques lignes plus tard ...
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// REMPLACER PAR
import { supabase } from '@/lib/supabaseClient';
```

---

## ✅ VÉRIFICATION APRÈS CORRECTIONS

### 1. Compter les instances restantes
```powershell
# Doit retourner SEULEMENT 1 résultat (dans supabaseClient.js)
Select-String -Path "src\**\*.{js,jsx}" -Pattern "createClient.*from '@supabase" -Exclude "*node_modules*","*backup*" | Measure-Object
```

### 2. Rechercher createClient
```powershell
# Voir tous les fichiers qui utilisent createClient
Select-String -Path "src\**\*.{js,jsx}" -Pattern "createClient" -Exclude "*node_modules*","*backup*" | Select-Object Path, LineNumber, Line
```

### 3. Tester l'application
1. Arrêter le serveur (Ctrl+C)
2. Redémarrer: `npm run dev`
3. Ouvrir http://localhost:5174
4. F12 → Console
5. Vérifier: **AUCUN** warning "Multiple GoTrueClient instances"

---

## 🎯 RÉSULTAT ATTENDU

### Console navigateur (avant)
```
⚠️ Multiple GoTrueClient instances detected (×5)
❌ HTTP 406 sur /profiles
❌ PGRST204 sur marketing_leads
```

### Console navigateur (après)
```
✅ Aucun warning GoTrueClient
✅ HTTP 200 sur /profiles (si RLS correct)
⏳ PGRST204 persiste jusqu'à exécution SQL script
```

---

## 📊 RÉCAPITULATIF

| Fichier | Statut | Action |
|---------|--------|--------|
| src/lib/supabaseClient.js | ✅ Original | GARDER |
| src/lib/supabase.js | ⏳ À corriger | Transformer en alias |
| src/lib/customSupabaseClient.js | ⏳ À corriger | Supprimer |
| src/lib/senegalDataManager.js | ✅ Corrigé | Import partagé |
| src/services/supabaseClient.js | ⏳ À corriger | Transformer en alias |
| src/services/TerangaIntelligentNotifications.js | ✅ Corrigé | Import partagé |
| src/services/TerangaBlockchainSyncService.js | ✅ Corrigé | Import partagé |
| Pages dashboard (×5) | ⏳ À corriger | Correction manuelle |

---

## 🚀 PROCHAINES ÉTAPES

1. ⏳ **Exécuter le script PowerShell ci-dessus**
2. ⏳ **Corriger les 5 pages dashboard manuellement**
3. ⏳ **Exécuter FIX-MARKETING-LEADS-TABLE.sql** (Supabase)
4. ⏳ **Redémarrer serveur** (`npm run dev`)
5. ⏳ **Tester console** (plus de warnings)
6. ⏳ **Commit et push**

---

**Temps estimé:** 10 minutes  
**Priorité:** HAUTE
