import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart3, 
  Calendar,
  MapPin,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Filter,
  Download,
  Clock,
  CheckCircle,
  AlertTriangle,
  Hammer,
  Home,
  Truck,
  PieChart
} from 'lucide-react';

const PromoteurOverview = () => {
  const [timeframe, setTimeframe] = useState('30d');

  // Statistiques générales (réelles, calculées depuis Supabase)
  const [businessStats, setBusinessStats] = useState({
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeProjects: 0,
    totalClients: 0,
    completedProjects: 0,
    averageMargin: 0,
    yearlyGrowth: 0
  });

  // Projets actifs (réels depuis Supabase)
  const [activeProjects, setActiveProjects] = useState([]);

  // Activités récentes
  const recentActivities = []; // démo retirée

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('developer_projects')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        const rows = data || [];
        const mapped = rows.map((p) => ({
          id: p.id,
          name: p.title || 'Projet',
          location: p.location || '—',
          type: p.type || 'Résidentiel',
          status: p.status || 'En cours',
          progress: p.progress || 0,
          budget: p.budget || 0,
          revenue: p.revenue || 0,
          margin: (p.revenue || 0) - (p.budget || 0),
          startDate: p.start_date,
          expectedCompletion: p.estimated_completion || p.created_at,
          unitsTotal: p.units_total || 0,
          unitsSold: p.units_sold || 0,
          clientsCount: p.clients_count || 0,
          nextMilestone: p.current_phase || '—'
        }));
        if (!active) return;
        setActiveProjects(mapped.filter((p) => p.status !== 'Terminé'));
        const completed = rows.filter((p) => p.status === 'Terminé').length;
        setBusinessStats({
          totalRevenue: rows.reduce((sum, p) => sum + (p.budget || 0), 0),
          monthlyGrowth: 0,
          activeProjects: rows.length - completed,
          totalClients: rows.reduce((sum, p) => sum + (p.clients_count || 0), 0),
          completedProjects: completed,
          averageMargin: 0,
          yearlyGrowth: 0
        });
      } catch (err) {
        console.warn('Projets promoteur indisponibles:', err?.message);
        if (active) setActiveProjects([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Ventes par mois (6 derniers mois)
  const salesData = []; // données graphiques réelles requises

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
      case 'En construction': return 'bg-blue-100 text-blue-800';
      case 'En cours': return 'bg-orange-100 text-orange-800';
      case 'Commercialisation': return 'bg-green-100 text-green-800';
      case 'Terminé': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'En construction': return <Hammer className="w-4 h-4" />;
      case 'En cours': return <Clock className="w-4 h-4" />;
      case 'Commercialisation': return <Target className="w-4 h-4" />;
      case 'Terminé': return <CheckCircle className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Résidentiel': return <Home className="w-4 h-4" />;
      case 'Commercial': return <Building2 className="w-4 h-4" />;
      case 'Foncier': return <MapPin className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
        {/* En-tête avec statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(businessStats.totalRevenue)}
                  </p>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      +{businessStats.monthlyGrowth}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">ce mois</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projets Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{businessStats.activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">
                  {businessStats.completedProjects} projets terminés
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{businessStats.totalClients}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Base clients active</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Marge Moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{businessStats.averageMargin}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{businessStats.yearlyGrowth}%
                </span>
                <span className="text-sm text-gray-500 ml-1">annuel</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projets actifs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Projets en Cours</CardTitle>
                    <CardDescription>
                      Suivi de vos développements immobiliers
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Tout voir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activeProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            {getStatusIcon(project.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <MapPin className="w-4 h-4 mr-1" />
                              {project.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            {getTypeIcon(project.type)}
                            <span className="ml-1">{project.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="font-semibold">{formatCurrency(project.budget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">CA prévisionnel</p>
                          <p className="font-semibold text-green-600">{formatCurrency(project.revenue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Marge</p>
                          <p className="font-semibold text-blue-600">{formatCurrency(project.margin)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ventes</p>
                          <p className="font-semibold">{project.unitsSold}/{project.unitsTotal}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2 mb-2" />
                        <p className="text-xs text-blue-600">Prochaine étape: {project.nextMilestone}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <span>Fin prévue: </span>
                          <span className="font-medium">
                            {new Date(project.expectedCompletion).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Gérer
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Ventes récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Ventes du Mois
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    +{salesData.reduce((sum, d) => sum + (d.sales || 0), 0)} ventes
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.slice(-3).map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{data.month}</p>
                        <p className="text-sm text-gray-600">{data.sales} ventes</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(data.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button size="sm" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activités récentes */}
            <Card>
              <CardHeader>
                <CardTitle>Activités Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.positive ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {activity.positive ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        {activity.amount && (
                          <p className="text-sm font-medium text-green-600">
                            {formatCurrency(activity.amount)}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Métriques rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Métriques Clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux de vente moyen</span>
                    <span className="font-semibold text-green-600">—</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Délai moyen projet</span>
                    <span className="font-semibold">—</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Satisfaction client</span>
                    <span className="font-semibold text-blue-600">—</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ROI moyen</span>
                    <span className="font-semibold text-purple-600">{businessStats.averageMargin}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Gérez rapidement vos projets et activités
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Button variant="outline" className="h-20 flex flex-col">
                <Plus className="w-6 h-6 mb-2" />
                Nouveau Projet
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Users className="w-6 h-6 mb-2" />
                Gérer Clients
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Calendar className="w-6 h-6 mb-2" />
                Planning
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Download className="w-6 h-6 mb-2" />
                Rapports
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Target className="w-6 h-6 mb-2" />
                Campagne Marketing
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}

export default PromoteurOverview;