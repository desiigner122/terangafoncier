import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, MapPin, Calendar, Eye, Flag, X } from 'lucide-react';
import { sampleParcels, sampleUsers } from '@/data';
import { motion, AnimatePresence } from 'framer-motion';

const TerrainAlertSystem = ({ municipalityName = "Saly" }) => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simuler des alertes en temps réel pour les nouveaux terrains
    const generateAlerts = () => {
      const recentTerrains = sampleParcels
        .filter(parcel => parcel.zone === municipalityName)
        .slice(0, 3)
        .map((parcel, index) => {
          const seller = sampleUsers.find(user => user.id === parcel.seller_id);
          const alertTypes = [
            'new_listing',
            'price_change', 
            'status_change',
            'suspicious_activity',
            'document_missing'
          ];
          
          return {
            id: `alert-${parcel.id}-${index}`,
            type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
            terrain: parcel,
            seller: seller,
            timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
            read: false,
            priority: Math.random() > 0.7 ? 'high' : 'normal'
          };
        });

      setAlerts(recentTerrains);
      setUnreadCount(recentTerrains.filter(alert => !alert.read).length);
    };

    generateAlerts();
    
    // Simuler des nouvelles alertes périodiquement
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% de chance d'avoir une nouvelle alerte
        const newAlert = {
          id: `alert-new-${Date.now()}`,
          type: 'new_listing',
          terrain: sampleParcels.find(p => p.zone === municipalityName),
          seller: sampleUsers.find(u => u.role === 'Vendeur Particulier'),
          timestamp: new Date(),
          read: false,
          priority: 'normal'
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Garder max 10 alertes
        setUnreadCount(prev => prev + 1);
      }
    }, 30000); // Nouvelle alerte potentielle toutes les 30 secondes

    return () => clearInterval(interval);
  }, [municipalityName]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'new_listing': return <MapPin className="h-4 w-4 text-blue-500" />;
      case 'price_change': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'status_change': return <Bell className="h-4 w-4 text-green-500" />;
      case 'suspicious_activity': return <Flag className="h-4 w-4 text-red-500" />;
      case 'document_missing': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertMessage = (alert) => {
    const { type, terrain, seller } = alert;
    switch (type) {
      case 'new_listing':
        return `Nouveau terrain mis en vente par ${seller?.name || 'Vendeur inconnu'}`;
      case 'price_change':
        return `Prix modifié pour ${terrain?.title || 'terrain'}`;
      case 'status_change':
        return `Statut changé pour ${terrain?.title || 'terrain'}`;
      case 'suspicious_activity':
        return `Activité suspecte détectée sur ${terrain?.title || 'terrain'}`;
      case 'document_missing':
        return `Documents manquants signalés pour ${terrain?.title || 'terrain'}`;
      default:
        return 'Nouvelle activité détectée';
    }
  };

  const getAlertColor = (type, priority) => {
    if (priority === 'high') {
      return 'border-red-200 bg-red-50';
    }
    switch (type) {
      case 'new_listing': return 'border-blue-200 bg-blue-50';
      case 'price_change': return 'border-orange-200 bg-orange-50';
      case 'status_change': return 'border-green-200 bg-green-50';
      case 'suspicious_activity': return 'border-red-200 bg-red-50';
      case 'document_missing': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const markAsRead = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    const alert = alerts.find(a => a.id === alertId);
    if (alert && !alert.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
    setUnreadCount(0);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `il y a ${days}j`;
    if (hours > 0) return `il y a ${hours}h`;
    if (minutes > 0) return `il y a ${minutes}min`;
    return 'À l\'instant';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Alertes Terrain - {municipalityName}</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Marquer tout comme lu
            </Button>
          )}
        </div>
        <CardDescription>
          Surveillance en temps réel des activités foncières dans votre commune
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune alerte récente
              </div>
            ) : (
              alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className={`p-3 rounded-lg border ${getAlertColor(alert.type, alert.priority)} ${
                    !alert.read ? 'ring-2 ring-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm ${!alert.read ? 'font-semibold' : 'font-normal'}`}>
                            {getAlertMessage(alert)}
                          </p>
                          {alert.priority === 'high' && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatTime(alert.timestamp)}</span>
                          {alert.terrain && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              Réf: {alert.terrain.reference}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      {alert.terrain && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/terrain/${alert.terrain.id}`, '_blank')}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      {!alert.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Bell className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
        {alerts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button asChild variant="outline" className="w-full">
              <a href="/dashboard/terrain-oversight">
                Voir toutes les activités terrain
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TerrainAlertSystem;
