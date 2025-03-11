const CACHE_NAME = "fridge-planner-v2";
const BASE_PATH = "/fridge-meal-planner";
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/static/js/main.*.js`,
  `${BASE_PATH}/static/css/main.*.css`,
  `${BASE_PATH}/static/media/*`,
  `${BASE_PATH}/favicon.svg`,
  `${BASE_PATH}/favicon.ico`,
  `${BASE_PATH}/logo192.png`,
  `${BASE_PATH}/icon-192x192.png`,
  `${BASE_PATH}/icon-512x512.png`,
  `${BASE_PATH}/manifest.json`,
];

// Install a service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll([
        `${BASE_PATH}/`,
        `${BASE_PATH}/index.html`,
        `${BASE_PATH}/favicon.svg`,
        `${BASE_PATH}/favicon.ico`,
        `${BASE_PATH}/logo192.png`,
        `${BASE_PATH}/icon-192x192.png`,
        `${BASE_PATH}/icon-512x512.png`,
        `${BASE_PATH}/manifest.json`,
      ]);
    })
  );
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response as it's a stream and can only be consumed once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If fetch fails, try to return a cached offline page
          if (event.request.mode === "navigate") {
            return caches.match(`${BASE_PATH}/index.html`);
          }
        });
    })
  );
});

// Update a service worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
  self.clients.claim();
});

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
