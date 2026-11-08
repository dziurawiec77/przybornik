const scope = new URL(self.registration.scope);
const cachePrefix = 'przybornik:' + scope.pathname + ':';
const cacheName = cachePrefix + '__VERSION__';
const assetPaths = __ASSETS__;
const indexPath = new URL('index.html', scope).pathname;

self.addEventListener('install', event => {
  const requests = assetPaths.map(path => new Request(new URL(path, scope), { cache: 'reload' }));
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(requests)));
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    const obsolete = names.filter(name => name !== cacheName && (
      name.startsWith(cachePrefix) ||
      (scope.pathname === '/przybornik/' && /^przybornik-[a-f0-9]{16}$/.test(name))
    ));
    await Promise.all(obsolete.map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const appEntry = request.mode === 'navigate' && (url.pathname === scope.pathname || url.pathname === indexPath);
    const cached = await cache.match(appEntry ? scope.href : request);
    return cached ?? fetch(request);
  })());
});
