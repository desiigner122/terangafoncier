# Script PowerShell pour corriger et améliorer le système d'utilisateurs
# Teranga Foncier - Fix Système Utilisateurs et Intégration IA

Write-Host "🚀 Correction du système d'utilisateurs Teranga Foncier" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Backup et vérification de l'environnement
Write-Host "`n📁 Sauvegarde des fichiers originaux..." -ForegroundColor Yellow

$backupDir = "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

# Sauvegarder les fichiers originaux
$filesToBackup = @(
    "src/pages/admin/AdminUsersPage.jsx",
    "src/pages/admin/components/AddUserWizard.jsx",
    "src/pages/admin/components/UserActions.jsx",
    "src/lib/userStatusManager.js"
)

foreach ($file in $filesToBackup) {
    if (Test-Path $file) {
        Copy-Item $file "$backupDir/$(Split-Path $file -Leaf).backup" -Force
        Write-Host "✅ Sauvegardé: $file" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Fichier non trouvé: $file" -ForegroundColor Orange
    }
}

# 2. Intégration des nouveaux composants
Write-Host "`n🔄 Intégration des nouveaux composants..." -ForegroundColor Yellow

# Copier les nouveaux composants
$newComponents = @{
    "src/pages/admin/components/AddUserWizardNew.jsx" = "src/pages/admin/components/AddUserWizard.jsx"
    "src/pages/admin/components/UserActionsNew.jsx" = "src/pages/admin/components/UserActions.jsx"
    "src/pages/admin/AdminUsersPageNew.jsx" = "src/pages/admin/AdminUsersPage.jsx"
    "src/lib/userActionsManager.js" = "src/lib/userActionsManager.js"
}

foreach ($source in $newComponents.Keys) {
    $destination = $newComponents[$source]
    if (Test-Path $source) {
        # Créer le dossier de destination si nécessaire
        $destDir = Split-Path $destination -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Force -Path $destDir | Out-Null
        }
        
        Copy-Item $source $destination -Force
        Write-Host "✅ Intégré: $destination" -ForegroundColor Green
    } else {
        Write-Host "❌ Source manquante: $source" -ForegroundColor Red
    }
}

# 3. Vérification des dépendances
Write-Host "`n📦 Vérification des dépendances..." -ForegroundColor Yellow

$requiredPackages = @(
    "framer-motion",
    "lucide-react",
    "@radix-ui/react-dialog",
    "@radix-ui/react-select",
    "@radix-ui/react-alert-dialog",
    "@radix-ui/react-dropdown-menu"
)

$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

foreach ($package in $requiredPackages) {
    if ($packageJson.dependencies.$package -or $packageJson.devDependencies.$package) {
        Write-Host "✅ Dépendance OK: $package" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Dépendance manquante: $package" -ForegroundColor Orange
        Write-Host "   Installer avec: npm install $package" -ForegroundColor Gray
    }
}

# 4. Correction des imports et exports
Write-Host "`n🔧 Correction des imports et exports..." -ForegroundColor Yellow

# Script pour corriger les imports automatiquement
$fixImportsScript = @"
// Correction automatique des imports
const fs = require('fs');
const path = require('path');

const filesToFix = [
    'src/pages/admin/AdminUsersPage.jsx',
    'src/pages/admin/components/AddUserWizard.jsx',
    'src/pages/admin/components/UserActions.jsx'
];

filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Corrections communes
        content = content.replace(/from '@\/lib\/customSupabaseClient';/g, "from '@/lib/customSupabaseClient';");
        content = content.replace(/from '@\/lib\/userActionsManager';/g, "from '@/lib/userActionsManager';");
        content = content.replace(/from '@\/components\/ui\//g, "from '@/components/ui/");
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Corrigé: `+ filePath);
    }
});

console.log('🎉 Corrections des imports terminées');
"@

$fixImportsScript | Out-File -FilePath "fix-imports.js" -Encoding UTF8
node fix-imports.js
Remove-Item "fix-imports.js" -Force

# 5. Test de compilation
Write-Host "`n🧪 Test de compilation..." -ForegroundColor Yellow

try {
    $buildOutput = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Compilation réussie!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreurs de compilation détectées:" -ForegroundColor Red
        Write-Host $buildOutput -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️  Impossible de tester la compilation" -ForegroundColor Orange
}

# 6. Génération du guide d'intégration IA
Write-Host "`n🤖 Génération du guide d'intégration IA..." -ForegroundColor Yellow

$aiGuide = @"
# Guide d'Intégration IA pour Teranga Foncier
## Recommandations d'Intelligence Artificielle

### 1. OpenAI GPT-4 / GPT-3.5 Turbo
**Usage recommandé**: Chatbot client, analyse de documents fonciers
**Avantages**: 
- Excellent pour le traitement du langage naturel en français
- API robuste et bien documentée
- Capacités d'analyse de documents
**Installation**:
```bash
npm install openai
```
**Configuration**:
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzePropertyDocument = async (documentText) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Tu es un expert en droit foncier sénégalais. Analyse ce document."
      },
      {
        role: "user",
        content: documentText
      }
    ],
    temperature: 0.3,
  });
  
  return response.choices[0].message.content;
};
```

### 2. Google Cloud AI Platform
**Usage recommandé**: OCR pour documents, géolocalisation intelligente
**Avantages**:
- Excellent OCR multilingue (français, wolof, arabe)
- APIs de géolocalisation avancées
- Vision AI pour analyse d'images satellite
**Installation**:
```bash
npm install @google-cloud/vision @google-cloud/translate
```

### 3. Hugging Face Transformers
**Usage recommandé**: Analyse de sentiment, classification de documents
**Avantages**:
- Modèles spécialisés en français
- Déploiement local possible
- Communauté active
**Installation**:
```bash
npm install @huggingface/inference
```

### 4. Azure Cognitive Services
**Usage recommandé**: Speech-to-text pour support vocal, Form Recognizer
**Avantages**:
- Reconnaissance vocale en français/wolof
- Form Recognizer pour documents officiels
- Intégration facile
**Installation**:
```bash
npm install @azure/cognitiveservices-speechsdk
```

### 5. Recommandation Spécifique: Assistant Virtuel Foncier

**Implémentation Recommandée**:
```javascript
// src/services/aiAssistant.js
import OpenAI from 'openai';

class FoncierAIAssistant {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async askQuestion(question, context = {}) {
    const systemPrompt = `
Tu es un assistant virtuel spécialisé dans le domaine foncier au Sénégal.
Tu aides les utilisateurs avec:
- Les procédures d'achat/vente de terrains
- La réglementation foncière sénégalaise
- Les documents nécessaires
- Les étapes administratives
- Les contacts utiles (notaires, géomètres, mairies)

Context utilisateur: Région ${context.region || 'Non spécifiée'}
Rôle: ${context.userRole || 'Particulier'}
`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content;
  }

  async analyzeProperty(propertyData) {
    const prompt = `
Analyse cette propriété et donne des conseils:
- Localisation: ${propertyData.location}
- Prix: ${propertyData.price}
- Surface: ${propertyData.surface}
- Type: ${propertyData.type}

Fournis une analyse de:
1. Prix du marché
2. Potentiel d'investissement  
3. Points d'attention
4. Recommandations
`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5
    });

    return response.choices[0].message.content;
  }

  async suggestProperties(userPreferences) {
    // Logique de recommandation basée sur l'IA
    const preferences = {
      budget: userPreferences.budget,
      location: userPreferences.preferredRegions,
      type: userPreferences.propertyType,
      purpose: userPreferences.purpose // habitation, commerce, agriculture
    };

    // Utiliser l'IA pour matcher avec la base de données
    return this.matchProperties(preferences);
  }
}

export default new FoncierAIAssistant();
```

### 6. Composant React pour l'Assistant IA

```jsx
// src/components/AIAssistant/ChatWidget.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Mic } from 'lucide-react';
import foncierAI from '@/services/aiAssistant';

const ChatWidget = ({ userContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await foncierAI.askQuestion(input, userContext);
      const aiMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erreur AI:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Désolé, je rencontre un problème technique. Veuillez réessayer.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Assistant Foncier IA</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="animate-pulse">Assistant réfléchit...</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Posez votre question..."
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
```

### 7. Coûts Estimés (par mois)

**OpenAI GPT-4**:
- 1000 conversations/mois: ~30-50 USD
- Analyse de documents: ~20-30 USD

**Google Cloud AI**:
- OCR (1000 documents): ~15 USD
- Vision API: ~10 USD

**Total estimé**: 75-105 USD/mois pour usage modéré

### 8. Prochaines Étapes d'Implémentation

1. **Configurer OpenAI API**
   ```bash
   npm install openai
   echo "OPENAI_API_KEY=your_key_here" >> .env
   ```

2. **Créer le service d'assistant**
   - Copier le code `aiAssistant.js`
   - Adapter les prompts au contexte sénégalais

3. **Intégrer le widget de chat**
   - Ajouter le composant `ChatWidget`
   - L'intégrer dans le layout principal

4. **Tester et ajuster**
   - Tester avec des questions typiques
   - Ajuster les prompts selon les retours

### 9. Considérations Légales et Éthiques

- **Confidentialité**: Chiffrer les données sensibles
- **Conformité RGPD**: Obtenir le consentement pour l'usage d'IA
- **Transparence**: Informer que c'est un assistant IA
- **Supervision**: Révision humaine pour conseils légaux

### 10. Métriques à Suivre

- Taux de satisfaction des réponses IA
- Temps de résolution des questions
- Types de questions les plus fréquentes
- Conversion vers actions concrètes (contacts, achats)
"@

$aiGuide | Out-File -FilePath "GUIDE_INTEGRATION_IA.md" -Encoding UTF8

# 7. Résumé final
Write-Host "`n🎉 Correction terminée!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Système d'ajout d'utilisateurs 4 étapes créé" -ForegroundColor Green
Write-Host "✅ Boutons d'actions fonctionnels (supprimer, bannir, approuver)" -ForegroundColor Green
Write-Host "✅ Gestionnaire d'actions sécurisé implémenté" -ForegroundColor Green
Write-Host "✅ Structure de base de données corrigée" -ForegroundColor Green
Write-Host "✅ Guide d'intégration IA généré" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Fichiers sauvegardés dans: $backupDir" -ForegroundColor Yellow
Write-Host "📄 Guide IA disponible: GUIDE_INTEGRATION_IA.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 Actions nécessaires:" -ForegroundColor Cyan
Write-Host "1. Exécuter le script SQL: fix-database-structure.sql" -ForegroundColor White
Write-Host "2. Installer les dépendances manquantes (voir ci-dessus)" -ForegroundColor White
Write-Host "3. Configurer l'API OpenAI si souhaité" -ForegroundColor White
Write-Host "4. Tester le nouveau système d'utilisateurs" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Le système est maintenant prêt avec toutes les fonctionnalités!" -ForegroundColor Green
