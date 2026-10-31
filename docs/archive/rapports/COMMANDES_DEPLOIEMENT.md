# 🚀 COMMANDES DE DÉPLOIEMENT - GUIDE RAPIDE

## ✅ ÉTAPE 1 : Tests d'Intégration

### Exécuter les tests
```powershell
node tests/run-integration-tests.js
```

**Résultat attendu :** 8/12 tests réussis (66.67%)  
**Action requise :** Déployer le schema SQL pour les 4 tables manquantes

---

## 📋 ÉTAPE 2 : Déploiement du Schema SQL

### A. Déployer dans Supabase Dashboard

1. **Ouvrir Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns
   ```

2. **SQL Editor**
   - Cliquez sur "SQL Editor" dans le menu de gauche
   - Cliquez sur "New Query"

3. **Copier le Schema**
   - Ouvrez le fichier : `supabase\schema-production.sql`
   - Copiez TOUT le contenu (Ctrl+A, Ctrl+C)

4. **Exécuter**
   - Collez dans l'éditeur SQL
   - Cliquez sur "Run" (ou Ctrl+Enter)
   - Attendez la confirmation de succès (~30 secondes)

### B. Créer le Bucket Storage

1. **Allez dans Storage**
   - Dashboard Supabase > Storage

2. **Créer le bucket**
   - Cliquez sur "Create a new bucket"
   - Nom : `terrain-photos`
   - Public : ✅ **Coché (OUI)**
   - Cliquez sur "Create bucket"

### C. Vérifier le Déploiement

```powershell
node scripts/verify-deployment.js
```

**Résultat attendu :** 15/15 tables + Bucket Storage + Données initiales ✓

---

## 🏗️ ÉTAPE 3 : Build Production

### Option A : Script Automatique (Recommandé)

```powershell
.\scripts\build-production.ps1
```

Ce script :
- ✓ Vérifie les pré-requis
- ✓ Installe les dépendances
- ✓ Build l'application
- ✓ Vérifie la qualité
- ✓ Prépare le déploiement

### Option B : Manuel

```powershell
# Installer les dépendances
npm install

# Build production
npm run build

# Vérifier le build
ls dist
```

**Durée :** ~3 minutes  
**Résultat :** Dossier `dist/` créé avec l'application optimisée

---

## 🚀 ÉTAPE 4 : Déploiement Frontend

### Option 1 : Vercel (Recommandé - Le plus simple)

#### A. Déploiement automatique
```powershell
.\scripts\deploy-vercel.ps1
```

#### B. Déploiement manuel
```powershell
# Installer Vercel CLI
npm install -g vercel

# Déployer en preview
vercel

# Après configuration des variables d'environnement
vercel --prod
```

**Configuration Vercel :**
1. Allez sur : https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Settings > Environment Variables
4. Ajoutez :
   - `VITE_SUPABASE_URL` = `https://ndenqikcogzrkrjnlvns.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (votre clé depuis .env)
5. Redéployez

---

### Option 2 : Netlify

```powershell
# Installer Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Déployer
netlify deploy --prod --dir=dist
```

**Configuration Netlify :**
- Build command : `npm run build`
- Publish directory : `dist`
- Variables d'environnement : Idem Vercel

---

### Option 3 : Déploiement Manuel (VPS/Serveur)

```powershell
# 1. Compresser le dossier dist
Compress-Archive -Path dist\* -DestinationPath dist.zip

# 2. Upload sur votre serveur (via FTP/SFTP)

# 3. Configurer Nginx (exemple)
```

**Exemple configuration Nginx :**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/terangafoncier/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## ✅ ÉTAPE 5 : Tests Utilisateurs

### Consulter le guide

```powershell
# Ouvrir le guide de tests
code docs\TESTS_UTILISATEURS.md
```

### Tests critiques à effectuer

1. **Authentification** (5 min)
   - Inscription
   - Connexion
   - Déconnexion

2. **Dashboards** (15 min)
   - Dashboard Notaire (13 pages)
   - Dashboard Vendeur (3 pages)
   - Dashboard Particulier
   - Dashboard Admin

3. **Fonctionnalités principales** (20 min)
   - Création d'annonces
   - Upload de photos
   - Gestion des offres
   - Notifications
   - Transactions blockchain

4. **Performance** (5 min)
   - Temps de chargement < 3s
   - Responsive design
   - Navigation fluide

---

## 📊 ÉTAPE 6 : Monitoring

### A. Monitoring automatique (déjà actif)

Le `MonitoringService.js` est déjà intégré dans votre application et track :
- ✓ Erreurs JavaScript
- ✓ Performance des pages
- ✓ Appels API
- ✓ Navigation utilisateur

### B. Console de monitoring

Ouvrez la console développeur (F12) et tapez :
```javascript
window.__monitoring.showDashboard()
```

### C. Services externes (optionnel)

#### Sentry (Erreurs)
```powershell
npm install @sentry/react
```

#### LogRocket (Session Replay)
```powershell
npm install logrocket
```

#### Google Analytics
```powershell
npm install react-ga4
```

---

## 📋 CHECKLIST COMPLÈTE

### Avant le déploiement
- [ ] Tests d'intégration réussis (12/12)
- [ ] Schema SQL déployé dans Supabase
- [ ] Bucket Storage créé
- [ ] Variables d'environnement configurées
- [ ] Build production créé

### Déploiement
- [ ] Application déployée sur la plateforme choisie
- [ ] Variables d'environnement configurées sur la plateforme
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] HTTPS activé

### Post-déploiement
- [ ] Tests utilisateurs effectués
- [ ] Monitoring actif
- [ ] Performance vérifiée (<3s)
- [ ] Responsive testé
- [ ] Cross-browser testé

---

## 🆘 DÉPANNAGE

### Erreur : "Table not found"
**Solution :** Déployez le schema SQL dans Supabase Dashboard

### Erreur : "Bucket not found"
**Solution :** Créez le bucket `terrain-photos` dans Storage

### Build échoue
```powershell
# Nettoyer et réinstaller
Remove-Item -Recurse -Force node_modules, dist
npm install
npm run build
```

### Variables d'environnement non trouvées
**Solution :** Vérifiez que le fichier `.env` existe et contient :
```env
VITE_SUPABASE_URL="https://ndenqikcogzrkrjnlvns.supabase.co"
VITE_SUPABASE_ANON_KEY="votre_clé"
```

---

## 📚 DOCUMENTATION COMPLÈTE

Pour plus de détails, consultez :
- **Déploiement :** `docs\DEPLOIEMENT_PRODUCTION.md`
- **Tests utilisateurs :** `docs\TESTS_UTILISATEURS.md`
- **Rapport final :** `docs\RAPPORT_FINAL_LIVRAISON.md`

---

## 🎯 COMMANDES RAPIDES (Copier-Coller)

```powershell
# 1. Tests
node tests/run-integration-tests.js

# 2. Vérifier DB (après déploiement SQL)
node scripts/verify-deployment.js

# 3. Build
.\scripts\build-production.ps1

# 4. Déployer (Vercel)
.\scripts\deploy-vercel.ps1

# OU (Netlify)
netlify deploy --prod --dir=dist

# 5. Tests utilisateurs
code docs\TESTS_UTILISATEURS.md
```

---

## ✅ SUCCÈS !

Une fois toutes les étapes complétées, votre application est en production ! 🎉

**URL de production :**
- Vercel : `https://votre-projet.vercel.app`
- Netlify : `https://votre-projet.netlify.app`
- Personnalisé : `https://votre-domaine.com`

**Prochaines étapes :**
1. Ajouter un domaine personnalisé
2. Configurer les emails transactionnels
3. Activer les notifications push
4. Optimiser le SEO
5. Marketing et acquisition

---

*Document créé le : 9 octobre 2025*  
*Projet : TerangaFoncier Platform*  
*Version : Production 1.0*
