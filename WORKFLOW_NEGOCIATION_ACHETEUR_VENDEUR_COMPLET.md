# 🔄 WORKFLOW COMPLET NÉGOCIATION ACHETEUR-VENDEUR

## 📋 Vue d'ensemble

Ce document détaille le workflow complet de négociation entre acheteurs et vendeurs, incluant:
- **Contre-offres du vendeur** → visibles par l'acheteur
- **Réponses de l'acheteur** → Accepter / Refuser / Contre-offrir
- **Création de purchase_cases** → UNIQUEMENT après acceptation finale
- **Onglets Négociations/Refusées** → pour les deux parties

---

## 🎯 Problèmes Résolus

### ❌ Problèmes Initiaux

1. **Contre-offres invisibles**: L'acheteur ne voyait pas les contre-offres du vendeur
2. **Dossiers créés trop tôt**: `purchase_cases` créés pendant la négociation au lieu d'après acceptation
3. **Pas d'onglets pour l'acheteur**: Manquaient "Négociations" et "Refusées"
4. **Workflow incomplet**: Acheteur ne pouvait pas répondre aux contre-offres

### ✅ Solutions Implémentées

1. **Chargement des négociations**: Table `negotiations` chargée pour chaque demande
2. **Affichage des contre-offres**: Cartes visuelles avec prix comparé dans `ParticulierMesAchatsRefonte`
3. **Modal de réponse**: `BuyerCounterOfferResponseModal` avec 3 options (Accepter/Refuser/Contre-offrir)
4. **Onglets ajoutés**: `negotiation` (en cours) et `rejected` (refusées)
5. **Purchase_cases corrects**: Créés UNIQUEMENT sur acceptation finale

---

## 🔄 Flux de Négociation Complet

### Étape 1: Demande Initiale (Acheteur)

```
Acheteur visite /parcelle/:id/one-time-payment-simple
  ↓
Remplit formulaire:
  - Offre initiale: 25,000,000 FCFA
  - Message au vendeur
  ↓
Submit → INSERT dans requests:
  {
    user_id: acheteur_id,
    parcel_id: parcelle_id,
    offered_price: 25000000,
    status: 'pending',
    type: 'one_time'
  }
  ↓
Notification envoyée au vendeur
  ↓
Redirect → /acheteur/mes-achats
  ↓
Demande visible avec "REQ-XXXXXXXX" (pending)
```

**Tables impactées**:
- ✅ `requests` (INSERT)
- ✅ `notifications` (INSERT)
- ❌ `purchase_cases` (PAS CRÉÉ - c'est le point clé!)

---

### Étape 2: Contre-offre Vendeur

```
Vendeur voit demande dans /vendeur/demandes (onglet "pending")
  ↓
Clique "Négocier"
  ↓
Modal NegotiationModal s'ouvre:
  - Prix acheteur: 25,000,000 FCFA
  - Nouveau prix: 28,000,000 FCFA
  - Message: "Prix ajusté car terrain viabilisé"
  ↓
Submit handleSubmitNegotiation():
  ↓
  INSERT dans negotiations:
  {
    request_id: request.id,
    initiated_by: vendeur_id,
    original_price: 25000000,
    proposed_price: 28000000,
    offer_message: "Prix ajusté car terrain viabilisé",
    status: 'pending'
  }
  ↓
  UPDATE requests:
  {
    status: 'negotiation'
  }
  ↓
Notification envoyée à l'acheteur
```

**Tables impactées**:
- ✅ `negotiations` (INSERT)
- ✅ `requests` (UPDATE status → 'negotiation')
- ✅ `notifications` (INSERT)
- ❌ `purchase_cases` (TOUJOURS PAS CRÉÉ!)

**Code Vendeur** (`VendeurPurchaseRequests.jsx`):
```javascript
const handleSubmitNegotiation = async (counterOffer) => {
  // Crée negotiation record
  const { data: negotiation } = await supabase
    .from('negotiations')
    .insert({
      request_id: selectedRequest.id,
      initiated_by: user.id,
      original_price: originalPrice,
      proposed_price: counterOffer.new_price,
      offer_message: counterOffer.message,
      status: 'pending'
    });

  // Update request status
  await supabase
    .from('requests')
    .update({ status: 'negotiation' })
    .eq('id', selectedRequest.id);

  // PAS DE CRÉATION DE PURCHASE_CASE !
};
```

---

### Étape 3: Acheteur Voit la Contre-offre

```
Acheteur dans /acheteur/mes-achats
  ↓
loadPurchaseCases():
  ↓
  1. Charge requests (avec status 'negotiation')
  2. Pour chaque request, charge negotiations:
     SELECT * FROM negotiations 
     WHERE request_id = req.id 
     ORDER BY created_at DESC
  3. Enrichit request avec:
     - latestNegotiation: negotiations[0]
     - hasCounterOffer: true si status = 'pending'
  ↓
Demande affichée avec encadré violet:
  "Contre-offre du vendeur"
  Prix vendeur: 28,000,000 FCFA
  Votre offre: 25,000,000 FCFA
  Message: "Prix ajusté car terrain viabilisé"
  [Bouton Accepter] [Bouton Refuser]
```

**Code Acheteur** (`ParticulierMesAchatsRefonte.jsx`):
```javascript
// Dans loadPurchaseCases()
const { data: negotiations } = await supabase
  .from('negotiations')
  .select('*')
  .eq('request_id', req.id)
  .order('created_at', { ascending: false });

const latestNegotiation = negotiations?.[0];
const hasCounterOffer = latestNegotiation && latestNegotiation.status === 'pending';

return {
  ...req,
  negotiations: negotiations || [],
  latestNegotiation,
  hasCounterOffer
};
```

**UI Affichage**:
```jsx
{caseItem.hasCounterOffer && caseItem.latestNegotiation && (
  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500">
    <div className="flex justify-between">
      <div>
        <div className="text-lg font-bold text-purple-700">
          {formatPrice(caseItem.latestNegotiation.proposed_price)}
        </div>
        <div className="text-xs text-gray-600">
          Votre offre : {formatPrice(caseItem.latestNegotiation.original_price)}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => openModal(caseItem)}>Accepter</Button>
        <Button variant="outline">Refuser</Button>
      </div>
    </div>
  </div>
)}
```

---

### Étape 4A: Acheteur Accepte (Création purchase_case)

```
Acheteur clique "Accepter"
  ↓
Modal BuyerCounterOfferResponseModal s'ouvre
  ↓
Onglet "Accepter" sélectionné:
  "Vous acceptez d'acheter au prix de 28,000,000 FCFA"
  [Confirmer l'acceptation]
  ↓
handleAcceptCounterOffer(negotiationId):
  ↓
  1. UPDATE negotiations:
     SET status = 'accepted', responded_at = NOW()
  
  2. ✅ CRÉER PURCHASE_CASE (ENFIN!):
     PurchaseWorkflowService.createPurchaseCase({
       request_id: negotiation.request_id,
       buyer_id: user.id,
       seller_id: negotiation.initiated_by,
       parcelle_id: request.parcel_id,
       purchase_price: negotiation.proposed_price, // 28M (prix négocié!)
       payment_method: request.type,
       initiation_method: 'negotiation_accepted'
     })
  
  3. UPDATE requests:
     SET status = 'accepted'
  
  4. Notification vendeur:
     "Contre-offre acceptée ! 🎉"
     Link: /vendeur/cases/{case_number}
  ↓
Toast: "Contre-offre acceptée ! Dossier créé : CASE-20250129-XXX"
  ↓
Redirect ou reload → Demande passe de "REQ-XXXXXXXX" à "CASE-20250129-XXX"
```

**Tables impactées**:
- ✅ `negotiations` (UPDATE status → 'accepted')
- ✅ `purchase_cases` (INSERT - PREMIÈRE FOIS!)
- ✅ `requests` (UPDATE status → 'accepted')
- ✅ `notifications` (INSERT)

**Code Acheteur**:
```javascript
const handleAcceptCounterOffer = async (negotiationId) => {
  // Update negotiation
  await supabase
    .from('negotiations')
    .update({ status: 'accepted', responded_at: new Date() })
    .eq('id', negotiationId);

  // Get negotiation details
  const { data: negotiation } = await supabase
    .from('negotiations')
    .select('*')
    .eq('id', negotiationId)
    .single();

  // 🔥 CREATE PURCHASE_CASE (only now!)
  const result = await PurchaseWorkflowService.createPurchaseCase({
    request_id: negotiation.request_id,
    buyer_id: user.id,
    seller_id: negotiation.initiated_by,
    parcelle_id: selectedRequest.parcel_id,
    purchase_price: negotiation.proposed_price, // Negotiated price
    payment_method: selectedRequest.type,
    initiation_method: 'negotiation_accepted'
  });

  // Update request
  await supabase
    .from('requests')
    .update({ status: 'accepted' })
    .eq('id', negotiation.request_id);

  // Notify seller
  await NotificationService.sendNotification({
    user_id: negotiation.initiated_by,
    type: 'negotiation_accepted',
    title: 'Contre-offre acceptée ! 🎉',
    message: `L'acheteur a accepté votre contre-offre de ${negotiation.proposed_price} FCFA`
  });
};
```

---

### Étape 4B: Acheteur Refuse

```
Acheteur clique "Refuser"
  ↓
Modal BuyerCounterOfferResponseModal s'ouvre
  ↓
Onglet "Refuser" sélectionné:
  Textarea: "Raison du refus (obligatoire)"
  Input: "Prix trop élevé pour mon budget"
  [Refuser la contre-offre]
  ↓
handleRejectCounterOffer(negotiationId, reason):
  ↓
  1. UPDATE negotiations:
     SET status = 'rejected', 
         responded_at = NOW(),
         metadata = { reject_reason: reason }
  
  2. UPDATE requests:
     SET status = 'rejected'
  
  3. Notification vendeur:
     "Contre-offre refusée"
     Message: "Prix trop élevé pour mon budget"
  ↓
Toast: "Contre-offre refusée - Le vendeur a été notifié"
  ↓
Demande passe dans onglet "Refusées"
```

**Tables impactées**:
- ✅ `negotiations` (UPDATE status → 'rejected')
- ✅ `requests` (UPDATE status → 'rejected')
- ✅ `notifications` (INSERT)
- ❌ `purchase_cases` (PAS CRÉÉ - négociation échouée)

---

### Étape 4C: Acheteur Fait une Contre-Contre-Offre

```
Acheteur clique "Refuser" puis choisit onglet "Contre-offre"
  ↓
Modal BuyerCounterOfferResponseModal:
  Onglet "Contre-offre" sélectionné
  Input prix: 26,500,000 FCFA
  Textarea message: "Je peux monter à 26.5M max"
  [Envoyer ma contre-offre]
  ↓
handleCounterToCounterOffer(negotiationId, counterOffer):
  ↓
  1. INSERT nouvelle negotiation (acheteur → vendeur):
     {
       request_id: request.id,
       initiated_by: user.id, // Acheteur cette fois
       original_price: 28000000, // Prix vendeur
       proposed_price: 26500000, // Nouveau prix acheteur
       offer_message: "Je peux monter à 26.5M max",
       status: 'pending',
       parent_negotiation_id: negotiationId // Chaîne
     }
  
  2. UPDATE ancienne negotiation:
     SET status = 'counter_offer', responded_at = NOW()
  
  3. UPDATE requests:
     SET status = 'negotiation' (reste en négociation)
  
  4. Notification vendeur:
     "Nouvelle contre-offre reçue 💬"
     Message: "L'acheteur propose 26,500,000 FCFA"
  ↓
Toast: "Votre contre-offre a été envoyée au vendeur !"
  ↓
Demande reste dans onglet "Négociations"
  ↓
Vendeur reçoit notification et peut:
  - Accepter 26.5M → CRÉER purchase_case
  - Refuser
  - Faire ENCORE une contre-offre (cycle continue)
```

**Tables impactées**:
- ✅ `negotiations` (INSERT nouvelle + UPDATE ancienne)
- ✅ `requests` (UPDATE status reste 'negotiation')
- ✅ `notifications` (INSERT)
- ❌ `purchase_cases` (PAS CRÉÉ - négociation continue)

---

## 📊 Tableau de Synthèse: Quand purchase_cases est créé

| Action | Qui | purchase_case créé? | Status request | Status negotiation |
|--------|-----|---------------------|----------------|-------------------|
| Demande initiale | Acheteur | ❌ NON | `pending` | - |
| Vendeur contre-offre | Vendeur | ❌ NON | `negotiation` | `pending` |
| Acheteur accepte contre-offre | Acheteur | ✅ **OUI** | `accepted` | `accepted` |
| Acheteur refuse | Acheteur | ❌ NON | `rejected` | `rejected` |
| Acheteur contre-contre-offre | Acheteur | ❌ NON | `negotiation` | `pending` (nouvelle) |
| Vendeur accepte final | Vendeur | ✅ **OUI** | `accepted` | `accepted` |

**Règle d'or**: `purchase_cases` créé UNIQUEMENT quand une des parties **accepte** l'offre de l'autre.

---

## 🎨 Interface Utilisateur

### Acheteur (`ParticulierMesAchatsRefonte.jsx`)

#### Onglets

```jsx
<Tabs value={activeFilter} onValueChange={setActiveFilter}>
  <TabsList>
    <TabsTrigger value="all">Tous ({stats.total})</TabsTrigger>
    <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
    <TabsTrigger value="negotiation">Négociations ({stats.negotiation})</TabsTrigger>
    <TabsTrigger value="active">Actifs ({stats.active})</TabsTrigger>
    <TabsTrigger value="completed">Complétés ({stats.completed})</TabsTrigger>
    <TabsTrigger value="rejected">Refusées ({stats.rejected})</TabsTrigger>
  </TabsList>
</Tabs>
```

#### Carte avec Contre-offre

```jsx
{caseItem.hasCounterOffer && (
  <div className="bg-purple-50 border-l-4 border-purple-500 p-3">
    <div className="flex items-center gap-2">
      <MessageSquare className="w-4 h-4 text-purple-600" />
      <span className="font-semibold">Contre-offre du vendeur</span>
    </div>
    <div className="flex justify-between items-center">
      <div>
        <div className="text-lg font-bold text-purple-700">
          28,000,000 FCFA
        </div>
        <div className="text-xs text-gray-600">
          Votre offre : 25,000,000 FCFA
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => openModal()}>
          <CheckCircle className="w-4 h-4 mr-1" />
          Accepter
        </Button>
        <Button size="sm" variant="outline">
          <XCircle className="w-4 h-4 mr-1" />
          Refuser
        </Button>
      </div>
    </div>
    <p className="text-sm italic mt-2">
      "Prix ajusté car terrain viabilisé"
    </p>
  </div>
)}
```

#### Modal de Réponse

```jsx
<BuyerCounterOfferResponseModal
  request={selectedRequest}
  negotiation={selectedNegotiation}
  isOpen={showCounterOfferModal}
  onClose={() => setShowCounterOfferModal(false)}
  onAccept={handleAcceptCounterOffer}
  onReject={handleRejectCounterOffer}
  onCounter={handleCounterToCounterOffer}
  isSubmitting={isSubmittingResponse}
/>
```

**Modal - 3 Onglets**:

1. **Accepter**:
   - Encadré vert avec icône CheckCircle
   - Message: "Vous acceptez d'acheter au prix de X FCFA"
   - Explication: "Un dossier sera créé"
   - Bouton: "Confirmer l'acceptation"

2. **Refuser**:
   - Textarea obligatoire pour la raison
   - Bouton rouge: "Refuser la contre-offre"
   - Message de courtoisie

3. **Contre-offre**:
   - Input prix (avec min/max suggérés)
   - Textarea message optionnel
   - Bouton violet: "Envoyer ma contre-offre"

### Vendeur (`VendeurPurchaseRequests.jsx`)

#### Onglets (déjà existants)

```jsx
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="all">Tous ({stats.total})</TabsTrigger>
    <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
    <TabsTrigger value="accepted">Acceptées ({stats.accepted})</TabsTrigger>
    <TabsTrigger value="negotiation">En négociation ({stats.negotiation})</TabsTrigger>
    <TabsTrigger value="completed">Complétées ({stats.completed})</TabsTrigger>
    <TabsTrigger value="rejected">Refusées ({stats.rejected})</TabsTrigger>
  </TabsList>
</Tabs>
```

---

## 📁 Fichiers Modifiés

### 1. `src/pages/dashboards/particulier/ParticulierMesAchatsRefonte.jsx`

**Modifications**:
- ✅ Ajout imports: `PurchaseWorkflowService`, `NotificationService`, `BuyerCounterOfferResponseModal`
- ✅ Ajout états: `showCounterOfferModal`, `selectedRequest`, `selectedNegotiation`, `isSubmittingResponse`
- ✅ Ajout stats: `negotiation`, `rejected`
- ✅ Fonction `loadPurchaseCases()`: Chargement `negotiations` pour chaque request
- ✅ Fonction `calculateStats()`: Calcul counts pour negotiation/rejected
- ✅ Fonction `filterCases()`: Filtres pour negotiation/rejected
- ✅ Handlers:
  - `handleAcceptCounterOffer()` → Crée purchase_case
  - `handleRejectCounterOffer()` → Update negotiation à rejected
  - `handleCounterToCounterOffer()` → Crée nouvelle negotiation
- ✅ UI: Onglets Négociations/Refusées
- ✅ UI: Carte avec encadré contre-offre
- ✅ UI: Modal intégré

**Lignes modifiées**: ~694 insertions

### 2. `src/components/modals/BuyerCounterOfferResponseModal.jsx` (NOUVEAU)

**Contenu**:
- Modal avec 3 onglets (Accepter/Refuser/Contre-offre)
- Comparaison des prix (votre offre vs contre-offre vendeur)
- Calcul de la différence en % et en FCFA
- Affichage du message du vendeur
- Formulaires pour chaque action
- Props: `request`, `negotiation`, `onAccept`, `onReject`, `onCounter`

**Lignes**: ~380 lignes

### 3. `src/pages/dashboards/vendeur/VendeurPurchaseRequests.jsx`

**Vérification** (déjà correct):
- ✅ `handleSubmitNegotiation()` crée UNIQUEMENT `negotiations`, PAS de `purchase_case`
- ✅ `handleAccept()` crée `purchase_case` (via `PurchaseWorkflowService.createPurchaseCase()`)
- ✅ Pas de création de `purchase_case` pendant négociation

---

## 🧪 Scénarios de Test

### Test 1: Négociation Simple - Acceptation

1. **Acheteur**: Créer demande pour 25M FCFA
2. **Vérifier**: `requests` créé, `purchase_cases` vide
3. **Vendeur**: Contre-offre à 28M FCFA
4. **Vérifier**: `negotiations` créé, `purchase_cases` toujours vide
5. **Acheteur**: Accepter contre-offre
6. **Vérifier**: `purchase_cases` créé avec price = 28M
7. **Vérifier**: Notifications envoyées aux deux parties

### Test 2: Négociation - Refus

1. **Acheteur**: Créer demande pour 25M FCFA
2. **Vendeur**: Contre-offre à 35M FCFA
3. **Acheteur**: Refuser avec raison "Prix trop élevé"
4. **Vérifier**: 
   - `negotiations.status` = 'rejected'
   - `requests.status` = 'rejected'
   - `purchase_cases` vide
   - Notification envoyée au vendeur

### Test 3: Négociation Multiple

1. **Acheteur**: Offre 25M FCFA
2. **Vendeur**: Contre-offre 30M FCFA
3. **Acheteur**: Contre-offre 27M FCFA
4. **Vérifier**: 2 entrées dans `negotiations`, statuts différents
5. **Vendeur**: Contre-offre 28.5M FCFA
6. **Acheteur**: Accepter 28.5M FCFA
7. **Vérifier**: `purchase_cases` créé avec price = 28.5M

### Test 4: Interface Acheteur

1. **Acheteur**: Créer 3 demandes différentes
2. **Vendeur**: 
   - Demande 1: Accepter directement
   - Demande 2: Contre-offre
   - Demande 3: Refuser
3. **Acheteur**: Vérifier onglets:
   - "Tous": 3 demandes
   - "Pending": 0
   - "Négociations": 1 (demande 2)
   - "Actifs": 1 (demande 1 acceptée)
   - "Refusées": 1 (demande 3)
4. **Vérifier**: Encadré violet sur demande 2 avec prix vendeur

### Test 5: Modal de Réponse

1. **Acheteur**: Ouvrir modal sur contre-offre
2. **Vérifier**: 3 onglets présents
3. **Onglet Accepter**: 
   - Prix affiché correctement
   - Bouton "Confirmer"
4. **Onglet Refuser**: 
   - Textarea obligatoire
   - Bouton désactivé si vide
5. **Onglet Contre-offre**: 
   - Input prix avec validation
   - Message optionnel

---

## 🔐 Sécurité et Validation

### RLS Policies (Row Level Security)

**Table `negotiations`**:
```sql
-- Users can view negotiations for their requests
CREATE POLICY "Users can view negotiations for their requests" 
ON public.negotiations FOR SELECT USING (
  initiated_by = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.requests
    WHERE id = negotiations.request_id
    AND user_id = auth.uid()
  )
);

-- Users can create negotiations
CREATE POLICY "Users can create negotiations" 
ON public.negotiations FOR INSERT WITH CHECK (
  initiated_by = auth.uid()
);
```

### Validations Côté Client

1. **Prix**: Doit être > 0
2. **Raison de refus**: Obligatoire, min 10 caractères
3. **Message contre-offre**: Optionnel mais recommandé
4. **États modaux**: Désactivation boutons pendant soumission

### Validations Côté Serveur

1. **Ownership**: Vérifier que l'utilisateur est bien l'acheteur
2. **Statut**: Vérifier que la négociation est `pending`
3. **Request**: Vérifier que la demande existe
4. **Prix**: Vérifier cohérence des montants

---

## 📊 Statistiques et Métriques

### Dashboard Acheteur

```javascript
stats = {
  total: 10,        // Toutes demandes
  pending: 2,       // En attente de réponse vendeur
  negotiation: 3,   // En cours de négociation
  active: 4,        // Dossiers actifs (purchase_cases)
  completed: 1,     // Dossiers terminés
  rejected: 0       // Demandes refusées
}
```

### Dashboard Vendeur

```javascript
stats = {
  total: 15,        // Toutes demandes reçues
  pending: 5,       // En attente de ma décision
  accepted: 6,      // Acceptées (purchase_cases créés)
  negotiation: 3,   // En cours de négociation
  completed: 1,     // Dossiers terminés
  rejected: 0       // Demandes refusées
}
```

---

## 🚀 Évolutions Futures

### Court Terme

1. **Historique des négociations**: Timeline visuelle des contre-offres
2. **Expiration des offres**: Durée de validité (7 jours par défaut)
3. **Prix suggérés**: IA suggère prix basé sur marché
4. **Chat en temps réel**: Discussion pendant négociation

### Moyen Terme

1. **Signatures électroniques**: Valider accord de prix
2. **Conditions spéciales**: Ajouter clauses (délais, paiement)
3. **Médiation**: Système de médiation en cas de blocage
4. **Analytics**: Dashboard métriques de négociation

### Long Terme

1. **IA de négociation**: Assistant suggère stratégies
2. **Blockchain**: Traçabilité immuable des négociations
3. **Enchères automatiques**: Système d'enchères inversées
4. **Marketplace**: Négociations multi-vendeurs

---

## 📝 Résumé Technique

### Points Clés

1. ✅ **Purchase_cases créés au bon moment**: Après acceptation finale uniquement
2. ✅ **Workflow complet**: Acheteur peut accepter/refuser/contre-offrir
3. ✅ **UI cohérente**: Mêmes onglets pour acheteur et vendeur
4. ✅ **Notifications**: Toutes les parties notifiées à chaque étape
5. ✅ **Historique**: Table `negotiations` conserve toute la chaîne
6. ✅ **Sécurité**: RLS policies sur toutes les tables

### Tables Utilisées

- `requests`: Demandes d'achat initiales
- `negotiations`: Historique des contre-offres
- `purchase_cases`: Dossiers officiels (créés après accord)
- `notifications`: Notifications des deux parties
- `conversations`: Discussions (optionnel)

### Services Utilisés

- `PurchaseWorkflowService`: Création purchase_cases
- `NotificationService`: Envoi notifications
- `RealtimeSyncService`: Mises à jour temps réel

---

**Date**: 2025-01-29  
**Version**: 1.0  
**Statut**: ✅ Implémenté et documenté  
**Commit**: `13f2a972` - "feat: Add complete buyer negotiation workflow"
