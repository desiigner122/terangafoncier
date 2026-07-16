import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Cloud,
  Smartphone,
  Network,
  Zap,
  BarChart3,
  TrendingUp,
  Activity,
  Settings,
  FileText,
  Map,
  Brain,
  Monitor,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Il y a 1 jour';
  return `Il y a ${days} jours`;
};

const AgentFoncierServicesDigitaux = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState({
    documents: 0,
    missions: 0,
    missionsCompleted: 0,
    properties: 0,
    aiAnalyses: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [
          docsRes,
          missionsRes,
          missionsDoneRes,
          propsRes,
          aiRes,
          recentDocsRes,
          recentMissionsRes
        ] = await Promise.all([
          supabase.from('documents').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
          supabase.from('agent_missions').select('id', { count: 'exact', head: true }).eq('agent_id', user.id),
          supabase.from('agent_missions').select('id', { count: 'exact', head: true }).eq('agent_id', user.id).eq('status', 'completed'),
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('owner_id', user.id),
          supabase.from('ai_analyses').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('documents').select('id, name, created_at').eq('owner_id', user.id).order('created_at', { ascending: false }).limit(5),
          supabase.from('agent_missions').select('id, title, status, created_at').eq('agent_id', user.id).order('created_at', { ascending: false }).limit(5)
        ]);

        setCounters({
          documents: docsRes.count || 0,
          missions: missionsRes.count || 0,
          missionsCompleted: missionsDoneRes.count || 0,
          properties: propsRes.count || 0,
          aiAnalyses: aiRes.count || 0
        });

        const activities = [];
        (recentDocsRes.data || []).forEach((d) => {
          activities.push({
            id: `doc-${d.id}`,
            type: 'document',
            message: `Document enregistré : ${d.name || 'Sans nom'}`,
            created_at: d.created_at,
            status: 'success'
          });
        });
        (recentMissionsRes.data || []).forEach((m) => {
          activities.push({
            id: `mission-${m.id}`,
            type: 'mission',
            message: `Mission : ${m.title || 'Sans titre'}`,
            created_at: m.created_at,
            status: m.status === 'completed' ? 'success' : m.status === 'cancelled' ? 'warning' : 'pending'
          });
        });
        activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentActivities(activities.slice(0, 6));
      } catch (e) {
        console.error('Erreur chargement services digitaux:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Statistiques globales : uniquement des compteurs réels (aucun chiffre fabriqué)
  const globalStats = [
    { title: 'Documents', value: counters.documents, icon: FileText, color: 'from-blue-500 to-cyan-600' },
    { title: 'Missions', value: counters.missions, icon: Activity, color: 'from-purple-500 to-indigo-600' },
    { title: 'Missions terminées', value: counters.missionsCompleted, icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
    { title: 'Terrains', value: counters.properties, icon: Map, color: 'from-orange-500 to-red-600' },
    { title: 'Analyses IA', value: counters.aiAnalyses, icon: Brain, color: 'from-teal-500 to-cyan-600' }
  ];

  // Catalogue de services : offre statique (aucune métrique inventée).
  // Chaque service affiche soit un compteur d'usage RÉEL, soit "Bientôt disponible".
  const digitalServices = [
    {
      id: 'cloud-storage',
      name: 'Stockage Documentaire',
      description: 'Conservation sécurisée de vos documents fonciers',
      icon: Cloud,
      color: 'from-blue-500 to-cyan-600',
      available: true,
      counterLabel: 'Documents stockés',
      counterValue: counters.documents
    },
    {
      id: 'ai-analysis',
      name: 'Analyse IA',
      description: 'Analyses assistées par intelligence artificielle',
      icon: Brain,
      color: 'from-teal-500 to-cyan-600',
      available: true,
      counterLabel: 'Analyses réalisées',
      counterValue: counters.aiAnalyses
    },
    {
      id: 'field-missions',
      name: 'Gestion des Missions',
      description: 'Suivi digital des missions terrain',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      available: true,
      counterLabel: 'Missions gérées',
      counterValue: counters.missions
    },
    {
      id: 'property-registry',
      name: 'Registre des Terrains',
      description: 'Cartographie et suivi de vos biens',
      icon: Map,
      color: 'from-orange-500 to-red-600',
      available: true,
      counterLabel: 'Terrains référencés',
      counterValue: counters.properties
    },
    {
      id: 'mobile-app',
      name: 'Application Mobile',
      description: 'Accès mobile pour agents et clients',
      icon: Smartphone,
      color: 'from-green-500 to-emerald-600',
      available: false
    },
    {
      id: 'api-services',
      name: 'Services API',
      description: 'Intégrations avec services tiers (cadastre, notaires…)',
      icon: Network,
      color: 'from-purple-500 to-indigo-600',
      available: false
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
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
            Services Digitaux
          </h1>
          <p className="text-slate-600">Vos outils numériques et leur utilisation réelle</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </Button>
        </div>
      </motion.div>

      {/* Stats globales (compteurs réels) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {globalStats.map((stat, index) => (
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
                    <p className="text-2xl font-bold text-slate-900">
                      {loading ? '—' : stat.value}
                    </p>
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

      {/* Catalogue des services digitaux */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-600" />
              Catalogue des Services
            </CardTitle>
            <CardDescription>
              Vos outils numériques et leur niveau d'utilisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 border rounded-xl hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={service.available ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}>
                      {service.available ? 'Actif' : 'Bientôt disponible'}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{service.description}</p>

                  {service.available ? (
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-500">{service.counterLabel}</p>
                      <p className="text-xl font-bold text-slate-900">
                        {loading ? '—' : service.counterValue}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-500">Fonctionnalité à venir</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activités récentes (documents + missions réels) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Activités Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Chargement...
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Monitor className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>Aucune activité récente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900">{activity.message}</p>
                      <p className="text-xs text-slate-500">{timeAgo(activity.created_at)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Services d'infrastructure avancés (non instrumentés) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Monitoring Infrastructure
            </CardTitle>
            <CardDescription>
              Métriques système et supervision temps réel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-500">
              <TrendingUp className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-medium">Bientôt disponible</p>
              <p className="text-sm text-slate-400 mt-1">
                Le monitoring d'infrastructure (uptime, charge serveur, latence) sera activé prochainement.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentFoncierServicesDigitaux;
