import { supabase } from '@/lib/customSupabaseClient';

// Gestionnaire sécurisé pour les actions utilisateurs
class UserActionsManager {
  constructor() {
    this.isInitialized = false;
    this.initializeManager();
  }

  async initializeManager() {
    try {
      // Vérifier la connexion Supabase
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        console.warn('Supabase connection issue:', error);
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('UserActionsManager initialization failed:', error);
    }
  }

  // Fonction sécurisée pour supprimer un utilisateur
  async deleteUser(userId) {
    try {
      if (!userId) {
        throw new Error('ID utilisateur requis');
      }

      // Vérifier si l'utilisateur existe
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, full_name, role')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw new Error(`Utilisateur non trouvé: ${fetchError.message}`);
      }

      // Log de l'action pour audit
      console.log(`🗑️ Tentative de suppression: ${existingUser.full_name} (${existingUser.role})`);

      // Supprimer l'utilisateur
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) {
        throw new Error(`Erreur suppression: ${deleteError.message}`);
      }

      // Log de succès
      console.log(`✅ Utilisateur supprimé: ${existingUser.full_name}`);
      
      return {
        success: true,
        message: `Utilisateur ${existingUser.full_name} supprimé avec succès`,
        deletedUser: existingUser
      };

    } catch (error) {
      console.error('❌ Erreur suppression utilisateur:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de la suppression'
      };
    }
  }

  // Fonction pour bannir un utilisateur
  async banUser(userId, reason = 'Non spécifié') {
    try {
      if (!userId) {
        throw new Error('ID utilisateur requis');
      }

      // Vérifier si l'utilisateur existe
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, full_name, role, status')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw new Error(`Utilisateur non trouvé: ${fetchError.message}`);
      }

      if (existingUser.status === 'banned') {
        throw new Error('Utilisateur déjà banni');
      }

      // Bannir l'utilisateur
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          status: 'banned',
          banned_at: new Date().toISOString(),
          ban_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Erreur bannissement: ${updateError.message}`);
      }

      console.log(`🚫 Utilisateur banni: ${existingUser.full_name} - Raison: ${reason}`);
      
      return {
        success: true,
        message: `Utilisateur ${existingUser.full_name} banni avec succès`,
        bannedUser: { ...existingUser, status: 'banned', ban_reason: reason }
      };

    } catch (error) {
      console.error('❌ Erreur bannissement utilisateur:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du bannissement'
      };
    }
  }

  // Fonction pour débannir un utilisateur
  async unbanUser(userId) {
    try {
      if (!userId) {
        throw new Error('ID utilisateur requis');
      }

      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, full_name, status')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw new Error(`Utilisateur non trouvé: ${fetchError.message}`);
      }

      if (existingUser.status !== 'banned') {
        throw new Error('Utilisateur n\'est pas banni');
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          status: 'active',
          banned_at: null,
          ban_reason: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Erreur débannissement: ${updateError.message}`);
      }

      console.log(`✅ Utilisateur débanni: ${existingUser.full_name}`);
      
      return {
        success: true,
        message: `Utilisateur ${existingUser.full_name} débanni avec succès`,
        unbannedUser: { ...existingUser, status: 'active' }
      };

    } catch (error) {
      console.error('❌ Erreur débannissement utilisateur:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du débannissement'
      };
    }
  }

  // Fonction pour approuver un utilisateur
  async approveUser(userId) {
    try {
      if (!userId) {
        throw new Error('ID utilisateur requis');
      }

      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, full_name, verification_status')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw new Error(`Utilisateur non trouvé: ${fetchError.message}`);
      }

      if (existingUser.verification_status === 'verified') {
        throw new Error('Utilisateur déjà approuvé');
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          verification_status: 'verified',
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Erreur approbation: ${updateError.message}`);
      }

      console.log(`✅ Utilisateur approuvé: ${existingUser.full_name}`);
      
      return {
        success: true,
        message: `Utilisateur ${existingUser.full_name} approuvé avec succès`,
        approvedUser: { ...existingUser, verification_status: 'verified' }
      };

    } catch (error) {
      console.error('❌ Erreur approbation utilisateur:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de l\'approbation'
      };
    }
  }

  // Fonction pour rejeter un utilisateur
  async rejectUser(userId, reason = 'Non spécifié') {
    try {
      if (!userId) {
        throw new Error('ID utilisateur requis');
      }

      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, full_name, verification_status')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw new Error(`Utilisateur non trouvé: ${fetchError.message}`);
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          verification_status: 'rejected',
          rejection_reason: reason,
          rejected_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Erreur rejet: ${updateError.message}`);
      }

      console.log(`❌ Utilisateur rejeté: ${existingUser.full_name} - Raison: ${reason}`);
      
      return {
        success: true,
        message: `Utilisateur ${existingUser.full_name} rejeté`,
        rejectedUser: { ...existingUser, verification_status: 'rejected', rejection_reason: reason }
      };

    } catch (error) {
      console.error('❌ Erreur rejet utilisateur:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du rejet'
      };
    }
  }

  // Fonction pour changer le rôle d'un utilisateur
  async changeUserRole(userId, newRole) {
    try {
      if (!userId || !newRole) {
        throw new Error('ID utilisateur et nouveau rôle requis');
      }

      const validRoles = [
        'Particulier', 'Vendeur Particulier', 'Vendeur Pro', 'Mairie', 
        'Banque', 'Notaire', 'Agent Foncier', 'Géomètre', 'Investisseur', 
        'Promoteur', 'Agriculteur'
      ];

      if (!validRoles.includes(newRole)) {
        throw new Error('Rôle invalide');
      }

      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id, full_name, role')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw new Error(`Utilisateur non trouvé: ${fetchError.message}`);
      }

      if (existingUser.role === newRole) {
        throw new Error('L\'utilisateur a déjà ce rôle');
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        throw new Error(`Erreur changement rôle: ${updateError.message}`);
      }

      console.log(`🔄 Rôle changé: ${existingUser.full_name} - ${existingUser.role} → ${newRole}`);
      
      return {
        success: true,
        message: `Rôle de ${existingUser.full_name} changé vers ${newRole}`,
        updatedUser: { ...existingUser, role: newRole }
      };

    } catch (error) {
      console.error('❌ Erreur changement rôle:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors du changement de rôle'
      };
    }
  }

  // Fonction pour récupérer les statistiques des utilisateurs
  async getUserStats() {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('role, status, verification_status, created_at');

      if (error) {
        throw new Error(`Erreur récupération stats: ${error.message}`);
      }

      const stats = {
        total: users.length,
        byRole: {},
        byStatus: {},
        byVerification: {},
        recent: users.filter(u => {
          const created = new Date(u.created_at);
          const week = new Date();
          week.setDate(week.getDate() - 7);
          return created > week;
        }).length
      };

      users.forEach(user => {
        // Stats par rôle
        stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
        
        // Stats par statut
        const status = user.status || 'active';
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
        
        // Stats par vérification
        const verification = user.verification_status || 'pending';
        stats.byVerification[verification] = (stats.byVerification[verification] || 0) + 1;
      });

      return {
        success: true,
        stats
      };

    } catch (error) {
      console.error('❌ Erreur récupération statistiques:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de la récupération des statistiques'
      };
    }
  }

  // Fonction de recherche avancée d'utilisateurs
  async searchUsers(query, filters = {}) {
    try {
      let queryBuilder = supabase
        .from('users')
        .select('*');

      // Recherche textuelle
      if (query) {
        queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`);
      }

      // Filtres
      if (filters.role) {
        queryBuilder = queryBuilder.eq('role', filters.role);
      }
      if (filters.status) {
        queryBuilder = queryBuilder.eq('status', filters.status);
      }
      if (filters.verification_status) {
        queryBuilder = queryBuilder.eq('verification_status', filters.verification_status);
      }
      if (filters.region) {
        queryBuilder = queryBuilder.eq('region', filters.region);
      }

      // Tri
      queryBuilder = queryBuilder.order('created_at', { ascending: false });

      const { data: users, error } = await queryBuilder;

      if (error) {
        throw new Error(`Erreur recherche: ${error.message}`);
      }

      return {
        success: true,
        users: users || [],
        count: users?.length || 0
      };

    } catch (error) {
      console.error('❌ Erreur recherche utilisateurs:', error);
      return {
        success: false,
        message: error.message || 'Erreur lors de la recherche',
        users: [],
        count: 0
      };
    }
  }
}

// Instance singleton
const userActionsManager = new UserActionsManager();

export default userActionsManager;
