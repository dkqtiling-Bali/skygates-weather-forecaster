const CACHE='skygates-v020-github';
const BASE=new URL('./',self.location.href);
const ASSETS=['./','./index.html','./app.css','./app.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./bali-skygate.webp','./trinity-knot.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match(new URL('./index.html',BASE).href))))});
