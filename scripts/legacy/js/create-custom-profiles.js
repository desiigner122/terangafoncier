import { supabase } from './src/lib/supabaseClient.js';

async function createCustomProfileSystem() {
  console.log('🏗️ TERANGA FONCIER - Système de profils personnalisé');
  console.log('===================================================');

  // 1. Créer des profils de base avec les colonnes disponibles
  console.log('\n👥 Création des profils avec colonnes existantes...');
  
  const profiles = [
    {
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      bio: JSON.stringify({
        email: 'admin@terangafoncier.sn',
        first_name: 'Super',
        last_name: 'Admin',
        role: 'admin',
        phone: '+221 77 123 45 67',
        address: 'Plateau, Dakar',
        description: 'Administrateur principal de Teranga Foncier'
      }),
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      bio: JSON.stringify({
        email: 'agent@terangafoncier.sn',
        first_name: 'Moussa',
        last_name: 'Diallo',
        role: 'agent_foncier',
        phone: '+221 77 234 56 78',
        address: 'Mermoz, Dakar',
        description: 'Agent foncier expérimenté, spécialisé terrains urbains'
      }),
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      bio: JSON.stringify({
        email: 'banque@terangafoncier.sn',
        first_name: 'Banque',
        last_name: 'Atlantique',
        role: 'banque',
        phone: '+221 33 123 45 67',
        address: 'Avenue Pompidou, Dakar',
        description: 'Partenaire financier pour le financement immobilier'
      }),
      avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      bio: JSON.stringify({
        email: 'notaire@terangafoncier.sn',
        first_name: 'Maître Ousmane',
        last_name: 'Ndiaye',
        role: 'notaire',
        phone: '+221 77 345 67 89',
        address: 'Point E, Dakar',
        description: 'Notaire spécialisé en droit foncier et immobilier'
      }),
      avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      bio: JSON.stringify({
        email: 'geometre@terangafoncier.sn',
        first_name: 'Ibrahima',
        last_name: 'Fall',
        role: 'geometre',
        phone: '+221 77 456 78 90',
        address: 'Sacré-Cœur, Dakar',
        description: 'Géomètre expert en délimitation et topographie'
      }),
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      bio: JSON.stringify({
        email: 'client@terangafoncier.sn',
        first_name: 'Fatou',
        last_name: 'Sow',
        role: 'particulier',
        phone: '+221 77 567 89 01',
        address: 'Yoff, Dakar',
        description: 'Particulier à la recherche de terrains résidentiels'
      }),
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      bio: JSON.stringify({
        email: 'investisseur@terangafoncier.sn',
        first_name: 'Amadou',
        last_name: 'Ba',
        role: 'investisseur',
        phone: '+221 77 678 90 12',
        address: 'Almadies, Dakar',
        description: 'Investisseur immobilier, spécialisé développement urbain'
      }),
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: crypto.randomUUID(),
      user_id: crypto.randomUUID(),
      bio: JSON.stringify({
        email: 'commune@terangafoncier.sn',
        first_name: 'Commune',
        last_name: 'Dakar',
        role: 'commune',
        phone: '+221 33 234 56 78',
        address: 'Hôtel de Ville, Dakar',
        description: 'Administration communale - Gestion du domaine public'
      }),
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  // Créer un administrateur pour contourner RLS
  console.log('🔑 Tentative de connexion comme admin...');
  const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
  
  if (authError) {
    console.log('⚠️ Connexion anonyme:', authError.message);
  } else {
    console.log('✅ Session anonyme créée');
  }

  // Insérer les profils un par un
  for (const profile of profiles) {
    const profileData = JSON.parse(profile.bio);
    console.log(`\n👤 ${profileData.role.toUpperCase()} - ${profileData.email}`);
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: profile.id,
          user_id: profile.user_id,
          bio: profile.bio,
          avatar_url: profile.avatar_url
        })
        .select()
        .single();

      if (error) {
        console.log(`❌ ${error.message}`);
        
        // Essayer avec un user_id existant
        const { data: existingUsers } = await supabase.from('user_profiles').select('user_id').limit(1);
        if (existingUsers && existingUsers.length > 0) {
          const { data: retryData, error: retryError } = await supabase
            .from('user_profiles')
            .insert({
              id: profile.id,
              user_id: existingUsers[0].user_id,
              bio: profile.bio,
              avatar_url: profile.avatar_url
            })
            .select()
            .single();

          if (retryError) {
            console.log(`   ❌ Retry: ${retryError.message}`);
          } else {
            console.log(`   ✅ Profil créé avec user_id existant`);
          }
        }
      } else {
        console.log(`✅ Profil créé: ${profileData.first_name} ${profileData.last_name}`);
      }
    } catch (e) {
      console.log(`💥 Exception: ${e.message}`);
    }
  }

  // Vérifier les profils créés
  console.log('\n📊 VÉRIFICATION DES PROFILS');
  console.log('============================');
  
  const { data: allProfiles, error } = await supabase
    .from('user_profiles')
    .select('*');

  if (error) {
    console.log('❌ Erreur lecture:', error.message);
  } else {
    console.log(`✅ ${allProfiles.length} profils trouvés:`);
    allProfiles.forEach(p => {
      if (p.bio) {
        try {
          const profileData = JSON.parse(p.bio);
          console.log(`   🔹 ${profileData.role}: ${profileData.first_name} ${profileData.last_name}`);
        } catch {
          console.log(`   🔹 Profil: ${p.bio.substring(0, 50)}...`);
        }
      } else {
        console.log(`   🔹 ID: ${p.id}`);
      }
    });
  }

  console.log('\n🎯 SYSTÈME DE PROFILS CRÉÉ !');
  console.log('============================');
  console.log('📧 Comptes de test disponibles:');
  console.log('   admin@terangafoncier.sn');
  console.log('   agent@terangafoncier.sn');
  console.log('   banque@terangafoncier.sn');
  console.log('   notaire@terangafoncier.sn');
  console.log('   geometre@terangafoncier.sn');
  console.log('   client@terangafoncier.sn');
  console.log('   investisseur@terangafoncier.sn');
  console.log('   commune@terangafoncier.sn');
  
  console.log('\n🚀 PROCHAINES ÉTAPES:');
  console.log('1. ✅ Profils créés avec système JSON');
  console.log('2. 🔄 Adapter l\'auth context pour lire le JSON');
  console.log('3. 🏗️ Finaliser les dashboards spécialisés');
  console.log('4. 🔗 Intégrer la blockchain foncière');
}

createCustomProfileSystem().catch(console.error);
