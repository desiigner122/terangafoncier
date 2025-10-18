# 🔧 CONTACT FORM - FIX: Affichage Complet des Données

**Date:** October 18, 2025  
**Problème:** Côté administrateur, seuls prénom, nom et adresse s'affichent  
**Cause:** Colonnes manquantes dans la BD Supabase  
**Solution:** Ajouter les colonnes et mettre à jour le code

---

## 📋 CHAMPS MANQUANTS

Les champs suivants n'étaient **PAS sauvegardés** en BD:

- ❌ **category** (Catégorie du contact: blockchain, diaspora, etc.)
- ❌ **urgency** (Niveau d'urgence: low, normal, high, urgent)

---

## ✅ ÉTAPES DE CORRECTION

### ÉTAPE 1: Exécuter le script SQL (2 minutes)

**Option A: Directement dans Supabase Editor (Recommandé)**

1. Allez à: https://supabase.com/dashboard
2. Ouvrez votre projet `terangafoncier`
3. Cliquez: **SQL Editor** (menu gauche)
4. Cliquez: **New Query**
5. Copiez le contenu de `add-contact-form-columns.sql`
6. Cliquez: **Run**
7. Attendez: Confirmation ✅

**Résultat attendu:**
```
ALTER TABLE public.marketing_leads ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.marketing_leads ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'normal';
-- ... etc
```

---

### ÉTAPE 2: Vérifier que la mise à jour est appliquée

Après avoir exécuté le script, vérifiez dans **Supabase Dashboard**:

1. Allez à: **Database** → **marketing_leads** table
2. Vérifiez que vous voyez **2 nouvelles colonnes**:
   - `category` (TEXT)
   - `urgency` (TEXT)

---

### ÉTAPE 3: Déployer le code (Automatique via Vercel)

Le code a déjà été mis à jour:
- ✅ `src/pages/BlockchainContactPage.jsx` - Envoie maintenant les champs
- ✅ `src/services/admin/MarketingService.js` - Sauvegarde les champs

**Vérification:**
Votre Vercel devrait auto-déployer dans ~2-3 min après le git push.

---

## 🧪 TEST - VÉRIFIER QUE ÇA MARCHE

### Test 1: Soumettre un formulaire de test

1. Allez à: https://www.terangafoncier.sn/contact
2. Remplissez le formulaire:
   - Nom: **Test Admin**
   - Email: **test@example.com**
   - Téléphone: **+221 77 xxx xx xx**
   - Catégorie: **Blockchain/NFT** (Choisir dans le select)
   - Sujet: **Test de formulaire complet**
   - Urgence: **Élevée** (Choisir dans le select)
   - Message: **Ceci est un test pour vérifier que tous les champs s'affichent**
3. Cliquez: **Envoyer le Message**
4. Attendez: Success message ✅

### Test 2: Vérifier côté admin

1. Allez à votre **Dashboard Admin**
2. Allez à: **Leads** ou **Contact Requests**
3. Cherchez le lead que vous venez de créer
4. Cliquez dessus pour voir le détail

**Vous devriez voir MAINTENANT:**
- ✅ Nom
- ✅ Email
- ✅ Téléphone
- ✅ Sujet
- ✅ Message
- ✅ **Catégorie** (NEW!)
- ✅ **Urgence** (NEW!)

---

## 🎯 CHECKLIST FINAL

- [ ] Script SQL exécuté dans Supabase
- [ ] Colonnes `category` et `urgency` ajoutées à la BD
- [ ] Code déployé (Git push → Vercel)
- [ ] Formulaire de test soumis
- [ ] Admin voit TOUS les champs dans le lead

---

## 📊 CE QUI A ÉTÉ CHANGÉ

### Fichier 1: `src/pages/BlockchainContactPage.jsx`
**Avant:**
```javascript
const leadResult = await MarketingService.createLead({
  source: 'contact_form',
  form_name: 'BlockchainContactPage',
  email: formData.email,
  payload: {
    name: formData.name,
    phone: formData.phone,
    subject: formData.subject,
    category: formData.category,  // ❌ Dans payload (perdu)
    message: formData.message,
    urgency: formData.urgency      // ❌ Dans payload (perdu)
  }
});
```

**Après:**
```javascript
const leadResult = await MarketingService.createLead({
  full_name: formData.name,
  email: formData.email,
  phone: formData.phone,
  subject: formData.subject,
  message: formData.message,
  source: 'contact_form',
  category: formData.category,   // ✅ Au niveau racine
  urgency: formData.urgency      // ✅ Au niveau racine
});
```

### Fichier 2: `src/services/admin/MarketingService.js`
**Avant:**
```javascript
const { data, error } = await supabase
  .from('marketing_leads')
  .insert({
    full_name: leadData.full_name || leadData.name || 'Anonymous',
    email: leadData.email,
    phone: leadData.phone,
    subject: leadData.subject,
    message: leadData.message,
    // ❌ category et urgency n'étaient pas inclus
    status: 'new',
    // ...
  });
```

**Après:**
```javascript
const { data, error } = await supabase
  .from('marketing_leads')
  .insert({
    full_name: leadData.full_name || leadData.name || 'Anonymous',
    email: leadData.email,
    phone: leadData.phone,
    subject: leadData.subject,
    message: leadData.message,
    category: leadData.category || null,           // ✅ Inclus
    urgency: leadData.urgency || 'normal',         // ✅ Inclus
    status: 'new',
    // ...
  });
```

---

## 🚀 DÉPLOIEMENT

**Commit déjà poussé:**
```
✅ Fixed contact form: Add category and urgency fields
   - Updated BlockchainContactPage.jsx to send fields correctly
   - Updated MarketingService.createLead() to save category and urgency
   - Added SQL script to create missing columns in Supabase
```

**Vercel auto-déploie dans ~2-3 minutes** après le git push.

---

## ❓ FAQ

**Q: Pourquoi seuls prénom, nom et adresse s'affichaient?**  
R: Parce que les colonnes n'existaient pas dans la BD. MarketingService n'envoyait que les champs qui existaient.

**Q: Il faut faire quoi maintenant?**  
R: Exécuter le script SQL dans Supabase Editor (2 minutes), puis tester.

**Q: Et les anciens leads?**  
R: Ils n'auront pas les données `category` et `urgency` (car ils n'ont pas été envoyés). Les nouveaux leads auront tous les champs.

**Q: Peut-on récupérer l'ancienne data?**  
R: Non, elle n'a jamais été envoyée au serveur. À partir de maintenant, tous les formulaires envoyeront les données complètes.

---

**Status:** ✅ Code prêt. En attente de: 1) Exécution du SQL, 2) Vérification
