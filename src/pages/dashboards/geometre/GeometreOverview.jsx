import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Ruler,
  Calculator,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Calendar,
  Camera,
  Map,
  Building2,
  Target,
  TrendingUp,
  Award,
  Layers,
  Route,
  Satellite,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Formatage relatif honnête d'une date réelle
const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hier';
  if (days < 30) return `Il y a ${days} j`;
  return new Date(dateStr).toLocaleDateString('fr-FR');
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Statut réel (survey_missions) → libellé FR + style
const STATUS_LABELS = {
  pending: 'En attente',
  in_progress: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé'
};

const isThisMonth = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

const GeometreOverview = () => {
  const { user } = useAuth();
  const geometreId = user?.id;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentMissions, setRecentMissions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (!geometreId) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const [missionsRes, clientsRes, measuresRes, docsRes] = await Promise.all([
          supabase
            .from('survey_missions')
            .select('id, title, client_name, location, status, scheduled_date, price, progress, mission_type, created_at')
            .eq('geometre_id', geometreId),
          supabase
            .from('crm_contacts')
            .select('id, created_at')
            .eq('owner_id', geometreId),
          supabase
            .from('field_measurements')
            .select('id, property_id, data, created_at')
            .eq('geometre_id', geometreId),
          supabase
            .from('documents')
            .select('id, name, type, created_at')
            .eq('owner_id', geometreId)
        ]);

        if (!active) return;

        const missions = missionsRes.data || [];
        const clients = clientsRes.data || [];
        const measures = measuresRes.data || [];
        const docs = docsRes.data || [];

        const activeMissions = missions.filter(
          (m) => m.status === 'pending' || m.status === 'in_progress'
        );
        const completedMissions = missions.filter((m) => m.status === 'completed');

        const newMissionsThisMonth = missions.filter((m) => isThisMonth(m.created_at)).length;
        const newClientsThisMonth = clients.filter((c) => isThisMonth(c.created_at)).length;
        const newMeasuresThisMonth = measures.filter((m) => isThisMonth(m.created_at)).length;
        const newDocsThisMonth = docs.filter((d) => isThisMonth(d.created_at)).length;

        const changeLabel = (n) => (n > 0 ? `+${n} ce mois` : 'Aucun ce mois');

        setStats([
          {
            title: 'Missions Actives',
            value: String(activeMissions.length),
            subtitle: `${completedMissions.length} terminée${completedMissions.length > 1 ? 's' : ''}`,
            change: changeLabel(newMissionsThisMonth),
            icon: Target,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Clients',
            value: String(clients.length),
            change: changeLabel(newClientsThisMonth),
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Mesures Terrain',
            value: String(measures.length),
            change: changeLabel(newMeasuresThisMonth),
            icon: Layers,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Documents',
            value: String(docs.length),
            change: changeLabel(newDocsThisMonth),
            icon: FileText,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          }
        ]);

        // Missions en cours : les actives d'abord, triées par échéance/création
        const sortedActive = [...activeMissions].sort((a, b) => {
          const da = new Date(a.scheduled_date || a.created_at || 0).getTime();
          const db = new Date(b.scheduled_date || b.created_at || 0).getTime();
          return da - db;
        });
        setRecentMissions(sortedActive.slice(0, 5));

        // Flux d'activité réel : dernières missions maj, documents, mesures
        const activities = [];
        completedMissions.forEach((m) => {
          activities.push({
            id: `mission-${m.id}`,
            action: 'Mission terminée',
            details: m.title || m.client_name || 'Mission',
            ts: m.created_at,
            icon: CheckCircle,
            color: 'text-green-600'
          });
        });
        docs.forEach((d) => {
          activities.push({
            id: `doc-${d.id}`,
            action: 'Document ajouté',
            details: d.name || d.type || 'Document',
            ts: d.created_at,
            icon: FileText,
            color: 'text-blue-600'
          });
        });
        measures.forEach((mes) => {
          activities.push({
            id: `measure-${mes.id}`,
            action: 'Relevé terrain enregistré',
            details: mes.data?.label || mes.data?.name || 'Mesure GPS/terrain',
            ts: mes.created_at,
            icon: Satellite,
            color: 'text-purple-600'
          });
        });
        activities.sort((a, b) => new Date(b.ts || 0) - new Date(a.ts || 0));
        setRecentActivities(activities.slice(0, 5));
      } catch (e) {
        if (!active) return;
        setStats([]);
        setRecentMissions([]);
        setRecentActivities([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [geometreId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'levé_topo': return Compass;
      case 'bornage': return Target;
      case 'implantation': return Route;
      case 'division': return Map;
      default: return FileText;
    }
  };

  return (
    <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
            <p className="text-gray-600 mt-1">Tableau de bord géomètre - Activités en cours</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Planning
            </Button>
            <Button>
              <Target className="w-4 h-4 mr-2" />
              Nouvelle Mission
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Chargement des données...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                          {stat.subtitle && (
                            <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                          )}
                          <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Missions en cours */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Missions en cours
                </CardTitle>
                <CardDescription>
                  Suivi de vos projets actifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!loading && recentMissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p>Aucune mission active</p>
                    </div>
                  )}
                  {recentMissions.map((mission) => {
                    const TypeIcon = getTypeIcon(mission.mission_type);
                    return (
                      <div key={mission.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <TypeIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{mission.title || 'Mission'}</h3>
                              <p className="text-sm text-gray-600">Client: {mission.client_name || '—'}</p>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <MapPin className="w-3 h-3 mr-1" />
                                {mission.location || '—'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(mission.status)}>
                              {STATUS_LABELS[mission.status] || mission.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              Échéance: {formatDate(mission.scheduled_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progression</span>
                              <span className="text-gray-900 font-medium">{mission.progress || 0}%</span>
                            </div>
                            <Progress value={mission.progress || 0} className="h-2" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activités récentes */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  Activités récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!loading && recentActivities.length === 0 && (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      Aucune activité récente
                    </div>
                  )}
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {activity.details}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {timeAgo(activity.ts)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Compass className="w-4 h-4 mr-2" />
                    Nouveau levé GPS
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcul surface
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Générer rapport
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Camera className="w-4 h-4 mr-2" />
                    Ajouter photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Performance mensuelle
            </CardTitle>
            <CardDescription>
              Évolution de vos missions et revenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Graphique de performance</p>
                <p className="text-gray-500 text-sm">Bientôt disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default GeometreOverview;
