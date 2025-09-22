#!/usr/bin/env node

/**
 * CRÉATION DE NOUVEAUX COMPTES COMPLETS
 * Script pour créer 20 nouveaux comptes utilisateur avec:
 * - Authentification Supabase (auth.users + auth.identities)
 * - Profils publics (public.users + public.profiles)
 * - Rôles et métadonnées correctes
 * - Emails confirmés automatiquement
 */

import { createClient } from '@supabase/supabase-js'

// ⚠️ CONFIGURATION REQUISE
const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY2MzMwNCwiZXhwIjoyMDcyMjM5MzA0fQ._mFhSg4VDhnUE8ctKLEHpYkafpBqsbnZCzvX9JwtP0c'

if (!SUPABASE_SERVICE_ROLE_KEY || SUPABASE_SERVICE_ROLE_KEY.includes('your-')) {
  console.error('❌ ERREUR: Configurez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Client avec service role pour bypasser RLS
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Définition des 20 comptes à créer
const ACCOUNTS = [
  { email: 'admin@terangafoncier.sn', role: 'admin', password: 'Admin2024!' },
  { email: 'test.admin@terangafoncier.sn', role: 'admin', password: 'TestAdmin2024!' },
  
  { email: 'family.diallo@teranga-foncier.sn', role: 'particulier', password: 'Particulier2024!' },
  { email: 'ahmadou.ba@teranga-foncier.sn', role: 'particulier', password: 'Particulier2024!' },
  
  { email: 'heritage.fall@teranga-foncier.sn', role: 'vendeur', password: 'Vendeur2024!' },
  { email: 'domaine.seck@teranga-foncier.sn', role: 'vendeur', password: 'Vendeur2024!' },
  
  { email: 'urban.developers@teranga-foncier.sn', role: 'promoteur', password: 'Promoteur2024!' },
  { email: 'sahel.construction@teranga-foncier.sn', role: 'promoteur', password: 'Promoteur2024!' },
  
  { email: 'financement.boa@teranga-foncier.sn', role: 'banque', password: 'Banque2024!' },
  { email: 'credit.agricole@teranga-foncier.sn', role: 'banque', password: 'Banque2024!' },
  
  { email: 'etude.diouf@teranga-foncier.sn', role: 'notaire', password: 'Notaire2024!' },
  { email: 'chambre.notaires@teranga-foncier.sn', role: 'notaire', password: 'Notaire2024!' },
  
  { email: 'foncier.expert@teranga-foncier.sn', role: 'agent_foncier', password: 'AgentFoncier2024!' },
  { email: 'teranga.immobilier@teranga-foncier.sn', role: 'agent_foncier', password: 'AgentFoncier2024!' },
  
  { email: 'geowest.africa@teranga-foncier.sn', role: 'geometre', password: 'Geometre2024!' },
  { email: 'cabinet.ndiaye@teranga-foncier.sn', role: 'geometre', password: 'Geometre2024!' },
  
  { email: 'atlantique.capital@teranga-foncier.sn', role: 'investisseur', password: 'Investisseur2024!' },
  { email: 'fonds.souverain@teranga-foncier.sn', role: 'investisseur', password: 'Investisseur2024!' },
  
  { email: 'mairie.thies@teranga-foncier.sn', role: 'mairie', password: 'Mairie2024!' },
  { email: 'mairie.dakar@teranga-foncier.sn', role: 'mairie', password: 'Mairie2024!' }
]

async function createAccount(account) {
  const { email, role, password } = account
  
  try {
    console.log(`🔄 Création: ${email} (${role})`)
    
    // 1. Créer l'utilisateur avec l'API Admin
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirmer l'email
      user_metadata: {
        role: role,
        email_verified: true,
        created_by_admin: true
      }
    })
    
    if (authError) {
      throw new Error(`Auth creation failed: ${authError.message}`)
    }
    
    if (!authUser.user) {
      throw new Error('Auth user creation returned no user')
    }
    
    const userId = authUser.user.id
    console.log(`   ✅ Auth user créé: ${userId}`)
    
    // 2. Créer l'entrée public.users
    const { error: usersError } = await supabase
      .from('users')
      .insert([{
        id: userId,
        email: email,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    
    if (usersError) {
      console.warn(`   ⚠️  public.users insert failed: ${usersError.message}`)
    } else {
      console.log(`   ✅ public.users créé`)
    }
    
    // 3. Créer l'entrée public.profiles
    const { error: profilesError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        email: email,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    
    if (profilesError) {
      console.warn(`   ⚠️  public.profiles insert failed: ${profilesError.message}`)
    } else {
      console.log(`   ✅ public.profiles créé`)
    }
    
    console.log(`✅ SUCCÈS: ${email} créé complètement\n`)
    return { email, success: true, userId }
    
  } catch (error) {
    console.error(`❌ ÉCHEC: ${email}`)
    console.error(`   Erreur: ${error.message}\n`)
    return { email, success: false, error: error.message }
  }
}

async function main() {
  console.log('🚀 CRÉATION DE 20 NOUVEAUX COMPTES')
  console.log('=' .repeat(50))
  
  const results = []
  
  // Créer les comptes un par un pour éviter les conflits
  for (const account of ACCOUNTS) {
    const result = await createAccount(account)
    results.push(result)
    
    // Petite pause entre les créations
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Résumé final
  console.log('\n📊 RÉSUMÉ DE LA CRÉATION')
  console.log('=' .repeat(50))
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`✅ Comptes créés avec succès: ${successful.length}/${ACCOUNTS.length}`)
  console.log(`❌ Comptes échoués: ${failed.length}/${ACCOUNTS.length}`)
  
  if (successful.length > 0) {
    console.log('\n✅ COMPTES CRÉÉS:')
    successful.forEach(r => console.log(`   • ${r.email}`))
  }
  
  if (failed.length > 0) {
    console.log('\n❌ COMPTES ÉCHOUÉS:')
    failed.forEach(r => console.log(`   • ${r.email}: ${r.error}`))
  }
  
  console.log('\n🎯 Prochaine étape: Testez les connexions avec test-connexions-supabase.js')
}

main().catch(console.error)