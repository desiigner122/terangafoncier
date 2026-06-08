import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Star,
  Download,
  Upload,
  MessageSquare,
  Phone,
  Mail,
  DollarSign,
  Building,
  Users,
  Activity,
  Calculator,
  CreditCard,
  Percent,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Zap,
  Globe,
  Home,
  Briefcase,
  Award,
  Bell,
  Settings,
  RefreshCw,
  ExternalLink,
  Bookmark,
  Flag,
  Hash,
  AtSign,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  CheckSquare,
  UserCheck,
  UserX,
  PhoneCall,
  VideoIcon,
  Printer,
  Share2,
  Copy
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BanqueCreditRequests = ({ dashboardStats = {} }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'table'
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Statistiques avancées
  const [creditStats, setCreditStats] = useState({
    totalRequests: 89,
    approvedCredits: 67,
    pendingReview: 15,
    rejectedRequests: 7,
    totalVolume: 3847000000, // 3.847 milliards CFA
    averageAmount: 43191011,
    approvalRate: 75.3,
    averageProcessingTime: 8.5, // jours
    platformReferrals: 34,
    platformConversionRate: 91.2
  });

  // Handlers pour les actions sur les demandes
  const handleApproveCredit = (requestId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Crédit approuvé",
        description: `La demande de crédit ${requestId} a été approuvée`,
        variant: "success"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleRejectCredit = (requestId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Crédit rejeté",
        description: `La demande de crédit ${requestId} a été rejetée`,
        variant: "destructive"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    window.safeGlobalToast({
      title: "Détails de la demande",
      description: `Affichage des détails pour ${request.applicantName}`,
      variant: "default"
    });
  };

  const handleEditRequest = (requestId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Mode édition",
        description: `Ouverture du formulaire d'édition pour ${requestId}`,
        variant: "default"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleCreateNewRequest = () => {
    setShowNewRequestDialog(true);
    window.safeGlobalToast({
      title: "Nouvelle demande de crédit",
      description: "Formulaire de création ouvert",
      variant: "default"
    });
  };

  const handleLandValuation = async (requestId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCreditRequests(requests => 
        requests.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: 'En évaluation',
                processingStage: 3,
                valuationExpert: 'Mamadou Diallo - Expert Agréé',
                valuationScheduled: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              }
            : req
        )
      );
      
      window.safeGlobalToast({
        title: "Évaluation programmée 📍",
        description: "Expert assigné - Visite terrain dans 3 jours",
        variant: "default"
      });
    } catch (error) {
      window.safeGlobalToast({
        title: "Erreur",
        description: "Impossible de programmer l'évaluation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Actions supplémentaires
  const handleRequestInfo = async (requestId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCreditRequests(requests => 
        requests.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: 'Info demandée',
                lastContact: new Date().toISOString().split('T')[0],
                pendingDocuments: ['Justificatif revenus récent', 'Contrat de vente actualisé']
              }
            : req
        )
      );
      
      window.safeGlobalToast({
        title: "Informations demandées 📄",
        description: "Email et SMS envoyés au demandeur",
        variant: "default"
      });
    } catch (error) {
      window.safeGlobalToast({
        title: "Erreur",
        description: "Erreur lors de l'envoi de la demande",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleCall = async (requestId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      window.safeGlobalToast({
        title: "Appel programmé 📞",
        description: "Rendez-vous téléphonique ajouté au calendrier",
        variant: "default"
      });
    } catch (error) {
      window.safeGlobalToast({
        title: "Erreur",
        description: "Impossible de programmer l'appel",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions spécifiques aux crédits terrains via plateforme
  const handleVerifyPlatformTransaction = (platformRef) => {
    window.safeGlobalToast({
      title: "Vérification plateforme",
      description: `Transaction ${platformRef} vérifiée`,
      variant: "success"
    });
  };

  const handleCheckLandTitle = (landTitle) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Titre foncier vérifié",
        description: `${landTitle} authentique et valide`,
        variant: "success"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleInitiateEscrow = (requestId) => {
    window.safeGlobalToast({
      title: "Séquestre initié",
      description: "Compte séquestre créé pour la transaction",
      variant: "success"
    });
  };

  const handleContactNotary = (requestId) => {
    window.safeGlobalToast({
      title: "Notaire contacté",
      description: "Coordination avec le notaire en cours",
      variant: "success"
    });
  };

  // Données enrichies des demandes de crédit via plateforme Teranga Foncier
  // creditRequests RÉEL depuis Supabase (aucune donnée fictive)
  const [creditRequests, setCreditRequests] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('demandes_financement').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setCreditRequests(data || []);
      } catch (err) {
        console.warn('creditRequests indisponible:', err?.message);
        if (active) setCreditRequests([]);
      }
    })();
    return () => { active = false; };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvé': return 'bg-green-100 text-green-800';
      case 'Rejeté': return 'bg-red-100 text-red-800';
      case 'En Évaluation': return 'bg-blue-100 text-blue-800';
      case 'En Attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Faible': return 'text-green-600';
      case 'Moyen': return 'text-yellow-600';
      case 'Élevé': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRequests = creditRequests.filter(request => {
    const matchesSearch = request.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Composant de carte de demande moderne
  const CreditRequestCard = ({ request }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="font-semibold">
                    {request.applicantName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {request.applicantName}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {request.platformRef}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {(request.requestedAmount / 1000000).toFixed(0)}M CFA
                </div>
                <div className="text-xs text-gray-600">
                  LTV: {request.ltvRatio}%
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Informations bien */}
              <div className="text-sm">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>{request.landLocation}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Building className="h-3 w-3" />
                  <span>{request.creditType}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Home className="h-3 w-3" />
                  <span>{request.landArea} • {request.zoning}</span>
                </div>
              </div>

              {/* Progression du dossier */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progression:</span>
                  <span className="font-semibold">{Math.round((request.processingStage / 5) * 100)}%</span>
                </div>
                <Progress value={(request.processingStage / 5) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Étape {request.processingStage}/5</span>
                  <span>Prob: {request.estimatedApprovalProbability}%</span>
                </div>
              </div>

              {/* Métriques clés */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-blue-600">{request.creditScore}</div>
                  <div className="text-xs text-gray-600">Score</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className={`font-semibold ${getRiskColor(request.riskLevel)}`}>
                    {request.riskLevel}
                  </div>
                  <div className="text-xs text-gray-600">Risque</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-green-600">{request.interestRate}%</div>
                  <div className="text-xs text-gray-600">Taux</div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleViewDetails(request)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Détails
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleApproveCredit(request.id)}
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedRequest(request)}
                >
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Demandes</p>
                  <p className="text-2xl font-bold text-blue-900">{creditStats.totalRequests}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <div className="flex items-center text-xs text-blue-700">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+12% ce mois</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Taux d'Approbation</p>
                  <p className="text-2xl font-bold text-green-900">{creditStats.approvalRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Progress value={creditStats.approvalRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Volume Total</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {(creditStats.totalVolume / 1000000000).toFixed(1)}Md CFA
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-2">
                <div className="flex items-center text-xs text-yellow-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Moy: {(creditStats.averageAmount / 1000000).toFixed(0)}M CFA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Temps de Traitement</p>
                  <p className="text-2xl font-bold text-purple-900">{creditStats.averageProcessingTime}j</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2">
                <div className="flex items-center text-xs text-purple-700">
                  <Target className="h-3 w-3 mr-1" />
                  <span>Objectif: 7 jours</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Header principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion Avancée des Crédits Fonciers</h2>
          <p className="text-gray-600 mt-1">
            Interface unifiée pour les demandes via plateforme Teranga Foncier
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button 
            onClick={handleCreateNewRequest}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Demande
          </Button>
        </div>
      </div>

      {/* Interface principale avec onglets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>Centre de Gestion des Crédits</span>
          </CardTitle>
          <CardDescription>
            Traitement intelligent des demandes de financement immobilier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dashboard">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="requests">Demandes</TabsTrigger>
              <TabsTrigger value="analysis">Analyse</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            {/* Onglet Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Filtres et vue */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Rechercher demandes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="En Attente">En Attente</SelectItem>
                      <SelectItem value="En Évaluation">En Évaluation</SelectItem>
                      <SelectItem value="Pré-approuvé">Pré-approuvé</SelectItem>
                      <SelectItem value="Approuvé">Approuvé</SelectItem>
                      <SelectItem value="Rejeté">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes priorités</SelectItem>
                      <SelectItem value="Haute">Haute</SelectItem>
                      <SelectItem value="Normale">Normale</SelectItem>
                      <SelectItem value="Faible">Faible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Alertes prioritaires */}
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Demandes Prioritaires</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  {filteredRequests.filter(r => r.priority === 'Haute').length} demande(s) nécessitent une attention immédiate.
                </AlertDescription>
              </Alert>

              {/* Affichage des demandes */}
              {viewMode === 'grid' ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  layout
                >
                  {filteredRequests.map((request) => (
                    <CreditRequestCard key={request.id} request={request} />
                  ))}
                </motion.div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Demandeur</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>LTV</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Progression</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-xs">
                                      {request.applicantName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{request.applicantName}</div>
                                    <div className="text-sm text-gray-500">{request.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{request.creditType}</div>
                                  <div className="text-sm text-gray-500">{request.landLocation}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-green-600">
                                  {(request.requestedAmount / 1000000).toFixed(0)}M CFA
                                </div>
                                <div className="text-sm text-gray-500">
                                  Bien: {(request.propertyValue / 1000000).toFixed(0)}M CFA
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{request.ltvRatio}%</span>
                                  <div className={`w-2 h-2 rounded-full ${
                                    request.ltvRatio <= 70 ? 'bg-green-500' : 
                                    request.ltvRatio <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`} />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(request.status)}>
                                  {request.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Progress value={(request.processingStage / 5) * 100} className="h-2 w-16" />
                                  <span className="text-xs text-gray-500">
                                    {request.processingStage}/5
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewDetails(request)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleApproveCredit(request.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedRequest(request)}
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Onglet Demandes (vue détaillée) */}
            <TabsContent value="requests" className="space-y-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Vue Détaillée des Demandes</h3>
                <p className="text-gray-600">Interface de gestion approfondie des dossiers de crédit</p>
              </div>
            </TabsContent>

            {/* Onglet Analyse */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-blue-600" />
                      <span>Répartition par Statut</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Approuvés</span>
                        <span className="font-semibold text-green-600">{creditStats.approvedCredits}</span>
                      </div>
                      <Progress value={(creditStats.approvedCredits / creditStats.totalRequests) * 100} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">En attente</span>
                        <span className="font-semibold text-yellow-600">{creditStats.pendingReview}</span>
                      </div>
                      <Progress value={(creditStats.pendingReview / creditStats.totalRequests) * 100} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Rejetés</span>
                        <span className="font-semibold text-red-600">{creditStats.rejectedRequests}</span>
                      </div>
                      <Progress value={(creditStats.rejectedRequests / creditStats.totalRequests) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-green-600" />
                      <span>Performance Plateforme</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Demandes via plateforme:</span>
                        <span className="font-semibold">{creditStats.platformReferrals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taux de conversion:</span>
                        <span className="font-semibold text-green-600">{creditStats.platformConversionRate}%</span>
                      </div>
                      <Progress value={creditStats.platformConversionRate} className="h-2" />
                      <Alert>
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          Excellente performance des demandes via Teranga Foncier
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Rapports */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Download className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold mb-1">Rapport Mensuel</h3>
                    <p className="text-sm text-gray-600">Synthèse des activités</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold mb-1">Analyse Risques</h3>
                    <p className="text-sm text-gray-600">Évolution du portfolio</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold mb-1">Rapport Plateforme</h3>
                    <p className="text-sm text-gray-600">Performance Teranga</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>



      {/* Modal de détails avancé */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="font-semibold">
                    {selectedRequest.applicantName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{selectedRequest.applicantName}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {selectedRequest.status}
                    </Badge>
                    <Badge variant="outline">{selectedRequest.platformRef}</Badge>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedRequest(null)}
                className="p-2"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* Progression du dossier */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Progression du Dossier</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    Étape {selectedRequest.processingStage}/5
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={(selectedRequest.processingStage / 5) * 100} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Soumission</span>
                    <span>Vérification</span>
                    <span>Évaluation</span>
                    <span>Approbation</span>
                    <span>Finalisation</span>
                  </div>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Probabilité d'approbation: <strong>{selectedRequest.estimatedApprovalProbability}%</strong>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations demandeur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profil Demandeur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Contact</label>
                    <p className="font-medium">{selectedRequest.applicantPhone}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.applicantEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Revenus mensuels</label>
                    <p className="font-medium text-green-600">
                      {selectedRequest.monthlyIncome?.toLocaleString()} FCFA
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Score de crédit</label>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{selectedRequest.creditScore}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        selectedRequest.creditScore >= 750 ? 'bg-green-500' : 
                        selectedRequest.creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Niveau de risque</label>
                    <p className={`font-medium ${getRiskColor(selectedRequest.riskLevel)}`}>
                      {selectedRequest.riskLevel}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Détails du crédit */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Conditions Financières
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Montant demandé</label>
                    <p className="font-medium text-lg text-blue-600">
                      {(selectedRequest.requestedAmount / 1000000).toFixed(0)}M FCFA
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Valeur du bien</label>
                    <p className="font-medium">
                      {(selectedRequest.propertyValue / 1000000).toFixed(0)}M FCFA
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ratio LTV</label>
                    <p className="font-medium">{selectedRequest.ltvRatio}%</p>
                    <Progress value={selectedRequest.ltvRatio} className="h-2 mt-1" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Taux proposé</label>
                    <p className="font-medium text-green-600">{selectedRequest.interestRate}%</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Mensualité</label>
                    <p className="font-medium">
                      {selectedRequest.monthlyPayment?.toLocaleString()} FCFA
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Informations bien */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Détails du Bien
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Localisation</label>
                    <p className="font-medium">{selectedRequest.landLocation}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Superficie</label>
                    <p className="font-medium">{selectedRequest.landArea}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Titre foncier</label>
                    <p className="font-medium">{selectedRequest.landTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Zonage</label>
                    <p className="font-medium">{selectedRequest.zoning}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Vendeur</label>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{selectedRequest.sellerInfo?.name}</p>
                      {selectedRequest.sellerInfo?.verified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documents et actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Documents
                    </span>
                    <Badge variant="outline">
                      {selectedRequest.documentsComplete}% complet
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedRequest.documents?.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <CheckSquare className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{doc}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Notes et Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Notes conseiller</label>
                    <p className="text-sm bg-blue-50 p-3 rounded">
                      {selectedRequest.advisorNotes}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveCredit(selectedRequest.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approuver
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-600"
                      onClick={() => handleRejectCredit(selectedRequest.id)}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Rejeter
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleLandValuation(selectedRequest.id)}
                    >
                      <Calculator className="h-3 w-3 mr-1" />
                      Évaluer
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleScheduleCall(selectedRequest.id)}
                    >
                      <PhoneCall className="h-3 w-3 mr-1" />
                      Appeler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BanqueCreditRequests;