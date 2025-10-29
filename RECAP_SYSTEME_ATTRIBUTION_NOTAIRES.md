# ✅ SYSTÈME D'ATTRIBUTION DES NOTAIRES - IMPLÉMENTÉ

**Date**: 29 Octobre 2025  
**Status**: ✅ Code créé, prêt à tester  
**Commit**: ff14e469

---

## 📋 DÉCISIONS FINALES

✅ **Qui choisit le notaire ?**  
→ **Les 2 parties** (Acheteur ET Vendeur doivent approuver)

✅ **Le notaire peut refuser ?**  
→ **Oui**, il a **24 heures** pour accepter ou refuser

✅ **Frais de notaire ?**  
→ **Prix libre** (chaque notaire fixe ses propres tarifs)

---

## 🗂️ FICHIERS CRÉÉS

### 1. Migration SQL (562 lignes)
**Fichier**: `MIGRATION_NOTAIRE_ASSIGNMENT_SYSTEM.sql`

**Tables créées**:
- ✅ `notaire_profiles` - Profils détaillés des notaires
- ✅ `notaire_case_assignments` - Propositions d'attribution
- ✅ `notaire_reviews` - Évaluations des notaires

**Fonctions PostgreSQL**:
- `increment_notaire_cases()` - Incrémenter compteur dossiers
- `decrement_notaire_cases()` - Décrémenter compteur
- `update_notaire_rating()` - Recalculer note moyenne
- `expire_pending_assignments()` - Expirer assignments >24h
- `calculate_distance_km()` - Calcul distance GPS (Haversine)

**Triggers**:
- Auto-update rating après nouvelle review
- Auto-update status quand les 2 parties approuvent
- Auto-update `updated_at` timestamps

**Vues**:
- `available_notaires` - Notaires disponibles avec stats
- `pending_notaire_assignments` - Assignments en attente de réponse

---

### 2. Service JavaScript (580 lignes)
**Fichier**: `src/services/NotaireAssignmentService.js`

**Méthodes principales**:

#### 🔍 Recherche & Scoring
- `findBestNotaires(caseId, options)` - TOP 3 notaires recommandés
- `calculateNotaireScore(notaire, case)` - Algorithme de scoring (0-100)
- `calculateDistance(lat1, lon1, lat2, lon2)` - Distance GPS en km
- `searchNotaires(filters)` - Recherche avec filtres

#### 📤 Proposition & Approbation
- `proposeNotaire(caseId, notaireId, options)` - Proposer un notaire
- `approveNotaire(assignmentId, userId, role)` - Acheteur/Vendeur approuve
- `acceptAssignment(assignmentId, notaireId, options)` - Notaire accepte
- `declineAssignment(assignmentId, notaireId, reason)` - Notaire refuse

#### 📋 Gestion
- `getCaseAssignments(caseId)` - Assignments d'un dossier
- `getPendingAssignments(notaireId)` - Assignments en attente pour notaire

#### ⭐ Reviews
- `createReview(caseId, notaireId, reviewerId, data)` - Créer une évaluation
- `getNotaireReviews(notaireId, limit)` - Récupérer reviews

---

## 🧮 ALGORITHME DE SCORING

Le score d'un notaire est calculé sur **100 points** avec ces critères :

```javascript
Score initial = 100

1. DISTANCE (-2 points/km, max -50)
   - 0-5 km: -10 points
   - 10 km: -20 points
   - 25 km+: -50 points

2. CHARGE DE TRAVAIL (-30 max)
   - 0-50% capacité: -0 à -15 points
   - 50-80%: -15 à -24 points
   - 80-100%: -24 à -30 points

3. RATING (+0 à +20)
   - ≥4.5 étoiles: +20 points
   - ≥4.0: +10 points
   - ≥3.5: +5 points

4. RAPIDITÉ (+15 max)
   - Moyenne ≤30 jours: +15 points
   - ≤45 jours: +8 points

5. SPÉCIALISATION (+10)
   - Spécialiste terrain: +10 points

6. EXPÉRIENCE (+10 max)
   - >50 dossiers complétés: +10 points
   - >20 dossiers: +5 points

7. VÉRIFICATION (+5)
   - Compte vérifié: +5 points

8. RÉGION (+15)
   - Même région que parcelle: +15 points

9. RÉACTIVITÉ (+10)
   - Temps réponse <6h: +10 points
```

**Exemple de scores**:
- Notaire proche, peu chargé, bien noté: **90-100 points** ⭐⭐⭐
- Notaire moyen: **60-80 points** ⭐⭐
- Notaire loin, surchargé: **30-50 points** ⭐

---

## 🔄 WORKFLOW COMPLET

```
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 1: Vendeur accepte demande d'achat                   │
├─────────────────────────────────────────────────────────────┤
│  purchase_request.status = 'seller_accepted'                │
│  → Créer purchase_case (notaire_id = NULL)                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 2: Système propose 3 notaires                        │
├─────────────────────────────────────────────────────────────┤
│  NotaireAssignmentService.findBestNotaires(caseId)         │
│  → Algorithme calcule TOP 3 (score + distance)             │
│  → Afficher dans modal de sélection                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 3: Acheteur choisit un notaire                       │
├─────────────────────────────────────────────────────────────┤
│  NotaireAssignmentService.proposeNotaire(caseId, notaireId)│
│  → Créer notaire_case_assignment                            │
│  → Status: 'pending'                                         │
│  → buyer_approved: false                                     │
│  → seller_approved: false                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 4: Acheteur approuve son choix                       │
├─────────────────────────────────────────────────────────────┤
│  NotaireAssignmentService.approveNotaire(id, userId, 'buyer')│
│  → buyer_approved: true                                      │
│  → Status: 'buyer_approved'                                  │
│  → Notification envoyée au Vendeur                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 5: Vendeur approuve aussi                            │
├─────────────────────────────────────────────────────────────┤
│  NotaireAssignmentService.approveNotaire(id, userId, 'seller')│
│  → seller_approved: true                                     │
│  → Status: 'both_approved' (trigger auto)                    │
│  → Notification envoyée au Notaire                           │
│  → Expiration: 24h pour répondre                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 6A: Notaire ACCEPTE (dans les 24h)                   │
├─────────────────────────────────────────────────────────────┤
│  NotaireAssignmentService.acceptAssignment(id, notaireId)   │
│  → notaire_status: 'accepted'                                │
│  → purchase_case.notaire_id = notaireId                      │
│  → purchase_case.status = 'notary_assigned'                  │
│  → Incrémenter notaire.current_cases_count                   │
│  → Notifications aux 2 parties                               │
│  ✅ DOSSIER ASSIGNÉ AU NOTAIRE                              │
└─────────────────────────────────────────────────────────────┘
                     OU
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 6B: Notaire REFUSE                                    │
├─────────────────────────────────────────────────────────────┤
│  NotaireAssignmentService.declineAssignment(id, notaireId)  │
│  → notaire_status: 'declined'                                │
│  → Status: 'notaire_declined'                                │
│  → Notifications aux 2 parties                               │
│  → Suggestion d'un autre notaire (automatique)              │
│  ❌ RETOUR À L'ÉTAPE 3                                       │
└─────────────────────────────────────────────────────────────┘
                     OU
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 6C: Expiration 24h (pas de réponse)                  │
├─────────────────────────────────────────────────────────────┤
│  Fonction: expire_pending_assignments() (cron daily)        │
│  → notaire_status: 'expired'                                 │
│  → Status: 'expired'                                         │
│  → Notifications aux 2 parties                               │
│  → Suggestion d'un autre notaire                             │
│  ⏰ RETOUR À L'ÉTAPE 3                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 7: Vente complétée                                    │
├─────────────────────────────────────────────────────────────┤
│  purchase_case.status = 'completed'                          │
│  → Décrémenter notaire.current_cases_count                   │
│  → Acheteur & Vendeur peuvent laisser une review            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  ÉTAPE 8: Reviews (optionnel)                                │
├─────────────────────────────────────────────────────────────┤
│  NotaireAssignmentService.createReview(...)                 │
│  → Créer notaire_review                                      │
│  → Trigger auto-update notaire.rating                        │
│  → Visible sur profil notaire                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ STRUCTURE BASE DE DONNÉES

### Table `notaire_profiles`

```sql
Colonnes principales:
- id (UUID, FK profiles)
- office_name (VARCHAR)
- office_address (TEXT)
- office_region, office_commune (VARCHAR)
- office_latitude, office_longitude (DECIMAL)
- specializations (TEXT[]) - ['terrain', 'immobilier']
- is_available, is_accepting_cases (BOOLEAN)
- max_concurrent_cases, current_cases_count (INTEGER)
- base_fee_min, base_fee_max, percentage_fee (DECIMAL)
- rating (0-5), reviews_count (INTEGER)
- total_cases_completed (INTEGER)
- average_completion_days (DECIMAL)
- license_number, is_verified (VARCHAR, BOOLEAN)
```

### Table `notaire_case_assignments`

```sql
Colonnes principales:
- id (UUID)
- case_id (FK purchase_cases)
- notaire_id (FK profiles)
- proposed_by, proposed_by_role (UUID, VARCHAR)
- status (VARCHAR) - 'pending', 'buyer_approved', 'seller_approved', 
                      'both_approved', 'notaire_accepted', 'notaire_declined'
- buyer_approved, seller_approved (BOOLEAN)
- buyer_approved_at, seller_approved_at (TIMESTAMP)
- notaire_status (VARCHAR) - 'pending', 'accepted', 'declined', 'expired'
- notaire_responded_at (TIMESTAMP)
- expires_at (TIMESTAMP) - NOW() + 24h
- assignment_score (INTEGER) - Score calculé (0-100)
- distance_km (DECIMAL)
- quoted_fee (DECIMAL)
```

### Table `notaire_reviews`

```sql
Colonnes principales:
- id (UUID)
- notaire_id, case_id, reviewer_id (FK)
- reviewer_role (VARCHAR) - 'buyer' ou 'seller'
- rating (1-5)
- professionalism_rating, communication_rating, 
  speed_rating, expertise_rating (1-5)
- comment (TEXT)
- would_recommend (BOOLEAN)
- status (VARCHAR) - 'published', 'hidden'
- notaire_response (TEXT)
```

---

## 🚀 PROCHAINES ÉTAPES

### 1. Exécuter la migration SQL (15 min)

```bash
1. Ouvrir Supabase Console → SQL Editor
2. Changer rôle en "service_role"
3. Copier/coller MIGRATION_NOTAIRE_ASSIGNMENT_SYSTEM.sql
4. Exécuter → Vérifier "Success"
5. Vérifier tables créées:
   - notaire_profiles
   - notaire_case_assignments
   - notaire_reviews
```

### 2. Créer données de test (10 min)

```sql
-- Insérer 3 notaires de test
INSERT INTO profiles (id, email, full_name, role, phone)
VALUES 
  ('uuid-notaire-1', 'notaire1@test.com', 'Maître Diop', 'notaire', '+221 77 123 45 67'),
  ('uuid-notaire-2', 'notaire2@test.com', 'Maître Ndiaye', 'notaire', '+221 77 234 56 78'),
  ('uuid-notaire-3', 'notaire3@test.com', 'Maître Fall', 'notaire', '+221 77 345 67 89');

INSERT INTO notaire_profiles (id, office_name, office_region, ...)
VALUES 
  ('uuid-notaire-1', 'Étude Diop', 'Dakar', ...),
  ('uuid-notaire-2', 'Étude Ndiaye', 'Thiès', ...),
  ('uuid-notaire-3', 'Étude Fall', 'Saint-Louis', ...);
```

### 3. Créer UI de sélection notaire (2-3h)

**Composants à créer**:
- `NotaireSelectionModal.jsx` - Modal choix notaire
- `NotaireCard.jsx` - Carte notaire avec score/distance/rating
- `NotaireApprovalWidget.jsx` - Boutons approbation acheteur/vendeur
- `NotairePendingAssignments.jsx` - Page notaire pour accepter dossiers

### 4. Intégrer dans workflow (1h)

**Modifications**:
- `PurchaseWorkflowService.js` - Appeler `findBestNotaires()` après seller_accepted
- `NotaireCasesModernized.jsx` - Afficher assignments en attente
- `BuyerDashboard.jsx` - Permettre choix/approbation notaire
- `SellerDashboard.jsx` - Permettre approbation notaire choisi par acheteur

### 5. Tests (1h)

**Scénarios à tester**:
- ✅ Recherche TOP 3 notaires
- ✅ Acheteur choisit notaire #2
- ✅ Acheteur approuve → Notif vendeur
- ✅ Vendeur approuve → Notif notaire
- ✅ Notaire accepte dans <24h → Dossier assigné
- ✅ Notaire refuse → Suggérer suivant
- ✅ Expiration 24h → Suggérer suivant
- ✅ Vente complétée → Reviews possibles

---

## 📊 MÉTRIQUES À SUIVRE

Après déploiement, monitorer:

1. **Taux d'acceptation notaires**: Combien acceptent vs refusent ?
2. **Temps de réponse notaires**: Moyenne <6h, <12h, <24h ?
3. **Taux d'approbation vendeurs**: Combien approuvent le choix acheteur ?
4. **Score moyen attribués**: Les notaires avec score >80 acceptent plus ?
5. **Distance moyenne**: Les notaires acceptent jusqu'à quelle distance ?
6. **Reviews moyennes**: Note globale des notaires >4.0 ?

---

## 🎨 EXEMPLE UI

### Modal de Sélection Notaire

```jsx
<Dialog>
  <DialogHeader>
    <DialogTitle>Choisir un notaire</DialogTitle>
    <DialogDescription>
      3 notaires recommandés pour votre dossier TF-20251029-0042
    </DialogDescription>
  </DialogHeader>
  
  <div className="space-y-4">
    {notaires.map((notaire, index) => (
      <Card className="cursor-pointer hover:border-primary">
        <CardContent>
          {index === 0 && <Badge>⭐ Recommandé</Badge>}
          
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{notaire.office_name}</h3>
              <p className="text-sm text-muted">
                {notaire.office_region} • {notaire.distance} km
              </p>
              
              <div className="flex gap-2 mt-2">
                <Badge variant="outline">
                  ⭐ {notaire.rating}/5 ({notaire.reviews_count} avis)
                </Badge>
                <Badge variant="outline">
                  📊 {notaire.current_cases_count}/{notaire.max_concurrent_cases} dossiers
                </Badge>
              </div>
              
              <p className="text-sm mt-2">
                💰 Tarif: {notaire.percentage_fee}% du prix de vente
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {notaire.score}
              </div>
              <p className="text-xs text-muted">Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
  
  <DialogFooter>
    <Button variant="outline" onClick={handleAutoSelect}>
      Attribution automatique
    </Button>
    <Button onClick={handleSelectNotaire}>
      Choisir ce notaire
    </Button>
  </DialogFooter>
</Dialog>
```

---

## 🔒 SÉCURITÉ RLS

Toutes les tables ont Row Level Security activé :

- ✅ Notaires voient leurs propres assignments
- ✅ Acheteurs/Vendeurs voient assignments de leurs dossiers
- ✅ Tout le monde voit profils notaires publics
- ✅ Reviews publiées visibles par tous
- ✅ Seuls reviewer et notaire peuvent modifier reviews

---

## 📞 SUPPORT

**Questions ?** Consultez:
- `DISCUSSION_ATTRIBUTION_NOTAIRES.md` - Discussion des 5 approches
- `MIGRATION_NOTAIRE_ASSIGNMENT_SYSTEM.sql` - Code SQL complet
- `src/services/NotaireAssignmentService.js` - Service JavaScript

---

**Status final**: ✅ **PRÊT POUR TESTS**  
**Temps d'implémentation**: ~4h  
**Lignes de code**: 1142 lignes (SQL + JS)  
**Complexité**: ⭐⭐⭐⭐☆ (Avancé)

---

**Prochaine action**: Exécuter `MIGRATION_NOTAIRE_ASSIGNMENT_SYSTEM.sql` dans Supabase ! 🚀
