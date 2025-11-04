# 🧪 Test Rapide - Intégration UI Semaine 3

## ⚡ Démarrage Rapide (2 minutes)

### Option 1: Script Automatique (Recommandé)

```powershell
# Dans le répertoire racine du projet
./start-dev.ps1
```

Ce script lance automatiquement:
- ✅ Frontend (Vite sur port 5173)
- ✅ Backend (Node.js sur port 5000)
- ✅ Workflows autonomes (auto-validation + fraud detection)

---

### Option 2: Démarrage Manuel

```powershell
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (nouvelle fenêtre)
cd backend
node server.js
```

**Vérifier les logs backend** pour confirmer:
```
✅ Auto-validation workflow active
✅ Fraud detection workflow active
Subscribed to Realtime changes on 'documents' table
Subscribed to Realtime changes on 'purchase_cases' table
```

---

## 🎯 Checklist de Test (15 minutes)

### ✅ Phase 1: Navigation de Base (3 min)

#### 1. Accéder au Dashboard Admin
```
URL: http://localhost:5173/admin/dashboard
```

**Vérifier**:
- [ ] Page se charge sans erreurs
- [ ] Sidebar visible avec tous les items
- [ ] Header avec logo et notifications

#### 2. Nouveaux Items Sidebar
**Chercher dans la sidebar**:
- [ ] 🤖 Analytics IA (badge violet "IA")
- [ ] 🛡️ Surveillance Fraude (badge rouge "IA")

---

### ✅ Phase 2: Analytics IA Dashboard (5 min)

#### Accès
```
Cliquer sur "🤖 Analytics IA" dans sidebar
OU
URL directe: http://localhost:5173/admin/ai-analytics
```

#### Tests à Effectuer

**1. Chargement Initial**
- [ ] Page se charge sans erreurs
- [ ] 4 cartes statistiques apparaissent:
  - Documents Validés
  - Cas Analysés Fraude
  - Prix Évalués
  - Fraudes Critiques

**2. Sélecteur de Période**
- [ ] Dropdown visible en haut à droite
- [ ] Options disponibles: 7 jours / 30 jours / 90 jours / 365 jours
- [ ] Changement de période → données se rechargent

**3. Graphiques Recharts**
- [ ] **LineChart**: Tendances de Validation (3 lignes: valid, invalid, score)
- [ ] **PieChart**: Distribution des Risques de Fraude (4 segments: low/medium/high/critical)
- [ ] **BarChart**: Évolution de la Fraude (barres empilées par niveau)
- [ ] Hover sur graphiques → tooltips apparaissent

**4. Export CSV**
- [ ] Bouton "Exporter CSV" visible
- [ ] Clic → fichier `analytics_${date}.csv` téléchargé
- [ ] Ouvrir CSV → données correctes

**5. Performance Summary**
- [ ] 3 cartes en bas: Validation / Fraude / Prix
- [ ] Pourcentages affichés
- [ ] Badges colorés (vert = bon, rouge = critique)

---

### ✅ Phase 3: Fraud Detection Dashboard (3 min)

#### Accès
```
Cliquer sur "🛡️ Surveillance Fraude" dans sidebar
OU
URL directe: http://localhost:5173/admin/fraud-detection
```

#### Tests à Effectuer

**1. Liste des Cas**
- [ ] Tableau avec colonnes: ID, Acheteur, Score, Niveau, Date
- [ ] Badges colorés par niveau:
  - Vert (Low < 30)
  - Jaune (Medium 30-50)
  - Orange (High 50-70)
  - Rouge (Critical 70+)

**2. Filtrage**
- [ ] Boutons de filtre: Tous / Low / Medium / High / Critical
- [ ] Clic sur filtre → liste se met à jour

**3. Actions**
- [ ] Bouton "Voir détails" par cas
- [ ] Clic → navigation vers détails du cas

**4. Alertes Urgentes**
- [ ] Section "Alertes Urgentes" en haut si cas critiques
- [ ] Nombre de cas critiques affiché

---

### ✅ Phase 4: NotificationBell (4 min)

#### Localisation
```
Header du dashboard admin (en haut à droite)
Icône cloche avec badge rouge si notifications non lues
```

#### Tests à Effectuer

**1. Apparence Initiale**
- [ ] Icône cloche visible
- [ ] Badge avec nombre si notifications non lues
- [ ] Pas de badge si tout lu

**2. Dropdown**
- [ ] Clic sur cloche → dropdown s'ouvre
- [ ] Liste scrollable de notifications
- [ ] Chaque notification affiche:
  - Titre
  - Message
  - Heure relative ("il y a 5 min")
  - Priorité (pastille colorée)
- [ ] Background différent pour non lues (bg-blue-50)

**3. Actions**
- [ ] Bouton "Mark as read" sur chaque notification
- [ ] Clic → notification devient lue
- [ ] Badge se met à jour
- [ ] Bouton "Delete" (icône poubelle)
- [ ] Clic → notification supprimée

**4. Navigation**
- [ ] Lien "Voir toutes les notifications →" en bas
- [ ] Clic → redirection vers /admin/notifications

**5. Test en Temps Réel**
```
1. Uploader un document dans un autre onglet
2. Attendre 5-10 secondes (AI analysis)
3. Vérifier NotificationBell:
   - Badge s'incrémente
   - Toast notification apparaît
   - Nouvelle notification dans dropdown
```

---

### ✅ Phase 5: Workflows Backend (Bonus - 5 min)

#### Test Auto-Validation

**1. Créer un document test**
```
1. Naviguer vers une page avec upload de documents
2. Uploader un fichier (PDF/JPEG/PNG)
3. Attendre 5-10 secondes
```

**Vérifier dans les logs backend**:
```
📄 New document uploaded: {document_id}
🔍 Analyzing document...
✅ Document validation complete
📢 Creating notification for user
```

**Vérifier dans Supabase (optionnel)**:
```sql
SELECT 
  id, 
  ai_validation_status, 
  ai_validation_score, 
  created_at 
FROM documents 
ORDER BY created_at DESC 
LIMIT 5;
```

---

#### Test Fraud Detection

**1. Créer un cas d'achat test**
```
1. Naviguer vers formulaire d'achat
2. Remplir les champs
3. Soumettre
4. Attendre 60 secondes (délai configurable)
```

**Vérifier dans les logs backend**:
```
🚨 New purchase case created: {case_id}
⏳ Waiting 60 seconds before fraud analysis...
🔍 Analyzing fraud risk...
⚠️ Fraud risk score: 75 (CRITICAL)
📢 Notifying admins of critical risk
✅ Fraud analysis complete
```

**Vérifier dans Dashboard Fraude**:
- [ ] Nouveau cas apparaît avec score
- [ ] Badge rouge si score > 70
- [ ] Notification admin créée

---

## 🐛 Dépannage Rapide

### ❌ Erreur: "Cannot find module '@/components/notifications/NotificationBell'"

**Solution**:
```powershell
# Vérifier que le fichier existe
ls src/components/notifications/NotificationBell.jsx

# Si absent, recréer le composant
# Voir: GUIDE_INTEGRATION_UI_COMPOSANTS.md section NotificationBell
```

---

### ❌ Erreur: "Failed to initialize workflows"

**Causes possibles**:
1. **Variables d'environnement manquantes**
   ```powershell
   # Vérifier backend/.env
   cat backend/.env
   
   # Doit contenir:
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   OPENAI_API_KEY=sk-proj-...
   ```

2. **Supabase non accessible**
   ```powershell
   # Tester la connexion
   curl https://your-project.supabase.co
   ```

3. **Tables manquantes**
   ```
   Exécuter: migrations/20251103_ai_columns.sql via Supabase Dashboard
   ```

---

### ❌ Pas de données dans les dashboards

**Solutions**:

**1. Créer des données de test**
```sql
-- Via Supabase SQL Editor

-- Documents avec validation IA
UPDATE documents 
SET 
  ai_validation_status = 'valid',
  ai_validation_score = RANDOM() * 100,
  ai_validation_date = NOW()
WHERE ai_validation_status IS NULL
LIMIT 10;

-- Purchase cases avec fraude analysée
UPDATE purchase_cases
SET
  fraud_risk_score = FLOOR(RANDOM() * 100),
  fraud_risk_level = CASE 
    WHEN RANDOM() < 0.3 THEN 'low'
    WHEN RANDOM() < 0.6 THEN 'medium'
    WHEN RANDOM() < 0.9 THEN 'high'
    ELSE 'critical'
  END,
  fraud_analyzed_at = NOW()
WHERE fraud_risk_score IS NULL
LIMIT 20;

-- Properties avec prix IA
UPDATE properties
SET
  ai_estimated_price = price + (RANDOM() * 2000000 - 1000000),
  ai_price_confidence = RANDOM() * 100,
  ai_price_updated = NOW()
WHERE ai_estimated_price IS NULL
LIMIT 15;
```

**2. Uploader de vrais documents**
- Naviguer vers une page avec upload
- Uploader plusieurs fichiers
- Attendre l'analyse IA
- Recharger le dashboard

---

### ❌ NotificationBell ne reçoit pas les notifications

**Diagnostic**:

**1. Vérifier Supabase Realtime activé**
```
Dashboard Supabase → Database → Replication
→ Activer "Realtime" pour table 'notifications'
```

**2. Vérifier les permissions RLS**
```sql
-- Via Supabase SQL Editor
SELECT * FROM pg_policies 
WHERE tablename = 'notifications';

-- Si vide, créer les policies:
-- Voir: migrations/rls_policies.sql
```

**3. Vérifier userId**
```javascript
// Dans le composant
console.log('User ID:', user?.id);

// Si undefined → problème d'authentification
```

---

### ❌ Graphiques ne s'affichent pas

**Solution**:
```powershell
# Vérifier recharts installé
npm list recharts

# Si absent
npm install recharts

# Redémarrer le dev server
npm run dev
```

---

## 📊 Metrics de Succès

### ✅ Intégration Réussie

**Critères**:
- [ ] Dashboard Analytics IA accessible et fonctionnel
- [ ] Dashboard Surveillance Fraude accessible et fonctionnel
- [ ] NotificationBell apparaît dans header admin
- [ ] Sélecteur de période fonctionne (Analytics)
- [ ] Export CSV fonctionne
- [ ] 3 graphiques Recharts visibles
- [ ] Workflows backend s'initialisent sans erreur
- [ ] Notifications temps réel fonctionnent

**Si tous cochés** → ✅ **Week 3 prête pour production**

---

## 🎯 Next Steps Après Tests Réussis

### Option A: Finaliser Week 3 (2-3h restantes)

```
1. Intégrer AI components dans pages existantes
   - AIValidationButton → case details
   - AIValidationBadge → document lists
   - PropertyRecommendations → buyer dashboard
   - AIPropertyEvaluation → property details

2. Exécuter migration SQL complète
   - Ajouter colonnes AI manquantes
   - Créer RLS policies
   - Ajouter indexes pour performance

3. Testing E2E complet
   - Upload document → Validation IA → Notification
   - Create case → Fraud analysis → Admin alert
   - Property evaluation → Price IA → Confidence score
```

### Option B: Passer à Week 4 - Blockchain (60h)

```
Phase 1: Smart Contracts (15h)
- Développer contrats Solidity
- Property NFT contract
- Escrow contract
- Tests Hardhat

Phase 2: Deployment (5h)
- Deploy sur Sepolia testnet
- Verify contracts
- Test transactions

Phase 3: Frontend Integration (20h)
- Web3 wallet connect
- Contract interactions
- Transaction tracking
- IPFS upload/download

Phase 4: NFT Features (15h)
- Mint property NFTs
- Transfer ownership
- Royalties system
- Marketplace integration

Phase 5: Testing & Docs (5h)
- E2E blockchain tests
- User documentation
- Admin guides
```

---

## 📞 Support

**Documentation disponible**:
- `GUIDE_INTEGRATION_UI_COMPOSANTS.md` - Guide technique complet
- `INTEGRATION_UI_COMPLETE.md` - Résumé des modifications
- `GUIDE_FINALISATION_SEMAINE_3_4.md` - Roadmap complète
- `DEMARRAGE_RAPIDE_PROJET.md` - Setup initial

**Besoin d'aide?**
- Vérifier les logs backend
- Consulter Supabase Dashboard → Logs
- Tester avec données mockées d'abord
- Vérifier .env variables

---

**Date**: 2025-01-26  
**Version**: 1.0  
**Durée Test**: ~15 minutes  
**Status**: ✅ READY TO TEST
