#!/usr/bin/env node

// Script de test rapide pour vérifier la connexion Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Test de connexion Supabase...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Présent' : '❌ Manquant');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Présent' : '❌ Manquant');
  process.exit(1);
}

console.log('📡 URL Supabase:', supabaseUrl);
console.log('🔑 Clé anonyme:', supabaseAnonKey.substring(0, 20) + '...');

// Créer le client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n🔄 Test de connexion...');

    // Tester la connexion en récupérant les tables
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      if (error.message.includes('Could not find the table')) {
        console.log('💡 La table "users" n\'existe pas dans ce projet Supabase');
        console.log('🔧 Vérifiez que vous utilisez le bon projet Supabase');
      }
      return false;
    }

    console.log('✅ Connexion réussie !');
    console.log('📊 Nombre d\'utilisateurs:', data);

    return true;
  } catch (err) {
    console.error('❌ Erreur inattendue:', err.message);
    return false;
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Test réussi ! Votre configuration locale est correcte.');
    console.log('📝 Si l\'application déployée ne fonctionne pas, mettez à jour les variables Vercel.');
  } else {
    console.log('\n⚠️  Test échoué. Vérifiez votre configuration Supabase.');
  }
  process.exit(success ? 0 : 1);
});
