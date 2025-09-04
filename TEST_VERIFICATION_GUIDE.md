# 🎯 GUIDE DE VÉRIFICATION POST-DÉPLOIEMENT
## Teranga Foncier - Tests Fonctionnels

---

## ✅ CHECKLIST DE VÉRIFICATION

### 🔧 1. Base de Données
- [ ] **Ouvrir** https://app.supabase.com
- [ ] **Exécuter** le contenu de `FINAL_SECURE_FIX.sql`
- [ ] **Vérifier** que toutes les requêtes s'exécutent sans erreur
- [ ] **Contrôler** la création du bucket "avatars"
- [ ] **Valider** l'ajout des colonnes dans la table users

### 👥 2. Système d'Utilisateurs
- [ ] **Tester** la création d'un utilisateur "Particulier"
- [ ] **Vérifier** le wizard pour "Investisseur" 
- [ ] **Contrôler** le wizard pour "Promoteur"
- [ ] **Tester** l'upload d'un avatar de profil
- [ ] **Vérifier** les boutons supprimer/bannir

### 🤖 3. Interface et Chatbot
- [ ] **Vérifier** que le chatbot IA apparaît en bas à droite
- [ ] **Tester** une question au chatbot
- [ ] **Contrôler** que les prix sont en FCFA
- [ ] **Vérifier** le dashboard analytics admin
- [ ] **Tester** la navigation entre les pages

---

## 🧪 TESTS FONCTIONNELS DÉTAILLÉS

### Test 1: Création d'Utilisateur Investisseur
```
1. Aller à la page admin utilisateurs
2. Cliquer sur "Ajouter un utilisateur"
3. Sélectionner le rôle "Investisseur"
4. Vérifier que le formulaire s'adapte
5. Remplir tous les champs spécialisés
6. Valider la création
```

### Test 2: Upload Avatar
```
1. Aller au profil utilisateur
2. Cliquer sur changer l'avatar
3. Sélectionner une image (JPEG/PNG)
4. Vérifier l'upload sans erreur
5. Contrôler l'affichage de l'image
```

### Test 3: Chatbot IA
```
1. Cliquer sur l'icône chat en bas à droite
2. Taper "Comment acheter un terrain ?"
3. Vérifier la réponse contextuelle
4. Tester les suggestions proposées
5. Minimiser/maximiser la fenêtre
```

### Test 4: Analytics Admin
```
1. Aller au dashboard admin
2. Vérifier les métriques en temps réel
3. Tester les filtres par période
4. Contrôler les graphiques interactifs
5. Exporter un rapport
```

---

## 🐛 DÉPANNAGE RAPIDE

### Erreur PGRST204
```sql
-- Si colonnes manquantes, exécuter:
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
```

### Bucket Avatars Manquant
```sql
-- Créer le bucket:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);
```

### Chatbot Ne S'Affiche Pas
```javascript
// Vérifier que le composant est importé dans DashboardLayout:
import AIChatbot from '@/components/AIChatbot';
```

---

## 📋 COMMANDES UTILES

### Redémarrer le serveur de développement
```bash
npm run dev
```

### Vérifier les erreurs console
```javascript
// Ouvrir F12 > Console et chercher:
// - Erreurs Supabase
// - Erreurs de composants React
// - Problèmes de réseau
```

### Tester la base de données
```sql
-- Vérifier la structure users:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users';

-- Vérifier les buckets:
SELECT * FROM storage.buckets;
```

---

## 🎯 CRITÈRES DE RÉUSSITE

### ✅ Système Opérationnel Si:
- Aucune erreur PGRST204 dans la console
- Upload d'avatar fonctionne
- Wizard utilisateur adaptatif
- Chatbot IA répond correctement
- Boutons d'actions opérationnels
- Prix affichés en FCFA
- Dashboard analytics complet

### 🚨 Intervention Requise Si:
- Erreurs répétées dans la console
- Upload d'images échoue
- Formulaires ne s'adaptent pas aux rôles
- Chatbot ne répond pas
- Boutons sans effet
- Prix en USD au lieu de FCFA

---

## 📞 CONTACT SUPPORT

En cas de problème persistant:
1. **Copier** les erreurs de la console
2. **Noter** les étapes pour reproduire
3. **Vérifier** la version des composants
4. **Tester** sur navigateur différent

**Status attendu**: 🟢 TOUS TESTS PASSÉS  
**Performance**: 🚀 OPTIMALE  
**Stabilité**: 🛡️ GARANTIE
