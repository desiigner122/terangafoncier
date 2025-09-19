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
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

const logoUrl = "/images/logo.png";

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

  const quickLoginOptions = [
    { role: "Particulier", description: "Achetez votre terrain", icon: Users, href: "/register", color: "from-emerald-500 to-teal-500" },
    { role: "Professionnel", description: "Rejoignez notre réseau", icon: Building, href: "/rejoignez-nous", color: "from-blue-500 to-cyan-500" },
    { role: "Mairie", description: "Partenariat institutionnel", icon: Landmark, href: "/contact", color: "from-purple-500 to-indigo-500" }
  ];

  const benefits = [
    "Accès Ï  2,500+ terrains vérifiés",
    "Paiements sécurisés et flexibles", 
    "Support client 24/7",
    "Technologie blockchain",
    "Accompagnement juridique inclus"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 flex">
      {/* Section gauche - Branding et informations */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 to-teal-600 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <img src={logoUrl} alt="Teranga Foncier" className="w-12 h-12" />
            <div>
              <span className="text-2xl font-bold text-white">Teranga Foncier</span>
              <div className="text-emerald-200 text-sm">La référence du foncier au Sénégal</div>
            </div>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Bienvenue dans l'avenir du 
              <span className="text-emerald-200"> foncier</span>
            </h1>
            
            <p className="text-xl text-emerald-100 leading-relaxed">
              Connectez-vous pour accéder Ï  la première plateforme foncière digitale du Sénégal. 
              Achetez, vendez et investissez en toute sécurité.
            </p>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-200" />
                  <span className="text-white">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="pt-6">
              <Badge className="bg-white/20 text-white border-white/30">
                <Zap className="w-4 h-4 mr-1" />
                Innovation 2025
              </Badge>
            </div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center"
        >
          <Globe className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-32 right-32 w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>
      </div>

      {/* Section droite - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={logoUrl} alt="Teranga Foncier" className="w-10 h-10" />
              <div>
                <span className="text-xl font-bold text-gray-900">Teranga Foncier</span>
                <div className="text-emerald-600 text-sm">Connexion</div>
              </div>
            </Link>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">Connexion</CardTitle>
              <CardDescription className="text-gray-600">
                Accédez Ï  votre espace personnel Teranga Foncier
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="h-12 border-gray-200 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700">Mot de passe</Label>
                    <Link 
                      to="#" 
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      onClick={(e) => {
                        e.preventDefault(); 
                        window.safeGlobalToast({
                          title:"Fonctionnalité Ï  venir", 
                          description: "La récupération de mot de passe sera bientôt disponible."
                        })
                      }}
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="h-12 border-gray-200 focus:border-emerald-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
                  </motion.div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
                >
                  {loading ? (
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

              <Separator />

              <div className="space-y-4">
                <p className="text-center text-sm text-gray-600">
                  Pas encore de compte ?
                </p>
                
                <div className="grid gap-3">
                  {quickLoginOptions.map((option, index) => (
                    <Link
                      key={index}
                      to={option.href}
                      className="group"
                    >
                      <div className={`p-4 bg-gradient-to-r ${option.color} rounded-lg text-white transition-transform hover:scale-105`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <option.icon className="w-5 h-5" />
                            <div>
                              <div className="font-medium">{option.role}</div>
                              <div className="text-sm opacity-90">{option.description}</div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="text-center">
              <p className="text-xs text-gray-500 mx-auto">
                En vous connectant, vous acceptez nos{' '}
                <Link to="/legal" className="text-emerald-600 hover:underline">conditions d'utilisation</Link>{' '}
                et notre{' '}
                <Link to="/privacy" className="text-emerald-600 hover:underline">politique de confidentialité</Link>.
              </p>
            </CardFooter>
          </Card>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
            >
              â† Retour Ï  l'accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernLoginPage;



