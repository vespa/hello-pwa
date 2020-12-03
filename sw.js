// var cacheName = "hello-pwa-1";
// var filesToCache = ["index.html", "css/style.css", "js/main.js"];

// /* Start the service worker and cache all of the app's content */
// self.addEventListener("install", function (e) {
//   e.waitUntil(
//     caches.open(cacheName).then(function (cache) {
//       return cache.addAll(filesToCache);
//     })
//   );
// });

// /* Serve cached content when offline */
// self.addEventListener("fetch", function (e) {
//   e.respondWith(
//     caches.match(e.request).then(function (response) {
//       return response || fetch(e.request);
//     })
//   );
// });

var APP_PREFIX = "HelloWorld"; // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = "version_0.1"; // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION;
const files = ["index.html", "css/style.css", "js/main.js"];
const place = location.port === "9000" ? "/" : "/hello-pwa/";
var URLS = files.map(function (item) {
  return place + item;
});
console.warn(URLS);
console.warn();

// Respond with cached resources
self.addEventListener("fetch", function (e) {
  // console.log("fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        // if cache is available, respond with cache
        // console.log("responding with cache : " + e.request.url);
        return request;
      } else {
        // if there are no cache, try fetching request
        // console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  );
});

// Cache resources
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(URLS);
    })
  );
});

// Delete outdated caches
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheWhitelist.indexOf(key) === -1) {
            // console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});
