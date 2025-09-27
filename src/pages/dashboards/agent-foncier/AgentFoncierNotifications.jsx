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
  MapPin,
  FileText,
  Calculator,
  Clock,
  Settings,
  Trash2,
  MailOpen,
  Archive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AgentFoncierNotifications = () => {
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const notifications = [
    {
      id: 1,
      type: 'evaluation',
      title: 'Nouvelle demande d\'évaluation',
      message: 'M. Diallo souhaite une évaluation pour son terrain aux Almadies',
      location: 'Almadies, Dakar',
      time: 'Il y a 15 min',
      read: false,
      priority: 'high',
      icon: Calculator
    },
    {
      id: 2,
      type: 'document',
      title: 'Document signé',
      message: 'Le titre foncier TF-2024-001 a été validé et signé',
      location: 'Rufisque',
      time: 'Il y a 1h',
      read: false,
      priority: 'medium',
      icon: FileText
    },
    {
      id: 3,
      type: 'client',
      title: 'Nouveau client',
      message: 'Société IMMOGO a créé un compte et demande vos services',
      location: 'Parcelles Assainies',
      time: 'Il y a 2h',
      read: true,
      priority: 'medium',
      icon: AlertTriangle
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Rappel de visite',
      message: 'Visite terrain prévue aujourd\'hui à 14h30 chez M. Fall',
      location: 'Thiès',
      time: 'Il y a 3h',
      read: false,
      priority: 'high',
      icon: Clock
    },
    {
      id: 5,
      type: 'system',
      title: 'Mise à jour disponible',
      message: 'Version 2.1 de l\'application disponible avec nouvelles fonctionnalités IA',
      time: 'Il y a 1 jour',
      read: true,
      priority: 'low',
      icon: Settings
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });

  const notificationTypes = [
    { key: 'all', label: 'Toutes', count: notifications.length },
    { key: 'unread', label: 'Non lues', count: notifications.filter(n => !n.read).length },
    { key: 'evaluation', label: 'Évaluations', count: notifications.filter(n => n.type === 'evaluation').length },
    { key: 'document', label: 'Documents', count: notifications.filter(n => n.type === 'document').length },
    { key: 'client', label: 'Clients', count: notifications.filter(n => n.type === 'client').length }
  ];

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
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
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
        {filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`hover:shadow-md transition-shadow ${
              !notification.read ? 'border-l-4 border-l-green-500 bg-green-50' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${
                    notification.priority === 'high' ? 'bg-red-100' :
                    notification.priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <notification.icon className={`h-5 w-5 ${
                      notification.priority === 'high' ? 'text-red-600' :
                      notification.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          notification.priority === 'high' ? 'destructive' :
                          notification.priority === 'medium' ? 'warning' : 'secondary'
                        } className="text-xs">
                          {notification.priority === 'high' ? 'Urgent' :
                           notification.priority === 'medium' ? 'Moyen' : 'Info'}
                        </Badge>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    
                    {notification.location && (
                      <div className="flex items-center space-x-1 mb-3">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{notification.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <MailOpen className="h-3 w-3 mr-1" />
                          Marquer comme lu
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-xs">
                        <Archive className="h-3 w-3 mr-1" />
                        Archiver
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs text-red-600">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Message si aucune notification */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune notification
          </h3>
          <p className="text-gray-600">
            Vous n'avez pas de notifications pour ce filtre
          </p>
        </div>
      )}
    </div>
  );
};

export default AgentFoncierNotifications;