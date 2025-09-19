import { createClient } from '@supabase/supabase-js';

// Configuration Supabase avec clé de production
const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRealUsers() {
  console.log('🔍 Analyse des comptes réels dans Teranga Foncier...\n');
  
  try {
    // Vérifier la table profiles (accessible avec RLS)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (profilesError) {
      console.log('❌ Erreur profiles:', profilesError.message);
    } else {
      console.log('👤 PROFILS UTILISATEURS:', profiles?.length || 0);
      if (profiles?.length > 0) {
        profiles.forEach((profile, index) => {
          console.log(`  ${index + 1}. ${profile.email || profile.id}`);
          console.log(`     Role: ${profile.role || 'Non défini'}`);
          console.log(`     Status: ${profile.status || 'Non défini'}`);
          console.log(`     Créé: ${profile.created_at}`);
          console.log(`     Nom: ${profile.full_name || 'Non renseigné'}`);
          console.log('     ---');
        });
      }
    }
    
    // Vérifier les demandes de terrain
    const { data: requests, error: requestsError } = await supabase
      .from('land_requests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!requestsError && requests?.length > 0) {
      console.log(`\n🏡 DEMANDES DE TERRAIN: ${requests.length}`);
      requests.slice(0, 5).forEach((request, index) => {
        console.log(`  ${index + 1}. ${request.title || 'Sans titre'}`);
        console.log(`     Utilisateur: ${request.user_id}`);
        console.log(`     Status: ${request.status || 'En attente'}`);
        console.log(`     Zone: ${request.zone || 'Non définie'}`);
        console.log('     ---');
      });
    } else {
      console.log(`\n🏡 DEMANDES DE TERRAIN: ${requests?.length || 0}`);
    }
    
    // Vérifier les favoris
    const { data: favorites, error: favError } = await supabase
      .from('favorites')
      .select('*')
      .order('created_at', { ascending: false });
      
    console.log(`\n⭐ FAVORIS: ${favorites?.length || 0}`);
    
    // Vérifier les activités utilisateur
    const { data: activities, error: actError } = await supabase
      .from('user_activities')
      .select('*')
      .order('created_at', { ascending: false });
      
    console.log(`\n📊 ACTIVITÉS UTILISATEUR: ${activities?.length || 0}`);
    
    // Résumé des données réelles
    console.log('\n' + '='.repeat(50));
    console.log('📈 RÉSUMÉ DES DONNÉES RÉELLES:');
    console.log(`   • Profils utilisateurs: ${profiles?.length || 0}`);
    console.log(`   • Demandes de terrain: ${requests?.length || 0}`);
    console.log(`   • Favoris: ${favorites?.length || 0}`);
    console.log(`   • Activités: ${activities?.length || 0}`);
    console.log('='.repeat(50));
    
    // Vérifier s'il y a un utilisateur actuellement connecté
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('\n🔐 UTILISATEUR ACTUELLEMENT CONNECTÉ:');
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Role: ${user.user_metadata?.role || 'Non défini'}`);
    } else {
      console.log('\n🔐 Aucun utilisateur connecté actuellement');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

checkRealUsers();