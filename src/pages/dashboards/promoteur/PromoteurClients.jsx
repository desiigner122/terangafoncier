import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  User, 
  Star, 
  Phone, 
  Mail,
  Calendar,
  MapPin,
  Building,
  MessageSquare,
  Eye,
  Edit,
  UserPlus,
  Filter,
  Download,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Gift,
  FileText,
  Settings,
  Bell,
  Shield,
  Award,
  TrendingUp
} from 'lucide-react';

const PromoteurClients = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  // Statistiques clients
  const clientStats = {
    totalClients: 127,
    activeClients: 94,
    newThisMonth: 23,
    satisfactionRate: 4.6,
    retentionRate: 87,
    referralRate: 34,
    averageValue: 68500000,
    lifetimeValue: 8703500000
  };

  // Base de données clients
  const clients = [
    {
      id: 1,
      name: 'Moussa Ba',
      email: 'moussa.ba@email.com',
      phone: '+221 77 987 65 43',
      status: 'Client actif',
      category: 'VIP',
      avatar: '/api/placeholder/40/40',
      joinDate: '2024-01-15',
      lastContact: '2024-12-10',
      nextFollowUp: '2024-12-20',
      projects: [
        {
          name: 'Résidence Teranga',
          unit: 'Appartement 3 pièces',
          value: 85000000,
          status: 'Propriétaire',
          completionDate: '2024-11-30'
        }
      ],
      totalSpent: 85000000,
      satisfaction: 4.8,
      referrals: 3,
      agent: 'Fatou Diagne',
      source: 'Site web',
      preferences: ['Haut de gamme', 'Vue mer', 'Parking'],
      notes: 'Client très exigeant sur les finitions. Intéressé par d\'autres projets.',
      interactions: 24,
      contracts: 1,
      payments: 'À jour',
      loyaltyPoints: 850,
      vipLevel: 'Gold'
    },
    {
      id: 2,
      name: 'Aminata Diop', 
      email: 'aminata.diop@email.com',
      phone: '+221 78 123 45 67',
      status: 'Prospect avancé',
      category: 'Premium',
      avatar: '/api/placeholder/40/40',
      joinDate: '2024-03-10',
      lastContact: '2024-12-08',
      nextFollowUp: '2024-12-15',
      projects: [
        {
          name: 'Villa Duplex Mermoz',
          unit: 'Villa 4 chambres',
          value: 65000000,
          status: 'En négociation',
          expectedDate: '2025-01-15'
        }
      ],
      totalSpent: 0,
      satisfaction: 0,
      referrals: 0,
      agent: 'Mamadou Seck',
      source: 'Référence',
      preferences: ['Jardin', 'Garage', 'Sécurité'],
      notes: 'Demande modifications sur la cuisine. Budget confirmé.',
      interactions: 12,
      contracts: 0,
      payments: 'N/A',
      loyaltyPoints: 120,
      interest: 85
    },
    {
      id: 3,
      name: 'Ibrahima Sarr',
      email: 'ibrahima@email.com',
      phone: '+221 77 555 44 33',
      status: 'Prospect',
      category: 'Standard',
      avatar: '/api/placeholder/40/40',
      joinDate: '2024-06-20',
      lastContact: '2024-12-05',
      nextFollowUp: '2024-12-12',
      projects: [
        {
          name: 'Appartements VDN',
          unit: 'Appartement 2 pièces',
          value: 45000000,
          status: 'Réflexion',
          expectedDate: '2025-03-01'
        }
      ],
      totalSpent: 0,
      satisfaction: 0,
      referrals: 0,
      agent: 'Aïssatou Fall',
      source: 'Publicité Facebook',
      preferences: ['Budget limité', 'Transport', 'Écoles'],
      notes: 'Cherche facilités de paiement. Première acquisition.',
      interactions: 8,
      contracts: 0,
      payments: 'N/A',
      loyaltyPoints: 45,
      interest: 60
    },
    {
      id: 4,
      name: 'Fatou Ndiaye',
      email: 'fatou.ndiaye@email.com',
      phone: '+221 76 888 99 00',
      status: 'Client fidèle',
      category: 'VIP',
      avatar: '/api/placeholder/40/40',
      joinDate: '2023-08-10',
      lastContact: '2024-12-01',
      nextFollowUp: '2024-12-30',
      projects: [
        {
          name: 'Villa Almadies',
          unit: 'Villa 5 chambres',
          value: 120000000,
          status: 'Propriétaire',
          completionDate: '2024-06-15'
        },
        {
          name: 'Appartement Centre-ville',
          unit: 'Appartement 2 pièces',
          value: 55000000,
          status: 'Propriétaire',
          completionDate: '2024-09-30'
        }
      ],
      totalSpent: 175000000,
      satisfaction: 4.9,
      referrals: 5,
      agent: 'Fatou Diagne',
      source: 'Référence',
      preferences: ['Investissement', 'Qualité', 'Emplacement'],
      notes: 'Investisseuse expérimentée. Excellente relation client.',
      interactions: 45,
      contracts: 2,
      payments: 'À jour',
      loyaltyPoints: 1750,
      vipLevel: 'Platinum'
    },
    {
      id: 5,
      name: 'Omar Thiam',
      email: 'omar.thiam@email.com',
      phone: '+221 77 222 33 44',
      status: 'Ancien client',
      category: 'Standard',
      avatar: '/api/placeholder/40/40',
      joinDate: '2023-02-15',
      lastContact: '2024-10-20',
      nextFollowUp: '2025-01-15',
      projects: [
        {
          name: 'Studio Médina',
          unit: 'Studio',
          value: 25000000,
          status: 'Propriétaire',
          completionDate: '2023-12-30'
        }
      ],
      totalSpent: 25000000,
      satisfaction: 4.2,
      referrals: 1,
      agent: 'Aïssatou Fall',
      source: 'Walk-in',
      preferences: ['Première acquisition', 'Transport'],
      notes: 'Premier achat immobilier. Potentiel pour upgrade.',
      interactions: 18,
      contracts: 1,
      payments: 'Terminé',
      loyaltyPoints: 250,
      vipLevel: 'Bronze'
    }
  ];

  // Segmentation des clients
  const clientSegments = {
    all: clients,
    active: clients.filter(c => c.status === 'Client actif' || c.status === 'Client fidèle'),
    prospects: clients.filter(c => c.status.includes('Prospect')),
    vip: clients.filter(c => c.category === 'VIP'),
    inactive: clients.filter(c => c.status === 'Ancien client')
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Client actif': return 'bg-green-100 text-green-800';
      case 'Client fidèle': return 'bg-blue-100 text-blue-800';
      case 'Prospect avancé': return 'bg-orange-100 text-orange-800';
      case 'Prospect': return 'bg-yellow-100 text-yellow-800';
      case 'Ancien client': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Premium': return 'bg-blue-100 text-blue-800';
      case 'Standard': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVipLevelColor = (level) => {
    switch (level) {
      case 'Platinum': return 'bg-gray-800 text-white';
      case 'Gold': return 'bg-yellow-500 text-white';
      case 'Silver': return 'bg-gray-400 text-white';
      case 'Bronze': return 'bg-orange-400 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const getInteractionLevel = (interactions) => {
    if (interactions >= 30) return { level: 'Très actif', color: 'text-green-600' };
    if (interactions >= 15) return { level: 'Actif', color: 'text-blue-600' };
    if (interactions >= 5) return { level: 'Modéré', color: 'text-orange-600' };
    return { level: 'Faible', color: 'text-red-600' };
  };

  const filteredClients = clientSegments[activeTab].filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.projects.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="text-gray-600">Suivi et relation client personnalisée</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">
              <Users className="w-3 h-3 mr-1" />
              {clientStats.totalClients} clients
            </Badge>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Nouveau client
            </Button>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{clientStats.totalClients}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  +{clientStats.newThisMonth} ce mois
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">{clientStats.satisfactionRate}/5</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  {getRatingStars(clientStats.satisfactionRate)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rétention</p>
                  <p className="text-2xl font-bold text-gray-900">{clientStats.retentionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={clientStats.retentionRate} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">Clients fidèles</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valeur Moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(clientStats.averageValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-purple-600 font-medium">
                  {clientStats.referralRate}% de parrainage
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-5">
              <TabsTrigger value="all" className="text-xs">
                Tous ({clientSegments.all.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="text-xs">
                Actifs ({clientSegments.active.length})
              </TabsTrigger>
              <TabsTrigger value="prospects" className="text-xs">
                Prospects ({clientSegments.prospects.length})
              </TabsTrigger>
              <TabsTrigger value="vip" className="text-xs">
                VIP ({clientSegments.vip.length})
              </TabsTrigger>
              <TabsTrigger value="inactive" className="text-xs">
                Anciens ({clientSegments.inactive.length})
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher un client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Contenu des onglets */}
          {Object.keys(clientSegments).map((tabKey) => (
            <TabsContent key={tabKey} value={tabKey} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tabKey === 'all' && 'Tous les Clients'}
                    {tabKey === 'active' && 'Clients Actifs'}
                    {tabKey === 'prospects' && 'Prospects'}
                    {tabKey === 'vip' && 'Clients VIP'}
                    {tabKey === 'inactive' && 'Anciens Clients'}
                  </CardTitle>
                  <CardDescription>
                    {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} trouvé{filteredClients.length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredClients.map((client) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-6 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900">{client.name}</h3>
                                {client.vipLevel && (
                                  <Badge className={getVipLevelColor(client.vipLevel)}>
                                    <Award className="w-3 h-3 mr-1" />
                                    {client.vipLevel}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  {client.email}
                                </div>
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  {client.phone}
                                </div>
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-1" />
                                  {client.agent}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 mb-3">
                                <Badge className={getStatusColor(client.status)}>
                                  {client.status}
                                </Badge>
                                <Badge className={getCategoryColor(client.category)}>
                                  {client.category}
                                </Badge>
                                <Badge className="bg-gray-100 text-gray-800">
                                  {client.source}
                                </Badge>
                              </div>

                              {/* Projets */}
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700 mb-1">Projets:</p>
                                {client.projects.map((project, index) => (
                                  <div key={index} className="text-sm text-gray-600 ml-2">
                                    • <strong>{project.name}</strong> - {project.unit} 
                                    ({formatCurrency(project.value)}) - {project.status}
                                  </div>
                                ))}
                              </div>

                              {/* Métriques client */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                <div>
                                  <p className="text-gray-500">Total dépensé</p>
                                  <p className="font-semibold text-green-600">
                                    {formatCurrency(client.totalSpent)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Interactions</p>
                                  <div className="flex items-center">
                                    <p className="font-semibold mr-2">{client.interactions}</p>
                                    <span className={`text-xs ${getInteractionLevel(client.interactions).color}`}>
                                      {getInteractionLevel(client.interactions).level}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-gray-500">Parrainages</p>
                                  <p className="font-semibold text-blue-600">{client.referrals}</p>
                                </div>
                                <div>
                                  <p className="text-gray-500">Points fidélité</p>
                                  <p className="font-semibold text-purple-600">{client.loyaltyPoints}</p>
                                </div>
                              </div>

                              {/* Satisfaction et intérêt */}
                              {client.satisfaction > 0 && (
                                <div className="flex items-center mb-2">
                                  <span className="text-sm text-gray-600 mr-2">Satisfaction:</span>
                                  <div className="flex items-center">
                                    {getRatingStars(client.satisfaction)}
                                    <span className="ml-2 text-sm font-medium">{client.satisfaction}</span>
                                  </div>
                                </div>
                              )}

                              {client.interest && (
                                <div className="mb-2">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-600">Niveau d'intérêt:</span>
                                    <span className="font-medium">{client.interest}%</span>
                                  </div>
                                  <Progress value={client.interest} className="h-2" />
                                </div>
                              )}

                              {/* Notes */}
                              {client.notes && (
                                <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                                  "{client.notes}"
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="mb-4">
                              <p className="text-sm text-gray-500">Client depuis</p>
                              <p className="font-medium">{formatDate(client.joinDate)}</p>
                            </div>
                            <div className="mb-4">
                              <p className="text-sm text-gray-500">Dernier contact</p>
                              <p className="font-medium">{formatDate(client.lastContact)}</p>
                            </div>
                            <div className="mb-4">
                              <p className="text-sm text-gray-500">Prochain suivi</p>
                              <p className="font-medium text-orange-600">{formatDate(client.nextFollowUp)}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {client.contracts} contrat{client.contracts > 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {client.payments}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Phone className="w-4 h-4 mr-1" />
                              Appeler
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="w-4 h-4 mr-1" />
                              Email
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Eye className="w-4 h-4 mr-1" />
                              Profil
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col">
                <UserPlus className="w-5 h-5 mb-1" />
                <span className="text-sm">Nouveau Client</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <MessageSquare className="w-5 h-5 mb-1" />
                <span className="text-sm">Campagne Email</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Gift className="w-5 h-5 mb-1" />
                <span className="text-sm">Programme Fidélité</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-sm">Rapport Client</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default PromoteurClients;