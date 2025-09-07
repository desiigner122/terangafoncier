import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  ArrowLeft,
  Eye, 
  Heart, 
  Share2, 
  MapPin, 
  Home, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  Calculator, 
  Camera, 
  Video, 
  Building2, 
  Award, 
  FileText, 
  Download, 
  ExternalLink,
  Database,
  Blocks,
  CreditCard,
  Lock,
  Zap,
  Globe,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Smartphone,
  Navigation,
  Coins,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const BlockchainParcelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // États pour les nouvelles fonctionnalités
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  const [showROIModal, setShowROIModal] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [showARView, setShowARView] = useState(false);
  const [showNFTDetails, setShowNFTDetails] = useState(false);
  const [showConstructionModal, setShowConstructionModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedFinancing, setSelectedFinancing] = useState('');

  // Données mockées d'une parcelle blockchain NFT
  useEffect(() => {
    const mockParcelData = {
      id: id || 'TF-NFT-2024-001',
      nft_id: 'NFT_TERRAIN_001',
      smart_contract_address: '0x742d35cc6634c0532925a3b8d123456789abcdef',
      blockchain_network: 'Polygon',
      title: 'Terrain Premium Blockchain NFT - Almadies Prestige',
      location: 'Almadies, Dakar, Sénégal',
      area: 'Almadies',
      city: 'Dakar',
      region: 'Dakar',
      size: 500,
      price: 125000000, // 125M FCFA
      price_per_m2: 250000,
      type: 'Résidentiel Premium',
      status: 'NFT Vérifié',
      seller_type: 'Vendeur Pro',
      seller_name: 'Teranga Développement SARL',
      seller_rating: 4.9,
      seller_properties: 23,
      coordinates: { lat: 14.7645, lng: -17.4966 },
      
      // Informations NFT Blockchain
      nft_metadata: {
        token_id: '001',
        created_date: '2024-01-15',
        last_transfer: '2024-01-20',
        ownership_history: 3,
        verified_authenticity: true,
        smart_contract_type: 'ERC-721',
        royalty_percentage: 2.5
      },
      
      // Options de financement
      financing_options: {
        direct_purchase: true,
        bank_financing: true,
        installment_payment: true,
        crypto_payment: true,
        available_banks: [
          { name: 'UBA Sénégal', rate: '8.5%', max_duration: '25 ans', approval_time: '48h' },
          { name: 'Crédit Agricole', rate: '7.8%', max_duration: '30 ans', approval_time: '72h' },
          { name: 'SGBS', rate: '8.2%', max_duration: '20 ans', approval_time: '5 jours' },
          { name: 'CBAO', rate: '8.0%', max_duration: '25 ans', approval_time: '1 semaine' }
        ],
        installment_plans: [
          { duration: '12 mois', monthly: '10,800,000 FCFA', total: '129,600,000 FCFA' },
          { duration: '24 mois', monthly: '5,600,000 FCFA', total: '134,400,000 FCFA' },
          { duration: '36 mois', monthly: '3,900,000 FCFA', total: '140,400,000 FCFA' }
        ]
      },
      
      // Suivi construction
      construction_monitoring: {
        available: true,
        features: ['Photos quotidiennes', 'Vidéos hebdomadaires', 'Drone mensuel', 'Rapports d\'avancement'],
        estimated_duration: '8 mois',
        milestones: [
          { phase: 'Fondations', duration: '1 mois', completed: false },
          { phase: 'Structure', duration: '3 mois', completed: false },
          { phase: 'Toiture', duration: '1 mois', completed: false },
          { phase: 'Finitions', duration: '3 mois', completed: false }
        ]
      },
      
      // Analyse ROI
      roi_analysis: {
        estimated_annual_roi: 12.5,
        payback_period: '8 ans',
        rental_yield: 8.2,
        appreciation_forecast: '+45% en 10 ans',
        market_score: 9.2,
        location_score: 8.8,
        infrastructure_score: 9.5
      },
      
      // Images et médias
      images: [
        '/api/placeholder/800/600',
        '/api/placeholder/800/600', 
        '/api/placeholder/800/600',
        '/api/placeholder/800/600'
      ],
      virtual_tour_url: 'https://parcels.terangafoncier.com/virtual-tour/001',
      drone_footage_url: 'https://parcels.terangafoncier.com/drone/001',
      
      // Caractéristiques du terrain
      features: [
        'Titre foncier sécurisé NFT',
        'Viabilisation complète (eau, électricité, fibre)',
        'Accès route pavée',
        'Vue sur océan partielle',
        'Zone résidentielle haut standing',
        'Proximité centre commercial',
        'Sécurité 24h/24',
        'Réseau d\'assainissement'
      ],
      
      // Infrastructure environnante
      nearby_amenities: [
        { type: 'École', name: 'École Française Mermoz', distance: '1.2 km', icon: Users },
        { type: 'Hôpital', name: 'Clinique de la Madeleine', distance: '2.1 km', icon: Building2 },
        { type: 'Commerce', name: 'Sea Plaza', distance: '800 m', icon: Building2 },
        { type: 'Transport', name: 'Station BRT', distance: '1.5 km', icon: Navigation },
        { type: 'Loisirs', name: 'Plage des Almadies', distance: '3.2 km', icon: Globe }
      ],
      
      // Documents disponibles
      documents: [
        { name: 'Certificat NFT Blockchain', type: 'PDF', verified: true, blockchain_hash: '0x123...' },
        { name: 'Titre Foncier Numérisé', type: 'PDF', verified: true, blockchain_hash: '0x456...' },
        { name: 'Certificat de Viabilisation', type: 'PDF', verified: true, blockchain_hash: '0x789...' },
        { name: 'Étude de Sol', type: 'PDF', verified: true, blockchain_hash: '0xabc...' },
        { name: 'Permis de Construire Type', type: 'PDF', verified: false, blockchain_hash: null }
      ],
      
      description: `Terrain d'exception tokenisé en NFT sur blockchain Polygon. Cette propriété premium située dans le quartier prestigieux des Almadies offre une opportunité unique d'investissement sécurisé par la technologie blockchain.

Avec sa certification NFT, ce terrain bénéficie d'une traçabilité complète et d'une sécurité anti-fraude maximale. Les smart contracts automatisent toutes les transactions et garantissent la transparence totale.

Idéal pour construction de villa haut de gamme avec vue océan partielle. Le quartier connaît une forte croissance avec de nombreux projets de développement en cours.

Financement bancaire disponible avec nos 12 partenaires bancaires. Suivi de construction en temps réel via notre plateforme de monitoring avancée.`
    };

    // Simulation du chargement
    setTimeout(() => {
      setParcel(mockParcelData);
      setLoading(false);
    }, 1000);
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleScheduleVisit = () => {
    setShowVisitModal(true);
  };

  const handleFinancing = () => {
    setShowFinancingModal(true);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: parcel.title,
        text: parcel.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié !');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-lg font-semibold text-gray-700">Chargement des données blockchain...</div>
          <div className="text-sm text-gray-500 mt-2">Vérification NFT en cours</div>
        </div>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Terrain non trouvé</h2>
          <p className="text-gray-600 mb-4">Le terrain NFT demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/terrains')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux terrains
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>{parcel.title} - NFT Blockchain | Teranga Foncier</title>
        <meta name="description" content={parcel.description} />
      </Helmet>

      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/terrains')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux terrains
            </Button>
            
            <div className="flex items-center space-x-3">
              <Badge className="bg-yellow-500 text-black">
                <Database className="w-3 h-3 mr-1" />
                NFT #{parcel.nft_metadata.token_id}
              </Badge>
              <Badge className="bg-green-500 text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                {parcel.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne principale - Images et informations */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Galerie d'images */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={parcel.images[activeImageIndex]} 
                  alt={parcel.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black bg-opacity-70 text-white">
                    {activeImageIndex + 1} / {parcel.images.length}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => setShowVirtualTour(true)}>
                    <Video className="w-4 h-4 mr-1" />
                    360°
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setShowARView(true)}>
                    <Camera className="w-4 h-4 mr-1" />
                    AR
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {parcel.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Vue ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer ${
                        index === activeImageIndex ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Informations principales */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {parcel.title}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      {parcel.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {formatPrice(parcel.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(parcel.price_per_m2)}/m²
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold">{parcel.size}m²</div>
                    <div className="text-sm text-gray-600">Surface</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold">{parcel.type}</div>
                    <div className="text-sm text-gray-600">Type</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Database className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold">NFT</div>
                    <div className="text-sm text-gray-600">Blockchain</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <div className="text-lg font-bold">{parcel.roi_analysis.estimated_annual_roi}%</div>
                    <div className="text-sm text-gray-600">ROI/an</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{parcel.description}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Caractéristiques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {parcel.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onglets d'informations détaillées */}
            <Card>
              <Tabs defaultValue="nft" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="nft">NFT Blockchain</TabsTrigger>
                  <TabsTrigger value="financing">Financement</TabsTrigger>
                  <TabsTrigger value="construction">Construction</TabsTrigger>
                  <TabsTrigger value="roi">Analyse ROI</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                {/* Onglet NFT Blockchain */}
                <TabsContent value="nft" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Informations NFT Blockchain</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Database className="w-5 h-5 text-yellow-600 mr-2" />
                          <span className="font-medium">Token ID</span>
                        </div>
                        <div className="text-lg font-bold">#{parcel.nft_metadata.token_id}</div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Blocks className="w-5 h-5 text-blue-600 mr-2" />
                          <span className="font-medium">Réseau</span>
                        </div>
                        <div className="text-lg font-bold">{parcel.blockchain_network}</div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Calendar className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-medium">Créé le</span>
                        </div>
                        <div className="text-lg font-bold">{parcel.nft_metadata.created_date}</div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Shield className="w-5 h-5 text-purple-600 mr-2" />
                          <span className="font-medium">Propriétaires</span>
                        </div>
                        <div className="text-lg font-bold">{parcel.nft_metadata.ownership_history}</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Lock className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="font-medium">Smart Contract</span>
                      </div>
                      <div className="font-mono text-sm bg-white p-3 rounded border break-all">
                        {parcel.smart_contract_address}
                      </div>
                      <Button size="sm" variant="outline" className="mt-2">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir sur Blockchain
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Financement */}
                <TabsContent value="financing" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Options de Financement</h3>
                    
                    {/* Banques partenaires */}
                    <div>
                      <h4 className="font-semibold mb-3">Financement Bancaire</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parcel.financing_options.available_banks.map((bank, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{bank.name}</h5>
                              <Badge variant="outline">Taux: {bank.rate}</Badge>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Durée max: {bank.max_duration}</div>
                              <div>Approbation: {bank.approval_time}</div>
                            </div>
                            <Button size="sm" className="mt-3 w-full">
                              Demande de crédit
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Paiement échelonné */}
                    <div>
                      <h4 className="font-semibold mb-3">Paiement Échelonné</h4>
                      <div className="space-y-3">
                        {parcel.financing_options.installment_plans.map((plan, index) => (
                          <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                            <div>
                              <div className="font-medium">{plan.duration}</div>
                              <div className="text-sm text-gray-600">
                                {plan.monthly}/mois • Total: {plan.total}
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              Choisir
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Construction */}
                <TabsContent value="construction" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Suivi de Construction</h3>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Fonctionnalités de Monitoring</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {parcel.construction_monitoring.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Phases de Construction</h4>
                      <div className="space-y-3">
                        {parcel.construction_monitoring.milestones.map((milestone, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{milestone.phase}</span>
                              <Badge variant={milestone.completed ? "default" : "secondary"}>
                                {milestone.completed ? "Terminé" : "En attente"}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">Durée: {milestone.duration}</div>
                            <Progress value={milestone.completed ? 100 : 0} className="mt-2" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => setShowConstructionModal(true)}>
                      <Camera className="w-4 h-4 mr-2" />
                      Activer le Suivi Construction
                    </Button>
                  </div>
                </TabsContent>

                {/* Onglet ROI */}
                <TabsContent value="roi" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Analyse de Rentabilité</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {parcel.roi_analysis.estimated_annual_roi}%
                        </div>
                        <div className="text-sm text-gray-600">ROI Annuel</div>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">
                          {parcel.roi_analysis.payback_period}
                        </div>
                        <div className="text-sm text-gray-600">Retour invest.</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Home className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600">
                          {parcel.roi_analysis.rental_yield}%
                        </div>
                        <div className="text-sm text-gray-600">Rendement locatif</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Prévision Plus-value</h4>
                      <div className="text-2xl font-bold text-orange-600">
                        {parcel.roi_analysis.appreciation_forecast}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Scores d'Évaluation</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score Marché</span>
                            <span>{parcel.roi_analysis.market_score}/10</span>
                          </div>
                          <Progress value={parcel.roi_analysis.market_score * 10} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score Localisation</span>
                            <span>{parcel.roi_analysis.location_score}/10</span>
                          </div>
                          <Progress value={parcel.roi_analysis.location_score * 10} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score Infrastructure</span>
                            <span>{parcel.roi_analysis.infrastructure_score}/10</span>
                          </div>
                          <Progress value={parcel.roi_analysis.infrastructure_score * 10} />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => setShowROIModal(true)}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculateur ROI Personnalisé
                    </Button>
                  </div>
                </TabsContent>

                {/* Onglet Documents */}
                <TabsContent value="documents" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Documents Blockchain</h3>
                    
                    <div className="space-y-3">
                      {parcel.documents.map((doc, index) => (
                        <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-600 mr-3" />
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-gray-600">
                                {doc.type} • {doc.verified ? 'Vérifié' : 'En attente'}
                              </div>
                              {doc.blockchain_hash && (
                                <div className="text-xs font-mono text-blue-600 truncate max-w-xs">
                                  Hash: {doc.blockchain_hash}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.verified && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Télécharger
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Commodités environnantes */}
            <Card>
              <CardHeader>
                <CardTitle>Environnement et Commodités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parcel.nearby_amenities.map((amenity, index) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <IconComponent className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <div className="font-medium text-sm">{amenity.name}</div>
                          <div className="text-xs text-gray-600">{amenity.distance}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Actions et informations vendeur */}
          <div className="space-y-6">
            
            {/* Actions principales */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Eye className="w-4 h-4 mr-2" />
                  Acheter Maintenant
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleScheduleVisit}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Planifier une Visite
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleFinancing}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Demande de Financement
                </Button>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorite ? 'Favoris' : 'Ajouter'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Partager
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Button size="sm" variant="ghost" onClick={() => setShowVirtualTour(true)}>
                    <Video className="w-4 h-4 mr-1" />
                    Visite 360°
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowARView(true)}>
                    <Camera className="w-4 h-4 mr-1" />
                    Vue AR
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowROIModal(true)}>
                    <Calculator className="w-4 h-4 mr-1" />
                    Calc. ROI
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowNFTDetails(true)}>
                    <Database className="w-4 h-4 mr-1" />
                    NFT Info
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Informations vendeur */}
            <Card>
              <CardHeader>
                <CardTitle>Vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{parcel.seller_name}</div>
                    <div className="text-sm text-gray-600">{parcel.seller_type}</div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Note</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium ml-1">{parcel.seller_rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Propriétés</span>
                    <span className="text-sm font-medium">{parcel.seller_properties}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Calculateur hypothécaire rapide */}
            <Card>
              <CardHeader>
                <CardTitle>Calculateur Express</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Apport initial</label>
                  <Input placeholder="25 000 000 FCFA" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Durée</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="20 ans" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 ans</SelectItem>
                      <SelectItem value="20">20 ans</SelectItem>
                      <SelectItem value="25">25 ans</SelectItem>
                      <SelectItem value="30">30 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600">Mensualité estimée</div>
                  <div className="text-lg font-bold text-blue-600">≈ 890,000 FCFA/mois</div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Calcul détaillé
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modales - On les ajoutera dans la prochaine partie pour éviter un fichier trop long */}
      
    </div>
  );
};

export default BlockchainParcelDetailPage;
