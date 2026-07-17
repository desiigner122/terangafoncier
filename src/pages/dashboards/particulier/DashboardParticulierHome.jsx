import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Bell,
  FileText, 
  MapPin,
  Building2,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Ticket,
  ArrowRight,
  Plus,
  Activity,
  PieChart,
  DollarSign,
  Zap,
  Target,
  Award,
  Sparkles
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';
import ParticulierSupabaseService from '@/services/ParticulierSupabaseService';

const DashboardParticulierHome = () => {
  const navigate = useNavigate();
  const { user, profile } = useOutletContext();
  
  const [stats, setStats] = useState({
    messages: 0,
    notifications: 0,
    tickets: 0,
    demandes: 0,
    documents: 0,
    favoris: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [goals, setGoals] = useState({
    profil: 0,
    documentsValides: 0,
    demandesActives: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user, profile]);

  // Calcule la complétude du profil à partir des vrais champs remplis
  const computeProfileCompletion = (p) => {
    if (!p) return 0;
    const fields = ['full_name', 'phone', 'email', 'address', 'city', 'region', 'profession', 'avatar_url'];
    const filled = fields.filter((f) => p[f] && String(p[f]).trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        // Aucune donnée fabriquée : on affiche des états vides honnêtes
        setStats({ messages: 0, notifications: 0, tickets: 0, demandes: 0, documents: 0, favoris: 0 });
        setRecentActivity([]);
        setGoals({ profil: 0, documentsValides: 0, demandesActives: 0 });
        return;
      }

      // Compteurs agrégés réels (favoris, notifications non lues, demandes communales...)
      const overviewRes = await ParticulierSupabaseService.getOverviewStats(user.id);
      const overview = overviewRes?.data || {};

      // Données détaillées réelles (documents, tickets, demandes, notifications, messagerie)
      const [documentsRes, ticketsRes, communalRes, notifsRes, participationsRes] = await Promise.all([
        ParticulierSupabaseService.getDocuments(user.id),
        ParticulierSupabaseService.getSupportTickets(user.id),
        ParticulierSupabaseService.getCommunalRequests(user.id),
        ParticulierSupabaseService.getNotifications(user.id),
        supabase.from('conversation_participants').select('conversation_id').eq('user_id', user.id)
      ]);

      const documents = documentsRes?.data || [];
      const tickets = ticketsRes?.data || [];
      const communalRequests = communalRes?.data || [];
      const notifications = notifsRes?.data || [];

      // Tickets ouverts (statuts actifs, tolérant aux différentes conventions)
      const openStatuses = ['nouveau', 'en_cours', 'open', 'pending', 'in_progress'];
      const openTickets = tickets.filter((t) => openStatuses.includes((t.status || '').toLowerCase()));

      // Messages non lus reçus (dans les conversations de l'utilisateur, non émis par lui)
      let messagesCount = 0;
      const conversationIds = (participationsRes?.data || []).map((p) => p.conversation_id);
      if (conversationIds.length > 0) {
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .in('conversation_id', conversationIds)
          .eq('read', false)
          .neq('sender_id', user.id);
        messagesCount = count || 0;
      }

      setStats({
        messages: messagesCount,
        notifications: overview.unreadNotifications || 0,
        tickets: openTickets.length,
        demandes: overview.communalRequests ?? communalRequests.length,
        documents: documents.length,
        favoris: overview.favorites || 0
      });

      // Activité récente réelle : dernières notifications de l'utilisateur
      const activity = notifications.slice(0, 5).map((n) => ({
        id: n.id,
        type: n.type || 'notification',
        title: n.title || 'Notification',
        description: n.message || '',
        time: n.created_at,
        status: n.read ? 'lu' : 'nouveau',
        icon: Bell,
        color: 'blue'
      }));
      setRecentActivity(activity);

      // Objectifs calculés à partir de vraies données (jamais fabriqués)
      const validatedStatuses = ['validated', 'verified', 'valid', 'approved', 'valide', 'vérifié', 'verifie'];
      const validatedDocs = documents.filter((d) => validatedStatuses.includes((d.status || '').toLowerCase()));
      const closedStatuses = ['completed', 'rejected', 'refuse', 'refusée', 'termine', 'terminé', 'annule', 'cancelled', 'closed'];
      const activeRequests = communalRequests.filter((r) => !closedStatuses.includes((r.status || '').toLowerCase()));

      setGoals({
        profil: computeProfileCompletion(profile),
        documentsValides: documents.length > 0 ? Math.round((validatedDocs.length / documents.length) * 100) : 0,
        demandesActives: communalRequests.length > 0 ? Math.round((activeRequests.length / communalRequests.length) * 100) : 0
      });
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const memberSince = profile?.created_at ? new Date(profile.created_at).getFullYear() : null;

  const statsCards = [
    {
      title: 'Messages',
      value: stats.messages,
      change: stats.messages > 0 ? `${stats.messages} non lu${stats.messages > 1 ? 's' : ''}` : 'Aucun message non lu',
      icon: MessageSquare,
      color: 'blue',
      path: '/acheteur/messages'
    },
    {
      title: 'Notifications',
      value: stats.notifications,
      change: stats.notifications > 0 ? `${stats.notifications} non lue${stats.notifications > 1 ? 's' : ''}` : 'Tout est à jour',
      icon: Bell,
      color: 'yellow',
      path: '/acheteur/notifications'
    },
    {
      title: 'Tickets Support',
      value: stats.tickets,
      change: stats.tickets > 0 ? `${stats.tickets} en cours` : 'Aucun ticket ouvert',
      icon: Ticket,
      color: 'red',
      path: '/acheteur/tickets'
    },
    {
      title: 'Demandes',
      value: stats.demandes,
      change: stats.demandes > 0 ? 'Demandes de terrains communaux' : 'Aucune demande',
      icon: FileText,
      color: 'green',
      path: '/acheteur/demandes-terrains'
    },
    {
      title: 'Documents',
      value: stats.documents,
      change: stats.documents > 0 ? `${stats.documents} document${stats.documents > 1 ? 's' : ''}` : 'Aucun document',
      icon: FileText,
      color: 'purple',
      path: '/acheteur/documents'
    },
    {
      title: 'Favoris',
      value: stats.favoris,
      change: stats.favoris > 0 ? `${stats.favoris} bien${stats.favoris > 1 ? 's' : ''} sauvegardé${stats.favoris > 1 ? 's' : ''}` : 'Aucun favori',
      icon: Star,
      color: 'orange',
      path: '/acheteur/favoris'
    }
  ];

  const quickActionItems = [
    {
      title: 'Nouvelle Demande Terrain',
      description: 'Déposer une demande de terrain communal',
      icon: MapPin,
      color: 'blue',
      path: '/acheteur/demandes-terrains',
      action: 'create'
    },
    {
      title: 'Créer un Ticket',
      description: 'Contacter le support technique',
      icon: Ticket,
      color: 'red',
      path: '/acheteur/tickets',
      action: 'create'
    },
    {
      title: 'Upload Document',
      description: 'Ajouter un nouveau document',
      icon: FileText,
      color: 'green',
      path: '/acheteur/documents',
      action: 'upload'
    },
    {
      title: 'Projet Construction',
      description: 'Nouvelle demande de construction',
      icon: Building2,
      color: 'purple',
      path: '/acheteur/constructions',
      action: 'create'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-orange-100 text-orange-800';
      case 'resolu': return 'bg-green-100 text-green-800';
      case 'lu': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 24) {
      return `${Math.floor(diffHours / 24)}j`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return `${diffMinutes}min`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Bienvenue, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Particulier'} ! 👋
            </h2>
            <p className="text-blue-100 text-lg">
              Gérez vos dossiers immobiliers en toute simplicité
            </p>
            <div className="flex items-center gap-4 mt-4">
              {profile?.is_verified && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span className="text-sm">Compte vérifié</span>
                </div>
              )}
              {memberSince && (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm">Membre depuis {memberSince}</span>
                </div>
              )}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <Activity className="h-16 w-16 text-white/80" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">Vue d'ensemble</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => navigate(stat.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                        <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
                      </div>
                      <div className={`
                        p-3 rounded-xl transition-all duration-200 group-hover:scale-110
                        ${stat.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                        ${stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : ''}
                        ${stat.color === 'red' ? 'bg-red-100 text-red-600' : ''}
                        ${stat.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                        ${stat.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                        ${stat.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
                      `}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Actions rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-slate-900 mb-6">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActionItems.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Card 
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-2 border-transparent hover:border-blue-200"
                  onClick={() => navigate(action.path)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`
                      w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110
                      ${action.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                      ${action.color === 'red' ? 'bg-red-100 text-red-600' : ''}
                      ${action.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                      ${action.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                    `}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{action.title}</h4>
                    <p className="text-xs text-slate-500">{action.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Activité récente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Activités */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Activité récente
            </CardTitle>
            <CardDescription>
              Vos dernières interactions et mises à jour
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className={`
                      p-2 rounded-lg
                      ${activity.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                      ${activity.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                      ${activity.color === 'orange' ? 'bg-orange-100 text-orange-600' : ''}
                    `}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          il y a {getTimeAgo(activity.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Aucune activité récente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progression et objectifs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Vos objectifs
            </CardTitle>
            <CardDescription>
              Suivi de vos démarches immobilières
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Profil complet</span>
                <span className="text-sm text-slate-500">{goals.profil}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${goals.profil}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Documents validés</span>
                <span className="text-sm text-slate-500">{goals.documentsValides}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${goals.documentsValides}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Demandes actives</span>
                <span className="text-sm text-slate-500">{goals.demandesActives}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: `${goals.demandesActives}%` }}></div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Prochain objectif</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Compléter la validation de vos documents pour accélérer vos demandes
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardParticulierHome;