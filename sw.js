const CACHE = 'kgst-v24';
const CORE = ['./','./index.html','./manifest.json','./css/style.css','./js/data.js','./js/app.js','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
const FRESH = ['index.html','app.js','style.css','data.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(u)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const isCore = req.mode === 'navigate' || FRESH.some(f => url.pathname.endsWith(f));
  e.respondWith((async () => {
    const cached = await caches.match(req);
    const net = fetch(req).then(res => { if (res && res.status === 200) { const cl = res.clone(); caches.open(CACHE).then(c => c.put(req, cl)); } return res; }).catch(() => null);
    if (isCore) {
      const timeout = new Promise(r => setTimeout(() => r(null), 3000));
      const res = await Promise.race([net, timeout]);
      return res || cached || (await net) || caches.match('./index.html');
    }
    return cached || (await net) || caches.match('./index.html');
  })());
});