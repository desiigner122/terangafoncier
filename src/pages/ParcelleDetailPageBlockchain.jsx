import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, MapPin, Share2, Heart, Calculator, Calendar, 
  User, Phone, Mail, MessageSquare, CheckCircle, AlertTriangle,
  Database, Shield, Brain, Sparkles, Network, Globe, Building2,
  Camera, Play, Download, FileText, Star, Zap, TrendingUp,
  Clock, Users, Navigation, Coins, CreditCard, Smartphone,
  Eye, Euro, Wifi, Car, Home, ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ParcelleDetailPageBlockchain = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parcelle, setParcelle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Simulation de chargement des données de la parcelle blockchain
    const mockParcelle = {
      id: parseInt(id),
      title: "Terrain Premium NFT Blockchain - Les Almadies",
      location: "Les Almadies, Dakar",
      city: 'Dakar',
      region: 'Dakar',
      size: 500,
      price: 125000000, // 125M FCFA
      price_per_m2: 250000,
      type: 'Résidentiel Premium',
      status: 'NFT Vérifié',
      aiScore: 9.2,
      sustainabilityScore: 8.7,
      seller_type: 'Vendeur Pro',
      seller_name: 'Teranga Développement SARL',
      seller_rating: 4.9,
      seller_properties: 23,
      seller_avatar: '/api/placeholder/100/100',
      coordinates: { lat: 14.7645, lng: -17.4966 },
      
      // Informations NFT Blockchain
      nft_metadata: {
        token_id: 'TF001',
        contract_address: '0x742d35cc663',
        blockchain: 'Polygon',
        created_date: '2024-01-15',
        last_transfer: '2024-01-20',
        ownership_history: 3,
        verified_authenticity: true,
        smart_contract_type: 'ERC-721',
        royalty_percentage: 2.5,
        hash: '0x123abc456def789'
      },
      
      // Score IA et analyses
      ai_insights: {
        investment_score: 9.2,
        growth_potential: 8.8,
        liquidity_score: 7.9,
        risk_assessment: 'Faible',
        market_trends: '+12% en 6 mois',
        predicted_value_1year: 140000000,
        recommended_action: 'Investissement fortement recommandé'
      },
      
      // Options de financement blockchain
      financing_options: {
        crypto_payment: true,
        traditional_banks: ['Ecobank', 'BOA', 'BICIS', 'BHS', 'SGBS'],
        defi_protocols: ['Aave', 'Compound', 'MakerDAO'],
        installment_plans: [
          { duration: '12 mois', monthly: '11,200,000 FCFA', total: '134,400,000 FCFA', interest: '7.5%' },
          { duration: '24 mois', monthly: '5,900,000 FCFA', total: '141,600,000 FCFA', interest: '8.2%' },
          { duration: '36 mois', monthly: '4,100,000 FCFA', total: '147,600,000 FCFA', interest: '8.8%' }
        ],
        crypto_accepted: ['BTC', 'ETH', 'USDC', 'DAI', 'MATIC']
      },
      
      // Suivi construction intelligent
      construction_monitoring: {
        available: true,
        features: ['Caméras 4K temps réel', 'Drone mensuel', 'IA de progression', 'Rapports automatiques'],
        estimated_duration: '8 mois',
        milestones: [
          { phase: 'Fondations', duration: '1 mois', progress: 0, ai_predicted: true },
          { phase: 'Structure', duration: '3 mois', progress: 0, ai_predicted: true },
          { phase: 'Toiture', duration: '1 mois', progress: 0, ai_predicted: true },
          { phase: 'Finitions', duration: '3 mois', progress: 0, ai_predicted: true }
        ]
      },
      
      // Analyse ROI avec IA
      roi_analysis: {
        estimated_annual_roi: 12.5,
        payback_period: '8 ans',
        rental_yield: 8.2,
        appreciation_forecast: '+45% en 10 ans',
        market_score: 9.2,
        location_score: 8.8,
        infrastructure_score: 9.5,
        ai_confidence: 94
      },
      
      // Images et médias
      images: [
        '/api/placeholder/800/600',
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
        'Smart contracts automatiques',
        'Accès route pavée',
        'Vue sur océan partielle',
        'Zone résidentielle haut standing',
        'Proximité centre commercial',
        'Sécurité 24h/24',
        'Réseau d\'assainissement',
        'Éclairage public LED'
      ],
      
      // Infrastructure environnante avec IA scoring
      nearby_amenities: [
        { type: 'École', name: 'École Française Mermoz', distance: '1.2 km', score: 9.1, icon: Users },
        { type: 'Hôpital', name: 'Clinique de la Madeleine', distance: '2.1 km', score: 8.7, icon: Building2 },
        { type: 'Commerce', name: 'Sea Plaza', distance: '800 m', score: 9.3, icon: ShoppingCart },
        { type: 'Transport', name: 'Station BRT', distance: '1.5 km', score: 8.9, icon: Car },
        { type: 'Loisirs', name: 'Plage des Almadies', distance: '3.2 km', score: 9.5, icon: Globe }
      ],
      
      // Documents blockchain vérifiés
      documents: [
        { name: 'Certificat NFT Blockchain', type: 'PDF', verified: true, hash: '0x123abc...', date: '2024-01-15' },
        { name: 'Titre Foncier Numérisé', type: 'PDF', verified: true, hash: '0x456def...', date: '2024-01-10' },
        { name: 'Certificat de Viabilisation', type: 'PDF', verified: true, hash: '0x789ghi...', date: '2024-01-08' },
        { name: 'Étude de Sol Géotechnique', type: 'PDF', verified: true, hash: '0xabcjkl...', date: '2024-01-05' },
        { name: 'Smart Contract Code', type: 'JSON', verified: true, hash: '0xdefmno...', date: '2024-01-15' }
      ],
      
      description: `🚀 **Terrain d'exception tokenisé en NFT sur blockchain Polygon**

Cette propriété premium située dans le quartier prestigieux des Almadies offre une opportunité unique d'investissement sécurisé par la technologie blockchain.

🔐 **Sécurité Blockchain Maximale**
Avec sa certification NFT, ce terrain bénéficie d'une traçabilité complète et d'une sécurité anti-fraude maximale. Les smart contracts automatisent toutes les transactions et garantissent la transparence totale.

🏖️ **Emplacement Exceptionnel**
Idéal pour construction de villa haut de gamme avec vue océan partielle. Le quartier connaît une forte croissance avec de nombreux projets de développement en cours.

💰 **Financement Innovant**
Financement traditionnel et crypto disponible avec nos 12 partenaires bancaires et protocoles DeFi. Suivi de construction en temps réel via notre plateforme de monitoring IA.

📈 **Analyse IA : Score 9.2/10**
Notre intelligence artificielle recommande fortement cet investissement avec un potentiel de croissance de +45% sur 10 ans.`
    };

    // Simulation du chargement
    setTimeout(() => {
      setParcelle(mockParcelle);
      setLoading(false);
    }, 1500);
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

  const handleContact = () => {
    setShowContactModal(true);
  };

  const handleFinancing = () => {
    setShowFinancingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-lg font-medium text-gray-700">Chargement de la parcelle NFT...</div>
          <div className="text-sm text-gray-500 mt-2">Vérification blockchain en cours</div>
        </div>
      </div>
    );
  }

  if (!parcelle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Parcelle non trouvée</h2>
          <p className="text-gray-600 mb-4">La parcelle NFT demandée n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/parcelles-vendeurs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux parcelles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>{parcelle.title} - NFT Blockchain | Teranga Foncier</title>
        <meta name="description" content={parcelle.description} />
      </Helmet>

      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/parcelles-vendeurs')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux parcelles
            </Button>
            
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <Database className="w-3 h-3 mr-1" />
                NFT #{parcelle.nft_metadata.token_id}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <Shield className="w-3 h-3 mr-1" />
                {parcelle.status}
              </Badge>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Brain className="w-3 h-3 mr-1" />
                Score IA: {parcelle.aiScore}/10
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
                  src={parcelle.images[activeImageIndex]} 
                  alt={parcelle.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black bg-opacity-70 text-white">
                    {activeImageIndex + 1} / {parcelle.images.length}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="sm" variant="secondary" className="bg-white bg-opacity-90">
                    <Camera className="w-4 h-4 mr-1" />
                    Visite 360°
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white bg-opacity-90">
                    <Play className="w-4 h-4 mr-1" />
                    Drone
                  </Button>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Button
                    size="sm"
                    variant={isFavorite ? "default" : "secondary"}
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-white bg-opacity-90"}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {parcelle.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        activeImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
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
                      {parcelle.title}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      {parcelle.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {formatPrice(parcelle.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(parcelle.price_per_m2)}/m²
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{parcelle.size}</div>
                    <div className="text-sm text-gray-600">Surface (m²)</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{parcelle.aiScore}</div>
                    <div className="text-sm text-gray-600">Score IA</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{parcelle.sustainabilityScore}</div>
                    <div className="text-sm text-gray-600">Durabilité</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{parcelle.roi_analysis.estimated_annual_roi}%</div>
                    <div className="text-sm text-gray-600">ROI Annuel</div>
                  </div>
                </div>

                {/* Analyse IA */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center mb-3">
                    <Brain className="w-5 h-5 text-blue-600 mr-2" />
                    <h3 className="font-bold text-gray-900">Analyse IA Avancée</h3>
                    <Badge className="ml-2 bg-green-500 text-white">
                      Confiance: {parcelle.roi_analysis.ai_confidence}%
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-3">{parcelle.ai_insights.recommended_action}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <div className="text-sm text-gray-600">Potentiel Croissance</div>
                      <div className="font-bold text-green-600">{parcelle.ai_insights.growth_potential}/10</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Tendance Marché</div>
                      <div className="font-bold text-blue-600">{parcelle.ai_insights.market_trends}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Risque</div>
                      <div className="font-bold text-yellow-600">{parcelle.ai_insights.risk_assessment}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Valeur prédite 1 an</div>
                      <div className="font-bold text-purple-600">{formatPrice(parcelle.ai_insights.predicted_value_1year)}</div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {parcelle.description}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onglets détaillés */}
            <Card>
              <Tabs defaultValue="blockchain" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                  <TabsTrigger value="features">Caractéristiques</TabsTrigger>
                  <TabsTrigger value="roi">ROI & Analyse</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                {/* Onglet Blockchain */}
                <TabsContent value="blockchain" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">Informations NFT Blockchain</h3>
                      <Badge className="bg-green-500 text-white">
                        <Shield className="w-3 h-3 mr-1" />
                        Vérifié
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Token ID</div>
                        <div className="font-mono text-lg">{parcelle.nft_metadata.token_id}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Blockchain</div>
                        <div className="font-bold">{parcelle.nft_metadata.blockchain}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Adresse du Contrat</div>
                        <div className="font-mono text-sm">{parcelle.nft_metadata.contract_address}...</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Hash de Vérification</div>
                        <div className="font-mono text-sm">{parcelle.nft_metadata.hash}...</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-3">Options de Paiement Crypto</h4>
                      <div className="flex flex-wrap gap-2">
                        {parcelle.financing_options.crypto_accepted.map((crypto, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700">
                            <Coins className="w-3 h-3 mr-1" />
                            {crypto}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Caractéristiques */}
                <TabsContent value="features" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Caractéristiques du Terrain</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {parcelle.features.map((feature, index) => (
                        <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                          <span className="text-gray-800">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Commodités Environnantes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parcelle.nearby_amenities.map((amenity, index) => {
                          const IconComponent = amenity.icon;
                          return (
                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                              <IconComponent className="w-6 h-6 text-blue-600 mr-3" />
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{amenity.name}</div>
                                <div className="text-sm text-gray-600">{amenity.distance}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-green-600">Score: {amenity.score}/10</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet ROI */}
                <TabsContent value="roi" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Analyse ROI & Rentabilité</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{parcelle.roi_analysis.estimated_annual_roi}%</div>
                        <div className="text-sm text-gray-600">ROI Annuel Estimé</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{parcelle.roi_analysis.payback_period}</div>
                        <div className="text-sm text-gray-600">Période de Retour</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{parcelle.roi_analysis.appreciation_forecast}</div>
                        <div className="text-sm text-gray-600">Appréciation Prévue</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Score Marché</span>
                          <span className="font-bold">{parcelle.roi_analysis.market_score}/10</span>
                        </div>
                        <Progress value={parcelle.roi_analysis.market_score * 10} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Score Emplacement</span>
                          <span className="font-bold">{parcelle.roi_analysis.location_score}/10</span>
                        </div>
                        <Progress value={parcelle.roi_analysis.location_score * 10} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Score Infrastructure</span>
                          <span className="font-bold">{parcelle.roi_analysis.infrastructure_score}/10</span>
                        </div>
                        <Progress value={parcelle.roi_analysis.infrastructure_score * 10} className="h-2" />
                      </div>
                    </div>

                    <Button className="w-full" onClick={handleFinancing}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculateur ROI Personnalisé
                    </Button>
                  </div>
                </TabsContent>

                {/* Onglet Documents */}
                <TabsContent value="documents" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Documents Blockchain Vérifiés</h3>
                    
                    {parcelle.documents.map((doc, index) => (
                      <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-gray-600">Hash: {doc.hash}</div>
                            <div className="text-xs text-gray-500">Vérifié le {doc.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.verified && (
                            <Badge className="bg-green-500 text-white">
                              <Shield className="w-3 h-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar - Actions et informations vendeur */}
          <div className="space-y-6">
            
            {/* Actions principales */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button onClick={handleContact} className="w-full bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contacter le Vendeur
                  </Button>
                  
                  <Button onClick={handleScheduleVisit} variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Programmer une Visite
                  </Button>
                  
                  <Button onClick={handleFinancing} variant="outline" className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Options de Financement
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-1" />
                      Partager
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations vendeur */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations Vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <img 
                    src={parcelle.seller_avatar} 
                    alt={parcelle.seller_name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{parcelle.seller_name}</div>
                    <div className="text-sm text-blue-600">{parcelle.seller_type}</div>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {parcelle.seller_rating} ({parcelle.seller_properties} propriétés)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Appeler
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Calculateur de financement rapide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calculateur Rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Apport initial (30% min.)</Label>
                    <Input type="number" placeholder="37 500 000" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Durée (années)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 ans</SelectItem>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modales (simplifiées pour éviter les erreurs) */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Contacter le Vendeur</h3>
            <div className="space-y-4">
              <Input placeholder="Votre nom" />
              <Input placeholder="Email" type="email" />
              <Textarea placeholder="Votre message..." rows={4} />
              <div className="flex space-x-3">
                <Button className="flex-1">Envoyer</Button>
                <Button variant="outline" onClick={() => setShowContactModal(false)}>Annuler</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelleDetailPageBlockchain;
