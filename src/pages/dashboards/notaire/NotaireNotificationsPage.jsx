import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Check, 
  X, 
  Archive, 
  Settings, 
  Mail, 
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';

const NotaireNotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [showPreferences, setShowPreferences] = useState(false);

  // ✅ DONNÉES RÉELLES - Chargement depuis Supabase
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const result = await NotaireSupabaseService.getNotifications(user.id);
      if (result.success) {
        setNotifications(result.data || []);
      } else {
        console.error('Erreur lors du chargement:', result.error);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    push: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    types: {
      actes: true,
      signatures: true,
      messages: true,
      rendezVous: true,
      paiements: true,
      systeme: false
    }
  });

  const typeConfig = {
    success: { 
      label: 'Succès', 
      color: 'green', 
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700'
    },
    warning: { 
      label: 'Attention', 
      color: 'yellow', 
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700'
    },
    info: { 
      label: 'Information', 
      color: 'blue', 
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700'
    },
    error: { 
      label: 'Erreur', 
      color: 'red', 
      icon: X,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700'
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const archiveNotification = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, archived: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (n.archived) return false;
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.read;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Bell className="text-blue-600" size={32} />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-slate-600 mt-1">
              Restez informé de toutes les activités importantes
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllAsRead}
              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
            >
              <Check size={18} />
              Tout marquer comme lu
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPreferences(!showPreferences)}
              className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <Settings size={18} />
              Préférences
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 shadow-md border border-slate-200 mb-6"
      >
        <div className="flex gap-2">
          {['all', 'unread', 'success', 'warning', 'info', 'error'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {type === 'all' ? 'Toutes' : type === 'unread' ? 'Non lues' : typeConfig[type]?.label}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des notifications */}
        <div className="lg:col-span-2 space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-md border border-slate-200">
              <Bell size={64} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                Aucune notification
              </h3>
              <p className="text-slate-500">
                Vous êtes à jour !
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const config = typeConfig[notification.type];
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl p-4 shadow-md border-2 ${
                    !notification.read ? 'border-blue-400' : 'border-slate-200'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`${config.bgColor} p-3 rounded-lg h-fit`}>
                      <Icon className={config.textColor} size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-800">{notification.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(notification.timestamp).toLocaleString('fr-FR')}
                        </span>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Marquer comme lu
                            </button>
                          )}
                          <button
                            onClick={() => archiveNotification(notification.id)}
                            className="text-slate-600 hover:text-slate-800"
                          >
                            <Archive size={16} />
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Panel Préférences */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sticky top-6"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Settings size={24} className="text-slate-600" />
              Préférences
            </h2>

            {/* Canaux de notification */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-700 mb-3">Canaux de notification</h3>
              <div className="space-y-3">
                {[
                  { key: 'email', label: 'Email', icon: Mail },
                  { key: 'sms', label: 'SMS', icon: MessageSquare },
                  { key: 'push', label: 'Push', icon: Bell }
                ].map(({ key, label, icon: Icon }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-slate-700">
                      <Icon size={18} />
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences[key]}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        [key]: e.target.checked
                      })}
                      className="w-5 h-5 text-blue-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Heures de silence */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <h3 className="font-semibold text-slate-700 mb-3">Heures de silence</h3>
              <label className="flex items-center justify-between cursor-pointer mb-3">
                <span className="flex items-center gap-2 text-slate-700">
                  {preferences.quietHours.enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  Activer
                </span>
                <input
                  type="checkbox"
                  checked={preferences.quietHours.enabled}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    quietHours: { ...preferences.quietHours, enabled: e.target.checked }
                  })}
                  className="w-5 h-5 text-blue-600"
                />
              </label>
              {preferences.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-600">Début</label>
                    <input
                      type="time"
                      value={preferences.quietHours.start}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        quietHours: { ...preferences.quietHours, start: e.target.value }
                      })}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Fin</label>
                    <input
                      type="time"
                      value={preferences.quietHours.end}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        quietHours: { ...preferences.quietHours, end: e.target.value }
                      })}
                      className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Types de notifications */}
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Types de notifications</h3>
              <div className="space-y-2">
                {Object.entries(preferences.types).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-slate-700 capitalize">{key}</span>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        types: { ...preferences.types, [key]: e.target.checked }
                      })}
                      className="w-4 h-4 text-blue-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Enregistrer les préférences
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotaireNotificationsPage;
