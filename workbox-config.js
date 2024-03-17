module.exports = {
  globDirectory: ".",
  globPatterns: [
    "**/*.{png,json,css,ico,eot,svg,ttf,woff,txt,scss,html,pdf,js,jpg,gif,md,mp3,wav,manifest}", // Include manifest.json
  ],
  swDest: "sw.js",
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.origin === "https://gotrano.onrender.com",
      handler: "CacheFirst",
      options: {
        cacheName: "cdn-cache",
        expiration: {
          maxEntries: 100,
        },
      },
    },
    {
      urlPattern: /.*/, // Default strategy for all other URLs
      handler: "StaleWhileRevalidate",
    },
  ],
  clientsClaim: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 5000000,
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
