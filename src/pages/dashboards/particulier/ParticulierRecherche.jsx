import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  MapPin,
  Home,
  DollarSign,
  Calendar,
  Bed,
  Bath,
  Square,
  Star,
  Heart,
  Eye,
  ChevronDown,
  SlidersHorizontal,
  Grid3X3,
  List,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierRecherche = () => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    type: 'all', // 'terrain', 'maison', 'appartement', 'commercial'
    priceMin: '',
    priceMax: '',
    surfaceMin: '',
    surfaceMax: '',
    bedrooms: '',
    location: '',
    disponible: true
  });

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, properties]);

  const loadProperties = async () => {
    try {
      setLoading(true);

      // Charger tous les types de propriétés
      const { data: terrainsData } = await supabase
        .from('terrains')
        .select('*, proprietaire_id')
        .eq('statut', 'disponible');

      const { data: zonesData } = await supabase
        .from('zones_communales')
        .select('*')
        .eq('statut', 'disponible');

      // Formater les données pour avoir une structure uniforme
      const formattedTerrains = (terrainsData || []).map(terrain => ({
        id: terrain.id,
        title: terrain.nom || `Terrain ${terrain.id}`,
        type: 'terrain',
        price: terrain.prix || 0,
        surface: terrain.superficie || 0,
        location: terrain.adresse || terrain.localisation,
        description: terrain.description,
        image: terrain.images?.[0] || '/placeholder-terrain.jpg',
        disponible: terrain.statut === 'disponible',
        proprietaire_id: terrain.proprietaire_id,
        created_at: terrain.created_at
      }));

      const formattedZones = (zonesData || []).map(zone => ({
        id: zone.id,
        title: zone.nom || `Zone ${zone.id}`,
        type: 'zone_communale',
        price: zone.prix_base || 0,
        surface: zone.superficie_totale || 0,
        location: zone.commune || zone.region,
        description: zone.description,
        image: zone.images?.[0] || '/placeholder-zone.jpg',
        disponible: zone.statut === 'disponible',
        created_at: zone.created_at
      }));

      const allProperties = [...formattedTerrains, ...formattedZones];
      setProperties(allProperties);

    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
      toast.error('Erreur lors du chargement des propriétés');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Filtrage par requête de recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prop => 
        prop.title.toLowerCase().includes(query) ||
        prop.description?.toLowerCase().includes(query) ||
        prop.location?.toLowerCase().includes(query)
      );
    }

    // Filtrage par type
    if (filters.type !== 'all') {
      filtered = filtered.filter(prop => prop.type === filters.type);
    }

    // Filtrage par prix
    if (filters.priceMin) {
      filtered = filtered.filter(prop => prop.price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(prop => prop.price <= parseFloat(filters.priceMax));
    }

    // Filtrage par surface
    if (filters.surfaceMin) {
      filtered = filtered.filter(prop => prop.surface >= parseFloat(filters.surfaceMin));
    }
    if (filters.surfaceMax) {
      filtered = filtered.filter(prop => prop.surface <= parseFloat(filters.surfaceMax));
    }

    // Filtrage par localisation
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(prop => 
        prop.location?.toLowerCase().includes(location)
      );
    }

    // Filtrage par disponibilité
    if (filters.disponible) {
      filtered = filtered.filter(prop => prop.disponible);
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      priceMin: '',
      priceMax: '',
      surfaceMin: '',
      surfaceMax: '',
      bedrooms: '',
      location: '',
      disponible: true
    });
    setSearchQuery('');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const PropertyCard = ({ property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
        <div className="relative">
          <img 
            src={property.image} 
            alt={property.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-property.jpg';
            }}
          />
          <div className="absolute top-3 right-3 flex gap-2">
            <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <Badge className="absolute top-3 left-3 bg-blue-600">
            {property.type === 'terrain' ? 'Terrain' : 
             property.type === 'zone_communale' ? 'Zone Communale' : 
             property.type}
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-slate-900 line-clamp-1">
                {property.title}
              </h3>
              <p className="text-slate-600 text-sm flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location || 'Localisation non spécifiée'}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  {property.surface} m²
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                </p>
              </div>
            </div>

            {property.description && (
              <p className="text-slate-600 text-sm line-clamp-2">
                {property.description}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <Button className="flex-1" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Voir détails
              </Button>
              <Button variant="outline" size="sm">
                Contacter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Recherche de Propriétés</h1>
          <p className="text-slate-600 mt-1">
            Trouvez le terrain ou la propriété parfaite pour votre projet
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, description ou localisation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtres avancés */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filtres Avancés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">Tous les types</option>
                    <option value="terrain">Terrain</option>
                    <option value="zone_communale">Zone Communale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Prix Min</label>
                  <Input
                    type="number"
                    placeholder="Prix minimum"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Prix Max</label>
                  <Input
                    type="number"
                    placeholder="Prix maximum"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Surface Min (m²)</label>
                  <Input
                    type="number"
                    placeholder="Surface minimum"
                    value={filters.surfaceMin}
                    onChange={(e) => handleFilterChange('surfaceMin', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Surface Max (m²)</label>
                  <Input
                    type="number"
                    placeholder="Surface maximum"
                    value={filters.surfaceMax}
                    onChange={(e) => handleFilterChange('surfaceMax', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Localisation</label>
                  <Input
                    placeholder="Ville, commune..."
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button onClick={applyFilters}>
                  Appliquer les filtres
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Résultats */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          {loading ? 'Chargement...' : `${filteredProperties.length} propriété(s) trouvée(s)`}
        </p>
        
        {filteredProperties.length > 0 && (
          <select className="border border-slate-300 rounded-md px-3 py-1 text-sm">
            <option>Plus récent</option>
            <option>Prix croissant</option>
            <option>Prix décroissant</option>
            <option>Surface croissante</option>
            <option>Surface décroissante</option>
          </select>
        )}
      </div>

      {/* Grille des propriétés */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-slate-600">Chargement des propriétés...</p>
          </div>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Aucune propriété trouvée
            </h3>
            <p className="text-slate-600 mb-4">
              Essayez de modifier vos critères de recherche ou vos filtres.
            </p>
            <Button onClick={resetFilters}>
              Voir toutes les propriétés
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParticulierRecherche;