/**
 * "Untouches" target projects so they appear to be updated in cupboard
 */

exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'pull -multi project/command': function(request) {
			
			return {
				name: 'untouch',
				execute: function(data, callback) {
					this.untouch();
					callback();
				}
			};
		},
		
		
		/**
		 */
		
		'pull -multi help/item': function() {
			
			return {
				commands: {
					command: 'untouch <proj>',
					desc: 'Flags given project as updated.'
				}
			};
		}
	})
}