import React, { createContext, useContext, useState, useEffect } from 'react';
import { Bell, X, AlertCircle, CheckCircle, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
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
    supabase.from('notifications').update({ read: true }).eq('id', id).then(({ error }) => {
      if (error) console.error('Erreur markAsRead:', error);
    });
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    if (unreadIds.length > 0) {
      supabase.from('notifications').update({ read: true }).in('id', unreadIds).then(({ error }) => {
        if (error) console.error('Erreur markAllAsRead:', error);
      });
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    supabase.from('notifications').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Erreur removeNotification:', error);
    });
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getNotificationsByCategory = (category) => {
    return notifications.filter(n => n.category === category);
  };

  // Charger les vraies notifications de l'utilisateur connecté depuis Supabase
  useEffect(() => {
    let active = true;

    const loadNotifications = async (userId) => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, title, message, type, read, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (!active) return;
      if (error) {
        console.error('Erreur chargement notifications:', error);
        return;
      }
      setNotifications((data || []).map(n => ({
        id: n.id,
        type: n.type || 'info',
        title: n.title,
        message: n.message,
        read: !!n.read,
        timestamp: new Date(n.created_at)
      })));
    };

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        loadNotifications(data.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadNotifications(session.user.id);
      } else {
        setNotifications([]);
      }
    });

    return () => {
      active = false;
      subscription?.unsubscribe();
    };
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