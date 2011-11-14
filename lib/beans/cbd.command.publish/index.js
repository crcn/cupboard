var vine = require('vine');

exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'pull -multi project/command': function(request) {
			
			return {  
				name: 'publish',
				execute: function(data, callback)
				{
					this.execute(data, callback);
					this.untouch();
				}
			};
		},
		
		/**
		 */

		'pull -multi help/item': function() {
			return {
				commands: [ {
				        command: 'publish <proj>',
						desc: 'Publishes target project.'
				    } ]
			};
		}
	});
}