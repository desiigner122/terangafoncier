# Configuration OpenAI sur Vercel

## 🎯 Objectif
Configurer la clé API OpenAI dans Vercel pour activer les fonctionnalités IA en production.

## 📋 Prérequis

### 1. Obtenir une clé API OpenAI
1. Créer un compte sur [OpenAI Platform](https://platform.openai.com/)
2. Aller dans **API Keys** : https://platform.openai.com/api-keys
3. Cliquer sur **"Create new secret key"**
4. Donner un nom à la clé (ex: "Teranga Foncier Production")
5. **Copier la clé** (format: `sk-proj-xxxxxxxxxx`)
   ⚠️ **Important** : Vous ne pourrez plus la revoir après fermeture !

### 2. Budget et Limites (Recommandé)
1. Aller dans **Settings** > **Billing** : https://platform.openai.com/account/billing
2. Ajouter une carte de crédit
3. Définir un **Usage Limit** (ex: $10/mois pour commencer)
4. Configurer des alertes email à 50% et 80%

**Coûts estimés** :
- GPT-4 Turbo : ~$0.03 par 1000 tokens (~$3 pour 100 analyses)
- GPT-3.5 Turbo : ~$0.001 par 1000 tokens (plus économique)

## 🚀 Configuration sur Vercel

### Méthode 1 : Via l'Interface Web Vercel (Recommandé)

1. **Aller sur votre projet Vercel** : https://vercel.com/dashboard
2. Sélectionner le projet **terangafoncier**
3. Aller dans **Settings** (⚙️)
4. Cliquer sur **Environment Variables** dans le menu latéral
5. Ajouter la variable :
   - **Key** : `VITE_OPENAI_API_KEY`
   - **Value** : `sk-proj-votre_cle_ici`
   - **Environments** : Cocher `Production`, `Preview`, `Development`
6. Cliquer sur **Save**

### Méthode 2 : Via Vercel CLI

```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Se connecter
vercel login

# Ajouter la variable d'environnement
vercel env add VITE_OPENAI_API_KEY

# Suivre les instructions interactives :
# 1. Entrer votre clé API OpenAI
# 2. Sélectionner les environnements (Production, Preview, Development)
```

### Méthode 3 : Via vercel.json (À ÉVITER pour les secrets)

⚠️ **NE PAS utiliser cette méthode pour les clés API** (risque de commit dans Git)

## 📝 Variables d'environnement à configurer

### Variables Obligatoires (Déjà configurées)
```bash
VITE_SUPABASE_URL=https://ndenqikcogzrkrjnlvns.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variables IA (À configurer)
```bash
# OpenAI - Pour analyses IA, génération descriptions, chatbot
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Variables Optionnelles (Blockchain, Maps, etc.)
```bash
# WalletConnect (Blockchain/NFT)
VITE_WALLETCONNECT_PROJECT_ID=xxxxxxxxxxxxxxxxxxxxxxxx

# Google Maps (Géolocalisation)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX

# Pinata (IPFS/NFT Storage)
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_PINATA_GATEWAY=gateway.pinata.cloud
```

## 🔄 Redéploiement

Après avoir ajouté les variables d'environnement :

### Option 1 : Redéploiement automatique
Si vous avez l'auto-deploy activé, poussez un commit :
```bash
git add .
git commit -m "docs: add OpenAI configuration guide"
git push
```

### Option 2 : Redéploiement manuel
1. Aller sur Vercel Dashboard
2. Sélectionner votre projet
3. Cliquer sur **"Redeploy"** sur le dernier déploiement
4. Cocher **"Use existing Build Cache"** (optionnel)
5. Cliquer sur **"Redeploy"**

### Option 3 : Via CLI
```bash
vercel --prod
```

## ✅ Vérification

### 1. Vérifier dans les logs Vercel
1. Aller sur Vercel Dashboard > Votre projet
2. Cliquer sur l'onglet **"Deployments"**
3. Sélectionner le dernier déploiement
4. Aller dans **"Runtime Logs"**
5. Chercher le message : `✅ Clé API OpenAI détectée`

### 2. Tester en production
1. Aller sur votre site en production
2. Se connecter en tant que vendeur
3. Aller dans **Dashboard Vendeur** > **Analyses IA**
4. Tester une fonctionnalité IA :
   - Analyse de propriété
   - Génération de description
   - Chatbot IA
5. Vérifier qu'il n'y a pas de message "Mode simulation"

### 3. Vérifier dans la console navigateur
```javascript
// Ouvrir DevTools (F12) > Console
// Vous devriez voir :
"✅ Clé API OpenAI configurée avec succès"
// Et PAS :
"⚠️ OpenAI API Key non configurée. Utilisation du mode simulation."
```

## 🐛 Dépannage

### Problème 1 : IA ne fonctionne pas après configuration
**Solution** :
1. Vérifier que la clé commence par `sk-proj-` ou `sk-`
2. Vérifier qu'il n'y a pas d'espaces avant/après la clé
3. Vérifier que la variable s'appelle exactement `VITE_OPENAI_API_KEY`
4. Forcer un redéploiement (sans cache)

### Problème 2 : Erreur 401 Unauthorized
**Causes possibles** :
- Clé API invalide ou expirée
- Pas de crédits sur le compte OpenAI
- Limite de taux atteinte

**Solution** :
1. Régénérer une nouvelle clé sur OpenAI Platform
2. Ajouter des crédits sur votre compte
3. Vérifier les limites sur https://platform.openai.com/account/limits

### Problème 3 : Coûts trop élevés
**Solutions** :
1. Passer à GPT-3.5-turbo (moins cher) :
   ```javascript
   // Dans src/services/ai/OpenAIService.js
   this.model = 'gpt-3.5-turbo'; // Au lieu de 'gpt-4-turbo-preview'
   ```
2. Activer le cache des réponses
3. Limiter les requêtes par utilisateur
4. Définir des usage limits sur OpenAI Platform

### Problème 4 : Variable non détectée
**Solution** :
```bash
# Lister toutes les variables d'environnement
vercel env ls

# Supprimer et recréer la variable
vercel env rm VITE_OPENAI_API_KEY
vercel env add VITE_OPENAI_API_KEY
```

## 📊 Monitoring des coûts

### 1. Dashboard OpenAI
- Aller sur : https://platform.openai.com/account/usage
- Voir l'utilisation en temps réel
- Exporter les rapports

### 2. Logs Vercel
- Surveiller les logs pour détecter les erreurs
- Compter le nombre de requêtes IA

### 3. Analytics personnalisés
```javascript
// Dans src/services/ai/OpenAIService.js
// Logger chaque appel IA
console.log('[AI] Request:', { model, tokens, cost });
```

## 🔒 Sécurité

### ✅ Bonnes pratiques
- ✅ Utiliser les variables d'environnement Vercel
- ✅ Ne JAMAIS commit les clés dans Git
- ✅ Définir des usage limits sur OpenAI
- ✅ Régénérer les clés régulièrement
- ✅ Utiliser des clés différentes pour dev/prod

### ❌ À éviter
- ❌ Exposer les clés dans le code frontend
- ❌ Commit les fichiers .env dans Git
- ❌ Utiliser la même clé partout
- ❌ Ne pas surveiller les coûts

## 🎓 Mode Simulation (Sans clé API)

L'application fonctionne en **mode simulation gratuit** par défaut si aucune clé n'est configurée :

- ✅ Toutes les fonctionnalités visibles
- ✅ Réponses IA simulées (instantanées)
- ✅ Aucun coût
- ⚠️ Données non réelles (pour démo uniquement)

**Pour activer** : Ne pas configurer `VITE_OPENAI_API_KEY`

## 📞 Support

- OpenAI Support : https://help.openai.com/
- Vercel Support : https://vercel.com/support
- Documentation OpenAI : https://platform.openai.com/docs
- Documentation Vercel : https://vercel.com/docs/environment-variables

## 🚀 Résumé rapide

```bash
# 1. Obtenir clé OpenAI
https://platform.openai.com/api-keys

# 2. Ajouter sur Vercel
Vercel Dashboard > Settings > Environment Variables
Key: VITE_OPENAI_API_KEY
Value: sk-proj-xxxxxxxxxx

# 3. Redéployer
git push
# ou
vercel --prod

# 4. Tester
Dashboard Vendeur > Analyses IA
```

---

**✅ Configuration terminée !** L'IA GPT-4 est maintenant active en production.
