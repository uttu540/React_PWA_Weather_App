const CACHE_NAME = 'version-1';
const urlsToCache = ['index.html', 'offline.html'];

const self = this;
// Install SW
self.addEventListener('install', (Event) =>{
    Event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');

            return cache.addAll(urlsToCache);
        })
    )
});
//Listen for requests
self.addEventListener('fetch', (Event) =>{
    Event.respondWith(
        caches.match(Event.request)
            .then(() => {
                return fetch(Event.request)
                    .catch(() => caches.match('offline.html'))
        })
    )
});
// Activate the SW
self.addEventListener('activate', (Event) =>{
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);

    Event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheNames) => {
                if (!cacheWhiteList.includes(cacheNames))
                {
                    return caches.delete(cacheNames);
                }
            })
        ))
    )
});