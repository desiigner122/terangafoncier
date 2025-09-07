import { useAuth } from '@/contexts/AuthProvider';

/**
 * Hook to get current user information
 * Wraps the useSupabaseAuth hook for easier access to user data
 */
export const useUser = () => {
  const { user, profile, loading, signOut, revalidate } = useAuth();
  
  return {
    user,
    profile,
    loading,
    signOut,
    revalidate,
    isAuthenticated: !!user
  };
};


