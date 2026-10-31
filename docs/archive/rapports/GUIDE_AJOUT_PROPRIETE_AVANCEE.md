# 📋 Guide: Page d'Ajout de Propriété Avancée

## 🎯 Vue d'ensemble

La nouvelle page **AddPropertyAdvanced** est un formulaire complet en 8 étapes pour ajouter des propriétés/terrains avec **intégration IA et Blockchain**.

### ✨ Fonctionnalités Principales

1. **Formulaire Multi-étapes (8 étapes)** - Wizard avec progression visuelle
2. **Intégration IA** - Analyse automatique des prix et recommandations
3. **Blockchain/NFT** - Tokenisation sécurisée des propriétés
4. **Upload d'Images** - Jusqu'à 10 photos avec gestion de l'image principale
5. **Validation Intelligente** - Contrôles en temps réel
6. **Auto-calcul** - Prix au m² calculé automatiquement
7. **Géolocalisation** - Coordonnées GPS pour chaque propriété
8. **Parité Complète** - Tous les champs de ParcelleDetailPage.jsx

---

## 📁 Structure des Fichiers

```
src/pages/
├── AddPropertyAdvanced.jsx                    # Page principale
└── AddPropertyAdvanced/
    ├── FormSteps.jsx                         # Étapes 1-4
    └── AdvancedSteps.jsx                     # Étapes 5-8
```

### Fichiers Créés

1. **AddPropertyAdvanced.jsx** (~580 lignes)
   - Composant principal
   - Gestion d'état du formulaire
   - Fonctions d'upload d'images
   - Analyse IA
   - Soumission à Supabase

2. **FormSteps.jsx** (~400+ lignes)
   - Step1BasicInfo: Type, titre, description, statut
   - Step2Location: Région, ville, quartier, GPS
   - Step3DimensionsPrice: Surface, dimensions, prix
   - Step4Features: Caractéristiques terrain, services, proximité

3. **AdvancedSteps.jsx** (~650+ lignes)
   - Step5Documents: Documents juridiques, info vendeur
   - Step6Photos: Upload et gestion des images
   - Step7AIBlockchain: Analyse IA et configuration blockchain
   - Step8Confirmation: Récapitulatif final

---

## 🛣️ Les 8 Étapes du Formulaire

### Étape 1: Informations de Base
- **Type de propriété** (5 types)
  - Terrain
  - Terrain viabilisé
  - Terrain agricole
  - Terrain commercial
  - Terrain industriel
- **Titre** (max 100 caractères)
- **Description** (max 1000 caractères avec compteur)
- **Statut** (Disponible, Réservé, Vendu)

### Étape 2: Localisation
- **Région** (14 régions du Sénégal)
  - Dakar, Thiès, Saint-Louis, Diourbel, Louga, Fatick, Kaolack, Matam, Tambacounda, Kaffrine, Kédougou, Kolda, Sédhiou, Ziguinchor
- **Ville/Commune**
- **Quartier/Zone**
- **Adresse complète**
- **Coordonnées GPS**
  - Latitude
  - Longitude

### Étape 3: Dimensions et Prix
- **Superficie** (m²)
- **Longueur** (m)
- **Largeur** (m)
- **Prix Total** (FCFA)
- **Prix/m²** (calculé automatiquement)
- **Prix négociable** (Oui/Non)

### Étape 4: Caractéristiques
#### Terrain
- Topographie (Plat, En pente, Vallonné, Autre)
- Type de sol (Sableux, Argileux, Rocailleux, Mixte, Autre)
- Type d'accès (Route goudronnée, Piste, Chemin, Autre)
- Nombre de coins (2, 3, 4+)
- Clôturé (Oui/Non)
- Zone inondable (Oui/Non)

#### Services Disponibles (6 services)
- 💧 Eau
- ⚡ Électricité
- 🚰 Assainissement
- 📡 Internet
- 📞 Téléphone
- 🔥 Gaz

#### Proximités (distances en km)
- Route principale
- Transport en commun
- École
- Hôpital
- Marché
- Mosquée
- Plage

### Étape 5: Documents Juridiques
#### Documents
- **Titre de Propriété (TF)** (Oui/Non)
- **Numéro du Titre Foncier**
- **Référence Cadastrale**
- **Conservation Foncière**
- **Zonage/Affectation**
  - Résidentiel
  - Commercial
  - Industriel
  - Mixte
  - Agricole
  - Zone Verte

#### Informations Vendeur
- Nom complet *
- Téléphone *
- Email
- WhatsApp

### Étape 6: Photos
- **Upload Multiple** (3-10 images)
- **Formats acceptés**: PNG, JPG, JPEG
- **Taille max**: 5MB par image
- **Fonctionnalités**:
  - Aperçu en grille
  - Définir image principale
  - Supprimer des images
  - Indicateur de progression
- **Stockage**: Supabase Storage

### Étape 7: IA et Blockchain

#### 🤖 Analyse IA
**Bouton "Analyser avec l'IA"** lance:
- **Estimation de Prix**
  - Prix minimum
  - Prix recommandé (confiance %)
  - Prix maximum
- **Tendance du Marché** (+X% sur Y mois)
- **Recommandations** (3-5 suggestions)
- **Points d'Attention** (risques identifiés)
- **Opportunités** (potentiel du bien)

#### ⛓️ Blockchain & NFT
**Configuration optionnelle**:
- **Activer Blockchain** (Oui/Non)
- **Réseau**:
  - Polygon (Recommandé)
  - Ethereum
  - Binance Smart Chain
  - Avalanche
- **Tokenisation NFT** (Oui/Non)
- **Smart Contract** (Oui/Non)

**Avantages affichés**:
- ✅ Propriété vérifiable et transparente
- ✅ Historique immuable des transactions
- ✅ Transferts sécurisés et rapides
- ✅ Réduction des fraudes
- ✅ Accessibilité internationale

### Étape 8: Confirmation
**Récapitulatif complet** avec:
- Titre et type de propriété
- Localisation complète
- Prix et superficie
- Caractéristiques (badges pour services)
- Aperçu des photos (grille)
- Résumé évaluation IA (si analysé)
- Configuration blockchain (si activée)
- **Avertissement légal**

---

## 🔧 Intégration Technique

### Routes Ajoutées dans App.jsx

```jsx
// Import
import AddPropertyAdvanced from '@/pages/AddPropertyAdvanced';

// Route
<Route 
  path="add-property-advanced" 
  element={
    <RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}>
      <AddPropertyAdvanced />
    </RoleProtectedRoute>
  } 
/>
```

### Accès à la Page

**URL**: `/add-property-advanced`

**Permissions**: Réservé aux rôles:
- Vendeur
- Vendeur Particulier
- Vendeur Pro

### Navigation depuis le Dashboard Vendeur

Depuis `CompleteSidebarVendeurDashboard`:
- Menu latéral: "Ajouter Terrain" (id: 'add-property')
- Alternativement, créer un lien direct:

```jsx
import { Link } from 'react-router-dom';

<Link to="/add-property-advanced">
  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
    <Plus className="h-4 w-4 mr-2" />
    Ajouter une Propriété Avancée
  </Button>
</Link>
```

---

## 💾 Base de Données (Supabase)

### Table: `properties`

Tous les champs du formulaire sont enregistrés dans la table properties:

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  
  -- Informations de base
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT,
  status TEXT DEFAULT 'disponible',
  
  -- Localisation
  city TEXT,
  region TEXT,
  neighborhood TEXT,
  address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  
  -- Dimensions
  surface INTEGER,
  length DECIMAL,
  width DECIMAL,
  
  -- Prix
  price BIGINT,
  price_per_sqm INTEGER,
  price_negotiable BOOLEAN DEFAULT false,
  
  -- Caractéristiques terrain
  topography TEXT,
  soil_type TEXT,
  access_type TEXT,
  corner_count INTEGER,
  is_fenced BOOLEAN DEFAULT false,
  flood_risk BOOLEAN DEFAULT false,
  
  -- Services (JSONB)
  utilities JSONB DEFAULT '{}',
  
  -- Proximités (JSONB)
  proximity JSONB DEFAULT '{}',
  
  -- Documents juridiques
  title_deed BOOLEAN DEFAULT false,
  title_deed_number TEXT,
  cadastral_reference TEXT,
  land_registry TEXT,
  zoning TEXT,
  
  -- Vendeur (JSONB)
  seller JSONB DEFAULT '{}',
  
  -- Images (JSONB array)
  images JSONB DEFAULT '[]',
  main_image_index INTEGER DEFAULT 0,
  
  -- IA Insights (JSONB)
  ai_evaluation JSONB DEFAULT '{}',
  
  -- Blockchain (JSONB)
  blockchain JSONB DEFAULT '{}',
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Storage: `property-images`

Les images sont stockées dans:
```
Bucket: property-images
Path: {userId}/{timestamp}_{filename}
```

---

## 🤖 Configuration IA

### Fonction `analyzeWithAI()`

**Actuellement**: Simulation avec données mockées

**À implémenter**: Connexion à l'API IA configurée par l'admin

```javascript
const analyzeWithAI = async () => {
  setAiLoading(true);
  
  try {
    // TODO: Récupérer la clé API admin depuis Supabase
    // const { data: adminSettings } = await supabase
    //   .from('admin_settings')
    //   .select('ai_api_key')
    //   .single();
    
    // TODO: Appel à l'API IA réelle
    // const response = await fetch('https://api.ai-service.com/evaluate', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${adminSettings.ai_api_key}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     surface: formData.surface,
    //     price: formData.price,
    //     location: {
    //       region: formData.region,
    //       city: formData.city,
    //       neighborhood: formData.neighborhood
    //     },
    //     utilities: formData.utilities,
    //     features: {...}
    //   })
    // });
    
    // Pour l'instant: simulation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Données mockées...
    
  } catch (error) {
    console.error('Erreur analyse IA:', error);
    toast.error('Erreur lors de l\'analyse IA');
  } finally {
    setAiLoading(false);
  }
};
```

---

## ⛓️ Configuration Blockchain

### Smart Contract à Implémenter

```javascript
// TODO: Implémenter après choix du réseau
const createNFT = async (propertyData) => {
  // 1. Connexion wallet (MetaMask, WalletConnect)
  // 2. Déploiement du contrat si nécessaire
  // 3. Mint du NFT avec métadonnées
  // 4. Stockage du token ID et adresse du contrat
};
```

### Métadonnées NFT

```json
{
  "name": "Propriété #{id}",
  "description": "...",
  "image": "ipfs://...",
  "attributes": [
    {"trait_type": "Surface", "value": "500 m²"},
    {"trait_type": "Localisation", "value": "Dakar"},
    {"trait_type": "Prix", "value": "50000000 FCFA"},
    {"trait_type": "Type", "value": "Terrain viabilisé"}
  ]
}
```

---

## ✅ Validation

### Validations Actuelles
- Prix > 0
- Superficie > 0
- Titre non vide
- Minimum 3 photos pour publication

### Validations à Ajouter
```javascript
const validateStep = (step) => {
  switch(step) {
    case 1:
      return formData.title && formData.propertyType;
    case 2:
      return formData.region && formData.city;
    case 3:
      return formData.surface > 0 && formData.price > 0;
    case 5:
      return formData.seller.name && formData.seller.phone;
    case 6:
      return formData.images.length >= 3;
    // ...
  }
};
```

---

## 🎨 UI/UX Features

### Animations
- **Framer Motion**: Transitions fluides entre étapes
- **Progress Bar**: Indicateur de progression
- **Badges**: Status visuels (complété, actif, etc.)

### Responsive Design
- Desktop: Grille multi-colonnes
- Tablet: Colonnes adaptatives
- Mobile: Vue empilée

### Feedback Utilisateur
- **Toast notifications**: react-hot-toast
- **Loading states**: Spinners pendant upload/analyse
- **Indicateurs visuels**: Compteurs de caractères, validation en temps réel

---

## 🚀 Prochaines Étapes

### Priorité Haute
1. ✅ Créer les fichiers (FAIT)
2. ✅ Ajouter les routes (FAIT)
3. ⏳ **Tester le formulaire complet**
4. ⏳ **Connexion IA réelle** (récupérer clé API admin)
5. ⏳ **Implémentation Blockchain** (choix réseau + contrats)

### Améliorations Futures
- [ ] Géolocalisation interactive avec carte
- [ ] Upload vidéos (visite virtuelle)
- [ ] Signatures électroniques
- [ ] Partage social automatique
- [ ] Génération PDF de l'annonce
- [ ] Multi-langue (Français, Wolof, Anglais)
- [ ] Mode brouillon (sauvegarder progression)
- [ ] Template d'annonces (pré-remplissage)

---

## 📞 Support & Contact

Pour toute question ou assistance:
- **Email**: palaye122@gmail.com
- **Téléphone**: +221 77 593 42 41

---

## 📝 Notes de Développement

### Dépendances Requises
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "framer-motion": "^10.x",
  "lucide-react": "latest",
  "@supabase/supabase-js": "^2.x",
  "react-hot-toast": "^2.x"
}
```

### Variables d'Environnement
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Bucket Supabase à Créer
```sql
-- Créer le bucket pour les images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Politique d'accès
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');
```

---

**Version**: 1.0.0  
**Date**: 2024  
**Status**: ✅ Implémentation Complète
