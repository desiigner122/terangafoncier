import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  User,
  Building2,
  Eye,
  Edit,
  MoreHorizontal,
  Star,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AgentFoncierCRM = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [clients, setClients] = useState([]);

  // Données CRM simulées
  const crmStats = {
    totalClients: 245,
    activeClients: 89,
    nouveauxClients: 12,
    clientsPotentiels: 34,
    chiffreAffaires: 125000000,
    tauxConversion: 68
  };

  const clientsData = [
    {
      id: 1,
      name: 'Amadou Diallo',
      email: 'amadou.diallo@email.com',
      phone: '+221 77 123 45 67',
      company: 'Diallo Immobilier',
      location: 'Dakar, Plateau',
      status: 'active',
      value: 25000000,
      lastContact: '2024-03-01',
      nextFollowUp: '2024-03-05',
      projects: 3,
      avatar: '/api/placeholder/40/40',
      tags: ['VIP', 'Promoteur'],
      score: 95
    },
    {
      id: 2,
      name: 'Aïssatou Fall',
      email: 'aissatou.fall@email.com',
      phone: '+221 76 987 65 43',
      company: 'Fall Construction',
      location: 'Almadies, Dakar',
      status: 'prospect',
      value: 15000000,
      lastContact: '2024-02-28',
      nextFollowUp: '2024-03-03',
      projects: 1,
      avatar: '/api/placeholder/40/40',
      tags: ['Nouveau'],
      score: 78
    },
    {
      id: 3,
      name: 'Ousmane Ndiaye',
      email: 'ousmane.ndiaye@email.com',
      phone: '+221 78 456 78 90',
      company: 'Ndiaye Développement',
      location: 'Guédiawaye',
      status: 'inactive',
      value: 8000000,
      lastContact: '2024-02-15',
      nextFollowUp: '2024-03-10',
      projects: 0,
      avatar: '/api/placeholder/40/40',
      tags: ['Suivi'],
      score: 45
    },
    {
      id: 4,
      name: 'Fatou Sow',
      email: 'fatou.sow@email.com',
      phone: '+221 77 234 56 78',
      company: 'Sow Investissement',
      location: 'Pikine',
      status: 'active',
      value: 32000000,
      lastContact: '2024-03-02',
      nextFollowUp: '2024-03-04',
      projects: 5,
      avatar: '/api/placeholder/40/40',
      tags: ['VIP', 'Premium'],
      score: 88
    }
  ];

  useEffect(() => {
    setClients(clientsData);
  }, []);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || client.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'prospect':
        return <Badge className="bg-blue-100 text-blue-800">Prospect</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent">
            CRM Avancé
          </h1>
          <p className="text-slate-600">Gestion complète de la relation client</p>
        </div>
        <div className="flex space-x-3">
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Client
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: 'Total Clients', value: crmStats.totalClients, icon: Users, color: 'from-blue-500 to-cyan-600', change: '+12' },
          { title: 'Clients Actifs', value: crmStats.activeClients, icon: CheckCircle, color: 'from-green-500 to-emerald-600', change: '+5' },
          { title: 'Nouveaux', value: crmStats.nouveauxClients, icon: Star, color: 'from-yellow-500 to-orange-600', change: '+3' },
          { title: 'Prospects', value: crmStats.clientsPotentiels, icon: Eye, color: 'from-purple-500 to-indigo-600', change: '+8' },
          { title: 'CA Total', value: `${(crmStats.chiffreAffaires / 1000000).toFixed(0)}M`, icon: DollarSign, color: 'from-rose-500 to-pink-600', change: '+15%' },
          { title: 'Conversion', value: `${crmStats.tauxConversion}%`, icon: TrendingUp, color: 'from-teal-500 to-cyan-600', change: '+2%' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher des clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'active', label: 'Actifs' },
            { id: 'prospect', label: 'Prospects' },
            { id: 'inactive', label: 'Inactifs' }
          ].map(filter => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Clients List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Portfolio Clients ({filteredClients.length})
            </CardTitle>
            <CardDescription>
              Gestion et suivi de votre portefeuille client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-slate-900">{client.name}</h3>
                        <div className={`text-sm font-bold ${getScoreColor(client.score)}`}>
                          {client.score}/100
                        </div>
                        {client.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                        <span className="flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          {client.company}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {client.location}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {(client.value / 1000000).toFixed(1)}M FCFA
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                        <span>Dernière activité: {client.lastContact}</span>
                        <span>Suivi prévu: {client.nextFollowUp}</span>
                        <span>{client.projects} projets</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(client.status)}
                    
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentFoncierCRM;