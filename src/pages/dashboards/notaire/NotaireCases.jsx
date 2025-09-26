import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Eye, 
  Edit, 
  Edit3,
  Trash2, 
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  MapPin,
  DollarSign,
  FileText,
  Phone,
  Mail,
  Star,
  Target,
  Award,
  Scale,
  Download,
  Archive,
  Gavel,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotaireCases = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 10;

  // Statuts des dossiers
  const caseStatuses = [
    { value: 'all', label: 'Tous les statuts', color: 'bg-gray-100 text-gray-800' },
    { value: 'new', label: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'En cours', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'documents_pending', label: 'Docs en attente', color: 'bg-orange-100 text-orange-800' },
    { value: 'review', label: 'En révision', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'Terminé', color: 'bg-green-100 text-green-800' },
    { value: 'archived', label: 'Archivé', color: 'bg-gray-100 text-gray-800' }
  ];

  // Priorités
  const priorities = [
    { value: 'all', label: 'Toutes priorités' },
    { value: 'low', label: 'Faible', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Moyenne', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'Élevée', color: 'bg-red-100 text-red-800' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-600 text-white' }
  ];

  // Types de dossiers
  const caseTypes = [
    'Vente immobilière',
    'Achat immobilier',
    'Succession',
    'Donation',
    'Hypothèque',
    'Constitution société',
    'Acte authentique',
    'Procuration',
    'Contrat mariage',
    'Testament'
  ];

  // Données simulées des dossiers de vente de terrains via plateforme
  const mockCases = [
    {
      id: 'CASE-001',
      title: 'Vente Terrain Résidentiel - Ouakam',
      type: 'Vente terrain plateforme',
      platformRef: 'TER-2024-001',
      buyer: {
        name: 'Amadou Ba',
        phone: '+221 77 123 45 67',
        email: 'amadou.ba@email.com',
        id: 'USR-001'
      },
      seller: {
        name: 'Fatou Diop',
        phone: '+221 76 987 65 43',
        email: 'fatou.diop@email.com',
        id: 'USR-002'
      },
      status: 'in_progress',
      priority: 'high',
      openDate: '2024-01-15',
      dueDate: '2024-02-15',
      lastActivity: '2024-01-25',
      progress: 75,
      description: 'Vente d\'un terrain résidentiel via la plateforme Teranga Foncier',
      property: {
        address: 'Parcelle B-457, Zone résidentielle Ouakam',
        area: '500m²',
        value: 25000000,
        coordinates: '14.7392°N, 17.4814°W',
        landTitle: 'TF-OUAKAM-457/2023',
        zoning: 'Résidentiel R3'
      },
      transaction: {
        price: 25000000,
        deposit: 5000000,
        remaining: 20000000,
        paymentStatus: 'deposit_paid',
        escrowAccount: 'ESC-2024-001'
      },
      documentsCount: 12,
      completedDocuments: 9,
      notaryFees: 375000,
      nextAction: 'Vérification finale du titre foncier - Prévu le 28/01/2024',
      platformSteps: {
        listing: { completed: true, date: '2024-01-10' },
        negotiation: { completed: true, date: '2024-01-12' },
        agreement: { completed: true, date: '2024-01-15' },
        notaryAssignment: { completed: true, date: '2024-01-16' },
        documentVerification: { completed: false, inProgress: true },
        titleTransfer: { completed: false, inProgress: false },
        finalRegistration: { completed: false, inProgress: false }
      }
    },
    {
      id: 'CASE-002',
      title: 'Vente Terrain Commercial - Plateau',
      type: 'Vente terrain plateforme',
      platformRef: 'TER-2024-002',
      buyer: {
        name: 'Société SENEGAL INVEST',
        phone: '+221 33 821 45 67',
        email: 'contact@senegalinvest.com',
        id: 'USR-003',
        type: 'company'
      },
      seller: {
        name: 'Ibrahima Sarr',
        phone: '+221 77 456 78 90',
        email: 'ibrahima.sarr@email.com',
        id: 'USR-004'
      },
      status: 'documents_pending',
      priority: 'medium',
      openDate: '2024-01-18',
      dueDate: '2024-03-18',
      lastActivity: '2024-01-23',
      progress: 45,
      description: 'Vente d\'un terrain commercial via la plateforme Teranga Foncier',
      property: {
        address: 'Avenue Lamine Guèye, Plateau, Dakar',
        area: '800m²',
        value: 120000000,
        coordinates: '14.6928°N, 17.4467°W',
        landTitle: 'TF-PLATEAU-123/2023',
        zoning: 'Commercial C2'
      },
      transaction: {
        price: 120000000,
        deposit: 24000000,
        remaining: 96000000,
        paymentStatus: 'deposit_paid',
        escrowAccount: 'ESC-2024-002'
      },
      documentsCount: 15,
      completedDocuments: 8,
      notaryFees: 1800000,
      nextAction: 'En attente des documents de conformité urbaine',
      platformSteps: {
        listing: { completed: true, date: '2024-01-15' },
        negotiation: { completed: true, date: '2024-01-17' },
        agreement: { completed: true, date: '2024-01-18' },
        notaryAssignment: { completed: true, date: '2024-01-19' },
        documentVerification: { completed: false, inProgress: true },
        titleTransfer: { completed: false, inProgress: false },
        finalRegistration: { completed: false, inProgress: false }
      }
    },
    {
      id: 'CASE-003',
      title: 'Vente Terrain Agricole - Thiès',
      type: 'Vente terrain plateforme',
      platformRef: 'TER-2024-003',
      buyer: {
        name: 'Coopérative Agricole KAOLACK',
        phone: '+221 33 941 23 45',
        email: 'coop.kaolack@agriculture.sn',
        id: 'USR-005',
        type: 'cooperative'
      },
      seller: {
        name: 'Modou Fall',
        phone: '+221 77 234 56 78',
        email: 'modou.fall@email.com',
        id: 'USR-006'
      },
      status: 'completed',
      priority: 'low',
      openDate: '2024-01-05',
      dueDate: '2024-02-05',
      lastActivity: '2024-01-30',
      progress: 100,
      description: 'Vente d\'un terrain agricole via la plateforme Teranga Foncier',
      property: {
        address: 'Zone agricole Thiès, Secteur Nord',
        area: '5.2 hectares',
        value: 45000000,
        coordinates: '14.7897°N, 16.9626°W',
        landTitle: 'TF-THIES-AG-089/2023',
        zoning: 'Agricole A1'
      },
      transaction: {
        price: 45000000,
        deposit: 9000000,
        remaining: 36000000,
        paymentStatus: 'completed',
        escrowAccount: 'ESC-2024-003'
      },
      documentsCount: 14,
      completedDocuments: 14,
      notaryFees: 675000,
      nextAction: 'Dossier finalisé - Archivage en cours',
      platformSteps: {
        listing: { completed: true, date: '2024-01-05' },
        negotiation: { completed: true, date: '2024-01-08' },
        agreement: { completed: true, date: '2024-01-10' },
        notaryAssignment: { completed: true, date: '2024-01-11' },
        documentVerification: { completed: true, date: '2024-01-20' },
        titleTransfer: { completed: true, date: '2024-01-28' },
        finalRegistration: { completed: true, date: '2024-01-30' }
      }
    },
    {
      id: 'CASE-004',
      title: 'Constitution SARLU Teranga Business',
      type: 'Constitution société',
      client: {
        name: 'SARLU Teranga Business',
        phone: '+221 77 456 78 90',
        email: 'contact@terangabusiness.sn'
      },
      status: 'new',
      priority: 'urgent',
      openDate: '2024-01-22',
      dueDate: '2024-02-05',
      lastActivity: '2024-01-22',
      progress: 15,
      description: 'Constitution d\'une SARLU pour activités commerciales',
      property: {
        address: 'Immeuble Médina, Bureau 201',
        area: '200m²',
        value: 120000000
      },
      documentsCount: 10,
      completedDocuments: 1,
      notaryFees: 1200000,
      nextAction: 'Première consultation prévue le 26/01/2024'
    }
  ];

  useEffect(() => {
    setCases(mockCases);
    setFilteredCases(mockCases);
  }, []);

  // Filtrage des dossiers
  useEffect(() => {
    let filtered = cases;

    if (searchTerm) {
      filtered = filtered.filter(caseItem =>
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(caseItem => caseItem.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(caseItem => caseItem.priority === priorityFilter);
    }

    setFilteredCases(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter, cases]);

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const startIndex = (currentPage - 1) * casesPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + casesPerPage);

  // Handlers
  const handleCreateCase = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Dossier créé",
        description: "Nouveau dossier notarial créé avec succès",
        variant: "success"
      });
      setShowCreateDialog(false);
      setIsLoading(false);
    }, 1500);
  };

  const handleViewCase = (caseItem) => {
    setSelectedCase(caseItem);
    window.safeGlobalToast({
      title: "Dossier ouvert",
      description: `Consultation du dossier ${caseItem.id}`,
      variant: "success"
    });
  };

  const handleUpdateStatus = (caseId, newStatus) => {
    setIsLoading(true);
    setTimeout(() => {
      setCases(prev => 
        prev.map(c => 
          c.id === caseId 
            ? { ...c, status: newStatus, lastActivity: new Date().toISOString().split('T')[0] }
            : c
        )
      );
      window.safeGlobalToast({
        title: "Statut mis à jour",
        description: `Dossier ${caseId} mis à jour avec succès`,
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteCase = (caseId) => {
    setIsLoading(true);
    setTimeout(() => {
      setCases(prev => prev.filter(c => c.id !== caseId));
      window.safeGlobalToast({
        title: "Dossier supprimé",
        description: "Dossier supprimé avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  // Fonctions spécifiques aux transactions de terrains via plateforme
  const handleValidateDocuments = (caseId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Documents validés",
        description: "Tous les documents ont été vérifiés et validés",
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleInitiateTransfer = (caseId) => {
    window.safeGlobalToast({
      title: "Transfert initié",
      description: "Procédure de transfert de propriété lancée",
      variant: "success"
    });
  };

  const handleContactPlatform = (platformRef) => {
    window.safeGlobalToast({
      title: "Contact plateforme",
      description: `Communication avec la plateforme pour ${platformRef}`,
      variant: "success"
    });
  };

  const handleVerifyEscrow = (escrowAccount) => {
    window.safeGlobalToast({
      title: "Vérification séquestre",
      description: `Vérification du compte séquestre ${escrowAccount}`,
      variant: "success"
    });
  };

  const handleScheduleSignature = (caseId) => {
    window.safeGlobalToast({
      title: "Signature planifiée",
      description: "Rendez-vous de signature programmé",
      variant: "success"
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new': return <Plus className="h-4 w-4" />;
      case 'in_progress': return <ArrowRight className="h-4 w-4" />;
      case 'documents_pending': return <FileText className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'archived': return <BookOpen className="h-4 w-4" />;
      default: return <Briefcase className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    const statusOption = caseStatuses.find(s => s.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const priorityOption = priorities.find(p => p.value === priority);
    return priorityOption ? priorityOption.color : 'bg-gray-100 text-gray-800';
  };

  const getDaysSinceLastActivity = (lastActivity) => {
    const today = new Date();
    const activityDate = new Date(lastActivity);
    const diffTime = Math.abs(today - activityDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Dossiers</h2>
          <p className="text-gray-600 mt-1">
            Suivi et gestion des dossiers notariaux en cours
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button 
            className="bg-amber-600 hover:bg-amber-700"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Dossier
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Dossiers</p>
                <p className="text-2xl font-bold">{cases.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {cases.filter(c => c.status === 'in_progress').length}
                </p>
              </div>
              <ArrowRight className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-green-600">
                  {cases.filter(c => c.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgents</p>
                <p className="text-2xl font-bold text-red-600">
                  {cases.filter(c => c.priority === 'urgent' || c.priority === 'high').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher dossiers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  {caseStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par priorité" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              {filteredCases.length} dossier(s) trouvé(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des dossiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedCases.map((caseItem) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cursor-pointer"
            onClick={() => handleViewCase(caseItem)}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {caseItem.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {caseItem.type} • {caseItem.id}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(caseItem.status)}>
                      {getStatusIcon(caseItem.status)}
                      <span className="ml-1">
                        {caseStatuses.find(s => s.value === caseItem.status)?.label}
                      </span>
                    </Badge>
                    <Badge className={getPriorityColor(caseItem.priority)}>
                      {caseItem.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Informations transaction plateforme */}
                {caseItem.type === 'Vente terrain plateforme' ? (
                  <>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Réf. Plateforme: {caseItem.platformRef}</span>
                      {caseItem.transaction && (
                        <span className="font-medium">
                          {(caseItem.transaction.price / 1000000).toFixed(1)}M FCFA
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-green-600 font-medium">Acheteur:</span>
                        <span className="text-gray-700">{caseItem.buyer?.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-blue-600 font-medium">Vendeur:</span>
                        <span className="text-gray-700">{caseItem.seller?.name}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{caseItem.client?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}

                {/* Propriété */}
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p>{caseItem.property.address}</p>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span>{caseItem.property.area}</span>
                      {caseItem.property.landTitle && (
                        <span className="text-blue-600">TF: {caseItem.property.landTitle}</span>
                      )}
                    </div>
                    {caseItem.property.zoning && (
                      <p className="text-xs text-purple-600 mt-1">Zone: {caseItem.property.zoning}</p>
                    )}
                  </div>
                </div>

                {/* Progression */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progression</span>
                    <span className="text-sm text-gray-600">{caseItem.progress}%</span>
                  </div>
                  <Progress value={caseItem.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{caseItem.completedDocuments}/{caseItem.documentsCount} documents</span>
                    <span>Échéance: {caseItem.dueDate}</span>
                  </div>
                </div>

                {/* Prochaine action */}
                <div className="bg-amber-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Target className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Prochaine action</p>
                      <p className="text-xs text-amber-700">{caseItem.nextAction}</p>
                    </div>
                  </div>
                </div>

                {/* Actions spécifiques aux terrains via plateforme */}
                {caseItem.type === 'Vente terrain plateforme' && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">Étapes Plateforme</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactPlatform(caseItem.platformRef);
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          Contact
                        </Button>
                        {caseItem.transaction?.escrowAccount && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifyEscrow(caseItem.transaction.escrowAccount);
                            }}
                            className="h-6 px-2 text-xs"
                          >
                            Séquestre
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs">
                      {Object.entries(caseItem.platformSteps || {}).map(([step, status]) => (
                        <div
                          key={step}
                          className={`h-2 rounded-full ${
                            status.completed ? 'bg-green-500' : 
                            status.inProgress ? 'bg-yellow-500' : 'bg-gray-200'
                          }`}
                          title={step}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Il y a {getDaysSinceLastActivity(caseItem.lastActivity)} jour(s)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.safeGlobalToast({
                          title: "Dossier consulté",
                          description: `Ouverture de ${caseItem.id}`,
                          variant: "success"
                        });
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLoading(true);
                        setTimeout(() => {
                          window.safeGlobalToast({
                            title: "Dossier modifié",
                            description: `${caseItem.id} mis à jour`,
                            variant: "success"
                          });
                          setIsLoading(false);
                        }, 1000);
                      }}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLoading(true);
                        setTimeout(() => {
                          window.safeGlobalToast({
                            title: "Dossier validé",
                            description: `${caseItem.id} approuvé`,
                            variant: "success"
                          });
                          setIsLoading(false);
                        }, 1500);
                      }}
                    >
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLoading(true);
                        setTimeout(() => {
                          window.safeGlobalToast({
                            title: "Document généré",
                            description: `Acte pour ${caseItem.id}`,
                            variant: "success"
                          });
                          setIsLoading(false);
                        }, 2000);
                      }}
                    >
                      <Download className="h-3 w-3 text-blue-600" />
                    </Button>
                    {/* Boutons spécifiques aux transactions de terrains */}
                    {caseItem.type === 'Vente terrain plateforme' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleValidateDocuments(caseItem.id);
                          }}
                          title="Valider documents"
                        >
                          <Scale className="h-3 w-3 text-purple-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInitiateTransfer(caseItem.id);
                          }}
                          title="Initier transfert"
                        >
                          <ArrowRight className="h-3 w-3 text-orange-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScheduleSignature(caseItem.id);
                          }}
                          title="Planifier signature"
                        >
                          <Calendar className="h-3 w-3 text-indigo-600" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLoading(true);
                        setTimeout(() => {
                          window.safeGlobalToast({
                            title: "Archivage effectué",
                            description: `${caseItem.id} archivé`,
                            variant: "success"
                          });
                          setIsLoading(false);
                        }, 1000);
                      }}
                    >
                      <Archive className="h-3 w-3 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} sur {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      )}

      {/* Modal de création de dossier */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouveau Dossier Notarial</DialogTitle>
            <DialogDescription>
              Créer un nouveau dossier pour un acte notarié
            </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="property">Propriété</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="case-title">Titre du dossier</Label>
                <Input id="case-title" placeholder="Titre descriptif du dossier" />
              </div>
              <div>
                <Label htmlFor="case-type">Type de dossier</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {caseTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="case-priority">Priorité</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau de priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notary-fees">Honoraires notariaux (FCFA)</Label>
                <Input id="notary-fees" type="number" placeholder="Montant des honoraires" />
              </div>
            </div>
            <div>
              <Label htmlFor="case-description">Description</Label>
              <Textarea 
                id="case-description" 
                placeholder="Description détaillée du dossier..."
                rows={4}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="client" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client-name">Nom du client</Label>
                <Input id="client-name" placeholder="Nom complet du client" />
              </div>
              <div>
                <Label htmlFor="client-type">Type de client</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Particulier</SelectItem>
                    <SelectItem value="company">Entreprise</SelectItem>
                    <SelectItem value="family">Famille</SelectItem>
                    <SelectItem value="heirs">Héritiers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="client-phone">Téléphone</Label>
                <Input id="client-phone" placeholder="+221 XX XXX XX XX" />
              </div>
              <div>
                <Label htmlFor="client-email">Email</Label>
                <Input id="client-email" type="email" placeholder="email@example.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="client-address">Adresse</Label>
              <Textarea id="client-address" placeholder="Adresse complète du client..." rows={3} />
            </div>
          </TabsContent>
          
          <TabsContent value="property" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property-address">Adresse de la propriété</Label>
                <Input id="property-address" placeholder="Adresse de la propriété" />
              </div>
              <div>
                <Label htmlFor="property-area">Superficie (m²)</Label>
                <Input id="property-area" type="number" placeholder="Superficie" />
              </div>
              <div>
                <Label htmlFor="property-value">Valeur (FCFA)</Label>
                <Input id="property-value" type="number" placeholder="Valeur de la propriété" />
              </div>
              <div>
                <Label htmlFor="property-type">Type de propriété</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de propriété" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industriel">Industriel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="planning" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="due-date">Date d'échéance</Label>
                <Input id="due-date" type="date" />
              </div>
              <div>
                <Label htmlFor="first-meeting">Premier rendez-vous</Label>
                <Input id="first-meeting" type="datetime-local" />
              </div>
            </div>
            <div>
              <Label htmlFor="next-action">Prochaine action</Label>
              <Textarea 
                id="next-action" 
                placeholder="Décrivez la prochaine action à réaliser..."
                rows={3}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => setShowCreateDialog(false)}
          >
            Annuler
          </Button>
          <Button 
            className="bg-amber-600 hover:bg-amber-700"
            onClick={handleCreateCase}
            disabled={isLoading}
          >
            {isLoading ? 'Création...' : 'Créer Dossier'}
          </Button>
        </div>
      </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotaireCases;