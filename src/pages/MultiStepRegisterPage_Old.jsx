import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight,
  User,
  Building2,
  TrendingUp,
  Users,
  CheckCircle,
  Eye,
  EyeOff,
  Home,
  Briefcase,
  Star,
  Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Checkbox } from '@/components/ui/checkbox';

// Composants temporaires pour éviter les erreurs
const RadioGroup = ({ value, onValueChange, children, className }) => (
  <div className={className}>{children}</div>
);

const RadioGroupItem = ({ value, id }) => (
  <input type="radio" value={value} id={id} className="mr-2" />
);

const Checkbox = ({ id, checked, onCheckedChange }) => (
  <input 
    type="checkbox" 
    id={id} 
    checked={checked} 
    onChange={(e) => onCheckedChange(e.target.checked)}
    className="mr-2"
  />
);

const MultiStepRegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    experience: '',
    specializations: [],
    acceptTerms: false,
    newsletter: false
  });
  const navigate = useNavigate();

  const allowedRoles = [
    {
      id: 'particulier',
      title: 'Particulier',
      description: 'Acheteur ou vendeur individuel',
      icon: User,
      color: 'blue',
      features: ['Achat de propriétés', 'Vente de biens', 'Recherche avancée', 'Évaluations IA']
    },
    {
      id: 'vendeur-particulier', 
      title: 'Vendeur Particulier',
      description: 'Vendre ses biens personnels',
      icon: Home,
      color: 'green',
      features: ['Listing gratuit', 'Photos professionnelles', 'Promotion ciblée', 'Support vente']
    },
    {
      id: 'vendeur-pro',
      title: 'Vendeur Professionnel', 
      description: 'Agent ou vendeur commercial',
      icon: Briefcase,
      color: 'purple',
      features: ['Portfolio illimité', 'CRM intégré', 'Analytics avancés', 'Badge pro'],
      badge: 'Pro'
    },
    {
      id: 'investisseur',
      title: 'Investisseur',
      description: 'Investissement immobilier',
      icon: TrendingUp,
      color: 'orange',
      features: ['Analyses ROI', 'Opportunités exclusives', 'Portefeuille tracking', 'Conseils experts'],
      badge: 'Premium'
    }
  ];

  const steps = [
    { id: 1, title: 'Type de compte', description: 'Choisissez votre rôle' },
    { id: 2, title: 'Informations personnelles', description: 'Vos coordonnées' },
    { id: 3, title: 'Informations professionnelles', description: 'Détails métier' },
    { id: 4, title: 'Sécurité', description: 'Mot de passe et validation' }
  ];

  const getStepsForRole = (role) => {
    if (role === 'particulier') {
      return steps.filter(step => step.id !== 3); // Skip professional info
    }
    return steps;
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setFormData({ ...formData, role: roleId });
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSpecializationToggle = (specialization) => {
    const current = formData.specializations;
    const updated = current.includes(specialization)
      ? current.filter(s => s !== specialization)
      : [...current, specialization];
    setFormData({ ...formData, specializations: updated });
  };

  const nextStep = () => {
    const maxSteps = getStepsForRole(selectedRole).length;
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedRole !== '';
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 3:
        if (selectedRole === 'particulier') return true;
        return formData.companyName;
      case 4:
        return formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword && 
               formData.acceptTerms;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    
    // Simulation d'inscription
    console.log('Données d\'inscription:', formData);
    
    // Redirection selon le rôle
    const redirectPaths = {
      'particulier': '/dashboard/particulier',
      'vendeur-particulier': '/dashboard/vendeur',
      'vendeur-pro': '/dashboard/vendeur-pro',
      'investisseur': '/dashboard/investisseur'
    };
    
    navigate(redirectPaths[selectedRole] || '/dashboard');
  };

  const renderStepIndicator = () => {
    const relevantSteps = getStepsForRole(selectedRole);
    
    return (
      <div className="flex items-center justify-center mb-8">
        {relevantSteps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
              ${currentStep >= step.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
              }
            `}>
              {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : step.id}
            </div>
            {index < relevantSteps.length - 1 && (
              <div className={`
                w-16 h-1 mx-2
                ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}
              `} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quel est votre profil ?</h2>
        <p className="text-gray-600">Choisissez le type de compte qui correspond à vos besoins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allowedRoles.map((role) => (
          <Card 
            key={role.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedRole === role.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleRoleSelect(role.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${role.color}-100`}>
                  <role.icon className={`h-6 w-6 text-${role.color}-600`} />
                </div>
                {role.badge && (
                  <Badge className={`bg-${role.color}-500 text-white`}>
                    {role.badge}
                  </Badge>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{role.description}</p>
              
              <div className="space-y-2">
                {role.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              {selectedRole === role.id && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Sélectionné</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Vos informations personnelles</h2>
        <p className="text-gray-600">Renseignez vos coordonnées pour créer votre compte</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            type="text"
            placeholder="Votre prénom"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Votre nom"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+221 XX XXX XX XX"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => {
    if (selectedRole === 'particulier') return null;

    const specializations = {
      'vendeur-particulier': ['Résidentiel', 'Terrains', 'Appartements'],
      'vendeur-pro': ['Résidentiel', 'Commercial', 'Terrains', 'Luxe', 'Investissement'],
      'investisseur': ['Résidentiel', 'Commercial', 'Développement', 'REIT', 'International']
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations professionnelles</h2>
          <p className="text-gray-600">Détails sur votre activité professionnelle</p>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="companyName">
              {selectedRole === 'investisseur' ? 'Nom de la société/fonds' : 'Nom de l\'entreprise'} *
            </Label>
            <Input
              id="companyName"
              type="text"
              placeholder={selectedRole === 'investisseur' ? 'Nom de votre société' : 'Nom de votre agence'}
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="experience">Années d'expérience</Label>
            <RadioGroup 
              value={formData.experience} 
              onValueChange={(value) => handleInputChange('experience', value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0-2" id="exp1" />
                <Label htmlFor="exp1">0-2 ans</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3-5" id="exp2" />
                <Label htmlFor="exp2">3-5 ans</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6-10" id="exp3" />
                <Label htmlFor="exp3">6-10 ans</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="10+" id="exp4" />
                <Label htmlFor="exp4">Plus de 10 ans</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Spécialisations</Label>
            <p className="text-sm text-gray-600 mb-3">Sélectionnez vos domaines d'expertise</p>
            <div className="grid grid-cols-2 gap-3">
              {specializations[selectedRole]?.map((spec) => (
                <div key={spec} className="flex items-center space-x-2">
                  <Checkbox
                    id={spec}
                    checked={formData.specializations.includes(spec)}
                    onCheckedChange={() => handleSpecializationToggle(spec)}
                  />
                  <Label htmlFor={spec} className="text-sm">{spec}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sécurisation de votre compte</h2>
        <p className="text-gray-600">Créez un mot de passe sécurisé pour protéger votre compte</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="password">Mot de passe *</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Choisissez un mot de passe"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Minimum 8 caractères avec au moins une majuscule et un chiffre
          </p>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="mt-1"
          />
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
            />
            <Label htmlFor="acceptTerms" className="text-sm">
              J'accepte les{' '}
              <Link to="/legal" className="text-blue-600 hover:underline">
                conditions d'utilisation
              </Link>{' '}
              et la{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                politique de confidentialité
              </Link>{' '}
              *
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="newsletter"
              checked={formData.newsletter}
              onCheckedChange={(checked) => handleInputChange('newsletter', checked)}
            />
            <Label htmlFor="newsletter" className="text-sm">
              Je souhaite recevoir les actualités et offres spéciales de Teranga Foncier
            </Label>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer votre compte</h1>
          <p className="text-gray-600">Rejoignez la plateforme foncière de référence au Sénégal</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Main Content */}
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {renderCurrentStep()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Précédent
                </Button>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    Étape {currentStep} sur {getStepsForRole(selectedRole).length}
                  </span>
                  
                  {currentStep === getStepsForRole(selectedRole).length ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={!canProceed()}
                      className="flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Créer mon compte
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="flex items-center gap-2"
                    >
                      Suivant
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepRegisterPage;
