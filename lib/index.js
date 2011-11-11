var bootstrap = require('./bootstrap'),
printMessages = require('./utils/printMessages');

exports.execute = function(ops)
{
	
	bootstrap.init(function(router)
	{
		//execute given command against the projects first. Dun worry, 
		//default commands act as middleware before they get to the projects. Why?
		//take this for an example:
		//cbd publish some-project, where the default command "publish" executes a project
		//command, but then waits until SUCCESS before updating the last modified date in the cupboard db.
		router.pull('command/execute/' + ops.command, ops, function(response)
		{
			if(response)
			{
				if(response.errors) printMessages(response.errors, 'red');
				if(response.warnings) printMessages(response.warnings, 'yellow');
				if(response.messages) printMessages(response.messages, response.result ? response.result.color : null);
			}
			
		});
	});
}