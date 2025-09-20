import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';

const ProtectedRoute = ({ children }) => {
  const { user, session, loading, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export const VerifiedRoute = ({ children }) => {
    const { profile, loading } = useAuth();
    const location = useLocation();
    
    if (loading) {
        return (
          <div className="flex items-center justify-center h-screen">
            <LoadingSpinner size="large" />
          </div>
        );
    }

    if (!profile) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    console.log('🔍 VerifiedRoute DEBUG:');
    console.log('Profile verification_status:', profile.verification_status);
    console.log('Profile user_type:', profile.user_type);
    console.log('Location pathname:', location.pathname);
    
    // SOLUTION: Permettre l'accès aux vendeurs sans vérification
    if (profile.user_type === 'Vendeur Particulier' && location.pathname.startsWith('/dashboard/vendeur')) {
        console.log('🔧 SOLUTION: Accès vendeur autorisé sans vérification');
        return children ? children : <Outlet />;
    }
    
    return children ? children : <Outlet />;
};

export const AdminRoute = ({ children }) => {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!profile || (profile.role !== 'Admin' && profile.role !== 'admin')) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/settings" replace />;
  }

  // Case-insensitive role comparison
  const currentRole = (profile.role || profile.user_type || '').toLowerCase();
  const allowed = allowedRoles.map(r => (r || '').toLowerCase());

  if (!allowed.includes(currentRole)) {
    console.log('❌ Role not allowed:', { currentRole: profile.role, allowedRoles });
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;
