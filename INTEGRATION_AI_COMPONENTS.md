/**
 * @file INTEGRATION_AI_COMPONENTS.md
 * @description Guide d'intégration composants IA Semaine 3
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

# Guide d'Intégration - Composants IA (Semaine 3)

## 📦 Composants créés

### 1. **useAIDocumentValidation.js** (Hook)
Hook React pour valider documents avec l'IA.

**Localisation**: `src/hooks/useAIDocumentValidation.js`

**Usage**:
```javascript
import { useAIDocumentValidation } from '@/hooks/useAIDocumentValidation';

function DocumentUpload() {
  const { validateDocument, validateCaseDocuments, isValidating } = useAIDocumentValidation();

  const handleValidate = async () => {
    // Valider un document
    await validateDocument(documentId, 'cni');
    
    // Ou valider tous les documents d'un cas
    await validateCaseDocuments(caseId);
  };
}
```

---

### 2. **AIValidationButton.jsx** (Bouton validation)
Bouton avec modal affichant résultats validation IA.

**Localisation**: `src/components/ai/AIValidationButton.jsx`

**Props**:
- `caseId` (string, required): ID du cas à valider
- `documents` (array, required): Liste documents du cas
- `onValidationComplete` (function, optional): Callback après validation

**Intégration**:
```javascript
import AIValidationButton from '@/components/ai/AIValidationButton';

// Dans page détails cas notaire
<AIValidationButton 
  caseId={purchaseCase.id}
  documents={purchaseCase.documents}
  onValidationComplete={(results) => {
    console.log('Validation terminée:', results);
    // Actualiser état du cas
  }}
/>
```

**Exemple d'utilisation**:
- Page `NotaireCaseDetail.jsx`
- Page `AdminCaseReview.jsx`

---

### 3. **AIValidationBadge.jsx** (Badge statut)
Badge compact pour afficher statut validation IA sur documents.

**Localisation**: `src/components/ai/AIValidationBadge.jsx`

**Props**:
- `status` (string, required): 'valid' | 'invalid' | 'pending' | 'warning' | 'not_validated'
- `score` (number, optional): Score confiance 0-100
- `issues` (array, optional): Liste problèmes détectés
- `size` (string, optional): 'sm' | 'default' | 'lg'
- `showScore` (boolean, optional): Afficher score (default: true)
- `showTooltip` (boolean, optional): Afficher tooltip (default: true)

**Intégration**:
```javascript
import AIValidationBadge, { AIValidationIcon, AIValidationCard } from '@/components/ai/AIValidationBadge';

// Badge complet
<AIValidationBadge 
  status="valid" 
  score={92}
  issues={[]}
/>

// Icône seule (pour listes)
<AIValidationIcon status="invalid" score={45} />

// Carte détaillée
<AIValidationCard 
  status="invalid"
  score={45}
  issues={['Document expiré', 'Signature manquante']}
  onRevalidate={() => handleRevalidate()}
/>
```

**Exemple d'utilisation**:
- Liste documents dans `DocumentsList.jsx`
- Cartes documents dans `PurchaseCaseDocuments.jsx`

---

### 4. **FraudDetectionPanel.jsx** (Détection fraude)
Panneau complet analyse fraude pour notaires/admins.

**Localisation**: `src/components/ai/FraudDetectionPanel.jsx`

**Props**:
- `caseId` (string, required): ID du cas à analyser
- `caseData` (object, optional): Données du cas (si déjà chargées)
- `onAnalysisComplete` (function, optional): Callback après analyse

**Intégration**:
```javascript
import FraudDetectionPanel from '@/components/ai/FraudDetectionPanel';

// Dans page détails cas notaire
<FraudDetectionPanel 
  caseId={purchaseCase.id}
  caseData={purchaseCase}
  onAnalysisComplete={(fraudAnalysis) => {
    if (fraudAnalysis.riskLevel === 'critical') {
      // Bloquer transaction
      alert('⛔ FRAUDE CRITIQUE DÉTECTÉE');
    }
  }}
/>
```

**Exemple d'utilisation**:
- Page `NotaireCaseDetail.jsx` (onglet "Sécurité")
- Page `AdminCaseReview.jsx` (section fraude)

**Autorisations**: Notaires et Admins uniquement

---

### 5. **PropertyRecommendations.jsx** (Recommandations)
Affichage recommandations personnalisées par IA.

**Localisation**: `src/components/ai/PropertyRecommendations.jsx`

**Props**:
- `userId` (string, required): ID utilisateur
- `maxRecommendations` (number, optional): Nombre max (default: 6)

**Intégration**:
```javascript
import PropertyRecommendations, { PropertyRecommendationsCompact } from '@/components/ai/PropertyRecommendations';

// Version complète (grille)
<PropertyRecommendations 
  userId={user.id}
  maxRecommendations={6}
/>

// Version compacte (sidebar)
<PropertyRecommendationsCompact 
  userId={user.id}
  maxItems={3}
/>
```

**Exemple d'utilisation**:
- Dashboard acheteur: `DashboardParticulier.jsx` (section recommandations)
- Page recherche: `PropertiesSearchPage.jsx` (sidebar)

---

### 6. **AIPropertyEvaluation.jsx** (Évaluation prix)
Composant évaluation prix IA avec comparaison prix affiché.

**Localisation**: `src/components/ai/AIPropertyEvaluation.jsx`

**Props**:
- `propertyId` (string, required): ID propriété
- `listedPrice` (number, required): Prix affiché
- `onEvaluationComplete` (function, optional): Callback après évaluation

**Intégration**:
```javascript
import AIPropertyEvaluation, { AIEvaluationBadge } from '@/components/ai/AIPropertyEvaluation';

// Composant complet
<AIPropertyEvaluation 
  propertyId={property.id}
  listedPrice={property.price}
  onEvaluationComplete={(evaluation) => {
    console.log('Prix IA:', evaluation.estimatedPrice);
  }}
/>

// Badge compact (pour cartes)
<AIEvaluationBadge 
  estimatedPrice={property.ai_estimated_price}
  confidence={property.ai_price_confidence}
  listedPrice={property.price}
/>
```

**Exemple d'utilisation**:
- Page détails propriété: `PropertyDetailPage.jsx` (section prix)
- Cartes propriétés: `PropertyCard.jsx` (badge)

---

### 7. **AIFraudDashboard.jsx** (Dashboard admin)
Dashboard admin surveillance fraude avec filtres et stats.

**Localisation**: `src/pages/admin/AIFraudDashboard.jsx`

**Intégration route**:
```javascript
// Dans App.jsx ou routes admin
import AIFraudDashboard from '@/pages/admin/AIFraudDashboard';

<Route path="/admin/fraud-detection" element={<AIFraudDashboard />} />
```

**Exemple d'utilisation**:
- Menu admin: Ajouter lien "Surveillance Fraude IA"
- Autorisations: Admins uniquement

---

## 🔗 API Routes (Backend)

Les composants appellent ces endpoints (déjà créés dans `backend/routes/aiRoutes.js`):

### 1. POST `/api/ai/validate-document`
Valider un document unique.

**Body**:
```json
{
  "documentId": "uuid",
  "documentType": "cni" // ou "passport", "title_deed", "contract"
}
```

**Response**:
```json
{
  "validation": {
    "isValid": true,
    "issues": [],
    "confidenceScore": 92
  }
}
```

---

### 2. POST `/api/ai/validate-case-documents`
Valider tous documents d'un cas.

**Body**:
```json
{
  "caseId": "uuid"
}
```

**Response**:
```json
{
  "results": [
    {
      "documentId": "uuid",
      "documentType": "cni",
      "isValid": true,
      "confidenceScore": 92,
      "issues": []
    }
  ],
  "summary": {
    "totalDocuments": 5,
    "validDocuments": 4,
    "invalidDocuments": 1,
    "averageScore": 78
  }
}
```

---

### 3. POST `/api/ai/detect-fraud`
Analyser fraude (notaires/admins uniquement).

**Body**:
```json
{
  "caseId": "uuid"
}
```

**Response**:
```json
{
  "fraudAnalysis": {
    "riskScore": 75,
    "riskLevel": "high",
    "flags": [
      {
        "category": "document",
        "type": "Document falsifié",
        "description": "Signature numérique invalide",
        "severity": "high"
      }
    ]
  }
}
```

---

### 4. GET `/api/ai/recommendations/:userId`
Obtenir recommandations personnalisées.

**Response**:
```json
{
  "recommendations": [
    {
      "propertyId": "uuid",
      "matchScore": 92,
      "reasons": ["Zone préférée", "Budget adapté"],
      "property": {
        "title": "Villa moderne",
        "location": "Almadies",
        "price": 50000000,
        "images": ["url1"]
      }
    }
  ],
  "count": 6
}
```

---

### 5. POST `/api/ai/evaluate-property`
Évaluer prix propriété.

**Body**:
```json
{
  "propertyId": "uuid"
}
```

**Response**:
```json
{
  "evaluation": {
    "estimatedPrice": 48000000,
    "confidence": 87,
    "priceRange": {
      "min": 45000000,
      "max": 51000000
    }
  }
}
```

---

## 📊 Colonnes Base de Données

### Table `documents`
Colonnes IA ajoutées:
- `ai_validation_status` VARCHAR(20): 'valid', 'invalid', 'pending', 'not_validated'
- `ai_validation_score` DECIMAL(5, 2): Score 0-100
- `ai_validation_issues` JSONB: Array problèmes détectés
- `ai_validated_at` TIMESTAMPTZ: Date validation

### Table `purchase_cases`
Colonnes IA ajoutées:
- `ai_documents_validated` BOOLEAN: Tous docs validés?
- `ai_documents_score` DECIMAL(5, 2): Score moyen documents
- `ai_documents_valid_count` INT: Nombre docs valides
- `ai_documents_total_count` INT: Nombre total docs
- `fraud_risk_score` DECIMAL(5, 2): Score fraude 0-100
- `fraud_flags` JSONB: Array alertes fraude
- `fraud_analyzed_at` TIMESTAMPTZ: Date analyse fraude

### Table `properties`
Colonnes IA ajoutées:
- `ai_estimated_price` DECIMAL(15, 2): Prix estimé IA
- `ai_price_confidence` DECIMAL(5, 2): Confiance 0-100
- `ai_price_range_min` DECIMAL(15, 2): Prix min fourchette
- `ai_price_range_max` DECIMAL(15, 2): Prix max fourchette
- `ai_evaluated_at` TIMESTAMPTZ: Date évaluation

---

## 🚀 Plan d'Intégration Progressif

### Phase 1: Validation Documents (2h)
1. Intégrer `AIValidationButton` dans `NotaireCaseDetail.jsx`
2. Ajouter `AIValidationBadge` dans liste documents
3. Tester validation avec vrais documents

### Phase 2: Détection Fraude (2h)
1. Intégrer `FraudDetectionPanel` dans page notaire
2. Créer route `/admin/fraud-detection`
3. Ajouter `AIFraudDashboard` au menu admin
4. Tester avec cas à risque

### Phase 3: Recommandations (2h)
1. Intégrer `PropertyRecommendations` dans dashboard acheteur
2. Ajouter `PropertyRecommendationsCompact` en sidebar
3. Tester avec historique recherches

### Phase 4: Évaluation Prix (1h)
1. Intégrer `AIPropertyEvaluation` dans `PropertyDetailPage`
2. Ajouter `AIEvaluationBadge` sur cartes propriétés
3. Tester avec différentes propriétés

### Phase 5: Tests & Ajustements (1h)
1. Tester tous composants end-to-end
2. Ajuster styles si nécessaire
3. Optimiser performances

---

## ✅ Checklist Finalisation Semaine 3

- [ ] Tous composants créés (7/7)
- [ ] API routes fonctionnelles (5/5)
- [ ] Colonnes DB ajoutées
- [ ] Tests validation documents
- [ ] Tests détection fraude
- [ ] Tests recommandations
- [ ] Tests évaluation prix
- [ ] Dashboard admin opérationnel
- [ ] Documentation à jour
- [ ] Commit Git "feat(week3-day1-5): AI Integration Complete"

---

## 📝 Notes Importantes

1. **Autorisations**: Détection fraude réservée notaires/admins
2. **Performance**: Validation IA prend 2-5 secondes
3. **Coûts**: Chaque appel IA consomme crédits (monitorer)
4. **Fallback**: Si IA échoue, validation manuelle notaire

---

## 🔄 Prochaine Étape: Semaine 4 - Blockchain

Après validation Semaine 3, démarrer:
- Smart contracts Polygon
- Tokenisation propriétés (NFT)
- Stockage IPFS documents
- Intégration Web3 frontend
