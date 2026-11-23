const V='rincon-v1',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);if(r.method!='GET')return;
 if(r.mode=='navigate'){
  e.respondWith(Promise.race([fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put('index.html',cp));return res}),new Promise(ok=>setTimeout(ok,3000)).then(()=>caches.match('index.html'))]).then(x=>x||fetch(r)).catch(()=>caches.match('index.html')));return}
 if(!(u.origin==location.origin||['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)))return;
 e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(r);const net=fetch(r).then(res=>{if(res&&(res.ok||res.type=='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);return hit||net}))});
