import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthProvider';
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
  PaintBucket,
  Truck,
  HardHat,
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
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const PromoterConstructionRequestsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // États pour les demandes
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // États pour nouvelle demande
  const [newRequest, setNewRequest] = useState({
    title: '',
    type: '',
    description: '',
    location: '',
    budget_min: '',
    budget_max: '',
    timeline: '',
    target_audience: '',
    contact_preference: 'email',
    urgent: false
  });

  // Données mockées des demandes de construction
  useEffect(() => {
    const mockRequests = [
      {
        id: 'REQ-001',
        title: 'Construction Villa Moderne - Almadies',
        type: 'Villa individuelle',
        status: 'En attente de réponses',
        created_date: '2024-11-10',
        client: {
          name: 'Mamadou Diallo',
          type: 'Particulier - Diaspora',
          location: 'Paris, France',
          phone: '+33 6 12 34 56 78',
          email: 'mamadou.diallo@email.com',
          budget_range: '80-120M FCFA',
          timeline: '12-18 mois'
        },
        project_details: {
          location: 'Almadies, Dakar',
          surface_terrain: '400m²',
          surface_construction: '200m²',
          rooms: '4 chambres + salon + cuisine',
          special_requirements: ['Piscine', 'Garage 2 voitures', 'Panneaux solaires'],
          style: 'Moderne avec terrasse'
        },
        budget: {
          min: 80000000,
          max: 120000000,
          includes: ['Études', 'Construction', 'Finitions', 'Aménagements extérieurs']
        },
        timeline: '18 mois',
        responses: 8,
        status_details: {
          published: '2024-11-10',
          response_deadline: '2024-11-25',
          decision_expected: '2024-12-01'
        },
        attachments: [
          { name: 'Titre foncier', type: 'PDF', verified: true },
          { name: 'Plans souhaités', type: 'PDF', verified: false },
          { name: 'Photos du terrain', type: 'Images', verified: true }
        ],
        priority: 'high'
      },
      {
        id: 'REQ-002',
        title: 'Rénovation Maison Familiale - Plateau',
        type: 'Rénovation',
        status: 'Promoteur sélectionné',
        created_date: '2024-10-28',
        client: {
          name: 'Aïssa Sarr',
          type: 'Particulier - Résident',
          location: 'Dakar, Sénégal',
          phone: '+221 77 123 45 67',
          email: 'aissa.sarr@email.sn',
          budget_range: '25-40M FCFA',
          timeline: '6-8 mois'
        },
        project_details: {
          location: 'Plateau, Dakar',
          surface_terrain: '300m²',
          surface_construction: '150m² (existante)',
          rooms: 'Extension 2 chambres + rénovation complète',
          special_requirements: ['Extension arrière', 'Modernisation électricité', 'Nouvelle cuisine'],
          style: 'Conservation style colonial'
        },
        budget: {
          min: 25000000,
          max: 40000000,
          includes: ['Démolition partielle', 'Extension', 'Rénovation', 'Peinture']
        },
        timeline: '8 mois',
        responses: 12,
        selected_promoter: {
          name: 'Renovation Pro Sénégal',
          rating: 4.7,
          phone: '+221 70 987 65 43'
        },
        status_details: {
          published: '2024-10-28',
          selected_date: '2024-11-05',
          work_start: '2024-11-15',
          expected_completion: '2024-07-15'
        },
        current_progress: 15,
        priority: 'medium'
      },
      {
        id: 'REQ-003',
        title: 'Construction Duplex Familial - Keur Massar',
        type: 'Duplex',
        status: 'Travaux en cours',
        created_date: '2024-09-15',
        client: {
          name: 'Ousmane Ba',
          type: 'Investisseur',
          location: 'Dakar, Sénégal',
          phone: '+221 76 555 44 33',
          email: 'ousmane.ba@invest.sn',
          budget_range: '60-85M FCFA',
          timeline: '10-12 mois'
        },
        project_details: {
          location: 'Keur Massar, Pikine',
          surface_terrain: '250m²',
          surface_construction: '180m²',
          rooms: '6 chambres + 2 salons + 2 cuisines',
          special_requirements: ['Entrées indépendantes', 'Compteurs séparés', 'Terrasses'],
          style: 'Duplex locatif optimisé'
        },
        budget: {
          min: 60000000,
          max: 85000000,
          includes: ['Construction complète', 'Finitions standard', 'Branchements']
        },
        timeline: '12 mois',
        responses: 15,
        selected_promoter: {
          name: 'BTP Keur Massar',
          rating: 4.5,
          phone: '+221 77 444 33 22'
        },
        status_details: {
          published: '2024-09-15',
          selected_date: '2024-09-30',
          work_start: '2024-10-15',
          expected_completion: '2024-10-15'
        },
        current_progress: 35,
        priority: 'medium'
      },
      {
        id: 'REQ-004',
        title: 'Immeuble Locatif 8 Appartements - Guediawaye',
        type: 'Immeuble locatif',
        status: 'Nouveau',
        created_date: '2024-11-15',
        client: {
          name: 'Fatou Ndiaye',
          type: 'Investisseur - Diaspora',
          location: 'New York, USA',
          phone: '+1 555 123 4567',
          email: 'fatou.ndiaye@invest.us',
          budget_range: '150-200M FCFA',
          timeline: '18-24 mois'
        },
        project_details: {
          location: 'Guediawaye, Pikine',
          surface_terrain: '600m²',
          surface_construction: '480m²',
          rooms: '8 appartements T2 et T3',
          special_requirements: ['Parking collectif', 'Compteurs individuels', 'Conciergerie'],
          style: 'Moderne avec espaces verts'
        },
        budget: {
          min: 150000000,
          max: 200000000,
          includes: ['Étude complète', 'Construction', 'Finitions', 'Aménagements', 'Branchements']
        },
        timeline: '24 mois',
        responses: 3,
        status_details: {
          published: '2024-11-15',
          response_deadline: '2024-12-01',
          decision_expected: '2024-12-15'
        },
        priority: 'high'
      }
    ];

    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
  }, []);

  // Filtrage et tri
  useEffect(() => {
    let filtered = requests.filter(request => {
      const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.project_details.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
      const matchesType = selectedType === 'all' || request.type === selectedType;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Tri
    if (sortBy === 'latest') {
      filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (sortBy === 'budget_high') {
      filtered.sort((a, b) => b.budget.max - a.budget.max);
    } else if (sortBy === 'deadline') {
      filtered.sort((a, b) => {
        const deadlineA = a.status_details.response_deadline || '9999-12-31';
        const deadlineB = b.status_details.response_deadline || '9999-12-31';
        return new Date(deadlineA) - new Date(deadlineB);
      });
    }

    setFilteredRequests(filtered);
  }, [requests, searchTerm, selectedStatus, selectedType, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Nouveau': return 'bg-blue-100 text-blue-800';
      case 'En attente de réponses': return 'bg-yellow-100 text-yellow-800';
      case 'Promoteur sélectionné': return 'bg-green-100 text-green-800';
      case 'Travaux en cours': return 'bg-purple-100 text-purple-800';
      case 'Terminé': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const handleSubmitProposal = (requestId) => {
    navigate(`/promoter/submit-proposal/${requestId}`);
  };

  const renderRequestCard = (request) => (
    <motion.div
      key={request.id}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 ${getPriorityColor(request.priority)}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{request.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {request.project_details.location}
              </span>
              <span className="flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                {request.type}
              </span>
            </div>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
            <div className="text-xs text-gray-500 mt-1">
              Publié le {new Date(request.created_date).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-sm mb-2">Client</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Nom:</span>
              <div className="font-medium">{request.client.name}</div>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <div className="font-medium">{request.client.type}</div>
            </div>
            <div>
              <span className="text-gray-600">Localisation:</span>
              <div className="font-medium">{request.client.location}</div>
            </div>
            <div>
              <span className="text-gray-600">Budget:</span>
              <div className="font-medium text-green-600">{request.client.budget_range}</div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Détails du Projet</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Surface terrain:</span>
              <div className="font-medium">{request.project_details.surface_terrain}</div>
            </div>
            <div>
              <span className="text-gray-600">Surface construction:</span>
              <div className="font-medium">{request.project_details.surface_construction}</div>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Configuration:</span>
              <div className="font-medium">{request.project_details.rooms}</div>
            </div>
          </div>
          
          {request.project_details.special_requirements && (
            <div className="mt-3">
              <span className="text-gray-600 text-sm">Exigences spéciales:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {request.project_details.special_requirements.map((req, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Budget et Timeline */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-green-600">
              {formatPrice(request.budget.min)} - {formatPrice(request.budget.max)}
            </div>
            <div className="text-xs text-gray-600">Budget</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-blue-600">{request.timeline}</div>
            <div className="text-xs text-gray-600">Délai souhaité</div>
          </div>
        </div>

        {/* Progress (si travaux en cours) */}
        {request.status === 'Travaux en cours' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Avancement</span>
              <span className="font-semibold text-purple-600">{request.current_progress}%</span>
            </div>
            <Progress value={request.current_progress} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              Fin prévue: {new Date(request.status_details.expected_completion).toLocaleDateString('fr-FR')}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            {request.responses} réponse(s)
          </span>
          {request.status_details.response_deadline && (
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Échéance: {new Date(request.status_details.response_deadline).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {request.status === 'Nouveau' || request.status === 'En attente de réponses' ? (
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => handleSubmitProposal(request.id)}
            >
              <Send className="w-4 h-4 mr-2" />
              Soumettre Proposition
            </Button>
          ) : (
            <Button 
              className="flex-1"
              variant="outline"
              onClick={() => {
                setSelectedRequest(request);
                setShowDetailsModal(true);
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Voir Détails
            </Button>
          )}
          
          <Button variant="outline" size="icon">
            <Heart className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Demandes de Construction | Promoteurs - Teranga Foncier</title>
        <meta name="description" content="Découvrez les demandes de construction des particuliers et investisseurs. Soumettez vos propositions et développez votre activité." />
      </Helmet>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Demandes de Construction</h1>
              <p className="text-gray-600 mt-2">Trouvez de nouveaux projets et développez votre activité</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">
                {filteredRequests.length} demande(s)
              </Badge>
              <Button
                onClick={() => setShowNewRequestModal(true)}
                className="bg-gradient-to-r from-green-600 to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Publier une Demande
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filtres et recherche */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Villa individuelle">Villa individuelle</SelectItem>
                  <SelectItem value="Duplex">Duplex</SelectItem>
                  <SelectItem value="Immeuble locatif">Immeuble locatif</SelectItem>
                  <SelectItem value="Rénovation">Rénovation</SelectItem>
                </SelectContent>
              </Select>

              {/* Statut */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="Nouveau">Nouveau</SelectItem>
                  <SelectItem value="En attente de réponses">En attente</SelectItem>
                  <SelectItem value="Promoteur sélectionné">Sélectionné</SelectItem>
                  <SelectItem value="Travaux en cours">En cours</SelectItem>
                </SelectContent>
              </Select>

              {/* Tri */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Plus récents</SelectItem>
                  <SelectItem value="budget_high">Budget décroissant</SelectItem>
                  <SelectItem value="deadline">Échéance proche</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des demandes */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
            <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map(renderRequestCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoterConstructionRequestsPage;
