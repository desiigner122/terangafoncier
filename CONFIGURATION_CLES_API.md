# 🔐 CONFIGURATION CLÉS API - TERANGA FONCIER

## 📋 VARIABLES D'ENVIRONNEMENT REQUISES

### 1. **Fichier .env Local**
Copiez `.env.example` vers `.env` et configurez :

```env
VITE_SUPABASE_URL="votre_url_supabase"
VITE_SUPABASE_ANON_KEY="votre_clé_anon_supabase"
VITE_OPENAI_API_KEY="votre_clé_openai"
```

### 2. **Clé OpenAI API**
Pour activer l'IA conversationnelle :
1. Créez un compte sur https://platform.openai.com/
2. Générez une clé API
3. Ajoutez-la dans votre fichier `.env` local
4. Format : `sk-proj-...` (garde cette clé secrète)

### 3. **Configuration Supabase**
- URL et clé disponibles dans votre dashboard Supabase
- Projet : "Teranga Foncier"
- Ces clés sont publiques et peuvent être partagées

## 🚨 SÉCURITÉ

- ❌ **JAMAIS** commiter le fichier `.env` avec de vraies clés
- ✅ **TOUJOURS** utiliser `.env.example` pour les exemples
- ✅ Le fichier `.env` est ignoré par Git automatiquement

## 🎯 DÉPLOIEMENT PRODUCTION

Pour le déploiement, configurez ces variables dans :
- Vercel : Variables d'environnement
- Netlify : Environment variables  
- Docker : Secrets/ConfigMaps

---

**⚠️ Important : Gardez vos clés API secrètes et ne les partagez jamais publiquement !**
