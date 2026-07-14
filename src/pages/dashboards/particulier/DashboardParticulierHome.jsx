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
  const [quickActions, setQuickActions] = useState([]);
  const [objectifs, setObjectifs] = useState({ profil: 0, documents: 0, demandes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        // Aucun utilisateur connecté : compteurs à zéro, pas de données simulées
        setStats({
          messages: 0,
          notifications: 0,
          tickets: 0,
          demandes: 0,
          documents: 0,
          favoris: 0
        });
        setRecentActivity([]);
        return;
      }

      // Récupérer les conversations de l'utilisateur (pour compter ses messages)
      const { data: participations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
      const conversationIds = (participations || []).map(p => p.conversation_id);

      // Charger les vraies données
      const [
        messagesResult,
        notificationsResult,
        ticketsResult,
        demandesResult,
        documentsResult,
        favorisResult
      ] = await Promise.allSettled([
        conversationIds.length > 0
          ? supabase.from('messages').select('id', { count: 'exact' }).in('conversation_id', conversationIds).neq('sender_id', user.id).eq('read', false).limit(0)
          : Promise.resolve({ count: 0 }),
        supabase.from('notifications').select('id', { count: 'exact' }).eq('user_id', user.id).eq('read', false).limit(0),
        supabase.from('support_tickets').select('id,status').eq('user_id', user.id),
        supabase.from('communal_requests').select('id,status').eq('applicant_id', user.id),
        supabase.from('documents').select('id,status').eq('owner_id', user.id),
        supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', user.id).limit(0)
      ]);

      const openStatuses = ['nouveau', 'en_cours', 'open', 'in_progress', 'pending'];
      const validatedStatuses = ['approved', 'validated', 'verified', 'valide', 'validé'];
      const tickets = ticketsResult.value?.data || [];
      const demandesList = demandesResult.value?.data || [];
      const documentsList = documentsResult.value?.data || [];

      setStats({
        messages: messagesResult.value?.count || 0,
        notifications: notificationsResult.value?.count || 0,
        tickets: tickets.filter(t => openStatuses.includes(t.status)).length,
        demandes: demandesList.length,
        documents: documentsList.length,
        favoris: favorisResult.value?.count || 0
      });

      // Objectifs calculés à partir des vraies données
      const profileFields = [profile?.full_name, profile?.phone, profile?.city, profile?.region, profile?.avatar_url, profile?.profession];
      const filledFields = profileFields.filter(Boolean).length;
      setObjectifs({
        profil: Math.round((filledFields / profileFields.length) * 100),
        documents: documentsList.length > 0
          ? Math.round((documentsList.filter(d => validatedStatuses.includes((d.status || '').toLowerCase())).length / documentsList.length) * 100)
          : 0,
        demandes: demandesList.length > 0
          ? Math.round((demandesList.filter(d => ['pending', 'en_cours', 'in_progress', 'processing'].includes((d.status || '').toLowerCase())).length / demandesList.length) * 100)
          : 0
      });

      // Charger activité récente (derniers messages reçus + notifications)
      const activity = [];

      if (conversationIds.length > 0) {
        const { data: messages } = await supabase
          .from('messages')
          .select('id, content, read, created_at')
          .in('conversation_id', conversationIds)
          .neq('sender_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        (messages || []).forEach(msg => {
          activity.push({
            id: `msg-${msg.id}`,
            type: 'message',
            title: 'Nouveau message',
            description: (msg.content || '').substring(0, 100),
            time: msg.created_at,
            status: msg.read ? 'lu' : 'nouveau',
            icon: MessageSquare,
            color: 'blue'
          });
        });
      }

      const { data: notifs } = await supabase
        .from('notifications')
        .select('id, title, message, read, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      (notifs || []).forEach(n => {
        activity.push({
          id: `notif-${n.id}`,
          type: 'notification',
          title: n.title || 'Notification',
          description: (n.message || '').substring(0, 100),
          time: n.created_at,
          status: n.read ? 'lu' : 'nouveau',
          icon: Bell,
          color: 'orange'
        });
      });

      activity.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivity(activity.slice(0, 5));

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Messages',
      value: stats.messages,
      change: 'Non lus',
      icon: MessageSquare,
      color: 'blue',
      path: '/acheteur/messages'
    },
    {
      title: 'Notifications',
      value: stats.notifications,
      change: 'Non lues',
      icon: Bell,
      color: 'yellow',
      path: '/acheteur/notifications'
    },
    {
      title: 'Tickets Support',
      value: stats.tickets,
      change: 'En cours',
      icon: Ticket,
      color: 'red',
      path: '/acheteur/tickets'
    },
    {
      title: 'Demandes',
      value: stats.demandes,
      change: 'Total',
      icon: FileText,
      color: 'green',
      path: '/acheteur/demandes-terrains'
    },
    {
      title: 'Documents',
      value: stats.documents,
      change: 'Total',
      icon: FileText,
      color: 'purple',
      path: '/acheteur/documents'
    },
    {
      title: 'Favoris',
      value: stats.favoris,
      change: 'Total',
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
              {(profile?.created_at || user?.created_at) && (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm">
                    Membre depuis {new Date(profile?.created_at || user?.created_at).getFullYear()}
                  </span>
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
                <span className="text-sm text-slate-500">{objectifs.profil}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${objectifs.profil}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Documents validés</span>
                <span className="text-sm text-slate-500">{objectifs.documents}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${objectifs.documents}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Demandes actives</span>
                <span className="text-sm text-slate-500">{objectifs.demandes}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${objectifs.demandes}%` }}></div>
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