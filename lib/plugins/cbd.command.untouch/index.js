/**
 * "Untouches" target projects so they appear to be updated in cupboard
 */

exports.require = ["router"];
exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'collect project/command': function(req, res) {
			
			res.end({
				name: 'untouch',
				execute: function(data, callback) {
					this.untouch();
					callback();
				}
			});
		},
		
		
		/**
		 */
		
		'collect help/item': function(req, res) {
			
			res.end({
				commands: {
					command: 'untouch <proj>',
					desc: 'Marks project as published'
				}
			});
		}
	})
}