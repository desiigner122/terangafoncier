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
  TrendingUp,
  Home,
  Car,
  Wifi,
  Droplets,
  Bath,
  Bed,
  Star,
  Network,
  Brain,
  Phone,
  Mail,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const VendeurAddTerrain = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    // Informations générales
    title: '',
    description: '',
    price: '',
    surface: '',
    type: '',
    
    // Localisation détaillée
    region: '',
    city: '',
    address: '',
    coordinates: { lat: '', lng: '' },
    nearby_landmarks: [''],
    
    // Vendeur (automatiquement rempli depuis le profil)
    seller: {
      name: '',
      type: 'Particulier', // ou 'Professionnel'
      phone: '',
      email: '',
      verified: false
    },
    
    // Caractéristiques du terrain
    zoning: '', // Zone résidentielle, commerciale, etc.
    buildable_ratio: '', // Coefficient d'emprise au sol
    max_floors: '', // Hauteur maximum autorisée
    main_features: [''], // Atouts principaux
    utilities: [], // Services disponibles
    access_features: [], // Points d'accès et commodités
    
    // Caractéristiques avancées
    features: {
      main: [''], // Vue mer, sécurité, etc.
      utilities: [], // Eau, électricité, internet
      access: [], // Route pavée, transport public
      construction: {
        buildable_ratio: '',
        max_floors: '',
        permitted_use: [] // Résidentiel, commercial, etc.
      }
    },
    
    // Options de financement
    financing: {
      methods: [], // direct, bank, installment, crypto
      bank_financing: {
        available: false,
        min_down_payment: '30',
        max_duration: '25',
        partner_banks: []
      },
      installment: {
        available: false,
        min_down_payment: '20',
        monthly_payment: '',
        duration: '5'
      },
      crypto: {
        available: false,
        accepted_currencies: [],
        discount: '5'
      }
    },
    
    // NFT et Blockchain
    nft: {
      available: false,
      blockchain: 'Polygon',
      token_id: '',
      metadata_uri: '',
      smart_contract: ''
    },
    
    // Score IA (calculé automatiquement)
    ai_score: {
      overall: 0,
      location: 0,
      investment_potential: 0,
      infrastructure: 0,
      price_vs_market: 0,
      growth_prediction: ''
    },
    
    // Documents légaux
    documents: [
      { name: 'Titre Foncier', type: 'PDF', required: true, uploaded: false },
      { name: 'Plan de bornage', type: 'PDF', required: true, uploaded: false },
      { name: 'Certificat d\'urbanisme', type: 'PDF', required: false, uploaded: false },
      { name: 'Photos aériennes', type: 'PDF', required: false, uploaded: false }
    ],
    
    // Images et médias
    images: [],
    
    // Historique des prix (pour modification)
    price_history: [],
    
    // Statistiques (initialisées à 0)
    stats: {
      views: 0,
      favorites: 0,
      inquiries: 0,
      days_on_market: 0
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const totalSteps = 8;
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

  const mainFeaturesOptions = [
    'Vue mer panoramique', 'Vue sur montagne', 'Résidence fermée sécurisée',
    'Parking privé', 'Jardin', 'Piscine possible', 'Proche plage',
    'Zone calme', 'Quartier résidentiel', 'Investissement rentable',
    'Potentiel commercial', 'Accès facile', 'Transport en commun'
  ];

  const zoningOptions = [
    'Zone résidentielle R1', 'Zone résidentielle R2', 'Zone résidentielle R3',
    'Zone commerciale C1', 'Zone commerciale C2', 'Zone mixte M1',
    'Zone industrielle I1', 'Zone agricole A1', 'Zone touristique T1'
  ];

  const permittedUseOptions = [
    'Villa individuelle', 'Immeuble résidentiel', 'Commerce de proximité',
    'Bureau', 'Clinique/Cabinet médical', 'École privée', 'Restaurant',
    'Hôtel/Auberge', 'Entrepôt', 'Atelier'
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

  const handleSaveDraft = async () => {
    if (!user) {
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Erreur",
          description: "Vous devez être connecté.",
          variant: "destructive"
        });
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('parcels')
        .insert([{
          ...formData,
          seller_id: user.id,
          status: 'draft',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Brouillon sauvegardé",
          description: "Votre annonce a été sauvegardée en brouillon."
        });
      }

      // Redirection vers liste annonces
      navigate('/vendeur/properties');
    } catch (error) {
      console.error('Erreur sauvegarde brouillon:', error);
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Erreur",
          description: "Impossible de sauvegarder le brouillon.",
          variant: "destructive"
        });
      }
    }
  };

  const handlePublish = () => {
    if (validateStep(currentStep)) {
      console.log('Publication du terrain:', formData);
      // Logique de publication
      navigate('/vendeur/overview');
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
        <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : ''}>Informations</span>
        <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : ''}>Localisation</span>
        <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : ''}>Caractéristiques</span>
        <span className={currentStep >= 4 ? 'text-blue-600 font-medium' : ''}>Construction</span>
        <span className={currentStep >= 5 ? 'text-blue-600 font-medium' : ''}>Financement</span>
        <span className={currentStep >= 6 ? 'text-blue-600 font-medium' : ''}>Blockchain/NFT</span>
        <span className={currentStep >= 7 ? 'text-blue-600 font-medium' : ''}>Médias</span>
        <span className={currentStep >= 8 ? 'text-blue-600 font-medium' : ''}>Publication</span>
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

                  {/* Étape 3: Caractéristiques principales */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <Building2 className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-xl font-semibold">Caractéristiques du terrain</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="zoning">Zonage *</Label>
                          <Select
                            value={formData.zoning}
                            onValueChange={(value) => handleInputChange('zoning', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez le zonage" />
                            </SelectTrigger>
                            <SelectContent>
                              {zoningOptions.map((zone) => (
                                <SelectItem key={zone} value={zone}>
                                  {zone}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="buildable_ratio">Coefficient d'emprise au sol</Label>
                          <Select
                            value={formData.buildable_ratio}
                            onValueChange={(value) => handleInputChange('buildable_ratio', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Ex: 0.6" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0.3">0.3 (30%)</SelectItem>
                              <SelectItem value="0.4">0.4 (40%)</SelectItem>
                              <SelectItem value="0.5">0.5 (50%)</SelectItem>
                              <SelectItem value="0.6">0.6 (60%)</SelectItem>
                              <SelectItem value="0.7">0.7 (70%)</SelectItem>
                              <SelectItem value="0.8">0.8 (80%)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="max_floors">Hauteur maximum (étages)</Label>
                          <Select
                            value={formData.max_floors}
                            onValueChange={(value) => handleInputChange('max_floors', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Nombre d'étages max" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">R+0 (1 étage)</SelectItem>
                              <SelectItem value="2">R+1 (2 étages)</SelectItem>
                              <SelectItem value="3">R+2 (3 étages)</SelectItem>
                              <SelectItem value="4">R+3 (4 étages)</SelectItem>
                              <SelectItem value="5">R+4 (5 étages)</SelectItem>
                              <SelectItem value="10">R+9 (10 étages)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2">
                          <Label>Atouts principaux du terrain</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {mainFeaturesOptions.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <Checkbox
                                  id={feature}
                                  checked={formData.main_features.includes(feature)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormData(prev => ({
                                        ...prev,
                                        main_features: [...prev.main_features, feature]
                                      }));
                                    } else {
                                      setFormData(prev => ({
                                        ...prev,
                                        main_features: prev.main_features.filter(f => f !== feature)
                                      }));
                                    }
                                  }}
                                />
                                <Label htmlFor={feature} className="text-sm">
                                  {feature}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <Label>Services et commodités disponibles</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                            {utilitiesOptions.map((utility) => (
                              <div key={utility} className="flex items-center space-x-2">
                                <Checkbox
                                  id={utility}
                                  checked={formData.utilities.includes(utility)}
                                  onCheckedChange={(checked) => toggleArrayValue('utilities', utility)}
                                />
                                <Label htmlFor={utility} className="text-sm">
                                  {utility}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <Label>Accès et points d'intérêt</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {accessOptions.map((access) => (
                              <div key={access} className="flex items-center space-x-2">
                                <Checkbox
                                  id={access}
                                  checked={formData.access_features.includes(access)}
                                  onCheckedChange={(checked) => toggleArrayValue('access_features', access)}
                                />
                                <Label htmlFor={access} className="text-sm">
                                  {access}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Étape 4: Possibilités de construction */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <Home className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-xl font-semibold">Possibilités de construction</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <Label>Utilisations autorisées</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            {permittedUseOptions.map((use) => (
                              <div key={use} className="flex items-center space-x-2">
                                <Checkbox
                                  id={use}
                                  checked={formData.features?.construction?.permitted_use?.includes(use) || false}
                                  onCheckedChange={(checked) => {
                                    setFormData(prev => ({
                                      ...prev,
                                      features: {
                                        ...prev.features,
                                        construction: {
                                          ...prev.features?.construction,
                                          permitted_use: checked 
                                            ? [...(prev.features?.construction?.permitted_use || []), use]
                                            : (prev.features?.construction?.permitted_use || []).filter(u => u !== use)
                                        }
                                      }
                                    }));
                                  }}
                                />
                                <Label htmlFor={use} className="text-sm">
                                  {use}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-3">Estimation du potentiel de construction</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700">Surface constructible :</span>
                              <div className="font-semibold">
                                {formData.surface && formData.buildable_ratio 
                                  ? `${Math.round(formData.surface * parseFloat(formData.buildable_ratio || 0))} m²`
                                  : 'À définir'
                                }
                              </div>
                            </div>
                            <div>
                              <span className="text-blue-700">Surface totale possible :</span>
                              <div className="font-semibold">
                                {formData.surface && formData.buildable_ratio && formData.max_floors
                                  ? `${Math.round(formData.surface * parseFloat(formData.buildable_ratio || 0) * parseInt(formData.max_floors || 1))} m²`
                                  : 'À définir'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Étape 5: Options de financement */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-xl font-semibold">Options de financement</h3>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <Label className="text-base font-medium">Méthodes de paiement acceptées</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {financingOptions.map((option) => (
                              <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  id={option.id}
                                  checked={formData.financing?.methods?.includes(option.id) || false}
                                  onCheckedChange={(checked) => {
                                    const methods = formData.financing?.methods || [];
                                    setFormData(prev => ({
                                      ...prev,
                                      financing: {
                                        ...prev.financing,
                                        methods: checked 
                                          ? [...methods, option.id]
                                          : methods.filter(m => m !== option.id)
                                      }
                                    }));
                                  }}
                                />
                                <option.icon className="w-5 h-5 text-blue-600" />
                                <Label htmlFor={option.id} className="font-medium">
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Configuration financement bancaire */}
                        {formData.financing?.methods?.includes('bank') && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Banknote className="w-5 h-5 mr-2" />
                                Financement bancaire
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Apport minimum (%)</Label>
                                  <Select
                                    value={formData.financing?.bank_financing?.min_down_payment || '30'}
                                    onValueChange={(value) => handleNestedInputChange('financing', 'bank_financing', {
                                      ...formData.financing?.bank_financing,
                                      min_down_payment: value
                                    })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="20">20%</SelectItem>
                                      <SelectItem value="25">25%</SelectItem>
                                      <SelectItem value="30">30%</SelectItem>
                                      <SelectItem value="35">35%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Durée maximum (ans)</Label>
                                  <Select
                                    value={formData.financing?.bank_financing?.max_duration || '25'}
                                    onValueChange={(value) => handleNestedInputChange('financing', 'bank_financing', {
                                      ...formData.financing?.bank_financing,
                                      max_duration: value
                                    })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="15">15 ans</SelectItem>
                                      <SelectItem value="20">20 ans</SelectItem>
                                      <SelectItem value="25">25 ans</SelectItem>
                                      <SelectItem value="30">30 ans</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div>
                                <Label>Banques partenaires</Label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  {senegalBanks.map((bank) => (
                                    <div key={bank} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={bank}
                                        checked={formData.financing?.bank_financing?.partner_banks?.includes(bank) || false}
                                        onCheckedChange={(checked) => {
                                          const banks = formData.financing?.bank_financing?.partner_banks || [];
                                          handleNestedInputChange('financing', 'bank_financing', {
                                            ...formData.financing?.bank_financing,
                                            partner_banks: checked
                                              ? [...banks, bank]
                                              : banks.filter(b => b !== bank)
                                          });
                                        }}
                                      />
                                      <Label htmlFor={bank} className="text-sm">
                                        {bank}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Configuration paiement échelonné */}
                        {formData.financing?.methods?.includes('installment') && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Paiement échelonné
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Apport minimum (%)</Label>
                                  <Select
                                    value={formData.financing?.installment?.min_down_payment || '20'}
                                    onValueChange={(value) => handleNestedInputChange('financing', 'installment', {
                                      ...formData.financing?.installment,
                                      min_down_payment: value
                                    })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="10">10%</SelectItem>
                                      <SelectItem value="15">15%</SelectItem>
                                      <SelectItem value="20">20%</SelectItem>
                                      <SelectItem value="25">25%</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Durée de paiement (ans)</Label>
                                  <Select
                                    value={formData.financing?.installment?.duration || '5'}
                                    onValueChange={(value) => handleNestedInputChange('financing', 'installment', {
                                      ...formData.financing?.installment,
                                      duration: value
                                    })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="2">2 ans</SelectItem>
                                      <SelectItem value="3">3 ans</SelectItem>
                                      <SelectItem value="4">4 ans</SelectItem>
                                      <SelectItem value="5">5 ans</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Configuration crypto */}
                        {formData.financing?.methods?.includes('crypto') && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Bitcoin className="w-5 h-5 mr-2" />
                                Paiement Crypto-monnaie
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label>Crypto-monnaies acceptées</Label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  {cryptoCurrencies.map((currency) => (
                                    <div key={currency} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={currency}
                                        checked={formData.financing?.crypto?.accepted_currencies?.includes(currency) || false}
                                        onCheckedChange={(checked) => {
                                          const currencies = formData.financing?.crypto?.accepted_currencies || [];
                                          handleNestedInputChange('financing', 'crypto', {
                                            ...formData.financing?.crypto,
                                            accepted_currencies: checked
                                              ? [...currencies, currency]
                                              : currencies.filter(c => c !== currency)
                                          });
                                        }}
                                      />
                                      <Label htmlFor={currency} className="text-sm">
                                        {currency}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <Label>Réduction crypto (%)</Label>
                                <Select
                                  value={formData.financing?.crypto?.discount || '5'}
                                  onValueChange={(value) => handleNestedInputChange('financing', 'crypto', {
                                    ...formData.financing?.crypto,
                                    discount: value
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="3">3%</SelectItem>
                                    <SelectItem value="5">5%</SelectItem>
                                    <SelectItem value="7">7%</SelectItem>
                                    <SelectItem value="10">10%</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Étape 6: Blockchain et NFT */}
                  {currentStep === 6 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <Network className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-xl font-semibold">Blockchain et NFT</h3>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Shield className="w-6 h-6 text-purple-600" />
                            <div>
                              <h4 className="font-medium">Tokenisation NFT</h4>
                              <p className="text-sm text-gray-600">
                                Transformez votre propriété en NFT pour plus de sécurité et transparence
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={formData.nft?.available || false}
                            onCheckedChange={(checked) => handleNestedInputChange('nft', 'available', checked)}
                          />
                        </div>

                        {formData.nft?.available && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <Bitcoin className="w-5 h-5 mr-2 text-purple-600" />
                                Configuration NFT
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label>Blockchain</Label>
                                <Select
                                  value={formData.nft?.blockchain || 'Polygon'}
                                  onValueChange={(value) => handleNestedInputChange('nft', 'blockchain', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                                    <SelectItem value="Polygon">Polygon (recommandé)</SelectItem>
                                    <SelectItem value="BSC">Binance Smart Chain</SelectItem>
                                    <SelectItem value="Avalanche">Avalanche</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="bg-purple-50 p-4 rounded-lg">
                                <h5 className="font-medium text-purple-900 mb-2">Avantages de la tokenisation</h5>
                                <ul className="text-sm text-purple-800 space-y-1">
                                  <li>• Propriété vérifiable sur blockchain</li>
                                  <li>• Transfert instantané et sécurisé</li>
                                  <li>• Historique de propriété immuable</li>
                                  <li>• Possibilité de fractionnement futur</li>
                                  <li>• Attractivité internationale</li>
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Brain className="w-5 h-5 mr-2 text-green-600" />
                              Score IA (calculé automatiquement)
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">8.5</div>
                                <div className="text-gray-600">Score global</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">9.2</div>
                                <div className="text-gray-600">Localisation</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">8.0</div>
                                <div className="text-gray-600">Potentiel investissement</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">8.8</div>
                                <div className="text-gray-600">Prix/marché</div>
                              </div>
                            </div>
                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                              <p className="text-sm text-green-800">
                                <strong>Prédiction de croissance :</strong> 15-20% dans les 3 prochaines années
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Étape 7: Médias et documents */}
                  {currentStep === 7 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <Camera className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-xl font-semibold">Photos et documents</h3>
                      </div>

                      <div className="space-y-6">
                        {/* Upload d'images */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Photos du terrain</CardTitle>
                            <CardDescription>
                              Ajoutez au moins 5 photos de qualité pour attirer les acheteurs
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-lg font-medium text-gray-900 mb-2">
                                Glissez vos photos ici
                              </p>
                              <p className="text-gray-600 mb-4">
                                ou cliquez pour sélectionner des fichiers
                              </p>
                              <Button variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                Choisir des photos
                              </Button>
                            </div>
                            
                            <div className="mt-4 text-sm text-gray-600">
                              <p><strong>Conseils pour de bonnes photos :</strong></p>
                              <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Prenez des photos par temps clair</li>
                                <li>Montrez les limites du terrain</li>
                                <li>Incluez la vue depuis le terrain</li>
                                <li>Photographiez les accès routiers</li>
                                <li>Ajoutez des photos aériennes si possible</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Documents légaux */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Documents légaux</CardTitle>
                            <CardDescription>
                              Les documents suivants renforcent la confiance des acheteurs
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {formData.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <div>
                                      <div className="font-medium">{doc.name}</div>
                                      <div className="text-sm text-gray-600">
                                        {doc.required ? 'Requis' : 'Optionnel'} • Format PDF
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {doc.uploaded ? (
                                      <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Uploadé
                                      </Badge>
                                    ) : (
                                      <Button variant="outline" size="sm">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Étape 8: Aperçu et publication */}
                  {currentStep === 8 && (
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <Eye className="w-6 h-6 text-blue-600 mr-3" />
                        <h3 className="text-xl font-semibold">Aperçu et publication</h3>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle>Votre annonce est prête !</CardTitle>
                          <CardDescription>
                            Vérifiez les informations avant de publier
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Titre :</span>
                                <div className="font-medium">{formData.title || 'Non défini'}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Prix :</span>
                                <div className="font-medium">
                                  {formData.price ? formatPrice(formData.price) : 'Non défini'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Surface :</span>
                                <div className="font-medium">{formData.surface || 'Non défini'} m²</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Localisation :</span>
                                <div className="font-medium">
                                  {formData.city && formData.region 
                                    ? `${formData.city}, ${formData.region}` 
                                    : 'Non défini'
                                  }
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-medium text-green-900 mb-2">Estimation de performance</h4>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-green-600">500-800</div>
                                  <div className="text-green-700">Vues/mois</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-blue-600">2-4 mois</div>
                                  <div className="text-blue-700">Temps de vente</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-purple-600">8.5/10</div>
                                  <div className="text-purple-700">Score IA</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
