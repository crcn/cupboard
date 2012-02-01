var router = require("beanpoll").router(),
pluginLoader = require("haba").loader(),
EventEmitter = require('events').EventEmitter;

require('./config');

var em = new EventEmitter(),
initializing = false,
initialized = false;


exports.init = function(callback) {
	
	if(initialized) return callback(router);
	
	em.addListener('init', callback);
	
	if(initializing) return;
	initializing = true;
	
	initialized = true;

	pluginLoader.options(router, true).
	require(__dirname + '/beans').
	init();


	router.pull('load/config', function() {
		
		//initialize once we're ready
		router.push('init', null);

		em.emit('init', router);

	});

}