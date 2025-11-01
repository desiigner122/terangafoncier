# 🔍 DIAGNOSTIC - Problèmes d'affichage des demandes d'achat

## 📊 Analyse du problème

### Problème 1: Acheteur - Demandes ne s'affichent pas
**Page**: `ParticulierMesAchats.jsx`

**Flux actuel**:
```javascript
// Charge depuis la table 'requests'
.from('requests')
.select('*, parcels:parcel_id (...)')
.eq('user_id', user.id)

// Puis charge les purchase_cases
.from('purchase_cases')
.in('request_id', requestIds)
```

**Problèmes potentiels**:
1. ✅ La requête principal est correcte
2. ⚠️ Le filtrage par onglet peut être trop restrictif
3. ⚠️ Les `requests` peuvent ne pas avoir de `parcel_id` valide

### Problème 2: Vendeur - Page se charge mais rien ne s'affiche
**Page**: `VendeurPurchaseRequests.jsx`

**Flux actuel**:
```javascript
// 1. Récupère les parcelles du vendeur
.from('parcels')
.eq('seller_id', user.id)

// 2. Charge depuis 'transactions' avec ces parcelles
.from('transactions')
.in('parcel_id', parcelIds)
.in('transaction_type', ['purchase', 'request', 'offer'])
```

**Problèmes identifiés**:
1. ❌ Les demandes d'achat peuvent être dans `purchase_requests` et non dans `transactions`
2. ❌ La table `transactions` peut ne pas contenir toutes les demandes initiées par les acheteurs
3. ❌ Manque une vérification de la table `requests` qui est la source principale

## 🎯 Solutions

### Solution 1: Côté Acheteur - Améliorer les logs et la gestion vide

**Modifications à apporter**:
1. Ajouter plus de logs pour tracer le chargement
2. Vérifier si `requests` retourne des données
3. S'assurer que le filtrage ne masque pas les résultats

### Solution 2: Côté Vendeur - Charger depuis les bonnes tables

**Stratégie recommandée**:
```javascript
// ÉTAPE 1: Charger les parcelles du vendeur
const parcels = await supabase.from('parcels')
  .select('id')
  .eq('seller_id', user.id);

// ÉTAPE 2: Charger les demandes depuis 'requests' (source principale)
const requests = await supabase.from('requests')
  .select('*')
  .in('parcel_id', parcelIds);

// ÉTAPE 3: Charger les purchase_requests si la table existe
const purchaseRequests = await supabase.from('purchase_requests')
  .select('*')
  .in('property_id', parcelIds);

// ÉTAPE 4: Charger les transactions
const transactions = await supabase.from('transactions')
  .select('*')
  .in('parcel_id', parcelIds);

// ÉTAPE 5: Fusionner tous les résultats
```

## 🔧 Actions à prendre

### Priorité 1: Vérifier les données en base
```sql
-- Vérifier les demandes dans 'requests'
SELECT COUNT(*), status FROM requests GROUP BY status;

-- Vérifier les transactions
SELECT COUNT(*), transaction_type, status FROM transactions 
WHERE transaction_type IN ('purchase', 'request', 'offer')
GROUP BY transaction_type, status;

-- Vérifier purchase_requests si existe
SELECT COUNT(*), status FROM purchase_requests GROUP BY status;

-- Vérifier les parcelles d'un vendeur
SELECT id, title FROM parcels WHERE seller_id = 'VENDOR_UUID';
```

### Priorité 2: Corriger le chargement côté vendeur
- Modifier `loadRequests()` pour charger depuis `requests` d'abord
- Ajouter un fallback sur `transactions` si pas de résultats
- Enrichir avec les données des `purchase_cases`

### Priorité 3: Améliorer la robustesse côté acheteur
- Ajouter des logs détaillés
- Gérer le cas où `parcels` est null
- Améliorer les messages d'état vide

## 📝 Notes techniques

**Tables impliquées**:
- `requests`: Table principale des demandes (user_id = acheteur, parcel_id = terrain)
- `transactions`: Transactions financières (peut contenir des demandes)
- `purchase_requests`: Demandes d'achat spécifiques (vendor_id, buyer_id)
- `purchase_cases`: Dossiers d'achat (créés après acceptation)
- `parcels`: Terrains/Propriétés (seller_id = vendeur)

**Flux normal**:
1. Acheteur crée une demande → INSERT dans `requests`
2. Système peut créer une `transaction` associée
3. Vendeur accepte → Création d'un `purchase_case`
4. Le case avance dans le workflow
