# ⚡ ACTIONS IMMÉDIATES - WEEK 3 & 4
## Ce qu'il faut faire MAINTENANT (ordre de priorité)

**Date**: 04 Novembre 2025  
**Temps total estimé**: 46h 40min  
**Deadline suggérée**: 15 Novembre 2025

---

## 🔥 PHASE 1: DÉPLOIEMENT RAPIDE (30 minutes)

### ✅ ACTION 1.1: Exécuter Migration SQL (10 min)

**Pourquoi**: Colonnes `ai_*` nécessaires pour stocker résultats validation IA

**Comment**:
```
1. Ouvrir https://app.supabase.com
2. Sélectionner projet "terangafoncier"
3. Menu gauche → SQL Editor → "New query"
4. Copier TOUT le contenu de: migrations/20251103_ai_columns.sql
5. Coller dans éditeur
6. Bouton "Run" en bas à droite
7. Attendre "Success" (vert)
```

**Vérification**:
```sql
-- Exécuter cette requête pour vérifier:
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'documents' 
AND column_name LIKE 'ai_%';

-- Doit retourner:
-- ai_validation_status
-- ai_validation_score  
-- ai_validation_issues
-- ai_validated_at
```

**⚠️ CRITIQUE**: Sans cette étape, toutes les routes IA retourneront des erreurs SQL

---

### ✅ ACTION 1.2: Démarrer Dev Environment (5 min)

**Option A - Script automatique** (RECOMMANDÉ):
```powershell
# Depuis racine projet
./start-dev.ps1
```

**Option B - Manuel**:
```powershell
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
npm run dev
```

**Vérification**:
- Backend: http://localhost:5000/health → `{"status":"OK","timestamp":"..."}`
- Frontend: http://localhost:3000 → Page charge

---

### ✅ ACTION 1.3: Tester Endpoints IA (15 min)

**Prérequis**: Avoir un JWT token (login via frontend)

**Test 1 - Health Check**:
```powershell
curl http://localhost:5000/api/ai/health
# Attendu: {"status":"ok","service":"AI Routes","timestamp":"..."}
```

**Test 2 - Validate Document** (nécessite auth):
```powershell
# Remplacer YOUR_TOKEN par votre JWT
$token = "YOUR_JWT_TOKEN_HERE"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    documentId = "uuid-du-document"
    documentType = "cni"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/ai/validate-document" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

**Résultat attendu**:
```json
{
  "success": true,
  "isValid": true,
  "confidenceScore": 95,
  "issues": [],
  "details": {
    "documentType": "cni",
    "validatedFields": ["name", "birthDate", "photo"],
    "aiModel": "gpt-4-vision-preview"
  }
}
```

---

## 🎨 PHASE 2: INTÉGRATION UI (4 heures)

### ✅ ACTION 2.1: NotaireCaseDetail - Validation IA (1h)

**Fichier**: `src/pages/notaire/NotaireCaseDetail.jsx`

**Étape 1 - Import composants** (en haut du fichier):
```javascript
import AIValidationButton from '@/components/ai/AIValidationButton';
import FraudDetectionPanel from '@/components/ai/FraudDetectionPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
```

**Étape 2 - Ajouter onglet "Validation IA"** (dans le return du composant):
```javascript
<Tabs defaultValue="overview" className="mt-6">
  <TabsList>
    <TabsTrigger value="overview">📋 Vue d'ensemble</TabsTrigger>
    <TabsTrigger value="documents">📄 Documents</TabsTrigger>
    <TabsTrigger value="ai-validation">🤖 Validation IA</TabsTrigger>
    <TabsTrigger value="security">🛡️ Sécurité</TabsTrigger>
  </TabsList>

  {/* ... autres onglets existants ... */}

  <TabsContent value="ai-validation" className="space-y-6">
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

  <TabsContent value="security" className="space-y-6">
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
```

**Test**:
1. Naviguer vers un cas d'achat existant
2. Cliquer onglet "🤖 Validation IA"
3. Bouton "Valider tous les documents avec l'IA" visible
4. Cliquer → Modal résultats après 3-5 secondes

---

### ✅ ACTION 2.2: DocumentsList - Badges Validation (45 min)

**Fichier**: `src/components/documents/DocumentsList.jsx` (ou similaire)

**Import**:
```javascript
import AIValidationBadge from '@/components/ai/AIValidationBadge';
```

**Dans le rendu de chaque document** (trouver la section qui affiche les documents):
```javascript
<div className="flex items-center gap-3">
  {/* Icône type document */}
  <FileIcon type={document.document_type} />
  
  {/* Nom document */}
  <span className="font-medium">{document.file_name}</span>
  
  {/* Badge validation IA (nouveau) */}
  {document.ai_validation_status && (
    <AIValidationBadge 
      status={document.ai_validation_status}
      score={document.ai_validation_score}
      issues={document.ai_validation_issues || []}
      size="sm"
    />
  )}
  
  {/* ... autres badges (status, etc.) ... */}
</div>
```

**Test**:
1. Après avoir validé des documents (ACTION 2.1)
2. Voir badges verts (valid), rouges (invalid), ou gris (pending)
3. Hover sur badge → Tooltip avec score et issues

---

### ✅ ACTION 2.3: DashboardParticulier - Recommandations (1h)

**Fichier**: `src/pages/dashboard/DashboardParticulier.jsx`

**Import**:
```javascript
import PropertyRecommendations from '@/components/ai/PropertyRecommendations';
import { useAuth } from '@/hooks/useAuth'; // Si pas déjà importé
```

**Ajouter section recommandations** (avant ou après liste propriétés existante):
```javascript
function DashboardParticulier() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... sections existantes ... */}

      {/* NOUVELLE SECTION: Recommandations IA */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🤖 Recommandé pour vous
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

**Test**:
1. Login en tant qu'acheteur (particulier)
2. Naviguer vers dashboard
3. Voir section "🤖 Recommandé pour vous"
4. 6 propriétés affichées avec badges "IA recommande" et scores match

---

### ✅ ACTION 2.4: PropertyDetailPage - Évaluation Prix (1h 15min)

**Fichier**: `src/pages/properties/PropertyDetailPage.jsx`

**Import**:
```javascript
import AIPropertyEvaluation, { AIEvaluationBadge } from '@/components/ai/AIPropertyEvaluation';
```

**Modifier section prix** (trouver où le prix est affiché):
```javascript
{/* Section Prix */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold mb-3">Prix de vente</h3>
  
  <div className="flex items-baseline gap-3">
    <p className="text-4xl font-bold text-emerald-600">
      {property.price.toLocaleString('fr-FR')} FCFA
    </p>
    
    {/* Badge évaluation IA (si déjà évalué) */}
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
</div>

{/* Nouvelle section: Évaluation IA (si pas encore évalué) */}
{!property.ai_estimated_price && (
  <div className="mt-6">
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
  </div>
)}
```

**Test**:
1. Naviguer vers détails d'une propriété
2. Voir bouton "Évaluer le prix avec l'IA"
3. Cliquer → Attendre 2-3 secondes
4. Résultats affichés avec badge (bon prix / surcoté / sous-coté)

---

## 🔥 PHASE 3: WORKFLOWS AUTONOMES (20 heures)

### ✅ ACTION 3.1: Auto-Validation Documents (8h)

**Objectif**: Valider automatiquement chaque document uploadé

**Créer fichier**: `backend/workflows/autoValidateDocuments.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import { analyzeDocumentAI } from '../config/ai.js';
import logger from '../utils/logger.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function setupDocumentValidationTrigger() {
  logger.info('🤖 Initializing auto-validation workflow...');

  const channel = supabase
    .channel('documents-validation')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'documents',
        filter: 'status=eq.uploaded'
      },
      async (payload) => {
        const document = payload.new;
        
        logger.info(`📄 New document detected: ${document.id} (${document.document_type})`);
        
        try {
          // Valider avec IA
          const validation = await analyzeDocumentAI(
            document.file_url,
            document.document_type
          );
          
          logger.info(`✅ Validation complete: ${validation.isValid ? 'VALID' : 'INVALID'} (score: ${validation.confidenceScore})`);
          
          // Update DB
          const { error } = await supabase
            .from('documents')
            .update({
              ai_validation_status: validation.isValid ? 'valid' : 'invalid',
              ai_validation_score: validation.confidenceScore,
              ai_validation_issues: validation.issues,
              ai_validated_at: new Date().toISOString(),
              status: validation.isValid ? 'verified' : 'rejected'
            })
            .eq('id', document.id);
          
          if (error) throw error;
          
          // Si invalide, notifier utilisateur
          if (!validation.isValid) {
            await supabase.from('notifications').insert({
              user_id: document.uploaded_by,
              type: 'document_rejected',
              title: '❌ Document rejeté par l\'IA',
              message: `Votre ${document.document_type} a été rejeté: ${validation.issues.join(', ')}`,
              data: { 
                documentId: document.id,
                issues: validation.issues
              },
              read: false
            });
            
            logger.warn(`⚠️ User ${document.uploaded_by} notified of rejection`);
          }
          
        } catch (error) {
          logger.error('❌ Auto-validation error:', error);
          
          // Update en erreur
          await supabase
            .from('documents')
            .update({
              ai_validation_status: 'error',
              ai_validation_issues: [error.message],
              status: 'uploaded' // Garder uploaded pour retry manuel
            })
            .eq('id', document.id);
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        logger.info('✅ Auto-validation workflow active');
      }
    });
    
  return channel;
}
```

**Intégrer dans**: `backend/server.js`

```javascript
import { setupDocumentValidationTrigger } from './workflows/autoValidateDocuments.js';

// Après app.listen()
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  
  // Activer workflows autonomes
  await setupDocumentValidationTrigger();
});
```

**Test**:
1. Uploader un document (CNI, titre foncier, etc.)
2. Vérifier logs backend: "📄 New document detected"
3. Après 2-3 secondes: "✅ Validation complete"
4. Refresh page → Badge validation apparaît
5. Si invalide → Notification dans app

---

### ✅ ACTION 3.2: Auto-Détection Fraude (8h)

**Objectif**: Analyser fraude automatiquement à création cas

**Créer fichier**: `backend/workflows/autoFraudDetection.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Fonction analyse fraude (simplifié)
async function analyzeCaseFraud(caseData) {
  const flags = [];
  let riskScore = 0;

  // Analyse 1: Documents manquants
  const requiredDocs = ['cni', 'title_deed', 'proof_address'];
  const uploadedDocs = caseData.documents.map(d => d.document_type);
  const missingDocs = requiredDocs.filter(d => !uploadedDocs.includes(d));
  
  if (missingDocs.length > 0) {
    flags.push({
      category: 'document_completeness',
      severity: 'medium',
      description: `Documents manquants: ${missingDocs.join(', ')}`,
      riskPoints: 20
    });
    riskScore += 20;
  }

  // Analyse 2: Prix anormal
  const marketPrice = caseData.property.market_value || caseData.property.price;
  const priceDeviation = Math.abs(caseData.property.price - marketPrice) / marketPrice;
  
  if (priceDeviation > 0.3) { // 30% écart
    flags.push({
      category: 'price_anomaly',
      severity: priceDeviation > 0.5 ? 'high' : 'medium',
      description: `Prix anormal: ${Math.round(priceDeviation * 100)}% d'écart du marché`,
      riskPoints: priceDeviation > 0.5 ? 40 : 25
    });
    riskScore += priceDeviation > 0.5 ? 40 : 25;
  }

  // Analyse 3: Vitesse transaction suspecte
  const caseAge = (Date.now() - new Date(caseData.created_at).getTime()) / (1000 * 60 * 60); // heures
  if (caseAge < 24 && caseData.status === 'payment_pending') {
    flags.push({
      category: 'transaction_speed',
      severity: 'medium',
      description: 'Transaction très rapide (< 24h)',
      riskPoints: 15
    });
    riskScore += 15;
  }

  // Analyse 4: Vérifier historique acheteur
  const { data: buyerHistory } = await supabase
    .from('purchase_cases')
    .select('id')
    .eq('buyer_id', caseData.buyer_id)
    .eq('status', 'completed');
  
  if (buyerHistory && buyerHistory.length > 10) {
    flags.push({
      category: 'buyer_pattern',
      severity: 'low',
      description: `Acheteur avec ${buyerHistory.length} achats récents (possible revendeur)`,
      riskPoints: 10
    });
    riskScore += 10;
  }

  // Déterminer niveau risque
  let riskLevel = 'low';
  if (riskScore >= 70) riskLevel = 'critical';
  else if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 30) riskLevel = 'medium';

  return { riskScore, riskLevel, flags };
}

export async function setupFraudDetectionTrigger() {
  logger.info('🛡️ Initializing auto-fraud-detection workflow...');

  const channel = supabase
    .channel('cases-fraud-detection')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'purchase_cases'
      },
      async (payload) => {
        const purchaseCase = payload.new;
        
        logger.info(`📋 New case detected: ${purchaseCase.id}`);
        
        // Attendre 60 secondes (laisser temps upload documents)
        setTimeout(async () => {
          try {
            // Fetch données complètes
            const { data: caseData, error: fetchError } = await supabase
              .from('purchase_cases')
              .select(`
                *,
                buyer:buyer_id (*),
                seller:seller_id (*),
                property:property_id (*),
                documents (*),
                transactions (*)
              `)
              .eq('id', purchaseCase.id)
              .single();
            
            if (fetchError) throw fetchError;
            
            logger.info(`🔍 Analyzing fraud for case ${purchaseCase.id}...`);
            
            // Analyser
            const fraudAnalysis = await analyzeCaseFraud(caseData);
            
            logger.info(`✅ Fraud analysis complete: ${fraudAnalysis.riskLevel} (score: ${fraudAnalysis.riskScore})`);
            
            // Sauvegarder
            await supabase
              .from('purchase_cases')
              .update({
                fraud_risk_score: fraudAnalysis.riskScore,
                fraud_flags: fraudAnalysis.flags,
                fraud_analyzed_at: new Date().toISOString()
              })
              .eq('id', purchaseCase.id);
            
            // Si risque élevé/critique, alerter admins
            if (['high', 'critical'].includes(fraudAnalysis.riskLevel)) {
              logger.warn(`⚠️ High/critical fraud detected for case ${purchaseCase.id}`);
              
              // Récupérer admins
              const { data: admins } = await supabase
                .from('profiles')
                .select('id')
                .in('role', ['admin', 'super_admin']);
              
              // Notifier chaque admin
              const notifications = admins.map(admin => ({
                user_id: admin.id,
                type: 'fraud_alert_high',
                title: `⛔ Fraude ${fraudAnalysis.riskLevel} détectée`,
                message: `Cas ${purchaseCase.case_number}: ${fraudAnalysis.flags.length} signaux, score ${fraudAnalysis.riskScore}`,
                data: { 
                  caseId: purchaseCase.id,
                  riskScore: fraudAnalysis.riskScore,
                  riskLevel: fraudAnalysis.riskLevel
                },
                priority: fraudAnalysis.riskLevel === 'critical' ? 'urgent' : 'high',
                read: false
              }));
              
              await supabase.from('notifications').insert(notifications);
              
              logger.info(`📧 ${admins.length} admins notified`);
            }
            
          } catch (error) {
            logger.error('❌ Auto-fraud-detection error:', error);
          }
        }, 60000); // 60 secondes
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        logger.info('✅ Auto-fraud-detection workflow active');
      }
    });
    
  return channel;
}
```

**Intégrer dans**: `backend/server.js`

```javascript
import { setupFraudDetectionTrigger } from './workflows/autoFraudDetection.js';

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  
  await setupDocumentValidationTrigger();
  await setupFraudDetectionTrigger(); // Nouveau
});
```

**Test**:
1. Créer nouveau cas d'achat
2. Attendre 60 secondes
3. Vérifier logs: "🔍 Analyzing fraud..."
4. Refresh dashboard admin fraude → Cas apparaît avec score risque
5. Si high/critical → Admins reçoivent notification

---

### ✅ ACTION 3.3: Logger Utility (2h)

**Créer fichier**: `backend/utils/logger.js`

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'teranga-backend' },
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`;
          }
        )
      )
    }),
    // Fichier errors
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // Fichier combined
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

export default logger;
```

**Installer Winston**:
```powershell
cd backend
npm install winston
```

---

### ✅ ACTION 3.4: Auto-Recommandations (2h)

**Objectif**: Régénérer recommandations périodiquement

**Créer fichier**: `backend/workflows/autoRecommendations.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import cron from 'node-cron';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Fonction génération recommandations (simplifié)
async function generateUserRecommendations(userId) {
  // Fetch user preferences
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('*, property_preferences(*)')
    .eq('id', userId)
    .single();

  // Fetch recent searches
  const { data: recentSearches } = await supabase
    .from('property_searches')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  // Build criteria
  const criteria = {
    minPrice: userProfile.property_preferences?.min_price || 0,
    maxPrice: userProfile.property_preferences?.max_price || 999999999,
    propertyTypes: userProfile.property_preferences?.property_types || [],
    locations: recentSearches.map(s => s.location).filter(Boolean),
  };

  // Find matching properties
  let query = supabase
    .from('properties')
    .select('*')
    .eq('status', 'available')
    .gte('price', criteria.minPrice)
    .lte('price', criteria.maxPrice);

  if (criteria.propertyTypes.length > 0) {
    query = query.in('property_type', criteria.propertyTypes);
  }

  const { data: properties } = await query.limit(10);

  // Score each property
  const recommendations = properties.map(property => {
    let matchScore = 0;
    const reasons = [];

    // Score price match
    const priceMatch = 1 - Math.abs(property.price - (criteria.minPrice + criteria.maxPrice) / 2) / criteria.maxPrice;
    matchScore += priceMatch * 40;
    reasons.push(`Prix dans votre budget (${Math.round(priceMatch * 100)}%)`);

    // Score type match
    if (criteria.propertyTypes.includes(property.property_type)) {
      matchScore += 30;
      reasons.push(`Type recherché: ${property.property_type}`);
    }

    // Score location match
    if (criteria.locations.includes(property.location)) {
      matchScore += 30;
      reasons.push(`Localisation favorite: ${property.location}`);
    }

    return {
      propertyId: property.id,
      matchScore: Math.min(100, matchScore),
      reasons
    };
  });

  // Sort by score
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return recommendations.slice(0, 6); // Top 6
}

export async function setupRecommendationsScheduler() {
  logger.info('🤖 Initializing recommendations scheduler...');

  // Exécuter toutes les 6 heures
  cron.schedule('0 */6 * * *', async () => {
    logger.info('🔄 Regenerating recommendations for all active users...');

    try {
      // Fetch active users (logged in last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: activeUsers } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'buyer')
        .gte('last_login', thirtyDaysAgo);

      logger.info(`📊 Found ${activeUsers.length} active users`);

      // Régénérer pour chaque user
      for (const user of activeUsers) {
        const recommendations = await generateUserRecommendations(user.id);

        // Sauvegarder
        await supabase
          .from('property_recommendations')
          .upsert(
            recommendations.map(rec => ({
              user_id: user.id,
              property_id: rec.propertyId,
              match_score: rec.matchScore,
              reasons: rec.reasons,
              generated_at: new Date().toISOString()
            })),
            { onConflict: 'user_id,property_id' }
          );

        logger.info(`✅ User ${user.id}: ${recommendations.length} recommendations generated`);
      }

      logger.info('✅ All recommendations regenerated successfully');

    } catch (error) {
      logger.error('❌ Recommendations scheduler error:', error);
    }
  });

  logger.info('✅ Recommendations scheduler active (runs every 6 hours)');
}
```

**Installer node-cron**:
```powershell
cd backend
npm install node-cron
```

**Intégrer dans**: `backend/server.js`

```javascript
import { setupRecommendationsScheduler } from './workflows/autoRecommendations.js';

app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  
  await setupDocumentValidationTrigger();
  await setupFraudDetectionTrigger();
  await setupRecommendationsScheduler(); // Nouveau
});
```

---

## 📊 PHASE 4: NOTIFICATIONS & ANALYTICS (18 heures)

### ✅ ACTION 4.1: Socket.io Setup (3h)

**Installer Socket.io**:
```powershell
cd backend
npm install socket.io
```

**Modifier**: `backend/server.js`

```javascript
import { Server } from 'socket.io';
import http from 'http';

// Créer serveur HTTP
const httpServer = http.createServer(app);

// Initialiser Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware pour attacher io à req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Gestion connexions Socket.io
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Authentification
  socket.on('authenticate', (userId) => {
    socket.userId = userId;
    socket.join(`user:${userId}`); // Room privée user
    console.log(`✅ User ${userId} authenticated`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Remplacer app.listen par httpServer.listen
httpServer.listen(PORT, async () => {
  console.log(`✅ Server + Socket.io running on port ${PORT}`);
  
  await setupDocumentValidationTrigger();
  await setupFraudDetectionTrigger();
  await setupRecommendationsScheduler();
});

export { io }; // Export pour utiliser dans workflows
```

**Frontend - Socket.io Client**:
```powershell
npm install socket.io-client
```

**Créer**: `src/hooks/useNotifications.js`

```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export function useNotifications() {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Connecter Socket.io
    const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true
    });

    socketInstance.on('connect', () => {
      console.log('🔌 Socket.io connected');
      socketInstance.emit('authenticate', user.id);
    });

    // Écouter notifications
    socketInstance.on('notification', (notification) => {
      console.log('📬 New notification:', notification);
      
      setNotifications(prev => [notification, ...prev]);
      
      // Toast notification
      if (notification.priority === 'urgent') {
        toast.error(notification.title, {
          description: notification.message
        });
      } else {
        toast.info(notification.title, {
          description: notification.message
        });
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  return { socket, notifications };
}
```

**Utiliser dans**: `src/App.jsx` ou `src/layouts/MainLayout.jsx`

```javascript
import { useNotifications } from '@/hooks/useNotifications';

function App() {
  useNotifications(); // Active les notifications temps réel

  return (
    // ... votre app
  );
}
```

**Modifier workflows pour envoyer notifications Socket.io**:

Dans `autoValidateDocuments.js` et `autoFraudDetection.js`, remplacer:
```javascript
// AVANT
await supabase.from('notifications').insert({...});

// APRÈS
const notification = {...};
await supabase.from('notifications').insert(notification);

// Envoyer aussi via Socket.io
const { io } = require('../server.js');
io.to(`user:${notification.user_id}`).emit('notification', notification);
```

---

### ✅ ACTION 4.2: Email Alerts Fraude (3h)

**Installer Nodemailer**:
```powershell
cd backend
npm install nodemailer
```

**Créer**: `backend/services/emailService.js`

```javascript
import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export async function sendFraudAlert(adminEmail, caseData, fraudAnalysis) {
  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .alert-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; }
        .flag-item { margin: 10px 0; padding: 10px; background: #f9fafb; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>⛔ Alerte Fraude - Niveau ${fraudAnalysis.riskLevel.toUpperCase()}</h1>
      </div>
      
      <div class="content">
        <div class="alert-box">
          <h2>Cas d'achat suspecté</h2>
          <p><strong>Numéro cas:</strong> ${caseData.case_number}</p>
          <p><strong>Score de risque:</strong> ${fraudAnalysis.riskScore}/100</p>
          <p><strong>Niveau:</strong> ${fraudAnalysis.riskLevel}</p>
        </div>

        <h3>Signaux détectés (${fraudAnalysis.flags.length}):</h3>
        ${fraudAnalysis.flags.map(flag => `
          <div class="flag-item">
            <strong>${flag.category}</strong> (${flag.severity})
            <br/>
            ${flag.description}
            <br/>
            <small>Points de risque: +${flag.riskPoints}</small>
          </div>
        `).join('')}

        <h3>Détails du cas:</h3>
        <ul>
          <li><strong>Acheteur:</strong> ${caseData.buyer.full_name} (${caseData.buyer.email})</li>
          <li><strong>Vendeur:</strong> ${caseData.seller?.full_name || 'N/A'}</li>
          <li><strong>Propriété:</strong> ${caseData.property.title}</li>
          <li><strong>Prix:</strong> ${caseData.property.price.toLocaleString('fr-FR')} FCFA</li>
          <li><strong>Statut:</strong> ${caseData.status}</li>
        </ul>

        <p>
          <a href="${process.env.FRONTEND_URL}/admin/cases/${caseData.id}" 
             style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Voir le cas complet
          </a>
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Teranga Foncier Security" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `⛔ FRAUDE ${fraudAnalysis.riskLevel.toUpperCase()} - Cas ${caseData.case_number}`,
      html: emailHTML
    });

    logger.info(`📧 Fraud alert email sent to ${adminEmail}`);
    return true;

  } catch (error) {
    logger.error('❌ Email sending error:', error);
    return false;
  }
}
```

**Ajouter variables .env**:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-app-password
```

**Modifier**: `autoFraudDetection.js`

```javascript
import { sendFraudAlert } from '../services/emailService.js';

// Dans le if (high/critical)
if (['high', 'critical'].includes(fraudAnalysis.riskLevel)) {
  // ... code existant ...

  // Envoyer emails aux admins
  for (const admin of admins) {
    // Fetch admin email
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', admin.id)
      .single();

    if (adminProfile) {
      await sendFraudAlert(adminProfile.email, caseData, fraudAnalysis);
    }
  }
}
```

---

### ✅ ACTION 4.3: Analytics Dashboard Admin (10h)

**Créer SQL Views**:

Dans Supabase SQL Editor, exécuter:

```sql
-- Vue: Stats validation documents
CREATE OR REPLACE VIEW ai_documents_stats AS
SELECT 
  COUNT(*) as total_documents,
  COUNT(*) FILTER (WHERE ai_validation_status = 'valid') as valid_count,
  COUNT(*) FILTER (WHERE ai_validation_status = 'invalid') as invalid_count,
  COUNT(*) FILTER (WHERE ai_validation_status = 'pending') as pending_count,
  AVG(ai_validation_score) FILTER (WHERE ai_validation_score IS NOT NULL) as avg_validation_score,
  DATE(ai_validated_at) as validation_date
FROM documents
WHERE ai_validated_at IS NOT NULL
GROUP BY DATE(ai_validated_at)
ORDER BY validation_date DESC;

-- Vue: Stats fraude
CREATE OR REPLACE VIEW fraud_detection_stats AS
SELECT 
  COUNT(*) as total_analyzed,
  COUNT(*) FILTER (WHERE fraud_risk_score < 30) as low_risk,
  COUNT(*) FILTER (WHERE fraud_risk_score >= 30 AND fraud_risk_score < 50) as medium_risk,
  COUNT(*) FILTER (WHERE fraud_risk_score >= 50 AND fraud_risk_score < 70) as high_risk,
  COUNT(*) FILTER (WHERE fraud_risk_score >= 70) as critical_risk,
  AVG(fraud_risk_score) as avg_risk_score,
  DATE(fraud_analyzed_at) as analysis_date
FROM purchase_cases
WHERE fraud_analyzed_at IS NOT NULL
GROUP BY DATE(fraud_analyzed_at)
ORDER BY analysis_date DESC;

-- Vue: Stats prix IA
CREATE OR REPLACE VIEW ai_price_evaluation_stats AS
SELECT 
  COUNT(*) as total_evaluated,
  AVG(ai_price_confidence) as avg_confidence,
  AVG(ABS(price - ai_estimated_price)) as avg_price_diff,
  COUNT(*) FILTER (WHERE price > ai_estimated_price * 1.1) as overpriced_count,
  COUNT(*) FILTER (WHERE price < ai_estimated_price * 0.9) as underpriced_count,
  DATE(created_at) as evaluation_date
FROM properties
WHERE ai_estimated_price IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY evaluation_date DESC;
```

**Créer**: `src/pages/admin/AIAnalyticsDashboard.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { 
  FileCheck, Shield, DollarSign, TrendingUp, 
  AlertTriangle, CheckCircle, XCircle, Clock 
} from 'lucide-react';

function AIAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    documents: null,
    fraud: null,
    prices: null
  });
  const [trendsData, setTrendsData] = useState({
    validation: [],
    fraud: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Stats globales
      const [docsRes, fraudRes, pricesRes] = await Promise.all([
        supabase.from('ai_documents_stats').select('*').limit(30),
        supabase.from('fraud_detection_stats').select('*').limit(30),
        supabase.from('ai_price_evaluation_stats').select('*').limit(30)
      ]);

      setStats({
        documents: docsRes.data,
        fraud: fraudRes.data,
        prices: pricesRes.data
      });

      // Préparer données trends
      setTrendsData({
        validation: docsRes.data.map(d => ({
          date: new Date(d.validation_date).toLocaleDateString('fr-FR'),
          valides: d.valid_count,
          invalides: d.invalid_count,
          score: Math.round(d.avg_validation_score)
        })),
        fraud: fraudRes.data.map(d => ({
          date: new Date(d.analysis_date).toLocaleDateString('fr-FR'),
          faible: d.low_risk,
          moyen: d.medium_risk,
          élevé: d.high_risk,
          critique: d.critical_risk
        }))
      });

      setLoading(false);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement analytics...</p>
        </div>
      </div>
    );
  }

  const latestDocs = stats.documents[0] || {};
  const latestFraud = stats.fraud[0] || {};
  const latestPrices = stats.prices[0] || {};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">📊 Analytics Intelligence Artificielle</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Documents Validés
            </CardTitle>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestDocs.total_documents || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Score moyen: {Math.round(latestDocs.avg_validation_score || 0)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cas Analysés (Fraude)
            </CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestFraud.total_analyzed || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Risque moyen: {Math.round(latestFraud.avg_risk_score || 0)}/100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Prix Évalués
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestPrices.total_evaluated || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Confiance moy: {Math.round(latestPrices.avg_confidence || 0)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fraudes Critiques
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {latestFraud.critical_risk || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Nécessitent action immédiate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Validation Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Validations Documents (30 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsData.validation}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valides" stroke="#10b981" name="Valides" />
                <Line type="monotone" dataKey="invalides" stroke="#ef4444" name="Invalides" />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" name="Score Moyen %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fraud Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution Risque Fraude</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Faible', value: latestFraud.low_risk || 0, fill: '#10b981' },
                    { name: 'Moyen', value: latestFraud.medium_risk || 0, fill: '#f59e0b' },
                    { name: 'Élevé', value: latestFraud.high_risk || 0, fill: '#f97316' },
                    { name: 'Critique', value: latestFraud.critical_risk || 0, fill: '#ef4444' }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution Détection Fraude (30 derniers jours)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendsData.fraud}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="faible" stackId="a" fill="#10b981" name="Faible" />
              <Bar dataKey="moyen" stackId="a" fill="#f59e0b" name="Moyen" />
              <Bar dataKey="élevé" stackId="a" fill="#f97316" name="Élevé" />
              <Bar dataKey="critique" stackId="a" fill="#ef4444" name="Critique" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIAnalyticsDashboard;
```

**Ajouter route**: `src/App.jsx`

```javascript
import AIAnalyticsDashboard from '@/pages/admin/AIAnalyticsDashboard';

<Route path="/admin/ai-analytics" element={<AIAnalyticsDashboard />} />
```

---

## 🚀 PHASE 5: SEMAINE 4 BLOCKCHAIN (60 heures)

Voir détails complets dans: **GUIDE_FINALISATION_WEEK3_WEEK4.md**

### Actions principales:
1. **Smart Contracts** (20h): PropertyRegistry.sol, TokenizedProperty.sol
2. **Frontend Web3** (15h): Wallet connection, transactions
3. **IPFS Storage** (10h): Documents décentralisés
4. **NFT Tokenization** (15h): Property → NFT workflow

---

## ✅ CHECKLIST FINALE

### Déploiement (30 min)
- [ ] Migration SQL exécutée
- [ ] Backend démarré (port 5000)
- [ ] Frontend démarré (port 3000/5173)
- [ ] Tests endpoints IA (5/5 passés)

### Intégration UI (4h)
- [ ] NotaireCaseDetail: AIValidationButton + FraudDetectionPanel
- [ ] DocumentsList: AIValidationBadge
- [ ] DashboardParticulier: PropertyRecommendations
- [ ] PropertyDetailPage: AIPropertyEvaluation
- [ ] Route /admin/fraud-detection

### Workflows (20h)
- [ ] Auto-validation documents (trigger upload)
- [ ] Auto-détection fraude (trigger création cas)
- [ ] Auto-recommandations (cron 6h)
- [ ] Logger Winston configuré

### Notifications (11h)
- [ ] Socket.io setup (backend + frontend)
- [ ] Email alerts fraude (Nodemailer)
- [ ] Toast notifications (sonner)
- [ ] useNotifications hook intégré

### Analytics (10h)
- [ ] SQL Views créées (3 views)
- [ ] AIAnalyticsDashboard page
- [ ] Charts Recharts (3 charts)
- [ ] Route /admin/ai-analytics

### Documentation
- [ ] README mis à jour
- [ ] Guide utilisateur notaire
- [ ] Guide utilisateur acheteur
- [ ] Guide admin

---

## 🎯 RÉSULTAT ATTENDU

À la fin de ces actions:
- ✅ **Semaine 3 100% complète** (80h)
- ✅ **Validation IA automatique** (sans intervention humaine)
- ✅ **Fraude détectée en temps réel** (alertes immédiates)
- ✅ **Recommandations personnalisées** (régénérées toutes les 6h)
- ✅ **Notifications temps réel** (Socket.io + emails)
- ✅ **Analytics complet** (dashboards, charts, exports)
- 🎯 **Prêt pour Semaine 4 Blockchain**

---

**Date**: 04 Novembre 2025  
**Deadline**: 15 Novembre 2025 (11 jours)  
**Temps total**: 46h 40min
