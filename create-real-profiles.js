import { supabase } from './src/lib/supabaseClient.js';

async function createRealTestProfiles() {
  console.log('🏢 TERANGA FONCIER - Création des profils de test');
  console.log('================================================');

  const profiles = [
    {
      email: 'admin.tf@gmail.com',
      first_name: 'Super',
      last_name: 'Admin',
      role: 'admin',
      phone: '+221 77 123 45 67',
      address: 'Plateau, Dakar'
    },
    {
      email: 'agent.tf@gmail.com', 
      first_name: 'Moussa',
      last_name: 'Diallo',
      role: 'agent_foncier',
      phone: '+221 77 234 56 78',
      address: 'Mermoz, Dakar'
    },
    {
      email: 'banque.tf@gmail.com',
      first_name: 'Banque',
      last_name: 'Atlantique',
      role: 'banque',
      phone: '+221 33 123 45 67',
      address: 'Avenue Pompidou, Dakar'
    },
    {
      email: 'notaire.tf@gmail.com',
      first_name: 'Maître Ousmane',
      last_name: 'Ndiaye',
      role: 'notaire', 
      phone: '+221 77 345 67 89',
      address: 'Point E, Dakar'
    },
    {
      email: 'geometre.tf@gmail.com',
      first_name: 'Ibrahima',
      last_name: 'Fall', 
      role: 'geometre',
      phone: '+221 77 456 78 90',
      address: 'Sacré-Cœur, Dakar'
    },
    {
      email: 'client.tf@gmail.com',
      first_name: 'Fatou',
      last_name: 'Sow',
      role: 'particulier',
      phone: '+221 77 567 89 01',
      address: 'Yoff, Dakar'
    },
    {
      email: 'investisseur.tf@gmail.com',
      first_name: 'Amadou',
      last_name: 'Ba',
      role: 'investisseur',
      phone: '+221 77 678 90 12',
      address: 'Almadies, Dakar'
    },
    {
      email: 'commune.tf@gmail.com',
      first_name: 'Commune',
      last_name: 'Dakar',
      role: 'commune',
      phone: '+221 33 234 56 78',
      address: 'Hôtel de Ville, Dakar'
    }
  ];

  for (const profileData of profiles) {
    console.log(`\n👤 ${profileData.role.toUpperCase()} - ${profileData.email}`);
    
    try {
      // Générer un ID unique
      const userId = crypto.randomUUID();
      
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          email: profileData.email,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          role: profileData.role,
          phone: profileData.phone,
          address: profileData.address,
          verification_status: 'verified',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'email'
        })
        .select()
        .single();

      if (profileError) {
        console.error(`❌ Erreur:`, profileError.message);
        
        // Si l'erreur est liée aux colonnes, essayons avec les colonnes de base
        if (profileError.message.includes('column')) {
          console.log('   🔄 Tentative avec colonnes de base...');
          
          const { data: simpleProfile, error: simpleError } = await supabase
            .from('user_profiles')
            .upsert({
              id: userId,
              email: profileData.email,
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              role: profileData.role
            }, {
              onConflict: 'email'
            })
            .select()
            .single();

          if (simpleError) {
            console.error(`   ❌ Erreur simple:`, simpleError.message);
          } else {
            console.log(`   ✅ Profil simple créé: ${simpleProfile.first_name} ${simpleProfile.last_name}`);
          }
        }
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
    console.error('❌ Erreur lecture profils:', error.message);
  } else {
    console.log(`✅ ${allProfiles.length} profils trouvés:`);
    allProfiles.forEach(profile => {
      console.log(`   🔹 ${profile.role}: ${profile.first_name} ${profile.last_name} (${profile.email})`);
    });
  }

  console.log('\n🔑 COMPTES DE TEST CRÉÉS !');
  console.log('============================');
  console.log('📧 Emails de test:');
  profiles.forEach(p => {
    console.log(`   ${p.role}: ${p.email} (${p.first_name} ${p.last_name})`);
  });
  
  console.log('\n🎯 PROCHAINES ÉTAPES:');
  console.log('1. ✅ Profils créés dans user_profiles');
  console.log('2. 🔄 Créer un système de connexion par email');
  console.log('3. 🏗️ Finaliser les dashboards spécialisés');
  console.log('4. 🔗 Intégrer la blockchain foncière');
}

createRealTestProfiles().catch(console.error);
