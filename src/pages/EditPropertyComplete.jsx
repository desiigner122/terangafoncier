/**
 * PAGE D'ÉDITION COMPLÈTE DE PROPRIÉTÉ
 * ✅ TOUS les champs du formulaire d'ajout
 * ✅ 8 étapes : Infos, Localisation, Prix, Caractéristiques, Équipements, Financement, Photos, Documents
 * ✅ Support financement bancaire, crypto, NFT, caractéristiques personnalisées
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Save, Loader2, AlertCircle, Check, ChevronRight, ChevronLeft,
  FileText, MapPin, DollarSign, Ruler, Zap, Building, ImageIcon, Upload,
  Home, TreePine, Warehouse, School, Building2 as Hospital, ShoppingCart,
  Wifi, ParkingCircle, Shield, Camera, Map, X, Plus, Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';
import LoadingState from '@/components/ui/LoadingState';

const EditPropertyComplete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  // Photos réelles (table property_photos) et documents réels (table documents) liés à cette propriété
  const [photos, setPhotos] = useState([]);
  const [realDocuments, setRealDocuments] = useState([]);

  const [propertyData, setPropertyData] = useState({
    // === ÉTAPE 1: INFORMATIONS DE BASE ===
    title: '',
    description: '',
    property_type: 'terrain',
    type: 'Résidentiel',
    
    // === ÉTAPE 2: LOCALISATION ===
    address: '',
    city: '',
    region: '',
    postal_code: '',
    latitude: null,
    longitude: null,
    nearby_landmarks: [],
    
    // === ÉTAPE 3: PRIX & SURFACE ===
    price: '',
    currency: 'XOF',
    surface: '',
    surface_unit: 'm²',
    
    // === ÉTAPE 4: CARACTÉRISTIQUES ===
    zoning: '',
    buildable_ratio: '',
    max_floors: '',
    land_registry_ref: '',
    title_deed_number: '',
    legal_status: '',
    main_features: [],
    
    // === ÉTAPE 5: ÉQUIPEMENTS ===
    utilities: [],
    access: [],
    amenities: [],
    nearby_facilities: [],
    
    // === ÉTAPE 6: FINANCEMENT ===
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
    
    // === ÉTAPE 7: BLOCKCHAIN & NFT (statut réel, lecture seule — aucune colonne éditable n'existe) ===
    nft_token_id: null,
    blockchain_hash: null,
    transaction_hash: null,
    smart_contract_address: null,
    nft_readiness_score: null,
    verification_status: '',
    
    // === ÉTAPE 8: DOCUMENTS ===
    has_title_deed: false,
    has_survey: false,
    has_building_permit: false,
    has_urban_certificate: false,
    documents: [],
    
    // Images (séparé car géré différemment)
    images: []
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

  const terrainTypes = [
    { value: 'Résidentiel', label: 'Résidentiel', icon: Home },
    { value: 'Commercial', label: 'Commercial', icon: ShoppingCart },
    { value: 'Agricole', label: 'Agricole', icon: TreePine },
    { value: 'Industriel', label: 'Industriel', icon: Warehouse },
    { value: 'Mixte', label: 'Mixte', icon: Building }
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
    { value: 'R1', label: 'R1 - Résidentiel faible densité' },
    { value: 'R2', label: 'R2 - Résidentiel moyenne densité' },
    { value: 'R3', label: 'R3 - Résidentiel forte densité' },
    { value: 'R4', label: 'R4 - Résidentiel très haute densité' },
    { value: 'C', label: 'C - Commercial' },
    { value: 'I', label: 'I - Industriel' },
    { value: 'A', label: 'A - Agricole' },
    { value: 'M', label: 'M - Mixte' }
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
    { value: 'water', label: 'Eau courante' },
    { value: 'electricity', label: 'Électricité SENELEC' },
    { value: 'internet', label: 'Internet fibre optique' },
    { value: 'gas', label: 'Gaz de ville' },
    { value: 'drainage', label: 'Système drainage' },
    { value: 'sewage', label: 'Tout-à-l\'égout' }
  ];

  const accessList = [
    { value: 'paved_road', label: 'Route pavée' },
    { value: 'dirt_road', label: 'Route en terre' },
    { value: 'public_transport', label: 'Transport public' },
    { value: 'taxi', label: 'Station taxi' },
    { value: 'bike_path', label: 'Piste cyclable' }
  ];

  const nearbyFacilitiesOptions = [
    { value: 'school', label: 'École', emoji: '🏫' },
    { value: 'hospital', label: 'Hôpital', emoji: '🏥' },
    { value: 'shopping', label: 'Centre commercial', emoji: '🛒' },
    { value: 'transport', label: 'Gare/Arrêt bus', emoji: '🚌' },
    { value: 'mosque', label: 'Mosquée', emoji: '🕌' },
    { value: 'market', label: 'Marché', emoji: '🏪' },
    { value: 'pharmacy', label: 'Pharmacie', emoji: '💊' },
    { value: 'bank', label: 'Banque', emoji: '🏦' },
    { value: 'beach', label: 'Plage', emoji: '🏖️' },
    { value: 'airport', label: 'Aéroport', emoji: '✈️' }
  ];

  const financingMethods = [
    { value: 'direct', label: 'Paiement direct', description: 'Paiement unique' },
    { value: 'installment', label: 'Paiement échelonné', description: 'Facilités sans banque' },
    { value: 'bank', label: 'Financement bancaire', description: 'Prêt immobilier' },
    { value: 'crypto', label: 'Crypto-monnaie', description: 'Bitcoin, USDT' }
  ];

  const installmentDurations = [
    { value: '6', label: '6 mois' },
    { value: '12', label: '1 an' },
    { value: '24', label: '2 ans' },
    { value: '36', label: '3 ans' },
    { value: '60', label: '5 ans' }
  ];

  const cryptoCurrencies = [
    { value: 'BTC', label: 'Bitcoin (BTC)', icon: '₿' },
    { value: 'ETH', label: 'Ethereum (ETH)', icon: 'Ξ' },
    { value: 'USDT', label: 'Tether (USDT)', icon: '₮' },
    { value: 'USDC', label: 'USD Coin (USDC)', icon: '$' },
    { value: 'MATIC', label: 'Polygon (MATIC)', icon: '◆' }
  ];

  useEffect(() => {
    if (id && user?.id) {
      loadProperty();
    }
  }, [id, user?.id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        setError('Utilisateur non authentifié');
        return;
      }
      
      const { data, error: loadError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single();

      if (loadError) throw loadError;
      
      if (!data) {
        setError('Propriété non trouvée');
        return;
      }

      // Mapper UNIQUEMENT les colonnes qui existent réellement dans la table 'properties'.
      // Les champs des étapes 4, 5, 6 et les cases à cocher de l'étape 8 (zonage, équipements,
      // financement, documents légaux) n'ont aucune colonne correspondante en base : ils
      // conservent donc leur valeur locale par défaut (voir useState initial) et ne sont pas
      // écrasés ici. Cela évite d'afficher de fausses valeurs "chargées depuis la base".
      setPropertyData(prev => ({
        ...prev,
        // Étape 1
        title: data.title || '',
        description: data.description || '',
        type: data.type || 'Résidentiel',

        // Étape 2 — 'address' n'existe pas en base ; la colonne réelle la plus proche est 'location'
        address: data.location || '',
        city: data.city || '',
        region: data.region || '',
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,

        // Étape 3
        price: data.price ?? '',
        surface: data.surface ?? '',

        // Étape 7 — statut blockchain/NFT réel (lecture seule)
        nft_token_id: data.nft_token_id || null,
        blockchain_hash: data.blockchain_hash || null,
        transaction_hash: data.transaction_hash || null,
        smart_contract_address: data.smart_contract_address || null,
        nft_readiness_score: data.nft_readiness_score ?? null,
        verification_status: data.verification_status || ''
      }));

      // Photos réelles de la propriété (table property_photos)
      const { data: photosData, error: photosError } = await supabase
        .from('property_photos')
        .select('*')
        .eq('property_id', id)
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (photosError) {
        console.error('Erreur chargement photos:', photosError);
      } else {
        setPhotos(photosData || []);
        setPropertyData(prev => ({ ...prev, images: (photosData || []).map(p => p.url) }));
      }

      // Documents réellement déposés pour cette propriété (table documents)
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('property_id', id);

      if (docsError) {
        console.error('Erreur chargement documents:', docsError);
      } else {
        setRealDocuments(docsData || []);
      }
    } catch (err) {
      console.error('Erreur chargement propriété:', err);
      setError(err.message);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Seules les colonnes qui existent réellement dans la table 'properties' sont envoyées.
      // Les champs de zonage/équipements/financement/documents légaux (étapes 4, 5, 6, 8) n'ont
      // aucune colonne correspondante en base : les envoyer ferait échouer toute la requête
      // (PostgREST rejette une colonne inconnue). Ils restent donc des champs locaux uniquement,
      // avec un avertissement affiché à l'utilisateur dans le formulaire.
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          // Étape 1
          title: propertyData.title,
          description: propertyData.description,
          type: propertyData.type,

          // Étape 2 — 'address' est enregistré dans la colonne réelle 'location'
          location: propertyData.address,
          city: propertyData.city,
          region: propertyData.region,
          latitude: propertyData.latitude,
          longitude: propertyData.longitude,

          // Étape 3
          price: parseFloat(propertyData.price) || 0,
          surface: parseFloat(propertyData.surface) || 0,

          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('owner_id', user.id);

      if (updateError) throw updateError;

      toast.success('✅ Propriété mise à jour avec succès !');
      setTimeout(() => navigate('/vendeur/properties'), 1500);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      toast.error('❌ Erreur lors de la sauvegarde: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setPropertyData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field, value) => {
    setPropertyData(prev => {
      const currentArray = prev[field] || [];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  const handleDeletePhoto = async (index) => {
    const photo = photos[index];
    if (!photo) return;

    try {
      const { error: deletePhotoError } = await supabase
        .from('property_photos')
        .delete()
        .eq('id', photo.id);

      if (deletePhotoError) throw deletePhotoError;

      const updatedPhotos = photos.filter((_, i) => i !== index);
      setPhotos(updatedPhotos);
      handleChange('images', updatedPhotos.map(p => p.url));
      toast.success('Photo supprimée');
    } catch (err) {
      console.error('Erreur suppression photo:', err);
      toast.error('Erreur lors de la suppression de la photo');
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const progress = (currentStep / steps.length) * 100;

  if (loading) {
    return <LoadingState message="Chargement de la propriété..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold">Erreur</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => navigate('/vendeur/properties')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux propriétés
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/vendeur/properties')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Modifier la propriété</h1>
            <p className="text-muted-foreground">
              {propertyData.title || 'Sans titre'}
            </p>
          </div>
        </div>
        <Badge variant="secondary">ID: {id?.slice(0, 8)}...</Badge>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Étape {currentStep} sur {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% complété
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="grid grid-cols-8 gap-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-100 text-purple-700'
                        : isCompleted
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <StepIcon className="h-5 w-5" />
                    <span className="text-xs font-medium">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* ÉTAPE 1: INFORMATIONS DE BASE */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Informations de base</h2>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Titre de l'annonce *</Label>
                          <Input
                            id="title"
                            value={propertyData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="Ex: Terrain résidentiel 500m² à Dakar"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={propertyData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Décrivez votre terrain en détail..."
                            rows={6}
                          />
                        </div>

                        <div>
                          <Label>Type de terrain *</Label>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
                            {terrainTypes.map((type) => {
                              const TypeIcon = type.icon;
                              const isSelected = propertyData.type === type.value;
                              
                              return (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => handleChange('type', type.value)}
                                  className={`p-4 rounded-lg border-2 transition-all ${
                                    isSelected
                                      ? 'border-purple-500 bg-purple-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <TypeIcon className={`h-8 w-8 mx-auto mb-2 ${
                                    isSelected ? 'text-purple-600' : 'text-gray-400'
                                  }`} />
                                  <p className={`text-sm font-medium ${
                                    isSelected ? 'text-purple-900' : 'text-gray-700'
                                  }`}>
                                    {type.label}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 2: LOCALISATION */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Localisation</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="address">Adresse complète *</Label>
                          <Input
                            id="address"
                            value={propertyData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            placeholder="Ex: Rue 12, Cité Keur Gorgui"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="city">Ville *</Label>
                          <Select
                            value={propertyData.city}
                            onValueChange={(value) => handleChange('city', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une ville" />
                            </SelectTrigger>
                            <SelectContent>
                              {senegalCities.map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="region">Région *</Label>
                          <Select
                            value={propertyData.region}
                            onValueChange={(value) => handleChange('region', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une région" />
                            </SelectTrigger>
                            <SelectContent>
                              {senegalRegions.map((region) => (
                                <SelectItem key={region} value={region}>
                                  {region}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="postal_code">Code postal</Label>
                          <Input
                            id="postal_code"
                            value={propertyData.postal_code}
                            onChange={(e) => handleChange('postal_code', e.target.value)}
                            placeholder="Ex: 10200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="latitude">Latitude (optionnel)</Label>
                          <Input
                            id="latitude"
                            type="number"
                            step="any"
                            value={propertyData.latitude || ''}
                            onChange={(e) => handleChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="Ex: 14.7167"
                          />
                        </div>

                        <div>
                          <Label htmlFor="longitude">Longitude (optionnel)</Label>
                          <Input
                            id="longitude"
                            type="number"
                            step="any"
                            value={propertyData.longitude || ''}
                            onChange={(e) => handleChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                            placeholder="Ex: -17.4677"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 3: PRIX & SURFACE */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Prix & Surface</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="price">Prix *</Label>
                            <Input
                              id="price"
                              type="number"
                              value={propertyData.price}
                              onChange={(e) => handleChange('price', e.target.value)}
                              placeholder="Ex: 15000000"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="currency">Devise</Label>
                            <Select
                              value={propertyData.currency}
                              onValueChange={(value) => handleChange('currency', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="XOF">XOF (FCFA)</SelectItem>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="surface">Surface *</Label>
                            <Input
                              id="surface"
                              type="number"
                              value={propertyData.surface}
                              onChange={(e) => handleChange('surface', e.target.value)}
                              placeholder="Ex: 500"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="surface_unit">Unité</Label>
                            <Select
                              value={propertyData.surface_unit}
                              onValueChange={(value) => handleChange('surface_unit', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="m²">m² (mètres carrés)</SelectItem>
                                <SelectItem value="ha">ha (hectares)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {propertyData.price && propertyData.surface && (
                          <div className="col-span-2">
                            <Alert>
                              <Info className="h-4 w-4" />
                              <AlertDescription>
                                Prix au m² : {(parseFloat(propertyData.price) / parseFloat(propertyData.surface)).toLocaleString('fr-FR')} {propertyData.currency}/m²
                              </AlertDescription>
                            </Alert>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 4: CARACTÉRISTIQUES */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Caractéristiques</h2>

                      <Alert className="mb-4">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Ces informations ne sont pas encore reliées à la base de données et ne seront pas enregistrées pour le moment.
                        </AlertDescription>
                      </Alert>

                      <Tabs defaultValue="zoning" className="space-y-4">
                        <TabsList className="grid grid-cols-3 w-full">
                          <TabsTrigger value="zoning">Zonage</TabsTrigger>
                          <TabsTrigger value="legal">Légal</TabsTrigger>
                          <TabsTrigger value="features">Atouts</TabsTrigger>
                        </TabsList>

                        <TabsContent value="zoning" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="zoning">Type de zone</Label>
                              <Select
                                value={propertyData.zoning}
                                onValueChange={(value) => handleChange('zoning', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {zoningTypes.map((zone) => (
                                    <SelectItem key={zone.value} value={zone.value}>
                                      {zone.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="buildable_ratio">Coefficient d'emprise</Label>
                              <Input
                                id="buildable_ratio"
                                type="number"
                                step="0.01"
                                value={propertyData.buildable_ratio}
                                onChange={(e) => handleChange('buildable_ratio', e.target.value)}
                                placeholder="Ex: 0.6"
                              />
                            </div>

                            <div>
                              <Label htmlFor="max_floors">Nombre d'étages max</Label>
                              <Input
                                id="max_floors"
                                type="number"
                                value={propertyData.max_floors}
                                onChange={(e) => handleChange('max_floors', e.target.value)}
                                placeholder="Ex: 3"
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="legal" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="legal_status">Statut juridique</Label>
                              <Select
                                value={propertyData.legal_status}
                                onValueChange={(value) => handleChange('legal_status', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionner..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {legalStatusOptions.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="title_deed_number">N° Titre foncier</Label>
                              <Input
                                id="title_deed_number"
                                value={propertyData.title_deed_number}
                                onChange={(e) => handleChange('title_deed_number', e.target.value)}
                                placeholder="Ex: TF-12345/DK"
                              />
                            </div>

                            <div className="col-span-2">
                              <Label htmlFor="land_registry_ref">Référence cadastrale</Label>
                              <Input
                                id="land_registry_ref"
                                value={propertyData.land_registry_ref}
                                onChange={(e) => handleChange('land_registry_ref', e.target.value)}
                                placeholder="Ex: Section AB, Parcelle 123"
                              />
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="features" className="space-y-4">
                          <Label>Atouts principaux</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {mainFeaturesList.map((feature) => {
                              const isSelected = propertyData.main_features.includes(feature);
                              
                              return (
                                <button
                                  key={feature}
                                  type="button"
                                  onClick={() => handleArrayToggle('main_features', feature)}
                                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                                    isSelected
                                      ? 'border-purple-500 bg-purple-50 text-purple-900'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {isSelected && <Check className="h-4 w-4 text-purple-600" />}
                                    <span className="text-sm">{feature}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 5: ÉQUIPEMENTS */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Équipements & Accès</h2>

                      <Alert className="mb-4">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Ces informations ne sont pas encore reliées à la base de données et ne seront pas enregistrées pour le moment.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-6">
                        <div>
                          <Label className="mb-3 block">Utilités disponibles</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {utilitiesList.map((utility) => {
                              const isSelected = propertyData.utilities.includes(utility.value);
                              
                              return (
                                <button
                                  key={utility.value}
                                  type="button"
                                  onClick={() => handleArrayToggle('utilities', utility.value)}
                                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                                    isSelected
                                      ? 'border-green-500 bg-green-50 text-green-900'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {isSelected && <Check className="h-4 w-4 text-green-600" />}
                                    <span className="text-sm">{utility.label}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <Label className="mb-3 block">Accès & Transport</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {accessList.map((access) => {
                              const isSelected = propertyData.access.includes(access.value);
                              
                              return (
                                <button
                                  key={access.value}
                                  type="button"
                                  onClick={() => handleArrayToggle('access', access.value)}
                                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                                    isSelected
                                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                                    <span className="text-sm">{access.label}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <Label className="mb-3 block">Proximités</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {nearbyFacilitiesOptions.map((facility) => {
                              const isSelected = propertyData.nearby_facilities.includes(facility.value);
                              
                              return (
                                <button
                                  key={facility.value}
                                  type="button"
                                  onClick={() => handleArrayToggle('nearby_facilities', facility.value)}
                                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                                    isSelected
                                      ? 'border-orange-500 bg-orange-50 text-orange-900'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{facility.emoji}</span>
                                    <span className="text-sm">{facility.label}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 6: FINANCEMENT */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Options de financement</h2>

                      <Alert className="mb-4">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Ces informations ne sont pas encore reliées à la base de données et ne seront pas enregistrées pour le moment.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-6">
                        <div>
                          <Label className="mb-3 block">Modes de paiement acceptés</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {financingMethods.map((method) => {
                              const isSelected = propertyData.financing_methods.includes(method.value);
                              
                              return (
                                <button
                                  key={method.value}
                                  type="button"
                                  onClick={() => handleArrayToggle('financing_methods', method.value)}
                                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                                    isSelected
                                      ? 'border-purple-500 bg-purple-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    {isSelected && <Check className="h-5 w-5 text-purple-600 mt-0.5" />}
                                    <div>
                                      <p className="font-medium">{method.label}</p>
                                      <p className="text-sm text-muted-foreground">{method.description}</p>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Financement bancaire */}
                        {propertyData.financing_methods.includes('bank') && (
                          <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                              <CardTitle className="text-lg">Financement bancaire</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="bank_financing">Financement disponible</Label>
                                <Switch
                                  id="bank_financing"
                                  checked={propertyData.bank_financing_available}
                                  onCheckedChange={(checked) => handleChange('bank_financing_available', checked)}
                                />
                              </div>

                              {propertyData.bank_financing_available && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="min_down_payment">Apport minimum (%)</Label>
                                    <Input
                                      id="min_down_payment"
                                      type="number"
                                      value={propertyData.min_down_payment}
                                      onChange={(e) => handleChange('min_down_payment', e.target.value)}
                                      placeholder="Ex: 20"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="max_duration">Durée max (années)</Label>
                                    <Input
                                      id="max_duration"
                                      type="number"
                                      value={propertyData.max_duration}
                                      onChange={(e) => handleChange('max_duration', e.target.value)}
                                      placeholder="Ex: 25"
                                    />
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {/* Paiement échelonné */}
                        {propertyData.financing_methods.includes('installment') && (
                          <Card className="border-green-200 bg-green-50">
                            <CardHeader>
                              <CardTitle className="text-lg">Paiement échelonné</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="installment">Facilités de paiement</Label>
                                <Switch
                                  id="installment"
                                  checked={propertyData.installment_available}
                                  onCheckedChange={(checked) => handleChange('installment_available', checked)}
                                />
                              </div>

                              {propertyData.installment_available && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="installment_duration">Durée</Label>
                                    <Select
                                      value={propertyData.installment_duration}
                                      onValueChange={(value) => handleChange('installment_duration', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {installmentDurations.map((duration) => (
                                          <SelectItem key={duration.value} value={duration.value}>
                                            {duration.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label htmlFor="monthly_payment">Mensualité</Label>
                                    <Input
                                      id="monthly_payment"
                                      type="number"
                                      value={propertyData.monthly_payment}
                                      onChange={(e) => handleChange('monthly_payment', e.target.value)}
                                      placeholder="Auto-calculé"
                                    />
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                        {/* Crypto-monnaie */}
                        {propertyData.financing_methods.includes('crypto') && (
                          <Card className="border-orange-200 bg-orange-50">
                            <CardHeader>
                              <CardTitle className="text-lg">Paiement en crypto</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="crypto">Accepter les crypto-monnaies</Label>
                                <Switch
                                  id="crypto"
                                  checked={propertyData.crypto_available}
                                  onCheckedChange={(checked) => handleChange('crypto_available', checked)}
                                />
                              </div>

                              {propertyData.crypto_available && (
                                <>
                                  <div>
                                    <Label className="mb-2 block">Crypto acceptées</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      {cryptoCurrencies.map((crypto) => {
                                        const isSelected = propertyData.accepted_cryptos.includes(crypto.value);
                                        
                                        return (
                                          <button
                                            key={crypto.value}
                                            type="button"
                                            onClick={() => handleArrayToggle('accepted_cryptos', crypto.value)}
                                            className={`p-2 rounded border-2 text-left transition-all ${
                                              isSelected
                                                ? 'border-orange-500 bg-white'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="text-lg">{crypto.icon}</span>
                                              <span className="text-sm font-medium">{crypto.label}</span>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="crypto_discount">Réduction crypto (%)</Label>
                                    <Input
                                      id="crypto_discount"
                                      type="number"
                                      value={propertyData.crypto_discount}
                                      onChange={(e) => handleChange('crypto_discount', e.target.value)}
                                      placeholder="Ex: 5"
                                    />
                                  </div>
                                </>
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 7: PHOTOS */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Photos du terrain</h2>
                      
                      <Alert className="mb-4">
                        <Camera className="h-4 w-4" />
                        <AlertDescription>
                          Les photos existantes sont conservées. Cette section permet de gérer la galerie.
                        </AlertDescription>
                      </Alert>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {propertyData.images && propertyData.images.length > 0 ? (
                          propertyData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-40 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-4 text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-muted-foreground">Aucune photo disponible</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <Label>Blockchain & NFT</Label>
                        <div className="flex items-center justify-between p-4 border rounded-lg mt-2">
                          <div>
                            <p className="font-medium">Statut de tokenisation</p>
                            <p className="text-sm text-muted-foreground">
                              Statut réel enregistré pour cette propriété
                            </p>
                          </div>
                          <Badge variant={propertyData.nft_token_id ? 'default' : 'secondary'}>
                            {propertyData.nft_token_id ? 'Tokenisé' : 'Non tokenisé'}
                          </Badge>
                        </div>

                        {(propertyData.nft_token_id || propertyData.blockchain_hash || propertyData.transaction_hash || propertyData.smart_contract_address) ? (
                          <div className="mt-4 space-y-2 text-sm">
                            {propertyData.nft_token_id && (
                              <div className="flex justify-between border-b pb-1">
                                <span className="text-muted-foreground">Token ID</span>
                                <span className="font-mono">{propertyData.nft_token_id}</span>
                              </div>
                            )}
                            {propertyData.blockchain_hash && (
                              <div className="flex justify-between border-b pb-1">
                                <span className="text-muted-foreground">Hash blockchain</span>
                                <span className="font-mono">
                                  {propertyData.blockchain_hash.slice(0, 10)}...{propertyData.blockchain_hash.slice(-6)}
                                </span>
                              </div>
                            )}
                            {propertyData.smart_contract_address && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Contrat</span>
                                <span className="font-mono">{propertyData.smart_contract_address.slice(0, 10)}...</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <Alert className="mt-4">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                              Cette propriété n'est pas encore tokenisée sur la blockchain.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* ÉTAPE 8: DOCUMENTS */}
                {currentStep === 8 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Documents légaux</h2>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <Label htmlFor="has_title_deed">Titre foncier</Label>
                            <Switch
                              id="has_title_deed"
                              checked={propertyData.has_title_deed}
                              onCheckedChange={(checked) => handleChange('has_title_deed', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <Label htmlFor="has_survey">Plan d'arpentage</Label>
                            <Switch
                              id="has_survey"
                              checked={propertyData.has_survey}
                              onCheckedChange={(checked) => handleChange('has_survey', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <Label htmlFor="has_building_permit">Permis de construire</Label>
                            <Switch
                              id="has_building_permit"
                              checked={propertyData.has_building_permit}
                              onCheckedChange={(checked) => handleChange('has_building_permit', checked)}
                            />
                          </div>

                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <Label htmlFor="has_urban_certificate">Certificat d'urbanisme</Label>
                            <Switch
                              id="has_urban_certificate"
                              checked={propertyData.has_urban_certificate}
                              onCheckedChange={(checked) => handleChange('has_urban_certificate', checked)}
                            />
                          </div>
                        </div>

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Ces cases indiquent localement quels documents existent, mais ne sont pas encore enregistrées en base.
                            Le nombre de documents réellement déposés pour cette propriété est indiqué ci-dessous.
                          </AlertDescription>
                        </Alert>

                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="font-semibold mb-3">Récapitulatif</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Cases cochées (indicatif, non enregistré):</span>
                              <Badge variant="secondary">
                                {[
                                  propertyData.has_title_deed,
                                  propertyData.has_survey,
                                  propertyData.has_building_permit,
                                  propertyData.has_urban_certificate
                                ].filter(Boolean).length} / 4
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Documents réellement déposés:</span>
                              <Badge variant="secondary">{realDocuments.length}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>

              <div className="flex gap-2">
                {currentStep < steps.length ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les modifications
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default EditPropertyComplete;
