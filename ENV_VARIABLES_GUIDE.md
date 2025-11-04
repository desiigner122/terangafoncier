# 🔑 Configuration des Variables d'Environnement

## Vercel - Configuration Rapide

### 1️⃣ Variables Obligatoires (Déjà configurées)

Ces variables sont déjà dans Vercel :

```bash
VITE_SUPABASE_URL=https://ndenqikcogzrkrjnlvns.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2️⃣ Intelligence Artificielle (À CONFIGURER - PRIORITAIRE)

**OpenAI GPT-4** - Pour analyses IA, descriptions automatiques, chatbot

```bash
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**📖 Guide complet** : Voir `CONFIGURATION_VERCEL_OPENAI.md`

**🚀 Configuration rapide** :
1. Obtenir clé sur : https://platform.openai.com/api-keys
2. Vercel Dashboard → Settings → Environment Variables
3. Ajouter `VITE_OPENAI_API_KEY` avec votre clé
4. Sauvegarder et redéployer

**💰 Coût** : ~$0.03 par 1000 tokens (GPT-4) | ~$3 pour 100 analyses IA
**🆓 Alternative** : Mode simulation gratuit si pas de clé (pour démo)

### 3️⃣ Blockchain & NFT (Optionnel)

**WalletConnect** - Pour connexion wallets Web3

```bash
VITE_WALLETCONNECT_PROJECT_ID=votre_project_id
```

- Obtenir sur : https://cloud.walletconnect.com/
- Gratuit pour usage standard

**Pinata IPFS** - Stockage métadonnées NFT

```bash
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_PINATA_GATEWAY=gateway.pinata.cloud
```

- Obtenir sur : https://www.pinata.cloud/
- Plan gratuit : 1GB

### 4️⃣ Géolocalisation (Optionnel)

**Google Maps API** - Cartes et localisation

```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
```

- Obtenir sur : https://console.cloud.google.com/
- $200 de crédits gratuits/mois

### 5️⃣ Autres Services (Optionnel)

```bash
# Tesseract OCR (Anti-fraude documents)
VITE_OCR_API_KEY=votre_cle_ocr

# SendGrid (Emails transactionnels)
VITE_SENDGRID_API_KEY=SG.xxxxxxxxxxxxxx

# Twilio (SMS notifications)
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
VITE_TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxx

# DocuSign (Signature électronique)
VITE_DOCUSIGN_INTEGRATION_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## 📊 État des Fonctionnalités

| Service | État | Impact si absent |
|---------|------|------------------|
| **Supabase** | ✅ Configuré | ❌ App ne fonctionne pas |
| **OpenAI** | ⚠️ À configurer | 🟡 Mode simulation (démo uniquement) |
| WalletConnect | ❌ Optionnel | 🟢 Fonctionnalités blockchain désactivées |
| Google Maps | ❌ Optionnel | 🟢 Cartes génériques affichées |
| Pinata | ❌ Optionnel | 🟢 NFT non disponibles |
| Autres | ❌ Optionnel | 🟢 Fonctions avancées désactivées |

## 🎯 Priorités de Configuration

### Phase 1 - Production Minimale ✅
- [x] Supabase (Base de données)
- [ ] **OpenAI** ← **PRIORITÉ ACTUELLE**

### Phase 2 - Fonctionnalités Avancées
- [ ] WalletConnect (Blockchain)
- [ ] Google Maps (Géolocalisation)

### Phase 3 - Services Complémentaires
- [ ] Pinata (NFT/IPFS)
- [ ] SendGrid (Emails)
- [ ] Twilio (SMS)
- [ ] DocuSign (Signatures)

## 📝 Comment Ajouter une Variable sur Vercel

### Méthode 1 : Interface Web (Recommandée)

```
1. Vercel Dashboard : https://vercel.com/dashboard
2. Sélectionner projet "terangafoncier"
3. Settings ⚙️
4. Environment Variables
5. Add New
   - Name: VITE_OPENAI_API_KEY
   - Value: sk-proj-xxxxx
   - Environments: ✓ Production ✓ Preview ✓ Development
6. Save
7. Redeploy
```

### Méthode 2 : Vercel CLI

```bash
# Installer CLI
npm i -g vercel

# Login
vercel login

# Ajouter variable
vercel env add VITE_OPENAI_API_KEY
# Entrer la valeur
# Sélectionner environnements

# Lister variables
vercel env ls

# Supprimer variable
vercel env rm VITE_OPENAI_API_KEY
```

## ✅ Vérification Post-Configuration

### 1. Vérifier les logs Vercel
```
Dashboard → Deployments → Latest → Runtime Logs
Chercher : "✅ Clé API OpenAI détectée"
```

### 2. Tester en production
```
1. Ouvrir le site : https://votre-app.vercel.app
2. Login vendeur
3. Dashboard → Analyses IA
4. Tester une fonction IA
5. Vérifier qu'il n'y a pas "Mode simulation"
```

### 3. Console navigateur (F12)
```javascript
// Devrait afficher :
"✅ Clé API OpenAI configurée avec succès"

// PAS :
"⚠️ Mode simulation actif"
```

## 🔒 Sécurité

### ✅ À FAIRE
- ✅ Utiliser variables d'environnement Vercel
- ✅ Ne JAMAIS commit les clés dans Git
- ✅ Fichier `.env.local` dans `.gitignore`
- ✅ Clés différentes dev/prod
- ✅ Définir usage limits OpenAI

### ❌ À ÉVITER
- ❌ Clés API dans le code
- ❌ Commit `.env.local`
- ❌ Partager clés publiquement
- ❌ Même clé partout
- ❌ Pas de monitoring des coûts

## 💰 Estimation des Coûts (Mensuel)

### Configuration Minimale (OpenAI uniquement)
- **Trafic faible** : ~$5-10/mois
- **Trafic moyen** : ~$20-30/mois
- **Trafic élevé** : ~$50-100/mois

### Configuration Complète
- OpenAI : ~$20-50/mois
- Google Maps : Gratuit (200$/mois offerts)
- WalletConnect : Gratuit
- Pinata : Gratuit (1GB)
- Vercel : Gratuit (Hobby) ou $20/mois (Pro)

**Total estimé** : $20-70/mois selon usage

## 📞 Support & Documentation

- **Guide OpenAI complet** : `CONFIGURATION_VERCEL_OPENAI.md`
- **Vercel Docs** : https://vercel.com/docs/environment-variables
- **OpenAI Platform** : https://platform.openai.com/
- **Support Vercel** : https://vercel.com/support

## 🚀 Déploiement Post-Configuration

```bash
# Option 1 : Auto-deploy (push Git)
git add .
git commit -m "config: add environment variables guide"
git push

# Option 2 : Vercel CLI
vercel --prod

# Option 3 : Vercel Dashboard
Dashboard → Deployments → Redeploy
```

---

**🎯 Action immédiate recommandée** : Configurer `VITE_OPENAI_API_KEY` pour activer l'IA en production.

**📖 Guide détaillé** : Voir `CONFIGURATION_VERCEL_OPENAI.md`
