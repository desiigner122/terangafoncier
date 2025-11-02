# 🔧 Fix Cloudflare Cookie `__cf_bm` Error

## 🚨 Erreur observée en production

```
Le cookie « __cf_bm » a été rejeté car le domaine est invalide.
```

**Source** : Console production `https://www.terangafoncier.sn`  
**Impact** : Cookie Cloudflare non défini → Perte de protection DDoS/Bot  
**Criticité** : ⚠️ Moyenne (n'affecte pas les fonctionnalités principales mais réduit la sécurité)

---

## 📊 Diagnostic

### **Qu'est-ce que `__cf_bm` ?**
Cookie de **Cloudflare Bot Management** utilisé pour :
- Détecter et bloquer les bots malveillants
- Gérer les limitations de taux (rate limiting)
- Protéger contre les attaques DDoS

### **Pourquoi est-il rejeté ?**

#### ✅ **Causes possibles identifiées**

| Cause | Probabilité | Vérification |
|-------|-------------|--------------|
| **1. Configuration domaine Cloudflare** | 🔴 Haute | Vérifier DNS et SSL/TLS |
| **2. SameSite Cookie Policy** | 🟠 Moyenne | Vérifier attribut `SameSite` |
| **3. Mixed Content (HTTP/HTTPS)** | 🟢 Faible | Site déjà HTTPS |
| **4. Sous-domaine mal configuré** | 🟠 Moyenne | Vérifier `www` vs apex |

---

## 🛠️ **Solutions étape par étape**

### **ÉTAPE 1 : Vérifier la configuration Cloudflare DNS**

1. **Connexion à Cloudflare Dashboard**
   - Aller sur : https://dash.cloudflare.com
   - Sélectionner le domaine `terangafoncier.sn`

2. **Vérifier les enregistrements DNS**
   
   Assurez-vous d'avoir :
   ```
   Type    Nom      Contenu                  Proxy Status
   ─────────────────────────────────────────────────────
   A       @        <IP_SERVEUR>             🟠 Proxied
   A       www      <IP_SERVEUR>             🟠 Proxied
   CNAME   www      terangafoncier.sn        🟠 Proxied
   ```

3. **Vérifier que le Proxy est ACTIVÉ (orange cloud)**
   - ❌ **Gray cloud (DNS only)** → Cookie ne fonctionne pas
   - ✅ **Orange cloud (Proxied)** → Cookie fonctionne

---

### **ÉTAPE 2 : Configurer SSL/TLS correctement**

1. **Aller dans : SSL/TLS → Overview**

2. **Mode recommandé : Full (strict)**
   ```
   Off             ❌ Pas de chiffrement
   Flexible        ❌ HTTPS → Cloudflare, HTTP → Serveur
   Full            ⚠️ HTTPS partout mais certificat non vérifié
   Full (strict)   ✅ HTTPS partout + certificat vérifié
   ```

3. **Activer "Always Use HTTPS"**
   - Aller dans : SSL/TLS → Edge Certificates
   - Activer : **Always Use HTTPS** ✅

4. **Activer "Automatic HTTPS Rewrites"**
   - Même section
   - Activer : **Automatic HTTPS Rewrites** ✅

---

### **ÉTAPE 3 : Configurer les règles Page Rules**

1. **Aller dans : Rules → Page Rules**

2. **Créer une règle pour www → non-www (ou inverse)**

   **Option A : Rediriger www → apex (sans www)**
   ```
   URL: www.terangafoncier.sn/*
   Settings:
     - Forwarding URL: 301 Permanent Redirect
     - Destination: https://terangafoncier.sn/$1
   ```

   **Option B : Rediriger apex → www**
   ```
   URL: terangafoncier.sn/*
   Settings:
     - Forwarding URL: 301 Permanent Redirect
     - Destination: https://www.terangafoncier.sn/$1
   ```

   **⚠️ IMPORTANT** : Choisir UNE SEULE option pour éviter les boucles

3. **Créer une règle pour forcer HTTPS**
   ```
   URL: *terangafoncier.sn/*
   Settings:
     - Always Use HTTPS: On
     - Browser Cache TTL: 4 hours
   ```

---

### **ÉTAPE 4 : Vérifier les paramètres de Firewall**

1. **Aller dans : Security → WAF**

2. **Vérifier que "Bot Fight Mode" est activé**
   - Si désactivé, le cookie `__cf_bm` ne sera pas défini

3. **Activer "Browser Integrity Check"**
   - Security → Settings
   - Browser Integrity Check : **On** ✅

---

### **ÉTAPE 5 : Configuration côté application (Vite)**

#### **Vérifier `vite.config.js`**

```javascript
// vite.config.js
export default defineConfig({
  server: {
    // Pour le développement
    host: true,
    port: 5173,
    strictPort: false,
    
    // IMPORTANT : Configuration CORS
    cors: true,
    
    // Configuration proxy si nécessaire
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: {
          '*': '' // Accepter tous les domaines
        }
      }
    }
  },
  
  // Configuration du build pour production
  build: {
    // Pas de problème identifié ici
  }
});
```

---

### **ÉTAPE 6 : Vérifier les en-têtes HTTP**

#### **Tester avec curl**

```bash
# Test depuis votre terminal
curl -I https://www.terangafoncier.sn
```

**Sortie attendue** :
```
HTTP/2 200 
date: Fri, 01 Nov 2024 12:00:00 GMT
content-type: text/html
set-cookie: __cf_bm=...; path=/; expires=...; domain=.terangafoncier.sn; HttpOnly; Secure; SameSite=None
cf-ray: ...
server: cloudflare
```

**Vérifier** :
- ✅ `domain=.terangafoncier.sn` (avec le point devant)
- ✅ `Secure` présent
- ✅ `SameSite=None` ou `SameSite=Lax`

---

### **ÉTAPE 7 : Tester avec les DevTools**

1. **Ouvrir le site** : https://www.terangafoncier.sn

2. **Ouvrir DevTools** : F12

3. **Aller dans : Application → Cookies**

4. **Vérifier `__cf_bm`** :

   | Attribut | Valeur attendue |
   |----------|-----------------|
   | **Name** | `__cf_bm` |
   | **Domain** | `.terangafoncier.sn` (avec `.`) |
   | **Path** | `/` |
   | **Secure** | ✅ Oui |
   | **HttpOnly** | ✅ Oui |
   | **SameSite** | `None` ou `Lax` |
   | **Expires** | ~30 minutes dans le futur |

---

## 🧪 **Tests de validation**

### **Test 1 : Vérifier le domaine du cookie**

```javascript
// Dans la console du navigateur
document.cookie.split(';').forEach(c => console.log(c.trim()));
```

**Chercher** : `__cf_bm=...`

---

### **Test 2 : Tester depuis plusieurs sources**

| Source | URL | Résultat attendu |
|--------|-----|------------------|
| **Direct** | https://terangafoncier.sn | ✅ Cookie défini |
| **WWW** | https://www.terangafoncier.sn | ✅ Cookie défini |
| **HTTP** | http://terangafoncier.sn | ➡️ Redirigé vers HTTPS |
| **Sous-domaine** | https://api.terangafoncier.sn | ✅ Cookie hérité si `.terangafoncier.sn` |

---

## 🔍 **Debugging avancé**

### **Activer les logs Cloudflare**

1. **Aller dans : Analytics → Logs**

2. **Activer Logpush (si disponible)**

3. **Filtrer les erreurs de cookies** :
   ```
   Status: 400, 403
   URI contient: "cookie"
   ```

---

### **Vérifier avec Chrome Net Internals**

1. **Aller sur** : `chrome://net-internals/#events`

2. **Filtrer** : `type:COOKIE_STORE`

3. **Chercher** : Rejets de cookies avec `__cf_bm`

4. **Analyser la raison** :
   - `COOKIE_DOMAIN_MISMATCH` → Problème de domaine
   - `COOKIE_SAMESITE_STRICT` → Problème SameSite
   - `COOKIE_SECURE` → Pas en HTTPS

---

## 📋 **Checklist de vérification**

Avant de déployer, vérifier :

- [ ] **DNS Cloudflare** : Orange cloud activé pour A/CNAME
- [ ] **SSL/TLS** : Mode "Full (strict)"
- [ ] **Always Use HTTPS** : Activé
- [ ] **Page Rules** : Redirection www ↔ non-www configurée
- [ ] **Browser Integrity Check** : Activé
- [ ] **Bot Fight Mode** : Activé (si disponible)
- [ ] **Test manuel** : Cookie `__cf_bm` visible dans DevTools
- [ ] **Test curl** : En-têtes Set-Cookie présents
- [ ] **Console browser** : Aucune erreur "cookie rejeté"

---

## 🚀 **Déploiement de la correction**

### **Si changements Cloudflare uniquement**

1. **Appliquer les modifications dans Cloudflare Dashboard**
2. **Attendre propagation DNS** : 5-15 minutes
3. **Vider le cache Cloudflare** :
   - Aller dans : Caching → Configuration
   - Cliquer : **Purge Everything** ⚠️
4. **Tester** : `curl -I https://www.terangafoncier.sn`

---

### **Si changements code Vite**

```bash
# 1. Reconstruire
npm run build

# 2. Déployer sur le serveur
# (méthode dépend de votre hébergement)
scp -r dist/* user@server:/var/www/terangafoncier/

# 3. Redémarrer le serveur web (si nginx/apache)
sudo systemctl restart nginx

# 4. Vider cache Cloudflare
# (via dashboard)
```

---

## ✅ **Résultat attendu après fix**

### **Console navigateur** (F12)
```
✅ Aucune erreur "cookie rejeté"
✅ __cf_bm présent dans Application → Cookies
```

### **Curl**
```bash
curl -I https://www.terangafoncier.sn | grep -i "set-cookie"
# Output: set-cookie: __cf_bm=...; domain=.terangafoncier.sn; ...
```

---

## 📞 **Support si le problème persiste**

### **Option 1 : Support Cloudflare**
- Dashboard → Help Center
- Créer un ticket avec :
  - Domaine : `terangafoncier.sn`
  - Erreur : "Cookie __cf_bm rejeté"
  - Captures d'écran DevTools

### **Option 2 : Communauté Cloudflare**
- Forum : https://community.cloudflare.com
- Tag : `cookies`, `bot-management`

---

## 📚 **Ressources**

- [Cloudflare Bot Management](https://developers.cloudflare.com/bots/)
- [Cookie SameSite Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Cloudflare SSL/TLS Modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)

---

**Date** : 2024-11-01  
**Priorité** : 🟠 Moyenne  
**Statut** : 🔧 À corriger sur Cloudflare Dashboard
