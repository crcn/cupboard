var vine = require('vine'),
exec = require('child_process').exec,
fs = require('fs');

exports.plugin = function(router) {
	
	//include third-party modules now.
	
	var pluginsDir = process.env.CONF_DIR + '/node_modules';
	
	try {
		fs.mkdirSync(pluginsDir, 0777);
	} catch(e) {
		
	}
	router.require(pluginsDir);
	
	function exec2(cmd, cwd, callback) {
		
		exec(cmd, { cwd:  cwd || process.env.CONF_DIR }, function(err, stdout, stderr) {
			
			if(err) return console.log(err.message.red);
			
			console.log(stderr.red);
			console.log(stdout);
			
			if(callback) callback();
		});
	}
	
	router.on({
		
		
		/**
		 * installs a third-party module
		 */
		
		'pull command/execute/install': function(request) {
			
			if(!request.data.args.length) return vine.error('A package name must be present').end();
			
			exec2('npm install ' + request.data.args.join(' '), null, function()
			{
				vine.result(1).end(request);
			});

		},
		
		/**
		 * uninstalls third-party module
		 */
		
		'pull command/execute/uninstall': function(request) {
			
			if(!request.data.args.length) return vine.error('A package name must be present').end();
			
			
			console.log('Uninstalled plugins: %s', request.data.args.join(', ').bold);
			
			
			exec2('rm -rf ' + request.data.args.join(' '), pluginsDir, function()
			{
				vine.result(1).end(request);
			});
		},
		
		/**
		 * lists all plugins
		 */
		
		'pull command/execute/plugins': function(request) {
			
			var plugins = fs.readdirSync(pluginsDir);
			
			plugins.forEach(function(pluginName) {
				
				console.log(pluginName);
			})
			
			vine.result(plugins).end(request);
		},
		
		
		/**
		 */

		'pull -multi help/item': function() {
			return {
				commands: [ {
				        command: 'install <cupboard plugin>',
						desc: 'Installs a third-party cupboard plugin.'
				    },
					{
				        command: 'uninstall <cupboard plugin>',
						desc: 'Uninstalls a third-party cupboard plugin.'
				    },
					{
				        command: 'plugins',
						desc: 'Lists all third-party plugins.'
				    } ]
			};
		}
	})
}