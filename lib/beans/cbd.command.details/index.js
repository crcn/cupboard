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
		
		'collect project/command': function(req, res) {
			
			
			res.end({
				name: 'details',
				execute: function(data, callback)
				{
					var self = this;
					
					this.getUpdatedFiles(function(err, updated)
					{
						var inf = {
							path: self.path(),
							'last modified': updated.length ? relativeDate(updated[0].mtime) : 'unknown',
							'last published': self.get('lastPublishedAt') ? relativeDate(self.get('lastPublishedAt')) : 'never',
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
						
						console.log('|');
						celeri.drawTree(inf);
						

						callback(false, inf);
					});
					
				}
			});
		},
		
		/**
		 */
		
		'collect help/item': function(req, res) {
			
			res.end({
				commands: {
					command: 'details <proj>',
					desc:'Shows project details' 
				}
			});
		}
	});
}