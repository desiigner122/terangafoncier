import React, { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContextFixed'; 
import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  User, 
  Database, 
  TestTube2, 
  AlertTriangle
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const TestAccountsPage = () => {
  const { register: supabaseRegister, setSimulatedUser, loading: authLoading } = useSupabaseAuth();
  const navigate = useNavigate();
  // toast remplacÃ© par window.safeGlobalToast
  const [loadingAccountId, setLoadingAccountId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  // Récupérer les utilisateurs de test depuis Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setFetchError(null);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .limit(12);
        if (error) throw error;
        setUsers(data);
      } catch (err) {
        setFetchError(err.message);
        setUsers([]);
        console.error('Erreur lors du chargement des utilisateurs de test:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = async (user) => {
    setLoadingAccountId(user.id);
    try {
      setSimulatedUser(user);
      window.safeGlobalToast({
        title: "Connexion Réussie (Simulation)",
        description: `Connecté en tant que ${user.name}.`,
      });
      navigate('/dashboard');
    } catch (error) {
      window.safeGlobalToast({
        title: "Échec de la connexion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingAccountId(null);
    }
  };

  const handleRealAccountCreation = async (user) => {
    setLoadingAccountId(user.id);
    try {
        const realEmail = user.email.replace('@teranga.sn', `@real.teranga.sn`);
        const { user: newUser } = await supabaseRegister({
            email: realEmail,
            password: 'password123',
            fullName: user.full_name,
            userType: user.role
        });
        window.safeGlobalToast({
            title: "Compte Réel Créé!",
            description: `Compte pour ${newUser.email} créé avec succès sur Supabase.`,
        });
    } catch (error) {
        window.safeGlobalToast({
            title: "Erreur de Création",
            description: error.message.includes('User already registered') ? `L'utilisateur ${user.email.replace('@teranga.sn', '@real.teranga.sn')} existe déjà.` : error.message,
            variant: "destructive",
        });
    } finally {
        setLoadingAccountId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Comptes de Test</h1>
      <p className="text-muted-foreground mb-8">Utilisez ces comptes pour tester les différentes fonctionnalités de la plateforme.</p>
      <Alert className="mb-8 border-blue-500">
        <TestTube2 className="h-4 w-4" />
        <AlertTitle className="font-semibold">Mode de Test</AlertTitle>
        <AlertDescription>
          Choisissez entre créer un compte réel sur la base de données ou utiliser un compte de simulation rapide.
        </AlertDescription>
      </Alert>

      {loadingUsers ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="large" />
        </div>
      ) : fetchError ? (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary"/>{user.name || user.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                  {user.verification_status === 'verified' && <span className="text-xs text-green-600 font-medium">Vérifié</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-2 text-sm">
                <p><span className="font-semibold">Email:</span> {user.email}</p>
                <p><span className="font-semibold">Mot de passe:</span> password123</p>
              </CardContent>
              <CardContent className="flex flex-col sm:flex-row gap-2">
                <Button 
                  className="w-full"
                  onClick={() => handleLogin(user)} 
                  disabled={loadingAccountId === user.id}
                >
                  {loadingAccountId === user.id ? 'Chargement...' : <><TestTube2 className="mr-2 h-4 w-4" />Simuler</>}
                </Button>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => handleRealAccountCreation(user)} 
                  disabled={loadingAccountId === user.id}
                >
                  {loadingAccountId === user.id ? 'Création...' : <><Database className="mr-2 h-4 w-4" />Créer Réel</>}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Alert variant="destructive" className="mt-12">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Attention</AlertTitle>
        <AlertDescription>
          Les comptes "réels" sont créés dans l'environnement de développement Supabase. Ne pas utiliser d'informations personnelles sensibles. L'email est modifié en `...@real.teranga.sn` pour éviter les conflits.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TestAccountsPage;

