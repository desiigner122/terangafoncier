import { supabase } from './src/lib/supabaseClient.js';

async function createAllUserRoles() {
  console.log('🏢 TERANGA FONCIER - Création des comptes utilisateurs');
  console.log('======================================================');

  const users = [
    {
      email: 'admin@terangafoncier.com',
      password: 'TF_Admin2024!',
      role: 'admin',
      first_name: 'Super',
      last_name: 'Admin',
      description: 'Administrateur principal de la plateforme'
    },
    {
      email: 'agent@terangafoncier.com', 
      password: 'TF_Agent2024!',
      role: 'agent_foncier',
      first_name: 'Moussa',
      last_name: 'Diallo',
      description: 'Agent foncier certifié'
    },
    {
      email: 'banque@terangafoncier.com',
      password: 'TF_Bank2024!', 
      role: 'banque',
      first_name: 'Banque',
      last_name: 'Atlantique',
      description: 'Institution financière partenaire'
    },
    {
      email: 'notaire@terangafoncier.com',
      password: 'TF_Notaire2024!',
      role: 'notaire', 
      first_name: 'Maître',
      last_name: 'Ndiaye',
      description: 'Notaire certifié'
    },
    {
      email: 'geometre@terangafoncier.com',
      password: 'TF_Geo2024!',
      role: 'geometre',
      first_name: 'Ibrahima',
      last_name: 'Fall', 
      description: 'Géomètre expert'
    },
    {
      email: 'particulier@terangafoncier.com',
      password: 'TF_Client2024!',
      role: 'particulier',
      first_name: 'Fatou',
      last_name: 'Sow',
      description: 'Client particulier'
    },
    {
      email: 'investisseur@terangafoncier.com',
      password: 'TF_Invest2024!',
      role: 'investisseur', 
      first_name: 'Omar',
      last_name: 'Kane',
      description: 'Investisseur immobilier'
    },
    {
      email: 'commune@terangafoncier.com',
      password: 'TF_Commune2024!',
      role: 'commune',
      first_name: 'Maire',
      last_name: 'Dakar',
      description: 'Représentant communal'
    }
  ];

  for (const userData of users) {
    console.log(`\n👤 Création du compte: ${userData.role} - ${userData.email}`);
    
    try {
      // Tenter la connexion d'abord
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        console.log('📝 Création du nouveau compte...');
        
        // Créer le compte
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              first_name: userData.first_name,
              last_name: userData.last_name
            }
          }
        });

        if (signUpError) {
          console.error(`❌ Erreur création ${userData.role}:`, signUpError.message);
          continue;
        }

        if (authData.user) {
          console.log(`✅ Compte créé: ${authData.user.email}`);
          
          // Créer le profil
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .upsert({
              id: authData.user.id,
              email: userData.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              role: userData.role,
              verification_status: 'verified',
              description: userData.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            })
            .select()
            .single();

          if (profileError) {
            console.error(`❌ Erreur profil ${userData.role}:`, profileError.message);
          } else {
            console.log(`✅ Profil créé: ${profile.role}`);
          }
        }
      } else if (!signInError) {
        console.log(`✅ Compte existant connecté: ${signInData.user.email}`);
        
        // Vérifier/mettre à jour le profil
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            id: signInData.user.id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role,
            verification_status: 'verified',
            description: userData.description,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })
          .select()
          .single();

        if (!profileError) {
          console.log(`✅ Profil mis à jour: ${profile.role}`);
        }
      } else {
        console.error(`❌ Erreur inattendue ${userData.role}:`, signInError.message);
      }

    } catch (error) {
      console.error(`💥 Exception ${userData.role}:`, error.message);
    }
  }

  console.log('\n🎉 CRÉATION DES COMPTES TERMINÉE');
  console.log('===============================');
  console.log('📋 IDENTIFIANTS CRÉÉS:');
  console.log('');
  users.forEach(user => {
    console.log(`🔑 ${user.role.toUpperCase()}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Mot de passe: ${user.password}`);
    console.log(`   Nom: ${user.first_name} ${user.last_name}`);
    console.log('');
  });
}

createAllUserRoles().catch(console.error);
