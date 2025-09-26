import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
  Archive,
  Search,
  BellRing,
  BellOff,
  Zap,
  TrendingUp,
  Building2,
  Home,
  Shield,
  Eye,
  MailOpen
} from 'lucide-react';
import { useUser } from '@/hooks/useUserFixed';

const ModernNotificationsPage = () => {
  const { user, profile } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Types de notifications avec leurs configurations enrichies
  const notificationTypes = {
    message: { 
      icon: MessageSquare, 
      color: 'bg-blue-500', 
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-700',
      title: 'Message',
      description: 'Messages et communications'
    },
    transaction: { 
      icon: CreditCard, 
      color: 'bg-green-500', 
      bgColor: 'bg-green-50', 
      textColor: 'text-green-700',
      title: 'Transaction',
      description: 'Paiements et finances'
    },
    document: { 
      icon: FileText, 
      color: 'bg-purple-500', 
      bgColor: 'bg-purple-50', 
      textColor: 'text-purple-700',
      title: 'Document',
      description: 'Documents et contrats'
    },
    property: { 
      icon: MapPin, 
      color: 'bg-orange-500', 
      bgColor: 'bg-orange-50', 
      textColor: 'text-orange-700',
      title: 'Propriété',
      description: 'Terrains et parcelles'
    },
    user: { 
      icon: Users, 
      color: 'bg-cyan-500', 
      bgColor: 'bg-cyan-50', 
      textColor: 'text-cyan-700',
      title: 'Utilisateur',
      description: 'Comptes et profils'
    },
    appointment: { 
      icon: Calendar, 
      color: 'bg-pink-500', 
      bgColor: 'bg-pink-50', 
      textColor: 'text-pink-700',
      title: 'Rendez-vous',
      description: 'Meetings et événements'
    },
    system: { 
      icon: Settings, 
      color: 'bg-gray-500', 
      bgColor: 'bg-gray-50', 
      textColor: 'text-gray-700',
      title: 'Système',
      description: 'Mises à jour système'
    },
    urgent: {
      icon: AlertCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      title: 'Urgent',
      description: 'Notifications critiques'
    }
  };

  // Données simulées enrichies pour les notifications
  const mockNotifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'Action requise: Signature de contrat',
      content: 'Le contrat de vente pour le terrain TER-2024-015 expire dans 24h. Veuillez signer pour finaliser la transaction.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      isStarred: true,
      priority: 'high',
      sender: {
        name: 'Me. Ibrahima Sarr',
        role: 'NOTAIRE',
        avatar: null
      },
      actions: [
        { label: 'Signer maintenant', action: 'sign-contract', variant: 'default' },
        { label: 'Voir contrat', action: 'view-contract', variant: 'outline' }
      ],
      metadata: {
        contractId: 'CTR-2024-015',
        expirationTime: '23h 45min',
        amount: '45,000,000 FCFA'
      }
    },
    {
      id: 2,
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
      ],
      metadata: {
        propertyId: 'TER-ALM-001',
        location: 'Almadies, Dakar'
      }
    },
    {
      id: 3,
      type: 'transaction',
      title: 'Paiement reçu ✅',
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
      ],
      metadata: {
        transactionId: 'TXN-2024-3847',
        paymentMethod: 'Virement bancaire',
        status: 'Confirmé'
      }
    },
    {
      id: 4,
      type: 'property',
      title: 'Nouveau terrain disponible près de vous',
      content: 'Un terrain de 500m² vient d\'être mis en vente à 1.2km de votre localisation préférée.',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: true,
      isStarred: false,
      priority: 'normal',
      sender: {
        name: 'Système de Recommandation',
        role: 'SYSTEM',
        avatar: null
      },
      actions: [
        { label: 'Voir terrain', action: 'view-property', variant: 'default' },
        { label: 'Ajouter aux favoris', action: 'add-favorite', variant: 'outline' }
      ],
      metadata: {
        propertySize: '500m²',
        price: '25,000,000 FCFA',
        distance: '1.2km'
      }
    },
    {
      id: 5,
      type: 'system',
      title: 'Mise à jour de sécurité appliquée',
      content: 'Votre compte a été sécurisé avec les dernières mesures de protection. Aucune action requise.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: true,
      isStarred: false,
      priority: 'low',
      sender: {
        name: 'Équipe Sécurité Teranga',
        role: 'SYSTEM',
        avatar: null
      },
      actions: [
        { label: 'En savoir plus', action: 'learn-more', variant: 'outline' }
      ],
      metadata: {
        securityLevel: 'Renforcée',
        updateVersion: 'v2.1.5'
      }
    },
    {
      id: 6,
      type: 'appointment',
      title: 'Rappel: Rendez-vous demain à 10h',
      content: 'Visite du terrain à Ouakam avec l\'agent foncier Fatou Mbaye.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isRead: false,
      isStarred: true,
      priority: 'normal',
      sender: {
        name: 'Fatou Mbaye',
        role: 'AGENT_FONCIER',
        avatar: null
      },
      actions: [
        { label: 'Confirmer', action: 'confirm-appointment', variant: 'default' },
        { label: 'Reporter', action: 'reschedule', variant: 'outline' }
      ],
      metadata: {
        appointmentTime: 'Demain 10:00',
        location: 'Ouakam, Dakar',
        duration: '1h'
      }
    }
  ];

  // Simulation du chargement
  useEffect(() => {
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtres des notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Marquer comme lu/non lu
  const toggleRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: !notif.isRead } : notif
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
      AGENT_FONCIER: 'bg-green-500',
      SYSTEM: 'bg-gray-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  // Statistiques des notifications
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    starred: notifications.filter(n => n.isStarred).length,
    urgent: notifications.filter(n => n.priority === 'high' || n.type === 'urgent').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header moderne */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
            <BellRing className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Centre de Notifications
              {stats.unread > 0 && (
                <Badge className="bg-red-500 text-white animate-pulse">
                  {stats.unread} nouvelles
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              Restez informé de toute l'activité de votre compte
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={markAllAsRead} variant="outline" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Tout marquer comme lu
          </Button>
          <Button variant="default" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Paramètres
          </Button>
        </div>
      </motion.div>

      {/* Statistiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-gray-600 text-sm">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <BellRing className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.unread}</p>
              <p className="text-gray-600 text-sm">Non lues</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.starred}</p>
              <p className="text-gray-600 text-sm">Favorites</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.urgent}</p>
              <p className="text-gray-600 text-sm">Urgentes</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col lg:flex-row gap-4 items-center justify-between"
      >
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Rechercher dans les notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-80"
          />
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="w-full lg:w-auto">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full lg:w-auto">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="urgent">Urgentes</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="transaction">Finances</TabsTrigger>
            <TabsTrigger value="property">Biens</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="appointment">RDV</TabsTrigger>
            <TabsTrigger value="system">Système</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Liste des notifications */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y">
              <AnimatePresence>
                {filteredNotifications.map((notification) => {
                  const typeConfig = notificationTypes[notification.type];
                  const TypeIcon = typeConfig.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-6 hover:bg-gray-50 transition-all duration-200 ${
                        !notification.isRead ? `border-l-4 border-blue-500 ${typeConfig.bgColor}` : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar et icône de type */}
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={notification.sender.avatar} />
                            <AvatarFallback className={`${getRoleColor(notification.sender.role)} text-white`}>
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
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-semibold ${typeConfig.textColor} ${!notification.isRead ? 'font-bold' : ''}`}>
                                {notification.title}
                              </h3>
                              {getPriorityIcon(notification.priority)}
                              <Badge variant="outline" className="text-xs">
                                {typeConfig.title}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-700 mb-3 line-clamp-2">{notification.content}</p>

                          {/* Métadonnées */}
                          {notification.metadata && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {Object.entries(notification.metadata).map(([key, value]) => (
                                <span key={key} className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                                  {value}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>de {notification.sender.name}</span>
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
                                className="p-1"
                              >
                                <Star className={`w-4 h-4 ${
                                  notification.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'
                                }`} />
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleRead(notification.id)}
                                className="p-1"
                                title={notification.isRead ? "Marquer comme non lu" : "Marquer comme lu"}
                              >
                                {notification.isRead ? (
                                  <Eye className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <Check className="w-4 h-4 text-green-600" />
                                )}
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16">
              <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">Aucune notification</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? 'Vous êtes à jour ! Aucune nouvelle notification.'
                  : `Aucune notification dans la catégorie "${notificationTypes[filter]?.title || filter}".`
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernNotificationsPage;