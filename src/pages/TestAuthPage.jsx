import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthProvider';
import { LogIn, LogOut, User, Mail, Phone, MapPin } from 'lucide-react';

const TestAuthPage = () => {
  const { user, profile, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('admin@terangafoncier.sn');
  const [password, setPassword] = useState('TerrangaAdmin2024!');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const mockAccounts = [
    { email: 'admin@terangafoncier.sn', password: 'TerrangaAdmin2024!', role: 'admin', name: 'Super Admin' },
    { email: 'agent@terangafoncier.sn', password: 'TerrangaAgent2024!', role: 'agent_foncier', name: 'Moussa Diallo' },
    { email: 'banque@terangafoncier.sn', password: 'TerrangaBank2024!', role: 'banque', name: 'Banque Atlantique' },
    { email: 'notaire@terangafoncier.sn', password: 'TerrangaNotaire2024!', role: 'notaire', name: 'MaÃ®tre Ousmane Ndiaye' },
    { email: 'geometre@terangafoncier.sn', password: 'TerrangaGeo2024!', role: 'geometre', name: 'Ibrahima Fall' },
    { email: 'client@terangafoncier.sn', password: 'TerrangaClient2024!', role: 'particulier', name: 'Fatou Sow' },
    { email: 'vendeur.particulier@terangafoncier.sn', password: 'TerrangaVendeur2024!', role: 'vendeur_particulier', name: 'Abdou Camara' },
    { email: 'vendeur.pro@terangafoncier.sn', password: 'TerrangaVendeurPro2024!', role: 'vendeur_pro', name: 'SociÃ©tÃ© ImmoSÃ©nÃ©gal' },
    { email: 'investisseur@terangafoncier.sn', password: 'TerrangaInvestisseur2024!', role: 'investisseur', name: 'Amadou Ba' },
    { email: 'promoteur@terangafoncier.sn', password: 'TerrangaPromoteur2024!', role: 'promoteur', name: 'Groupe SenConstruction' },
    { email: 'mairie@terangafoncier.sn', password: 'TerrangaMairie2024!', role: 'mairie', name: 'Mairie de Dakar' },
    { email: 'agriculteur@terangafoncier.sn', password: 'TerrangaAgriculteur2024!', role: 'agriculteur', name: 'Cheikh Diouf' }
  ];

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        window.safeGlobalToast({
          title: 'Erreur de connexion',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        window.safeGlobalToast({
          title: 'Connexion rÃ©ussie !',
          description: `Bienvenue ${profile?.full_name || email}`,
          className: 'bg-green-500 text-white'
        });
      }
    } catch (error) {
      window.safeGlobalToast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.safeGlobalToast({
        title: 'DÃ©connexion',
        description: 'Vous avez Ã©tÃ© dÃ©connectÃ© avec succÃ¨s',
        className: 'bg-blue-500 text-white'
      });
    } catch (error) {
      window.safeGlobalToast({
        title: 'Erreur',
        description: 'Erreur lors de la dÃ©connexion',
        variant: 'destructive'
      });
    }
  };

  const quickLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">VÃ©rification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ðŸ¢ Teranga Foncier - Test d'Authentification
          </h1>
          <p className="text-gray-600">
            Page de test pour vÃ©rifier l'authentification avec comptes mock
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section connexion */}
          {!user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Connexion Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      YOUR_API_KEY="admin@terangafoncier.sn"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      YOUR_API_KEY="TerrangaAdmin2024!"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSigningIn}
                  >
                    {isSigningIn ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Connexion...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Se connecter
                      </div>
                    )}
                  </Button>
                </form>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Comptes de test rapides :</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {mockAccounts.map((account) => (
                      <Button
                        key={account.email}
                        variant="outline"
                        size="sm"
                        onClick={() => quickLogin(account)}
                        className="justify-start"
                      >
                        <Badge variant="secondary" className="mr-2">
                          {account.role}
                        </Badge>
                        {account.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Section utilisateur connectÃ© */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Utilisateur ConnectÃ©
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={profile?.avatar_url || `https://avatar.vercel.sh/${user.email}.png`}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">
                      {profile?.full_name || 'Utilisateur'}
                    </h3>
                    <Badge variant="outline">
                      {profile?.role || 'Non dÃ©fini'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Se dÃ©connecter
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Informations systÃ¨me */}
          <Card>
            <CardHeader>
              <CardTitle>Ã‰tat du SystÃ¨me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Authentification :</span>
                  <Badge variant={user ? "success" : "secondary"} className="ml-2">
                    {user ? "ConnectÃ©" : "DÃ©connectÃ©"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Profil :</span>
                  <Badge variant={profile ? "success" : "secondary"} className="ml-2">
                    {profile ? "ChargÃ©" : "Non chargÃ©"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Session :</span>
                  <Badge variant={localStorage.getItem('teranga_mock_user') ? "outline" : "secondary"} className="ml-2">
                    {localStorage.getItem('teranga_mock_user') ? "Mock" : "Standard"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Loading :</span>
                  <Badge variant={loading ? "destructive" : "success"} className="ml-2">
                    {loading ? "Oui" : "Non"}
                  </Badge>
                </div>
              </div>

              {user && (
                <div className="border-t pt-3 mt-3">
                  <h4 className="font-medium mb-2">DonnÃ©es utilisateur :</h4>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify({ user: user, profile: profile }, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestAuthPage;


