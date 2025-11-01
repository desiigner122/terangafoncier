/**
 * Service Worker - Teranga Foncier
 * Gestion des push notifications et du cache offline (compatible Vite)
 */

const CACHE_NAME = 'teranga-foncier-v1.1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/teranga-foncier-logo.png'
];

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cache ouvert');
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
            console.log('🧹 Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
// Stratégie: Cache-first pour assets statiques, network-first pour le reste
self.addEventListener('fetch', event => {
  const { request } = event;

  // Navigations SPA -> retourner index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  const url = new URL(request.url);
  const isStaticAsset = url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.ico');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request))
    );
  } else {
    event.respondWith(
      fetch(request)
        .then(response => {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, respClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});

// Gestion des push notifications
self.addEventListener('push', event => {
  console.log('📱 Push notification reçue:', event);

  const options = {
    body: 'Nouvelle notification Teranga Foncier',
  icon: '/teranga-foncier-logo.png',
  badge: '/teranga-foncier-logo.png',
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
        .then(() => console.log('✅ Sync blockchain terminée'))
        .catch(error => console.error('❌ Erreur sync blockchain:', error))
    );
  }
});
