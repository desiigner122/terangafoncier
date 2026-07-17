import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  PaintBucket,
  Truck,
  HardHat,
  Wrench,
  ShoppingCart,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';

const PromoterProjectsPage = () => {
  const navigate = useNavigate();

  // États pour les projets
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Chargement des projets depuis Supabase (table developer_projects)
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('developer_projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Erreur chargement developer_projects:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fonction de filtrage
  useEffect(() => {
    let filtered = projects.filter(project => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (project.title || '').toLowerCase().includes(search) ||
                           (project.location || '').toLowerCase().includes(search) ||
                           (project.promoter?.name || '').toLowerCase().includes(search) ||
                           (project.client || '').toLowerCase().includes(search);

      const matchesType = selectedType === 'all' || project.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      const matchesRegion = selectedRegion === 'all' || (project.location || '').includes(selectedRegion);

      return matchesSearch && matchesType && matchesStatus && matchesRegion;
    });

    // Tri
    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (sortBy === 'price_low') {
      filtered.sort((a, b) => (Number(a.budget) || 0) - (Number(b.budget) || 0));
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => (Number(b.budget) || 0) - (Number(a.budget) || 0));
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedType, selectedStatus, selectedRegion, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pré-commercialisation': return 'bg-blue-100 text-blue-800';
      case 'En construction': return 'bg-yellow-100 text-yellow-800';
      case 'Prêt à livrer': return 'bg-green-100 text-green-800';
      case 'Livré': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Play className="w-4 h-4 text-blue-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderProjectCard = (project) => (
    <motion.div
      key={project.id}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      {/* Image principale */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
        {(project.images && project.images.length > 0) ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-12 h-12 text-blue-300" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className={getStatusColor(project.status)}>
            {project.status || 'Non renseigné'}
          </Badge>
        </div>
        {(project.available_units != null && project.total_units != null) && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-black bg-opacity-70 text-white">
              <Building2 className="w-3 h-3 mr-1" />
              {project.available_units}/{project.total_units} disponibles
            </Badge>
          </div>
        )}
        {project.promoter?.rating != null && (
          <div className="absolute bottom-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1">
            <div className="flex items-center text-xs">
              <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
              {project.promoter.rating}
            </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{project.title || 'Sans titre'}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {project.location || 'Localisation non renseignée'}
          </div>
          <div className="text-xs text-gray-500">
            {project.promoter?.name
              ? `Par ${project.promoter.name}`
              : (project.client ? `Client: ${project.client}` : '—')}
          </div>
        </div>

        {/* Progress construction */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Avancement</span>
            <span className="font-semibold text-blue-600">
              {project.progress != null ? `${project.progress}%` : '—'}
            </span>
          </div>
          <Progress value={project.progress || 0} className="h-2" />
          <div className="text-xs text-gray-500 mt-1">
            Livraison prévue: {project.estimated_completion
              ? new Date(project.estimated_completion).toLocaleDateString('fr-FR')
              : 'Non renseignée'}
          </div>
          {project.current_phase && (
            <div className="text-xs text-gray-500 mt-1">
              Phase actuelle: {project.current_phase}
            </div>
          )}
        </div>

        {/* Prix / Budget */}
        <div className="mb-4">
          <div className="text-sm text-gray-600">Budget du projet</div>
          <div className="text-xl font-bold text-green-600">
            {project.budget != null ? formatPrice(Number(project.budget)) : '—'}
          </div>
          {project.price_range?.max > project.price_range?.min && (
            <div className="text-sm text-gray-500">
              jusqu'à {formatPrice(project.price_range.max)}
            </div>
          )}
        </div>

        {/* Type de biens */}
        {(project.apartment_types || project.villa_types || project.office_types) && (
          <div className="mb-4">
            <div className="text-xs text-gray-600 mb-1">Types disponibles:</div>
            <div className="flex flex-wrap gap-1">
              {(project.apartment_types || project.villa_types || project.office_types || []).slice(0, 2).map((type, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {type.type}
                </Badge>
              ))}
              {(project.apartment_types || project.villa_types || project.office_types || []).length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{(project.apartment_types || project.villa_types || project.office_types || []).length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir Détails
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        {/* Buyer flow CTAs */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Button
            variant="outline"
            onClick={() => navigate('/promoters/purchase-units')}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Acheter logement
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/promoters/payment-plans')}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Plan de paiement
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Projets Immobiliers des Promoteurs | Teranga Foncier</title>
  <meta name="description" content="Découvrez les projets immobiliers en cours et à venir des promoteurs partenaires. Précommandez votre appartement ou villa en construction." />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projets des Promoteurs</h1>
              <p className="text-gray-600 mt-2">Précommandez dans les nouveaux projets immobiliers</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">
                {filteredProjects.length} projet(s)
              </Badge>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* Sidebar Filtres */}
          <div className="w-80 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recherche */}
                <div>
                  <label className="block text-sm font-medium mb-2">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Projet, promoteur, ville..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Type de projet */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type de projet</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="Immeuble d'appartements">Immeubles</SelectItem>
                      <SelectItem value="Lotissement villas">Lotissements</SelectItem>
                      <SelectItem value="Immeuble commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium mb-2">Statut</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="Pré-commercialisation">Pré-commercialisation</SelectItem>
                      <SelectItem value="En construction">En construction</SelectItem>
                      <SelectItem value="Prêt à livrer">Prêt à livrer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Région */}
                <div>
                  <label className="block text-sm font-medium mb-2">Région</label>
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les régions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les régions</SelectItem>
                      <SelectItem value="Dakar">Dakar</SelectItem>
                      <SelectItem value="Pikine">Pikine</SelectItem>
                      <SelectItem value="Thiès">Thiès</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tri */}
                <div>
                  <label className="block text-sm font-medium mb-2">Trier par</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Plus récents</SelectItem>
                      <SelectItem value="price_low">Prix croissant</SelectItem>
                      <SelectItem value="price_high">Prix décroissant</SelectItem>
                      <SelectItem value="progress">Avancement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                  setSelectedRegion('all');
                  setSortBy('latest');
                }}>
                  Réinitialiser
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-10 h-10 text-blue-500 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Chargement des projets...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              projects.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet disponible pour le moment</h3>
                  <p className="text-gray-600">Les nouveaux projets des promoteurs apparaîtront ici dès leur publication.</p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
                  <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                </div>
              )
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}>
                {filteredProjects.map(renderProjectCard)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoterProjectsPage;
