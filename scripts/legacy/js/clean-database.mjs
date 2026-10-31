#!/usr/bin/env node

/**
 * 🧹 Nettoyage Base de Données Supabase
 * Supprime tous les comptes de test et données simulées
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🧹 Nettoyage Base de Données Supabase');
console.log('='.repeat(50));

async function cleanDatabase() {
  try {
    console.log('🔍 Vérification des données existantes...');
    
    // Compter les données avant nettoyage
    const { data: profiles } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { data: properties } = await supabase.from('properties').select('*', { count: 'exact', head: true });
    const { data: annonces } = await supabase.from('annonces').select('*', { count: 'exact', head: true });
    
    console.log('📊 Données actuelles:');
    console.log(`   • Profils: ${profiles || 0}`);
    console.log(`   • Propriétés: ${properties || 0}`);
    console.log(`   • Annonces: ${annonces || 0}`);
    
    if (profiles === 0 && properties === 0 && annonces === 0) {
      console.log('✅ Base de données déjà propre!');
      return;
    }
    
    console.log('\\n🗑️ Suppression des données de test...');
    
    // Supprimer les profils avec emails de test
    const { error: profilesError } = await supabase
      .from('profiles')
      .delete()
      .or('email.like.*test*,email.like.*demo*,email.like.*@terangafoncier.com,email.like.*simulation*');
    
    if (profilesError) {
      console.log('⚠️ Erreur suppression profils:', profilesError.message);
    } else {
      console.log('✅ Profils de test supprimés');
    }
    
    // Supprimer les propriétés de test
    const { error: propertiesError } = await supabase
      .from('properties')
      .delete()
      .or('title.like.*test*,title.like.*demo*,description.like.*test*');
    
    if (propertiesError) {
      console.log('⚠️ Erreur suppression propriétés:', propertiesError.message);
    } else {
      console.log('✅ Propriétés de test supprimées');
    }
    
    // Supprimer les annonces de test
    const { error: annoncesError } = await supabase
      .from('annonces')
      .delete()
      .or('title.like.*test*,title.like.*demo*,description.like.*simulation*');
    
    if (annoncesError) {
      console.log('⚠️ Erreur suppression annonces:', annoncesError.message);
    } else {
      console.log('✅ Annonces de test supprimées');
    }
    
    console.log('\\n📊 Vérification après nettoyage...');
    
    // Recompter
    const { data: newProfiles } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { data: newProperties } = await supabase.from('properties').select('*', { count: 'exact', head: true });
    const { data: newAnnonces } = await supabase.from('annonces').select('*', { count: 'exact', head: true });
    
    console.log('📊 Données après nettoyage:');
    console.log(`   • Profils: ${newProfiles || 0}`);
    console.log(`   • Propriétés: ${newProperties || 0}`);
    console.log(`   • Annonces: ${newAnnonces || 0}`);
    
    console.log('\\n🎉 Nettoyage terminé!');
    console.log('✅ Base de données prête pour vrais utilisateurs');
    
  } catch (error) {
    console.error('❌ Erreur nettoyage:', error.message);
  }
}

cleanDatabase();