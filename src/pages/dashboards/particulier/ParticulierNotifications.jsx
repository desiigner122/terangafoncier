import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell,
  BellRing,
  BellOff,
  Eye,
  EyeOff,
  Trash2,
  Check,
  X,
  Filter,
  Search,
  Settings,
  Clock,
  MessageSquare,
  Calendar,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
  User,
  Building2,
  MapPin,
  Star,
  Archive,
  Zap,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ParticulierNotifications = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('toutes');

  // Notifications administratives - SUIVI DES DOSSIERS
  const [notifications] = useState([
    {
      id: 'NOT-001',
      dossierRef: 'DT-2024-001',
      type: 'validation',
      priority: 'urgent',
      title: 'Validation commission technique - DT-2024-001',
      message: 'Votre demande de terrain communal a été approuvée par la commission technique de Thiès. Prochaine étape : validation du maire.',
      timestamp: '2024-02-02T14:30:00Z',
      read: false,
      actionUrl: '/dashboard/acheteur/municipal-applications',
      icon: CheckCircle,
      color: 'green',
      source: 'Commission Technique - Thiès'
    },
    {
      id: 'NOT-002',
      dossierRef: 'PC-2024-007',
      type: 'document_manquant',
      priority: 'high',
      title: 'Documents manquants - PC-2024-007',
      message: 'Échéance dans 3 jours : Fournir l\'étude géotechnique et le plan de fondation pour votre permis de construire.',
      timestamp: '2024-02-02T09:15:00Z',
      read: false,
      actionUrl: '/dashboard/acheteur/my-documents',
      icon: AlertTriangle,
      color: 'red',
      source: 'Service des Permis - Dakar',
      echeance: '2024-02-05'
    },
    {
      id: 'NOT-003',
      dossierRef: 'CP-2024-003',
      type: 'rendez_vous',
      priority: 'high',
      title: 'Convocation entretien final - CP-2024-003',
      message: 'TERANGA CONSTRUCTION vous convoque pour l\'entretien final le 16 février 2024 à 10h00. Lieu : Siège social VDN.',
      timestamp: '2024-02-01T16:45:00Z',
      read: true,
      actionUrl: '/dashboard/acheteur/appointments',
      icon: Calendar,
      color: 'blue',
      source: 'TERANGA CONSTRUCTION',
      rdv: {
        date: '2024-02-16',
        heure: '10:00',
        lieu: 'Siège TERANGA CONSTRUCTION'
      }
    },
    {
      id: 'NOT-004',
      dossierRef: 'General',
      type: 'rappel_systeme',
      priority: 'medium',
      title: 'Rappel échéances multiples',
      message: 'Vous avez 3 dossiers avec des échéances dans les 7 prochains jours. Consultez votre tableau de bord pour plus de détails.',
      timestamp: '2024-02-02T08:00:00Z',
      read: false,
      actionUrl: '/dashboard/acheteur',
      icon: Bell,
      color: 'orange',
      source: 'Système TERANGA FONCIER'
    },
    {
      id: 'NOT-005',
      dossierRef: 'DT-2024-001',
      type: 'status_update',
      priority: 'medium',
      title: 'Changement de statut - DT-2024-001',
      message: 'Votre demande de terrain est passée au statut "En instruction" après validation des documents d\'identité.',
      timestamp: '2024-01-30T11:20:00Z',
      read: true,
      actionUrl: '/dashboard/acheteur/municipal-applications',
      icon: Activity,
      color: 'blue',
      source: 'Service Foncier - Thiès'
    },
    {
      id: 'NOT-006',
      dossierRef: 'CP-2024-003',
      type: 'acceptation',
      priority: 'high',
      title: 'Pré-sélection candidature - CP-2024-003',
      message: 'Félicitations ! Vous avez été pré-sélectionné pour la Résidence Les Palmiers. Entretien final programmé.',
      timestamp: '2024-01-28T15:30:00Z',
      read: true,
      actionUrl: '/dashboard/acheteur/promoter-reservations',
      icon: Star,
      color: 'green',
      source: 'TERANGA CONSTRUCTION'
    },
    {
      id: 'NOT-007',
      dossierRef: 'PC-2024-007',
      type: 'soumission',
      priority: 'low',
      title: 'Dossier soumis avec succès - PC-2024-007',
      message: 'Votre demande de permis de construire a été soumise avec succès. Référence : PC-2024-007. Délai d\'instruction : 2 mois.',
      timestamp: '2024-01-25T14:15:00Z',
      read: true,
      actionUrl: '/dashboard/acheteur/my-documents',
      icon: FileText,
      color: 'blue',
      source: 'Mairie de Dakar'
    },
    {
      id: 'NOT-008',
      dossierRef: 'General',
      type: 'maintenance',
      priority: 'low',
      title: 'Maintenance programmée',
      message: 'Maintenance de la plateforme prévue le dimanche 4 février de 2h à 6h. Les services seront temporairement indisponibles.',
      timestamp: '2024-01-25T10:00:00Z',
      read: false,
      actionUrl: null,
      icon: Settings,
      color: 'gray',
      source: 'Équipe Technique TERANGA'
    }
  ]);

  const getNotificationIcon = (notification) => {
    const IconComponent = notification.icon;
    return <IconComponent className="w-5 h-5" />;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Élevée';
      case 'medium': return 'Normale';
      case 'low': return 'Faible';
      default: return 'Normale';
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'validation': 'text-green-600',
      'document_manquant': 'text-red-600',
      'rendez_vous': 'text-blue-600',
      'rappel_systeme': 'text-orange-600',
      'status_update': 'text-blue-600',
      'acceptation': 'text-green-600',
      'soumission': 'text-blue-600',
      'maintenance': 'text-gray-600'
    };
    return colors[type] || 'text-gray-600';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'validation': 'Validation',
      'document_manquant': 'Document Manquant',
      'rendez_vous': 'Rendez-vous',
      'rappel_systeme': 'Rappel Système',
      'status_update': 'Mise à jour',
      'acceptation': 'Acceptation',
      'soumission': 'Soumission',
      'maintenance': 'Maintenance'
    };
    return labels[type] || type;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else if (diffInHours < 48) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    let matchesTab = true;
    if (activeTab === 'non_lues') {
      matchesTab = !notification.read;
    } else if (activeTab === 'urgentes') {
      matchesTab = notification.priority === 'urgent' || notification.priority === 'high';
    } else if (activeTab === 'dossiers') {
      matchesTab = notification.dossierRef !== 'General';
    }

    const matchesFilter = filter === 'all' || notification.type === filter;
    
    const matchesSearch = searchTerm === '' ||
                         notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.dossierRef.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesFilter && matchesSearch;
  });

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    urgent: notifications.filter(n => n.priority === 'urgent' || n.priority === 'high').length,
    dossiers: notifications.filter(n => n.dossierRef !== 'General').length
  };

  const toggleNotificationSelection = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const markAsRead = (ids) => {
    console.log('Marquer comme lu:', ids);
  };

  const deleteNotifications = (ids) => {
    console.log('Supprimer:', ids);
  };

  const NotificationCard = ({ notification }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className={`hover:shadow-md transition-all duration-200 border-l-4 ${
        notification.read ? 'border-l-gray-300' : 'border-l-blue-500'
      } ${!notification.read ? 'bg-blue-50/30' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedNotifications.includes(notification.id)}
                onChange={() => toggleNotificationSelection(notification.id)}
                className="rounded border-gray-300"
              />
              <div className={`p-2 rounded-lg bg-${notification.color}-100`}>
                <div className={getTypeColor(notification.type)}>
                  {getNotificationIcon(notification)}
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={`font-semibold text-lg mb-1 ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notification.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(notification.type)}
                    </Badge>
                    {notification.dossierRef !== 'General' && (
                      <Badge variant="secondary" className="text-xs">
                        {notification.dossierRef}
                      </Badge>
                    )}
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
                <Badge className={getPriorityColor(notification.priority)}>
                  {getPriorityText(notification.priority)}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{notification.message}</p>
              
              {/* Informations spécifiques */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Building2 className="w-4 h-4" />
                  <span>{notification.source}</span>
                </div>
                
                {notification.echeance && (
                  <div className="flex items-center gap-2 text-sm text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span>Échéance: {notification.echeance}</span>
                  </div>
                )}
                
                {notification.rdv && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Rendez-vous programmé</span>
                    </div>
                    <div className="text-gray-600">
                      {notification.rdv.date} à {notification.rdv.heure} - {notification.rdv.lieu}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(notification.timestamp)}</span>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="outline" onClick={() => markAsRead([notification.id])}>
                    {notification.read ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  {notification.actionUrl && (
                    <Button size="sm" variant="outline">
                      Voir dossier
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => deleteNotifications([notification.id])}>
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          Notifications Administratives
        </h1>
        <p className="text-gray-600">
          Suivi en temps réel de vos dossiers et démarches foncières
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-2xl text-blue-600">{stats.total}</span>
            </div>
            <p className="text-sm text-gray-600">Total notifications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BellRing className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-2xl text-orange-600">{stats.unread}</span>
            </div>
            <p className="text-sm text-gray-600">Non lues</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-2xl text-red-600">{stats.urgent}</span>
            </div>
            <p className="text-sm text-gray-600">Priorité élevée</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-2xl text-green-600">{stats.dossiers}</span>
            </div>
            <p className="text-sm text-gray-600">Liées aux dossiers</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions globales */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {selectedNotifications.length > 0 && (
            <>
              <Button size="sm" onClick={() => markAsRead(selectedNotifications)}>
                <Check className="w-4 h-4 mr-2" />
                Marquer lues ({selectedNotifications.length})
              </Button>
              <Button size="sm" variant="outline" onClick={() => deleteNotifications(selectedNotifications)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer ({selectedNotifications.length})
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedNotifications([])}>
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </>
          )}
        </div>
        
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Paramètres notifications
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher dans les notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="validation">Validations</SelectItem>
                <SelectItem value="document_manquant">Documents manquants</SelectItem>
                <SelectItem value="rendez_vous">Rendez-vous</SelectItem>
                <SelectItem value="status_update">Mises à jour</SelectItem>
                <SelectItem value="acceptation">Acceptations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="toutes">Toutes</TabsTrigger>
          <TabsTrigger value="non_lues">Non lues</TabsTrigger>
          <TabsTrigger value="urgentes">Priorité élevée</TabsTrigger>
          <TabsTrigger value="dossiers">Liées aux dossiers</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Liste des notifications */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BellOff className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune notification</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== 'all'
                ? "Aucune notification ne correspond à vos critères"
                : "Vous êtes à jour ! Aucune nouvelle notification."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticulierNotifications;