const CACHE = 'kgst-v21';
const ASSETS = [
  './', './index.html',
  './css/style.css?v=4', './js/data.js?v=4', './js/app.js?v=4',
  './manifest.json', './icons/icon.svg', './icons/icon-192.png',
  './icons/icon-512.png', './icons/apple-touch-icon.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(res => { const cl = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', cl)); return res; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res && res.status === 200) { const cl = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); }
    return res;
  })));
});