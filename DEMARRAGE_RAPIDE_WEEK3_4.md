# 🚀 DÉMARRAGE RAPIDE - TERANGA FONCIER (Semaines 3 & 4)

## 📍 VOUS ÊTES ICI

```
┌─────────────────────────────────────────────────────────────┐
│  🎯 PROGRESSION: 30% (132h/440h)                            │
│  ✅ Semaine 1: Fondations IA (100%)                         │
│  ✅ Semaine 2: Paiements & E-signature (100%)               │
│  🔄 Semaine 3: IA Avancée (50%)                             │
│  ⏳ Semaine 4: Blockchain (0%)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ DÉMARRAGE EN 3 COMMANDES

### Option 1: Déploiement Automatique (RECOMMANDÉ)

```powershell
# Windows PowerShell
./deploy-week3-4.ps1
```

```bash
# Linux/Mac
chmod +x deploy-week3-4.sh
./deploy-week3-4.sh
```

### Option 2: Démarrage Manuel Rapide

```powershell
# Windows - Démarrage automatique backend + frontend
./start-dev.ps1

# Pour arrêter:
./stop-dev.ps1
```

### Option 3: Démarrage Manuel

```powershell
# Terminal 1 - Backend
cd backend
npm install  # Si première fois
npm start    # Port 5000

# Terminal 2 - Frontend
npm install  # Si première fois
npm run dev  # Port 3000 ou 5173
```

---

## 📋 QUE FAIRE MAINTENANT?

### 🔥 ÉTAPE 1: Migration SQL (10 minutes)

**CRITIQUE**: Sans cette étape, les routes IA ne fonctionneront pas!

```
1. Ouvrir https://app.supabase.com
2. Sélectionner projet "terangafoncier"
3. Menu gauche → SQL Editor
4. Copier TOUT le contenu de: migrations/20251103_ai_columns.sql
5. Coller dans l'éditeur
6. Cliquer "Run" (bouton vert en bas à droite)
7. Attendre "Success" (message vert)
```

**Vérification**:
```sql
-- Exécuter dans SQL Editor:
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'documents' 
AND column_name LIKE 'ai_%';

-- Doit retourner 4 lignes:
-- ai_validation_status
-- ai_validation_score
-- ai_validation_issues
-- ai_validated_at
```

### 🎨 ÉTAPE 2: Tester l'Interface (30 minutes)

**Backend**:
- ✅ http://localhost:5000/health → `{"status":"OK"}`
- ✅ http://localhost:5000/api/ai/health → `{"status":"ok"}`

**Frontend**:
- ✅ http://localhost:3000 → Page charge
- ✅ Login en tant que notaire
- ✅ Naviguer vers un cas d'achat
- ✅ Chercher onglet "🤖 Validation IA" (à créer - voir ÉTAPE 3)

### 🚀 ÉTAPE 3: Intégrer Composants UI (4 heures)

Suivre le guide complet: **[ACTIONS_IMMEDIATES_WEEK3_4.md](./ACTIONS_IMMEDIATES_WEEK3_4.md)** - Phase 2

**Résumé actions**:
1. ✅ NotaireCaseDetail.jsx → Ajouter AIValidationButton + FraudDetectionPanel
2. ✅ DocumentsList.jsx → Ajouter AIValidationBadge
3. ✅ DashboardParticulier.jsx → Ajouter PropertyRecommendations
4. ✅ PropertyDetailPage.jsx → Ajouter AIPropertyEvaluation
5. ✅ App.jsx → Ajouter route /admin/fraud-detection

---

## 📚 DOCUMENTATION DISPONIBLE

### 🎯 Pour démarrer
- **[DEMARRAGE_RAPIDE_WEEK3_4.md](./DEMARRAGE_RAPIDE_WEEK3_4.md)**: Ce fichier
- **[00_START_HERE.md](./00_START_HERE.md)**: Vue d'ensemble projet

### 📖 Guides détaillés
- **[GUIDE_FINALISATION_WEEK3_WEEK4.md](./GUIDE_FINALISATION_WEEK3_WEEK4.md)**: Guide pas-à-pas complet (650+ lignes)
- **[ACTIONS_IMMEDIATES_WEEK3_4.md](./ACTIONS_IMMEDIATES_WEEK3_4.md)**: Roadmap 46h avec code (1550+ lignes)

### 📊 Suivi progression
- **[ETAT_AVANCEMENT_PROJET.md](./ETAT_AVANCEMENT_PROJET.md)**: Dashboard progression (400+ lignes)
- **[RECAP_SESSION_04NOV2025.md](./RECAP_SESSION_04NOV2025.md)**: Résumé dernière session

### 🔧 Documentation technique
- **[README_WEEK3_AI_INTEGRATION.md](./README_WEEK3_AI_INTEGRATION.md)**: Documentation API + composants

---

## 🎯 COMPOSANTS IA DISPONIBLES

### Backend - API Routes

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/ai/validate-document` | POST | Valider 1 document | ✅ |
| `/api/ai/validate-case-documents` | POST | Valider tous docs d'un cas | ✅ |
| `/api/ai/detect-fraud` | POST | Détecter fraude cas | ✅ (notaire/admin) |
| `/api/ai/recommendations/:userId` | GET | Recommandations propriétés | ✅ |
| `/api/ai/evaluate-property` | POST | Évaluer prix propriété | ✅ |

### Frontend - Composants React

| Composant | Fichier | Usage |
|-----------|---------|-------|
| AIValidationButton | `src/components/ai/AIValidationButton.jsx` | Bouton validation docs |
| FraudDetectionPanel | `src/components/ai/FraudDetectionPanel.jsx` | Panel détection fraude |
| PropertyRecommendations | `src/components/ai/PropertyRecommendations.jsx` | Recommandations user |
| AIPropertyEvaluation | `src/components/ai/AIPropertyEvaluation.jsx` | Évaluation prix IA |
| AIFraudDashboard | `src/pages/admin/AIFraudDashboard.jsx` | Dashboard admin fraude |
| AIValidationBadge | `src/components/ai/AIValidationBadge.jsx` | Badge status validation |
| AILoadingState | `src/components/ai/AILoadingState.jsx` | Loading spinner IA |

---

## 🛠️ SCRIPTS DISPONIBLES

### Déploiement

```powershell
# Windows - Déploiement complet (6 étapes)
./deploy-week3-4.ps1

# Linux/Mac - Déploiement complet
./deploy-week3-4.sh
```

### Développement

```powershell
# Démarrer dev environment (backend + frontend)
./start-dev.ps1

# Arrêter tous les services
./stop-dev.ps1
```

### NPM Scripts

```bash
# Backend
cd backend
npm start           # Démarrer serveur (port 5000)
npm test            # Tests Jest
npm run lint        # ESLint

# Frontend
npm run dev         # Dev server (port 3000/5173)
npm run build       # Build production
npm run preview     # Preview build
npm run lint        # ESLint
```

---

## 🔧 VARIABLES ENVIRONNEMENT

### Backend `.env`

```env
# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=eyJ...votre-key

# OpenAI
OPENAI_API_KEY=sk-...votre-key

# Paiements
WAVE_API_KEY=...
ORANGE_MONEY_API_KEY=...

# DocuSign
DOCUSIGN_INTEGRATION_KEY=...
DOCUSIGN_USER_ID=...
DOCUSIGN_ACCOUNT_ID=...

# Email (pour alertes fraude)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-app-password

# Frontend
FRONTEND_URL=http://localhost:3000

# Server
PORT=5000
NODE_ENV=development
```

### Frontend `.env`

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...votre-key
VITE_API_URL=http://localhost:5000
```

---

## 🧪 TESTS

### Tester Backend API

```powershell
# Health checks
curl http://localhost:5000/health
curl http://localhost:5000/api/ai/health

# Avec authentication (remplacer YOUR_TOKEN)
$token = "votre-jwt-token"
$headers = @{"Authorization" = "Bearer $token"}

# Valider document
Invoke-RestMethod -Uri "http://localhost:5000/api/ai/validate-document" `
  -Method POST `
  -Headers $headers `
  -Body '{"documentId":"uuid","documentType":"cni"}' `
  -ContentType "application/json"

# Recommandations
Invoke-RestMethod -Uri "http://localhost:5000/api/ai/recommendations/user-id" `
  -Headers $headers
```

### Tester Frontend

1. ✅ Login: http://localhost:3000/login
2. ✅ Dashboard: http://localhost:3000/dashboard
3. ✅ Cas achat: http://localhost:3000/notaire/cases/[id]
4. ✅ Propriété: http://localhost:3000/properties/[id]
5. ✅ Admin fraude: http://localhost:3000/admin/fraud-detection

---

## 📊 STRUCTURE PROJET

```
terangafoncier/
├── backend/
│   ├── routes/
│   │   ├── aiRoutes.js          ← 5 endpoints IA (validation, fraude, recommandations, prix)
│   │   ├── paymentRoutes.js     ← Wave/Orange Money
│   │   ├── docusignRoutes.js    ← E-signature
│   │   └── ...
│   ├── services/
│   │   ├── aiDocumentValidator.js
│   │   ├── aiWorkflowService.js
│   │   ├── emailService.js      ← À créer (alertes fraude)
│   │   └── ...
│   ├── workflows/               ← À créer (auto-triggers)
│   │   ├── autoValidateDocuments.js
│   │   ├── autoFraudDetection.js
│   │   └── autoRecommendations.js
│   ├── utils/
│   │   └── logger.js            ← À créer (Winston)
│   └── server.js                ← Server principal + Socket.io
│
├── src/
│   ├── components/
│   │   ├── ai/                  ← 7 composants IA créés
│   │   │   ├── AIValidationButton.jsx
│   │   │   ├── FraudDetectionPanel.jsx
│   │   │   ├── PropertyRecommendations.jsx
│   │   │   ├── AIPropertyEvaluation.jsx
│   │   │   ├── AIFraudDashboard.jsx (page)
│   │   │   ├── AIValidationBadge.jsx
│   │   │   └── AILoadingState.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AIFraudDashboard.jsx  ← Déjà créé
│   │   │   └── AIAnalyticsDashboard.jsx  ← À créer
│   │   ├── notaire/
│   │   │   └── NotaireCaseDetail.jsx  ← À modifier (intégrer AIValidationButton)
│   │   ├── dashboard/
│   │   │   └── DashboardParticulier.jsx  ← À modifier (intégrer PropertyRecommendations)
│   │   └── properties/
│   │       └── PropertyDetailPage.jsx  ← À modifier (intégrer AIPropertyEvaluation)
│   ├── hooks/
│   │   └── useNotifications.js  ← À créer (Socket.io client)
│   └── App.jsx                  ← Routes à ajouter
│
├── migrations/
│   └── 20251103_ai_columns.sql  ← À EXÉCUTER sur Supabase
│
├── deploy-week3-4.sh            ← Script déploiement Unix
├── deploy-week3-4.ps1           ← Script déploiement Windows
├── start-dev.ps1                ← Démarrage rapide dev
├── stop-dev.ps1                 ← Arrêt services
│
└── DOCUMENTATION/
    ├── GUIDE_FINALISATION_WEEK3_WEEK4.md
    ├── ACTIONS_IMMEDIATES_WEEK3_4.md
    ├── ETAT_AVANCEMENT_PROJET.md
    ├── RECAP_SESSION_04NOV2025.md
    └── README_WEEK3_AI_INTEGRATION.md
```

---

## 🐛 TROUBLESHOOTING

### Backend ne démarre pas

```powershell
# Vérifier port 5000 occupé
netstat -ano | findstr :5000

# Tuer process
taskkill /PID [PID] /F

# Ou utiliser script
./stop-dev.ps1
```

### Frontend ne démarre pas

```powershell
# Vérifier port 3000/5173 occupé
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Nettoyer node_modules
rm -rf node_modules
npm install
```

### Erreurs SQL "Column does not exist"

```
❌ Erreur: column "ai_validation_status" does not exist
```

**Solution**: Migration SQL non exécutée → Voir [ÉTAPE 1](#-étape-1-migration-sql-10-minutes)

### Routes IA retournent 401 Unauthorized

```
❌ Erreur: Unauthorized
```

**Solution**: 
1. Login via frontend
2. Copier JWT token (DevTools → Application → Local Storage)
3. Ajouter header: `Authorization: Bearer [token]`

### Socket.io ne connecte pas

```
❌ Erreur: WebSocket connection failed
```

**Solution**:
1. Vérifier `VITE_API_URL` dans `.env` frontend
2. Vérifier CORS backend (`server.js` - origins)
3. Restart backend après modification

---

## 📞 AIDE & SUPPORT

### Documentation
1. **Guide complet**: [GUIDE_FINALISATION_WEEK3_WEEK4.md](./GUIDE_FINALISATION_WEEK3_WEEK4.md)
2. **Roadmap détaillée**: [ACTIONS_IMMEDIATES_WEEK3_4.md](./ACTIONS_IMMEDIATES_WEEK3_4.md)
3. **Progression**: [ETAT_AVANCEMENT_PROJET.md](./ETAT_AVANCEMENT_PROJET.md)

### Ressources externes
- **OpenAI API**: https://platform.openai.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Shadcn/ui**: https://ui.shadcn.com

### Logs
- **Backend logs**: `backend/logs/combined.log`
- **Error logs**: `backend/logs/error.log`
- **Frontend console**: DevTools (F12)

---

## 🎯 OBJECTIFS COURT TERME

### Cette semaine (04-08 Nov)
- ✅ Exécuter migration SQL
- ✅ Tester tous endpoints IA
- ✅ Intégrer composants UI (4h)

### Semaine prochaine (11-15 Nov)
- ✅ Workflows autonomes (20h)
- ✅ Notifications temps réel (10h)
- ✅ Analytics dashboard (10h)

### Deadline Semaine 3: 15 Novembre 2025
### Deadline Semaine 4: 29 Novembre 2025

---

## ✨ QUICK WINS

Pour voir des résultats **immédiatement**:

1. **Exécuter migration SQL** (10 min)
2. **Démarrer avec** `./start-dev.ps1` (1 min)
3. **Tester endpoint**: `curl http://localhost:5000/api/ai/health` (30 sec)
4. **Login frontend** → Voir interface (2 min)

**Total**: 15 minutes pour tout avoir en marche! 🚀

---

**Créé avec 💚 par GitHub Copilot Agent**  
**Dernière mise à jour**: 04 Novembre 2025
