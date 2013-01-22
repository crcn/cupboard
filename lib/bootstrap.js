var plugin = require("plugin")(),
EventEmitter = require('events').EventEmitter;

require('./config');

var em = new EventEmitter(),
initializing = false,
initialized = false;


exports.init = function(callback) {
	
	
	
	if(initialized) return callback(loaer.module("router"));
	
	em.addListener('init', callback);
	
	if(initializing) return;
	initializing = true;
	
	initialized = true;

	var router = plugin.
	require(__dirname + '/plugins').
	load().
	module("router");


	router.pull('load/config', function() {
		
		//initialize once we're ready
		router.push('init', null);

		em.emit('init', router);

	});

}