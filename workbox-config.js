module.exports = {
    globDirectory: './',
    globPatterns: [
        '**/*.{png,json,css,ico,eot,svg,ttf,woff,txt,scss,html,pdf,js,jpg,gif,md,mp3,wav,manifest}' // Include manifest.json
    ],
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true,
    maximumFileSizeToCacheInBytes: 5000000,
    ignoreURLParametersMatching: [
        /^utm_/,
        /^fbclid$/
    ]
};
