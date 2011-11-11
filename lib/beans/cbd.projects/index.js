var project = require('./model'),
vine = require('vine'),
path = require('path'),
exec = require('child_process').exec;

exports.plugin = function(router)
{	
	var Project;
	
	router.on({
		
		/**
		 * executes a command against target projects 
		 */
		
		'pull command/projects -> command/execute/:command OR projects/execute/:command': function(request)
		{
			request.projects.forEach(function(project)
			{
				project.execute(request.data);
			});
			
			vine.result(true).end(request);
		},
		
		
		/**
		 * adds a project to cupboard
		 */
		
		'pull command/execute/init OR commmand/execute/add': function(request)
		{
			var ops = request.data,
			
			//source is either explicitly defined as an argument, OR in the CWD of cupboard
			projectPath = ops.args.length ? ops.args.shift() : process.cwd(),
			
			//extend this setting - inherits commands
			tpl = ops.tpl || 'template:git',
			
			//assume this is the project name
			projectName = path.basename(projectPath),
			
			projectId = Project.getId(projectName);
			
			Project.findOne({ _id: projectId }, function(err, item)
			{
				if(item) return vine.error('The project "**%s**" already exist', projectName).end(request);
				
				var doc = {
					_id: projectId,
					tpl: tpl
				};
				
				exec('mkdir -p '+Project.getPath() + '; ln -s ' + projectPath + ' ' + Project.getPath(projectName), function(err, stdout)
				{
					if(err) return vine.error(err.message).end(request);
					
					var project = new Project(doc);
					
					project.save(function(err, result)
					{
						if(err) return vine.error('Unable to save project "**%s**"', projectName).end(request);

	 					return vine.success('Successfuly added project "**%s**"', projectName).result({ color: 'green' }).end(request);
					});
				});
				
			});
		},
		
		/**
		 */
		
		'pull command/projects -> command/execute/remove': function(request)
		{
			var response = vine.api();
			
			request.projects.forEach(function(project)
			{
				project.remove();
				
				response.success('Removed "**%s**"', project.name());
				
				exec('rm ' + project.path(), function(){});
			});
			
			response.result({ color: 'green' }).end(request);
		},
		
		/**
		 * returns target projects in a given command. E.g: cbd publish --all, or cbd publish app+app
		 */
		
		'pull command/projects OR command/projects/:target': function(request)
		{
			var ops = request.data;
			 
			if(ops.all)
			{
				ops.projectName == '--all';
			}
			else
			{
				//target, or use CWD
		 		ops.projectName = ops.target || (ops.args.length ? ops.args.shift() : path.basename(process.cwd()));
			}
			
			Project.find(ops.projectName, function(err, projects)
			{
				//attach onto the request so anything routes after this get the projects. example above
				request.projects = projects;
				
				//called explicitly? return the prjoects
				if(!request.next()) vine.result(projects).end(request);
			});
		},
		
		/**
		 */
		
		'push cbd/config': function(cfg)
		{
			Project = project.init(cfg);
		},
		
		/**
		 */
		
		'pull -multi help/item': function()
		{
			return {
				commands: [
					{
				        command: 'init',
						desc: 'Adds a project in cwd to cupboard.'
				    },
					{
				        command: 'remove <proj>',
						desc: 'Removes project from cupboard.'
				    },
					{
						command: '<cmd> <proj>',
						desc: 'Calls custom command specified in project cupboard config.'
					}]
			};
		}
	});
	
	
}