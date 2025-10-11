// Script à exécuter dans la console du navigateur pour créer des données de test
// Ouvrir les DevTools (F12) et coller ce script dans la console

// 1. Créer des utilisateurs de test
const createTestUsers = async () => {
  const users = [
    { email: 'user1@test.com', full_name: 'Jean Dupont', role: 'particulier' },
    { email: 'user2@test.com', full_name: 'Marie Martin', role: 'vendeur' },
    { email: 'notaire@test.com', full_name: 'Me Bernard', role: 'notaire' },
  ];

  for (const user of users) {
    const { error } = await supabase
      .from('profiles')
      .upsert([{
        id: crypto.randomUUID(),
        ...user,
        status: 'active',
        created_at: new Date().toISOString()
      }]);
    
    if (error) console.error('Error creating user:', error);
    else console.log('✅ User created:', user.full_name);
  }
};

// 2. Créer des propriétés de test avec statut pending
const createTestProperties = async () => {
  const properties = [
    {
      title: 'Villa moderne à Dakar',
      description: 'Belle villa avec piscine et jardin',
      price: 150000000,
      location: 'Dakar, Sénégal',
      verification_status: 'pending'
    },
    {
      title: 'Appartement centre-ville',
      description: 'Appartement 3 pièces rénové',
      price: 75000000,
      location: 'Dakar, Sénégal', 
      verification_status: 'pending'
    }
  ];

  for (const property of properties) {
    const { error } = await supabase
      .from('properties')
      .insert([{
        id: crypto.randomUUID(),
        ...property,
        owner_id: crypto.randomUUID(), // Random owner ID
        status: 'active',
        created_at: new Date().toISOString()
      }]);
    
    if (error) console.error('Error creating property:', error);
    else console.log('✅ Property created:', property.title);
  }
};

// 3. Créer des tickets de support de test
const createTestTickets = async () => {
  const tickets = [
    {
      title: 'Problème de connexion',
      description: 'Je n\'arrive pas à me connecter à mon compte',
      category: 'technical',
      priority: 'high',
      status: 'open'
    },
    {
      title: 'Question validation propriété',
      description: 'Combien de temps pour valider ma propriété?',
      category: 'property_validation', 
      priority: 'medium',
      status: 'open'
    }
  ];

  for (const ticket of tickets) {
    const { error } = await supabase
      .from('support_tickets')
      .insert([{
        id: crypto.randomUUID(),
        ...ticket,
        user_id: crypto.randomUUID(), // Random user ID
        created_at: new Date().toISOString()
      }]);
    
    if (error) console.error('Error creating ticket:', error);
    else console.log('✅ Ticket created:', ticket.title);
  }
};

// Exécuter toutes les fonctions
const createAllTestData = async () => {
  console.log('🚀 Creating test data...');
  await createTestUsers();
  await createTestProperties();
  await createTestTickets();
  console.log('✅ All test data created!');
  console.log('📊 Refresh your admin dashboard to see the data');
};

// Lancer la création des données de test
createAllTestData();