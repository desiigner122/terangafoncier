import React from 'react';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const DebugRole = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🔍 Debug Rôle Utilisateur</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Informations utilisateur :</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify({
            userEmail: user?.email,
            userRole: user?.user_metadata?.role,
            normalizedRole: user?.user_metadata?.role?.toLowerCase(),
            fullMetadata: user?.user_metadata,
            userId: user?.id
          }, null, 2)}
        </pre>
        <div className="mt-4">
          <h3 className="font-semibold">Accès Agent Foncier :</h3>
          <p className="text-sm text-gray-600">
            Rôles autorisés : ['Agent Foncier', 'agent_foncier', 'admin']
          </p>
          <p className="text-sm">
            Votre rôle : <span className="font-mono bg-yellow-100 px-2 py-1 rounded">
              {user?.user_metadata?.role || 'Non défini'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebugRole;