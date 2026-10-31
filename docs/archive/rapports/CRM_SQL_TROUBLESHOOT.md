## 🔧 **GUIDE: Résoudre les Erreurs SQL CRM**

**Date:** 18 Octobre 2025

---

## ❌ **Erreur: `column "assigned_to" does not exist`**

### **Cause Probable**
Le script SQL essaie de créer des policies RLS qui référencent une colonne qui n'existe pas ou n'a pas été créée correctement.

### **Solution 1: Utiliser le Script de Nettoyage (RECOMMANDÉ)**

1. Allez à: **Supabase → SQL Editor → New Query**
2. Copiez l'intégralité de: **`crm-cleanup-and-rebuild.sql`**
3. Exécutez le script
4. Attendez la confirmation

✅ Ce script va:
- Supprimer les anciennes tables (avec les erreurs)
- Recréer toutes les tables correctement
- Ajouter les indexes
- Ajouter les policies RLS simplifiées
- Donner les permissions

---

## ✅ **Si le Cleanup Script Fonctionne**

Vous devriez voir à la fin:

```
status          | table_count
────────────────┼─────────────
Tables Created  | 4

status          | policy_count
────────────────┼──────────────
Policies Created| 8
```

✅ Si vous voyez ça, c'est parfait!

---

## ⚠️ **Alternative: Nettoyage Manuel**

Si le cleanup script ne fonctionne pas, essayez ça step by step:

### **Step 1: Supprimer les tables**

```sql
-- Supprimer dans cet ordre (cause des dependencies)
DROP TABLE IF EXISTS public.crm_tasks CASCADE;
DROP TABLE IF EXISTS public.crm_activities CASCADE;
DROP TABLE IF EXISTS public.crm_deals CASCADE;
DROP TABLE IF EXISTS public.crm_contacts CASCADE;
```

### **Step 2: Recréer juste crm_contacts**

```sql
CREATE TABLE public.crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'prospect',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Testez que ça marche ✅

### **Step 3: Ajouter les autres tables**

```sql
-- Ajouter crm_deals, crm_activities, crm_tasks une par une
-- Tester après chaque création
```

---

## 🚀 **SI TOUT FONCTIONNE**

Une fois que les tables sont créées:

1. Allez à: **Supabase → Table Editor**
2. Vous devez voir 4 tables:
   - `crm_contacts`
   - `crm_deals`
   - `crm_activities`
   - `crm_tasks`

3. Insérez un test contact pour vérifier RLS:

```sql
INSERT INTO public.crm_contacts (name, email) 
VALUES ('Test Contact', 'test@example.com');
```

✅ Si ça marche, tout est bon!

---

## 📋 **CHECKLIST**

- [ ] Exécuté crm-cleanup-and-rebuild.sql
- [ ] Vu 4 tables créées
- [ ] Vu 8+ policies créées
- [ ] Inséré un test contact
- [ ] Test contact visible dans Table Editor
- [ ] Pas d'erreurs dans la console

---

## 🆘 **ENCORE DES ERREURS?**

### **Si error: "relation ... does not exist"**
→ Les tables n'ont pas été créées correctement
→ Exécutez encore crm-cleanup-and-rebuild.sql

### **Si error: "permission denied"**
→ Les policies bloquent l'accès
→ Assurez-vous d'être connecté comme admin

### **Si error: "unique violation"**
→ Un email existe déjà
→ Utilisez un autre email pour le test

---

**Besoin d'aide? Laissez le message d'erreur complet! 🎯**
