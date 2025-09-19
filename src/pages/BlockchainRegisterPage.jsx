import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Blocks,
  Star,
  Users,
  Database,
  Brain,
  Globe,
  Building,
  Smartphone,
  Award,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthProvider';
import { Helmet } from 'react-helmet-async';

const BlockchainRegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: '',
    location: '',
    agreeTerms: false,
    agreeNewsletter: false
  });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const userTypes = [
    { value: 'particulier', label: 'Particulier / Diaspora', icon: User, desc: 'Achat personnel, construction' },
    { value: 'investisseur', label: 'Investisseur', icon: TrendingUp, desc: 'Portefeuille immobilier' },
    { value: 'promoteur', label: 'Promoteur', icon: Building, desc: 'Développement immobilier' },
    { value: 'mairie', label: 'Mairie / Collectivité', icon: MapPin, desc: 'Gestion terrains communaux' },
    { value: 'banque', label: 'Banque / Institution', icon: Database, desc: 'Services financiers' },
    { value: 'notaire', label: 'Notaire / Professionnel', icon: Shield, desc: 'Services juridiques' }
  ];

  const senegalRegions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Louga', 'Fatick', 
    'Kaolack', 'Kolda', 'Tambacounda', 'Ziguinchor', 'Matam', 
    'Kaffrine', 'Kédougou', 'Sédhiou', 'Diaspora - Europe', 
    'Diaspora - Amérique', 'Diaspora - Afrique', 'Autre'
  ];

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        userType: formData.userType,
        location: formData.location
      });
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Erreur lors de la création du compte');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Blocks, title: "Titres Blockchain NFT", desc: "Propriété sécurisée et vérifiable" },
    { icon: Shield, title: "Smart Contracts", desc: "Paiements automatisés et sécurisés" },
    { icon: Brain, title: "IA de Surveillance", desc: "Suivi construction intelligent" },
    { icon: Globe, title: "Accès International", desc: "Investissement depuis 50+ pays" }
  ];

  const trustIndicators = [
    { label: "Comptes Créés", value: "8.2K+", icon: Users },
    { label: "Transactions Sécurisées", value: "2.8K+", icon: Database },
    { label: "Satisfaction", value: "98.5%", icon: Star },
    { label: "Support", value: "24/7", icon: Shield }
  ];

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Informations Personnelles</h3>
              <p className="text-white/70">Commençons par vos informations de base</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white/90">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white YOUR_API_KEY:text-white/50 focus:border-blue-400"
                    YOUR_API_KEY="Votre prénom"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white/90">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white YOUR_API_KEY:text-white/50 focus:border-blue-400"
                    YOUR_API_KEY="Votre nom"
                    required
                  />
                </div>
              </div>
            </div>

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
                  className="pl-10 bg-white/10 border-white/20 text-white YOUR_API_KEY:text-white/50 focus:border-blue-400"
                  YOUR_API_KEY="votre@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white/90">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/10 border-white/20 text-white YOUR_API_KEY:text-white/50 focus:border-blue-400"
                  YOUR_API_KEY="+221 XX XXX XX XX"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Profil & Localisation</h3>
              <p className="text-white/70">Personnalisez votre expérience</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Type de Profil</Label>
              <div className="grid grid-cols-1 gap-3">
                {userTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => handleSelectChange('userType', type.value)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      formData.userType === type.value
                        ? 'border-blue-400 bg-blue-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <type.icon className="h-5 w-5 text-white" />
                      <div>
                        <div className="text-white font-medium">{type.label}</div>
                        <div className="text-white/60 text-sm">{type.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90">Localisation</Label>
              <Select value={formData.location} onValueChange={(value) => handleSelectChange('location', value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue YOUR_API_KEY="Sélectionnez votre région" />
                </SelectTrigger>
                <SelectContent>
                  {senegalRegions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Sécurité du Compte</h3>
              <p className="text-white/70">Créez un mot de passe sécurisé</p>
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
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white YOUR_API_KEY:text-white/50 focus:border-blue-400"
                  YOUR_API_KEY="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
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
              
              {/* Password Strength Indicator */}
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded ${
                        i < passwordStrength 
                          ? passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/60">
                  Force: {passwordStrength <= 2 ? 'Faible' : passwordStrength <= 3 ? 'Moyenne' : 'Forte'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/90">Confirmer le Mot de Passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white YOUR_API_KEY:text-white/50 focus:border-blue-400"
                  YOUR_API_KEY="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked }))}
                  className="border-white/30 data-[state=checked]:bg-blue-600 mt-1"
                />
                <Label htmlFor="agreeTerms" className="text-sm text-white/90 leading-relaxed">
                  J'accepte les{' '}
                  <Link to="/legal" className="text-blue-400 hover:text-blue-300">
                    conditions d'utilisation
                  </Link>{' '}
                  et la{' '}
                  <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeNewsletter"
                  name="agreeNewsletter"
                  checked={formData.agreeNewsletter}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeNewsletter: checked }))}
                  className="border-white/30 data-[state=checked]:bg-blue-600 mt-1"
                />
                <Label htmlFor="agreeNewsletter" className="text-sm text-white/90">
                  Je souhaite recevoir les actualités blockchain et les opportunités d'investissement
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Créer un Compte - Teranga Foncier Blockchain</title>
        <meta name="description" content="Créez votre compte Teranga Foncier et accédez Ï  la première plateforme blockchain immobilière du Sénégal." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex">
        {/* Left Side - Registration Form */}
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
                  Rejoignez la Révolution
                </CardTitle>
                
                <p className="text-white/70">
                  Créez votre compte blockchain immobilier
                </p>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center mt-6 space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        step <= currentStep 
                          ? 'bg-blue-500' 
                          : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
                
                <Badge className="mt-3 bg-green-500/20 text-green-400 border-green-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Inscription Sécurisée
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <Alert className="bg-red-500/10 border-red-500/20 text-red-400">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {getStepContent()}

                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex-1 border-white/30 text-white hover:bg-white/10"
                      >
                        Précédent
                      </Button>
                    )}
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Création...
                        </div>
                      ) : currentStep < 3 ? (
                        <>
                          Suivant
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Créer mon Compte
                          <CheckCircle className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>

                <div className="text-center">
                  <p className="text-white/70">
                    DéjÏ  un compte?{' '}
                    <Link 
                      to="/login" 
                      className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Se connecter
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Side - Benefits & Trust Indicators */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-lg"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Pourquoi Choisir
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Teranga Foncier ?
                </span>
              </h1>
              <p className="text-xl text-white/80 leading-relaxed">
                La première plateforme blockchain immobilière du Sénégal
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={indicator.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-center">
                    <CardContent className="p-4">
                      <indicator.icon className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                      <div className="text-lg font-bold text-white">{indicator.value}</div>
                      <div className="text-xs text-white/70">{indicator.label}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Avantages Exclusifs
              </h3>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{benefit.title}</h4>
                    <p className="text-sm text-white/70">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Success Story */}
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
                "Inscription simple, plateforme sécurisée. J'ai acheté mon terrain en 3 clics depuis New York!"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">MK</span>
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Moussa Kane</div>
                  <div className="text-white/60 text-xs">Diaspora - New York</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BlockchainRegisterPage;

