const V='recettes-v4',DATA='recettes-donnees';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==DATA).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r})
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
  }else if(u.hostname.endsWith('themealdb.com')&&u.pathname.includes('/api/')){
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(DATA).then(x=>x.put(e.request,c))}return r})
      .catch(()=>caches.match(e.request)));
  }
});
