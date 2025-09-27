import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Phone,
  Mail,
  MapPin,
  Building,
  Star,
  Eye,
  Edit,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  DollarSign,
  Award,
  User,
  UserCheck,
  UserX,
  Briefcase,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GeometreClients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');

  // Données des clients
  const clients = [
    {
      id: 1,
      name: 'Société IMMOGO',
      type: 'entreprise',
      contact: 'M. Ibrahima Fall',
      email: 'contact@immogo.sn',
      phone: '+221 77 123 45 67',
      address: 'Route de la Corniche, Almadies, Dakar',
      status: 'actif',
      rating: 4.8,
      totalMissions: 12,
      totalRevenue: '8,500,000 XOF',
      lastMission: '2024-09-25',
      avatar: null,
      sector: 'Immobilier',
      description: 'Promoteur immobilier spécialisé dans le résidentiel haut de gamme',
      projects: [
        { name: 'Résidence Almadies Bay', status: 'en_cours', value: '2,500,000 XOF' },
        { name: 'Villa Les Palmiers', status: 'termine', value: '1,200,000 XOF' }
      ]
    },
    {
      id: 2,
      name: 'M. Amadou Diallo',
      type: 'particulier',
      contact: 'Amadou Diallo',
      email: 'amadou.diallo@gmail.com',
      phone: '+221 76 987 65 43',
      address: 'Cité Keur Gorgui, Rufisque',
      status: 'actif',
      rating: 4.5,
      totalMissions: 3,
      totalRevenue: '950,000 XOF',
      lastMission: '2024-09-15',
      avatar: null,
      sector: 'Particulier',
      description: 'Propriétaire terrain résidentiel',
      projects: [
        { name: 'Bornage terrain résidentiel', status: 'en_cours', value: '320,000 XOF' }
      ]
    },
    {
      id: 3,
      name: 'Ministère de l\'Industrie',
      type: 'administration',
      contact: 'Direction de l\'Aménagement',
      email: 'amenagement@industrie.gouv.sn',
      phone: '+221 33 824 56 78',
      address: 'Building Administratif, Plateau, Dakar',
      status: 'actif',
      rating: 4.9,
      totalMissions: 8,
      totalRevenue: '15,200,000 XOF',
      lastMission: '2024-09-30',
      avatar: null,
      sector: 'Administration',
      description: 'Institution gouvernementale - projets d\'infrastructure',
      projects: [
        { name: 'Zone industrielle Bargny', status: 'en_cours', value: '3,500,000 XOF' },
        { name: 'Cartographie Thiès', status: 'termine', value: '2,100,000 XOF' }
      ]
    },
    {
      id: 4,
      name: 'Coopérative Agricole Thiès',
      type: 'cooperative',
      contact: 'M. Ousmane Sarr',
      email: 'coop.thies@agriculture.sn',
      phone: '+221 77 456 78 90',
      address: 'Centre ville, Thiès',
      status: 'actif',
      rating: 4.2,
      totalMissions: 5,
      totalRevenue: '1,850,000 XOF',
      lastMission: '2024-08-20',
      avatar: null,
      sector: 'Agriculture',
      description: 'Coopérative agricole - délimitation parcelles',
      projects: [
        { name: 'Parcelles rizicoles Kaolack', status: 'planifie', value: '450,000 XOF' }
      ]
    },
    {
      id: 5,
      name: 'Architecte Mbaye & Associates',
      type: 'entreprise',
      contact: 'Arch. Fatou Mbaye',
      email: 'f.mbaye@archimbaye.sn',
      phone: '+221 77 234 56 78',
      address: 'Point E, Dakar',
      status: 'actif',
      rating: 4.7,
      totalMissions: 7,
      totalRevenue: '3,200,000 XOF',
      lastMission: '2024-09-20',
      avatar: null,     
      sector: 'Architecture',
      description: 'Cabinet d\'architecture - relevés de bâtiments',
      projects: [
        { name: 'Villa Sacré-Cœur', status: 'en_cours', value: '680,000 XOF' }
      ]
    },
    {
      id: 6,
      name: 'Mme Aïssatou Ndiaye',
      type: 'particulier',
      contact: 'Aïssatou Ndiaye',
      email: 'aissatou.ndiaye@yahoo.fr',
      phone: '+221 76 345 67 89',
      address: 'Liberté 6, Dakar',
      status: 'inactif',
      rating: 4.0,
      totalMissions: 2,
      totalRevenue: '480,000 XOF',
      lastMission: '2024-06-15',
      avatar: null,
      sector: 'Particulier',
      description: 'Propriétaire foncier',
      projects: [
        { name: 'Délimitation héritage familial', status: 'termine', value: '280,000 XOF' }
      ]
    }
  ];

  const getClientTypeIcon = (type) => {
    switch (type) {
      case 'entreprise': return Building;
      case 'particulier': return User;
      case 'administration': return Award;
      case 'cooperative': return Users;
      default: return User;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-800';
      case 'inactif': return 'bg-red-100 text-red-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'termine': return 'bg-green-100 text-green-800';
      case 'planifie': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'tous' || client.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Statistiques clients
  const stats = [
    {
      title: 'Total Clients',
      value: clients.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Clients Actifs',
      value: clients.filter(c => c.status === 'actif').length,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Revenus Total',
      value: '29.18M XOF',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Note Moyenne',
      value: '4.5/5',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'  
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio Clients</h1>
          <p className="text-gray-600 mt-1">Gestion de votre réseau professionnel</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, contact ou secteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['tous', 'entreprise', 'particulier', 'administration', 'cooperative'].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType(type)}
                >
                  {type === 'tous' ? 'Tous' : type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Tabs */}
      <Tabs defaultValue="grille" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grille">Vue Grille</TabsTrigger>
          <TabsTrigger value="liste">Vue Liste</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="grille" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client, index) => {
              const TypeIcon = getClientTypeIcon(client.type);
              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={client.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <TypeIcon className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">{client.name}</h3>
                            <p className="text-sm text-gray-600">{client.sector}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-3 w-3" />
                          {client.contact}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          {client.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {client.address}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-900">{client.totalMissions}</div>
                          <div className="text-xs text-gray-600">Missions</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold text-gray-900">{client.rating}</div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                      </div>

                      {/* Revenue */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Revenus total</span>
                          <span className="font-semibold text-gray-900">{client.totalRevenue}</span>
                        </div>
                      </div>

                      {/* Current Projects */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Projets actifs</h4>
                        <div className="space-y-2">
                          {client.projects.slice(0, 2).map((project, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 truncate flex-1">{project.name}</span>
                              <Badge variant="outline" className={`ml-2 ${getProjectStatusColor(project.status)}`}>
                                {project.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="liste" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Client</th>
                      <th className="text-left p-4 font-medium text-gray-900">Type</th>
                      <th className="text-left p-4 font-medium text-gray-900">Contact</th>
                      <th className="text-left p-4 font-medium text-gray-900">Missions</th>
                      <th className="text-left p-4 font-medium text-gray-900">Revenus</th>
                      <th className="text-left p-4 font-medium text-gray-900">Statut</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => {
                      const TypeIcon = getClientTypeIcon(client.type);
                      return (
                        <tr key={client.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  <TypeIcon className="h-4 w-4" />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-600">{client.sector}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">
                              {client.type}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              <div className="text-gray-900">{client.contact}</div>
                              <div className="text-gray-600">{client.phone}</div>
                            </div>
                          </td>
                          <td className="p-4 text-center font-medium">
                            {client.totalMissions}
                          </td>
                          <td className="p-4 font-medium">
                            {client.totalRevenue}
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(client.status)}>
                              {client.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-3 w-3" />
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

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['entreprise', 'particulier', 'administration', 'cooperative'].map((type) => {
                    const count = clients.filter(c => c.type === type).length;
                    const percentage = (count / clients.length * 100).toFixed(1);
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{type}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clients par Revenus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients
                    .sort((a, b) => parseInt(b.totalRevenue.replace(/[^0-9]/g, '')) - parseInt(a.totalRevenue.replace(/[^0-9]/g, '')))
                    .slice(0, 5)
                    .map((client, index) => (
                      <div key={client.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-600">#{index + 1}</div>
                          <div className="text-sm text-gray-900">{client.name}</div>
                        </div>
                        <div className="text-sm font-medium">{client.totalRevenue}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default GeometreClients;