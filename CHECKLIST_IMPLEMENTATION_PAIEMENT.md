# 🔧 CHECKLIST IMPLÉMENTATION PAIEMENT

## ✅ Phase 1: Base de Données (Immédiat)

- [ ] **Étape 1**: Accéder à [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] **Étape 2**: Sélectionner projet "Teranga Foncier"
- [ ] **Étape 3**: Aller à `SQL Editor`
- [ ] **Étape 4**: Copier contenu du fichier:
  ```
  FIX_MISSING_COLUMNS_COMPLETE.sql
  ```
- [ ] **Étape 5**: Exécuter le script complet
- [ ] **Étape 6**: Vérifier dans `Table Editor`:
  - [ ] `profiles` a colonnes: address, city, bio, company_name
  - [ ] `subscriptions` table exists
  - [ ] `payment_transactions` table exists
  - [ ] `analytics_views` table exists

---

## ✅ Phase 2: Configuration Stripe (30 min)

### 2a. Créer Compte Stripe

- [ ] Aller à [https://stripe.com](https://stripe.com)
- [ ] Cliquer "Sign Up"
- [ ] Remplir formulaire:
  - Email: admin@terangafoncier.sn
  - Password: [Sécurisé]
  - Pays: Senegal
  - Phone: +221 77 XXX XXXX

### 2b. Obtenir Clés API

- [ ] Dashboard Stripe → Settings → API Keys
- [ ] **Publishable Key** (commence par `pk_live_...`)
  ```
  → Copier dans: .env.local
  VITE_STRIPE_PUBLIC_KEY=pk_live_...
  ```
- [ ] **Secret Key** (commence par `sk_live_...`)
  ```
  → Copier dans: .env (côté serveur)
  STRIPE_SECRET_KEY=sk_live_...
  ```

### 2c. Webhook Setup

- [ ] Settings → Webhooks
- [ ] Cliquer "Add endpoint"
- [ ] URL: `https://yourdomain.com/api/webhooks/stripe`
- [ ] Events to send:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] Copier **Signing Secret**: 
  ```
  → Env: STRIPE_WEBHOOK_SECRET=whsec_...
  ```

### 2d. Créer Products & Prices

Dans Stripe Dashboard → Products:

**Basic Plan**:
- Name: "Basic Plan"
- Price: 4990 CFA (ou montant équivalent EUR)
- Billing Period: Monthly
- → Copier Price ID: `price_...`

**Pro Plan**:
- Name: "Pro Plan"
- Price: 9990 CFA
- Billing Period: Monthly
- → Copier Price ID: `price_...`

---

## ✅ Phase 3: Intégration Code (1-2 heures)

### 3a. Environment Variables

Fichier `.env.local`:
```env
# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Supabase (déjà existant)
VITE_SUPABASE_URL=https://ndenqikcogzrkrjnlvns.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 3b. Installer Dépendances

```bash
npm install @stripe/react-stripe-js @stripe/js
```

### 3c. Créer Endpoints API

Créer fichiers dans `/src/pages/api/`:

**`create-checkout-session.js`**:
```javascript
// POST endpoint pour créer session Stripe Checkout
// Reçoit: priceId, userId, planName
// Retourne: checkoutUrl
```

**`subscription-status.js`**:
```javascript
// GET endpoint pour vérifier statut abonnement
// Reçoit: userId
// Retourne: plan, active, nextBillingDate
```

**`webhooks/stripe.js`**:
```javascript
// POST endpoint pour webhooks Stripe
// Met à jour: subscriptions, payment_transactions
```

### 3d. Intégrer Composants

**`VendeurSettingsRealData.jsx`** (ajouter dans section Abonnement):
```jsx
import { SubscriptionPlans } from '@/components/SubscriptionPlans'

<SubscriptionPlans 
  user={user}
  currentPlan={subscriptionPlan}
  onPlanSelected={(plan) => refreshSubscription()}
/>
```

### 3e. Ajouter Gestion Erreurs

```jsx
import { SupabaseErrorDisplay } from '@/components/SupabaseErrorHandler'

const [supabaseError, setSupabaseError] = useState(null)

return (
  <>
    <SupabaseErrorDisplay 
      error={supabaseError} 
      onDismiss={() => setSupabaseError(null)}
    />
    {/* Rest of component */}
  </>
)
```

---

## ✅ Phase 4: Tester (30 min)

### 4a. Test Mode Stripe

- [ ] Dashboard Stripe → View Test Data
- [ ] Utiliser Stripe Test Cards:
  - ✅ Succès: `4242 4242 4242 4242`
  - ❌ Déclinée: `4000 0000 0000 0002`
  - ⚠️ Auth: `4000 2500 0000 3155`

### 4b. Tester Flow Complet

1. [ ] Se connecter app (vendeur)
2. [ ] Aller `/dashboard/vendeur/settings`
3. [ ] Voir plans d'abonnement
4. [ ] Cliquer "Choisir Basic"
5. [ ] Redirigé vers Stripe Checkout
6. [ ] Saisir card test: `4242 4242 4242 4242`
7. [ ] Expiry: `12/25`
8. [ ] CVC: `123`
9. [ ] Zip: `12345`
10. [ ] Paiement réussi → Redirection app
11. [ ] Vérifier dans Supabase:
    - [ ] Row dans `subscriptions` créé
    - [ ] Row dans `payment_transactions` créé
    - [ ] `status = 'completed'`

### 4c. Tester Erreurs

- [ ] Décline payment
- [ ] Vérifier error handling
- [ ] Vérifier message utilisateur clair

---

## ✅ Phase 5: Sécurité (15 min)

- [ ] Vérifier `.env` n'est pas commité
- [ ] Vérifier `.gitignore` inclut `.env`
- [ ] Vérifier Stripe keys sont live (pas test)
- [ ] Vérifier RLS policies actifs Supabase
- [ ] Vérifier webhook est sécurisé (signature check)

---

## ✅ Phase 6: Monitoring (Ongoing)

### Setup Monitoring:

- [ ] Stripe Dashboard → Logs (vérifier transactions)
- [ ] Supabase Dashboard → Query Performance
- [ ] Sentry/Error Tracking si applicable
- [ ] Email alerts pour failed payments

### Daily Checklist:

- [ ] Lire logs erreurs Stripe
- [ ] Vérifier paiements réussis
- [ ] Vérifier subscriptions actifs
- [ ] Répondre support tickets paiement

---

## 📞 Dépannage Courant

### ❌ "Stripe API key not found"
```
→ Vérifier .env.local existe
→ Vérifier VITE_STRIPE_PUBLIC_KEY=pk_live_...
→ Redémarrer dev server (npm run dev)
```

### ❌ "Webhook signature invalid"
```
→ Vérifier STRIPE_WEBHOOK_SECRET correct
→ Vérifier endpoint URL exact
→ Tester depuis Stripe Dashboard → Webhooks → Send test event
```

### ❌ "Payment intent declined"
```
→ Vérifier card valide (utilisé 4242 en test)
→ Vérifier amount > 0
→ Vérifier currency correct (XOF)
```

### ❌ "Subscription already exists"
```
→ User peut avoir 1 subscription active
→ Pour changer plan: update existing ou cancel+create
```

---

## 📊 Après Lancement

### Week 1:
- [ ] Tester avec vrais utilisateurs
- [ ] Recevoir feedback paiement
- [ ] Fix bugs urgents
- [ ] Envoyer confirmations email

### Week 2:
- [ ] Analyser données paiements
- [ ] Vérifier conversion Free → Basic
- [ ] ROI calculation
- [ ] Promotional codes setup

### Week 3+:
- [ ] Itérations basées feedback
- [ ] Ajouter mobile payments (Wave)
- [ ] Localisation Sénégal
- [ ] Optimiser conversion

---

## ✅ Checklist de Lancement Final

- [ ] SQL exécuté, colonnes existent ✓
- [ ] Stripe account créé et keys configurées ✓
- [ ] Environment variables définis ✓
- [ ] Dépendances installées ✓
- [ ] API endpoints créés ✓
- [ ] Composants intégrés ✓
- [ ] Erreurs gérées ✓
- [ ] Tests manuels réussis ✓
- [ ] Sécurité vérifiée ✓
- [ ] Monitoring en place ✓
- [ ] Documentations mises à jour ✓
- [ ] Vendeurs notifiés ✓
- [ ] **🚀 LAUNCH! 🚀**

---

**Questions?** Contactez: dev-team@terangafoncier.sn
