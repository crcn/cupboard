var router = require('./bootstrap').router;


exports.execute = function(ops)
{
	//execute given command against the projects first. Dun worry, 
	//default commands act as middleware before they get to the projects. Why?
	//take this for an example:
	//cbd publish some-project, where the default command "publish" executes a project
	//command, but then waits until SUCCESS before updating the last modified date in the cupboard db.
	router.pull('projects/execute/' + ops.command, ops, function(response)
	{
		//to-do?
	});
	
	
}