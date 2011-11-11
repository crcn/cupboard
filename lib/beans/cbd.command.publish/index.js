var vine = require('vine');

exports.plugin = function(router)
{
	router.on({
		
		/**
		 */
		
		'pull command/projects -> command/execute/publish': function(request)
		{
			request.projects.forEach(function(project)
			{
				project.execute(request.data);
				project.untouch();
			});
			
			vine.result(0).end(request);
		},
		
		/**
		 */

		'pull -multi help/item': function()
		{
			return {
				commands: [
					{
				        command: 'publish <proj>',
						desc: 'Publishes target project.'
				    }]
			};
		}
	});
}