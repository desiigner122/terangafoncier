
    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate, useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
    // useToast import supprimé - utilisation window.safeGlobalToast
    import { 
  LogIn, 
  AlertCircle,
  User,
  Shield,
  Key,
  Users,
  Building
} from 'lucide-react';
    import { useAuth } from '@/contexts/UnifiedAuthContext';
    import { unifiedAuth } from '@/services/UnifiedAuthService';

  // Helper pour déterminer la route basée sur le rôle
  const getDashboardPath = (user) => {
    const roles = user.roles || [];
    const profile = user.profile || user;
    const userRole = profile.role || profile.user_type || (roles.length > 0 ? roles[0] : 'Particulier');
    
    console.log('🔍 Détermination dashboard pour:', { roles, userRole, user });
    
    // Vérification par rôle avec priorité admin
    if (roles.includes('admin') || userRole === 'Admin') return '/admin/dashboard';
    if (roles.includes('agent_foncier') || userRole === 'Agent Foncier') return '/agent-foncier/dashboard';
    if (roles.includes('banque') || userRole === 'Banque') return '/banque/dashboard';
    if (roles.includes('notaire') || userRole === 'Notaire') return '/notaire/dashboard';
    if (roles.includes('geometre') || userRole === 'Géomètre') return '/geometre/dashboard';
    if (roles.includes('mairie') || userRole === 'Mairie') return '/mairie/dashboard';
    if (roles.includes('vendeur') || userRole === 'Vendeur') return '/dashboard/vendeur';
    if (roles.includes('investisseur') || userRole === 'Investisseur') return '/dashboard/investisseur';
    
    // Par défaut - dashboard particulier
    return '/dashboard';
  };

  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [loginType, setLoginType] = useState('api');
    const { signIn, session } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();      const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
          // Utiliser le service d'authentification unifié
          const { user, error: authError } = await unifiedAuth.signIn(email, password);
          
          if (authError) {
            throw new Error(authError.message);
          }
          
          if (user) {
            // Debug: afficher les données utilisateur
            console.log('🔍 Utilisateur connecté:', user);
            console.log('🎭 Rôles utilisateur:', user.roles);
            
            // Redirection basée sur le rôle de l'utilisateur
            const dashboardPath = getDashboardPath(user);
            console.log('🎯 Redirection vers:', dashboardPath);
            
            const from = location.state?.from?.pathname || dashboardPath;
            navigate(from, { replace: true });
          }
          
          window.safeGlobalToast({
              title: `Bienvenue !`,
              description: "Connexion réussie. Redirection en cours...",
              className: "bg-green-500 text-white",
          });
        } catch (err) {
          console.error("Login error:", err);
          const errorMessage = err.message?.includes('Invalid login credentials') || err.message?.includes('incorrect')
            ? "Email ou mot de passe incorrect."
            : err.message || "Une erreur est survenue lors de la connexion.";
          setError(errorMessage);
          window.safeGlobalToast({
            title: "Échec de la Connexion",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      // Connexion rapide avec un compte de test
      const handleQuickLogin = async (role) => {
        setLoading(true);
        setError('');

        try {
          const { user, error: authError } = await unifiedAuth.quickSignIn(role);
          
          if (authError) {
            throw new Error(authError.message);
          }
          
          if (user) {
            window.safeGlobalToast({
              title: `Bienvenue !`,
              description: "Connexion réussie. Redirection en cours...",
              className: "bg-green-500 text-white",
            });
            
            const dashboardPath = getDashboardPath(user);
            navigate(dashboardPath, { replace: true });
          }
        } catch (err) {
          console.error("Quick login error:", err);
          setError(err.message || "Une erreur est survenue lors de la connexion.");
          window.safeGlobalToast({
            title: "Échec de la Connexion",
            description: err.message || "Une erreur est survenue lors de la connexion.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        if (session) {
          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        }
      }, [session, navigate, location.state]);


      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-900/50 px-4 py-12"
        >
          <Card className="w-full max-w-2xl shadow-xl border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">Connexion</CardTitle>
              <CardDescription>Accédez à votre espace Teranga Foncier</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={loginType} onValueChange={setLoginType} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="supabase" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Compte Personnel</span>
                  </TabsTrigger>
                  <TabsTrigger value="local" className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Accès Professionnel</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="supabase" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nom@exemple.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                         <Label htmlFor="password">Mot de passe</Label>
                         <Link to="#" className="text-sm text-primary hover:underline" onClick={(e) => {e.preventDefault(); window.safeGlobalToast({title:"Fonctionnalité à venir", description: "La récupération de mot de passe n'est pas encore implémentée."})}}>Mot de passe oublié ?</Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    {error && (
                      <div className="flex items-center p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/30">
                         <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0"/>
                         <span>{error}</span>
                      </div>
                    )}
                    <Button type="submit" className="w-full bg-gradient-to-r from-primary to-green-600 hover:opacity-90 text-white" disabled={loading}>
                      {loading ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Connexion en cours...
                         </>
                      ) : (
                         <>
                            <LogIn className="mr-2 h-4 w-4" /> Se Connecter
                         </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="local" className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-2">Connexion directe aux dashboards professionnels</p>
                    <Badge variant="outline" className="text-xs">Comptes de démonstration</Badge>
                  </div>

                  {/* Connexion manuelle avec identifiants locaux */}
                  <form onSubmit={handleLogin} className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="local-email">Email</Label>
                      <Input
                        id="local-email"
                        type="email"
                        placeholder="admin@local, mairie@local, banque@local..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="local-password">Mot de passe</Label>
                      <Input
                        id="local-password"
                        type="password"
                        placeholder="admin123, mairie123, bank123..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    {error && (
                      <div className="flex items-center p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/30">
                         <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0"/>
                         <span>{error}</span>
                      </div>
                    )}
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white" disabled={loading}>
                      {loading ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Connexion en cours...
                         </>
                      ) : (
                         <>
                            <Key className="mr-2 h-4 w-4" /> Se Connecter
                         </>
                      )}
                    </Button>
                  </form>

                  {/* Boutons de connexion rapide */}
                  <div className="border-t pt-4">
                    <p className="text-xs text-center text-gray-500 mb-3">Ou connexion rapide :</p>
                    <div className="grid grid-cols-2 gap-2">
                      {localAccounts.map((account) => (
                        <Button
                          key={account.email}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickLogin(account)}
                          disabled={loading}
                          className="text-xs p-2 h-auto flex flex-col items-center space-y-1"
                        >
                          <div className="flex items-center space-x-1">
                            {account.role === 'admin' && <Shield className="h-3 w-3" />}
                            {account.role === 'mairie' && <Building className="h-3 w-3" />}
                            {account.role === 'banque' && <Building className="h-3 w-3" />}
                            {account.role === 'notaire' && <Users className="h-3 w-3" />}
                            {!['admin', 'mairie', 'banque', 'notaire'].includes(account.role) && <User className="h-3 w-3" />}
                            <span>{account.name}</span>
                          </div>
                          <span className="text-xs text-gray-500 capitalize">{account.role}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 text-center text-sm">
               <p>Vous n'avez pas de compte ? <Link to="/register" className="underline text-primary font-medium">Inscrivez-vous</Link></p>
               
               {/* Section Professionnels */}
               <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                 <h3 className="font-medium text-gray-900 mb-2 flex items-center justify-center gap-2">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                   </svg>
                   Vous êtes un professionnel ?
                 </h3>
                 <p className="text-xs text-gray-600 mb-3">
                   Promoteur • Banque • Notaire • Géomètre • Agent Foncier • Municipalité
                 </p>
                 <Link 
                   to="/contact" 
                   className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                 >
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                   </svg>
                   Nous contacter
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                   </svg>
                 </Link>
               </div>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default LoginPage;
  



