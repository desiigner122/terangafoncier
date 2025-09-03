import { useEffect, useCallback } from 'react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import userStatusManager from '@/lib/userStatusManager';
import { useToast } from '@/components/ui/use-toast-simple';

export const useUserStatusMonitor = () => {
  const { user, revalidate, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUserStatusChange = useCallback(async (change) => {
    if (!user) return;

    console.log('📡 Changement statut reçu:', change);

    // Si le changement concerne l'utilisateur actuel
    if (change.user.id === user.id) {
      switch (change.type) {
        case 'USER_STATUS_CHANGED':
          if (change.user.verification_status === 'banned') {
            toast({
              title: '🚫 Compte suspendu',
              description: 'Votre compte a été suspendu. Vous allez être déconnecté.',
              variant: 'destructive'
            });
            
            // Délai pour permettre à l'utilisateur de voir le message
            setTimeout(async () => {
              await signOut();
              navigate('/banned');
            }, 2000);
          }
          break;

        case 'USER_ROLE_CHANGED':
          toast({
            title: '🔄 Rôle mis à jour',
            description: `Votre rôle a été changé vers: ${change.user.role}`,
            variant: 'default'
          });
          
          // Rafraîchir les données utilisateur
          await revalidate();
          break;

        case 'USER_SESSION_INVALIDATED':
          if (change.reason === 'banned') {
            await signOut();
            navigate('/banned');
          }
          break;
      }
    }
  }, [user, toast, signOut, navigate, revalidate]);

  useEffect(() => {
    if (!user) return;

    // S'abonner aux changements
    const unsubscribe = userStatusManager.subscribe(handleUserStatusChange);

    return unsubscribe;
  }, [user, handleUserStatusChange]);

  // Vérifier le statut au montage du composant
  useEffect(() => {
    const checkCurrentStatus = async () => {
      if (!user?.id) return;

      const currentUserData = await userStatusManager.checkUserSession(user.id);
      
      if (currentUserData?.verification_status === 'banned') {
        toast({
          title: '🚫 Compte suspendu',
          description: 'Votre compte a été suspendu.',
          variant: 'destructive'
        });
        
        setTimeout(async () => {
          await signOut();
          navigate('/banned');
        }, 1000);
      }
    };

    checkCurrentStatus();
  }, [user?.id, toast, signOut, navigate]);

  return {
    isMonitoring: userStatusManager.isListening
  };
};

export default useUserStatusMonitor;
