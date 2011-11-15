var celeri = require('celeri'),
relativeDate = require('relative-date'),
vine = require('vine');

/**
 * shows details about what files have been updated
 */



exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'pull -multi project/command': function(request) {
			
			
			return {
				name: 'details',
				execute: function(data, callback)
				{
					var self = this;
					
					this.getUpdatedFiles(function(err, updated)
					{
						var inf = {
							path: self.path(),
							'last modified': updated.length ? relativeDate(updated[0].mtime) : 'unknown',
							'updates': updated.length,
							details: []
						},
						allInf = {};

						updated.forEach(function(file) {

							inf.details.push({
								path: file.path,
								'last modified': relativeDate(file.mtime)
							})
						});

						var name = self.name();

						if(updated.count) name = name.green;

						allInf[name] = inf;
						celeri.drawTree(inf);
						

						callback(false, inf);
					});
					
				}
			}
		},
		
		/**
		 */
		
		'pull -multi help/item': function() {
			
			return {
				commands: {
					command: 'details <proj>',
					desc:'Returns project details.' 
				}
			};
		}
	});
}