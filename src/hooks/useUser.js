import { useAuth } from '@/context/SupabaseAuthContext';

/**
 * Hook to get current user information
 * Wraps the useAuth hook for easier access to user data
 */
export const useUser = () => {
  const { user, loading, signOut, revalidate } = useAuth();
  
  return {
    user,
    loading,
    signOut,
    revalidate,
    isAuthenticated: !!user
  };
};
