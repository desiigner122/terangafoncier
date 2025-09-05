﻿
    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate, useLocation } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    // useToast import supprimÃ© - utilisation window.safeGlobalToast
    import { 
  LogIn, 
  AlertCircle
} from 'lucide-react';
    import { useAuth } from '@/context/SupabaseAuthContext';

    const LoginPage = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const { signIn, session } = useAuth();
      const navigate = useNavigate();
      const location = useLocation();
      // toast remplacÃ© par window.safeGlobalToast

      const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
          const { error: signInError } = await signIn(email, password);
          if (signInError) throw signInError;
          
          window.safeGlobalToast({
              title: `Bienvenue !`,
              description: "Connexion réussie. Redirection en cours...",
              className: "bg-green-500 text-white",
          });
        } catch (err) {
          console.error("Login error:", err);
          const errorMessage = err.message.includes('Invalid login credentials') 
            ? "Email ou mot de passe incorrect."
            : "Une erreur est survenue lors de la connexion.";
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
          <Card className="w-full max-w-md shadow-xl border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-primary">Connexion</CardTitle>
              <CardDescription>Accédez à votre espace Teranga Foncier</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4 text-center text-sm">
               <p>Vous n'avez pas de compte ? <Link to="/register" className="underline text-primary font-medium">Inscrivez-vous</Link></p>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default LoginPage;
  
