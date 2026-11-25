const CACHE = 'kgst-v23';
const CORE = ['./','./index.html','./manifest.json','./css/style.css','./js/data.js','./js/app.js','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(u)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => { if (res && res.status === 200) { const cl = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); } return res; })
      .catch(() => caches.match(e.request).then(m => m || caches.match('./index.html')))
  );
});