# 📋 WORKFLOW DEMANDES D'ACHAT - GUIDE COMPLET

**Date**: 7 Octobre 2025  
**Question**: "Quand le vendeur reçoit une demande d'achat, ça va se passer sur quelle page ?"

---

## 🔍 **ÉTAT ACTUEL DU SYSTÈME**

### Où apparaissent les demandes ?

#### 1. **📊 Page Overview** (`/vendeur/overview`)

**Visibilité**:
- ✅ StatsCard "Demandes en attente" (compteur)
- ✅ Section "Activités récentes" (dernières demandes)
- ✅ Alertes si nouvelles demandes non lues

**Interaction**:
- Clic sur stat → Redirige vers page dédiée
- Clic sur activité → Ouvre détail demande

**Code actuel**:
```jsx
// VendeurOverviewRealDataModern.jsx ligne ~430
<StatsCard
  title="Demandes en attente"
  value={dashboardStats.pendingInquiries}
  icon={MessageSquare}
  color="orange"
  onClick={() => navigate('/vendeur/purchase-requests')} // ❌ Page n'existe pas encore
/>
```

---

#### 2. **👥 Page CRM** (`/vendeur/crm`)

**Visibilité**:
- ✅ Liste complète de tous les prospects
- ✅ Filtres par statut: `new`, `hot`, `warm`, `cold`, `converted`
- ✅ Chaque prospect = une demande potentielle

**Interaction**:
- Tableau avec colonnes: Nom, Email, Téléphone, Statut, Propriété intéressée, Actions
- Actions: Appeler, Envoyer email, Planifier RDV, Convertir, Archiver

**Code actuel**:
```jsx
// VendeurCRMRealData.jsx ligne ~75
const { data: contacts } = await supabase
  .from('crm_contacts')
  .select('*')
  .eq('vendor_id', user.id)
  .order('created_at', { ascending: false });
```

---

#### 3. **🏠 Page Mes Propriétés** (`/vendeur/properties`)

**Visibilité**:
- ✅ Colonne "Demandes" (inquiries count) pour chaque propriété
- ✅ Badge avec nombre de demandes en attente

**Interaction**:
- Clic sur card propriété → Affiche demandes liées
- Statistiques globales: "X demandes" en sous-titre

**Code actuel**:
```jsx
// VendeurPropertiesRealData.jsx ligne ~130
inquiries: prop.contact_requests_count || 0

// Affichage ligne ~765
<div className="bg-gray-50 rounded p-2">
  <MessageSquare className="h-4 w-4 mx-auto text-gray-600 mb-1" />
  <p className="text-xs font-semibold">{property.inquiries}</p>
</div>
```

---

#### 4. **💬 Page Messages** (`/vendeur/messages`)

**Visibilité**:
- ⚠️ Communication directe avec acheteurs
- ⚠️ Notifications temps réel
- ❌ Table `messages` actuellement avec erreurs Supabase

**Interaction**:
- Chat en temps réel avec prospects
- Historique conversations

---

## 🎯 **RECOMMANDATION: Créer Page Dédiée**

### Pourquoi une page dédiée ?

**Problèmes actuels**:
1. Demandes **dispersées** sur 3 pages différentes
2. **Pas d'action rapide** centralisée
3. **Difficile de suivre** l'historique
4. **Pas de workflow** clair accepter/refuser

### 🆕 **Page "Demandes d'Achat"**

**Route**: `/vendeur/purchase-requests`

**Fonctionnalités**:
```
┌─────────────────────────────────────────────────┐
│  📋 Demandes d'Achat                            │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Filtres: [Toutes ▼] [En attente ▼] [Ce mois▼] │
│  Recherche: [Rechercher par nom, propriété...] │
│                                                 │
│  ┌────────────────────────────────────────────┐│
│  │ 🟢 NOUVELLE (2)                            ││
│  ├────────────────────────────────────────────┤│
│  │ Jean Dupont                                ││
│  │ 📧 jean@email.com | 📞 +221 77 123 45 67  ││
│  │ 🏠 Terrain 500m² Dakar                     ││
│  │ 💰 Offre: 45M FCFA | 📅 Il y a 2h         ││
│  │ [✅ Accepter] [❌ Refuser] [💬 Discuter]   ││
│  └────────────────────────────────────────────┘│
│                                                 │
│  🟡 EN COURS (5)                                │
│  🟢 ACCEPTÉES (12)                              │
│  🔴 REFUSÉES (3)                                │
└─────────────────────────────────────────────────┘
```

---

## 📐 **ARCHITECTURE TECHNIQUE**

### 1. **Table Supabase requise**

```sql
CREATE TABLE purchase_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Informations demande
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, negotiating, completed
  offer_price DECIMAL(15,2),
  message TEXT,
  buyer_name VARCHAR(255),
  buyer_email VARCHAR(255),
  buyer_phone VARCHAR(50),
  
  -- Négociation
  counter_offer_price DECIMAL(15,2),
  negotiation_history JSONB DEFAULT '[]',
  
  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Tracking
  source VARCHAR(100), -- web, mobile, agent
  priority VARCHAR(20) DEFAULT 'normal' -- low, normal, high, urgent
);

-- Index pour performance
CREATE INDEX idx_purchase_requests_vendor ON purchase_requests(vendor_id, status);
CREATE INDEX idx_purchase_requests_property ON purchase_requests(property_id);
CREATE INDEX idx_purchase_requests_buyer ON purchase_requests(buyer_id);
```

---

### 2. **Composant React**

**Fichier**: `src/pages/dashboards/vendeur/VendeurPurchaseRequests.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Check, X, MessageSquare, Eye, Filter } from 'lucide-react';

const VendeurPurchaseRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
    setupRealtimeSubscription();
  }, [user, filter]);

  const loadRequests = async () => {
    let query = supabase
      .from('purchase_requests')
      .select(`
        *,
        properties (id, title, price, location, images),
        buyers:auth.users!buyer_id (email, user_metadata)
      `)
      .eq('vendor_id', user.id)
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Erreur chargement demandes:', error);
      return;
    }

    setRequests(data);
    setLoading(false);
  };

  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('purchase_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_requests',
          filter: `vendor_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Nouvelle demande !
            showNotification('🎉 Nouvelle demande d\'achat !');
            loadRequests();
          }
        }
      )
      .subscribe();

    return subscription;
  };

  const handleAccept = async (requestId) => {
    const { error } = await supabase
      .from('purchase_requests')
      .update({ 
        status: 'accepted',
        responded_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (!error) {
      loadRequests();
      // Envoyer notification acheteur
      sendBuyerNotification(requestId, 'accepted');
    }
  };

  const handleReject = async (requestId) => {
    const { error } = await supabase
      .from('purchase_requests')
      .update({ 
        status: 'rejected',
        responded_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (!error) {
      loadRequests();
      sendBuyerNotification(requestId, 'rejected');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Demandes d'Achat</h1>
          <p className="text-muted-foreground">
            Gérez toutes vos demandes d'acheteurs
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Toutes ({requests.length})
          </Button>
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            En attente
          </Button>
          <Button 
            variant={filter === 'accepted' ? 'default' : 'outline'}
            onClick={() => setFilter('accepted')}
          >
            Acceptées
          </Button>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {requests.map(request => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Image propriété */}
                  <img 
                    src={request.properties.images[0]} 
                    alt={request.properties.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  {/* Informations */}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {request.buyer_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {request.buyer_email} • {request.buyer_phone}
                    </p>
                    <p className="font-medium mt-2">
                      🏠 {request.properties.title}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm">
                        💰 Offre: {request.offer_price?.toLocaleString('fr-FR')} FCFA
                      </span>
                      <span className="text-sm text-muted-foreground">
                        📅 {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {request.message && (
                      <p className="text-sm mt-2 italic">
                        "{request.message}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAccept(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accepter
                    </Button>
                    <Button 
                      onClick={() => handleReject(request.id)}
                      variant="destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Refuser
                    </Button>
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Discuter
                    </Button>
                  </div>
                )}

                {request.status === 'accepted' && (
                  <Badge className="bg-green-100 text-green-800">
                    ✅ Acceptée
                  </Badge>
                )}

                {request.status === 'rejected' && (
                  <Badge className="bg-red-100 text-red-800">
                    ❌ Refusée
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VendeurPurchaseRequests;
```

---

## 🔄 **WORKFLOW COMPLET**

### Étape 1: Acheteur fait une demande

```
Page publique /parcelle/:id
↓
Clic bouton "Je suis intéressé"
↓
Formulaire:
  - Nom, Email, Téléphone
  - Message (optionnel)
  - Offre prix (optionnel)
↓
INSERT INTO purchase_requests
↓
Notification temps réel → Vendeur
```

### Étape 2: Vendeur reçoit notification

```
🔔 Notification push/email
↓
Badge compteur sur "Demandes d'Achat"
↓
Apparaît dans:
  - Overview (stat card)
  - CRM (nouveau prospect)
  - Page dédiée (liste principale)
```

### Étape 3: Vendeur traite la demande

```
Vendeur ouvre /vendeur/purchase-requests
↓
Voit carte détaillée demande
↓
Options:
  1. ✅ Accepter → Status = 'accepted' → Email acheteur
  2. ❌ Refuser → Status = 'rejected' → Email acheteur
  3. 💬 Discuter → Ouvre chat → Négociation
  4. 👁️ Voir profil → Détails acheteur
```

### Étape 4: Négociation (optionnel)

```
Vendeur clique "Discuter"
↓
Chat en temps réel
↓
Échange messages
↓
Contre-offre prix
↓
Acceptation finale
```

### Étape 5: Finalisation

```
Demande acceptée
↓
Génération pré-contrat automatique
↓
Envoi pour signature électronique
↓
Paiement sécurisé
↓
Transaction blockchain
↓
Status = 'completed'
```

---

## 🎯 **IMPLÉMENTATION RECOMMANDÉE**

### Phase 1: Base (1-2 jours)
1. ✅ Créer table `purchase_requests`
2. ✅ Créer composant `VendeurPurchaseRequests.jsx`
3. ✅ Ajouter route dans sidebar
4. ✅ Notifications temps réel

### Phase 2: Interactions (2-3 jours)
5. ✅ Actions Accepter/Refuser
6. ✅ Chat intégré
7. ✅ Système de contre-offre
8. ✅ Historique négociations

### Phase 3: Automation (3-5 jours)
9. ✅ Génération contrat automatique
10. ✅ Signature électronique
11. ✅ Intégration paiement
12. ✅ Blockchain transaction

---

**Conclusion**: La page dédiée "Demandes d'Achat" est **ESSENTIELLE** pour centraliser et simplifier la gestion des demandes. À implémenter en priorité.
