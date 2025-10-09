import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellRing, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  EyeOff, 
  Trash2,
  Check,
  CheckCheck,
  AlertCircle,
  Info,
  MessageSquare,
  Calendar,
  Settings,
  ExternalLink,
  Clock,
  User,
  RefreshCw,
  X,
  Archive,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';

const ParticulierNotifications_FUNCTIONAL = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  useEffect(() => {
    filterNotifications();
  }, [notifications, searchTerm, filterType, filterPriority, filterStatus]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
      console.log(`✅ ${(data || []).length} notifications chargées depuis Supabase`);
    } catch (error) {
      console.error('❌ Erreur chargement notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = [...notifications];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par type
    if (filterType !== 'all') {
      filtered = filtered.filter(notif => notif.notification_type === filterType);
    }

    // Filtrage par priorité
    if (filterPriority !== 'all') {
      filtered = filtered.filter(notif => notif.priority === filterPriority);
    }

    // Filtrage par statut
    if (filterStatus !== 'all') {
      if (filterStatus === 'read') {
        filtered = filtered.filter(notif => notif.read_at !== null);
      } else if (filterStatus === 'unread') {
        filtered = filtered.filter(notif => notif.read_at === null);
      }
    }

    setFilteredNotifications(filtered);
    setUnreadCount(notifications.filter(n => !n.read_at).length);
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId 
          ? { ...notif, read_at: new Date().toISOString() }
          : notif
      ));

      toast.success('Notification marquée comme lue');
    } catch (error) {
      console.error('Erreur marquage comme lu:', error);
      toast.error('Erreur lors du marquage');
    }
  };

  const markAsUnread = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: null })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId 
          ? { ...notif, read_at: null }
          : notif
      ));

      toast.success('Notification marquée comme non lue');
    } catch (error) {
      console.error('Erreur marquage comme non lu:', error);
      toast.error('Erreur lors du marquage');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(n => !n.read_at)
        .map(n => n.id);

      if (unreadIds.length === 0) {
        toast.info('Aucune notification non lue');
        return;
      }

      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadIds)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => prev.map(notif =>
        unreadIds.includes(notif.id)
          ? { ...notif, read_at: new Date().toISOString() }
          : notif
      ));

      toast.success(`${unreadIds.length} notifications marquées comme lues`);
    } catch (error) {
      console.error('Erreur marquage tout comme lu:', error);
      toast.error('Erreur lors du marquage');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      toast.success('Notification supprimée');
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const deleteSelectedNotifications = async () => {
    if (selectedNotifications.length === 0) {
      toast.info('Aucune notification sélectionnée');
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .in('id', selectedNotifications)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
      setSelectedNotifications([]);
      toast.success(`${selectedNotifications.length} notifications supprimées`);
    } catch (error) {
      console.error('Erreur suppression multiple:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleNotificationClick = (notification) => {
    // Marquer comme lu si pas encore lu
    if (!notification.read_at) {
      markAsRead(notification.id);
    }

    // Redirection si URL d'action
    if (notification.action_url) {
      window.open(notification.action_url, '_blank');
    }
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => {
      if (prev.includes(notificationId)) {
        return prev.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      normal: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[priority] || colors.normal;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      urgent: AlertCircle,
      high: AlertCircle,
      medium: Info,
      normal: Bell,
      low: Clock
    };
    const Icon = icons[priority] || Bell;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeIcon = (type) => {
    const icons = {
      terrain_request: Calendar,
      construction_request: Settings,
      support_message: MessageSquare,
      appointment: Calendar,
      system_maintenance: Settings,
      general: Bell,
      payment: AlertCircle,
      terrain_approved: CheckCheck
    };
    const Icon = icons[type] || Bell;
    return <Icon className="h-4 w-4" />;
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="h-8 w-8 mr-3 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            Restez informé de toutes vos activités et mises à jour importantes
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button
            onClick={markAllAsRead}
            variant="outline"
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
          <Button
            onClick={deleteSelectedNotifications}
            variant="outline"
            disabled={selectedNotifications.length === 0}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer sélectionnées
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
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
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <BellRing className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Priorité haute</p>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cette semaine</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(n.created_at) > weekAgo;
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="terrain_request">Demandes terrain</SelectItem>
                  <SelectItem value="construction_request">Construction</SelectItem>
                  <SelectItem value="support_message">Support</SelectItem>
                  <SelectItem value="appointment">Rendez-vous</SelectItem>
                  <SelectItem value="payment">Paiement</SelectItem>
                  <SelectItem value="system_maintenance">Système</SelectItem>
                  <SelectItem value="general">Général</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Priorité..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes priorités</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="normal">Normale</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Statut..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="unread">Non lues</SelectItem>
                  <SelectItem value="read">Lues</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans les notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions en lot */}
      {filteredNotifications.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedNotifications.length === filteredNotifications.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-gray-600">
                  {selectedNotifications.length > 0 ? (
                    `${selectedNotifications.length} notification${selectedNotifications.length > 1 ? 's' : ''} sélectionnée${selectedNotifications.length > 1 ? 's' : ''}`
                  ) : (
                    'Sélectionner tout'
                  )}
                </span>
              </div>
              
              {selectedNotifications.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      selectedNotifications.forEach(id => {
                        const notif = notifications.find(n => n.id === id);
                        if (notif && !notif.read_at) {
                          markAsRead(id);
                        }
                      });
                      setSelectedNotifications([]);
                    }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Marquer comme lu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteSelectedNotifications}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des notifications */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' || filterPriority !== 'all' || filterStatus !== 'all' ? 
                  'Aucune notification ne correspond à vos filtres.' : 
                  'Vous n\'avez pas encore de notifications.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[600px]">
            <AnimatePresence>
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-3"
                >
                  <Card className={`transition-all hover:shadow-md cursor-pointer ${
                    !notification.read_at ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          checked={selectedNotifications.includes(notification.id)}
                          onCheckedChange={() => handleSelectNotification(notification.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center text-gray-600">
                                  {getTypeIcon(notification.notification_type)}
                                </div>
                                <h4 className={`font-semibold ${!notification.read_at ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h4>
                                <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                  {getPriorityIcon(notification.priority)}
                                  <span className="ml-1">
                                    {notification.priority === 'urgent' ? 'Urgent' :
                                     notification.priority === 'high' ? 'Haute' :
                                     notification.priority === 'medium' ? 'Moyenne' :
                                     notification.priority === 'normal' ? 'Normale' : 'Basse'}
                                  </span>
                                </Badge>
                                {!notification.read_at && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              
                              <p className={`text-sm mb-2 ${!notification.read_at ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatRelativeTime(notification.created_at)}
                                </div>
                                {notification.reference_id && (
                                  <div className="flex items-center">
                                    <span>Réf: {notification.reference_id}</span>
                                  </div>
                                )}
                                {notification.action_url && (
                                  <div className="flex items-center text-blue-600">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    <span>Action disponible</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  notification.read_at ? markAsUnread(notification.id) : markAsRead(notification.id);
                                }}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                {notification.read_at ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-red-600 hover:text-red-700"
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
              ))}
            </AnimatePresence>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default ParticulierNotifications_FUNCTIONAL;