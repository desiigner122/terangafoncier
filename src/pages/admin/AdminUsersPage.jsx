
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast-simple";
import { LoadingSpinner } from '@/components/ui/spinner';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import AddUserWizard from './components/AddUserWizard';
import EditUserDialog from './components/EditUserDialog';
import UserFilters from './components/UserFilters';
import UserTable from './components/UserTable';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const { toast } = useToast();
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
    const { data, error } = await supabase.from('users').select('*');
        if (error) {
            console.error("Error fetching users:", error);
            toast({ title: 'Erreur', description: 'Impossible de charger les utilisateurs.', variant: 'destructive' });
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

        let updateData = {};
        let message = "";

        try {
            if (actionType === 'delete') {
                const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
                if (deleteError) throw deleteError;
                message = `Utilisateur ${user.full_name} supprimé.`;
                setUsers(prev => prev.filter(u => u.id !== userId));
            } else {
                switch(actionType) {
                    case 'ban':
                        updateData = { verification_status: 'banned' };
                        message = `Utilisateur ${user.full_name} banni.`;
                        break;
                    case 'unban':
                        updateData = { verification_status: 'verified' };
                        message = `Utilisateur ${user.full_name} débanni.`;
                        break;
                    case 'verify':
                        updateData = { verification_status: 'verified' };
                        message = `Utilisateur ${user.full_name} vérifié.`;
                        break;
                    default:
                        return;
                }

                const { data: updatedUser, error } = await supabase
                    .from('users')
                    .update(updateData)
                    .eq('id', userId)
                    .select()
                    .single();
                
                if (error) throw error;
                setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
            }
            toast({ title: 'Succès', description: message });
        } catch (error) {
            toast({ title: 'Erreur', description: `L'opération a échoué: ${error.message}`, variant: 'destructive' });
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (updatedUserData) => {
        if (!updatedUserData.full_name) {
            toast({ title: 'Erreur', description: 'Le nom est requis.', variant: 'destructive'});
            return;
        }
        
        const { data: updatedUser, error } = await supabase
            .from('users')
            .update({ full_name: updatedUserData.full_name, role: updatedUserData.role, user_type: updatedUserData.role })
            .eq('id', updatedUserData.id)
            .select()
            .single();

        if (error) {
            toast({ title: 'Erreur', description: 'La mise à jour a échoué.', variant: 'destructive' });
        } else {
            setUsers(prev => prev.map(u => u.id === updatedUserData.id ? updatedUser : u));
            toast({ title: 'Succès', description: `Utilisateur ${updatedUserData.full_name} mis à jour.` });
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
