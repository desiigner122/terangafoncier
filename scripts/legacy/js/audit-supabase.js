#!/usr/bin/env node

// 🔍 AUDIT BASE DE DONNÉES SUPABASE EXISTANTE
// ==========================================

console.log('🔍 AUDIT DE VOTRE BASE SUPABASE EXISTANTE');
console.log('=========================================\n');

console.log('📋 **ÉTAPES D\'AUDIT :**');
console.log('======================\n');

console.log('1. 🗄️ **Vérification des tables existantes**');
console.log('   Connectez-vous à votre Supabase Dashboard');
console.log('   Allez dans Table Editor');
console.log('   Listez les tables présentes :\n');

const requiredTables = [
  'profiles (utilisateurs)',
  'properties (biens immobiliers)', 
  'favorites (favoris)',
  'requests (demandes)',
  'messages (messagerie)',
  'projects (projets promoteurs)'
];

console.log('   📝 **Tables requises pour Teranga Foncier :**');
requiredTables.forEach(table => console.log(`   • ${table}`));
console.log('');

console.log('2. 🔐 **Vérification RLS (Row Level Security)**');
console.log('   SQL à exécuter pour vérifier :');
console.log('   ```sql');
console.log('   SELECT tablename, rowsecurity FROM pg_tables');
console.log('   WHERE schemaname = \'public\';');
console.log('   ```\n');

console.log('3. 🪣 **Vérification Storage Buckets**');
console.log('   Allez dans Storage');
console.log('   Vérifiez la présence de :');
console.log('   • avatars (public)');
console.log('   • properties (public)');
console.log('   • documents (private)\n');

console.log('4. 🔑 **Vérification Authentication**');
console.log('   Allez dans Authentication > Settings');
console.log('   Vérifiez :');
console.log('   • Site URL configuré');
console.log('   • Redirect URLs configurés');
console.log('   • Email templates configurés\n');

console.log('🎯 **OPTIONS SELON VOTRE SITUATION :**');
console.log('=====================================\n');

console.log('🟢 **OPTION A : Base vide ou compatible**');
console.log('   → Exécuter le script supabase-setup.sql');
console.log('   → Aucune suppression nécessaire');
console.log('   → Migration douce\n');

console.log('🟡 **OPTION B : Base avec données importantes**');
console.log('   → Créer un script de migration');
console.log('   → Sauvegarder les données existantes');
console.log('   → Adapter le schéma\n');

console.log('🔴 **OPTION C : Base complètement différente**');
console.log('   → Créer un nouveau projet Supabase');
console.log('   → Garder l\'ancien pour référence');
console.log('   → Démarrer fresh\n');

console.log('📋 **SCRIPT DE DIAGNOSTIC RAPIDE :**');
console.log('===================================');
console.log('Exécutez ce SQL dans votre Supabase pour diagnostiquer :');
console.log('```sql');
console.log('-- Lister toutes les tables');
console.log('SELECT table_name FROM information_schema.tables');
console.log('WHERE table_schema = \'public\';');
console.log('');
console.log('-- Compter les enregistrements par table');
console.log('SELECT ');
console.log('  schemaname,');
console.log('  tablename,');
console.log('  n_tup_ins as "Total Rows"');
console.log('FROM pg_stat_user_tables');
console.log('WHERE schemaname = \'public\';');
console.log('');
console.log('-- Vérifier RLS');
console.log('SELECT tablename, rowsecurity');
console.log('FROM pg_tables WHERE schemaname = \'public\';');
console.log('```\n');

console.log('💡 **RECOMMANDATION :**');
console.log('======================');
console.log('1. Faites d\'abord le diagnostic SQL ci-dessus');
console.log('2. Partagez les résultats');
console.log('3. Je vous donnerai la stratégie optimale');
console.log('4. Pas de suppression précipitée ! 🚫\n');

console.log('🔍 **Que voyez-vous dans votre Supabase actuel ?**');
