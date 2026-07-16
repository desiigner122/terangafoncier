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
  Hammer,
  Clock,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Building,
  Settings,
  Camera,
  FileText,
  Phone,
  Eye,
  Edit,
  Plus,
  Filter,
  Download,
  Loader2,
  TrendingUp,
  Wallet
} from 'lucide-react';

const PromoteurChantiers = () => {
  const { user } = useAuth();
  const [selectedSite, setSelectedSite] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);

  // Chantiers (developer_projects) et ventes (project_sales) réels
  const [activeSites, setActiveSites] = useState([]);
  const [completedSites, setCompletedSites] = useState([]);
  const [constructionRequests, setConstructionRequests] = useState(0);

  // Statistiques agrégées (données réelles Supabase)
  const [siteStats, setSiteStats] = useState({
    totalActive: 0,
    totalCompleted: 0,
    totalBudget: 0,
    totalSpent: 0,
    averageProgress: 0,
    onTime: 0,
    delayed: 0
  });

  // Statut « terminé »
  const isDone = (s) =>
    ['completed', 'terminé', 'termine', 'delivered', 'livré', 'livre', 'done'].includes(
      String(s || '').toLowerCase()
    );

  // Un chantier est en retard si la fin prévue est dépassée et l'avancement < 100
  const isDelayed = (site) => {
    if (!site.estimated_completion) return false;
    if ((site.progress || 0) >= 100) return false;
    return new Date(site.estimated_completion) < new Date();
  };

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Projets / chantiers du promoteur
        const { data: projects } = await supabase
          .from('developer_projects')
          .select('*')
          .eq('developer_id', user.id)
          .order('created_at', { ascending: false });

        // Ventes du promoteur (pour compter les lots vendus par projet)
        const { data: sales } = await supabase
          .from('project_sales')
          .select('project_id, status')
          .eq('promoteur_id', user.id);

        // Demandes de construction associées au promoteur
        const { count: reqCount } = await supabase
          .from('construction_requests')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const projectList = projects || [];
        const salesList = sales || [];

        // Lots vendus par projet (statuts sold / delivered)
        const soldByProject = {};
        const totalByProject = {};
        salesList.forEach((s) => {
          totalByProject[s.project_id] = (totalByProject[s.project_id] || 0) + 1;
          if (['sold', 'delivered'].includes(String(s.status || '').toLowerCase())) {
            soldByProject[s.project_id] = (soldByProject[s.project_id] || 0) + 1;
          }
        });

        const active = projectList.filter((p) => !isDone(p.status));
        const completed = projectList.filter((p) => isDone(p.status));

        const withSales = (p) => ({
          ...p,
          soldUnits: soldByProject[p.id] || 0,
          totalUnits: totalByProject[p.id] || 0
        });

        setActiveSites(active.map(withSales));
        setCompletedSites(completed.map(withSales));
        setConstructionRequests(reqCount || 0);

        const totalBudget = projectList.reduce((s, p) => s + (Number(p.budget) || 0), 0);
        const totalSpent = projectList.reduce((s, p) => s + (Number(p.spent) || 0), 0);
        const avgProgress = active.length
          ? Math.round(active.reduce((s, p) => s + (Number(p.progress) || 0), 0) / active.length)
          : 0;
        const delayedCount = active.filter(isDelayed).length;

        setSiteStats({
          totalActive: active.length,
          totalCompleted: completed.length,
          totalBudget,
          totalSpent,
          averageProgress: avgProgress,
          onTime: active.length - delayedCount,
          delayed: delayedCount
        });
      } catch (err) {
        console.error('Erreur chargement chantiers:', err);
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

  // Libellé lisible du statut brut
  const getStatusLabel = (status, site) => {
    if (site && isDelayed(site)) return 'Retard';
    const s = String(status || '').toLowerCase();
    if (['completed', 'terminé', 'termine', 'delivered', 'livré', 'livre', 'done'].includes(s)) return 'Terminé';
    if (['in_progress', 'en_cours', 'en cours', 'ongoing', 'active'].includes(s)) return 'En cours';
    if (['planning', 'planned', 'planification', 'draft'].includes(s)) return 'Planification';
    if (['suspended', 'on_hold', 'suspendu', 'paused'].includes(s)) return 'Suspendu';
    if (['delayed', 'retard', 'late'].includes(s)) return 'Retard';
    return status || '—';
  };

  const getStatusColor = (label) => {
    switch (label) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Retard': return 'bg-red-100 text-red-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'Suspendu': return 'bg-yellow-100 text-yellow-800';
      case 'Planification': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (label) => {
    switch (label) {
      case 'En cours': return <Clock className="w-4 h-4" />;
      case 'Retard': return <AlertTriangle className="w-4 h-4" />;
      case 'Terminé': return <CheckCircle className="w-4 h-4" />;
      case 'Suspendu': return <Settings className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDelay = (plannedEnd) => {
    if (!plannedEnd) return 0;
    const today = new Date();
    const planned = new Date(plannedEnd);
    const diffTime = planned - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Chantiers</h1>
            <p className="text-gray-600">Suivi de vos chantiers de construction</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">
              <Hammer className="w-3 h-3 mr-1" />
              {siteStats.totalActive} chantiers actifs
            </Badge>
            {constructionRequests > 0 && (
              <Badge className="bg-purple-100 text-purple-800">
                <FileText className="w-3 h-3 mr-1" />
                {constructionRequests} demandes
              </Badge>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chantiers Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{siteStats.totalActive}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">{siteStats.onTime} dans les temps</span>
                  {siteStats.delayed > 0 && (
                    <span className="text-red-600 ml-2">• {siteStats.delayed} en retard</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avancement Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{siteStats.averageProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={siteStats.averageProgress} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">Chantiers en cours</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(siteStats.totalBudget)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Dépensé</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(siteStats.totalSpent)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress
                  value={siteStats.totalBudget ? Math.min(100, Math.round((siteStats.totalSpent / siteStats.totalBudget) * 100)) : 0}
                  className="h-2"
                />
                <span className="text-xs text-gray-500 mt-1">Consommation du budget</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Hammer className="w-4 h-4" />
              Chantiers Actifs ({activeSites.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Terminés ({completedSites.length})
            </TabsTrigger>
          </TabsList>

          {/* Chantiers actifs */}
          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Chantiers en Cours</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Rapport
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activeSites.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Hammer className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Aucun chantier actif</p>
                    <p className="text-sm">Vos projets de construction en cours apparaîtront ici.</p>
                  </div>
                ) : (
                <div className="space-y-6">
                  {activeSites.map((site) => {
                    const statusLabel = getStatusLabel(site.status, site);
                    return (
                    <motion.div
                      key={site.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Hammer className="w-8 h-8 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {site.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {site.location || '—'}
                              </div>
                              {site.client && (
                                <div className="flex items-center">
                                  <Building className="w-4 h-4 mr-1" />
                                  {site.client}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Phase actuelle: <strong>{site.current_phase || '—'}</strong>
                            </p>

                            {/* Badges */}
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(statusLabel)}>
                                {getStatusIcon(statusLabel)}
                                <span className="ml-1">{statusLabel}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {site.progress || 0}%
                          </div>
                          <div className="text-sm text-gray-500">Avancement</div>
                          <div className="text-sm text-gray-500 mt-2">
                            Fin prévue: {formatDate(site.estimated_completion)}
                          </div>
                          {calculateDelay(site.estimated_completion) < 0 && (site.progress || 0) < 100 && (
                            <div className="text-sm text-red-600 font-medium">
                              Retard: {Math.abs(calculateDelay(site.estimated_completion))} jours
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progression */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progression du chantier</span>
                          <span className="font-medium">{site.progress || 0}%</span>
                        </div>
                        <Progress value={site.progress || 0} className="h-3 mb-2" />
                      </div>

                      {/* Métriques */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="font-semibold">{formatCurrency(site.budget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Dépensé</p>
                          <p className="font-semibold text-orange-600">
                            {formatCurrency(site.spent)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Lots vendus</p>
                          <p className="font-semibold">
                            {site.totalUnits > 0 ? `${site.soldUnits}/${site.totalUnits}` : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Démarré le</p>
                          <p className="font-semibold">{formatDate(site.start_date)}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end pt-2 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-2" />
                            Photos
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Rapports
                          </Button>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                    );
                  })}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chantiers terminés */}
          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chantiers Terminés</CardTitle>
              </CardHeader>
              <CardContent>
                {completedSites.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Aucun chantier terminé</p>
                    <p className="text-sm">Vos chantiers livrés apparaîtront ici.</p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {completedSites.map((site) => {
                    const saving = (Number(site.budget) || 0) - (Number(site.spent) || 0);
                    return (
                    <div key={site.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{site.title}</h3>
                          <p className="text-sm text-gray-600">{site.location || '—'}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge className="bg-green-100 text-green-800">
                              Terminé
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          {site.budget != null && site.spent != null && (
                            <p className={`text-lg font-bold ${saving >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(Math.abs(saving))} {saving >= 0 ? 'économisé' : 'dépassement'}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Fin: {formatDate(site.estimated_completion || site.updated_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col">
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-sm">Nouveau Chantier</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-sm">Galerie Photos</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-sm">Demandes de Construction</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-sm">Rapport Mensuel</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromoteurChantiers;
