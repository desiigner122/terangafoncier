import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ModernTerrainsBlockchainPage = () => {
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
                          <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir Détails NFT
                          </Button>
                          <Button variant="outline" size="icon">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Communal Lands Tab */}
            <TabsContent value="communal">
              <div className="space-y-8">
                {/* Info Banner */}
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Terrains Communaux Disponibles
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Découvrez les nouveaux lotissements aménagés par les communes partenaires. 
                    Soumettez votre demande directement en ligne.
                  </p>
                </div>

                {/* Communal Lands Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {communalLands.map((commune) => (
                    <motion.div
                      key={commune.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-green-200">
                        <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{commune.commune}</CardTitle>
                            <Badge className="bg-white text-green-600">
                              {commune.available_parcels} disponibles
                            </Badge>
                          </div>
                          <p className="text-green-100">{commune.project}</p>
                        </CardHeader>

                        <CardContent className="p-6">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-sm text-gray-600">Parcelles totales</div>
                              <div className="text-lg font-bold">{commune.total_parcels}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Prix par m²</div>
                              <div className="text-lg font-bold text-green-600">
                                {formatPrice(commune.price_per_m2)}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Statut aménagement</div>
                              <Badge variant={commune.amenagement_status === 'Finalisé' ? 'default' : 'secondary'}>
                                {commune.amenagement_status}
                              </Badge>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">Date limite</div>
                              <div className="text-sm font-medium">{commune.application_deadline}</div>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-1">Tailles disponibles:</div>
                              <div className="flex flex-wrap gap-2">
                                {commune.sizes_available.map((size, index) => (
                                  <Badge key={index} variant="outline">
                                    {size}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-1">Infrastructure:</div>
                              <div className="flex flex-wrap gap-2">
                                {commune.infrastructure.map((infra, index) => (
                                  <Badge key={index} className="bg-blue-100 text-blue-800 text-xs">
                                    {infra}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-1">Méthode de sélection:</div>
                              <div className="text-sm text-gray-600">{commune.selection_method}</div>
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
    </div>
  );
};

export default ModernTerrainsBlockchainPage;
