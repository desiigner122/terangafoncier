#!/usr/bin/env node

// 🚀 CONFIGURATION VERCEL + SUPABASE
// ==================================
// Guide final pour connecter Vercel à votre Supabase

import { readFileSync } from 'fs';

console.log(`
🚀 CONFIGURATION VERCEL + SUPABASE
==================================

📍 VOUS ÊTES ICI:
✅ Plateforme Teranga Foncier construite
✅ Base Supabase migrée (ou en cours)
🎯 OBJECTIF: Déployer sur Vercel

🔗 RÉCUPÉRATION DES CLÉS SUPABASE:

1. 📊 Allez sur https://supabase.com/dashboard
2. 🎯 Sélectionnez votre projet
3. ⚙️  Cliquez sur "Settings" > "API"
4. 📋 Copiez ces 2 valeurs:

   🌐 Project URL: https://votre-projet.supabase.co
   🔑 Anon Key: eyJ... (clé publique anonyme)

🚀 DÉPLOIEMENT VERCEL:

1. 📂 Depuis ce dossier, exécutez:
   vercel

2. ❓ Questions Vercel:
   - Set up and deploy? → Y
   - Which scope? → Votre compte
   - Link to existing project? → N
   - Project name? → teranga-foncier
   - Directory? → ./
   - Override settings? → N

3. 🔧 Configuration variables:
   vercel env add VITE_SUPABASE_URL
   (collez votre Project URL)
   
   vercel env add VITE_SUPABASE_ANON_KEY
   (collez votre Anon Key)

4. 🎯 Redéploiement avec variables:
   vercel --prod

📋 CHECKLIST FINAL:

□ Supabase migration exécutée
□ Tables et politiques vérifiées
□ Variables Vercel configurées
□ Déploiement réussi
□ Site accessible en HTTPS

🎉 SUCCÈS ATTENDU:
Votre Teranga Foncier sera live sur:
https://teranga-foncier-xxx.vercel.app

🔍 VÉRIFICATIONS POST-DÉPLOIEMENT:
- Page d'accueil charge ✅
- Connexion/inscription fonctionne ✅
- Dashboards accessibles ✅
- Upload d'images fonctionne ✅

⚠️  PROBLÈME POTENTIEL:
Si erreur "Cannot connect to Supabase":
1. Vérifiez que les variables sont bien définies:
   vercel env ls
2. Redéployez:
   vercel --prod

📞 SUPPORT:
En cas de problème, partagez:
- URL de déploiement Vercel
- Messages d'erreur éventuels
- Statut de migration Supabase
`);

console.log(`
🎯 COMMANDES RAPIDES:

# Installation Vercel CLI (si nécessaire)
npm i -g vercel

# Déploiement initial
vercel

# Configuration variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Redéploiement production
vercel --prod

🎉 Teranga Foncier sera en ligne !
`);
