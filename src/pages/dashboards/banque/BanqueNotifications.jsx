import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  TrendingUp, 
  Shield, 
  Users, 
  FileText,
  Star,
  ChevronRight,
  Filter,
  Archive,
  MoreHorizontal,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BanqueNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Simulation des notifications bancaires
  useEffect(() => {
    // Les notifications réelles viennent de Supabase via loadNotifications()
    // Commencer avec un tableau vide pour laisser charger les données réelles
    setNotifications([]);
  }, []);

  const getNotificationIcon = (type) => {
    const icons = {
      credit_request: CreditCard,
      compliance: Shield,
      payment: TrendingUp,
      kyc: Users,
      blockchain: FileText,
      analytics: TrendingUp
    };
    return icons[type] || Bell;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[priority] || colors.medium;
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    window.safeGlobalToast({
      title: "Notifications marquées comme lues",
      description: "Toutes les notifications ont été marquées comme lues",
      variant: "success"
    });
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'unread') return !notif.read && matchesSearch;
    if (filter === 'read') return notif.read && matchesSearch;
    return notif.priority === filter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bell className="h-8 w-8 mr-3 text-blue-600" />
            Notifications Bancaires
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-red-500">{unreadCount} nouvelles</Badge>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez vos alertes et notifications du système bancaire
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Archives
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
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critiques</p>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => n.priority === 'critical').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => {
                    const today = new Date();
                    return n.timestamp.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les notifications</SelectItem>
                  <SelectItem value="unread">Non lues</SelectItem>
                  <SelectItem value="read">Lues</SelectItem>
                  <SelectItem value="critical">Critiques</SelectItem>
                  <SelectItem value="high">Priorité haute</SelectItem>
                  <SelectItem value="medium">Priorité moyenne</SelectItem>
                  <SelectItem value="low">Priorité basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
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

      {/* Liste des notifications */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Aucune notification ne correspond à votre recherche.' : 'Vous n\'avez aucune notification pour le moment.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const IconComponent = getNotificationIcon(notification.type);
            
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''} hover:shadow-md transition-shadow cursor-pointer`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-2 rounded-lg ${
                          notification.priority === 'critical' ? 'bg-red-100' :
                          notification.priority === 'high' ? 'bg-orange-100' :
                          notification.priority === 'medium' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            notification.priority === 'critical' ? 'text-red-600' :
                            notification.priority === 'high' ? 'text-orange-600' :
                            notification.priority === 'medium' ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                {notification.priority === 'critical' ? 'Critique' :
                                 notification.priority === 'high' ? 'Haute' :
                                 notification.priority === 'medium' ? 'Moyenne' : 'Basse'}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <span>De: {notification.sender}</span>
                              {notification.client && (
                                <span>Client: {notification.client}</span>
                              )}
                              {notification.amount && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.amount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BanqueNotifications;
