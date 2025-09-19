/**
 * ðŸ”” SERVICE WORKER - TERANGA FONCIER
 * Gestion des push notifications et cache offline
 */

const CACH    console.log('🔄 Synchronisation blockchain en arrière-plan');_NAME = 'teranga-foncier-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png'
];

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('ðŸ“¦ Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('ðŸ—‘ï¸ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes (stratégie cache-first)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourner la réponse en cache ou fetch depuis le réseau
        return response || fetch(event.request);
      })
  );
});

// Gestion des push notifications
self.addEventListener('push', event => {
  console.log('ðŸ“± Push notification reçue:', event);

  const options = {
    body: 'Nouvelle notification Teranga Foncier',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir',
        icon: '/view-icon.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/close-icon.png'
      }
    ]
  };

  if (event.data) {
    const notificationData = event.data.json();
    options.title = notificationData.title || 'Teranga Foncier';
    options.body = notificationData.body || options.body;
    options.data = { ...options.data, ...notificationData.data };
  }

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', event => {
  console.log('ðŸ‘† Clic sur notification:', event);

  event.notification.close();

  if (event.action === 'explore') {
    // Ouvrir l'application
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Fermer la notification
    console.log('🚪 Notification fermée');
  } else {
    // Clic par défaut - ouvrir l'application
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', event => {
  if (event.tag === 'blockchain-sync') {
    console.log('ðŸ”„ Synchronisation blockchain en arrière-plan');
    event.waitUntil(
      // Logique de synchronisation
      fetch('/api/sync-blockchain', { method: 'POST' })
        .then(response => console.log('✅ Sync blockchain terminée'))
        .catch(error => console.error('âŒ Erreur sync blockchain:', error))
    );
  }
});
