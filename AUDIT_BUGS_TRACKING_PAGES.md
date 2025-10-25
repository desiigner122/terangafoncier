/**
 * AUDIT DÉTAILLÉ: Bugs sur pages de suivi (Acheteur + Vendeur)
 * Date: 22 October 2025
 */

# 🔴 BUGS CRITIQUES IDENTIFIÉS

## Bug #1: seller_status déjà accepté, mais vendeur demande confirmation
**Sévérité**: CRITIQUE 🔴
**Symptôme**: 
- Acheteur voit "✓ Vendeur accepté"
- Vendeur voit bouton "Accepter" à nouveau disponible
- Si vendeur clique "Accepter" à nouveau → conflit de données

**Cause racine**:
```javascript
// RefactoredVendeurCaseTracking.jsx
const isDecisionPending = ['pending', '', null, undefined].includes(normalizedSellerStatus);

// Problème: si seller_status = 'accepted', isDecisionPending = false ✓
// MAIS buttons conditionnels n'évaluent pas correctement
```

**Location**: RefactoredVendeurCaseTracking.jsx ~340 (Card avec decision buttons)

**Impact**: 
- ❌ État inconsistant entre acheteur/vendeur
- ❌ Risque double-acceptance
- ❌ Confusion UX

**Solution**: 
- Si seller_status !== 'pending' → masquer les boutons accept/decline
- Afficher badge avec état courant (accepté/refusé)
- Disable buttons if already decided

---

## Bug #2: Vendeur pas visible dans liste participants côté acheteur
**Sévérité**: HAUTE 🟠
**Symptôme**:
- Tab "Participants" côté acheteur
- Affiche buyer, notary, geometre, agent
- ❌ MANQUANT: Vendeur (seller)

**Cause racine**:
```javascript
// ModernBuyerCaseTrackingV2.jsx ligne ~180
const participantMap = {
  buyer: null,
  seller: null,  // ← Initialisé
  notary: null,
  geometre: null,
  agent: null,
};

// Mais peut-être pas enrichi correctement?
// Ou pas affiché dans le tab participants?
```

**Location**: ModernBuyerCaseTrackingV2.jsx ~550+ (Tab Participants)

**Impact**:
- ❌ Acheteur ne voit pas info vendeur
- ❌ Pas de contact vendeur
- ❌ Impossibilité faire passer info au vendeur

**Solution**:
- Vérifier que seller_id bien chargé depuis purchase_cases
- Vérifier que seller profile bien enrichi
- Vérifier que tab participants affiche bien le seller
- Ajouter phone/email du seller

---

## Bug #3: Acheteur pas visible dans liste participants côté vendeur
**Sévérité**: HAUTE 🟠
**Symptôme**:
- Tab "Participants" côté vendeur
- Affiche seller, notary, geometre, agent
- ❌ MANQUANT: Acheteur (buyer)

**Cause racine**:
```javascript
// RefactoredVendeurCaseTracking.jsx ligne ~135
const participantMap = { 
  seller: null, 
  buyer: null,  // ← Initialisé
  notary: null, 
  geometre: null, 
  agent: null 
};

// Même logique que acheteur
// Mais buyer_id peut ne pas être chargé ou affiché
```

**Location**: RefactoredVendeurCaseTracking.jsx ~340+ (Tab Participants)

**Impact**:
- ❌ Vendeur ne voit pas info acheteur
- ❌ Pas de contact acheteur
- ❌ Communication impossible

**Solution**:
- Vérifier que buyer_id bien chargé
- Enrichir buyer profile
- Afficher dans tab participants
- Ajouter phone/email de l'acheteur

---

## Bug #4: Participants enrichment échoue (FK manquante)
**Sévérité**: MOYENNE 🟡
**Symptôme**:
- purchase_case_participants table peut ne pas exister
- FK user_id → profiles(id) peut ne pas être créée
- Requête join échoue
- participants array vide pour notary/geometre/agent

**Cause racine**:
```sql
-- CREATE_MISSING_ADMIN_TABLES.sql
CREATE TABLE purchase_case_participants (
  user_id UUID NOT NULL,
  -- FK NOT CREATED INITIALLY
)

-- Puis:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'purchase_case_participants_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE purchase_case_participants
    ADD CONSTRAINT purchase_case_participants_user_id_profiles_fkey
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END$$;
```

**Impact**:
- ❌ Participants enrichment échoue
- ❌ Aucun notary/geometre/agent affiché
- ⚠️ Fallback queries permettent à l'app de continuer
- ✅ Mais données manquantes = UX mauvaise

**Solution**:
- Exécuter CREATE_MISSING_ADMIN_TABLES.sql en Supabase
- Vérifier FK créée: `SELECT * FROM information_schema.table_constraints WHERE table_name='purchase_case_participants'`

---

## Bug #5: Affichage participants inconsistant
**Sévérité**: BASSE 🟢
**Symptôme**:
- Parfois buyer/seller affichés
- Parfois vides
- Comportement aléatoire

**Cause racine**:
- Timing issue: maybeSingle() peut retourner null si pas d'erreur mais pas de données
- Fallback queries en cascade
- Pas de garantie que buyer/seller enrichis avant render

**Location**: loadCaseData() fonction ~120-230

**Impact**:
- 🟡 Affichage inconsistant
- 🟡 Participants parfois manquants
- 🟡 Pas d'erreur (graceful degradation)

**Solution**:
- Ajouter logs console pour debug
- Vérifier que buyer_id/seller_id existants dans purchase_cases
- Tester avec données réelles

---

# 🛠️ MATRICE DE CORRECTIONS

| Bug | Acheteur | Vendeur | Frontend | SQL | Priority |
|-----|----------|---------|----------|-----|----------|
| #1: seller_status pending | N/A | 🔴 BUG | ✅ FIX | N/A | CRIT |
| #2: seller pas visible | 🔴 BUG | N/A | ✅ FIX | N/A | HIGH |
| #3: buyer pas visible | N/A | 🔴 BUG | ✅ FIX | N/A | HIGH |
| #4: FK manquante | ⚠️ Fallback | ⚠️ Fallback | N/A | 🔴 RUN | MED |
| #5: Inconsistent display | 🟡 Monitor | 🟡 Monitor | ✅ LOGS | N/A | LOW |

---

# 📋 PLAN DE FIX IMMÉDIAT

## Phase 1: Fix Frontend - Acheteur (15 min)

**File**: ModernBuyerCaseTrackingV2.jsx

**Changes**:
1. Vérifier que seller enrichi dans loadCaseData()
   - Ligne ~195: Ajouter logs après purchase_case_participants query
   - Vérifier que participantMap.seller !== null
   
2. Afficher seller dans tab Participants
   - Vérifier que tab "Participants" render seller
   - Ajouter card pour seller avec phone/email
   - Check que ordre correct: buyer(you), seller, others

3. Logs pour debug
   - console.log('Acheteur - Participants:', participantMap)
   - console.log('Acheteur - seller_status:', caseData.seller_status)

**Code locations**:
- loadCaseData(): ~120-230
- Participants enrichment: ~195-210
- Tab Participants render: ~550-620

---

## Phase 2: Fix Frontend - Vendeur (15 min)

**File**: RefactoredVendeurCaseTracking.jsx

**Changes**:
1. Vérifier que buyer enrichi
   - Ligne ~135: Vérifier que buyer_id loaded
   - Ajouter logs après participant queries
   
2. Afficher buyer dans tab Participants
   - Vérifier que buyer card visible
   - Ajouter phone/email
   
3. Masquer buttons si seller_status !== 'pending'
   - Ligne ~300 (Card avec decision buttons)
   - Change: `{isDecisionPending && <Card>}`
   - À: `{normalizedSellerStatus === 'pending' && <Card>}`
   - Ajouter badge: "Déjà {accepté|refusé}"

4. Logs pour debug
   - console.log('Vendeur - Participants:', participantMap)
   - console.log('Vendeur - seller_status:', caseData.seller_status)

**Code locations**:
- loadCaseData(): ~95-185
- Participant enrichment: ~135-165
- Decision buttons: ~290-320
- Tab Participants render: ~330-400

---

## Phase 3: Fix SQL (si pas encore exécuté)

**Files**:
- ADD_SELLER_STATUS_COLUMN.sql
- CREATE_MISSING_ADMIN_TABLES.sql

**Action**: Exécuter en Supabase SQL Editor

**Verification**:
```sql
-- Check columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'purchase_cases' AND column_name = 'seller_status';
-- Should return: seller_status

-- Check tables
SELECT * FROM information_schema.tables 
WHERE table_name IN ('messages_administratifs', 'purchase_case_participants');
-- Should return 2 rows

-- Check FK
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'purchase_case_participants' AND constraint_type = 'FOREIGN KEY';
-- Should return: purchase_case_participants_user_id_profiles_fkey
```

---

# 🐛 DEBUG CHECKLIST

## Acheteur Dashboard Debug:
```javascript
// In browser console (F12)
// Check 1: Case data loaded?
caseData.seller_id // Should be UUID

// Check 2: Seller profile loaded?
participants.seller // Should be object with name/email

// Check 3: seller_status exists?
caseData.seller_status // Should be 'pending'|'accepted'|'declined'

// Check 4: Badge visible?
// View page source, search for "Vendeur accepté"
```

## Vendeur Dashboard Debug:
```javascript
// In browser console (F12)
// Check 1: Case data loaded?
caseData.buyer_id // Should be UUID

// Check 2: Buyer profile loaded?
participants.buyer // Should be object with name/email

// Check 3: seller_status correct?
caseData.seller_status // Should be 'pending'|'accepted'|'declined'

// Check 4: Buttons visible/hidden correctly?
// If seller_status='pending' → buttons should be VISIBLE
// If seller_status='accepted' → buttons should be HIDDEN
```

---

# 📝 COMMIT MESSAGE PROPOSÉ

```
fix: correct buyer/seller case tracking page bugs

- Fix seller_status decision buttons logic (hide if already decided)
- Ensure seller visible in buyer participants tab
- Ensure buyer visible in vendor participants tab
- Add console logs for participant enrichment debug
- Verify FK relationships for participant loading

Fixes:
- Seller not visible in buyer participant list
- Buyer not visible in vendor participant list
- Vendor sees accept button even after already accepted
- Participant enrichment may fail without logs

Requires:
- ADD_SELLER_STATUS_COLUMN.sql executed
- CREATE_MISSING_ADMIN_TABLES.sql executed
```

---

# 🎯 SUCCESS CRITERIA

After fixes, should be able to:

1. ✅ Acheteur:
   - Load `/acheteur/cases/:caseNumber`
   - See seller info in Participants tab
   - See seller_status badge in header
   - Send message
   - No console errors

2. ✅ Vendeur:
   - Load `/vendeur/cases/:caseNumber`
   - See buyer info in Participants tab
   - See accept/decline buttons IF seller_status='pending'
   - NOT see buttons if seller_status='accepted' or 'declined'
   - Send message
   - No console errors

3. ✅ Real-time Sync:
   - Vendeur accepts
   - Acheteur sees change < 2 sec
   - Both see consistent seller_status

---

Generated: 2025-10-22 14:45 UTC
