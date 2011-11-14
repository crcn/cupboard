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
					var updated = this.getUpdatedFiles();

					var inf = {
						path: this.path(),
						'last modified': updated.files.length ? relativeDate(updated.files[0].mtime) : 'unknown',
						'updates': updated.count,
						details: []
					},
					allInf = {};

					updated.files.forEach(function(file) {

						inf.details.push({
							path: file.path,
							'last modified': relativeDate(file.mtime)
						})
					});

					var name = this.name();

					if(updated.count) name = name.green;

					allInf[name] = inf;
					celeri.drawTree(inf);
					
					callback(false, inf);
				}
			}
		},
		
		/**
		 */
		
		'pull -multi help/item': function() {
			
			return {
				commands: {
					command: 'details <proj>',
					desc:'Returns details about the given project such as modified files, and number of updates.' 
				}
			};
		}
	});
}