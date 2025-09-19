import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  UserCheck,
  Fingerprint,
  Key,
  Cpu,
  Database,
  Blocks,
  Zap
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthProvider';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimer, setBlockTimer] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Redirection si déjÏ  connecté
  useEffect(() => {
    if (user && !loading) {
      navigate('/admin/dashboard');
    }
  }, [user, loading, navigate]);

  // Gestion du blocage temporaire
  useEffect(() => {
    if (isBlocked && blockTimer > 0) {
      const timer = setTimeout(() => {
        setBlockTimer(blockTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isBlocked && blockTimer === 0) {
      setIsBlocked(false);
      setLoginAttempts(0);
    }
  }, [isBlocked, blockTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isBlocked) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        throw error;
      }

      // Vérifier si l'utilisateur a le rôle admin
      if (data.user) {
        // Récupérer le profil utilisateur pour vérifier le rôle
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile && profile.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          throw new Error('Accès non autorisé - Rôle administrateur requis');
        }
      }

    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      setLoginAttempts(prev => prev + 1);
      
      if (loginAttempts >= 2) {
        setIsBlocked(true);
        setBlockTimer(30); // 30 secondes de blocage
        setErrors({
          general: 'Trop de tentatives échouées. Veuillez patienter 30 secondes.'
        });
      } else {
        setErrors({
          general: error.message || 'Identifiants incorrects'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Particules de fond animées
  const backgroundParticles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-blue-500/20 rounded-full"
      animate={{
        x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
        y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
      }}
    />
  ));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Administration - Teranga Foncier</title>
        <meta name="description" content="Interface d'administration sécurisée - Teranga Foncier" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Particules de fond */}
        <div className="absolute inset-0">
          {backgroundParticles}
        </div>

        {/* Grille de fond */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        {/* Contenu principal */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            {/* Logo et titre */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Administration
              </h1>
              <p className="text-blue-200">
                Interface sécurisée Teranga Foncier
              </p>
            </motion.div>

            {/* Badges de sécurité */}
            <motion.div variants={itemVariants} className="flex justify-center gap-2 mb-6">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <Fingerprint className="w-3 h-3 mr-1" />
                2FA Ready
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Blocks className="w-3 h-3 mr-1" />
                Blockchain
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Cpu className="w-3 h-3 mr-1" />
                AI Secured
              </Badge>
            </motion.div>

            {/* Formulaire de connexion */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" />
                    Connexion Sécurisée
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Alerte générale */}
                    <AnimatePresence>
                      {errors.general && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Alert className="bg-red-500/20 border-red-500/30 text-red-300">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{errors.general}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Blocage temporaire */}
                    <AnimatePresence>
                      {isBlocked && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Alert className="bg-orange-500/20 border-orange-500/30 text-orange-300">
                            <Zap className="h-4 w-4" />
                            <AlertDescription>
                              Compte temporairement bloqué. Déblocage dans {blockTimer}s
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">
                        Email Administrateur
                      </label>
                      <div className="relative">
                        <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-12 bg-white/10 border-white/20 text-white YOUR_API_KEY:text-white/50 focus:border-blue-400"
                          YOUR_API_KEY="admin@terangafoncier.com"
                          disabled={isLoading || isBlocked}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-red-300">{errors.email}</p>
                      )}
                    </div>

                    {/* Mot de passe */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/90">
                        Mot de Passe
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-12 pr-12 bg-white/10 border-white/20 text-white YOUR_API_KEY:text-white/50 focus:border-blue-400"
                          YOUR_API_KEY="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                          disabled={isLoading || isBlocked}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                          disabled={isLoading || isBlocked}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-300">{errors.password}</p>
                      )}
                    </div>

                    {/* Indicateur de tentatives */}
                    {loginAttempts > 0 && !isBlocked && (
                      <div className="flex items-center justify-center gap-2 text-orange-300">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Tentative {loginAttempts}/3
                        </span>
                      </div>
                    )}

                    {/* Bouton de connexion */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 disabled:opacity-50"
                      disabled={isLoading || isBlocked}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Vérification...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Se Connecter
                        </div>
                      )}
                    </Button>
                  </form>

                  {/* Lien de retour */}
                  <div className="text-center pt-4 border-t border-white/20">
                    <Link
                      to="/"
                      className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
                    >
                      â† Retour Ï  l'accueil
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Informations de sécurité */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <Database className="w-4 h-4" />
                <span>Interface protégée par blockchain</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;


