#!/usr/bin/env node

/**
 * Trouver où sont stockées les vraies données du vendeur
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Chercher le vrai vendeur\n');

try {
  const ownerId = '06125976-5ea1-403a-b09e-aebbe1311111';
  
  console.log(`🔎 Cherchant le vendeur avec ID: ${ownerId}\n`);
  
  // Chercher dans auth.users
  console.log('1️⃣  Vérifier auth.users...');
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  
  if (!authError && users) {
    const user = users.find(u => u.id === ownerId);
    if (user) {
      console.log('✅ Trouvé dans auth.users:');
      console.log('   ID:', user.id);
      console.log('   Email:', user.email);
      console.log('   User Metadata:', user.user_metadata);
      console.log('   App Metadata:', user.app_metadata);
    } else {
      console.log('❌ Pas trouvé dans auth.users');
    }
  }
  
  // Chercher dans toutes les tables
  console.log('\n2️⃣  Chercher dans les autres tables...\n');
  
  // Chercher dans accounts
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', ownerId)
    .limit(5);
  
  if (accounts && accounts.length > 0) {
    console.log('✅ Trouvé dans accounts:');
    console.log(JSON.stringify(accounts[0], null, 2));
  } else {
    console.log('❌ Pas trouvé dans accounts');
  }
  
  // Chercher dans users
  const { data: allUsers } = await supabase
    .from('users')
    .select('*')
    .eq('id', ownerId)
    .limit(5);
  
  if (allUsers && allUsers.length > 0) {
    console.log('\n✅ Trouvé dans users:');
    console.log(JSON.stringify(allUsers[0], null, 2));
  }
  
  // Lister toutes les tables
  console.log('\n3️⃣  Tables disponibles dans la base:\n');
  const { data: tables } = await supabase
    .query('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');
  
  if (tables) {
    console.log('Tables publiques:', tables.map(t => t.table_name).join(', '));
  }
  
  // Chercher l'owner_id dans les properties pour voir comment il est configuré
  console.log('\n4️⃣  Vérifier la propriété:\n');
  const { data: prop } = await supabase
    .from('properties')
    .select('id, title, owner_id, created_by, seller_id')
    .eq('id', '9a2dce41-8e2c-4888-b3d8-0dce41339b5a')
    .single();
  
  if (prop) {
    console.log('Propriété trouvée:');
    console.log('   Title:', prop.title);
    console.log('   owner_id:', prop.owner_id);
    console.log('   created_by:', prop.created_by);
    console.log('   seller_id:', prop.seller_id);
  }
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}
