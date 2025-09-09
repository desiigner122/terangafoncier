#!/usr/bin/env node

// 🔄 VÉRIFICATION POST-MIGRATION SUPABASE
// =====================================
// Vérifie que votre migration s'est bien passée

import { readFileSync } from 'fs';

console.log(`
🔍 VÉRIFICATION POST-MIGRATION SUPABASE
======================================

📋 CHECKLIST DE VALIDATION:
`);

const checklistItems = [
  {
    title: "1. Tables créées",
    sql: `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'properties', 'favorites', 'requests', 'messages', 'projects');`,
    expected: "6 tables"
  },
  {
    title: "2. RLS activé",
    sql: `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('profiles', 'properties', 'favorites', 'requests', 'messages', 'projects');`,
    expected: "Toutes avec rowsecurity = true"
  },
  {
    title: "3. Politiques créées",
    sql: `SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';`,
    expected: "Minimum 15 politiques"
  },
  {
    title: "4. Index créés",
    sql: `SELECT indexname FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%';`,
    expected: "9 index personnalisés"
  },
  {
    title: "5. Triggers activés",
    sql: `SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public';`,
    expected: "4 triggers updated_at"
  },
  {
    title: "6. Storage buckets",
    sql: `SELECT id, name, public FROM storage.buckets WHERE id IN ('avatars', 'properties', 'documents');`,
    expected: "3 buckets configurés"
  },
  {
    title: "7. Politiques storage",
    sql: `SELECT policyname FROM storage.policies;`,
    expected: "7 politiques storage"
  }
];

checklistItems.forEach(item => {
  console.log(`
${item.title}:
📝 SQL à exécuter:
${item.sql}

✅ Résultat attendu: ${item.expected}
`);
});

console.log(`
🚀 ÉTAPES DE VALIDATION:

1. 📊 Ouvrez Supabase SQL Editor
2. 📋 Exécutez chaque requête SQL ci-dessus
3. ✅ Vérifiez que les résultats correspondent
4. 🎯 Si tout est OK, votre migration est réussie !

⚡ TEST RAPIDE - Exécutez cette requête pour un résumé:

SELECT 
  'Tables' as type, 
  COUNT(*) as count 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'properties', 'favorites', 'requests', 'messages', 'projects')

UNION ALL

SELECT 
  'Buckets' as type, 
  COUNT(*) as count 
FROM storage.buckets 
WHERE id IN ('avatars', 'properties', 'documents')

UNION ALL

SELECT 
  'Policies' as type, 
  COUNT(*) as count 
FROM pg_policies 
WHERE schemaname = 'public';

📊 Résultat attendu:
- Tables: 6
- Buckets: 3  
- Policies: 15+

🔗 Ensuite, configurez vos variables Vercel:
- VITE_SUPABASE_URL=votre_url_supabase
- VITE_SUPABASE_ANON_KEY=votre_clé_anonyme

🎉 Teranga Foncier sera prêt à déployer !
`);
