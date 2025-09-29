import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Target,
  Briefcase,
  Award,
  UserPlus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GeometreCRM = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données fictives des clients
  const clients = [
    {
      id: 1,
      name: 'Atelier Architecture Dakar',
      type: 'Architecte',
      contact: 'Amadou Sall',
      email: 'contact@atelierarch-dk.sn',
      phone: '+221 77 123 45 67',
      projects: 8,
      value: '15M FCFA',
      status: 'active',
      priority: 'high',
      lastProject: 'Complexe résidentiel Almadies',
      nextMeeting: '2025-10-05'
    },
    {
      id: 2,
      name: 'Groupe Promoteur Sénégal',
      type: 'Promoteur',
      contact: 'Fatou Diop',
      email: 'f.diop@gps-immo.sn',
      phone: '+221 78 234 56 78',
      projects: 12,
      value: '45M FCFA',
      status: 'active',
      priority: 'high',
      lastProject: 'Lotissement VDN Extension',
      nextMeeting: '2025-10-03'
    },
    {
      id: 3,
      name: 'Bureau Urbanisme Moderne',
      type: 'Urbaniste',
      contact: 'Cheikh Ba',
      email: 'urbanisme@bum-dakar.sn',
      phone: '+221 77 345 67 89',
      projects: 5,
      value: '8M FCFA',
      status: 'prospect',
      priority: 'medium',
      lastProject: 'Plan d\'aménagement Rufisque',
      nextMeeting: '2025-10-08'
    },
    {
      id: 4,
      name: 'Famille Ndiaye',
      type: 'Particulier',
      contact: 'Moussa Ndiaye',
      email: 'moussa.ndiaye@gmail.com',
      phone: '+221 76 456 78 90',
      projects: 2,
      value: '2.5M FCFA',
      status: 'active',
      priority: 'low',
      lastProject: 'Bornage terrain familial Thiès',
      nextMeeting: '2025-10-10'
    }
  ];

  const stats = [
    {
      title: 'Clients Actifs',
      value: '24',
      change: '+3',
      changeType: 'positive',
      icon: Users,
      description: 'Ce mois'
    },
    {
      title: 'Prospects',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: Target,
      description: 'En négociation'
    },
    {
      title: 'CA Total',
      value: '125M FCFA',
      change: '+15%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'Cette année'
    },
    {
      title: 'Taux Conversion',
      value: '68%',
      change: '+5%',
      changeType: 'positive',
      icon: Award,
      description: 'Prospects → Clients'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Architecte': return Building;
      case 'Promoteur': return Briefcase;
      case 'Urbaniste': return MapPin;
      case 'Particulier': return User;
      default: return User;
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesFilter = activeFilter === 'all' || client.status === activeFilter;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contact.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            CRM Professionnel Géomètre
          </h1>
          <p className="text-gray-600 mt-2">
            Gestion avancée de la relation client : Architectes, Promoteurs, Urbanistes & Particuliers
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">{stat.description}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'active', 'prospect', 'inactive'].map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter)}
                className={activeFilter === filter ? 
                  "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : 
                  "hover:bg-blue-50"
                }
              >
                {filter === 'all' ? 'Tous' : 
                 filter === 'active' ? 'Actifs' :
                 filter === 'prospect' ? 'Prospects' : 'Inactifs'}
              </Button>
            ))}
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
      </motion.div>

      {/* Liste des clients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6"
      >
        {filteredClients.map((client, index) => {
          const TypeIcon = getTypeIcon(client.type);
          return (
            <Card key={client.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                        <Badge className={getPriorityColor(client.priority)}>
                          {client.priority === 'high' ? 'Priorité haute' :
                           client.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{client.contact} • {client.type}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {client.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {client.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Projets</p>
                      <p className="text-lg font-bold text-blue-600">{client.projects}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Valeur</p>
                      <p className="text-lg font-bold text-green-600">{client.value}</p>
                    </div>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status === 'active' ? 'Actif' : 
                       client.status === 'prospect' ? 'Prospect' : 'Inactif'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Dernier projet : </span>
                      <span className="font-medium text-gray-900">{client.lastProject}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Prochain RDV : </span>
                      <span className="font-medium text-gray-900">{client.nextMeeting}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>
    </div>
  );
};

export default GeometreCRM;