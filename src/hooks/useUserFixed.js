import { useSupabaseAuth } from '@/contexts/SupabaseAuthContextFixed';

/**
 * Hook pour accéder aux données utilisateur avec protection contre les boucles
 */
export const useUser = () => {
  const context = useSupabaseAuth();
  
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
