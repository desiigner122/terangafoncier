# 🗺️ GUIDE DE LOCALISATION - Fonctionnalités Abonnement & Paiement

**Date**: 18 Octobre 2025  
**Créé par**: GitHub Copilot

---

## 📂 Structure Fichiers - OÙ TROUVER QUOI

### 🎨 Composants React (UI)

#### **1. Abonnement & Plans**
```
📍 src/components/SubscriptionPlans.jsx (345 lignes)
   ├─ Export: <SubscriptionPlans user={user} currentPlan="free" />
   ├─ Affiche: 4 plans (Free, Basic, Pro, Enterprise)
   ├─ Fonctionnalité: Sélection plan + redirection paiement Stripe
   ├─ Styles: Cards avec badges, pricing, features list
   └─ Props: user, currentPlan, onPlanSelected

💡 USAGE:
import { SubscriptionPlans } from '@/components/SubscriptionPlans';

<SubscriptionPlans 
  user={user}
  currentPlan={subscription.plan_name}
  onPlanSelected={(plan) => console.log('Selected:', plan)}
/>
```

#### **2. Gestion Erreurs Supabase**
```
📍 src/components/SupabaseErrorHandler.jsx (175 lignes)
   ├─ Export: useSupabaseError(), parseSupabaseError(), SupabaseErrorDisplay
   ├─ Fonctionnalité: Parse codes erreur Supabase en messages utilisateur
   ├─ Codes gérés: PGRST204, PGRST200, 23514, 42P01, etc.
   ├─ Affichage: Toast/modal rouge avec suggestions d'action
   └─ Auto-logging: Console logs structurés pour debug

💡 USAGE:
import { useSupabaseError, SupabaseErrorDisplay } from '@/components/SupabaseErrorHandler';

const { handleError } = useSupabaseError();

try {
  // Supabase call...
} catch (error) {
  const parsed = handleError(error, 'payment');
  setErrorDisplay(parsed);
}

<SupabaseErrorDisplay error={errorDisplay} onDismiss={() => setErrorDisplay(null)} />
```

---

### 📄 Pages React

#### **1. Guide Paiement Vendeur**
```
📍 src/pages/PaymentGuideVendeur.jsx (420 lignes)
   ├─ Route: /payment-guide ou /dashboard/vendeur/payment-guide
   ├─ Affiche: 4 onglets (How-It-Works, Payment Methods, FAQ, Support)
   ├─ Contenu: Guide complet vendeur + comparaison plans + ROI
   ├─ Responsive: Desktop + Mobile friendly
   └─ Coloration: Gradient dark (gris/violet)

💡 USAGE:
import PaymentGuideVendeur from '@/pages/PaymentGuideVendeur';

// Dans router:
{
  path: '/payment-guide',
  element: <PaymentGuideVendeur />
}
```

#### **2. Existing Payment Pages**
```
📍 src/pages/PaymentPage.jsx
   └─ Page de paiement générique

📍 src/pages/admin/SubscriptionManagement.jsx
   └─ Panel admin pour gérer abonnements

📍 src/pages/buy/OneTimePayment.jsx, InstallmentsPayment.jsx
   └─ Paiements acheteurs (B2C)

📍 src/pages/promoters/PaymentTracking.jsx
   └─ Tracking paiements promoteurs
```

---

### 🗄️ Base de Données (SQL)

#### **1. Migration Colonnes & Tables**
```
📍 FIX_MISSING_COLUMNS_COMPLETE.sql (195 lignes)
   ├─ Tables créées:
   │  ├─ public.subscriptions (plans utilisateurs)
   │  ├─ public.payment_transactions (historique paiements)
   │  ├─ public.analytics_views (compteur vues)
   │  └─ public.fraud_checks (anti-fraude)
   │
   ├─ Colonnes ajoutées:
   │  ├─ profiles.address, city, bio, company_name
   │  └─ properties.view_count
   │
   ├─ Triggers/Functions:
   │  └─ update_property_view_count() (auto-increment vues)
   │
   └─ RLS Policies:
      ├─ users_view_own_profile
      ├─ users_view_own_subscriptions
      ├─ users_view_own_transactions
      ├─ anyone_insert_analytics_views
      └─ users_view_property_analytics

⚠️ À EXÉCUTER sur Supabase:
1. Aller à: https://app.supabase.com
2. Projet: Teranga Foncier
3. Menu: SQL Editor
4. Copier-coller contenu du fichier
5. Cliquer RUN
6. ✅ Vérifier "All queries completed successfully"
```

---

### 📚 Services & Logique

#### **1. Service Abonnement (Existing)**
```
📍 src/services/SubscriptionService.js
   ├─ Fonction: getSubscription(userId)
   ├─ Fonction: updateSubscription(userId, plan)
   ├─ Fonction: getPaymentHistory(userId)
   └─ Fonction: cancelSubscription(userId)
```

#### **2. Service Paiement (Existing)**
```
📍 src/services/PaymentIntegration.js
   ├─ Stripe integration
   ├─ Wave/Mobile Money integration
   ├─ Webhook handlers
   └─ Invoice generation
```

#### **3. Error Manager**
```
📍 src/lib/errorManager.js
   ├─ Centralised error handling
   ├─ Logging setup
   └─ Error categorization
```

---

### 📖 Documentation

#### **1. Guide Complet Paiement**
```
📍 GUIDE_PAIEMENT_ABONNEMENT_COMPLET.md
   ├─ 4 Plans détaillés (Free, Basic, Pro, Enterprise)
   ├─ Comment payer (Stripe, Wave, Virement, Codes Promo)
   ├─ Gestion abonnement (modifier, annuler, factures)
   ├─ Problèmes courants & solutions
   ├─ API endpoints pour devs
   ├─ Scénarios revenus vendeur (ROI 10-30x)
   └─ Support & contact
```

#### **2. Diagnostic Erreurs**
```
📍 DIAGNOSTIC_ERRORS_FIXES.md
   ├─ 5 erreurs Supabase identifiées
   ├─ Explications techniques
   ├─ Solutions implémentées
   ├─ Plans d'action (5 phases)
   └─ Priorités
```

#### **3. Résumé Session**
```
📍 RESUME_SESSION_18_OCT_2025.md
   ├─ Objectifs atteints (✅ 5/5)
   ├─ Fichiers créés/modifiés
   ├─ Prochaines étapes
   ├─ Architecture système
   ├─ Impact attendu
   ├─ Checklist déploiement
   └─ ROI & revenus
```

---

## 🚀 COMMENT UTILISER

### Scenario 1: Afficher les Plans d'Abonnement

**Fichier**: `src/pages/dashboards/vendeur/VendeurSettingsRealData.jsx`

```jsx
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { useAuth } from '@/contexts/AuthContext'; // ou votre contexte

export function SettingsPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);

  return (
    <div>
      <h1>Mes Paramètres</h1>
      
      {/* Afficher les plans */}
      <SubscriptionPlans 
        user={user}
        currentPlan={subscription?.plan_name || 'free'}
        onPlanSelected={(planName) => {
          // Mise à jour automatique après paiement
          loadSubscription();
        }}
      />
    </div>
  );
}
```

### Scenario 2: Gérer les Erreurs Supabase

**N'importe quel fichier avec appels Supabase**:

```jsx
import { useSupabaseError, SupabaseErrorDisplay } from '@/components/SupabaseErrorHandler';

export function MyComponent() {
  const { handleError } = useSupabaseError();
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('purchase_requests')
        .select('*');
      
      if (error) throw error;
      // Success...
    } catch (err) {
      const parsed = handleError(err, 'loadData');
      setError(parsed);
    }
  };

  return (
    <div>
      <SupabaseErrorDisplay error={error} onDismiss={() => setError(null)} />
      {/* Rest of component */}
    </div>
  );
}
```

### Scenario 3: Afficher le Guide Paiement

**Intégrer dans navigation**:

```jsx
// Dans App.jsx ou router config
import PaymentGuideVendeur from '@/pages/PaymentGuideVendeur';

<Route path="/payment-guide" element={<PaymentGuideVendeur />} />
<Route path="/dashboard/vendeur/payment-guide" element={<PaymentGuideVendeur />} />
```

---

## 📊 Flux Complet Paiement

```
1️⃣ VENDEUR VISITE SETTINGS
   ↓
   src/pages/dashboards/vendeur/VendeurSettingsRealData.jsx
   
2️⃣ AFFICHE LES PLANS
   ↓
   <SubscriptionPlans user={user} currentPlan={subscription.plan_name} />
   
3️⃣ CLIQUE "CHOISIR PLAN"
   ↓
   Appel API: /api/create-checkout-session
   
4️⃣ REDIRECTION STRIPE CHECKOUT
   ↓
   Saisit données carte (Stripe gère tout)
   
5️⃣ PAIEMENT APPROUVÉ
   ↓
   Webhook Stripe: /api/webhooks/stripe
   
6️⃣ MISE À JOUR SUPABASE
   ↓
   subscriptions table UPDATE
   
7️⃣ PLAN ACTIVÉ IMMÉDIATEMENT
   ↓
   Nouveau limite appliquée
   Facture générée
   Email confirmation
   
8️⃣ VENDEUR VOIT NOUVEAU PLAN
   ↓
   Badge "Pro ⭐"
   Annonces: 50 → ∞
   Support: Email → 24/7
```

---

## ✅ CHECKLIST INTÉGRATION

- [ ] **SQL**: Exécuter `FIX_MISSING_COLUMNS_COMPLETE.sql` sur Supabase
- [ ] **Import**: Ajouter `<SubscriptionPlans />` à settings page
- [ ] **Errors**: Utiliser `useSupabaseError()` dans composants
- [ ] **Guide**: Ajouter route `/payment-guide`
- [ ] **Stripe**: Configurer clés API production
- [ ] **Test**: Paiement test (card: 4242 4242 4242 4242)
- [ ] **Deploy**: `npm run build && npm run deploy`
- [ ] **Monitor**: Vérifier logs Stripe + Supabase

---

## 🔗 LIENS RAPIDES

**Supabase Dashboard**:
- URL: https://app.supabase.com
- Projet: Teranga Foncier
- Table subscriptions: [view]
- Table payment_transactions: [view]

**Stripe Dashboard**:
- URL: https://dashboard.stripe.com
- Payments: [view recent]
- Webhooks: [verify configured]
- API Keys: [get live keys]

**Documentation**:
- Payment Guide: [GUIDE_PAIEMENT_ABONNEMENT_COMPLET.md]
- Errors: [DIAGNOSTIC_ERRORS_FIXES.md]
- Session: [RESUME_SESSION_18_OCT_2025.md]

---

## 🎯 OBJECTIF FINAL

✅ **Vendeurs peuvent**:
1. Voir leurs options d'abonnement
2. Payer en toute sécurité (Stripe)
3. Accéder aux fonctionnalités premium
4. Gérer leur facturation
5. Comprendre leur ROI

✅ **Plateforme gère**:
1. Limites par plan (annonces, stockage, etc.)
2. Paiements récurrents
3. Factures automatiques
4. Support client
5. Revenue tracking

---

*Généré le 18 Octobre 2025*
*Tous les fichiers sont prêts à tester en production*
