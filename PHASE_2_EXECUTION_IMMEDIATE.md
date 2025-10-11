# 🚀 PHASE 2 - EXÉCUTION IMMÉDIATE

**Durée estimée:** 20 minutes  
**Prérequis:** Accès Supabase Dashboard

---

## ⚡ ÉTAPE 1: MIGRATION SQL (15 min)

### 📋 Instructions Pas-à-Pas

1. **Ouvrir Supabase Dashboard**
   ```
   URL: https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns
   ```

2. **Naviguer vers SQL Editor**
   ```
   Dashboard → SQL Editor (icône </> dans sidebar gauche)
   ```

3. **Créer une nouvelle requête**
   ```
   Cliquer sur "+ New Query"
   ```

4. **Copier le script SQL**
   ```
   Fichier: supabase/migrations/20251010_phase1_admin_tables.sql
   ```
   
   ✅ **Le script crée:**
   - 8 tables (cms_pages, cms_sections, media_assets, marketing_leads, team_members, page_events, page_views, pricing_config)
   - 20+ index pour performances
   - 15 RLS policies pour sécurité
   - 5 triggers pour auto-update timestamps
   - Seed data (pricing config + team members)

5. **Exécuter le script**
   ```
   Bouton: "RUN" (ou Ctrl+Enter)
   ```

6. **Vérifier succès**
   ```
   ✅ Message: "Success. No rows returned"
   ✅ Aucun message d'erreur rouge
   ```

7. **Valider tables créées**
   ```
   Dashboard → Table Editor
   ```
   
   **Vous devez voir 8 nouvelles tables:**
   - ✅ cms_pages
   - ✅ cms_sections  
   - ✅ media_assets
   - ✅ marketing_leads
   - ✅ team_members
   - ✅ page_events
   - ✅ page_views
   - ✅ pricing_config

---

## 📦 ÉTAPE 2: BUCKET STORAGE (5 min)

### 📋 Instructions Pas-à-Pas

1. **Naviguer vers Storage**
   ```
   Dashboard → Storage (icône 📦 dans sidebar)
   ```

2. **Créer nouveau bucket**
   ```
   Cliquer sur "+ New bucket"
   ```

3. **Configurer le bucket**
   ```
   Name: media
   Public bucket: ✅ YES (cocher la case)
   File size limit: 50 MB
   Allowed MIME types: image/*, video/* (optionnel)
   ```

4. **Créer le bucket**
   ```
   Cliquer sur "Create bucket"
   ```

5. **Configurer les policies (automatique)**
   ```
   Le bucket public génère automatiquement les policies de lecture
   ```

6. **Vérifier succès**
   ```
   ✅ Bucket "media" visible dans la liste
   ✅ Badge "Public" affiché
   ```

---

## ✅ VALIDATION FINALE

### Checklist de Vérification

#### 1. Tables SQL
```sql
-- Exécuter dans SQL Editor pour vérifier
SELECT tablename 
FROM pg_tables 
WHERE tablename IN (
  'cms_pages', 'cms_sections', 'media_assets',
  'marketing_leads', 'team_members', 'page_events',
  'page_views', 'pricing_config'
)
ORDER BY tablename;
```

**Résultat attendu:** 8 rows

#### 2. Seed Data
```sql
-- Vérifier pricing_config
SELECT key, value, label FROM pricing_config ORDER BY key;
```

**Résultat attendu:** 5 rows (service_fee, notary_base_fee, etc.)

```sql
-- Vérifier team_members
SELECT name, role, email FROM team_members ORDER BY display_order;
```

**Résultat attendu:** 2 rows (Support, Commerciale)

#### 3. Storage Bucket
```
Dashboard → Storage → "media" bucket visible
```

**Tests optionnels:**
- Upload test image
- Vérifier URL publique générée
- Delete test image

---

## 🎯 APRÈS L'EXÉCUTION

### Redémarrer l'Application

```bash
# Dans le terminal PowerShell
# Le serveur devrait déjà tourner, rafraîchir le navigateur suffit
```

Ou forcer un restart:
```bash
Ctrl+C  # Arrêter le serveur
npm run dev  # Redémarrer
```

### Tester les Nouvelles Fonctionnalités

1. **Naviguer vers Dashboard Admin**
   ```
   http://localhost:5173/admin/dashboard
   ```

2. **Cliquer sur "Pages CMS"** (sidebar)
   - ✅ Devrait charger AdminPagesList sans erreur
   - ✅ Tableau vide (normal, aucune page créée)
   - ✅ Bouton "+ Nouvelle Page" visible

3. **Cliquer sur "Leads Marketing"** (sidebar)
   - ✅ Devrait charger AdminLeadsList sans erreur
   - ✅ Tableau vide (normal, aucun lead)
   - ✅ Stats "0 Nouveaux leads" visible

4. **Cliquer sur "Blog"** (sidebar)
   - ✅ Devrait charger AdminBlogPage
   - ✅ Liste articles existants (si données blog)

5. **Vérifier Analytics** (onglet interne)
   - ✅ Section "Page Tracking Analytics" visible
   - ✅ Tableau page_views/page_events vide (normal)

---

## 🐛 TROUBLESHOOTING

### Erreur: "relation already exists"
**Cause:** Tables déjà créées lors d'un test précédent  
**Solution:** Pas d'action requise, utiliser `DROP TABLE IF EXISTS` si besoin de recréer

```sql
-- Supprimer toutes les tables Phase 1 (DANGER!)
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS page_events CASCADE;
DROP TABLE IF EXISTS media_assets CASCADE;
DROP TABLE IF EXISTS cms_sections CASCADE;
DROP TABLE IF EXISTS cms_pages CASCADE;
DROP TABLE IF EXISTS marketing_leads CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS pricing_config CASCADE;

-- Puis ré-exécuter le script migration
```

### Erreur: "permission denied"
**Cause:** Compte Supabase sans droits admin  
**Solution:** Vérifier que vous êtes Owner/Admin du projet Supabase

### Bucket "media" déjà existe
**Solution:** Pas de problème, utiliser le bucket existant

### Les erreurs 400 persistent après migration
**Cause:** Cache frontend ou RLS policies trop restrictives  
**Solutions:**
1. Vider cache navigateur (Ctrl+Shift+R)
2. Redémarrer serveur dev (Ctrl+C puis npm run dev)
3. Vérifier RLS policies dans Dashboard → Authentication → Policies

---

## 📊 MÉTRIQUES DE SUCCÈS

Après exécution complète, vous devez avoir:

| Métrique | Attendu | Vérification |
|----------|---------|--------------|
| **Tables créées** | 8 | Table Editor |
| **Index créés** | 20+ | Automatique |
| **RLS Policies** | 15 | Auth → Policies |
| **Triggers** | 5 | Automatique |
| **Pricing configs** | 5 rows | SELECT * FROM pricing_config |
| **Team members** | 2 rows | SELECT * FROM team_members |
| **Bucket Storage** | 1 (media) | Storage dashboard |
| **Erreurs 400** | 0 | Console navigateur |

---

## 🎉 SUCCÈS!

Une fois ces étapes complétées, vous êtes prêt pour la **Phase 2 - Tests Complets**!

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ✅ MIGRATION SQL TERMINÉE                            │
│   ✅ STORAGE BUCKET CRÉÉ                               │
│   ✅ 8 TABLES PHASE 1 OPÉRATIONNELLES                  │
│   ✅ PRÊT POUR TESTS CMS + LEADS + BLOG + ANALYTICS   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Prochaine étape:** Suivre `PHASE_2_MIGRATION_GUIDE.md` pour tests approfondis (2h)

---

**Questions?** Les erreurs 400 que vous voyez actuellement sont normales car les tables n'existent pas encore. Elles disparaîtront après l'exécution de ce script SQL! 🚀
