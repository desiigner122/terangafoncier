# 🚨 URGENT - Exécuter migration SQL maintenant

## L'application démarre mais se bloque sur les colonnes manquantes

### ERREUR:
```
PGRST204: Could not find the 'amount_monthly' column of 'subscriptions' in the schema cache
```

### CAUSE:
La table `subscriptions` existe mais n'a pas les colonnes requises.

---

## ✅ SOLUTION EN 3 ÉTAPES

### 1. Ouvrir Supabase
```
https://supabase.com → Projet: terangafoncier
```

### 2. Aller à SQL Editor
```
Dashboard → SQL Editor (gauche) → New Query
```

### 3. Copier et exécuter
**Fichier:** `FIX_MISSING_COLUMNS_COMPLETE.sql`

```bash
# Localisation:
c:\Users\Smart Business\Desktop\terangafoncier\FIX_MISSING_COLUMNS_COMPLETE.sql
```

**Puis:** Sélectionner tout → Ctrl+A → Ctrl+Shift+Enter (ou cliquer "Run")

---

## 📋 CE QUE LE SCRIPT FAIT:

✅ Ajoute colonne `amount_monthly` à `subscriptions`
✅ Ajoute toutes les colonnes requises à `subscriptions`
✅ Crée table `payment_transactions`
✅ Crée table `analytics_views`
✅ Crée triggers et policies
✅ Crée indexes

---

## ⏱️ TEMPS REQUIS:
- Exécution SQL: 2-3 minutes
- Redémarrage app: 1 minute
- Tests: 5 minutes
- **Total: 10 minutes**

---

## 🔄 APRÈS EXÉCUTION:

1. Rafraîchir l'app (F5 dans Firefox)
2. Cliquer sur "Abonnement" dans Settings
3. Vérifier que les plans s'affichent ✅
4. Pas d'erreur PGRST204 ✅

---

## ❓ QUESTIONS?

Consultez: `MIGRATION_SQL_INSTRUCTIONS.md`

**ACTION REQUISE:** Exécuter SQL dans les 5 prochaines minutes
