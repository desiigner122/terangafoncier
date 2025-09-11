import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, AlertCircle } from 'lucide-react';

const TempLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Comptes demo temporaires (simulation locale)
  const demoAccounts = {
    'admin@terangafoncier.com': { role: 'admin', name: 'Admin Demo' },
    'particulier@terangafoncier.com': { role: 'particular', name: 'Particulier Demo' },
    'vendeur@terangafoncier.com': { role: 'vendeur', name: 'Vendeur Demo' },
    'banque@terangafoncier.com': { role: 'banque', name: 'Banque Demo' },
    'promoteur@terangafoncier.com': { role: 'promoteur', name: 'Promoteur Demo' },
    'demo@terangafoncier.com': { role: 'particular', name: 'Demo User' }
  };

  const handleTempLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulation de connexion temporaire
    setTimeout(() => {
      if (demoAccounts[email] && password === 'demo123') {
        const account = demoAccounts[email];
        
        // Simuler une session temporaire
        localStorage.setItem('temp_auth', JSON.stringify({
          user: {
            email: email,
            user_metadata: {
              role: account.role,
              name: account.name
            }
          },
          session: { access_token: 'temp_token' }
        }));

        window.safeGlobalToast({
          title: `Bienvenue ${account.name}!`,
          description: "Connexion temporaire rÃ©ussie (contournement email confirmation)",
          className: "bg-green-500 text-white",
        });

        // Redirection vers le dashboard appropriÃ©
        const dashboardPath = `/dashboard/${account.role}`;
        navigate(dashboardPath, { replace: true });
      } else {
        window.safeGlobalToast({
          title: "Connexion Ã©chouÃ©e",
          description: "Email ou mot de passe incorrect. Utilisez un compte demo avec le mot de passe 'demo123'",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 px-4 py-12"
    >
      <Card className="w-full max-w-md shadow-xl border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Connexion Temporaire</CardTitle>
          <CardDescription>
            Contournement temporaire - En attente de configuration Supabase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-700">
                Mode temporaire actif - DÃ©sactiver email confirmation dans Supabase pour utiliser l'auth normale
              </p>
            </div>
          </div>

          <form onSubmit={handleTempLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                YOUR_API_KEY="admin@terangafoncier.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                YOUR_API_KEY="demo123"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Connexion Temporaire
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 font-medium mb-2">Comptes demo disponibles:</p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>â€¢ admin@terangafoncier.com</li>
              <li>â€¢ particulier@terangafoncier.com</li>
              <li>â€¢ vendeur@terangafoncier.com</li>
              <li>â€¢ banque@terangafoncier.com</li>
              <li>â€¢ promoteur@terangafoncier.com</li>
            </ul>
            <p className="text-xs text-blue-600 mt-2">Mot de passe: <strong>demo123</strong></p>
          </div>
        </CardContent>

        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground">
            <Link to="/register" className="text-primary hover:underline">
              CrÃ©er un compte
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TempLoginPage;
