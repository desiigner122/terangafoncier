import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  X, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Zap,
  Target,
  Eye,
  DollarSign,
  MapPin,
  Clock
} from 'lucide-react';
import { advancedAIService } from '@/services/AdvancedAIService';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const AISmartNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Créer un profil basique depuis les données utilisateur
  const profile = user ? {
    role: user.user_metadata?.role,
    name: user.user_metadata?.name,
    email: user.email
  } : null;

  useEffect(() => {
    if (user) {
      loadNotifications();
      
      // Actualiser les notifications toutes les 2 minutes
      const interval = setInterval(loadNotifications, 120000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const smartNotifications = await advancedAIService.generateSmartNotifications(
        user.id, 
        profile
      );
      
      setNotifications(smartNotifications);
      setUnreadCount(smartNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Erreur chargement notifications IA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      'price_alert': TrendingUp,
      'investment_opportunity': Target,
      'risk_warning': AlertTriangle,
      'market_update': Info,
      'blockchain_activity': Zap,
      'ai_insight': Brain,
      'monitoring_alert': Eye,
      'recommendation': CheckCircle,
      'system': Info
    };
    
    return iconMap[type] || Bell;
  };

  const getNotificationColor = (type, priority) => {
    if (priority >= 8) return 'text-red-500 bg-red-100';
    if (priority >= 6) return 'text-orange-500 bg-orange-100';
    if (priority >= 4) return 'text-blue-500 bg-blue-100';
    return 'text-gray-500 bg-gray-100';
  };

  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Tableau vide - les vraies notifications viennent de Supabase (voir loadNotifications)
  const mockNotifications = [];

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `Il y a ${minutes}min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MessageSquare className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Panneau de notifications */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Messages IA</h3>
                    <p className="text-sm text-gray-600">Conversations intelligentes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Liste des notifications */}
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <Brain className="h-8 w-8 text-cyan-500 animate-pulse mx-auto mb-2" />
                  <p className="text-gray-600">L'IA analyse vos données...</p>
                </div>
              ) : displayNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Aucun message pour le moment</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {displayNotifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    const colorClasses = getNotificationColor(notification.type, notification.priority);
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg ${colorClasses} flex-shrink-0`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {formatTimeAgo(notification.timestamp)}
                              </div>
                              
                              {notification.data && (
                                <div className="flex gap-1">
                                  {Object.entries(notification.data).slice(0, 2).map(([key, value]) => (
                                    <span key={key} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {value}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {displayNotifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <button 
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      setUnreadCount(0);
                    }}
                    className="text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                  <button className="text-gray-600 hover:text-gray-700">
                    Voir tout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AISmartNotifications;
