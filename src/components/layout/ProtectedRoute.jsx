
import React from 'react';
import { Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/SupabaseAuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';
import { hasPermission, getAccessDeniedMessage, getDefaultDashboard } from '@/lib/rbacConfig';
// useToast import supprimé - utilisation window.safeGlobalToast

const ProtectedRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // VÉRIFICATION CRITIQUE: Bloquer les utilisateurs bannis
  if (profile && profile.verification_status === 'banned') {
    return <Navigate to="/banned" state={{ from: location }} replace />;
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

