import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Coins, 
  Shield, 
  Verified, 
  AlertTriangle,
  Eye,
  Heart,
  Share2,
  Calendar,
  Clock,
  User,
  ChevronDown,
  BarChart3,
  Zap,
  Lock,
  Database,
  Blocks,
  CreditCard,
  Building2,
  Users,
  FileText,
  Phone,
  Mail,
  Award,
  Landmark,
  Home,
  DollarSign,
  TrendingUp,
  Camera,
  Video,
  Map,
  Globe,
  ArrowRight,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ModernTerrainsBlockchainPage = () => {
  const navigate = useNavigate();
  
  const [properties, setProperties] = useState([]);
  const [communalLands, setCommunalLands] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeller, setSelectedSeller] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('private');
  const [loading, setLoading] = useState(true);
  const [selectedCommune, setSelectedCommune] = useState(null);
  
  // Nouveaux états pour fonctionnalités avancées
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showROIModal, setShowROIModal] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [showARView, setShowARView] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [compareList, setCompareList] = useState([]);

  // Fonctions de gestion des actions
  const handleViewDetails = (property) => {
    // Naviguer vers la page de détail blockchain
    navigate(`/parcel-blockchain/${property.id}`);
    console.log('Navigation vers détails NFT:', property.nft_id);
  };

  const handleScheduleVisit = (property) => {
    setSelectedProperty(property);
    setShowVisitModal(true);
  };

  const handleROICalculator = (property) => {
    setSelectedProperty(property);
    setShowROIModal(true);
  };

  const handleVirtualTour = (property) => {
    setSelectedProperty(property);
    setShowVirtualTour(true);
  };

  const handleARView = (property) => {
    setSelectedProperty(property);
    setShowARView(true);
  };

  const handleToggleFavorite = (propertyId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(propertyId)) {
      newFavorites.delete(propertyId);
    } else {
      newFavorites.add(propertyId);
    }
    setFavorites(newFavorites);
  };

  const handleShare = (property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href + `?property=${property.id}`
      });
    } else {
      // Fallback - copier dans le presse-papier
      navigator.clipboard.writeText(`${property.title} - ${window.location.href}?property=${property.id}`);
      alert('Lien copié dans le presse-papier !');
    }
  };

  const handleAddToCompare = (property) => {
    if (compareList.length < 4 && !compareList.find(p => p.id === property.id)) {
      setCompareList([...compareList, property]);
    }
  };

  // Données mockées des terrains privés avec NFT blockchain
  useEffect(() => {
    const mockPrivateProperties = [
      {
        id: 1,
        title: "Terrain Blockchain NFT 500m² - Almadies",
        region: "Dakar",
        city: "Dakar", 
        area: "Almadies",
        size: 500,
        price: 125000000,
        type: "Résidentiel",
        seller_type: "Vendeur Pro",
        seller_name: "Promotions Teranga SARL",
        nft_id: "NFT_TERRAIN_001",
        blockchain_verified: true,
        payment_options: ["direct", "banque", "echelonne"],
        bank_partners: ["UBA Sénégal", "Crédit Agricole", "SGBS"],
        construction_monitoring: true,
        smart_contract_address: "0x742d35cc6634c0532925a3b8d",
        verification_status: "NFT Vérifié",
        images: ["/api/placeholder/400/300"],
        description: "Terrain premium tokenisé en NFT avec smart contract automatique. Financement bancaire disponible, suivi construction 24/7 par drone et photos en temps réel.",
        features: ["Blockchain NFT", "Smart Contract", "Financement bancaire", "Suivi construction", "Diaspora compatible"],
        coordinates: { lat: 14.7645, lng: -17.4966 }
      },
      {
        id: 2,
        title: "Parcelle NFT 300m² - Guédiawaye",
        region: "Dakar",
        city: "Guédiawaye",
        area: "HLM",
        size: 300,
        price: 45000000,
        type: "Résidentiel",
        seller_type: "Vendeur Particulier",
        seller_name: "Amadou Diallo",
        nft_id: "NFT_TERRAIN_002",
        blockchain_verified: true,
        payment_options: ["echelonne", "banque"],
        bank_partners: ["CBAO", "Ecobank"],
        construction_monitoring: true,
        smart_contract_address: "0x847b29fc7893c0421975c1a7",
        verification_status: "NFT Vérifié",
        images: ["/api/placeholder/400/300"],
        description: "Terrain familial en NFT avec paiement échelonné. Option financement bancaire partenaire. Suivi photo hebdomadaire de la construction.",
        features: ["NFT Blockchain", "Paiement échelonné", "Financement disponible", "Suivi photo"],
        coordinates: { lat: 14.7692, lng: -17.4731 }
      },
      {
        id: 3,
        title: "Terrain Commercial NFT 1000m² - Thiès",
        region: "Thiès",
        city: "Thiès",
        area: "Centre-ville",
        size: 1000,
        price: 180000000,
        type: "Commercial",
        seller_type: "Vendeur Pro",
        seller_name: "Investissements Sénégal SA",
        nft_id: "NFT_TERRAIN_003", 
        blockchain_verified: true,
        payment_options: ["direct", "banque"],
        bank_partners: ["BOA Sénégal", "BIS"],
        construction_monitoring: true,
        smart_contract_address: "0x956c48ea6892d0532846b4f1",
        verification_status: "NFT Vérifié",
        images: ["/api/placeholder/400/300"],
        description: "Terrain commercial stratégique tokenisé en NFT. Financement bancaire rapide. Monitoring construction par caméra 24h/24.",
        features: ["NFT Commercial", "Smart Contract", "Financement express", "Caméra 24/7"],
        coordinates: { lat: 14.7886, lng: -16.9317 }
      }
    ];

    // Données des terrains communaux
    const mockCommunalLands = [
      {
        id: 'comm_1',
        commune: "Mairie de Pikine",
        project: "Nouveau Lotissement Pikine Est",
        total_parcels: 150,
        available_parcels: 89,
        price_per_m2: 85000,
        sizes_available: ["200m²", "300m²", "400m²", "500m²"],
        amenagement_status: "En cours",
        infrastructure: ["Électricité", "Eau courante", "Assainissement", "Routes pavées"],
        application_deadline: "2024-03-15",
        selection_method: "Tirage au sort",
        required_documents: ["Carte d'identité", "Certificat de résidence", "Justificatif revenus"],
        contact: {
          phone: "+221 33 834 12 45",
          email: "terrains@mairie-pikine.sn",
          address: "Avenue Blaise Diagne, Pikine"
        },
        coordinates: { lat: 14.7547, lng: -17.3984 }
      },
      {
        id: 'comm_2',
        commune: "Mairie de Rufisque",
        project: "Extension Rufisque Nord",
        total_parcels: 200,
        available_parcels: 156,
        price_per_m2: 65000,
        sizes_available: ["250m²", "300m²", "400m²"],
        amenagement_status: "Planifié",
        infrastructure: ["Électricité", "Forage", "Routes"], 
        application_deadline: "2024-04-20",
        selection_method: "Ordre d'arrivée",
        required_documents: ["Carte d'identité", "Certificat de résidence", "Engagement construction"],
        contact: {
          phone: "+221 33 836 78 90",
          email: "urbanisme@rufisque.sn", 
          address: "Place de l'Indépendance, Rufisque"
        },
        coordinates: { lat: 14.7167, lng: -17.2667 }
      },
      {
        id: 'comm_3',
        commune: "Mairie de Mbao",
        project: "Cité Mbao 2000",
        total_parcels: 75,
        available_parcels: 23,
        price_per_m2: 95000,
        sizes_available: ["300m²", "400m²", "500m²"],
        amenagement_status: "Finalisé",
        infrastructure: ["Électricité", "Eau SONES", "Assainissement", "Télécommunications"],
        application_deadline: "2024-02-28",
        selection_method: "Commission de sélection",
        required_documents: ["Dossier complet", "Garantie bancaire", "Plan architectural"],
        contact: {
          phone: "+221 33 835 45 67",
          email: "terrains@mbao.sn",
          address: "Rue Principale, Mbao"
        },
        coordinates: { lat: 14.7289, lng: -17.3456 }
      }
    ];

    setProperties(mockPrivateProperties);
    setCommunalLands(mockCommunalLands);
    setFilteredProperties(mockPrivateProperties);
    setLoading(false);
  }, []);

  // Filtrage des terrains privés
  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(property => property.region === selectedRegion);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(property => property.type === selectedType);
    }

    if (selectedSeller !== 'all') {
      filtered = filtered.filter(property => property.seller_type === selectedSeller);
    }

    if (paymentMethod !== 'all') {
      filtered = filtered.filter(property => property.payment_options.includes(paymentMethod));
    }

    setFilteredProperties(filtered);
  }, [searchTerm, selectedRegion, selectedType, selectedSeller, paymentMethod, properties]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const communalLandRequestForm = (commune) => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Demande de Terrain Communal</h3>
        <p className="text-gray-600">Projet: {commune.project}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
            <Input placeholder="Votre nom complet" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <Input placeholder="+221 XX XXX XX XX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input type="email" placeholder="votre@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Taille souhaitée</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choisir la taille" />
              </SelectTrigger>
              <SelectContent>
                {commune.sizes_available.map(size => (
                  <SelectItem key={size} value={size}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Motivation</label>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows="4"
            placeholder="Expliquez votre projet de construction et votre motivation..."
          />
        </div>

        <div className="flex space-x-4">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <FileText className="w-4 h-4 mr-2" />
            Soumettre la Demande
          </Button>
          <Button variant="outline" onClick={() => setSelectedCommune(null)}>
            Annuler
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des terrains blockchain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <Helmet>
        <title>Terrains Blockchain NFT - Achat & Terrains Communaux | Teranga Foncier</title>
        <meta name="description" content="Découvrez nos terrains tokenisés en NFT avec financement bancaire et terrains communaux. Paiement échelonné, suivi construction temps réel." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3">
                <Database className="h-12 w-12 text-yellow-400" />
                <Blocks className="h-10 w-10 text-blue-300" />
                <Landmark className="h-12 w-12 text-green-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terrains <span className="text-yellow-400">Blockchain NFT</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto">
              Propriétés tokenisées en NFT • Financement bancaire • Terrains communaux • 
              Paiement échelonné • Suivi construction temps réel
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-yellow-500 text-black px-4 py-2 text-lg">
                <Database className="w-4 h-4 mr-2" />
                NFT Sécurisé
              </Badge>
              <Badge className="bg-green-500 text-white px-4 py-2 text-lg">
                <CreditCard className="w-4 h-4 mr-2" />
                Financement Bancaire
              </Badge>
              <Badge className="bg-blue-500 text-white px-4 py-2 text-lg">
                <Landmark className="w-4 h-4 mr-2" />
                Terrains Communaux
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2,500+</div>
              <div className="text-gray-600">Terrains NFT</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">12</div>
              <div className="text-gray-600">Banques Partenaires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">45</div>
              <div className="text-gray-600">Communes Partenaires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">95%</div>
              <div className="text-gray-600">Projets Financés</div>
            </div>
          </div>
        </div>
      </section>

      {/* Barre de Comparaison */}
      {compareList.length > 0 && (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h3 className="font-bold">Comparaison ({compareList.length}/4)</h3>
                <div className="flex space-x-2">
                  {compareList.map((property) => (
                    <div key={property.id} className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-sm">
                      {property.title.substring(0, 20)}...
                      <button 
                        onClick={() => setCompareList(compareList.filter(p => p.id !== property.id))}
                        className="ml-2 text-red-300 hover:text-red-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Comparer Maintenant
                </Button>
                <Button variant="ghost" onClick={() => setCompareList([])} className="text-white hover:bg-white hover:bg-opacity-20">
                  Vider
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="private" className="text-lg py-3">
                <Home className="w-5 h-5 mr-2" />
                Terrains Privés NFT
              </TabsTrigger>
              <TabsTrigger value="communal" className="text-lg py-3">
                <Landmark className="w-5 h-5 mr-2" />
                Terrains Communaux
              </TabsTrigger>
            </TabsList>

            {/* Private Lands Tab */}
            <TabsContent value="private">
              {/* Search and Filters */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Rechercher par ville, quartier, ou type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-lg py-3"
                    />
                  </div>
                  <Button
                    variant={filterOpen ? "default" : "outline"}
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="px-6"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtres
                  </Button>
                </div>

                <AnimatePresence>
                  {filterOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4 border-t"
                    >
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Région" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes régions</SelectItem>
                          <SelectItem value="Dakar">Dakar</SelectItem>
                          <SelectItem value="Thiès">Thiès</SelectItem>
                          <SelectItem value="Saint-Louis">Saint-Louis</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous types</SelectItem>
                          <SelectItem value="Résidentiel">Résidentiel</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Industriel">Industriel</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vendeur" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous vendeurs</SelectItem>
                          <SelectItem value="Vendeur Particulier">Particulier</SelectItem>
                          <SelectItem value="Vendeur Pro">Professionnel</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Paiement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous modes</SelectItem>
                          <SelectItem value="direct">Achat Direct</SelectItem>
                          <SelectItem value="banque">Financement Bancaire</SelectItem>
                          <SelectItem value="echelonne">Paiement Échelonné</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" onClick={() => {
                        setSelectedRegion('all');
                        setSelectedType('all');
                        setSelectedSeller('all');
                        setPaymentMethod('all');
                      }}>
                        Réinitialiser
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-yellow-200">
                      <div className="relative">
                        <img 
                          src={property.images[0]} 
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-yellow-500 text-black">
                            <Database className="w-3 h-3 mr-1" />
                            NFT #{property.nft_id.split('_')[2]}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-green-500 text-white">
                            <Verified className="w-3 h-3 mr-1" />
                            {property.verification_status}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-blue-600">
                            {property.seller_type}
                          </Badge>
                          <span className="text-sm text-gray-500">{property.size}m²</span>
                        </div>

                        <h3 className="text-lg font-bold mb-2 text-gray-900">
                          {property.title}
                        </h3>

                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{property.area}, {property.city}</span>
                        </div>

                        <div className="text-2xl font-bold text-blue-600 mb-4">
                          {formatPrice(property.price)}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="text-sm text-gray-600">
                            <strong>Vendeur:</strong> {property.seller_name}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {property.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="text-sm font-medium text-gray-700">Options de paiement:</div>
                          <div className="flex flex-wrap gap-2">
                            {property.payment_options.includes('direct') && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <DollarSign className="w-3 h-3 mr-1" />
                                Achat Direct
                              </Badge>
                            )}
                            {property.payment_options.includes('banque') && (
                              <Badge className="bg-green-100 text-green-800">
                                <CreditCard className="w-3 h-3 mr-1" />
                                Financement
                              </Badge>
                            )}
                            {property.payment_options.includes('echelonne') && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Calendar className="w-3 h-3 mr-1" />
                                Échelonné
                              </Badge>
                            )}
                          </div>
                        </div>

                        {property.bank_partners && property.bank_partners.length > 0 && (
                          <div className="mb-4">
                            <div className="text-sm font-medium text-gray-700 mb-1">Banques partenaires:</div>
                            <div className="text-xs text-gray-600">
                              {property.bank_partners.join(', ')}
                            </div>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <Button 
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            onClick={() => handleViewDetails(property)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir Détails NFT
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleScheduleVisit(property)}
                            className="bg-green-50 hover:bg-green-100 border-green-200"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Planifier Visite
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleToggleFavorite(property.id)}>
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleShare(property)}>
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs"
                            onClick={() => handleROICalculator(property)}
                          >
                            <Calculator className="w-3 h-3 mr-1" />
                            Calculer ROI
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs"
                            onClick={() => handleVirtualTour(property)}
                          >
                            <Video className="w-3 h-3 mr-1" />
                            Visite 360°
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs"
                            onClick={() => handleARView(property)}
                          >
                            <Camera className="w-3 h-3 mr-1" />
                            Vue AR
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs"
                            onClick={() => handleAddToCompare(property)}
                            disabled={compareList.length >= 4 || compareList.find(p => p.id === property.id)}
                          >
                            <BarChart3 className="w-3 h-3 mr-1" />
                            Comparer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Communal Lands Tab - Version Modernisée */}
            <TabsContent value="communal">
              <div className="space-y-8">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-2xl p-8 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-2xl"></div>
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">
                      🏛️ Terrains Communaux Blockchain
                    </h2>
                    <p className="text-lg mb-6 text-green-100">
                      Nouvelles opportunités foncières sécurisées par les communes partenaires. 
                      Processus transparent, suivi en temps réel et attribution équitable.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white bg-opacity-20 rounded-lg p-4">
                        <div className="text-2xl font-bold">
                          {communalLands.reduce((sum, commune) => sum + commune.available_parcels, 0)}
                        </div>
                        <div className="text-sm text-green-100">Parcelles disponibles</div>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-lg p-4">
                        <div className="text-2xl font-bold">{communalLands.length}</div>
                        <div className="text-sm text-green-100">Communes partenaires</div>
                      </div>
                      <div className="bg-white bg-opacity-20 rounded-lg p-4">
                        <div className="text-2xl font-bold">100%</div>
                        <div className="text-sm text-green-100">Processus transparent</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filtres avancés pour communes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Filter className="w-5 h-5 mr-2" />
                      Filtres Spécialisés Communes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Commune" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les communes</SelectItem>
                          <SelectItem value="pikine">Mairie de Pikine</SelectItem>
                          <SelectItem value="rufisque">Mairie de Rufisque</SelectItem>
                          <SelectItem value="guediawaye">Mairie de Guédiawaye</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Statut aménagement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="finalise">Finalisé</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                          <SelectItem value="planifie">Planifié</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Taille parcelle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes tailles</SelectItem>
                          <SelectItem value="200">200m²</SelectItem>
                          <SelectItem value="300">300m²</SelectItem>
                          <SelectItem value="400">400m²</SelectItem>
                          <SelectItem value="500">500m²+</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select defaultValue="deadline">
                        <SelectTrigger>
                          <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deadline">Échéance proche</SelectItem>
                          <SelectItem value="price">Prix croissant</SelectItem>
                          <SelectItem value="availability">Plus disponibles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Projets communaux modernisés */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {communalLands.map((commune) => {
                    const availabilityPercentage = (commune.available_parcels / commune.total_parcels) * 100;
                    const daysUntilDeadline = Math.ceil((new Date(commune.application_deadline) - new Date()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <motion.div
                        key={commune.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50">
                          {/* Header avec badge urgence */}
                          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white relative">
                            {daysUntilDeadline <= 7 && (
                              <div className="absolute top-4 right-4">
                                <Badge className="bg-red-500 text-white animate-pulse">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Urgent
                                </Badge>
                              </div>
                            )}
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl flex items-center">
                                  <Home className="w-5 h-5 mr-2" />
                                  {commune.commune}
                                </CardTitle>
                                <p className="text-green-100 mt-1">{commune.project}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold">{commune.available_parcels}</div>
                                <div className="text-xs text-green-100">disponibles</div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="p-6">
                            {/* Métriques principales */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                                <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                <div className="text-lg font-bold text-blue-600">
                                  {formatPrice(commune.price_per_m2)}
                                </div>
                                <div className="text-xs text-gray-600">par m²</div>
                              </div>
                              
                              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                                <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                <div className="text-lg font-bold text-green-600">
                                  {Math.round(availabilityPercentage)}%
                                </div>
                                <div className="text-xs text-gray-600">disponible</div>
                              </div>
                              
                              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                                <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                                <div className="text-lg font-bold text-purple-600">
                                  {daysUntilDeadline}j
                                </div>
                                <div className="text-xs text-gray-600">restants</div>
                              </div>
                            </div>

                            {/* Progress bar disponibilité */}
                            <div className="mb-6">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Disponibilité</span>
                                <span className="font-semibold text-green-600">
                                  {commune.available_parcels}/{commune.total_parcels} parcelles
                                </span>
                              </div>
                              <Progress value={availabilityPercentage} className="h-3" />
                            </div>

                            {/* Timeline du projet */}
                            <div className="mb-6">
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Statut du Projet
                              </h4>
                              <div className="relative">
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded-full ${
                                    commune.amenagement_status === 'Finalisé' ? 'bg-green-500' :
                                    commune.amenagement_status === 'En cours' ? 'bg-yellow-500' : 'bg-gray-400'
                                  }`}></div>
                                  <div className="ml-3">
                                    <Badge className={
                                      commune.amenagement_status === 'Finalisé' ? 'bg-green-100 text-green-800' :
                                      commune.amenagement_status === 'En cours' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }>
                                      {commune.amenagement_status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Tailles et infrastructure */}
                            <div className="space-y-4 mb-6">
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Tailles disponibles:</h5>
                                <div className="flex flex-wrap gap-2">
                                  {commune.sizes_available.map((size, index) => (
                                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      {size}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Infrastructure incluse:</h5>
                                <div className="grid grid-cols-2 gap-2">
                                  {commune.infrastructure.map((infra, index) => (
                                    <div key={index} className="flex items-center text-xs text-gray-600">
                                      <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                                      {infra}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Processus de sélection */}
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6">
                              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                <Award className="w-4 h-4 mr-2 text-orange-500" />
                                Processus de Sélection
                              </h5>
                              <div className="text-sm text-gray-700 mb-2">
                                <strong>Méthode:</strong> {commune.selection_method}
                              </div>
                              <div className="text-sm text-gray-700">
                                <strong>Date limite:</strong> {new Date(commune.application_deadline).toLocaleDateString('fr-FR')}
                              </div>
                            </div>

                            {/* Documents requis */}
                            <div className="mb-6">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Documents requis:</h5>
                              <div className="space-y-1">
                                {commune.required_documents.map((doc, index) => (
                                  <div key={index} className="flex items-center text-xs text-gray-600">
                                    <FileText className="w-3 h-3 text-blue-500 mr-1" />
                                    {doc}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Contact et actions */}
                            <div className="border-t pt-4">
                              <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-gray-600">
                                <div className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {commune.contact.phone}
                                </div>
                                <div className="flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  Email disponible
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                                  onClick={() => {
                                    // Navigation vers formulaire de demande communale
                                    navigate(`/commune-request/${commune.id}`);
                                  }}
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Faire une Demande
                                </Button>
                                <Button variant="outline" size="icon">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                  <MapPin className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Section d'information sur le processus */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-gray-900">
                      <Shield className="w-5 h-5 mr-2" />
                      Comment ça marche ?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">1. Soumission</h3>
                        <p className="text-sm text-gray-600">Soumettez votre demande avec les documents requis</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">2. Vérification</h3>
                        <p className="text-sm text-gray-600">La commune vérifie votre éligibilité</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Award className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">3. Attribution</h3>
                        <p className="text-sm text-gray-600">Sélection selon la méthode définie</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Home className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="font-semibold mb-2">4. Titre</h3>
                        <p className="text-sm text-gray-600">Réception de votre titre foncier</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Section Communes List */}
            <TabsContent value="communes" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {communes.map((commune) => (
                  <motion.div key={commune.id} whileHover={{ scale: 1.02 }}>
                    <Card className="bg-gradient-to-br from-white to-gray-50 border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-bold text-gray-900">
                            {commune.name}
                          </CardTitle>
                          <Badge variant={commune.status === 'En cours' ? 'default' : commune.status === 'Urgent' ? 'destructive' : 'secondary'}>
                            {commune.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Terrains disponibles:</span>
                            <span className="font-bold text-green-600">{commune.availableParcels}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Progression demandes:</span>
                              <span className="font-medium">{commune.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  commune.progress >= 80 ? 'bg-green-500' : 
                                  commune.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${commune.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="border-t pt-4 mb-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">Contact:</div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Phone className="w-3 h-3 mr-2" />
                                {commune.contact.phone}
                              </div>
                              <div className="flex items-center">
                                <Mail className="w-3 h-3 mr-2" />
                                {commune.contact.email}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-3 h-3 mr-2" />
                                {commune.contact.address}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <Button 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              onClick={() => setSelectedCommune(commune)}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Faire une Demande
                            </Button>
                            <Button variant="outline">
                              <Map className="w-4 h-4 mr-2" />
                              Voir sur Carte
                            </Button>
                          </div>
                        </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Modal for Communal Land Request */}
      <AnimatePresence>
        {selectedCommune && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCommune(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {communalLandRequestForm(selectedCommune)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir Nos Terrains Blockchain
            </h2>
            <p className="text-xl text-gray-600">
              Innovation, sécurité et transparence pour votre investissement immobilier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Database className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">NFT Sécurisé</h3>
              <p className="text-gray-600">Propriété tokenisée sur blockchain pour une sécurité maximale</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Financement Facile</h3>
              <p className="text-gray-600">12 banques partenaires pour votre financement rapide</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Suivi Construction</h3>
              <p className="text-gray-600">Photos et vidéos en temps réel de votre projet</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Landmark className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold mb-2">Terrains Communaux</h3>
              <p className="text-gray-600">Accès facilité aux lotissements des communes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modales pour les nouvelles fonctionnalités */}
      
      {/* Modale de planification de visite */}
      <AnimatePresence>
        {showVisitModal && selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowVisitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Planifier une Visite</h3>
              <p className="text-gray-600 mb-4">{selectedProperty.title}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date souhaitée</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Heure préférée</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir l'heure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9h">9h00 - 10h00</SelectItem>
                      <SelectItem value="10h">10h00 - 11h00</SelectItem>
                      <SelectItem value="14h">14h00 - 15h00</SelectItem>
                      <SelectItem value="15h">15h00 - 16h00</SelectItem>
                      <SelectItem value="16h">16h00 - 17h00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <Input placeholder="+221 XX XXX XX XX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="votre@email.com" />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Confirmer la Visite
                </Button>
                <Button variant="outline" onClick={() => setShowVisitModal(false)}>
                  Annuler
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modale Calculateur ROI */}
      <AnimatePresence>
        {showROIModal && selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowROIModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Calculateur ROI Intelligent</h3>
              <p className="text-gray-600 mb-4">{selectedProperty.title}</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Prix d'achat</label>
                    <Input value={formatPrice(selectedProperty.price)} disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Coût construction (FCFA)</label>
                    <Input placeholder="25 000 000" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Loyer mensuel estimé</label>
                    <Input placeholder="500 000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Durée d'investissement</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Années" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 ans</SelectItem>
                        <SelectItem value="10">10 ans</SelectItem>
                        <SelectItem value="15">15 ans</SelectItem>
                        <SelectItem value="20">20 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">Estimation ROI</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">ROI Annuel:</span>
                      <div className="font-bold text-green-600">+12.5%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Retour investissement:</span>
                      <div className="font-bold text-blue-600">8 ans</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Plus-value estimée:</span>
                      <div className="font-bold text-purple-600">+45%</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Rentabilité locative:</span>
                      <div className="font-bold text-orange-600">8.2%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Calculator className="w-4 h-4 mr-2" />
                  Recevoir Analyse Complète
                </Button>
                <Button variant="outline" onClick={() => setShowROIModal(false)}>
                  Fermer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modale Visite Virtuelle 360° */}
      <AnimatePresence>
        {showVirtualTour && selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
            onClick={() => setShowVirtualTour(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Visite Virtuelle 360°</h3>
                <Button variant="outline" size="sm" onClick={() => setShowVirtualTour(false)}>
                  ✕ Fermer
                </Button>
              </div>
              
              <div className="bg-gray-100 rounded-lg h-full flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-gray-600 mb-2">Visite Virtuelle</h4>
                  <p className="text-gray-500 mb-4">{selectedProperty.title}</p>
                  <p className="text-sm text-gray-400">
                    La visite virtuelle 360° sera bientôt disponible.<br />
                    Contactez-nous pour une visite en direct via drone.
                  </p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Programmer Visite Drone
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modale Vue Réalité Augmentée */}
      <AnimatePresence>
        {showARView && selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
            onClick={() => setShowARView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Vue Réalité Augmentée</h3>
              
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-8 text-center">
                <Camera className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-purple-900 mb-2">AR Experience</h4>
                <p className="text-purple-700 mb-4">
                  Visualisez votre future construction en réalité augmentée directement sur le terrain.
                </p>
                
                <div className="space-y-3">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Télécharger App AR
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Voir Coordonnées GPS
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setShowARView(false)}>
                    Fermer
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernTerrainsBlockchainPage;
