import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import userStatusManager from '@/lib/userStatusManager';
// useToast import supprimé - utilisation window.safeGlobalToast

export const useUserStatusMonitor = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  // toast remplacé par window.safeGlobalToast

  const handleUserStatusChange = useCallback(async (change) => {
    if (!user) return;

    console.log('📡 Changement statut reçu:', change);

    // Si le changement concerne l'utilisateur actuel
    if (change.user.id === user.id) {
      switch (change.type) {
        case 'USER_STATUS_CHANGED':
          if (change.user.verification_status === 'banned') {
            window.safeGlobalToast({
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
          window.safeGlobalToast({
            title: '🔄 Rôle mis à jour',
            description: `Votre rôle a été changé vers: ${change.user.role}`,
            variant: 'default'
          });
          
          // Note: revalidation non disponible dans SupabaseAuthContextFixed
          break;

        case 'USER_SESSION_INVALIDATED':
          if (change.reason === 'banned') {
            await signOut();
            navigate('/banned');
          }
          break;
      }
    }
  }, [user, signOut, navigate]);

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
        window.safeGlobalToast({
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
  }, [user?.id, signOut, navigate]);

  return {
    isMonitoring: userStatusManager.isListening
  };
};

export default useUserStatusMonitor;



