# 🚨 URGENT FIXES - Toutes les erreurs du dashboard

## 1. ❌ PGRST200 - Erreur relationships conversations

**Problème:**
```
Searched for a foreign key relationship between 'conversations' and 'profiles' 
using the hint 'buyer_id' in the schema 'public', but no matches were found.
```

**Cause:** La colonne `buyer_id` n'existe pas dans `conversations`. La vraie structure est:
- `participant1_id` (UUID) - Participant 1
- `participant2_id` (UUID) - Participant 2

**Solution:**
Remplacer dans `src/pages/dashboards/vendeur/VendeurMessagesRealData.jsx`:
```jsx
// ❌ MAUVAIS:
.select(`
  *,
  profiles!buyer_id(id, first_name, last_name, email, avatar_url),
  properties!property_id(id, title, reference)
`)

// ✅ CORRECT:
.select(`
  *,
  profiles!participant1_id(id, first_name, last_name, email, avatar_url),
  properties!property_id(id, title, reference)
`)
```

**Fichiers à corriger:**
- [ ] VendeurMessagesRealData.jsx (lignes 64-80, 240-250, 269-280, 289-300)

---

## 2. ❌ NetworkError - purchase_requests:105:23

**Problème:**
```
TypeError: NetworkError when attempting to fetch resource. purchase-requests:105:23
```

**Cause:** La table `purchase_requests` a des colonnes manquantes ou incorrectes:
- `buyer_id` n'existe probablement pas
- `contact_id` n'existe pas (déjà supprimé)
- Table structure incorrecte

**Solution:**
Exécuter `FIX_MISSING_COLUMNS_COMPLETE.sql` sur Supabase:
```sql
-- Ajouter colonnes manquantes à purchase_requests si nécessaire
ALTER TABLE purchase_requests ADD COLUMN IF NOT EXISTS buyer_id UUID;
ALTER TABLE purchase_requests ADD COLUMN IF NOT EXISTS vendor_id UUID;
```

**Fichiers à exécuter:**
- [ ] `FIX_MISSING_COLUMNS_COMPLETE.sql` (dans Supabase SQL Editor)

---

## 3. ❌ HTTP 404 - `/api/create-checkout-session`

**Problème:**
```
XHRPOST http://localhost:5173/api/create-checkout-session [HTTP/1.1 404 Not Found]
Erreur création session paiement: SyntaxError: JSON.parse: unexpected end of data
```

**Cause:** L'endpoint API n'existe pas. SubscriptionPlans.jsx essaie d'appeler `/api/create-checkout-session`.

**Solution:**
Créer un fichier API backend (voir structure ci-dessous).

**À créer:**
- [ ] `src/api/create-checkout-session.js` (si Vite Middleware)
- [ ] Ou configurer Vite proxy vers backend réel

---

## 4. ⚠️ Table `property_views` manquante

**Problème:**
```
⚠️ Table property_views non disponible - statistiques limitées
```

**Cause:** La table `analytics_views` n'a pas été créée ou n'est pas nommée `property_views`.

**Solution:**
Exécuter le SQL:
```sql
CREATE TABLE IF NOT EXISTS analytics_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    view_timestamp TIMESTAMP DEFAULT NOW(),
    session_id VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    UNIQUE(property_id, viewer_id, session_id, view_timestamp::DATE)
);

CREATE INDEX idx_analytics_views_property ON analytics_views(property_id);
CREATE INDEX idx_analytics_views_date ON analytics_views(view_timestamp DESC);
```

**Fichiers à exécuter:**
- [ ] `FIX_MISSING_COLUMNS_COMPLETE.sql` (contient déjà cette table)

---

## 5. ⚠️ Multiple GoTrueClient instances

**Problème:**
```
Multiple GoTrueClient instances detected in the same browser context
```

**Cause:** Plusieurs instances de supabaseClient créées.

**Solution:**
Vérifier `src/lib/supabaseClient.js`:
```javascript
// ✅ CORRECT: Singleton pattern
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

export { supabase };
```

**Éviter:**
- Importer supabase de plusieurs endroits différents
- Créer plusieurs clients

**Fichier:**
- [ ] Vérifier `src/lib/supabaseClient.js`
- [ ] Audit tous les imports de supabase

---

## 📋 PLAN D'ACTION COMPLET

### Phase 1: Corrections immédiates (PRIORITÉ HAUTE)
1. ✅ Corriger PGRST200 dans VendeurMessagesRealData.jsx
   - Remplacer `buyer_id` → `participant1_id`

2. ✅ Corriger references conversations partout
   - Chercher tous les `.select('..., profiles!buyer_id(...)')`
   - Remplacer par `profiles!participant1_id(...)`

3. ⏳ Créer endpoint `/api/create-checkout-session`
   - Ou désactiver bouton Stripe pour le moment

### Phase 2: Migrations SQL (PRIORITÉ HAUTE)
4. ⏳ Exécuter `FIX_MISSING_COLUMNS_COMPLETE.sql`
   - Ajoute tables: `subscriptions`, `payment_transactions`, `analytics_views`
   - Ajoute colonnes: `profiles.address`, `properties.view_count`

5. ⏳ Vérifier RLS policies après migration

### Phase 3: Audit et tests (PRIORITÉ MOYENNE)
6. ⏳ Chercher toutes les références `buyer_id` → `participant_id`
7. ⏳ Tester chargement conversations
8. ⏳ Tester chargement purchase_requests
9. ⏳ Tester statistiques views

---

## 🔍 FICHIERS À CHERCHER

```bash
# Chercher toutes les références buyer_id
grep -r "buyer_id" src/pages/dashboards/vendeur/ --include="*.jsx"

# Chercher toutes les références conversations
grep -r "conversations" src/pages/dashboards/vendeur/ --include="*.jsx"

# Chercher toutes les API calls
grep -r "/api/create-checkout" src/ --include="*.jsx"
```

---

## ✅ PROCHAINES ÉTAPES

1. **Fixer PGRST200:**
   - Remplacer `buyer_id` par `participant1_id` dans VendeurMessagesRealData.jsx

2. **Créer API endpoint:**
   - Créer mock ou endpoint réel pour Stripe

3. **Exécuter SQL:**
   - Ouvrir Supabase SQL Editor
   - Copier `FIX_MISSING_COLUMNS_COMPLETE.sql`
   - Exécuter

4. **Redémarrer dev server:**
   - `npm run dev`
   - Tester dashboard complet

---

**Statut:** 🚨 CRITIQUE - À faire maintenant
**Temps estimé:** 30-45 minutes
**Priorité:** 1️⃣ HAUTE
