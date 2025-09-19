import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MoreHorizontal, 
  Trash2, 
  Ban, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  UserX, 
  Edit, 
  Shield, 
  Eye, 
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import userActionsManager from '@/lib/userActionsManager';

const UserActions = ({ user, onUserUpdated, onUserDeleted }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  // Fonction utilitaire pour afficher les toasts
  const showToast = (message, type = 'info') => {
    console.log(`${type.toUpperCase()}: ${message}`);
    // TODO: Intégrer avec le système de toast réel
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async () => {
    setIsLoading(true);
    setActiveAction('delete');
    
    try {
      const result = await userActionsManager.deleteUser(user.id);
      
      if (result.success) {
        showToast(result.message, 'success');
        onUserDeleted(user.id);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Bannir un utilisateur
  const handleBanUser = async () => {
    if (!banReason.trim()) {
      showToast('Veuillez spécifier une raison', 'error');
      return;
    }

    setIsLoading(true);
    setActiveAction('ban');
    
    try {
      const result = await userActionsManager.banUser(user.id, banReason);
      
      if (result.success) {
        showToast(result.message, 'success');
        onUserUpdated(result.bannedUser);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Erreur lors du bannissement', 'error');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
      setIsBanDialogOpen(false);
      setBanReason('');
    }
  };

  // Débannir un utilisateur
  const handleUnbanUser = async () => {
    setIsLoading(true);
    setActiveAction('unban');
    
    try {
      const result = await userActionsManager.unbanUser(user.id);
      
      if (result.success) {
        showToast(result.message, 'success');
        onUserUpdated(result.unbannedUser);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Erreur lors du débannissement', 'error');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  // Approuver un utilisateur
  const handleApproveUser = async () => {
    setIsLoading(true);
    setActiveAction('approve');
    
    try {
      const result = await userActionsManager.approveUser(user.id);
      
      if (result.success) {
        showToast(result.message, 'success');
        onUserUpdated(result.approvedUser);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Erreur lors de l\'approbation', 'error');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  // Rejeter un utilisateur
  const handleRejectUser = async () => {
    if (!rejectReason.trim()) {
      showToast('Veuillez spécifier une raison', 'error');
      return;
    }

    setIsLoading(true);
    setActiveAction('reject');
    
    try {
      const result = await userActionsManager.rejectUser(user.id, rejectReason);
      
      if (result.success) {
        showToast(result.message, 'success');
        onUserUpdated(result.rejectedUser);
      } else {
        showToast(result.message, 'error');
      }
    } catch (error) {
      showToast('Erreur lors du rejet', 'error');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
      setIsRejectDialogOpen(false);
      setRejectReason('');
    }
  };

  // Obtenir le statut de l'utilisateur
  const getUserStatus = () => {
    const status = user.status || 'active';
    const verification = user.verification_status || 'pending';
    
    if (status === 'banned') {
      return { type: 'banned', label: 'Banni', color: 'bg-red-500' };
    }
    
    switch (verification) {
      case 'verified':
        return { type: 'verified', label: 'Vérifié', color: 'bg-green-500' };
      case 'rejected':
        return { type: 'rejected', label: 'Rejeté', color: 'bg-red-500' };
      case 'pending':
      default:
        return { type: 'pending', label: 'En attente', color: 'bg-yellow-500' };
    }
  };

  const userStatus = getUserStatus();
  const isBanned = user.status === 'banned';
  const isVerified = user.verification_status === 'verified';
  const isPending = user.verification_status === 'pending';
  const isRejected = user.verification_status === 'rejected';

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Badge de statut */}
        <Badge className={`${userStatus.color} text-white text-xs`}>
          {userStatus.label}
        </Badge>

        {/* Menu d'actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions utilisateur</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Actions de base */}
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              Voir le profil
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Actions de vérification */}
            {isPending && (
              <>
                <DropdownMenuItem 
                  className="cursor-pointer text-green-600"
                  onClick={handleApproveUser}
                  disabled={isLoading || activeAction === 'approve'}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {activeAction === 'approve' ? 'Approbation...' : 'Approuver'}
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600"
                  onClick={() => setIsRejectDialogOpen(true)}
                  disabled={isLoading}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </DropdownMenuItem>
              </>
            )}
            
            {/* Actions de bannissement */}
            <DropdownMenuSeparator />
            
            {!isBanned ? (
              <DropdownMenuItem 
                className="cursor-pointer text-orange-600"
                onClick={() => setIsBanDialogOpen(true)}
                disabled={isLoading}
              >
                <Ban className="mr-2 h-4 w-4" />
                Bannir
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="cursor-pointer text-green-600"
                onClick={handleUnbanUser}
                disabled={isLoading || activeAction === 'unban'}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                {activeAction === 'unban' ? 'Débannissement...' : 'Débannir'}
              </DropdownMenuItem>
            )}
            
            {/* Action de suppression */}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isLoading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{user.full_name}</strong> ?
              Cette action est irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de bannissement */}
      <AlertDialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <Ban className="h-5 w-5" />
              Bannir l'utilisateur
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bannir <strong>{user.full_name}</strong> l'empêchera d'accéder à l'application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="ban_reason">Raison du bannissement *</Label>
              <Textarea
                id="ban_reason"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Expliquez la raison du bannissement..."
                className="mt-1"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBanUser}
              disabled={isLoading || !banReason.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Bannissement...
                </>
              ) : (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  Bannir
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de rejet */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Rejeter l'utilisateur
            </AlertDialogTitle>
            <AlertDialogDescription>
              Rejeter la demande de <strong>{user.full_name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject_reason">Raison du rejet *</Label>
              <Textarea
                id="reject_reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Expliquez la raison du rejet..."
                className="mt-1"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectUser}
              disabled={isLoading || !rejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Rejet...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserActions;

