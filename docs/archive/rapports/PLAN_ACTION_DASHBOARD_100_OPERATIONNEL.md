# 🚀 PLAN D'ACTION COMPLET - DASHBOARD VENDEUR 100% FONCTIONNEL
## Transformation de 60% mockup → 100% opérationnel

*Date: 7 Octobre 2025*  
*Durée estimée: 5-7 jours*  
*Objectif: Zéro simulation, zéro mockup, 100% production-ready*

---

## 📊 ÉTAT ACTUEL VS OBJECTIF

### Actuellement (60% fonctionnel)
```
✅ CRUD Propriétés Supabase (100%)
✅ CRM Prospects Supabase (100%)
✅ Analytics Charts.js (100%)
❌ IA: Analyses simulées (0%)
❌ Blockchain: Transactions mockées (0%)
❌ Anti-Fraude: OCR simulé (0%)
⚠️ GPS: Liens externes seulement (30%)
⚠️ Services: Fonctions incomplètes (40%)
✅ Messages: Supabase real-time (90%)
✅ Photos: Upload OK (80%)
```

### Objectif (100% fonctionnel)
```
✅ CRUD Propriétés (100%)
✅ CRM Prospects (100%)
✅ Analytics (100%)
✅ IA: OpenAI GPT-4 intégré (100%)
✅ Blockchain: Smart contracts déployés (100%)
✅ Anti-Fraude: OCR + APIs réelles (100%)
✅ GPS: Maps intégrées + géoloc (100%)
✅ Services: Signature + 360° + vidéo (100%)
✅ Messages: Real-time complet (100%)
✅ Photos: IA analysis réelle (100%)
```

---

## 🔴 PHASE 1 : INTÉGRATION IA RÉELLE (2 jours)

### Jour 1 : Configuration OpenAI

#### A. Setup Backend API
```bash
# 1. Installer dépendances
npm install openai

# 2. Créer service IA
mkdir -p src/services/ai
touch src/services/ai/openaiService.js
```

**Fichier: `src/services/ai/openaiService.js`**
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Pour dev, à déplacer en backend en prod
});

export const analyzePropertyPrice = async (property) => {
  const prompt = `Tu es un expert immobilier au Sénégal. Analyse cette propriété et suggère un prix optimal:

Propriété:
- Type: ${property.property_type}
- Surface: ${property.surface}m²
- Localisation: ${property.location}, ${property.city}
- Prix actuel: ${property.price} FCFA

Fournis une analyse JSON avec:
{
  "suggested_price": number,
  "confidence": number (0-100),
  "market_analysis": string,
  "strengths": string[],
  "recommendations": string[]
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  const analysis = JSON.parse(response.choices[0].message.content);
  
  return {
    ...analysis,
    tokens_used: response.usage.total_tokens,
    cost_usd: (response.usage.total_tokens / 1000) * 0.01 // GPT-4 pricing
  };
};

export const generateDescription = async (property) => {
  const prompt = `Génère 3 descriptions immobilières professionnelles pour:

${property.property_type} de ${property.surface}m² à ${property.city}
Prix: ${property.price} FCFA

Retourne JSON:
{
  "short": "Description courte SEO (50 mots)",
  "medium": "Description détaillée (150 mots)",
  "premium": "Description haut de gamme (200 mots)"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

export const chatWithAI = async (messages, context = {}) => {
  const systemPrompt = `Tu es un assistant immobilier IA pour TerangaFoncier au Sénégal.
Tu aides les vendeurs à optimiser leurs annonces, comprendre le marché, et gérer leurs clients.

Contexte vendeur:
- Propriétés actives: ${context.activeProperties || 0}
- Total vues: ${context.totalViews || 0}
- Demandes: ${context.totalInquiries || 0}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: systemPrompt },
      ...messages
    ],
    temperature: 0.8,
    max_tokens: 500
  });

  return response.choices[0].message.content;
};
```

#### B. Mise à jour VendeurAIRealData.jsx

**Remplacer les fonctions simulées par:**
```javascript
import { analyzePropertyPrice, generateDescription, chatWithAI } from '@/services/ai/openaiService';

const analyzePrice = async () => {
  if (!selectedProperty) {
    toast.error('Sélectionnez une propriété');
    return;
  }

  setAnalyzing(true);
  try {
    const property = properties.find(p => p.id === selectedProperty);
    
    // ✅ APPEL IA RÉEL
    const result = await analyzePropertyPrice(property);

    // Enregistrer en DB
    const { error } = await supabase
      .from('ai_analyses')
      .insert({
        property_id: selectedProperty,
        vendor_id: user.id,
        analysis_type: 'price_suggestion',
        input_data: { ...property },
        output_data: result,
        confidence_score: result.confidence,
        tokens_used: result.tokens_used,
        cost_usd: result.cost_usd,
        model_used: 'gpt-4-turbo',
        status: 'completed'
      });

    if (error) throw error;
    
    toast.success(`✅ Analyse terminée! Prix suggéré: ${result.suggested_price.toLocaleString()} FCFA`);
    await loadData();
  } catch (error) {
    console.error('Erreur:', error);
    toast.error(error.message || 'Erreur analyse IA');
  } finally {
    setAnalyzing(false);
  }
};

const handleSendMessage = async () => {
  if (!chatInput.trim()) return;

  setSendingMessage(true);
  try {
    const newMessage = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    setChatInput('');

    // ✅ APPEL CHATBOT RÉEL
    const aiResponse = await chatWithAI(updatedMessages, {
      activeProperties: properties.filter(p => p.status === 'active').length,
      totalViews: properties.reduce((sum, p) => sum + (p.views_count || 0), 0),
      totalInquiries: properties.reduce((sum, p) => sum + (p.contact_requests_count || 0), 0)
    });

    setChatMessages([...updatedMessages, { role: 'assistant', content: aiResponse }]);

    // Sauvegarder conversation
    await supabase.from('ai_chat_sessions').insert({
      vendor_id: user.id,
      session_id: sessionId,
      messages: [...updatedMessages, { role: 'assistant', content: aiResponse }]
    });

  } catch (error) {
    console.error('Erreur chat:', error);
    toast.error('Erreur chatbot IA');
  } finally {
    setSendingMessage(false);
  }
};
```

#### C. Variables d'environnement

**Fichier: `.env`**
```env
VITE_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxx
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Jour 2 : Tests et Optimisation IA

- [ ] Tester analyse prix sur 10 propriétés
- [ ] Vérifier génération descriptions
- [ ] Tester chatbot avec 20 questions
- [ ] Optimiser prompts pour meilleurs résultats
- [ ] Ajouter gestion erreurs (rate limits, timeouts)
- [ ] Implémenter cache pour réduire coûts
- [ ] Dashboard coûts tokens en temps réel

---

## ⛓️ PHASE 2 : INTÉGRATION BLOCKCHAIN RÉELLE (2 jours)

### Jour 3 : Smart Contracts + Web3

#### A. Installation dépendances
```bash
npm install ethers wagmi@latest viem@latest @rainbow-me/rainbowkit
```

#### B. Smart Contract (Solidity)

**Fichier: `contracts/TerangaPropertyNFT.sol`**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TerangaPropertyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    
    struct PropertyData {
        string title;
        string location;
        uint256 price;
        uint256 surface;
        uint256 mintDate;
        address vendor;
    }
    
    mapping(uint256 => PropertyData) public properties;
    
    event PropertyMinted(uint256 indexed tokenId, address indexed vendor, string title);
    
    constructor() ERC721("TerangaProperty", "TERA") Ownable(msg.sender) {}
    
    function mintProperty(
        string memory title,
        string memory location,
        uint256 price,
        uint256 surface,
        string memory tokenURI
    ) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        properties[newTokenId] = PropertyData({
            title: title,
            location: location,
            price: price,
            surface: surface,
            mintDate: block.timestamp,
            vendor: msg.sender
        });
        
        emit PropertyMinted(newTokenId, msg.sender, title);
        
        return newTokenId;
    }
    
    function getProperty(uint256 tokenId) public view returns (PropertyData memory) {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        return properties[tokenId];
    }
}
```

#### C. Configuration Wagmi + RainbowKit

**Fichier: `src/config/wagmiConfig.js`**
```javascript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon, polygonAmoy } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'TerangaFoncier',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [polygon, polygonAmoy],
  ssr: false,
});
```

**Fichier: `src/main.jsx`** (Wrapper App)
```javascript
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from './config/wagmiConfig';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
```

#### D. Service Blockchain

**Fichier: `src/services/blockchain/blockchainService.js`**
```javascript
import { ethers } from 'ethers';
import { writeContract, waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/config/wagmiConfig';
import TerangaPropertyNFT from '../../../contracts/TerangaPropertyNFT.json'; // ABI

const CONTRACT_ADDRESS = '0x...'; // Déployer sur Polygon

export const mintPropertyNFT = async (property, walletClient) => {
  try {
    // 1. Upload metadata to IPFS
    const metadata = {
      name: property.title,
      description: `Property NFT for ${property.title}`,
      image: property.images?.[0] || '',
      attributes: [
        { trait_type: 'Location', value: property.location },
        { trait_type: 'Surface', value: property.surface },
        { trait_type: 'Price', value: property.price },
        { trait_type: 'Type', value: property.property_type }
      ]
    };

    const ipfsResponse = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
      },
      body: JSON.stringify(metadata)
    });

    const { IpfsHash } = await ipfsResponse.json();
    const tokenURI = `ipfs://${IpfsHash}`;

    // 2. Mint NFT on-chain
    const hash = await writeContract(config, {
      address: CONTRACT_ADDRESS,
      abi: TerangaPropertyNFT.abi,
      functionName: 'mintProperty',
      args: [
        property.title,
        property.location,
        BigInt(property.price),
        BigInt(property.surface),
        tokenURI
      ]
    });

    // 3. Wait for confirmation
    const receipt = await waitForTransactionReceipt(config, { hash });

    return {
      success: true,
      txHash: receipt.transactionHash,
      tokenId: receipt.logs[0]?.topics[3], // Extract tokenId from event
      tokenURI,
      blockNumber: receipt.blockNumber
    };

  } catch (error) {
    console.error('Mint error:', error);
    throw new Error(error.message);
  }
};
```

### Jour 4 : Intégration UI Blockchain

**Mise à jour `VendeurBlockchainRealData.jsx`:**
```javascript
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { mintPropertyNFT } from '@/services/blockchain/blockchainService';

const VendeurBlockchainRealData = () => {
  const { address, isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);

  const handleMintNFT = async (propertyId) => {
    if (!isConnected) {
      toast.error('Connectez votre wallet d\'abord');
      return;
    }

    setIsMinting(true);
    try {
      const property = properties.find(p => p.id === propertyId);
      
      // ✅ MINT NFT RÉEL
      const result = await mintPropertyNFT(property, address);

      // Enregistrer en DB
      await supabase.from('blockchain_certificates').insert({
        vendor_id: user.id,
        property_id: propertyId,
        token_id: result.tokenId,
        token_standard: 'ERC-721',
        blockchain_network: 'Polygon',
        contract_address: CONTRACT_ADDRESS,
        transaction_hash: result.txHash,
        token_uri: result.tokenURI,
        block_number: result.blockNumber,
        mint_date: new Date().toISOString(),
        status: 'active',
        minter_address: address
      });

      toast.success(`✅ NFT minté! TX: ${result.txHash.slice(0, 10)}...`);
      loadBlockchainData();
    } catch (error) {
      console.error(error);
      toast.error(`❌ Erreur: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div>
      {/* Wallet Connect Button */}
      <div className="flex justify-end mb-4">
        <ConnectButton />
      </div>

      {/* Rest of UI... */}
    </div>
  );
};
```

**Checklist Blockchain:**
- [ ] Déployer smart contract sur Polygon Amoy (testnet)
- [ ] Configurer Pinata IPFS
- [ ] Tester minting avec MetaMask
- [ ] Vérifier transaction sur PolygonScan
- [ ] QR Code pointe vers explorer
- [ ] Déployer sur Polygon Mainnet

---

## 🛡️ PHASE 3 : ANTI-FRAUDE RÉEL (1 jour)

### Jour 5 : OCR + Validation

#### A. OCR avec Tesseract.js
```bash
npm install tesseract.js
```

**Service OCR:**
```javascript
import Tesseract from 'tesseract.js';

export const scanDocument = async (imageFile) => {
  const { data: { text, confidence } } = await Tesseract.recognize(
    imageFile,
    'fra', // Français
    {
      logger: m => console.log(m)
    }
  );

  // Extraction données titre foncier
  const tfRegex = /TF\s*N°\s*(\d+)/i;
  const dateRegex = /(\d{2}\/\d{2}\/\d{4})/g;
  
  const tfNumber = text.match(tfRegex)?.[1];
  const dates = text.match(dateRegex);

  return {
    text,
    confidence,
    tfNumber,
    dates,
    authentic: confidence > 80 && tfNumber !== null
  };
};
```

#### B. Validation DGID (API Gouvernementale)
```javascript
export const validateWithDGID = async (tfNumber) => {
  // TODO: Remplacer par vraie API DGID quand disponible
  const response = await fetch(`https://api.dgid.sn/validate-title/${tfNumber}`, {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_DGID_API_KEY}`
    }
  });

  return await response.json();
};
```

---

## 🗺️ PHASE 4 : GPS MAPS RÉEL (1 jour)

### Jour 6 : Google Maps / Mapbox

#### A. Installation
```bash
npm install @vis.gl/react-google-maps
# OU
npm install react-map-gl mapbox-gl
```

#### B. Composant Carte
```javascript
import { Map, Marker, Polygon } from '@vis.gl/react-google-maps';

const PropertyMap = ({ property, coordinates }) => {
  return (
    <Map
      defaultCenter={{ lat: coordinates.latitude, lng: coordinates.longitude }}
      defaultZoom={15}
      mapId="VOTRE_MAP_ID"
    >
      <Marker position={{ lat: coordinates.latitude, lng: coordinates.longitude }} />
      {coordinates.boundary_polygon && (
        <Polygon
          paths={coordinates.boundary_polygon}
          strokeColor="#FF0000"
          fillColor="#FF0000"
          fillOpacity={0.2}
        />
      )}
    </Map>
  );
};
```

**Variables env:**
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
```

---

## 📄 PHASE 5 : SERVICES DIGITAUX (1 jour)

### Jour 7 : Signature + 360° + Vidéo

#### A. Signature Électronique (DocuSign)
```bash
npm install docusign-esign
```

#### B. Visites 360° (Matterport / Upload Cloudinary)
```javascript
export const upload360Video = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'teranga_360');

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
    { method: 'POST', body: formData }
  );

  return await response.json();
};
```

#### C. Vidéoconférence (Twilio / Agora)
```bash
npm install agora-rtc-sdk-ng
```

---

## ✅ VALIDATION FINALE

### Checklist Complète (100%)

#### IA ✅
- [ ] OpenAI API configurée
- [ ] Analyse prix retourne GPT-4 réponse
- [ ] Chatbot répond en temps réel
- [ ] Génération descriptions variées
- [ ] Coûts tokens trackés

#### Blockchain ✅
- [ ] Smart contract déployé sur Polygon
- [ ] Wallet MetaMask connecté
- [ ] NFT minté on-chain
- [ ] Transaction visible sur PolygonScan
- [ ] QR Code vérifié
- [ ] IPFS metadata accessible

#### Anti-Fraude ✅
- [ ] OCR extrait TF number
- [ ] Validation DGID API
- [ ] Score confiance calculé
- [ ] Alertes détectées

#### GPS ✅
- [ ] Google Maps intégrée
- [ ] Marqueur propriété affiché
- [ ] Polygone boundaries dessiné
- [ ] Géolocalisation précise

#### Services ✅
- [ ] Signature DocuSign envoyée
- [ ] Visite 360° uploadée
- [ ] Vidéoconférence démarre

---

## 📈 RÉSULTAT FINAL

**Avant**: 60% fonctionnel (mockups)
**Après**: **100% OPÉRATIONNEL** ✅

- ✅ IA: OpenAI GPT-4 intégré
- ✅ Blockchain: Smart contracts + NFT réels
- ✅ Anti-Fraude: OCR + validation DGID
- ✅ GPS: Maps intégrées
- ✅ Services: Signature + 360° + vidéo
- ✅ Messages: Real-time Supabase
- ✅ Photos: Upload + compression
- ✅ Analytics: Charts.js
- ✅ CRM: CRUD complet
- ✅ Properties: CRUD complet

**Dashboard vendeur 100% prêt pour production ! 🚀**

