# ⚡ COMMANDES RAPIDES - Démarrage & Test

## 🚀 Démarrage Express (1 commande)

```powershell
# À la racine du projet
./start-dev.ps1
```

**Ce script lance automatiquement**:
- ✅ Frontend Vite (port 5173)
- ✅ Backend Node.js (port 5000)
- ✅ Workflows IA autonomes
- ✅ Supabase Realtime subscriptions

**Vérifier les logs**:
```
✅ Auto-validation workflow active
✅ Fraud detection workflow active
Frontend: http://localhost:5173
Backend: http://localhost:5000
```

---

## 🧪 Test Intégration (5 minutes)

### 1. Accéder au Dashboard Admin
```
URL: http://localhost:5173/admin/dashboard
```

### 2. Vérifier Sidebar
**Chercher**:
- 🤖 Analytics IA (badge violet "IA")
- 🛡️ Surveillance Fraude (badge rouge "IA")

### 3. Tester Analytics IA
```
1. Cliquer sur "🤖 Analytics IA"
2. Vérifier: 4 cartes stats + 3 graphiques
3. Changer période: 7/30/90/365 jours
4. Cliquer "Exporter CSV"
```

### 4. Tester Surveillance Fraude
```
1. Cliquer sur "🛡️ Surveillance Fraude"
2. Vérifier: Liste cas avec scores
3. Tester filtres: Tous / Low / Medium / High / Critical
```

### 5. Tester NotificationBell
```
1. Regarder header (top-right)
2. Cliquer sur icône cloche
3. Vérifier dropdown s'ouvre
4. Tester "Mark as read" et "Delete"
```

---

## 🛠️ Commandes Utiles

### Frontend

```powershell
# Démarrer dev server
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Linter
npm run lint
```

### Backend

```powershell
# Démarrer server
cd backend
node server.js

# Avec auto-reload (nodemon)
npm run dev

# Test API health
curl http://localhost:5000/api/health
```

### Git

```powershell
# Status
git status

# Commit rapide
git add .
git commit -m "feat(week3): ui integration complete"
git push origin main

# Créer feature branch
git checkout -b feature/week3-ui
git push origin feature/week3-ui
```

---

## 🐛 Dépannage Express

### ❌ Port déjà utilisé
```powershell
# Frontend (5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Backend (5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### ❌ Modules manquants
```powershell
# Réinstaller
npm install
cd backend
npm install
```

### ❌ Workflows ne démarrent pas
```powershell
# Vérifier .env
cat backend/.env

# Doit contenir:
# SUPABASE_URL=...
# SUPABASE_SERVICE_KEY=...
# OPENAI_API_KEY=...
```

### ❌ Pas de données dans dashboards
```sql
-- Via Supabase SQL Editor
-- Créer données test (voir TEST_RAPIDE_INTEGRATION.md)
UPDATE documents SET ai_validation_status='valid', ai_validation_score=85 WHERE id IN (SELECT id FROM documents LIMIT 10);
```

---

## 📝 Checklist Rapide

**Avant de commencer**:
- [ ] Node.js installé (v18+)
- [ ] npm installé
- [ ] .env configuré (backend/)
- [ ] Supabase project créé

**Test basique**:
- [ ] ./start-dev.ps1 réussit
- [ ] Frontend charge (localhost:5173)
- [ ] Backend répond (localhost:5000)
- [ ] Logs backend: "✅ workflows active"
- [ ] Dashboard admin accessible
- [ ] Nouveaux items sidebar visibles
- [ ] NotificationBell apparaît

**Test avancé**:
- [ ] Analytics IA: graphiques visibles
- [ ] Fraud Dashboard: liste cas visible
- [ ] Export CSV télécharge
- [ ] NotificationBell dropdown fonctionne
- [ ] Upload document → notification reçue

---

## 🎯 URLs Importantes

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend** | http://localhost:5173 | Dev server Vite |
| **Backend** | http://localhost:5000 | Express API |
| **Admin Dashboard** | http://localhost:5173/admin/dashboard | Login requis |
| **Analytics IA** | http://localhost:5173/admin/ai-analytics | Admin only |
| **Fraud Detection** | http://localhost:5173/admin/fraud-detection | Admin only |
| **Supabase Dashboard** | https://app.supabase.com | Projet URL dans .env |

---

## 📚 Documentation Rapide

| Document | Contenu | Durée |
|----------|---------|-------|
| **TEST_RAPIDE_INTEGRATION.md** | Checklist complète | 15 min |
| **INTEGRATION_UI_COMPLETE.md** | Détails techniques | 10 min |
| **STATUS_PROJET_SEMAINE_3_4.md** | Vue d'ensemble | 5 min |
| **RESUME_EXECUTIF_INTEGRATION.md** | Résumé exécutif | 5 min |
| **GUIDE_COMMIT_GIT.md** | Workflow Git | 5 min |

---

## ⏱️ Temps Estimés

| Action | Durée |
|--------|-------|
| Démarrage environnement | 2 min |
| Test intégration basique | 5 min |
| Test intégration complète | 15 min |
| Résoudre issues courantes | 10 min |
| Git commit + push | 5 min |
| **TOTAL** | **37 min** |

---

## 🎉 Si Tout Fonctionne

**Bravo! L'intégration est réussie ✅**

**Prochaines actions**:

1. **Committer les changements**:
   ```powershell
   git add .
   git commit -m "feat(week3): complete UI integration"
   git push origin main
   ```

2. **Décider de la suite**:
   - **Option A**: Finaliser Week 3 (2-3h)
     - Intégrer AI components dans pages
     - Migration SQL
     - Tests E2E
   
   - **Option B**: Commencer Week 4 Blockchain (60h)
     - Smart contracts Solidity
     - Testnet deployment
     - Web3 frontend

**Recommandation**: Option A (finir avant nouveau chapitre)

---

## 🆘 Besoin d'Aide?

**Documentation**:
- TEST_RAPIDE_INTEGRATION.md (section Dépannage)
- STATUS_PROJET_SEMAINE_3_4.md (architecture)

**Vérifications**:
- Backend logs (terminal server.js)
- Supabase Dashboard → Logs
- Browser DevTools → Console

**Contacts**:
- GitHub Issues
- Documentation technique
- Supabase Support

---

**Date**: 2025-01-26  
**Version**: 1.0  
**Status**: ✅ READY TO START & TEST
