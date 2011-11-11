/**
 * "Untouches" target projects so they appear to be updated in cupboard
 */

exports.plugin = function(router)
{
	router.on({
		
		/**
		 */
		
		'pull command/projects -> command/execute/untouch': function(request)
		{
			request.projects.forEach(function(program)
			{
				program.untouch();
			});
		},
		
		
		/**
		 */
		
		'pull -multi help/item': function()
		{
			return {
				commands: {
					command: 'untouch <proj>',
					desc: 'Flags given project as updated.'
				}
			};
		}
	})
}