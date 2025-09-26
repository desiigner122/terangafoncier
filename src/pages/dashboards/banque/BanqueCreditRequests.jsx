import React, { useState } from 'react';
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
  Percent
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

const BanqueCreditRequests = ({ dashboardStats = {} }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLandValuation = (requestId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Évaluation terrain lancée",
        description: "Expertise foncière en cours via géomètre",
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
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

  // Données des demandes de crédit pour achat de terrains via plateforme
  const creditRequests = [
    {
      id: 'CR-TER-2024-001',
      applicantName: 'Mamadou FALL',
      applicantPhone: '+221 77 123 45 67',
      applicantEmail: 'mamadou.fall@email.com',
      creditType: 'Crédit Terrain Résidentiel',
      platformRef: 'TER-2024-001', // Référence transaction plateforme
      requestedAmount: 20000000, // 20M FCFA
      landValue: 25000000, // 25M FCFA (évaluation)
      ltvRatio: 80, // Loan to Value pour terrain
      landLocation: 'Ouakam - Zone Résidentielle',
      landArea: '500m²',
      landTitle: 'TF-OUAKAM-457/2023',
      zoning: 'Résidentiel R3',
      purpose: 'Construction résidence familiale',
      status: 'En Évaluation',
      priority: 'Haute',
      submissionDate: '2024-01-15',
      monthlyIncome: 850000,
      creditScore: 785,
      riskLevel: 'Faible',
      documents: ['CNI', 'Bulletins salaire', 'Titre foncier', 'Accord plateforme', 'Plan cadastral'],
      comments: 'Terrain bien situé, transaction via plateforme Teranga',
      sellerInfo: {
        name: 'Fatou DIOP',
        verified: true
      }
    },
    {
      id: 'CR-TER-2024-002',
      applicantName: 'Société SENEGAL INVEST',
      applicantPhone: '+221 33 821 45 67',
      applicantEmail: 'contact@senegalinvest.com',
      creditType: 'Crédit Terrain Commercial',
      platformRef: 'TER-2024-002',
      requestedAmount: 96000000, // 96M FCFA (80% de 120M)
      landValue: 120000000, // 120M FCFA
      ltvRatio: 80,
      landLocation: 'Avenue Lamine Guèye, Plateau',
      landArea: '800m²',
      landTitle: 'TF-PLATEAU-123/2023',
      zoning: 'Commercial C2',
      purpose: 'Développement projet commercial',
      status: 'En Attente Documents',
      priority: 'Moyenne',
      submissionDate: '2024-01-18',
      monthlyIncome: 2500000,
      creditScore: 720,
      riskLevel: 'Moyen',
      documents: ['Registre commerce', 'Bilan comptable', 'Accord plateforme', 'Étude de marché'],
      comments: 'En attente conformité urbaine',
      sellerInfo: {
        name: 'Ibrahima SARR',
        verified: true
      }
    },
    // Plus de données...
  ];

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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Demandes de Crédit</h2>
          <p className="text-gray-600 mt-1">
            Gestion des demandes de financement foncier
          </p>
        </div>
        
        <Button 
          onClick={handleCreateNewRequest}
          className="bg-blue-600 hover:bg-blue-700 mt-4 lg:mt-0"
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
              <Input
                placeholder="Rechercher par nom ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
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
                <SelectItem value="Moyenne">Moyenne</SelectItem>
                <SelectItem value="Faible">Faible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Demandes ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Demandeur</TableHead>
                  <TableHead>Type de Crédit</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>LTV</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Risque</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.applicantName}</div>
                        <div className="text-sm text-gray-500">{request.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.creditType}</div>
                        <div className="text-sm text-gray-500">{request.zone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {(request.requestedAmount / 1000000).toFixed(0)}M FCFA
                      </div>
                      <div className="text-sm text-gray-500">
                        Bien: {(request.propertyValue / 1000000).toFixed(0)}M FCFA
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
                      <span className={`font-medium ${getRiskColor(request.riskLevel)}`}>
                        {request.riskLevel}
                      </span>
                      <div className="text-sm text-gray-500">Score: {request.creditScore}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleLandValuation(request.id)}
                          disabled={isLoading}
                          title="Évaluer le bien"
                        >
                          <Calculator className="h-4 w-4" />
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

      {/* Modal de détails */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Détails de la Demande</h3>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedRequest(null)}
                className="p-2"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations demandeur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations Demandeur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Nom complet</label>
                    <p className="font-medium">{selectedRequest.applicantName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Téléphone</label>
                    <p className="font-medium">{selectedRequest.applicantPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium">{selectedRequest.applicantEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Revenus mensuels</label>
                    <p className="font-medium">{selectedRequest.monthlyIncome?.toLocaleString()} FCFA</p>
                  </div>
                </CardContent>
              </Card>

              {/* Détails du crédit */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Détails du Crédit
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Type de crédit</label>
                    <p className="font-medium">{selectedRequest.creditType}</p>
                  </div>
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documents */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Documents Fournis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedRequest.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
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

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApproveCredit(selectedRequest.id)}
                disabled={isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approuver
              </Button>
              <Button 
                variant="outline" 
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => handleRejectCredit(selectedRequest.id)}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleLandValuation(selectedRequest.id)}
                disabled={isLoading}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Évaluer Bien
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  window.safeGlobalToast({
                    title: "Information demandée",
                    description: "Demande d'informations complémentaires envoyée",
                    variant: "default"
                  });
                }}
                disabled={isLoading}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Demander Info
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BanqueCreditRequests;