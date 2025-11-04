# 🔧 GUIDE DÉPANNAGE - CaseTrackingUnified

## ❌ Erreurs MIME Type (RÉSOLUES)

### Symptômes
```
Le chargement du module à l'adresse « http://localhost:5173/src/hooks/useAuth » 
a été bloqué en raison d'un type MIME interdit
```

### Cause
Imports sans extensions `.jsx` ou avec chemins incorrects

### ✅ Solution Appliquée

**Fichier**: `src/pages/CaseTrackingUnified.jsx`

**Corrections**:
```javascript
// ❌ AVANT (incorrect)
import { useAuth } from '@/hooks/useAuth';
import TimelineTrackerModern from '@/components/timeline/TimelineTrackerModern';
import AppointmentScheduler from '@/components/appointments/AppointmentScheduler';

// ✅ APRÈS (correct)
import { useAuth } from '@/contexts/UnifiedAuthContext.jsx';
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern.jsx';
import AppointmentScheduler from '@/components/purchase/AppointmentScheduler.jsx';
```

---

## 🚀 Tester la Page Unifiée

### 1. Accès URL

**Routes disponibles**:
```
/case-tracking/:caseId              ← Nouvelle route principale
/acheteur/dossier/:caseId           ← Redirige vers CaseTrackingUnified
/vendeur/dossier/:caseId            ← Redirige vers CaseTrackingUnified
```

**Exemple**:
```
http://localhost:5173/case-tracking/123e4567-e89b-12d3-a456-426614174000
```

### 2. Vérifier le Chargement

**Console navigateur** (F12) doit afficher :
```javascript
✅ Données chargées: {
  role: 'buyer',
  hasAgent: false,
  hasSurveying: false,
  participants: ['buyer', 'seller', 'notaire']
}
```

### 3. Erreurs Possibles

#### A. "Dossier introuvable"
**Cause**: `caseId` invalide ou pas d'accès

**Solution**:
- Vérifier que le `caseId` existe dans `purchase_cases`
- Vérifier que l'utilisateur est buyer/seller/notaire/agent/geometre du dossier

#### B. "Loading infini"
**Cause**: Service `UnifiedCaseTrackingService` échoue

**Debug**:
```javascript
// Dans Console navigateur
// Vérifier les erreurs de l'API Supabase
```

#### C. Composants non chargés
**Cause**: Imports manquants

**Vérifier que ces fichiers existent**:
```
src/components/unified/UnifiedCaseTrackingComponents.jsx
src/components/modals/AgentSelectionModal.jsx
src/components/modals/GeometreSelectionModal.jsx
src/components/purchase/TimelineTrackerModern.jsx
src/components/purchase/AppointmentScheduler.jsx
src/services/UnifiedCaseTrackingService.js
```

---

## 🎯 Test Manuel Complet

### Test 1: Acheteur

```bash
# 1. Se connecter en tant qu'acheteur
# 2. Accéder à /case-tracking/:caseId
# 3. Vérifier affichage:
   ✅ Badge "Vous êtes Acheteur"
   ✅ 3 participants (Buyer, Seller, Notaire)
   ✅ Bouton "Choisir agent (Facultatif)" visible
   ✅ Bouton "Commander bornage (Facultatif)" visible
# 4. Cliquer "Choisir agent"
   ✅ Modal AgentSelectionModal s'ouvre
# 5. Sélectionner agent
   ✅ Page recharge
   ✅ Agent apparaît dans participants
   ✅ Bouton "Choisir agent" disparaît
```

### Test 2: Vendeur

```bash
# 1. Se connecter en tant que vendeur
# 2. Accéder à /vendeur/dossier/:caseId
# 3. Vérifier affichage:
   ✅ Badge "Vous êtes Vendeur"
   ✅ Actions vendeur affichées
   ✅ Upload titre foncier disponible
```

### Test 3: Agent (si has_agent)

```bash
# 1. Se connecter en tant qu'agent
# 2. Accéder à /case-tracking/:caseId
# 3. Vérifier affichage:
   ✅ Badge "Vous êtes Agent Foncier (Facultatif)"
   ✅ Message "Vous avez été choisi"
   ✅ Commission affichée
```

---

## 🔍 Debugging Console

### Activer logs détaillés

**Dans `CaseTrackingUnified.jsx`**, les logs sont déjà présents :
```javascript
console.log('✅ Données chargées:', {
  role: data.userRole,
  hasAgent: data.hasAgent,
  hasSurveying: data.hasSurveying,
  participants: Object.keys(data.participants).filter(k => data.participants[k])
});
```

### Vérifier appels API

**Chrome DevTools > Network**:
- Filtrer: `Fetch/XHR`
- Chercher: `purchase_cases`, `agent_foncier_profiles`, `geometre_profiles`
- Status attendu: `200 OK`

---

## 🐛 Erreurs Fréquentes & Solutions

### 1. ReferenceError: service is not defined
**Solution**: Vérifier que `const service = new UnifiedCaseTrackingService();` est présent

### 2. Cannot read property 'full_name' of null
**Solution**: Ajouter optional chaining:
```javascript
caseData.buyer?.full_name || 'Non défini'
```

### 3. Modal ne s'ouvre pas
**Solution**: Vérifier state:
```javascript
console.log('showAgentModal:', showAgentModal);
```

### 4. Page ne recharge pas après sélection
**Solution**: Vérifier callback:
```javascript
const handleAgentSelected = async (agent) => {
  console.log('Agent sélectionné:', agent);
  await loadCaseData(); // ← Important
};
```

---

## 📱 Test sur Mobile

### Responsive Design

**Breakpoints**:
- Mobile: < 768px → 1 colonne
- Tablet: 768-1024px → 2 colonnes
- Desktop: > 1024px → Full layout

**Test**:
```bash
# Chrome DevTools > Toggle Device Toolbar (Ctrl+Shift+M)
# Tester: iPhone 12, iPad, Desktop
```

---

## ✅ Checklist Déploiement

Avant de merger vers `main` :

- [ ] Aucune erreur console navigateur
- [ ] Aucune erreur Vite terminal
- [ ] Test acheteur OK
- [ ] Test vendeur OK
- [ ] Test agent OK (si applicable)
- [ ] Test géomètre OK (si applicable)
- [ ] Test notaire OK (si applicable)
- [ ] Modals agent/géomètre s'ouvrent
- [ ] Sélection agent → page recharge → agent visible
- [ ] Sélection géomètre → page recharge → géomètre visible
- [ ] Tous les onglets fonctionnent
- [ ] Responsive mobile OK
- [ ] Pas de régression anciennes pages

---

## 🆘 Support

Si problème persistant :

1. **Vérifier commit**: `f066765a` (corrections imports)
2. **Vérifier branche**: `copilot/vscode1760961809107`
3. **Relancer serveur**: 
   ```bash
   npm run dev
   ```
4. **Clear cache navigateur**: Ctrl+Shift+Del
5. **Vérifier migration SQL exécutée**: Tables `agent_foncier_profiles`, `geometre_profiles` existent

---

**Dernière mise à jour**: 29 Octobre 2025  
**Commit**: f066765a
