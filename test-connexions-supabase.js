// ======================================================================
// TEST DE CONNEXION SUPABASE - TOUS LES COMPTES
// Script Node.js pour tester la connexion de tous les comptes
// ======================================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { pathToFileURL } from 'url';

// ⚠️  REMPLACEZ PAR VOS VRAIES VALEURS SUPABASE
const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Liste de tous les comptes à tester
const COMPTES_A_TESTER = [
    // ADMIN
    { email: 'admin@terangafoncier.sn', password: 'password123', role: 'admin', nom: 'Administrateur Système' },
    { email: 'test.admin@terangafoncier.sn', password: 'password123', role: 'Admin', nom: 'Test Admin' },
    
    // PARTICULIERS
    { email: 'family.diallo@teranga-foncier.sn', password: 'password123', role: 'particulier', nom: 'Famille Diallo' },
    { email: 'ahmadou.ba@teranga-foncier.sn', password: 'password123', role: 'particulier', nom: 'Ahmadou Ba' },
    
    // VENDEURS
    { email: 'heritage.fall@teranga-foncier.sn', password: 'password123', role: 'vendeur', nom: 'Héritage Fall' },
    { email: 'domaine.seck@teranga-foncier.sn', password: 'password123', role: 'vendeur', nom: 'Domaine Seck' },
    
    // PROMOTEURS
    { email: 'urban.developers@teranga-foncier.sn', password: 'password123', role: 'promoteur', nom: 'Urban Developers Sénégal' },
    { email: 'sahel.construction@teranga-foncier.sn', password: 'password123', role: 'promoteur', nom: 'Sahel Construction' },
    
    // BANQUES
    { email: 'financement.boa@teranga-foncier.sn', password: 'password123', role: 'banque', nom: 'BOA Sénégal - Financement' },
    { email: 'credit.agricole@teranga-foncier.sn', password: 'password123', role: 'banque', nom: 'Crédit Agricole Sénégal' },
    
    // NOTAIRES
    { email: 'etude.diouf@teranga-foncier.sn', password: 'password123', role: 'notaire', nom: 'Étude Notariale Diouf' },
    { email: 'chambre.notaires@teranga-foncier.sn', password: 'password123', role: 'notaire', nom: 'Chambre des Notaires' },
    
    // AGENTS FONCIERS
    { email: 'foncier.expert@teranga-foncier.sn', password: 'password123', role: 'agent_foncier', nom: 'Foncier Expert Conseil' },
    { email: 'teranga.immobilier@teranga-foncier.sn', password: 'password123', role: 'agent_foncier', nom: 'Teranga Immobilier' },
    
    // GÉOMÈTRES
    { email: 'geowest.africa@teranga-foncier.sn', password: 'password123', role: 'geometre', nom: 'GeoWest Africa SARL' },
    { email: 'cabinet.ndiaye@teranga-foncier.sn', password: 'password123', role: 'geometre', nom: 'Cabinet Géomètre Ndiaye & Associés' },
    
    // INVESTISSEURS
    { email: 'atlantique.capital@teranga-foncier.sn', password: 'password123', role: 'investisseur', nom: 'Atlantique Capital Partners' },
    { email: 'fonds.souverain@teranga-foncier.sn', password: 'password123', role: 'investisseur', nom: 'Fonds Souverain d\'Investissement du Sénégal' },
    
    // MAIRIES
    { email: 'mairie.thies@teranga-foncier.sn', password: 'password123', role: 'mairie', nom: 'Mairie de Thiès' },
    { email: 'mairie.dakar@teranga-foncier.sn', password: 'password123', role: 'mairie', nom: 'Mairie de Dakar' }
];

// Fonction pour tester une connexion
async function testerConnexion(compte) {
    try {
        console.log(`🔄 Test: ${compte.email} (${compte.role})`);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: compte.email,
            password: compte.password,
        });

        if (error) {
            console.log(`❌ ÉCHEC: ${compte.email}`);
            console.log(`   Erreur: ${error.message}`);
            return {
                email: compte.email,
                nom: compte.nom,
                role: compte.role,
                status: 'ÉCHEC',
                erreur: error.message
            };
        }

        if (data.user) {
            console.log(`✅ SUCCÈS: ${compte.email}`);
            console.log(`   User ID: ${data.user.id}`);
            console.log(`   Email confirmé: ${data.user.email_confirmed_at ? 'OUI' : 'NON'}`);
            
            // Déconnexion immédiate
            await supabase.auth.signOut();
            
            return {
                email: compte.email,
                nom: compte.nom,
                role: compte.role,
                status: 'SUCCÈS',
                user_id: data.user.id,
                email_confirme: data.user.email_confirmed_at ? 'OUI' : 'NON'
            };
        }

        return {
            email: compte.email,
            nom: compte.nom,
            role: compte.role,
            status: 'ÉCHEC',
            erreur: 'Aucun utilisateur retourné'
        };

    } catch (error) {
        console.log(`💥 ERREUR: ${compte.email}`);
        console.log(`   Exception: ${error.message}`);
        return {
            email: compte.email,
            nom: compte.nom,
            role: compte.role,
            status: 'ERREUR',
            erreur: error.message
        };
    }
}

// Fonction principale
async function testerTousLesComptes() {
    console.log('🚀 DÉBUT DU TEST DE CONNEXION SUPABASE');
    console.log('=' .repeat(60));
    
    const resultats = [];
    let succes = 0;
    let echecs = 0;
    
    // Test séquentiel pour éviter la surcharge
    for (const compte of COMPTES_A_TESTER) {
        const resultat = await testerConnexion(compte);
        resultats.push(resultat);
        
        if (resultat.status === 'SUCCÈS') {
            succes++;
        } else {
            echecs++;
        }
        
        // Pause entre les tests
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RÉSUMÉ DES TESTS');
    console.log('=' .repeat(60));
    
    console.log(`✅ Connexions réussies: ${succes}/${COMPTES_A_TESTER.length}`);
    console.log(`❌ Connexions échouées: ${echecs}/${COMPTES_A_TESTER.length}`);
    
    if (echecs > 0) {
        console.log('\n❌ COMPTES EN ÉCHEC:');
        resultats.filter(r => r.status !== 'SUCCÈS').forEach(r => {
            console.log(`   • ${r.email} (${r.role}): ${r.erreur}`);
        });
    }
    
    console.log('\n✅ COMPTES FONCTIONNELS:');
    resultats.filter(r => r.status === 'SUCCÈS').forEach(r => {
        console.log(`   • ${r.email} (${r.role}) - Email confirmé: ${r.email_confirme}`);
    });
    
    // Sauvegarde des résultats
    const rapport = {
        timestamp: new Date().toISOString(),
        total_testes: COMPTES_A_TESTER.length,
        succes: succes,
        echecs: echecs,
        pourcentage_reussite: Math.round((succes / COMPTES_A_TESTER.length) * 100),
        resultats: resultats
    };
    
    fs.writeFileSync('rapport-test-connexions.json', JSON.stringify(rapport, null, 2));
    console.log('\n📄 Rapport détaillé sauvegardé dans: rapport-test-connexions.json');
    
    return rapport;
}

// Instructions d'utilisation
console.log('🔧 CONFIGURATION REQUISE:');
console.log('1. Installez les dépendances: npm install @supabase/supabase-js');
console.log('2. Modifiez SUPABASE_URL et SUPABASE_ANON_KEY dans ce fichier');
console.log('3. Exécutez: node test-connexions-supabase.js');
console.log('');

// Vérification de la configuration
if (SUPABASE_URL.includes('votre-projet') || SUPABASE_ANON_KEY.includes('votre-anon-key')) {
    console.log('⚠️  ATTENTION: Vous devez configurer SUPABASE_URL et SUPABASE_ANON_KEY');
    console.log('   Récupérez ces valeurs depuis votre Dashboard Supabase > Settings > API');
    process.exit(1);
}

// Exécution si ce script est lancé directement
// Note: En ES modules, on utilise import.meta.url pour détecter si c'est le module principal
const isMainModule = import.meta.url.startsWith('file:') && import.meta.url === pathToFileURL(process.argv[1]).href;

// On lance toujours le test pour simplifier
console.log('🚀 DÉBUT DU TEST DE CONNEXION SUPABASE');

testerTousLesComptes()
    .then(rapport => {
        console.log(`\n🎯 TEST TERMINÉ: ${rapport.pourcentage_reussite}% de réussite`);
        process.exit(rapport.echecs > 0 ? 1 : 0);
    })
    .catch(error => {
        console.error('💥 ERREUR FATALE:', error);
        process.exit(1);
    });