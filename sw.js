const CACHE='skygates-v022-real-3d-temple-world';
const ASSETS=['./?v=022-real-3d','./index.html?v=022','./app.css?v=022-real-3d-1','./app.js?v=022-real-3d-1','./manifest.webmanifest','./icon-192.png','./icon-512.png','./skygates-temple-world.png','./trinity-knot.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html?v=022'))))});
