
import React from 'react';
import { Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { LoadingSpinner } from '@/components/ui/spinner';
import { hasPermission, getAccessDeniedMessage, getDefaultDashboard } from '@/lib/rbacConfig';
// useToast import supprimé - utilisation window.safeGlobalToast

const ProtectedRoute = ({ children }) => {
  try {
    const authContext = useAuth();
    const { user, profile, loading } = authContext;
    const location = useLocation();

    console.log('🛡️ ProtectedRoute state:', { 
      hasUser: !!user, 
      hasProfile: !!profile, 
      loading,
      userId: user?.id,
      userEmail: user?.email,
      profileRole: profile?.role,
      currentPath: location.pathname
    });

    if (loading) {
      console.log('🔄 ProtectedRoute: Loading...');
      return (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size="large" />
        </div>
      );
    }

    // TEMPORARY DEBUG MODE: Allow access without authentication for debugging
    if (process.env.NODE_ENV === 'development' && location.pathname.includes('debug')) {
      console.log('🐛 DEBUG MODE: Allowing access without auth');
      return children ? children : <Outlet />;
    }

    if (!user) {
      console.log('🚪 ProtectedRoute: No user, redirecting to login');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // VÉRIFICATION CRITIQUE: Bloquer les utilisateurs bannis
    if (profile && profile.verification_status === 'banned') {
      console.log('🚫 ProtectedRoute: User is banned');
      return <Navigate to="/banned" state={{ from: location }} replace />;
    }

    // TEMPORARY: Allow access even without profile for debugging
    if (!profile) {
      console.log('⚠️ User has no profile, but allowing access for debugging');
    }

    console.log('✅ ProtectedRoute: Access granted');
    return children ? children : <Outlet />;
  } catch (error) {
    console.error('💥 ProtectedRoute error:', error);
    // Fallback to login if there's any error
    return <Navigate to="/login" replace />;
  }
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
    
    // VÉRIFICATION CRITIQUE: Bloquer les utilisateurs bannis
    if (profile.verification_status === 'banned') {
        return <Navigate to="/banned" state={{ from: location }} replace />;
    }
    
    const requiresVerification = ['Particulier', 'Vendeur Particulier', 'Vendeur Pro', 'Investisseur', 'Promoteur', 'Agriculteur'].includes(profile.user_type);

    if (requiresVerification) {
        if (profile.verification_status === 'unverified') {
            return <Navigate to="/verify" state={{ from: location }} replace />;
        }
        if (profile.verification_status === 'pending') {
            return <Navigate to="/pending-verification" state={{ from: location }} replace />;
        }
        if (profile.verification_status === 'rejected') {
            return <Navigate to="/verify" state={{ from: location, error: "Your previous submission was rejected. Please resubmit." }} replace />;
        }
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

  if (!profile || profile.role !== 'Admin') {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export const RoleProtectedRoute = ({ children, allowedRoles = [], permission = null }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

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
    return <Navigate to="/profile" replace />;
  }

  // Vérifier si l'utilisateur est banni
  if (profile.banned) {
    return <Navigate to="/banned" replace />;
  }

  // Si une permission spécifique est requise, la vérifier
  if (permission && !hasPermission(profile.role, permission)) {
    return <Navigate to={`/access-denied?permission=${permission}&role=${profile.role}`} replace />;
  }

  // Vérifier le rôle si pas de permission spécifique
  if (!permission && !allowedRoles.includes(profile.role)) {
    return <Navigate to={`/access-denied?role=${profile.role}&required=${allowedRoles.join(',')}`} replace />;
  }

  return children;
};


export default ProtectedRoute;


