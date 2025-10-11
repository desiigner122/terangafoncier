# ✅ VÉRIFICATION POST-MIGRATION SQL

**Date:** 10 Octobre 2025  
**Statut:** Migration SQL exécutée - Vérification nécessaire

---

## 🎯 ÉTAPES DE VÉRIFICATION

### 1. Vérifier Tables dans Supabase Dashboard (2 min)

**Action:**
1. Ouvrir: https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns
2. Cliquer sur **"Table Editor"** (icône tableau dans sidebar)
3. **Vérifier que ces 8 tables apparaissent:**

```
✅ cms_pages
✅ cms_sections
✅ media_assets
✅ marketing_leads
✅ team_members
✅ page_events
✅ page_views
✅ pricing_config
```

**Si TOUTES les tables sont visibles → Migration réussie! ✨**

---

### 2. Vérifier Seed Data (1 min)

#### A. Pricing Config (5 rows)
```sql
-- Exécuter dans SQL Editor
SELECT key, value, label FROM pricing_config ORDER BY key;
```

**Résultat attendu:**
```
construction_distance_base_fee | 150000 | Frais construction à distance base
notary_base_fee               | 50000  | Frais notaire base
service_fee_percentage        | 2.5    | Commission plateforme
stamp_duty_rate               | 3.0    | Droits enregistrement
verification_fee              | 10000  | Frais vérification
```

#### B. Team Members (2 rows)
```sql
-- Exécuter dans SQL Editor
SELECT name, role, email FROM team_members ORDER BY display_order;
```

**Résultat attendu:**
```
Équipe Support      | support | support@terangafoncier.sn
Équipe Commerciale  | sales   | sales@terangafoncier.sn
```

---

### 3. Tester Insert (Optionnel, 2 min)

#### Test CMS Page
```sql
-- Créer une page test
INSERT INTO cms_pages (slug, title, description, status)
VALUES ('test-page', 'Page de Test', 'Test post-migration', 'draft')
RETURNING id, slug, title, status;
```

**Résultat attendu:** 1 row retournée avec UUID

#### Vérifier la page
```sql
SELECT id, slug, title, status FROM cms_pages WHERE slug = 'test-page';
```

#### Nettoyer (après test)
```sql
DELETE FROM cms_pages WHERE slug = 'test-page';
```

---

## 🚀 PROCHAINES ACTIONS

### Si Vérification OK ✅

1. **Créer Bucket Storage (5 min)**
   ```
   Dashboard → Storage → New bucket
   Name: media
   Public: YES
   Size: 50MB
   ```

2. **Hard Refresh Application**
   ```
   Navigateur: Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)
   ```

3. **Tester Pages Phase 1**
   ```
   http://localhost:5173/admin/dashboard
   Cliquer: "Pages CMS" (sidebar)
   → Devrait charger AdminPagesList SANS erreur
   ```

---

## ❌ TROUBLESHOOTING

### Erreur: Tables non visibles dans Dashboard

**Solution 1: Rafraîchir le Dashboard**
```
Dashboard → Clic sur logo Supabase (en haut à gauche)
→ Revenir au projet → Table Editor
```

**Solution 2: Vérifier via SQL**
```sql
-- Lister toutes les tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

Si les tables **cms_pages**, **marketing_leads**, etc. apparaissent dans cette liste → Migration OK!

---

### Erreur: "stats is null" dans AdminLeadsList

**Cause:** Hook `useAdminLeads` ne charge pas les données  
**Solution:** Vérifier table `marketing_leads` existe

```sql
-- Test simple
SELECT COUNT(*) FROM marketing_leads;
```

**Résultat attendu:** `0` (table vide mais accessible)

**Si erreur "table doesn't exist":**
```sql
-- Recréer la table manuellement
CREATE TABLE IF NOT EXISTS marketing_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  form_name TEXT,
  utm JSONB DEFAULT '{"source": null, "medium": null, "campaign": null, "term": null, "content": null}',
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  replied_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

### Erreur: ".order is not a function"

**Cause:** Requête Supabase échoue avant le `.order()`  
**Solution:** Vérifier table existe

```sql
-- Vérifier table cms_pages
SELECT * FROM cms_pages LIMIT 1;
```

**Si "relation does not exist":** Table pas créée, ré-exécuter script SQL

---

## 📊 STATUT ACTUEL

### ✅ Complété
- [x] Script SQL exécuté (DROP POLICY IF EXISTS ajoutés)
- [x] Migration sans erreur 42710 (policy exists)
- [x] Tables Phase 1 créées

### ⏳ En Attente
- [ ] Vérification visuelle Dashboard (8 tables)
- [ ] Test seed data (pricing_config, team_members)
- [ ] Création bucket Storage "media"
- [ ] Hard refresh application
- [ ] Tests fonctionnels CMS/Leads/Blog

---

## 🎯 OBJECTIF FINAL

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  OBJECTIF: VOIR "0 Pages" AU LIEU D'UNE ERREUR        │
│                                                         │
│  AdminPagesList → Tableau vide ✅                      │
│  AdminLeadsList → "0 Nouveaux leads" ✅               │
│  AdminBlogPage → Liste articles (si données) ✅        │
│                                                         │
│  Erreurs 400 properties/support_tickets → Normales    │
│  (anciennes tables, pas liées à Phase 1)              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

**Prochaine étape:** Vérifier visuellement les 8 tables dans Supabase Dashboard → Table Editor, puis créer bucket "media"! 🚀
