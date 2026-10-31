# 📋 AUDIT COMPLET DU SIDEBAR VENDEUR

## État actuel: 18 Oct 2025

### ✅ PAGES FONCTIONNELLES:
1. **Overview** (`VendeurOverviewRealDataModern.jsx`) - ✅ Avec données réelles
2. **Properties** (`VendeurPropertiesRealData.jsx`) - ✅ Avec données réelles + édition
3. **CRM** (`VendeurCRMRealData.jsx`) - ✅ Avec données réelles
4. **Messages** (`VendeurMessagesRealData.jsx`) - ✅ Données réelles (PGRST200 fixé)
5. **Add Property** (`VendeurAddTerrainRealData.jsx`) - ✅ Formulaire complet

### ⚠️ PAGES EN DÉVELOPPEMENT:
| Page | Fichier | Statut | Priorité | Actions Nécessaires |
|------|---------|--------|----------|---------------------|
| **Purchase Requests** | `VendeurPurchaseRequests.jsx` | ❌ | 🔴 HAUTE | Créer table + load data |
| **Cases/Case Tracking** | `RefactoredVendeurCaseTracking.jsx` | ❌ | 🟡 MOYENNE | Créer table + mapping |
| **Anti-Fraud** | `VendeurAntiFraudeRealData.jsx` | ❌ | 🟡 MOYENNE | Implémenter checks |
| **GPS Verification** | `VendeurGPSRealData.jsx` | ❌ | 🟡 MOYENNE | Intégrer API GPS |
| **Digital Services** | `VendeurServicesDigitauxRealData.jsx` | ❌ | 🟡 MOYENNE | Créer services list |
| **Photos** | `VendeurPhotosRealData.jsx` | ❌ | 🟡 MOYENNE | Galerie + upload |
| **Analytics** | `VendeurAnalyticsRealData.jsx` | ❌ | 🟡 MOYENNE | Dashboard analytics |
| **AI Assistant** | `VendeurAIRealData.jsx` | ❌ | 🟡 MOYENNE | Intégrer OpenAI |
| **Blockchain** | `VendeurBlockchainRealData.jsx` | ❌ | 🟡 MOYENNE | Intégrer MetaMask |
| **Settings** | `VendeurSettingsRealData.jsx` | ⚠️ | 🟢 BASSE | Terminer UI |
| **Support** | `VendeurSupport.jsx` | ⚠️ | 🟢 BASSE | Créer ticketing |

---

## 📊 STATISTIQUES:
- ✅ Pages complètes: 5/16 (31%)
- ⚠️ Pages partielles: 2/16 (13%)
- ❌ Pages à développer: 9/16 (56%)

---

## 🔴 TABLES SQL MANQUANTES:

### 1. **purchase_requests** (Demandes d'achat)
```sql
CREATE TABLE public.purchase_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id),
  property_id UUID REFERENCES public.properties(id),
  
  quantity INTEGER,
  offer_price NUMERIC,
  proposed_terms TEXT,
  urgency TEXT, -- low, medium, high, urgent
  financing_method TEXT, -- cash, loan, crypto, etc.
  
  status TEXT DEFAULT 'pending', -- pending, accepted, rejected, negotiating
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. **case_tracking** (Suivi de dossiers)
```sql
CREATE TABLE public.case_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id),
  buyer_id UUID REFERENCES public.profiles(id),
  
  case_number TEXT UNIQUE,
  case_status TEXT, -- in_progress, completed, pending_docs, etc.
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. **fraud_checks** (Vérifications antifraud)
```sql
CREATE TABLE public.fraud_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID,
  user_id UUID REFERENCES public.profiles(id),
  
  check_type TEXT, -- identity, payment, property, etc.
  status TEXT DEFAULT 'pending', -- pending, passed, warning, failed
  details JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. **gps_verifications** (Vérifications GPS)
```sql
CREATE TABLE public.gps_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id),
  
  verified_lat NUMERIC,
  verified_lng NUMERIC,
  accuracy_meters NUMERIC,
  verification_date TIMESTAMP,
  
  status TEXT DEFAULT 'pending'
);
```

### 5. **analytics_logs** (Logs d'analytique)
```sql
CREATE TABLE public.analytics_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  
  event_type TEXT,
  event_data JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

### 6. **support_tickets** (Tickets support)
```sql
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  
  subject TEXT,
  description TEXT,
  category TEXT,
  priority TEXT,
  status TEXT DEFAULT 'open',
  
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);
```

---

## 🎯 PLAN D'ACTION PHASE 1:

### Semaine 1:
1. ✅ Exécuter ADD_MISSING_PROPERTIES_COLUMNS.sql
2. ⏳ Créer purchase_requests table
3. ⏳ Créer case_tracking table
4. ⏳ Implémenter page Purchase Requests

### Semaine 2:
5. ⏳ Créer fraud_checks table
6. ⏳ Implémenter Anti-Fraud page
7. ⏳ Créer gps_verifications table
8. ⏳ Implémenter GPS Verification

### Semaine 3:
9. ⏳ Créer analytics_logs table
10. ⏳ Implémenter Analytics page
11. ⏳ Créer support_tickets table
12. ⏳ Implémenter Support page

---

## 📝 NOTES IMPORTANTES:

- **CompleteSidebarVendeurDashboard.jsx** ligne 521: Affiche "Page en développement" pour toutes les routes non mappées
- **EditPropertyComplete.jsx**: Maintenant fonctionnel après SQL migrations
- **VendeurMessagesRealData.jsx**: PGRST200 fixé (buyer_id → participant1_id)
- **Stripe API**: Créé et intégré dans SubscriptionPlans.jsx

---

## 🚀 PROCHAINES ÉTAPES:

1. **Valider que ADD_MISSING_PROPERTIES_COLUMNS.sql est exécuté**
2. **Créer et exécuter purchase_requests table SQL**
3. **Implémenter VendeurPurchaseRequests.jsx avec données réelles**
4. **Répéter pour chaque page en développement**

