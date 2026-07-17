import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
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
  Users, 
  FileText, 
  Bell,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import ParticulierSupabaseService from '@/services/ParticulierSupabaseService';

const ParticulierOverview = () => {
  // Gestion sécurisée du contexte Outlet
  let user = null;
  try {
    const context = useOutletContext();
    user = context?.user || null;
  } catch (error) {
    console.warn('useOutletContext not available, using fallback:', error);
  }

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    messages: 0,
    notifications: 0,
    demandes: 0,
    documents: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    const userId = user?.id;

    // Aucune fabrication de chiffres : sans utilisateur authentifié, tout reste à zéro.
    if (!userId) {
      setStats({ messages: 0, notifications: 0, demandes: 0, documents: 0 });
      setRecentActivity([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Compteurs agrégés + listes réelles (VRAIES tables via le service).
      const [
        overviewRes,
        documentsRes,
        conversationsRes,
        communalRes,
        visitsRes,
        notificationsRes
      ] = await Promise.all([
        ParticulierSupabaseService.getOverviewStats(userId),
        ParticulierSupabaseService.getDocuments(userId),
        ParticulierSupabaseService.getConversations(userId),
        ParticulierSupabaseService.getCommunalRequests(userId),
        ParticulierSupabaseService.getMyVisits(userId),
        ParticulierSupabaseService.getNotifications(userId)
      ]);

      const overview = overviewRes?.data || {};
      const documents = documentsRes?.data || [];
      const conversations = conversationsRes?.data || [];
      const communalRequests = communalRes?.data || [];
      const visits = visitsRes?.data || [];
      const notifications = notificationsRes?.data || [];

      setStats({
        messages: conversations.length,
        notifications: overview.unreadNotifications ?? 0,
        demandes: overview.communalRequests ?? communalRequests.length,
        documents: documents.length
      });

      // Activité récente construite à partir des VRAIES listes.
      const activity = [];

      communalRequests.slice(0, 3).forEach(req => {
        activity.push({
          id: `communal-${req.id}`,
          type: 'demande',
          title: `Demande terrain${req.commune ? ` — ${req.commune}` : ''}`,
          description: `Statut : ${req.status || 'en cours'}`,
          time: req.created_at,
          icon: MapPin,
          color: req.status === 'acceptee' || req.status === 'approved' ? 'green'
            : req.status === 'refusee' || req.status === 'rejected' ? 'gray' : 'orange'
        });
      });

      visits.slice(0, 3).forEach(visit => {
        const propName = visit.property?.title || visit.property?.name || 'Terrain';
        activity.push({
          id: `visit-${visit.id}`,
          type: 'visite',
          title: `Visite — ${propName}`,
          description: `Statut : ${visit.status || 'en attente'}`,
          time: visit.requested_date || visit.created_at,
          icon: Calendar,
          color: visit.status === 'confirmed' ? 'green'
            : visit.status === 'cancelled' ? 'gray' : 'orange'
        });
      });

      notifications.slice(0, 3).forEach(notif => {
        activity.push({
          id: `notif-${notif.id}`,
          type: 'notification',
          title: notif.title || 'Notification',
          description: notif.message || '',
          time: notif.created_at,
          icon: Bell,
          color: notif.read ? 'gray' : 'blue'
        });
      });

      activity.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
      setRecentActivity(activity.slice(0, 5));
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      setError(err.message);
      setStats({ messages: 0, notifications: 0, demandes: 0, documents: 0 });
      setRecentActivity([]);
    } finally {
      setLoading(false);
    }
  };

  const displayActivity = recentActivity;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tableau de bord
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue {user?.email || 'Utilisateur'} - Vue d'ensemble de vos démarches administratives
          </p>
        </div>
        
        {error && (
          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
            Données indisponibles
          </Badge>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Messages</p>
                <p className="text-2xl font-bold text-blue-900">{stats.messages}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Demandes</p>
                <p className="text-2xl font-bold text-green-900">{stats.demandes}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Notifications</p>
                <p className="text-2xl font-bold text-orange-900">{stats.notifications}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Documents</p>
                <p className="text-2xl font-bold text-purple-900">{stats.documents}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Vos dernières interactions avec la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayActivity.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">Aucune activité récente</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Vos demandes, visites et notifications apparaîtront ici.
                  </p>
                </div>
              ) : (
                displayActivity.slice(0, 5).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className={`p-2 rounded-full bg-${activity.color}-100`}>
                      <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time ? new Date(activity.time).toLocaleDateString('fr-FR') : ''}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accès direct aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/acheteur/demandes'}
              >
                <MapPin className="h-6 w-6" />
                <span className="text-sm">Nouvelle demande</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/acheteur/zones-communales'}
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Zones disponibles</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/acheteur/documents'}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm">Mes documents</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/acheteur/messages'}
              >
                <MessageSquare className="h-6 w-6" />
                <span className="text-sm">Messages</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message informatif si erreur de chargement */}
      {error && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800">
                  Impossible de charger vos données pour le moment
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  Une erreur est survenue lors de la récupération de vos informations.
                  Veuillez réessayer dans un instant.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParticulierOverview;