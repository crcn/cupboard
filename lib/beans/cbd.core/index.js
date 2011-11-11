var chowder = require('chowder');

exports.plugin = function(router)
{
	var include = [process.env.MAIN_CFG];
	
	router.on({
		
		/**
		 */
		
		'pull load/config': function(request)
		{
			chowder.load(include, function(config)
			{
				router.push('cbd/config', config);
				
				request.end();
			});
		},
		
		/**
		 */
		
		'push cbd/config/include': function(includeFile)
		{
			include.push(includeFile);
		}
	});
}