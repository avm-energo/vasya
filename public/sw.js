const CacheKey = "cache-v1"
let timerId;

const tryNetwork = (req, timeout) =>{
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(req).then((res) => {
      clearTimeout(timeoutId)
      resolve(res)
    }, reject)
  })
}

self.addEventListener('fetch', event => {
    event.respondWith(tryNetwork(event.request, 20000).catch(()=>{}))
});

// self.addEventListener('sync', (event) => {
//   if (event.tag === 'my-sync-tag') {
//     console.log(event)
//   }
// });

self.addEventListener('message', (e) => {
  const interval = e.data.interval;
  timerId = setInterval(() => {
    self.postMessage({}); // Отправка сообщения обратно в основную вкладку
  }, interval);
});

self.addEventListener('message', (e) => {
  if (e.data.stop) {
    clearInterval(timerId);
    self.close()
  }
});

// self.addEventListener("install", (e) =>{
  
// })
// self.addEventListener("activate", (e) =>{
//   e.waitUntil(
//     caches.keys().then((keyList) => {
//       console.log('tut')
//       return Promise.all(keyList.map((key) =>{
//         if (key !== CacheKey) {
//           return caches.delete(key)
//         }
//       }));
//     })
//   )
// })
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.open('my-cache').then((cache) => {
//       return cache.keys().then((keys) => {
//         // Отправка запросов для кэшированных ресурсов
//       });
//     })
//   );
// });