import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, MapPin, Building2, Users, Calendar, Clock, FileText,
  CheckCircle, AlertTriangle, Info, Phone, Mail, Globe, Shield,
  Download, Upload, Euro, TrendingUp, Map, Navigation, Zap,
  Heart, Star, Share2, Eye, Car, Wifi, Droplets, Camera,
  Bath, Bed, Home, Ruler, CreditCard, Bitcoin, Banknote
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
import ProfileLink from '@/components/common/ProfileLink';

const ParcelleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parcelle, setParcelle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('direct'); // direct, installment, bank, crypto

  useEffect(() => {
    // Simulation de chargement des données de la parcelle
    const mockParcelleData = {
      id: parseInt(id),
      title: "Terrain Résidentiel Premium - Almadies",
      location: "Almadies, Dakar, Sénégal",
      region: "Dakar",
      city: "Dakar",
      price: "85000000",
      surface: "500",
      type: "Résidentiel",
      seller: {
        id: "seller-001",
        name: "Amadou FALL",
        type: "Particulier",
        phone: "+221 77 123 45 67",
        email: "amadou.fall@email.com",
        verified: true,
        rating: 4.8,
        properties_sold: 12
      },
      
      // Localisation précise
      address: {
        full: "Route des Almadies, Parcelle N°147, Dakar, Sénégal",
        coordinates: {
          latitude: 14.7381,
          longitude: -17.5094
        },
        nearby_landmarks: [
          "Université Cheikh Anta Diop (8 km)",
          "Aéroport Léopold Sédar Senghor (12 km)",
          "Plage des Almadies (1.5 km)",
          "Centre commercial Sea Plaza (2 km)"
        ]
      },

      // Coordonnées pour compatibilité
      coordinates: {
        lat: 14.7381,
        lng: -17.5094
      },

      // Caractéristiques
      features: {
        main: ["Vue mer panoramique", "Résidence fermée sécurisée", "Parking privé"],
        utilities: ["Eau courante", "Électricité SENELEC", "Internet fibre optique"],
        access: ["Route pavée", "Transport public", "Écoles à proximité"],
        zoning: "Zone résidentielle R3",
        buildable_ratio: "0.6",
        max_floors: 4
      },

      // Options de financement
      financing: {
        methods: ["Bancaire", "Échelonné", "Crypto-monnaie"],
        bank_financing: {
          available: true,
          min_down_payment: "30%",
          max_duration: "25 ans",
          partner_banks: [
            { id: "cbao-001", name: "CBAO" },
            { id: "uba-001", name: "UBA" },
            { id: "atlantique-001", name: "Banque Atlantique" }
          ]
        },
        installment: {
          available: true,
          min_down_payment: "20%",
          monthly_payment: "1200000",
          duration: "5 ans"
        },
        crypto: {
          available: true,
          accepted_currencies: ["Bitcoin", "Ethereum", "USDC"],
          discount: "5%"
        }
      },

      // NFT et Blockchain
      nft: {
        available: true,
        token_id: "TER_ALM_147_2025",
        blockchain: "Polygon",
        mint_date: "2025-01-15",
        current_owner: "0x742d35Cc6634C0532925a3b8D49a9B8741c55F5d",
        metadata_uri: "ipfs://QmXyZ...abc123",
        smart_contract: "0x1234567890abcdef1234567890abcdef12345678"
      },

      // Score IA et analytics
      ai_score: {
        overall: 9.2,
        location: 9.5,
        investment_potential: 8.8,
        infrastructure: 9.0,
        price_vs_market: 8.9,
        growth_prediction: "15-20% dans les 3 prochaines années"
      },

      // Images
      images: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
        "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1000",
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1000",
        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1000"
      ],

      // Documents légaux
      documents: [
        { name: "Titre Foncier", type: "PDF", size: "2.4 MB", verified: true },
        { name: "Plan de bornage", type: "PDF", size: "1.8 MB", verified: true },
        { name: "Certificat d'urbanisme", type: "PDF", size: "1.2 MB", verified: true },
        { name: "Photos aériennes", type: "PDF", size: "5.1 MB", verified: false }
      ],

      // Historique des prix
      price_history: [
        { date: "2024-01-15", price: 75000000 },
        { date: "2024-06-15", price: 80000000 },
        { date: "2025-01-15", price: 85000000 }
      ],

      // Statistiques
      stats: {
        views: 1247,
        favorites: 89,
        inquiries: 23,
        days_on_market: 45,
        last_updated: "2025-09-05"
      },

      description: `🏖️ **TERRAIN EXCEPTIONNEL AVEC VUE MER - ALMADIES**

Découvrez ce magnifique terrain de 500m² situé dans le quartier prestigieux des Almadies, offrant une vue mer panoramique imprenable. Cette parcelle exceptionnelle représente une opportunité unique d'investissement dans l'un des secteurs les plus recherchés de Dakar.

🌟 **ATOUTS MAJEURS**
• Vue mer panoramique à 180°
• Résidence fermée avec sécurité 24h/24
• Proximité immédiate de la plage (1,5 km)
• Infrastructure complète (eau, électricité, internet)
• Zone résidentielle haut de gamme

🏗️ **POTENTIEL DE CONSTRUCTION**
• Coefficient d'emprise au sol: 0.6
• Hauteur maximum: 4 étages (R+3)
• Possibilité villa de luxe ou immeuble résidentiel
• Accès direct véhicule et parking privé

💰 **FINANCEMENT FLEXIBLE**
• Financement bancaire disponible (30% d'apport)
• Paiement échelonné sur 5 ans possible
• Acceptation crypto-monnaies avec 5% de réduction

🔐 **SÉCURITÉ BLOCKCHAIN**
• Propriété tokenisée en NFT
• Smart contract sur blockchain Polygon
• Transparence et sécurité maximales
• Transfert de propriété instantané

Cette parcelle représente un investissement d'exception dans l'un des quartiers les plus prisés de Dakar, alliant prestige, rentabilité et innovation technologique.`
    };

    setTimeout(() => {
      setParcelle(mockParcelleData);
      setLoading(false);
    }, 1000);
  }, [id]);

  const formatPrice = (price) => {
    return parseInt(price).toLocaleString() + ' FCFA';
  };

  const formatPricePerM2 = (price, surface) => {
    return Math.round(parseInt(price) / parseInt(surface)).toLocaleString() + ' FCFA/m²';
  };

  const handleContact = () => {
    setShowContactModal(true);
  };

  const handleShowMap = () => {
    setShowMapModal(true);
  };

  const openGoogleMaps = () => {
    if (parcelle?.address?.coordinates) {
      const { latitude, longitude } = parcelle.address.coordinates;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Calcul intelligent des prix selon la méthode de paiement
  const getPaymentInfo = () => {
    if (!parcelle) return null;
    
    const basePrice = parseInt(parcelle.price);
    
    switch (paymentMethod) {
      case 'direct':
        // 5% de réduction pour paiement direct
        const directPrice = basePrice * 0.95;
        return {
          totalPrice: directPrice,
          displayPrice: formatPrice(directPrice.toString()),
          savings: formatPrice((basePrice - directPrice).toString()),
          method: 'Paiement direct',
          title: 'Achat Direct Comptant',
          description: 'Paiement comptant avec 5% de réduction',
          benefits: ['5% de réduction immédiate', 'Transfert de propriété instantané', 'Aucun frais de dossier']
        };
        
      case 'installment':
        // Prix normal + 3% de frais de dossier
        const installmentPrice = basePrice * 1.03;
        const monthlyPayment = installmentPrice / 60; // 5 ans
        return {
          totalPrice: installmentPrice,
          displayPrice: formatPrice(installmentPrice.toString()),
          monthlyPayment: formatPrice(monthlyPayment.toString()),
          duration: '60 mois',
          method: 'Paiement échelonné',
          title: 'Paiement Échelonné Flexible',
          description: 'Paiement en plusieurs fois sur 5 ans',
          benefits: ['Apport minimum 20%', 'Paiement étalé sur 5 ans', 'Taux fixe garanti']
        };
        
      case 'bank':
        // Prix normal + frais bancaires
        const bankPrice = basePrice * 1.02;
        const monthlyBankPayment = (bankPrice * 0.7) / 300; // 25 ans, 70% financé
        return {
          totalPrice: bankPrice,
          displayPrice: formatPrice(bankPrice.toString()),
          monthlyPayment: formatPrice(monthlyBankPayment.toString()),
          downPayment: formatPrice((bankPrice * 0.3).toString()),
          duration: '25 ans',
          method: 'Financement bancaire',
          title: 'Financement Bancaire Partenaire',
          description: 'Crédit immobilier avec banques partenaires',
          benefits: ['Apport 30% minimum', 'Taux préférentiel', 'Accompagnement expert']
        };

      case 'crypto':
        // 3% de réduction pour paiement crypto
        const cryptoPrice = basePrice * 0.97;
        return {
          totalPrice: cryptoPrice,
          displayPrice: formatPrice(cryptoPrice.toString()),
          savings: formatPrice((basePrice - cryptoPrice).toString()),
          method: 'Paiement Crypto',
          title: 'Paiement Cryptocurrency',
          description: 'Bitcoin, Ethereum, USDT - Transaction blockchain sécurisée',
          benefits: ['3% de réduction crypto', 'Transaction instantanée', 'Anonymat préservé', 'Frais de réseau minimaux']
        };
        
      default:
        return {
          totalPrice: basePrice,
          displayPrice: formatPrice(basePrice.toString()),
          method: 'Prix de base',
          title: 'Prix Catalogue Standard',
          description: 'Prix catalogue sans options',
          benefits: []
        };
    }
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
          <div className="text-lg font-medium text-gray-700">Chargement de la parcelle...</div>
          <div className="text-sm text-gray-500 mt-2">Récupération des informations blockchain</div>
        </div>
      </div>
    );
  }

  if (!parcelle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <div className="text-lg font-medium text-gray-700">Parcelle non trouvée</div>
          <div className="text-sm text-gray-500 mt-2">Cette parcelle n'existe pas ou a été supprimée</div>
          <Button onClick={() => navigate('/parcelles-vendeurs')} className="mt-4">
            Retour aux parcelles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>{parcelle.title} | Teranga Foncier</title>
        <meta name="description" content={`${parcelle.title} - ${parcelle.surface}m² à ${formatPrice(parcelle.price)} dans ${parcelle.location}`} />
      </Helmet>

      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/parcelles-vendeurs')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux parcelles
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleFavorite}>
                <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Sauvegardé' : 'Sauvegarder'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Galerie d'images */}
            <Card className="overflow-hidden">
              <div className="relative h-96">
                <img
                  src={parcelle.images[activeImageIndex]}
                  alt={`${parcelle.title} - Image ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {parcelle.seller.verified && (
                    <Badge className="bg-green-500 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Vérifié
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    {parcelle.type}
                  </Badge>
                  {parcelle.nft.available && (
                    <Badge className="bg-purple-500 text-white">
                      <Bitcoin className="w-3 h-3 mr-1" />
                      NFT
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {parcelle.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          index === activeImageIndex ? 'border-white' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Miniature ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Informations principales */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{parcelle.title}</h1>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="text-lg">{parcelle.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatPrice(parcelle.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPricePerM2(parcelle.price, parcelle.surface)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{parcelle.surface}</div>
                      <div className="text-sm text-gray-500">m² de terrain</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{parcelle.ai_score.overall}</div>
                      <div className="text-sm text-gray-500">Score IA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{parcelle.stats.views}</div>
                      <div className="text-sm text-gray-500">Vues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{parcelle.stats.days_on_market}</div>
                      <div className="text-sm text-gray-500">Jours en ligne</div>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <div 
                      className="text-gray-700 leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{ 
                        __html: parcelle.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                   .replace(/•/g, '•')
                      }} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onglets détaillés */}
            <Card>
              <Tabs defaultValue="caracteristiques" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="caracteristiques">Caractéristiques</TabsTrigger>
                  <TabsTrigger value="financement">Financement</TabsTrigger>
                  <TabsTrigger value="nft">NFT & Blockchain</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="caracteristiques" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Caractéristiques principales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parcelle.features.main.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Commodités</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parcelle.features.utilities.map((utility, index) => (
                          <div key={index} className="flex items-center">
                            <Zap className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-sm">{utility}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Accès et transport</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parcelle.features.access.map((access, index) => (
                          <div key={index} className="flex items-center">
                            <Navigation className="w-4 h-4 text-purple-500 mr-2" />
                            <span className="text-sm">{access}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Informations d'urbanisme</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Zone:</span>
                          <span className="ml-2 font-medium">{parcelle.features.zoning}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">CES:</span>
                          <span className="ml-2 font-medium">{parcelle.features.buildable_ratio}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Hauteur max:</span>
                          <span className="ml-2 font-medium">{parcelle.features.max_floors} étages</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financement" className="mt-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Options de financement disponibles</h3>
                    
                    <div className="grid gap-4">
                      <Card className="border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-3">
                            <Banknote className="w-5 h-5 text-blue-500 mr-2" />
                            <h4 className="font-semibold">Financement bancaire</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Apport minimum:</span>
                              <div className="font-medium">{parcelle.financing.bank_financing.min_down_payment}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Durée maximum:</span>
                              <div className="font-medium">{parcelle.financing.bank_financing.max_duration}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Banques partenaires:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {parcelle.financing.bank_financing.partner_banks.map((bank, index) => (
                                  <ProfileLink 
                                    key={index}
                                    type="bank" 
                                    id={bank.id} 
                                    className="text-xs"
                                  >
                                    <Badge variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
                                      {bank.name}
                                    </Badge>
                                  </ProfileLink>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-3">
                            <CreditCard className="w-5 h-5 text-green-500 mr-2" />
                            <h4 className="font-semibold">Paiement échelonné</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Apport minimum:</span>
                              <div className="font-medium">{parcelle.financing.installment.min_down_payment}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Mensualité:</span>
                              <div className="font-medium">{formatPrice(parcelle.financing.installment.monthly_payment)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Durée:</span>
                              <div className="font-medium">{parcelle.financing.installment.duration}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-3">
                            <Bitcoin className="w-5 h-5 text-purple-500 mr-2" />
                            <h4 className="font-semibold">Crypto-monnaie</h4>
                            <Badge className="ml-2 bg-purple-100 text-purple-700">-{parcelle.financing.crypto.discount} de réduction</Badge>
                          </div>
                          <div>
                            <span className="text-gray-600 text-sm">Devises acceptées:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {parcelle.financing.crypto.accepted_currencies.map((currency, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{currency}</Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="nft" className="mt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Propriété Tokenisée NFT</h3>
                      <Badge className="bg-purple-500 text-white">
                        <Bitcoin className="w-3 h-3 mr-1" />
                        Actif
                      </Badge>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Informations NFT</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Token ID:</span>
                              <div className="font-mono bg-white px-2 py-1 rounded mt-1">{parcelle.nft.token_id}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Blockchain:</span>
                              <div className="font-medium">{parcelle.nft.blockchain}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Date de mint:</span>
                              <div className="font-medium">{parcelle.nft.mint_date}</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Smart Contract</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Adresse du contrat:</span>
                              <div className="font-mono bg-white px-2 py-1 rounded mt-1 break-all">
                                {parcelle.nft.smart_contract}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Propriétaire actuel:</span>
                              <div className="font-mono bg-white px-2 py-1 rounded mt-1 break-all">
                                {parcelle.nft.current_owner}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Voir sur OpenSea
                        </Button>
                        <Button variant="outline" size="sm">
                          <Globe className="w-4 h-4 mr-2" />
                          Explorer Blockchain
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Avantages de la tokenisation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Sécurité maximale</div>
                            <div className="text-xs text-gray-600">Propriété immutable sur blockchain</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <TrendingUp className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Transfert instantané</div>
                            <div className="text-xs text-gray-600">Transaction en quelques minutes</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Globe className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Transparence totale</div>
                            <div className="text-xs text-gray-600">Historique public vérifiable</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Euro className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Frais réduits</div>
                            <div className="text-xs text-gray-600">Pas d'intermédiaires traditionnels</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Documents légaux</h3>
                    
                    <div className="space-y-3">
                      {parcelle.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-gray-500">{doc.type} • {doc.size}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.verified && (
                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Vérifié
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Télécharger
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-blue-900 mb-1">Documents vérifiés</div>
                          <div className="text-blue-700">
                            Tous les documents marqués comme "Vérifié" ont été contrôlés par nos experts légaux 
                            et sont conformes à la réglementation sénégalaise.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Score IA */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Analyse IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {parcelle.ai_score.overall}/10
                    </div>
                    <div className="text-sm text-gray-600">Score global</div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Localisation</span>
                        <span>{parcelle.ai_score.location}/10</span>
                      </div>
                      <Progress value={parcelle.ai_score.location * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Potentiel investissement</span>
                        <span>{parcelle.ai_score.investment_potential}/10</span>
                      </div>
                      <Progress value={parcelle.ai_score.investment_potential * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Infrastructure</span>
                        <span>{parcelle.ai_score.infrastructure}/10</span>
                      </div>
                      <Progress value={parcelle.ai_score.infrastructure * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Prix vs marché</span>
                        <span>{parcelle.ai_score.price_vs_market}/10</span>
                      </div>
                      <Progress value={parcelle.ai_score.price_vs_market * 10} className="h-2" />
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-800 mb-1">Prédiction de croissance</div>
                    <div className="text-sm text-green-700">{parcelle.ai_score.growth_prediction}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Système de Paiement Intelligent Blockchain */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  Paiement Intelligent Blockchain
                  <Badge className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    IA Powered
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  {/* Options de paiement modernes */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-indigo-600" />
                      Modes de Paiement Sécurisés
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      
                      {/* Paiement Direct */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'direct' 
                            ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50' 
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                        }`}
                        onClick={() => setPaymentMethod('direct')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              paymentMethod === 'direct' 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                : 'bg-gray-100'
                            }`}>
                              <CreditCard className={`w-5 h-5 ${
                                paymentMethod === 'direct' ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold">Paiement Direct</div>
                              <div className="text-sm text-gray-600">Transaction instantanée</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">-5%</div>
                            <div className="text-xs text-gray-500">Réduction</div>
                          </div>
                        </div>
                        {paymentMethod === 'direct' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-indigo-200"
                          >
                            <div className="flex items-center text-sm text-indigo-700 mb-2">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Transaction blockchain sécurisée
                            </div>
                            <div className="flex items-center text-sm text-indigo-700">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Transfert de propriété immédiat
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Paiement Échelonné */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'installment' 
                            ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50' 
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                        }`}
                        onClick={() => setPaymentMethod('installment')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              paymentMethod === 'installment' 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                : 'bg-gray-100'
                            }`}>
                              <Calendar className={`w-5 h-5 ${
                                paymentMethod === 'installment' ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold">Paiement Échelonné</div>
                              <div className="text-sm text-gray-600">Jusqu'à 24 mois</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">+2%</div>
                            <div className="text-xs text-gray-500">Frais gestion</div>
                          </div>
                        </div>
                        {paymentMethod === 'installment' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-indigo-200"
                          >
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Smart contracts automatisés
                              </div>
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Propriété progressive
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Financement Bancaire */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'bank' 
                            ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50' 
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                        }`}
                        onClick={() => setPaymentMethod('bank')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              paymentMethod === 'bank' 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                : 'bg-gray-100'
                            }`}>
                              <Banknote className={`w-5 h-5 ${
                                paymentMethod === 'bank' ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold">Financement Bancaire</div>
                              <div className="text-sm text-gray-600">Jusqu'à 80% du montant</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-600">3.5%</div>
                            <div className="text-xs text-gray-500">Taux annuel</div>
                          </div>
                        </div>
                        {paymentMethod === 'bank' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-indigo-200"
                          >
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Préapprobation en 24h
                              </div>
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Partenaires bancaires certifiés
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Option Crypto */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'crypto' 
                            ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50' 
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                        }`}
                        onClick={() => setPaymentMethod('crypto')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              paymentMethod === 'crypto' 
                                ? 'bg-gradient-to-r from-orange-500 to-yellow-500' 
                                : 'bg-gray-100'
                            }`}>
                              <Bitcoin className={`w-5 h-5 ${
                                paymentMethod === 'crypto' ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold flex items-center">
                                Paiement Crypto
                                <Badge className="ml-2 text-xs bg-orange-100 text-orange-600">Nouveau</Badge>
                              </div>
                              <div className="text-sm text-gray-600">Bitcoin, Ethereum, USDT</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-orange-600">-3%</div>
                            <div className="text-xs text-gray-500">Réduction</div>
                          </div>
                        </div>
                        {paymentMethod === 'crypto' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-indigo-200"
                          >
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Transaction instantanée
                              </div>
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Anonymat préservé
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Résumé du paiement */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl">
                    <div className="text-center">
                      <div className="text-sm opacity-90 mb-1">Prix Total</div>
                      <div className="text-3xl font-bold mb-2">
                        {getPaymentInfo(parcelle.prix, paymentMethod).totalPrice.toLocaleString('fr-FR')} FCFA
                      </div>
                      <div className="text-sm opacity-90 mb-4">
                        {parcelle.prixParM2?.toLocaleString('fr-FR')} FCFA/m² • {parcelle.surface} m²
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                        <div className="text-sm font-medium mb-2">
                          {getPaymentInfo(parcelle.prix, paymentMethod).title}
                        </div>
                        <div className="text-xs opacity-90">
                          {getPaymentInfo(parcelle.prix, paymentMethod).description}
                        </div>
                      </div>

                      <div className="flex items-center justify-center text-xs space-x-4">
                        <div className="flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          Sécurisé Blockchain
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          IA Optimisé
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          Transaction Globale
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions principales */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button onClick={handleContact} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Initier l'achat
                  </Button>
                  
                  <Button onClick={handleShowMap} variant="outline" className="w-full">
                    <Map className="w-4 h-4 mr-2" />
                    Voir sur la carte
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Programmer une visite
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Dossier complet PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Informations vendeur */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <ProfileLink 
                        type={parcelle.seller.type} 
                        id={parcelle.seller.id || parcelle.id} 
                        className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        external={true}
                      >
                        {parcelle.seller.name}
                      </ProfileLink>
                      <div className="text-sm text-gray-600">{parcelle.seller.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Note vendeur:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium">{parcelle.seller.rating}/5</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Propriétés vendues:</span>
                    <span className="font-medium">{parcelle.seller.properties_sold}</span>
                  </div>

                  {parcelle.seller.verified && (
                    <div className="flex items-center text-sm text-green-600">
                      <Shield className="w-4 h-4 mr-1" />
                      <span>Vendeur vérifié</span>
                    </div>
                  )}

                  {/* Note sur la confidentialité */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                      <div className="text-xs text-blue-700">
                        <div className="font-medium mb-1">Protection des données</div>
                        <div>Les informations de contact du vendeur sont protégées. Utilisez le bouton "Initier l'achat" pour commencer la transaction en toute sécurité.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localisation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-sm text-gray-700 mb-2">Adresse exacte</div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {parcelle.address.full}
                    </div>
                  </div>

                  <div>
                    <div className="font-medium text-sm text-gray-700 mb-2">Points de repère</div>
                    <div className="space-y-2">
                      {parcelle.address.nearby_landmarks.map((landmark, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Navigation className="w-3 h-3 mr-2 text-gray-400" />
                          {landmark}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Carte interactive intégrée */}
                  <div>
                    <div className="font-medium text-sm text-gray-700 mb-2">Carte du terrain</div>
                    <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden border">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                        {/* Simulation de carte interactive */}
                        <div className="relative w-full h-full">
                          {/* Zone de terrain simulée */}
                          <div 
                            className="absolute bg-red-500 border-2 border-red-600 opacity-80"
                            style={{
                              left: '45%',
                              top: '40%',
                              width: '10%',
                              height: '20%',
                              borderRadius: '2px'
                            }}
                          ></div>
                          
                          {/* Points de repère simulés */}
                          <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium shadow">
                            Terrain: {parcelle.surface} m²
                          </div>
                          
                          {/* Coordonnées GPS */}
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                            GPS: {parcelle.coordinates.lat}, {parcelle.coordinates.lng}
                          </div>
                          
                          {/* Contrôles de zoom simulés */}
                          <div className="absolute top-2 right-2 bg-white rounded shadow-lg">
                            <button className="w-8 h-8 text-gray-600 hover:text-gray-800 hover:bg-gray-50 flex items-center justify-center border-b">
                              +
                            </button>
                            <button className="w-8 h-8 text-gray-600 hover:text-gray-800 hover:bg-gray-50 flex items-center justify-center">
                              -
                            </button>
                          </div>

                          {/* Échelle */}
                          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-xs">
                            100m
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Button 
                      onClick={handleShowMap} 
                      variant="outline" 
                      className="w-full text-sm"
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Carte plein écran
                    </Button>
                    <Button 
                      onClick={openGoogleMaps} 
                      variant="outline" 
                      className="w-full text-sm"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Ouvrir dans Google Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de contact */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter {parcelle.seller.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Votre nom</Label>
              <Input id="name" placeholder="Nom complet" />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" placeholder="+221 XX XXX XX XX" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@exemple.com" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Je suis intéressé(e) par cette parcelle..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Envoyer
              </Button>
              <Button variant="outline" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Appeler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de carte */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Map className="w-5 h-5 mr-2 text-blue-600" />
              Localisation : {parcelle.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-1">Adresse</div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {parcelle.address.full}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-1">Coordonnées GPS</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="bg-blue-50 p-2 rounded">
                          Lat: {parcelle.address.coordinates.latitude}
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          Lng: {parcelle.address.coordinates.longitude}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-2">Points de repère</div>
                      <div className="space-y-1">
                        {parcelle.address.nearby_landmarks.map((landmark, index) => (
                          <div key={index} className="flex items-start text-xs text-gray-600">
                            <Navigation className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                            <span>{landmark}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={openGoogleMaps} 
                      className="w-full text-sm"
                      variant="outline"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Ouvrir dans Google Maps
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardContent className="p-4 h-full">
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-blue-50">
                        <div className="absolute top-20 left-0 w-full h-2 bg-gray-300 opacity-50"></div>
                        <div className="absolute top-32 left-0 w-full h-1 bg-gray-400 opacity-30"></div>
                        <div className="absolute left-20 top-0 w-2 h-full bg-gray-300 opacity-50"></div>
                        
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="relative">
                            <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                              <Home className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg border">
                              <div className="text-xs font-medium">{parcelle.surface}m²</div>
                              <div className="text-xs text-gray-500">{parcelle.type}</div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-1/4 left-1/4">
                          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-1 py-0.5 rounded text-xs shadow border">
                            Université
                          </div>
                        </div>
                        
                        <div className="absolute top-3/4 right-1/4">
                          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-1 py-0.5 rounded text-xs shadow border">
                            Plage
                          </div>
                        </div>

                        <div className="absolute top-1/3 right-1/3">
                          <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-1 py-0.5 rounded text-xs shadow border">
                            Centre Commercial
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border">
                        <div className="flex items-start">
                          <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-gray-600">
                            <strong>Carte interactive simulée</strong><br />
                            Cliquez sur "Ouvrir dans Google Maps" pour la localisation exacte avec navigation GPS.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParcelleDetailPage;
