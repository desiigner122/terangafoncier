
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinner';
import { PlusCircle } from 'lucide-react';
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
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    role: 'all',
    banned: 'all',
    search: ''
  });

    const fetchUsers = async () => {
        setLoading(true);
    const { data, error } = await supabase.from('users').select('*');
        if (error) {
            console.error("Error fetching users:", error);
            safeToast('Impossible de charger les utilisateurs.', 'error');
        } else {
            setUsers(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = async (userId, actionType) => {
        let user = users.find(u => u.id === userId);
        if (!user) return;

        try {
            let result;
            let message = "";

            switch(actionType) {
                case 'delete':
                    // Soft delete
                    const { error: deleteError } = await supabase
                        .from('users')
                        .update({ 
                            verification_status: 'deleted',
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', userId);
                        
                    if (deleteError) throw deleteError;
                    message = `Utilisateur ${user.full_name} désactivé.`;
                    setUsers(prev => prev.filter(u => u.id !== userId));
                    break;

                case 'ban':
                    result = await userStatusManager.banUser(userId, 'Banni par un administrateur');
                    if (!result.success) throw new Error(result.error);
                    message = `Utilisateur ${user.full_name} banni avec succès.`;
                    setUsers(prev => prev.map(u => u.id === userId ? result.user : u));
                    break;

                case 'unban':
                    result = await userStatusManager.unbanUser(userId);
                    if (!result.success) throw new Error(result.error);
                    message = `Utilisateur ${user.full_name} dé-banni avec succès.`;
                    setUsers(prev => prev.map(u => u.id === userId ? result.user : u));
                    break;

                case 'verify':
                    const { data: verifiedUser, error: verifyError } = await supabase
                        .from('users')
                        .update({ 
                            verification_status: 'verified',
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', userId)
                        .select()
                        .single();
                    
                    if (verifyError) throw verifyError;
                    message = `Utilisateur ${user.full_name} vérifié.`;
                    setUsers(prev => prev.map(u => u.id === userId ? verifiedUser : u));
                    break;

                default:
                    return;
            }

            safeToast(message, 'success');
            
        } catch (error) {
            console.error('Error in handleAction:', error);
            safeToast(`L'opération a échoué: ${error.message}`, 'error');
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (updatedUserData) => {
        if (!updatedUserData.full_name) {
            safeToast('Le nom est requis.', 'error');
            return;
        }

        try {
            // Vérifier si le rôle a changé
            const currentUser = users.find(u => u.id === updatedUserData.id);
            const roleChanged = currentUser && currentUser.role !== updatedUserData.role;

            let result;
            if (roleChanged) {
                // Utiliser le gestionnaire de statut pour les changements de rôle
                result = await userStatusManager.updateUserRole(updatedUserData.id, updatedUserData.role);
                if (!result.success) throw new Error(result.error);
            } else {
                // Mise à jour simple du nom
                const { data: updatedUser, error } = await supabase
                    .from('users')
                    .update({ 
                        full_name: updatedUserData.full_name,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', updatedUserData.id)
                    .select()
                    .single();

                if (error) throw error;
                result = { success: true, user: updatedUser };
            }

            setUsers(prev => prev.map(u => u.id === updatedUserData.id ? result.user : u));
            safeToast(`Utilisateur ${updatedUserData.full_name} mis à jour avec succès.`, 'success');
            
        } catch (error) {
            console.error('Error in handleEditSubmit:', error);
            safeToast(`La mise à jour a échoué: ${error.message}`, 'error');
        }
        
        setIsEditModalOpen(false);
    };

    const filteredUsers = useMemo(() => users.filter(user => {
        const searchMatch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const roleMatch = roleFilter === 'all' || user.role === roleFilter;
        const statusMatch = statusFilter === 'all' || user.verification_status === statusFilter;
        return searchMatch && roleMatch && statusMatch;
    }), [users, searchTerm, roleFilter, statusFilter]);

    if (loading) return <div className="flex items-center justify-center h-full"><LoadingSpinner size="large" /></div>;
    
    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto py-12 px-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Gestion des Comptes</h1>
                        <p className="text-muted-foreground">Gérez tous les utilisateurs de la plateforme.</p>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}><PlusCircle className="mr-2 h-4 w-4"/> Créer un compte</Button>
                </div>
                
                <UserFilters 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    roleFilter={roleFilter}
                    setRoleFilter={setRoleFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    users={users}
                />

                <UserTable users={filteredUsers} onAction={handleAction} onEdit={openEditModal} />
            </motion.div>
            
            <AddUserWizard isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} onUserAdded={(newUser) => setUsers(prev => [newUser, ...prev])} />

            {editingUser && (
                <EditUserDialog 
                    isOpen={isEditModalOpen} 
                    setIsOpen={setIsEditModalOpen} 
                    user={editingUser} 
                    onUserUpdated={handleEditSubmit} 
                />
            )}
        </>
    );
};

export default AdminUsersPage;
