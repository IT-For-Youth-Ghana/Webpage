// Service Worker for IT for Youth Ghana
// Cache strategy for better performance

const CACHE_NAME = 'it-youth-ghana-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Cache essential files - PRELOAD ALLE BILDER FÜR MAXIMALE PERFORMANCE
const staticAssets = [
  '/',
  '/manifest.json'
];

// ALLE BILDER VOR-CACHEN FÜR EXTREM SCHNELLES LADEN
const imageAssets = [
  '/images/logo/logo.jpg',
  '/images/randomPictures/UX4.jpg',
  '/images/randomPictures/mireiotalking.jpg',
  '/images/randomPictures/maingraduationpic.jpg',
  '/images/randomPictures/studentslistening.jpg',
  '/images/randomPictures/graduation.jpg',
  '/images/randomPictures/groupofgirlsentrance.jpg',
  '/images/randomPictures/UXcours.jpg',
  '/images/randomPictures/UXteacher.png',
  '/images/people/peter.jpg'
];

// Install event - cache static assets und alle BILDER
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('Caching static assets');
          return cache.addAll(staticAssets);
        }),
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          console.log('PRELOADING ALLE BILDER FÜR MAXIMALE PERFORMANCE!');
          return cache.addAll(imageAssets);
        })
    ]).then(() => {
      console.log('Alle Assets und Bilder gecached!');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Cache strategy based on resource type
  if (request.destination === 'image') {
    // Images: Cache first, then network
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((fetchResponse) => {
              return caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, fetchResponse.clone());
                  return fetchResponse;
                });
            });
        })
        .catch(() => {
          // Fallback for images
          return new Response('<svg>...</svg>', {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        })
    );
  } else {
    // HTML/JS/CSS: Network first, then cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response since it's a stream
          const responseToCache = response.clone();

          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseToCache);
            });

          return response;
        })
        .catch(() => {
          // Fallback to cache for HTML requests
          if (request.destination === 'document') {
            return caches.match('/');
          }
          return caches.match(request);
        })
    );
  }
});

// Background sync for offline actions (if needed)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Handle background sync tasks
  }
});

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('Push received:', data);
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/images/logo/logo.jpg',
        badge: '/images/logo/logo.jpg'
      })
    );
  }
});