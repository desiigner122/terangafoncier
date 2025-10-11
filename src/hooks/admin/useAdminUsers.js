import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

/**
 * Hook personnalisé pour la gestion des utilisateurs
 * Récupère et gère tous les utilisateurs de la plateforme
 */
export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all', // all, active, suspended
    searchTerm: ''
  });

  // Fonction pour récupérer tous les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Appliquer les filtres
      if (filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }

      if (filters.status === 'active') {
        query = query.is('suspended_at', null);
      } else if (filters.status === 'suspended') {
        query = query.not('suspended_at', 'is', null);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Appliquer la recherche côté client
      let filteredData = data || [];
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredData = filteredData.filter(user => 
          user.name?.toLowerCase().includes(searchLower) ||
          user.email?.toLowerCase().includes(searchLower) ||
          user.phone?.toLowerCase().includes(searchLower)
        );
      }

      setUsers(filteredData);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setError(err.message);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Suspendre un utilisateur
  const suspendUser = async (userId, reason) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          suspended_at: new Date().toISOString(),
          suspension_reason: reason || 'Non spécifié'
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Logger l'action
      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'user_suspended',
        target_id: userId,
        target_type: 'user',
        details: { reason: reason || 'Non spécifié' }
      });

      toast.success('Utilisateur suspendu avec succès');
      await fetchUsers(); // Rafraîchir la liste
    } catch (err) {
      console.error('Erreur lors de la suspension:', err);
      toast.error('Erreur lors de la suspension de l\'utilisateur');
    }
  };

  // Réactiver un utilisateur
  const unsuspendUser = async (userId) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Mettre à jour le profil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          suspended_at: null,
          suspension_reason: null
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Logger l'action
      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'user_unsuspended',
        target_id: userId,
        target_type: 'user'
      });

      toast.success('Utilisateur réactivé avec succès');
      await fetchUsers();
    } catch (err) {
      console.error('Erreur lors de la réactivation:', err);
      toast.error('Erreur lors de la réactivation de l\'utilisateur');
    }
  };

  // Changer le rôle d'un utilisateur
  const changeUserRole = async (userId, newRole) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Mettre à jour le rôle
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Logger l'action
      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'role_changed',
        target_id: userId,
        target_type: 'user',
        details: { new_role: newRole }
      });

      toast.success(`Rôle changé en ${newRole} avec succès`);
      await fetchUsers();
    } catch (err) {
      console.error('Erreur lors du changement de rôle:', err);
      toast.error('Erreur lors du changement de rôle');
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (userId) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Logger l'action AVANT la suppression
      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'user_deleted',
        target_id: userId,
        target_type: 'user'
      });

      // Supprimer le profil (cascade sur auth.users si configuré)
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;

      toast.success('Utilisateur supprimé avec succès');
      await fetchUsers();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  // Charger les utilisateurs au montage et lors des changements de filtres
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return {
    users,
    loading,
    error,
    filters,
    setFilters,
    suspendUser,
    unsuspendUser,
    changeUserRole,
    deleteUser,
    refetch: fetchUsers
  };
};

export default useAdminUsers;
