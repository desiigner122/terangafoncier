#!/usr/bin/env node
/**
 * Script pour vérifier l'état de la base de données Supabase
 * Vérifie les 3 problèmes :
 * 1. Les dossiers d'achat (purchase_cases) existent
 * 2. Les noms d'acheteurs sont présents
 * 3. Les demandes sont mises à jour côté acheteur
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY non définis dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseStatus() {
  console.log('\n🔍 VÉRIFICATION STATUS DE LA BASE DE DONNÉES\n');
  console.log('=' .repeat(60));

  try {
    // 1. Vérifier les purchase_cases
    console.log('\n📋 VÉRIFICATION 1: Purchase Cases (Dossiers)');
    console.log('-'.repeat(60));
    
    const { data: cases, error: casesError } = await supabase
      .from('purchase_cases')
      .select('id, case_number, request_id, buyer_id, seller_id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (casesError) {
      console.error('❌ Erreur lors du chargement des purchase_cases:', casesError.message);
    } else {
      console.log(`✅ ${cases?.length || 0} dossiers trouvés`);
      if (cases && cases.length > 0) {
        console.log('\nDerniers dossiers:');
        cases.forEach(c => {
          console.log(`  - Dossier #${c.case_number} (ID: ${c.id})`);
          console.log(`    Status: ${c.status}`);
          console.log(`    Request ID: ${c.request_id}`);
          console.log(`    Buyer ID: ${c.buyer_id}`);
          console.log(`    Seller ID: ${c.seller_id}`);
          console.log(`    Créé: ${new Date(c.created_at).toLocaleString('fr-FR')}`);
        });
      } else {
        console.log('⚠️  Aucun dossier trouvé dans purchase_cases!');
      }
    }

    // 2. Vérifier les noms d'acheteurs
    console.log('\n👤 VÉRIFICATION 2: Noms d\'acheteurs');
    console.log('-'.repeat(60));

    const { data: buyers, error: buyersError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .not('first_name', 'is', null)
      .limit(10);

    if (buyersError) {
      console.error('❌ Erreur lors du chargement des profils:', buyersError.message);
    } else {
      console.log(`✅ ${buyers?.length || 0} profils avec noms trouvés`);
      if (buyers && buyers.length > 0) {
        console.log('\nPremiers acheteurs:');
        buyers.forEach(b => {
          console.log(`  - ${b.first_name} ${b.last_name} (${b.email})`);
        });
      } else {
        console.log('⚠️  Aucun profil avec nom trouvé!');
      }
    }

    // 3. Vérifier les transactions avec request_id
    console.log('\n💳 VÉRIFICATION 3: Transactions avec request_id');
    console.log('-'.repeat(60));

    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('id, request_id, buyer_id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (txError) {
      console.error('❌ Erreur lors du chargement des transactions:', txError.message);
    } else {
      console.log(`✅ ${transactions?.length || 0} transactions trouvées`);
      if (transactions && transactions.length > 0) {
        const withRequestId = transactions.filter(t => t.request_id).length;
        const withoutRequestId = transactions.length - withRequestId;
        
        console.log(`  - ${withRequestId} transactions avec request_id ✅`);
        console.log(`  - ${withoutRequestId} transactions sans request_id ⚠️`);
        
        console.log('\nDernières transactions:');
        transactions.forEach(t => {
          console.log(`  - TX: ${t.id.substring(0, 8)}...`);
          console.log(`    Request ID: ${t.request_id ? t.request_id.substring(0, 8) + '...' : '❌ MANQUANT'}`);
          console.log(`    Buyer ID: ${t.buyer_id ? t.buyer_id.substring(0, 8) + '...' : '❌ MANQUANT'}`);
          console.log(`    Status: ${t.status}`);
        });
      } else {
        console.log('⚠️  Aucune transaction trouvée!');
      }
    }

    // 4. Vérifier les requests
    console.log('\n📝 VÉRIFICATION 4: Requests (Demandes)');
    console.log('-'.repeat(60));

    const { data: requests, error: reqError } = await supabase
      .from('requests')
      .select('id, type, status, user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (reqError) {
      console.error('❌ Erreur lors du chargement des requests:', reqError.message);
    } else {
      console.log(`✅ ${requests?.length || 0} requests trouvées`);
      if (requests && requests.length > 0) {
        console.log('\nDernières requests:');
        requests.forEach(r => {
          console.log(`  - Request: ${r.id.substring(0, 8)}...`);
          console.log(`    Type: ${r.type}`);
          console.log(`    Status: ${r.status}`);
          console.log(`    User ID: ${r.user_id ? r.user_id.substring(0, 8) + '...' : 'N/A'}`);
        });
      } else {
        console.log('⚠️  Aucune request trouvée!');
      }
    }

    // 5. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ');
    console.log('='.repeat(60));
    console.log(`
✅ Connexion à Supabase: SUCCESS
📋 Purchase cases: ${cases?.length || 0} trouvées
👤 Profils avec noms: ${buyers?.length || 0} trouvés
💳 Transactions: ${transactions?.length || 0} trouvées (${transactions?.filter(t => t.request_id).length || 0} avec request_id)
📝 Requests: ${requests?.length || 0} trouvées

🎯 DIAGNOSTIQUE:
${cases?.length === 0 ? '❌ PROBLÈME: Aucun dossier créé - les demandes ne sont pas passées au statut "accepté"' : '✅ Dossiers créés'}
${buyers?.length === 0 ? '❌ PROBLÈME: Aucun profil avec nom - les acheteurs n\'ont pas renseigné leur nom' : '✅ Noms d\'acheteurs présents'}
${transactions?.length === 0 ? '❌ PROBLÈME: Aucune transaction - les demandes n\'ont pas été créées' : '✅ Transactions présentes'}
    `);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
    process.exit(1);
  }
}

checkDatabaseStatus();
