import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Map, 
  MapPin, 
  Search, 
  Filter, 
  Eye, 
  Shield, 
  Zap, 
  Target, 
  Home, 
  DollarSign, 
  Phone, 
  Star,
  Navigation,
  Layers,
  Settings,
  Database,
  Blocks,
  CreditCard,
  Landmark,
  Building2,
  FileText,
  Calendar,
  Users,
  Award,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CartePage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [mapView, setMapView] = useState('satellite');
  const [activeTab, setActiveTab] = useState('private');

  // Propriétés NFT avec données blockchain
  const properties = [
    {
      id: 1,
      title: "Terrain NFT - Almadies Premium",
      location: "Almadies, Dakar",
      price: 125000000,
      surface: 500,
      type: "terrain",
      status: "nft_verified",
      coordinates: { lat: 14.7645, lng: -17.5230 },
      seller_type: "Vendeur Pro",
      seller_name: "Teranga Développement SA",
      rating: 4.9,
      blockchain_verified: true,
      nft_id: "NFT_TERRAIN_001",
      smart_contract: "0x1a2b3c4d5e6f7890abcdef",
      payment_options: ["direct", "banque", "echelonne"],
      bank_partners: ["UBA", "CBAO", "Crédit Agricole"],
      construction_monitoring: true,
      amenities: ["electricity", "water", "road", "fiber"],
      description: "Terrain premium tokenisé en NFT avec smart contract automatique. Financement bancaire disponible."
    },
    {
      id: 2,
      title: "Terrain commercial - Mermoz",
      location: "Mermoz, Dakar",
      price: 180000000,
      surface: 800,
      type: "terrain",
      status: "available",
      coordinates: { lat: 14.7392, lng: -17.4816 },
      owner: "Propriétaire Vérifié",
      rating: 4.9,
      blockchain_verified: true,
      hash: "0x9876543210fedcba",
      amenities: ["electricity", "water", "road"],
      description: "Terrain commercial stratégiquement situé"
    },
    {
      id: 3,
      title: "Terrain résidentiel - Plateau",
      location: "Plateau, Dakar",
      price: 95000000,
      surface: 300,
      type: "terrain",
      status: "sold",
      coordinates: { lat: 14.6937, lng: -17.4441 },
      owner: "Propriétaire Vérifié",
      rating: 4.7,
      blockchain_verified: false,
      hash: null,
      amenities: ["electricity", "water"],
      description: "Terrain en centre-ville avec accès facilité"
    },
    {
      id: 4,
      title: "Terrain communal - Pikine",
      location: "Pikine, Dakar",
      price: 45000000,
      surface: 600,
      type: "terrain",
      status: "verified",
      coordinates: { lat: 14.7549, lng: -17.4001 },
      owner: "Mairie de Pikine",
      rating: 4.5,
      blockchain_verified: true,
      hash: "0xabcdef1234567890",
      amenities: ["electricity", "road"],
      description: "Terrain communal disponible via demande officielle",
      is_municipal: true
    }
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = false;
    
    switch (activeFilter) {
      case 'all':
        matchesFilter = true;
        break;
      case 'terrain':
        matchesFilter = property.type === 'terrain';
        break;
      case 'verified':
        matchesFilter = property.status === 'verified' || property.blockchain_verified;
        break;
      case 'municipal':
        matchesFilter = property.is_municipal || property.owner.includes('Mairie');
        break;
      default:
        matchesFilter = property.type === activeFilter || property.status === activeFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status, blockchain_verified) => {
    if (blockchain_verified) {
      return <Badge className="bg-green-100 text-green-800 border-green-200"><Shield className="w-3 h-3 mr-1" />Blockchain</Badge>;
    }
    
    switch (status) {
      case 'verified':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><Eye className="w-3 h-3 mr-1" />Vérifié</Badge>;
      case 'available':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><Zap className="w-3 h-3 mr-1" />Disponible</Badge>;
      case 'sold':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Vendu</Badge>;
      default:
        return null;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(price);
  };

  return (
    <>
      <Helmet>
        <title>Carte Interactive - Teranga Foncier</title>
        <meta name="description" content="Explorez les propriétés sur carte interactive avec vérification blockchain" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
        {/* En-tête */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Carte Interactive des Propriétés
              </h1>
              <p className="text-xl text-gray-600">
                Explorez les terrains et biens immobiliers vérifiés par blockchain
              </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* Barre de recherche */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher par lieu ou nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3"
                />
              </div>

              {/* Filtres rapides */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'Tout', icon: Target },
                  { key: 'terrain', label: 'Terrains', icon: MapPin },
                  { key: 'verified', label: 'Vérifiés', icon: Shield },
                  { key: 'municipal', label: 'Communaux', icon: Home }
                ].map(filter => (
                  <Button
                    key={filter.key}
                    variant={activeFilter === filter.key ? 'default' : 'outline'}
                    onClick={() => setActiveFilter(filter.key)}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    <filter.icon className="w-4 h-4" />
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Carte simulée */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Map className="w-5 h-5 text-green-600" />
                      Carte Interactive
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setMapView(mapView === 'satellite' ? 'street' : 'satellite')}>
                        <Layers className="w-4 h-4 mr-1" />
                        {mapView === 'satellite' ? 'Plan' : 'Satellite'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Navigation className="w-4 h-4 mr-1" />
                        Ma position
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Simulation de carte */}
                  <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop&crop=center')] bg-cover bg-center opacity-30"></div>
                    
                    {/* Marqueurs simulés */}
                    {filteredProperties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        className={`absolute w-8 h-8 bg-green-600 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center ${
                          selectedProperty?.id === property.id ? 'ring-4 ring-green-300' : ''
                        }`}
                        style={{
                          left: `${20 + index * 15}%`,
                          top: `${30 + index * 10}%`
                        }}
                        onClick={() => setSelectedProperty(property)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MapPin className="w-4 h-4 text-white" />
                      </motion.div>
                    ))}

                    {/* Popup d'information */}
                    {selectedProperty && (
                      <motion.div
                        className="absolute bg-white p-3 rounded-lg shadow-lg border z-10"
                        style={{
                          left: `${20 + filteredProperties.findIndex(p => p.id === selectedProperty.id) * 15 + 5}%`,
                          top: `${20 + filteredProperties.findIndex(p => p.id === selectedProperty.id) * 10}%`
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <div className="text-sm">
                          <div className="font-medium mb-1">{selectedProperty.title}</div>
                          <div className="text-gray-600 mb-1">{selectedProperty.location}</div>
                          <div className="font-bold text-green-600">{formatPrice(selectedProperty.price)}</div>
                          {selectedProperty.blockchain_verified && (
                            <div className="text-xs text-green-600 mt-1">🔐 Blockchain vérifié</div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Légende */}
                    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
                      <div className="text-sm font-medium mb-2">Légende</div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          <span>Disponible</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <span>Vérifié</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                          <span>Vendu</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statistiques de la carte */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{filteredProperties.length}</div>
                      <div className="text-sm text-gray-600">Propriétés</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {filteredProperties.filter(p => p.blockchain_verified).length}
                      </div>
                      <div className="text-sm text-gray-600">Blockchain</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round(filteredProperties.reduce((sum, p) => sum + p.rating, 0) / filteredProperties.length * 10) / 10}
                      </div>
                      <div className="text-sm text-gray-600">Note moyenne</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des propriétés */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Propriétés trouvées ({filteredProperties.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-96 overflow-y-auto">
                    {filteredProperties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          selectedProperty?.id === property.id ? 'bg-green-50' : ''
                        }`}
                        onClick={() => setSelectedProperty(property)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{property.title}</h4>
                          {getStatusBadge(property.status, property.blockchain_verified)}
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-2">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {property.location}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold text-green-600">
                            {formatPrice(property.price)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {property.rating}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mt-1">
                          {property.surface} m² • {property.amenities.length} commodités
                        </div>

                        {property.blockchain_verified && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                            <div className="flex items-center gap-1 text-green-700">
                              <Shield className="w-3 h-3" />
                              <span className="font-medium">Sécurisé Blockchain</span>
                            </div>
                            <div className="text-green-600 font-mono text-xs mt-1">
                              {property.hash}...
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          <Button size="sm" className="flex-1 text-xs">
                            Voir détails
                          </Button>
                          {property.is_municipal && (
                            <Button size="sm" variant="outline" className="text-xs">
                              Demande
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartePage;
