import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'Paiement VEFA à effectuer',
      message: 'Villa Cité Jardin - Échéance dans 7 jours (11,250,000 FCFA)',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
      read: false,
      category: 'payment',
      actionUrl: '/acheteur/promoter-reservations',
      actionText: 'Voir détails'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Documents manquants',
      message: 'Demande Mbour - 3 documents à fournir avant le 30/09',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h ago
      read: false,
      category: 'documents',
      actionUrl: '/acheteur/municipal-applications',
      actionText: 'Compléter dossier'
    },
    {
      id: 3,
      type: 'info',
      title: 'Nouveau message vendeur',
      message: 'Amadou Diallo a répondu à votre offre pour le terrain Almadies',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12h ago
      read: false,
      category: 'message',
      actionUrl: '/acheteur/private-interests',
      actionText: 'Voir message'
    },
    {
      id: 4,
      type: 'success',
      title: 'NFT mis à jour',
      message: 'Propriété Almadies Premium #001 - Nouvelle évaluation: +23%',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      category: 'blockchain',
      actionUrl: '/acheteur/owned-properties',
      actionText: 'Voir propriété'
    },
    {
      id: 5,
      type: 'info',
      title: 'RDV confirmé',
      message: 'Visite chantier Villa VEFA - Demain 14h avec Ing. Ndiaye',
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
      read: true,
      category: 'appointment',
      actionUrl: '/acheteur/promoter-reservations',
      actionText: 'Voir détails'
    }
  ]);

  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

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

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getNotificationsByCategory = (category) => {
    return notifications.filter(n => n.category === category);
  };

  // Simulation de nouvelles notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Ajouter une notification aléatoire toutes les 5 minutes (pour demo)
      const sampleNotifications = [
        {
          type: 'info',
          title: 'Nouvelle opportunité',
          message: 'Terrain correspondant à vos critères disponible à Thiès',
          category: 'opportunity'
        },
        {
          type: 'warning',
          title: 'Prix marché en hausse',
          message: 'Zone Almadies: +5% ce mois - Vos favoris impactés',
          category: 'market'
        }
      ];
      
      if (Math.random() > 0.7) { // 30% chance
        const randomNotif = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
        addNotification(randomNotif);
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      getUnreadCount,
      getNotificationsByCategory,
      showNotificationPanel,
      setShowNotificationPanel
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const NotificationBell = () => {
  const { 
    getUnreadCount, 
    showNotificationPanel, 
    setShowNotificationPanel 
  } = useNotifications();

  const unreadCount = getUnreadCount();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setShowNotificationPanel(!showNotificationPanel)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export const NotificationPanel = () => {
  const { 
    notifications, 
    showNotificationPanel, 
    setShowNotificationPanel,
    markAsRead,
    markAllAsRead,
    removeNotification,
    getUnreadCount
  } = useNotifications();

  if (!showNotificationPanel) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `Il y a ${minutes}m`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span className="font-semibold">Notifications</span>
          {getUnreadCount() > 0 && (
            <Badge variant="secondary">{getUnreadCount()}</Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getUnreadCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Tout marquer lu
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotificationPanel(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Aucune notification</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-l-4 ${getTypeColor(notification.type)} ${
                !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
              } hover:bg-opacity-75 transition-colors cursor-pointer`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'} mt-1`}>
                    {notification.message}
                  </p>
                  {notification.actionUrl && (
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = notification.actionUrl;
                        }}
                      >
                        {notification.actionText || 'Voir détails'}
                      </Button>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(notification.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t bg-gray-50">
          <Button
            variant="ghost"
            className="w-full text-sm"
            onClick={() => {
              setShowNotificationPanel(false);
              // Navigate to notifications page
            }}
          >
            Voir toutes les notifications
          </Button>
        </div>
      )}
    </div>
  );
};

// Export du contexte pour usage direct
export { NotificationContext };