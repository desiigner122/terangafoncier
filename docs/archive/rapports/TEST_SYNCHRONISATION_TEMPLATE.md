# 🧪 TEST COMPLET: Synchronisation Bidirectionnelle

**Status**: 🔴 EN ATTENTE DE VOTRE TEST  
**Date**: 17 Oct 2025  
**Objective**: Identifier exactement où le problème de sync occurs

---

## 📋 SETUP: Avant de commencer

1. **Redémarrer dev server**:
   ```bash
   npm run dev
   ```

2. **Ouvrir navigateur en deux fenêtres**:
   - **Fenêtre A (SELLER)**: localhost:5173 → Login comme VENDEUR
   - **Fenêtre B (BUYER)**: localhost:5173 → Login comme ACHETEUR
   - Côte à côte si possible

3. **Ouvrir console (F12)** sur LES DEUX fenêtres

4. **Aller à la page correcte**:
   - Fenêtre A: Naviguer à "Mes Demandes Reçues" (VendeurPurchaseRequests)
   - Fenêtre B: Naviguer à "Mes Demandes" (ParticulierMesAchats)

---

## 🎬 SCÉNARIO 1: Vérifier si une demande existante s'affiche correctement

### ÉTAPE 1A: Vérifier dans la console du BUYER

Dans Fenêtre B (BUYER), ouvrir console et chercher les logs:

```
🎯 [BUYER DASHBOARD] Mount with user: <uuid>
🎯 [LOAD] Starting loadPurchaseRequests for user: <uuid>
✅ [LOAD] Requests loaded: <number>
✅ [LOAD] Purchase cases loaded: <number>
✅ [LOAD] FINAL requests set: <number>
📊 [FILTER] Tab 'pending': <number> results
```

**À Vérifier**:
- [ ] Les logs apparaissent-ils?
- [ ] Nombre de requests = ?
- [ ] Nombre de purchase_cases = ?
- [ ] Nombre de demandes en attente = ?

**Screenshot**: Prendre une capture de la console et l'envoyer

---

## 🎬 SCÉNARIO 2: Vérifier la synchronisation en temps réel

### ÉTAPE 2A: État initial

**Fenêtre A (SELLER)**:
- Regarder la list de demandes
- Voir combien sont en attente: ____
- Combien sont acceptées: ____

**Fenêtre B (BUYER)**:
- Regarder les demandes
- Nombre en "En attente": ____
- Nombre en "Acceptées": ____

### ÉTAPE 2B: VENDEUR accepte une demande

**Fenêtre A (SELLER)**:
1. Chercher une demande en statut "En attente"
2. Cliquer sur "ACCEPTER"
3. **Attendre la confirmation**
4. Ouvrir console et chercher les logs du VENDEUR
5. Noter les logs:

```
🎯 [ACCEPT] Début acceptation: <request-id>
✅ [ACCEPT] Purchase case created: <case-object>
✅ [ACCEPT] Transaction updated to "accepted"
```

### ÉTAPE 2C: Observer le BUYER en temps réel

**Fenêtre B (BUYER)**:
1. **Regarder console AVANT que vendeur accepte**
2. Attendre que le vendeur clique ACCEPTER
3. **Regarder console immédiatement**
4. Chercher ce log:

```
🟢 [REALTIME] CALLBACK TRIGGERED!
   Event type: INSERT
   New data: {id: "...", request_id: "...", case_number: "...", ...}
   🔄 Calling callback to reload...
```

**QUESTION CRITIQUE**: Voyez-vous ce log `🟢 [REALTIME] CALLBACK TRIGGERED!`?

- **OUI** → Real-time subscription fonctionne ✅
- **NON** → Real-time subscription ne marche pas ❌

### ÉTAPE 2D: Vérifier le rechargement

Si vous voyez le callback:

```
🎯 [LOAD] Starting loadPurchaseRequests...
✅ [LOAD] Requests loaded: <number>
✅ [LOAD] Transactions loaded: <number>
✅ [LOAD] Purchase cases loaded: <number>
   - PC: <pc-id>, Case#: <case-number>, Status: preliminary_agreement, RequestID: <request-id>
```

**À Vérifier**:
- [ ] Nouvelles purchase_cases chargées? (avant: 0, après: 1+)
- [ ] La transaction status est 'accepted'?
- [ ] Le purchase_case a un case_number?

### ÉTAPE 2E: Vérifier l'UI

**Fenêtre B (BUYER)**:
- La demande acceptée **devrait** maintenant apparaître dans le tab "Acceptées"
- Ou au minimum, **disparaître** du tab "En attente"

**Observation**: Que se passe-t-il?
1. [ ] La demande reste dans "En attente"
2. [ ] La demande passe à "Acceptées"
3. [ ] La demande disparaît complètement
4. [ ] Rien ne change

---

## 📊 RÉSUMÉ DES RÉSULTATS

Après avoir complété les étapes, remplissez ceci:

### Console Logs Observés:

| Log | Vu? | Timing |
|-----|-----|--------|
| `🟢 [REALTIME] CALLBACK TRIGGERED!` | OUI/NON | _____ |
| `🎯 [LOAD] Starting loadPurchaseRequests...` | OUI/NON | _____ |
| `✅ [LOAD] Purchase cases loaded: <1+>` | OUI/NON | _____ |
| `📋 [FILTER] ACCEPTED: <request-id> matches` | OUI/NON | _____ |

### UI Changes Observées:

| Changement | Observé? |
|-----------|----------|
| Demande passe du tab "En attente" à "Acceptées" | OUI/NON |
| Stat card "Acceptées" augmente | OUI/NON |
| Case number s'affiche | OUI/NON |

### Erreurs Console:

Avez-vous vu des erreurs en rouge?
```
Type: ___________
Message: ___________
Stack: ___________
```

---

## 🎯 DIAGNOSTIC BASÉ SUR VOS RÉSULTATS

**IF vous voyez le callback** → Real-time marche, le problème est ailleurs
**IF vous ne voyez PAS le callback** → Real-time ne s'établit pas

---

## 📸 INSTRUCTIONS POUR SCREENSHOT

Prendre des captures de:

1. **Console BUYER au mount** (avant acceptation)
   - Montrer les logs `🎯 [BUYER DASHBOARD]` et `🎯 [LOAD]`

2. **Console BUYER après acceptation par vendeur** (pendant les 10 secondes suivantes)
   - Montrer SI le callback se triggered

3. **Fenêtre B UI avant/après acceptation**
   - Montrer les tabs et le nombre de demandes

4. **Console SELLER quand j'accepte** (logs `🎯 [ACCEPT]`)

---

## ⚡ ACTIONS IMMÉDIATES À FAIRE

1. **Redémarrer dev server**: `npm run dev`
2. **Ouvrir 2 fenêtres** (Seller + Buyer côte à côte)
3. **Ouvrir F12** sur les deux
4. **Naviguer aux bonnes pages**
5. **Exécuter le scénario 2**
6. **Envoyer-moi**:
   - ✅ Les résultats du tableau résumé
   - ✅ Les logs critiques (copier-coller)
   - ✅ Les screenshots

---

## 📝 TEMPLATE POUR LA RÉPONSE

Quand vous me répondez, utilisez ce format:

```
🧪 RÉSULTATS DE TEST

Console BUYER:
[Copier-coller les logs pertinents ici]

Real-time callback vu? OUI/NON

Purchase cases reloadés? OUI/NON

UI updated? OUI/NON

Screenshots:
[Lien ou description des captures]

Observations:
[Tout autre détail important]
```

---

## 🚨 CRITICAL: Ne pas sauter d'étapes!

- ❌ Ne pas testermanuellement sans F12 ouvert
- ❌ Ne pas fermmer les consoles avant le test
- ❌ Ne pas redémarrer la page pendant le test
- ✅ Laisse le test complet se finir
- ✅ Note tous les détails
- ✅ Envoie moi TOUT (même les erreurs)

