# ✅ TESTS RAPIDES - 2 MINUTES

## 🎯 Correction appliquée : Messages + Edit Property

---

## 🔥 TEST IMMÉDIAT (30 secondes)

### 1. Rafraîchir l'Application
```
Dans votre navigateur : CTRL + F5
```

### 2. Vérifier Console (F12)
**AVANT** :
- ❌ `Fetch error from .../messages?select=*,sender:auth.users...`
- ❌ Erreur `PGRST100`

**APRÈS** :
- ✅ Plus d'erreur sur `/messages`
- ✅ Console propre

---

## 📝 TEST EDIT PROPERTY (1 minute)

### Étapes :
1. **Dashboard Vendeur** → Onglet **"Propriétés"**
2. Trouver une propriété dans la liste
3. Cliquer sur **menu (3 points)** à droite
4. Cliquer sur **"Modifier"**

### Résultat Attendu :
✅ **Page d'édition s'affiche** avec :
- Sidebar visible sur la gauche
- Formulaire d'édition au centre
- Tous les champs remplis (titre, prix, surface, etc.)
- Boutons "Enregistrer" et "Annuler"

### ❌ Si ça ne marche pas :
Screenshot + logs console (F12)

---

## 🎉 SI TOUT FONCTIONNE

**Prochain step** : Exécuter `FIX_MISSING_TABLES.sql` pour corriger les autres erreurs :
- `property_inquiries` manquante
- `purchase_requests` manquante
- `crm_contacts` colonne `name` manquante
- `profiles` récursion infinie

---

## 📊 Checklist Rapide

- [ ] CTRL+F5 fait
- [ ] Console propre (F12)
- [ ] Bouton "Modifier" cliqué
- [ ] Formulaire edit s'affiche
- [ ] Sidebar reste visible

**Si tout est ✅ → Passer au SQL fix** 🚀
