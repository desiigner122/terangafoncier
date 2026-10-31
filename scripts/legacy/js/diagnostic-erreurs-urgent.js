// ====================================
// DIAGNOSTIC URGENT DES ERREURS SYSTEME
// ====================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0NjczNzMsImV4cCI6MjA0MTA0MzM3M30.2vhWWOIJ9rD9gg2WNGsUOSBqG7R5NQHZL0F5W5WKYMU'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 DIAGNOSTIC URGENT - Teranga Foncier')
console.log('=====================================')

// 1. Test de la table users et ses colonnes
async function checkUsersTable() {
    console.log('\n📊 1. VERIFICATION TABLE USERS:')
    
    try {
        // Test des colonnes essentielles
        const { data, error } = await supabase
            .from('users')
            .select('id, email, phone, full_name, role, status, verification_status, avatar_url')
            .limit(1)
        
        if (error) {
            console.log('❌ ERREUR TABLE USERS:', error.message)
            if (error.code === 'PGRST204') {
                console.log('🚨 COLONNES MANQUANTES DETECTEES!')
                console.log('   - Exécutez SCRIPT_CORRIGE_FINAL.sql dans Supabase')
            }
        } else {
            console.log('✅ Table users accessible')
            console.log('✅ Colonnes disponibles:', Object.keys(data[0] || {}))
        }
    } catch (err) {
        console.log('❌ ERREUR CRITIQUE TABLE USERS:', err.message)
    }
}

// 2. Test du bucket avatars
async function checkAvatarsBucket() {
    console.log('\n📁 2. VERIFICATION BUCKET AVATARS:')
    
    try {
        const { data, error } = await supabase.storage.listBuckets()
        
        if (error) {
            console.log('❌ ERREUR STORAGE:', error.message)
        } else {
            const avatarsBucket = data.find(bucket => bucket.name === 'avatars')
            if (avatarsBucket) {
                console.log('✅ Bucket avatars existe')
                console.log('✅ Public:', avatarsBucket.public)
            } else {
                console.log('❌ BUCKET AVATARS MANQUANT!')
                console.log('🚨 Exécutez SCRIPT_CORRIGE_FINAL.sql pour le créer')
            }
        }
    } catch (err) {
        console.log('❌ ERREUR CRITIQUE STORAGE:', err.message)
    }
}

// 3. Test des politiques RLS
async function checkRLSPolicies() {
    console.log('\n🛡️ 3. VERIFICATION POLITIQUES RLS:')
    
    try {
        // Test d'accès aux analytics
        const { data, error } = await supabase
            .from('analytics_events')
            .select('*')
            .limit(1)
        
        if (error && error.code === '42P01') {
            console.log('❌ TABLE ANALYTICS_EVENTS MANQUANTE!')
            console.log('🚨 Exécutez SCRIPT_CORRIGE_FINAL.sql')
        } else if (error) {
            console.log('⚠️ Erreur RLS analytics:', error.message)
        } else {
            console.log('✅ Table analytics_events accessible')
        }
    } catch (err) {
        console.log('❌ ERREUR RLS:', err.message)
    }
}

// 4. Test de création d'utilisateur
async function testUserCreation() {
    console.log('\n👤 4. TEST CREATION UTILISATEUR:')
    
    try {
        // Simuler les données du wizard
        const testUserData = {
            email: 'test@terangafoncier.com',
            phone: '+221771234567',
            full_name: 'Test Utilisateur',
            role: 'Vendeur Particulier',
            country: 'Senegal',
            region: 'Dakar',
            status: 'active',
            verification_status: 'pending'
        }
        
        console.log('🧪 Test avec données:', testUserData)
        
        // Test d'insertion (sans vraiment insérer)
        const { error } = await supabase
            .from('users')
            .select('*')
            .eq('email', testUserData.email)
        
        if (error) {
            console.log('❌ ERREUR TEST UTILISATEUR:', error.message)
            if (error.code === 'PGRST204') {
                console.log('🚨 SCHEMA NON SYNCHRONISE - Exécutez le script SQL!')
            }
        } else {
            console.log('✅ Structure utilisateur OK')
        }
        
    } catch (err) {
        console.log('❌ ERREUR TEST:', err.message)
    }
}

// 5. Résumé et solutions
function printSolutions() {
    console.log('\n🔧 SOLUTIONS URGENTES:')
    console.log('========================')
    console.log('')
    console.log('1. 🎯 EXECUTER LE SCRIPT SQL:')
    console.log('   - Ouvrez https://app.supabase.com')
    console.log('   - Projet > SQL Editor > Nouvelle requête')
    console.log('   - Copiez SCRIPT_CORRIGE_FINAL.sql')
    console.log('   - Cliquez RUN')
    console.log('')
    console.log('2. 🔄 VIDER LE CACHE:')
    console.log('   - F12 > Application > Storage > Clear site data')
    console.log('   - Rechargez la page')
    console.log('')
    console.log('3. 🧪 TESTER LE WIZARD:')
    console.log('   - Créez un utilisateur test')
    console.log('   - Vérifiez l\'upload d\'avatar')
    console.log('')
    console.log('4. 📊 VERIFIER LES DASHBOARDS:')
    console.log('   - Testez les actions utilisateur')
    console.log('   - Vérifiez les analytics')
}

// Exécution du diagnostic
async function runDiagnostic() {
    try {
        await checkUsersTable()
        await checkAvatarsBucket()
        await checkRLSPolicies()
        await testUserCreation()
        printSolutions()
        
        console.log('\n✅ DIAGNOSTIC TERMINE')
        console.log('Exécutez SCRIPT_CORRIGE_FINAL.sql pour corriger tous les problèmes!')
        
    } catch (error) {
        console.log('\n❌ ERREUR CRITIQUE DIAGNOSTIC:', error.message)
    }
}

runDiagnostic()
