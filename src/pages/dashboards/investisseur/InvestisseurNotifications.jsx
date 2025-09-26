import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Check, 
  X,
  Filter,
  Search,
  AlertTriangle,
  Info,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Building,
  Clock,
  Settings,
  Trash2,
  MailOpen,
  Archive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

const InvestisseurNotifications = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'investment',
      title: 'Nouvelle opportunité d\'investissement',
      message: 'Un nouveau projet résidentiel premium est disponible à Saly avec un ROI estimé à 22%',
      timestamp: '2024-01-20T15:30:00Z',
      read: false,
      priority: 'high',
      action: 'Voir l\'opportunité',
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 2,
      type: 'portfolio',
      title: 'Mise à jour de portfolio',
      message: 'La valeur de votre investissement "Résidence Les Palmiers" a augmenté de 15%',
      timestamp: '2024-01-20T12:15:00Z',
      read: false,
      priority: 'medium',
      action: 'Voir les détails',
      icon: DollarSign,
      color: 'blue'
    },
    {
      id: 3,
      type: 'legal',
      title: 'Document signé',
      message: 'L\'acte de propriété pour votre terrain à Thiès a été validé par le notaire',
      timestamp: '2024-01-20T10:45:00Z',
      read: true,
      priority: 'high',
      action: 'Télécharger',
      icon: CheckCircle,
      color: 'purple'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Alerte marché',
      message: 'Les prix dans la zone d\'Almadies ont augmenté de 8% ce mois-ci',
      timestamp: '2024-01-19T16:20:00Z',
      read: true,
      priority: 'medium',
      action: 'Analyser',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      id: 5,
      type: 'system',
      title: 'Rapport mensuel disponible',
      message: 'Votre rapport de performance mensuel est prêt à être consulté',
      timestamp: '2024-01-19T09:00:00Z',
      read: true,
      priority: 'low',
      action: 'Consulter',
      icon: Info,
      color: 'gray'
    },
    {
      id: 6,
      type: 'investment',
      title: 'Financement approuvé',
      message: 'Votre demande de financement de 250M XOF a été approuvée par la Banque Atlantique',
      timestamp: '2024-01-18T14:30:00Z',
      read: true,
      priority: 'high',
      action: 'Voir les termes',
      icon: Building,
      color: 'green'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []); 

  const getTypeLabel = (type) => {
    const labels = {
      investment: 'Investissement',
      portfolio: 'Portfolio',
      legal: 'Juridique',
      alert: 'Alerte',
      system: 'Système'
    };
    return labels[type] || type;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
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

  const formatTime = (timestamp) => {
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
    if (selectedFilter === 'high') return notification.priority === 'high';
    return notification.type === selectedFilter;
  });

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

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
              {notifications.filter(n => !n.read).length} notification{notifications.filter(n => !n.read).length !== 1 ? 's' : ''} non lue{notifications.filter(n => !n.read).length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
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
            Non lues ({notifications.filter(n => !n.read).length})
          </Button>
          <Button
            variant={selectedFilter === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('high')}
          >
            Priorité haute ({notifications.filter(n => n.priority === 'high').length})
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
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`${!notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''} hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Icône */}
                    <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0`}>
                      <notification.icon className={`h-5 w-5 ${getIconColor(notification.color)}`} />
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
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
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
                          <span>{formatTime(notification.timestamp)}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {notification.action && (
                            <Button variant="outline" size="sm">
                              {notification.action}
                            </Button>
                          )}
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
        </div>

        {/* Paramètres de notifications */}
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
            <p className="text-gray-600">Vous n'avez aucune notification pour ce filtre</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default InvestisseurNotifications;