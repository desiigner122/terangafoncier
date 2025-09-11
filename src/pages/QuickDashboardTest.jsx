import React from 'react';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { localAuth } from '@/services/LocalAuthService';

const QuickDashboardTest = () => {
  const { user, signIn } = useAuth();

  const testDashboards = [
    { name: 'Admin', role: 'Admin', path: '/admin' },
    { name: 'Particulier', role: 'Particulier', path: '/particulier' },
    { name: 'Agent Foncier', role: 'Agent Foncier', path: '/agent-foncier' },
    { name: 'Notaire', role: 'Notaire', path: '/notaire' },
    { name: 'Géomètre', role: 'Géomètre', path: '/geometre' },
    { name: 'Banque', role: 'Banque', path: '/banque' },
    { name: 'Promoteur', role: 'Promoteur', path: '/promoteur' },
    { name: 'Lotisseur', role: 'Lotisseur', path: '/lotisseur' },
    { name: 'Mairie', role: 'Mairie', path: '/mairie' }
  ];

  const quickSignIn = async (role) => {
    try {
      const result = await localAuth.quickSignIn(role);
      if (result.success) {
        // Simuler la connexion dans le contexte
        await signIn(result.user.email, 'demo123');
        // Rediriger vers le dashboard
        window.location.href = testDashboards.find(d => d.role === role)?.path || '/';
      }
    } catch (error) {
      console.error('Erreur de connexion rapide:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">
            🚀 Test d'Accès Rapide aux Dashboards
          </h1>
          <p className="text-lg text-emerald-600">
            Testez l'accès instantané aux 9 dashboards de Teranga Foncier
          </p>
          {user && (
            <div className="mt-4 p-4 bg-emerald-100 rounded-lg">
              <p className="text-emerald-800">
                ✅ Connecté en tant que: <strong>{user.email}</strong> ({user.role})
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testDashboards.map((dashboard) => (
            <div
              key={dashboard.role}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-emerald-500"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {dashboard.name}
                </h3>
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Rôle: <span className="font-medium">{dashboard.role}</span>
              </p>
              
              <div className="space-y-2">
                <button
                  onClick={() => quickSignIn(dashboard.role)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  🔐 Connexion Rapide
                </button>
                
                <a
                  href={dashboard.path}
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg text-center transition-colors duration-200"
                >
                  👁️ Accès Direct
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📊 Statut du Système
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">9</div>
                <div className="text-gray-600">Dashboards Disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">✅</div>
                <div className="text-gray-600">Authentification Locale</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">🚀</div>
                <div className="text-gray-600">Accès Instantané</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickDashboardTest;
