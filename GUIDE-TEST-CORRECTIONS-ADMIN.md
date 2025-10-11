# 🧪 GUIDE DE TEST - CORRECTIONS ADMIN

**Date:** 11 octobre 2025  
**Serveur:** http://localhost:5174  
**Statut:** ✅ CORRECTIONS APPLIQUÉES

---

## ✅ CORRECTIONS APPLIQUÉES

### 1. MaintenanceWrapper.jsx
**Fichier:** `src/components/MaintenanceWrapper.jsx`  
**Correction:** Supprimé le paramètre `userRole` de l'appel à `isUserAllowed()`

```jsx
// AVANT
const userRole = user?.role || 'guest';
if (isUserAllowed(userRole)) {

// APRÈS
if (isUserAllowed()) {
```

**Impact:** Les admins peuvent maintenant accéder au dashboard même en mode maintenance

---

### 2. CompleteSidebarAdminDashboard.jsx
**Fichier:** `src/pages/dashboards/admin/CompleteSidebarAdminDashboard.jsx`  
**Correction:** Ajouté mapping des routes spéciales dans la navigation

```jsx
// Routes spéciales avec chemins personnalisés
const specialRoutes = {
  'overview': '/admin',
  'cms': '/admin/cms/pages',
  'leads': '/admin/marketing/leads',
  'audit': '/admin/audit-log',
  'financial': '/admin/revenue'
};

const route = specialRoutes[item.id] || `/admin/${item.id}`;
navigate(route);
```

**Impact:** Tous les liens du sidebar pointent maintenant vers les bonnes routes

---

### 3. App.jsx
**Fichier:** `src/App.jsx`  
**Correction:** Ajouté les routes manquantes

```jsx
<Route path="financial" element={<RevenueManagementPage />} /> {/* Alias pour sidebar */}
<Route path="notifications" element={<NotificationsPageNew />} /> {/* Page notifications admin */}
```

**Impact:** Les pages Financial et Notifications sont maintenant accessibles

---

## 🧪 PLAN DE TEST

### TEST 1: Mode Maintenance ✅
**Objectif:** Vérifier que les admins peuvent accéder malgré le mode maintenance

**Étapes:**
1. Ouvrir http://localhost:5174
2. Se connecter en tant qu'admin
3. Vérifier la présence du bandeau orange "MODE MAINTENANCE ACTIVÉ"
4. Vérifier l'accès au dashboard admin

**Résultat attendu:**
- ✅ Bandeau orange visible
- ✅ Dashboard accessible
- ✅ Tous les liens fonctionnels

**Désactiver le mode maintenance:**
```javascript
// Console navigateur (F12)
localStorage.removeItem('maintenanceMode');
localStorage.removeItem('maintenanceConfig');
location.reload();
```

---

### TEST 2: Navigation Sidebar 🎯
**Objectif:** Tester tous les liens du sidebar admin

| # | Menu Item | Route Attendue | Page Attendue | Statut |
|---|-----------|----------------|---------------|--------|
| 1 | Vue d'ensemble | `/admin` | ModernAdminOverview | ⏳ |
| 2 | Analytics | `/admin/analytics` | ModernAnalyticsPage | ⏳ |
| 3 | ⚠️ Validation | `/admin/validation` | AdminPropertyValidation | ⏳ |
| 4 | Signalements | `/admin/reports` | AdminReportsPage | ⏳ |
| 5 | Utilisateurs | `/admin/users` | ModernUsersPage | ⏳ |
| 6 | Abonnements | `/admin/subscriptions` | SubscriptionManagementPage | ⏳ |
| 7 | Propriétés | `/admin/properties` | ModernPropertiesManagementPage | ⏳ |
| 8 | Transactions | `/admin/transactions` | ModernTransactionsPage | ⏳ |
| 9 | Finance | `/admin/revenue` | RevenueManagementPage | ⏳ |
| 10 | 📄 Pages CMS | `/admin/cms/pages` | AdminPagesList | ⏳ |
| 11 | 📧 Leads Marketing | `/admin/marketing/leads` | AdminLeadsList | ⏳ |
| 12 | 📝 Blog | `/admin/blog` | AdminBlogPage | ⏳ |
| 13 | Support | `/admin/support` | SupportTicketsPage | ⏳ |
| 14 | Notifications | `/admin/notifications` | NotificationsPageNew | ⏳ |
| 15 | Audit & Logs | `/admin/audit-log` | AdminAuditLogPage | ⏳ |
| 16 | Paramètres | `/admin/settings` | ModernSettingsPage | ⏳ |

**Comment tester:**
1. Ouvrir http://localhost:5174/admin
2. Cliquer sur chaque élément du sidebar
3. Vérifier que la page charge sans erreur 404
4. Vérifier l'URL dans la barre d'adresse
5. Cocher la case ✅ si OK, ❌ si erreur

---

### TEST 3: Console Erreurs 🔍
**Objectif:** Vérifier qu'il n'y a plus d'erreurs 400/PGRST200

**Étapes:**
1. Ouvrir la console (F12)
2. Onglet "Console"
3. Naviguer sur chaque page du dashboard
4. Noter toutes les erreurs

**Erreurs à surveiller:**
- ❌ 400 Bad Request
- ❌ PGRST200 (colonne inexistante)
- ❌ CORS errors
- ❌ Import errors

**Résultat attendu:** Aucune erreur critique

---

### TEST 4: Données Réelles 📊
**Objectif:** Vérifier que les données Supabase s'affichent correctement

**Pages à tester:**
1. **Vue d'ensemble** → Stats réelles (users, properties, transactions)
2. **Utilisateurs** → Liste des profiles depuis Supabase
3. **Propriétés** → Liste des properties depuis Supabase
4. **Transactions** → Liste des blockchain_transactions
5. **Validation** → Propriétés avec status='pending'

**Résultat attendu:** Données chargées depuis Supabase, pas de mock data

---

### TEST 5: Responsive Mobile 📱
**Objectif:** Vérifier le sidebar sur mobile

**Étapes:**
1. Ouvrir DevTools (F12)
2. Mode responsive (Ctrl+Shift+M)
3. Tester résolution 375x667 (iPhone SE)
4. Cliquer sur le menu hamburger
5. Vérifier l'ouverture du sidebar
6. Cliquer sur un lien
7. Vérifier la fermeture automatique

**Résultat attendu:**
- ✅ Sidebar masqué par défaut sur mobile
- ✅ Menu hamburger visible
- ✅ Sidebar s'ouvre en overlay
- ✅ Fermeture automatique après clic
- ✅ Navigation fonctionnelle

---

## 🐛 ERREURS CONNUES À SURVEILLER

### 1. Colonne `is_active` manquante
**Symptôme:** Erreur 400 "column is_active does not exist"  
**Cause:** Code qui filtre sur `is_active` dans profiles  
**Solution:** Déjà corrigé - filtre supprimé

### 2. Colonne `read` manquante (notifications)
**Symptôme:** Erreur PGRST200 "column read does not exist"  
**Cause:** Code qui filtre sur `read` au lieu de `read_at`  
**Solution:** Déjà corrigé - utilise `read_at` maintenant

### 3. Pages CMS/Leads vides
**Symptôme:** Page blanche ou message "Aucune donnée"  
**Cause:** Tables `cms_pages` ou `marketing_leads` vides  
**Solution:** Normal si base de données vide - créer des données de test

---

## 📝 CHECKLIST FINALE

Avant de considérer les corrections terminées, vérifier:

- [ ] Mode maintenance permet accès admin
- [ ] Tous les 16 liens sidebar fonctionnels
- [ ] Aucune erreur 400/PGRST200 dans console
- [ ] Données Supabase s'affichent correctement
- [ ] Responsive mobile OK
- [ ] Pas d'erreurs d'import
- [ ] Navigation fluide sans rechargement
- [ ] Breadcrumbs corrects
- [ ] Badges de statistiques à jour
- [ ] Déconnexion fonctionnelle

---

## 🚀 COMMANDES UTILES

### Désactiver mode maintenance
```javascript
// Console navigateur (F12)
localStorage.removeItem('maintenanceMode');
localStorage.removeItem('maintenanceConfig');
location.reload();
```

### Tester une route directement
```javascript
// Dans la console navigateur
window.location.href = 'http://localhost:5174/admin/users';
```

### Voir les erreurs réseau
```javascript
// Dans Console > Réseau (Network)
// Filtrer: XHR
// Chercher les requêtes rouges (400, 404, 500)
```

### Redémarrer le serveur
```powershell
# Dans le terminal PowerShell
# Ctrl+C pour arrêter
npm run dev
```

---

## 📊 RAPPORT DE TEST

Une fois les tests terminés, remplir ce tableau:

| Test | Statut | Erreurs | Notes |
|------|--------|---------|-------|
| Mode Maintenance | ⏳ | | |
| Navigation Sidebar (16 liens) | ⏳ | | |
| Console Erreurs | ⏳ | | |
| Données Réelles | ⏳ | | |
| Responsive Mobile | ⏳ | | |

**Statuts possibles:** ⏳ Non testé | ✅ OK | ⚠️ Problèmes mineurs | ❌ Bloquant

---

## 🎯 PROCHAINES ÉTAPES

Après validation des tests:

1. ✅ Corrections appliquées
2. ⏳ **Tests manuels** (vous êtes ici)
3. ⏳ Correction des bugs trouvés
4. ⏳ Commit des changements
5. ⏳ Push sur GitHub
6. ⏳ Documentation finale

---

## 📧 SIGNALEMENT DE BUGS

Si vous trouvez un bug pendant les tests, noter:

1. **Page concernée:** (ex: /admin/users)
2. **Action effectuée:** (ex: Clic sur "Utilisateurs")
3. **Résultat attendu:** (ex: Afficher la liste des users)
4. **Résultat obtenu:** (ex: Erreur 400)
5. **Message d'erreur:** (copier depuis console)
6. **Capture d'écran:** (F12 → Console)

Bonne chance pour les tests ! 🚀
