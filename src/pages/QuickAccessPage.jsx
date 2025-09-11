import React from 'react';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { localAuth } from '@/services/LocalAuthService';
import { useNavigate } from 'react-router-dom';

const QuickAccessPage = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();

  const quickLogin = (role) => {
    const result = localAuth.quickSignIn(role);
    if (result.user) {
      window.location.href = `/${role === 'particular' ? 'particulier' : role === 'agent_foncier' ? 'agent-foncier' : role}`;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🚀 Accès Rapide Dashboards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">État actuel :</h3>
              <p>Utilisateur connecté : {user ? '✅ Oui' : '❌ Non'}</p>
              <p>Email : {user?.email || 'Aucun'}</p>
              <p>Rôle : {user?.user_metadata?.role || 'Aucun'}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => quickLogin('admin')} className="bg-red-500 hover:bg-red-600">
                Admin
              </Button>
              <Button onClick={() => quickLogin('particular')} className="bg-blue-500 hover:bg-blue-600">
                Particulier
              </Button>
              <Button onClick={() => quickLogin('agent_foncier')} className="bg-green-500 hover:bg-green-600">
                Agent Foncier
              </Button>
              <Button onClick={() => quickLogin('banque')} className="bg-purple-500 hover:bg-purple-600">
                Banque
              </Button>
              <Button onClick={() => quickLogin('notaire')} className="bg-orange-500 hover:bg-orange-600">
                Notaire
              </Button>
              <Button onClick={() => quickLogin('geometre')} className="bg-teal-500 hover:bg-teal-600">
                Géomètre
              </Button>
              <Button onClick={() => quickLogin('promoteur')} className="bg-yellow-500 hover:bg-yellow-600">
                Promoteur
              </Button>
              <Button onClick={() => quickLogin('mairie')} className="bg-pink-500 hover:bg-pink-600">
                Mairie
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickAccessPage;
