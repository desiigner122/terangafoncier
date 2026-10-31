🚀 GUIDE DÉPLOIEMENT VERCEL VIA DASHBOARD
===========================================

📍 VOTRE SITUATION ACTUELLE:
✅ Code poussé sur GitHub: https://github.com/desiigner122/terangafoncier
✅ Branch: main (commit 010b7864)
✅ Configuration vercel.json prête
✅ Supabase configuré

🎯 ÉTAPES DE DÉPLOIEMENT:

1. 🌐 Allez sur: https://vercel.com/dashboard

2. 🔗 Cliquez "Import Project" ou "Add New..."

3. 📦 Sélectionnez "Import Git Repository"

4. 🔍 Cherchez: "desiigner122/terangafoncier"

5. ⚙️ Configuration projet:
   - Project Name: teranga-foncier
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: dist

6. 🔧 Variables d'environnement (CRITIQUES):
   Cliquez "Environment Variables" et ajoutez:
   
   📝 VITE_SUPABASE_URL
   Valeur: https://votre-projet.supabase.co
   
   📝 VITE_SUPABASE_ANON_KEY  
   Valeur: eyJ... (votre clé Supabase)

7. 🚀 Cliquez "Deploy"

⏱️ TEMPS D'ATTENTE: 2-3 minutes

🎉 SUCCÈS ATTENDU:
Votre site sera live sur: https://teranga-foncier-xxx.vercel.app

🔍 RÉCUPÉRATION DES CLÉS SUPABASE:
1. https://supabase.com/dashboard
2. Votre projet > Settings > API
3. Copiez Project URL et anon key

⚠️ IMPORTANT:
Sans ces variables d'environnement, l'app ne pourra pas se connecter à Supabase !

📞 BESOIN D'AIDE ?
Partagez-moi l'URL de déploiement une fois terminé !
