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

	this.require(pluginsDir);
	
	function exec2(cmd, cwd, callback) {
		
		exec(cmd, { cwd:  cwd || process.env.CONF_DIR }, function(err, stdout, stderr) {
			
			if(err) return console.log(err.message.red);
			
			console.log(stderr);
			console.log(stdout);
			
			if(callback) callback();
		});
	}
	
	router.on({
		
		
		/**
		 * installs a third-party module
		 */
		
		'pull command/execute/install': function(req, res) {
			
			if(!req.query.args.length) vine.error('A package name must be present').end(res);
			
			console.log('Iinstalled plugins: %s', req.query.args.join(', ').bold);
			
			exec2('npm install ' + req.query.args.join(' '), null, function()
			{
				vine.result(1).end(res);
			});

		},
		
		/**
		 * uninstalls third-party module
		 */
		
		'pull command/execute/uninstall': function(req, res) {
			
			if(!req.data.args.length) return vine.error('A package name must be present').end(res);
			
			
			console.log('Uninstalled plugins: %s', req.query.args.join(', ').bold);
			
			
			exec2('rm -rf ' + req.query.args.join(' '), pluginsDir, function()
			{
				vine.result(1).end(res);
			});
		},
		
		/**
		 * lists all plugins
		 */
		
		'pull command/execute/plugins': function(req, res) {
			
			var plugins = fs.readdirSync(pluginsDir);
			
			plugins.forEach(function(pluginName) {
				
				console.log(pluginName);
			})
			
			vine.result(plugins).end(res);
		},
		
		
		/**
		 */

		'collect help/item': function(req, res) {
			res.end({
				commands: [ {
				        command: 'install <plugin>',
						desc: 'Installs a plugin'
				    },
					{
				        command: 'uninstall <plugin>',
						desc: 'Uninstalls a plugin'
				    },
					{
				        command: 'plugins',
						desc: 'Lists installed plugins'
				    } ]
			});
		}
	})
}