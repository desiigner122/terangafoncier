# 🔄 PLAN DE MIGRATION: Mockées → Données Réelles

## 📊 ÉTAT ACTUEL

### Dashboard Vendeur - 13 Pages

| # | Page | Fichier | État | Priorité | IA | Blockchain |
|---|------|---------|------|----------|-----|-----------|
| 1 | **Vue d'ensemble** | VendeurOverviewRealData.jsx | ✅ **FAIT** | HIGH | ✅ | ✅ |
| 2 | **CRM Prospects** | VendeurCRMRealData.jsx | ✅ **FAIT** | HIGH | ✅ | ✅ |
| 3 | **Mes Propriétés** | VendeurPropertiesRealData.jsx | ✅ **FAIT** | - | ✅ | ✅ |
| 4 | **Anti-Fraude** | VendeurAntiFraude.jsx | 🔴 Mock | MED | ✅ | ✅ |
| 5 | **GPS Verification** | VendeurGPSVerification.jsx | 🔴 Mock | MED | ✅ | ✅ |
| 6 | **Services Digitaux** | VendeurServicesDigitaux.jsx | 🔴 Mock | LOW | ❌ | ✅ |
| 7 | **Ajouter Terrain** | VendeurAddTerrain.jsx | 🟢 Redirect | - | ✅ | ✅ |
| 8 | **Photos IA** | VendeurPhotos.jsx | 🔴 Mock | MED | ✅ | ❌ |
| 9 | **Analytics** | VendeurAnalyticsRealData.jsx | ✅ **FAIT** | HIGH | ✅ | ✅ |
| 10 | **IA Assistant** | VendeurAI.jsx | 🔴 Mock | HIGH | ✅ | ❌ |
| 11 | **Blockchain** | VendeurBlockchain.jsx | 🔴 Mock | HIGH | ❌ | ✅ |
| 12 | **Messages** | VendeurMessages.jsx | 🔴 Mock | MED | ❌ | ❌ |
| 13 | **Paramètres** | VendeurSettings.jsx | 🟡 Partial | LOW | ❌ | ❌ |

**Légende**:
- ✅ FAIT: Connecté à Supabase avec données réelles
- 🟢 Redirect: Redirige vers nouvelle page
- 🟡 Mock/Partial: Partiellement mocké
- 🔴 Mock: Entièrement mocké
- ⚠️ Prévu: IA/Blockchain prévu mais pas implémenté

---

## 🎯 PRIORITÉS D'IMPLÉMENTATION

### PHASE 1 - CRITIQUE (Semaine 1)
**Pages essentielles pour workflow de base**

#### 1.1 Vue d'ensemble (VendeurOverview.jsx) ⭐⭐⭐
**État actuel**: Mockée avec stats factices
**Ce qui doit être fait**:
```javascript
// Stats réelles depuis Supabase
const stats = {
  totalProperties: await countProperties(userId),
  activeProperties: await countActive(userId),
  totalViews: await sumViews(userId),
  totalRevenue: await calculateRevenue(userId),
  pendingInquiries: await countInquiries(userId, 'pending')
};

// Activités récentes
const activities = await supabase
  .from('activity_logs')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10);

// Graphiques de performance
const monthlyStats = await getMonthlyStats(userId);
```

#### 1.2 CRM Prospects (VendeurCRM.jsx) ⭐⭐⭐
**État actuel**: Liste mockée de prospects
**Ce qui doit être fait**:
```javascript
// Créer table CRM dans Supabase
CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY,
  vendor_id UUID REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id),
  name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT, -- new, contacted, negotiating, converted, lost
  source TEXT, -- website, phone, email, whatsapp
  interest_level INTEGER, -- 1-5
  budget_range JSONB,
  notes TEXT,
  last_contact TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

// Charger prospects
const { data: contacts } = await supabase
  .from('crm_contacts')
  .select(`
    *,
    properties (title, price, location)
  `)
  .eq('vendor_id', userId)
  .order('created_at', { ascending: false });

// Fonctionnalités:
- Ajouter contact
- Mettre à jour statut
- Ajouter notes
- Historique interactions
- Filtres par statut/source
- Rappels automatiques
- Intégration WhatsApp/Email
```

#### 1.3 Analytics (VendeurAnalytics.jsx) ⭐⭐⭐
**État actuel**: Graphiques mockés
**Ce qui doit être fait**:
```javascript
// Métriques par propriété
const propertyMetrics = await supabase
  .from('properties')
  .select(`
    id, title,
    views_count,
    favorites_count,
    contact_requests_count
  `)
  .eq('owner_id', userId);

// Évolution temporelle
const viewsOverTime = await supabase
  .from('property_views')
  .select('property_id, viewed_at')
  .gte('viewed_at', thirtyDaysAgo)
  .eq('properties.owner_id', userId);

// Sources de trafic
const trafficSources = await supabase
  .from('property_views')
  .select('source, count')
  .eq('properties.owner_id', userId)
  .group('source');

// Graphiques:
- Vues par jour (Line chart)
- Vues par propriété (Bar chart)
- Sources de trafic (Pie chart)
- Taux de conversion (Funnel)
- Comparaison propriétés (Radar chart)
```

---

### PHASE 2 - IMPORTANT (Semaine 2)
**Fonctionnalités avancées**

#### 2.1 IA Assistant (VendeurAI.jsx) ⭐⭐
**État actuel**: Mockée
**Ce qui doit être fait**:
```javascript
// 1. Évaluation automatique des prix
const analyzePrice = async (propertyId) => {
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();
  
  // Appel API IA (admin key)
  const { data: aiSettings } = await supabase
    .from('admin_settings')
    .select('ai_api_key, ai_api_endpoint')
    .single();
  
  const response = await fetch(aiSettings.ai_api_endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${aiSettings.ai_api_key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: 'evaluate_price',
      property: {
        surface: property.surface,
        location: property.location,
        features: property.features
      }
    })
  });
  
  const aiAnalysis = await response.json();
  
  // Sauvegarder dans DB
  await supabase
    .from('properties')
    .update({ ai_analysis: aiAnalysis })
    .eq('id', propertyId);
};

// 2. Suggestions de texte (descriptions)
const generateDescription = async (propertyData) => {
  const prompt = `Génère une description attractive pour: ${JSON.stringify(propertyData)}`;
  // Appel API IA...
  return aiDescription;
};

// 3. Optimisation photos (détection qualité)
const analyzePhotos = async (images) => {
  // Appel API Vision IA
  const quality = await aiVision.analyzeQuality(images);
  return {
    score: quality.overall,
    suggestions: quality.improvements,
    bestOrder: quality.recommendedOrder
  };
};

// 4. Chatbot IA pour questions
const aiChat = async (question, context) => {
  // Appel API conversational IA
  return aiResponse;
};

// 5. Prédiction de vente
const predictSale = async (propertyId) => {
  const historicalData = await getMarketData();
  const prediction = await ai.predict({
    propertyData,
    historicalData
  });
  return {
    likelihood: prediction.probability,
    estimatedTime: prediction.days,
    factors: prediction.keyFactors
  };
};
```

#### 2.2 Blockchain (VendeurBlockchain.jsx) ⭐⭐
**État actuel**: Mockée
**Ce qui doit être fait**:
```javascript
// 1. Connexion wallet
import { ethers } from 'ethers';

const connectWallet = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    return { provider, signer, address };
  }
  throw new Error('MetaMask non installé');
};

// 2. Smart Contract de propriété
const PropertyNFTContract = {
  address: '0x...', // Déployé sur Polygon
  abi: [
    'function mintProperty(string title, uint256 price, string location) returns (uint256)',
    'function transferProperty(uint256 tokenId, address to)',
    'function getPropertyDetails(uint256 tokenId) view returns (tuple)',
    'function verifyOwnership(uint256 tokenId) view returns (address)'
  ]
};

// 3. Créer NFT pour propriété
const createPropertyNFT = async (propertyId) => {
  const { signer } = await connectWallet();
  const contract = new ethers.Contract(
    PropertyNFTContract.address,
    PropertyNFTContract.abi,
    signer
  );
  
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();
  
  // Metadata IPFS
  const metadata = {
    name: property.title,
    description: property.description,
    image: property.images[0],
    attributes: [
      { trait_type: 'Surface', value: property.surface },
      { trait_type: 'Location', value: property.location },
      { trait_type: 'Price', value: property.price }
    ]
  };
  
  const metadataURI = await uploadToIPFS(metadata);
  
  // Mint NFT
  const tx = await contract.mintProperty(
    property.title,
    property.price,
    property.location
  );
  
  const receipt = await tx.wait();
  const tokenId = receipt.events[0].args.tokenId;
  
  // Update DB
  await supabase
    .from('properties')
    .update({
      blockchain_verified: true,
      blockchain_hash: tx.hash,
      blockchain_token_id: tokenId.toString(),
      blockchain_network: 'polygon'
    })
    .eq('id', propertyId);
  
  return { tokenId, txHash: tx.hash };
};

// 4. Dashboard blockchain
- Liste de toutes les propriétés tokenisées
- Historique des transactions blockchain
- Vérification de propriété en temps réel
- Transferts de propriété
- Événements blockchain
```

#### 2.3 Photos IA (VendeurPhotos.jsx) ⭐⭐
**État actuel**: Mockée
**Ce qui doit être fait**:
```javascript
// 1. Analyse qualité avec IA
const analyzePhotoQuality = async (imageUrl) => {
  const { data: settings } = await supabase
    .from('admin_settings')
    .select('ai_vision_key, ai_vision_endpoint')
    .single();
  
  const response = await fetch(settings.ai_vision_endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${settings.ai_vision_key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: imageUrl,
      features: ['quality', 'composition', 'lighting', 'objects']
    })
  });
  
  const analysis = await response.json();
  return {
    qualityScore: analysis.quality / 100,
    composition: analysis.composition,
    lighting: analysis.lighting,
    suggestions: [
      analysis.lighting < 70 ? 'Améliorer l\'éclairage' : null,
      analysis.composition < 70 ? 'Revoir le cadrage' : null
    ].filter(Boolean)
  };
};

// 2. Amélioration automatique
const enhancePhoto = async (imageUrl) => {
  // Appel API d'amélioration d'image
  const enhanced = await aiEnhance({
    image: imageUrl,
    enhance: ['brightness', 'contrast', 'sharpness'],
    auto: true
  });
  
  // Upload image améliorée
  const newUrl = await uploadToSupabase(enhanced.image);
  return newUrl;
};

// 3. Génération de variantes
const generateVariants = async (imageUrl) => {
  return {
    thumbnail: await resize(imageUrl, 150, 150),
    medium: await resize(imageUrl, 600, 400),
    large: await resize(imageUrl, 1200, 800),
    watermarked: await addWatermark(imageUrl, 'TerangaFoncier.com')
  };
};

// 4. Détection objets/pièces
const detectRooms = async (imageUrl) => {
  const detected = await aiVision.detectObjects(imageUrl);
  return {
    rooms: detected.filter(obj => ['bedroom', 'kitchen', 'bathroom'].includes(obj.label)),
    features: detected.filter(obj => ['pool', 'garden', 'garage'].includes(obj.label))
  };
};

// 5. Organisation intelligente
const suggestPhotoOrder = async (images) => {
  const scores = await Promise.all(
    images.map(async img => ({
      url: img,
      score: await analyzePhotoQuality(img)
    }))
  );
  
  return scores
    .sort((a, b) => b.score.qualityScore - a.score.qualityScore)
    .map(s => s.url);
};
```

#### 2.4 Anti-Fraude (VendeurAntiFraude.jsx) ⭐
**État actuel**: Mockée
**Ce qui doit être fait**:
```javascript
// 1. Scanner de documents
const scanDocument = async (documentImage) => {
  const ocrResult = await aiOCR.scan(documentImage);
  return {
    type: ocrResult.documentType, // 'titre_foncier', 'cadastre', 'id_card'
    extractedData: ocrResult.fields,
    confidence: ocrResult.confidence,
    warnings: ocrResult.anomalies
  };
};

// 2. Vérification titre foncier
const verifyTitleDeed = async (titleNumber) => {
  // Intégration API Conservation Foncière (si disponible)
  // Sinon: vérification manuelle avec marquage
  
  await supabase
    .from('property_verifications')
    .insert({
      property_id: propertyId,
      type: 'title_deed',
      reference: titleNumber,
      status: 'pending',
      requested_at: new Date()
    });
  
  return { status: 'verification_requested' };
};

// 3. Vérification GPS
const verifyGPS = async (latitude, longitude) => {
  // Vérifier coordonnées dans zone autorisée
  const isInSenegal = checkBounds(latitude, longitude, SENEGAL_BOUNDS);
  
  // Comparer avec cadastre
  const cadastralData = await getCadastralInfo(latitude, longitude);
  
  return {
    valid: isInSenegal && cadastralData.exists,
    zone: cadastralData.zone,
    restrictions: cadastralData.restrictions
  };
};

// 4. Détection fraude IA
const detectFraud = async (propertyData) => {
  const aiFraudCheck = await ai.analyzeFraud({
    price: propertyData.price,
    surface: propertyData.surface,
    location: propertyData.location,
    photos: propertyData.images,
    documents: propertyData.documents
  });
  
  return {
    fraudScore: aiFraudCheck.score, // 0-100
    warnings: aiFraudCheck.warnings,
    recommendations: aiFraudCheck.recommendations
  };
};
```

---

### PHASE 3 - AMÉLIORATIONS (Semaine 3)

#### 3.1 GPS Verification (VendeurGPSVerification.jsx) ⭐
**État actuel**: Mockée
**Ce qui doit être fait**:
```javascript
// Carte interactive avec Leaflet/Mapbox
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet';

const GPSVerificationPage = () => {
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
    loadPropertiesWithGPS();
  }, []);
  
  const loadPropertiesWithGPS = async () => {
    const { data } = await supabase
      .from('properties')
      .select('id, title, latitude, longitude, surface, verification_status')
      .eq('owner_id', userId)
      .not('latitude', 'is', null);
    
    setProperties(data);
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        {/* Liste propriétés */}
        {properties.map(p => (
          <PropertyCard 
            property={p}
            onVerify={() => requestGPSVerification(p.id)}
          />
        ))}
      </div>
      <div>
        {/* Carte */}
        <MapContainer center={[14.6937, -17.44406]} zoom={12}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {properties.map(p => (
            <Marker 
              key={p.id}
              position={[p.latitude, p.longitude]}
              eventHandlers={{
                click: () => selectProperty(p.id)
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

// Fonctionnalités:
- Affichage propriétés sur carte
- Vérification coordonnées
- Calcul surface polygone
- Superposition cadastre
- Export KML/GeoJSON
```

#### 3.2 Services Digitaux (VendeurServicesDigitaux.jsx) ⭐
**État actuel**: Mockée
**Ce qui doit être fait**:
```javascript
// 1. Signature électronique
import SignatureCanvas from 'react-signature-canvas';

const ESignature = () => {
  const sigPad = useRef();
  
  const saveSignature = async () => {
    const dataURL = sigPad.current.toDataURL();
    const { data } = await supabase.storage
      .from('signatures')
      .upload(`${userId}/${Date.now()}.png`, dataURLtoFile(dataURL));
    
    return data.path;
  };
  
  return (
    <SignatureCanvas ref={sigPad} canvasProps={{width: 500, height: 200}} />
  );
};

// 2. Visite virtuelle 360°
const VirtualTour = ({ propertyId }) => {
  const [panoramas, setPanoramas] = useState([]);
  
  // Upload photos 360
  const upload360Photo = async (file) => {
    const { data } = await supabase.storage
      .from('virtual-tours')
      .upload(`${propertyId}/${file.name}`, file);
    
    setPanoramas([...panoramas, data.path]);
  };
  
  // Affichage avec Pannellum ou React-360
  return (
    <Pannellum
      image={panoramas[0]}
      onLoad={() => console.log('Tour chargé')}
    />
  );
};

// 3. Vidéo de présentation
const PropertyVideo = ({ propertyId }) => {
  const [videoUrl, setVideoUrl] = useState('');
  
  const uploadVideo = async (file) => {
    const { data } = await supabase.storage
      .from('videos')
      .upload(`${propertyId}/${file.name}`, file);
    
    setVideoUrl(data.path);
  };
  
  return <video src={videoUrl} controls />;
};

// 4. Documents électroniques
const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  
  const uploadDocument = async (file, type) => {
    const { data } = await supabase.storage
      .from('documents')
      .upload(`${userId}/${type}/${file.name}`, file);
    
    await supabase
      .from('property_documents')
      .insert({
        property_id: propertyId,
        type: type,
        file_path: data.path,
        uploaded_at: new Date()
      });
  };
  
  return (
    <div>
      {documents.map(doc => (
        <DocumentCard doc={doc} />
      ))}
      <UploadButton onUpload={uploadDocument} />
    </div>
  );
};
```

#### 3.3 Messages (VendeurMessages.jsx) ⭐
**État actuel**: Mockée
**Ce qui doit être fait**:
```javascript
// Créer table messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID,
  sender_id UUID REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id),
  content TEXT,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  participant1_id UUID REFERENCES profiles(id),
  participant2_id UUID REFERENCES profiles(id),
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

// Charger conversations
const loadConversations = async () => {
  const { data } = await supabase
    .from('conversations')
    .select(`
      *,
      messages (content, created_at, read_at),
      properties (title, images),
      profiles!participant2_id (first_name, last_name, avatar_url)
    `)
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });
  
  return data;
};

// Temps réel avec Supabase Realtime
const subscribeToMessages = (conversationId) => {
  const subscription = supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    }, (payload) => {
      setMessages(prev => [...prev, payload.new]);
    })
    .subscribe();
  
  return () => subscription.unsubscribe();
};

// Fonctionnalités:
- Conversations en temps réel
- Notifications non lues
- Pièces jointes
- Emojis
- Recherche dans messages
- Archivage
```

#### 3.4 Paramètres (VendeurSettings.jsx) ⭐
**État actuel**: Partiellement fonctionnel
**Ce qui doit être fait**:
```javascript
// Profil complet
const updateProfile = async (data) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      address: data.address,
      avatar_url: data.avatarUrl,
      bio: data.bio,
      company_name: data.companyName,
      license_number: data.licenseNumber
    })
    .eq('id', userId);
};

// Notifications
const updateNotificationSettings = async (settings) => {
  await supabase
    .from('notification_settings')
    .upsert({
      user_id: userId,
      email_new_message: settings.emailNewMessage,
      email_new_inquiry: settings.emailNewInquiry,
      email_property_viewed: settings.emailPropertyViewed,
      sms_new_inquiry: settings.smsNewInquiry,
      push_enabled: settings.pushEnabled
    });
};

// Abonnement/Plan
const updateSubscription = async (planId) => {
  // Intégration paiement (Wave, Orange Money, etc.)
  const payment = await processPayment(planId);
  
  await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      status: 'active',
      expires_at: new Date(Date.now() + 30*24*60*60*1000)
    });
};

// Sécurité
const enable2FA = async () => {
  const secret = generateTOTPSecret();
  const qrCode = await generateQRCode(secret);
  
  await supabase
    .from('security_settings')
    .upsert({
      user_id: userId,
      two_factor_secret: secret,
      two_factor_enabled: true
    });
  
  return qrCode;
};
```

---

## 📋 CHECKLIST FINALE

### Développement
- [x] VendeurPropertiesComplete → VendeurPropertiesRealData ✅
- [x] VendeurOverview → VendeurOverviewRealData ✅
- [x] VendeurCRM → VendeurCRMRealData ✅
- [x] VendeurAnalytics → VendeurAnalyticsRealData ✅
- [ ] VendeurAI - Intégration API IA admin
- [ ] VendeurBlockchain - Smart contracts + wallet
- [ ] VendeurPhotos - IA Vision + optimisation
- [ ] VendeurAntiFraude - OCR + vérifications
- [ ] VendeurGPSVerification - Carte interactive
- [ ] VendeurServicesDigitaux - eSign + 360° + vidéo
- [ ] VendeurMessages - Realtime messaging
- [ ] VendeurSettings - Profil complet

### Base de Données
- [ ] Table `crm_contacts`
- [ ] Table `messages` + `conversations`
- [ ] Table `property_verifications`
- [ ] Table `activity_logs`
- [ ] Table `notification_settings`
- [ ] Table `security_settings`
- [ ] Table `property_documents`
- [ ] Table `property_views` (analytics)

### APIs Externes
- [ ] API IA (clé admin) - évaluation prix
- [ ] API Vision IA - analyse photos
- [ ] API OCR - scan documents
- [ ] API Blockchain - RPC nodes
- [ ] API IPFS - stockage metadata NFT
- [ ] API SMS - notifications
- [ ] API Email - notifications
- [ ] API WhatsApp - intégration

### Infrastructure
- [ ] Smart Contract déployé (Polygon)
- [ ] Buckets Storage configurés
- [ ] Realtime channels activés
- [ ] Edge Functions (si nécessaire)
- [ ] CDN pour médias

---

## 🚀 ESTIMATION TEMPS

| Phase | Durée | Effort |
|-------|-------|--------|
| Phase 1 - Critique | 5-7 jours | 40h |
| Phase 2 - Important | 5-7 jours | 40h |
| Phase 3 - Améliorations | 3-5 jours | 24h |
| **TOTAL** | **13-19 jours** | **~104h** |

---

## 📞 SUPPORT

**Email**: palaye122@gmail.com  
**Téléphone**: +221 77 593 42 41  

**Date**: 5 Octobre 2025  
**Status**: ✅ **Phase 1 TERMINÉE** (4/13 pages complétées - 31%)

## 🎉 PHASE 1 COMPLÉTÉE!

**Pages migrées avec succès:**
1. ✅ **VendeurPropertiesRealData.jsx** - Gestion propriétés avec CRUD complet
2. ✅ **VendeurOverviewRealData.jsx** - Dashboard stats temps réel avec badges IA/Blockchain
3. ✅ **VendeurCRMRealData.jsx** - CRM complet avec scoring IA et tracking interactions
4. ✅ **VendeurAnalyticsRealData.jsx** - Analytics avancées avec AI Insights

**Tables Supabase créées:**
- ✅ `crm_contacts` - Gestion prospects
- ✅ `crm_interactions` - Historique interactions
- ✅ `activity_logs` - Journal d'activité
- ✅ `property_views` - Analytics détaillés
- ✅ `messages` + `conversations` - Messagerie temps réel

**Fonctionnalités implémentées:**
- 📊 Stats dashboard temps réel (vues, conversions, revenus)
- 🧠 Scoring IA automatique des prospects (0-100)
- 🔐 Badges Blockchain pour propriétés tokenisées
- 💜 Badges IA pour propriétés optimisées
- 📈 Graphiques de performance (vues mensuelles, sources trafic)
- 🎯 AI Insights et recommandations intelligentes
- 🔄 Synchronisation en temps réel avec Supabase
- 🎨 Template moderne unifié avec animations Framer Motion
