import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Dashboard Imports
import ParticulierDashboard from '@/pages/dashboards/particulier/CompleteSidebarParticulierDashboard';
import VendeurDashboard from '@/pages/dashboards/vendeur/VendeurDashboard';
import InvestisseurDashboard from '@/pages/dashboards/investisseur/InvestisseurDashboard';
import AgentFoncierDashboard from '@/pages/dashboards/agent-foncier/CompleteSidebarAgentFoncierDashboard';

import MunicipaliteDashboard from '@/pages/dashboards/municipalite/MunicipaliteDashboard';
import AdminDashboard from '@/pages/dashboards/admin/AdminDashboard';
import NotaireDashboard from '@/pages/dashboards/notaires/NotaireDashboard';
import GeometreDashboard from '@/pages/dashboards/geometres/GeometreDashboard';
import BanqueDashboard from '@/pages/dashboards/banques/BanqueDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, session } = useAuth();

  if (!session || !user) {
    return <Navigate to="/login" replace />;
  }

  // Pour Supabase, on récupère le rôle depuis les métadonnées et on normalise
  const userRole = user.user_metadata?.role?.toLowerCase?.() || '';
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log('❌ Accès refusé - Rôle:', userRole, 'Rôles autorisés:', allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Role-based Dashboard Selector
const DashboardSelector = () => {
  const { user } = useAuth();

  // Normaliser le rôle en minuscules pour la correspondance
  const userRole = user?.user_metadata?.role?.toLowerCase?.() || '';

  const dashboardMap = {
    'particulier': <ParticulierDashboard />,
    'vendeur': <VendeurDashboard />,
    'investisseur': <InvestisseurDashboard />,
    'agent_foncier': <AgentFoncierDashboard />,
    'promoteur': <Navigate to="/promoteur" replace />,
    'municipalite': <MunicipaliteDashboard />,
    'admin': <AdminDashboard />,
    'notaire': <NotaireDashboard />,
    'geometre': <GeometreDashboard />,
    'banque': <BanqueDashboard />
  };

  console.log('🎯 Sélecteur Dashboard - Rôle utilisateur:', userRole);
  console.log('🎯 Dashboard trouvé:', !!dashboardMap[userRole]);

  return dashboardMap[userRole] || <Navigate to="/select-role" replace />;
};

const DashboardRoutes = () => {
  return (
    <Routes>
      {/* Automatic Role-based Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardSelector />
          </ProtectedRoute>
        }
      />

      {/* Specific Dashboard Routes */}
      <Route
        path="/dashboard/particulier"
        element={
          <ProtectedRoute allowedRoles={['particulier', 'admin']}>
            <ParticulierDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/vendeur"
        element={
          <ProtectedRoute allowedRoles={['vendeur', 'admin']}>
            <VendeurDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/investisseur"
        element={
          <ProtectedRoute allowedRoles={['investisseur', 'admin']}>
            <InvestisseurDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/agent-foncier/*"
        element={
          <ProtectedRoute allowedRoles={['agent_foncier', 'admin']}>
            <AgentFoncierDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/municipalite"
        element={
          <ProtectedRoute allowedRoles={['municipalite', 'admin']}>
            <MunicipaliteDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/notaire"
        element={
          <ProtectedRoute allowedRoles={['notaire', 'admin']}>
            <NotaireDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/geometre"
        element={
          <ProtectedRoute allowedRoles={['geometre', 'admin']}>
            <GeometreDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/banque"
        element={
          <ProtectedRoute allowedRoles={['banque', 'admin']}>
            <BanqueDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default DashboardRoutes;
