# ✅ INSTALLATION SQL TERMINÉE - CHECKLIST DE TEST

**Date**: 2025-10-07  
**Status**: Installation complète exécutée

---

## 📊 VÉRIFICATION SUPABASE (OPTIONNEL)

Si vous voulez vérifier dans Supabase Dashboard :

```sql
-- Copier/coller ce script dans SQL Editor:
-- Fichier: sql/VERIFICATION_INSTALLATION.sql
```

**Résultats attendus**:
- ✅ 11 tables créées
- ✅ 6 catégories support
- ✅ 6 services digitaux
- ✅ 15-20 policies RLS
- ✅ 5-7 fonctions

---

## 🧪 TESTS DANS L'APPLICATION

### 1️⃣ Test Support & Tickets (5 min)

```bash
# Terminal
npm run dev

# Browser
http://localhost:5173/vendeur/support
```

**Actions à tester**:
1. ✅ Page se charge sans erreur
2. ✅ Voir les 6 catégories (Compte, Propriétés, Paiements, Technique, Fonctionnalités, Autre)
3. ✅ Créer un ticket test:
   - Catégorie: "Technique & Bugs"
   - Sujet: "Test installation SQL"
   - Type: "Question"
   - Priorité: "Normal"
   - Description: "Vérification après installation"
4. ✅ Cliquer "Créer le ticket"
5. ✅ Vérifier notification succès
6. ✅ Voir le ticket dans la liste avec numéro TK-XXXXXX

**Vérification console (F12)**:
- ❌ Plus d'erreur "table does not exist"
- ✅ Logs de création OK

---

### 2️⃣ Test Messagerie (3 min)

```bash
# Browser
http://localhost:5173/vendeur/messages
```

**Actions à tester**:
1. ✅ Page se charge sans erreur
2. ✅ Liste vide (normal - pas encore de conversations)
3. ✅ Message "Aucune conversation" ou similaire
4. ✅ Plus de mock data hardcodées

**Vérification console (F12)**:
- ❌ Plus d'erreur "conversations does not exist"
- ❌ Plus d'erreur "vendor_id does not exist"
- ✅ Chargement correct depuis Supabase

---

### 3️⃣ Test Services Digitaux (5 min)

```bash
# Browser
http://localhost:5173/vendeur/services
```

**Actions à tester**:
1. ✅ Page se charge sans erreur
2. ✅ Voir 6 services affichés:
   - Signature Électronique (bleu)
   - Visite Virtuelle 360° (violet)
   - OCR Documents (vert)
   - Stockage Cloud (orange)
   - Marketing Digital (rose)
   - Assistance Juridique (rouge)
3. ✅ Chaque service a 2-3 plans tarifaires
4. ✅ Prix affichés en FCFA
5. ✅ Boutons "S'abonner" fonctionnels

**Vérification console (F12)**:
- ❌ Plus d'erreur "digital_services does not exist"
- ✅ Services chargés depuis Supabase

---

### 4️⃣ Test Edit Property Debug (3 min)

**Rappel**: Debug logs ajoutés hier pour diagnostiquer le 404

```bash
# Browser
http://localhost:5173/vendeur/properties
```

**Actions à tester**:
1. ✅ Ouvrir console (F12)
2. ✅ Cliquer sur "Modifier" (icône crayon) d'une propriété
3. ✅ Vérifier logs console:
   ```
   🔍 DEBUG EDIT PROPERTY - DÉTAILLÉ
   Property ID: [UUID]
   Property ID Type: string
   Property Title: [Titre]
   Target URL: /vendeur/edit-property/[UUID]
   ```
4. ✅ Si navigation réussit → **Problème résolu !** 🎉
5. ❌ Si encore 404 → Me copier les logs console

---

## 📋 CHECKLIST COMPLÈTE

### Base de données ✅
- [x] Tables Support créées (3 tables)
- [x] Tables Messagerie créées (4 tables)
- [x] Tables Services créées (4 tables)
- [x] Données initiales insérées (12 lignes)
- [x] RLS configuré
- [x] Triggers fonctionnels

### Application Web 🧪 (À tester)
- [ ] `/vendeur/support` - Création ticket OK
- [ ] `/vendeur/messages` - Liste vide (correct)
- [ ] `/vendeur/services` - 6 services affichés
- [ ] `/vendeur/properties` - Edit debug logs visibles
- [ ] Plus d'erreurs "table does not exist"
- [ ] Plus d'erreurs "column does not exist"

---

## 🚨 SI ERREURS PERSISTENT

### Erreur: "table does not exist"
```sql
-- Vérifier tables créées:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%support%';
```

### Erreur: "permission denied"
```sql
-- Vérifier RLS:
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('support_tickets', 'conversations', 'digital_services');
```

### Erreur: "policy violation"
```sql
-- Vérifier policies:
SELECT * FROM pg_policies 
WHERE tablename = 'support_tickets';
```

---

## 📸 CAPTURES D'ÉCRAN ATTENDUES

### Support Page ✅
- Header "Support & Aide"
- 6 catégories en grid
- Formulaire création ticket
- Liste tickets (vide au début)

### Messages Page ✅
- Header "Messages"
- Zone de recherche
- Liste conversations (vide)
- "Aucune conversation" message

### Services Page ✅
- Header "Services Digitaux"
- 6 cards colorées
- Plans tarifaires visibles
- Boutons "S'abonner"

---

## ✅ PROCHAINES ÉTAPES

Une fois les tests OK:

### 🔴 URGENT (1-2h)
1. ✅ Analyser logs edit-property
2. ✅ Corriger route 404 si nécessaire
3. ✅ Supprimer mock conversations VendeurMessages

### 🟡 IMPORTANT (Cette semaine)
4. Installer Recharts: `npm install recharts`
5. Implémenter graphiques Analytics
6. Intégrer API OpenAI (chatbot IA)

### 🟢 AMÉLIORATIONS (Plus tard)
7. Carte GPS interactive (Mapbox)
8. Smart contract Blockchain
9. Paiement Wave Money

---

## 📞 BESOIN D'AIDE ?

**Me confirmer**:
- ✅ "Support OK" - Ticket créé avec succès
- ✅ "Messages OK" - Liste vide affichée
- ✅ "Services OK" - 6 services visibles
- 🔍 "Edit logs: [copier logs console]"

**OU**

**Envoyer erreurs**:
- Screenshot page avec erreur
- Logs console (F12)
- Message d'erreur exact

---

**Status**: ✅ SQL installé, en attente tests application  
**Temps tests**: 15 minutes  
**Next**: Analyser résultats et corriger route edit si nécessaire
