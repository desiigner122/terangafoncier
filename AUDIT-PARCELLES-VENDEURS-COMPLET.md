# 🔍 AUDIT COMPLET - SYSTÈME DE PARCELLES VENDEURS

**Date**: 12 Octobre 2025  
**Problèmes rapportés**:
1. ❌ La parcelle ne s'affiche pas sur `/parcelles-vendeurs`
2. ❌ Page d'édition d'une parcelle ne fonctionne pas
3. ❓ Workflow d'achat depuis ParcelleDetailPage pas clair
4. ❓ RLS policies bloquent l'affichage

---

## 📋 SCOPE DE L'AUDIT

### Pages à auditer:
1. **`ParcellesVendeursPage.jsx`** - Liste publique des parcelles
2. **`ParcelleDetailPage.jsx`** - Détail d'une parcelle + demande d'achat
3. **`VendeurPropertiesRealData.jsx`** - Dashboard vendeur (liste ses biens)
4. **Page d'édition** (à identifier)

### Workflow attendu:
```
[Vendeur crée bien] 
  → [Admin approuve] 
  → [Bien visible sur /parcelles-vendeurs]
  → [Particulier voit détail] 
  → [Particulier demande achat]
  → [Notif dans dashboard vendeur]
  → [Notif dans dashboard particulier]
```

---

## 🔴 PROBLÈME 1: Parcelle invisible sur /parcelles-vendeurs

### Fichier: `src/pages/ParcellesVendeursPage.jsx`

#### ❌ Problème détecté:
**Ligne 99-460**: Utilise des **données mockées en dur** !

```javascript
const parcelles = [
  {
    id: 1,
    title: "Terrain Résidentiel - Almadies",
    location: "Almadies, Dakar",
    price: "85 000 000",
    // ... données en dur
  },
  // ... 14 autres parcelles mockées
];
```

**Aucun appel à Supabase** pour charger les vraies parcelles !

#### ✅ Solution:

```javascript
const [parcelles, setParcelles] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadParcelles();
}, []);

const loadParcelles = async () => {
  try {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        owner:profiles!owner_id(id, email, full_name),
        photos:property_photos(file_url, is_primary, display_order)
      `)
      .eq('status', 'active')              // Seulement les biens actifs
      .eq('verification_status', 'verified') // Seulement les biens vérifiés
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transformer les données pour correspondre au format attendu
    const formattedData = data.map(prop => ({
      id: prop.id,
      title: prop.title,
      location: `${prop.city}, ${prop.region}`,
      region: prop.region,
      city: prop.city,
      price: prop.price.toLocaleString('fr-FR'),
      surface: prop.surface.toString(),
      type: prop.type,
      seller: prop.owner?.full_name || 'Vendeur',
      sellerName: prop.owner?.full_name,
      sellerId: prop.owner_id,
      sellerType: 'vendeur-particulier',
      image: prop.photos?.find(p => p.is_primary)?.file_url || prop.photos?.[0]?.file_url,
      features: prop.features?.main || [],
      utilities: prop.amenities || [],
      access: prop.features?.access || [],
      rating: 4.5, // TODO: Implémenter système de notation
      views: prop.views_count,
      isFavorite: false, // TODO: Implémenter favoris
      isVerified: prop.verification_status === 'verified',
      description: prop.description
    }));

    setParcelles(formattedData);
  } catch (error) {
    console.error('Erreur chargement parcelles:', error);
    toast.error('Impossible de charger les parcelles');
  } finally {
    setLoading(false);
  }
};
```

#### 🔧 Modifications nécessaires:

1. **Import Supabase + useAuth**:
```javascript
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ParcellesVendeursPage = () => {
  const { supabase } = useAuth();
  // ...
```

2. **Ajouter état de chargement**:
```jsx
{loading ? (
  <div className="text-center py-20">
    <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
    <p className="mt-4 text-gray-600">Chargement des parcelles...</p>
  </div>
) : parcelles.length === 0 ? (
  <div className="text-center py-20">
    <Home className="h-16 w-16 mx-auto text-gray-400 mb-4" />
    <h3 className="text-xl font-semibold text-gray-700">Aucune parcelle disponible</h3>
    <p className="text-gray-500 mt-2">Revenez bientôt pour découvrir de nouvelles opportunités</p>
  </div>
) : (
  // ... grid existant
)}
```

---

## 🔴 PROBLÈME 2: Dashboard vendeur (VendeurPropertiesRealData)

### Fichier: `src/pages/dashboards/vendeur/VendeurPropertiesRealData.jsx`

#### ✅ État actuel: **DÉJÀ CONNECTÉ À SUPABASE** !

**Ligne 60-94**: Utilise Supabase correctement:
```javascript
const loadProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*, property_photos(*)')
    .eq('vendor_id', user.id) // ❌ ERREUR: devrait être owner_id
    .order('created_at', { ascending: false });
```

#### ❌ Problème détecté:
**Ligne 63**: Utilise `vendor_id` mais la colonne s'appelle `owner_id` !

#### ✅ Solution:
```javascript
.eq('owner_id', user.id)  // Correction
```

#### 🔧 Autres corrections:

**Ligne 147**: Navigation vers édition:
```javascript
onClick={() => navigate(`/dashboard/vendeur/properties/edit/${property.id}`)}
```

Vérifier que cette route existe dans `App.jsx` / `AppNew.jsx`:
```javascript
<Route path="/dashboard/vendeur/properties/edit/:id" element={<VendeurEditProperty />} />
```

---

## 🔴 PROBLÈME 3: Page d'édition manquante

### Recherche de la page d'édition:

Aucun fichier trouvé pour:
- `VendeurEditProperty.jsx`
- `EditPropertyPage.jsx`
- `PropertyEdit.jsx`

#### ✅ Solution: Créer la page d'édition

**Fichier à créer**: `src/pages/dashboards/vendeur/VendeurEditProperty.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const VendeurEditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { supabase, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  
  useEffect(() => {
    loadProperty();
  }, [id]);
  
  const loadProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id) // Vérifier que c'est bien son bien
        .single();
        
      if (error) throw error;
      
      if (!data) {
        toast.error('Bien non trouvé ou vous n\'êtes pas autorisé');
        navigate('/dashboard/vendeur/properties');
        return;
      }
      
      setProperty(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Impossible de charger le bien');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (formData) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update(formData)
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Bien mis à jour avec succès');
      navigate('/dashboard/vendeur/properties');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // TODO: Réutiliser le formulaire de VendeurAddTerrainRealData
  // en mode "édition" avec les valeurs pré-remplies
  
  return (
    <div>
      <h1>Éditer: {property?.title}</h1>
      {/* Formulaire ici */}
    </div>
  );
};

export default VendeurEditProperty;
```

---

## 🔴 PROBLÈME 4: Workflow demande d'achat

### Fichier: `src/pages/ParcelleDetailPage.jsx`

#### ✅ État actuel:
**Ligne 1050-1150**: Boutons d'action présents:
```jsx
<Button 
  size="lg" 
  className="flex-1"
  onClick={() => setShowContactModal(true)}
>
  <Phone className="mr-2 h-5 w-5" />
  Contacter le vendeur
</Button>

<Button 
  size="lg" 
  variant="outline" 
  className="flex-1"
  onClick={() => setShowOfferModal(true)}
>
  <FileText className="mr-2 h-5 w-5" />
  Faire une offre
</Button>
```

#### ❌ Problèmes détectés:

1. **Modal "Faire une offre" ne créé pas d'entrée en base**
2. **Pas de notification au vendeur**
3. **Pas de suivi dans dashboard particulier**

#### ✅ Solution: Créer table `property_offers`

```sql
CREATE TABLE property_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  offer_price NUMERIC NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, cancelled
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  response_message TEXT
);

-- RLS Policies
ALTER TABLE property_offers ENABLE ROW LEVEL SECURITY;

-- Acheteur peut voir ses propres offres
CREATE POLICY "Buyer_Can_View_Own_Offers" ON property_offers
FOR SELECT USING (auth.uid() = buyer_id);

-- Vendeur peut voir les offres sur ses biens
CREATE POLICY "Seller_Can_View_Offers_On_Properties" ON property_offers
FOR SELECT USING (auth.uid() = seller_id);

-- Acheteur peut créer une offre
CREATE POLICY "Buyer_Can_Create_Offer" ON property_offers
FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Vendeur peut mettre à jour le status
CREATE POLICY "Seller_Can_Update_Offer_Status" ON property_offers
FOR UPDATE USING (auth.uid() = seller_id);
```

#### Modifier `ParcelleDetailPage.jsx`:

```javascript
const handleSubmitOffer = async (offerData) => {
  try {
    // 1. Créer l'offre
    const { data: offer, error: offerError } = await supabase
      .from('property_offers')
      .insert({
        property_id: parcelle.id,
        buyer_id: user.id,
        seller_id: parcelle.owner_id,
        offer_price: offerData.price,
        message: offerData.message
      })
      .select()
      .single();
      
    if (offerError) throw offerError;
    
    // 2. Créer une notification pour le vendeur
    const { error: notifError } = await supabase
      .from('notifications')
      .insert({
        user_id: parcelle.owner_id,
        type: 'new_offer',
        titre: 'Nouvelle offre reçue',
        message: `${user.full_name} a fait une offre de ${offerData.price.toLocaleString()} FCFA sur ${parcelle.title}`,
        action_url: `/dashboard/vendeur/offers/${offer.id}`,
        metadata: {
          offer_id: offer.id,
          property_id: parcelle.id,
          buyer_id: user.id
        }
      });
      
    if (notifError) throw notifError;
    
    toast.success('Votre offre a été envoyée au vendeur');
    setShowOfferModal(false);
    
  } catch (error) {
    console.error('Erreur:', error);
    toast.error('Erreur lors de l\'envoi de l\'offre');
  }
};
```

---

## 📊 RÉSUMÉ DES CORRECTIONS NÉCESSAIRES

### 🔧 Fixes JavaScript:

| Fichier | Ligne | Problème | Solution |
|---------|-------|----------|----------|
| `ParcellesVendeursPage.jsx` | 99-460 | Données mockées | Remplacer par Supabase query |
| `VendeurPropertiesRealData.jsx` | 63 | `vendor_id` → `owner_id` | Corriger nom colonne |
| `ParcelleDetailPage.jsx` | 1100 | Offre ne créé pas d'entrée | Ajouter INSERT dans `property_offers` |
| **À CRÉER** | - | Page édition manquante | Créer `VendeurEditProperty.jsx` |

### 🗄️ Fixes SQL:

```sql
-- 1. Créer table des offres
CREATE TABLE property_offers (...);

-- 2. Ajouter RLS policies
CREATE POLICY ...;

-- 3. Vérifier que property_photos utilise bien file_url, is_primary, display_order
-- (déjà fait dans les corrections précédentes)
```

### 📁 Nouveaux fichiers à créer:

1. **`src/pages/dashboards/vendeur/VendeurEditProperty.jsx`** - Page d'édition
2. **`src/pages/dashboards/vendeur/VendeurOffers.jsx`** - Liste des offres reçues
3. **`src/pages/dashboards/particulier/ParticulierOffers.jsx`** - Offres envoyées

### 🔀 Routes à ajouter:

```javascript
// Dans App.jsx ou AppNew.jsx
<Route path="/dashboard/vendeur/properties/edit/:id" element={<VendeurEditProperty />} />
<Route path="/dashboard/vendeur/offers" element={<VendeurOffers />} />
<Route path="/dashboard/particulier/offers" element={<ParticulierOffers />} />
```

---

## 🎯 PLAN D'ACTION PRIORITAIRE

### Phase 1: Fix affichage parcelles (30 min)
1. ✅ Corriger `ParcellesVendeursPage.jsx` → Supabase query
2. ✅ Corriger `VendeurPropertiesRealData.jsx` → `owner_id`
3. ✅ Tester avec le bien d'Heritage Fall

### Phase 2: Créer page édition (1h)
1. ✅ Créer `VendeurEditProperty.jsx`
2. ✅ Ajouter route dans App
3. ✅ Tester édition d'un bien

### Phase 3: Workflow offres (2h)
1. ✅ Créer table `property_offers` (SQL)
2. ✅ Modifier `ParcelleDetailPage.jsx` → INSERT offre
3. ✅ Créer `VendeurOffers.jsx` → Liste offres
4. ✅ Créer `ParticulierOffers.jsx` → Suivi offres
5. ✅ Tester workflow complet

### Phase 4: Polish & Tests (1h)
1. ✅ Ajouter validations
2. ✅ Améliorer UX (loading, errors)
3. ✅ Tester RLS policies
4. ✅ Documentation

---

**Temps total estimé**: ~4-5 heures  
**Priorité**: 🔴 URGENT (bloque l'utilisation du site)

---

📄 **Document créé le**: 12 Octobre 2025  
📝 **Par**: GitHub Copilot  
🎯 **Objectif**: Débloquer système de parcelles vendeurs
