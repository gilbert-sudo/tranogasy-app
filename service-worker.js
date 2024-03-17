const cacheName = "v1.1.0 "; // Version your cache for updates

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      // Cache essential assets listed in the index.html
      return cache.addAll([
        "/", // Cache your app's root URL
        "/index.html", // Cache your main HTML file
        "/no connetion.svg",
        "/apple-touch-icon.png", // Cache app icon
        "/static/css/main.0363f06a.css",
        "/static/js/main.76de44e4.js",
        "/data/communes madagasikara.json",
        "/data/madagasikarawithid.json",
      ]);
    })
  );
});

// Fetch event: Serve cached version of assets if available
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

// Push notification placeholder (requires server-side setup)
// self.addEventListener('push', (event) => {
//   const data = event.data.json();
//   const title = data.title;
//   const body = data.body;
//
//   event.waitUntil(
//     self.registration.showNotification(title, {
//       body: body,
//       // Add notification options here (icon, badge, etc.)
//     })
//   );
// });
