# 🎯 PHASE DE DIAGNOSTIC - PLAN D'ACTION IMMÉDIAT

**Situation Actuelle**: 
```
❌ Acheteur fait demande → Vendeur la voit (OK)
❌ Vendeur accepte → Acheteur ne le voit PAS (PROBLÈME)
```

**Root Cause Potentiel**: 
Real-time subscriptions ne synchronisent pas correctement dans les deux sens

---

## 📦 CE QUE J'AI DÉJÀ FAIT

### ✅ Commit: 4e49a61f

**Fichiers modifiés**:
1. `src/services/RealtimeSyncService.js`
   - Ajouté logs détaillés quand subscription crée
   - Ajouté logs quand callback se triggère
   - Ajouté logs de la payload reçue

2. `src/pages/dashboards/particulier/ParticulierMesAchats.jsx`
   - Ajouté logs au mount (subscription setup)
   - Ajouté logs à loadPurchaseRequests() (étape par étape)
   - Ajouté logs au filtrage (montre quel tab reçoit quoi)
   - Logs montrent exactement:
     * Combien de requests chargées
     * Combien de transactions chargées
     * Combien de purchase_cases chargées
     * Quel tab filtre quoi

**Logs critiques à surveiller**:
```
🟢 [REALTIME] CALLBACK TRIGGERED!  ← LE LOG LE PLUS IMPORTANT
   Event type: INSERT
   New data: {...}
```

Si ce log n'apparaît pas → Real-time ne marche pas

---

## 🧪 CE QUE VOUS DEVEZ FAIRE MAINTENANT

### ÉTAPE 1: Préparer l'environnement (5 min)

```bash
# Terminal 1: Redémarrer dev server
npm run dev
```

Puis ouvrir navigateur:
- **Tab A** (SELLER): localhost:5173
  - Login comme vendeur
  - Aller à "Mes Demandes Reçues" (VendeurPurchaseRequests)
  - Ouvrir Console (F12)

- **Tab B** (BUYER): localhost:5173 (incognito window si besoin)
  - Login comme acheteur
  - Aller à "Mes Demandes" (ParticulierMesAchats)
  - Ouvrir Console (F12)
  - Mettre côte à côte avec Tab A

### ÉTAPE 2: Observer l'état initial (2 min)

**Tab B (BUYER) Console**:
Chercher et noter les logs:
```
🎯 [BUYER DASHBOARD] Mount with user: ___________
✅ [LOAD] Requests loaded: ____ (nombre?)
✅ [LOAD] Purchase cases loaded: ____ (nombre?)
```

**Tab B (BUYER) UI**:
Combien de demandes en "En attente": ____

### ÉTAPE 3: Vendeur ACCEPTE (1 min)

**Tab A (SELLER)**:
1. Trouver une demande en statut "En attente"
2. Cliquer sur "ACCEPTER"
3. Attendre confirmation toast
4. Regarder console pour:
   ```
   ✅ [ACCEPT] Purchase case created: ...
   ```

### ÉTAPE 4: Observer le BUYER (10 sec)

**IMMÉDIATEMENT après acceptation, regarder Tab B (BUYER) console**:

**QUESTION CRITIQUE**: Voyez-vous ce log?
```
🟢 [REALTIME] CALLBACK TRIGGERED!
   Event type: INSERT
   New data: {...case_number: "CAS-...", ...}
```

- **OUI** ✅ → Passer à ÉTAPE 5
- **NON** ❌ → Passer à ÉTAPE 6

### ÉTAPE 5: SI CALLBACK VU (Diagnostic Avancé)

Regarder pour:
```
🎯 [LOAD] Starting loadPurchaseRequests...
✅ [LOAD] Purchase cases loaded: ____ (était 0, maintenant 1+?)
📋 [FILTER] ACCEPTED: _____ matches
```

**Question**: La demande a-t-elle CHANGÉ de tab dans l'UI?
- **OUI** → System marche! Contrecarrez à d'autres problèmes
- **NON** → Filter logic est cassée

### ÉTAPE 6: SI CALLBACK PAS VU (Critical Issue)

Chercher les erreurs:
```
- Avez-vous vu une erreur websocket?
- Avez-vous vu une erreur de permission?
- Avez-vous vu une erreur Supabase?
```

**Prendre screenshot** de la console entière

---

## 📊 RÉSULTATS ATTENDUS

### Scénario 1: Real-time marche ✅

```
Console Buyer immédiatement après acceptation vendeur:

🟢 [REALTIME] CALLBACK TRIGGERED!
   Event type: INSERT
   New data: {id: "...", request_id: "...", case_number: "CAS-2025-001", status: "preliminary_agreement"}
   🔄 Calling callback to reload...

🎯 [LOAD] Starting loadPurchaseRequests for user: buyer-uuid
✅ [LOAD] Requests loaded: 1
✅ [LOAD] Transactions loaded: 1
   - TX: tx-123, Status: accepted, Request: req-456
✅ [LOAD] Purchase cases loaded: 1
   - PC: pc-789, Case#: CAS-2025-001, Status: preliminary_agreement, RequestID: req-456
📊 [LOAD] Purchase case map: {req-456: {caseId: "pc-789", caseNumber: "CAS-2025-001", caseStatus: "preliminary_agreement"}}
✅ [LOAD] FINAL requests set: 1
   Stats:
     - ID: req-456, Status: pending, HasCase: true, CaseStatus: preliminary_agreement
📋 [FILTER] ACCEPTED: req-456 matches (caseStatus=preliminary_agreement)
📊 [FILTER] Tab 'all': 1 results

UI: Demande passe du tab "En attente" à "Acceptées"
```

### Scénario 2: Real-time NE marche PAS ❌

```
Console Buyer après acceptation vendeur:

[Rien d'autres logs après les logs initiaux]
[Pas de "🟢 [REALTIME] CALLBACK TRIGGERED!"]

UI: Demande RESTE dans "En attente"
```

---

## 🎤 CE QUE VOUS DEVEZ M'ENVOYER

Après le test, répondez avec:

```markdown
## 🧪 Résultats du Test

### Callback Real-time vu?
- [ ] OUI ✅
- [ ] NON ❌

### Si OUI - Logs observés:
[Copier-coller les logs 🟢 [REALTIME] CALLBACK TRIGGERED! à ici]

### Si NON - Erreurs console:
[Copier-coller toute erreur ici]

### UI Change observé?
- [ ] Demande passe à "Acceptées"
- [ ] Demande reste en "En attente"  
- [ ] Demande disparaît
- [ ] Rien ne change

### Request/Transaction IDs:
- Request ID: ___________
- Case Number: ___________

### Autres observations:
[Tout ce que vous remarquez]
```

---

## ⏱️ TIMELINE

- **5 min**: Setup
- **2 min**: Observer état initial
- **1 min**: Vendeur accepte
- **10 sec**: Observer buyer
- **2 min**: Noter résultats
- **TOTAL: 20 minutes**

---

## 🚨 IMPORTANT

**NE FERMEZ PAS LES CONSOLES** pendant le test!

Les logs vont VRAIMENT montrer exactement où le problème est.

Une fois que j'aurai vos résultats, je peux:
1. Fixer le real-time subscription (si cassé)
2. Fixer le filter logic (si data ne match pas)
3. Fixer les pages de tracking
4. Enlever tous les mockups
5. Créer les pages manquantes

**MAIS JE BESOIN DE VOS RÉSULTATS EN PREMIER** pour savoir exactement quoi fixer.

