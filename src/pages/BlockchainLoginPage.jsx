import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Smartphone,
  Globe,
  Blocks,
  Zap,
  Star,
  Users,
  Database,
  Brain,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthProvider';
import { Helmet } from 'react-helmet-async';

const BlockchainLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const platformStats = [
    { label: "Utilisateurs SÃ©curisÃ©s", value: "8.2K+", icon: Users },
    { label: "Blockchain Transactions", value: "2.8K+", icon: Database },
    { label: "Taux de SÃ©curitÃ©", value: "99.9%", icon: Shield },
    { label: "IA Monitoring", value: "24/7", icon: Brain }
  ];

  const securityFeatures = [
    { icon: Shield, title: "Authentification Blockchain", desc: "SÃ©curitÃ© cryptographique avancÃ©e" },
    { icon: Lock, title: "2FA Disponible", desc: "Double authentification optionnelle" },
    { icon: Database, title: "DonnÃ©es ChiffrÃ©es", desc: "Chiffrement de bout en bout" },
    { icon: Eye, title: "AccÃ¨s SÃ©curisÃ©", desc: "Surveillance en temps rÃ©el" }
  ];

  return (
    <>
      <Helmet>
        <title>Connexion SÃ©curisÃ©e - Teranga Foncier Blockchain</title>
        <meta name="description" content="Connexion sÃ©curisÃ©e Ã  votre compte Teranga Foncier. AccÃ©dez Ã  votre portefeuille blockchain immobilier." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4"
                >
                  <Blocks className="h-8 w-8 text-white" />
                </motion.div>
                
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Connexion SÃ©curisÃ©e
                </CardTitle>
                
                <p className="text-white/70">
                  AccÃ©dez Ã  votre portefeuille blockchain immobilier
                </p>
                
                <Badge className="mt-3 bg-green-500/20 text-green-400 border-green-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  SÃ©curisÃ© par Blockchain
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90">Adresse Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/90">Mot de Passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
                        className="border-white/30 data-[state=checked]:bg-blue-600"
                      />
                      <Label htmlFor="rememberMe" className="text-sm text-white/70">
                        Se souvenir de moi
                      </Label>
                    </div>

                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Mot de passe oubliÃ©?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connexion...
                      </div>
                    ) : (
                      <>
                        Se Connecter
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-white/70">
                    Pas encore de compte?{' '}
                    <Link 
                      to="/register" 
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      CrÃ©er un compte
                    </Link>
                  </p>
                </div>

                {/* Security Features */}
                <div className="pt-6 border-t border-white/10">
                  <p className="text-xs text-white/50 text-center mb-4">SÃ©curitÃ© Garantie</p>
                  <div className="grid grid-cols-2 gap-3">
                    {securityFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <feature.icon className="h-3 w-3 text-green-400" />
                        <span className="text-xs text-white/70">{feature.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Side - Platform Stats & Features */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-lg"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Plateforme Blockchain
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  ImmobiliÃ¨re #1
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                Rejoignez la rÃ©volution de l'immobilier au SÃ©nÃ©gal avec la technologie blockchain
              </p>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {platformStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
                    <CardContent className="p-4">
                      <stat.icon className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/70">{stat.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Security Features Detail */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                SÃ©curitÃ© AvancÃ©e
              </h3>
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{feature.title}</h4>
                    <p className="text-sm text-white/70">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-white/90 italic mb-3">
                "La sÃ©curitÃ© blockchain me permet d'investir sereinement depuis la France. 
                Excellente plateforme!"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AD</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Aminata Diallo</div>
                  <div className="text-white/60 text-xs">Diaspora - Paris</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BlockchainLoginPage;

