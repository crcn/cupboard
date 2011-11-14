exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'pull -multi project/command': function() {
			
			return {
				name: 'start',
				execute: function(project, callback) {
					console.log("START")
				}
			}
		} 
	});
}