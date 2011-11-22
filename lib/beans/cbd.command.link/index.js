var exec = require('child_process').exec;

/**
 * "Untouches" target projects so they appear to be updated in cupboard
 */

exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'pull -multi project/command': function(request) {
			
			return {
				name: 'link',
				execute: function(data, callback) {
					
					//TODO: identify project type
					exec('npm link ' + data.args.join(' '), { cwd: this.path() }, function(err, stdout, stderr) {
						console.log(stdout);
						console.error(stderr);
					});
				}
			};
		},
		
		
		/**
		 */
		
		'pull -multi help/item': function() {
			
			return {
				commands: {
					command: 'link <proj>',
					desc: 'Links project against NPM'
				}
			};
		}
	})
}