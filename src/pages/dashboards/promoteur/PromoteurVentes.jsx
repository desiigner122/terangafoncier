import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import {
  TrendingUp,
  Users,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  Eye,
  UserPlus,
  Filter,
  Download,
  Search,
  Clock,
  Target,
  Loader2
} from 'lucide-react';

const PromoteurVentes = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Agrégats de ventes (données réelles Supabase)
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalUnits: 0,
    averagePrice: 0,
    conversionRate: null,
    totalLeads: 0,
    activeSales: 0,
    monthlyGrowth: null,
    pendingContracts: 0
  });

  // Performance par projet (developer_projects + project_sales)
  const [projectPerformance, setProjectPerformance] = useState([]);
  // Clients / prospects (crm_contacts)
  const [clients, setClients] = useState([]);
  // Alertes dérivées de la donnée réelle
  const [hotProspects, setHotProspects] = useState(0);

  const isSold = (s) => ['sold', 'delivered'].includes(String(s || '').toLowerCase());

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [{ data: projects }, { data: sales }, { data: contacts }] = await Promise.all([
          supabase
            .from('developer_projects')
            .select('*')
            .eq('developer_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('project_sales')
            .select('*')
            .eq('promoteur_id', user.id),
          supabase
            .from('crm_contacts')
            .select('*')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false })
        ]);

        const projectList = projects || [];
        const salesList = sales || [];
        const contactList = contacts || [];

        // ----- Agrégats globaux -----
        const soldSales = salesList.filter((s) => isSold(s.status));
        const reservedSales = salesList.filter(
          (s) => String(s.status || '').toLowerCase() === 'reserved'
        );
        const totalSales = soldSales.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
        const totalUnits = soldSales.length;
        const averagePrice = totalUnits ? Math.round(totalSales / totalUnits) : 0;
        const totalLeads = contactList.length;
        const conversionRate = totalLeads
          ? Math.round((totalUnits / totalLeads) * 1000) / 10
          : null;

        // Croissance mensuelle réelle basée sur sale_date (CA mois courant vs précédent)
        const now = new Date();
        const curKey = `${now.getFullYear()}-${now.getMonth()}`;
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevKey = `${prev.getFullYear()}-${prev.getMonth()}`;
        let curCA = 0;
        let prevCA = 0;
        soldSales.forEach((s) => {
          if (!s.sale_date) return;
          const d = new Date(s.sale_date);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (key === curKey) curCA += Number(s.price) || 0;
          else if (key === prevKey) prevCA += Number(s.price) || 0;
        });
        const monthlyGrowth =
          prevCA > 0 ? Math.round(((curCA - prevCA) / prevCA) * 1000) / 10 : null;

        setSalesData({
          totalSales,
          totalUnits,
          averagePrice,
          conversionRate,
          totalLeads,
          activeSales: reservedSales.length,
          monthlyGrowth,
          pendingContracts: reservedSales.length
        });

        // ----- Performance par projet -----
        const perf = projectList.map((p) => {
          const forP = salesList.filter((s) => s.project_id === p.id);
          const sold = forP.filter((s) => String(s.status || '').toLowerCase() === 'sold');
          const delivered = forP.filter(
            (s) => String(s.status || '').toLowerCase() === 'delivered'
          );
          const reserved = forP.filter(
            (s) => String(s.status || '').toLowerCase() === 'reserved'
          );
          const closed = sold.length + delivered.length;
          const revenue = [...sold, ...delivered].reduce(
            (sum, s) => sum + (Number(s.price) || 0),
            0
          );
          const totalLots = forP.length;
          const salesRate = totalLots ? Math.round((closed / totalLots) * 100) : 0;
          const avgPrice = closed ? Math.round(revenue / closed) : 0;
          let status = 'Faible';
          if (salesRate >= 70) status = 'Excellent';
          else if (salesRate >= 40) status = 'Bon';
          else if (salesRate > 0) status = 'Moyen';

          return {
            id: p.id,
            name: p.title || 'Projet',
            location: p.location || '—',
            totalUnits: totalLots,
            soldUnits: sold.length,
            deliveredUnits: delivered.length,
            reservedUnits: reserved.length,
            avgPrice,
            totalRevenue: revenue,
            salesRate,
            status,
            launchDate: p.start_date,
            currentPhase: p.current_phase,
            progress: Number(p.progress) || 0
          };
        });
        setProjectPerformance(perf);

        // ----- Clients / prospects (crm_contacts) -----
        setClients(contactList);
        setHotProspects(
          contactList.filter((c) =>
            ['hot', 'chaud'].includes(String(c.temperature || '').toLowerCase())
          ).length
        );
      } catch (e) {
        console.error('Erreur chargement ventes:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    switch (String(status || '').toLowerCase()) {
      case 'client': return 'bg-green-100 text-green-800';
      case 'hot':
      case 'chaud':
      case 'prospect chaud': return 'bg-orange-100 text-orange-800';
      case 'prospect':
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'lost':
      case 'perdu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTemperatureColor = (temp) => {
    switch (String(temp || '').toLowerCase()) {
      case 'hot':
      case 'chaud': return 'bg-red-100 text-red-800';
      case 'warm':
      case 'tiède': return 'bg-orange-100 text-orange-800';
      case 'cold':
      case 'froid': return 'bg-blue-100 text-blue-800';
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

  const filteredClients = clients.filter((client) => {
    const q = searchTerm.toLowerCase();
    return (
      String(client.name || '').toLowerCase().includes(q) ||
      String(client.email || '').toLowerCase().includes(q) ||
      String(client.company || '').toLowerCase().includes(q)
    );
  });

  // Top projets par CA (données réelles, remplace le classement de vendeurs fictif)
  const topProjects = [...projectPerformance]
    .filter((p) => p.totalRevenue > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 3);

  if (loading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Ventes</h1>
            <p className="text-gray-600">Suivi des performances commerciales et gestion client</p>
          </div>
          {salesData.monthlyGrowth !== null && (
            <div className="flex items-center space-x-2">
              <Badge className={salesData.monthlyGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {salesData.monthlyGrowth >= 0 ? '+' : ''}{salesData.monthlyGrowth}% ce mois
              </Badge>
            </div>
          )}
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
                <span className="text-sm text-gray-600">
                  {salesData.monthlyGrowth !== null
                    ? `${salesData.monthlyGrowth >= 0 ? '+' : ''}${salesData.monthlyGrowth}% vs mois dernier`
                    : 'Unités vendues (livrées incluses)'}
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
                  Prix moyen: {salesData.averagePrice ? formatCurrency(salesData.averagePrice) : '—'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Conversion</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {salesData.conversionRate !== null ? `${salesData.conversionRate}%` : '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={salesData.conversionRate || 0} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">{salesData.totalLeads} prospects</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Réservations Actives</p>
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
                    <p className="text-gray-500">Graphique des ventes (bientôt disponible)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Top projets par CA (données réelles) */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Projets</CardTitle>
                  <CardDescription>Meilleurs projets par chiffre d'affaires</CardDescription>
                </CardHeader>
                <CardContent>
                  {topProjects.length === 0 ? (
                    <p className="text-sm text-gray-500 py-8 text-center">
                      Aucune vente enregistrée pour le moment.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {topProjects.map((project, index) => (
                        <div key={project.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{project.name}</p>
                              <p className="text-sm text-gray-600">
                                {project.soldUnits + project.deliveredUnits} unités vendues
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(project.totalRevenue)}
                            </p>
                            <p className="text-sm text-green-600">{project.salesRate}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  {salesData.pendingContracts > 0 && (
                    <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-orange-800">
                          {salesData.pendingContracts} réservation(s) en attente de signature
                        </p>
                        <p className="text-sm text-orange-600">Relancer les clients concernés</p>
                      </div>
                    </div>
                  )}
                  {hotProspects > 0 && (
                    <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600 mr-3" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-800">
                          {hotProspects} prospect(s) chaud(s) à recontacter
                        </p>
                        <p className="text-sm text-blue-600">Suivi commercial prioritaire</p>
                      </div>
                    </div>
                  )}
                  {salesData.pendingContracts === 0 && hotProspects === 0 && (
                    <p className="text-sm text-gray-500 py-4 text-center">
                      Aucune action requise pour le moment.
                    </p>
                  )}
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
                {projectPerformance.length === 0 ? (
                  <p className="text-sm text-gray-500 py-12 text-center">
                    Aucun projet enregistré pour le moment.
                  </p>
                ) : (
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
                              {project.launchDate && (
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Lancé le {new Date(project.launchDate).toLocaleDateString('fr-FR')}
                                </div>
                              )}
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

                        {/* Métriques des unités (réelles depuis project_sales) */}
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
                              {project.deliveredUnits}
                            </p>
                            <p className="text-sm text-blue-700">Livrées</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-gray-600">
                              {project.totalUnits}
                            </p>
                            <p className="text-sm text-gray-700">Total lots</p>
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

                        {/* Informations supplémentaires (réelles) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Prix moyen</p>
                            <p className="font-semibold">
                              {project.avgPrice ? formatCurrency(project.avgPrice) : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Phase actuelle</p>
                            <p className="font-semibold">{project.currentPhase || '—'}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Avancement chantier</p>
                            <p className="font-semibold">{project.progress}%</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Équipe commerciale — pas de source réelle */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Équipe Commerciale</CardTitle>
                <CardDescription>Performance et objectifs de l'équipe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Users className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium">Gestion d'équipe bientôt disponible</p>
                  <p className="text-sm text-gray-500 mt-1">
                    La gestion des agents commerciaux et de leurs objectifs sera intégrée prochainement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients et prospects (crm_contacts) */}
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
                {filteredClients.length === 0 ? (
                  <p className="text-sm text-gray-500 py-12 text-center">
                    {clients.length === 0
                      ? 'Aucun client ou prospect enregistré.'
                      : 'Aucun résultat pour cette recherche.'}
                  </p>
                ) : (
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
                              {String(client.name || '?')
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {client.name || 'Sans nom'}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                {client.email && (
                                  <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-1" />
                                    {client.email}
                                  </div>
                                )}
                                {client.phone && (
                                  <div className="flex items-center">
                                    <Phone className="w-4 h-4 mr-1" />
                                    {client.phone}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 mb-2">
                                {client.status && (
                                  <Badge className={getStatusColor(client.status)}>
                                    {client.status}
                                  </Badge>
                                )}
                                {client.temperature && (
                                  <Badge className={getTemperatureColor(client.temperature)}>
                                    {client.temperature}
                                  </Badge>
                                )}
                              </div>
                              {client.company && (
                                <p className="text-sm text-gray-600">{client.company}</p>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            {client.score != null && (
                              <div className="mb-2">
                                <p className="text-lg font-bold text-blue-600">{client.score}</p>
                                <p className="text-xs text-gray-500">Score</p>
                              </div>
                            )}
                            {client.created_at && (
                              <p className="text-sm text-gray-500">
                                Ajouté le {new Date(client.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end mt-4 pt-3 border-t">
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PromoteurVentes;
