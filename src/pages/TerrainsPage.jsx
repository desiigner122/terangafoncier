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
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TerrainsPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Données mockées des terrains avec statut blockchain
  useEffect(() => {
    const mockProperties = [
      {
        id: 1,
        title: "Terrain de 500m² - Dakar Plateau",
        region: "Dakar",
        city: "Dakar",
        area: "Plateau",
        size: 500,
        price: 75000000,
        type: "Résidentiel",
        description: "Terrain bien situé au cœur du Plateau, parfait pour un projet résidentiel de standing.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
        verification_status: "verified",
        blockchain_hash: "0x1a2b3c4d5e6f7890abcdef1234567890",
        notary_validated: true,
        title_deed_number: "TF-DK-2024-001",
        owner: "Propriétaire Vérifié",
        posted_date: "2024-01-15",
        views: 234,
        favorites: 12,
        legal_documents: ["Titre foncier", "Attestation mairie", "Plan cadastral"],
        blockchain_confirmations: 156
      },
      {
        id: 2,
        title: "Grand terrain 1200m² - Thiès",
        region: "Thiès",
        city: "Thiès",
        area: "Centre-ville",
        size: 1200,
        price: 48000000,
        type: "Commercial",
        description: "Terrain commercial stratégiquement situé avec fort potentiel d'investissement.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
        verification_status: "pending",
        blockchain_hash: "pending",
        notary_validated: false,
        title_deed_number: "TF-TH-2024-045",
        owner: "Propriétaire Vérifié",
        posted_date: "2024-01-20",
        views: 89,
        favorites: 5,
        legal_documents: ["Titre foncier", "Plan cadastral"],
        blockchain_confirmations: 0
      },
      {
        id: 3,
        title: "Terrain agricole 2000m² - Saint-Louis",
        region: "Saint-Louis",
        city: "Saint-Louis",
        area: "Périphérie",
        size: 2000,
        price: 25000000,
        type: "Agricole",
        description: "Terrain agricole fertile, idéal pour l'agriculture ou l'élevage.",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
        verification_status: "verified",
        blockchain_hash: "0x9876543210fedcba0987654321abcdef",
        notary_validated: true,
        title_deed_number: "TF-SL-2024-078",
        owner: "Propriétaire Vérifié",
        posted_date: "2024-01-10",
        views: 167,
        favorites: 23,
        legal_documents: ["Titre foncier", "Attestation mairie", "Étude environnementale"],
        blockchain_confirmations: 298
      },
      {
        id: 4,
        title: "Terrain résidentiel 800m² - Kaolack",
        region: "Kaolack",
        city: "Kaolack",
        area: "Médina",
        size: 800,
        price: 32000000,
        type: "Résidentiel",
        description: "Terrain résidentiel dans un quartier calme et sécurisé.",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
        verification_status: "suspicious",
        blockchain_hash: null,
        notary_validated: false,
        title_deed_number: "TF-KL-2024-023",
        owner: "Propriétaire Non Vérifié",
        posted_date: "2024-01-25",
        views: 45,
        favorites: 2,
        legal_documents: ["Titre foncier"],
        blockchain_confirmations: 0
      },
      {
        id: 5,
        title: "Terrain communal disponible - Ziguinchor",
        region: "Ziguinchor",
        city: "Ziguinchor",
        area: "Extension urbaine",
        size: 600,
        price: 18000000,
        type: "Communal",
        description: "Terrain communal disponible via demande officielle auprès de la mairie.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
        verification_status: "verified",
        blockchain_hash: "0xabcdef9876543210fedcba1234567890",
        notary_validated: true,
        title_deed_number: "TC-ZG-2024-012",
        owner: "Mairie de Ziguinchor",
        posted_date: "2024-02-01",
        views: 156,
        favorites: 18,
        legal_documents: ["Autorisation communale", "Plan d'urbanisme", "Étude d'impact"],
        blockchain_confirmations: 89,
        is_municipal: true
      }
    ];

    setTimeout(() => {
      setProperties(mockProperties);
      setFilteredProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrage des propriétés
  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(property => property.region === selectedRegion);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(property => property.type === selectedType);
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(x => parseInt(x));
      filtered = filtered.filter(property => {
        if (max) {
          return property.price >= min && property.price <= max;
        }
        return property.price >= min;
      });
    }

    if (verificationFilter !== 'all') {
      filtered = filtered.filter(property => property.verification_status === verificationFilter);
    }

    setFilteredProperties(filtered);
  }, [searchTerm, selectedRegion, selectedType, priceRange, verificationFilter, properties]);

  const getVerificationBadge = (status) => {
    const badges = {
      verified: { color: 'bg-green-100 text-green-800 border-green-200', icon: Verified, text: 'Vérifié' },
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, text: 'En attente' },
      suspicious: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertTriangle, text: 'Suspect' }
    };
    
    const badge = badges[status];
    const Icon = badge.icon;
    
    return (
      <Badge className={`${badge.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </Badge>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600">Chargement des terrains...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Terrains Disponibles - Teranga Foncier</title>
        <meta name="description" content="Découvrez les terrains vérifiés par blockchain disponibles au Sénégal. Sécurisé, transparent et authentique." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* En-tête */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Terrains Vérifiés Blockchain
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Découvrez des terrains authentifiés par la technologie blockchain pour une sécurité maximale
              </motion.p>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher par ville, région ou type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
                <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Panneau de filtres */}
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Région</label>
                      <select 
                        value={selectedRegion} 
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="all">Toutes les régions</option>
                        <option value="Dakar">Dakar</option>
                        <option value="Thiès">Thiès</option>
                        <option value="Saint-Louis">Saint-Louis</option>
                        <option value="Kaolack">Kaolack</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select 
                        value={selectedType} 
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="all">Tous les types</option>
                        <option value="Résidentiel">Résidentiel</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Agricole">Agricole</option>
                        <option value="Communal">Communal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Prix (CFA)</label>
                      <select 
                        value={priceRange} 
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="all">Tous les prix</option>
                        <option value="0-30000000">0 - 30M CFA</option>
                        <option value="30000000-50000000">30M - 50M CFA</option>
                        <option value="50000000-100000000">50M - 100M CFA</option>
                        <option value="100000000">Plus de 100M CFA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vérification</label>
                      <select 
                        value={verificationFilter} 
                        onChange={(e) => setVerificationFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="verified">Vérifiés</option>
                        <option value="pending">En attente</option>
                        <option value="suspicious">Suspects</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Statistiques */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total terrains</p>
                    <p className="text-2xl font-bold text-blue-600">{properties.length}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vérifiés blockchain</p>
                    <p className="text-2xl font-bold text-green-600">
                      {properties.filter(p => p.verification_status === 'verified').length}
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">En attente</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {properties.filter(p => p.verification_status === 'pending').length}
                    </p>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Résultats</p>
                    <p className="text-2xl font-bold text-purple-600">{filteredProperties.length}</p>
                  </div>
                  <Search className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Liste des terrains */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                  <div className="relative">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      {getVerificationBadge(property.verification_status)}
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.city}, {property.region}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {property.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-500">Surface:</span>
                        <div className="font-medium">{property.size} m²</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <div className="font-medium">{property.type}</div>
                      </div>
                    </div>

                    {/* Informations blockchain */}
                    {property.verification_status === 'verified' && (
                      <div className="bg-green-50 p-3 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Sécurisé Blockchain</span>
                        </div>
                        <div className="text-xs text-green-700">
                          <div>Hash: {property.blockchain_hash?.substring(0, 16)}...</div>
                          <div>Confirmations: {property.blockchain_confirmations}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(property.price)}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {property.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {property.favorites}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        Voir les détails
                      </Button>
                      {property.is_municipal && (
                        <Button variant="outline" size="sm">
                          Demande communale
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-gray-500"
              >
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-medium mb-2">Aucun terrain trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TerrainsPage;
