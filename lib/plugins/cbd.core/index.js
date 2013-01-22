var chowder = require('chowder'),
vine = require('vine'),
path = require('path');

exports.require = ["router"];
exports.plugin = function(router) {
	var include = [process.env.MAIN_CFG];
	
	router.on({
		
		/**
		 */
		
		'pull load/config': function(req, res) {
			
			router.request("cdb/config/include").
			tag({ passive: true }).
			collect(function(inc) {
				
				if(inc) include.push(inc);

			});


			
			chowder.load(include, function(config) {
				
				process.env.CONF_DIR = config.get('core:directory') || process.env.CONF_DIR;
				process.env.PROJ_DIR = process.env.CONF_DIR + '/projects';


				router.push('cbd/config', config);
				
				vine.result(config).end(res);
			});
		}
	});
}