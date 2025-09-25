import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Users,
  Calendar,
  FileText,
  Upload,
  Euro,
  Map,
  Camera,
  Ruler,
  CreditCard,
  Bitcoin,
  Banknote,
  Save,
  Eye,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
  X,
  Globe,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

const VendeurAddTerrain = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Informations générales
    title: '',
    description: '',
    price: '',
    surface: '',
    type: '',
    
    // Localisation
    region: '',
    city: '',
    address: '',
    coordinates: { lat: '', lng: '' },
    nearby_landmarks: [''],
    
    // Caractéristiques
    zoning: '',
    buildable_ratio: '',
    max_floors: '',
    main_features: [''],
    utilities: [],
    access_features: [],
    
    // Options de financement
    financing_methods: [],
    bank_financing: {
      available: false,
      min_down_payment: '',
      max_duration: '',
      partner_banks: []
    },
    installment: {
      available: false,
      min_down_payment: '',
      duration: ''
    },
    crypto: {
      available: false,
      accepted_currencies: [],
      discount: ''
    },
    
    // NFT et Blockchain
    nft_enabled: false,
    blockchain: 'Polygon',
    
    // Documents et images
    images: [],
    documents: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const totalSteps = 6;
  const completionPercentage = Math.round((currentStep / totalSteps) * 100);

  // Options prédéfinies
  const regionOptions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 
    'Tambacounda', 'Kolda', 'Matam', 'Kaffrine', 'Kédougou',
    'Louga', 'Fatick', 'Diourbel', 'Sédhiou'
  ];

  const typeOptions = [
    'Résidentiel', 'Commercial', 'Industriel', 'Agricole', 
    'Mixte', 'Lotissement', 'Terrain nu'
  ];

  const utilitiesOptions = [
    'Eau courante', 'Électricité SENELEC', 'Internet fibre optique',
    'Téléphone fixe', 'Éclairage public', 'Tout-à-l\'égout',
    'Collecte des déchets', 'Transport public'
  ];

  const accessOptions = [
    'Route pavée', 'Route en terre', 'Transport public',
    'Écoles à proximité', 'Centres de santé', 'Commerces',
    'Banques', 'Mosquées/Églises', 'Marché', 'Pharmacie'
  ];

  const financingOptions = [
    { id: 'direct', label: 'Paiement direct', icon: Euro },
    { id: 'bank', label: 'Financement bancaire', icon: CreditCard },
    { id: 'installment', label: 'Paiement échelonné', icon: Calendar },
    { id: 'crypto', label: 'Crypto-monnaie', icon: Bitcoin }
  ];

  const cryptoCurrencies = ['Bitcoin', 'Ethereum', 'USDC', 'USDT', 'BNB'];

  const senegalBanks = [
    'CBAO', 'UBA', 'Banque Atlantique', 'SGBS', 'Ecobank',
    'BOA', 'BHS', 'BICIS', 'Banque Agricole'
  ];

  // Fonctions utilitaires
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Supprimer l'erreur si le champ est maintenant valide
    if (errors[field] && value) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const toggleArrayValue = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Informations générales
        if (!formData.title) newErrors.title = 'Le titre est requis';
        if (!formData.price) newErrors.price = 'Le prix est requis';
        if (!formData.surface) newErrors.surface = 'La superficie est requise';
        if (!formData.type) newErrors.type = 'Le type de terrain est requis';
        break;
      
      case 2: // Localisation
        if (!formData.region) newErrors.region = 'La région est requise';
        if (!formData.city) newErrors.city = 'La ville est requise';
        if (!formData.address) newErrors.address = 'L\'adresse est requise';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('XOF', 'FCFA');
  };

  const handleSaveDraft = () => {
    console.log('Sauvegarde en brouillon:', formData);
    // Logique de sauvegarde
  };

  const handlePublish = () => {
    if (validateStep(currentStep)) {
      console.log('Publication du terrain:', formData);
      // Logique de publication
      navigate('/vendeur-dashboard?tab=properties');
    }
  };

  const StepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Étape {currentStep} sur {totalSteps}
        </h2>
        <div className="text-sm text-gray-600">
          {completionPercentage}% complété
        </div>
      </div>
      <Progress value={completionPercentage} className="mb-4" />
      <div className="flex justify-between text-xs text-gray-500">
        <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Informations générales</span>
        <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Localisation</span>
        <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Caractéristiques</span>
        <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : ''}>Financement</span>
        <span className={currentStep >= 5 ? 'text-blue-600 font-medium' : ''}>Médias & Documents</span>
        <span className={currentStep >= 6 ? 'text-blue-600 font-medium' : ''}>Aperçu & Publication</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Building2 className="mr-3 h-7 w-7 text-blue-600" />
                  Ajouter un terrain
                </h1>
                <p className="text-gray-600">
                  Créez une annonce détaillée pour votre terrain
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              <Button 
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <StepIndicator />

                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Étape 1: Informations générales */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <FileText className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-xl font-semibold">Informations générales</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <Label htmlFor="title">Titre de l'annonce *</Label>
                          <Input
                            id="title"
                            placeholder="Ex: Terrain résidentiel avec vue mer - Almadies"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className={errors.title ? 'border-red-500' : ''}
                          />
                          {errors.title && (
                            <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="price">Prix (FCFA) *</Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="85000000"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            className={errors.price ? 'border-red-500' : ''}
                          />
                          {errors.price && (
                            <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                          )}
                          {formData.price && (
                            <p className="text-sm text-gray-600 mt-1">
                              {formatPrice(formData.price)}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="surface">Superficie (m²) *</Label>
                          <Input
                            id="surface"
                            type="number"
                            placeholder="500"
                            value={formData.surface}
                            onChange={(e) => handleInputChange('surface', e.target.value)}
                            className={errors.surface ? 'border-red-500' : ''}
                          />
                          {errors.surface && (
                            <p className="text-sm text-red-600 mt-1">{errors.surface}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="type">Type de terrain *</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value) => handleInputChange('type', value)}
                          >
                            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Sélectionnez le type de terrain" />
                            </SelectTrigger>
                            <SelectContent>
                              {typeOptions.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.type && (
                            <p className="text-sm text-red-600 mt-1">{errors.type}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="description">Description détaillée</Label>
                          <Textarea
                            id="description"
                            placeholder="Décrivez votre terrain en détail..."
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={6}
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Une description détaillée augmente vos chances de vente
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Étape 2: Localisation */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <MapPin className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-xl font-semibold">Localisation</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="region">Région *</Label>
                          <Select
                            value={formData.region}
                            onValueChange={(value) => handleInputChange('region', value)}
                          >
                            <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Sélectionnez la région" />
                            </SelectTrigger>
                            <SelectContent>
                              {regionOptions.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.region && (
                            <p className="text-sm text-red-600 mt-1">{errors.region}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="city">Ville/Commune *</Label>
                          <Input
                            id="city"
                            placeholder="Ex: Dakar"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className={errors.city ? 'border-red-500' : ''}
                          />
                          {errors.city && (
                            <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="address">Adresse complète *</Label>
                          <Input
                            id="address"
                            placeholder="Ex: Route des Almadies, Parcelle N°147"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className={errors.address ? 'border-red-500' : ''}
                          />
                          {errors.address && (
                            <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="latitude">Latitude</Label>
                          <Input
                            id="latitude"
                            placeholder="14.7381"
                            value={formData.coordinates.lat}
                            onChange={(e) => handleNestedInputChange('coordinates', 'lat', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor="longitude">Longitude</Label>
                          <Input
                            id="longitude"
                            placeholder="-17.5094"
                            value={formData.coordinates.lng}
                            onChange={(e) => handleNestedInputChange('coordinates', 'lng', e.target.value)}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label>Points de repère à proximité</Label>
                          {formData.nearby_landmarks.map((landmark, index) => (
                            <div key={index} className="flex items-center space-x-2 mt-2">
                              <Input
                                placeholder="Ex: Université Cheikh Anta Diop (8 km)"
                                value={landmark}
                                onChange={(e) => handleArrayInputChange('nearby_landmarks', index, e.target.value)}
                              />
                              {formData.nearby_landmarks.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeArrayItem('nearby_landmarks', index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addArrayItem('nearby_landmarks')}
                            className="mt-2"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter un point de repère
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={previousStep}
                      disabled={currentStep === 1}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Précédent
                    </Button>
                    
                    {currentStep < totalSteps ? (
                      <Button onClick={nextStep}>
                        Suivant
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    ) : (
                      <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Publier l'annonce
                      </Button>
                    )}
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Aperçu du terrain */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Aperçu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-12 h-12 text-blue-300" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {formData.title || 'Titre de votre terrain...'}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {formData.city && formData.region ? `${formData.city}, ${formData.region}` : 'Localisation...'}
                    </p>
                  </div>

                  {formData.price && (
                    <div className="text-xl font-bold text-blue-600">
                      {formatPrice(formData.price)}
                    </div>
                  )}

                  {formData.surface && (
                    <div className="flex items-center text-gray-600">
                      <Ruler className="w-4 h-4 mr-2" />
                      {formData.surface} m²
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Conseils */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Conseils IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      Ajoutez au moins 5 photos de qualité pour augmenter l'intérêt
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      Indiquez les coordonnées GPS pour une localisation précise
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">
                      Activez la tokenisation NFT pour plus de sécurité et de transparence
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques de performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Performance estimée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Score IA</span>
                    <span className="font-semibold">8.2/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Vues estimées</span>
                    <span className="font-semibold">500-800/mois</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temps de vente</span>
                    <span className="font-semibold">2-4 mois</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendeurAddTerrain;