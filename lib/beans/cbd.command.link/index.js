var exec = require('child_process').exec,
fs = require('fs');

/**
 * "Untouches" target projects so they appear to be updated in cupboard
 */

exports.plugin = function(router) {
	
	function findLink(path, moduleName, callback) {
		var modulePath = path + '/node_modules/' + moduleName;
		try {
			callback(false, fs.realpathSync(modulePath));
		} catch(e) {
			callback(true);
		}
	}
	
	function link(path, moduleName, callback, igLog) {
		
		if(typeof moduleName == 'function') {
			callback = moduleName;
			moduleName = '';
		}
		
		
		//TODO: identify project type
		exec('npm link ' + moduleName, { cwd: path }, function(err, stdout, stderr) {
			if(!igLog) console.log(stdout.replace(/[\r\n]+$/,''));
			if(!igLog) console.error(stderr.replace(/[\r\n]+$/,''));
			callback(err, stdout);
		});
	}
	
	
	router.on({
		
		/**
		 */
		
		'collect project/command': function(req, res) {
			
			res.end([{
				name: 'link',
				execute: function(data, callback) {
					
					var path = this.path(),
				 	name = this.name();
					
					console.log('linking %s', name.bold);
					
					link(path, function(err, result) {
						
						if(data.global)
						{
							try 
							{
								name = JSON.parse(fs.readFileSync(path + '/package.json','utf8')).name;
							} catch(e) {
								
							}
							
							router.pull('command/execute/' + name, { args: [name], command: 'link-globally', target: '--all' }, function(response) {
								callback(false, response);
								
							});
						} else {
							callback(err, result);
						}
					});
				}
			},
			{
				name: 'find-link',
				execute: function(data, callback) {
					
					var path = this.path();
					
					findLink(path, data.args[0], function(err, hasPath) {
						
						if(hasPath) console.log(path);
						
						callback(err, path);
					});
					
				}
			},
			{
				name: 'link-globally',
				execute: function(data, callback) {
					
					var linkTo = data.args[0],
					linkFrom = this.name(),
					path = this.path()
					
					findLink(path, linkTo, function(err, modulePath) {
						
						if(modulePath) {
							
							console.log('linking %s to %s'.green, linkFrom.bold, linkTo.bold);
							link(path, linkTo, callback, true);
							
						} else {
							callback(false);
						}
					});
				}
			}]);
		},
		
		
		/**
		 */
		
		'collect help/item': function(req, res) {
			
			res.end({
				commands: [{
					command: 'link <proj>',
					desc: 'Links project globally'
				},
				{
					command: 'find-link <proj> <link>',
					desc: 'Finds project link against all projects'
				}],
				examples: [{
					command: 'link <proj> --global',
					desc: 'Links given project against all projects'
				}]
			});
		}
	})
}