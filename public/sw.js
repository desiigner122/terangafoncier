// Service Worker for Teranga Foncier PWA
const CACHE_NAME = 'teranga-foncier-v1.0.0';
const STATIC_CACHE = 'teranga-static-v1.0.0';
const DYNAMIC_CACHE = 'teranga-dynamic-v1.0.0';
const API_CACHE = 'teranga-api-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Core dashboard routes
  '/dashboard',
  '/dashboard/particulier',
  '/dashboard/vendeur',
  '/dashboard/investisseur',
  '/dashboard/promoteur',
  '/dashboard/municipalite',
  '/dashboard/notaire',
  '/dashboard/geometre',
  '/dashboard/banque',
  '/dashboard/admin',
  // Essential pages
  '/auth/login',
  '/auth/register',
  '/search',
  '/properties',
  '/chat',
  '/notifications',
  '/profile',
  '/settings'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/auth/profile',
  '/api/properties/featured',
  '/api/dashboard/stats',
  '/api/notifications/unread',
  '/api/ai/quick-suggestions'
];

// URLs that should always be fetched from network
const NETWORK_FIRST = [
  '/api/auth/',
  '/api/payments/',
  '/api/blockchain/',
  '/api/ai/chat',
  '/api/real-time/'
];

// URLs that should be cached first
const CACHE_FIRST = [
  '/static/',
  '/icons/',
  '/images/',
  '/fonts/',
  '.js',
  '.css',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('🚀 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then(cache => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Activated');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - intercept network requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Network First Strategy (for critical real-time data)
    if (NETWORK_FIRST.some(pattern => url.pathname.startsWith(pattern))) {
      return await networkFirst(request);
    }
    
    // Cache First Strategy (for static assets)
    if (CACHE_FIRST.some(pattern => url.pathname.includes(pattern))) {
      return await cacheFirst(request);
    }
    
    // API requests - Stale While Revalidate
    if (url.pathname.startsWith('/api/')) {
      return await staleWhileRevalidate(request);
    }
    
    // Navigation requests - Network first with fallback
    if (request.mode === 'navigate') {
      return await navigationHandler(request);
    }
    
    // Default: Network first with cache fallback
    return await networkFirst(request);
    
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return await handleFetchError(request);
  }
}

// Network First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Update cache with fresh response
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Cache First Strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Network fetch failed:', error);
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch fresh data in background
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.error('❌ Background fetch failed:', error);
    return null;
  });
  
  // Return cached version immediately, or wait for network
  return cachedResponse || fetchPromise;
}

// Navigation Handler
async function navigationHandler(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Fallback to cached index.html
    const cachedResponse = await caches.match('/');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback - offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Teranga Foncier - Hors ligne</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex; 
              flex-direction: column;
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 20px;
            }
            .container { max-width: 500px; }
            h1 { font-size: 2.5em; margin-bottom: 0.5em; }
            p { font-size: 1.2em; line-height: 1.6; margin-bottom: 2em; }
            .retry-btn { 
              background: rgba(255,255,255,0.2); 
              border: 2px solid white; 
              color: white; 
              padding: 12px 30px; 
              border-radius: 25px; 
              cursor: pointer; 
              font-size: 1.1em;
              transition: all 0.3s ease;
            }
            .retry-btn:hover { background: rgba(255,255,255,0.3); }
            .icon { font-size: 4em; margin-bottom: 1em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🏘️</div>
            <h1>Teranga Foncier</h1>
            <p>Vous êtes actuellement hors ligne. Vérifiez votre connexion internet et réessayez.</p>
            <button class="retry-btn" onclick="location.reload()">Réessayer</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle fetch errors
async function handleFetchError(request) {
  // Try to find a cached version
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return offline response for navigation requests
  if (request.mode === 'navigate') {
    return await navigationHandler(request);
  }
  
  // For other requests, return a generic error response
  return new Response('Network error', {
    status: 408,
    statusText: 'Network timeout'
  });
}

// Background Sync for offline actions
self.addEventListener('sync', event => {
  console.log('🔄 Background Sync:', event.tag);
  
  if (event.tag === 'background-sync-properties') {
    event.waitUntil(syncPendingProperties());
  } else if (event.tag === 'background-sync-messages') {
    event.waitUntil(syncPendingMessages());
  } else if (event.tag === 'background-sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

// Sync pending properties
async function syncPendingProperties() {
  try {
    const pending = await getFromIndexedDB('pending-properties');
    for (const property of pending) {
      await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property)
      });
    }
    await clearFromIndexedDB('pending-properties');
    console.log('✅ Properties synced successfully');
  } catch (error) {
    console.error('❌ Properties sync failed:', error);
  }
}

// Sync pending messages
async function syncPendingMessages() {
  try {
    const pending = await getFromIndexedDB('pending-messages');
    for (const message of pending) {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
    }
    await clearFromIndexedDB('pending-messages');
    console.log('✅ Messages synced successfully');
  } catch (error) {
    console.error('❌ Messages sync failed:', error);
  }
}

// Sync notifications
async function syncNotifications() {
  try {
    await fetch('/api/notifications/sync', { method: 'POST' });
    console.log('✅ Notifications synced successfully');
  } catch (error) {
    console.error('❌ Notifications sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', event => {
  console.log('📱 Push notification received');
  
  const options = {
    body: 'Vous avez une nouvelle notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir détails',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  if (event.data) {
    const notificationData = event.data.json();
    options.body = notificationData.body || options.body;
    options.title = notificationData.title || 'Teranga Foncier';
    options.data = { ...options.data, ...notificationData.data };
  }
  
  event.waitUntil(
    self.registration.showNotification('Teranga Foncier', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('🔔 Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/notifications')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll().then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

// Message handling for communication with main app
self.addEventListener('message', event => {
  console.log('💬 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_PROPERTY') {
    event.waitUntil(cacheProperty(event.data.property));
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
});

// Cache specific property
async function cacheProperty(property) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = new Response(JSON.stringify(property), {
      headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(`/api/properties/${property.id}`, response);
    console.log('✅ Property cached:', property.id);
  } catch (error) {
    console.error('❌ Property cache failed:', error);
  }
}

// Clear all caches
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('✅ All caches cleared');
  } catch (error) {
    console.error('❌ Cache clear failed:', error);
  }
}

// IndexedDB helpers
async function getFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TerangaFoncierDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getRequest = store.getAll();
      
      getRequest.onsuccess = () => resolve(getRequest.result || []);
      getRequest.onerror = () => reject(getRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function clearFromIndexedDB(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TerangaFoncierDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Periodic background tasks
async function performPeriodicTasks() {
  try {
    // Clean old cached data
    await cleanOldCache();
    
    // Update critical data
    await updateCriticalData();
    
    console.log('✅ Periodic tasks completed');
  } catch (error) {
    console.error('❌ Periodic tasks failed:', error);
  }
}

async function cleanOldCache() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  for (const request of requests) {
    const response = await cache.match(request);
    const headers = response.headers;
    const cachedTime = headers.get('sw-cached-time');
    
    if (cachedTime && parseInt(cachedTime) < oneWeekAgo) {
      await cache.delete(request);
    }
  }
}

async function updateCriticalData() {
  const criticalEndpoints = [
    '/api/dashboard/stats',
    '/api/notifications/unread',
    '/api/properties/featured'
  ];
  
  for (const endpoint of criticalEndpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        const cache = await caches.open(API_CACHE);
        await cache.put(endpoint, response.clone());
      }
    } catch (error) {
      console.warn('Failed to update critical data for:', endpoint);
    }
  }
}

console.log('🚀 Teranga Foncier Service Worker loaded successfully');
