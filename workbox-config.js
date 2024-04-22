module.exports = {
  // Include all static assets in the precache
  globDirectory: "./",
  globPatterns: ["**/*.{html,css,js,json,ico,svg,png,jpg,gif,manifest}"],
  swDest: "sw.js",
  maximumFileSizeToCacheInBytes: 5000000, // 5MB limit (adjust as needed)
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  // Use NetworkFirst strategy with cache fallback
  runtimeCaching: [
    {
      urlPattern: /.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "dynamic-cache",
        networkTimeoutSeconds: 4, // Time to wait for the network before falling back to the cache
        cacheableResponse: {
          statuses: [0, 200], // Cache successful responses only
        },
      },
    },
  ],
  // Other options
  clientsClaim: true,
  skipWaiting: false,
};
