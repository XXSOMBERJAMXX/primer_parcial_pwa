// Service Worker para App Shell con estrategia de caché
const CACHE_NAME = 'tienda-campus-shell-v1';
const DATA_CACHE_NAME = 'tienda-campus-data-v1';

// APP SHELL: Recursos estáticos que se cachean inmediatamente
const SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalar: Cachear el App Shell
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker y cacheando App Shell');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] App Shell cacheado exitosamente');
        return cache.addAll(SHELL_FILES);
      })
  );
  // Activar inmediatamente
  self.skipWaiting();
});

// Activar: Limpiar cachés antiguos
self.addEventListener('activate', event => {
  console.log('[SW] Service Worker activado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('[SW] Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Estrategia Cache First para el Shell, Network First para datos
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Si es parte del App Shell: Cache First (offline-first)
  if (SHELL_FILES.some(file => url.pathname === file)) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            console.log('[SW] Sirviendo desde caché (Shell):', url.pathname);
            return response;
          }
          return fetch(request);
        })
    );
    return;
  }

  // Para todo lo demás: Network First con fallback a caché
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cachear respuestas exitosas
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(DATA_CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar servir desde caché
        return caches.match(request)
          .then(response => {
            if (response) {
              console.log('[SW] Sin conexión - sirviendo desde caché:', url.pathname);
              return response;
            }
          });
      })
  );
});