# 📋 INSTRUCTIONS - Migration SQL Supabase

## 🎯 OBJECTIF
Exécuter les migrations SQL pour corriger les tables manquantes et ajouter les colonnes nécessaires.

## ⚙️ ÉTAPES À SUIVRE

### 1️⃣ Ouvrir Supabase
```
URL: https://supabase.com
Projet: terangafoncier (vérifier dans votre dashboard)
```

### 2️⃣ Accéder à l'éditeur SQL
```
Dashboard Supabase → SQL Editor (gauche) → New Query
```

### 3️⃣ Copier le script SQL
Fichier à utiliser: **`FIX_MISSING_COLUMNS_COMPLETE.sql`**

**Localisation:**
```
c:\Users\Smart Business\Desktop\terangafoncier\
└── FIX_MISSING_COLUMNS_COMPLETE.sql
```

### 4️⃣ Exécuter le script
```sql
-- Copier TOUT le contenu de FIX_MISSING_COLUMNS_COMPLETE.sql
-- Coller dans Supabase SQL Editor
-- Cliquer sur "Run"
```

### 5️⃣ Vérifier les résultats
Après exécution, vous devriez voir:

```
✓ CRÉÉ: Table subscriptions
✓ CRÉÉ: Table payment_transactions
✓ CRÉÉ: Table analytics_views
✓ MODIFIÉ: Table profiles (colonnes address, city, bio, company_name)
✓ MODIFIÉ: Table properties (colonne view_count)
✓ CRÉÉ: Trigger update_property_view_count
✓ CRÉÉ: RLS Policies (6 policies)
✓ CRÉÉ: Indexes
```

---

## 🔍 CONTENU DU SCRIPT

Le fichier `FIX_MISSING_COLUMNS_COMPLETE.sql` contient:

### Tables créées:
- **subscriptions** (user_id, plan_name, status, amount_monthly, etc.)
- **payment_transactions** (user_id, plan_name, amount, status, stripe_session_id)
- **analytics_views** (property_id, viewer_id, view_timestamp, etc.)

### Colonnes ajoutées:
- **profiles**: address, city, bio, company_name
- **properties**: view_count

### Fonctions et triggers:
- Trigger: `update_property_view_count` (incrémente view_count)

### RLS Policies:
- 6 policies pour contrôle d'accès utilisateur

### Indexes:
- Index sur analytics_views(property_id)
- Index sur analytics_views(view_timestamp)

---

## ⚠️ ATTENTION IMPORTANTE

### Avant d'exécuter:
1. ✅ Vérifier que vous êtes connecté au bon projet Supabase
2. ✅ Faire une sauvegarde (Supabase offre les backups automatiques)
3. ✅ Lire le contenu du script dans le fichier SQL

### Erreurs possibles et solutions:
| Erreur | Solution |
|--------|----------|
| `relation already exists` | Les tables existent déjà (normal, le script ajoute IF NOT EXISTS) |
| `permission denied` | Vous n'avez pas les droits; demander à l'admin Supabase |
| `syntax error` | Le script a une erreur; vérifier la version du fichier |
| `timeout` | Attendre quelques minutes; Supabase traite le script |

---

## ✅ APRÈS L'EXÉCUTION

### 1. Redémarrer le dev server:
```bash
# Terminal 1 - Arrêter Vite si actif (Ctrl+C)
# Terminal 1 - Redémarrer:
cd "c:\Users\Smart Business\Desktop\terangafoncier"
npm run dev
```

### 2. Ouvrir le dashboard:
```
URL: http://localhost:5173/dashboard/vendeur
```

### 3. Tester les fonctionnalités:
- ✅ VendeurMessages: Conversations chargent (pas d'erreur PGRST200)
- ✅ VendeurSettings: Onglet Abonnement affiche les plans
- ✅ VendeurAnalytics: Statistiques views chargent

### 4. Vérifier la console:
Aucune erreur de type:
- `PGRST200`
- `PGRST204`
- `NetworkError`
- `404 Not Found`

---

## 📊 VÉRIFICATION FINALE

Après exécution, dans Supabase:

### Tables créées:
```sql
-- Vérifier dans Supabase → Database
SELECT * FROM subscriptions LIMIT 1;        -- Should exist
SELECT * FROM payment_transactions LIMIT 1;  -- Should exist
SELECT * FROM analytics_views LIMIT 1;       -- Should exist
```

### Colonnes ajoutées:
```sql
-- Vérifier dans Supabase → Database → properties
SELECT view_count FROM properties LIMIT 1;    -- Should exist

-- Vérifier dans Supabase → Database → profiles
SELECT address, city, bio FROM profiles LIMIT 1;  -- Should exist
```

---

## 🔄 EN CAS D'ERREUR

Si quelque chose ne fonctionne pas:

1. **Vérifier le fichier SQL:**
   ```bash
   cat FIX_MISSING_COLUMNS_COMPLETE.sql | head -50
   ```

2. **Chercher les erreurs:**
   - Supabase affiche les erreurs en rouge
   - Copier l'erreur exacte
   - Chercher dans la documentation Supabase

3. **Réexécuter:**
   - Corriger le problème
   - Réexécuter le script (les IF NOT EXISTS éviteront les doublons)

4. **Contacter le support:**
   - Supabase support
   - GitHub issues
   - Documentation PostgreSQL

---

## 📝 CHECKLIST

- [ ] Connecté au bon projet Supabase (terangafoncier)
- [ ] Ouvert SQL Editor dans Supabase
- [ ] Copié le contenu de FIX_MISSING_COLUMNS_COMPLETE.sql
- [ ] Collé dans l'éditeur
- [ ] Cliqué sur "Run"
- [ ] Attendu la fin d'exécution (peut prendre 1-2 minutes)
- [ ] Vérifié que pas d'erreur en rouge
- [ ] Tables subscriptions, payment_transactions, analytics_views existent
- [ ] Redémarré dev server
- [ ] Testé dashboard complet
- [ ] Pas d'erreurs PGRST200/404/NetworkError

---

**Temps estimé:** 5-10 minutes pour exécution + test
**Criticité:** 🔴 HAUTE - Bloque le fonctionnement du dashboard
**Impacts:** ✅ Corrige 80% des erreurs restantes

---

**Questions? Consultez `URGENT_FIXES_ALL_ERRORS.md` pour le diagnostic complet.**
