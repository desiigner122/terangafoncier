import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinner';
import { 
  PlusCircle
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import userStatusManager from '@/lib/userStatusManager';
import AddUserWizard from './components/AddUserWizard';
import EditUserDialog from './components/EditUserDialog';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';

// Fonction toast sécurisée
const safeToast = (message, type = 'info') => {
  try {
    // Simple logging pour éviter les erreurs
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Affichage visuel pour l'utilisateur
    if (type === 'error') {
      alert(`Erreur: ${message}`);
    } else {
      // Pour les messages de succès, juste le log console
      console.log(`✅ ${message}`);
    }
  } catch (error) {
    console.error('Erreur dans safeToast:', error);
  }
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    banned: 'all',
    search: ''
  });

  // Chargement des utilisateurs depuis Supabase
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
      safeToast(`${data?.length || 0} utilisateurs chargés`, 'success');
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError(error.message);
      safeToast('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    loadUsers();
  }, []);

  // Gestion des actions utilisateur
  const handleUserAction = async (userId, action) => {
    try {
      let result;
      
      switch (action) {
        case 'approve':
          result = await userStatusManager.approveUser(userId);
          break;
        case 'reject':
          result = await userStatusManager.rejectUser(userId);
          break;
        case 'ban':
          result = await userStatusManager.banUser(userId);
          break;
        case 'unban':
          result = await userStatusManager.unbanUser(userId);
          break;
        case 'delete':
          result = await userStatusManager.deleteUser(userId);
          break;
        default:
          throw new Error(`Action non supportée: ${action}`);
      }

      if (result.success) {
        safeToast(result.message, 'success');
        await loadUsers(); // Recharger la liste
      } else {
        safeToast(result.message, 'error');
      }
    } catch (error) {
      console.error('Erreur lors de l\'action utilisateur:', error);
      safeToast('Erreur lors de l\'action utilisateur', 'error');
    }
  };

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !filters.search || 
        user.full_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      
      const matchesStatus = filters.status === 'all' || user.verification_status === filters.status;
      
      const matchesBanned = filters.banned === 'all' || 
        (filters.banned === 'banned' && user.verification_status === 'banned') ||
        (filters.banned === 'not_banned' && user.verification_status !== 'banned');

      return matchesSearch && matchesRole && matchesStatus && matchesBanned;
    });
  }, [users, filters]);

  // Gestionnaires d'événements
  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleUserAdded = async (newUser) => {
    safeToast(`Utilisateur ${newUser.full_name} ajouté avec succès`, 'success');
    await loadUsers();
  };

  const handleUserUpdated = async (updatedUser) => {
    safeToast(`Utilisateur ${updatedUser.full_name} mis à jour avec succès`, 'success');
    await loadUsers();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur:</strong> {error}
          <button 
            onClick={loadUsers}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="container mx-auto py-6 px-4"
    >
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez tous les comptes utilisateurs de la plateforme ({filteredUsers.length} utilisateurs)
          </p>
        </div>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Filtres */}
      <UserFilters filters={filters} onFiltersChange={setFilters} users={users} />

      {/* Tableau des utilisateurs */}
      <UserTable 
        users={filteredUsers}
        onUserAction={handleUserAction}
        onEditUser={handleEditUser}
      />

      {/* Modales */}
      <AddUserWizard 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />

      <EditUserDialog 
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onUserUpdated={handleUserUpdated}
      />
    </motion.div>
  );
};

export default AdminUsersPage;
