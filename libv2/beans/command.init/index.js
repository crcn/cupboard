/**
 * registers a project to cupboard
 */


exports.plugin = function(router)
{
	
	var commander = {
		name: 'init',
		execute: function(request)
		{
			console.log('execute');
		}
	}
	
	
	router.on({
		
		'push init': function()
		{
			router.push('commands', commander);
		}
	})
}