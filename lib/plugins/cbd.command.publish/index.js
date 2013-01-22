var vine = require('vine');

exports.require = ["router"];
exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'collect project/command': function(req, res) {
			
			res.end({  
				name: 'publish',
				execute: function(data, callback)
				{
					this.execute(data, callback);
					this.untouch();
				}
			});
		},
		
		/**
		 */

		'collect help/item': function(req, res) {
			res.end({
				commands: [ {
				        command: 'publish <proj>',
						desc: 'Publishes project'
				    } ]
			});
		}
	});
}