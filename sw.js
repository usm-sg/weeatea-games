/* Tea Games service worker — makes the games open and play with no connection,
   and quietly refreshes them whenever the device is online.
   To force every player onto a new release at once, change VERSION. */
const VERSION = 'tea-games-v3';
const CORE = ['./', 'index.html', 'tea-strike.html', 'tea-fusion.html', 'tea-blocks.html',
              'spin-wheel.html', 'photo-studio.html', 'tea-match.html', 'tea-mahjong.html', 'tea-solitaire.html', 'tea-checkers.html', 'tea-words.html', 'fortune-tea.html', 'chinlone.html', 'yangon-dash.html', 'myanmar-memory.html', 'support.js', 'howto.js', 'tea-hub.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
const OPTIONAL = ['teapack.json'];   // the bundled photo pack, if you added one
const CDN = /^https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)\//;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await Promise.all(CORE.map(u => c.add(u).catch(() => {})));
    await Promise.all(OPTIONAL.map(u => fetch(u).then(r => r.ok && c.put(u, r)).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !CDN.test(req.url)) return;          // leaderboard API etc. always go to the network
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true });
    const refresh = fetch(req).then(r => {
      if (r && (r.ok || r.type === 'opaque')) cache.put(req, r.clone());
      return r;
    }).catch(() => null);
    if (hit) { e.waitUntil(refresh); return hit; }          // instant from cache, refresh in background
    const r = await refresh;
    if (r) return r;
    if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
    return Response.error();
  })());
});
