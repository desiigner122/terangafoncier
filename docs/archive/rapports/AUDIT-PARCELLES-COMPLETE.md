# 🔍 AUDIT COMPLET : SYSTÈME DE PARCELLES VENDEURS

**Date**: 12 Octobre 2025  
**Problèmes rapportés**: 
1. ❌ Parcelle n'apparaît pas sur `/parcelles-vendeurs`
2. ❌ Page d'édition ne fonctionne pas / ne prend pas effet
3. ⚠️ Page de détail parcelle - vérifier demande d'achat par particulier
4. ⚠️ Workflow des dashboards concernés

---

## 📊 DIAGNOSTIC INITIAL

### Contexte détecté :
- ✅ Bien créé dans DB : `id: 9a2dce41-8e2c-4888-b3d8-0dce41339b5a`
- ✅ Owner assigné : Heritage Fall (`06125976-5ea1-403a-b09e-aebbe1311111`)
- ✅ Status : `active`
- ✅ Verification : `verified`
- ❌ Mais **NON VISIBLE** sur page publique `/parcelles-vendeurs`

---

## 🎯 PROBLÈME 1 : Parcelle invisible sur `/parcelles-vendeurs`

### Fichier analysé :
**`src/pages/ParcellesVendeursPage.jsx`** (899 lignes)

### 🔴 PROBLÈMES IDENTIFIÉS :

#### 1. **Données 100% mockées - AUCUNE connexion Supabase**

```jsx
// Ligne 1-899 : Aucun import de supabase ou useEffect pour fetch
const parcelles = [
  {
    id: 1,
    title: "Terrain Résidentiel Premium - Almadies",
    // ... données hardcodées
  },
  // 10 parcelles mockées au total
];
```

**Impact** : 
- ❌ Les vraies parcelles de la base ne sont JAMAIS chargées
- ❌ Seules 10 parcelles mockées s'affichent
- ❌ Heritage Fall ne verra jamais sa parcelle

#### 2. **Filtres fonctionnent uniquement sur mock data**

```jsx
// Lignes 344-413 : Filtrage client-side sur données mockées
const filteredAndSortedParcelles = useMemo(() => {
  return parcelles
    .filter(parcelle => {
      // Filtre sur données mockées uniquement
    })
}, [parcelles, searchTerm, ...]);
```

#### 3. **Structure de données incompatible avec DB**

**Mock data attendu** :
```javascript
{
  id: 1,  // number
  price: "85 000 000",  // string
  seller: "Particulier",  // string
  sellerType: "vendeur-particulier",
  sellerId: "seller-001"
}
```

**Vraies données DB** :
```sql
{
  id: uuid,
  price: numeric,
  owner_id: uuid,
  status: 'active' | 'sold' | 'reserved' ...
}
```

### ✅ SOLUTION REQUISE :

```jsx
// Remplacer lignes 87-341 (mock data) par :
useEffect(() => {
  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        owner:profiles!owner_id(id, full_name, email, role)
      `)
      .eq('status', 'active')
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false });

    if (!error) setParcelles(data || []);
  };
  fetchProperties();
}, []);
```

---

## 🎯 PROBLÈME 2 : Page d'édition ne fonctionne pas

### Fichiers concernés :
1. **`src/pages/EditPropertySimple.jsx`**
2. **`src/pages/EditPropertyComplete.jsx`**
3. **`src/pages/EditPropertyAdvanced.jsx`**
4. **`src/pages/EditParcelPage.jsx`**

### 🔍 Investigation nécessaire :

#### Questions à vérifier :
1. **Quel fichier est actuellement utilisé ?**
   - 4 fichiers différents existent
   - Lequel est dans les routes ?

2. **Reçoit-il l'ID de la propriété ?**
   ```jsx
   // URL devrait être : /edit-property/:id
   const { id } = useParams();
   ```

3. **Charge-t-il les données depuis Supabase ?**
   ```jsx
   useEffect(() => {
     const loadProperty = async () => {
       const { data } = await supabase
         .from('properties')
         .select('*')
         .eq('id', id)
         .single();
       // Peupler le formulaire
     };
   }, [id]);
   ```

4. **Le UPDATE fonctionne-t-il ?**
   ```jsx
   const handleSubmit = async (formData) => {
     const { error } = await supabase
       .from('properties')
       .update(formData)
       .eq('id', id);
     
     if (error) console.error(error);
   };
   ```

### ✅ ACTIONS REQUISES :

1. **Identifier le bon fichier d'édition**
   ```bash
   grep -r "EditProperty\|EditParcel" src/routes/
   ```

2. **Auditer le fichier actif** :
   - Vérifie `useParams()` pour récupérer l'ID
   - Vérifie `useEffect` pour charger les données
   - Vérifie la soumission du formulaire
   - Vérifie les permissions RLS

3. **Tester le workflow complet** :
   ```
   Dashboard Vendeur 
     → Clic "Éditer" sur propriété
     → Formulaire pré-rempli ✅
     → Modifications
     → Soumission
     → UPDATE Supabase ✅
     → Redirection dashboard ✅
   ```

---

## 🎯 PROBLÈME 3 : Page de détail - Demande d'achat particulier

### Fichier :
**`src/pages/ParcelleDetailPage.jsx`** (1356 lignes)

### 🔍 Vérifications nécessaires :

#### 1. **Bouton "Demande d'achat" existe-t-il ?**

Recherche dans le fichier (ligne ~1200+) :
```jsx
<Button onClick={handlePurchaseRequest}>
  Faire une demande d'achat
</Button>
```

#### 2. **Workflow demande d'achat**

**Attendu** :
```
Particulier sur /parcelle/:id
  → Clic "Demande d'achat"
  → Formulaire (message, contact)
  → Soumission
  → INSERT dans table `purchase_requests`
  → Notification au vendeur
  → Email au vendeur
  → Dashboard vendeur : nouvelle demande ✅
```

#### 3. **Table existe-t-elle ?**

Vérifier dans Supabase :
```sql
SELECT * FROM purchase_requests LIMIT 1;
```

Si n'existe pas, créer :
```sql
CREATE TABLE purchase_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. **Vérifier le code de soumission**

```jsx
const handlePurchaseRequest = async () => {
  const { error } = await supabase
    .from('purchase_requests')
    .insert({
      property_id: parcelleId,
      buyer_id: user.id,
      seller_id: parcelle.owner_id,
      message: requestMessage,
      status: 'pending'
    });

  if (!error) {
    // Créer notification vendeur
    await supabase.from('notifications').insert({
      user_id: parcelle.owner_id,
      type: 'purchase_request',
      titre: 'Nouvelle demande d'achat',
      message: `${user.full_name} souhaite acheter votre bien`,
      action_url: `/dashboard/vendeur/requests/${requestId}`
    });
  }
};
```

---

## 🎯 PROBLÈME 4 : Workflow dashboards

### Dashboards concernés :

1. **Dashboard Vendeur** (`/dashboard/vendeur`)
   - Page overview
   - Page mes propriétés
   - Page demandes d'achat
   - Page notifications

2. **Dashboard Acheteur** (`/dashboard/particulier`)
   - Mes demandes
   - Mes favoris
   - Notifications

3. **Dashboard Admin** (`/dashboard/admin`)
   - Validation propriétés
   - Gestion demandes
   - Support tickets

### 🔍 Workflow à auditer :

#### Scénario complet :
```
1️⃣ VENDEUR (Heritage Fall)
   ├─ Créer propriété → ✅ Fait
   ├─ Upload photos → ⚠️ À vérifier
   └─ Attendre validation admin → ✅ Fait (verified)

2️⃣ ADMIN
   ├─ Voir demande validation → ✅ Fait
   ├─ Approuver → ✅ Fait
   └─ Status → verified ✅

3️⃣ SYSTÈME
   ├─ Publier sur /parcelles-vendeurs → ❌ NE FONCTIONNE PAS
   └─ Rendre visible publiquement → ❌ MOCK DATA

4️⃣ PARTICULIER
   ├─ Voir parcelle sur /parcelles-vendeurs → ❌ Impossible
   ├─ Clic "Détails" → /parcelle/:id → ⚠️ Vérifier
   ├─ Clic "Demande d'achat" → ⚠️ Vérifier
   └─ Formulaire soumission → ⚠️ Vérifier

5️⃣ VENDEUR (notification)
   ├─ Recevoir notification → ⚠️ Vérifier
   ├─ Email → ⚠️ Vérifier
   ├─ Dashboard : voir demande → ⚠️ Vérifier
   └─ Répondre à l'acheteur → ⚠️ Vérifier
```

---

## 📋 PLAN D'ACTION COMPLET

### Phase 1 : FIX CRITIQUE - Page parcelles (2-3h)

**Fichier** : `src/pages/ParcellesVendeursPage.jsx`

**Actions** :
1. ✅ Remplacer mock data par fetch Supabase
2. ✅ Adapter filtres à structure DB
3. ✅ Mapper colonnes DB → UI :
   ```jsx
   owner_id → seller
   full_name → sellerName
   role → sellerType
   ```
4. ✅ Tester affichage Heritage Fall

**Code à implémenter** :
```jsx
const [parcelles, setParcelles] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchParcelles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        owner:profiles!owner_id(
          id,
          full_name,
          email,
          role,
          avatar_url
        )
      `)
      .in('status', ['active'])
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false });

    if (!error) {
      // Mapper données DB → format UI
      const mapped = data.map(p => ({
        id: p.id,
        title: p.title,
        location: `${p.city}, ${p.region}`,
        region: p.region,
        city: p.city,
        price: p.price.toString(),
        surface: p.surface.toString(),
        type: p.property_type,
        seller: p.owner?.role || 'Inconnu',
        sellerName: p.owner?.full_name || 'Anonyme',
        sellerId: p.owner_id,
        sellerType: mapRoleToType(p.owner?.role),
        image: p.images?.[0] || '/placeholder.jpg',
        // ... autres champs
      }));
      setParcelles(mapped);
    }
    setLoading(false);
  };
  
  fetchParcelles();
}, []);

const mapRoleToType = (role) => {
  const mapping = {
    'vendeur': 'vendeur-particulier',
    'promoteur': 'promoteur',
    'agent': 'agent',
    'mairie': 'mairie'
  };
  return mapping[role] || 'vendeur-particulier';
};
```

### Phase 2 : FIX Page d'édition (1-2h)

**Fichiers à auditer** :
- `src/pages/EditPropertySimple.jsx`
- `src/pages/EditPropertyComplete.jsx`
- `src/pages/EditPropertyAdvanced.jsx`
- `src/pages/EditParcelPage.jsx`

**Actions** :
1. ✅ Identifier fichier actif dans routes
2. ✅ Vérifier chargement données (useEffect + useParams)
3. ✅ Vérifier UPDATE Supabase
4. ✅ Vérifier permissions RLS
5. ✅ Tester workflow complet

### Phase 3 : Demande d'achat (2h)

**Fichier** : `src/pages/ParcelleDetailPage.jsx`

**Actions** :
1. ✅ Créer table `purchase_requests` si n'existe pas
2. ✅ Ajouter bouton "Demande d'achat"
3. ✅ Implémenter formulaire modal
4. ✅ INSERT dans `purchase_requests`
5. ✅ Créer notification vendeur
6. ✅ Envoyer email vendeur (optionnel)
7. ✅ Afficher dans dashboard vendeur

**SQL table** :
```sql
CREATE TABLE IF NOT EXISTS purchase_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  buyer_email VARCHAR(255),
  buyer_phone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'canceled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);

-- RLS Policies
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Buyers can see their own requests"
  ON purchase_requests FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can see requests on their properties"
  ON purchase_requests FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "Buyers can create requests"
  ON purchase_requests FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can update requests"
  ON purchase_requests FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Admin full access"
  ON purchase_requests FOR ALL
  USING (get_user_role() = 'admin');
```

### Phase 4 : Dashboard vendeur - Demandes (1h)

**Nouveau fichier** : `src/pages/dashboards/vendeur/VendeurPurchaseRequests.jsx`

**Features** :
- Liste des demandes d'achat
- Filtres : pending, accepted, rejected
- Actions : Accepter, Refuser, Contacter
- Notifications en temps réel

### Phase 5 : Tests E2E (1h)

**Scénario complet** :
1. ✅ Login Heritage Fall
2. ✅ Voir propriété dashboard
3. ✅ Éditer propriété
4. ✅ Logout
5. ✅ Voir propriété sur `/parcelles-vendeurs`
6. ✅ Login particulier
7. ✅ Voir détail `/parcelle/9a2dce41...`
8. ✅ Faire demande d'achat
9. ✅ Logout
10. ✅ Login Heritage Fall
11. ✅ Voir demande dans dashboard
12. ✅ Accepter demande
13. ✅ Login particulier
14. ✅ Voir statut "Accepté"

---

## 🚨 BLOCAGES ACTUELS IDENTIFIÉS

### 1. ❌ CRITIQUE : Page parcelles ne charge pas Supabase
**Impact** : Aucune vraie parcelle visible  
**Priorité** : P0 - URGENT  
**Temps fix** : 2-3h

### 2. ⚠️ Page édition - Non auditée
**Impact** : Vendeur ne peut pas éditer  
**Priorité** : P1 - Important  
**Temps fix** : 1-2h

### 3. ⚠️ Demande d'achat - Non implémentée
**Impact** : Particuliers ne peuvent pas acheter  
**Priorité** : P1 - Important  
**Temps fix** : 2h

### 4. ⚠️ Dashboard vendeur - Demandes manquantes
**Impact** : Vendeur ne voit pas les demandes  
**Priorité** : P1 - Important  
**Temps fix** : 1h

---

## 📊 RÉSUMÉ TECHNIQUE

### Fichiers à modifier :

1. **`src/pages/ParcellesVendeursPage.jsx`** (URGENT)
   - Remplacer mock data par Supabase fetch
   - Adapter filtres
   - Mapper données DB → UI

2. **`src/pages/EditProperty*.jsx`** (À auditer)
   - Identifier fichier actif
   - Vérifier chargement + UPDATE

3. **`src/pages/ParcelleDetailPage.jsx`**
   - Ajouter bouton demande d'achat
   - Modal formulaire
   - INSERT purchase_request

4. **`src/pages/dashboards/vendeur/VendeurPurchaseRequests.jsx`** (À créer)
   - Liste demandes
   - Actions accept/reject

### Tables DB à créer/vérifier :

```sql
-- À créer
purchase_requests (id, property_id, buyer_id, seller_id, message, status, ...)

-- À vérifier structure
properties (✅ existe)
profiles (✅ existe)
notifications (✅ existe)
```

### Routes à ajouter :

```jsx
// src/routes/index.jsx
<Route path="/parcelle/:id" element={<ParcelleDetailPage />} />
<Route path="/edit-property/:id" element={<EditPropertyComplete />} />
<Route path="/dashboard/vendeur/requests" element={<VendeurPurchaseRequests />} />
```

---

## 🎯 PROCHAINES ÉTAPES

### Étape 1 : Exécuter audit edit page
```bash
grep -r "EditProperty\|EditParcel" src/routes/
```

### Étape 2 : Vérifier table purchase_requests
```sql
SELECT * FROM purchase_requests LIMIT 1;
```

### Étape 3 : Commencer fix ParcellesVendeursPage
- Remplacer mock data
- Implémenter fetch Supabase
- Tester affichage

### Étape 4 : Créer branch Git
```bash
git checkout -b fix/parcelles-vendeurs-supabase
```

---

**Document créé le** : 12 octobre 2025  
**Statut** : 🔴 AUDIT EN COURS  
**Priorité** : P0 - URGENT
