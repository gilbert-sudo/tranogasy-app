module.exports = {
  globDirectory: ".",
  globPatterns: [
    "**/*.{png,json,css,ico,eot,svg,ttf,woff,txt,scss,html,pdf,js,jpg,gif,md,mp3,wav,manifest}", // Include manifest.json
  ],
  swDest: "sw.js",
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.pathname.startsWith('https://gotrano.onrender.com'),
      handler: "CacheFirst",
      options: {
        cacheName: "tranogasy-cache",
        expiration: {
          // Adjust the number of entries to keep as needed.
          maxEntries: undefined, // Keep this undefined to use default behavior
          maxAgeSeconds: undefined 
        },
      },
    },
  ],
  clientsClaim: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 5000000,
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
