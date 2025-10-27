# 🚨 ACTION IMMÉDIATE - Résolution Erreurs Messagerie

## ❌ Erreurs actuelles
```
{"code":"42703","message":"column \"message_count\" does not exist"}
{"code":"PGRST204","message":"Could not find the 'is_read' column"}
```

## 🎯 Solution en 2 étapes

### Étape 1: Exécuter le SQL de correction ⚠️ CRITIQUE
1. Ouvrir **Supabase** → SQL Editor
2. Copier tout le contenu de: `sql/FIX_CONVERSATION_MESSAGES_STRUCTURE.sql`
3. Coller dans SQL Editor
4. Cliquer "Run" (▶️)
5. Attendre le message: `Migration completed successfully!`

### Étape 2: Recharger la page
1. Retourner sur le dashboard vendeur
2. Appuyer sur **F5** (ou Ctrl+R)
3. Tester l'envoi d'un message

## ✅ Ce qui a été corrigé dans le code

### 1. Messagerie
- Messages persistent maintenant dans la base de données
- Plus de perte de messages au rechargement

### 2. Onglet Négociations
- Filtre corrigé: affiche les demandes avec `negotiation.status === 'pending'`
- Après avoir créé une contre-offre, elle apparaît dans l'onglet "Négociations"

### 3. Affichage prix
- Prix original barré: ~~500000 FCFA~~
- Contre-offre en orange avec badge animé
- Badge "💬 Négociation en cours" visible

## 🧪 Test après migration SQL

### Test 1: Messages
```
1. Aller dans Messages
2. Sélectionner une conversation
3. Écrire "Test message"
4. Appuyer Entrée
5. ✅ Message doit s'afficher
6. Recharger page (F5)
7. ✅ Message doit toujours être là
```

### Test 2: Négociations
```
1. Aller dans Demandes d'achat
2. Tab "En attente"
3. Cliquer "Négocier" sur une demande
4. Entrer nouveau prix (ex: 150000)
5. Soumettre
6. ✅ Toast "Contre-offre de 150000 FCFA envoyée"
7. ✅ Badge orange "Négociation en cours" apparaît
8. Cliquer sur tab "Négociations"
9. ✅ La demande doit être visible dans ce tab
```

## 📋 Fichiers SQL à exécuter (dans l'ordre)

1. **OBLIGATOIRE:** `sql/FIX_CONVERSATION_MESSAGES_STRUCTURE.sql`
2. **Recommandé:** `sql/CREATE_NEGOTIATIONS_TABLE.sql`
3. **Optionnel:** `sql/storage_documents_policies_fix.sql`

---

**Status:** ⏳ EN ATTENTE MIGRATION SQL  
**Impact:** 🔴 BLOQUE messagerie  
**Temps:** ~2 minutes pour exécuter les 3 SQL
