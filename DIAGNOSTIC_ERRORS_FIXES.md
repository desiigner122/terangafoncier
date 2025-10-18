# 🔍 DIAGNOSTIC & PLAN DE CORRECTION - Erreurs Supabase

Date: 18 Octobre 2025

## 📊 ERREURS DÉTECTÉES

### 1. ❌ `profiles.address` - Colonne manquante
**Code**: `PGRST204`  
**Fichier**: `VendeurSettingsRealData.jsx` ligne ~175  
**Problème**: Tentative UPDATE `profiles` avec colonne `address` qui n'existe pas en production  
**Solution**: La colonne doit exister dans la migration mais n'a pas été appliquée. À ajouter à Supabase.

```javascript
// ACTUEL (CASSÉ)
.update({
  full_name: profileData.full_name,
  phone: profileData.phone,
  address: profileData.address,  // ← N'EXISTE PAS
  city: profileData.city,
  ...
})
```

### 2. ❌ `purchase_requests.buyer_id` - Requête incorrecte
**Code**: HTTP 400  
**Fichier**: `VendeurDashboardRefactored.jsx` ligne 91  
**Problème**: SELECT inclut `buyer_id` mais peut échouer lors du JOIN  
**Solution**: Retirer de SELECT si problème; buyer_id EXISTS dans le schéma

```javascript
// ACTUEL (potentiellement CASSÉ)
.select('id, property_id, status, created_at, buyer_id')
```

### 3. ❌ `conversations` - Pas de relation avec `profiles` via `buyer_id`
**Code**: `PGRST200`  
**Fichier**: Unknown (chargement conversations error)  
**Problème**: Conversations utilise `participant_1_id` / `participant_2_id`, pas `buyer_id`  
**Solution**: Utiliser les bonnes colonnes de reference

```sql
-- RÉEL dans Supabase
participant_1_id UUID REFERENCES profiles(id)
participant_2_id UUID REFERENCES profiles(id)

-- PAS:
buyer_id UUID  ← N'EXISTE PAS
```

### 4. ❌ `fraud_checks` - Contrainte STATUS
**Code**: `23514` (CHECK constraint violation)  
**Fichier**: `VendeurAntiFraudeRealData.jsx` ligne ~65  
**Problème**: INSERT `status = 'processing'` mais contrainte n'accepte que (pending, processing, passed, warning, failed)  
**Solution**: Vérifier le INSERT et la contrainte

```sql
-- CONTRAINTE:
CHECK (status IN ('pending', 'processing', 'passed', 'warning', 'failed'))

-- VALIDE: 'processing' EST autorisé (2e option)
```

### 5. ❌ `property_photos.ai_enhanced` - Upload échoue
**Code**: `PGRST204`  
**Fichier**: Unknown (upload error)  
**Problème**: SELECT réussit (colonne existe) mais INSERT peut échouer  
**Solution**: Vérifier fonction upload et contraintes

```sql
-- LA COLONNE EXISTE:
ai_enhanced BOOLEAN DEFAULT FALSE,

-- MAIS INSERT peut échouer si:
-- - Type de données incorrect
-- - RLS policy bloque l'accès
-- - Fonction trigger échoue
```

---

## 🔧 PLAN DE CORRECTION

### Phase 1: Fixes Immédiates (5 min)
- [ ] Remplacer les requêtes cassées par des alternatives sûres
- [ ] Ajouter try-catch autour des Supabase calls
- [ ] Commenter les colonnes problématiques

### Phase 2: Ajouter Colonnes Manquantes (10 min)
- [ ] Exécuter SQL pour ajouter `address` à `profiles`
- [ ] Valider les migrations appliquées

### Phase 3: Fixer Demandes (15 min)
- [ ] Charger `purchase_requests` correctement
- [ ] Afficher sur dashboard vendeur
- [ ] Charger `property_inquiries` en fallback

### Phase 4: Compteur de Vues (20 min)
- [ ] Créer table/colonne `view_count` sur properties
- [ ] Incrémenter à chaque visite
- [ ] Afficher sur dashboard

### Phase 5: Paiement/Abonnement (30 min)
- [ ] Créer page paiement Stripe
- [ ] Intégrer webhook Stripe
- [ ] Créer table `subscriptions` avec plans

---

## 🚀 PRIORISATION
1. Fixer erreurs Supabase (Phases 1-2)
2. Charger demandes correctement (Phase 3)
3. Ajouter compteur vues (Phase 4)
4. Paiement abonnement (Phase 5)

