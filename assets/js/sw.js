// Service Worker para cache offline e performance
const CACHE_VERSION = 'diego-pereira-v1.0.1';
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;

// Arquivos para cache imediato (apenas recursos críticos que existem)
const PRECACHE_URLS = [
  '/assets/imgs/logo-header.png',
  '/assets/imgs/logo-header.webp',
  '/assets/imgs/logo-header.avif',
  '/assets/imgs/favicon.png',
  '/assets/js/main.js',
  '/assets/js/code-generator.js',
  '/assets/js/tailwind-config.js'
];

// Estratégia de cache para diferentes tipos de recursos
const CACHE_STRATEGIES = {
  // Cache first para recursos estáticos
  static: [
    /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
    /\.(?:woff|woff2|ttf|otf|eot)$/,
    /\.(?:css|js)$/
  ],
  // Network first para HTML e API
  dynamic: [
    /\.(?:html|php)$/,
    /\/api\//
  ]
};

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Precaching resources');
        // Cachear recursos individualmente para evitar falha total
        return Promise.allSettled(
          PRECACHE_URLS.map(url => 
            cache.add(url).catch(err => {
              console.warn('[SW] Failed to cache:', url, err);
              return null;
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Precache completed');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Installation failed:', err);
      })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName.startsWith('portfolio-') && cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições de extensões do navegador e cross-origin
  if (url.origin !== location.origin && !url.href.includes('fonts.googleapis.com')) {
    return;
  }
  
  // Determinar estratégia de cache
  const isStatic = CACHE_STRATEGIES.static.some(pattern => pattern.test(url.pathname));
  const isDynamic = CACHE_STRATEGIES.dynamic.some(pattern => pattern.test(url.pathname));
  
  if (isStatic) {
    // Cache First - recursos estáticos
    event.respondWith(cacheFirst(request));
  } else if (isDynamic) {
    // Network First - conteúdo dinâmico
    event.respondWith(networkFirst(request));
  } else {
    // Stale While Revalidate - outros recursos
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Estratégia: Cache First
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache First failed:', error);
    throw error;
  }
}

// Estratégia: Network First
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Estratégia: Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  return cached || fetchPromise;
}

// Mensagens do cliente
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        return self.clients.matchAll();
      }).then(clients => {
        clients.forEach(client => client.postMessage({ action: 'cacheCleared' }));
      })
    );
  }
});
