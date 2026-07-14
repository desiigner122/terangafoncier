import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GeometreNotifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Notifications RÉEL depuis Supabase (aucune donnée fictive)
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        if (error) throw error;
        if (active) {
          setNotifications((data || []).map((n) => ({
            id: n.id,
            type: n.type || 'system',
            title: n.title || 'Notification',
            message: n.message || n.body || n.content || '',
            timestamp: n.created_at,
            isRead: n.is_read ?? n.read ?? false,
            priority: n.priority || 'low',
            client: n.client || null,
            action: n.action || 'Voir'
          })));
        }
      } catch (err) {
        console.warn('notifications indisponible:', err?.message);
        if (active) setNotifications([]);
      }
    })();
    return () => { active = false; };
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'mission': return MapPin;
      case 'deadline': return Clock;
      case 'message': return Users;
      case 'instrument': return Settings;
      case 'payment': return CheckCircle;
      case 'system': return Info;
      case 'weather': return AlertTriangle;
      default: return Bell;
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-50';
    if (priority === 'medium') return 'text-orange-600 bg-orange-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = (notif.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notif.message || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notif.client && notif.client.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || notif.type === filterType;
    const matchesReadStatus = !showUnreadOnly || !notif.isRead;
    
    return matchesSearch && matchesType && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const priorityCount = notifications.filter(n => n.priority === 'high' && !n.isRead).length;

  const NotificationCard = ({ notification }) => {
    const Icon = getNotificationIcon(notification.type);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border rounded-lg p-4 hover:shadow-md transition-all duration-300 ${
          notification.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-semibold ${notification.isRead ? 'text-gray-900' : 'text-gray-900'}`}>
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                {notification.client && (
                  <p className="text-xs text-gray-500 mt-2">
                    Client: {notification.client}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Badge className={getPriorityBadgeColor(notification.priority)}>
                  {notification.priority === 'high' ? 'Urgent' : 
                   notification.priority === 'medium' ? 'Moyen' : 'Faible'}
                </Badge>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                {new Date(notification.timestamp).toLocaleString('fr-FR')}
              </span>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  {notification.action}
                </Button>
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Archive className="h-4 w-4" />
                </Button>
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
          <Button variant="outline" size="sm">
            <Archive className="h-4 w-4 mr-2" />
            Archiver tout
          </Button>
          <Button size="sm">
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
                <p className="text-sm text-gray-600">Priorité haute</p>
                <p className="text-2xl font-bold text-red-600">{priorityCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => 
                    new Date(n.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
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
                <SelectItem value="mission">Missions</SelectItem>
                <SelectItem value="deadline">Échéances</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="instrument">Instruments</SelectItem>
                <SelectItem value="payment">Paiements</SelectItem>
                <SelectItem value="system">Système</SelectItem>
                <SelectItem value="weather">Météo</SelectItem>
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
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification trouvée</h3>
            <p className="text-gray-600">Modifiez vos critères de recherche ou filtres</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeometreNotifications;