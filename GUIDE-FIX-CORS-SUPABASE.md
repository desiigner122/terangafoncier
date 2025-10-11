# 🚨 Guide Fix Erreurs CORS Supabase

## 🎯 Problème

Erreurs dans la console :
```
❌ Blocage d'une requête multiorigine (Cross-Origin Request)
❌ TypeError: NetworkError when attempting to fetch resource
❌ Supabase: https://ndenqikcogzrkrjnlvns.supabase.co/rest/v1/*
❌ Polygon RPC: https://polygon-rpc.com/
```

---

## 🔍 Causes Possibles

### 1. **Extensions de Navigateur** (Cause #1 la plus fréquente)
- Bloqueurs de publicités (AdBlock, uBlock Origin)
- Extensions de sécurité/vie privée
- Extensions VPN/Proxy
- Extensions anti-tracking

### 2. **Configuration Supabase Dashboard**
- URL du site non autorisée dans les paramètres
- Politique CORS restrictive

### 3. **Service Worker Actif**
- Cache obsolète
- Service worker corrompu

### 4. **Mode Navigation Privée**
- Restrictions supplémentaires

---

## ✅ Solutions (Ordre de Priorité)

### Solution 1: Désactiver les Extensions de Navigateur

#### A) Test Rapide en Mode Incognito/Privé
1. **Ouvrez une nouvelle fenêtre incognito** (Ctrl+Shift+N dans Chrome/Edge)
2. **Assurez-vous que toutes les extensions sont désactivées** dans ce mode
3. **Accédez à** `http://localhost:5173`
4. **Vérifiez si les erreurs CORS disparaissent**

✅ **Si ça fonctionne** → Le problème vient d'une extension

#### B) Désactiver les Extensions une par une
1. **Ouvrez** `chrome://extensions` (ou équivalent Firefox/Edge)
2. **Désactivez toutes les extensions**
3. **Rechargez** votre application
4. **Réactivez les extensions une par une** pour identifier le coupable

**Extensions problématiques connues:**
- ❌ **uBlock Origin** - Bloque souvent Supabase
- ❌ **Privacy Badger** - Bloque les trackers
- ❌ **HTTPS Everywhere** - Redirige les requêtes
- ❌ **NoScript** - Bloque les scripts externes

---

### Solution 2: Vider le Cache et Service Workers

#### A) Hard Refresh Complet
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

#### B) Vider le Cache Complet
1. **DevTools** (F12)
2. **Application Tab** (onglet Application)
3. **Storage** → **Clear site data**
4. **Cocher toutes les options:**
   - ✅ Cookies
   - ✅ Cache storage
   - ✅ Local storage
   - ✅ Session storage
   - ✅ Service workers
5. **Cliquer sur "Clear site data"**
6. **Fermer DevTools et recharger** (F5)

#### C) Désactiver les Service Workers
1. **DevTools** (F12)
2. **Application Tab**
3. **Service Workers** (menu gauche)
4. **Cliquer sur "Unregister"** pour chaque service worker
5. **Recharger la page**

---

### Solution 3: Configuration Supabase Dashboard

#### A) Autoriser localhost dans Supabase
1. **Ouvrez Supabase Dashboard** → https://supabase.com/dashboard
2. **Sélectionnez votre projet** `terangafoncier`
3. **Settings** (⚙️ en bas à gauche)
4. **API** (dans le menu)
5. **URL Configuration** → Cherchez "Site URL"
6. **Ajoutez** `http://localhost:5173` et `http://localhost:5174`
7. **Sauvegardez**

#### B) Vérifier les Policies RLS
1. **Table Editor** dans Supabase
2. **Sélectionnez une table** (ex: `profiles`)
3. **Vérifiez que RLS n'est pas trop restrictif**

---

### Solution 4: Corriger le Client Supabase (si nécessaire)

Le fichier `src/lib/supabaseClient.js` est déjà correct, mais vérifiez :

```javascript
// ✅ Configuration correcte actuelle
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Si besoin d'options avancées, modifier vers :
```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'terangafoncier-web'
    }
  }
});
```

---

### Solution 5: Redémarrer le Serveur Dev

Parfois le problème vient du serveur Vite qui a un cache corrompu :

```powershell
# Dans votre terminal PowerShell

# 1. Arrêter le serveur (Ctrl+C)

# 2. Supprimer le cache Vite
Remove-Item -Path "node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Relancer
npm run dev
```

---

## 🔍 Diagnostic: Identifier la Cause

### Test 1: Extensions
```
✅ Mode incognito sans extensions → Fonctionne
❌ Mode normal avec extensions → Ne fonctionne pas
→ Conclusion: Une extension bloque
```

### Test 2: Cache
```
✅ Après vidage cache → Fonctionne
❌ Avant vidage cache → Ne fonctionne pas
→ Conclusion: Cache corrompu ou service worker
```

### Test 3: Configuration Supabase
```
✅ Requête depuis Postman/Insomnia → Fonctionne
❌ Requête depuis navigateur → Ne fonctionne pas
→ Conclusion: Problème client-side (extension/cache)
```

### Test 4: Network Tab
1. **Ouvrez DevTools** (F12)
2. **Network Tab**
3. **Rechargez la page**
4. **Filtrez par** `supabase.co`
5. **Cliquez sur une requête rouge**
6. **Regardez les Headers:**
   - Si **Status: (failed)** → Bloqué par extension
   - Si **Status: 403/401** → Problème d'authentification
   - Si **Status: 0** → CORS ou extension

---

## 🎯 Solution Recommandée (Séquence)

**Suivez cette séquence dans l'ordre :**

1. ✅ **Désactiver toutes les extensions** (5 secondes)
2. ✅ **Hard refresh** Ctrl+Shift+R (2 secondes)
3. ✅ **Vider le cache** via DevTools → Application → Clear site data (10 secondes)
4. ✅ **Redémarrer le serveur dev** (30 secondes)
5. ✅ **Tester en mode incognito** (10 secondes)

**Total: < 1 minute**

---

## 🚫 Erreur Polygon RPC

L'erreur `https://polygon-rpc.com/` vient probablement d'un service blockchain.

**Désactiver temporairement :**

Dans `.env`, changez :
```env
# Avant
VITE_ENABLE_BLOCKCHAIN=true

# Après (temporaire pour debug)
VITE_ENABLE_BLOCKCHAIN=false
```

Puis redémarrez le serveur.

---

## 📊 Vérification Finale

Une fois corrigé, vous devriez voir dans la console :

```
✅ GET /profiles?select=... [200 OK]
✅ GET /properties?select=... [200 OK]
✅ GET /transactions?select=... [200 OK]
✅ GET /blog_posts?select=... [200 OK]
```

Et **aucune erreur CORS**.

---

## 🆘 Si Rien ne Fonctionne

### Plan B: Tester avec Fetch Direct

Ouvrez la console browser (F12) et exécutez :

```javascript
// Test direct Supabase
fetch('https://ndenqikcogzrkrjnlvns.supabase.co/rest/v1/profiles?select=id&limit=1', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM'
  }
})
.then(r => r.json())
.then(d => console.log('✅ Supabase OK:', d))
.catch(e => console.error('❌ Erreur:', e));
```

**Résultats possibles:**
- ✅ **Données retournées** → Supabase fonctionne, problème dans le code
- ❌ **NetworkError** → Extension qui bloque
- ❌ **401/403** → Problème d'authentification
- ❌ **CORS error** → Configuration Supabase Dashboard

---

## 📞 Checklist de Dépannage

- [ ] Extensions désactivées
- [ ] Mode incognito testé
- [ ] Cache vidé (DevTools → Application → Clear site data)
- [ ] Service workers désinscrits
- [ ] Serveur dev redémarré
- [ ] .env vérifié (VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY)
- [ ] Supabase Dashboard → Settings → API → localhost ajouté
- [ ] Test fetch direct dans console
- [ ] VITE_ENABLE_BLOCKCHAIN=false (temporaire)

---

**Date:** 11 Octobre 2025  
**Version:** 1.0  
**Priorité:** 🔥 CRITIQUE - À résoudre en premier

**Note:** 90% des erreurs CORS sont causées par des extensions de navigateur bloquant les requêtes.
