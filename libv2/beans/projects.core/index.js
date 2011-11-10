exports.plugin = function(router)
{	
	router.on({
		
		/**
		 */
		
		'pull commands/execute/:command -> projects/execute/:command': function()
		{
			console.log("EXEC PROJECT COMMAND");
		}
	})
}