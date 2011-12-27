exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */

		'collect project/command': function(req, res) {
			
			res.end({
				name: 'execute',
				execute: function(data, callback) {
					
					var proj = this,
					script = data.args.shift().replace('~', process.env.HOME);

					//execute the script
					require(script).execute.call(proj, data, callback);
				}
			});
		},

		/**
		 */


		
		'collect help/item': function(req, res) {
			
			res.end({
				commands: [{
					command: 'execute <proj> <script.js>',
					desc: 'executes a script against project'
				}],
				examples: [{
					command: 'execute my-proj change-git.js'
				}]
			});
		}
	});
}