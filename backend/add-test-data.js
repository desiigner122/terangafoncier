// Script pour ajouter des données de test réalistes
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'teranga_foncier.db');
const db = new Database(dbPath);

console.log('🌱 Ajout de données de test réalistes...');

try {
  // 1. Ajouter des utilisateurs de test
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (email, password, first_name, last_name, phone, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const users = [
    {
      email: 'fatou.sarr@email.com',
      password: bcrypt.hashSync('password123', 10),
      first_name: 'Fatou',
      last_name: 'Sarr',
      phone: '+221776543210',
      status: 'active',
      created_at: new Date('2024-06-15').toISOString()
    },
    {
      email: 'amadou.ba@email.com', 
      password: bcrypt.hashSync('password123', 10),
      first_name: 'Amadou',
      last_name: 'Ba',
      phone: '+221777654321',
      status: 'active',
      created_at: new Date('2024-08-20').toISOString()
    },
    {
      email: 'marie.diop@email.com',
      password: bcrypt.hashSync('password123', 10),
      first_name: 'Marie',
      last_name: 'Diop',  
      phone: '+221765432109',
      status: 'active',
      created_at: new Date('2024-09-10').toISOString()
    },
    {
      email: 'ibrahim.fall@email.com',
      password: bcrypt.hashSync('password123', 10),
      first_name: 'Ibrahim',
      last_name: 'Fall',
      phone: '+221754321098',
      status: 'pending',
      created_at: new Date('2024-12-01').toISOString()
    }
  ];

  users.forEach(user => {
    try {
      insertUser.run(user.email, user.password, user.first_name, user.last_name, user.phone, user.status, user.created_at);
      console.log(`✅ Utilisateur ajouté: ${user.first_name} ${user.last_name}`);
    } catch (err) {
      console.log(`ℹ️ Utilisateur déjà existant: ${user.first_name} ${user.last_name}`);
    }
  });

  // 2. Ajouter des propriétés de test
  const insertProperty = db.prepare(`
    INSERT OR IGNORE INTO properties (
      owner_id, title, slug, description, property_type, listing_type, 
      price, currency, address, city, region, surface_area, bedrooms, 
      bathrooms, status, featured, verified, views_count, favorites_count, 
      published_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Récupérer les IDs des utilisateurs
  const userIds = db.prepare('SELECT id FROM users WHERE email != ?').all('admin@teranga.com');

  const properties = [
    {
      owner_id: userIds[0]?.id || 2,
      title: 'Villa moderne Almadies',
      slug: 'villa-moderne-almadies-1',
      description: 'Magnifique villa de 4 chambres avec piscine et jardin, située dans le quartier résidentiel des Almadies.',
      property_type: 'villa',
      listing_type: 'sale',
      price: 125000000,
      currency: 'XOF',
      address: 'Rue 15, Almadies',
      city: 'Dakar',
      region: 'Dakar',
      surface_area: 350,
      bedrooms: 4,
      bathrooms: 3,
      status: 'active',
      featured: 1,
      verified: 1,
      views_count: 245,
      favorites_count: 12,
      published_at: new Date('2024-09-15').toISOString(),
      created_at: new Date('2024-09-15').toISOString()
    },
    {
      owner_id: userIds[1]?.id || 3,
      title: 'Terrain 500m² Yoff',
      slug: 'terrain-500m2-yoff-1',
      description: 'Terrain constructible de 500m² bien situé à Yoff, proche des commodités.',
      property_type: 'terrain',
      listing_type: 'sale', 
      price: 35000000,
      currency: 'XOF',
      address: 'Zone résidentielle, Yoff',
      city: 'Yoff',
      region: 'Dakar',
      surface_area: 500,
      bedrooms: 0,
      bathrooms: 0,
      status: 'active',
      featured: 0,
      verified: 1,
      views_count: 89,
      favorites_count: 5,
      published_at: new Date('2024-10-20').toISOString(),
      created_at: new Date('2024-10-20').toISOString()
    },
    {
      owner_id: userIds[2]?.id || 4,
      title: 'Appartement 3 pièces Point E',
      slug: 'appartement-3pieces-point-e-1',
      description: 'Bel appartement de 3 pièces au Point E, avec balcon et parking.',
      property_type: 'appartement',
      listing_type: 'rent',
      price: 450000,
      currency: 'XOF',
      address: 'Immeuble résidentiel, Point E',
      city: 'Dakar',
      region: 'Dakar',
      surface_area: 85,
      bedrooms: 2,
      bathrooms: 1,
      status: 'active',
      featured: 0,
      verified: 1,
      views_count: 156,
      favorites_count: 8,
      published_at: new Date('2024-11-05').toISOString(),
      created_at: new Date('2024-11-05').toISOString()
    },
    {
      owner_id: userIds[3]?.id || 5,
      title: 'Maison familiale Rufisque',
      slug: 'maison-familiale-rufisque-1',
      description: 'Grande maison familiale de 6 chambres avec cour et garage.',
      property_type: 'maison',
      listing_type: 'sale',
      price: 75000000,
      currency: 'XOF',
      address: 'Quartier résidentiel, Rufisque',
      city: 'Rufisque',
      region: 'Dakar',
      surface_area: 280,
      bedrooms: 6,
      bathrooms: 2,
      status: 'pending',
      featured: 0,
      verified: 0,
      views_count: 23,
      favorites_count: 2,
      published_at: null,
      created_at: new Date('2024-12-20').toISOString()
    }
  ];

  properties.forEach((prop, index) => {
    try {
      insertProperty.run(
        prop.owner_id, prop.title, prop.slug, prop.description, prop.property_type,
        prop.listing_type, prop.price, prop.currency, prop.address, prop.city,
        prop.region, prop.surface_area, prop.bedrooms, prop.bathrooms, prop.status,
        prop.featured, prop.verified, prop.views_count, prop.favorites_count,
        prop.published_at, prop.created_at
      );
      console.log(`🏠 Propriété ajoutée: ${prop.title}`);
    } catch (err) {
      console.log(`ℹ️ Propriété déjà existante: ${prop.title}`);
    }
  });

  // 3. Ajouter des transactions financières
  const insertTransaction = db.prepare(`
    INSERT OR IGNORE INTO financial_transactions (
      user_id, subscription_id, type, amount, currency, status,
      payment_method, gateway_transaction_id, processed_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const transactions = [
    {
      user_id: userIds[0]?.id || 2,
      subscription_id: null,
      type: 'commission_vente',
      amount: 3750000, // 3% de 125M
      currency: 'XOF',
      status: 'completed',
      payment_method: 'bank_transfer',
      gateway_transaction_id: 'TXN_' + Date.now(),
      processed_at: new Date('2024-10-15').toISOString(),
      created_at: new Date('2024-10-15').toISOString()
    },
    {
      user_id: userIds[1]?.id || 3, 
      subscription_id: null,
      type: 'commission_vente',
      amount: 1050000, // 3% de 35M
      currency: 'XOF',
      status: 'completed',
      payment_method: 'mobile_money',
      gateway_transaction_id: 'TXN_' + (Date.now() + 1),
      processed_at: new Date('2024-11-20').toISOString(),
      created_at: new Date('2024-11-20').toISOString()
    },
    {
      user_id: userIds[2]?.id || 4,
      subscription_id: null,
      type: 'commission_location',
      amount: 45000, // 10% de 450k
      currency: 'XOF',
      status: 'completed',
      payment_method: 'card',
      gateway_transaction_id: 'TXN_' + (Date.now() + 2),
      processed_at: new Date('2024-12-05').toISOString(),
      created_at: new Date('2024-12-05').toISOString()
    },
    {
      user_id: userIds[0]?.id || 2,
      subscription_id: 1,
      type: 'subscription',
      amount: 25000,
      currency: 'XOF', 
      status: 'pending',
      payment_method: 'mobile_money',
      gateway_transaction_id: 'SUB_' + Date.now(),
      processed_at: null,
      created_at: new Date('2024-12-28').toISOString()
    }
  ];

  transactions.forEach((txn, index) => {
    try {
      insertTransaction.run(
        txn.user_id, txn.subscription_id, txn.type, txn.amount,
        txn.currency, txn.status, txn.payment_method, txn.gateway_transaction_id,
        txn.processed_at, txn.created_at
      );
      console.log(`💰 Transaction ajoutée: Type ${txn.type}, ${txn.amount} ${txn.currency}`);
    } catch (err) {
      console.log(`ℹ️ Transaction déjà existante: ${txn.type}`);
    }
  });

  // 4. Ajouter des tickets de support
  const insertTicket = db.prepare(`
    INSERT OR IGNORE INTO support_tickets (
      ticket_number, user_id, subject, description, status, priority, category, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tickets = [
    {
      ticket_number: 'TKT-' + Date.now(),
      user_id: userIds[0]?.id || 2,
      subject: 'Problème de paiement commission',
      description: 'Bonjour, je n\'ai pas reçu ma commission pour la vente de ma villa des Almadies. Pouvez-vous vérifier ?',
      status: 'open',
      priority: 'high',
      category: 'payment',
      created_at: new Date('2024-12-27').toISOString()
    },
    {
      ticket_number: 'TKT-' + (Date.now() + 1),
      user_id: userIds[1]?.id || 3,
      subject: 'Question sur la publication',
      description: 'Comment puis-je modifier les photos de mon annonce ?',
      status: 'open',
      priority: 'normal',
      category: 'technical',
      created_at: new Date('2024-12-25').toISOString()
    },
    {
      ticket_number: 'TKT-' + (Date.now() + 2),
      user_id: userIds[2]?.id || 4,
      subject: 'Demande de renseignements',
      description: 'Quels sont les tarifs pour passer en premium ?',
      status: 'resolved',
      priority: 'normal',
      category: 'billing',
      created_at: new Date('2024-12-20').toISOString()
    }
  ];

  tickets.forEach((ticket, index) => {
    try {
      insertTicket.run(
        ticket.ticket_number, ticket.user_id, ticket.subject, ticket.description, 
        ticket.status, ticket.priority, ticket.category, ticket.created_at
      );
      console.log(`🎫 Ticket ajouté: ${ticket.subject}`);
    } catch (err) {
      console.log(`ℹ️ Ticket déjà existant: ${ticket.subject}`);
    }
  });

  console.log('\n✅ Données de test ajoutées avec succès !');
  console.log('📊 Vous pouvez maintenant voir de vraies données dans le dashboard admin');

} catch (error) {
  console.error('❌ Erreur lors de l\'ajout des données:', error);
} finally {
  db.close();
}