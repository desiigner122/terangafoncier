import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
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
  PieChart,
  Loader2
} from 'lucide-react';

const PromoteurOverview = () => {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);

  // KPI agrégés (données réelles Supabase)
  const [businessStats, setBusinessStats] = useState({
    totalBudget: 0,
    totalSpent: 0,
    salesRevenue: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalClients: 0,
    totalSales: 0,
    monthSales: 0
  });

  // Projets actifs (developer_projects)
  const [activeProjects, setActiveProjects] = useState([]);

  // Ventes récentes (project_sales)
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Projets du promoteur
        const { data: projects } = await supabase
          .from('developer_projects')
          .select('*')
          .eq('developer_id', user.id)
          .order('created_at', { ascending: false });

        // Ventes du promoteur
        const { data: sales } = await supabase
          .from('project_sales')
          .select('*')
          .eq('promoteur_id', user.id)
          .order('sale_date', { ascending: false });

        // Clients / prospects
        const { count: clientsCount } = await supabase
          .from('crm_contacts')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', user.id);

        const projectList = projects || [];
        const salesList = sales || [];

        // Statut actif = non terminé / non annulé
        const isDone = (s) => ['completed', 'terminé', 'delivered', 'livré'].includes(String(s || '').toLowerCase());
        const activeCount = projectList.filter((p) => !isDone(p.status)).length;
        const completedCount = projectList.filter((p) => isDone(p.status)).length;

        const totalBudget = projectList.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
        const totalSpent = projectList.reduce((sum, p) => sum + (Number(p.spent) || 0), 0);

        // CA réel = somme des ventes vendues / livrées
        const revenueSales = salesList.filter((s) => ['sold', 'delivered'].includes(String(s.status || '').toLowerCase()));
        const salesRevenue = revenueSales.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

        // Ventes du mois en cours
        const now = new Date();
        const monthSales = salesList.filter((s) => {
          const d = s.sale_date ? new Date(s.sale_date) : (s.created_at ? new Date(s.created_at) : null);
          return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;

        setBusinessStats({
          totalBudget,
          totalSpent,
          salesRevenue,
          activeProjects: activeCount,
          completedProjects: completedCount,
          totalClients: clientsCount || 0,
          totalSales: salesList.length,
          monthSales
        });

        // Agrégats ventes par projet (unités vendues / total)
        const salesByProject = {};
        salesList.forEach((s) => {
          const key = s.project_id;
          if (!salesByProject[key]) salesByProject[key] = { total: 0, sold: 0, revenue: 0 };
          salesByProject[key].total += 1;
          if (['sold', 'delivered'].includes(String(s.status || '').toLowerCase())) {
            salesByProject[key].sold += 1;
            salesByProject[key].revenue += Number(s.price) || 0;
          }
        });

        setActiveProjects(
          projectList
            .filter((p) => !isDone(p.status))
            .slice(0, 5)
            .map((p) => {
              const ps = salesByProject[p.id] || { total: 0, sold: 0, revenue: 0 };
              const budget = Number(p.budget) || 0;
              const spent = Number(p.spent) || 0;
              return {
                id: p.id,
                name: p.title || 'Projet sans titre',
                location: p.location || '—',
                status: p.status || '—',
                progress: Number(p.progress) || 0,
                budget,
                spent,
                revenue: ps.revenue,
                remaining: budget - spent,
                startDate: p.start_date,
                expectedCompletion: p.estimated_completion,
                unitsTotal: ps.total,
                unitsSold: ps.sold,
                nextMilestone: p.current_phase || null
              };
            })
        );

        setRecentSales(salesList.slice(0, 5));
      } catch (e) {
        console.error('Erreur chargement PromoteurOverview:', e);
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
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('construction') || s.includes('progress') || s.includes('cours')) return 'bg-blue-100 text-blue-800';
    if (s.includes('commercial') || s.includes('vente')) return 'bg-green-100 text-green-800';
    if (s.includes('plan') || s.includes('attente') || s.includes('pending')) return 'bg-orange-100 text-orange-800';
    if (s.includes('termin') || s.includes('complet') || s.includes('livr')) return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('construction')) return <Hammer className="w-4 h-4" />;
    if (s.includes('cours') || s.includes('progress') || s.includes('attente')) return <Clock className="w-4 h-4" />;
    if (s.includes('commercial') || s.includes('vente')) return <Target className="w-4 h-4" />;
    if (s.includes('termin') || s.includes('complet')) return <CheckCircle className="w-4 h-4" />;
    return <Building2 className="w-4 h-4" />;
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days} j`;
    const hours = Math.floor(diff / 3600000);
    if (hours > 0) return `${hours} h`;
    const mins = Math.floor(diff / 60000);
    return `${mins} min`;
  };

  return (
    <div className="space-y-6">
        {/* En-tête avec statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires (ventes)</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '—' : formatCurrency(businessStats.salesRevenue)}
                  </p>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      {businessStats.totalSales} vente{businessStats.totalSales > 1 ? 's' : ''} au total
                    </span>
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
                  <p className="text-2xl font-bold text-gray-900">{loading ? '—' : businessStats.activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">
                  {businessStats.completedProjects} projet{businessStats.completedProjects > 1 ? 's' : ''} terminé{businessStats.completedProjects > 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{loading ? '—' : businessStats.totalClients}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Base clients / prospects</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget engagé</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '—' : formatCurrency(businessStats.totalBudget)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm text-gray-600">
                  Dépensé : {loading ? '—' : formatCurrency(businessStats.totalSpent)}
                </span>
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
                {loading ? (
                  <div className="flex items-center justify-center py-12 text-gray-500">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Chargement des projets...
                  </div>
                ) : activeProjects.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Building2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Aucun projet en cours</p>
                    <p className="text-sm">Créez votre premier projet pour le suivre ici.</p>
                  </div>
                ) : (
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
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="font-semibold">{formatCurrency(project.budget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Dépensé</p>
                          <p className="font-semibold text-orange-600">{formatCurrency(project.spent)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Restant</p>
                          <p className="font-semibold text-blue-600">{formatCurrency(project.remaining)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ventes (unités)</p>
                          <p className="font-semibold">{project.unitsSold}/{project.unitsTotal}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2 mb-2" />
                        {project.nextMilestone && (
                          <p className="text-xs text-blue-600">Phase actuelle: {project.nextMilestone}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <span>Fin prévue: </span>
                          <span className="font-medium">
                            {project.expectedCompletion
                              ? new Date(project.expectedCompletion).toLocaleDateString('fr-FR')
                              : '—'}
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
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Ventes récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Ventes récentes
                  {businessStats.monthSales > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {businessStats.monthSales} ce mois
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-6 text-gray-500">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement...
                  </div>
                ) : recentSales.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <p className="text-sm">Aucune vente enregistrée</p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {sale.buyer_name || sale.unit_reference || 'Vente'}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {sale.unit_type || sale.unit_reference || '—'}
                          {sale.sale_date ? ` • ${new Date(sale.sale_date).toLocaleDateString('fr-FR')}` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(Number(sale.price) || 0)}
                        </p>
                        <p className="text-xs text-gray-500">{sale.status || ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
                )}
                <div className="mt-4 pt-4 border-t">
                  <Button size="sm" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Métriques rapides (données réelles) */}
            <Card>
              <CardHeader>
                <CardTitle>Métriques Clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ventes finalisées</span>
                    <span className="font-semibold text-green-600">
                      {loading ? '—' : `${businessStats.totalSales}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Projets actifs</span>
                    <span className="font-semibold">{loading ? '—' : businessStats.activeProjects}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget engagé</span>
                    <span className="font-semibold text-blue-600">
                      {loading ? '—' : formatCurrency(businessStats.totalBudget)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux d'utilisation budget</span>
                    <span className="font-semibold text-purple-600">
                      {loading || !businessStats.totalBudget
                        ? '—'
                        : `${Math.round((businessStats.totalSpent / businessStats.totalBudget) * 100)}%`}
                    </span>
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