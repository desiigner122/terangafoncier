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
  Calculator,
  Send,
  Info,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ModernTerrainsBlockchainPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [compareList, setCompareList] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeTab, setActiveTab] = useState('private');
  const [selectedCommune, setSelectedCommune] = useState(null);

  // Sample data for blockchain-based land parcels
  const blockchainParcels = [
    {
      id: 1,
      title: "Terrain Premium NFT - Zone Résidentielle",
      location: "Almadies, Dakar",
      price: 45000000,
      surface: 500,
      nftId: "TF-001-2024",
      verified: true,
      blockchain: "Polygon",
      images: ["/api/placeholder/400/300"],
      description: "Terrain de 500m² dans la prestigieuse zone des Almadies. Tokenisé en NFT pour une sécurité maximale.",
      features: ["Titre foncier sécurisé", "NFT transférable", "Financement bancaire", "Localisation premium"],
      bankPartners: ["CBAO", "Société Générale", "UBA"],
      constructionPhotos: [
        { date: "2024-01-15", photos: ["/api/placeholder/300/200"] },
        { date: "2024-02-15", photos: ["/api/placeholder/300/200"] }
      ],
      developmentStage: "Viabilisation en cours",
      expectedDelivery: "Q3 2024"
    },
    {
      id: 2,
      title: "Parcelle Blockchain - Zone Commerciale",
      location: "Plateau, Dakar",
      price: 75000000,
      surface: 800,
      nftId: "TF-002-2024",
      verified: true,
      blockchain: "Ethereum",
      images: ["/api/placeholder/400/300"],
      description: "Terrain commercial de 800m² au cœur du plateau. Parfait pour investissement immobilier.",
      features: ["Zone commerciale", "Forte rentabilité", "Transport facile", "Infrastructures disponibles"],
      bankPartners: ["Ecobank", "BICIS", "BHS"],
      constructionPhotos: [],
      developmentStage: "Prêt à construire",
      expectedDelivery: "Immédiat"
    },
    {
      id: 3,
      title: "Terrain NFT Eco-Responsable",
      location: "Saly, Mbour",
      price: 25000000,
      surface: 1000,
      nftId: "TF-003-2024",
      verified: true,
      blockchain: "Polygon",
      images: ["/api/placeholder/400/300"],
      description: "Grand terrain de 1000m² dans un écoquartier moderne avec toutes les commodités.",
      features: ["Écoquartier", "Énergies renouvelables", "Espaces verts", "Communauté résidentielle"],
      bankPartners: ["CBAO", "Coris Bank", "BRS"],
      constructionPhotos: [
        { date: "2024-01-01", photos: ["/api/placeholder/300/200"] },
        { date: "2024-01-30", photos: ["/api/placeholder/300/200"] },
        { date: "2024-02-28", photos: ["/api/placeholder/300/200"] }
      ],
      developmentStage: "Construction infrastructure",
      expectedDelivery: "Q4 2024"
    }
  ];

  // Données des communes avec terrains communaux
  const communes = [
    {
      id: 1,
      name: "Guédiawaye",
      region: "Dakar",
      availableParcels: 45,
      status: "En cours",
      progress: 75,
      contact: {
        phone: "+221 33 834 56 78",
        email: "contact@guediawaye.sn",
        address: "Avenue Bourguiba, Guédiawaye"
      },
      description: "Lotissement moderne de 150 parcelles avec viabilisation complète",
      priceRange: "8M - 15M FCFA",
      allocationMethod: "Tirage au sort transparent",
      requirements: ["Résidence dans la commune", "Revenus justifiés", "Première acquisition"],
      timeline: "Dépôt dossiers: 30 jours, Attribution: 60 jours"
    },
    {
      id: 2,
      name: "Thiès",
      region: "Thiès",
      availableParcels: 120,
      status: "Urgent",
      progress: 45,
      contact: {
        phone: "+221 33 951 12 34",
        email: "terrains@thies.sn",
        address: "Place de l'Indépendance, Thiès"
      },
      description: "Nouveau programme de 200 parcelles en zone périurbaine",
      priceRange: "5M - 12M FCFA",
      allocationMethod: "Critères sociaux prioritaires",
      requirements: ["Famille nombreuse prioritaire", "Revenus modestes", "Engagement construction"],
      timeline: "Traitement accéléré: 15 jours"
    },
    {
      id: 3,
      name: "Mbour",
      region: "Thiès",
      availableParcels: 85,
      status: "Disponible",
      progress: 90,
      contact: {
        phone: "+221 33 957 89 01",
        email: "attribution@mbour.sn",
        address: "Rue du Port, Mbour"
      },
      description: "Zone résidentielle proche des plages avec équipements",
      priceRange: "10M - 20M FCFA",
      allocationMethod: "Premier arrivé, premier servi",
      requirements: ["Apport initial 30%", "Projet architectural", "Délai construction 2 ans"],
      timeline: "Attribution immédiate sous 7 jours"
    }
  ];

  const handleCompare = (parcel) => {
    if (compareList.find(p => p.id === parcel.id)) {
      setCompareList(compareList.filter(p => p.id !== parcel.id));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, parcel]);
    }
  };

  const formatPrice = (price) => {
    return (price / 1000000).toFixed(0) + 'M FCFA';
  };

  const handleParcelClick = (parcel) => {
    navigate(`/blockchain-parcel/${parcel.id}`);
  };

  // Communal Land Request Form Component
  const communalLandRequestForm = (commune) => {
    return (
      <div className="space-y-6">
        <div className="text-center border-b pb-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Demande de terrain communal
          </h3>
          <p className="text-gray-600 mt-2">Commune de {commune.name}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <Input placeholder="Votre nom complet" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone *
              </label>
              <Input placeholder="+221 XX XXX XX XX" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <Input type="email" placeholder="votre.email@exemple.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Surface souhaitée (m²) *
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la surface" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="200">200 m²</SelectItem>
                <SelectItem value="300">300 m²</SelectItem>
                <SelectItem value="400">400 m²</SelectItem>
                <SelectItem value="500">500 m²</SelectItem>
                <SelectItem value="other">Autre (à préciser)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profession *
            </label>
            <Input placeholder="Votre profession" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Revenus mensuels *
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre tranche de revenus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-200k">0 - 200 000 FCFA</SelectItem>
                <SelectItem value="200k-500k">200 000 - 500 000 FCFA</SelectItem>
                <SelectItem value="500k-1m">500 000 - 1 000 000 FCFA</SelectItem>
                <SelectItem value="1m+">Plus de 1 000 000 FCFA</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Situation familiale *
            </label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Votre situation familiale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celibataire">Célibataire</SelectItem>
                <SelectItem value="marie">Marié(e)</SelectItem>
                <SelectItem value="divorce">Divorcé(e)</SelectItem>
                <SelectItem value="veuf">Veuf/Veuve</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'enfants à charge
            </label>
            <Input type="number" placeholder="0" min="0" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivations pour cette demande *
            </label>
            <textarea 
              className="w-full border rounded-lg p-3 h-24 resize-none"
              placeholder="Expliquez vos motivations pour cette demande de terrain..."
            />
          </div>

          <div className="border rounded-lg p-4 bg-yellow-50">
            <h4 className="font-semibold text-gray-900 mb-2">Documents requis:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Copie de la carte d'identité nationale</li>
              <li>• Justificatifs de revenus (3 derniers mois)</li>
              <li>• Certificat de résidence dans la commune</li>
              <li>• Acte de naissance</li>
              <li>• Certificat de célibat ou de mariage</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => setSelectedCommune(null)}
          >
            Annuler
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4 mr-2" />
            Soumettre la demande
          </Button>
        </div>
      </div>
    );
  };

  if (showInfoModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold">Terrains Blockchain NFT</h3>
            <Button variant="ghost" onClick={() => setShowInfoModal(false)}>×</Button>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600">
              Découvrez notre révolutionnaire plateforme de terrains tokenisés en NFT, 
              offrant une sécurité inégalée grâce à la technologie blockchain.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <Database className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-semibold">Sécurité Blockchain</h4>
                <p className="text-sm text-gray-600">Propriété sécurisée et vérifiable sur blockchain</p>
              </div>
              <div className="border rounded-lg p-4">
                <CreditCard className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-semibold">Financement Facile</h4>
                <p className="text-sm text-gray-600">12 banques partenaires pour votre projet</p>
              </div>
            </div>
          </div>
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
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Terrains <span className="text-yellow-400">Blockchain</span> NFT
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              La première plateforme sénégalaise de terrains tokenisés avec financement bancaire intégré
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Coins className="w-5 h-5 mr-2" />
                Explorer les NFT Terrains
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                <Info className="w-5 h-5 mr-2" />
                Comment ça marche
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Rechercher un terrain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:col-span-2"
              />
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Localisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dakar">Dakar</SelectItem>
                  <SelectItem value="thies">Thiès</SelectItem>
                  <SelectItem value="mbour">Mbour</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price_asc">Prix croissant</SelectItem>
                  <SelectItem value="price_desc">Prix décroissant</SelectItem>
                  <SelectItem value="surface_asc">Surface croissante</SelectItem>
                  <SelectItem value="surface_desc">Surface décroissante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Section */}
      {compareList.length > 0 && (
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                <span>{compareList.length} terrain(s) sélectionné(s) pour comparaison</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-20">
                  Comparer
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
              <TabsTrigger value="communes" className="text-lg py-3">
                <Landmark className="w-5 h-5 mr-2" />
                Terrains Communaux
              </TabsTrigger>
            </TabsList>

            {/* Private Lands NFT Tab */}
            <TabsContent value="private" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {blockchainParcels.map((parcel) => (
                  <motion.div
                    key={parcel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="relative">
                        <img 
                          src={parcel.images[0]} 
                          alt={parcel.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-blue-600 text-white">
                            <Blocks className="w-3 h-3 mr-1" />
                            NFT {parcel.nftId}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-white bg-opacity-90 hover:bg-white"
                            onClick={() => handleCompare(parcel)}
                          >
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="bg-white bg-opacity-90 hover:bg-white"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge variant="outline" className="bg-white">
                            {parcel.blockchain}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader>
                        <CardTitle className="flex items-start justify-between">
                          <h3 className="text-lg font-bold">{parcel.title}</h3>
                          {parcel.verified && (
                            <Verified className="w-5 h-5 text-green-500 flex-shrink-0" />
                          )}
                        </CardTitle>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {parcel.location}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-blue-600">
                            {formatPrice(parcel.price)}
                          </span>
                          <span className="text-gray-600">{parcel.surface} m²</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">État:</span>
                            <span className="font-medium">{parcel.developmentStage}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Livraison:</span>
                            <span className="font-medium">{parcel.expectedDelivery}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-700">Banques partenaires:</div>
                          <div className="flex flex-wrap gap-1">
                            {parcel.bankPartners.map((bank, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {bank}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            className="flex-1"
                            onClick={() => handleParcelClick(parcel)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir les détails
                          </Button>
                          <Button variant="outline" size="icon">
                            <Calculator className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Communal Lands Tab */}
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez la Révolution Foncière Blockchain
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sécurisez vos investissements avec la technologie blockchain et NFT
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => setShowInfoModal(true)}
            >
              <Info className="w-5 h-5 mr-2" />
              En savoir plus
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => setActiveTab('private')}
            >
              <Search className="w-5 h-5 mr-2" />
              Explorer les terrains
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernTerrainsBlockchainPage;
