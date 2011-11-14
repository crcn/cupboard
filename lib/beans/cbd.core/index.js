var chowder = require('chowder'),
vine = require('vine');

exports.plugin = function(router) {
	var include = [process.env.MAIN_CFG];
	
	router.on({
		
		/**
		 */
		
		'pull load/config': function(request) {
			
			//ugh god this isn't pretty >.>
			router.pull('-multi cdb/config/include', null, { meta: { multi: true, passive: true } }, function(inc) {
				
				if(inc) include.push(inc);
			})
			
			chowder.load(include, function(config) {
				
				router.push('cbd/config', config);
				vine.result(config).end(request);
			});
		}
	});
}