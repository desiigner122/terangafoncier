import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Layers, 
  Search, 
  Filter, 
  Maximize2, 
  Home, 
  TrendingUp, 
  Building, 
  Globe, 
  Eye, 
  Settings, 
  BarChart3, 
  Target, 
  Star, 
  Heart, 
  Share2, 
  Phone, 
  MessageCircle, 
  Euro, 
  Calendar, 
  User, 
  ChevronDown, 
  X, 
  Info, 
  Navigation, 
  Ruler, 
  Camera
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CarteInteractive = () => {
  const [activeLayer, setActiveLayer] = useState('terrains');
  const [viewMode, setViewMode] = useState('satellite');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const mapRef = useRef(null);

  // Données simulées pour les propriétés - FOCUS TERRAINS pour particuliers
  const properties = [
    {
      id: 1,
      title: "Terrain résidentiel - Almadies",
      type: "Terrain",
      price: 45000000,
      pricePerM2: 180000,
      area: 250,
      location: "Almadies, Dakar",
      coordinates: [14.7392, -17.5069],
      description: "Magnifique terrain dans le quartier huppé des Almadies, idéal pour construction villa familiale",
      features: ["Vue mer", "Viabilisé", "Acte en règle", "Zone résidentielle", "Proche commodités"],
      images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef"],
      agent: { name: "Aminata Diop", phone: "+221 77 123 45 67" },
      status: "Disponible",
      roi: 12.5,
      isFavorite: false,
      diasporaRecommended: true,
      targetBuyer: "Particulier/Diaspora"
    },
    {
      id: 2,
      title: "Terrain constructible - Sicap Liberté",
      type: "Terrain",
      price: 32000000,
      pricePerM2: 160000,
      area: 200,
      location: "Sicap Liberté, Dakar",
      coordinates: [14.7167, -17.4677],
      description: "Terrain prêt à construire dans un quartier établi, parfait pour résidence principale ou investissement",
      features: ["Titre foncier", "Raccordements prêts", "Quartier sécurisé", "Écoles proximité"],
      images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef"],
      agent: { name: "Mamadou Fall", phone: "+221 76 987 65 43" },
      status: "Disponible",
      roi: 15.2,
      isFavorite: true,
      diasporaRecommended: true,
      targetBuyer: "Particulier"
    },
    {
      id: 3,
      title: "Terrain lotissement - Diamniadio",
      type: "Terrain",
      price: 18000000,
      pricePerM2: 90000,
      area: 200,
      location: "Diamniadio",
      coordinates: [14.7042, -17.1833],
      description: "Terrain dans le nouveau pôle économique, excellent potentiel d'investissement pour particuliers",
      features: ["Lotissement moderne", "Infrastructures prévues", "Zone en développement", "Prix attractif"],
      images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef"],
      agent: { name: "Fatou Ndiaye", phone: "+221 77 555 44 33" },
      status: "Disponible",
      roi: 18.8,
      isFavorite: false,
      diasporaRecommended: true,
      targetBuyer: "Particulier/Diaspora"
    },
    {
      id: 4,
      title: "Terrain commercial - Rufisque",
      type: "Terrain",
      price: 28000000,
      pricePerM2: 140000,
      area: 200,
      location: "Rufisque, Dakar",
      coordinates: [14.7167, -17.2750],
      description: "Terrain bien situé pour commerce ou résidence, zone en expansion",
      features: ["Axe principal", "Commerce autorisé", "Électricité", "Eau courante"],
      images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef"],
      agent: { name: "Ousmane Diallo", phone: "+221 76 444 33 22" },
      status: "Disponible",
      roi: 16.5,
      isFavorite: false,
      diasporaRecommended: true,
      targetBuyer: "Particulier"
    },
    {
      id: 5,
      title: "Terrain résidentiel - Pikine",
      type: "Terrain",
      price: 22000000,
      pricePerM2: 110000,
      area: 200,
      location: "Pikine, Dakar",
      coordinates: [14.7500, -17.3833],
      description: "Terrain accessible aux particuliers dans une zone populaire en développement",
      features: ["Prix abordable", "Zone résidentielle", "Transport public", "Marché proche"],
      images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef"],
      agent: { name: "Awa Ba", phone: "+221 77 666 55 44" },
      status: "Disponible",
      roi: 14.2,
      isFavorite: true,
      diasporaRecommended: false,
      targetBuyer: "Particulier"
    }
  ];

  const layers = [
    { id: 'terrains', name: 'Tous Terrains', icon: MapPin, color: 'emerald' },
    { id: 'diaspora', name: 'Spécial Diaspora', icon: Globe, color: 'blue' },
    { id: 'abordable', name: 'Prix Abordable', icon: Target, color: 'green' },
    { id: 'premium', name: 'Haut Standing', icon: Star, color: 'purple' }
  ];

  const viewModes = [
    { id: 'satellite', name: 'Satellite', icon: Globe },
    { id: 'street', name: 'Rue', icon: Navigation },
    { id: 'hybrid', name: 'Hybride', icon: Layers }
  ];

  const regions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Diourbel', 'Louga', 'Fatick', 'Kolda', 'Tambacounda', 'Kédougou', 'Matam', 'Kaffrine', 'Sédhiou'
  ];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesRegion = selectedRegions.length === 0 || 
                         selectedRegions.some(region => property.location.includes(region));
    const matchesLayer = activeLayer === 'terrains' || // Tous les terrains
                        activeLayer === 'diaspora' && property.diasporaRecommended ||
                        activeLayer === 'abordable' && property.price <= 25000000 ||
                        activeLayer === 'premium' && property.price >= 40000000;
    const matchesFavorites = !showFavorites || property.isFavorite;

    return matchesSearch && matchesPrice && matchesRegion && matchesLayer && matchesFavorites;
  });

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M FCFA`;
    }
    return `${(price / 1000).toFixed(0)}k FCFA`;
  };

  const MapComponent = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100 rounded-lg overflow-hidden">
      {/* Simulation de carte satellite */}
      <div className="absolute inset-0 opacity-80">
        <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-200 to-yellow-200"></div>
        {/* Overlay patterns pour simuler des routes et zones */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 800 600">
            {/* Routes principales */}
            <path d="M0,300 Q200,280 400,300 T800,300" stroke="#666" strokeWidth="3" fill="none" opacity="0.7"/>
            <path d="M400,0 Q380,200 400,400 T400,600" stroke="#666" strokeWidth="2" fill="none" opacity="0.7"/>
            
            {/* Zones urbaines */}
            <circle cx="200" cy="150" r="80" fill="#10b981" opacity="0.3"/>
            <circle cx="600" cy="200" r="60" fill="#3b82f6" opacity="0.3"/>
            <circle cx="300" cy="450" r="70" fill="#f59e0b" opacity="0.3"/>
          </svg>
        </div>
      </div>

      {/* Marqueurs des propriétés */}
      {filteredProperties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="absolute cursor-pointer z-10"
          style={{
            left: `${20 + index * 150}px`,
            top: `${100 + (index % 3) * 120}px`
          }}
          onClick={() => setSelectedProperty(property)}
        >
          <div className="relative">
            <div className={`w-8 h-8 rounded-full bg-${layers.find(l => l.id === activeLayer)?.color || 'emerald'}-500 border-2 border-white shadow-lg flex items-center justify-center animate-pulse`}>
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs font-medium whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {formatPrice(property.price)}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Contrôles de vue */}
      <div className="absolute top-4 right-4 space-y-2">
        {viewModes.map((mode) => (
          <Button
            key={mode.id}
            variant={viewMode === mode.id ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode(mode.id)}
            className="w-10 h-10 p-0"
          >
            <mode.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      {/* Contrôles de zoom */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-1">
        <Button variant="outline" size="sm" className="w-10 h-10 p-0">
          +
        </Button>
        <Button variant="outline" size="sm" className="w-10 h-10 p-0">
          -
        </Button>
      </div>

      {/* Échelle */}
      <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded shadow text-xs">
        1 km
        <div className="w-16 h-0.5 bg-gray-800 mt-1"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header de la carte */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Carte Interactive des Terrains</h1>
              <p className="text-gray-600">Trouvez le terrain idéal pour votre projet au Sénégal - Spécial Particuliers & Diaspora</p>
            </div>
            
            {/* Recherche */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher terrain par lieu, prix..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setFilterOpen(!filterOpen)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                {(selectedRegions.length > 0 || showFavorites) && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {selectedRegions.length + (showFavorites ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              
              <Button
                variant={showFavorites ? "default" : "outline"}
                onClick={() => setShowFavorites(!showFavorites)}
              >
                <Heart className={`h-4 w-4 mr-2 ${showFavorites ? 'fill-current' : ''}`} />
                Favoris
              </Button>
              
              <Button
                variant={alertsOpen ? "default" : "outline"}
                onClick={() => setAlertsOpen(!alertsOpen)}
                className="relative"
              >
                <Target className="h-4 w-4 mr-2" />
                Alertes
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-orange-500">
                  2
                </Badge>
              </Button>
              
              <Button
                variant={compareMode ? "default" : "outline"}
                onClick={() => setCompareMode(!compareMode)}
                className="relative"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Comparer
                {selectedForComparison.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                    {selectedForComparison.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-8rem)]">
        {/* Sidebar des layers */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <div className="space-y-6">
            {/* Layers */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Calques</h3>
              <div className="space-y-2">
                {layers.map((layer) => (
                  <Button
                    key={layer.id}
                    variant={activeLayer === layer.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <layer.icon className={`h-4 w-4 mr-2 text-${layer.color}-500`} />
                    {layer.name}
                    <Badge variant="outline" className="ml-auto">
                      {properties.filter(p => {
                        if (layer.id === 'terrains') return true; // Tous les terrains
                        if (layer.id === 'diaspora') return p.diasporaRecommended;
                        if (layer.id === 'abordable') return p.price <= 25000000;
                        if (layer.id === 'premium') return p.price >= 40000000;
                        return false;
                      }).length}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Badge Diaspora */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-emerald-600" />
                <h4 className="font-semibold text-emerald-900">Spécial Diaspora</h4>
              </div>
              <p className="text-sm text-emerald-700 mb-3">
                Terrains sélectionnés pour les Sénégalais de l'étranger : achat sécurisé et gestion à distance facilitée.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                onClick={() => setActiveLayer('diaspora')}
              >
                Voir les terrains diaspora
              </Button>
            </div>

            {/* Statistiques rapides */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Statistiques</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix moyen/m²</span>
                  <span className="font-medium">165k FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ROI moyen</span>
                  <span className="font-medium text-emerald-600">13.7%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Propriétés disponibles</span>
                  <span className="font-medium">{filteredProperties.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone de carte principale */}
        <div className="flex-1 relative">
          <MapComponent />
          
          {/* Panneau des filtres */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                className="absolute left-0 top-0 bottom-0 w-80 bg-white border-r shadow-lg z-30 overflow-y-auto"
              >
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filtres avancés</h3>
                    <Button variant="ghost" size="sm" onClick={() => setFilterOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Range de prix */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Fourchette de prix: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100000000}
                      min={0}
                      step={1000000}
                      className="mb-4"
                    />
                  </div>

                  {/* Régions */}
                  <div>
                    <label className="block text-sm font-medium mb-3">Régions</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {regions.map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={region}
                            checked={selectedRegions.includes(region)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRegions([...selectedRegions, region]);
                              } else {
                                setSelectedRegions(selectedRegions.filter(r => r !== region));
                              }
                            }}
                          />
                          <label htmlFor={region} className="text-sm">{region}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions rapides */}
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setPriceRange([0, 30000000]);
                        setSelectedRegions(['Dakar']);
                      }}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Résidences Dakar &lt; 30M
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => {
                        setPriceRange([10000000, 40000000]);
                        setActiveLayer('investissement');
                      }}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Opportunités Diaspora
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Panneau des alertes diaspora */}
          <AnimatePresence>
            {alertsOpen && (
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                className="absolute left-0 top-0 bottom-0 w-80 bg-white border-r shadow-lg z-30 overflow-y-auto"
              >
                <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-900">Alertes Diaspora</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setAlertsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Recevez des notifications pour vos investissements
                  </p>
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Alertes actives */}
                  <div>
                    <h4 className="font-medium mb-3 text-gray-900">Alertes actives (2)</h4>
                    <div className="space-y-3">
                      <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm text-orange-900">Prix Almadies</h5>
                            <p className="text-xs text-orange-700 mb-2">Baisse de prix dans les Almadies</p>
                            <div className="text-xs text-orange-600">
                              Seuil: &lt; 40M FCFA • Zone: Almadies
                            </div>
                          </div>
                          <Badge className="bg-orange-500 text-white text-xs">Actif</Badge>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-emerald-200 rounded-lg bg-emerald-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm text-emerald-900">Nouveaux Projets</h5>
                            <p className="text-xs text-emerald-700 mb-2">Projets diaspora à Diamniadio</p>
                            <div className="text-xs text-emerald-600">
                              Type: Terrains • ROI: &gt; 15%
                            </div>
                          </div>
                          <Badge className="bg-emerald-500 text-white text-xs">Actif</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Créer nouvelle alerte */}
                  <div>
                    <h4 className="font-medium mb-3 text-gray-900">Créer une alerte</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Type d'alerte</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir le type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="price">Baisse de prix</SelectItem>
                            <SelectItem value="new">Nouveaux biens</SelectItem>
                            <SelectItem value="roi">ROI élevé</SelectItem>
                            <SelectItem value="diaspora">Spécial diaspora</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Zone géographique</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dakar">Dakar</SelectItem>
                            <SelectItem value="almadies">Almadies</SelectItem>
                            <SelectItem value="diamniadio">Diamniadio</SelectItem>
                            <SelectItem value="thies">Thiès</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Budget max: {new Intl.NumberFormat('fr-FR').format(priceRange[1])} FCFA
                        </label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={100000000}
                          min={5000000}
                          step={5000000}
                          className="mb-4"
                        />
                      </div>
                      
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        <Target className="h-4 w-4 mr-2" />
                        Créer l'alerte
                      </Button>
                    </div>
                  </div>

                  {/* Recommandations diaspora */}
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                    <h4 className="font-medium text-emerald-900 mb-2">💡 Conseils Diaspora</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• Privilégiez les zones en développement</li>
                      <li>• Vérifiez les infrastructures prévues</li>
                      <li>• Considérez la proximité des transports</li>
                      <li>• Surveillez les projets gouvernementaux</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Liste des propriétés */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Propriétés ({filteredProperties.length})</h3>
          </div>
          
          <div className="p-4 space-y-4">
            {filteredProperties.map((property) => (
              <motion.div
                key={property.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProperty(property)}
              >
                <div className="relative h-32">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant={property.status === 'Disponible' ? 'default' : 'secondary'}>
                      {property.status}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 space-x-1">
                    {property.diasporaRecommended && (
                      <Badge className="bg-emerald-500">
                        Diaspora
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle favorite
                      }}
                    >
                      <Heart className={`h-3 w-3 ${property.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </Button>
                  </div>
                </div>
                
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1">{property.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{property.location}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-emerald-600">
                      {formatPrice(property.price)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatPrice(property.pricePerM2)}/m²
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{property.area}m²</span>
                    <span className="text-emerald-600 font-medium">ROI: {property.roi}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de détail de propriété */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProperty(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  className="w-full h-64 object-cover"
                />
                <Button
                  variant="ghost"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                  onClick={() => setSelectedProperty(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedProperty.title}</h2>
                    <p className="text-gray-600">{selectedProperty.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600">
                      {formatPrice(selectedProperty.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(selectedProperty.pricePerM2)}/m²
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <p className="text-gray-700 mb-4">{selectedProperty.description}</p>
                    
                    <h3 className="font-semibold mb-3">Caractéristiques</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Ruler className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedProperty.area}m²</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">ROI: {selectedProperty.roi}%</span>
                      </div>
                    </div>

                    <h3 className="font-semibold mb-3">Points forts</h3>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {selectedProperty.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Contact Agent</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{selectedProperty.agent.name}</span>
                        </div>
                        <Button className="w-full">
                          <Phone className="h-4 w-4 mr-2" />
                          Appeler
                        </Button>
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        <Heart className="h-4 w-4 mr-2" />
                        Ajouter aux favoris
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Planifier visite
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarteInteractive;
