# 📋 PLAN DE CORRECTIONS URGENT - Terangafoncier

## ✅ PROBLÈMES RÉSOLUS

### 1. OneTimePaymentPage - requestData undefined ✅
- **Erreur**: `ReferenceError: requestData is not defined` ligne 657
- **Cause**: Variable `requestData` utilisée au lieu de `request`
- **Solution**: Remplacé `requestData.id` par `request.id`
- **Fichier**: `src/pages/buy/OneTimePaymentPage.jsx` ligne 660

---

## 🔧 PROBLÈMES EN COURS

### 2. Dashboard Vendeur - Demandes invisibles 🔄
- **Symptôme**: Les vendeurs ne voient pas les demandes d'achat
- **Logs ajoutés**: Debug logs dans `VendeurPurchaseRequests.jsx`
- **Action requise**: 
  1. Exécuter `verify-parcels-columns.sql` dans Supabase
  2. Vérifier les logs console avec compte vendeur
  3. Confirmer que `seller_id` correspond au user_id du vendeur

---

## ⚠️ PROBLÈMES À CORRIGER

### 3. BankFinancingPage - Prix inutile 🎯
**Problème**: Le prix est demandé alors que la parcelle a déjà un prix fixé

**Solution**: 
- Le champ est déjà en `disabled` quand `context.parcelle?.price` existe
- Le prix est auto-rempli depuis `context.parcelle?.price`
- **Aucune correction nécessaire** - fonctionnement normal

---

### 4. BankFinancingPage - Bouton grisé 🔴
**Problème**: Bouton reste désactivé même avec tous les champs remplis

**Cause**: Condition de validation ligne 385
```javascript
disabled={!user || submitting || !hasContext || !income || !amount}
```

**Solutions possibles**:
1. Vérifier que le champ `income` (revenus) est bien rempli
2. Vérifier que `hasContext` est `true`
3. Vérifier que `amount` n'est pas vide

**Diagnostic nécessaire**: Ajouter logs pour voir quelle condition bloque

---

### 5. BankFinancingPage - Upload de documents CRITIQUE 🚨
**Problème**: Impossible d'uploader les documents demandés (identité, revenus, bulletins salaire)

**Cause**: Les "documents" sont de simples **checkboxes** (lignes 343-363), pas des uploads de fichiers réels

**Impact**: 
- Utilisateurs cochent juste "j'ai le document" 
- Aucun fichier n'est réellement uploadé
- Pas de preuve pour la banque

**Solution requise**: Implémenter un vrai système d'upload
```jsx
// Remplacer les checkboxes par:
<input 
  type="file" 
  accept=".pdf,.jpg,.jpeg,.png"
  onChange={(e) => handleFileUpload(key, e.target.files[0])}
/>
```

**Composants nécessaires**:
- Fonction `handleFileUpload` pour uploader vers Supabase Storage
- Affichage des fichiers uploadés (nom, taille, bouton supprimer)
- Barre de progression d'upload
- Validation type/taille de fichiers

---

### 6. Restriction rôle acheteur 🔐
**Problème**: Les vendeurs peuvent acheter des terrains

**Solution**: Ajouter protection dans les routes
```jsx
// Dans App.jsx ou ProtectedRoute.jsx
const BuyerOnlyRoute = ({ children }) => {
  const { profile } = useAuth();
  const allowedRoles = ['particulier', 'acheteur', 'investisseur'];
  
  if (!allowedRoles.includes(profile?.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Appliquer aux routes /buy/*
<Route path="buy/*" element={
  <BuyerOnlyRoute>
    <BuyRoutes />
  </BuyerOnlyRoute>
} />
```

---

### 7. Erreurs tables manquantes 🗄️
**Problèmes multiples**:

#### A. Table `contact_requests` n'existe pas
```
Could not find the table 'public.contact_requests'
Hint: Perhaps you meant the table 'public.construction_requests'
```

**Solution**: 
- Renommer `contact_requests` → `construction_requests` dans le code
- OU créer la table `contact_requests` si elle est nécessaire

#### B. Colonne `messages.conversation_id` n'existe pas
```
column messages.conversation_id does not exist
```

**Solution**: 
- Vérifier la structure réelle de la table `messages`
- Utiliser la bonne colonne (probablement `chat_id` ou `room_id`)

#### C. Colonne `crm_contacts.owner_id` n'existe pas
```
column crm_contacts.owner_id does not exist
```

**Solution**:
- Vérifier la structure réelle de la table `crm_contacts`
- Utiliser la bonne colonne (probablement `user_id` ou `created_by`)

---

## 🎯 PRIORITÉS

### Urgent (bloquer les utilisateurs)
1. ✅ OneTimePaymentPage - requestData undefined (RÉSOLU)
2. 🔴 BankFinancingPage - Upload documents manquant
3. 🔴 Dashboard Vendeur - Demandes invisibles

### Important (UX dégradée)
4. 🟡 BankFinancingPage - Bouton grisé (diagnostic requis)
5. 🟡 Restriction rôle acheteur
6. 🟡 Erreurs tables manquantes (pollution console)

### Normal (fonctionnel mais améliorable)
7. 🟢 Prix BankFinancingPage (déjà fonctionnel, comportement attendu)

---

## 📝 PROCHAINES ACTIONS

1. **Vendeur Dashboard**: 
   - Exécuter `verify-parcels-columns.sql`
   - Tester avec compte vendeur
   - Vérifier logs console `[VENDEUR]`

2. **Upload Documents**:
   - Créer composant `DocumentUploader.jsx`
   - Implémenter upload vers Supabase Storage
   - Remplacer checkboxes par vrais uploads

3. **Diagnostic Bouton**:
   - Ajouter logs `console.log({user, submitting, hasContext, income, amount})`
   - Identifier quelle condition bloque

4. **Restriction Rôles**:
   - Créer `BuyerOnlyRoute` component
   - Appliquer aux routes `/buy/*`

5. **Erreurs Tables**:
   - Créer script SQL pour vérifier toutes les tables/colonnes
   - Corriger les noms dans les composants concernés

---

## 🧪 TESTS NÉCESSAIRES

Après corrections:
- [ ] Compte vendeur voit les demandes d'achat
- [ ] Upload de documents fonctionne (PDF, images)
- [ ] Bouton financement bancaire se débloque correctement
- [ ] Vendeur ne peut pas accéder aux pages d'achat
- [ ] Plus d'erreurs 404 dans la console
- [ ] Paiement direct fonctionne sans erreur
- [ ] Paiement échelonné fonctionne (déjà OK selon utilisateur)

---

**Date**: 15 octobre 2025  
**Status**: 1/7 problèmes résolus, 6 en cours
