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
        cacheName: "tranogasy-v0",
        expiration: {
          // Adjust the number of entries to keep as needed.
          maxEntries: 50,
        },
      },
    },
  ],
  clientsClaim: true,
  skipWaiting: true,
  maximumFileSizeToCacheInBytes: 5000000,
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
