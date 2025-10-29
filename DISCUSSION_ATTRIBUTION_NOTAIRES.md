# 🤔 DISCUSSION - Attribution des Notaires aux Dossiers de Vente

**Date**: 29 Octobre 2025  
**Contexte**: Comment attribuer un notaire spécifique à un dossier de vente de parcelle lorsqu'il y a plusieurs notaires sur la plateforme ?

---

## 🎯 LE PROBLÈME À RÉSOUDRE

**Situation**:
- Un **Acheteur** fait une demande d'achat (`purchase_request`) pour une parcelle d'un **Vendeur**
- Le Vendeur accepte → Un **dossier de vente** (`purchase_case`) est créé
- Il y a **PLUSIEURS Notaires** inscrits sur l'application TerangaFoncier
- **Question**: Comment déterminer **QUEL notaire** va gérer ce dossier spécifique ?

---

## 💡 APPROCHES POSSIBLES

### 🎲 Option 1: Attribution ALÉATOIRE (Round Robin)

**Concept**: Distribuer équitablement les dossiers entre tous les notaires actifs

**Comment ça marche**:
```sql
-- Sélectionner le notaire avec le moins de dossiers actifs
SELECT id FROM profiles 
WHERE role = 'notaire' 
  AND status = 'active'
  AND is_available = true
ORDER BY (
  SELECT COUNT(*) FROM purchase_cases 
  WHERE notaire_id = profiles.id 
  AND status NOT IN ('completed', 'cancelled')
) ASC
LIMIT 1;
```

**Avantages** ✅:
- Charge équitable entre notaires
- Pas de favoritisme
- Simple à implémenter
- Automatique

**Inconvénients** ❌:
- Pas de choix pour l'acheteur/vendeur
- Pas de spécialisation géographique
- Pas de relation client privilégiée

---

### 📍 Option 2: Attribution GÉOGRAPHIQUE (Par localisation)

**Concept**: Assigner le notaire le plus proche de la parcelle

**Comment ça marche**:
```javascript
// 1. Récupérer localisation de la parcelle
const parcel = await supabase
  .from('parcels')
  .select('region, commune, latitude, longitude')
  .eq('id', parcelId)
  .single();

// 2. Trouver notaires de la même région
const { data: notaires } = await supabase
  .from('profiles')
  .select('id, office_address, office_region')
  .eq('role', 'notaire')
  .eq('office_region', parcel.data.region)
  .eq('status', 'active')
  .limit(5);

// 3. Calculer distances et choisir le plus proche
const closestNotaire = notaires.sort((a, b) => 
  calculateDistance(parcel, a) - calculateDistance(parcel, b)
)[0];
```

**Avantages** ✅:
- Notaire connaît le marché local
- Déplacements réduits
- Expertise régionale
- Réseau local (cadastre, mairie, etc.)

**Inconvénients** ❌:
- Certaines régions = surcharge
- Régions isolées = pas de notaire
- Nécessite données GPS précises

---

### 👤 Option 3: CHOIX LIBRE par l'Acheteur/Vendeur

**Concept**: L'acheteur ou vendeur choisit son notaire dans une liste

**Comment ça marche**:
```javascript
// Lors de la création du dossier
<Select>
  <SelectTrigger>Choisir un notaire</SelectTrigger>
  <SelectContent>
    {notaires.map(notaire => (
      <SelectItem value={notaire.id}>
        {notaire.full_name} - {notaire.office_city}
        ⭐ {notaire.rating} ({notaire.reviews_count} avis)
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Avantages** ✅:
- Liberté de choix utilisateur
- Confiance (avis/notes)
- Relation client existante possible
- Transparence

**Inconvénients** ❌:
- Notaires populaires = surcharge
- Nouveaux notaires = pas de clients
- Décision difficile pour utilisateur
- Peut ralentir le processus

---

### 🤝 Option 4: ATTRIBUTION MIXTE (Géo + Disponibilité)

**Concept**: Combiner plusieurs critères intelligents

**Comment ça marche**:
```javascript
// Algorithme de scoring
const scoringNotaire = (notaire, parcel) => {
  let score = 100;
  
  // 1. Distance (-1 point par km)
  const distance = calculateDistance(notaire, parcel);
  score -= distance;
  
  // 2. Charge de travail (-5 points par dossier actif)
  score -= (notaire.active_cases_count * 5);
  
  // 3. Spécialisation (+20 si spécialiste terrain)
  if (notaire.specialization.includes('terrain')) score += 20;
  
  // 4. Note moyenne (+10 si >4.5 étoiles)
  if (notaire.rating >= 4.5) score += 10;
  
  // 5. Disponibilité (+30 si disponible immédiatement)
  if (notaire.next_available_slot <= 48h) score += 30;
  
  return score;
};

// Sélectionner le notaire avec le meilleur score
const bestNotaire = notaires.sort((a, b) => 
  scoringNotaire(b, parcel) - scoringNotaire(a, parcel)
)[0];
```

**Avantages** ✅:
- Optimal pour toutes les parties
- Équilibre qualité/distance/charge
- Adaptatif et intelligent
- Évolutif (ajout de critères)

**Inconvénients** ❌:
- Complexe à implémenter
- Nécessite données complètes
- Maintenance algorithme
- Besoin de tests A/B

---

### 🎟️ Option 5: SYSTÈME DE FILES D'ATTENTE (Queue)

**Concept**: Les dossiers entrent dans une file, notaires piochent selon leur capacité

**Comment ça marche**:
```sql
-- 1. Créer table de queue
CREATE TABLE notaire_case_queue (
  id UUID PRIMARY KEY,
  case_id UUID REFERENCES purchase_cases(id),
  region VARCHAR(100),
  priority INTEGER DEFAULT 5,
  assigned_notaire_id UUID REFERENCES profiles(id),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Notaires peuvent "accepter" des dossiers
-- Page Notaire: "Dossiers disponibles dans votre région"
SELECT * FROM notaire_case_queue 
WHERE region = 'Dakar'
  AND status = 'pending'
  AND assigned_notaire_id IS NULL
ORDER BY priority DESC, created_at ASC;
```

**Avantages** ✅:
- Notaires choisissent leur charge
- Flexibilité maximale
- Pas de surcharge forcée
- Priorisation possible

**Inconvénients** ❌:
- Dossiers peuvent rester en attente
- Inégalité entre notaires
- Besoin de monitoring
- Complexité workflow

---

## 🏆 RECOMMANDATION - APPROCHE HYBRIDE

**Solution proposée**: **Option 4 (Mixte)** avec **possibilité de choix** (Option 3)

### 📋 Workflow proposé:

```
┌─────────────────────────────────────────────────────┐
│  ÉTAPE 1: Vendeur accepte la demande d'achat        │
├─────────────────────────────────────────────────────┤
│  → purchase_request.status = 'seller_accepted'      │
│  → Créer purchase_case (sans notaire assigné)      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  ÉTAPE 2: Proposer 3 notaires recommandés           │
├─────────────────────────────────────────────────────┤
│  → Algorithme scoring (Géo + Dispo + Rating)        │
│  → Afficher TOP 3 notaires                          │
│  → Acheteur/Vendeur choisit OU clique "Auto"       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  ÉTAPE 3: Notification au notaire choisi            │
├─────────────────────────────────────────────────────┤
│  → Notaire reçoit notification                      │
│  → Notaire a 24h pour accepter/refuser             │
│  → Si refus → proposer notaire suivant             │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  ÉTAPE 4: Notaire accepte le dossier                │
├─────────────────────────────────────────────────────┤
│  → purchase_case.notaire_id = notaire_id            │
│  → purchase_case.notaire_accepted_at = NOW()        │
│  → Status → 'notary_assigned'                       │
└─────────────────────────────────────────────────────┘
```

---

## 🗂️ MODIFICATIONS BASE DE DONNÉES

### 1. Ajouter colonnes à `purchase_cases`

```sql
ALTER TABLE purchase_cases
ADD COLUMN IF NOT EXISTS notaire_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS notaire_assigned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS notaire_accepted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS notaire_selection_method VARCHAR(50) DEFAULT 'auto', 
  -- 'auto', 'manual', 'geographic', 'recommended'
ADD COLUMN IF NOT EXISTS assignment_metadata JSONB DEFAULT '{}'::jsonb;
  -- Stocke: {score: 85, distance_km: 12, reason: 'closest_available'}

-- Index
CREATE INDEX IF NOT EXISTS idx_purchase_cases_notaire 
ON purchase_cases(notaire_id);
```

### 2. Créer table `notaire_profiles`

```sql
CREATE TABLE IF NOT EXISTS notaire_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  
  -- Informations office
  office_name VARCHAR(255),
  office_address TEXT,
  office_region VARCHAR(100),
  office_commune VARCHAR(100),
  office_latitude DECIMAL(10, 8),
  office_longitude DECIMAL(11, 8),
  
  -- Spécialisations
  specializations TEXT[] DEFAULT ARRAY['terrain', 'immobilier'],
  
  -- Disponibilité
  is_available BOOLEAN DEFAULT true,
  max_concurrent_cases INTEGER DEFAULT 10,
  current_cases_count INTEGER DEFAULT 0,
  
  -- Performance
  total_cases_completed INTEGER DEFAULT 0,
  average_completion_days DECIMAL(5, 2),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  
  -- Tarification
  base_fee DECIMAL(10, 2) DEFAULT 50000, -- 50,000 FCFA
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS
ALTER TABLE notaire_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view notaire profiles"
ON notaire_profiles FOR SELECT
USING (true);

CREATE POLICY "Notaires can update their own profile"
ON notaire_profiles FOR UPDATE
USING (id = auth.uid());
```

### 3. Créer table `notaire_case_assignments`

```sql
CREATE TABLE IF NOT EXISTS notaire_case_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id),
  notaire_id UUID NOT NULL REFERENCES profiles(id),
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending', 
    -- 'pending', 'accepted', 'declined', 'timeout'
  
  -- Timing
  proposed_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- Scoring
  assignment_score INTEGER,
  assignment_reason TEXT,
  assignment_metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Notes
  notaire_notes TEXT,
  
  CONSTRAINT valid_assignment_status CHECK (status IN 
    ('pending', 'accepted', 'declined', 'timeout', 'cancelled')
  )
);

CREATE INDEX idx_assignments_case ON notaire_case_assignments(case_id);
CREATE INDEX idx_assignments_notaire ON notaire_case_assignments(notaire_id);
CREATE INDEX idx_assignments_status ON notaire_case_assignments(status);
```

---

## 🔧 SERVICE JAVASCRIPT

```javascript
// NotaireAssignmentService.js

class NotaireAssignmentService {
  
  /**
   * 🎯 Trouver les 3 meilleurs notaires pour un dossier
   */
  static async findBestNotaires(caseId, options = {}) {
    const { autoAssign = false, limit = 3 } = options;
    
    // 1. Récupérer infos du dossier
    const { data: purchaseCase } = await supabase
      .from('purchase_cases')
      .select('*, parcelle:parcels(*)')
      .eq('id', caseId)
      .single();
    
    // 2. Récupérer tous les notaires actifs
    const { data: notaires } = await supabase
      .from('notaire_profiles')
      .select('*')
      .eq('is_available', true)
      .lt('current_cases_count', supabase.ref('max_concurrent_cases'));
    
    // 3. Calculer score pour chaque notaire
    const scoredNotaires = notaires.map(notaire => ({
      ...notaire,
      score: this.calculateNotaireScore(notaire, purchaseCase),
      distance: this.calculateDistance(
        notaire.office_latitude,
        notaire.office_longitude,
        purchaseCase.parcelle.latitude,
        purchaseCase.parcelle.longitude
      )
    }));
    
    // 4. Trier par score décroissant
    const bestNotaires = scoredNotaires
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    // 5. Si auto-assign, proposer au premier
    if (autoAssign && bestNotaires.length > 0) {
      await this.proposeToNotaire(caseId, bestNotaires[0].id);
    }
    
    return { success: true, data: bestNotaires };
  }
  
  /**
   * 🧮 Calculer le score d'un notaire
   */
  static calculateNotaireScore(notaire, purchaseCase) {
    let score = 100;
    
    // Distance (max -50 points)
    const distance = this.calculateDistance(
      notaire.office_latitude,
      notaire.office_longitude,
      purchaseCase.parcelle.latitude,
      purchaseCase.parcelle.longitude
    );
    score -= Math.min(distance * 2, 50); // -2 points par km
    
    // Charge de travail
    const loadPercentage = notaire.current_cases_count / notaire.max_concurrent_cases;
    score -= loadPercentage * 30; // Max -30 points si à 100%
    
    // Performance historique
    if (notaire.rating >= 4.5) score += 20;
    if (notaire.average_completion_days <= 30) score += 15;
    
    // Spécialisation
    if (notaire.specializations.includes('terrain')) score += 10;
    
    // Expérience
    if (notaire.total_cases_completed > 50) score += 10;
    
    return Math.max(0, Math.round(score));
  }
  
  /**
   * 📤 Proposer le dossier à un notaire
   */
  static async proposeToNotaire(caseId, notaireId) {
    const { data, error } = await supabase
      .from('notaire_case_assignments')
      .insert({
        case_id: caseId,
        notaire_id: notaireId,
        status: 'pending',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Envoyer notification
    await NotificationService.send({
      user_id: notaireId,
      type: 'new_case_assignment',
      title: 'Nouveau dossier à traiter',
      message: `Un nouveau dossier vous a été assigné. Acceptez-le sous 24h.`,
      data: { case_id: caseId, assignment_id: data.id }
    });
    
    return { success: true, data };
  }
  
  /**
   * ✅ Notaire accepte le dossier
   */
  static async acceptAssignment(assignmentId, notaireId) {
    // 1. Mettre à jour l'assignment
    await supabase
      .from('notaire_case_assignments')
      .update({ 
        status: 'accepted',
        responded_at: new Date()
      })
      .eq('id', assignmentId)
      .eq('notaire_id', notaireId);
    
    // 2. Récupérer l'assignment pour avoir case_id
    const { data: assignment } = await supabase
      .from('notaire_case_assignments')
      .select('case_id')
      .eq('id', assignmentId)
      .single();
    
    // 3. Assigner le notaire au dossier
    await supabase
      .from('purchase_cases')
      .update({
        notaire_id: notaireId,
        notaire_accepted_at: new Date(),
        status: 'notary_assigned'
      })
      .eq('id', assignment.case_id);
    
    // 4. Incrémenter current_cases_count
    await supabase.rpc('increment_notaire_cases', { 
      notaire_id: notaireId 
    });
    
    return { success: true };
  }
  
  /**
   * 📐 Calculer distance (formule Haversine)
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance en km
  }
}
```

---

## 🎨 UI/UX - Composant React

```jsx
// NotaireSelectionModal.jsx

function NotaireSelectionModal({ caseId, onSelect }) {
  const [notaires, setNotaires] = useState([]);
  const [selectedNotaire, setSelectedNotaire] = useState(null);
  
  useEffect(() => {
    loadRecommendedNotaires();
  }, []);
  
  const loadRecommendedNotaires = async () => {
    const result = await NotaireAssignmentService.findBestNotaires(caseId);
    setNotaires(result.data);
  };
  
  const handleAutoAssign = async () => {
    await NotaireAssignmentService.proposeToNotaire(
      caseId, 
      notaires[0].id
    );
    onSelect(notaires[0]);
  };
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choisir un notaire</DialogTitle>
          <DialogDescription>
            3 notaires recommandés pour votre dossier
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {notaires.map((notaire, index) => (
            <Card 
              key={notaire.id}
              className={`cursor-pointer ${
                selectedNotaire?.id === notaire.id ? 'border-primary' : ''
              }`}
              onClick={() => setSelectedNotaire(notaire)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    {index === 0 && (
                      <Badge className="mb-2">Recommandé</Badge>
                    )}
                    <h3 className="font-semibold">{notaire.office_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {notaire.office_region}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        ⭐ {notaire.rating}/5
                      </Badge>
                      <Badge variant="outline">
                        📍 {notaire.distance.toFixed(1)} km
                      </Badge>
                      <Badge variant="outline">
                        📊 {notaire.current_cases_count}/{notaire.max_concurrent_cases} dossiers
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {notaire.score}
                    </div>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleAutoAssign}
          >
            Attribution automatique
          </Button>
          <Button 
            onClick={() => onSelect(selectedNotaire)}
            disabled={!selectedNotaire}
          >
            Choisir ce notaire
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 📊 TABLEAU RÉCAPITULATIF

| Critère | Option 1<br/>Aléatoire | Option 2<br/>Géo | Option 3<br/>Choix Libre | Option 4<br/>Mixte | Option 5<br/>Queue |
|---------|-----------|------|-------------|-------|-------|
| **Équité charge** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Qualité service** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Rapidité attribution** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Expérience utilisateur** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Complexité technique** | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Évolutivité** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**🏆 Recommandation**: **Option 4 - Système Mixte**

---

## ❓ QUESTIONS À DÉCIDER

1. **Qui choisit le notaire ?**
   - [ ] Acheteur seul
   - [ ] Vendeur seul
   - [ ] Les deux doivent être d'accord
   - [ ] Auto (système)

2. **Le notaire peut-il refuser ?**
   - [ ] Oui (délai 24h)
   - [ ] Non (attribution définitive)

3. **Frais de notaire**:
   - [ ] Prix fixe (ex: 50,000 FCFA)
   - [ ] Pourcentage vente (ex: 2%)
   - [ ] Prix libre (notaire fixe)

4. **Gestion des conflits**:
   - [ ] Si notaire refuse → proposer suivant
   - [ ] Si pas de notaire dispo → file d'attente
   - [ ] Si désaccord acheteur/vendeur → médiateur

---

## 🚀 PROCHAINES ÉTAPES

1. **Décider de l'approche** (recommandé: Option 4)
2. **Exécuter migrations SQL** (notaire_profiles, notaire_case_assignments)
3. **Créer NotaireAssignmentService.js**
4. **Créer composant NotaireSelectionModal.jsx**
5. **Intégrer dans workflow de vente** (après seller_accepted)
6. **Tester avec données réelles**

---

**Votre avis ?** Quelle option préférez-vous ? Des questions ?
