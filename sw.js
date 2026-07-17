const CACHE='skygates-v021a-visible-live-engine';
const ASSETS=['./?v=021a-visible-engine','./index.html?v=021a','./app.css?v=021a-visible-engine-1','./app.js?v=021a-visible-engine-1','./manifest.webmanifest','./icon-192.png','./icon-512.png','./bali-skygate.webp','./trinity-knot.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html?v=021a'))))});
