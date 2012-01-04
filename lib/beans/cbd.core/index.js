var chowder = require('chowder'),
vine = require('vine'),
path = require('path');

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
				
				var projectsDir = config.get('core:projects_directory') || process.env.PROJ_DIR;

				if(projectsDir.substr(0,1) == '.') {
					projectsDir = path.normalize(path.dirname(include) + '/' +projectsDir);
				}

				process.env.PROJ_DIR = projectsDir;
				

				router.push('cbd/config', config);
				
				vine.result(config).end(res);
			});
		}
	});
}