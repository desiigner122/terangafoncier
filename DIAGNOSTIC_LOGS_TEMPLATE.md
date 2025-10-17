# 🔧 FIX: Ajouter logs détaillés pour diagnostic

## FICHIER #1: RealtimeSyncService.js

```javascript
// Ligne ~195-230: subscribeToBuyerRequests()

static subscribeToBuyerRequests(buyerId, callback) {
  console.log(`🟢 [REALTIME] Creating subscription for buyer: ${buyerId}`);

  try {
    const subscription = supabase
      .channel(`buyer-requests-${buyerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_cases'
        },
        (payload) => {
          console.log('🟢 [REALTIME] CALLBACK TRIGGERED!');
          console.log('   Event type:', payload.eventType);
          console.log('   New data:', payload.new);
          console.log('   Old data:', payload.old);
          console.log('   🎯 Calling reload...');
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log(`🟢 [REALTIME] Subscription status: ${status}`);
      });

    this.subscriptions.push(subscription);

    return () => {
      console.log(`🔴 [REALTIME] Unsubscribe buyer requests`);
      supabase.removeChannel(`buyer-requests-${buyerId}`);
      this.subscriptions = this.subscriptions.filter(s => s !== subscription);
    };
  } catch (error) {
    console.error('🔴 [REALTIME] Error subscribing:', error);
    return () => {};
  }
}
```

---

## FICHIER #2: ParticulierMesAchats.jsx

### À LIGNE ~68-80 (useEffect)

```javascript
useEffect(() => {
  if (user) {
    console.log('🎯 [BUYER DASHBOARD] Mount with user:', user.id);
    loadPurchaseRequests();
    
    const unsubscribe = RealtimeSyncService.subscribeToBuyerRequests(
      user.id,
      (payload) => {
        console.log('🟢 [BUYER DASHBOARD] REAL-TIME EVENT RECEIVED!');
        console.log('   Payload:', payload);
        console.log('   🔄 Reloading purchase requests...');
        loadPurchaseRequests();
      }
    );
    
    console.log('🎯 [BUYER DASHBOARD] Subscription established, returning cleanup');
    return unsubscribe;
  }
}, [user]);
```

### À LIGNE ~135 (loadPurchaseRequests, début)

```javascript
const loadPurchaseRequests = async () => {
  try {
    setLoading(true);
    console.log('🎯 [LOAD] Starting loadPurchaseRequests for user:', user.id);

    // Charger les requests
    const { data: requestsData, error: requestsError } = await supabase
      .from('requests')
      .select(`...`)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (requestsError) throw requestsError;
    console.log('✅ [LOAD] Requests loaded:', requestsData?.length);

    if (requestsData && requestsData.length > 0) {
      const requestIds = requestsData.map(r => r.id);
      console.log('   Request IDs:', requestIds);
      
      // Charger les transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select('*')
        .in('request_id', requestIds);

      console.log('✅ [LOAD] Transactions loaded:', transactionsData?.length);
      transactionsData?.forEach(t => {
        console.log('   - TX:', t.id, 'Status:', t.status, 'Request:', t.request_id);
      });

      // Charger les purchase_cases
      const { data: purchaseCasesData } = await supabase
        .from('purchase_cases')
        .select('id, request_id, case_number, status, created_at, updated_at')
        .in('request_id', requestIds);

      console.log('✅ [LOAD] Purchase cases loaded:', purchaseCasesData?.length);
      purchaseCasesData?.forEach(pc => {
        console.log('   - PC:', pc.id, 'Case#:', pc.case_number, 'Status:', pc.status, 'RequestID:', pc.request_id);
      });

      // Créer la map
      const purchaseCaseMap = {};
      purchaseCasesData?.forEach(pc => {
        purchaseCaseMap[pc.request_id] = {
          caseId: pc.id,
          caseNumber: pc.case_number,
          caseStatus: pc.status,
          caseCreatedAt: pc.created_at,
          caseUpdatedAt: pc.updated_at
        };
      });

      console.log('📊 [LOAD] Purchase case map:', purchaseCaseMap);

      // Associer aux requests
      const requestsWithData = requestsData.map(request => {
        const hasCase = !!purchaseCaseMap[request.id];
        const caseStatus = purchaseCaseMap[request.id]?.caseStatus;
        console.log(`   🔗 Request ${request.id}: hasCase=${hasCase}, caseStatus=${caseStatus}`);
        
        return {
          ...request,
          transactions: transactionsData?.filter(t => t.request_id === request.id) || [],
          purchaseCase: purchaseCaseMap[request.id] || null,
          displayStatus: caseStatus || request.status
        };
      });

      setRequests(requestsWithData);
      console.log('✅ [LOAD] FINAL requests set:', requestsWithData.length);
      console.log('   Stats:');
      requestsWithData.forEach(r => {
        console.log(`     - ID: ${r.id}, Status: ${r.status}, HasCase: ${!!r.purchaseCase}, CaseStatus: ${r.purchaseCase?.caseStatus}`);
      });
    } else {
      console.log('✅ [LOAD] No requests found');
      setRequests([]);
    }
  } catch (error) {
    console.error('🔴 [LOAD] Error:', error);
  } finally {
    setLoading(false);
  }
};
```

### À LIGNE ~200-230 (filteredRequests calculation)

```javascript
const filteredRequests = requests.filter(request => {
  let matchesTab = false;
  
  if (activeTab === 'all') {
    matchesTab = true;
    console.log(`📋 [FILTER] ALL: ${request.id} matches`);
  } else if (activeTab === 'pending') {
    matchesTab = !request.purchaseCase && request.status === 'pending';
    if (matchesTab) console.log(`📋 [FILTER] PENDING: ${request.id} matches (hasCase=${!!request.purchaseCase})`);
  } else if (activeTab === 'accepted') {
    matchesTab = !!request.purchaseCase && request.purchaseCase.caseStatus === 'preliminary_agreement';
    if (matchesTab) console.log(`📋 [FILTER] ACCEPTED: ${request.id} matches (caseStatus=${request.purchaseCase?.caseStatus})`);
  } else if (activeTab === 'processing') {
    matchesTab = !!request.purchaseCase && ['contract_preparation', 'legal_verification', 'document_audit', 'payment_processing'].includes(request.purchaseCase.caseStatus);
    if (matchesTab) console.log(`📋 [FILTER] PROCESSING: ${request.id} matches`);
  } else if (activeTab === 'completed') {
    matchesTab = !!request.purchaseCase && request.purchaseCase.caseStatus === 'completed';
    if (matchesTab) console.log(`📋 [FILTER] COMPLETED: ${request.id} matches`);
  } else if (activeTab === 'rejected') {
    matchesTab = request.status === 'rejected';
    if (matchesTab) console.log(`📋 [FILTER] REJECTED: ${request.id} matches`);
  }
  
  const matchesSearch = searchTerm === '' || ...;
  return matchesTab && matchesSearch;
});

console.log(`📊 [FILTER] Tab '${activeTab}': ${filteredRequests.length} results`);
```

---

## FICHIER #3: VendeurPurchaseRequests.jsx

### À LIGNE ~240-280 (handleAccept)

```javascript
// Après création du purchase_case:
console.log('✅ [ACCEPT] Purchase case created:', purchaseCase);
console.log('   Case ID:', purchaseCase.id);
console.log('   Case Number:', purchaseCase.case_number);
console.log('   Case Status:', purchaseCase.status);
console.log('   Buyer ID:', purchaseCase.buyer_id);
console.log('   Seller ID:', purchaseCase.seller_id);
console.log('   Request ID:', purchaseCase.request_id);

// Après update transaction:
console.log('✅ [ACCEPT] Transaction updated to "accepted"');
console.log('   Transaction ID:', requestId);

// Dans le callback de setRequests:
console.log('✅ [ACCEPT] Local state updated');

// Avant le timeout:
console.log('✅ [ACCEPT] Done! Waiting 3 seconds before reload...');
```

---

## 📋 AFTER ADDING LOGS

1. Save all files
2. Restart dev server (npm run dev)
3. Open browser console (F12)
4. Open two windows:
   - Window A: Logged in as SELLER, on VendeurPurchaseRequests
   - Window B: Logged in as BUYER, on ParticulierMesAchats
5. In Window A: Click ACCEPT on a pending request
6. **Watch Window B console** for logs
7. Take a screenshot and send me

---

## EXPECTED LOGS SEQUENCE

### In Buyer Console:

```
🎯 [BUYER DASHBOARD] Mount with user: buyer-uuid
🎯 [LOAD] Starting loadPurchaseRequests...
✅ [LOAD] Requests loaded: 1
   Request IDs: ["req-123"]
✅ [LOAD] Transactions loaded: 1
   - TX: tx-456, Status: pending, Request: req-123
✅ [LOAD] Purchase cases loaded: 0
📊 [LOAD] Purchase case map: {}
✅ [LOAD] FINAL requests set: 1
   Stats:
     - ID: req-123, Status: pending, HasCase: false, CaseStatus: undefined
📋 [FILTER] PENDING: req-123 matches (hasCase=false)
📊 [FILTER] Tab 'pending': 1 results

🟢 [REALTIME] CALLBACK TRIGGERED!  ← SHOULD SEE THIS when vendor accepts
   Event type: INSERT
   New data: {id: "pc-789", request_id: "req-123", case_number: "CAS-001", ...}
   🎯 Calling reload...

🎯 [LOAD] Starting loadPurchaseRequests...
✅ [LOAD] Requests loaded: 1
   Request IDs: ["req-123"]
✅ [LOAD] Transactions loaded: 1
   - TX: tx-456, Status: accepted, Request: req-123  ← STATUS CHANGED!
✅ [LOAD] Purchase cases loaded: 1  ← NOW IT LOADS!
   - PC: pc-789, Case#: CAS-001, Status: preliminary_agreement, RequestID: req-123
...
```

---

## IF YOU DON'T SEE `🟢 [REALTIME] CALLBACK TRIGGERED!`

Then the real-time subscription is NOT working.

Solutions to try:
1. Check Supabase real-time settings (enabled for that table?)
2. Check RLS policies on purchase_cases table
3. Try unsubscribing and resubscribing manually
4. Check network tab for subscription establishment

