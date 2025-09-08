import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  Grid,
  List,
  SortAsc,
  SortDesc,
  Home,
  Building2,
  Tractor,
  Store,
  Star,
  TrendingUp,
  FileText,
  CheckCircle,
  X,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TerrainsVendeursPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('price_asc');

  // Données mockées enrichies des terrains avec statut blockchain
  useEffect(() => {
    const mockProperties = [
      {
        id: 1,
        title: "Villa Modern - Terrain 500m² - Dakar Plateau",
        region: "Dakar",
        city: "Dakar",
        area: "Plateau",
        size: 500,
        price: 75000000,
        type: "Résidentiel",
        description: "Terrain de prestige au cœur du Plateau, idéal pour villa moderne. Accès facile, environnement sécurisé.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
        verification_status: "verified",
        blockchain_hash: "0x1a2b3c4d5e6f7890abcdef1234567890",
        notary_validated: true,
        title_deed_number: "TF-DK-2024-001",
        owner: "Amadou Seck",
        owner_type: "Particulier",
        posted_date: "2024-01-15",
        views: 234,
        favorites: 12,
        legal_documents: ["Titre foncier", "Attestation mairie", "Plan cadastral"],
        blockchain_confirmations: 156,
        rating: 4.8,
        features: ["Électricité", "Eau courante", "Égouts", "Route goudronnée"],
        nearby: ["École", "Hôpital", "Marché", "Transport public"]
      },
      {
        id: 2,
        title: "Terrain Commercial 1200m² - Thiès Centre",
        region: "Thiès",
        city: "Thiès",
        area: "Centre-ville",
        size: 1200,
        price: 48000000,
        type: "Commercial",
        description: "Emplacement stratégique pour commerce ou bureaux. Forte fréquentation, potentiel d'investissement élevé.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop",
        verification_status: "pending",
        blockchain_hash: "pending",
        notary_validated: false,
        title_deed_number: "TF-TH-2024-045",
        owner: "Entreprise Sénégal Commerce",
        owner_type: "Professionnel",
        posted_date: "2024-01-20",
        views: 89,
        favorites: 5,
        legal_documents: ["Titre foncier", "Plan cadastral"],
        blockchain_confirmations: 0,
        rating: 4.2,
        features: ["Électricité", "Eau courante", "Parkings"],
        nearby: ["Banque", "Poste", "Gare routière"]
      },
      {
        id: 3,
        title: "Terrain Agricole 2000m² - Saint-Louis",
        region: "Saint-Louis",
        city: "Saint-Louis", 
        area: "Périphérie",
        size: 2000,
        price: 25000000,
        type: "Agricole",
        description: "Terrain fertile avec accès à l'irrigation. Parfait pour agriculture moderne ou élevage.",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop",
        verification_status: "verified",
        blockchain_hash: "0x9876543210fedcba0987654321abcdef",
        notary_validated: true,
        title_deed_number: "TF-SL-2024-078",
        owner: "Coopérative Agricole du Nord",
        owner_type: "Coopérative",
        posted_date: "2024-01-10",
        views: 156,
        favorites: 8,
        legal_documents: ["Titre foncier", "Attestation mairie", "Plan cadastral", "Étude de sol"],
        blockchain_confirmations: 89,
        rating: 4.5,
        features: ["Irrigation", "Accès route", "Sol fertile"],
        nearby: ["Marché de gros", "Entrepôts", "Transport"]
      },
      {
        id: 4,
        title: "Terrain Résidentiel 800m² - Mbour Plage",
        region: "Thiès",
        city: "Mbour",
        area: "Zone côtière",
        size: 800,
        price: 65000000,
        type: "Résidentiel",
        description: "Terrain face à l'océan, zone touristique en développement. Idéal pour résidence secondaire.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
        verification_status: "verified",
        blockchain_hash: "0xabcdef1234567890fedcba0987654321",
        notary_validated: true,
        title_deed_number: "TF-MB-2024-032",
        owner: "Fatou Diallo",
        owner_type: "Particulier",
        posted_date: "2024-01-25",
        views: 312,
        favorites: 18,
        legal_documents: ["Titre foncier", "Attestation mairie", "Plan cadastral"],
        blockchain_confirmations: 145,
        rating: 4.9,
        features: ["Vue mer", "Électricité", "Eau courante", "Sécurité"],
        nearby: ["Plage", "Restaurants", "Hôtels", "Aéroport"]
      },
      {
        id: 5,
        title: "Terrain Industriel 5000m² - Rufisque",
        region: "Dakar",
        city: "Rufisque",
        area: "Zone industrielle",
        size: 5000,
        price: 120000000,
        type: "Industriel",
        description: "Grande parcelle pour activités industrielles. Accès direct à l'autoroute et au port.",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop",
        verification_status: "verified",
        blockchain_hash: "0x5555666677778888aaabbbcccddd9999",
        notary_validated: true,
        title_deed_number: "TF-RF-2024-067",
        owner: "Société Industrielle Moderne",
        owner_type: "Société",
        posted_date: "2024-01-30",
        views: 78,
        favorites: 3,
        legal_documents: ["Titre foncier", "Permis de construire", "Étude d'impact"],
        blockchain_confirmations: 203,
        rating: 4.3,
        features: ["Accès autoroute", "Électricité haute tension", "Sécurité"],
        nearby: ["Port", "Aéroport", "Douanes", "Banques"]
      }
    ];

    // Simulation du chargement
    setTimeout(() => {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrage et tri
  useEffect(() => {
    let filtered = properties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRegion = selectedRegion === 'all' || property.region === selectedRegion;
      const matchesType = selectedType === 'all' || property.type === selectedType;
      const matchesVerification = verificationFilter === 'all' || property.verification_status === verificationFilter;
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const price = property.price;
        switch(priceRange) {
          case 'low': matchesPrice = price < 30000000; break;
          case 'medium': matchesPrice = price >= 30000000 && price < 80000000; break;
          case 'high': matchesPrice = price >= 80000000; break;
        }
      }
      
      return matchesSearch && matchesRegion && matchesType && matchesVerification && matchesPrice;
    });

    // Tri
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'date_desc': return new Date(b.posted_date) - new Date(a.posted_date);
        case 'size_desc': return b.size - a.size;
        case 'views_desc': return b.views - a.views;
        case 'rating_desc': return b.rating - a.rating;
        default: return 0;
      }
    });

    setFilteredProperties(filtered);
  }, [properties, searchTerm, selectedRegion, selectedType, priceRange, verificationFilter, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Résidentiel': return <Home className="w-4 h-4" />;
      case 'Commercial': return <Store className="w-4 h-4" />;
      case 'Industriel': return <Building2 className="w-4 h-4" />;
      case 'Agricole': return <Tractor className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getVerificationBadge = (status) => {
    switch(status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Vérifié</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En cours</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200"><AlertTriangle className="w-3 h-3 mr-1" />Non vérifié</Badge>;
    }
  };

  const PropertyCard = ({ property }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          {getVerificationBadge(property.verification_status)}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur-sm">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur-sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge className="bg-blue-600 text-white">
            {getTypeIcon(property.type)}
            <span className="ml-1">{property.type}</span>
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{property.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{property.city}, {property.area}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{property.size}m²</div>
            <div className="text-xs text-gray-500">Surface</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{property.views}</div>
            <div className="text-xs text-gray-500">Vues</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {property.features.slice(0, 3).map((feature, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {feature}
            </Badge>
          ))}
          {property.features.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.features.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(property.price / property.size).toLocaleString()} FCFA/m²
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{property.owner}</div>
            <div className="text-xs text-gray-500">{property.owner_type}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link to={`/terrains/${property.id}`}>
              <Eye className="w-4 h-4 mr-2" />
              Voir détails
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Helmet>
        <title>Terrains de Vendeurs - Marché Privé | Teranga Foncier</title>
        <meta name="description" content="Découvrez notre sélection de terrains mis en vente par des particuliers et professionnels. Tous types : résidentiel, commercial, industriel, agricole." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terrains de <span className="text-yellow-400">Vendeurs</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Découvrez {filteredProperties.length} terrains de qualité mis en vente par des particuliers et professionnels
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-4 h-4" />
                <span>Vérification Blockchain</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Verified className="w-4 h-4" />
                <span>Titres Authentifiés</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Lock className="w-4 h-4" />
                <span>Transactions Sécurisées</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par ville, type, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedRegion === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion('all')}
              >
                Toutes régions
              </Button>
              <Button
                variant={selectedRegion === 'Dakar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion('Dakar')}
              >
                Dakar
              </Button>
              <Button
                variant={selectedRegion === 'Thiès' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion('Thiès')}
              >
                Thiès
              </Button>
            </div>

            {/* View Mode & Sort */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="date_desc">Plus récents</option>
                <option value="size_desc">Plus grands</option>
                <option value="views_desc">Plus populaires</option>
                <option value="rating_desc">Mieux notés</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProperties.length} terrain{filteredProperties.length > 1 ? 's' : ''} trouvé{filteredProperties.length > 1 ? 's' : ''}
            </h2>
            <Button
              variant="outline"
              onClick={() => setFilterOpen(!filterOpen)}
              className="lg:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {filteredProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 mx-auto mb-8 text-gray-300">
                <Search className="w-full h-full" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                Aucun terrain trouvé
              </h3>
              <p className="text-gray-500 mb-8">
                Essayez de modifier vos critères de recherche
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
                setSelectedType('all');
                setPriceRange('all');
                setVerificationFilter('all');
              }}>
                Réinitialiser les filtres
              </Button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              <AnimatePresence>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6">
              Vous voulez vendre votre terrain ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez notre plateforme et bénéficiez de la technologie blockchain pour sécuriser vos transactions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                <Link to="/sell-property">
                  <Building2 className="w-5 h-5 mr-2" />
                  Vendre mon terrain
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                <Link to="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  Nous contacter
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TerrainsVendeursPage;
