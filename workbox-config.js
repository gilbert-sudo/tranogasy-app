module.exports = {
  // Include all static assets in the precache
  globDirectory: './',
  globPatterns: [
    '**/*.{html,css,js,json,ico,svg,png,jpg,gif,manifest}',
  ],
  swDest: 'sw.js',
  maximumFileSizeToCacheInBytes: 5000000, // 5MB limit (adjust as needed)
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  // Cache all requests with CacheFirst strategy (assuming offline page exists)
  runtimeCaching: [
    {
      urlPattern: /.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'offline-cache',
        cacheableResponse: {
          statuses: [0, 200], // Cache successful responses only
        },
      },
    },
  ],
  // Other options
  clientsClaim: true,
  skipWaiting: true,
};
