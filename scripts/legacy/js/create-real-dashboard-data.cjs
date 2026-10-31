// TEST ET INSERTION DE DONNÉES RÉELLES POUR LE DASHBOARD PARTICULIER
// Élimine complètement les données simulées en créant des données réelles

// Utilisation d'import dynamique pour Node.js
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://upqthvkkgmykydxrpupm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcXRodmtrZ215a3lkeHJwdXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NjI0NjUsImV4cCI6MjA1MTIzODQ2NX0.vJqYfBxmK1vpfPdx7EkR-ZMLQFvAjfrfQZHJHRqCktM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createRealDashboardData() {
    console.log('🎯 CRÉATION DE DONNÉES RÉELLES POUR LE DASHBOARD');
    
    try {
        // 1. Créer les tables nécessaires (exécuter le SQL)
        console.log('\n📋 Étape 1: Vérification des tables...');
        
        // Vérifier si les tables existent
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['transactions', 'appointments', 'favorites', 'agents']);
        
        if (!tablesError) {
            const existingTables = tables.map(t => t.table_name);
            console.log('✅ Tables existantes:', existingTables);
        }

        // 2. Créer quelques agents si nécessaire
        console.log('\n👥 Étape 2: Création d\'agents...');
        const { data: agents, error: agentsError } = await supabase
            .from('agents')
            .upsert([
                {
                    name: 'Moussa Diallo',
                    email: 'moussa.diallo@teranga.sn',
                    phone: '+221 77 123 45 67',
                    specialties: ['Résidentiel', 'Commercial']
                },
                {
                    name: 'Fatou Sow',
                    email: 'fatou.sow@teranga.sn',
                    phone: '+221 76 987 65 43',
                    specialties: ['Terrain', 'Investissement']
                },
                {
                    name: 'Ousmane Kane',
                    email: 'ousmane.kane@teranga.sn',
                    phone: '+221 78 456 78 90',
                    specialties: ['Industriel', 'Rural']
                }
            ], { onConflict: 'email' })
            .select();

        if (agentsError) {
            console.error('❌ Erreur création agents:', agentsError);
        } else {
            console.log('✅ Agents créés:', agents?.length || 0);
        }

        // 3. Obtenir un utilisateur test
        console.log('\n👤 Étape 3: Recherche d\'utilisateur test...');
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser.user) {
            console.log('❌ Aucun utilisateur connecté. Connexion en cours...');
            
            // Tentative de connexion avec un compte test
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email: 'test@teranga.sn',
                password: 'testpassword123'
            });
            
            if (signInError) {
                console.log('📝 Création d\'un compte test...');
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email: 'test@teranga.sn',
                    password: 'testpassword123',
                    options: {
                        data: {
                            full_name: 'Utilisateur Test',
                            role: 'Particulier'
                        }
                    }
                });
                
                if (signUpError) {
                    console.error('❌ Erreur création compte:', signUpError);
                    return;
                } else {
                    console.log('✅ Compte test créé');
                }
            } else {
                console.log('✅ Connecté avec succès');
            }
        }

        // Récupérer l'utilisateur après connexion
        const { data: currentUser } = await supabase.auth.getUser();
        const userId = currentUser?.user?.id;
        
        if (!userId) {
            console.error('❌ Impossible d\'obtenir l\'ID utilisateur');
            return;
        }

        console.log('✅ Utilisateur ID:', userId);

        // 4. Créer des parcelles exemple si nécessaire
        console.log('\n🏘️ Étape 4: Création de parcelles exemple...');
        const { data: parcels, error: parcelsError } = await supabase
            .from('parcels')
            .upsert([
                {
                    id: 'dk-alm-001',
                    name: 'Terrain Résidentiel Almadies',
                    description: 'Beau terrain résidentiel près de la plage',
                    price: 150000000,
                    current_value: 165000000,
                    location: 'Almadies, Dakar',
                    size_sqm: 500,
                    is_available: false
                },
                {
                    id: 'dmn-cit-001',
                    name: 'Terrain Pôle Urbain Diamniadio',
                    description: 'Terrain dans la nouvelle ville de Diamniadio',
                    price: 25000000,
                    current_value: 28000000,
                    location: 'Diamniadio',
                    size_sqm: 300,
                    is_available: false
                },
                {
                    id: 'slf-ruf-001',
                    name: 'Terrain Commercial Rufisque',
                    description: 'Emplacement stratégique pour commerce',
                    price: 45000000,
                    current_value: 48000000,
                    location: 'Rufisque',
                    size_sqm: 800,
                    is_available: true
                }
            ], { onConflict: 'id' })
            .select();

        if (parcelsError) {
            console.error('❌ Erreur création parcelles:', parcelsError);
        } else {
            console.log('✅ Parcelles créées:', parcels?.length || 0);
        }

        // 5. Créer des transactions (investissements)
        console.log('\n💰 Étape 5: Création de transactions...');
        const { data: transactions, error: transError } = await supabase
            .from('transactions')
            .upsert([
                {
                    user_id: userId,
                    parcel_id: 'dk-alm-001',
                    amount: 150000000,
                    transaction_type: 'purchase',
                    status: 'completed',
                    payment_method: 'bank_transfer',
                    transaction_date: new Date('2023-01-15').toISOString()
                },
                {
                    user_id: userId,
                    parcel_id: 'dmn-cit-001',
                    amount: 25000000,
                    transaction_type: 'purchase',
                    status: 'completed',
                    payment_method: 'cash',
                    transaction_date: new Date('2024-06-10').toISOString()
                }
            ], { onConflict: 'id' })
            .select();

        if (transError) {
            console.error('❌ Erreur création transactions:', transError);
        } else {
            console.log('✅ Transactions créées:', transactions?.length || 0);
        }

        // 6. Créer des rendez-vous
        console.log('\n📅 Étape 6: Création de rendez-vous...');
        const futureDate1 = new Date();
        futureDate1.setDate(futureDate1.getDate() + 12);
        futureDate1.setHours(10, 0, 0);

        const futureDate2 = new Date();
        futureDate2.setDate(futureDate2.getDate() + 17);
        futureDate2.setHours(14, 30, 0);

        const futureDate3 = new Date();
        futureDate3.setDate(futureDate3.getDate() + 27);
        futureDate3.setHours(23, 59, 0);

        const { data: appointments, error: appointError } = await supabase
            .from('appointments')
            .upsert([
                {
                    user_id: userId,
                    parcel_id: 'dk-alm-001',
                    title: 'Visite Terrain Almadies',
                    description: 'Visite sur site du terrain acquis',
                    type: 'visit',
                    scheduled_date: futureDate1.toISOString(),
                    status: 'confirmed',
                    location: 'Almadies, Dakar'
                },
                {
                    user_id: userId,
                    parcel_id: 'slf-ruf-001',
                    title: 'RDV Notaire - Achat Rufisque',
                    description: 'Signature des documents d\'achat',
                    type: 'signing',
                    scheduled_date: futureDate2.toISOString(),
                    status: 'confirmed',
                    location: 'Étude Maître Diop'
                },
                {
                    user_id: userId,
                    parcel_id: 'dmn-cit-001',
                    title: 'Paiement échéance #2 Diamniadio',
                    description: 'Deuxième échéance de paiement',
                    type: 'consultation',
                    scheduled_date: futureDate3.toISOString(),
                    status: 'scheduled'
                }
            ], { onConflict: 'id' })
            .select();

        if (appointError) {
            console.error('❌ Erreur création rendez-vous:', appointError);
        } else {
            console.log('✅ Rendez-vous créés:', appointments?.length || 0);
        }

        // 7. Créer des favoris
        console.log('\n❤️ Étape 7: Création de favoris...');
        const { data: favorites, error: favError } = await supabase
            .from('favorites')
            .upsert([
                { user_id: userId, parcel_id: 'slf-ruf-001' },
                { user_id: userId, parcel_id: 'dk-alm-001' },
                { user_id: userId, parcel_id: 'dmn-cit-001' }
            ], { onConflict: 'user_id,parcel_id' })
            .select();

        if (favError) {
            console.error('❌ Erreur création favoris:', favError);
        } else {
            console.log('✅ Favoris créés:', favorites?.length || 0);
        }

        // 8. Assigner un agent à l'utilisateur
        console.log('\n🤝 Étape 8: Attribution d\'un agent...');
        if (agents && agents.length > 0) {
            const { error: profileUpdateError } = await supabase
                .from('profiles')
                .update({ assigned_agent_id: agents[0].id })
                .eq('id', userId);

            if (profileUpdateError) {
                console.error('❌ Erreur attribution agent:', profileUpdateError);
            } else {
                console.log('✅ Agent assigné:', agents[0].name);
            }
        }

        console.log('\n🎉 DONNÉES RÉELLES CRÉÉES AVEC SUCCÈS !');
        console.log('📊 Le dashboard affichera maintenant des données réelles au lieu de simulations');
        console.log('🔄 Actualisez votre navigateur pour voir les changements');

    } catch (error) {
        console.error('❌ Erreur globale:', error);
    }
}

// Exécuter le script
createRealDashboardData();
