import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Upload, 
  UserCog, 
  Building2, 
  Landmark, 
  Scale, 
  UserCheck, 
  Store, 
  Home
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

// Définition des types de rôles avec leurs spécificités
const ROLE_TYPES = {
  'Particulier': {
    icon: User,
    color: 'bg-blue-500',
    description: 'Personne physique recherchant un bien immobilier',
    fields: ['email', 'phone', 'full_name', 'address', 'location'],
    permissions: ['search_properties', 'contact_sellers', 'save_favorites'],
    FileTexts: []
  },
  'Vendeur Particulier': {
    icon: Home,
    color: 'bg-green-500', 
    description: 'Propriétaire vendant son bien immobilier',
    fields: ['email', 'phone', 'full_name', 'address', 'location', 'properties_owned'],
    permissions: ['list_properties', 'manage_listings', 'contact_buyers'],
    FileTexts: ['proof_of_ownership', 'identity_card']
  },
  'Vendeur Professionnel': {
    icon: Store,
    color: 'bg-purple-500',
    description: 'Professionnel de l\'immobilier (agence, promoteur)',
    fields: ['email', 'phone', 'full_name', 'company_name', 'business_license', 'address', 'location'],
    permissions: ['bulk_listings', 'professional_tools', 'analytics', 'client_management'],
    FileTexts: ['business_license', 'tax_certificate', 'professional_insurance']
  },
  'Géomètre': {
    icon: Building,
    color: 'bg-orange-500',
    description: 'Expert géomètre pour relevés et certifications',
    fields: ['email', 'phone', 'full_name', 'license_number', 'specializations', 'address', 'location'],
    permissions: ['certify_properties', 'create_surveys', 'technical_reports'],
    FileTexts: ['professional_license', 'insurance_certificate', 'qualifications']
  },
  'Notaire': {
    icon: Scale,
    color: 'bg-red-500',
    description: 'Notaire pour transactions et actes authentiques',
    fields: ['email', 'phone', 'full_name', 'office_name', 'bar_number', 'address', 'location'],
    permissions: ['create_authentic_acts', 'validate_transactions', 'legal_advice'],
    FileTexts: ['notary_license', 'bar_registration', 'office_insurance']
  },
  'Mairie': {
    icon: Landmark,
    color: 'bg-indigo-500',
    description: 'Représentant municipal pour autorisations',
    fields: ['email', 'phone', 'full_name', 'municipality', 'department', 'position', 'location'],
    permissions: ['issue_permits', 'urban_planning', 'municipal_approvals'],
    FileTexts: ['municipal_authorization', 'official_mandate']
  },
  'Banque': {
    icon: Building2,
    color: 'bg-yellow-500',
    description: 'Institution financière pour crédits immobiliers',
    fields: ['email', 'phone', 'full_name', 'bank_name', 'branch', 'license', 'address', 'location'],
    permissions: ['approve_loans', 'financial_products', 'credit_analysis'],
    FileTexts: ['banking_license', 'financial_statements', 'regulatory_approvals']
  },
  'Agent Foncier': {
    icon: UserCog,
    color: 'bg-gray-500',
    description: 'Agent spécialisé en droit foncier et régularisation',
    fields: ['email', 'phone', 'full_name', 'agency', 'specializations', 'address', 'location'],
    permissions: ['land_regularization', 'title_verification', 'legal_consulting'],
    FileTexts: ['professional_certificate', 'legal_authorization', 'insurance']
  },
  'Investisseur': {
    icon: Shield,
    color: 'bg-emerald-500',
    description: 'Investisseur recherchant des opportunités immobilières',
    fields: ['email', 'phone', 'full_name', 'investment_type', 'budget_range', 'preferred_locations', 'address', 'location'],
    permissions: ['access_investments', 'portfolio_management', 'market_analysis', 'exclusive_deals'],
    FileTexts: ['financial_statements', 'investment_profile', 'bank_references']
  },
  'Promoteur': {
    icon: Building2,
    color: 'bg-rose-500',
    description: 'Promoteur immobilier développant des projets',
    fields: ['email', 'phone', 'full_name', 'company_name', 'project_types', 'portfolio', 'address', 'location'],
    permissions: ['create_projects', 'project_management', 'marketing_tools', 'investor_relations'],
    FileTexts: ['developer_license', 'company_registration', 'project_portfolio', 'financial_guarantees']
  }
};

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
  },
  'Diourbel': {
    'Diourbel': ['Diourbel', 'Ndoulo', 'Gade Escale'],
    'Mbacké': ['Mbacké', 'Touba', 'Darou Khoudoss'],
    'Bambey': ['Bambey', 'Refane', 'Ngoye']
  },
  'Kaolack': {
    'Kaolack': ['Kaolack', 'Malème Hoddar', 'Sibassor'],
    'Nioro du Rip': ['Nioro du Rip', 'Médina Sabakh', 'Paoskoto'],
    'Guinguinéo': ['Guinguinéo', 'Fimela', 'Diakhao']
  }
};

const IntelligentUserWizard = ({ isOpen, onClose, onUserCreated }) => {
  const [step, setStep] = useState(0); // 0: Choix du rôle, 1-4: Étapes spécifiques
  const [selectedRoleType, setSelectedRoleType] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Reset wizard when opening
  React.useEffect(() => {
    if (isOpen) {
      setStep(0);
      setSelectedRoleType(null);
      setFormData({});
      setSelectedRegion('');
      setSelectedDepartment('');
      setSelectedCommune('');
      setGeneratedPassword('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    return password;
  };

  const handleRoleSelection = (roleKey) => {
    setSelectedRoleType(roleKey);
    setFormData(prev => ({ ...prev, role: roleKey }));
    generatePassword();
    setStep(1);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const userData = {
        ...formData,
        region: selectedRegion,
        department: selectedDepartment,
        commune: selectedCommune,
        country: 'Sénégal',
        password: generatedPassword,
        verification_status: 'pending',
        status: 'active',
        last_active_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select();

      if (error) throw error;

      if (onUserCreated) {
        onUserCreated(data[0]);
      }

      // Show success message
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          description: `Utilisateur ${selectedRoleType} créé avec succès !`,
          variant: 'default'
        });
      }

      onClose();
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          description: `Erreur lors de la création: ${error.message}`,
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 0: return 'Choisir le type d\'utilisateur';
      case 1: return 'Informations personnelles';
      case 2: return `Configuration ${selectedRoleType}`;
      case 3: return 'Localisation au Sénégal';
      case 4: return 'Finalisation du compte';
      default: return '';
    }
  };

  const getProgressPercentage = () => {
    return (step / 4) * 100;
  };

  const isStepValid = () => {
    switch (step) {
      case 0: return selectedRoleType !== null;
      case 1: 
        return formData.full_name && formData.email && formData.phone;
      case 2: 
        if (!selectedRoleType) return false;
        const roleConfig = ROLE_TYPES[selectedRoleType];
        return roleConfig.fields.every(field => {
          if (field === 'location') return true; // Sera rempli à l'étape 3
          return formData[field] || field === 'address'; // address optionnel
        });
      case 3: 
        return selectedRegion && selectedDepartment;
      case 4: 
        return generatedPassword && formData.full_name;
      default: return false;
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quel type d'utilisateur souhaitez-vous créer ?
        </h3>
        <p className="text-gray-600 text-sm">
          Sélectionnez le rôle pour adapter le formulaire aux besoins spécifiques
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {Object.entries(ROLE_TYPES).map(([roleKey, roleConfig]) => {
          const IconComponent = roleConfig.icon;
          return (
            <Card 
              key={roleKey}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                selectedRoleType === roleKey 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleRoleSelection(roleKey)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${roleConfig.color} text-white`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-sm font-medium">{roleKey}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs text-gray-600 mb-3">
                  {roleConfig.description}
                </CardDescription>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {roleConfig.permissions.length} permissions
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {roleConfig.FileTexts.length} FileTexts
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          {selectedRoleType && (
            <>
              <div className={`p-2 rounded-lg ${ROLE_TYPES[selectedRoleType].color} text-white`}>
                {React.createElement(ROLE_TYPES[selectedRoleType].icon, { className: "h-5 w-5" })}
              </div>
              <h3 className="text-lg font-semibold">{selectedRoleType}</h3>
            </>
          )}
        </div>
        <p className="text-gray-600 text-sm">Informations personnelles de base</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="full_name">Nom complet *</Label>
          <Input
            id="full_name"
            value={formData.full_name || ''}
            onChange={(e) => updateFormData('full_name', e.target.value)}
            placeholder="Prénom et nom"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="email@exemple.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => updateFormData('phone', e.target.value)}
            placeholder="+221 XX XXX XX XX"
            required
          />
        </div>

        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            value={formData.address || ''}
            onChange={(e) => updateFormData('address', e.target.value)}
            placeholder="Adresse complète (optionnel)"
          />
        </div>
      </div>
    </div>
  );

  const renderRoleSpecificFields = () => {
    if (!selectedRoleType) return null;
    
    const roleConfig = ROLE_TYPES[selectedRoleType];
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold">Configuration {selectedRoleType}</h3>
          <p className="text-gray-600 text-sm">Informations spécifiques au rôle</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Champs spécifiques selon le rôle */}
          {selectedRoleType === 'Vendeur Professionnel' && (
            <>
              <div>
                <Label htmlFor="company_name">Nom de l'entreprise *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name || ''}
                  onChange={(e) => updateFormData('company_name', e.target.value)}
                  placeholder="Nom de votre entreprise"
                  required
                />
              </div>
              <div>
                <Label htmlFor="business_license">Numéro de licence *</Label>
                <Input
                  id="business_license"
                  value={formData.business_license || ''}
                  onChange={(e) => updateFormData('business_license', e.target.value)}
                  placeholder="Numéro de licence commerciale"
                  required
                />
              </div>
            </>
          )}

          {selectedRoleType === 'Géomètre' && (
            <>
              <div>
                <Label htmlFor="license_number">Numéro de licence *</Label>
                <Input
                  id="license_number"
                  value={formData.license_number || ''}
                  onChange={(e) => updateFormData('license_number', e.target.value)}
                  placeholder="Numéro de licence géomètre"
                  required
                />
              </div>
              <div>
                <Label htmlFor="specializations">Spécialisations</Label>
                <Textarea
                  id="specializations"
                  value={formData.specializations || ''}
                  onChange={(e) => updateFormData('specializations', e.target.value)}
                  placeholder="Vos domaines de spécialisation"
                  rows={3}
                />
              </div>
            </>
          )}

          {selectedRoleType === 'Notaire' && (
            <>
              <div>
                <Label htmlFor="office_name">Nom de l'étude *</Label>
                <Input
                  id="office_name"
                  value={formData.office_name || ''}
                  onChange={(e) => updateFormData('office_name', e.target.value)}
                  placeholder="Nom de votre étude notariale"
                  required
                />
              </div>
              <div>
                <Label htmlFor="bar_number">Numéro au barreau *</Label>
                <Input
                  id="bar_number"
                  value={formData.bar_number || ''}
                  onChange={(e) => updateFormData('bar_number', e.target.value)}
                  placeholder="Numéro d'inscription au barreau"
                  required
                />
              </div>
            </>
          )}

          {selectedRoleType === 'Mairie' && (
            <>
              <div>
                <Label htmlFor="municipality">Commune *</Label>
                <Input
                  id="municipality"
                  value={formData.municipality || ''}
                  onChange={(e) => updateFormData('municipality', e.target.value)}
                  placeholder="Nom de la commune"
                  required
                />
              </div>
              <div>
                <Label htmlFor="position">Poste occupé *</Label>
                <Select 
                  value={formData.position || ''} 
                  onValueChange={(value) => updateFormData('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre poste" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maire">Maire</SelectItem>
                    <SelectItem value="adjoint">Adjoint au Maire</SelectItem>
                    <SelectItem value="secretaire_general">Secrétaire Général</SelectItem>
                    <SelectItem value="chef_service_urbanisme">Chef Service Urbanisme</SelectItem>
                    <SelectItem value="responsable_foncier">Responsable Foncier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {selectedRoleType === 'Banque' && (
            <>
              <div>
                <Label htmlFor="bank_name">Nom de la banque *</Label>
                <Input
                  id="bank_name"
                  value={formData.bank_name || ''}
                  onChange={(e) => updateFormData('bank_name', e.target.value)}
                  placeholder="Nom de votre banque"
                  required
                />
              </div>
              <div>
                <Label htmlFor="branch">Agence *</Label>
                <Input
                  id="branch"
                  value={formData.branch || ''}
                  onChange={(e) => updateFormData('branch', e.target.value)}
                  placeholder="Nom de l'agence"
                  required
                />
              </div>
              <div>
                <Label htmlFor="license">Numéro de licence bancaire *</Label>
                <Input
                  id="license"
                  value={formData.license || ''}
                  onChange={(e) => updateFormData('license', e.target.value)}
                  placeholder="Numéro de licence"
                  required
                />
              </div>
            </>
          )}

          {selectedRoleType === 'Agent Foncier' && (
            <>
              <div>
                <Label htmlFor="agency">Agence/Cabinet *</Label>
                <Input
                  id="agency"
                  value={formData.agency || ''}
                  onChange={(e) => updateFormData('agency', e.target.value)}
                  placeholder="Nom de votre agence"
                  required
                />
              </div>
              <div>
                <Label htmlFor="specializations">Spécialisations</Label>
                <Textarea
                  id="specializations"
                  value={formData.specializations || ''}
                  onChange={(e) => updateFormData('specializations', e.target.value)}
                  placeholder="Régularisation foncière, titres de propriété, etc."
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        {/* Permissions du rôle */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Permissions accordées :</h4>
          <div className="flex flex-wrap gap-2">
            {roleConfig.permissions.map((permission, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {permission}
              </Badge>
            ))}
          </div>
        </div>

        {/* FileTexts requis */}
        {roleConfig.FileTexts.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">FileTexts requis :</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {roleConfig.FileTexts.map((doc, index) => (
                <li key={index}>• {doc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderLocationStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Localisation au Sénégal</h3>
        <p className="text-gray-600 text-sm">Région, département et commune</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="region">Région *</Label>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une région" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(SENEGAL_REGIONS).map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRegion && (
          <div>
            <Label htmlFor="department">Département *</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un département" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(SENEGAL_REGIONS[selectedRegion] || {}).map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedDepartment && (
          <div>
            <Label htmlFor="commune">Commune</Label>
            <Select value={selectedCommune} onValueChange={setSelectedCommune}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une commune" />
              </SelectTrigger>
              <SelectContent>
                {(SENEGAL_REGIONS[selectedRegion]?.[selectedDepartment] || []).map(commune => (
                  <SelectItem key={commune} value={commune}>{commune}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );

  const renderFinalStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold">Finalisation du compte</h3>
        <p className="text-gray-600 text-sm">Vérifiez les informations et créez le compte</p>
      </div>

      {/* Résumé des informations */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <h4 className="font-medium text-gray-900">Résumé :</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Type :</span> {selectedRoleType}</div>
          <div><span className="font-medium">Nom :</span> {formData.full_name}</div>
          <div><span className="font-medium">Email :</span> {formData.email}</div>
          <div><span className="font-medium">Téléphone :</span> {formData.phone}</div>
          <div><span className="font-medium">Région :</span> {selectedRegion}</div>
          <div><span className="font-medium">Département :</span> {selectedDepartment}</div>
        </div>
      </div>

      {/* Mot de passe généré */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Mot de passe généré :</h4>
        <div className="flex items-center gap-2">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={generatedPassword}
            readOnly
            className="bg-white"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Masquer' : 'Afficher'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generatePassword}
          >
            Régénérer
          </Button>
        </div>
        <p className="text-blue-700 text-xs mt-2">
          L'utilisateur devra changer ce mot de passe lors de sa première connexion
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 0: return renderRoleSelection();
      case 1: return renderPersonalInfo();
      case 2: return renderRoleSpecificFields();
      case 3: return renderLocationStep();
      case 4: return renderFinalStep();
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Assistant Intelligent de Création d'Utilisateur
          </DialogTitle>
        </DialogHeader>

        {/* Barre de progression */}
        {step > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{getStepTitle()}</span>
              <span className="text-sm text-gray-500">Étape {step} sur 4</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Contenu de l'étape */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {/* Boutons de navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={step === 0 ? onClose : prevStep}
            disabled={isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {step === 0 ? 'Annuler' : 'Précédent'}
          </Button>

          {step < 4 ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid() || isLoading}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Création...' : 'Créer l\'utilisateur'}
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IntelligentUserWizard;
