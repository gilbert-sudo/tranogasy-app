module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{png,json,css,ico,eot,svg,ttf,woff,txt,scss,html,pdf,js,jpg,gif,md,mp3,wav}'
	],
	swDest: 'sw.js',
	
	maximumFileSizeToCacheInBytes: 5000000,
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};