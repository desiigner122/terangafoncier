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
  AlertTriangle,
  UserCog
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/customSupabaseClient';

const ROLES = [
  'Particulier',
  'Vendeur Particulier', 
  'Vendeur Professionnel',
  'Géomètre',
  'Notaire',
  'Mairie',
  'Banque',
  'Agent Foncier'
];

const FixedUserActions = ({ user, onUserUpdated, onUserDeleted }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [newRole, setNewRole] = useState(user?.role || '');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState(null);

  // Fonction utilitaire pour afficher les toasts
  const showToast = (message, variant = 'default') => {
    if (window.safeGlobalToast) {
      window.safeGlobalToast({
        description: message,
        variant: variant
      });
    } else {
      console.log(`Toast: ${message}`);
    }
  };

  // Fonction générique pour les actions utilisateur
  const performUserAction = async (action, data = {}) => {
    setIsLoading(true);
    setActiveAction(action);
    
    try {
      let result;
      
      switch (action) {
        case 'delete':
          result = await supabase
            .from('users')
            .delete()
            .eq('id', user.id);
          break;
          
        case 'ban':
          result = await supabase
            .from('users')
            .update({ 
              status: 'banned',
              ban_reason: data.reason,
              banned_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select();
          break;
          
        case 'unban':
          result = await supabase
            .from('users')
            .update({ 
              status: 'active',
              ban_reason: null,
              banned_at: null
            })
            .eq('id', user.id)
            .select();
          break;
          
        case 'approve':
          result = await supabase
            .from('users')
            .update({ 
              verification_status: 'verified',
              verified_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select();
          break;
          
        case 'reject':
          result = await supabase
            .from('users')
            .update({ 
              verification_status: 'rejected',
              rejection_reason: data.reason,
              rejected_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select();
          break;
          
        case 'changeRole':
          result = await supabase
            .from('users')
            .update({ 
              role: data.newRole,
              role_changed_at: new Date().toISOString()
            })
            .eq('id', user.id)
            .select();
          break;
          
        default:
          throw new Error(`Action inconnue: ${action}`);
      }

      if (result.error) {
        throw result.error;
      }

      // Callbacks de succès
      switch (action) {
        case 'delete':
          showToast('Utilisateur supprimé avec succès', 'default');
          if (onUserDeleted) onUserDeleted(user);
          break;
          
        case 'ban':
          showToast('Utilisateur banni avec succès', 'default');
          if (onUserUpdated) onUserUpdated({ ...user, status: 'banned', ban_reason: data.reason });
          break;
          
        case 'unban':
          showToast('Utilisateur débanni avec succès', 'default');
          if (onUserUpdated) onUserUpdated({ ...user, status: 'active', ban_reason: null });
          break;
          
        case 'approve':
          showToast('Utilisateur approuvé avec succès', 'default');
          if (onUserUpdated) onUserUpdated({ ...user, verification_status: 'verified' });
          break;
          
        case 'reject':
          showToast('Utilisateur rejeté', 'default');
          if (onUserUpdated) onUserUpdated({ ...user, verification_status: 'rejected', rejection_reason: data.reason });
          break;
          
        case 'changeRole':
          showToast(`Rôle changé vers ${data.newRole}`, 'default');
          if (onUserUpdated) onUserUpdated({ ...user, role: data.newRole });
          break;
      }

      // Fermer les dialogs
      setIsDeleteDialogOpen(false);
      setIsBanDialogOpen(false);
      setIsRejectDialogOpen(false);
      setIsRoleDialogOpen(false);
      setBanReason('');
      setRejectReason('');

    } catch (error) {
      console.error(`Erreur ${action}:`, error);
      showToast(`Erreur lors de l'action: ${error.message}`, 'destructive');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  // Actions spécifiques
  const handleDelete = () => {
    performUserAction('delete');
  };

  const handleBan = () => {
    if (!banReason.trim()) {
      showToast('Veuillez spécifier une raison pour le bannissement', 'destructive');
      return;
    }
    performUserAction('ban', { reason: banReason });
  };

  const handleUnban = () => {
    performUserAction('unban');
  };

  const handleApprove = () => {
    performUserAction('approve');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      showToast('Veuillez spécifier une raison pour le rejet', 'destructive');
      return;
    }
    performUserAction('reject', { reason: rejectReason });
  };

  const handleRoleChange = () => {
    if (!newRole || newRole === user.role) {
      showToast('Veuillez sélectionner un nouveau rôle', 'destructive');
      return;
    }
    performUserAction('changeRole', { newRole });
  };

  const getStatusBadge = () => {
    switch (user.status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Actif</Badge>;
      case 'banned':
        return <Badge variant="destructive">Banni</Badge>;
      case 'suspended':
        return <Badge variant="secondary">Suspendu</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getVerificationBadge = () => {
    switch (user.verification_status) {
      case 'verified':
        return <Badge variant="default" className="bg-blue-500">Vérifié</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="outline">Non défini</Badge>;
    }
  };

  const canApprove = user.verification_status === 'pending';
  const canReject = user.verification_status === 'pending';
  const canBan = user.status === 'active';
  const canUnban = user.status === 'banned';

  return (
    <>
      <div className="flex items-center gap-2">
        {getStatusBadge()}
        {getVerificationBadge()}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Actions utilisateur</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Voir le profil
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={() => setIsRoleDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <UserCog className="h-4 w-4" />
              Modifier le rôle
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {canApprove && (
              <DropdownMenuItem 
                onClick={handleApprove}
                className="flex items-center gap-2 text-green-600"
                disabled={isLoading}
              >
                <CheckCircle className="h-4 w-4" />
                Approuver
              </DropdownMenuItem>
            )}
            
            {canReject && (
              <DropdownMenuItem 
                onClick={() => setIsRejectDialogOpen(true)}
                className="flex items-center gap-2 text-orange-600"
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4" />
                Rejeter
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            {canBan && (
              <DropdownMenuItem 
                onClick={() => setIsBanDialogOpen(true)}
                className="flex items-center gap-2 text-red-600"
                disabled={isLoading}
              >
                <Ban className="h-4 w-4" />
                Bannir
              </DropdownMenuItem>
            )}
            
            {canUnban && (
              <DropdownMenuItem 
                onClick={handleUnban}
                className="flex items-center gap-2 text-green-600"
                disabled={isLoading}
              >
                <UserCheck className="h-4 w-4" />
                Débannir
              </DropdownMenuItem>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2 text-red-600"
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmer la suppression
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{user.full_name || user.email}</strong> ?
              Cette action est irréversible et supprimera toutes les données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading && activeAction === 'delete' ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de bannissement */}
      <AlertDialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              Bannir l'utilisateur
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bannir <strong>{user.full_name || user.email}</strong> l'empêchera d'accéder à la plateforme.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="ban-reason">Raison du bannissement *</Label>
            <Textarea
              id="ban-reason"
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Expliquez la raison du bannissement..."
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBan}
              disabled={isLoading || !banReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading && activeAction === 'ban' ? 'Bannissement...' : 'Bannir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de rejet */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-orange-500" />
              Rejeter la demande
            </AlertDialogTitle>
            <AlertDialogDescription>
              Rejeter la demande de <strong>{user.full_name || user.email}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reject-reason">Raison du rejet *</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Expliquez la raison du rejet..."
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject}
              disabled={isLoading || !rejectReason.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading && activeAction === 'reject' ? 'Rejet...' : 'Rejeter'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de changement de rôle */}
      <AlertDialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-blue-500" />
              Modifier le rôle
            </AlertDialogTitle>
            <AlertDialogDescription>
              Changer le rôle de <strong>{user.full_name || user.email}</strong>.
              Rôle actuel: <Badge variant="outline">{user.role}</Badge>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="new-role">Nouveau rôle *</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Sélectionnez un nouveau rôle" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRoleChange}
              disabled={isLoading || !newRole || newRole === user.role}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && activeAction === 'changeRole' ? 'Modification...' : 'Modifier'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FixedUserActions;
