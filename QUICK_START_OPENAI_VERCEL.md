# ⚡ Configuration OpenAI sur Vercel - Guide Express

## 🎯 Objectif
Activer l'Intelligence Artificielle en production en 5 minutes.

---

## 📋 Étape 1 : Obtenir la Clé OpenAI (2 min)

### 1.1 Créer un Compte OpenAI
👉 https://platform.openai.com/signup

### 1.2 Obtenir la Clé API
1. Aller sur : **https://platform.openai.com/api-keys**
2. Cliquer sur **"Create new secret key"**
3. Donner un nom : `Teranga Foncier Production`
4. **Copier la clé** (commence par `sk-proj-`)
   
   ```
   sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

   ⚠️ **Vous ne pourrez plus la revoir !** Sauvegardez-la temporairement.

### 1.3 Ajouter des Crédits (Obligatoire)
1. Aller sur : **https://platform.openai.com/account/billing**
2. Cliquer sur **"Add payment method"**
3. Ajouter une carte de crédit
4. Ajouter des crédits : **$10 minimum recommandé**
5. Définir **Usage Limit** : $20/mois (pour commencer)

**💰 Coût estimé** : 
- 100 analyses IA = ~$3
- 1000 messages chatbot = ~$5
- Budget recommandé : $10-20/mois

---

## 🚀 Étape 2 : Configurer sur Vercel (2 min)

### 2.1 Accéder au Dashboard Vercel
👉 https://vercel.com/dashboard

### 2.2 Sélectionner le Projet
Cliquer sur **`terangafoncier`**

### 2.3 Aller dans Settings
Cliquer sur **Settings** ⚙️ (en haut à droite)

### 2.4 Ajouter la Variable d'Environnement
1. Dans le menu latéral gauche, cliquer sur **"Environment Variables"**
2. Cliquer sur **"Add New"**
3. Remplir le formulaire :

   ```
   Name (Key):
   VITE_OPENAI_API_KEY

   Value:
   sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   (coller votre clé OpenAI)

   Environments:
   ☑️ Production
   ☑️ Preview
   ☑️ Development
   ```

4. Cliquer sur **"Save"**

### 2.5 Vérifier la Configuration
La variable devrait apparaître dans la liste avec :
- 🔒 Valeur masquée (sécurité)
- ✅ 3 environnements sélectionnés

---

## 🔄 Étape 3 : Redéployer l'Application (1 min)

### Option A : Redéploiement Manuel (Rapide)
1. Dans Vercel, aller sur l'onglet **"Deployments"**
2. Cliquer sur le dernier déploiement (le plus récent)
3. Cliquer sur **"⋯" (trois points)** en haut à droite
4. Sélectionner **"Redeploy"**
5. Cocher **"Use existing Build Cache"** (optionnel)
6. Cliquer sur **"Redeploy"**

⏱️ Attendre 1-2 minutes que le déploiement se termine

### Option B : Push Git (Automatique)
```bash
# Dans votre terminal local
git add .
git commit -m "config: activate OpenAI in production"
git push
```

Le déploiement se fera automatiquement.

---

## ✅ Étape 4 : Vérifier que ça Fonctionne (2 min)

### 4.1 Vérifier les Logs Vercel
1. Dans Vercel, onglet **"Deployments"**
2. Cliquer sur le dernier déploiement
3. Cliquer sur **"Runtime Logs"**
4. Chercher dans les logs :
   ```
   ✅ Clé API OpenAI détectée
   ```

### 4.2 Tester sur le Site en Production
1. Ouvrir votre site : `https://votre-app.vercel.app`
2. Se connecter en tant que **Vendeur**
3. Aller dans **Dashboard Vendeur**
4. Cliquer sur **"Analyses IA"** dans le menu
5. Tester une fonctionnalité IA :
   - **Analyser une Propriété**
   - **Générer une Description**
   - **Poser une question au Chatbot**

### 4.3 Vérifier dans la Console
1. Ouvrir DevTools (F12)
2. Onglet **Console**
3. Chercher :
   ```
   ✅ Clé API OpenAI configurée avec succès
   ```

   ❌ Si vous voyez :
   ```
   ⚠️ Mode simulation actif
   ```
   → Recommencer l'étape 2

---

## 🎉 Félicitations !

L'Intelligence Artificielle est maintenant **ACTIVE en PRODUCTION** ! 🚀

### Ce qui fonctionne maintenant :
- ✅ Analyses automatiques de propriétés
- ✅ Génération de descriptions optimisées
- ✅ Estimations de prix par IA
- ✅ Chatbot intelligent GPT-4
- ✅ Recommandations personnalisées

---

## 🐛 Dépannage Rapide

### Problème 1 : "Invalid API Key" (401 Error)
**Solutions** :
- Vérifier que la clé commence par `sk-proj-` ou `sk-`
- Vérifier qu'il n'y a pas d'espaces avant/après
- Régénérer une nouvelle clé sur OpenAI Platform
- Vérifier que vous avez ajouté des crédits

### Problème 2 : "Mode simulation" encore actif
**Solutions** :
- Vérifier le nom de la variable : `VITE_OPENAI_API_KEY` (exact)
- Forcer un redéploiement **SANS cache** :
  ```
  Vercel → Deployments → Redeploy → Décocher "Use existing Build Cache"
  ```
- Attendre 2-3 minutes après le déploiement

### Problème 3 : "Insufficient Quota" (429 Error)
**Solutions** :
- Ajouter plus de crédits sur OpenAI Platform
- Vérifier le usage limit défini
- Voir votre utilisation : https://platform.openai.com/account/usage

### Problème 4 : Coûts trop élevés
**Solutions** :
1. **Passer à GPT-3.5** (beaucoup moins cher) :
   ```javascript
   // Modifier src/services/ai/OpenAIService.js ligne ~13
   this.model = 'gpt-3.5-turbo'; // Au lieu de 'gpt-4-turbo-preview'
   ```
2. **Définir des limites** sur OpenAI Platform :
   - Settings → Usage limits → $20/mois
3. **Monitorer** l'utilisation chaque semaine

---

## 💡 Conseils de Production

### 1. Sécurité
- ✅ Ne JAMAIS partager votre clé API
- ✅ Ne JAMAIS commit la clé dans Git
- ✅ Régénérer la clé tous les 3 mois
- ✅ Utiliser des clés différentes dev/prod

### 2. Coûts
- 📊 Surveiller l'utilisation : https://platform.openai.com/account/usage
- 💰 Définir des alertes à 50% et 80% du budget
- 🔔 Configurer des notifications email
- 📉 Optimiser les prompts pour réduire les tokens

### 3. Performance
- ⚡ Mettre en cache les réponses fréquentes
- 🚀 Utiliser GPT-3.5 pour tâches simples
- 💾 Stocker les résultats dans Supabase
- 🔄 Limiter les requêtes par utilisateur

---

## 📞 Support

**Besoin d'aide ?**
- 📖 Guide complet : `CONFIGURATION_VERCEL_OPENAI.md`
- 🌐 OpenAI Support : https://help.openai.com/
- 🚀 Vercel Support : https://vercel.com/support
- 📧 Email : support@terangafoncier.com

---

## 📊 Checklist Finale

Vérifiez que tout est OK :

- [ ] ✅ Clé OpenAI obtenue (commence par `sk-proj-`)
- [ ] 💳 Crédits ajoutés sur OpenAI ($10 min)
- [ ] 🔧 Variable `VITE_OPENAI_API_KEY` ajoutée sur Vercel
- [ ] 🚀 Application redéployée
- [ ] ✅ Logs montrent "Clé API OpenAI détectée"
- [ ] 🧪 Test fonctionnel OK (analyse IA marche)
- [ ] 🔔 Alertes de budget configurées
- [ ] 📊 Monitoring actif

---

**✨ C'est tout ! L'IA est maintenant active en production !**

**⏱️ Temps total : ~5-10 minutes**

**🎯 Prochaine étape** : Tester toutes les fonctionnalités IA et ajuster le budget selon l'usage réel.
