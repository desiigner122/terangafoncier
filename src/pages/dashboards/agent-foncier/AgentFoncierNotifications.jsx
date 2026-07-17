import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  AlertTriangle,
  Info,
  MapPin,
  FileText,
  Calculator,
  Clock,
  Settings,
  Trash2,
  MailOpen,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Icône choisie d'après le type de notification (présentation, pas une donnée fabriquée)
const ICON_BY_TYPE = {
  evaluation: Calculator,
  estimation: Calculator,
  document: FileText,
  client: Users,
  prospect: Users,
  reminder: Clock,
  rappel: Clock,
  mission: MapPin,
  system: Settings,
  alert: AlertTriangle,
  info: Info
};

const getIcon = (type) => ICON_BY_TYPE[String(type || '').toLowerCase()] || Bell;

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.round((now - date) / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSeconds < 60) return `À l'instant`;
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  if (diffDays === 1) return `Hier`;
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
};

const AgentFoncierNotifications = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('id, user_id, title, message, type, read, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement notifications:', error);
      setNotifications([]);
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (!error) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
  };

  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);
    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (!error) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });

  // Types de filtre : "Toutes" + "Non lues" + les types réellement présents dans les données
  const presentTypes = [...new Set(notifications.map((n) => n.type).filter(Boolean))];
  const notificationTypes = [
    { key: 'all', label: 'Toutes', count: notifications.length },
    { key: 'unread', label: 'Non lues', count: notifications.filter((n) => !n.read).length },
    ...presentTypes.map((t) => ({
      key: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
      count: notifications.filter((n) => n.type === t).length
    }))
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

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
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Centre de notifications Agent Foncier</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {notificationTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setSelectedFilter(type.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === type.key
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type.label} ({type.count})
          </button>
        ))}
      </div>

      {/* Liste des notifications */}
      <div className="space-y-4">
        {filteredNotifications.map((notification, index) => {
          const Icon = getIcon(notification.type);
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className={`hover:shadow-md transition-shadow ${
                !notification.read ? 'border-l-4 border-l-green-500 bg-green-50' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${!notification.read ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-5 w-5 ${!notification.read ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">
                          {notification.title || 'Notification'}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {notification.type && (
                            <Badge variant="secondary" className="text-xs">
                              {notification.type}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                        </div>
                      </div>

                      {notification.message && (
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      )}

                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => handleMarkRead(notification.id)}
                          >
                            <MailOpen className="h-3 w-3 mr-1" />
                            Marquer comme lu
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-red-600"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Message si aucune notification */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune notification
          </h3>
          <p className="text-gray-600">
            {notifications.length === 0
              ? "Vous n'avez aucune notification pour le moment"
              : "Vous n'avez pas de notifications pour ce filtre"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AgentFoncierNotifications;
