import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Building,
  Clock,
  Settings,
  Trash2,
  Archive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Mapping type de notification -> icône + couleur (métadonnée d'affichage, pas de donnée fabriquée)
const TYPE_META = {
  investment: { icon: TrendingUp, color: 'green' },
  investissement: { icon: TrendingUp, color: 'green' },
  portfolio: { icon: DollarSign, color: 'blue' },
  portefeuille: { icon: DollarSign, color: 'blue' },
  legal: { icon: CheckCircle, color: 'purple' },
  juridique: { icon: CheckCircle, color: 'purple' },
  alert: { icon: AlertTriangle, color: 'orange' },
  alerte: { icon: AlertTriangle, color: 'orange' },
  financing: { icon: Building, color: 'green' },
  financement: { icon: Building, color: 'green' },
  system: { icon: Info, color: 'gray' },
  systeme: { icon: Info, color: 'gray' }
};

const InvestisseurNotifications = () => {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('id, user_id, title, message, type, read, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (err) {
        console.error('Erreur chargement notifications:', err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user?.id]);

  const getTypeLabel = (type) => {
    const labels = {
      investment: 'Investissement',
      investissement: 'Investissement',
      portfolio: 'Portfolio',
      portefeuille: 'Portfolio',
      legal: 'Juridique',
      juridique: 'Juridique',
      alert: 'Alerte',
      alerte: 'Alerte',
      financing: 'Financement',
      financement: 'Financement',
      system: 'Système',
      systeme: 'Système'
    };
    return labels[type] || type || 'Notification';
  };

  const getIconColor = (color) => {
    const colors = {
      green: 'text-green-600',
      blue: 'text-blue-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      gray: 'text-gray-600'
    };
    return colors[color] || 'text-gray-600';
  };

  const getTypeMeta = (type) => TYPE_META[type] || { icon: Info, color: 'gray' };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
    if (diffInHours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });

  const markAsRead = async (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    try {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    } catch (err) {
      console.error('Erreur mise à jour notification:', err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    if (!user?.id) return;
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
    } catch (err) {
      console.error('Erreur mise à jour notifications:', err);
    }
  };

  const deleteNotification = async (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    try {
      await supabase.from('notifications').delete().eq('id', id);
    } catch (err) {
      console.error('Erreur suppression notification:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="w-full h-full bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Bell className="h-6 w-6 mr-2 text-blue-600" />
              Notifications
            </h1>
            <p className="text-gray-600">
              {unreadCount} notification{unreadCount !== 1 ? 's' : ''} non lue{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            Toutes ({notifications.length})
          </Button>
          <Button
            variant={selectedFilter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('unread')}
          >
            Non lues ({unreadCount})
          </Button>
          <Button
            variant={selectedFilter === 'investment' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('investment')}
          >
            Investissements ({notifications.filter(n => n.type === 'investment').length})
          </Button>
          <Button
            variant={selectedFilter === 'portfolio' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('portfolio')}
          >
            Portfolio ({notifications.filter(n => n.type === 'portfolio').length})
          </Button>
        </div>

        {/* Liste des notifications */}
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => {
            const meta = getTypeMeta(notification.type);
            const Icon = meta.icon;
            return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={`${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''} hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Icône */}
                    <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-5 w-5 ${getIconColor(meta.color)}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(notification.created_at)}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            );
          })}
        </div>

        {/* Paramètres de notifications (préférences locales — persistance à venir) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-gray-600" />
              Préférences de Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications push</h4>
                  <p className="text-sm text-gray-600">Recevoir des notifications sur le navigateur</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Nouvelles opportunités</h4>
                  <p className="text-sm text-gray-600">Alertes pour les nouveaux investissements</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Mises à jour portfolio</h4>
                  <p className="text-sm text-gray-600">Changements de valeur de vos investissements</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertes marché</h4>
                  <p className="text-sm text-gray-600">Tendances et analyses du marché immobilier</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Rappels documents</h4>
                  <p className="text-sm text-gray-600">Documents à signer ou actions requises</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
            <p className="text-gray-600">
              {notifications.length === 0
                ? "Vous n'avez aucune notification pour le moment"
                : 'Vous n\'avez aucune notification pour ce filtre'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default InvestisseurNotifications;
