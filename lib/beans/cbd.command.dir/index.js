/**
 * returns the directoy of the target project. Function is similar to `pwd`
 */

var vine = require('vine'),
exec = require('child_process').exec;

exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'pull -multi project/command': function(request) {
			
			return {
				name: 'dir',
				execute: function(data, callback)
				{
					exec('readlink ' + this.path(), function(err, stdout)
					{	
						var dir = stdout.replace(/[\r\n]+/g,'');
						console.log(dir);

						callback(false, dir);
					}); 
				}
			};
		},
		
		/**
		 */
		
		'pull -multi help/item': function() {
			
			return {
				commands: {
					command: 'dir <proj>',
					desc:'Returns the project path.' 
				},
				examples: {
					command: 'cd `cbd dir <proj>`',
					desc: 'Changes the current working directory to given project.'
				}
			};
		}
	})
}