import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Plus, Search, Filter, MoreVertical, Edit, Trash2,
  Phone, Mail, MapPin, Calendar, Star, TrendingUp, BarChart3,
  Download, Upload, Eye, UserPlus, Building, CreditCard,
  Clock, CheckCircle, AlertCircle, Target, Award, Activity
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Helmet } from 'react-helmet-async';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';

const CRMPage = () => {
  const { user, profile } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Données simulées CRM
  const [crmStats] = useState({
    totalContacts: 247,
    activeLeads: 42,
    convertedSales: 18,
    monthlyGrowth: 23,
    totalRevenue: 45600000, // XOF
    avgDealSize: 2533333, // XOF
    conversionRate: 12.8
  });

  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Aminata Diallo',
      email: 'aminata.diallo@email.com',
      phone: '+221 77 123 45 67',
      role: 'Acheteur Diaspora',
      status: 'lead',
      location: 'Paris, France',
      interests: ['Terrain résidentiel', 'Construction'],
      lastContact: '2024-03-15',
      dealValue: 15000000,
      avatar: null,
      notes: 'Intéressée par un terrain à Mbour pour construction maison familiale',
      score: 85
    },
    {
      id: 2,
      name: 'Moussa Seck',
      email: 'moussa.seck@email.com',
      phone: '+221 76 987 65 43',
      role: 'Promoteur',
      status: 'client',
      location: 'Dakar, Sénégal',
      interests: ['Terrain commercial', 'Investissement'],
      lastContact: '2024-03-14',
      dealValue: 35000000,
      avatar: null,
      notes: 'Projet de résidence haut standing en cours',
      score: 92
    },
    {
      id: 3,
      name: 'Fatou Ba',
      email: 'fatou.ba@email.com',
      phone: '+221 78 456 78 90',
      role: 'Particulier',
      status: 'prospect',
      location: 'Thiès, Sénégal',
      interests: ['Terrain agricole'],
      lastContact: '2024-03-13',
      dealValue: 8000000,
      avatar: null,
      notes: 'Recherche terrain pour agriculture familiale',
      score: 67
    }
  ]);

  const [deals] = useState([
    {
      id: 1,
      title: 'Terrain Mbour - Diallo',
      contactId: 1,
      value: 15000000,
      stage: 'Négociation',
      probability: 70,
      expectedClose: '2024-03-30',
      lastActivity: '2024-03-15'
    },
    {
      id: 2,
      title: 'Résidence Almadies - Seck',
      contactId: 2,
      value: 35000000,
      stage: 'Proposition',
      probability: 90,
      expectedClose: '2024-03-25',
      lastActivity: '2024-03-14'
    }
  ]);

  const [activities] = useState([
    {
      id: 1,
      type: 'call',
      description: 'Appel téléphonique avec Aminata Diallo',
      contactId: 1,
      timestamp: '2024-03-15T14:30:00Z',
      outcome: 'Positive'
    },
    {
      id: 2,
      type: 'email',
      description: 'Envoi devis terrain Mbour',
      contactId: 1,
      timestamp: '2024-03-15T10:15:00Z',
      outcome: 'Sent'
    },
    {
      id: 3,
      type: 'meeting',
      description: 'Visite terrain avec Moussa Seck',
      contactId: 2,
      timestamp: '2024-03-14T16:00:00Z',
      outcome: 'Très positive'
    }
  ]);

  const statusColors = {
    prospect: 'bg-blue-100 text-blue-800',
    lead: 'bg-yellow-100 text-yellow-800',
    client: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  };

  const stageColors = {
    'Prospection': 'bg-blue-500',
    'Qualification': 'bg-yellow-500',
    'Proposition': 'bg-orange-500',
    'Négociation': 'bg-purple-500',
    'Fermeture': 'bg-green-500'
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const exportToExcel = () => {
    // Logique d'export Excel ici
    console.log('Export Excel des contacts...');
    alert('Export Excel en cours de développement');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex">
      <ModernSidebar currentPage="crm" />
      <div className="flex-1 ml-80 p-6 bg-gray-50 min-h-screen">
        <Helmet>
          <title>CRM - Teranga Foncier</title>
          <meta name="description" content="Système de gestion client de Teranga Foncier" />
        </Helmet>

        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM - Gestion Clients</h1>
            <p className="text-gray-600">Gérez vos contacts, prospects et ventes</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={exportToExcel} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Nouveau Contact
            </Button>
          </div>
        </div>

        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Contacts</p>
                  <p className="text-2xl font-bold">{crmStats.totalContacts}</p>
                  <p className="text-xs text-green-600">+{crmStats.monthlyGrowth}% ce mois</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Leads Actifs</p>
                  <p className="text-2xl font-bold">{crmStats.activeLeads}</p>
                  <p className="text-xs text-blue-600">En cours de suivi</p>
                </div>
                <Target className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ventes Réalisées</p>
                  <p className="text-2xl font-bold">{crmStats.convertedSales}</p>
                  <p className="text-xs text-green-600">Ce mois</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold">{(crmStats.totalRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-purple-600">XOF ce mois</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
            <TabsTrigger value="deals">Affaires ({deals.length})</TabsTrigger>
            <TabsTrigger value="activities">Activités ({activities.length})</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pipeline des ventes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Pipeline des Ventes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stageColors).map(([stage, color]) => {
                      const stageDeals = deals.filter(deal => deal.stage === stage);
                      const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
                      
                      return (
                        <div key={stage} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${color}`}></div>
                            <span className="text-sm font-medium">{stage}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">
                              {formatCurrency(stageValue)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {stageDeals.length} affaire{stageDeals.length > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Activités récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activités Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => {
                      const contact = contacts.find(c => c.id === activity.contactId);
                      return (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-gray-500">
                              {contact?.name} • {new Date(activity.timestamp).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {activity.outcome}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contacts */}
          <TabsContent value="contacts" className="space-y-6">
            {/* Filtres et recherche */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-80"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="prospect">Prospects</SelectItem>
                    <SelectItem value="lead">Leads</SelectItem>
                    <SelectItem value="client">Clients</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Liste des contacts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                            <p className="text-sm text-gray-600">{contact.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {contact.score}
                            </div>
                            <div className="text-xs text-gray-500">Score</div>
                          </div>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {contact.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {contact.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {contact.location}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={statusColors[contact.status]}>
                          {contact.status}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {formatCurrency(contact.dealValue)}
                          </div>
                          <div className="text-xs text-gray-500">Valeur potentielle</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-4">
                        <strong>Intérêts:</strong> {contact.interests.join(', ')}
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-4 line-clamp-2">
                        {contact.notes}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Dernier contact: {new Date(contact.lastContact).toLocaleDateString('fr-FR')}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Affaires */}
          <TabsContent value="deals" className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Affaire</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Contact</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Valeur</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Étape</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Probabilité</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Fermeture prévue</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {deals.map((deal) => {
                        const contact = contacts.find(c => c.id === deal.contactId);
                        return (
                          <tr key={deal.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{deal.title}</div>
                              <div className="text-sm text-gray-500">
                                Dernière activité: {new Date(deal.lastActivity).toLocaleDateString('fr-FR')}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                                    {contact?.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900">{contact?.name}</div>
                                  <div className="text-sm text-gray-500">{contact?.role}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-semibold text-green-600">
                              {formatCurrency(deal.value)}
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={`${stageColors[deal.stage]} text-white`}>
                                {deal.stage}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Progress value={deal.probability} className="w-20" />
                                <span className="text-sm font-medium">{deal.probability}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {new Date(deal.expectedClose).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activités */}
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historique des Activités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => {
                    const contact = contacts.find(c => c.id === activity.contactId);
                    return (
                      <div key={activity.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.description}</h4>
                            <Badge variant="secondary">{activity.outcome}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Contact: {contact?.name} • {new Date(activity.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CRMPage;
