// Page de test rapide des comptes pour validation migration
import React, { useState } from 'react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, User, Settings, Key } from 'lucide-react';

const TestAuthPage = () => {
  const { 
    user, 
    signIn, 
    signOut, 
    quickSignIn, 
    getTestAccounts, 
    isLocalMode, 
    setLocalMode,
    loading 
  } = useAuth();

  const [loginForm, setLoginForm] = useState({
    email: 'admin@teranga.com',
    password: 'admin123'
  });

  const testAccounts = getTestAccounts();

  const handleLogin = async (e) => {
    e.preventDefault();
    await signIn(loginForm.email, loginForm.password);
  };

  const handleQuickLogin = async (role) => {
    await quickSignIn(role);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const toggleMode = () => {
    setLocalMode(!isLocalMode);
    window.location.reload(); // Recharger pour appliquer le changement
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">🧪 Test Authentification</h1>
          <p className="text-gray-600">Validation de la migration Supabase → Express API</p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant={isLocalMode ? "secondary" : "default"}>
              {isLocalMode ? "Mode Local" : "Mode API"}
            </Badge>
            <Button variant="outline" size="sm" onClick={toggleMode}>
              <Settings className="h-4 w-4 mr-1" />
              Basculer mode
            </Button>
          </div>
        </div>

        {/* État de connexion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {user ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Connecté
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Non connecté
                </>
              )}
            </CardTitle>
            <CardDescription>
              {user ? `Bienvenue ${user.user_metadata?.name || user.email}` : 'Veuillez vous connecter'}
            </CardDescription>
          </CardHeader>
          {user && (
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  <span className="font-medium">Rôle:</span> 
                  <Badge>{user.user_metadata?.role || 'Non défini'}</Badge>
                </div>
                <div className="pt-2">
                  <Button onClick={handleLogout} variant="outline">
                    Se déconnecter
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Tests de connexion */}
        {!user && (
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Connexion Manuelle</TabsTrigger>
              <TabsTrigger value="quick">Connexion Rapide</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle>Connexion avec Email/Mot de passe</CardTitle>
                  <CardDescription>
                    Testez la connexion avec les comptes créés dans l'API
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="admin@teranga.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="admin123"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Se connecter
                    </Button>
                  </form>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Comptes API disponibles:</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>• admin@teranga.com / admin123</div>
                      <div>• test@teranga.com / test123</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quick">
              <Card>
                <CardHeader>
                  <CardTitle>Connexion Rapide (Mode Test)</CardTitle>
                  <CardDescription>
                    {isLocalMode 
                      ? "Comptes de test intégrés - Pas de mot de passe requis"
                      : "Disponible uniquement en mode local"
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLocalMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {testAccounts.map((account) => (
                        <Button
                          key={account.role}
                          variant="outline"
                          onClick={() => handleQuickLogin(account.role)}
                          className="h-auto p-4 flex flex-col items-start space-y-1"
                        >
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-gray-500">{account.email}</div>
                          <Badge variant="secondary" className="text-xs">
                            {account.role}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Connexion rapide disponible uniquement en mode local</p>
                      <Button onClick={toggleMode} className="mt-4">
                        Activer le mode local
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Informations système */}
        <Card>
          <CardHeader>
            <CardTitle>État du Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Frontend</div>
                <div className="text-green-600">✅ React + Vite</div>
                <div className="text-green-600">✅ Port 5173</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Backend</div>
                <div className="text-green-600">✅ Express API</div>
                <div className="text-green-600">✅ Port 3000</div>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Database</div>
                <div className="text-green-600">✅ SQLite</div>
                <div className="text-red-500">❌ Supabase désactivé</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions après connexion */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Actions Disponibles</CardTitle>
              <CardDescription>
                Testez les fonctionnalités après connexion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = unifiedAuth.getDefaultDashboard()}
                >
                  Aller au Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/properties'}
                >
                  Voir les Propriétés
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => console.log('Current user:', user)}
                >
                  Debug Console
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                >
                  Retour Accueil
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
};

export default TestAuthPage;