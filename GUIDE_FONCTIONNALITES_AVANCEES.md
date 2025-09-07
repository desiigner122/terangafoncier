# Guide de Configuration des Fonctionnalités Avancées

## 🚀 Teranga Foncier - Fonctionnalités Avancées

Ce guide vous explique comment configurer et utiliser les nouvelles fonctionnalités avancées de Teranga Foncier.

## 📦 Packages Installés

### Blockchain & Web3
- `ethers@^6.8.0` - Interactions avec Ethereum
- `web3@^4.2.0` - Client Web3 complet
- `crypto-js@^4.2.0` - Chiffrement et hachage

### Intelligence Artificielle
- `brain.js@^1.6.1` - Réseaux de neurones JavaScript
- `@tensorflow/tfjs@^4.20.0` - Machine Learning dans le navigateur
- `natural@^6.8.0` - Traitement du langage naturel

### Sécurité & Authentification
- `jsonwebtoken@^9.0.2` - Tokens JWT
- `bcryptjs@^2.4.3` - Hachage de mots de passe

### Communication
- `socket.io-client@^4.7.0` - WebSockets temps réel
- `uuid@^9.0.1` - Génération d'identifiants uniques

## ⚙️ Configuration

### 1. Variables d'Environnement Blockchain

Copiez le fichier `.env.blockchain` vers `.env.local` et configurez vos clés :

```bash
# Configuration Blockchain
VITE_BLOCKCHAIN_NETWORK=polygon
VITE_INFURA_PROJECT_ID=votre_projet_infura
VITE_ALCHEMY_API_KEY=votre_cle_alchemy
VITE_CONTRACT_ADDRESS=adresse_de_votre_contrat

# Configuration IA
VITE_OPENAI_API_KEY=votre_cle_openai
VITE_HUGGINGFACE_API_KEY=votre_cle_huggingface

# Configuration Sécurité
VITE_JWT_SECRET=votre_secret_jwt_ultra_securise
VITE_ENCRYPTION_KEY=votre_cle_de_chiffrement

# Configuration Analytics
VITE_ANALYTICS_ENDPOINT=https://votre-endpoint-analytics.com
VITE_WEBSOCKET_URL=wss://votre-websocket.com
```

### 2. Configuration des Smart Contracts

```javascript
// src/lib/blockchain/smartContracts.js
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const CONTRACT_ABI = [
  // Votre ABI de contrat ici
];

export const getContract = () => {
  const provider = new ethers.JsonRpcProvider('https://polygon-rpc.com');
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};
```

### 3. Configuration IA

```javascript
// src/lib/ai/aiConfig.js
export const AI_CONFIG = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: 'gpt-3.5-turbo'
  },
  huggingface: {
    apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY,
    model: 'microsoft/DialoGPT-medium'
  }
};
```

## 🧪 Fonctionnalités Disponibles

### 1. Chatbot IA Avancé
- Traitement du langage naturel
- Recommandations personnalisées
- Support multilingue (Français, Wolof)
- Intégration contextuelle

**Utilisation :**
```jsx
import AdvancedAIChatbot from '@/components/advanced/AdvancedAIChatbot';

<AdvancedAIChatbot />
```

### 2. Analytics Blockchain
- Métriques en temps réel
- Suivi des transactions
- Analyse de performance
- Tableaux de bord interactifs

**Utilisation :**
```jsx
import BlockchainAnalytics from '@/components/advanced/BlockchainAnalytics';

<BlockchainAnalytics />
```

### 3. Smart Contracts
- Déploiement automatique
- Exécution sécurisée
- Gestion des événements
- Interface simplifiée

**Utilisation :**
```javascript
import { deployContract, executeContract } from '@/lib/blockchain/smartContracts';

// Déployer un contrat
const contract = await deployContract(contractData);

// Exécuter une fonction
const result = await executeContract(contractAddress, 'functionName', params);
```

### 4. Gestion des Tokens
- Création de tokens de propriété
- Transferts sécurisés
- Historique complet
- Validation blockchain

**Utilisation :**
```javascript
import { createPropertyToken, transferToken } from '@/lib/blockchain/tokenManager';

// Créer un token de propriété
const token = await createPropertyToken(propertyData);

// Transférer un token
await transferToken(tokenId, fromAddress, toAddress);
```

## 🔧 Composants Intégrés

### Widget Compact
```jsx
import AdvancedFeaturesWidget from '@/components/advanced/AdvancedFeaturesWidget';

<AdvancedFeaturesWidget compact={true} />
```

### Widget Complet
```jsx
<AdvancedFeaturesWidget 
  showChatbot={true} 
  showAnalytics={true} 
  compact={false} 
/>
```

## 🛡️ Sécurité

### Bonnes Pratiques
1. **Clés API** : Stockez toujours vos clés dans `.env.local`
2. **Validation** : Validez toutes les entrées utilisateur
3. **Chiffrement** : Utilisez le chiffrement pour les données sensibles
4. **Audit** : Loggez toutes les transactions importantes

### Chiffrement des Données
```javascript
import CryptoJS from 'crypto-js';

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.VITE_ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.VITE_ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
```

## 📊 Monitoring & Analytics

### WebSocket en Temps Réel
```javascript
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_WEBSOCKET_URL);

socket.on('blockchain-event', (data) => {
  console.log('Nouvel événement blockchain:', data);
});
```

### Métriques Personnalisées
```javascript
import { trackEvent } from '@/lib/analytics';

trackEvent('property-tokenized', {
  propertyId: 'prop_123',
  tokenValue: 1000000,
  timestamp: Date.now()
});
```

## 🚀 Déploiement

### Variables de Production
```bash
# .env.production
VITE_BLOCKCHAIN_NETWORK=mainnet
VITE_API_URL=https://api.terangafoncier.com
VITE_WEBSOCKET_URL=wss://ws.terangafoncier.com
```

### Build de Production
```bash
npm run build
```

## 📚 Documentation API

### Endpoints Blockchain
- `GET /api/blockchain/stats` - Statistiques blockchain
- `POST /api/blockchain/deploy` - Déployer un contrat
- `GET /api/tokens/:id` - Détails d'un token

### Endpoints IA
- `POST /api/ai/chat` - Chat avec l'IA
- `GET /api/ai/recommendations` - Recommandations
- `POST /api/ai/analyze` - Analyse de données

## 🆘 Support

Pour toute question ou problème :
1. Consultez les logs de développement
2. Vérifiez la configuration des variables d'environnement
3. Testez la connectivité blockchain
4. Contactez l'équipe technique

## 🎯 Prochaines Étapes

1. **Configuration personnalisée** : Adaptez selon vos besoins
2. **Tests approfondis** : Testez toutes les fonctionnalités
3. **Optimisation** : Optimisez les performances
4. **Formation équipe** : Formez votre équipe aux nouvelles fonctionnalités

---

**Status** : ✅ Installation réussie - 155 packages installés
**Version** : 2.0.0 Advanced
**Date** : $(date)
