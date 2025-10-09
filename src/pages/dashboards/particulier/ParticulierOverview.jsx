import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText,
  Clock,
  MapPin,
  Calendar,
  Bell,
  MessageSquare,
  Star,
  Plus,
  ArrowRight,
  Activity,
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  Target,
  Eye,
  Phone,
  TrendingUp,
  Heart,
  Award,
  Home,
  Briefcase,
  Loader2,
  Search,
  Filter,
  MoreVertical,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierOverview = () => {
  const navigate = useNavigate();
  const { user, profile } = useOutletContext();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    totalNotifications: 0,
    unreadNotifications: 0,
    pendingRequests: 0,
    completedRequests: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        console.warn('User not loaded yet');
        return;
      }

      // Charger les statistiques réelles
      const [
        messagesResult,
        unreadMessagesResult,
        notificationsResult,
        unreadNotificationsResult
      ] = await Promise.all([
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('recipient_id', user.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('recipient_id', user.id).is('read_at', null),
        supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false)
      ]);

      setStats({
        totalMessages: messagesResult.count || 0,
        unreadMessages: unreadMessagesResult.count || 0,
        totalNotifications: notificationsResult.count || 0,
        unreadNotifications: unreadNotificationsResult.count || 0,
        pendingRequests: 0,
        completedRequests: 0
      });

      // Charger les messages récents
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentMessages(messages || []);

      // Charger les notifications récentes
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentNotifications(notifications || []);

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Maintenant';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}j`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tableau de Bord Particulier
          </h1>
          <p className="text-slate-600 mt-1">
            Bienvenue {profile?.full_name || user?.email?.split('@')[0] || 'Particulier'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/acheteur/messages')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
            {stats.unreadMessages > 0 && (
              <Badge className="ml-2 bg-blue-500">{stats.unreadMessages}</Badge>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/acheteur/notifications')}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {stats.unreadNotifications > 0 && (
              <Badge className="ml-2 bg-red-500">{stats.unreadNotifications}</Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Messages</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalMessages}</p>
                  {stats.unreadMessages > 0 && (
                    <p className="text-sm text-blue-600">{stats.unreadMessages} non lus</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Notifications</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalNotifications}</p>
                  {stats.unreadNotifications > 0 && (
                    <p className="text-sm text-red-600">{stats.unreadNotifications} nouvelles</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Demandes en cours</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.pendingRequests}</p>
                  <p className="text-sm text-orange-600">En attente</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Demandes traitées</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.completedRequests}</p>
                  <p className="text-sm text-green-600">Terminées</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions Dashboard Uniquement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
            Actions Dashboard
          </CardTitle>
          <CardDescription>
            Gérez vos demandes administratives et suivez vos dossiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/acheteur/demandes')}
            >
              <div className="flex items-center w-full">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">Demandes Terrains Communaux</span>
              </div>
              <p className="text-sm text-slate-600 text-left">
                Soumettre et suivre vos demandes de terrains communaux
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => navigate('/acheteur/construction')}
            >
              <div className="flex items-center w-full">
                <Building2 className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold">Demandes Construction</span>
              </div>
              <p className="text-sm text-slate-600 text-left">
                Soumettre des demandes de construction aux promoteurs
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lien vers pages publiques */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Search className="h-5 w-5 mr-2" />
            Recherche et Exploration
          </CardTitle>
          <CardDescription className="text-blue-600">
            Utilisez les pages publiques pour rechercher des biens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 border-blue-300 hover:bg-blue-100"
              onClick={() => window.open('/terrains', '_blank')}
            >
              <div className="flex items-center w-full">
                <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">Terrains Privés</span>
              </div>
              <p className="text-sm text-slate-600 text-left">
                Explorer les terrains en vente
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 border-blue-300 hover:bg-blue-100"
              onClick={() => window.open('/zones-communales', '_blank')}
            >
              <div className="flex items-center w-full">
                <Building2 className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">Zones Communales</span>
              </div>
              <p className="text-sm text-slate-600 text-left">
                Voir les zones disponibles
              </p>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start space-y-2 border-blue-300 hover:bg-blue-100"
              onClick={() => window.open('/recherche', '_blank')}
            >
              <div className="flex items-center w-full">
                <Search className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold">Recherche Avancée</span>
              </div>
              <p className="text-sm text-slate-600 text-left">
                Rechercher tous types de biens
              </p>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages récents et Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages récents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Messages Récents
              </CardTitle>
              <CardDescription>
                Vos derniers messages administratifs
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/acheteur/messages')}
            >
              Voir tout
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentMessages.length > 0 ? (
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {message.subject || 'Message administratif'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {getTimeAgo(message.created_at)}
                      </p>
                    </div>
                    {!message.read_at && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>Aucun message pour le moment</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications récentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-red-600" />
                Notifications Récentes
              </CardTitle>
              <CardDescription>
                Vos dernières notifications système
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/acheteur/notifications')}
            >
              Voir tout
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentNotifications.length > 0 ? (
              <div className="space-y-3">
                {recentNotifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {notification.title || 'Notification système'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {getTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>Aucune notification pour le moment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParticulierOverview;