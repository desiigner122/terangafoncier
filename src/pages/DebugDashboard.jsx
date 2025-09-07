import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/contexts/AuthProvider';

const DebugDashboard = () => {
  const { user, profile, loading: userLoading } = useUser();
  const { user: authUser, loading: authLoading } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebugInfo({
        userLoading,
        authLoading,
        user: user ? {
          id: user.id,
          email: user.email,
          role: user.role,
          metadata: user.user_metadata
        } : null,
        profile: profile ? {
          id: profile.id,
          role: profile.role,
          firstName: profile.firstName,
          lastName: profile.lastName
        } : null,
        authUser: authUser ? {
          id: authUser.id,
          email: authUser.email
        } : null
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [user, profile, authUser, userLoading, authLoading]);

  if (userLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Chargement... (User: {userLoading ? 'loading' : 'loaded'}, Auth: {authLoading ? 'loading' : 'loaded'})
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">ðŸ” Dashboard Debug</h1>
        
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ã‰tat des Hooks</h2>
            <div className="space-y-2">
              <p><strong>User Loading:</strong> {userLoading.toString()}</p>
              <p><strong>Auth Loading:</strong> {authLoading.toString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Utilisateur (useUser)</h2>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(debugInfo.user, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profil (useUser)</h2>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(debugInfo.profile, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Auth User (useAuth)</h2>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
              {JSON.stringify(debugInfo.authUser, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">RÃ´le DÃ©terminÃ©</h2>
            <div className="space-y-2">
              <p><strong>Profile Role:</strong> {profile?.role || 'Aucun'}</p>
              <p><strong>User Metadata Role:</strong> {user?.user_metadata?.role || 'Aucun'}</p>
              <p><strong>User Role:</strong> {user?.role || 'Aucun'}</p>
              <p><strong>Dashboard RecommandÃ©:</strong> 
                {!user ? 'Login requis' : 
                 profile?.role === 'ADMIN' ? 'Admin Dashboard' :
                 profile?.role === 'PARTICULIER_DIASPORA' ? 'Acheteur Dashboard (Diaspora)' :
                 'Acheteur Dashboard (Standard)'}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">Actions de Debug</h2>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.reload()}
                className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
              >
                Recharger la Page
              </button>
              <button 
                onClick={() => localStorage.clear()}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 ml-4"
              >
                Vider le LocalStorage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugDashboard;


