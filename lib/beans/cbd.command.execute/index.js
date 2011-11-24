exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */

		'pull -multi project/command': function() {
			
			return {
				name: 'execute',
				execute: function(data, callback) {
					
					var proj = this,
					script = data.args.shift().replace('~', process.env.HOME);

					//execute the script
					require(script).execute.call(proj, data, callback);
				}
			};
		},

		/**
		 */


		
		'pull -multi help/item': function() {
			
			return {
				commands: [{
					command: 'execute <proj> <script.js>',
					desc: 'executes a script against project'
				}],
				examples: [{
					command: 'execute my-proj change-git.js'
				}]
			};
		}
	});
}