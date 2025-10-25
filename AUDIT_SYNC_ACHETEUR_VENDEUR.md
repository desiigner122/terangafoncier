/**
 * AUDIT COMPLET : SYNCHRONISATION ACHETEUR/VENDEUR
 * Analysis of buyer and seller dashboard synchronization
 * 
 * Date: October 22, 2025
 * Scope: Real-time case tracking alignment
 */

# 1. ARCHITECTURE GLOBALE

## Pages Actuelles:
- **Acheteur**: `src/pages/dashboards/particulier/ModernBuyerCaseTrackingV2.jsx` (850 lignes)
- **Vendeur**: `src/pages/dashboards/vendeur/RefactoredVendeurCaseTracking.jsx` (488 lignes)

## Points d'entrée:
- Acheteur: `/acheteur/cases/:caseNumber`
- Vendeur: `/vendeur/cases/:caseNumber` (via RefactoredVendeurCaseTracking)

---

# 2. STRUCTURE DES DONNÉES - SYNCHRONISATION

## Table: purchase_cases (centrale)
```
id UUID
case_number TEXT
status TEXT (workflow stage: initiated → completed)
seller_status TEXT ⚠️ MISSING - BLOCKER
buyer_id UUID (FK → profiles)
seller_id UUID (FK → profiles)
parcelle_id UUID (FK → parcels)
purchase_price DECIMAL
request_id UUID
created_at TIMESTAMP
updated_at TIMESTAMP
```

## Problèmes Identifiés:

### ❌ BLOCKER 1: Colonne `seller_status` manquante
- Erreur: "Could not find the 'seller_status' column"
- Impact: Page vendeur échoue au chargement
- Status accepté/refusé pas persisté
- **SOLUTION**: Exécuter ADD_SELLER_STATUS_COLUMN.sql

### ❌ BLOCKER 2: Table `purchase_case_participants` manquante/mal configurée
- Erreur possible: FK user_id → profiles non existante
- Impact: Enrichissement participant échoue
- **SOLUTION**: Exécuter CREATE_MISSING_ADMIN_TABLES.sql

### ❌ BLOCKER 3: Subscription real-time non synchronisée
- Acheteur et vendeur écoute le même `purchase_cases` table
- Mais filtres différents (buyer_id vs seller_id)
- Risque: Changements non propagés entre les deux vues

---

# 3. WORKFLOW DE SYNCHRONISATION

## Étape 1: Acheteur crée une demande
```
POST /acheteur/mes-achats → créer purchase_case (buyer_id = user.id, status = 'initiated')
RealTime Event → purchase_cases:insert → Notifie vendeur (seller_id)
```

## Étape 2: Vendeur reçoit et décide
```
GET /vendeur/purchase-requests → charge cases où seller_id = user.id
Vendeur clique "Accepter" → UPDATE purchase_cases.seller_status = 'accepted'
RealTime Event → purchase_cases:update → Notifie acheteur
```

## Étape 3: Acheteur voit la décision
```
Real-time subscription → purchase_case_changes
ModernBuyerCaseTrackingV2.jsx recharge via loadCaseData()
Page reflète seller_status (accepté/refusé)
```

---

# 4. COMPARAISON DÉTAILLÉE: ACHETEUR vs VENDEUR

## Acheteur (ModernBuyerCaseTrackingV2.jsx)
```javascript
// Structure:
- État: caseData, propertyData, participants, documents, messages, tasks, payments
- Tabs: 5 onglets (overview, participants, documents, tasks, messages)
- Participants: buyer(self), seller, notary, geometre, agent
- Actions possibles: Envoyer message, Ajouter document, Voir progression
- Affiche seller_status? NON (pas utilisé)

// Requêtes principales:
1. loadCaseData() → Select * from purchase_cases WHERE id=?
2. Enrichir participants → seller_id, buyer_id, puis purchase_case_participants
3. Loader messages → purchase_case_messages JOIN profiles
4. Loader documents → purchase_case_documents

// Real-time:
- Écoute purchase_cases WHERE id=? (tous les changements)
```

## Vendeur (RefactoredVendeurCaseTracking.jsx)
```javascript
// Structure:
- État: caseData, propertyData, participants, documents, messages, tasks
- Tabs: 5 onglets (same as buyer)
- Participants: seller(self), buyer, notary, geometre, agent
- Actions possibles: Envoyer message, ACCEPTER/REFUSER (unique)
- Affiche seller_status? OUI ✓ (accepté/refusé/en attente)

// Requêtes principales:
1. loadCaseData() → Select * from purchase_cases WHERE case_number=? AND seller_id=?
2. Enrichir participants → SAME as buyer
3. Loader messages → purchase_case_messages (SAME)
4. Loader documents → purchase_case_documents (SAME)

// Real-time:
- Écoute purchase_cases WHERE id=? (tous les changements)

// Actions spécifiques au vendeur:
- handleSellerDecision() → UPDATE purchase_cases (seller_status, status)
```

---

# 5. POINTS DE DÉSYNCHRONISATION

## ❌ Problème A: Requête case_number vs id
```
Acheteur: WHERE case_number=? (utilise URL param)
Vendeur: WHERE case_number=? AND seller_id=? (filtrage double)
→ Les deux devraient charger le même dossier ✓ (OK)
```

## ❌ Problème B: seller_status non visible côté acheteur
```
Acheteur voir si vendeur a accepté/refusé? NON
→ Acheteur devrait afficher seller_status dans Overview/Badge
→ FIX: Ajouter affichage seller_status côté acheteur
```

## ❌ Problème C: Participants enrichis différemment
```
Acheteur:
  1. Récupère buyer_id et seller_id depuis purchase_cases
  2. Puis cherche dans purchase_case_participants

Vendeur: (SAME)
  1. Récupère buyer_id et seller_id depuis purchase_cases
  2. Puis cherche dans purchase_case_participants

→ Les deux devraient voir les mêmes participants ✓ (OK si FK correct)
```

## ❌ Problème D: Messages pas filtrés par role
```
Acheteur voit: tous les messages du dossier
Vendeur voit: tous les messages du dossier
→ Les deux voient les MÊMES messages ✓ (OK - bon pour collaboration)
```

## ❌ Problème E: Documents pas filtrés par role
```
Acheteur voit: tous les documents du dossier
Vendeur voit: tous les documents du dossier
→ Les deux voient les MÊMES documents ✓ (OK - bon pour collaboration)
```

---

# 6. ISSUES CRITIQUES À CORRIGER

### Issue 1: Colonne seller_status manquante
**Sévérité**: CRITIQUE 🔴
**Ligne d'erreur**: RefactoredVendeurCaseTracking.jsx:220 (UPDATE purchase_cases)
**Solution**: 
```sql
ALTER TABLE purchase_cases ADD COLUMN seller_status TEXT DEFAULT 'pending';
```
**Action**: Exécuter ADD_SELLER_STATUS_COLUMN.sql en Supabase

### Issue 2: FK purchase_case_participants.user_id → profiles(id)
**Sévérité**: HAUTE 🟠
**Ligne d'erreur**: Potentiellement loadCaseData() à la ligne où enrichir les participants
**Solution**: Exécuter CREATE_MISSING_ADMIN_TABLES.sql
**Action**: Exécuter en Supabase

### Issue 3: Acheteur ne voit pas seller_status
**Sévérité**: MOYENNE 🟡
**Ligne d'erreur**: N/A (pas d'erreur, mais feature manquante)
**Solution**: Ajouter badge/affichage seller_status dans ModernBuyerCaseTrackingV2
**Action**: Code change required

### Issue 4: Real-time subscription filtrage
**Sévérité**: BASSE 🟢
**Ligne d'erreur**: N/A
**Solution**: Actuellement OK car les deux utilisateurs voient le même dossier
**Action**: Monitoring recommandé

---

# 7. PLAN DE SYNCHRONISATION OPTIMALE

## Architecture cible:

```
purchase_cases (central)
├── id (PK)
├── case_number
├── status (workflow: initiated → completed)
├── seller_status (pending | accepted | declined) ⭐ AJOUTER
├── buyer_id → profiles
├── seller_id → profiles
└── ...

├─ ACHETEUR voit:
   ├─ Overview: progress bar, seller_status badge ⭐ NEW
   ├─ Participants: buyer(you), seller, others
   ├─ Documents: shared by anyone
   ├─ Messages: from anyone
   └─ Actions: view, message, share doc

├─ VENDEUR voit:
   ├─ Overview: progress bar, seller decision buttons
   ├─ Participants: seller(you), buyer, others
   ├─ Documents: shared by anyone
   ├─ Messages: from anyone
   └─ Actions: accept/decline, message, view doc

└─ SYNC:
   ├─ Real-time: purchase_cases changes
   ├─ On seller decision: status change propagates instantly
   └─ On buyer action: vendor sees immediately
```

---

# 8. CHECKLIST DE FIX IMMÉDIAT

- [ ] **URGENT**: Exécuter ADD_SELLER_STATUS_COLUMN.sql
- [ ] **URGENT**: Exécuter CREATE_MISSING_ADMIN_TABLES.sql
- [ ] **HIGH**: Ajouter seller_status badge dans ModernBuyerCaseTrackingV2
- [ ] **HIGH**: Vérifier RLS policies sur tous les objets
- [ ] **MEDIUM**: Tester real-time sync acheteur ↔ vendeur
- [ ] **MEDIUM**: Ajouter logs console pour debug sync
- [ ] **LOW**: Optimiser requêtes pour performance

---

# 9. COMMIT MESSAGE PROPOSÉ

```
feat: add seller_status column and synchronization audit

- Add seller_status column to purchase_cases (pending|accepted|declined)
- Create audit document for buyer/seller synchronization
- Identify blockers: FK constraints, missing columns
- Plan seller_status display for buyer dashboard
- Prepare for real-time sync testing

BLOCKERS:
- PGRST204: seller_status column missing
- FK constraints on purchase_case_participants

NEXT:
- Execute ADD_SELLER_STATUS_COLUMN.sql
- Execute CREATE_MISSING_ADMIN_TABLES.sql
- Display seller_status in buyer overview
```

---

# 10. FICHIERS À METTRE À JOUR APRÈS FIX

### ModernBuyerCaseTrackingV2.jsx (acheteur)
- Ajouter affichage seller_status dans Overview tab
- Badge: "Vendeur accepte", "Vendeur refuse", "En attente de vendeur"
- Affiche aux lignes ~200-300

### RefactoredVendeurCaseTracking.jsx (vendeur)
- ✓ Déjà implémenté (seller_status affichage + accept/decline)

### VendeurDashboard.jsx (liste)
- Peut-être filtrer par seller_status pour priorité

---

# RÉSUMÉ EXÉCUTIF

La synchronisation acheteur/vendeur est **architecturalement solide** mais il y a **3 blockers critiques**:

1. ❌ Colonne `seller_status` manquante → Pages vendeur crash
2. ❌ FK `purchase_case_participants` mal configurée → Participants enrichis échouent
3. ❌ Acheteur ne voit pas la décision du vendeur → Feature UX manquante

**Actions immédiate**:
1. Exécuter 2 scripts SQL en Supabase
2. Ajouter seller_status display en acheteur
3. Tester sync real-time complet

**Timing**: 15 min pour fix, 5 min pour test = ~20 min total
