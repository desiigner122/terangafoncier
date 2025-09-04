# 🔧 GUIDE DE MAINTENANCE - SYSTÈME RBAC & SUPABASE

## 📋 MONITORING QUOTIDIEN

### 🔍 **Vérifications Automatiques**
```bash
# 1. Vérifier la compilation
npm run build

# 2. Tester le système RBAC  
node test-rbac-system.mjs

# 3. Vérifier les logs console (dev)
npm run dev
# Surveiller: Aucune erreur rouge critique
```

### 📊 **Métriques à Surveiller**
- ❌ **Erreurs Supabase PGRST201** (relations ambiguës)
- ❌ **Bucket not found** (stockage manquant)
- ❌ **Accès non autorisés** (contournement RBAC)
- ✅ **Redirections correctes** par rôle
- ✅ **Messages toast informatifs**

---

## 🛠️ RÉSOLUTION PROBLÈMES COURANTS

### 🔴 **Erreur: "Could not embed relationship"**
**Symptôme:** Erreur PGRST201 dans console
```javascript
// ❌ MAUVAIS
.select('*, user_auth:id(email)')

// ✅ CORRECT  
.select('*')
// Puis récupérer les emails séparément si nécessaire
```

### 🔴 **Erreur: "Bucket not found"**
**Symptôme:** Upload d'images échoue
```javascript
// Solution 1: Utiliser safeStorageUpload
import { safeStorageUpload } from '@/lib/supabaseStorageInit';
const result = await safeStorageUpload(supabase, 'avatars', path, file);

// Solution 2: Créer le bucket manuellement
// Aller dans Supabase Dashboard > Storage > Create bucket
```

### 🔴 **Erreur: Admin accède aux pages particulier**
**Symptôme:** Contournement des permissions
```javascript
// Vérifier que la route utilise RoleProtectedRoute
<Route path="/my-requests" element={
  <RoleProtectedRoute permission="MY_REQUESTS">
    <MyRequestsPage />
  </RoleProtectedRoute>
} />
```

---

## 🔧 OUTILS DE DIAGNOSTIC

### 1. **Diagnostic RBAC (Admin uniquement)**
```
URL: /admin/security-diagnostic
Fonctions:
- Test permissions par rôle
- Audit des accès
- Statistiques sécurité
- Matrice des permissions
```

### 2. **Tests Automatisés**
```bash
# Test complet du système RBAC
node test-rbac-system.mjs

# Résultat attendu:
✅ PASS Tous les tests de sécurité
✅ PASS Séparation des rôles
✅ PASS Redirections correctes
```

### 3. **Page d'Accès Refusé**
```
URL: /access-denied
Informations:
- Rôle actuel de l'utilisateur  
- Permission demandée
- Suggestions d'amélioration
- Bouton retour tableau de bord
```

---

## 📚 DOCUMENTATION TECHNIQUE

### 🏗️ **Architecture RBAC**
```
src/lib/rbacConfig.js
├── ROLES (12 rôles définis)
├── PERMISSIONS (30+ actions)
├── hasPermission(role, permission)
├── getDefaultDashboard(role)
└── getAccessDeniedMessage(role, permission)
```

### 🛡️ **Protection des Routes**
```javascript
// Modèle à suivre pour nouvelles pages
<Route path="/nouvelle-page" element={
  <RoleProtectedRoute 
    permission="NOUVELLE_PERMISSION"
    allowedRoles={['Role1', 'Role2']}
  >
    <NouvellePage />
  </RoleProtectedRoute>
} />
```

### 🗄️ **Gestion Stockage**
```javascript
// Upload sécurisé recommandé
import { safeStorageUpload } from '@/lib/supabaseStorageInit';

const result = await safeStorageUpload(
  supabase, 
  'bucket-name', 
  'path/file.jpg', 
  fileObject,
  { upsert: true }
);

if (result.success) {
  console.log('URL:', result.publicUrl);
} else {
  console.error('Erreur:', result.error);
}
```

---

## 🚨 PROCÉDURES D'URGENCE

### 🔥 **Faille de Sécurité Détectée**
1. **Identifier** le problème via l'outil diagnostic
2. **Bloquer** temporairement la route problématique
3. **Corriger** en ajoutant RoleProtectedRoute approprié
4. **Tester** avec plusieurs types d'utilisateurs
5. **Déployer** après validation complète

### 🔥 **Erreurs Supabase Massives**
1. **Vérifier** la connectivité à la base
2. **Examiner** les logs Supabase Dashboard
3. **Corriger** les requêtes problématiques
4. **Redémarrer** le serveur de dev si nécessaire

### 🔥 **Build Échoue en Production**
```bash
# Diagnostic rapide
npm run build 2>&1 | grep -i "error"

# Corrections courantes:
# - Imports manquants
# - Syntaxe JavaScript incorrecte  
# - Références à des composants supprimés
```

---

## 📋 CHECKLIST DÉPLOIEMENT

### Avant chaque déploiement:
- [ ] ✅ `npm run build` réussit sans erreur
- [ ] ✅ Tests RBAC passent (`node test-rbac-system.mjs`)
- [ ] ✅ Console dev sans erreurs critiques rouges
- [ ] ✅ Test manuel: Admin ne peut pas accéder `/my-requests`
- [ ] ✅ Test manuel: Particulier redirigé depuis `/admin`
- [ ] ✅ Upload d'images fonctionne (ou fallback gracieux)

### Après déploiement:
- [ ] ✅ Vérifier logs production
- [ ] ✅ Tester quelques parcours utilisateur critiques
- [ ] ✅ Confirmer que les redirections fonctionnent
- [ ] ✅ Surveiller les métriques d'erreur 24h

---

## 👥 CONTACTS & RESSOURCES

### 🛟 **Support Technique**
- **RBAC/Sécurité:** Consulter `rbacConfig.js`
- **Supabase:** Documentation officielle + Dashboard
- **Erreurs Build:** Vérifier imports et syntaxe

### 📖 **Documentation**
- `RAPPORT_FINAL_SECURITE_RBAC.md` - Vue d'ensemble système
- `RAPPORT_CORRECTIONS_SUPABASE_RBAC.md` - Corrections détaillées
- `test-rbac-system.mjs` - Tests automatisés

### 🔗 **Liens Utiles**
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Documentation React Router](https://reactrouter.com/)
- [Repository GitHub](https://github.com/desiigner122/terangafoncier)

---

## 🎯 **RAPPEL IMPORTANT**

**Mission critique:** S'assurer qu'aucun admin ne peut accéder aux pages réservées aux particuliers, et vice versa. Le système RBAC est la colonne vertébrale de la sécurité de l'application.

**En cas de doute:** Mieux vaut bloquer temporairement l'accès que laisser une faille de sécurité ouverte.

---

**Document maintenu par:** Équipe Dev Teranga Foncier  
**Dernière mise à jour:** ${new Date().toISOString()}  
**Version:** RBAC v1.0 + Corrections Supabase
