import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LogIn, 
  AlertCircle,
  Shield,
  Users,
  Building,
  Landmark,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Globe,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';

const logoUrl = "https://horizons-cdn.hostinger.com/bcc20f7d-f81b-4a6f-9229-7d6ba486204e/6e6f6bf058d3590fd198aa8fadf9d2dd.png";

const ModernLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
      
      window.safeGlobalToast({
          title: `Bienvenue !`,
          description: "Connexion rÃ©ussie. Redirection en cours...",
          className: "bg-green-500 text-white",
      });
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.message.includes('Invalid login credentials') 
        ? "Email ou mot de passe incorrect."
        : "Une erreur est survenue lors de la connexion.";
      setError(errorMessage);
      window.safeGlobalToast({
        title: "Ã‰chec de la Connexion",
        description: errorMessage,
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [session, navigate, location]);

  const handleQuickLogin = (credentials) => {
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-8"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src={logoUrl} 
                alt="Teranga Foncier" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teranga Foncier</h1>
                <p className="text-lg text-gray-600">Votre partenaire foncier de confiance</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Simplifiez vos transactions fonciÃ¨res
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Une plateforme moderne et sÃ©curisÃ©e pour tous vos besoins en matiÃ¨re fonciÃ¨re au SÃ©nÃ©gal.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Shield, title: "SÃ©curisÃ©", desc: "Transactions 100% sÃ©curisÃ©es" },
                { icon: Users, title: "Multi-rÃ´les", desc: "Plateforme pour tous les acteurs" },
                { icon: Zap, title: "Rapide", desc: "Traitement accÃ©lÃ©rÃ© des dossiers" },
                { icon: Globe, title: "National", desc: "Couverture du territoire sÃ©nÃ©galais" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg backdrop-blur-sm"
                >
                  <feature.icon className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-4 text-center">
              <div className="lg:hidden flex items-center justify-center space-x-2">
                <img src={logoUrl} alt="Teranga Foncier" className="h-8 w-auto" />
                <span className="text-xl font-bold text-gray-900">Teranga Foncier</span>
              </div>
              
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Connexion
                </CardTitle>
                <CardDescription className="text-gray-600">
                  AccÃ©dez Ã  votre espace personnel
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Adresse email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    YOUR_API_KEY="votre@email.com"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      YOUR_API_KEY="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      className="h-11 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Mot de passe oubliÃ© ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connexion...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <LogIn className="w-4 h-4" />
                      <span>Se connecter</span>
                    </div>
                  )}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">Comptes de test :</p>
                
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { role: "Admin", email: "admin@teranga.sn", badge: "bg-red-100 text-red-800" },
                    { role: "Particulier", email: "particulier@teranga.sn", badge: "bg-blue-100 text-blue-800" },
                    { role: "Agent", email: "agent@teranga.sn", badge: "bg-green-100 text-green-800" },
                    { role: "Banque", email: "banque@teranga.sn", badge: "bg-purple-100 text-purple-800" }
                  ].map((account, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickLogin({ email: account.email, password: 'password123' })}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      <div className="flex items-center space-x-3">
                        <Badge className={`text-xs ${account.badge}`}>
                          {account.role}
                        </Badge>
                        <span className="text-sm font-medium text-gray-700">{account.email}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-6">
              <p className="text-center text-sm text-gray-600 w-full">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  CrÃ©er un compte
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernLoginPage;


