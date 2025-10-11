// REQUÊTES SUPABASE CORRIGÉES BASÉES SUR LES ERREURS
// Ce fichier contient les corrections pour les erreurs de structure DB

// PROBLÈME 1: Relation 'properties' -> 'owner_id' n'existe pas
// L'erreur suggère 'offers' au lieu de 'owner_id'

// ❌ REQUÊTE CASSÉE (utilisée actuellement)
/*
const { data: properties } = await supabase
  .from('properties')
  .select('*, owner:owner_id(name, email, phone, role)')
  .order('created_at', { ascending: false });
*/

// ✅ REQUÊTE CORRIGÉE - Option 1: Sans relation
const getPropertiesBasic = async () => {
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  return properties;
};

// ✅ REQUÊTE CORRIGÉE - Option 2: Si la colonne s'appelle user_id
const getPropertiesWithUser = async () => {
  const { data: properties } = await supabase
    .from('properties')
    .select('*, owner:user_id(name, email, phone, role)')
    .order('created_at', { ascending: false });
  return properties;
};

// PROBLÈME 2: Relation 'support_tickets' -> 'user_id' n'existe pas

// ❌ REQUÊTE CASSÉE
/*
const { data: tickets } = await supabase
  .from('support_tickets')
  .select('*, user:user_id(name, email, avatar_url, phone), assigned_admin:assigned_to(name, email)')
  .order('created_at', { ascending: false });
*/

// ✅ REQUÊTE CORRIGÉE - Sans relations
const getSupportTicketsBasic = async () => {
  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false });
  return tickets;
};

// PROBLÈME 3: Colonne 'blockchain_transactions.amount' n'existe pas

// ❌ REQUÊTE CASSÉE
/*
const { data: transactions } = await supabase
  .from('blockchain_transactions')
  .select('amount')
  .eq('status', 'completed')
  .gte('created_at', '2025-10-01T00:00:00.000Z');
*/

// ✅ REQUÊTE CORRIGÉE - Découvrir d'abord les colonnes disponibles
const getBlockchainTransactionsBasic = async () => {
  const { data: transactions } = await supabase
    .from('blockchain_transactions')
    .select('*')
    .eq('status', 'completed')
    .gte('created_at', '2025-10-01T00:00:00.000Z');
  return transactions;
};

// PROBLÈME 4: Table 'profiles' accessible mais erreur vague

// ✅ REQUÊTE SÉCURISÉE PROFILES
const getProfilesBasic = async () => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'active');
  
  if (error) {
    console.error('Erreur profiles:', error);
    return [];
  }
  return profiles;
};

// PROBLÈME 5: Table 'notifications' - relation user_id probablement cassée

// ✅ REQUÊTE NOTIFICATIONS BASIQUE
const getNotificationsBasic = async (userId) => {
  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('read', false);
  
  if (error) {
    console.error('Erreur notifications:', error);
    return [];
  }
  return notifications;
};

// FONCTIONS UTILITAIRES DE DÉCOUVERTE

// Fonction pour tester une table et découvrir ses colonnes
const discoverTableStructure = async (tableName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Erreur table ${tableName}:`, error);
      return null;
    }
    
    if (data && data.length > 0) {
      console.log(`Structure ${tableName}:`, Object.keys(data[0]));
      return Object.keys(data[0]);
    }
    
    return [];
  } catch (err) {
    console.error(`Erreur découverte ${tableName}:`, err);
    return null;
  }
};

// Export des fonctions corrigées
export {
  getPropertiesBasic,
  getPropertiesWithUser,
  getSupportTicketsBasic,
  getBlockchainTransactionsBasic,
  getProfilesBasic,
  getNotificationsBasic,
  discoverTableStructure
};