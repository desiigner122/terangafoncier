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
  Flag,
  Building,
  Users,
  Activity
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

const MairieCommunalRequests = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handlers pour les actions sur les demandes
  const handleApproveRequest = (requestId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Demande approuvée",
        description: `La demande ${requestId} a été approuvée avec succès`,
        variant: "success"
      });
      setIsLoading(false);
      // Ici on mettrait à jour la base de données
    }, 1500);
  };

  const handleRejectRequest = (requestId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Demande rejetée",
        description: `La demande ${requestId} a été rejetée`,
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
      title: "Nouvelle demande",
      description: "Formulaire de création ouvert",
      variant: "default"
    });
  };

  // Données des demandes communales
  const [communalRequests, setCommunalRequests] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('communal_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setCommunalRequests(data || []);
      } catch (err) {
        console.warn('Demandes communales indisponibles:', err?.message);
        if (active) setCommunalRequests([]);
      }
    })();
    return () => { active = false; };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvé': return 'bg-green-100 text-green-800 border-green-200';
      case 'En Évaluation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'En Attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Rejeté': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'bg-red-500';
      case 'Moyenne': return 'bg-orange-500';
      case 'Normale': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAIScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredRequests = communalRequests.filter(request => {
    const matchesSearch = request.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.requestType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getRequestsByStatus = (status) => {
    if (status === 'all') return filteredRequests;
    return filteredRequests.filter(request => request.status === status);
  };

  const RequestDetailsDialog = () => (
    <Dialog open={selectedRequest !== null} onOpenChange={() => setSelectedRequest(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedRequest && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Détails de la Demande {selectedRequest.id}</span>
                <Badge className={`${getStatusColor(selectedRequest.status)} border`}>
                  {selectedRequest.status}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Soumise le {new Date(selectedRequest.submissionDate).toLocaleDateString('fr-FR')}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Informations demandeur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    Informations Demandeur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom complet</label>
                    <p className="text-gray-900">{selectedRequest.applicantName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Téléphone</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-green-600" />
                      {selectedRequest.applicantPhone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      {selectedRequest.applicantEmail}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Détails de la demande */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Building className="h-5 w-5 text-green-600 mr-2" />
                    Détails Demande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type de demande</label>
                    <p className="text-gray-900">{selectedRequest.requestType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Surface demandée</label>
                    <p className="text-gray-900">{selectedRequest.requestedArea}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Zone</label>
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                      {selectedRequest.zone}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Objet</label>
                    <p className="text-gray-900">{selectedRequest.purpose}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Évaluation IA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Star className="h-5 w-5 text-yellow-600 mr-2" />
                    Évaluation IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl font-bold text-gray-900">
                      {selectedRequest.aiScore}%
                    </div>
                    <div className={`text-sm font-medium ${getAIScoreColor(selectedRequest.aiScore)}`}>
                      Score de compatibilité
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priorité</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedRequest.priority)}`} />
                      <span className="text-gray-900">{selectedRequest.priority}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Délai estimé</label>
                    <p className="text-gray-900">{selectedRequest.estimatedProcessingDays} jours</p>
                  </div>
                </CardContent>
              </Card>

              {/* Progression */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 text-purple-600 mr-2" />
                    Progression
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Étape actuelle</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedRequest.currentStep} / {selectedRequest.totalSteps}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(selectedRequest.currentStep / selectedRequest.totalSteps) * 100}%` }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Consultation voisinage</label>
                    <p className="text-gray-900">{selectedRequest.neighborConsultation}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    Documents Fournis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedRequest.documents.map((doc, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
                      >
                        <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-900 flex-1">{doc}</span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Commentaires évaluateur */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageSquare className="h-5 w-5 text-orange-600 mr-2" />
                    Commentaires d'Évaluation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-900">{selectedRequest.evaluatorComments}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">
                        Contraintes légales
                      </label>
                      <div className="space-y-2">
                        {selectedRequest.legalConstraints.map((constraint, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-gray-700">{constraint}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApproveRequest(selectedRequest.id)}
                        disabled={isLoading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-red-600 text-red-600 hover:bg-red-50"
                        onClick={() => handleRejectRequest(selectedRequest.id)}
                        disabled={isLoading}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          window.safeGlobalToast({
                            title: "Complément demandé",
                            description: "Demande de documents complémentaires envoyée",
                            variant: "default"
                          });
                        }}
                        disabled={isLoading}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Demander Complément
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Demandes Communales</h2>
          <p className="text-gray-600 mt-1">
            Gestion des demandes d'attribution foncière communale
          </p>
        </div>
        
        <Button 
          onClick={handleCreateNewRequest}
          className="bg-teal-600 hover:bg-teal-700 mt-4 lg:mt-0"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Demande
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, ID ou type de demande..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="En Attente">En Attente</SelectItem>
                <SelectItem value="En Évaluation">En Évaluation</SelectItem>
                <SelectItem value="Approuvé">Approuvé</SelectItem>
                <SelectItem value="Rejeté">Rejeté</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="Haute">Haute</SelectItem>
                <SelectItem value="Moyenne">Moyenne</SelectItem>
                <SelectItem value="Normale">Normale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Onglets par statut */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Toutes ({filteredRequests.length})
          </TabsTrigger>
          <TabsTrigger value="En Attente">
            En Attente ({getRequestsByStatus('En Attente').length})
          </TabsTrigger>
          <TabsTrigger value="En Évaluation">
            En Évaluation ({getRequestsByStatus('En Évaluation').length})
          </TabsTrigger>
          <TabsTrigger value="Approuvé">
            Approuvées ({getRequestsByStatus('Approuvé').length})
          </TabsTrigger>
          <TabsTrigger value="Rejeté">
            Rejetées ({getRequestsByStatus('Rejeté').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Demandeur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Surface</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Score IA</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getRequestsByStatus(activeTab).map((request) => (
                    <TableRow key={request.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{request.applicantName}</div>
                          <div className="text-sm text-gray-600">{request.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{request.requestType}</div>
                          <div className="flex items-center mt-1">
                            <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(request.priority)}`} />
                            <span className="text-xs text-gray-600">{request.priority}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{request.zone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">{request.requestedArea}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(request.status)} border`}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`text-sm font-medium ${getAIScoreColor(request.aiScore)}`}>
                          {request.aiScore}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {new Date(request.submissionDate).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(request)}
                            disabled={isLoading}
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditRequest(request.id)}
                            disabled={isLoading}
                            title="Modifier la demande"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de détails */}
      <RequestDetailsDialog />
    </div>
  );
};

export default MairieCommunalRequests;