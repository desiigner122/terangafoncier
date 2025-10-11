# 🧪 GUIDE DE TEST - DASHBOARD ADMIN

## ⚡ Tests à faire MAINTENANT

### ✅ Test 1: Vérifier que le dashboard se charge

**1. Ouvrir le navigateur**
- Allez sur: `http://localhost:5173`
- Connectez-vous avec un compte **ADMIN**

**2. Vérifier qu'il n'y a pas d'erreurs**
- Ouvrir la console (F12)
- Onglet Console
- ✅ Aucune erreur rouge
- ✅ Voir les logs des hooks :
  ```
  Fetching admin stats...
  Fetching users...
  Fetching properties...
  ```

---

### ✅ Test 2: Vérifier les VRAIES statistiques

**Page Overview (Dashboard principal)**

```
┌────────────────────────────────────────┐
│ CE QUE VOUS DEVRIEZ VOIR :             │
├────────────────────────────────────────┤
│ ✅ Nombre total utilisateurs (RÉEL)    │
│    → Comparer avec: SELECT COUNT(*) FROM profiles  │
│                                        │
│ ✅ Propriétés en attente (RÉEL)       │
│    → Comparer avec: SELECT COUNT(*) FROM properties │
│       WHERE verification_status = 'pending' │
│                                        │
│ ✅ Tickets ouverts (RÉEL)             │
│    → Comparer avec: SELECT COUNT(*) FROM support_tickets │
│       WHERE status = 'open'           │
└────────────────────────────────────────┘
```

**Comment vérifier** :
1. Notez les chiffres affichés
2. Allez dans Supabase SQL Editor
3. Exécutez les requêtes ci-dessus
4. ✅ Les chiffres doivent correspondre !

---

### ✅ Test 3: Voir les comptes tests

**Page Utilisateurs**

**1. Cliquer sur "Utilisateurs" dans la sidebar**

**2. Vous devriez voir** :
```
┌──────────────────────────────────────────┐
│ 👤 Jean Dupont                           │
│ jean.dupont@email.com                    │
│ [Actif] [vendeur]                        │
│ Inscrit le: 05/10/2025                   │
│                                          │
│ Actions: [Rôle] [Suspendre] [Supprimer] │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ 👤 Marie Martin                          │
│ marie.martin@email.com                   │
│ [Actif] [acheteur]                       │
│ Inscrit le: 06/10/2025                   │
│                                          │
│ Actions: [Rôle] [Suspendre] [Supprimer] │
└──────────────────────────────────────────┘
```

**3. Si vous ne voyez RIEN** :
- ❌ Problème de RLS policies
- Solution :
```sql
-- Dans Supabase SQL Editor :
SELECT * FROM profiles;
-- Si vide, créez un compte test
```

---

### ✅ Test 4: Voir les propriétés en attente

**Page Validation (⚠️ Validation Urgente)**

**1. Cliquer sur "⚠️ Validation Urgente"**

**2. Vous devriez voir** :
```
┌────────────────────────────────────────────────┐
│ 🏠 Villa moderne à Dakar                       │
│ 📍 Almadies, Dakar                             │
│ 💰 45,000,000 FCFA                             │
│ [Villa]                                        │
│                                                │
│ Soumis le: 08/10/2025                          │
│                                                │
│ [✓ Approuver] [✗ Rejeter] [🗑️ Supprimer]      │
└────────────────────────────────────────────────┘
```

**3. Si vous voyez "Aucune propriété en attente"** :
- C'est normal si aucune propriété n'est pending
- Pour tester, créez une propriété avec un compte vendeur :
```sql
-- Dans Supabase SQL Editor :
INSERT INTO properties (
  owner_id,
  title,
  description,
  location,
  price,
  type,
  verification_status
) VALUES (
  'user-id-ici',
  'Test Propriété',
  'Description test',
  'Dakar',
  10000000,
  'villa',
  'pending'
);
```

---

### ✅ Test 5: Tester SUSPENDRE un utilisateur

**1. Page Utilisateurs**
- Cliquer sur [Suspendre] d'un utilisateur

**2. Modal s'ouvre** :
```
┌──────────────────────────────────────┐
│ Suspendre Jean Dupont                │
├──────────────────────────────────────┤
│ Raison de la suspension *            │
│ ┌────────────────────────────────┐   │
│ │ Violation des CGU              │   │
│ │                                │   │
│ └────────────────────────────────┘   │
│                                      │
│ [Annuler] [Confirmer Suspension]     │
└──────────────────────────────────────┘
```

**3. Entrez une raison** : `Violation des CGU`

**4. Cliquez [Confirmer Suspension]**

**5. Vérifications** :
- ✅ Toast de confirmation apparaît
- ✅ Badge "Suspendu" apparaît sur l'utilisateur
- ✅ Bouton change en [Réactiver]
- ✅ Raison visible : "Motif de suspension: Violation des CGU"

**6. Dans Supabase** :
```sql
SELECT suspended_at, suspension_reason 
FROM profiles 
WHERE id = 'user-id';
-- Doit afficher la date et la raison
```

**7. Dans admin_actions** :
```sql
SELECT * FROM admin_actions 
ORDER BY created_at DESC 
LIMIT 1;
-- Doit voir l'action de suspension
```

---

### ✅ Test 6: Tester RÉACTIVER un utilisateur

**1. Cliquer sur [Réactiver] du même utilisateur**

**2. Vérifications** :
- ✅ Toast de confirmation
- ✅ Badge redevient "Actif"
- ✅ Bouton redevient [Suspendre]
- ✅ Message de suspension disparaît

**3. Dans Supabase** :
```sql
SELECT suspended_at, suspension_reason 
FROM profiles 
WHERE id = 'user-id';
-- suspended_at et suspension_reason doivent être NULL
```

---

### ✅ Test 7: Tester APPROUVER une propriété

**1. Page Validation**
- Cliquer sur [✓ Approuver] d'une propriété

**2. Vérifications** :
- ✅ Toast "Propriété approuvée avec succès!"
- ✅ Propriété disparaît de la liste
- ✅ Compteur "X propriété(s) en attente" diminue

**3. Dans Supabase** :
```sql
SELECT verification_status, verified_at 
FROM properties 
WHERE id = 'property-id';
-- verification_status = 'verified'
-- verified_at = date actuelle
```

**4. Notification au propriétaire** :
```sql
SELECT * FROM admin_notifications 
WHERE user_id = 'owner-id'
ORDER BY created_at DESC LIMIT 1;
-- Type = 'property_approved'
-- Message = 'Votre propriété a été approuvée...'
```

---

### ✅ Test 8: Tester REJETER une propriété

**1. Page Validation**
- Cliquer sur [✗ Rejeter]

**2. Modal s'ouvre** :
```
┌──────────────────────────────────────┐
│ Rejeter Villa moderne à Dakar        │
├──────────────────────────────────────┤
│ Raison du rejet *                    │
│ ┌────────────────────────────────┐   │
│ │ Photos non conformes           │   │
│ │                                │   │
│ └────────────────────────────────┘   │
│                                      │
│ [Annuler] [Confirmer Rejet]          │
└──────────────────────────────────────┘
```

**3. Entrez une raison** : `Photos non conformes`

**4. Cliquez [Confirmer Rejet]**

**5. Vérifications** :
- ✅ Toast "Propriété rejetée"
- ✅ Propriété disparaît de la liste

**6. Dans Supabase** :
```sql
SELECT verification_status, rejection_reason, rejected_at 
FROM properties 
WHERE id = 'property-id';
-- verification_status = 'rejected'
-- rejection_reason = 'Photos non conformes'
-- rejected_at = date actuelle
```

---

### ✅ Test 9: Tester CHANGER LE RÔLE

**1. Page Utilisateurs**
- Cliquer sur [Rôle]

**2. Modal s'ouvre** :
```
┌──────────────────────────────────────┐
│ Modifier le rôle de Jean Dupont      │
├──────────────────────────────────────┤
│ Nouveau rôle                         │
│ ┌────────────────────────────────┐   │
│ │ [Particulier ▼]                │   │
│ │  Agent Foncier                 │   │
│ │  Notaire                       │   │
│ │  Admin                         │   │
│ └────────────────────────────────┘   │
│                                      │
│ [Annuler] [Confirmer]                │
└──────────────────────────────────────┘
```

**3. Sélectionnez** : `Notaire`

**4. Cliquez [Confirmer]**

**5. Vérifications** :
- ✅ Toast de confirmation
- ✅ Badge change pour [notaire]

**6. Dans Supabase** :
```sql
SELECT role FROM profiles WHERE id = 'user-id';
-- role = 'notaire'
```

---

### ✅ Test 10: Vérifier les LOGS (admin_actions)

**Dans Supabase SQL Editor** :
```sql
SELECT 
  action_type,
  target_type,
  target_id,
  details,
  created_at
FROM admin_actions
ORDER BY created_at DESC
LIMIT 10;
```

**Vous devriez voir** :
```
action_type         | target_type | details
--------------------|-------------|------------------
suspend_user        | user        | {"reason": "Violation..."}
unsuspend_user      | user        | {}
approve_property    | property    | {}
reject_property     | property    | {"reason": "Photos..."}
change_user_role    | user        | {"old_role": "vendeur", "new_role": "notaire"}
```

**✅ Tous vos actions doivent être loggées !**

---

## 🐛 PROBLÈMES COURANTS

### Problème 1: "Aucun utilisateur"
**Cause** : Policies RLS bloquent l'accès

**Solution** :
```sql
-- Vérifier que vous êtes admin :
SELECT role FROM profiles WHERE id = auth.uid();
-- Doit retourner 'admin'

-- Si vous n'êtes pas admin :
UPDATE profiles SET role = 'admin' WHERE id = auth.uid();
```

---

### Problème 2: Erreur "RLS policy violation"
**Cause** : Policies mal configurées

**Solution** :
```sql
-- Donner accès temporaire à tous les admins :
CREATE POLICY "Allow admins full access" 
ON profiles 
FOR ALL 
TO authenticated 
USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
```

---

### Problème 3: "Hook error: Failed to fetch"
**Cause** : URL Supabase incorrecte ou clé manquante

**Solution** :
1. Vérifier `.env` :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

2. Redémarrer le serveur :
```bash
npm run dev
```

---

### Problème 4: Actions ne fonctionnent pas
**Cause** : Hooks non importés ou mal nommés

**Solution** :
- Vérifier dans la console (F12) les erreurs
- Vérifier que les hooks sont bien dans `/src/hooks/admin/`
- Vérifier que `index.js` exporte bien tous les hooks

---

## ✅ CHECKLIST FINALE

Avant de valider, cochez :

- [ ] ✅ Dashboard se charge sans erreurs
- [ ] ✅ Statistiques affichent des chiffres réels (pas 0)
- [ ] ✅ Page Utilisateurs montre les profils Supabase
- [ ] ✅ Page Validation montre les propriétés pending
- [ ] ✅ Action Suspendre fonctionne et logge
- [ ] ✅ Action Réactiver fonctionne
- [ ] ✅ Action Approuver propriété fonctionne
- [ ] ✅ Action Rejeter propriété fonctionne
- [ ] ✅ Action Changer rôle fonctionne
- [ ] ✅ Toutes actions loggées dans admin_actions
- [ ] ✅ Notifications créées dans admin_notifications

---

## 🎉 SUCCÈS !

Si tous les tests passent, vous avez maintenant un **Dashboard Admin Fonctionnel** avec :

✅ Données réelles de Supabase  
✅ Actions admin opérationnelles  
✅ Logs automatiques  
✅ Notifications automatiques  
✅ Interface moderne et réactive  

**Le problème initial est résolu** :
> "l'admin ne le voit pas"

**→ MAINTENANT L'ADMIN VOIT TOUT ! ✅**

---

*Guide créé le: 10 Octobre 2025*  
*Dernière mise à jour: 10 Octobre 2025*

