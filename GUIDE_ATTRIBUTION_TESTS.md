# ⚡ GUIDE RAPIDE - Attribution Notaire pour Tests

## 🎯 Objectif
Attribuer un notaire à un dossier d'achat existant pour tester le système.

---

## 📋 3 Scripts Disponibles

### 1️⃣ **ATTRIBUTION_AUTO_QUICK.sql** ⭐ RECOMMANDÉ

**Utilisation**: Le plus simple - Tout est automatique

**Ce qu'il fait**:
- ✅ Trouve automatiquement le premier dossier sans notaire
- ✅ Trouve automatiquement le meilleur notaire disponible
- ✅ Calcule les honoraires (2.5% du prix, min 50k, max 500k FCFA)
- ✅ Fait l'attribution complète (acheteur + vendeur + notaire OK)
- ✅ Met à jour tous les compteurs

**Comment l'utiliser**:
```sql
-- Dans Supabase SQL Editor
-- Copier/coller tout le fichier ATTRIBUTION_AUTO_QUICK.sql
-- Cliquer sur "Run"
-- ✅ C'est tout !
```

**Résultat attendu**:
```
🎉 ATTRIBUTION COMPLÉTÉE AVEC SUCCÈS !
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dossier: TF-20251029-0042
Notaire: Maître Amadou Diop
Honoraires: 125 000 FCFA
Status: notary_assigned
```

---

### 2️⃣ **TEST_ATTRIBUTION_NOTAIRE.sql**

**Utilisation**: Complet avec création notaire de test

**Ce qu'il fait**:
- ✅ Crée un notaire de test si aucun n'existe ("Maître Amadou Diop")
- ✅ Trouve un dossier sans notaire
- ✅ Fait l'attribution complète
- ✅ Affiche des vérifications détaillées

**Comment l'utiliser**:
```sql
-- Dans Supabase SQL Editor
-- Copier/coller tout le fichier TEST_ATTRIBUTION_NOTAIRE.sql
-- Cliquer sur "Run"
```

**Quand l'utiliser**:
- Si vous n'avez **aucun notaire** dans la base
- Si vous voulez **recréer** le notaire de test

---

### 3️⃣ **TEST_ATTRIBUTION_NOTAIRE_SIMPLE.sql**

**Utilisation**: Attribution manuelle avec IDs connus

**Ce qu'il fait**:
- ⚠️ Vous devez fournir les UUIDs manuellement
- ✅ Fait l'attribution avec les IDs fournis

**Comment l'utiliser**:
```sql
-- 1. Trouver vos IDs (première partie du script)
SELECT id, case_number FROM purchase_cases WHERE notaire_id IS NULL;
SELECT id, full_name FROM profiles WHERE role = 'notaire';

-- 2. Remplacer les UUIDs dans la partie DO $$
v_case_id UUID := 'votre-uuid-dossier';
v_notaire_id UUID := 'votre-uuid-notaire';
v_buyer_id UUID := 'votre-uuid-acheteur';
v_seller_id UUID := 'votre-uuid-vendeur';

-- 3. Exécuter
```

**Quand l'utiliser**:
- Si vous voulez **choisir précisément** quel notaire pour quel dossier
- Pour des tests spécifiques

---

## 🚀 Procédure Recommandée

### Étape 1: Exécuter la migration principale
```bash
# Déjà fait ✅
MIGRATION_NOTAIRE_ASSIGNMENT_SYSTEM.sql
```

### Étape 2: Attribution automatique
```bash
# Dans Supabase Console → SQL Editor
# Copier/coller: ATTRIBUTION_AUTO_QUICK.sql
# Run ✅
```

### Étape 3: Vérifier dans l'application

**Dashboard Notaire**:
```
URL: http://localhost:5173/notaire/cases
→ Le dossier doit apparaître dans la liste
→ Status: "En cours"
```

**Dashboard Acheteur**:
```
URL: http://localhost:5173/buyer/purchase-requests
→ Status doit être: "Notaire assigné"
→ Nom du notaire affiché
```

**Dashboard Vendeur**:
```
URL: http://localhost:5173/seller/sales
→ Status: "Notaire assigné"
→ Infos notaire visibles
```

---

## 🧪 Tests à Effectuer Après Attribution

### ✅ Test 1: Vérifier l'affichage du dossier
```javascript
// Dans NotaireCasesModernized.jsx
// Le dossier doit apparaître avec:
- Numéro dossier: TF-20251029-XXXX
- Acheteur: Nom complet
- Vendeur: Nom complet
- Prix: XXX XXX FCFA
- Honoraires: XXX XXX FCFA
- Status: "notary_assigned"
```

### ✅ Test 2: Communication tripartite
```javascript
// Ouvrir le dossier dans NotaireCommunicationModernized.jsx
// Tester envoi message:
NotaireSupabaseService.sendTripartiteMessage(user.id, {
  case_id: caseId,
  content: "Bonjour, je suis le notaire assigné",
  recipients: [buyerId, sellerId]
});
```

### ✅ Test 3: Informations parties
```javascript
// Vérifier que le notaire voit:
- Email acheteur
- Téléphone acheteur
- Email vendeur
- Téléphone vendeur
- Détails parcelle
```

### ✅ Test 4: Upload documents
```javascript
// Tester upload document dans NotaireAuthenticationModernized.jsx
// Ou dans la page du dossier
```

---

## 🔍 Vérifications SQL

### Vérifier l'attribution
```sql
SELECT 
  pc.case_number,
  pc.status,
  p.full_name as notaire,
  np.office_name,
  pc.notaire_fees,
  pc.notaire_assigned_at
FROM purchase_cases pc
JOIN profiles p ON pc.notaire_id = p.id
JOIN notaire_profiles np ON p.id = np.id
WHERE pc.notaire_id IS NOT NULL
ORDER BY pc.notaire_assigned_at DESC
LIMIT 5;
```

### Vérifier l'assignment
```sql
SELECT 
  nca.status,
  nca.notaire_status,
  nca.buyer_approved,
  nca.seller_approved,
  nca.quoted_fee,
  nca.assignment_score
FROM notaire_case_assignments nca
WHERE nca.status = 'notaire_accepted'
ORDER BY nca.created_at DESC
LIMIT 5;
```

### Vérifier le compteur notaire
```sql
SELECT 
  p.full_name,
  np.current_cases_count,
  np.max_concurrent_cases,
  np.rating
FROM notaire_profiles np
JOIN profiles p ON np.id = p.id
ORDER BY np.current_cases_count DESC;
```

---

## ❓ Problèmes Courants

### Problème 1: "Aucun dossier trouvé"
**Solution**:
```sql
-- Créer un dossier de test
INSERT INTO purchase_cases (buyer_id, seller_id, parcelle_id, purchase_price)
VALUES ('uuid-buyer', 'uuid-seller', 'uuid-parcelle', 5000000);
```

### Problème 2: "Aucun notaire disponible"
**Solution**:
```sql
-- Exécuter TEST_ATTRIBUTION_NOTAIRE.sql
-- Ou créer un notaire manuellement
```

### Problème 3: Le dossier n'apparaît pas dans l'UI
**Vérifier**:
1. Le service `NotaireSupabaseService.getCases(user.id)` fonctionne
2. L'UUID du notaire connecté correspond
3. Le status du dossier est correct

**Debug**:
```javascript
// Dans NotaireCasesModernized.jsx
console.log('User ID:', user.id);
console.log('Cases:', cases);

// Vérifier la requête Supabase
const { data, error } = await supabase
  .from('purchase_cases')
  .select('*')
  .eq('notaire_id', user.id);
console.log('Query result:', data, error);
```

---

## 📊 Données de Test Créées

Si vous utilisez **TEST_ATTRIBUTION_NOTAIRE.sql**, un notaire est créé:

```
Nom: Maître Amadou Diop
Email: notaire.test@terangafoncier.com
Office: Étude Notariale Maître Diop
Région: Dakar
Téléphone: +221 77 123 45 67
Rating: 4.8/5 (12 avis)
Expérience: 15 ans
Spécialisations: terrain, immobilier, succession, entreprise
Honoraires: 2.5% du prix (min 50k, max 200k FCFA)
```

---

## 🎯 Prochaines Étapes Après Tests

1. ✅ **Vérifier** que tout fonctionne avec 1 dossier
2. ✅ **Créer** 2-3 dossiers supplémentaires
3. ✅ **Créer** 2-3 notaires supplémentaires
4. ✅ **Tester** l'algorithme de scoring
5. ✅ **Tester** le workflow complet (proposition → approbations → acceptation)
6. ✅ **Créer** l'UI de sélection notaire
7. ✅ **Intégrer** dans le workflow acheteur/vendeur

---

## 📞 Support

**Questions ?**
- Documentation complète: `RECAP_SYSTEME_ATTRIBUTION_NOTAIRES.md`
- Service JavaScript: `src/services/NotaireAssignmentService.js`
- Migration SQL: `MIGRATION_NOTAIRE_ASSIGNMENT_SYSTEM.sql`

---

**Temps estimé pour attribution**: 2 minutes ⚡  
**Complexité**: ⭐☆☆☆☆ (Très simple - Copier/coller)  
**Status**: ✅ Prêt pour tests
