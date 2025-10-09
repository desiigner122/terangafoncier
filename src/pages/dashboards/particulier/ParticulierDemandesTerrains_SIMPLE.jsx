import React from 'react';
import { useOutletContext } from 'react-router-dom';

const ParticulierDemandesTerrains = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};

  // Vérification du contexte
  if (!outletContext) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement du contexte utilisateur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Demandes de Terrains Communaux</h1>
        <p className="text-gray-600 mt-2">Page en cours de développement</p>
        {user && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800">Utilisateur connecté: {user.email || 'Email non disponible'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticulierDemandesTerrains;