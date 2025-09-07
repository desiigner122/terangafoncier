import { useAuth } from '@/contexts/AuthProvider';

/**
 * Hook pour accÃ©der aux donnÃ©es utilisateur avec protection contre les boucles
 */
export const useUser = () => {
  const context = useAuth();
  
  if (!context) {
    throw new Error('useUser must be used within a SupabaseAuthProvider');
  }

  return {
    user: context.user,
    profile: context.profile,
    loading: context.loading,
    revalidate: context.revalidate,
    signOut: context.signOut,
    updateProfile: context.updateProfile,
    isRevalidating: context.isRevalidating
  };
};


