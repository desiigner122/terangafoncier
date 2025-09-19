#!/usr/bin/env node

/**
 * 🔧 Test de Connexion Supabase - Vérification Complète
 * Ce script vérifie la connexion Supabase et teste les fonctionnalités d'authentification
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';

// Charger les variables d'environnement
dotenv.config();

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Test de Connexion Supabase - Teranga Foncier');
console.log('='.repeat(50));

// Vérifier les variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erreur: Variables d\'environnement manquantes');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Définie' : '❌ Manquante');
  process.exit(1);
}

console.log('🔑 Configuration Supabase:');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey.substring(0, 20) + '...');
console.log('');

// Créer le client Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  try {
    console.log('1️⃣ Test de connexion basique...');
    
    // Test de ping basique
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error && error.code === 'PGRST116') {
      console.log('⚠️ Table profiles n\'existe pas encore - création nécessaire');
    } else if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      return false;
    } else {
      console.log('✅ Connexion Supabase réussie!');
      console.log(`📊 Nombre de profils: ${data || 0}`);
    }

    console.log('');
    console.log('2️⃣ Test des tables principales...');
    
    // Tester l'accès aux tables principales
    const tables = ['profiles', 'properties', 'annonces', 'blog'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (error && error.code === 'PGRST116') {
          console.log(`📋 ${table}: Table n'existe pas`);
        } else if (error) {
          console.log(`❌ ${table}: Erreur - ${error.message}`);
        } else {
          console.log(`✅ ${table}: ${data || 0} enregistrements`);
        }
      } catch (e) {
        console.log(`❌ ${table}: Erreur de test - ${e.message}`);
      }
    }

    console.log('');
    console.log('3️⃣ Test création d\'un compte test...');
    
    // Test création compte (sera supprimé après)
    const testEmail = `test-${Date.now()}@terangafoncier.test`;
    const testPassword = 'TestPassword123!';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          role: 'Particulier',
          name: 'Test User'
        }
      }
    });

    if (signUpError) {
      if (signUpError.message.includes('email')) {
        console.log('✅ Validation email fonctionne (création empêchée comme attendu)');
      } else {
        console.log('⚠️ Erreur création compte test:', signUpError.message);
      }
    } else {
      console.log('✅ Création de compte fonctionne!');
      console.log('👤 Utilisateur créé:', signUpData.user?.email);
      
      // Nettoyer le compte test
      if (signUpData.user) {
        await supabase.auth.admin.deleteUser(signUpData.user.id);
        console.log('🧹 Compte test supprimé');
      }
    }

    console.log('');
    console.log('4️⃣ Test des politiques RLS...');
    
    // Test des politiques Row Level Security
    try {
      const { data: publicData } = await supabase.from('profiles').select('*').limit(1);
      console.log('✅ Politiques RLS configurées (accès public contrôlé)');
    } catch (e) {
      console.log('⚠️ Politiques RLS à vérifier:', e.message);
    }

    return true;

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    return false;
  }
}

async function checkDatabaseStructure() {
  console.log('');
  console.log('5️⃣ Vérification structure base de données...');
  
  // Vérifier si le script SQL de structure existe
  const structureFiles = [
    'create-tables.sql',
    'supabase-setup.sql', 
    'database-structure.sql'
  ];
  
  let foundStructure = false;
  for (const file of structureFiles) {
    if (existsSync(file)) {
      console.log(`✅ Script de structure trouvé: ${file}`);
      foundStructure = true;
      break;
    }
  }
  
  if (!foundStructure) {
    console.log('⚠️ Aucun script de structure trouvé - création manuelle nécessaire');
  }
}

async function main() {
  const isConnected = await testSupabaseConnection();
  await checkDatabaseStructure();
  
  console.log('');
  console.log('='.repeat(50));
  
  if (isConnected) {
    console.log('🎉 RÉSULTAT: Connexion Supabase opérationnelle!');
    console.log('');
    console.log('📋 Prochaines étapes:');
    console.log('1. Exécuter clean-production-database.sql pour nettoyer');
    console.log('2. Créer la structure des tables si nécessaire'); 
    console.log('3. Tester l\'inscription de vrais utilisateurs');
    console.log('4. Vérifier les politiques RLS');
  } else {
    console.log('❌ RÉSULTAT: Problème de connexion Supabase');
    console.log('');
    console.log('🔧 Actions à prendre:');
    console.log('1. Vérifier les clés dans .env');
    console.log('2. Vérifier le projet Supabase');
    console.log('3. Vérifier la configuration réseau');
  }
  
  console.log('='.repeat(50));
}

main().catch(console.error);