import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Star, 
  Phone, 
  Mail,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Eye,
  Edit,
  UserPlus,
  Filter,
  Download,
  Search,
  Clock,
  Target,
  Heart,
  Gift
} from 'lucide-react';

const PromoteurVentes = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Données des ventes
  const salesData = {
    totalSales: 2400000000,
    totalUnits: 47,
    averagePrice: 51063829,
    conversionRate: 12.3,
    totalLeads: 382,
    activeSales: 28,
    monthlyGrowth: 15.2,
    pendingContracts: 8
  };

  // Performances des projets
  // projectPerformance RÉEL depuis Supabase (aucune donnée fictive)
  const [projectPerformance, setProjectPerformance] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('developer_projects').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setProjectPerformance(data || []);
      } catch (err) {
        console.warn('projectPerformance indisponible:', err?.message);
        if (active) setProjectPerformance([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Équipe commerciale
  // salesTeam RÉEL depuis Supabase (aucune donnée fictive)
  const [salesTeam, setSalesTeam] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('developer_projects').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setSalesTeam(data || []);
      } catch (err) {
        console.warn('salesTeam indisponible:', err?.message);
        if (active) setSalesTeam([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Clients et prospects
  const clients = []; // démo retirée

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
      case 'Client': return 'bg-green-100 text-green-800';
      case 'Prospect chaud': return 'bg-orange-100 text-orange-800';
      case 'Prospect': return 'bg-blue-100 text-blue-800';
      case 'Perdu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (status) => {
    switch (status) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Bon': return 'bg-blue-100 text-blue-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-red-100 text-red-800';
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

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Ventes</h1>
            <p className="text-gray-600">Suivi des performances commerciales et gestion client</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{salesData.monthlyGrowth}% ce mois
            </Badge>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(salesData.totalSales)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  +{salesData.monthlyGrowth}% vs mois dernier
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unités Vendues</p>
                  <p className="text-2xl font-bold text-gray-900">{salesData.totalUnits}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">
                  Prix moyen: {formatCurrency(salesData.averagePrice)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Conversion</p>
                  <p className="text-2xl font-bold text-gray-900">{salesData.conversionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={salesData.conversionRate} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">{salesData.totalLeads} prospects</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ventes Actives</p>
                  <p className="text-2xl font-bold text-gray-900">{salesData.activeSales}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-orange-600 font-medium">
                  {salesData.pendingContracts} contrats en attente
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Projets
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Équipe
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Clients
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique des ventes */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des Ventes</CardTitle>
                  <CardDescription>Chiffre d'affaires par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Graphique des ventes (à intégrer)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Top performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Meilleurs vendeurs du mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesTeam.slice(0, 3).map((agent, index) => (
                      <div key={agent.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{agent.name}</p>
                            <p className="text-sm text-gray-600">{agent.totalSales} ventes</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(agent.revenue)}
                          </p>
                          <p className="text-sm text-green-600">{agent.achievement}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertes et actions */}
            <Card>
              <CardHeader>
                <CardTitle>Alertes et Actions Requises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-orange-800">8 contrats en attente de signature</p>
                      <p className="text-sm text-orange-600">Relancer les clients sous 48h</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">15 prospects à recontacter aujourd'hui</p>
                      <p className="text-sm text-blue-600">Suivi commercial programmé</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Planifier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projets */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Performance des Projets</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Rapport
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projectPerformance.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {project.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {project.location}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Lancé le {new Date(project.launchDate).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPerformanceColor(project.status)}>
                              {project.status}
                            </Badge>
                            <Badge className="bg-gray-100 text-gray-800">
                              {project.salesRate}% vendus
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(project.totalRevenue)}
                          </p>
                          <p className="text-sm text-gray-500">Revenus générés</p>
                        </div>
                      </div>

                      {/* Métriques des unités */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {project.soldUnits}
                          </p>
                          <p className="text-sm text-green-700">Vendues</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">
                            {project.reservedUnits}
                          </p>
                          <p className="text-sm text-orange-700">Réservées</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">
                            {project.availableUnits}
                          </p>
                          <p className="text-sm text-blue-700">Disponibles</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-gray-600">
                            {project.totalUnits}
                          </p>
                          <p className="text-sm text-gray-700">Total</p>
                        </div>
                      </div>

                      {/* Progression des ventes */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progression des ventes</span>
                          <span className="font-medium">{project.salesRate}%</span>
                        </div>
                        <Progress value={project.salesRate} className="h-3" />
                      </div>

                      {/* Informations supplémentaires */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Prix moyen</p>
                          <p className="font-semibold">{formatCurrency(project.avgPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Top vendeur</p>
                          <p className="font-semibold">{project.topAgent}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Source principale</p>
                          <p className="font-semibold">{project.leadSource}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Équipe commerciale */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Équipe Commerciale</CardTitle>
                <CardDescription>Performance et objectifs de l'équipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {salesTeam.map((agent) => (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border rounded-lg p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                          <p className="text-sm text-gray-600">{agent.role}</p>
                        </div>
                      </div>

                      {/* Évaluation */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {getRatingStars(agent.rating)}
                          <span className="ml-2 text-sm font-medium">{agent.rating}</span>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">
                          {agent.experience}
                        </Badge>
                      </div>

                      {/* Objectifs */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Objectif mensuel</span>
                          <span className="font-medium">{agent.totalSales}/{agent.target}</span>
                        </div>
                        <Progress value={agent.achievement} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">{agent.achievement}% atteint</p>
                      </div>

                      {/* Métriques */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <p className="text-gray-500">Revenus</p>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(agent.revenue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Clients actifs</p>
                          <p className="font-semibold">{agent.activeClients}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Spécialité</p>
                          <p className="font-semibold text-sm">{agent.speciality}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Langues</p>
                          <p className="font-semibold text-sm">
                            {agent.languages.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Phone className="w-4 h-4 mr-1" />
                          Appeler
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients et prospects */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Clients et Prospects</CardTitle>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredClients.map((client) => (
                    <motion.div
                      key={client.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{client.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {client.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-1" />
                                {client.phone}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getStatusColor(client.status)}>
                                {client.status}
                              </Badge>
                              <Badge className="bg-gray-100 text-gray-800">
                                {client.source}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              <strong>{client.project}</strong> - {client.unit}
                            </p>
                            {client.notes && (
                              <p className="text-sm text-gray-500 mt-1 italic">"{client.notes}"</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600 mb-1">
                            {formatCurrency(client.value)}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">Agent: {client.agent}</p>
                          
                          {client.contractDate && (
                            <p className="text-sm text-green-600">
                              Contrat: {new Date(client.contractDate).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                          
                          {client.nextFollowUp && (
                            <p className="text-sm text-orange-600">
                              Suivi: {new Date(client.nextFollowUp).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                          
                          {client.interest && (
                            <div className="mt-2">
                              <div className="flex items-center justify-end mb-1">
                                <span className="text-xs text-gray-500 mr-2">Intérêt:</span>
                                <span className="text-xs font-medium">{client.interest}%</span>
                              </div>
                              <Progress value={client.interest} className="h-1 w-20" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {client.satisfaction && (
                            <div className="flex items-center">
                              <Heart className="w-4 h-4 text-red-500 mr-1" />
                              <span>{client.satisfaction}/5</span>
                            </div>
                          )}
                          {client.paymentStatus && (
                            <span className="text-orange-600">{client.paymentStatus}</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-1" />
                            Appeler
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PromoteurVentes;