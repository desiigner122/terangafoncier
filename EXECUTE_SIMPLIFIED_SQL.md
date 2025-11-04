# ✅ GUIDE EXÉCUTION - MESSAGING SYSTEM (SIMPLIFIÉ)

## 🎯 OBJECTIF

Exécuter le schéma SQL pour créer les tables de messagerie dans Supabase en 2 minutes.

---

## 📋 PRÉ-REQUIS

✅ Vous avez accès à Supabase  
✅ Vous avez le fichier `CREATE_MESSAGING_SYSTEM_SIMPLIFIED.sql`  
✅ Les tables `purchase_cases`, `auth.users`, `profiles` existent  

---

## 🚀 EXÉCUTION

### ÉTAPE 1: Accéder à Supabase SQL Editor

1. Allez à **[app.supabase.com](https://app.supabase.com)**
2. Sélectionnez votre projet **Teranga Foncier**
3. Dans le menu latéral, cliquez sur **SQL Editor**
4. Cliquez sur **"+ New Query"** (ou "New")

---

### ÉTAPE 2: Copier et coller le SQL

1. Ouvrir le fichier `CREATE_MESSAGING_SYSTEM_SIMPLIFIED.sql`
2. Sélectionner **tout le contenu** (Ctrl+A)
3. **Copier** (Ctrl+C)
4. Dans Supabase, **coller** (Ctrl+V) dans l'éditeur SQL

---

### ÉTAPE 3: Exécuter le SQL

1. Cliquer le bouton **"Run"** (triangle bleu ► en haut à droite)
2. ⏱️ Attendre quelques secondes...
3. 👀 Regarder les résultats

---

## ✅ RÉSULTATS ATTENDUS

Vous devriez voir un tableau affichant:

```
status
─────────────────────────────────────
Messaging system successfully deployed!

check_type
─────────────────────────────────────
Tables created:

table_name
──────────────────────────────────────
purchase_case_documents
purchase_case_messages

check_type
──────────────────────────────────────
Columns in purchase_case_messages:

column_name          data_type
──────────────────────────────────────
id                   uuid
case_id              uuid
sent_by              uuid
message              text
attachments          jsonb
read_at              timestamp with time zone
created_at           timestamp with time zone
updated_at           timestamp with time zone

check_type
──────────────────────────────────────
Indexes created:

indexname
──────────────────────────────────────
idx_case_documents_case_id
idx_case_documents_status
idx_case_documents_type
idx_case_messages_case_id
idx_case_messages_created_at
idx_case_messages_read_at
idx_case_messages_sent_by
idx_purchase_case_documents_case_type
idx_purchase_case_messages_case_created

check_type
──────────────────────────────────────
RLS Policies:

policyname                                  tablename
──────────────────────────────────────────────────────
Users can upload documents in their cases   purchase_case_documents
Users can view documents in their cases     purchase_case_documents
Users can create messages in their cases    purchase_case_messages
Users can update their message read status  purchase_case_messages
Users can view messages in their cases      purchase_case_messages
```

---

## ❌ SI ERREUR

### Erreur: `column "sent_by" does not exist`

**Cause:** La table n'a pas été créée avant les indexes.

**Solution:**
1. Exécuter les DROP au début du fichier (décommenter les lignes 10-16):
   ```sql
   DROP TRIGGER IF EXISTS case_updated_on_new_message_trigger ON purchase_case_messages;
   DROP TRIGGER IF EXISTS purchase_case_messages_updated_at_trigger ON purchase_case_messages;
   DROP FUNCTION IF EXISTS update_case_on_new_message();
   DROP FUNCTION IF EXISTS update_purchase_case_messages_updated_at();
   DROP VIEW IF EXISTS purchase_case_messages_detailed;
   DROP TABLE IF EXISTS purchase_case_documents CASCADE;
   DROP TABLE IF EXISTS purchase_case_messages CASCADE;
   ```
2. Réexécuter le SQL complet

---

### Erreur: `foreign key constraint "purchase_case_messages_case_id_fkey" violated`

**Cause:** `purchase_cases` table n'existe pas ou a un problème.

**Solution:**
```sql
-- Vérifier que la table existe
SELECT COUNT(*) FROM purchase_cases LIMIT 1;

-- Vérifier la clé primaire
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'purchase_cases' 
AND column_name = 'id';
```

---

### Erreur: `relation "auth.users" does not exist`

**Cause:** C'est normal, Supabase utilise un schéma spécial pour auth.

**Solution:** Aucune - continuer, l'erreur peut être ignorée si le reste fonctionne.

---

### Erreur: `permission denied for schema public`

**Cause:** Vous n'avez pas les permissions admin.

**Solution:** Demander à l'admin du projet d'exécuter le SQL.

---

## 🧪 VÉRIFICATION APRÈS EXÉCUTION

Copier et exécuter ces requêtes pour vérifier:

```sql
-- 1. Vérifier les tables
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'purchase_case%';

-- 2. Vérifier qu'on peut insérer
INSERT INTO purchase_case_messages 
(case_id, sent_by, message) 
VALUES (
  (SELECT id FROM purchase_cases LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1),
  'Message test'
);

-- 3. Vérifier qu'on peut lire
SELECT * FROM purchase_case_messages LIMIT 1;

-- 4. Vérifier la view
SELECT * FROM purchase_case_messages_detailed LIMIT 1;
```

---

## 📊 APRÈS LE DÉPLOIEMENT SQL

Une fois que le SQL est exécuté avec succès:

1. ✅ Frontend: Déjà prêt (composant React intégré)
2. ✅ Backend: Déjà prêt (tables créées)
3. ⏳ **Tester:** Ouvrir un dossier d'achat et cliquer sur tab "Messages"
4. ⏳ **Envoyer:** Un message test
5. ⏳ **Vérifier:** Qu'il apparaît instantanément (Realtime)

---

## 🚨 PROBLÈMES COURANTS

### "Nothing happens when I click Run"
- Attendre 5-10 secondes
- Les requêtes longues peuvent prendre du temps
- Vérifier la connexion internet

### "I can't see the results"
- Scroller vers le bas
- Les résultats peuvent être hors-écran
- Cliquer sur les onglets de résultats en bas

### "The messaging tab doesn't appear"
- Recharger la page (F5)
- Vérifier la console (F12) pour les erreurs
- Les changements Supabase prennent parfois 1-2 sec à se refléter

---

## 📞 SI TOUT ÉCHOUE

1. Vérifier que `CREATE_MESSAGING_SYSTEM_SIMPLIFIED.sql` est le bon fichier
2. Vérifier que vous exécutez dans le bon projet Supabase
3. Vérifier que vous êtes connecté en tant qu'admin
4. Essayer de réinitialiser (décommenter les DROP en début)
5. Contacter le support Supabase si c'est une erreur de permission

---

## ✅ CHECKLIST FINALE

Avant de tester le frontend:

- [ ] Exécuté le SQL dans Supabase
- [ ] Aucune erreur affichée
- [ ] Résultats montrent les tables créées
- [ ] Résultats montrent les indexes créés
- [ ] Résultats montrent les RLS policies
- [ ] Pouvez insérer un message test (requête de vérification)
- [ ] Pouvez lire les messages (SELECT * FROM purchase_case_messages)

---

**Status:** Prêt pour exécution  
**Temps estimé:** 2-3 minutes  
**Complexité:** ⭐⭐ (Simple)
