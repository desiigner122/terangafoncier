# 🎨 GUIDE INTÉGRATION UI - COMPOSANTS IA

## Vue d'ensemble

Ce guide montre comment intégrer les composants IA dans vos pages existantes.

---

## 1️⃣ NOTIFICATION BELL (Déjà prêt)

### Intégrer dans Header/Navbar

```jsx
// src/components/layout/Header.jsx ou Navbar.jsx
import NotificationBell from '@/components/notifications/NotificationBell';
import { useAuth } from '@/hooks/useAuth';

function Header() {
  const { user } = useAuth();

  return (
    <header>
      {/* ... autres éléments ... */}
      
      {/* Notification Bell */}
      {user && <NotificationBell userId={user.id} />}
      
      {/* ... autres éléments ... */}
    </header>
  );
}
```

---

## 2️⃣ AI VALIDATION BUTTON (Documents)

### Option A: Dans page cas d'achat (Notaire/Admin)

```jsx
// src/pages/cases/CaseDetailPage.jsx ou similaire
import AIValidationButton from '@/components/ai/AIValidationButton';
import FraudDetectionPanel from '@/components/ai/FraudDetectionPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function CaseDetailPage() {
  const { caseId } = useParams();
  const [purchaseCase, setPurchaseCase] = useState(null);

  return (
    <div>
      <h1>Cas d'achat #{purchaseCase?.case_number}</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai-validation">🤖 Validation IA</TabsTrigger>
          <TabsTrigger value="security">🛡️ Sécurité</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Contenu existant */}
        </TabsContent>

        <TabsContent value="documents">
          {/* Liste documents existante */}
        </TabsContent>

        {/* NOUVEAU ONGLET */}
        <TabsContent value="ai-validation">
          <AIValidationButton 
            caseId={purchaseCase.id}
            documents={purchaseCase.documents}
            onValidationComplete={(results) => {
              console.log('✅ Validation terminée:', results);
              toast.success(`${results.totalDocuments} documents validés`);
              // Rafraîchir les données
              refetchCase();
            }}
          />
        </TabsContent>

        {/* NOUVEAU ONGLET */}
        <TabsContent value="security">
          <FraudDetectionPanel 
            caseId={purchaseCase.id}
            caseData={purchaseCase}
            onAnalysisComplete={(fraudAnalysis) => {
              console.log('🛡️ Analyse fraude:', fraudAnalysis);
              if (fraudAnalysis.riskLevel === 'critical') {
                toast.error('⛔ FRAUDE CRITIQUE DÉTECTÉE');
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### Option B: Dans liste documents

```jsx
// src/components/documents/DocumentsList.jsx
import AIValidationBadge from '@/components/ai/AIValidationBadge';

function DocumentsList({ documents }) {
  return (
    <div className="space-y-2">
      {documents.map(doc => (
        <div key={doc.id} className="flex items-center gap-3 p-3 border rounded">
          {/* Icône document */}
          <FileText className="h-5 w-5" />
          
          {/* Nom */}
          <span className="font-medium">{doc.file_name}</span>
          
          {/* NOUVEAU: Badge validation IA */}
          {doc.ai_validation_status && (
            <AIValidationBadge 
              status={doc.ai_validation_status}
              score={doc.ai_validation_score}
              issues={doc.ai_validation_issues || []}
              size="sm"
            />
          )}
          
          {/* ... autres badges ... */}
        </div>
      ))}
    </div>
  );
}
```

---

## 3️⃣ PROPERTY RECOMMENDATIONS (Dashboard Acheteur)

```jsx
// src/pages/dashboards/buyer/BuyerDashboard.jsx ou DashboardParticulier.jsx
import PropertyRecommendations from '@/components/ai/PropertyRecommendations';
import { useAuth } from '@/hooks/useAuth';

function BuyerDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... sections existantes (stats, recherches récentes, etc.) ... */}

      {/* NOUVELLE SECTION: Recommandations IA */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>🤖</span>
              Recommandé pour vous
            </h2>
            <p className="text-gray-600 mt-1">
              Sélection intelligente basée sur vos préférences et recherches
            </p>
          </div>
        </div>

        <PropertyRecommendations 
          userId={user.id}
          maxRecommendations={6}
          showExplanations={true}
        />
      </section>

      {/* ... autres sections ... */}
    </div>
  );
}
```

---

## 4️⃣ AI PROPERTY EVALUATION (Page Détails Propriété)

```jsx
// src/pages/properties/PropertyDetailPage.jsx
import AIPropertyEvaluation, { AIEvaluationBadge } from '@/components/ai/AIPropertyEvaluation';

function PropertyDetailPage() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);

  return (
    <div>
      {/* ... autres sections ... */}

      {/* Section Prix */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Prix de vente</h3>
        
        <div className="flex items-baseline gap-3">
          <p className="text-4xl font-bold text-emerald-600">
            {property.price.toLocaleString('fr-FR')} FCFA
          </p>
          
          {/* NOUVEAU: Badge évaluation IA (si déjà évalué) */}
          {property.ai_estimated_price && (
            <AIEvaluationBadge 
              estimatedPrice={property.ai_estimated_price}
              confidence={property.ai_price_confidence}
              listedPrice={property.price}
            />
          )}
        </div>

        {/* Détails prix IA */}
        {property.ai_estimated_price && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>Estimation IA:</strong> {property.ai_estimated_price.toLocaleString('fr-FR')} FCFA
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Fourchette: {property.ai_price_range_min?.toLocaleString('fr-FR')} - {property.ai_price_range_max?.toLocaleString('fr-FR')} FCFA
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Confiance: {Math.round(property.ai_price_confidence)}%
            </p>
          </div>
        )}
      </section>

      {/* NOUVELLE SECTION: Évaluation IA (si pas encore évalué) */}
      {!property.ai_estimated_price && (
        <section className="mt-6">
          <AIPropertyEvaluation 
            propertyId={property.id}
            listedPrice={property.price}
            onEvaluationComplete={(evaluation) => {
              console.log('✅ Évaluation IA:', evaluation);
              // Update local state
              setProperty({
                ...property,
                ai_estimated_price: evaluation.estimatedPrice,
                ai_price_confidence: evaluation.confidence,
                ai_price_range_min: evaluation.priceRange.min,
                ai_price_range_max: evaluation.priceRange.max
              });
              toast.success('Prix évalué avec succès');
            }}
          />
        </section>
      )}
    </div>
  );
}
```

---

## 5️⃣ AI FRAUD DASHBOARD (Admin)

### Ajouter route

```jsx
// src/App.jsx
import AIFraudDashboard from '@/pages/admin/AIFraudDashboard';

function App() {
  return (
    <Routes>
      {/* ... autres routes ... */}

      {/* Routes Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        
        {/* NOUVELLE ROUTE */}
        <Route path="fraud-detection" element={<AIFraudDashboard />} />
      </Route>
    </Routes>
  );
}
```

### Ajouter lien dans sidebar admin

```jsx
// src/components/admin/AdminSidebar.jsx
import { Shield } from 'lucide-react';

function AdminSidebar() {
  return (
    <nav>
      {/* ... autres liens ... */}
      
      {/* NOUVEAU LIEN */}
      <Link 
        to="/admin/fraud-detection"
        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded"
      >
        <Shield className="w-5 h-5" />
        <span>Surveillance Fraude IA</span>
      </Link>
    </nav>
  );
}
```

---

## 📦 IMPORTS NÉCESSAIRES

### Composants UI (Shadcn)

```bash
# Si pas déjà installés
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add scroll-area
```

### Dépendances NPM

```bash
npm install date-fns sonner
```

---

## 🎨 CLASSES TAILWIND UTILISÉES

Les composants utilisent ces classes Tailwind (déjà dans votre config normalement):

- `bg-emerald-*`, `text-emerald-*` - Success/Valid
- `bg-red-*`, `text-red-*` - Error/Invalid
- `bg-yellow-*`, `text-yellow-*` - Warning/Medium
- `bg-blue-*`, `text-blue-*` - Info
- `bg-gray-*`, `text-gray-*` - Neutral

---

## 🧪 TESTER L'INTÉGRATION

### 1. Notification Bell

```
✅ Login → Header affiche icône cloche
✅ Déclencher notification (upload document) → Badge compteur apparaît
✅ Cliquer cloche → Dropdown avec liste notifications
✅ Cliquer notification → Navigation vers page concernée
```

### 2. AI Validation

```
✅ Cas d'achat → Onglet "Validation IA"
✅ Cliquer "Valider avec l'IA" → Modal loading
✅ Après 3-5s → Modal résultats avec badges valid/invalid
✅ Documents invalides → Détails problèmes affichés
```

### 3. Recommendations

```
✅ Dashboard acheteur → Section "Recommandé pour vous"
✅ 6 propriétés affichées avec badges "IA recommande"
✅ Score match affiché (%)
✅ Raisons recommandation visibles
```

### 4. Price Evaluation

```
✅ Page propriété → Section "Évaluer avec l'IA"
✅ Cliquer bouton → Loading 2-3s
✅ Résultats affichés: prix estimé, fourchette, confiance
✅ Badge comparaison: "Bon prix" / "Surcoté" / "Sous-coté"
```

### 5. Fraud Dashboard

```
✅ /admin/fraud-detection → Page charge
✅ Stats cards affichées (critique, élevé, moyen, faible)
✅ Filtres fonctionnels (recherche, niveau, période)
✅ Table paginée avec cas
✅ Export CSV fonctionne
```

---

## 🐛 TROUBLESHOOTING

### Composant ne s'affiche pas

```javascript
// Vérifier imports
import AIValidationButton from '@/components/ai/AIValidationButton';

// Vérifier props requises
<AIValidationButton 
  caseId={purchaseCase.id}  // REQUIS
  documents={purchaseCase.documents}  // REQUIS
  onValidationComplete={(results) => {}}  // Optionnel mais recommandé
/>
```

### Erreur "Cannot read property of undefined"

```javascript
// Ajouter vérifications null safety
{purchaseCase?.documents && (
  <AIValidationButton 
    caseId={purchaseCase.id}
    documents={purchaseCase.documents}
  />
)}
```

### Styles Tailwind ne s'appliquent pas

```javascript
// Vérifier tailwind.config.js inclut le dossier components
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"  // Ajouter cette ligne
  ],
  // ...
}
```

---

## 📊 RÉSULTAT ATTENDU

Après intégration complète:

✅ **Notification Bell** visible dans header (toutes les pages)  
✅ **Validation IA** dans onglet dédié (pages cas d'achat)  
✅ **Badges validation** sur chaque document (listes documents)  
✅ **Recommandations** dans dashboard acheteur  
✅ **Évaluation prix** dans pages propriétés  
✅ **Dashboard fraude** accessible depuis menu admin  

---

**Temps estimation intégration complète**: 2-3 heures  
**Fichiers à modifier**: 5-7 fichiers  
**Nouvelles routes**: 1 (fraud dashboard)
