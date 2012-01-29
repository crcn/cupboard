var project = require('./model'),
vine = require('vine'),
path = require('path'),
exec = require('child_process').exec;

exports.plugin = function(router) {
		
	var Project, config, commands = {};
	
	router.on({
		
		/**
		 */
		
		'push init': function() {
			
			router.collect('project/command', function(err, cmd) {
				
				var cmds = cmd instanceof Array ? cmd : [cmd];

				cmds.forEach(function(cmd) {
					if(!(cmd.name instanceof Array)) cmd.name = cmd.name.split('+');

					cmd.name.forEach(function(name)
					{
						commands[name] = cmd;
					})
				});
				
				
			});
		},
		
		/**
		 * executes a command against target projects 
		 */
		
		'pull projects -> command/execute/:cmd OR projects/execute/:cmd': function(req, res) {
			
			var running = req.projects.length;  

			
			if(!running) return vine.result([]).end(res);
			
			req.projects.forEach(function(project) {
				
				var cmd = req.query.command,
				target = commands[cmd] || project;

				
				target.execute.call(project, Structr.copy(req.query), function(err, result)
				{
					if(!(--running)) return vine.result(1).end(res);
				});
			});
			  
		},
		
		
		/**
		 * adds a project to cupboard
		 */
		
		'pull command/execute/init OR commmand/execute/add': function(req, res) {
				
			var ops = req.query,
			
			//source is either explicitly defined as an argument, OR in the CWD of cupboard
			projectPath = ops.args.length ? ops.args.shift() : process.cwd(),
			
			//extend this setting - inherits commands
			tpl = 'template:' + (ops.tpl || config.get('template:default') || 'git'),
			
			//assume this is the project name
			projectName = path.basename(projectPath),
			
			projectId = Project.getId(projectName);
			
			
			Project.findOne({ _id: projectId }, function(err, item) {
				
				if(item) return vine.error('The project "**%s**" already exist', projectName).end(res);
				
				var doc = {
					_id: projectId,
					tpl: tpl
				},
				lnPath = Project.getPath(projectName),
				lnDir = path.dirname(lnPath),

				//n 0.4 vs 0.6
				relPath = path.relative ? path.relative(path.dirname(lnPath), projectPath) : projectPath;
				

				exec('mkdir -p '+Project.getPath() + '; ln -s ' + relPath + ' ' + lnPath, function(err, stdout) {
					
					if(err) return vine.error(err.message).end(res);
					
					var project = new Project(doc);
					
					project.save(function(err, result) {
						
						if(err) return vine.error('Unable to save project "**%s**"', projectName).end(res);
						
	 					return vine.success('Successfuly added project "**%s**"', projectName).result({ color: 'green' }).end(res);
					});
				});
				
			});
		},
		
		/**
		 */
		
		'pull projects -> command/execute/remove': function(req, res) {
			
			var response = vine.api();
			
			req.projects.forEach(function(project) {
				
				project.remove();
				
				response.success('Removed "**%s**"', project.name());
				
				exec('rm ' + project.path(), function(){});
			});
			
			response.result({ color: 'green' }).end(res);
		},
		
		/**
		 * returns target projects in a given command. E.g: cbd publish --all, or cbd publish app+app
		 */
		
		'pull projects OR projects/:target': function(req, res, mw) {
			
			var ops = req.query;

			 
			if(ops.all) {
				
				ops.projectName == '--all';
			}
			else {
				
				//target, or use CWD
		 		ops.projectName = ops.target || (ops.args.length ? ops.args.shift() : path.basename(process.cwd()));
			}

			
			Project.find(ops.projectName, function(err, projects) {
				
				//attach onto the request so anything routes after this get the projects. example above
				req.projects = projects;
				
				//called explicitly? return the prjoects
				if(!mw.next()) vine.result(projects).end(res);
			});
		},
		
		/**
		 */
		
		'push cbd/config': function(cfg) {
			config = cfg;
			Project = project.init(cfg, router);
		},
		
		/**
		 */
		
		'collect help/item': function(req, res) {
			
			res.end({
				commands: [ {
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
				}],
				examples: [{
					command: 'make+start project --watch',
					desc: ''
				}]
			});
		}
	});
	
	
}