# 🔍 DIAGNOSTIC - PROBLÈME "PAGE NON TROUVÉE"

## Problème Identifié

Quand vendeur clique "Voir le dossier" → 404 (page non trouvée)

## Root Cause Analysis

### 1. Flux de Création d'une Demande d'Achat

```
Acheteur crée demande d'achat
↓
INSERT INTO requests (user_id, parcel_id, status, ...)
↓
INSERT INTO transactions (buyer_id, request_id, parcel_id, ...)
↓
(Vendeur accepte)
↓
INSERT INTO purchase_cases (request_id, buyer_id, seller_id, ...)
```

### 2. Problème dans VendeurPurchaseRequests

**Ligne 548 du code:**
```javascript
const transactionIds = transactionsData.map(t => t.id);
const { data: purchaseCases } = await supabase
  .from('purchase_cases')
  .select('id, request_id, case_number, status')
  .in('request_id', transactionIds);  // ❌ BUG: transactionIds != request_ids
```

**Explaintion:**
- `transactionIds` = IDs from `transactions` table (transaction.id)
- `.in('request_id', ...)` filters `purchase_cases.request_id`
- But `purchase_cases.request_id` points to `requests` table, NOT `transactions` table!

### 3. Le Lien Manquant

Dans la table `transactions`, il y a probablement une colonne `request_id` qui indique à quelle demande elle est liée!

```
transactions.id = 'abc123'
transactions.request_id = 'req456'

purchase_cases.request_id = 'req456'
```

Donc:
- Requête actuelle: `.in('request_id', ['abc123'])` → NO MATCH (attendu 'req456')
- Requête correcte: `.in('request_id', [transaction.request_id])`

### 4. Map Incorrect

Ligne 564-568:
```javascript
purchaseCases.forEach(pc => {
  requestCaseMap[pc.request_id] = { ... }  // Map key = 'req456'
});

// Plus tard (ligne 581):
const caseInfo = requestCaseMap[transaction.id];  // Cherche 'abc123' → PAS TROUVÉ!
```

## Solution

Deux options:

### Option A: Utiliser le request_id de la transaction

```javascript
// Ligne 548-550
const transactionRequestIds = transactionsData
  .map(t => t.request_id)
  .filter(Boolean);

const { data: purchaseCases } = await supabase
  .from('purchase_cases')
  .select('id, request_id, case_number, status')
  .in('request_id', transactionRequestIds);

// Ligne 564-568 (aucun changement)
const requestCaseMap = {};
purchaseCases.forEach(pc => {
  requestCaseMap[pc.request_id] = { ... };
});

// Ligne 581
const caseInfo = requestCaseMap[transaction.request_id];  // ✅ CORRECT
```

### Option B: Joindre à transactions

```javascript
const { data: purchaseCases } = await supabase
  .from('purchase_cases')
  .select(`
    id, 
    request_id,
    case_number, 
    status
  `)
  .in('request_id', 
    transactionsData.map(t => t.request_id).filter(Boolean)
  );
```

## Vérification de la Structure

Commande pour vérifier la structure de la table `transactions`:

```sql
SELECT 
  t.id,
  t.request_id,
  pc.request_id,
  pc.case_number
FROM transactions t
LEFT JOIN purchase_cases pc ON pc.request_id = t.request_id
LIMIT 10;
```

Si `t.request_id` est NULL ou vide → première cause trouvée!

## Impact

Ce bug empêche:
1. ✅ Enrichissement des demandes avec les info du case (caseNumber, caseStatus)
2. ✅ Navigation vers `/vendeur/cases/${caseNumber}`
3. ✅ Affichage du badge "Dossier #TF-..."
