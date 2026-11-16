/* 交易看板 · Service Worker（网络优先 + 离线回退） */
const CACHE='dash-v2';
const SHELL=['./','./index.html','./dashboard.html','./archive.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
 const u=e.request.url;
 if(e.request.method!=='GET')return;
 if(u.includes('qt.gtimg.cn'))return;
 e.respondWith(fetch(u).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(u,cp)).catch(()=>{});return r;})
  .catch(()=>caches.match(u).then(r=>r||caches.match('./index.html'))));
});
