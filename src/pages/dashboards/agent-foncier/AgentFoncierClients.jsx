import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  User,
  Star,
  Clock,
  Download,
  MessageSquare,
  TrendingUp,
  FileText,
  AlertCircle,
  CheckCircle2,
  MoreHorizontal,
  UserPlus,
  Target,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const AgentFoncierClients = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('tous');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  // Données complètes des clients
  const clients = [
    {
      id: 1,
      nom: 'Amadou Diallo',
      type: 'Particulier',
      email: 'amadou.diallo@email.com',
      telephone: '+221 77 123 45 67',
      adresse: 'Almadies, Dakar',
      projetsActifs: 2,
      projetsTotal: 5,
      valeurPortefeuille: '2.8B XOF',
      dateInscription: '2023-03-15',
      dernierContact: '2024-09-20',
      statut: 'actif',
      satisfaction: 92,
      avatar: 'AD',
      priorite: 'haute',
      prochainRdv: '2024-09-28 14h30',
      notes: 'Client VIP - Investisseur immobilier actif'
    },
    {
      id: 2,
      nom: 'Société IMMOGO SARL',
      type: 'Entreprise',
      email: 'contact@immogo.sn',
      telephone: '+221 33 456 78 90',
      adresse: 'Zone industrielle, Rufisque',
      projetsActifs: 5,
      projetsTotal: 12,
      valeurPortefeuille: '8.5B XOF',
      dateInscription: '2022-07-20',
      dernierContact: '2024-09-25',
      statut: 'actif',
      satisfaction: 88,
      avatar: 'IM',
      priorite: 'haute',
      prochainRdv: '2024-09-27 10h00',
      notes: 'Promoteur immobilier - Projets résidentiels'
    },
    {
      id: 3,
      nom: 'Fatou Seck',
      type: 'Particulier',
      email: 'fatou.seck@gmail.com',
      telephone: '+221 78 654 32 10',
      adresse: 'Mermoz, Dakar',
      projetsActifs: 1,
      projetsTotal: 1,
      valeurPortefeuille: '450M XOF',
      dateInscription: '2024-08-10',
      dernierContact: '2024-09-18',
      statut: 'nouveau',
      satisfaction: 95,
      avatar: 'FS',
      priorite: 'moyenne',
      prochainRdv: 'Non planifié',
      notes: 'Première acquisition - Accompagnement nécessaire'
    },
    {
      id: 4,
      nom: 'Groupe SENEGALIA',
      type: 'Entreprise',
      email: 'info@senegalia.com',
      telephone: '+221 33 987 65 43',
      adresse: 'Dakar Plateau',
      projetsActifs: 3,
      projetsTotal: 8,
      valeurPortefeuille: '5.2B XOF',
      dateInscription: '2021-11-05',
      dernierContact: '2024-09-22',
      statut: 'actif',
      satisfaction: 90,
      avatar: 'GS',
      priorite: 'haute',
      prochainRdv: '2024-10-02 16h00',
      notes: 'Développement agricole - Terres rurales'
    },
    {
      id: 5,
      nom: 'Omar Ba',
      type: 'Particulier',
      email: 'omar.ba@yahoo.fr',
      telephone: '+221 77 888 99 00',
      adresse: 'Parcelles Assainies',
      projetsActifs: 0,
      projetsTotal: 3,
      valeurPortefeuille: '1.1B XOF',
      dateInscription: '2023-01-20',
      dernierContact: '2024-08-15',
      statut: 'inactif',
      satisfaction: 75,
      avatar: 'OB',
      priorite: 'faible',
      prochainRdv: 'À planifier',
      notes: 'Projets suspendus - Relance nécessaire'
    },
    {
      id: 6,
      nom: 'Diaspora Investment Corp',
      type: 'Entreprise',
      email: 'contact@diaspora-invest.com',
      telephone: '+221 33 111 22 33',
      adresse: 'Point E, Dakar',
      projetsActifs: 4,
      projetsTotal: 6,
      valeurPortefeuille: '12.8B XOF',
      dateInscription: '2023-09-12',
      dernierContact: '2024-09-26',
      statut: 'vip',
      satisfaction: 98,
      avatar: 'DI',
      priorite: 'très haute',
      prochainRdv: '2024-09-29 11h00',
      notes: 'Client premium - Investissements diaspora'
    }
  ];

  // Statistiques clients
  const clientStats = [
    {
      title: 'Total Clients',
      value: clients.length,
      change: '+12.5%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Clients Actifs',
      value: clients.filter(c => c.statut === 'actif').length,
      change: '+8.3%',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Nouveaux (30j)',
      value: clients.filter(c => c.statut === 'nouveau').length,
      change: '+25.0%',
      icon: UserPlus,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Satisfaction Moy.',
      value: Math.round(clients.reduce((acc, c) => acc + c.satisfaction, 0) / clients.length) + '%',
      change: '+2.1%',
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'nouveau': return 'bg-blue-100 text-blue-800';
      case 'inactif': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'très haute': return 'bg-red-500';
      case 'haute': return 'bg-orange-500';
      case 'moyenne': return 'bg-yellow-500';
      case 'faible': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'tous' || client.statut === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion Clients</h1>
          <p className="text-gray-600">Portefeuille client et relation commerciale</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Client
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {clientStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filtres et Recherche */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="tous">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="vip">VIP</option>
            <option value="nouveau">Nouveaux</option>
            <option value="inactif">Inactifs</option>
          </select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Plus de filtres
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tous les Clients
          </TabsTrigger>
          <TabsTrigger value="vip" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Clients VIP
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Activité Récente
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Tous les Clients */}
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Portefeuille Clients ({filteredClients.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {client.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getPriorityColor(client.priorite)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900">{client.nom}</h3>
                            <Badge className={getStatusColor(client.statut)}>
                              {client.statut === 'actif' ? 'Actif' :
                               client.statut === 'vip' ? 'VIP' :
                               client.statut === 'nouveau' ? 'Nouveau' : 'Inactif'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {client.type}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {client.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {client.telephone}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {client.adresse}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 text-sm">
                            <div>
                              <span className="text-gray-500">Projets: </span>
                              <span className="font-medium">{client.projetsActifs}/{client.projetsTotal}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Portefeuille: </span>
                              <span className="font-medium text-green-600">{client.valeurPortefeuille}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Satisfaction: </span>
                              <div className="flex items-center gap-1">
                                <Progress value={client.satisfaction} className="w-12 h-2" />
                                <span className="font-medium">{client.satisfaction}%</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Prochain RDV: </span>
                              <span className="font-medium">{client.prochainRdv}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="Appeler">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Email">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Message">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Voir détails">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Plus d'options">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {client.notes && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800 border-l-4 border-blue-200">
                        <strong>Note:</strong> {client.notes}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients VIP */}
        <TabsContent value="vip" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {clients.filter(c => c.statut === 'vip' || c.priorite === 'très haute').map((client) => (
              <Card key={client.id} className="border-2 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {client.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{client.nom}</h3>
                        <Badge className="bg-purple-100 text-purple-800">
                          {client.statut.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valeur Portefeuille:</span>
                      <span className="font-bold text-green-600">{client.valeurPortefeuille}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Projets Actifs:</span>
                      <span className="font-medium">{client.projetsActifs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Satisfaction:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={client.satisfaction} className="w-16 h-2" />
                        <span className="font-medium">{client.satisfaction}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activité Récente */}
        <TabsContent value="recent" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Activité Client Récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clients.slice(0, 4).map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {client.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.nom}</p>
                        <p className="text-sm text-gray-600">Dernier contact: {client.dernierContact}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {client.projetsActifs} projets actifs
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Particulier', 'Entreprise'].map((type) => {
                    const count = clients.filter(c => c.type === type).length;
                    const percentage = Math.round((count / clients.length) * 100);
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="font-medium">{type}</span>
                        <div className="flex items-center gap-3">
                          <Progress value={percentage} className="w-24 h-2" />
                          <span className="text-sm font-medium">{count} ({percentage}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {Math.round(clients.reduce((acc, c) => acc + c.satisfaction, 0) / clients.length)}%
                    </div>
                    <p className="text-gray-600">Satisfaction Moyenne</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="font-bold text-green-600">
                        {clients.filter(c => c.satisfaction >= 90).length}
                      </div>
                      <div className="text-gray-600">Excellente (90%+)</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="font-bold text-blue-600">
                        {clients.filter(c => c.satisfaction >= 80 && c.satisfaction < 90).length}
                      </div>
                      <div className="text-gray-600">Bonne (80-89%)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AgentFoncierClients;