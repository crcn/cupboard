var bootstrap = require('./bootstrap'),
printMessages = require('./utils/printMessages'),
Structr = require('structr'),
step = require('step');
 
/**
 * executes command from CLI
 */

function execute2(ops, router, changed) {
	
	//execute given command against the projects first. Dun worry, 
	//default commands act as middleware before they get to the projects. Why?
	//take this for an example:
	//cbd publish some-project, where the default command "publish" executes a project
	//command, but then waits until SUCCESS before updating the last modified date in the cupboard db.
	
	var steps = [];
	
	ops.command.split('+').forEach(function(command) {
		
		
		steps.push(function()
		{
			var next = this,
			cops = Structr.copy(ops);
			cops.command = command;
			
			if(changed) router.push('user/notification', { message: command + ' ' + cops.args[0] });
			
			
			router.pull('command/execute/' + command, cops, function(response) {
				
				if(response) {
					
					if(response.errors) printMessages(response.errors, 'red');
					if(response.warnings) printMessages(response.warnings, 'yellow');
					if(response.messages) printMessages(response.messages, response.result ? response.result.color : null);
				}
				
				
				next();
			});
		});
	});
	
	step.apply(null, steps);
	
}

var execute = exports.execute = function(ops) {
	
	bootstrap.init(function(router) {
		
		var cops = Structr.copy(ops);
		
		
		var target = cops.args[0] || (cops.all ? '--all' : null);
		
		//flag to watch all projects for changes
		if(ops.watch && target) {
			
			console.log('Watching target projects for any changes'.underline);
			
			getProjects(target, function(err, projects) {
			
				if(err) return; 
				
				projects.forEach(function(project)
				{
					project.watch().on('change', function()
					{       
						console.log('%s has changed, re-executing'.grey, project.name().bold);
						
						
						  
						cops.args[0] = project.name();
						cops.all = false; 
						 
						execute2(cops, router, true);
					});
				});
			});
		}
		
		
		execute2(ops, router);
		
	});
}

/**
 * Returns all projects in cupboard
 */

var getProjects = exports.getProjects = function(projects, callback) {
	
	if(!(projects instanceof Array)) projects = projects.split('+');
	
	bootstrap.init(function(router) {
		
		router.pull('projects', { target: projects.join('+') }, function(response) {
			callback(false, response.result ? response.result : null);
		})
	});
}
