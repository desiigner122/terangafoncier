import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createUsersAndProfiles() {
  console.log('🚀 CRÉATION UTILISATEURS + PROFILES...\n');
  
  const testUsers = [
    { email: 'admin@terangafoncier.sn', password: 'admin123', role: 'admin' },
    { email: 'vendeur@test.com', password: 'vendeur123', role: 'vendeur' },
    { email: 'client@test.com', password: 'client123', role: 'particulier' }
  ];

  for (const userData of testUsers) {
    try {
      console.log(`👤 Création utilisateur: ${userData.email}`);
      
      // 1. Créer l'utilisateur d'authentification
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            role: userData.role
          }
        }
      });

      if (authError) {
        console.log(`❌ Erreur auth pour ${userData.email}:`, authError.message);
        
        if (authError.message.includes('already registered')) {
          console.log(`ℹ️ Utilisateur ${userData.email} existe déjà`);
          
          // Essayer de se connecter pour récupérer l'ID
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password
          });
          
          if (!signInError && signInData.user) {
            console.log(`✅ Connexion réussie pour ${userData.email}, ID: ${signInData.user.id}`);
            
            // Créer/mettre à jour le profil
            await createOrUpdateProfile(signInData.user.id, userData.email, userData.role);
          }
        }
        continue;
      }

      if (authData.user) {
        console.log(`✅ Utilisateur créé: ${userData.email}, ID: ${authData.user.id}`);
        
        // 2. Créer le profil associé
        await createOrUpdateProfile(authData.user.id, userData.email, userData.role);
      }

    } catch (error) {
      console.error(`❌ Erreur générale pour ${userData.email}:`, error);
    }
    
    console.log(''); // Ligne vide pour la lisibilité
  }

  // 3. Vérifier les données créées
  console.log('📊 VÉRIFICATION FINALE...');
  
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*');

  if (profilesError) {
    console.log('❌ Erreur lecture profiles:', profilesError);
  } else {
    console.log(`✅ Profiles trouvés: ${profiles?.length || 0}`);
    if (profiles && profiles.length > 0) {
      console.log('📋 Structure découverte:', Object.keys(profiles[0]));
      profiles.forEach(p => console.log(`   - ${p.email || p.id}: ${p.role || 'pas de role'}`));
    }
  }
}

async function createOrUpdateProfile(userId, email, role) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId, 
        email: email, 
        role: role 
      })
      .select();

    if (error) {
      console.log(`❌ Erreur profile ${email}:`, error.message);
    } else {
      console.log(`✅ Profile créé/mis à jour: ${email}`);
    }
  } catch (error) {
    console.error(`❌ Erreur création profile ${email}:`, error);
  }
}

createUsersAndProfiles()
  .then(() => {
    console.log('\n🎉 PROCESSUS TERMINÉ!');
    console.log('Maintenant le dashboard admin devrait avoir de vraies données.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERREUR FATALE:', err);
    process.exit(1);
  });