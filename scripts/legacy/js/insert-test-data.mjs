import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 INSERTION DONNÉES DE TEST...\n');

async function insertTestData() {
  try {
    // 1. Insérer des profils
    console.log('👥 Insertion profils...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .insert([
        { email: 'admin@terangafoncier.sn', name: 'Admin Teranga', role: 'admin', status: 'active' },
        { email: 'vendeur1@test.com', name: 'Mamadou Diallo', role: 'vendeur', status: 'active' },
        { email: 'vendeur2@test.com', name: 'Fatou Sarr', role: 'vendeur', status: 'active' },
        { email: 'client1@test.com', name: 'Abdoulaye Ba', role: 'particulier', status: 'active' },
        { email: 'client2@test.com', name: 'Awa Ndiaye', role: 'particulier', status: 'active' },
        { email: 'notaire@test.com', name: 'Me Ousmane Fall', role: 'notaire', status: 'active' }
      ])
      .select();

    if (profilesError && !profilesError.message.includes('duplicate')) {
      console.error('❌ Erreur profils:', profilesError);
    } else {
      console.log('✅ Profils insérés:', profiles?.length || 'Certains existaient déjà');
    }

    // 2. Récupérer les IDs des vendeurs pour les terrains
    const { data: vendeurs } = await supabase
      .from('profiles')
      .select('id, email')
      .in('email', ['vendeur1@test.com', 'vendeur2@test.com']);

    if (vendeurs && vendeurs.length > 0) {
      console.log('🏞️ Insertion terrains...');
      const { data: terrains, error: terrainsError } = await supabase
        .from('terrains')
        .insert([
          {
            title: 'Terrain résidentiel Almadies',
            description: 'Terrain 300m² dans quartier résidentiel',
            price: 45000000,
            location: 'Almadies, Dakar',
            vendeur_id: vendeurs[0].id,
            status: 'available'
          },
          {
            title: 'Parcelle commerciale Plateau', 
            description: 'Emplacement commercial 500m²',
            price: 85000000,
            location: 'Plateau, Dakar',
            vendeur_id: vendeurs[0].id,
            status: 'available' 
          }
        ])
        .select();

      if (terrainsError) {
        console.error('❌ Erreur terrains:', terrainsError);
      } else {
        console.log('✅ Terrains insérés:', terrains?.length || 0);
      }
    }

    // 3. Insérer des properties
    console.log('🏢 Insertion properties...');
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .insert([
        {
          title: 'Villa moderne Fann',
          description: 'Villa 4 chambres avec jardin',
          price: 120000000,
          location: 'Fann, Dakar',
          status: 'active'
        },
        {
          title: 'Appartement standing Point E',
          description: 'Appartement 3 pièces meublé', 
          price: 75000000,
          location: 'Point E, Dakar',
          status: 'active'
        }
      ])
      .select();

    if (propertiesError && !propertiesError.message.includes('duplicate')) {
      console.error('❌ Erreur properties:', propertiesError);
    } else {
      console.log('✅ Properties insérées:', properties?.length || 0);
    }

    // 4. Insérer des support tickets
    const { data: admin } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .single();

    if (admin) {
      console.log('🎫 Insertion support tickets...');
      const { data: tickets, error: ticketsError } = await supabase
        .from('support_tickets')
        .insert([
          {
            title: 'Problème de connexion',
            description: 'Impossible de me connecter à mon compte',
            category: 'technical',
            priority: 'high',
            status: 'open',
            assigned_to: admin.id
          },
          {
            title: 'Question validation terrain',
            description: 'Combien de temps pour valider mon terrain?',
            category: 'validation',
            priority: 'medium', 
            status: 'open',
            assigned_to: admin.id
          }
        ])
        .select();

      if (ticketsError) {
        console.error('❌ Erreur tickets:', ticketsError);
      } else {
        console.log('✅ Tickets insérés:', tickets?.length || 0);
      }
    }

    // 5. Vérification finale
    console.log('\n📊 VÉRIFICATION FINALE:');
    const tables = ['profiles', 'terrains', 'properties', 'support_tickets'];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: Erreur`);
      } else {
        console.log(`✅ ${table}: ${count} entrées`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Lancer l'insertion
insertTestData()
  .then(() => {
    console.log('\n🎉 INSERTION TERMINÉE!');
    console.log('Le dashboard admin devrait maintenant afficher de vraies données.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERREUR FATALE:', err);
    process.exit(1);
  });