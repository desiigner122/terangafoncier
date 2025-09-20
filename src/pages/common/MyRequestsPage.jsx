import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageSquare, 
  MapPin, 
  Building, 
  CreditCard, 
  Star,
  Filter,
  Search,
  MoreVertical,
  ArrowRight,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { useUser } from '@/hooks/useUserFixed';

const MyRequestsPage = () => {
  const { user, profile } = useUser();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Types de demandes avec leurs configurations
  const requestTypes = {
    terrain: { icon: MapPin, color: 'bg-green-500', title: 'Terrain' },
    construction: { icon: Building, color: 'bg-blue-500', title: 'Construction' },
    transaction: { icon: CreditCard, color: 'bg-purple-500', title: 'Transaction' },
    financing: { icon: Star, color: 'bg-yellow-500', title: 'Financement' },
    document: { icon: FileText, color: 'bg-gray-500', title: 'Document' },
    municipal: { icon: Building, color: 'bg-teal-500', title: 'Communal' }
  };

  // Statuts des demandes
  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-500', label: 'En attente', icon: Clock },
      approved: { color: 'bg-green-500', label: 'Approuvée', icon: CheckCircle },
      rejected: { color: 'bg-red-500', label: 'Rejetée', icon: XCircle },
      in_progress: { color: 'bg-blue-500', label: 'En cours', icon: RefreshCw },
      completed: { color: 'bg-emerald-500', label: 'Terminée', icon: CheckCircle }
    };
    return configs[status] || configs.pending;
  };

  // Données simulées
  const mockRequests = [
    {
      id: 1,
      type: 'terrain',
      title: 'Demande d\'achat - Terrain Almadies',
      description: 'Terrain résidentiel de 500m² situé à Almadies avec vue sur mer',
      status: 'pending',
      amount: '50,000,000 FCFA',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      recipient: {
        name: 'Amadou Diallo',
        role: 'VENDEUR',
        avatar: null
      },
      location: 'Almadies, Dakar',
      reference: 'REQ-2024-001'
    },
    {
      id: 2,
      type: 'construction',
      title: 'Projet de construction résidentielle',
      description: 'Construction d\'une villa moderne R+1 avec piscine',
      status: 'approved',
      amount: '85,000,000 FCFA',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      recipient: {
        name: 'Fatou Construction',
        role: 'PROMOTEUR',
        avatar: null
      },
      location: 'Cité Keur Gorgui',
      reference: 'REQ-2024-002'
    },
    {
      id: 3,
      type: 'financing',
      title: 'Demande de financement bancaire',
      description: 'Financement pour l\'achat d\'un terrain à usage commercial',
      status: 'in_progress',
      amount: '120,000,000 FCFA',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      recipient: {
        name: 'Banque Atlantique',
        role: 'BANQUE',
        avatar: null
      },
      location: 'Plateau, Dakar',
      reference: 'REQ-2024-003'
    },
    {
      id: 4,
      type: 'municipal',
      title: 'Attribution terrain communal',
      description: 'Demande d\'attribution d\'une parcelle communale pour habitation',
      status: 'completed',
      amount: '15,000,000 FCFA',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      recipient: {
        name: 'Mairie de Pikine',
        role: 'MAIRIE',
        avatar: null
      },
      location: 'Pikine Nord',
      reference: 'REQ-2024-004'
    },
    {
      id: 5,
      type: 'document',
      title: 'Vérification documents fonciers',
      description: 'Authentification des titres de propriété par un notaire',
      status: 'rejected',
      amount: '500,000 FCFA',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      recipient: {
        name: 'Me. Ousmane Sow',
        role: 'NOTAIRE',
        avatar: null
      },
      location: 'Cabinet Notarial',
      reference: 'REQ-2024-005'
    }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setRequests(mockRequests);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Fonction pour obtenir la couleur du rôle
  const getRoleColor = (role) => {
    const colors = {
      VENDEUR: 'bg-blue-500',
      PROMOTEUR: 'bg-purple-500',
      BANQUE: 'bg-green-500',
      MAIRIE: 'bg-teal-500',
      NOTAIRE: 'bg-orange-500',
      ADMIN: 'bg-red-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  // Filtrage des demandes
  const filteredRequests = requests.filter(request => {
    if (filter !== 'all' && request.status !== filter) return false;
    if (searchTerm && !request.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !request.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Statistiques
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
    return date.toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 px-4 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Demandes
          </h1>
          <p className="text-gray-600">Suivez l'état d'avancement de toutes vos demandes</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approuvées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejetées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.completed}</div>
            <div className="text-sm text-gray-600">Terminées</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher une demande..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="approved">Approuvées</TabsTrigger>
                <TabsTrigger value="rejected">Rejetées</TabsTrigger>
                <TabsTrigger value="completed">Terminées</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <div className="grid gap-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => {
            const typeConfig = requestTypes[request.type];
            const statusConfig = getStatusConfig(request.status);
            const TypeIcon = typeConfig.icon;
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {/* Avatar et icône */}
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={request.recipient.avatar} />
                            <AvatarFallback className={getRoleColor(request.recipient.role)}>
                              {request.recipient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${typeConfig.color} flex items-center justify-center`}>
                            <TypeIcon className="w-3 h-3 text-white" />
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900 truncate">
                              {request.title}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className={`${statusConfig.color} text-white`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {request.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {request.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(request.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="w-4 h-4" />
                              {request.amount}
                            </div>
                            <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {request.reference}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aucune demande trouvée
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === 'all' 
                  ? "Vous n'avez pas encore fait de demande" 
                  : `Aucune demande ${filter === 'pending' ? 'en attente' : filter === 'approved' ? 'approuvée' : filter === 'rejected' ? 'rejetée' : 'terminée'} trouvée`
                }
              </p>
              <Button>
                <FileText className="w-4 h-4 mr-2" />
                Créer une nouvelle demande
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default MyRequestsPage;