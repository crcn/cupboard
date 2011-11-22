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
		
		'pull -multi project/command': function(request) {
			
			return [{
				name: 'link',
				execute: function(data, callback) {
					
					var path = this.path(),
				 	name = this.name();
					
					link(path, function(err, result) {
						
						if(data.global)
						{
							
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
					
					findLink(this.path(), data.args[0], function(err, path) {
						
						if(path) console.log(path);
						
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
			}]
		},
		
		
		/**
		 */
		
		'pull -multi help/item': function() {
			
			return {
				commands: [{
					command: 'link <proj>',
					desc: 'Links project globally'
				},
				{
					command: 'find-link <proj> <link>',
					desc: 'Finds project link against all projects'
				}]
			};
		}
	})
}