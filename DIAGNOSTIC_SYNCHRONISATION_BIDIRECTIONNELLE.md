# 🔍 DIAGNOSTIC: Problème de Synchronisation Bidirectionnelle

**Problème Confirmé**:
```
✅ ACHETEUR crée demande → VENDEUR la voit immédiatement
❌ VENDEUR accepte → ACHETEUR NE la voit PAS
```

---

## 📊 ANALYSE DU FLOW ACTUEL

### ÉTAPE 1: Acheteur crée une demande

```javascript
// ParticulierMakeOfferPage.jsx OU CheckoutPage.jsx
POST /requests
{
  user_id: buyerId,
  parcel_id: parcelId,
  payment_type: 'one_time' | 'installments' | 'bank_financing',
  status: 'pending'
}

// PUIS crée une transaction:
POST /transactions
{
  request_id: requestId,
  buyer_id: buyerId,
  seller_id: sellerId,
  parcel_id: parcelId,
  amount: price,
  status: 'pending'
}
```

**✅ Vendeur VOIT**: 
- RealtimeSyncService.subscribeToVendorRequests() écoute `transactions` table
- Quand la transaction est INSERT → callback appelé → loadRequests() exécuté
- VendeurPurchaseRequests affiche la nouvelle demande

---

### ÉTAPE 2: Vendeur accepte la demande

```javascript
// VendeurPurchaseRequests.jsx handleAccept()
// 2A. Crée purchase_case:
POST /purchase_cases
{
  request_id: requestId,
  buyer_id: buyerId,
  seller_id: sellerId,
  status: 'preliminary_agreement',
  case_number: 'CAS-2025-001'
}

// 2B. Met à jour transaction:
PATCH /transactions/{requestId}
{
  status: 'accepted'
}
```

**❌ ACHETEUR NE VOIT PAS**:

1. ParticulierMesAchats s'abonne à `purchase_cases`:
   ```javascript
   RealtimeSyncService.subscribeToBuyerRequests(buyerId, callback)
   // Écoute: purchase_cases table, ALL events
   ```

2. **MAIS**: La subscription utilise le channel name avec `buyerId`:
   ```javascript
   .channel(`buyer-requests-${buyerId}`)
   .on('postgres_changes', {...table: 'purchase_cases'})
   ```

3. **PROBLÈME #1**: Channel name ne filtre PAS automatiquement
   - Channel name est juste un nom pour identifier la subscription
   - La vraie filter se fait dans `event` settings
   - DONC tous les purchase_cases changes sont reçus, pas seulement ceux du buyer

4. **PROBLÈME #2**: Pas de filtre RLS appliqué par le channel
   - Le callback reçoit TOUS les purchase_cases updates
   - Pas de vérification que c'est pour ce buyer
   - Les permissions RLS sont appliquées à la requête SELECT, pas au real-time

5. **PROBLÈME #3**: Le callback recharge `loadPurchaseRequests()` MAIS:
   - loadPurchaseRequests() filtre par `user_id = buyerId` dans requests table
   - ```javascript
     .from('requests')
     .eq('user_id', user.id)  // ← C'EST BON
     ```
   - MAIS ensuite il charge purchase_cases par `in('request_id', requestIds)`
   - Si la demande existe déjà dans `requests` table → purchase_case se charge
   - ✅ Donc théoriquement ça DEVRAIT fonctionner...

---

## 🔴 VRAI PROBLÈMES IDENTIFIÉS

### Problème #1: Service RealtimeSyncService utilise OLD API

**Fichier**: `src/services/RealtimeSyncService.js`

Lines 20-45 (OLD API):
```javascript
// ❌ DEPRECATED - Cette API ne marche plus!
static subscribeToPurchaseCaseUpdates(requestId, callback) {
  const subscription = supabase
    .from('purchase_cases')
    .on('*', (payload) => {  // ← .on() est DEPRECATED
      callback(payload);
    })
    .subscribe();
}
```

Lines 195-228 (NEW API - OK):
```javascript
// ✅ C'est la bonne API
static subscribeToBuyerRequests(buyerId, callback) {
  const subscription = supabase
    .channel(`buyer-requests-${buyerId}`)
    .on('postgres_changes', {  // ← Bonne API
      event: '*',
      schema: 'public',
      table: 'purchase_cases'
    }, callback)
    .subscribe();
}
```

**CONCLUSION**: `subscribeToBuyerRequests()` utilise la BONNE API, donc ce n'est pas le problème.

---

### Problème #2: Les OLD API calls ne sont PAS utilisées

Cherchons qui utilise `subscribeToPurchaseCaseUpdates()`:

```bash
grep -r "subscribeToPurchaseCaseUpdates" src/
```

**RÉSULTAT**: Aucun fichier ne l'utilise! C'est du code mort.

**DONC**: Ce n'est pas la source du problème.

---

### Problème #3: Les subscriptions ne sont JAMAIS nettoyées/revalidées

Regardons ParticulierMesAchats:

```javascript
// Ligne ~50-65
useEffect(() => {
  if (user) {
    loadPurchaseRequests();
    
    const unsubscribe = RealtimeSyncService.subscribeToBuyerRequests(
      user.id,
      (payload) => {
        console.log('🔄 [REALTIME] Purchase case update detected, reloading...');
        loadPurchaseRequests();
      }
    );
    
    return unsubscribe;
  }
}, [user]);
```

**PROBLÈME POTENTIEL**: 
- Subscription est créée au mount
- Elle écoute `purchase_cases` table
- Quand un purchase_case est INSERT/UPDATE → callback appelé
- Callback recharge les demandes

**MAIS**: Si la subscription n'est pas bien établie ou si elle "meurt" → plus de real-time!

---

### Problème #4: VRAI PROBLÈME - Filtre RLS sur purchase_cases

**TABLE**: `purchase_cases`

La table a probablement une RLS policy:
```sql
-- Policy possible:
CREATE POLICY "Acheteur et vendeur peuvent voir le dossier"
ON purchase_cases
FOR SELECT
USING (
  auth.uid() = buyer_id 
  OR auth.uid() = seller_id
);
```

**CE QUI SIGNIFIE**:
- Real-time subscription respecte les RLS policies!
- Si un buyer Q reçoit une notification d'un purchase_case où il est NOT buyer_id, la RLS le refuse
- DONC la subscription reçoit les updates... mais ne les FILTRE pas via RLS
- Ou elle refuse l'accès et ne reçoit rien

**À VÉRIFIER**: Est-ce qu'une purchase_case est bien liée au buyer?

```sql
-- Vérifier:
SELECT id, request_id, buyer_id, status 
FROM purchase_cases 
WHERE request_id = (SELECT id FROM requests WHERE user_id = 'buyer-uuid');
```

Si buyer_id est NULL ou incorrect → RLS refuse l'accès → pas de real-time update!

---

### Problème #5: VRAI VRAI PROBLÈME - Pas de lien entre requests et purchase_cases

Regardons ParticulierMesAchats loadPurchaseRequests():

```javascript
// Lines 100-115
const { data: requestsData } = await supabase
  .from('requests')
  .select(`
    *,
    parcels:parcel_id (...)
  `)
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });

// Lines 120-130
const { data: purchaseCasesData } = await supabase
  .from('purchase_cases')
  .select('id, request_id, case_number, status, created_at, updated_at')
  .in('request_id', requestIds);  // ← Filter par request_id
```

**LE PROBLÈME**:
- Charge les requests de l'acheteur ✅
- Charge les purchase_cases associés ✅
- MAIS: Si la purchase_case n'a pas le bon buyer_id...
  
**À VÉRIFIER**: Quand le vendeur crée une purchase_case, met-il le buyer_id?

```javascript
// VendeurPurchaseRequests.jsx handleAccept()
const result = await PurchaseWorkflowService.createPurchaseCase({
  request_id: requestId,
  buyer_id: transaction.buyer_id,  // ← OUI, c'est mis!
  seller_id: transaction.seller_id,
  ...
});
```

Donc buyer_id DEVRAIT être correct.

---

## 🎯 HYPOTHÈSES RESTANTES

### Hypothèse #1: Subscription n'est jamais établie

**Symptôme**: Le callback n'est JAMAIS appelé

**Test**:
```javascript
// Ajouter dans ParticulierMesAchats:
useEffect(() => {
  if (user) {
    const unsubscribe = RealtimeSyncService.subscribeToBuyerRequests(
      user.id,
      (payload) => {
        console.log('🔄 CALLBACK APPELÉ!', payload);  // ← Mettre log ICI
      }
    );
    return unsubscribe;
  }
}, [user]);
```

**À FAIRE**: Ouvrir console → faire accepter une demande en tant que vendeur → Voir si ce log s'affiche

---

### Hypothèse #2: Subscription meurt après X temps

**Symptôme**: Works initially, then stops

**Solution**: Re-establish subscription or use reconnect logic

---

### Hypothèse #3: RLS policy refuse l'accès

**Test**:
```sql
-- Vérifier les policies:
SELECT pol.schemaname, pol.tablename, pol.policyname, 
       pol.permissive, pol.roles, pol.qual, pol.with_check
FROM pg_policies pol
WHERE tablename = 'purchase_cases';
```

---

## 📋 ACTION PLAN

### ÉTAPE 1: Enable Console Logs (10 min)

Add detailed logging to:
1. `RealtimeSyncService.subscribeToBuyerRequests()`
   - Log when subscription created
   - Log when callback is called
   - Log payload received

2. `ParticulierMesAchats` loadPurchaseRequests()
   - Log when called
   - Log data received
   - Log purchase_cases loaded

3. `VendeurPurchaseRequests` handleAccept()
   - Log when purchase_case created
   - Log buyer_id set correctly

### ÉTAPE 2: Test Manually (15 min)

1. Open browser console (F12)
2. Seller tab: Stay on VendeurPurchaseRequests
3. Buyer tab: Go to ParticulierMesAchats
4. Seller: Click ACCEPT on a pending request
5. **Watch both consoles** for logs

### ÉTAPE 3: Analyze Results

- If subscription callback logs appear → Real-time works
- If loadPurchaseRequests logs appear → Data loads
- If purchase_cases data loads → Filtering works
- If none appear → Something is broken

### ÉTAPE 4: Fix Based on Findings

---

## 🚨 CRITICAL NEXT STEP

**YOU MUST DO THIS FIRST**:

1. Open ParticulierMesAchats.jsx
2. Add `console.log('🟢 SUBSCRIPTION CALLBACK:', payload);` to the callback
3. Add `console.log('📦 Purchase cases loaded:', purchaseCasesData?.length);` in loadPurchaseRequests()
4. Save and reload
5. **TELL ME WHAT LOGS APPEAR WHEN A VENDOR ACCEPTS A REQUEST**

This will tell us exactly where the problem is.

---

## 📝 CURRENT HYPOTHESIS (MOST LIKELY)

**The subscription IS working**, but:

1. Vendor accepts → Creates purchase_case ✅
2. Real-time event fires ✅
3. Callback reloads demands ✅
4. **BUT**: The component already shows the request as PENDING
5. After reload, it STILL shows as PENDING
6. **REASON**: The requests table still has `status: 'pending'`
7. And the tab filter checks for `!purchaseCase && status === 'pending'`
8. **FIX NEEDED**: The tab logic needs to check BOTH requests and transactions status

**VÉRIFIER**: Line 200-227 in ParticulierMesAchats.jsx - does it check transaction.status?

