import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { 
  Plus,
  Building2, 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  Clock, 
  TrendingUp, 
  Zap,
  Shield,
  Eye,
  Heart,
  Share2,
  Search,
  Filter,
  SortDesc,
  Grid3X3,
  List,
  Home,
  ChevronRight,
  Award,
  Target,
  Layers,
  BarChart3,
  FileText,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  ArrowRight,
  Calculator,
  CreditCard,
  Phone,
  Mail,
  Globe,
  Camera,
  Video,
  Navigation,
  Hammer,
  Truck,
  Wrench,
  Send,
  Blocks,
  Database,
  Brain,
  Sparkles,
  Upload,
  DollarSign,
  Percent,
  MessageSquare,
  Bell,
  Edit,
  Trash2,
  MoreVertical,
  Euro,
  Coins,
  Activity,
  ArrowUpRight,
  TrendingDown,
  Settings,
  Bookmark,
  Timer,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const PromoterConstructionRequestsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // États pour les demandes
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Données mockées des demandes de construction
  useEffect(() => {
    const mockRequests = []; // démo retirée

    setTimeout(() => {
      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtrage et tri des demandes
  useEffect(() => {
    let filtered = [...requests];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.client.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(request => request.status === selectedStatus);
    }

    // Filtrage par type
    if (selectedType !== 'all') {
      filtered = filtered.filter(request => request.type === selectedType);
    }

    // Filtrage par gamme de prix
    if (selectedPriceRange !== 'all') {
      const ranges = {
        'low': [0, 50000000],
        'medium': [50000000, 200000000],
        'high': [200000000, 500000000],
        'premium': [500000000, Infinity]
      };
      const [min, max] = ranges[selectedPriceRange];
      filtered = filtered.filter(request => 
        request.budget.estimated >= min && request.budget.estimated < max
      );
    }

    // Filtrage par localisation
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(request => 
        request.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Tri
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        break;
      case 'budget_high':
        filtered.sort((a, b) => b.budget.estimated - a.budget.estimated);
        break;
      case 'budget_low':
        filtered.sort((a, b) => a.budget.estimated - b.budget.estimated);
        break;
      case 'deadline':
        filtered.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case 'proposals':
        filtered.sort((a, b) => b.proposals - a.proposals);
        break;
      default:
        break;
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, selectedStatus, selectedType, selectedPriceRange, selectedLocation, sortBy]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Recherche promoteur':
        return { color: 'bg-blue-100 text-blue-800', icon: <Building2 className="w-4 h-4" /> };
      case 'En négociation':
        return { color: 'bg-orange-100 text-orange-800', icon: <MessageSquare className="w-4 h-4" /> };
      case 'Urgent':
        return { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-4 h-4" /> };
      case 'Financement confirmé':
        return { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
      case 'Ouvert aux propositions':
        return { color: 'bg-purple-100 text-purple-800', icon: <Hammer className="w-4 h-4" /> };
      case 'Étude de faisabilité':
        return { color: 'bg-yellow-100 text-yellow-800', icon: <FileText className="w-4 h-4" /> };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: <Clock className="w-4 h-4" /> };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'border-l-red-500';
      case 'Moyenne': return 'border-l-yellow-500';
      case 'Basse': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const toggleFavorite = (requestId) => {
    setFavorites(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const getStats = () => {
    const total = requests.length;
    const urgent = requests.filter(r => r.status === 'Urgent').length;
    const totalBudget = requests.reduce((sum, r) => sum + r.budget.estimated, 0);
    const avgBudget = total > 0 ? totalBudget / total : 0;
    
    return {
      total,
      urgent,
      totalBudget,
      avgBudget,
      open: requests.filter(r => ['Recherche promoteur', 'Ouvert aux propositions'].includes(r.status)).length
    };
  };

  const stats = getStats();

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
    <>
      <Helmet>
        <title>Demandes de Construction - Promoteurs | Teranga Foncier</title>
        <meta name="description" content="Découvrez les demandes de construction de villas, immeubles et projets immobiliers au Sénégal. Sécurisé par blockchain." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Demandes de <span className="text-yellow-300">Construction</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Découvrez des projets immobiliers sécurisés par blockchain
              </p>
              
              {/* Statistiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-6"
                >
                  <div className="text-3xl font-bold mb-2">{stats.total}</div>
                  <div className="text-sm opacity-90">Projets disponibles</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-6"
                >
                  <div className="text-3xl font-bold mb-2">{stats.urgent}</div>
                  <div className="text-sm opacity-90">Projets urgents</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-6"
                >
                  <div className="text-3xl font-bold mb-2">{(stats.totalBudget / 1000000000).toFixed(1)}B</div>
                  <div className="text-sm opacity-90">Budget total (FCFA)</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg p-6"
                >
                  <div className="text-3xl font-bold mb-2">{stats.open}</div>
                  <div className="text-sm opacity-90">Ouverts aux offres</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filtres et recherche */}
        <section className="py-8 bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Barre de recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher par titre, lieu, client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filtres rapides */}
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="Recherche promoteur">Recherche promoteur</SelectItem>
                    <SelectItem value="En négociation">En négociation</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Financement confirmé">Financement confirmé</SelectItem>
                    <SelectItem value="Ouvert aux propositions">Ouvert aux propositions</SelectItem>
                    <SelectItem value="Étude de faisabilité">Étude de faisabilité</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type de projet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="Villa individuelle">Villa individuelle</SelectItem>
                    <SelectItem value="Immeuble résidentiel">Immeuble résidentiel</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                    <SelectItem value="Rénovation">Rénovation</SelectItem>
                    <SelectItem value="Complexe résidentiel">Complexe résidentiel</SelectItem>
                    <SelectItem value="Bureau">Bureau</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filtres avancés
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filtres avancés (repliables) */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 p-6 bg-gray-50 rounded-lg"
                >
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Gamme de prix</Label>
                      <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les gammes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les gammes</SelectItem>
                          <SelectItem value="low">Moins de 50M FCFA</SelectItem>
                          <SelectItem value="medium">50M - 200M FCFA</SelectItem>
                          <SelectItem value="high">200M - 500M FCFA</SelectItem>
                          <SelectItem value="premium">Plus de 500M FCFA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Localisation</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les zones" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les zones</SelectItem>
                          <SelectItem value="almadies">Almadies</SelectItem>
                          <SelectItem value="sicap">Sicap</SelectItem>
                          <SelectItem value="vdn">VDN</SelectItem>
                          <SelectItem value="mermoz">Mermoz</SelectItem>
                          <SelectItem value="fann">Fann</SelectItem>
                          <SelectItem value="rufisque">Rufisque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Trier par</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="latest">Plus récents</SelectItem>
                          <SelectItem value="budget_high">Budget décroissant</SelectItem>
                          <SelectItem value="budget_low">Budget croissant</SelectItem>
                          <SelectItem value="deadline">Échéance proche</SelectItem>
                          <SelectItem value="proposals">Nombre de propositions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Liste des demandes */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredRequests.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Building2 className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                  Aucune demande trouvée
                </h3>
                <p className="text-gray-500 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                  setSelectedType('all');
                  setSelectedPriceRange('all');
                  setSelectedLocation('all');
                }}>
                  Réinitialiser les filtres
                </Button>
              </motion.div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredRequests.map((request, index) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    index={index}
                    viewMode={viewMode}
                    isFavorite={favorites.includes(request.id)}
                    onToggleFavorite={() => toggleFavorite(request.id)}
                    onViewDetails={() => navigate(`/construction-request/${request.id}`)}
                    getStatusInfo={getStatusInfo}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

// Composant de carte de demande
const RequestCard = ({ request, index, viewMode, isFavorite, onToggleFavorite, onViewDetails, getStatusInfo, getPriorityColor }) => {
  const statusInfo = getStatusInfo(request.status);
  const priorityColor = getPriorityColor(request.priority);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${priorityColor} overflow-hidden group cursor-pointer`}
      onClick={onViewDetails}
    >
      {viewMode === 'grid' ? (
        <>
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={request.image} 
              alt={request.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              {request.blockchain.tokenized && (
                <Badge className="bg-purple-100 text-purple-800">
                  <Blocks className="w-3 h-3 mr-1" />
                  Blockchain
                </Badge>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite();
                }}
                className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge className={statusInfo.color}>
                {statusInfo.icon}
                <span className="ml-1">{request.status}</span>
              </Badge>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {request.title}
              </h3>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{request.location}</span>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">{request.details.surface}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">{request.client.name}</span>
                {request.client.verified && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Échéance: {new Date(request.deadline).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>

            {/* Budget */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {(request.budget.estimated / 1000000).toFixed(0)}M FCFA
                </div>
                <div className="text-xs text-gray-600">
                  {(request.budget.min / 1000000).toFixed(0)}M - {(request.budget.max / 1000000).toFixed(0)}M FCFA
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{request.views} vues</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{request.proposals} propositions</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{request.timeline}</span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir détails
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  // Logique pour proposer
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        // Mode liste
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Image miniature */}
            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={request.image} 
                alt={request.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenu principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {request.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{request.location}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={statusInfo.color}>
                    {statusInfo.icon}
                    <span className="ml-1">{request.status}</span>
                  </Badge>
                  {request.blockchain.tokenized && (
                    <Badge className="bg-purple-100 text-purple-800">
                      <Blocks className="w-3 h-3 mr-1" />
                      Blockchain
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Budget</span>
                  <p className="font-semibold">{(request.budget.estimated / 1000000).toFixed(0)}M FCFA</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Surface</span>
                  <p className="font-semibold">{request.details.surface}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Délai</span>
                  <p className="font-semibold">{request.timeline}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Propositions</span>
                  <p className="font-semibold">{request.proposals}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Par {request.client.name}</span>
                  <span>â€¢</span>
                  <span>{new Date(request.created_date).toLocaleDateString('fr-FR')}</span>
                  <span>â€¢</span>
                  <span>{request.views} vues</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite();
                    }}
                    className={isFavorite ? 'text-red-500' : ''}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Proposer
                  </Button>
                  <Button size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Voir détails
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PromoterConstructionRequestsPage;


