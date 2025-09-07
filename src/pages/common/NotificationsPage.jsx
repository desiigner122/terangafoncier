import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bell, 
  Check, 
  X, 
  Star, 
  MessageSquare, 
  CreditCard, 
  FileText, 
  MapPin, 
  Users, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  Filter,
  MoreVertical,
  Clock,
  Trash2,
  Archive
} from 'lucide-react';
import { useUser } from '@/hooks/useUserFixed';

const NotificationsPage = () => {
  const { user, profile } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Types de notifications avec leurs configurations
  const notificationTypes = {
    message: { icon: MessageSquare, color: 'bg-blue-500', title: 'Message' },
    transaction: { icon: CreditCard, color: 'bg-green-500', title: 'Transaction' },
    document: { icon: FileText, color: 'bg-purple-500', title: 'Document' },
    property: { icon: MapPin, color: 'bg-orange-500', title: 'Propriété' },
    user: { icon: Users, color: 'bg-cyan-500', title: 'Utilisateur' },
    appointment: { icon: Calendar, color: 'bg-pink-500', title: 'Rendez-vous' },
    system: { icon: Settings, color: 'bg-gray-500', title: 'Système' }
  };

  // Données simulées pour les notifications
  const mockNotifications = [
    {
      id: 1,
      type: 'message',
      title: 'Nouveau message de Amadou Diallo',
      content: 'Bonjour, je suis intéressé par votre terrain à Almadies. Pouvons-nous discuter des détails ?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      isStarred: false,
      priority: 'normal',
      sender: {
        name: 'Amadou Diallo',
        role: 'PROMOTEUR',
        avatar: null
      },
      actions: [
        { label: 'Répondre', action: 'reply', variant: 'default' },
        { label: 'Voir profil', action: 'view-profile', variant: 'outline' }
      ]
    },
    {
      id: 2,
      type: 'transaction',
      title: 'Paiement reçu',
      content: 'Un paiement de 2 500 000 FCFA a été reçu pour le terrain TER-2024-001.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      isStarred: true,
      priority: 'high',
      sender: {
        name: 'Système de Paiement',
        role: 'SYSTEM',
        avatar: null
      },
      actions: [
        { label: 'Voir détails', action: 'view-transaction', variant: 'default' },
        { label: 'Télécharger reçu', action: 'download-receipt', variant: 'outline' }
      ]
    },
    {
      id: 3,
      type: 'document',
      title: 'Document prêt pour signature',
      content: 'Le contrat de vente pour le terrain à Ouakam est prêt et attend votre signature électronique.',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      isStarred: false,
      priority: 'high',
      sender: {
        name: 'Me. Fatou Sall',
        role: 'NOTAIRE',
        avatar: null
      },
      actions: [
        { label: 'Signer', action: 'sign-document', variant: 'default' },
        { label: 'Voir document', action: 'view-document', variant: 'outline' }
      ]
    },
    {
      id: 4,
      type: 'property',
      title: 'Nouvelle propriété ajoutée à vos favoris',
      content: 'Un terrain correspondant à vos critères a été ajouté dans la zone de Ngor.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: true,
      isStarred: false,
      priority: 'normal',
      sender: {
        name: 'Système de Recommandation',
        role: 'SYSTEM',
        avatar: null
      },
      actions: [
        { label: 'Voir terrain', action: 'view-property', variant: 'default' }
      ]
    },
    {
      id: 5,
      type: 'appointment',
      title: 'Rappel de rendez-vous',
      content: 'Votre rendez-vous avec le géomètre pour la mesure du terrain est prévu demain à 14h.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      isStarred: false,
      priority: 'normal',
      sender: {
        name: 'Ibrahima Sow',
        role: 'GEOMETRE',
        avatar: null
      },
      actions: [
        { label: 'Confirmer', action: 'confirm-appointment', variant: 'default' },
        { label: 'Reporter', action: 'reschedule', variant: 'outline' }
      ]
    },
    {
      id: 6,
      type: 'system',
      title: 'Mise à jour de sécurité',
      content: 'Une nouvelle mise à jour de sécurité a été installée sur votre compte.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isRead: true,
      isStarred: false,
      priority: 'low',
      sender: {
        name: 'Équipe Sécurité',
        role: 'SYSTEM',
        avatar: null
      },
      actions: []
    }
  ];

  useEffect(() => {
    // Simuler le chargement des notifications
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'starred') return notification.isStarred;
    if (filter === 'high') return notification.priority === 'high';
    return notification.type === filter;
  });

  // Marquer comme lu
  const markAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  // Basculer le statut favori
  const toggleStar = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isStarred: !notif.isStarred } : notif
    ));
  };

  // Supprimer une notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  // Marquer toutes comme lues
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  // Formater l'heure
  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    if (diff < 60000) return 'maintenant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}j`;
  };

  // Obtenir l'icône de priorité
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'normal': return <Info className="w-4 h-4 text-blue-500" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  // Obtenir la couleur du rôle
  const getRoleColor = (role) => {
    const colors = {
      PROMOTEUR: 'bg-orange-500',
      NOTAIRE: 'bg-purple-500',
      GEOMETRE: 'bg-blue-500',
      SYSTEM: 'bg-gray-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  // Statistiques des notifications
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    starred: notifications.filter(n => n.isStarred).length,
    high: notifications.filter(n => n.priority === 'high').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Notifications
            {stats.unread > 0 && (
              <Badge variant="destructive" className="ml-2">
                {stats.unread}
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-2">Restez informé de toutes les activités importantes</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={markAllAsRead} disabled={stats.unread === 0}>
            <Check className="w-4 h-4 mr-2" />
            Tout marquer lu
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Bell className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto mb-2"></div>
            <div className="text-2xl font-bold">{stats.unread}</div>
            <div className="text-sm text-gray-600">Non lues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.starred}</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.high}</div>
            <div className="text-sm text-gray-600">Urgentes</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="unread">Non lues</TabsTrigger>
              <TabsTrigger value="starred">Favorites</TabsTrigger>
              <TabsTrigger value="high">Urgentes</TabsTrigger>
              <TabsTrigger value="message">Messages</TabsTrigger>
              <TabsTrigger value="transaction">Transactions</TabsTrigger>
              <TabsTrigger value="document">Documents</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Liste des notifications */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y">
              {filteredNotifications.map((notification) => {
                const typeConfig = notificationTypes[notification.type];
                const TypeIcon = typeConfig.icon;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'border-l-4 border-primary bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar et icône de type */}
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={notification.sender.avatar} />
                          <AvatarFallback className={getRoleColor(notification.sender.role)}>
                            {notification.sender.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${typeConfig.color} rounded-full flex items-center justify-center`}>
                          <TypeIcon className="w-3 h-3 text-white" />
                        </div>
                      </div>

                      {/* Contenu principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h3>
                            {getPriorityIcon(notification.priority)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.timestamp)}
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {notification.content}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {typeConfig.title}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              de {notification.sender.name}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {notification.actions.map((action, index) => (
                              <Button 
                                key={index}
                                variant={action.variant} 
                                size="sm"
                                className="text-xs"
                              >
                                {action.label}
                              </Button>
                            ))}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleStar(notification.id)}
                            >
                              <Star className={`w-4 h-4 ${
                                notification.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'
                              }`} />
                            </Button>
                            
                            {!notification.isRead && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucune notification</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? 'Vous êtes à jour ! Aucune nouvelle notification.'
                  : `Aucune notification dans la catégorie "${filter}".`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
