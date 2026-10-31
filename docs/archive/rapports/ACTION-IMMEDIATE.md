# ⚡ ACTION IMMÉDIATE REQUISE

**3 étapes - 10 minutes total**

---

## 🔴 PROBLÈMES DÉTECTÉS

1. **19 instances Supabase** → Comportement imprévisible
2. **Table marketing_leads cassée** → Formulaire contact non fonctionnel  
3. **HTTP 406 sur profiles** → Auth problématique

---

## ✅ SOLUTIONS (7/19 fichiers déjà corrigés)

### ÉTAPE 1: Script PowerShell (5 min) ⏳

**Copiez et exécutez ceci dans PowerShell:**

```powershell
cd "C:\Users\Smart Business\Desktop\terangafoncier"

$files = @(
    "src/pages/dashboards/particulier/ParticulierTickets.jsx",
    "src/pages/dashboards/particulier/ParticulierVisites.jsx",
    "src/pages/dashboards/notaire/NotaireOverview_REAL_DATA.jsx",
    "src/pages/dashboards/notaire/CompleteSidebarNotaireDashboard.jsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $pattern = "import \{ createClient \} from '@supabase/supabase-js';\s*(\/\/[^\n]*\n)*\s*const supabase = createClient\(\s*import\.meta\.env\.VITE_SUPABASE_URL,\s*import\.meta\.env\.VITE_SUPABASE_ANON_KEY\s*\);"
        $replacement = "import { supabase } from '@/lib/supabaseClient';"
        $newContent = $content -replace $pattern, $replacement
        $newContent | Set-Content $file -NoNewline
        Write-Host "✅ $file"
    }
}

Write-Host "`n✅ Terminé!"
```

---

### ÉTAPE 2: SQL Script (3 min) ⏳

1. **Ouvrir:** https://supabase.com/dashboard
2. **Projet:** terangafoncier → SQL Editor
3. **Copier/coller** le contenu du fichier: `FIX-MARKETING-LEADS-TABLE.sql`
4. **Exécuter** (bouton Run)
5. **Vérifier:** 5 lignes insérées

---

### ÉTAPE 3: Redémarrer (30 sec) ⏳

```powershell
# Dans le terminal du serveur: Ctrl+C
npm run dev
```

---

## 🧪 VÉRIFICATION

**Ouvrir Console (F12):**

✅ Plus de warning "Multiple GoTrueClient"  
✅ HTTP 200 (au lieu de 406/400)  
✅ Formulaire contact fonctionne

---

## 📊 RÉSULTAT

**Avant:**
- ❌ 19 instances Supabase
- ❌ Formulaire cassé
- ❌ Erreurs RLS

**Après:**
- ✅ 1 instance Supabase
- ✅ Formulaire fonctionnel
- ✅ Pas d'erreurs

---

## 📁 FICHIERS CRÉÉS

- `FIX-MARKETING-LEADS-TABLE.sql` - Script SQL à exécuter
- `FIX-MULTIPLE-SUPABASE-INSTANCES.md` - Documentation
- `RESUME-EXECUTIF-TOUTES-ERREURS.md` - Guide complet

**Tout est prêt! Exécutez les 3 étapes ci-dessus** 🚀
