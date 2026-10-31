# 🌐 GUIDE DÉPLOIEMENT VERCEL - TERANGA FONCIER

## 📋 VARIABLES D'ENVIRONNEMENT À CONFIGURER SUR VERCEL

### 🔗 Comment ajouter les variables sur Vercel :
1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet `terangafoncier`
3. Aller dans `Settings` > `Environment Variables`
4. Ajouter chaque variable ci-dessous

---

## 🔐 VARIABLES CRITIQUES À AJOUTER

### **Serveur & Base de données**
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://votre-domaine-frontend.vercel.app
```

### **Authentification (OBLIGATOIRE)**
```
JWT_SECRET=teranga-foncier-production-secret-2025-very-long-and-secure-key
JWT_REFRESH_SECRET=teranga-foncier-refresh-production-secret-2025-very-long-and-secure-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=30d
```

### **Base de données Production**
```
DATABASE_TYPE=postgresql
DATABASE_URL=postgresql://username:password@host:5432/teranga_foncier
```
*Note: Pour production, remplacer SQLite par PostgreSQL via Supabase ou Neon*

### **Services IA (À obtenir)**
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_AI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### **Blockchain Polygon**
```
POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_INFURA_KEY
POLYGON_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
POLYGON_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
```

### **Services externes**
```
MAPBOX_API_KEY=pk.eyJ1IjoieW91cnVzZXIiLCJhIjoiY2xxxxxxxxxxxx
GOOGLE_MAPS_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
CLOUDINARY_CLOUD_NAME=teranga-foncier
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### **Sécurité**
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

---

## 🎯 ÉTAPES DE DÉPLOIEMENT VERCEL

### 1. Préparer le backend pour Vercel
```bash
# Créer vercel.json dans backend/
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### 2. Adapter package.json pour Vercel
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build step required'",
    "vercel-build": "echo 'Build completed'"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### 3. Configuration base de données production
- **Option 1**: Supabase (PostgreSQL gratuit)
- **Option 2**: Neon Database (PostgreSQL)
- **Option 3**: PlanetScale (MySQL)

### 4. Upload sur Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
cd backend
vercel
```

---

## 🔑 OÙ OBTENIR LES CLÉS API

### **OpenAI** (IA)
- Site: https://platform.openai.com/
- Aller dans API Keys
- Créer nouvelle clé
- Format: `sk-proj-...`

### **Google AI** (Gemini)
- Site: https://makersuite.google.com/
- Créer projet Google Cloud
- Activer Generative AI API
- Format: `AIza...`

### **Polygon/Ethereum** (Blockchain)
- **Infura**: https://infura.io/ (RPC nodes)
- **Wallet privé**: MetaMask > Export Private Key
- **Contrat**: Déployer smart contract

### **Mapbox** (Cartes)
- Site: https://account.mapbox.com/
- Créer token
- Format: `pk.eyJ1...`

### **Stripe** (Paiements)
- Site: https://dashboard.stripe.com/
- API Keys section
- Utiliser clés LIVE pour production

---

## ⚡ CONFIGURATION RAPIDE VERCEL

### Variables minimales pour MVP :
```bash
NODE_ENV=production
JWT_SECRET=votre-secret-tres-long-et-securise
DATABASE_URL=postgresql://user:pass@host:5432/db
FRONTEND_URL=https://votre-app.vercel.app
```

### Script d'ajout automatique (optionnel) :
```bash
# Via Vercel CLI
vercel env add NODE_ENV production
vercel env add JWT_SECRET votre-secret-jwt
vercel env add DATABASE_URL votre-url-db
```

---

## 🎯 ORDRE DE PRIORITÉ

1. **JWT_SECRET** ← CRITIQUE pour authentification
2. **DATABASE_URL** ← CRITIQUE pour données
3. **FRONTEND_URL** ← Important pour CORS
4. **OPENAI_API_KEY** ← Pour fonctionnalités IA
5. **Autres services** ← Selon besoins

---

## ✅ CHECKLIST DÉPLOIEMENT

- [ ] Variables d'environnement ajoutées sur Vercel
- [ ] Base de données production configurée
- [ ] JWT secrets générés (longs et sécurisés)
- [ ] CORS configuré avec URL frontend
- [ ] Clés API obtenues et ajoutées
- [ ] Tests sur environnement de staging
- [ ] Déploiement production validé

**Voulez-vous que je vous aide à créer le fichier vercel.json et adapter le code pour le déploiement ?**