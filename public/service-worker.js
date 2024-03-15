const cacheName = "v2"; // Version your cache for updates

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      // Cache essential assets listed in the index.html
      return cache.addAll([
        "/", // Cache your app's root URL
        "index.html", // Cache your main HTML file
        "static/css/main.0363f06a.css",
        "static/js/main.90732bd6.js",
        "static/js/845.f99cbb79.chunk.js",
        "static/js/787.cdfa87fd.chunk.js",
        "static/css/main.0363f06a.css.map",
        "static/js/main.90732bd6.js.map",
        "static/js/845.f99cbb79.chunk.js.map",
        "static/js/787.cdfa87fd.chunk.js.map",
        "apple-touch-icon.png", // Cache app icon
        "images/dist/add-to-homescreen.min.css",
        "images/add-more.jpg",
        "images/airtel-avatar.jpg",
        "images/airtel.png",
        "images/android-chrome-add-to-home-screen-button.svg",
        "images/android-chrome-bouncing-arrow.svg",
        "images/android-chrome-install-app.svg",
        "images/android-chrome-more-button.svg",
        "images/apple-touch-icon.png",
        "images/arrow-down.png",
        "images/breadcrumb-1.svg",
        "images/breadcrumb-2.svg",
        "images/breadcrumb-3.svg",
        "images/create-ad.jpg",
        "images/deleting.gif",
        "images/dist",
        "images/down-arrow-blue.svg",
        "images/down-arrow.png",
        "images/down-arrow.svg",
        "images/favicon.ico",
        "images/generic-more-button.svg",
        "images/generic-vertical-bouncing-arrow.svg",
        "images/generic-vertical-down-bouncing-arrow.svg",
        "images/generic-vertical-up-bouncing-arrow.svg",
        "images/gps_satellite_icongif.gif",
        "images/icon-logo.png",
        "images/icon-logonew.png",
        "images/icons",
        "images/ios-add-to-home-screen-button.svg",
        "images/ios-bouncing-arrow.svg",
        "images/ios-chrome-add-to-home-screen-button.svg",
        "images/ios-chrome-bouncing-arrow.svg",
        "images/ios-chrome-more-button.svg",
        "images/ios-safari-add-to-home-screen-button.svg",
        "images/ios-safari-bouncing-arrow.svg",
        "images/ios-safari-sharing-api-button.svg",
        "images/ios-safari-sharing-api.svg",
        "images/ios-sharing-api.svg",
        "images/loader.gif",
        "images/loading-house.gif",
        "images/logo-gilbert.png",
        "images/logo.png",
        "images/love the house.png",
        "images/MG.svg",
        "images/no connction.jpg",
        "images/no-notification.jpg",
        "images/no-reservation.png",
        "images/no-search-result.jpg",
        "images/not-loged.png",
        "images/not-premium.png",
        "images/openinsafari-button.png",
        "images/openinsafari-button.svg",
        "images/orange-avatar.jpg",
        "images/orange.png",
        "images/password-reset.png",
        "images/purchage.gif",
        "images/reset-password.png",
        "images/scan doc.gif",
        "images/scan user.gif",
        "images/Screenshot 2024-01-13 120652.png",
        "images/searching.gif",
        "images/share-button.png",
        "images/telma-avatar.jpg",
        "images/telma.png",
        "images/user-avatar.png",
        "images/verification.gif",
        "images/WorkingOn.jpg",
        "images/your-app-icon.svg",
        "https://fonts.googleapis.com/css?family=Nunito+Sans:200,300,400,700,900|Roboto+Mono:300,400,500", // Attempt to cache Google Fonts
        "fonts/icomoon/style.css",
        "css/bootstrap.min.css",
        "css/magnific-popup.css",
        "css/jquery-ui.css",
        "css/owl.carousel.min.css",
        "css/owl.theme.default.min.css",
        "css/bootstrap-datepicker.css",
        "css/mediaelementplayer.css",
        "css/animate.css",
        "fonts/flaticon/font/flaticon.css",
        "css/fl-bigmug-line.css",
        "css/aos.css",
        "css/style.css",
        "css/loader.css",
        "css/menu.css",
        "css/searchbar.css",
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyBPQYtD-cm2GmdJGXhFcD7_2vXTkyPXqOs&libraries=places", // Attempt to cache Google Maps API
        "images/dist/add-to-homescreen.min.js",
        "js/jquery-3.3.1.min.js",
        "js/jquery-migrate-3.0.1.min.js",
        "js/jquery-ui.js",
        "js/popper.min.js",
        "js/bootstrap.min.js",
        "js/owl.carousel.min.js",
        "js/mediaelement-and-player.min.js",
        "js/jquery.stellar.min.js",
        "js/jquery.countdown.min.js",
        "js/jquery.magnific-popup.min.js",
        "js/bootstrap-datepicker.min.js",
        "js/aos.js",
        "js/like.js",
        "js/main.js",
        "js/scroll.js",
        "data/communes madagasikara.json",
        "data/madagasikarawithid.json",
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
