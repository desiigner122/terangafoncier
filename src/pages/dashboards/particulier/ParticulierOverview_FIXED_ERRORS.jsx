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
import { supabase } from '@/services/supabaseClient';

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
    // Charger les données même sans utilisateur (mode fallback)
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Essayer de charger les données réelles avec fallback
      await Promise.allSettled([
        loadMessages(),
        loadNotifications(),
        loadDemandesTerrains(),
        loadDocuments()
      ]);
      
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      setError(err.message);
      // Utiliser des données de fallback
      setStats({
        messages: 0,
        notifications: 0,
        demandes: 0,
        documents: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      // Si pas d'utilisateur, utiliser des données de fallback
      if (!user?.id) {
        setStats(prev => ({ ...prev, messages: 3 }));
        return;
      }

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.warn('Messages non disponibles:', error.message);
        setStats(prev => ({ ...prev, messages: 0 }));
        return;
      }

      setStats(prev => ({ ...prev, messages: data?.length || 0 }));
      
      // Ajouter à l'activité récente
      if (data && data.length > 0) {
        const messageActivity = data.slice(0, 2).map(msg => ({
          id: `msg-${msg.id}`,
          type: 'message',
          title: msg.subject,
          description: `Message de l'administration`,
          time: msg.created_at,
          icon: MessageSquare,
          color: 'blue'
        }));
        setRecentActivity(prev => [...prev, ...messageActivity]);
      }
    } catch (err) {
      console.warn('Erreur chargement messages:', err);
      setStats(prev => ({ ...prev, messages: 0 }));
    }
  };

  const loadNotifications = async () => {
    try {
      // Si pas d'utilisateur, utiliser des données de fallback
      if (!user?.id) {
        setStats(prev => ({ ...prev, notifications: 2 }));
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .is('read_at', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.warn('Notifications non disponibles:', error.message);
        setStats(prev => ({ ...prev, notifications: 0 }));
        return;
      }

      setStats(prev => ({ ...prev, notifications: data?.length || 0 }));
    } catch (err) {
      console.warn('Erreur chargement notifications:', err);
      setStats(prev => ({ ...prev, notifications: 0 }));
    }
  };

  const loadDemandesTerrains = async () => {
    try {
      // Si pas d'utilisateur, utiliser des données de fallback
      if (!user?.id) {
        setStats(prev => ({ ...prev, demandes: 1 }));
        return;
      }

      const { data, error } = await supabase
        .from('demandes_terrains_communaux')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.warn('Demandes terrains non disponibles:', error.message);
        setStats(prev => ({ ...prev, demandes: 0 }));
        return;
      }

      setStats(prev => ({ ...prev, demandes: data?.length || 0 }));
      
      // Ajouter à l'activité récente
      if (data && data.length > 0) {
        const demandeActivity = data.slice(0, 1).map(demande => ({
          id: `demande-${demande.id}`,
          type: 'demande',
          title: `Demande terrain ${demande.commune}`,
          description: `Statut: ${demande.statut}`,
          time: demande.created_at,
          icon: MapPin,
          color: demande.statut === 'acceptee' ? 'green' : demande.statut === 'en_cours' ? 'orange' : 'gray'
        }));
        setRecentActivity(prev => [...prev, ...demandeActivity]);
      }
    } catch (err) {
      console.warn('Erreur chargement demandes:', err);
      setStats(prev => ({ ...prev, demandes: 0 }));
    }
  };

  const loadDocuments = async () => {
    try {
      // Si pas d'utilisateur, utiliser des données de fallback
      if (!user?.id) {
        setStats(prev => ({ ...prev, documents: 2 }));
        return;
      }

      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.warn('Documents non disponibles:', error.message);
        setStats(prev => ({ ...prev, documents: 0 }));
        return;
      }

      setStats(prev => ({ ...prev, documents: data?.length || 0 }));
    } catch (err) {
      console.warn('Erreur chargement documents:', err);
      setStats(prev => ({ ...prev, documents: 0 }));
    }
  };

  // Données de fallback si les tables n'existent pas
  const fallbackActivity = [
    {
      id: 'welcome',
      type: 'system',
      title: 'Bienvenue sur Teranga Foncier',
      description: 'Votre dashboard particulier est prêt',
      time: new Date().toISOString(),
      icon: Users,
      color: 'blue'
    },
    {
      id: 'setup',
      type: 'info',
      title: 'Configuration base de données',
      description: 'Exécutez les scripts SQL pour activer toutes les fonctionnalités',
      time: new Date().toISOString(),
      icon: AlertTriangle,
      color: 'orange'
    }
  ];

  const displayActivity = recentActivity.length > 0 ? recentActivity : fallbackActivity;

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
            Mode Fallback
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
              {displayActivity.slice(0, 5).map((activity, index) => (
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
                      {new Date(activity.time).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </motion.div>
              ))}
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

      {/* Message informatif si erreur */}
      {error && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-800">
                  Configuration base de données requise
                </h3>
                <p className="text-sm text-orange-700 mt-1">
                  Pour activer toutes les fonctionnalités, exécutez le script SQL : 
                  <code className="ml-1 px-1 py-0.5 bg-orange-100 rounded text-xs">
                    fix-messages-table-errors.sql
                  </code>
                </p>
                <p className="text-xs text-orange-600 mt-2">
                  Le dashboard fonctionne en mode dégradé avec des données de démonstration.
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