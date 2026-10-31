# 🔐 CONFIGURATION VARIABLES D'ENVIRONNEMENT VERCEL

**Date** : 9 octobre 2025  
**Statut** : ✅ Fichier `.env.production` créé localement

---

## 📋 Variables Obligatoires pour Vercel

Après avoir déployé votre application sur Vercel, vous **DEVEZ** configurer ces variables dans le Dashboard Vercel.

### ✅ SUPABASE (OBLIGATOIRE)

Ces variables sont **essentielles** pour que l'application fonctionne :

```bash
VITE_SUPABASE_URL=https://ndenqikcogzrkrjnlvns.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM
```

---

## 🚀 Comment Configurer sur Vercel

### Méthode 1 : Via le Dashboard (Recommandé)

#### Étape 1 : Accéder aux Settings
1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **terangafoncier**
3. Cliquez sur **"Settings"** (en haut)
4. Dans le menu latéral, cliquez sur **"Environment Variables"**

#### Étape 2 : Ajouter les Variables
Pour chaque variable :

1. **Name** : Entrez le nom (ex: `VITE_SUPABASE_URL`)
2. **Value** : Collez la valeur
3. **Environments** : Cochez **Production**, **Preview**, et **Development**
4. Cliquez sur **"Add"** ou **"Save"**

#### Variables à Ajouter

**Variable 1** :
```
Name: VITE_SUPABASE_URL
Value: https://ndenqikcogzrkrjnlvns.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 2** :
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM
Environments: ✅ Production ✅ Preview ✅ Development
```

**Variable 3** (Optionnel - Mode) :
```
Name: VITE_APP_ENV
Value: production
Environments: ✅ Production only
```

**Variable 4** (Optionnel - Monitoring) :
```
Name: VITE_ENABLE_MONITORING
Value: true
Environments: ✅ Production ✅ Preview
```

**Variable 5** (Optionnel - Analytics) :
```
Name: VITE_ENABLE_ANALYTICS
Value: true
Environments: ✅ Production ✅ Preview
```

#### Étape 3 : Redéployer
Après avoir ajouté les variables :
1. Allez dans l'onglet **"Deployments"**
2. Cliquez sur le dernier déploiement
3. Cliquez sur **"Redeploy"** (3 points en haut à droite)
4. Ou faites simplement un nouveau push sur GitHub

---

### Méthode 2 : Via Vercel CLI

Si vous préférez la ligne de commande :

```bash
# Ajouter une variable
vercel env add VITE_SUPABASE_URL production

# Vous serez invité à entrer la valeur
# Entrez: https://ndenqikcogzrkrjnlvns.supabase.co

# Répétez pour chaque variable
vercel env add VITE_SUPABASE_ANON_KEY production
# Entrez la clé Supabase

# Lister les variables
vercel env ls
```

---

## 📦 Variables Optionnelles (Configurer si nécessaire)

### OpenAI (pour fonctionnalités IA)
```bash
VITE_OPENAI_API_KEY=sk-...votre_clé_openai
```

### Google Maps (pour géolocalisation)
```bash
VITE_GOOGLE_MAPS_API_KEY=AIza...votre_clé_google
```

### Stripe (pour paiements)
```bash
VITE_STRIPE_PUBLIC_KEY=pk_live_...votre_clé_stripe
```

---

## ✅ Vérification Post-Configuration

### 1. Vérifier dans Vercel Dashboard
Allez dans Settings > Environment Variables et vérifiez que vous voyez :
- ✅ VITE_SUPABASE_URL (Production, Preview, Development)
- ✅ VITE_SUPABASE_ANON_KEY (Production, Preview, Development)

### 2. Tester en Production
Après déploiement, ouvrez votre site et :
1. Ouvrez la console (F12)
2. Vérifiez qu'il n'y a pas d'erreur "Supabase client not initialized"
3. Essayez de vous connecter
4. Testez la création d'un terrain

### 3. Vérifier les Logs
Dans Vercel Dashboard > Runtime Logs :
- Pas d'erreur "missing environment variable"
- Connexion Supabase réussie

---

## 🐛 Dépannage

### Problème : "Supabase client not initialized"

**Solution** :
1. Vérifiez que les variables sont bien ajoutées sur Vercel
2. Vérifiez que vous avez sélectionné "Production" dans Environments
3. Redéployez l'application

### Problème : Les variables ne sont pas prises en compte

**Solution** :
1. Supprimez le déploiement actuel
2. Re-pushez le code sur GitHub
3. Vercel va redéployer automatiquement avec les nouvelles variables

### Problème : Erreur "Invalid API key"

**Solution** :
1. Vérifiez que vous n'avez pas de guillemets dans la valeur
2. La valeur doit être : `https://...` et non `"https://..."`
3. Supprimez et ajoutez à nouveau la variable

---

## 📝 Checklist de Configuration

Avant de déployer, vérifiez :

- [ ] ✅ `.env.production` créé localement (pour référence)
- [ ] ✅ `.env.production` ajouté au `.gitignore` (sécurité)
- [ ] ✅ Variables Supabase ajoutées sur Vercel Dashboard
- [ ] ✅ Environments sélectionnés : Production, Preview, Development
- [ ] ✅ Déploiement effectué : `vercel --prod`
- [ ] ✅ Site visité et testé en production
- [ ] ✅ Connexion Supabase fonctionnelle
- [ ] ✅ Aucune erreur dans les logs

---

## 🔒 Sécurité

### ⚠️ IMPORTANT

**NE JAMAIS** commiter ces fichiers sur GitHub :
- ❌ `.env`
- ❌ `.env.production`
- ❌ Tout fichier contenant des clés API

**Le `.gitignore` est configuré** pour les ignorer automatiquement.

### Rotation des Clés

Si vous pensez qu'une clé a été exposée :
1. Allez sur Supabase Dashboard
2. Settings > API
3. Régénérez la clé ANON
4. Mettez à jour sur Vercel
5. Redéployez

---

## 📊 Variables par Environnement

### Production (vercel.app)
```bash
VITE_SUPABASE_URL=https://ndenqikcogzrkrjnlvns.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_APP_ENV=production
VITE_ENABLE_MONITORING=true
VITE_DEBUG=false
```

### Preview (branches)
```bash
VITE_SUPABASE_URL=https://ndenqikcogzrkrjnlvns.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_APP_ENV=preview
VITE_ENABLE_MONITORING=true
VITE_DEBUG=true
```

### Development (local)
```bash
VITE_SUPABASE_URL=https://ndenqikcogzrkrjnlvns.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_APP_ENV=development
VITE_ENABLE_MONITORING=false
VITE_DEBUG=true
```

---

## 🎯 Résumé

**Configurations requises** :
1. ✅ 2 variables Supabase (OBLIGATOIRES)
2. ✅ Configuration sur Vercel Dashboard
3. ✅ Redéploiement après configuration

**Temps estimé** : 3 minutes

**Après configuration** :
- Application fonctionnelle en production ✅
- Connexion base de données OK ✅
- Monitoring actif ✅
- Analytics opérationnel ✅

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel : Dashboard > Runtime Logs
2. Vérifiez Supabase : Dashboard > Database > Tables
3. Testez la connexion : Console navigateur (F12)

**Votre application est maintenant prête pour la production !** 🚀
