import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MapPin, 
  Building, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  FileText, 
  Upload
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

// Données territoriales du Sénégal
const SENEGAL_REGIONS = {
  'Dakar': {
    'Dakar': ['Dakar Plateau', 'Médina', 'Grand Dakar', 'Fann-Point E-Amitié', 'Gorée'],
    'Guédiawaye': ['Golf Sud', 'Sam Notaire', 'Wakhinane Nimzatt'],
    'Pikine': ['Pikine Est', 'Pikine Nord', 'Pikine Ouest', 'Thiaroye Gare'],
    'Rufisque': ['Rufisque Est', 'Rufisque Nord', 'Rufisque Ouest', 'Bargny']
  },
  'Thiès': {
    'Thiès': ['Thiès Nord', 'Thiès Sud', 'Thiès Est'],
    'Tivaouane': ['Tivaouane', 'Mékhé', 'Mboro'],
    'Mbour': ['Mbour', 'Saly Portudal', 'Joal-Fadiouth']
  },
  'Saint-Louis': {
    'Saint-Louis': ['Saint-Louis', 'Mpal', 'Gandon'],
    'Dagana': ['Dagana', 'Richard-Toll', 'Ross Béthio'],
    'Podor': ['Podor', 'Ndioum', 'Golléré']
  }
};

const ROLES = [
  'Particulier',
  'Vendeur Particulier', 
  'Vendeur Pro',
  'Mairie',
  'Banque',
  'Notaire',
  'Agent Foncier',
  'Géomètre',
  'Investisseur',
  'Promoteur',
  'Agriculteur'
];

const AddUserWizard = ({ isOpen, onClose, onUserAdded }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    
    // Étape 2: Localisation
    region: '',
    departement: '',
    commune: '',
    address: '',
    
    // Étape 3: Rôle et profession
    role: '',
    company_name: '',
    professional_id: '',
    specializations: [],
    
    // Étape 4: Validation et FileTexts
    password: '',
    confirm_password: '',
    terms_accepted: false,
    notifications_enabled: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      number: 1,
      title: 'Informations Personnelles',
      icon: User,
      description: 'Nom, email et coordonnées'
    },
    {
      number: 2,
      title: 'Localisation',
      icon: MapPin,
      description: 'Région, département et adresse'
    },
    {
      number: 3,
      title: 'Rôle & Profession',
      icon: Building,
      description: 'Type de compte et spécialisations'
    },
    {
      number: 4,
      title: 'Finalisation',
      icon: CheckCircle,
      description: 'Mot de passe et validation'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Nettoyer les erreurs pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.full_name.trim()) newErrors.full_name = 'Nom requis';
        if (!formData.email.trim()) newErrors.email = 'Email requis';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
        if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
        break;
        
      case 2:
        if (!formData.region) newErrors.region = 'Région requise';
        if (!formData.departement) newErrors.departement = 'Département requis';
        if (!formData.commune) newErrors.commune = 'Commune requise';
        if (!formData.address.trim()) newErrors.address = 'Adresse requise';
        break;
        
      case 3:
        if (!formData.role) newErrors.role = 'Rôle requis';
        if (['Banque', 'Mairie', 'Notaire'].includes(formData.role) && !formData.company_name.trim()) {
          newErrors.company_name = 'Nom de l\'organisation requis';
        }
        break;
        
      case 4:
        if (!formData.password) newErrors.password = 'Mot de passe requis';
        if (formData.password.length < 6) newErrors.password = 'Minimum 6 caractères';
        if (formData.password !== formData.confirm_password) {
          newErrors.confirm_password = 'Mots de passe différents';
        }
        if (!formData.terms_accepted) newErrors.terms_accepted = 'Acceptation requise';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    try {
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        region: formData.region,
        departement: formData.departement,
        commune: formData.commune,
        address: formData.address,
        company_name: formData.company_name,
        professional_id: formData.professional_id,
        verification_status: 'pending',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select();

      if (error) throw error;

      onUserAdded(data[0]);
      onClose();
      resetForm();
      
      // Toast de succès
      console.log('✅ Utilisateur créé avec succès');
      
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      region: '',
      departement: '',
      commune: '',
      address: '',
      role: '',
      company_name: '',
      professional_id: '',
      specializations: [],
      password: '',
      confirm_password: '',
      terms_accepted: false,
      notifications_enabled: true
    });
    setErrors({});
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name">Nom complet *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Ex: Jean Dupont"
                className={errors.full_name ? 'border-red-500' : ''}
              />
              {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>}
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="jean.dupont@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+221 XX XXX XX XX"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
            
            <div>
              <Label htmlFor="date_of_birth">Date de naissance</Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Région *</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => {
                  handleInputChange('region', value);
                  handleInputChange('departement', '');
                  handleInputChange('commune', '');
                }}
              >
                <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Choisir une région" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(SENEGAL_REGIONS).map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
            </div>
            
            {formData.region && (
              <div>
                <Label>Département *</Label>
                <Select
                  value={formData.departement}
                  onValueChange={(value) => {
                    handleInputChange('departement', value);
                    handleInputChange('commune', '');
                  }}
                >
                  <SelectTrigger className={errors.departement ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Choisir un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(SENEGAL_REGIONS[formData.region]).map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.departement && <p className="text-red-500 text-sm mt-1">{errors.departement}</p>}
              </div>
            )}
            
            {formData.departement && (
              <div>
                <Label>Commune *</Label>
                <Select
                  value={formData.commune}
                  onValueChange={(value) => handleInputChange('commune', value)}
                >
                  <SelectTrigger className={errors.commune ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Choisir une commune" />
                  </SelectTrigger>
                  <SelectContent>
                    {SENEGAL_REGIONS[formData.region][formData.departement].map(commune => (
                      <SelectItem key={commune} value={commune}>{commune}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.commune && <p className="text-red-500 text-sm mt-1">{errors.commune}</p>}
              </div>
            )}
            
            <div>
              <Label htmlFor="address">Adresse complète *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Adresse détaillée..."
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Type de compte *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Choisir un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
            </div>
            
            {['Banque', 'Mairie', 'Notaire', 'Vendeur Pro'].includes(formData.role) && (
              <div>
                <Label htmlFor="company_name">Nom de l'organisation *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="Ex: Banque de Dakar"
                  className={errors.company_name ? 'border-red-500' : ''}
                />
                {errors.company_name && <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>}
              </div>
            )}
            
            {['Notaire', 'Géomètre', 'Agent Foncier'].includes(formData.role) && (
              <div>
                <Label htmlFor="professional_id">Numéro professionnel</Label>
                <Input
                  id="professional_id"
                  value={formData.professional_id}
                  onChange={(e) => handleInputChange('professional_id', e.target.value)}
                  placeholder="Ex: NOT2024001"
                />
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Mot de passe *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Minimum 6 caractères"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div>
              <Label htmlFor="confirm_password">Confirmer le mot de passe *</Label>
              <Input
                id="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                placeholder="Retaper le mot de passe"
                className={errors.confirm_password ? 'border-red-500' : ''}
              />
              {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms_accepted"
                checked={formData.terms_accepted}
                onChange={(e) => handleInputChange('terms_accepted', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="terms_accepted" className="text-sm">
                J'accepte les conditions d'utilisation *
              </Label>
            </div>
            {errors.terms_accepted && <p className="text-red-500 text-sm">{errors.terms_accepted}</p>}
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notifications_enabled"
                checked={formData.notifications_enabled}
                onChange={(e) => handleInputChange('notifications_enabled', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="notifications_enabled" className="text-sm">
                Recevoir les notifications par email
              </Label>
            </div>
            
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Créer un nouveau compte
          </DialogTitle>
        </DialogHeader>
        
        {/* Indicateur d'étapes */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 mb-2
                  ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 
                    isCompleted ? 'bg-green-600 border-green-600 text-white' : 
                    'border-gray-300 text-gray-400'}
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-full mt-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`} />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Contenu de l'étape */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
        
        {/* Boutons de navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>
          
          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Création...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Créer le compte
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserWizard;
