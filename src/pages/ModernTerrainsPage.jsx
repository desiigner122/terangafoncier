import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPin,
  Filter,
  Search,
  Grid,
  List,
  Star,
  Eye,
  Heart,
  Share2,
  Calendar,
  Building2,
  TreePine,
  Factory,
  Home,
  School,
  ShoppingCart,
  FileCheck,
  Users,
  Blocks,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Helmet } from 'react-helmet-async';

const ModernTerrainsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('vente');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    region: 'all',
    priceRange: [0, 100000000],
    surface: [100, 10000],
    type: 'all'
  });

  // Terrains à vendre (propriété privée)
  const terrainsVente = [
    {
      id: 1,
      title: "Terrain Résidentiel - Almadies",
      location: "Almadies, Dakar",
      price: 45000000,
      surface: 500,
      type: "Résidentiel",
      status: "Disponible",
      verified: true,
      images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"],
      features: ["Titre foncier", "Vue mer", "Viabilisé", "Sécurisé"],
      description: "Magnifique terrain avec vue mer dans le quartier prisé des Almadies",
      blockchainId: "0x7f8a9b2c...",
      lastVerified: "2024-03-15"
    },
    {
      id: 2,
      title: "Terrain Commercial - Plateau",
      location: "Plateau, Dakar",
      price: 120000000,
      surface: 800,
      type: "Commercial",
      status: "Disponible",
      verified: true,
      images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop"],
      features: ["Zone commerciale", "Accès facile", "Parking", "Sécurisé"],
      description: "Terrain idéal pour projet commercial au cœur du Plateau",
      blockchainId: "0x3e5f1a8d...",
      lastVerified: "2024-03-14"
    },
    {
      id: 3,
      title: "Terrain Industriel - Rufisque",
      location: "Rufisque, Dakar",
      price: 25000000,
      surface: 2000,
      type: "Industriel",
      status: "Disponible",
      verified: true,
      images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop"],
      features: ["Zone industrielle", "Accès route", "Électricité", "Eau"],
      description: "Grand terrain pour projet industriel ou logistique",
      blockchainId: "0x9d2c4f7b...",
      lastVerified: "2024-03-13"
    }
  ];

  // Terrains communaux (sur demande uniquement)
  const terrainsCommunaux = [
    {
      id: 101,
      title: "Parcelle Résidentielle - Guédiawaye",
      location: "Guédiawaye, Dakar",
      surface: 300,
      type: "Résidentiel",
      status: "Demande Ouverte",
      mairie: "Guédiawaye",
      demandeurs: 23,
      delai: "2-4 mois",
      criteres: ["Résidence principale", "Revenus réguliers", "Domiciliation"],
      description: "Parcelles résidentielles dans un nouveau lotissement",
      procedure: "Dépôt de dossier en mairie"
    },
    {
      id: 102,
      title: "Terrain Artisanal - Mbour",
      location: "Mbour, Thiès",
      surface: 200,
      type: "Artisanal",
      status: "Demande Ouverte",
      mairie: "Mbour",
      demandeurs: 15,
      delai: "3-6 mois",
      criteres: ["Projet artisanal", "Formation technique", "Garanties"],
      description: "Zone artisanale dédiée aux métiers traditionnels",
      procedure: "Présentation du projet d'activité"
    },
    {
      id: 103,
      title: "Lot Commercial - Saint-Louis",
      location: "Saint-Louis",
      surface: 400,
      type: "Commercial",
      status: "Commission d'Attribution",
      mairie: "Saint-Louis",
      demandeurs: 8,
      delai: "4-8 mois",
      criteres: ["Projet viable", "Expérience commerciale", "Financement"],
      description: "Emplacement stratégique pour commerce de proximité",
      procedure: "Étude de faisabilité requise"
    }
  ];

  const regions = [
    "Dakar", "Thiès", "Saint-Louis", "Diourbel", "Louga", "Fatick",
    "Kaolack", "Kolda", "Ziguinchor", "Tambacounda", "Kaffrine",
    "Kédougou", "Matam", "Sédhiou"
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Fonction de filtrage des terrains
  const filterTerrains = (terrains) => {
    return terrains.filter(terrain => {
      // Filtrage par région
      if (filters.region !== 'all' && terrain.location && !terrain.location.includes(filters.region)) {
        return false;
      }
      
      // Filtrage par type
      if (filters.type !== 'all' && terrain.type !== filters.type) {
        return false;
      }
      
      // Filtrage par terme de recherche
      if (searchTerm && !terrain.title.toLowerCase().includes(searchTerm.toLowerCase()) 
          && !terrain.location.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  const TerrainCard = ({ terrain, isVente = true }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group"
    >
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all overflow-hidden">
        {isVente && terrain.images && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={terrain.images[0]}
              alt={terrain.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {terrain.verified && (
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Vérifié
                </Badge>
              )}
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                {terrain.type}
              </Badge>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/20 backdrop-blur-sm">
                <Heart className="w-4 h-4 text-white" />
              </Button>
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0 bg-white/20 backdrop-blur-sm">
                <Share2 className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        )}

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                {terrain.title}
              </h3>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <MapPin className="w-4 h-4" />
                {terrain.location}
              </div>
            </div>
            {isVente && (
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {formatPrice(terrain.price)}
                </div>
                <div className="text-sm text-gray-300">
                  {(terrain.price / terrain.surface).toLocaleString()} FCFA/m²
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center py-2 bg-white/5 rounded-lg">
              <div className="text-white font-semibold">{terrain.surface} m²</div>
              <div className="text-gray-400 text-xs">Surface</div>
            </div>
            <div className="text-center py-2 bg-white/5 rounded-lg">
              {isVente ? (
                <>
                  <div className="text-white font-semibold">{terrain.status}</div>
                  <div className="text-gray-400 text-xs">Statut</div>
                </>
              ) : (
                <>
                  <div className="text-white font-semibold">{terrain.demandeurs}</div>
                  <div className="text-gray-400 text-xs">Demandeurs</div>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {terrain.description}
          </p>

          {isVente ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {terrain.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} className="text-xs bg-blue-500/20 text-blue-300">
                    {feature}
                  </Badge>
                ))}
              </div>
              
              {terrain.blockchainId && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Blocks className="w-3 h-3" />
                  ID Blockchain: {terrain.blockchainId}
                </div>
              )}

              <div className="flex gap-3">
                <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                  <Link to={`/terrain/${terrain.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Voir Détails
                  </Link>
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">Mairie: {terrain.mairie}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-300">Délai: {terrain.delai}</span>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Critères d'attribution:</h4>
                <div className="space-y-1">
                  {terrain.criteres.slice(0, 2).map((critere, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-gray-300">{critere}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button asChild className="w-full bg-gradient-to-r from-green-600 to-teal-600">
                <Link to={`/demande-communale/${terrain.id}`}>
                  <FileCheck className="w-4 h-4 mr-2" />
                  Faire une Demande
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Terrains au Sénégal | Teranga Foncier - Blockchain Immobilier</title>
        <meta name="description" content="Découvrez terrains à vendre et demandes communales au Sénégal. Sécurisés par blockchain, vérifiés et transparents." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
                  🏗️ Terrains Sécurisés Blockchain
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                  Trouvez Votre
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}Terrain Idéal
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Terrains à vendre avec titres sécurisés ou demandes de terrains communaux. 
                  Tous vérifiés par blockchain pour votre sécurité.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="py-8 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Alert className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 max-w-4xl mx-auto">
              <Info className="h-5 w-5 text-orange-400" />
              <AlertDescription className="text-white">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-orange-300">🏪 Terrains à Vendre</h3>
                    <p className="text-gray-300 text-sm">
                      Propriétés privées avec titres fonciers définitifs. 
                      Achat direct avec transfert de propriété immédiat.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-green-300">📋 Terrains Communaux</h3>
                    <p className="text-gray-300 text-sm">
                      Terrains municipaux sur demande uniquement. 
                      Procédure d'attribution selon critères des mairies.
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6"
            >
              <div className="grid lg:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Rechercher
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Localisation, type..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Région
                  </label>
                  <Select value={filters.region} onValueChange={(value) => setFilters({...filters, region: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Toutes les régions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les régions</SelectItem>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>{region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Type
                  </label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Tous types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous types</SelectItem>
                      <SelectItem value="Résidentiel">Résidentiel</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Industriel">Industriel</SelectItem>
                      <SelectItem value="Artisanal">Artisanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="bg-blue-600 border-white/20"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="border-white/20"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres Avancés
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-8">
                <TabsList className="bg-white/10 backdrop-blur-sm">
                  <TabsTrigger value="vente" className="data-[state=active]:bg-blue-600">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Terrains à Vendre ({terrainsVente.length})
                  </TabsTrigger>
                  <TabsTrigger value="communal" className="data-[state=active]:bg-green-600">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Demandes Communales ({terrainsCommunaux.length})
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-4 text-white">
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-48 bg-white/10 border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Plus Récents</SelectItem>
                      <SelectItem value="price-asc">Prix Croissant</SelectItem>
                      <SelectItem value="price-desc">Prix Décroissant</SelectItem>
                      <SelectItem value="surface-asc">Surface Croissante</SelectItem>
                      <SelectItem value="surface-desc">Surface Décroissante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="vente">
                <div className={`grid ${viewMode === 'grid' ? 'lg:grid-cols-3 md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
                  {filterTerrains(terrainsVente).map((terrain) => (
                    <TerrainCard key={terrain.id} terrain={terrain} isVente={true} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="communal">
                <div className="space-y-6 mb-8">
                  <Alert className="bg-green-500/20 border-green-500/30">
                    <FileCheck className="h-5 w-5 text-green-400" />
                    <AlertDescription className="text-white">
                      <h3 className="font-semibold mb-2">Procédure pour les Terrains Communaux</h3>
                      <p className="text-gray-300 mb-4">
                        Les terrains communaux ne sont pas vendus mais attribués selon des critères spécifiques. 
                        Chaque demande est étudiée par la commission d'attribution de la mairie concernée.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>Dossier complet requis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-400" />
                          <span>Délai d'étude: 2-8 mois</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span>Commission d'attribution</span>
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>

                <div className={`grid ${viewMode === 'grid' ? 'lg:grid-cols-3 md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
                  {filterTerrains(terrainsCommunaux).map((terrain) => (
                    <TerrainCard key={terrain.id} terrain={terrain} isVente={false} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Besoin d'Aide pour Votre Projet ?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Nos experts vous accompagnent dans le choix de votre terrain, 
                les démarches administratives et la sécurisation blockchain.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/contact">
                    <Users className="mr-2 h-5 w-5" />
                    Parler à un Expert
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/foncier-senegal">
                    <Info className="mr-2 h-5 w-5" />
                    Guide du Foncier
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ModernTerrainsPage;
