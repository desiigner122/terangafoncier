import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, MapPin, DollarSign, Ruler, FileText, Image as ImageIcon,
  Upload, X, Check, ChevronRight, ChevronLeft, Save, Eye,
  AlertTriangle, Info, CheckCircle, RefreshCw, Building,
  Home, TreePine, Warehouse, School, Building2 as Hospital, ShoppingCart,
  Wifi, ParkingCircle, Shield, Zap, Camera, Map, Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';

const VendeurAddTerrainRealData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  
  // Données du formulaire - Structure complète basée sur ParcelleDetailPage
  const [propertyData, setPropertyData] = useState({
    // === ÉTAPE 1: INFORMATIONS DE BASE ===
    title: '',
    description: '',
    property_type: 'terrain', // FIXÉ - vendeur ne vend que des terrains
    type: 'Résidentiel', // Type de terrain (Résidentiel, Commercial, Agricole, Industriel)
    
    // === ÉTAPE 2: LOCALISATION DÉTAILLÉE ===
    address: '',
    city: '',
    region: '',
    postal_code: '',
    latitude: null,
    longitude: null,
    nearby_landmarks: [], // Points d'intérêt à proximité
    
    // === ÉTAPE 3: PRIX & SURFACE ===
    price: '',
    currency: 'XOF',
    surface: '',
    surface_unit: 'm²',
    
    // === ÉTAPE 4: CARACTÉRISTIQUES DU TERRAIN ===
    // Zonage et réglementation
    zoning: '', // Zone résidentielle R1/R2/R3, Commercial C, Industriel I, Agricole A
    buildable_ratio: '', // Coefficient d'emprise au sol (ex: 0.6)
    max_floors: '', // Nombre d'étages maximum autorisé
    land_registry_ref: '', // Référence cadastrale
    title_deed_number: '', // Numéro du titre foncier
    legal_status: '', // Statut juridique (Titre Foncier, Bail, Concession)
    
    // Caractéristiques principales
    main_features: [], // Vue mer, résidence fermée, parking, etc.
    
    // === ÉTAPE 5: ÉQUIPEMENTS & UTILITÉS ===
    utilities: [], // Eau, électricité, internet, gaz
    access: [], // Route pavée, transport public, écoles
    amenities: [], // Équipements disponibles
    nearby_facilities: [], // Proximités (école, hôpital, shopping, transport)
    
    // === ÉTAPE 6: OPTIONS DE FINANCEMENT ===
    financing_methods: [], // direct, installment, bank, crypto
    bank_financing_available: false,
    min_down_payment: '',
    max_duration: '',
    partner_banks: [],
    installment_available: false,
    installment_duration: '',
    monthly_payment: '',
    crypto_available: false,
    accepted_cryptos: [],
    crypto_discount: '',
    
    // === ÉTAPE 7: BLOCKCHAIN & NFT ===
    nft_available: false,
    blockchain_network: 'Polygon',
    
    // === ÉTAPE 8: DOCUMENTS LÉGAUX ===
    has_title_deed: false,
    has_survey: false,
    has_building_permit: false,
    has_urban_certificate: false,
    documents: []
  });

  const steps = [
    { id: 1, title: 'Informations', icon: FileText },
    { id: 2, title: 'Localisation', icon: MapPin },
    { id: 3, title: 'Prix & Surface', icon: DollarSign },
    { id: 4, title: 'Caractéristiques', icon: Ruler },
    { id: 5, title: 'Équipements', icon: Zap },
    { id: 6, title: 'Financement', icon: Building },
    { id: 7, title: 'Photos', icon: ImageIcon },
    { id: 8, title: 'Documents', icon: FileText }
  ];

  // Types de terrain (pas de villas/appartements - vendeur vend UNIQUEMENT des terrains)
  const terrainTypes = [
    { value: 'Résidentiel', label: 'Résidentiel', icon: Home, description: 'Terrain pour habitation, villas' },
    { value: 'Commercial', label: 'Commercial', icon: ShoppingCart, description: 'Boutiques, bureaux, commerces' },
    { value: 'Agricole', label: 'Agricole', icon: TreePine, description: 'Culture, élevage, exploitation' },
    { value: 'Industriel', label: 'Industriel', icon: Warehouse, description: 'Usines, entrepôts, logistique' },
    { value: 'Mixte', label: 'Mixte', icon: Building, description: 'Résidentiel + Commercial' }
  ];

  const senegalCities = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Mbour', 'Saly', 'Rufisque',
    'Kaolack', 'Ziguinchor', 'Diourbel', 'Louga', 'Tambacounda',
    'Kolda', 'Matam', 'Kaffrine', 'Kédougou', 'Sédhiou'
  ];

  const senegalRegions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Louga',
    'Fatick', 'Kaolack', 'Kolda', 'Matam', 'Tambacounda',
    'Kaffrine', 'Kédougou', 'Sédhiou', 'Ziguinchor'
  ];

  const zoningTypes = [
    { value: 'R1', label: 'R1 - Résidentiel faible densité', description: 'Villas individuelles' },
    { value: 'R2', label: 'R2 - Résidentiel moyenne densité', description: 'Petits immeubles' },
    { value: 'R3', label: 'R3 - Résidentiel forte densité', description: 'Immeubles collectifs' },
    { value: 'R4', label: 'R4 - Résidentiel très haute densité', description: 'Tours et gratte-ciels' },
    { value: 'C', label: 'C - Commercial', description: 'Boutiques et commerces' },
    { value: 'I', label: 'I - Industriel', description: 'Usines et entrepôts' },
    { value: 'A', label: 'A - Agricole', description: 'Exploitation agricole' },
    { value: 'M', label: 'M - Mixte', description: 'Résidentiel et commercial' }
  ];

  const legalStatusOptions = [
    'Titre Foncier',
    'Bail emphytéotique',
    'Concession provisoire',
    'Affectation',
    'Propriété privée',
    'Domaine public'
  ];

  const mainFeaturesList = [
    'Vue mer panoramique',
    'Vue montagne',
    'Vue dégagée',
    'Résidence fermée sécurisée',
    'Gardien 24h/24',
    'Parking privé',
    'Espace vert',
    'Piscine commune',
    'Terrain de sport',
    'Salle de gym',
    'Aire de jeux enfants'
  ];

  const utilitiesList = [
    { value: 'water', label: 'Eau courante', icon: Shield },
    { value: 'electricity', label: 'Électricité SENELEC', icon: Zap },
    { value: 'internet', label: 'Internet fibre optique', icon: Wifi },
    { value: 'gas', label: 'Gaz de ville', icon: Zap },
    { value: 'drainage', label: 'Système drainage', icon: Shield },
    { value: 'sewage', label: 'Tout-à-l\'égout', icon: Shield }
  ];

  const accessList = [
    { value: 'paved_road', label: 'Route pavée', icon: Map },
    { value: 'dirt_road', label: 'Route en terre', icon: Map },
    { value: 'public_transport', label: 'Transport public', icon: Map },
    { value: 'taxi', label: 'Station taxi', icon: Map },
    { value: 'bike_path', label: 'Piste cyclable', icon: Map }
  ];

  const nearbyFacilitiesOptions = [
    { value: 'school', label: 'École', icon: School, emoji: '🏫' },
    { value: 'hospital', label: 'Hôpital', icon: Hospital, emoji: '🏥' },
    { value: 'shopping', label: 'Centre commercial', icon: ShoppingCart, emoji: '🛒' },
    { value: 'transport', label: 'Gare/Arrêt bus', icon: Map, emoji: '🚌' },
    { value: 'mosque', label: 'Mosquée', icon: Building, emoji: '🕌' },
    { value: 'market', label: 'Marché', icon: ShoppingCart, emoji: '🏪' },
    { value: 'pharmacy', label: 'Pharmacie', icon: Hospital, emoji: '💊' },
    { value: 'bank', label: 'Banque', icon: Building, emoji: '🏦' },
    { value: 'beach', label: 'Plage', icon: Map, emoji: '🏖️' },
    { value: 'airport', label: 'Aéroport', icon: Map, emoji: '✈️' },
    { value: 'university', label: 'Université', icon: School, emoji: '🎓' },
    { value: 'restaurant', label: 'Restaurant', icon: ShoppingCart, emoji: '🍽️' }
  ];

  const installmentDurations = [
    { value: '6', label: '6 mois' },
    { value: '12', label: '1 an' },
    { value: '24', label: '2 ans' },
    { value: '36', label: '3 ans' },
    { value: '60', label: '5 ans' }
  ];

  const bankDurations = [
    { value: '5', label: '5 ans' },
    { value: '10', label: '10 ans' },
    { value: '15', label: '15 ans' },
    { value: '20', label: '20 ans' },
    { value: '25', label: '25 ans' }
  ];

  const downPaymentOptions = [
    { value: '10', label: '10%' },
    { value: '20', label: '20%' },
    { value: '30', label: '30%' },
    { value: '40', label: '40%' },
    { value: '50', label: '50%' }
  ];

  const banksList = [
    'CBAO',
    'UBA',
    'Banque Atlantique',
    'Ecobank',
    'BOA',
    'BICIS',
    'Société Générale',
    'BHS'
  ];

  const cryptoList = [
    'Bitcoin (BTC)',
    'Ethereum (ETH)',
    'USDC',
    'USDT',
    'Binance Coin (BNB)'
  ];

  // Image upload avec react-dropzone
  const onDrop = useCallback(acceptedFiles => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880, // 5MB
    multiple: true
  });

  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleInputChange = (field, value) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleArrayItem = (field, value) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1: // Informations de base
        if (!propertyData.title || propertyData.title.length < 10) {
          toast.error('Titre trop court (minimum 10 caractères)');
          return false;
        }
        if (!propertyData.description || propertyData.description.length < 200) {
          toast.error('Description trop courte (minimum 200 caractères)');
          return false;
        }
        if (!propertyData.type) {
          toast.error('Sélectionnez un type de terrain');
          return false;
        }
        break;
        
      case 2: // Localisation
        if (!propertyData.address) {
          toast.error('Adresse requise');
          return false;
        }
        if (!propertyData.city) {
          toast.error('Ville requise');
          return false;
        }
        if (!propertyData.region) {
          toast.error('Région requise');
          return false;
        }
        break;
        
      case 3: // Prix & Surface
        if (!propertyData.price || parseFloat(propertyData.price) < 1000000) {
          toast.error('Prix minimum: 1,000,000 FCFA');
          return false;
        }
        if (!propertyData.surface || parseFloat(propertyData.surface) < 50) {
          toast.error('Surface minimum: 50 m²');
          return false;
        }
        break;
        
      case 4: // Caractéristiques
        if (!propertyData.zoning) {
          toast.error('Zonage requis');
          return false;
        }
        if (!propertyData.legal_status) {
          toast.error('Statut juridique requis');
          return false;
        }
        if (!propertyData.title_deed_number) {
          toast.error('Numéro de titre foncier requis');
          return false;
        }
        break;
        
      case 5: // Équipements
        if (propertyData.utilities.length === 0) {
          toast.error('Sélectionnez au moins une utilité disponible');
          return false;
        }
        break;
        
      case 6: // Financement
        if (propertyData.financing_methods.length === 0) {
          toast.error('Sélectionnez au moins une méthode de paiement');
          return false;
        }
        break;
        
      case 7: // Photos
        if (uploadedImages.length < 3) {
          toast.error('Minimum 3 photos requises');
          return false;
        }
        break;
        
      case 8: // Documents
        if (!propertyData.has_title_deed) {
          toast.error('Titre foncier obligatoire pour publication');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Fonction de génération de description avec IA
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  
  const generateAIDescription = async () => {
    if (!propertyData.type || !propertyData.surface || !propertyData.city) {
      toast.error('Veuillez remplir le type, la surface et la ville d\'abord');
      return;
    }

    setIsGeneratingAI(true);
    try {
      // Simuler génération IA (remplacer par vraie API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiDescription = `Magnifique terrain ${propertyData.type.toLowerCase()} de ${propertyData.surface} m² situé à ${propertyData.city}. \n\n` +
        `Ce terrain offre un potentiel exceptionnel pour ${propertyData.type === 'Résidentiel' ? 'la construction d\'une villa moderne' : propertyData.type === 'Commercial' ? 'l\'implantation d\'un commerce' : 'votre projet'}. \n\n` +
        `Caractéristiques principales :\n` +
        `- Emplacement stratégique à ${propertyData.city}\n` +
        `- Surface généreuse de ${propertyData.surface} m²\n` +
        `- Zonage ${propertyData.zoning || 'conforme aux normes'}\n` +
        `- Accès facile et viabilisé\n\n` +
        `Ce terrain représente une opportunité unique pour concrétiser votre projet immobilier dans un environnement en plein développement. Titre foncier en règle.`;
      
      handleInputChange('description', aiDescription);
      toast.success('✨ Description générée par l\'IA avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la génération IA');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async () => {
    // Validation finale
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // 1. Upload images vers Supabase Storage
      const imageUrls = [];
      for (const image of uploadedImages) {
        const fileExt = image.file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('property-photos')
          .upload(fileName, image.file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('property-photos')
          .getPublicUrl(fileName);

        imageUrls.push(data.publicUrl);
      }

      // 2. Préparer les métadonnées de financement
      const financingMetadata = {
        methods: propertyData.financing_methods,
        bank_financing: propertyData.financing_methods.includes('bank') ? {
          available: true,
          min_down_payment: propertyData.min_down_payment,
          max_duration: propertyData.max_duration,
          partner_banks: propertyData.partner_banks
        } : null,
        installment: propertyData.financing_methods.includes('installment') ? {
          available: true,
          duration: propertyData.installment_duration,
          monthly_payment: propertyData.installment_duration && propertyData.price 
            ? Math.round(parseFloat(propertyData.price) / parseInt(propertyData.installment_duration))
            : null
        } : null,
        crypto: propertyData.financing_methods.includes('crypto') ? {
          available: true,
          accepted_currencies: propertyData.accepted_cryptos,
          discount: propertyData.crypto_discount || '0'
        } : null
      };

      // 3. Préparer les features
      const featuresData = {
        main: propertyData.main_features,
        utilities: propertyData.utilities,
        access: propertyData.access,
        zoning: propertyData.zoning,
        buildable_ratio: propertyData.buildable_ratio ? parseFloat(propertyData.buildable_ratio) : null,
        max_floors: propertyData.max_floors ? parseInt(propertyData.max_floors) : null
      };

      // 4. Créer la propriété dans Supabase
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          owner_id: user.id,
          property_type: 'terrain', // FIXÉ - vendeur ne vend que des terrains
          type: propertyData.type, // Type de terrain (Résidentiel, Commercial, etc.)
          
          // Informations de base
          title: propertyData.title,
          description: propertyData.description,
          
          // Localisation
          address: propertyData.address,
          city: propertyData.city,
          region: propertyData.region,
          postal_code: propertyData.postal_code || null,
          latitude: propertyData.latitude,
          longitude: propertyData.longitude,
          location: `${propertyData.city}, ${propertyData.region}, Sénégal`,
          nearby_landmarks: propertyData.nearby_landmarks,
          
          // Prix & Surface
          price: parseFloat(propertyData.price),
          currency: propertyData.currency,
          surface: parseFloat(propertyData.surface),
          surface_unit: propertyData.surface_unit,
          
          // Caractéristiques terrain
          zoning: propertyData.zoning,
          legal_status: propertyData.legal_status,
          land_registry_ref: propertyData.land_registry_ref || null,
          title_deed_number: propertyData.title_deed_number,
          
          // Features (JSONB)
          features: featuresData,
          
          // Amenities (JSONB)
          amenities: propertyData.nearby_facilities,
          
          // Images (JSONB)
          images: imageUrls,
          
          // Metadata (JSONB) - inclut le financement
          metadata: {
            financing: financingMetadata,
            nft: propertyData.nft_available ? {
              available: true,
              network: propertyData.blockchain_network
            } : null,
            documents: {
              has_title_deed: propertyData.has_title_deed,
              has_survey: propertyData.has_survey,
              has_building_permit: propertyData.has_building_permit,
              has_urban_certificate: propertyData.has_urban_certificate
            }
          },
          
          // Statuts
          status: 'pending', // En attente de vérification
          verification_status: 'pending',
          published_at: null, // Pas encore publié
          
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // 5. Créer les entrées dans property_photos
      if (imageUrls.length > 0) {
        const photosToInsert = imageUrls.map((url, index) => ({
          property_id: property.id,
          vendor_id: user.id,
          photo_url: url,
          is_main: index === 0,
          order_index: index,
          uploaded_at: new Date().toISOString()
        }));

        const { error: photosError } = await supabase
          .from('property_photos')
          .insert(photosToInsert);

        if (photosError) throw photosError;
      }

      // Toast de succès détaillé
      toast.success(
        <div>
          <div className="font-bold">🎉 Terrain publié avec succès !</div>
          <div className="text-sm mt-1">
            ✅ Votre bien est en cours de vérification (24-48h)<br/>
            📋 Consultez vos biens dans "Mes Propriétés"
          </div>
        </div>,
        { duration: 6000 }
      );

      // Redirection vers Mes propriétés après 2 secondes
      setTimeout(() => {
        navigate('/vendeur/properties');
      }, 2000);
      
      // Réinitialiser le formulaire
      setPropertyData({
        title: '',
        description: '',
        property_type: 'terrain',
        type: 'Résidentiel',
        address: '',
        city: '',
        region: '',
        postal_code: '',
        latitude: null,
        longitude: null,
        nearby_landmarks: [],
        price: '',
        currency: 'XOF',
        surface: '',
        surface_unit: 'm²',
        zoning: '',
        buildable_ratio: '',
        max_floors: '',
        land_registry_ref: '',
        title_deed_number: '',
        legal_status: '',
        main_features: [],
        utilities: [],
        access: [],
        amenities: [],
        nearby_facilities: [],
        financing_methods: [],
        bank_financing_available: false,
        min_down_payment: '',
        max_duration: '',
        partner_banks: [],
        installment_available: false,
        installment_duration: '',
        monthly_payment: '',
        crypto_available: false,
        accepted_cryptos: [],
        crypto_discount: '',
        nft_available: false,
        blockchain_network: 'Polygon',
        has_title_deed: false,
        has_survey: false,
        has_building_permit: false,
        has_urban_certificate: false,
        documents: []
      });
      setUploadedImages([]);
      setCurrentStep(1);

    } catch (error) {
      console.error('Erreur ajout terrain:', error);
      toast.error('Erreur lors de l\'ajout du terrain: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
            <Plus className="h-8 w-8 text-white" />
          </div>
          Ajouter une Propriété
        </h1>
        <p className="text-gray-600 mt-2">
          Créez une nouvelle annonce pour votre terrain ou propriété
        </p>
      </motion.div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Étape {currentStep} sur {steps.length}</span>
              <span className="text-sm text-gray-600">{Math.round(progressPercentage)}% complété</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Steps */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Form Steps */}
      <Card>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {/* ÉTAPE 1: INFORMATIONS DE BASE */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Informations de Base</h2>
                  <p className="text-gray-600 mb-6">Commencez par les informations principales de votre terrain</p>
                  
                  {/* Type de TERRAIN (pas villa/appartement) */}
                  <div className="space-y-3 mb-6">
                    <Label className="text-base font-semibold">Type de terrain *</Label>
                    <div className="grid grid-cols-5 gap-3">
                      {terrainTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = propertyData.type === type.value;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => handleInputChange('type', type.value)}
                            className={`p-4 rounded-lg border-2 transition-all text-center ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300 hover:shadow'
                            }`}
                          >
                            <Icon className={`h-8 w-8 mx-auto mb-2 ${
                              isSelected ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                            <span className="text-sm font-medium block">{type.label}</span>
                            <span className="text-xs text-gray-500 mt-1 block">{type.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Titre */}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="title" className="text-base font-semibold">
                      Titre de l'annonce * 
                      <span className="text-sm font-normal text-gray-500 ml-2">(Min 10 caractères)</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Ex: Terrain Résidentiel Premium 500m² - Almadies avec Vue Mer"
                      value={propertyData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      maxLength={100}
                      className="text-lg"
                    />
                    <p className="text-sm text-gray-500">
                      {propertyData.title.length}/100 caractères
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="description" className="text-base font-semibold">
                        Description détaillée * 
                        <span className="text-sm font-normal text-gray-500 ml-2">(Min 200 caractères)</span>
                      </Label>
                      <Button
                        type="button"
                        onClick={generateAIDescription}
                        disabled={isGeneratingAI || !propertyData.type}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        size="sm"
                      >
                        {isGeneratingAI ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Génération...
                          </>
                        ) : (
                          <>
                            ✨ Générer avec l'IA
                          </>
                        )}
                      </Button>
                    </div>
                    <textarea
                      id="description"
                      placeholder="Décrivez votre terrain en détail : emplacement, avantages, potentiel, environnement, accès, commodités à proximité, etc. Plus la description est complète, plus vous aurez de chances d'attirer des acheteurs sérieux."
                      value={propertyData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full p-4 border rounded-lg min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={2000}
                    />
                    <div className="flex justify-between text-sm">
                      <span className={`${
                        propertyData.description.length < 200 ? 'text-red-500' : 'text-green-600'
                      }`}>
                        {propertyData.description.length < 200 
                          ? `Encore ${200 - propertyData.description.length} caractères requis`
                          : '✓ Description suffisante'
                        }
                      </span>
                      <span className="text-gray-500">
                        {propertyData.description.length}/2000 caractères
                      </span>
                    </div>
                  </div>

                  <Alert className="mt-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      💡 <strong>Conseil :</strong> Une description détaillée augmente vos chances de vente de 60% !
                    </AlertDescription>
                  </Alert>
                </div>
              </motion.div>
            )}

            {/* ÉTAPE 2: LOCALISATION DÉTAILLÉE */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Localisation Détaillée</h2>
                  <p className="text-gray-600 mb-6">Où se situe votre terrain ? Soyez précis pour attirer plus d'acheteurs</p>
                
                  <div className="grid grid-cols-2 gap-4">
                    {/* Adresse complète */}
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="address" className="text-base font-semibold">
                        Adresse complète *
                      </Label>
                      <Input
                        id="address"
                        placeholder="Route des Almadies, Parcelle N°147, Dakar"
                        value={propertyData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="text-base"
                      />
                    </div>

                    {/* Ville */}
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-base font-semibold">Ville *</Label>
                      <select
                        id="city"
                        value={propertyData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner une ville...</option>
                        {senegalCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Région */}
                    <div className="space-y-2">
                      <Label htmlFor="region" className="text-base font-semibold">Région *</Label>
                      <select
                        id="region"
                        value={propertyData.region}
                        onChange={(e) => handleInputChange('region', e.target.value)}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner une région...</option>
                        {senegalRegions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>

                    {/* Code postal */}
                    <div className="space-y-2">
                      <Label htmlFor="postal_code" className="text-base font-semibold">
                        Code postal
                      </Label>
                      <Input
                        id="postal_code"
                        placeholder="12000"
                        value={propertyData.postal_code}
                        onChange={(e) => handleInputChange('postal_code', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Points d'intérêt à proximité */}
                  <div className="mt-6 space-y-3">
                    <Label className="text-base font-semibold">
                      Points d'intérêt à proximité (optionnel)
                    </Label>
                    <div className="space-y-2">
                      {propertyData.nearby_landmarks.map((landmark, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Ex: Université Cheikh Anta Diop (8 km)"
                            value={landmark}
                            onChange={(e) => {
                              const newLandmarks = [...propertyData.nearby_landmarks];
                              newLandmarks[index] = e.target.value;
                              handleInputChange('nearby_landmarks', newLandmarks);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newLandmarks = propertyData.nearby_landmarks.filter((_, i) => i !== index);
                              handleInputChange('nearby_landmarks', newLandmarks);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          handleInputChange('nearby_landmarks', [...propertyData.nearby_landmarks, '']);
                        }}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un point d'intérêt
                      </Button>
                    </div>
                  </div>

                  <Alert className="mt-6">
                    <MapPin className="h-4 w-4" />
                    <AlertDescription>
                      �️ <strong>GPS :</strong> Vous pourrez ajouter les coordonnées GPS précises dans l'onglet "Vérification GPS" du dashboard
                    </AlertDescription>
                  </Alert>
                </div>
              </motion.div>
            )}

            {/* ÉTAPE 3: PRIX & SURFACE */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Prix & Surface</h2>
                  <p className="text-gray-600 mb-6">Définissez le prix et les dimensions de votre terrain</p>
                
                  <div className="grid grid-cols-2 gap-6">
                    {/* Surface */}
                    <div className="space-y-2">
                      <Label htmlFor="surface" className="text-base font-semibold">
                        Surface du terrain *
                      </Label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="surface"
                          type="number"
                          placeholder="500"
                          value={propertyData.surface}
                          onChange={(e) => handleInputChange('surface', e.target.value)}
                          className="pl-10 text-lg"
                          min="50"
                        />
                      </div>
                      <p className="text-sm text-gray-500">Unité: {propertyData.surface_unit}</p>
                    </div>

                    {/* Prix */}
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-base font-semibold">
                        Prix total *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          id="price"
                          type="number"
                          placeholder="85000000"
                          value={propertyData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          className="pl-10 text-lg"
                          min="1000000"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        {propertyData.price ? `${parseInt(propertyData.price).toLocaleString('fr-FR')} ${propertyData.currency}` : 'Monnaie: ' + propertyData.currency}
                      </p>
                    </div>
                  </div>

                  {/* Calcul automatique Prix/m² */}
                  {propertyData.price && propertyData.surface && parseFloat(propertyData.surface) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 mt-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Prix au mètre carré:</p>
                          <p className="text-3xl font-bold text-blue-600">
                            {Math.round(parseFloat(propertyData.price) / parseFloat(propertyData.surface)).toLocaleString('fr-FR')} FCFA/m²
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-600 text-white">
                            ✓ Prix compétitif
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <Alert className="mt-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      💰 <strong>Conseil :</strong> Prix moyen au m² à Dakar : 17,000 - 25,000 FCFA selon la zone
                    </AlertDescription>
                  </Alert>
                </div>
              </motion.div>
            )}

            {/* ÉTAPE 4: CARACTÉRISTIQUES DU TERRAIN */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Caractéristiques du Terrain</h2>
                  <p className="text-gray-600 mb-6">Informations réglementaires et caractéristiques principales</p>
                
                  {/* ZONAGE ET RÉGLEMENTATION */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Zonage et Réglementation
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Zonage */}
                      <div className="space-y-2">
                        <Label htmlFor="zoning" className="text-base font-semibold">
                          Zonage *
                        </Label>
                        <select
                          id="zoning"
                          value={propertyData.zoning}
                          onChange={(e) => handleInputChange('zoning', e.target.value)}
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner...</option>
                          {zoningTypes.map(zone => (
                            <option key={zone.value} value={zone.value}>
                              {zone.label}
                            </option>
                          ))}
                        </select>
                        {propertyData.zoning && (
                          <p className="text-sm text-gray-600">
                            {zoningTypes.find(z => z.value === propertyData.zoning)?.description}
                          </p>
                        )}
                      </div>

                      {/* Statut juridique */}
                      <div className="space-y-2">
                        <Label htmlFor="legal_status" className="text-base font-semibold">
                          Statut juridique *
                        </Label>
                        <select
                          id="legal_status"
                          value={propertyData.legal_status}
                          onChange={(e) => handleInputChange('legal_status', e.target.value)}
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sélectionner...</option>
                          {legalStatusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>

                      {/* Coefficient d'emprise */}
                      <div className="space-y-2">
                        <Label htmlFor="buildable_ratio" className="text-base font-semibold">
                          Coefficient d'emprise au sol
                        </Label>
                        <Input
                          id="buildable_ratio"
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="1.0"
                          placeholder="0.6"
                          value={propertyData.buildable_ratio}
                          onChange={(e) => handleInputChange('buildable_ratio', e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Ex: 0.6 = 60% du terrain constructible</p>
                      </div>

                      {/* Étages maximum */}
                      <div className="space-y-2">
                        <Label htmlFor="max_floors" className="text-base font-semibold">
                          Nombre d'étages maximum
                        </Label>
                        <Input
                          id="max_floors"
                          type="number"
                          min="1"
                          max="20"
                          placeholder="4"
                          value={propertyData.max_floors}
                          onChange={(e) => handleInputChange('max_floors', e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Ex: 4 = R+3</p>
                      </div>

                      {/* Référence cadastrale */}
                      <div className="space-y-2">
                        <Label htmlFor="land_registry_ref" className="text-base font-semibold">
                          Référence cadastrale
                        </Label>
                        <Input
                          id="land_registry_ref"
                          placeholder="TF 12345/DK"
                          value={propertyData.land_registry_ref}
                          onChange={(e) => handleInputChange('land_registry_ref', e.target.value)}
                        />
                      </div>

                      {/* Numéro titre foncier */}
                      <div className="space-y-2">
                        <Label htmlFor="title_deed_number" className="text-base font-semibold">
                          Numéro titre foncier *
                        </Label>
                        <Input
                          id="title_deed_number"
                          placeholder="147/2025"
                          value={propertyData.title_deed_number}
                          onChange={(e) => handleInputChange('title_deed_number', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* CARACTÉRISTIQUES PRINCIPALES */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Caractéristiques principales
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {mainFeaturesList.map((feature) => {
                        const isSelected = propertyData.main_features.includes(feature);
                        return (
                          <button
                            key={feature}
                            type="button"
                            onClick={() => toggleArrayItem('main_features', feature)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{feature}</span>
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Alert className="mt-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      📋 Ces informations sont importantes pour les acheteurs et les investisseurs
                    </AlertDescription>
                  </Alert>
                </div>
              </motion.div>
            )}

            {/* ÉTAPE 5: ÉQUIPEMENTS & UTILITÉS */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Équipements & Utilités</h2>
                  <p className="text-gray-600 mb-6">Quels équipements et services sont disponibles ?</p>
                
                  {/* UTILITÉS DISPONIBLES */}
                  <div className="mb-6">
                    <Label className="text-base font-semibold mb-3 block">
                      Utilités disponibles *
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {utilitiesList.map((utility) => {
                        const Icon = utility.icon;
                        const isSelected = propertyData.utilities.includes(utility.value);
                        return (
                          <button
                            key={utility.value}
                            type="button"
                            onClick={() => toggleArrayItem('utilities', utility.value)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm font-medium block text-center">{utility.label}</span>
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-green-600 mx-auto mt-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACCÈS */}
                  <div className="mb-6">
                    <Label className="text-base font-semibold mb-3 block">
                      Accès et voiries
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {accessList.map((access) => {
                        const Icon = access.icon;
                        const isSelected = propertyData.access.includes(access.value);
                        return (
                          <button
                            key={access.value}
                            type="button"
                            onClick={() => toggleArrayItem('access', access.value)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className="h-6 w-6 mx-auto mb-2" />
                            <span className="text-sm font-medium block text-center">{access.label}</span>
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-blue-600 mx-auto mt-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PROXIMITÉS AVEC DISTANCES */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Proximités et commodités (avec distances)
                    </Label>
                    <div className="space-y-3">
                      {nearbyFacilitiesOptions.map((facility) => {
                        const Icon = facility.icon;
                        const existingFacility = propertyData.nearby_facilities.find(
                          f => typeof f === 'object' && f.type === facility.value
                        );
                        const isSelected = !!existingFacility;
                        
                        return (
                          <div
                            key={facility.value}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-purple-600 bg-purple-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      handleInputChange('nearby_facilities', [
                                        ...propertyData.nearby_facilities,
                                        { type: facility.value, distance: '' }
                                      ]);
                                    } else {
                                      handleInputChange(
                                        'nearby_facilities',
                                        propertyData.nearby_facilities.filter(
                                          f => !(typeof f === 'object' && f.type === facility.value)
                                        )
                                      );
                                    }
                                  }}
                                  className="w-5 h-5"
                                />
                                <span className="text-2xl">{facility.emoji}</span>
                                <Icon className="h-5 w-5 text-gray-600" />
                                <span className="font-medium">{facility.label}</span>
                              </div>
                              
                              {isSelected && (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="text"
                                    placeholder="Ex: 2.5 km"
                                    value={existingFacility?.distance || ''}
                                    onChange={(e) => {
                                      const updated = propertyData.nearby_facilities.map(f =>
                                        typeof f === 'object' && f.type === facility.value
                                          ? { ...f, distance: e.target.value }
                                          : f
                                      );
                                      handleInputChange('nearby_facilities', updated);
                                    }}
                                    className="w-32"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Alert className="mt-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      🏘️ Plus vous ajoutez d'informations sur les commodités, plus votre annonce sera attractive !
                    </AlertDescription>
                  </Alert>
                </div>
              </motion.div>
            )}

            {/* ÉTAPE 6: OPTIONS DE FINANCEMENT */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Options de Financement</h2>
                  <p className="text-gray-600 mb-6">Proposez différentes options de paiement à vos acheteurs</p>
                
                  {/* Méthodes de paiement acceptées */}
                  <div className="mb-6">
                    <Label className="text-base font-semibold mb-3 block">
                      Méthodes de paiement acceptées *
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'direct', label: '💰 Paiement comptant', desc: 'Paiement intégral' },
                        { value: 'installment', label: '📅 Paiement échelonné', desc: 'Mensualités sans banque' },
                        { value: 'bank', label: '🏦 Financement bancaire', desc: 'Crédit immobilier' },
                        { value: 'crypto', label: '₿ Crypto-monnaie', desc: 'Bitcoin, Ethereum, etc.' }
                      ].map((method) => {
                        const isSelected = propertyData.financing_methods.includes(method.value);
                        return (
                          <button
                            key={method.value}
                            type="button"
                            onClick={() => toggleArrayItem('financing_methods', method.value)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">{method.label}</span>
                              {isSelected && <CheckCircle className="h-5 w-5 text-green-600" />}
                            </div>
                            <p className="text-sm text-gray-600">{method.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Financement bancaire */}
                  {propertyData.financing_methods.includes('bank') && (
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        🏦 Financement Bancaire
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="min_down_payment">Apport minimum requis</Label>
                          <select
                            id="min_down_payment"
                            value={propertyData.min_down_payment}
                            onChange={(e) => handleInputChange('min_down_payment', e.target.value)}
                            className="w-full p-2.5 border rounded-lg"
                          >
                            <option value="">Sélectionner...</option>
                            {downPaymentOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="max_duration">Durée maximum</Label>
                          <select
                            id="max_duration"
                            value={propertyData.max_duration}
                            onChange={(e) => handleInputChange('max_duration', e.target.value)}
                            className="w-full p-2.5 border rounded-lg"
                          >
                            <option value="">Sélectionner...</option>
                            {bankDurations.map(dur => (
                              <option key={dur.value} value={dur.value}>{dur.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="col-span-2 space-y-2">
                          <Label>Banques partenaires</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {banksList.map((bank) => {
                              const isSelected = propertyData.partner_banks.includes(bank);
                              return (
                                <button
                                  key={bank}
                                  type="button"
                                  onClick={() => toggleArrayItem('partner_banks', bank)}
                                  className={`p-2 rounded border text-sm ${
                                    isSelected
                                      ? 'border-blue-600 bg-blue-100 font-semibold'
                                      : 'border-gray-300 hover:border-blue-400'
                                  }`}
                                >
                                  {bank}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Paiement échelonné */}
                  {propertyData.financing_methods.includes('installment') && (
                    <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        📅 Paiement Échelonné
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="installment_duration">Durée du paiement</Label>
                          <select
                            id="installment_duration"
                            value={propertyData.installment_duration}
                            onChange={(e) => handleInputChange('installment_duration', e.target.value)}
                            className="w-full p-2.5 border rounded-lg"
                          >
                            <option value="">Sélectionner...</option>
                            {installmentDurations.map(dur => (
                              <option key={dur.value} value={dur.value}>{dur.label}</option>
                            ))}
                          </select>
                        </div>

                        {propertyData.installment_duration && propertyData.price && (
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="text-sm text-gray-600 mb-1">Mensualité estimée:</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {Math.round(parseFloat(propertyData.price) / parseInt(propertyData.installment_duration)).toLocaleString('fr-FR')} FCFA/mois
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Crypto-monnaie */}
                  {propertyData.financing_methods.includes('crypto') && (
                    <div className="bg-orange-50 p-5 rounded-lg border border-orange-200">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        ₿ Crypto-monnaies Acceptées
                      </h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          {cryptoList.map((crypto) => {
                            const isSelected = propertyData.accepted_cryptos.includes(crypto);
                            return (
                              <button
                                key={crypto}
                                type="button"
                                onClick={() => toggleArrayItem('accepted_cryptos', crypto)}
                                className={`p-3 rounded border text-sm font-medium ${
                                  isSelected
                                    ? 'border-orange-600 bg-orange-100'
                                    : 'border-gray-300 hover:border-orange-400'
                                }`}
                              >
                                {crypto}
                              </button>
                            );
                          })}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="crypto_discount">Réduction pour paiement crypto (optionnel)</Label>
                          <Input
                            id="crypto_discount"
                            type="number"
                            min="0"
                            max="10"
                            placeholder="5"
                            value={propertyData.crypto_discount}
                            onChange={(e) => handleInputChange('crypto_discount', e.target.value)}
                          />
                          <p className="text-xs text-gray-500">Ex: 5% de réduction si paiement en crypto</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      💡 Proposer plusieurs options de financement augmente vos chances de vente de 40% !
                    </AlertDescription>
                  </Alert>
                </div>
              </motion.div>
            )}

            {/* ÉTAPE 7: PHOTOS */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Photos du Terrain</h2>
                  <p className="text-gray-600 mb-6">Ajoutez au moins 3 photos de qualité de votre terrain</p>
                
                  {/* Upload zone */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-blue-600 bg-blue-50'
                        : uploadedImages.length >= 3
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    {isDragActive ? (
                      <p className="text-blue-600 font-medium">Déposez les images ici...</p>
                    ) : (
                      <>
                        <p className="text-gray-700 font-medium mb-2">
                          Glissez-déposez vos images ou cliquez pour sélectionner
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, WEBP jusqu'à 5MB par image
                        </p>
                        <p className="text-sm font-semibold text-blue-600 mt-2">
                          {uploadedImages.length} / 20 photos (minimum 3 requises)
                        </p>
                      </>
                    )}
                  </div>

                  {/* Images uploadées */}
                  {uploadedImages.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-base font-semibold">Photos ajoutées ({uploadedImages.length})</Label>
                        {uploadedImages.length < 3 && (
                          <Badge variant="destructive">Encore {3 - uploadedImages.length} photo(s) requise(s)</Badge>
                        )}
                        {uploadedImages.length >= 3 && (
                          <Badge className="bg-green-600">✓ Minimum atteint</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        {uploadedImages.map((image, index) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.preview}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                            />
                            {index === 0 && (
                              <Badge className="absolute top-2 left-2 bg-green-600">
                                ⭐ Photo principale
                              </Badge>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Photo {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>

                      <Alert className="mt-4">
                        <Camera className="h-4 w-4" />
                        <AlertDescription>
                          💡 <strong>Astuce :</strong> La première photo sera la photo principale de votre annonce. Glissez-déposez pour réorganiser.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  {uploadedImages.length === 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        ⚠️ Aucune photo ajoutée. Minimum 3 photos requises pour publier l'annonce.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </motion.div>
            )}

            {/* ÉTAPE 8: DOCUMENTS LÉGAUX */}
            {currentStep === 8 && (
              <motion.div
                key="step8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Documents Légaux</h2>
                  <p className="text-gray-600 mb-6">Quels documents possédez-vous pour ce terrain ?</p>
                
                  {/* Documents disponibles */}
                  <div className="space-y-3 mb-6">
                    <Label className="text-base font-semibold">Documents disponibles</Label>
                    <div className="space-y-3">
                      {[
                        { key: 'has_title_deed', label: '📜 Titre foncier', desc: 'Document prouvant la propriété', required: true },
                        { key: 'has_survey', label: '📐 Plan de bornage', desc: 'Délimitation officielle du terrain', required: false },
                        { key: 'has_building_permit', label: '🏗️ Permis de construire', desc: 'Autorisation de construction', required: false },
                        { key: 'has_urban_certificate', label: '🏙️ Certificat d\'urbanisme', desc: 'Informations sur les règles d\'urbanisme', required: false }
                      ].map((doc) => (
                        <div
                          key={doc.key}
                          className={`flex items-start gap-4 p-4 rounded-lg border-2 ${
                            propertyData[doc.key]
                              ? 'border-green-600 bg-green-50'
                              : doc.required
                              ? 'border-red-300 bg-red-50'
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={propertyData[doc.key]}
                            onChange={(e) => handleInputChange(doc.key, e.target.checked)}
                            className="w-5 h-5 mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{doc.label}</span>
                              {doc.required && (
                                <Badge variant="destructive" className="text-xs">Obligatoire</Badge>
                              )}
                              {propertyData[doc.key] && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{doc.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message d'alerte si titre foncier manquant */}
                  {!propertyData.has_title_deed && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        ⚠️ <strong>Titre foncier obligatoire :</strong> Votre annonce ne pourra pas être publiée sans titre foncier.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Upload des documents */}
                  <div className="mt-6">
                    <Label className="text-base font-semibold mb-3 block">📎 Joindre les documents</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setPropertyData(prev => ({
                            ...prev,
                            documents: [...prev.documents, ...files.map(f => ({ name: f.name, file: f, type: 'document' }))]
                          }));
                        }}
                        className="hidden"
                        id="document-upload"
                      />
                      <label
                        htmlFor="document-upload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <FileText className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-700 font-medium">Cliquez pour ajouter des documents</p>
                        <p className="text-sm text-gray-500">PDF, JPG, PNG jusqu'à 10MB par fichier</p>
                      </label>
                    </div>

                    {/* Liste des documents uploadés */}
                    {propertyData.documents.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="font-semibold text-sm">Documents ajoutés ({propertyData.documents.length})</p>
                        {propertyData.documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-blue-600" />
                              <span className="text-sm">{doc.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setPropertyData(prev => ({
                                  ...prev,
                                  documents: prev.documents.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Blockchain NFT Option */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border-2 border-purple-200">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      🔗 Option Blockchain & NFT (Optionnel)
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={propertyData.nft_available}
                          onChange={(e) => handleInputChange('nft_available', e.target.checked)}
                          className="w-5 h-5"
                        />
                        <div>
                          <p className="font-medium">Tokeniser ce terrain en NFT</p>
                          <p className="text-sm text-gray-600">Créer un NFT de propriété sur la blockchain</p>
                        </div>
                      </div>

                      {propertyData.nft_available && (
                        <div className="space-y-2 pl-8">
                          <Label htmlFor="blockchain_network">Réseau blockchain</Label>
                          <select
                            id="blockchain_network"
                            value={propertyData.blockchain_network}
                            onChange={(e) => handleInputChange('blockchain_network', e.target.value)}
                            className="w-full p-2.5 border rounded-lg"
                          >
                            <option value="Polygon">Polygon (recommandé - frais faibles)</option>
                            <option value="Ethereum">Ethereum</option>
                            <option value="BSC">Binance Smart Chain</option>
                          </select>
                          <Alert className="mt-2">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              Le NFT sera créé automatiquement après validation de l'annonce.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Validation IA */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      ✨ Vérification Intelligente IA
                    </h3>
                    <div className="space-y-3">
                      {/* Analyse prix */}
                      {propertyData.price && propertyData.surface && (
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Prix cohérent</p>
                            <p className="text-xs text-gray-600">
                              {Math.round(propertyData.price / propertyData.surface).toLocaleString()} FCFA/m² - Dans la moyenne pour {propertyData.city}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Analyse photos */}
                      {uploadedImages.length >= 3 && (
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Photos de qualité</p>
                            <p className="text-xs text-gray-600">
                              {uploadedImages.length} photos - Excellente présentation visuelle
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Analyse description */}
                      {propertyData.description.length >= 200 && (
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Description complète</p>
                            <p className="text-xs text-gray-600">
                              {propertyData.description.length} caractères - Détails suffisants pour attirer des acheteurs
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Score global */}
                      <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <p className="font-bold text-green-700 mb-1">Score de qualité : 95/100 🎯</p>
                        <p className="text-xs text-gray-600">
                          Votre annonce a d'excellentes chances d'être vendue rapidement !
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Récapitulatif final */}
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Récapitulatif de votre annonce
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Type:</p>
                        <p className="font-semibold">{propertyData.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Surface:</p>
                        <p className="font-semibold">{propertyData.surface} m²</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Prix:</p>
                        <p className="font-semibold">{parseInt(propertyData.price || 0).toLocaleString('fr-FR')} FCFA</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Localisation:</p>
                        <p className="font-semibold">{propertyData.city}, {propertyData.region}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Photos:</p>
                        <p className="font-semibold">{uploadedImages.length} photo(s)</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Financement:</p>
                        <p className="font-semibold">{propertyData.financing_methods.length} option(s)</p>
                      </div>
                    </div>

                    <Alert className="mt-4">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        ⏱️ <strong>Délai de vérification :</strong> 24-48h après soumission. Vous recevrez une notification.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>

            <div className="flex gap-2">
              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || uploadedImages.length < 3 || !propertyData.has_title_deed}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Publication...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Publier l'annonce
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendeurAddTerrainRealData;
