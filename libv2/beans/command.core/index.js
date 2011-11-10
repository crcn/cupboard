exports.plugin = function(router)
{
	var commanders = {};
	
	router.on({
		
		/**
		 * adds a executable command
		 */
		
		'push commands': function(command)
		{
			if(!command.name) throw new Error('A name must be present for registered commands');
			
			commanders[command.name] = command;
		},
		
		/**
		 */
		
		'pull commands/execute/:command': function(request)
		{
			var commander = commanders[request.data.command];
			
			
			//commander exists? pass it on. At this point, the commander
			//controls the current request - including nexting.
			if(commander)
			{
				commander.execute(request);
			}
			
			//no commander? just continue.
			else
			{
				request.next();
			}
		}
	})
}