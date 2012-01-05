/**
 * returns the directoy of the target project. Function is similar to `pwd`
 */

var vine = require('vine'),
exec = require('child_process').exec;

exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'collect project/command': function(req, res) {
			
			res.end({
				name: 'dir',
				execute: function(data, callback)
				{
					exec('cd ' + process.env.PROJ_DIR + '; cd `readlink ' + this.path() + '`; pwd;', function(err, stdout)
					{	
						var dir = stdout.replace(/[\r\n]+/g,'');
						console.log(dir);

						callback(false, dir);
					}); 
				}
			});
		},
		
		/**
		 */
		
		'collect help/item': function(req, res) {
			
			res.end({
				commands: {
					command: 'dir <proj>',
					desc:'Returns the project path.' 
				},
				examples: {
					command: 'cd `cbd dir <proj>`',
					desc: 'Changes the current working directory to given project.'
				}
			});
		}
	})
}