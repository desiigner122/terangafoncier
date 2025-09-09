import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Eye, 
  Heart,
  Star,
  TrendingUp,
  Shield,
  Banknote,
  Car,
  Wifi,
  Zap,
  Droplets,
  GraduationCap,
  Bus,
  Navigation,
  ExternalLink,
  User
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate, Link } from 'react-router-dom';

const regions = [
  "Toutes les régions", "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Louga", 
  "Fatick", "Kaolack", "Kaffrine", "Tambacounda", "Kédougou", "Kolda", 
  "Ziguinchor", "Sédhiou", "Matam"
];

const cities = {
  "Dakar": ["Toutes", "Dakar", "Pikine", "Guédiawaye", "Rufisque"],
  "Thiès": ["Toutes", "Thiès", "Mbour", "Tivaouane"],
  "Saint-Louis": ["Toutes", "Saint-Louis", "Dagana", "Podor"],
  "Diourbel": ["Toutes", "Diourbel", "Mbacké", "Bambey"],
  "Louga": ["Toutes", "Louga", "Linguère", "Kébémer"],
  "Fatick": ["Toutes", "Fatick", "Foundiougne", "Gossas"],
  "Kaolack": ["Toutes", "Kaolack", "Nioro du Rip", "Guinguinéo"],
  "Kaffrine": ["Toutes", "Kaffrine", "Birkelane", "Koungheul", "Malem-Hodar"],
  "Tambacounda": ["Toutes", "Tambacounda", "Bakel", "Goudiry", "Koumpentoum"],
  "Kédougou": ["Toutes", "Kédougou", "Saraya", "Salémata"],
  "Kolda": ["Toutes", "Kolda", "Vélingara", "Médina Yoro Foulah"],
  "Ziguinchor": ["Toutes", "Ziguinchor", "Oussouye", "Bignona"],
  "Sédhiou": ["Toutes", "Sédhiou", "Bounkiling", "Goudomp"],
  "Matam": ["Toutes", "Matam", "Kanel", "Ranérou"]
};

const ParcellesVendeursPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Toutes les régions');
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedSeller, setSelectedSeller] = useState('Tous');
  const [selectedFinancing, setSelectedFinancing] = useState('Tous');
  const [priceRange, setPriceRange] = useState('Tous');
  const [utilities, setUtilities] = useState({
    water: false,
    electricity: false,
    internet: false
  });
  const [access, setAccess] = useState({
    pavedRoad: false,
    transport: false,
    schools: false
  });
  const [features, setFeatures] = useState({
    seaView: false,
    gated: false,
    parking: false
  });

  // Données de parcelles avec images réelles et vendeurs variés
  const parcelles = [
    {
      id: 1,
      title: "Terrain Résidentiel Premium - Almadies",
      location: "Almadies, Dakar",
      region: "Dakar",
      city: "Dakar",
      price: "85 000 000",
      surface: "500",
      type: "Résidentiel",
      seller: "Particulier",
      sellerName: "Amadou FALL",
      sellerId: "seller-001",
      sellerType: "vendeur-particulier",
      financing: ["Bancaire", "Échelonné"],
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
      features: ["Vue mer", "Résidence fermée", "Parking"],
      utilities: ["Eau", "Électricité", "Internet"],
      access: ["Route pavée", "Transport", "Écoles"],
      rating: 4.8,
      views: 234,
      isFavorite: false,
      isVerified: true,
      description: "Magnifique terrain avec vue imprenable sur l'océan"
    },
    {
      id: 2,
      title: "Terrain Agricole - Thiès",
      location: "Thiès, Thiès",
      region: "Thiès",
      city: "Thiès",
      price: "15 000 000",
      surface: "2000",
      type: "Agricole",
      seller: "Promoteur Pro",
      sellerName: "SENEGAL AGRO DEVELOPPEMENT",
      sellerId: "promoter-001",
      sellerType: "promoteur",
      financing: ["Crypto", "Bancaire"],
      image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1000",
      features: ["Parking"],
      utilities: ["Eau", "Électricité"],
      access: ["Route pavée", "Transport"],
      rating: 4.5,
      views: 156,
      isFavorite: true,
      isVerified: true,
      description: "Terrain agricole fertile, idéal pour l'agriculture moderne"
    },
    {
      id: 3,
      title: "Terrain Commercial - Plateau",
      location: "Plateau, Dakar",
      region: "Dakar",
      city: "Dakar",
      price: "120 000 000",
      surface: "300",
      type: "Commercial",
      seller: "Agence Pro",
      sellerName: "IMMOBILIER DAKAR PREMIUM",
      sellerId: "agent-001", 
      sellerType: "agent",
      financing: ["Bancaire", "Échelonné", "Crypto"],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
      features: ["Résidence fermée", "Parking"],
      utilities: ["Eau", "Électricité", "Internet"],
      access: ["Route pavée", "Transport", "Écoles"],
      rating: 4.9,
      views: 445,
      isFavorite: false,
      isVerified: true,
      description: "Emplacement stratégique au cœur des affaires"
    },
    {
      id: 4,
      title: "Terrain Mixte - Mbour",
      location: "Mbour, Thiès",
      region: "Thiès",
      city: "Mbour",
      price: "45 000 000",
      surface: "800",
      type: "Mixte",
      seller: "Particulier",
      sellerName: "Fatou SECK",
      sellerId: "seller-002",
      sellerType: "vendeur-particulier",
      financing: ["Échelonné"],
      image: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=1000",
      features: ["Vue mer"],
      utilities: ["Eau", "Électricité"],
      access: ["Route pavée", "Transport"],
      rating: 4.3,
      views: 178,
      isFavorite: false,
      isVerified: false,
      description: "Terrain polyvalent proche de la côte"
    },
    {
      id: 5,
      title: "Terrain Industriel - Diamniadio",
      location: "Diamniadio, Dakar",
      region: "Dakar",
      city: "Rufisque",
      price: "200 000 000",
      surface: "5000",
      type: "Industriel",
      seller: "Développeur Pro",
      sellerName: "SÉNÉGAL INDUSTRIAL PARKS",
      sellerId: "promoter-003",
      sellerType: "promoteur",
      financing: ["Bancaire", "Crypto"],
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000",
      features: ["Parking"],
      utilities: ["Eau", "Électricité", "Internet"],
      access: ["Route pavée", "Transport"],
      rating: 4.7,
      views: 267,
      isFavorite: true,
      isVerified: true,
      description: "Zone industrielle moderne avec toutes commodités"
    },
    {
      id: 6,
      title: "Terrain Résidentiel - Saint-Louis",
      location: "Saint-Louis, Saint-Louis",
      region: "Saint-Louis",
      city: "Saint-Louis",
      price: "35 000 000",
      surface: "600",
      type: "Résidentiel",
      seller: "Particulier",
      sellerName: "Moussa DIAGNE",
      sellerId: "seller-003",
      sellerType: "vendeur-particulier",
      financing: ["Bancaire", "Échelonné"],
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1000",
      features: ["Résidence fermée"],
      utilities: ["Eau", "Électricité"],
      access: ["Route pavée", "Écoles"],
      rating: 4.4,
      views: 189,
      isFavorite: false,
      isVerified: true,
      description: "Terrain dans la ville historique de Saint-Louis"
    },
    {
      id: 7,
      title: "Lotissement de Luxe - Saly",
      location: "Saly, Thiès",
      region: "Thiès",
      city: "Mbour",
      price: "75 000 000",
      surface: "400",
      type: "Résidentiel",
      seller: "Promoteur Pro",
      sellerName: "SALY LUXURY DEVELOPMENT",
      sellerId: "promoter-004",
      sellerType: "promoteur",
      financing: ["Bancaire", "Échelonné", "Crypto"],
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000",
      features: ["Vue mer", "Résidence fermée", "Parking"],
      utilities: ["Eau", "Électricité", "Internet"],
      access: ["Route pavée", "Transport", "Écoles"],
      rating: 4.6,
      views: 312,
      isFavorite: false,
      isVerified: true,
      description: "Lotissement haut de gamme en bord de mer"
    },
    {
      id: 8,
      title: "Terrain Commercial - Kaolack",
      location: "Kaolack, Kaolack",
      region: "Kaolack",
      city: "Kaolack",
      price: "28 000 000",
      surface: "250",
      type: "Commercial",
      seller: "Investisseur Pro",
      sellerName: "KAOLACK BUSINESS CENTER",
      sellerId: "investor-001",
      sellerType: "investisseur",
      financing: ["Bancaire", "Échelonné"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000",
      features: ["Parking"],
      utilities: ["Eau", "Électricité", "Internet"],
      access: ["Route pavée", "Transport"],
      rating: 4.2,
      views: 145,
      isFavorite: false,
      isVerified: true,
      description: "Terrain commercial stratégique en centre-ville"
    },
    // Ajout de parcelles communales
    {
      id: 9,
      title: "Lotissement Social - Municipalité de Dakar",
      location: "Guédiawaye, Dakar",
      region: "Dakar",
      city: "Guédiawaye",
      price: "12 000 000",
      surface: "200",
      type: "Résidentiel",
      seller: "Municipalité",
      sellerName: "Mairie de Dakar",
      sellerId: "municipality-001",
      sellerType: "mairie",
      financing: ["Bancaire", "Échelonné"],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
      features: ["Prix social", "Titre foncier"],
      utilities: ["Eau", "Électricité"],
      access: ["Route pavée", "Transport", "Écoles"],
      rating: 4.1,
      views: 89,
      isFavorite: false,
      isVerified: true,
      description: "Programme de logement social municipal"
    },
    {
      id: 10,
      title: "Zone d'Activité Économique - Thiès",
      location: "Thiès, Thiès",
      region: "Thiès",
      city: "Thiès",
      price: "25 000 000",
      surface: "1000",
      type: "Commercial",
      seller: "Municipalité",
      sellerName: "Mairie de Thiès",
      sellerId: "municipality-002",
      sellerType: "mairie",
      financing: ["Bancaire"],
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000",
      features: ["Zone économique", "Infrastructures"],
      utilities: ["Eau", "Électricité", "Internet"],
      access: ["Route pavée", "Transport"],
      rating: 4.3,
      views: 156,
      isFavorite: false,
      isVerified: true,
      description: "Zone dédiée aux activités économiques municipales"
    }
  ];

  // Filtrage des parcelles
  const filteredParcelles = useMemo(() => {
    return parcelles.filter(parcelle => {
      const matchesSearch = parcelle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           parcelle.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === 'Toutes les régions' || parcelle.region === selectedRegion;
      const matchesCity = selectedCity === 'Toutes' || parcelle.city === selectedCity;
      const matchesType = selectedType === 'Tous' || parcelle.type === selectedType;
      const matchesSeller = selectedSeller === 'Tous' || parcelle.seller === selectedSeller;
      const matchesFinancing = selectedFinancing === 'Tous' || 
                              parcelle.financing.some(f => f === selectedFinancing);

      // Filtrage par commodités
      const matchesUtilities = Object.entries(utilities).every(([key, checked]) => {
        if (!checked) return true;
        const utilityMap = { water: 'Eau', electricity: 'Électricité', internet: 'Internet' };
        return parcelle.utilities.includes(utilityMap[key]);
      });

      // Filtrage par accès
      const matchesAccess = Object.entries(access).every(([key, checked]) => {
        if (!checked) return true;
        const accessMap = { pavedRoad: 'Route pavée', transport: 'Transport', schools: 'Écoles' };
        return parcelle.access.includes(accessMap[key]);
      });

      // Filtrage par caractéristiques
      const matchesFeatures = Object.entries(features).every(([key, checked]) => {
        if (!checked) return true;
        const featureMap = { seaView: 'Vue mer', gated: 'Résidence fermée', parking: 'Parking' };
        return parcelle.features.includes(featureMap[key]);
      });

      return matchesSearch && matchesRegion && matchesCity && matchesType && matchesSeller &&
             matchesFinancing && matchesUtilities && matchesAccess && matchesFeatures;
    });
  }, [searchTerm, selectedRegion, selectedCity, selectedType, selectedSeller, selectedFinancing, utilities, access, features]);

  const availableCities = selectedRegion === 'Toutes les régions' 
    ? ["Toutes"] 
    : cities[selectedRegion] || ["Toutes"];

  const handleParcelleClick = (id) => {
    navigate(`/parcelle/${id}`);
  };

  const toggleUtility = (utility) => {
    setUtilities(prev => ({ ...prev, [utility]: !prev[utility] }));
  };

  const toggleAccess = (accessType) => {
    setAccess(prev => ({ ...prev, [accessType]: !prev[accessType] }));
  };

  const toggleFeature = (feature) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRegion('Toutes les régions');
    setSelectedCity('Toutes');
    setSelectedType('Tous');
    setSelectedSeller('Tous');
    setSelectedFinancing('Tous');
    setPriceRange('Tous');
    setUtilities({ water: false, electricity: false, internet: false });
    setAccess({ pavedRoad: false, transport: false, schools: false });
    setFeatures({ seaView: false, gated: false, parking: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Parcelles de <span className="text-yellow-300">Vendeurs</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Découvrez les meilleures opportunités foncières proposées par nos vendeurs certifiés
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Shield className="w-4 h-4 mr-1" />
                Vendeurs Vérifiés
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <TrendingUp className="w-4 h-4 mr-1" />
                Meilleurs Prix
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Star className="w-4 h-4 mr-1" />
                Qualité Certifiée
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Filter className="w-6 h-6 mr-2 text-blue-600" />
              Filtres de Recherche
            </h2>
            <Button onClick={resetFilters} variant="outline" size="sm">
              Réinitialiser
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par titre ou localisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type de terrain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous les types</SelectItem>
                <SelectItem value="Résidentiel">Résidentiel</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Industriel">Industriel</SelectItem>
                <SelectItem value="Agricole">Agricole</SelectItem>
                <SelectItem value="Mixte">Mixte</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeller} onValueChange={setSelectedSeller}>
              <SelectTrigger>
                <SelectValue placeholder="Type de vendeur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous vendeurs</SelectItem>
                <SelectItem value="Particulier">Particuliers</SelectItem>
                <SelectItem value="Promoteur Pro">Promoteurs Pro</SelectItem>
                <SelectItem value="Agence Pro">Agences Pro</SelectItem>
                <SelectItem value="Développeur Pro">Développeurs Pro</SelectItem>
                <SelectItem value="Investisseur Pro">Investisseurs Pro</SelectItem>
                <SelectItem value="Municipalité">Municipalités</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedFinancing} onValueChange={setSelectedFinancing}>
              <SelectTrigger>
                <SelectValue placeholder="Financement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tous">Tous</SelectItem>
                <SelectItem value="Bancaire">Financement bancaire</SelectItem>
                <SelectItem value="Échelonné">Paiement échelonné</SelectItem>
                <SelectItem value="Crypto">Crypto-monnaie</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Commodités */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Commodités
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="water" 
                    checked={utilities.water}
                    onCheckedChange={() => toggleUtility('water')}
                  />
                  <label htmlFor="water" className="text-sm flex items-center">
                    <Droplets className="w-4 h-4 mr-1 text-blue-500" />
                    Eau courante
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="electricity" 
                    checked={utilities.electricity}
                    onCheckedChange={() => toggleUtility('electricity')}
                  />
                  <label htmlFor="electricity" className="text-sm flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                    Électricité
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="internet" 
                    checked={utilities.internet}
                    onCheckedChange={() => toggleUtility('internet')}
                  />
                  <label htmlFor="internet" className="text-sm flex items-center">
                    <Wifi className="w-4 h-4 mr-1 text-green-500" />
                    Internet
                  </label>
                </div>
              </div>
            </div>

            {/* Accès */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Navigation className="w-4 h-4 mr-2" />
                Accès
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pavedRoad" 
                    checked={access.pavedRoad}
                    onCheckedChange={() => toggleAccess('pavedRoad')}
                  />
                  <label htmlFor="pavedRoad" className="text-sm flex items-center">
                    <Navigation className="w-4 h-4 mr-1 text-gray-600" />
                    Route pavée
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="transport" 
                    checked={access.transport}
                    onCheckedChange={() => toggleAccess('transport')}
                  />
                  <label htmlFor="transport" className="text-sm flex items-center">
                    <Bus className="w-4 h-4 mr-1 text-blue-600" />
                    Transport public
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="schools" 
                    checked={access.schools}
                    onCheckedChange={() => toggleAccess('schools')}
                  />
                  <label htmlFor="schools" className="text-sm flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1 text-purple-600" />
                    Écoles à proximité
                  </label>
                </div>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Caractéristiques
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="seaView" 
                    checked={features.seaView}
                    onCheckedChange={() => toggleFeature('seaView')}
                  />
                  <label htmlFor="seaView" className="text-sm">
                    Vue sur mer
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="gated" 
                    checked={features.gated}
                    onCheckedChange={() => toggleFeature('gated')}
                  />
                  <label htmlFor="gated" className="text-sm">
                    Résidence fermée
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="parking" 
                    checked={features.parking}
                    onCheckedChange={() => toggleFeature('parking')}
                  />
                  <label htmlFor="parking" className="text-sm flex items-center">
                    <Car className="w-4 h-4 mr-1 text-gray-600" />
                    Parking
                  </label>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {filteredParcelles.length} terrain(s) trouvé(s)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParcelles.map((parcelle, index) => (
              <motion.div
                key={parcelle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative">
                    <img 
                      src={parcelle.image}
                      alt={parcelle.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {parcelle.isVerified && (
                        <Badge className="bg-green-500 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Vérifié
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-blue-500 text-white">
                        {parcelle.type}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`rounded-full p-2 ${parcelle.isFavorite ? 'text-red-500' : 'text-white'}`}
                      >
                        <Heart className={`w-4 h-4 ${parcelle.isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {parcelle.title}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{parcelle.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{parcelle.location}</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Surface:</span>
                        <span className="font-medium">{parcelle.surface} m²</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Vendeur:</span>
                        <span className="font-medium">{parcelle.sellerName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium text-blue-600">{parcelle.seller}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {parcelle.financing.map((method, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          <Banknote className="w-3 h-3 mr-1" />
                          {method}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {parseInt(parcelle.price).toLocaleString()} FCFA
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.round(parseInt(parcelle.price) / parseInt(parcelle.surface)).toLocaleString()} FCFA/m²
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">{parcelle.views}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                      {/* Bouton Voir le profil du vendeur */}
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          const profilePath = parcelle.sellerType === 'vendeur-particulier' 
                            ? `/seller/${parcelle.sellerId}`
                            : `/${parcelle.sellerType}/${parcelle.sellerId}`;
                          navigate(profilePath);
                        }}
                      >
                        <User className="w-4 h-4" />
                        Voir le profil
                      </Button>

                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/parcelle/${parcelle.id}`);
                        }}
                      >
                        Voir les détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredParcelles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Aucun terrain trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ParcellesVendeursPage;
