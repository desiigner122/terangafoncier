import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell,
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Shield,
  Building2,
  MapPin,
  FileText,
  RefreshCw,
  Archive
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';

const ParticulierNotifications = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();
    }
  }, [user?.id]);

  const loadNotifications = async () => {
    if (!user?.id) {
      console.log('❌ Utilisateur non disponible');
      return;
    }

    try {
      console.log('📊 Chargement des notifications administratives...');
      
      const { data, error } = await supabase
        .from('messages_administratifs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`✅ ${data?.length || 0} notifications chargées`);
      setNotifications(data || []);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('messages_administratifs')
        .update({ statut: 'lu', lu_le: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, statut: 'lu', lu_le: new Date().toISOString() }
          : notif
      ));
    } catch (error) {
      console.error('❌ Erreur lors du marquage comme lu:', error);
    }
  };

  const archiveNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('messages_administratifs')
        .update({ archive: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } catch (error) {
      console.error('❌ Erreur lors de l\'archivage:', error);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'demande_terrain': MapPin,
      'construction': Building2,
      'document': FileText,
      'administratif': Shield,
      'general': Bell
    };
    const Icon = icons[type] || Bell;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      'demande_terrain': 'bg-green-100 text-green-800 border-green-200',
      'construction': 'bg-blue-100 text-blue-800 border-blue-200',
      'document': 'bg-purple-100 text-purple-800 border-purple-200',
      'administratif': 'bg-red-100 text-red-800 border-red-200',
      'general': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors.general;
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      'urgent': AlertCircle,
      'normale': Info,
      'faible': Clock
    };
    const Icon = icons[priority] || Info;
    return <Icon className="h-4 w-4" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'urgent': 'bg-red-100 text-red-800',
      'normale': 'bg-blue-100 text-blue-800',
      'faible': 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || colors.normale;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (!notification.archive) { // Ne pas afficher les archivées
      const matchesSearch = notification.objet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.contenu?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || notification.type === filterType;
      
      if (filterType === 'unread') {
        return matchesSearch && notification.statut === 'non_lu';
      }
      
      return matchesSearch && matchesType;
    }
    return false;
  });

  const unreadCount = notifications.filter(n => n.statut === 'non_lu' && !n.archive).length;

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    if (notification.statut === 'non_lu') {
      markAsRead(notification.id);
    }
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
            Notifications Administratives
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-red-500 text-white">
                {unreadCount} non lues
              </Badge>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            Toutes vos communications avec les services administratifs
          </p>
        </div>
        
        <Button onClick={loadNotifications} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
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
              <EyeOff className="h-8 w-8 text-red-600" />
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
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgentes</p>
                <p className="text-2xl font-bold text-orange-600">
                  {notifications.filter(n => n.priorite === 'urgent').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Tabs value={filterType} onValueChange={setFilterType}>
                <TabsList>
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="unread">Non lues</TabsTrigger>
                  <TabsTrigger value="demande_terrain">Terrains</TabsTrigger>
                  <TabsTrigger value="construction">Construction</TabsTrigger>
                  <TabsTrigger value="document">Documents</TabsTrigger>
                  <TabsTrigger value="administratif">Administratif</TabsTrigger>
                </TabsList>
              </Tabs>
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

      {/* Liste des notifications */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' ? 
                  'Aucune notification ne correspond à vos critères.' : 
                  'Vous n\'avez pas encore reçu de notifications.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
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
                  notification.statut === 'non_lu' ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}>
                  <CardContent className="p-4" onClick={() => handleNotificationClick(notification)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`font-semibold ${notification.statut === 'non_lu' ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.objet || 'Notification administrative'}
                            </h3>
                            {notification.statut === 'non_lu' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`text-xs ${getTypeColor(notification.type)}`}>
                              {notification.type === 'demande_terrain' ? 'Terrain' :
                               notification.type === 'construction' ? 'Construction' :
                               notification.type === 'document' ? 'Document' :
                               notification.type === 'administratif' ? 'Administratif' : 'Général'}
                            </Badge>
                            {notification.priorite && (
                              <Badge className={`text-xs ${getPriorityColor(notification.priorite)}`}>
                                {getPriorityIcon(notification.priorite)}
                                <span className="ml-1">
                                  {notification.priorite === 'urgent' ? 'Urgent' :
                                   notification.priorite === 'normale' ? 'Normal' : 'Faible'}
                                </span>
                              </Badge>
                            )}
                          </div>
                          
                          <p className={`text-sm mb-2 ${notification.statut === 'non_lu' ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.contenu?.substring(0, 150)}
                            {notification.contenu?.length > 150 && '...'}
                          </p>
                          
                          <div className="flex items-center text-xs text-gray-500 space-x-4">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(notification.created_at).toLocaleDateString('fr-FR')}
                            </div>
                            {notification.expediteur?.service && (
                              <div>
                                Service: {notification.expediteur.service}
                              </div>
                            )}
                            {notification.dossier_ref && (
                              <div>
                                Dossier: {notification.dossier_ref}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.statut === 'non_lu' ? markAsRead(notification.id) : null;
                          }}
                          className="text-gray-600 hover:text-gray-700"
                        >
                          {notification.statut === 'non_lu' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            archiveNotification(notification.id);
                          }}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Modal détails notification */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          {selectedNotification && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedNotification.type)}
                  {selectedNotification.objet || 'Notification administrative'}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`text-xs ${getTypeColor(selectedNotification.type)}`}>
                      {selectedNotification.type === 'demande_terrain' ? 'Terrain' :
                       selectedNotification.type === 'construction' ? 'Construction' :
                       selectedNotification.type === 'document' ? 'Document' :
                       selectedNotification.type === 'administratif' ? 'Administratif' : 'Général'}
                    </Badge>
                    {selectedNotification.priorite && (
                      <Badge className={`text-xs ${getPriorityColor(selectedNotification.priorite)}`}>
                        {selectedNotification.priorite}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(selectedNotification.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedNotification.contenu}
                    </p>
                  </div>
                </div>
                
                {selectedNotification.expediteur && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Expéditeur</h4>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm">
                        <strong>{selectedNotification.expediteur.nom || 'Service Administratif'}</strong>
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedNotification.expediteur.service || 'Administration'}
                      </p>
                      {selectedNotification.expediteur.email && (
                        <p className="text-sm text-gray-600">
                          {selectedNotification.expediteur.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedNotification.dossier_ref && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Référence Dossier</h4>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-mono text-blue-800">
                        {selectedNotification.dossier_ref}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticulierNotifications;