import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AuthTestPage = () => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();

  const loginAsAdmin = () => {
    const adminAuth = {
      user: {
        email: 'admin@terangafoncier.com',
        user_metadata: {
          role: 'admin',
          name: 'Admin Demo'
        }
      },
      session: { access_token: 'temp_token' }
    };

    localStorage.setItem('temp_auth', JSON.stringify(adminAuth));
    window.location.reload();
  };

  const clearAuth = () => {
    localStorage.removeItem('temp_auth');
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>🔍 Test Authentification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">État actuel:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              Loading: {loading.toString()}
              {'\n'}User: {user ? JSON.stringify(user, null, 2) : 'null'}
              {'\n'}Session: {session ? JSON.stringify(session, null, 2) : 'null'}
            </pre>
          </div>
          
          <div className="space-x-4">
            <Button onClick={loginAsAdmin}>
              Se connecter comme Admin
            </Button>
            <Button variant="outline" onClick={clearAuth}>
              Déconnecter
            </Button>
            <Button variant="secondary" onClick={() => navigate('/admin')}>
              Aller au Dashboard Admin
            </Button>
          </div>

          <div>
            <h3 className="font-semibold">LocalStorage:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {localStorage.getItem('temp_auth') || 'Aucune auth temporaire'}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold">Rôle détecté:</h3>
            <p className="text-lg font-semibold text-emerald-600">
              {user?.user_metadata?.role || 'Aucun rôle'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTestPage;
