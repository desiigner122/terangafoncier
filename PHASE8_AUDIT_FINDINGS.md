# Phase 8 - Audit Complet des Pages de Suivi

**Date**: 2025-01-XX  
**Objectif**: Vérification minutieuse de toutes les pages pour identifier les problèmes de synchronisation realtime, de chargement de données et d'affichage pour tous les acteurs.

---

## 🔍 AUDIT 1: ParticulierMesAchatsRefonte.jsx

### État: ⚠️ PROBLÈMES IDENTIFIÉS

### ✅ Points Positifs

1. **Structure de données complète**
   - Charge `purchase_cases` ET `requests` (dossiers acceptés + demandes en attente)
   - Enrichissement avec toutes les relations (property, seller, buyer, request)
   - Gestion correcte des deux sources de données

2. **Realtime subscription activée**
   - Channel: `purchase_cases_changes`
   - Filter: `buyer_id=eq.${user.id}`
   - Events: `*` (INSERT, UPDATE, DELETE)
   - Callback: Recharge `loadPurchaseCases()` à chaque changement

### ❌ PROBLÈMES CRITIQUES

#### **P1.1 - Realtime subscription incomplète**
**Sévérité**: 🔴 HAUTE  
**Location**: Lines 551-575 (setupRealtimeSubscriptions)

**Problème**:
- Souscrit uniquement à `purchase_cases`
- NE souscrit PAS à `requests` (demandes d'achat en attente)
- Si un vendeur fait une contre-offre, l'acheteur ne voit PAS la mise à jour en temps réel
- Si une demande passe de 'pending' à 'accepted', pas de notification

**Impact**:
- L'acheteur doit rafraîchir manuellement la page pour voir les nouvelles contre-offres
- Les changements de statut des demandes ne s'affichent pas en temps réel
- Mauvaise expérience utilisateur (pas de "temps réel")

**Code actuel**:
```javascript
const setupRealtimeSubscriptions = () => {
  try {
    // Subscribe to purchase_cases changes
    const subscription = supabase
      .channel('purchase_cases_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_cases',
          filter: `buyer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📡 [REALTIME] Changement dossier:', payload);
          toast.info('Liste mise à jour');
          loadPurchaseCases();
        }
      )
      .subscribe();

    console.log('✅ Realtime subscriptions activées');
  } catch (error) {
    console.error('Erreur setup realtime:', error);
  }
};
```

**Fix proposé**:
```javascript
const setupRealtimeSubscriptions = () => {
  try {
    // Subscribe to purchase_cases changes
    const casesChannel = supabase
      .channel('purchase_cases_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_cases',
          filter: `buyer_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📡 [REALTIME] Changement dossier:', payload);
          toast.info('Dossier mis à jour');
          loadPurchaseCases();
        }
      )
      .subscribe();

    // ✅ Subscribe to requests changes (for counter-offers and status updates)
    const requestsChannel = supabase
      .channel('requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'requests',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('📡 [REALTIME] Changement demande:', payload);
          toast.info('Nouvelle activité sur vos demandes');
          loadPurchaseCases();
        }
      )
      .subscribe();

    // ✅ Subscribe to negotiations (for counter-offers)
    const negotiationsChannel = supabase
      .channel('negotiations_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'negotiations'
        },
        async (payload) => {
          // Check if this negotiation is for one of buyer's requests
          const { data: request } = await supabase
            .from('requests')
            .select('id')
            .eq('id', payload.new.request_id)
            .eq('user_id', user.id)
            .single();
          
          if (request) {
            console.log('📡 [REALTIME] Nouvelle contre-offre reçue!');
            toast.info('Vous avez reçu une contre-offre!');
            loadPurchaseCases();
          }
        }
      )
      .subscribe();

    console.log('✅ Realtime subscriptions activées (3 channels)');
  } catch (error) {
    console.error('Erreur setup realtime:', error);
  }
};
```

#### **P1.2 - Cleanup des channels manquant**
**Sévérité**: 🟡 MOYENNE

**Problème**:
- `setupRealtimeSubscriptions()` ne retourne rien
- Le useEffect ligne 143 appelle `RealtimeNotificationService.unsubscribeAll()` dans le cleanup
- Mais ce service ne connaît PAS les channels créés dans `setupRealtimeSubscriptions()`
- Risque de fuite mémoire (channels non fermés)

**Fix proposé**:
```javascript
useEffect(() => {
  if (user) {
    loadPurchaseCases();
    const channels = setupRealtimeSubscriptions();

    return () => {
      // Cleanup channels properly
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }
}, [user]);

const setupRealtimeSubscriptions = () => {
  const channels = [];
  
  try {
    const casesChannel = supabase
      .channel('purchase_cases_changes')
      // ... rest of subscription
      .subscribe();
    channels.push(casesChannel);

    const requestsChannel = supabase
      .channel('requests_changes')
      // ... rest of subscription
      .subscribe();
    channels.push(requestsChannel);

    const negotiationsChannel = supabase
      .channel('negotiations_changes')
      // ... rest of subscription
      .subscribe();
    channels.push(negotiationsChannel);

    return channels;
  } catch (error) {
    console.error('Erreur setup realtime:', error);
    return channels;
  }
};
```

#### **P1.3 - Requêtes N+1 dans loadPurchaseCases**
**Sévérité**: 🟡 MOYENNE (Performance)  
**Location**: Lines 410-470

**Problème**:
- Pour chaque `purchase_case`, fait 4 requêtes séparées:
  1. request
  2. property (parcels)
  3. seller (profiles)
  4. buyer (profiles)
- Si l'utilisateur a 10 dossiers → 40 requêtes!
- Temps de chargement lent

**Solution**:
Utiliser des JOINs ou `.select()` avec relations étrangères:
```javascript
const { data: casesData, error: casesError } = await supabase
  .from('purchase_cases')
  .select(`
    *,
    request:requests(*),
    property:parcels(*),
    seller:profiles!seller_id(*),
    buyer:profiles!buyer_id(*)
  `)
  .eq('buyer_id', user.id)
  .order('created_at', { ascending: false });
```

**Note**: Nécessite que les foreign keys soient correctement définies dans Supabase.

#### **P1.4 - Négociations non chargées pour les requests**
**Sévérité**: 🔴 HAUTE

**Problème**:
- Lines 483-490: Code charge les négociations pour chaque request
- MAIS: Ne vérifie pas s'il y a des contre-offres EN ATTENTE
- L'interface ne montre pas visuellement si une contre-offre attend une réponse

**Impact**:
- L'acheteur peut ne pas voir qu'il a une contre-offre à traiter
- Les badges/notifications ne s'affichent pas correctement

**Fix**: Ajouter un indicateur visuel dans le rendu des cards:
```javascript
// Dans enrichedRequests mapping:
let activeNegotiation = null;
const { data: negotiations } = await supabase
  .from('negotiations')
  .select('*')
  .eq('request_id', req.id)
  .eq('status', 'pending') // ✅ Filtrer les en attente
  .order('created_at', { ascending: false })
  .limit(1);

if (negotiations && negotiations.length > 0) {
  activeNegotiation = negotiations[0];
}

return {
  ...req,
  property,
  seller,
  negotiations: allNegotiations, // Toutes pour l'historique
  activeNegotiation, // ✅ LA contre-offre en attente
  hasCounterOffer: !!activeNegotiation, // ✅ Flag booléen
  source: 'request',
  hasCase: false
};
```

---

## 🔍 AUDIT 2: ParticulierCaseTrackingModernRefonte.jsx

### État: ⚠️ PROBLÈMES IDENTIFIÉS

### ✅ Points Positifs

1. **Chargement complet des données**
   - Purchase case, request, property, seller, buyer, notaire, notaireAssignment
   - Messages, documents, appointments, payments, history
   - Gestion des deux formats de route (caseId UUID / caseNumber)

2. **Realtime pour messages et documents**
   - Messages: INSERT/UPDATE/DELETE (lines 368-406)
   - Documents: All events (lines 408-436)
   - Cleanup correct avec `supabase.removeChannel(channel)`

### ❌ PROBLÈMES CRITIQUES

#### **P2.1 - Pas de realtime sur purchase_cases**
**Sévérité**: 🔴 CRITIQUE

**Problème**:
- Souscrit aux messages et documents
- MAIS PAS au `purchase_cases` lui-même!
- Si le statut du dossier change (ex: vendeur approuve notaire), l'acheteur ne voit RIEN
- Si le notaire met à jour les frais, pas de mise à jour en temps réel

**Impact**:
- Le progress bar ne se met pas à jour
- Les actions disponibles ne changent pas
- L'utilisateur pense que rien ne se passe

**Fix proposé**:
```javascript
// Realtime: changements sur le purchase_case
useEffect(() => {
  if (!purchaseCase?.id) return;

  const channel = supabase
    .channel(`case-updates-${purchaseCase.id}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'purchase_cases',
      filter: `id=eq.${purchaseCase.id}`
    }, (payload) => {
      console.log('📡 [REALTIME] Dossier mis à jour:', payload.new);
      const normalizedStatus = WorkflowStatusService.normalizeStatus(payload.new.status);
      setPurchaseCase({ ...payload.new, status: normalizedStatus });
      toast.info('Dossier mis à jour');
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [purchaseCase?.id]);
```

#### **P2.2 - Pas de realtime sur notaire_case_assignments**
**Sévérité**: 🔴 CRITIQUE

**Problème**:
- Si le notaire accepte l'assignment → buyer ne voit rien
- Si le vendeur approuve le notaire → buyer ne voit rien
- Si le notaire met à jour les frais → buyer ne voit rien

**Fix proposé**:
```javascript
// Realtime: changements sur notaire_case_assignments
useEffect(() => {
  if (!purchaseCase?.id) return;

  const channel = supabase
    .channel(`case-assignments-${purchaseCase.id}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'notaire_case_assignments',
      filter: `case_id=eq.${purchaseCase.id}`
    }, async (payload) => {
      console.log('📡 [REALTIME] Assignment notaire mis à jour:', payload);
      
      if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
        setNotaireAssignment(payload.new);
        
        // Recharger le profil notaire si notaire_id a changé
        if (payload.new.notaire_id) {
          const { data: notaireData } = await supabase
            .from('profiles')
            .select('id, full_name, email, phone, avatar_url')
            .eq('id', payload.new.notaire_id)
            .single();
          
          if (notaireData) {
            setNotaire(notaireData);
          }
        }
        
        toast.info('Statut du notaire mis à jour');
      } else if (payload.eventType === 'DELETE') {
        setNotaireAssignment(null);
        setNotaire(null);
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [purchaseCase?.id]);
```

#### **P2.3 - Requêtes N+1 dans loadCaseData**
**Sévérité**: 🟡 MOYENNE (Performance)

**Problème**: Même problème que ParticulierMesAchatsRefonte
- 10 requêtes séquentielles (request, property, seller, buyer, notaire, assignment, messages, docs, appointments, payments, history)
- Peut être optimisé avec des JOINs

**Solution**: Utiliser les relations Supabase ou regrouper les requêtes avec Promise.all()

#### **P2.4 - Appointments avec gestion d'erreur try/catch**
**Sévérité**: 🟡 MOYENNE  
**Location**: Lines 314-330

**Problème**:
- Code utilise try/catch pour gérer les colonnes manquantes
- Indique que la structure de `calendar_appointments` n'est pas stable
- Warning: `⚠️ Erreur chargement rendez-vous (colonne manquante?)`

**Action requise**:
1. Vérifier la structure de `calendar_appointments` dans Supabase
2. S'assurer que la colonne `purchase_request_id` existe
3. Ajouter un index sur cette colonne pour performance
4. Si la colonne n'existe pas, créer une migration SQL

#### **P2.5 - Timeline ne se recharge pas automatiquement**
**Sévérité**: 🔴 HAUTE

**Problème**:
- `TimelineTrackerModern` reçoit `history` en prop
- Mais `history` n'est chargé qu'au début (ligne 346)
- Si un nouvel événement est ajouté à `purchase_case_history`, la timeline ne se met PAS à jour

**Fix proposé**:
```javascript
// Realtime: changements sur l'historique
useEffect(() => {
  if (!purchaseCase?.id) return;

  const channel = supabase
    .channel(`case-history-${purchaseCase.id}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'purchase_case_history',
      filter: `case_id=eq.${purchaseCase.id}`
    }, async (payload) => {
      console.log('📡 [REALTIME] Nouvel événement timeline:', payload);
      
      const normalizedEntry = {
        ...payload.new,
        status: WorkflowStatusService.normalizeStatus(payload.new.status),
        new_status: WorkflowStatusService.normalizeStatus(payload.new.new_status || payload.new.status),
      };
      
      setHistory((prev) => [normalizedEntry, ...prev]);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [purchaseCase?.id]);
```

---

## 📊 RÉSUMÉ DES PROBLÈMES IDENTIFIÉS

### 🔴 CRITIQUES (Must fix avant production)
1. **P1.1** - ParticulierMesAchatsRefonte: Pas de realtime sur `requests` et `negotiations`
2. **P1.4** - ParticulierMesAchatsRefonte: Contre-offres actives non identifiées
3. **P2.1** - ParticulierCaseTrackingModernRefonte: Pas de realtime sur `purchase_cases`
4. **P2.2** - ParticulierCaseTrackingModernRefonte: Pas de realtime sur `notaire_case_assignments`
5. **P2.5** - ParticulierCaseTrackingModernRefonte: Timeline ne se met pas à jour

### 🟡 MOYENNES (Améliore UX et performance)
1. **P1.2** - ParticulierMesAchatsRefonte: Cleanup channels manquant
2. **P1.3** - ParticulierMesAchatsRefonte: Requêtes N+1 (performance)
3. **P2.3** - ParticulierCaseTrackingModernRefonte: Requêtes N+1 (performance)
4. **P2.4** - ParticulierCaseTrackingModernRefonte: Structure calendar_appointments instable

---

## 📝 PROCHAINES ÉTAPES

### Ordre d'exécution recommandé:

1. **Fixer les problèmes CRITIQUES de realtime** (2-3 heures)
   - Ajouter subscriptions manquantes dans les 2 fichiers
   - Tester que les mises à jour s'affichent correctement

2. **Auditer pages VENDEUR** (1-2 heures)
   - VendeurPurchaseRequests.jsx
   - VendeurCaseTrackingModernFixed.jsx
   - Identifier problèmes similaires

3. **Auditer pages NOTAIRE** (1-2 heures)
   - NotaireCasesModernReal.jsx
   - NotaireCaseDetailModern.jsx

4. **Optimiser les requêtes N+1** (2-3 heures)
   - Implémenter JOINs Supabase
   - Tester performance

5. **Vérifier structure calendar_appointments** (30 min)
   - Créer migration si nécessaire

6. **Tests end-to-end** (2 heures)
   - Simuler workflow complet
   - Vérifier toutes les mises à jour realtime

---

## 🔍 AUDIT 3: VendeurPurchaseRequests.jsx

### État: ⚠️ PROBLÈMES IDENTIFIÉS

### ✅ Points Positifs

1. **Realtime subscription active**
   - Utilise `RealtimeSyncService.subscribeToVendorRequests()`
   - Cooldown de 1000ms pour éviter rechargements multiples
   - Cleanup correct dans le return du useEffect

2. **Chargement complet des données**
   - Requests ET transactions (double source)
   - Purchase cases pour vérifier dossiers existants
   - Negotiations pour contre-offres
   - Enrichissement avec profiles, parcels

### ❌ PROBLÈMES CRITIQUES

#### **P3.1 - Realtime subscription incomplète (RealtimeSyncService)**
**Sévérité**: 🔴 HAUTE

**Problème**:
- Utilise `RealtimeSyncService.subscribeToVendorRequests([], callback)`
- Passe tableau vide `[]` au lieu des parcel IDs
- Commentaire: "Les parcel IDs seront chargés dans loadRequests"
- MAIS le service a BESOIN des IDs pour filtrer correctement!

**Impact**:
- Si le filtre est basé sur parcel_id, la souscription ne reçoit AUCUN événement
- Le vendeur ne voit pas les nouvelles demandes en temps réel
- Doit rafraîchir manuellement

**Fix proposé**:
```javascript
useEffect(() => {
  if (user) {
    loadRequests();
  }
}, [user]);

useEffect(() => {
  if (!user || !requests || requests.length === 0) return;
  
  // Extraire les parcel IDs des requests chargées
  const parcelIds = [...new Set(
    requests
      .map(r => r.parcel_id || r.parcelId)
      .filter(Boolean)
  )];
  
  if (parcelIds.length === 0) return;
  
  console.log('📡 [REALTIME] Subscribing to', parcelIds.length, 'parcels');
  
  const unsubscribe = RealtimeSyncService.subscribeToVendorRequests(
    parcelIds,
    () => {
      console.log('🔄 [REALTIME] Vendor request update detected');
      loadRequests();
    }
  );
  
  return () => {
    unsubscribe();
  };
}, [user, requests]); // ✅ Dépendance sur requests
```

#### **P3.2 - Requêtes N+1 multiples**
**Sévérité**: 🟡 MOYENNE (Performance)

**Problème**:
- Lines 683-799: Pour chaque demande, fait plusieurs requêtes:
  1. Requests (avec filter IN parcelIds)
  2. Transactions (avec filter IN parcelIds)
  3. Purchase_cases (avec filter IN requestIds)
  4. Negotiations (avec filter IN requestIds)
  5. Profiles (avec filter IN buyerIds)
- Mais ensuite map sur TOUTES les demandes individuellement
- Si 50 demandes → charge tout d'un coup MAIS traite 50× dans le map

**Impact**: Temps de traitement lent (pas de requêtes multiples mais traitement lourd)

**Solution**: OK comme tel, mais pourrait optimiser le traitement avec reduce() ou for loop au lieu de map()

#### **P3.3 - Pas de realtime sur negotiations**
**Sévérité**: 🔴 HAUTE

**Problème**:
- Charge les negotiations une fois au début (line 769)
- MAIS si l'acheteur fait une nouvelle contre-offre, le vendeur ne voit RIEN
- Doit attendre le rechargement complet via `subscribeToVendorRequests()`

**Fix**: Ajouter subscription spécifique aux negotiations:
```javascript
useEffect(() => {
  if (!user || !requests || requests.length === 0) return;
  
  const requestIds = requests.map(r => r.id).filter(Boolean);
  if (requestIds.length === 0) return;
  
  const channel = supabase
    .channel('seller-negotiations')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'negotiations'
    }, async (payload) => {
      // Check if this negotiation affects seller's requests
      if (requestIds.includes(payload.new?.request_id)) {
        console.log('📡 [REALTIME] Nouvelle négociation:', payload);
        toast.info('Nouvelle activité sur vos demandes');
        await loadRequests();
      }
    })
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}, [user, requests]);
```

---

## 🔍 AUDIT 4: VendeurCaseTrackingModernFixed.jsx

### État: ⚠️ PROBLÈMES IDENTIFIÉS

### ✅ Points Positifs

1. **Utilise useRealtimeCaseSync hook**
   - Line 71: `useRealtimeCaseSync(purchaseCase?.id, () => loadCaseData())`
   - Abstraction propre de la logique realtime
   - Callback pour recharger les données

2. **Realtime pour messages et documents**
   - Messages: INSERT/UPDATE/DELETE (lines 305-343)
   - Documents: All events (lines 344-363)
   - Cleanup correct avec `supabase.removeChannel(channel)`

### ❌ PROBLÈMES CRITIQUES

#### **P4.1 - useRealtimeCaseSync peut être insuffisant**
**Sévérité**: 🟡 MOYENNE

**Problème**:
- Dépend entièrement de `useRealtimeCaseSync` hook
- Ne sait pas ce que ce hook écoute exactement
- Si le hook ne souscrit pas à `notaire_case_assignments`, le vendeur ne verra pas l'acceptation notaire

**Action requise**: 
1. Vérifier le contenu de `useRealtimeCaseSync` hook
2. S'assurer qu'il souscrit à:
   - purchase_cases (status changes)
   - notaire_case_assignments (approvals, fees)
   - purchase_case_history (timeline events)

#### **P4.2 - Messages chargés deux fois**
**Sévérité**: 🟢 FAIBLE (Code smell)

**Problème**:
- Lines 284-302: useEffect charge les messages une fois
- Lines 305-343: useEffect realtime gère les mises à jour
- Le premier useEffect est redondant car les messages sont déjà chargés dans `loadCaseData()`

**Fix**: Supprimer le premier useEffect (lines 284-302):
```javascript
// ❌ Supprimer ce useEffect redondant
useEffect(() => {
  const fetchMessages = async () => {
    if (!purchaseCase?.id) {
      setMessages([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('purchase_case_messages')
        .select('*')
        .eq('case_id', purchaseCase.id)
        .order('created_at', { ascending: false });
      if (!error) setMessages(data || []);
    } catch (err) {
      console.warn('⚠️ Erreur chargement messages (vendeur):', err);
    }
  };
  fetchMessages();
}, [purchaseCase?.id]);
// ✅ Les messages sont déjà chargés dans loadCaseData()
```

#### **P4.3 - Pas de realtime sur purchase_cases (même problème que P2.1)**
**Sévérité**: 🔴 CRITIQUE

**Problème**: Si `useRealtimeCaseSync` ne gère pas les updates de `purchase_cases`, même problème que buyer page

**Fix**: Vérifier useRealtimeCaseSync ou ajouter subscription explicite

#### **P4.4 - Pas de realtime sur notaire_case_assignments (même problème que P2.2)**
**Sévérité**: 🔴 CRITIQUE

**Problème**: Si le notaire accepte ou l'acheteur approuve, le vendeur ne voit pas la mise à jour

**Fix**: Ajouter subscription explicite ou vérifier que useRealtimeCaseSync le fait

---

## 📊 RÉSUMÉ DES PROBLÈMES (ACHETEUR + VENDEUR)

### 🔴 CRITIQUES (Must fix avant production)
1. **P1.1** - ParticulierMesAchatsRefonte: Pas de realtime sur `requests` et `negotiations`
2. **P1.4** - ParticulierMesAchatsRefonte: Contre-offres actives non identifiées
3. **P2.1** - ParticulierCaseTrackingModernRefonte: Pas de realtime sur `purchase_cases`
4. **P2.2** - ParticulierCaseTrackingModernRefonte: Pas de realtime sur `notaire_case_assignments`
5. **P2.5** - ParticulierCaseTrackingModernRefonte: Timeline ne se met pas à jour
6. **P3.1** - VendeurPurchaseRequests: Realtime subscription avec parcel IDs vides
7. **P3.3** - VendeurPurchaseRequests: Pas de realtime sur `negotiations`
8. **P4.3** - VendeurCaseTrackingModernFixed: Realtime sur purchase_cases à vérifier (hook)
9. **P4.4** - VendeurCaseTrackingModernFixed: Realtime sur notaire_case_assignments à vérifier (hook)

### 🟡 MOYENNES (Améliore UX et performance)
1. **P1.2** - ParticulierMesAchatsRefonte: Cleanup channels manquant
2. **P1.3** - ParticulierMesAchatsRefonte: Requêtes N+1 (performance)
3. **P2.3** - ParticulierCaseTrackingModernRefonte: Requêtes N+1 (performance)
4. **P2.4** - ParticulierCaseTrackingModernRefonte: Structure calendar_appointments instable
5. **P3.2** - VendeurPurchaseRequests: Traitement lourd de toutes les demandes
6. **P4.1** - VendeurCaseTrackingModernFixed: Dépendance sur useRealtimeCaseSync non vérifiée

### 🟢 FAIBLES (Nice to have)
1. **P4.2** - VendeurCaseTrackingModernFixed: Messages chargés en double

---

## ⏭️ AUDIT EN COURS

**Tâche actuelle**: Auditer pages notaire (NotaireCasesModernReal.jsx, NotaireCaseDetailModern.jsx)
**Progression**: 4/7 tâches complétées

**Actions critiques identifiées**:
1. Vérifier le contenu de `useRealtimeCaseSync` hook (PRIORITAIRE)
2. Vérifier `RealtimeSyncService.subscribeToVendorRequests()` (PRIORITAIRE)
3. Ajouter realtime subscriptions manquantes pour tous les acteurs
