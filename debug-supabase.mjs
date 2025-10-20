#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY2MzMwNCwiZXhwIjoyMDcyMjM5MzA0fQ._mFhSg4VDhnUE8ctKLEHpYkafpBqsbnZCzvX9JwtP0c';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function diagnoseProfileIssue() {
  console.log('🔍 DIAGNOSTIC COMPLET - Problème de profil vendeur\n');
  console.log('='.repeat(60) + '\n');

  try {
    // 1️⃣ Vérifier les propriétés
    console.log('📋 1. Récupération des propriétés actives...');
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('id, title, owner_id, status, verification_status, created_at')
      .eq('status', 'active')
      .eq('verification_status', 'verified')
      .order('created_at', { ascending: false })
      .limit(10);

    if (propertiesError) {
      console.error('❌ Erreur propriétés:', propertiesError.message);
      return;
    }

    console.log(`✅ ${properties.length} propriété(s) trouvée(s)\n`);
    properties.forEach((p, i) => {
      console.log(`   [${i + 1}] ${p.title}`);
      console.log(`       ID: ${p.id}`);
      console.log(`       Owner ID: ${p.owner_id}`);
    });

    // 2️⃣ Récupérer les IDs des propriétaires
    const ownerIds = [...new Set(properties.map(p => p.owner_id).filter(Boolean))];
    console.log(`\n🔑 ${ownerIds.length} propriétaire(s) unique(s) identifié(s):`);
    ownerIds.forEach(id => console.log(`   - ${id}`));

    // 3️⃣ Vérifier si les profils existent
    console.log('\n👤 2. Recherche des profils correspondants...');
    if (ownerIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .in('id', ownerIds);

      if (profilesError) {
        console.error('❌ Erreur profils:', profilesError.message);
        return;
      }

      console.log(`✅ ${profiles.length} profil(s) trouvé(s)\n`);
      profiles.forEach((p, i) => {
        console.log(`   [${i + 1}] ${p.full_name}`);
        console.log(`       ID: ${p.id}`);
        console.log(`       Email: ${p.email}`);
        console.log(`       Rôle: ${p.role}`);
      });

      // 4️⃣ Identifier les propriétaires manquants
      console.log('\n⚠️  3. Analyse: Propriétaires manquants...');
      const profileIds = profiles.map(p => p.id);
      const missingIds = ownerIds.filter(id => !profileIds.includes(id));
      
      if (missingIds.length > 0) {
        console.log(`❌ ${missingIds.length} propriétaire(s) MANQUANT(S) dans la table profiles:`);
        missingIds.forEach(id => {
          const prop = properties.find(p => p.owner_id === id);
          console.log(`   - ${id} (lié à: "${prop.title}")`);
        });
      } else {
        console.log('✅ Tous les propriétaires existent dans la table profiles');
      }

      // 5️⃣ Tester une requête directe de profil
      if (ownerIds.length > 0) {
        console.log('\n🧪 4. Test de requête directe de profil...');
        const testId = ownerIds[0];
        const testProperty = properties.find(p => p.owner_id === testId);
        console.log(`   Test avec: ${testProperty.title} (owner_id: ${testId})\n`);
        
        const { data: singleProfile, error: singleError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', testId)
          .single();

        if (singleError) {
          console.error(`   ❌ Erreur requête: ${singleError.message}`);
        } else {
          console.log('   ✅ Profil récupéré avec succès:');
          console.log(`       Nom: ${singleProfile.full_name}`);
          console.log(`       Email: ${singleProfile.email}`);
          console.log(`       Téléphone: ${singleProfile.phone || 'N/A'}`);
          console.log(`       Bio: ${singleProfile.bio || 'N/A'}`);
          console.log(`       Rôle: ${singleProfile.role}`);
        }
      }

      // 6️⃣ Vérifier les règles RLS
      console.log('\n🔐 5. Vérification des permissions RLS...');
      console.log('   Service role utilisé = accès complet aux données');
      console.log('   ✅ Les requêtes en lecture devraient fonctionner');

    } else {
      console.log('⚠️  Aucune propriété active trouvée pour le diagnostic');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Diagnostic terminé\n');

  } catch (error) {
    console.error('\n❌ Erreur générale:', error.message);
    console.error(error);
  }
}

diagnoseProfileIssue();
