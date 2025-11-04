# 🔍 Audit des Incohérences - Pages de Suivi

## 🚨 Problèmes Identifiés

### 1. **Incohérence Nomenclature: notaire_id vs notary_id**

**Base de données**: Utilise `notaire_id`
**Code**: Mélange entre `notaire_id`, `notary_id`, `assigned_notary_id`

**Fichiers affectés**:
- ✅ `VendeurCaseTrackingModernFixed.jsx` - Utilise `notaire_id` (CORRECT)
- ❌ `VendeurPurchaseRequests.jsx` - Utilise `notary_id || notaire_id` (FALLBACK)
- ✅ `NotaireCasesModernReal.jsx` - Utilise `notaire_id` (CORRECT)
- ✅ `NotaireOverview_REAL_DATA.jsx` - Utilise `notaire_id` (CORRECT)
- ✅ `ParticulierCaseTrackingModern.jsx` - Utilise `notaire_id` (CORRECT)

**Action requise**: Uniformiser sur `notaire_id` partout

---

### 2. **Queries avec Mauvais Noms de Relations**

**Problème**: Certaines queries utilisent `notaire:profiles!notaire_id()` ce qui peut causer des erreurs si la foreign key n'est pas nommée correctement.

**Exemple**:
```javascript
// ❌ Peut échouer si FK mal nommée
notaire:profiles!notaire_id(id, full_name)

// ✅ Plus sûr
notaire:notaire_id(id, full_name)
```

---

### 3. **Incohérence purchase_price vs offered_price**

**Base de données**: 
- `purchase_cases.purchase_price` - Prix final validé
- `purchase_requests.offered_price` - Prix proposé initial

**Code**: Certains endroits confondent les deux

**Fichiers à vérifier**:
- ContextualActionsService.js
- Toutes les pages de tracking

---

### 4. **Incohérence status vs current_status**

**Base de données**: Colonne `status` uniquement
**Code**: Certains endroits cherchent `current_status`

**Exemple dans ContextualActionsService.js**:
```javascript
const status = purchaseCase?.status || purchaseCase?.current_status || 'initiated';
```

**Action**: Utiliser uniquement `status`

---

### 5. **Champs Manquants dans les SELECTs**

**Problème**: Certaines pages font des SELECT * puis accèdent à des champs qui n'existent pas

**Exemples**:
- `hasAgent` - N'existe pas en DB
- `hasSurveying` - N'existe pas en DB
- `notary_fees` - Devrait être calculé depuis `notaire_case_assignments.quoted_fee`

---

### 6. **Incohérence Calculs de Montants**

**Problème**: Plusieurs façons de calculer les montants

**Acompte (deposit)**:
- ❌ `purchaseCase.deposit_amount` (peut être null)
- ❌ `purchaseCase.offered_price * 0.10` (mauvais champ)
- ✅ `purchaseCase.purchase_price * 0.10` (correct)

**Frais notaire**:
- ❌ `purchaseCase.notary_fees` (n'existe pas)
- ❌ `purchaseCase.notaire_fees` (n'existe pas)
- ✅ `assignment.quoted_fee + assignment.quoted_disbursements` (correct)

---

### 7. **Incohérence Relations notaire_case_assignments**

**Problème**: Certaines pages ne chargent pas l'assignation

**Pages qui DOIVENT charger l'assignation**:
- ✅ VendeurCaseTrackingModernFixed.jsx - Charge (CORRECT)
- ✅ NotaireCaseDetailModern.jsx - Charge (CORRECT)
- ❌ ParticulierCaseTrackingModernRefonte.jsx - Ne charge PAS
- ❌ VendeurCaseTrackingModern.jsx - Ne charge PAS

---

### 8. **Incohérence Affichage Informations Notaire**

**Problème**: Plusieurs façons de récupérer les infos notaire

**Méthode 1**: Via notaire_id direct
```javascript
notaire:profiles!notaire_id(id, full_name, email)
```

**Méthode 2**: Via notaire_case_assignments
```javascript
notaire_assignment:notaire_case_assignments(
  *,
  notaire:profiles!notaire_id(id, full_name)
)
```

**Recommandation**: Toujours utiliser Méthode 2 (plus complet)

---

### 9. **Incohérence Gestion des Documents**

**Problème**: Types de documents incohérents

**Dans le code**:
- `buyer_id` (pièce d'identité)
- `title_deed` (titre foncier)
- `survey_plan` (plan bornage)
- `contract` (contrat)

**En base**: Colonne `document_type` peut avoir n'importe quelle valeur

**Action**: Créer un ENUM ou contrainte CHECK

---

### 10. **Incohérence États des Boutons d'Actions**

**Problème**: ContextualActionsService vérifie des champs qui n'existent pas

```javascript
if (!purchaseCase.hasAgent) { ... }  // ❌ hasAgent n'existe pas
if (!purchaseCase.hasSurveying) { ... }  // ❌ hasSurveying n'existe pas
```

**Solution**: Vérifier via tables liées (agent_assignments, surveying_missions)

---

## 🔧 Plan de Correction

### Phase 1: Nomenclature (URGENT)
1. ✅ Uniformiser tous les `notary_id` → `notaire_id`
2. ✅ Supprimer tous les fallbacks `notary_id || notaire_id`
3. ✅ Vérifier toutes les foreign keys

### Phase 2: Queries SELECT (URGENT)
1. ✅ Standardiser toutes les relations notaire
2. ✅ Toujours charger notaire_case_assignments quand pertinent
3. ✅ Utiliser les bons noms de champs

### Phase 3: Calculs de Montants (IMPORTANT)
1. ✅ Utiliser `purchase_price` au lieu de `offered_price`
2. ✅ Calculer frais notaire depuis assignment
3. ✅ Ajouter propriétés calculées dans services

### Phase 4: Validation des Champs (MOYEN)
1. ⏳ Créer helper pour vérifier agent/surveying
2. ⏳ Ajouter ENUMs pour document_type
3. ⏳ Valider tous les status possibles

### Phase 5: Tests (IMPORTANT)
1. ⏳ Tester chaque page de suivi
2. ⏳ Vérifier tous les calculs
3. ⏳ Valider affichages

---

## 📊 Priorités

### 🔴 URGENT (Bloque l'utilisation)
1. Uniformiser notaire_id vs notary_id
2. Corriger queries SELECT avec mauvais champs
3. Charger notaire_case_assignments partout où nécessaire

### 🟡 IMPORTANT (Fonctionnalités incorrectes)
1. Corriger calculs de montants
2. Afficher vraies infos notaire
3. Boutons d'actions avec bonnes conditions

### 🟢 MOYEN (Améliorations)
1. ENUMs pour types de documents
2. Validation des champs
3. Helpers pour vérifications

---

## ✅ Checklist de Vérification

### Pour chaque page de suivi:
- [ ] Utilise `notaire_id` (pas `notary_id`)
- [ ] Charge `notaire_case_assignments` si pertinent
- [ ] Affiche les bons montants (purchase_price, quoted_fee)
- [ ] Boutons d'actions basés sur vraies données
- [ ] Realtime sync configuré correctement
- [ ] Gestion d'erreurs appropriée
- [ ] Loading states corrects

---

**Créé**: 2025-11-02  
**Status**: 🚧 En cours d'analyse  
**Prochaine étape**: Commencer Phase 1 - Uniformiser nomenclature
