import { supabase } from './src/lib/supabaseClient.js';

async function createTestUsers() {
  console.log('🏢 TERANGA FONCIER - Création des comptes de test');
  console.log('================================================');

  const users = [
    {
      email: 'admin.tf@gmail.com',
      password: 'TerrangaAdmin2024!',
      role: 'admin',
      first_name: 'Super',
      last_name: 'Admin',
      description: 'Administrateur principal'
    },
    {
      email: 'agent.tf@gmail.com', 
      password: 'TerrangaAgent2024!',
      role: 'agent_foncier',
      first_name: 'Moussa',
      last_name: 'Diallo',
      description: 'Agent foncier certifié'
    },
    {
      email: 'banque.tf@gmail.com',
      password: 'TerrangaBank2024!', 
      role: 'banque',
      first_name: 'Banque',
      last_name: 'Atlantique',
      description: 'Institution financière'
    },
    {
      email: 'notaire.tf@gmail.com',
      password: 'TerrangaNotaire2024!',
      role: 'notaire', 
      first_name: 'Maître',
      last_name: 'Ndiaye',
      description: 'Notaire certifié'
    },
    {
      email: 'geometre.tf@gmail.com',
      password: 'TerrangaGeo2024!',
      role: 'geometre',
      first_name: 'Ibrahima',
      last_name: 'Fall', 
      description: 'Géomètre expert'
    },
    {
      email: 'client.tf@gmail.com',
      password: 'TerrangaClient2024!',
      role: 'particulier',
      first_name: 'Fatou',
      last_name: 'Sow',
      description: 'Client particulier'
    }
  ];

  for (const userData of users) {
    console.log(`\n👤 ${userData.role.toUpperCase()} - ${userData.email}`);
    
    try {
      // Créer directement le profil avec un ID simulé
      const userId = `user_${userData.role}_${Date.now()}`;
      
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          role: userData.role,
          verification_status: 'verified',
          description: userData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (profileError) {
        console.error(`❌ Erreur:`, profileError.message);
      } else {
        console.log(`✅ Profil créé: ${profile.first_name} ${profile.last_name}`);
      }

    } catch (error) {
      console.error(`💥 Exception:`, error.message);
    }
  }

  // Vérifier les profils créés
  console.log('\n📊 VÉRIFICATION DES PROFILS CRÉÉS');
  console.log('==================================');
  
  const { data: allProfiles, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Erreur lecture profils:', error);
  } else {
    console.log(`✅ ${allProfiles.length} profils trouvés:`);
    allProfiles.forEach(profile => {
      console.log(`   🔹 ${profile.role}: ${profile.first_name} ${profile.last_name} (${profile.email})`);
    });
  }

  console.log('\n🎉 COMPTES DE TEST PRÊTS !');
  console.log('Vous pouvez maintenant tester les différents rôles.');
}

createTestUsers().catch(console.error);
