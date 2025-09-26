import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Flag,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Gavel,
  Scale,
  Target
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
import { Progress } from '@/components/ui/progress';

const MairieDisputeResolution = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('disputes');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState(null);

  // Données des conflits fonciers
  const landDisputes = [
    {
      id: 'CONF-2024-001',
      title: 'Litige limites parcellaires - Quartier Nord',
      parties: [
        { name: 'Amadou Diallo', role: 'Demandeur', contact: '+221 77 123 45 67' },
        { name: 'Fatou Seck', role: 'Défendeur', contact: '+221 76 987 65 43' }
      ],
      location: 'Zone Résidentielle Nord - Secteur B',
      disputeType: 'Limites parcellaires',
      priority: 'Moyenne',
      status: 'Médiation en cours',
      submissionDate: '2024-01-15',
      lastActivity: '2024-01-20',
      mediator: 'Conseiller Juridique Moussa Ba',
      description: 'Contestation des limites entre deux parcelles adjacentes suite à la construction d\'une clôture',
      timeline: [
        { date: '2024-01-15', event: 'Dépôt de la plainte', status: 'completed' },
        { date: '2024-01-17', event: 'Convocation des parties', status: 'completed' },
        { date: '2024-01-20', event: 'Première séance de médiation', status: 'completed' },
        { date: '2024-01-25', event: 'Expertise technique prévue', status: 'pending' },
        { date: '2024-02-01', event: 'Séance de conciliation', status: 'upcoming' }
      ],
      documents: ['Plainte initiale', 'Plans parcellaires', 'Photos terrain'],
      resolutionProgress: 60,
      estimatedResolution: '2024-02-15'
    },
    {
      id: 'CONF-2024-002',
      title: 'Conflit succession foncière - Famille Ndiaye',
      parties: [
        { name: 'Ibrahim Ndiaye', role: 'Héritier 1', contact: '+221 78 456 12 34' },
        { name: 'Aïssa Ndiaye', role: 'Héritier 2', contact: '+221 77 654 32 10' },
        { name: 'Moussa Ndiaye', role: 'Héritier 3', contact: '+221 76 123 98 76' }
      ],
      location: 'Zone Agricole Est - Parcelle 127',
      disputeType: 'Succession',
      priority: 'Haute',
      status: 'Arbitrage requis',
      submissionDate: '2024-01-10',
      lastActivity: '2024-01-22',
      mediator: 'Juge de Paix Assane Diop',
      description: 'Désaccord entre héritiers sur le partage d\'une parcelle agricole de 2.5 hectares',
      timeline: [
        { date: '2024-01-10', event: 'Saisine du tribunal', status: 'completed' },
        { date: '2024-01-12', event: 'Constitution du dossier', status: 'completed' },
        { date: '2024-01-18', event: 'Première audience', status: 'completed' },
        { date: '2024-01-22', event: 'Expertise notariale', status: 'completed' },
        { date: '2024-01-28', event: 'Audience de jugement', status: 'upcoming' }
      ],
      documents: ['Acte de décès', 'Titre foncier original', 'Actes de naissance héritiers'],
      resolutionProgress: 80,
      estimatedResolution: '2024-02-05'
    },
    {
      id: 'CONF-2024-003',
      title: 'Occupation illégale terrain communal',
      parties: [
        { name: 'Commune de Dakar', role: 'Demandeur', contact: 'mairie@dakar.sn' },
        { name: 'Association Commerçants', role: 'Défendeur', contact: '+221 77 987 65 43' }
      ],
      location: 'Zone Commerciale Centre - Place publique',
      disputeType: 'Occupation illégale',
      priority: 'Haute',
      status: 'Résolu',
      submissionDate: '2024-01-05',
      lastActivity: '2024-01-18',
      mediator: 'Préfet Départemental',
      description: 'Occupation non autorisée d\'un espace public par des commerçants informels',
      timeline: [
        { date: '2024-01-05', event: 'Constat d\'huissier', status: 'completed' },
        { date: '2024-01-08', event: 'Mise en demeure', status: 'completed' },
        { date: '2024-01-12', event: 'Négociation solution', status: 'completed' },
        { date: '2024-01-15', event: 'Accord de relocalisation', status: 'completed' },
        { date: '2024-01-18', event: 'Libération espace', status: 'completed' }
      ],
      documents: ['Constat huissier', 'Mise en demeure', 'Accord final'],
      resolutionProgress: 100,
      estimatedResolution: '2024-01-18'
    }
  ];

  // Types de médiation
  const mediationTypes = [
    {
      id: 'mediation-1',
      type: 'Médiation Communautaire',
      description: 'Résolution à l\'amiable avec sages du quartier',
      duration: '15-30 jours',
      successRate: '75%',
      cost: 'Gratuit'
    },
    {
      id: 'mediation-2',
      type: 'Arbitrage Juridique',
      description: 'Procédure formelle avec conseiller juridique',
      duration: '30-60 jours',
      successRate: '85%',
      cost: '50,000 FCFA'
    },
    {
      id: 'mediation-3',
      type: 'Expertise Technique',
      description: 'Intervention géomètre et expert foncier',
      duration: '45-90 jours',
      successRate: '90%',
      cost: '150,000 FCFA'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Résolu': return 'bg-green-100 text-green-800';
      case 'Médiation en cours': return 'bg-blue-100 text-blue-800';
      case 'Arbitrage requis': return 'bg-orange-100 text-orange-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Suspendu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getTimelineStatus = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-blue-500';
      case 'upcoming': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const filteredDisputes = landDisputes.filter(dispute => {
    const matchesSearch = dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.parties.some(party => 
                           party.name.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Résolution de Conflits</h2>
          <p className="text-gray-600 mt-1">
            Médiation et arbitrage des litiges fonciers
          </p>
        </div>
        
        <Button className="bg-teal-600 hover:bg-teal-700 mt-4 lg:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Conflit
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Conflits</p>
                <p className="text-2xl font-bold text-gray-900">87</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Cours</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-green-600">64</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux Réussite</p>
                <p className="text-2xl font-bold text-purple-600">73%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="disputes">Conflits Actifs</TabsTrigger>
          <TabsTrigger value="mediation">Types de Médiation</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        {/* Conflits Actifs */}
        <TabsContent value="disputes" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Rechercher par titre ou parties..."
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
                    <SelectItem value="Médiation en cours">Médiation en cours</SelectItem>
                    <SelectItem value="Arbitrage requis">Arbitrage requis</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                    <SelectItem value="Résolu">Résolu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des conflits */}
          <div className="space-y-4">
            {filteredDisputes.map((dispute) => (
              <Card key={dispute.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {dispute.title}
                        </h3>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(dispute.priority)}`} />
                        <Badge className={getStatusColor(dispute.status)}>
                          {dispute.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{dispute.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{dispute.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Soumis le {new Date(dispute.submissionDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{dispute.mediator}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedDispute(dispute)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Parties impliquées */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-600 mb-2 block">Parties impliquées:</span>
                    <div className="flex flex-wrap gap-2">
                      {dispute.parties.map((party, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
                          <Users className="h-3 w-3 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">{party.name}</span>
                          <span className="text-xs text-gray-500">({party.role})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Progression */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Progression de résolution</span>
                      <span className="text-sm font-medium text-gray-900">{dispute.resolutionProgress}%</span>
                    </div>
                    <Progress value={dispute.resolutionProgress} className="h-2" />
                    <div className="text-xs text-gray-500">
                      Résolution estimée: {new Date(dispute.estimatedResolution).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Types de Médiation */}
        <TabsContent value="mediation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {mediationTypes.map((mediation) => (
              <Card key={mediation.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    {mediation.type}
                  </CardTitle>
                  <CardDescription>{mediation.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Durée</span>
                      <p className="font-medium text-gray-900">{mediation.duration}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Coût</span>
                      <p className="font-medium text-gray-900">{mediation.cost}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taux de réussite</span>
                      <span className="text-sm font-medium text-gray-900">{mediation.successRate}</span>
                    </div>
                    <Progress value={parseInt(mediation.successRate)} className="h-2" />
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Choisir cette médiation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Statistiques */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Limites parcellaires</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
                      </div>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Succession</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }} />
                      </div>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Occupation illégale</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '25%' }} />
                      </div>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">12</div>
                  <div className="text-sm text-gray-600 mb-4">Conflits résolus ce mois</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                  <div className="text-sm text-gray-600">En cours de traitement</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog détails conflit */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedDispute.title}
              </h3>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedDispute(null)}
                className="text-gray-600"
              >
                ×
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Chronologie du Conflit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedDispute.timeline.map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-1 ${getTimelineStatus(event.status)}`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{event.event}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Informations détaillées */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations Détaillées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Type de conflit</span>
                    <p className="font-medium text-gray-900">{selectedDispute.disputeType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Localisation</span>
                    <p className="font-medium text-gray-900">{selectedDispute.location}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Médiateur assigné</span>
                    <p className="font-medium text-gray-900">{selectedDispute.mediator}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Documents disponibles</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDispute.documents.map((doc, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
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

export default MairieDisputeResolution;