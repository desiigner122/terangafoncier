#!/usr/bin/env node

/**
 * Diagnostic: Vérifier quels propriétaires ont des profils
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Diagnostic: Propriétaires vs Profils\n');

try {
  // Charger toutes les propriétés avec leurs IDs propriétaires
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select('id, title, owner_id')
    .limit(10);
  
  if (propError) {
    console.error('❌ Erreur:', propError);
    process.exit(1);
  }
  
  console.log(`📍 ${properties.length} propriétés trouvées:\n`);
  
  // Pour chaque propriété, chercher son profil
  for (const prop of properties) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('id', prop.owner_id)
      .single();
    
    if (profile) {
      console.log(`✅ ${prop.title}`);
      console.log(`   Propriétaire: ${profile.full_name}`);
      console.log(`   Email: ${profile.email}\n`);
    } else {
      console.log(`❌ ${prop.title}`);
      console.log(`   ⚠️  PROFIL MANQUANT pour owner_id: ${prop.owner_id}\n`);
    }
  }
  
  // Vérifier les profils existants
  console.log('\n📋 Profils existants dans la base:\n');
  
  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('id, full_name, email, role');
  
  if (!profError && profiles) {
    console.log(`Total: ${profiles.length} profils\n`);
    profiles.slice(0, 5).forEach(p => {
      console.log(`${p.full_name} (${p.role}) - ${p.id}`);
    });
    if (profiles.length > 5) {
      console.log(`... et ${profiles.length - 5} autres`);
    }
  }
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
