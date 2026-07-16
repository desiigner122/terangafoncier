import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  MapPin,
  Users,
  FileText,
  Clock,
  X,
  Eye,
  Archive,
  Filter,
  Search,
  Settings,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const GeometreNotifications = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement des notifications réelles (table notifications, filtré par user_id)
  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
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
  }, [user?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      if (error) throw error;
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error('Erreur marquage notification:', err);
    }
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Erreur marquage global:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'mission': return MapPin;
      case 'deadline': return Clock;
      case 'message': return Users;
      case 'document': return FileText;
      case 'instrument': return Settings;
      case 'payment': return CheckCircle;
      case 'system': return Info;
      case 'weather': return AlertTriangle;
      case 'alert': return AlertTriangle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'alert':
      case 'weather':
      case 'deadline': return 'text-red-600 bg-red-50';
      case 'mission':
      case 'message': return 'text-orange-600 bg-orange-50';
      case 'payment': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  // Types réellement présents dans les données pour construire le filtre
  const availableTypes = Array.from(
    new Set(notifications.map(n => n.type).filter(Boolean))
  );

  const filteredNotifications = notifications.filter(notif => {
    const title = notif.title || '';
    const message = notif.message || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesReadStatus = !showUnreadOnly || !notif.read;

    return matchesSearch && matchesType && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;
  const todayCount = notifications.filter(n =>
    n.created_at && new Date(n.created_at).toDateString() === new Date().toDateString()
  ).length;

  const NotificationCard = ({ notification }) => {
    const Icon = getNotificationIcon(notification.type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-4 hover:shadow-md transition-all duration-300 ${
          notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {notification.title || 'Notification'}
                </h3>
                {notification.message && (
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {notification.type && (
                  <Badge className="bg-gray-100 text-gray-800">
                    {notification.type}
                  </Badge>
                )}
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                {notification.created_at
                  ? new Date(notification.created_at).toLocaleString('fr-FR')
                  : '—'}
              </span>

              <div className="flex space-x-2">
                {!notification.read && (
                  <Button size="sm" variant="outline" onClick={() => markAsRead(notification.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Marquer lu
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Restez informé de toutes vos activités professionnelles</p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marquer tout lu
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Non lues</p>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lues</p>
                <p className="text-2xl font-bold text-green-600">{readCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold text-purple-600">{todayCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher dans les notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {availableTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showUnreadOnly ? "default" : "outline"}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Non lues uniquement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des notifications */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Chargement des notifications...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {notifications.length === 0 ? 'Aucune notification' : 'Aucune notification trouvée'}
            </h3>
            <p className="text-gray-600">
              {notifications.length === 0
                ? 'Vous serez notifié ici de vos missions, messages et échéances.'
                : 'Modifiez vos critères de recherche ou filtres'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeometreNotifications;
