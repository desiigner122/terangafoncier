# 🔍 AUDIT COMPLET - SYSTÈME DE PARCELLES VENDEURS

**Date**: 13 octobre 2025  
**Objectif**: Résoudre les 4 problèmes critiques du système de parcelles

---

## 🚨 PROBLÈMES IDENTIFIÉS

### 1️⃣ Parcelle invisible sur `/parcelles-vendeurs`
**Status**: ❌ CRITIQUE  
**Description**: Le bien créé (ID: `9a2dce41-8e2c-4888-b3d8-0dce41339b5a`) n'apparaît pas sur la page liste

### 2️⃣ Page d'édition ne fonctionne pas
**Status**: ❌ BLOQUANT  
**Route**: `/parcelles/:id/edit`

### 3️⃣ Page détail parcelle incorrecte
**Status**: ⚠️ URGENT  
**Route**: `/parcelles/:id`

### 4️⃣ Workflow demande d'achat manquant
**Status**: ⚠️ IMPORTANT  
**Description**: Aucun système pour qu'un particulier lance une demande d'achat

---

## 📊 ANALYSE TECHNIQUE

### **ParcellesVendeursPage.jsx** - Page Liste

#### ❌ Problème Principal: DONNÉES MOCKÉES

```javascript
// Ligne 93-430: Données hardcodées dans le composant
const parcelles = [
  {
    id: 1,
    title: "Terrain Résidentiel Premium - Almadies",
    // ... données mockées
  },
  // ... 9 autres parcelles mockées
];
```

**Impact**:
- ✅ La page charge les données mockées
- ❌ Aucune connexion à Supabase
- ❌ Les vraies propriétés dans la DB ne sont PAS affichées
- ❌ Le bien de Heritage Fall (ID: `9a2dce41...`) est invisible

#### 🔧 Solution Requise

```javascript
// REMPLACER par:
const [parcelles, setParcelles] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:owner_id (
            id,
            full_name,
            email
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mapper les données DB vers le format attendu
      const mapped = data.map(prop => ({
        id: prop.id,
        title: prop.title,
        location: prop.location,
        region: prop.region,
        city: prop.city,
        price: prop.price?.toString(),
        surface: prop.surface?.toString(),
        type: prop.property_type,
        seller: prop.profiles?.full_name || 'Vendeur',
        image: prop.images?.[0] || '/placeholder.jpg',
        // ... mapper autres champs
      }));

      setParcelles(mapped);
    } catch (error) {
      console.error('Erreur chargement parcelles:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
}, []);
```

---

### **Route `/parcelles/:id/edit`** - Page Édition

#### 🔍 Vérification Routes

```javascript
// src/App.jsx ligne 426
<Route path="parcelles/:id/edit" element={
  <RoleProtectedRoute allowedRoles={['Vendeur', 'Vendeur Particulier', 'Vendeur Pro']}>
    <EditParcelPage />
  </RoleProtectedRoute>
} />
```

#### ❌ Problèmes Détectés

1. **Fichier manquant ou incorrect**
   - Besoin de vérifier si `EditParcelPage.jsx` existe
   - Vérifier qu'il charge les vraies données depuis Supabase

2. **Mapping colonnes DB**
   - La DB utilise: `property_type`, `verification_status`, `owner_id`
   - Le code peut utiliser d'autres noms

#### 📋 Audit Requis

```javascript
// Fichier: src/pages/EditParcelPage.jsx (à vérifier)

// Doit contenir:
useEffect(() => {
  const loadProperty = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .eq('owner_id', user.id) // Sécurité: seulement ses biens
      .single();
      
    if (data) {
      // Populate form avec data
    }
  };
}, [id]);

const handleUpdate = async (formData) => {
  await supabase
    .from('properties')
    .update({
      title: formData.title,
      description: formData.description,
      price: formData.price,
      // ... tous les champs modifiés
    })
    .eq('id', id)
    .eq('owner_id', user.id);
};
```

---

### **Route `/parcelles/:id`** - Page Détail

#### 🔍 Fichier: `ParcelleDetailPage.jsx`

**Analyse nécessaire**:
1. Vérifie-t-il les données depuis Supabase ?
2. Affiche-t-il les bonnes colonnes ?
3. Le bouton "Demande d'achat" existe-t-il ?

#### 📋 Structure Attendue

```javascript
// Doit avoir:
const [property, setProperty] = useState(null);

useEffect(() => {
  const fetchProperty = async () => {
    const { data } = await supabase
      .from('properties')
      .select(`
        *,
        profiles:owner_id (full_name, email),
        property_photos (file_url, is_primary, display_order)
      `)
      .eq('id', id)
      .single();
      
    setProperty(data);
  };
}, [id]);
```

---

### **Workflow Demande d'Achat** - Fonctionnalité Manquante

#### 🎯 Workflow Complet Requis

```
┌──────────────────┐
│  Particulier     │
│  voit parcelle   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Clique         │
│  "Demande       │
│  d'achat"       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Formulaire     │
│  - Nom          │
│  - Email        │
│  - Téléphone    │
│  - Message      │
│  - Financement? │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Création       │
│  dans table     │
│  purchase_      │
│  requests       │
└────────┬─────────┘
         │
         ├────────────────────────┐
         │                        │
         ▼                        ▼
┌──────────────────┐    ┌──────────────────┐
│  Notification   │    │  Email au       │
│  → Vendeur      │    │  vendeur        │
│  Dashboard      │    │                 │
└─────────────────┘    └─────────────────┘
         │                        │
         ▼                        ▼
┌──────────────────┐    ┌──────────────────┐
│  Notification   │    │  Email à        │
│  → Admin        │    │  l'admin        │
│  Dashboard      │    │                 │
└─────────────────┘    └─────────────────┘
```

#### 📊 Table BDD Requise

```sql
CREATE TABLE IF NOT EXISTS purchase_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id),
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(50),
  message TEXT,
  financing_type VARCHAR(50), -- 'bancaire', 'cash', 'crypto', 'echelonne'
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, negotiating
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_purchase_requests_property ON purchase_requests(property_id);
CREATE INDEX idx_purchase_requests_buyer ON purchase_requests(buyer_id);
CREATE INDEX idx_purchase_requests_status ON purchase_requests(status);
```

#### 🔧 Composant à Créer

**Fichier**: `src/components/purchase/PurchaseRequestModal.jsx`

```javascript
import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'sonner';

export const PurchaseRequestModal = ({ property, open, onClose }) => {
  const [formData, setFormData] = useState({
    buyer_name: '',
    buyer_email: '',
    buyer_phone: '',
    message: '',
    financing_type: 'bancaire'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Créer la demande
      const { data: request, error } = await supabase
        .from('purchase_requests')
        .insert({
          property_id: property.id,
          buyer_id: user?.id,
          ...formData
        })
        .select()
        .single();

      if (error) throw error;

      // 2. Notifier le vendeur
      await supabase
        .from('notifications')
        .insert({
          user_id: property.owner_id,
          type: 'purchase_request',
          titre: `Nouvelle demande d'achat - ${property.title}`,
          message: `${formData.buyer_name} souhaite acheter votre bien`,
          action_url: `/dashboard/vendeur/requests/${request.id}`,
          is_read: false
        });

      // 3. Notifier l'admin
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .single();

      if (adminProfile) {
        await supabase
          .from('admin_notifications')
          .insert({
            admin_id: adminProfile.id,
            type: 'purchase_request',
            titre: `Demande d'achat - ${property.title}`,
            message: `Nouvelle demande de ${formData.buyer_name}`,
            read: false
          });
      }

      toast.success('Demande envoyée avec succès !');
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demande d'achat - {property.title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Votre nom"
            value={formData.buyer_name}
            onChange={(e) => setFormData({...formData, buyer_name: e.target.value})}
            required
          />
          
          <Input
            type="email"
            placeholder="Email"
            value={formData.buyer_email}
            onChange={(e) => setFormData({...formData, buyer_email: e.target.value})}
            required
          />
          
          <Input
            type="tel"
            placeholder="Téléphone"
            value={formData.buyer_phone}
            onChange={(e) => setFormData({...formData, buyer_phone: e.target.value})}
          />
          
          <Select
            value={formData.financing_type}
            onValueChange={(value) => setFormData({...formData, financing_type: value})}
          >
            <SelectItem value="bancaire">Financement bancaire</SelectItem>
            <SelectItem value="cash">Paiement cash</SelectItem>
            <SelectItem value="crypto">Crypto-monnaie</SelectItem>
            <SelectItem value="echelonne">Paiement échelonné</SelectItem>
          </Select>
          
          <Textarea
            placeholder="Message au vendeur"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            rows={4}
          />
          
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Envoi...' : 'Envoyer la demande'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 🎯 PLAN D'ACTION PRIORISÉ

### Phase 1: URGENCE (Aujourd'hui)

**1.1 Connecter ParcellesVendeursPage à Supabase**
- [ ] Remplacer données mockées par fetch depuis `properties`
- [ ] Mapper correctement les colonnes DB
- [ ] Tester que le bien de Heritage Fall apparaît
- **Temps estimé**: 30 min

**1.2 Vérifier/Corriger EditParcelPage**
- [ ] Localiser le fichier
- [ ] Vérifier qu'il charge depuis Supabase
- [ ] Tester la modification d'un bien
- **Temps estimé**: 45 min

### Phase 2: IMPORTANT (Demain)

**2.1 Auditer ParcelleDetailPage**
- [ ] Vérifier connexion Supabase
- [ ] Corriger colonnes (photo_url → file_url)
- [ ] Tester affichage complet
- **Temps estimé**: 30 min

**2.2 Créer Workflow Demande d'Achat**
- [ ] Créer table `purchase_requests`
- [ ] Créer composant `PurchaseRequestModal`
- [ ] Intégrer dans `ParcelleDetailPage`
- [ ] Créer page vendeur pour gérer les demandes
- [ ] Créer notifications
- **Temps estimé**: 3h

### Phase 3: AMÉLIORATION (Cette semaine)

**3.1 Dashboard Vendeur - Demandes**
- [ ] Page `/dashboard/vendeur/requests`
- [ ] Liste des demandes reçues
- [ ] Actions: accepter, refuser, négocier
- **Temps estimé**: 2h

**3.2 Dashboard Admin - Suivi**
- [ ] Page monitoring toutes les demandes
- [ ] Statistiques
- [ ] Interventions si nécessaire
- **Temps estimé**: 1h

---

## 📝 FICHIERS À CRÉER/MODIFIER

### À Modifier
1. `src/pages/ParcellesVendeursPage.jsx` - Remplacer mock par Supabase
2. `src/pages/EditParcelPage.jsx` - Vérifier/corriger
3. `src/pages/ParcelleDetailPage.jsx` - Auditer et ajouter bouton demande

### À Créer
1. `src/components/purchase/PurchaseRequestModal.jsx` - Modal demande achat
2. `src/pages/dashboards/vendeur/PurchaseRequestsPage.jsx` - Gestion demandes vendeur
3. `CREATE-PURCHASE-REQUESTS-TABLE.sql` - Table BDD
4. `CREATE-PURCHASE-REQUESTS-RLS.sql` - Policies sécurité

---

## 🔐 SÉCURITÉ RLS REQUISE

```sql
-- RLS pour purchase_requests
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;

-- Vendeur peut voir ses demandes
CREATE POLICY "Vendor_View_Own_Requests"
ON purchase_requests FOR SELECT
USING (
  property_id IN (
    SELECT id FROM properties WHERE owner_id = auth.uid()
  )
);

-- Admin voit tout
CREATE POLICY "Admin_Full_Access_Requests"
ON purchase_requests FOR ALL
USING (get_user_role() = 'admin');

-- Acheteur voit ses propres demandes
CREATE POLICY "Buyer_View_Own_Requests"
ON purchase_requests FOR SELECT
USING (buyer_id = auth.uid());

-- Tout le monde peut créer une demande
CREATE POLICY "Anyone_Can_Create_Request"
ON purchase_requests FOR INSERT
WITH CHECK (true);
```

---

## ✅ CHECKLIST FINALE

- [ ] Bien s'affiche sur `/parcelles-vendeurs`
- [ ] Édition fonctionne sur `/parcelles/:id/edit`
- [ ] Page détail correcte sur `/parcelles/:id`
- [ ] Bouton "Demande d'achat" présent
- [ ] Modal demande fonctionne
- [ ] Notification vendeur créée
- [ ] Notification admin créée
- [ ] Dashboard vendeur affiche demandes
- [ ] Tests complets effectués

---

**Prochaine étape**: Commencer par la Phase 1.1 (connecter liste à Supabase)
