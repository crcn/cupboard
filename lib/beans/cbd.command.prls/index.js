exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */

		'collect project/command': function(req, res) {
			
			res.end({
				name: 'prls',
				execute: function(data, callback) {
					
					var proj = this;
						
					(data.args[0] || '').split('+').forEach(function(cmd) {

						proj.execute({ command: cmd, args: [] }, function() {
							
						});

					});


					callback();

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