import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Users,
  FileText,
  TrendingUp,
  Map,
  Calculator,
  Camera,
  Target,
  Building2,
  DollarSign,
  BarChart3,
  Eye,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const formatXOF = (value) => {
  if (!value) return '0 XOF';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M XOF`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K XOF`;
  return `${Math.round(value)} XOF`;
};

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Il y a 1 jour';
  return `Il y a ${days} jours`;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return 'Non planifiée';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) +
    ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const AgentFoncierOverview = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [performance, setPerformance] = useState({ terrains: 0, verified: 0, documents: 0 });

  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const agentId = user.id;

        const [missionsRes, contactsRes, propertiesRes, documentsRes] = await Promise.all([
          supabase.from('agent_missions').select('*').eq('agent_id', agentId),
          supabase.from('crm_contacts').select('id, name, status, created_at').eq('owner_id', agentId),
          supabase.from('properties').select('id, title, name, location, verification_status, created_at').eq('owner_id', agentId),
          supabase.from('documents').select('id, name, status, created_at').eq('owner_id', agentId)
        ]);

        if (!isMounted) return;

        const missions = missionsRes.data || [];
        const contacts = contactsRes.data || [];
        const properties = propertiesRes.data || [];
        const documents = documentsRes.data || [];

        // KPI : commissions réelles (Σ commission des missions terminées)
        const totalCommission = missions
          .filter(m => m.status === 'completed')
          .reduce((sum, m) => sum + (Number(m.commission) || 0), 0);

        setStats([
          {
            title: 'Terrains Gérés',
            value: properties.length.toLocaleString('fr-FR'),
            icon: Map,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: 'Clients Actifs',
            value: contacts.length.toLocaleString('fr-FR'),
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Documents Traités',
            value: documents.length.toLocaleString('fr-FR'),
            icon: FileText,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Commissions',
            value: totalCommission > 0 ? formatXOF(totalCommission) : '—',
            icon: DollarSign,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          }
        ]);

        // Activités récentes : dernières missions de l'agent
        const missionStatusMap = {
          completed: { label: 'Terminé', badge: 'success', bucket: 'completed' },
          in_progress: { label: 'En cours', badge: 'warning', bucket: 'pending' },
          pending: { label: 'En attente', badge: 'warning', bucket: 'pending' },
          cancelled: { label: 'Annulé', badge: 'default', bucket: 'new' }
        };
        const missionTypeIcon = {
          prospection: Target,
          verification: CheckCircle,
          accompagnement: Users,
          estimation: Calculator
        };

        const activities = [...missions]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)
          .map((m) => {
            const meta = missionStatusMap[m.status] || { label: m.status, badge: 'default', bucket: 'new' };
            return {
              id: m.id,
              action: m.title || m.mission_type || 'Mission',
              client: [m.client_name, m.location].filter(Boolean).join(' - ') || '—',
              time: timeAgo(m.created_at),
              status: meta.bucket,
              statusLabel: meta.label,
              badge: meta.badge,
              icon: missionTypeIcon[m.mission_type] || Map
            };
          });
        setRecentActivities(activities);

        // Prochaines tâches : missions non terminées à venir
        const priorityFromDate = (dateStr) => {
          if (!dateStr) return 'low';
          const days = (new Date(dateStr).getTime() - Date.now()) / 86400000;
          if (days <= 1) return 'high';
          if (days <= 3) return 'medium';
          return 'low';
        };

        const tasks = missions
          .filter(m => m.status === 'pending' || m.status === 'in_progress')
          .sort((a, b) => {
            const da = a.scheduled_date ? new Date(a.scheduled_date).getTime() : Infinity;
            const db = b.scheduled_date ? new Date(b.scheduled_date).getTime() : Infinity;
            return da - db;
          })
          .slice(0, 5)
          .map((m) => ({
            id: m.id,
            task: m.title || m.mission_type || 'Mission',
            date: formatDateTime(m.scheduled_date),
            priority: priorityFromDate(m.scheduled_date),
            client: m.client_name || m.location || '—'
          }));
        setUpcomingTasks(tasks);

        // Performance mensuelle : agrégats réels
        const completedMissions = missions.filter(m => m.status === 'completed').length;
        const verifiedProperties = properties.filter(p => p.verification_status === 'verified').length;
        const processedDocuments = documents.filter(d => d.status === 'validated' || d.status === 'approved' || d.status === 'completed').length;

        setPerformance({
          terrains: missions.length > 0 ? Math.round((completedMissions / missions.length) * 100) : 0,
          verified: properties.length > 0 ? Math.round((verifiedProperties / properties.length) * 100) : 0,
          documents: documents.length > 0 ? Math.round((processedDocuments / documents.length) * 100) : 0
        });
      } catch (err) {
        console.error('Erreur chargement vue d\'ensemble agent foncier:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-600">Tableau de bord Agent Foncier</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Rapport
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Terrain
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activités récentes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Activités récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">Aucune activité récente.</p>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className={`p-2 rounded-lg ${
                        activity.status === 'completed' ? 'bg-green-100' :
                        activity.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <activity.icon className={`h-4 w-4 ${
                          activity.status === 'completed' ? 'text-green-600' :
                          activity.status === 'pending' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        <Badge variant={activity.badge} className="text-xs">
                          {activity.statusLabel}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tâches à venir */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Prochaines tâches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">Aucune tâche planifiée.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{task.task}</h4>
                        <Badge variant={
                          task.priority === 'high' ? 'destructive' :
                          task.priority === 'medium' ? 'warning' : 'secondary'
                        } className="text-xs">
                          {task.priority === 'high' ? 'Urgent' :
                           task.priority === 'medium' ? 'Moyen' : 'Faible'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{task.client}</p>
                      <p className="text-xs text-gray-500">{task.date}</p>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les tâches
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance mensuelle */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Missions terminées</span>
                  <span className="text-sm font-medium">{performance.terrains}%</span>
                </div>
                <Progress value={performance.terrains} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Terrains vérifiés</span>
                  <span className="text-sm font-medium">{performance.verified}%</span>
                </div>
                <Progress value={performance.verified} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Documents traités</span>
                  <span className="text-sm font-medium">{performance.documents}%</span>
                </div>
                <Progress value={performance.documents} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentFoncierOverview;
