var router = require("beanpoll").router(),
pluginLoader = require("haba").loader(),
exec = require('child_process').exec,
fs = require('fs'),
EventEmitter = require('events').EventEmitter;

//where the data lives explicit to cupboard
process.env.CONF_DIR = process.env.HOME + '/.cupboard';
process.env.MAIN_CFG = process.env.CONF_DIR + '/inc.conf';
process.env.PROJ_DIR = process.env.CONF_DIR + '/projects';


var em = new EventEmitter(),
initializing = false,
initialized = false;


exports.init = function(callback) {
	
	if(initialized) return callback(router);
	
	em.addListener('init', callback);
	
	if(initializing) return;
	initializing = true;
	
	function init() {
		
		initialized = true;

		pluginLoader.options(router, true).
		require(__dirname + '/beans');


		router.pull('load/config', function() {
			
			//initialize once we're ready
			router.push('init', null);

			em.emit('init', router);

		});
	}

	//needed ONLY on first time initializing app 
	exec('mkdir -p '+process.env.CONF_DIR+'; mkdir -p '+ process.env.CONF_DIR + '/my_conf' +'; ln -s ' + __dirname + '/../conf/ ' + process.env.CONF_DIR + '/conf;', function() {
		
		fs.stat(process.env.MAIN_CFG, function(err, stat) {
			
			if(err) {
				
				var cfg = "; DO NOT modify this config file - add custom scripts to my_conf/* \n\n";
				cfg += "[include]\n";
				cfg += "files = files = conf/*.conf my_conf/*.conf";
				
				fs.writeFileSync(process.env.MAIN_CFG, cfg);
			}
			
			init();
		})
	});
}