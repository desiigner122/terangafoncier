import React, { useEffect, useState } from 'react';
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff, 
  Bell, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion, AnimatePresence } from 'framer-motion';

const PWAManager = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serviceWorkerRegistration, setServiceWorkerRegistration] = useState(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [backgroundSyncSupported, setBackgroundSyncSupported] = useState(false);

  useEffect(() => {
    initializePWA();
    setupEventListeners();
    
    return () => {
      removeEventListeners();
    };
  }, []);

  const initializePWA = async () => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        setServiceWorkerRegistration(registration);
        console.log('✅ Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });

        // Check if background sync is supported
        if ('sync' in window.ServiceWorkerRegistration.prototype) {
          setBackgroundSyncSupported(true);
        }

      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }

    // Check for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    });

    // Check if app was launched from install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallBanner(false);
      console.log('✅ PWA installed successfully');
    });
  };

  const setupEventListeners = () => {
    // Online/Offline status
    const handleOnline = () => {
      setIsOnline(true);
      if (backgroundSyncSupported && serviceWorkerRegistration) {
        triggerBackgroundSync();
      }
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Visibility change for background sync
    const handleVisibilityChange = () => {
      if (!document.hidden && backgroundSyncSupported) {
        triggerBackgroundSync();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  };

  const removeEventListeners = () => {
    window.removeEventListener('online', () => setIsOnline(true));
    window.removeEventListener('offline', () => setIsOnline(false));
    document.removeEventListener('visibilitychange', () => {});
  };

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    try {
      const result = await installPrompt.prompt();
      console.log('Install prompt result:', result.outcome);
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallBanner(false);
      }
      
      setInstallPrompt(null);
    } catch (error) {
      console.error('Install failed:', error);
    }
  };

  const handleUpdateClick = () => {
    if (serviceWorkerRegistration && serviceWorkerRegistration.waiting) {
      // Tell the waiting service worker to skip waiting
      serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page to use the new service worker
      window.location.reload();
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        // Subscribe to push notifications
        await subscribeToPushNotifications();
      }
    } catch (error) {
      console.error('❌ Notification permission failed:', error);
    }
  };

  const subscribeToPushNotifications = async () => {
    if (!serviceWorkerRegistration || !('PushManager' in window)) return;

    try {
      const subscription = await serviceWorkerRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      console.log('✅ Push notification subscription successful');
    } catch (error) {
      console.error('❌ Push notification subscription failed:', error);
    }
  };

  const triggerBackgroundSync = async () => {
    if (!serviceWorkerRegistration || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      return;
    }

    try {
      setSyncStatus('syncing');
      
      await Promise.all([
        serviceWorkerRegistration.sync.register('background-sync-properties'),
        serviceWorkerRegistration.sync.register('background-sync-messages'),
        serviceWorkerRegistration.sync.register('background-sync-notifications')
      ]);
      
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('❌ Background sync registration failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const clearAppCache = async () => {
    if (serviceWorkerRegistration) {
      serviceWorkerRegistration.postMessage({ type: 'CLEAR_CACHE' });
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Network Status */}
      <Card className={`border-l-4 ${isOnline ? 'border-l-green-500' : 'border-l-red-500'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            {isOnline ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-600" />}
            <span>État de la connexion</span>
            <Badge variant={isOnline ? 'default' : 'destructive'}>
              {isOnline ? 'En ligne' : 'Hors ligne'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {isOnline 
              ? 'Vous êtes connecté à internet. Toutes les fonctionnalités sont disponibles.'
              : 'Mode hors ligne activé. Vos données seront synchronisées dès la reconnexion.'
            }
          </p>
          
          {!isOnline && backgroundSyncSupported && (
            <div className="mt-3 flex items-center space-x-2">
              <RefreshCw className={`h-4 w-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span className="text-sm">
                Synchronisation automatique activée
              </span>
              {syncStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
              {syncStatus === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Install Banner */}
      <AnimatePresence>
        {showInstallBanner && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="relative"
          >
            <Alert className="border-blue-200 bg-blue-50">
              <Smartphone className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <strong>Installer l'application</strong>
                  <p className="text-sm mt-1">
                    Installez Teranga Foncier sur votre appareil pour une expérience optimisée et un accès hors ligne.
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button onClick={handleInstallClick} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Installer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowInstallBanner(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Available */}
      <AnimatePresence>
        {updateAvailable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Alert className="border-orange-200 bg-orange-50">
              <RefreshCw className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>
                  <strong>Mise à jour disponible</strong>
                  <p className="text-sm mt-1">
                    Une nouvelle version de l'application est disponible avec des améliorations et corrections.
                  </p>
                </div>
                <Button onClick={handleUpdateClick} size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Mettre à jour
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Fonctionnalités de l'application</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Installation Status */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Installation</h4>
              <p className="text-sm text-gray-600">
                {isInstalled ? 'Application installée' : 'Application non installée'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {isInstalled ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Button onClick={handleInstallClick} disabled={!installPrompt} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Installer
                </Button>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notifications push</h4>
              <p className="text-sm text-gray-600">
                Recevez des alertes importantes même hors ligne
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={notificationPermission === 'granted' ? 'default' : 'secondary'}>
                {notificationPermission === 'granted' ? 'Activées' : 
                 notificationPermission === 'denied' ? 'Refusées' : 'En attente'}
              </Badge>
              {notificationPermission !== 'granted' && (
                <Button onClick={requestNotificationPermission} size="sm" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Activer
                </Button>
              )}
            </div>
          </div>

          {/* Background Sync */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Synchronisation en arrière-plan</h4>
              <p className="text-sm text-gray-600">
                Vos données sont synchronisées automatiquement
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={backgroundSyncSupported ? 'default' : 'secondary'}>
                {backgroundSyncSupported ? 'Supportée' : 'Non supportée'}
              </Badge>
              {backgroundSyncSupported && isOnline && (
                <Button onClick={triggerBackgroundSync} size="sm" variant="outline">
                  <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                  Synchroniser
                </Button>
              )}
            </div>
          </div>

          {/* Cache Management */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Cache de l'application</h4>
              <p className="text-sm text-gray-600">
                Effacer le cache pour libérer de l'espace
              </p>
            </div>
            <Button onClick={clearAppCache} size="sm" variant="outline">
              Vider le cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PWA Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Avantages de l'application mobile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <WifiOff className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Accès hors ligne</h4>
                <p className="text-sm text-gray-600">
                  Consultez vos données même sans connexion internet
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Notifications instantanées</h4>
                <p className="text-sm text-gray-600">
                  Recevez des alertes pour les opportunités importantes
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Synchronisation automatique</h4>
                <p className="text-sm text-gray-600">
                  Vos données sont toujours à jour sur tous vos appareils
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium">Interface native</h4>
                <p className="text-sm text-gray-600">
                  Expérience utilisateur optimisée pour mobile
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAManager;
