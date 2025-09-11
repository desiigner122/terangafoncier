import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Globe,
  Lock,
  UserCheck,
  Briefcase,
  Award,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate } from 'react-router-dom';

const MultiStepRegisterPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    experience: '',
    specializations: [],
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptNewsletter: false
  });

  const totalSteps = 4;

  // Configuration des rÃ´les avec design blockchain
  const roles = [
    {
      id: 'particulier',
      name: 'Particulier',
      description: 'Recherche et achat de terrains personnels',
      icon: User,
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'Essentiel',
      badgeColor: 'bg-blue-100 text-blue-800',
      benefits: ['AccÃ¨s complet au marchÃ©', 'Outils de recherche avancÃ©s', 'Support dÃ©diÃ©']
    },
    {
      id: 'vendeur-particulier',
      name: 'Vendeur Particulier',
      description: 'Vente de terrains en tant que particulier',
      icon: UserCheck,
      gradient: 'from-green-500 to-emerald-500',
      badge: 'Populaire',
      badgeColor: 'bg-green-100 text-green-800',
      benefits: ['Publication gratuite', 'VisibilitÃ© optimale', 'Gestion simplifiÃ©e']
    },
    {
      id: 'vendeur-pro',
      name: 'Vendeur Pro',
      description: 'ActivitÃ© professionnelle immobiliÃ¨re',
      icon: Briefcase,
      gradient: 'from-purple-500 to-violet-500',
      badge: 'Business',
      badgeColor: 'bg-purple-100 text-purple-800',
      benefits: ['Outils professionnels', 'Analytics avancÃ©s', 'Support prioritaire']
    },
    {
      id: 'investisseur',
      name: 'Investisseur',
      description: 'Investissement et dÃ©veloppement foncier',
      icon: Crown,
      gradient: 'from-amber-500 to-orange-500',
      badge: 'Premium',
      badgeColor: 'bg-amber-100 text-amber-800',
      benefits: ['Analyses de marchÃ©', 'OpportunitÃ©s exclusives', 'Conseil stratÃ©gique']
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleSelect = (roleId) => {
    setFormData(prev => ({ ...prev, role: roleId }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Simulation de l'inscription
    console.log('DonnÃ©es d\'inscription:', formData);
    
    // Redirection selon le rÃ´le
    const roleRedirects = {
      'particulier': '/dashboard',
      'vendeur-particulier': '/seller-dashboard',
      'vendeur-pro': '/solutions/vendeurs/dashboard',
      'investisseur': '/investor-dashboard'
    };
    
    setTimeout(() => {
      navigate(roleRedirects[formData.role] || '/dashboard');
    }, 2000);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Choisissez votre profil
              </h2>
              <p className="text-gray-600">
                SÃ©lectionnez le type de compte qui correspond Ã  votre activitÃ©
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = formData.role === role.id;
                
                return (
                  <motion.div
                    key={role.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-5`} />
                    
                    <div className="relative p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${role.gradient}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge className={role.badgeColor}>
                          {role.badge}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{role.name}</h3>
                        <p className="text-gray-600 text-sm">{role.description}</p>
                      </div>
                      
                      <div className="space-y-1">
                        {role.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-gray-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Informations personnelles
              </h2>
              <p className="text-gray-600">
                Renseignez vos informations de contact
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  PrÃ©nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  YOUR_API_KEY="Votre prÃ©nom"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  YOUR_API_KEY="Votre nom de famille"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Adresse email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                YOUR_API_KEY="votre.email@exemple.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                TÃ©lÃ©phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                YOUR_API_KEY="+221 77 123 45 67"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="h-12"
              />
            </div>
          </motion.div>
        );

      case 3:
        const selectedRole = roles.find(r => r.id === formData.role);
        const isProfessional = ['vendeur-pro', 'investisseur'].includes(formData.role);
        
        if (!isProfessional) {
          // Skip to step 4 for non-professional roles
          setCurrentStep(4);
          return null;
        }

        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className={`w-20 h-20 bg-gradient-to-r ${selectedRole?.gradient} rounded-full flex items-center justify-center`}>
                  <Building className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Informations professionnelles
              </h2>
              <p className="text-gray-600">
                ComplÃ©tez votre profil professionnel
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Entreprise / Organisation
                </Label>
                <Input
                  id="company"
                  YOUR_API_KEY="Nom de votre entreprise"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience" className="text-sm font-medium flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  AnnÃ©es d'expÃ©rience
                </Label>
                <select
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">SÃ©lectionnez votre expÃ©rience</option>
                  <option value="0-2">0-2 ans</option>
                  <option value="3-5">3-5 ans</option>
                  <option value="6-10">6-10 ans</option>
                  <option value="10+">Plus de 10 ans</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">SpÃ©cialisations</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'RÃ©sidentiel', 'Commercial', 'Industriel', 'Agricole',
                    'Tourisme', 'Lotissement', 'Promotion', 'Investissement'
                  ].map((spec) => (
                    <div key={spec} className="flex items-center space-x-2">
                      <Checkbox
                        id={spec}
                        checked={formData.specializations.includes(spec)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange('specializations', [...formData.specializations, spec]);
                          } else {
                            handleInputChange('specializations', formData.specializations.filter(s => s !== spec));
                          }
                        }}
                      />
                      <Label htmlFor={spec} className="text-sm">
                        {spec}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                SÃ©curitÃ© et finalisation
              </h2>
              <p className="text-gray-600">
                CrÃ©ez un mot de passe sÃ©curisÃ© pour votre compte
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mot de passe <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    YOUR_API_KEY="CrÃ©ez un mot de passe sÃ©curisÃ©"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="h-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmer le mot de passe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  YOUR_API_KEY="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                  />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    J'accepte les{' '}
                    <a href="/terms" className="text-blue-600 hover:underline">
                      conditions d'utilisation
                    </a>{' '}
                    et la{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline">
                      politique de confidentialitÃ©
                    </a>{' '}
                    de Teranga Foncier <span className="text-red-500">*</span>
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="newsletter"
                    checked={formData.acceptNewsletter}
                    onCheckedChange={(checked) => handleInputChange('acceptNewsletter', checked)}
                  />
                  <Label htmlFor="newsletter" className="text-sm text-gray-600">
                    Je souhaite recevoir les actualitÃ©s et offres de Teranga Foncier
                  </Label>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.role !== '';
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 3:
        const isProfessional = ['vendeur-pro', 'investisseur'].includes(formData.role);
        if (!isProfessional) return true;
        return formData.company && formData.experience;
      case 4:
        return formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword && 
               formData.acceptTerms;
      default:
        return false;
    }
  };

  // Skip step 3 for non-professional roles
  const actualStep = currentStep === 3 && !['vendeur-pro', 'investisseur'].includes(formData.role) ? 4 : currentStep;
  const actualTotalSteps = ['vendeur-pro', 'investisseur'].includes(formData.role) ? 4 : 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-ping"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Progress Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Rejoignez Teranga Foncier
            </h1>
            <p className="text-gray-600 mb-8">
              La plateforme blockchain de rÃ©fÃ©rence pour l'immobilier au SÃ©nÃ©gal
            </p>

            {/* Progress Bar */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {Array.from({ length: actualTotalSteps }, (_, i) => {
                const stepNumber = i + 1;
                const isActive = stepNumber === actualStep;
                const isCompleted = stepNumber < actualStep;
                
                return (
                  <React.Fragment key={stepNumber}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'border-blue-500 text-blue-500 bg-blue-50' 
                          : 'border-gray-300 text-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="text-sm font-semibold">{stepNumber}</span>
                      )}
                    </div>
                    
                    {stepNumber < actualTotalSteps && (
                      <div className={`h-0.5 w-8 transition-all ${
                        stepNumber < actualStep ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>

          {/* Form Card */}
          <Card className="backdrop-blur-lg bg-white/80 border-0 shadow-2xl">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {getStepContent()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  PrÃ©cÃ©dent
                </Button>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Globe className="w-4 h-4" />
                  <span>SÃ©curisÃ© par blockchain</span>
                </div>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    CrÃ©er mon compte
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 text-gray-600"
          >
            <p className="text-sm">
              DÃ©jÃ  inscrit ?{' '}
              <a href="/login" className="text-blue-600 hover:underline font-medium">
                Connectez-vous ici
              </a>
            </p>
          </motion.div>

          {/* Section Professionnels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card className="backdrop-blur-lg bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/50">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Briefcase className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Vous Ãªtes un professionnel ?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Promoteur â€¢ Banque â€¢ Notaire â€¢ GÃ©omÃ¨tre â€¢ Agent Foncier â€¢ MunicipalitÃ©
                </p>
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                >
                  <Shield className="w-4 h-4" />
                  Nous contacter
                  <ChevronRight className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepRegisterPage;
