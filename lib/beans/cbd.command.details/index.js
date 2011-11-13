var celeri = require('celeri'),
relativeDate = require('relative-date');

/**
 * shows details about what files have been updated
 */



exports.plugin = function(router) {
	
	router.on({
		
		/**
		 */
		
		'pull command/projects -> command/execute/details': function(request) {
			
			var allInf = {};
			
			request.projects.forEach(function(project) {
				
				var updated = project.getUpdatedFiles();
				
				var inf = {
					path: project.get('path'),
					'last modified': updated.files.length ? relativeDate(updated.files[0].mtime) : 'unknown',
					'updates': updated.count,
					details: []
				};
				
				updated.files.forEach(function(file) {
					
					inf.details.push({
						path: file.path,
						'last modified': relativeDate(file.mtime)
					})
				});
				
				var name = project.name();
				
				if(updated.count) name = name.green;
				
				allInf[name] = inf;
			});
			
			
			celeri.drawTree(allInf);
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