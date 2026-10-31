# 🎯 ACTION FINALE - Scripts SQL à Exécuter

**Date:** 11 octobre 2025  
**Statut:** ✅ Code JavaScript corrigé | ⏳ Base de données à réparer

---

## 📋 Résumé des Problèmes Résolus

### ✅ CORRIGÉ (Code JavaScript)
- ❌ ~~`column marketing_leads.form_name does not exist`~~ → **FIXED**
- ❌ ~~`column marketing_leads.converted_at does not exist`~~ → **FIXED**
- ✅ `MarketingService.js` utilise maintenant les bonnes colonnes

### ⏳ À CORRIGER (Base de données)
1. **Table `marketing_leads` manquante ou mal structurée**
2. **Profil utilisateur manquant** (User ID: `4089e51f-85e4-4348-ae0c-f00e4f8ff497`)

---

## 🚀 Étapes à Suivre (10 minutes)

### 1️⃣ Ouvrir Supabase Dashboard

1. Allez sur: **https://supabase.com/dashboard**
2. Sélectionnez le projet: **terangafoncier** (ndenqikcogzrkrjnlvns)
3. Dans le menu gauche, cliquez sur: **SQL Editor**

---

### 2️⃣ Script 1: Créer la table `marketing_leads`

**Fichier:** `FIX-MARKETING-LEADS-TABLE.sql`

**Actions:**
1. Dans SQL Editor, cliquez **"New Query"**
2. Ouvrez le fichier `FIX-MARKETING-LEADS-TABLE.sql` dans VS Code
3. Copiez **TOUT le contenu** (Ctrl+A → Ctrl+C)
4. Collez dans SQL Editor
5. Cliquez **"Run"** (ou Ctrl+Enter)

**Résultat attendu:**
```sql
✅ Table created: public.marketing_leads
✅ 5 indexes created
✅ Trigger created: update_marketing_leads_updated_at
✅ 5 RLS policies created
✅ 5 test records inserted

total_leads: 5
distinct_statuses: 4
distinct_sources: 3
```

---

### 3️⃣ Script 2: Créer le profil utilisateur manquant

**Fichier:** `FIX-CREATE-USER-PROFILE.sql`

**Actions:**
1. Dans SQL Editor, cliquez **"New Query"** (nouvelle tab)
2. Ouvrez le fichier `FIX-CREATE-USER-PROFILE.sql` dans VS Code
3. Copiez **TOUT le contenu**
4. Collez dans SQL Editor
5. Cliquez **"Run"**

**Résultat attendu:**
```sql
✅ 1 row selected (auth.users)
✅ 1 row inserted (public.profiles)
✅ Profile created with role: admin
```

---

### 4️⃣ Rafraîchir le Navigateur

**Actions:**
1. Retournez dans votre application (localhost:5174)
2. Appuyez sur: **Ctrl + Shift + R** (hard refresh)
3. Ouvrez la console (F12)

**Résultat attendu:**
```
✅ ZÉRO erreur de colonnes manquantes
✅ ZÉRO erreur PGRST116 (profiles)
✅ Console propre (seulement logs normaux)
```

---

## 📊 Vérification Post-Exécution

### Dans Supabase Dashboard

**Table Editor → marketing_leads:**
- ✅ Devrait contenir 5 enregistrements de test
- ✅ Colonnes visibles: `full_name`, `email`, `phone`, `subject`, `message`, etc.

**Table Editor → profiles:**
- ✅ Votre utilisateur (4089e51f-...) devrait avoir:
  - `role`: admin (ou le rôle choisi)
  - `email`: votre email
  - `full_name`: votre nom

---

## 🔍 Dépannage

### Si erreur "permission denied" sur Script 1
```sql
-- Exécuter d'abord:
ALTER TABLE public.marketing_leads OWNER TO postgres;
GRANT ALL ON TABLE public.marketing_leads TO authenticated;
GRANT ALL ON TABLE public.marketing_leads TO anon;
```

### Si l'utilisateur n'existe pas dans auth.users (Script 2)
```
Erreur: User ID 4089e51f-... not found
Solution: Vous devez vous reconnecter à l'application
```

### Si les erreurs persistent après refresh
1. **Vider complètement le cache:**
   - Chrome: `chrome://settings/clearBrowserData`
   - Cochez "Cached images and files"
   - Période: "All time"
   - Cliquez "Clear data"

2. **Redémarrer le serveur Vite:**
   ```powershell
   # Dans le terminal
   Ctrl+C
   npm run dev
   ```

---

## ✅ Checklist Finale

- [ ] Script 1 exécuté (marketing_leads créée)
- [ ] Script 2 exécuté (profil utilisateur créé)
- [ ] Hard refresh effectué (Ctrl+Shift+R)
- [ ] Console sans erreurs
- [ ] Application fonctionne normalement

---

## 📞 Support

Si vous avez des erreurs après ces étapes:
1. **Copiez l'erreur exacte** de la console
2. **Vérifiez les tables** dans Supabase Table Editor
3. **Listez les erreurs** restantes

---

**Temps estimé:** 10 minutes  
**Difficulté:** ⭐⭐☆☆☆ (Facile)

🚀 **Vous êtes presque arrivé!** Plus que ces 2 scripts SQL à exécuter!
