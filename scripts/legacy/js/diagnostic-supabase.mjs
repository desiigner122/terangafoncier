// Script de diagnostic et setup Supabase
import { supabase } from './supabase-node-client.js';

async function setupSupabase() {
  console.log('🔍 DIAGNOSTIC SUPABASE - TERANGA FONCIER');
  console.log('==========================================');
  
  try {
    // Test 1: Vérifier la connexion de base
    console.log('\n1. Test de connexion...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erreur connexion Supabase:', testError.message);
      
      if (testError.message.includes('relation "users" does not exist')) {
        console.log('\n🔧 SOLUTION: Les tables n\'existent pas encore.');
        console.log('📋 Il faut créer les tables Supabase d\'abord.');
        await createBasicTables();
      }
      return;
    }
    
    console.log('✅ Connexion Supabase OK');
    
    // Test 2: Vérifier les données existantes
    console.log('\n2. Vérification des données...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, created_at')
      .limit(10);
    
    if (usersError) {
      console.error('❌ Erreur récupération users:', usersError.message);
    } else {
      console.log(`📊 ${users.length} utilisateurs trouvés:`);
      users.forEach(u => {
        console.log(`  • ${u.email} (${u.first_name} ${u.last_name}) - ${u.created_at}`);
      });
    }
    
    // Test 3: Vérifier les propriétés
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('id, title, price, status')
      .limit(5);
    
    if (propsError) {
      console.error('❌ Erreur récupération properties:', propsError.message);
    } else {
      console.log(`🏠 ${properties.length} propriétés trouvées:`);
      properties.forEach(p => {
        console.log(`  • ${p.title} - ${p.price} XOF (${p.status})`);
      });
    }
    
    // Test 4: Vérifier les transactions
    const { data: transactions, error: transError } = await supabase
      .from('financial_transactions')
      .select('id, amount, status, type')
      .limit(5);
    
    if (transError) {
      console.error('❌ Erreur récupération transactions:', transError.message);
    } else {
      console.log(`💰 ${transactions.length} transactions trouvées:`);
      transactions.forEach(t => {
        console.log(`  • ${t.type} - ${t.amount} XOF (${t.status})`);
      });
    }
    
    // Test 5: Créer les comptes de test si nécessaire
    console.log('\n3. Vérification des comptes de test...');
    await createTestAccounts();
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

async function createBasicTables() {
  console.log('\n🔧 Création des tables de base...');
  
  // Cette fonction nécessiterait l'accès admin à Supabase
  // Pour l'instant, on montre juste le SQL nécessaire
  
  const sqlCommands = `
-- TABLES DE BASE TERANGA FONCIER

-- 1. Table users 
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  status TEXT DEFAULT 'active',
  user_type TEXT DEFAULT 'particulier',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Table properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  status TEXT DEFAULT 'active',
  owner_id UUID REFERENCES users(id),
  city TEXT,
  region TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Table financial_transactions
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  amount NUMERIC NOT NULL,
  type TEXT DEFAULT 'sale',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- 5. Policies de base (à adapter selon besoins)
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (true);
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
CREATE POLICY "Transactions viewable by involved parties" ON financial_transactions FOR SELECT USING (true);
`;

  console.log('📋 SQL à exécuter dans Supabase Dashboard:');
  console.log(sqlCommands);
}

async function createTestAccounts() {
  console.log('👥 Création des comptes de test...');
  
  const testAccounts = [
    {
      email: 'admin@teranga.com',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'Teranga',
      user_type: 'admin'
    },
    {
      email: 'vendeur@teranga.com', 
      password: 'vendeur123',
      first_name: 'Moussa',
      last_name: 'Diop',
      user_type: 'vendeur'
    },
    {
      email: 'acheteur@teranga.com',
      password: 'acheteur123', 
      first_name: 'Fatou',
      last_name: 'Sall',
      user_type: 'particulier'
    }
  ];
  
  for (const account of testAccounts) {
    console.log(`\n📝 Création compte: ${account.email}`);
    
    // Tentative de création du compte via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: account.email,
      password: account.password,
      options: {
        data: {
          first_name: account.first_name,
          last_name: account.last_name,
          user_type: account.user_type
        }
      }
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`  ✅ Compte déjà existant: ${account.email}`);
      } else {
        console.error(`  ❌ Erreur création ${account.email}:`, error.message);
      }
    } else {
      console.log(`  ✅ Compte créé: ${account.email}`);
    }
  }
}

// Exécuter le diagnostic
setupSupabase().then(() => {
  console.log('\n🎯 DIAGNOSTIC TERMINÉ');
  console.log('=====================================');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});