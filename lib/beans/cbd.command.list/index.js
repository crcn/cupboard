var findit = require('findit'),
celeri = require('celeri'),
vine = require('vine'),
relativeDate = require('relative-date'),
_ = require('underscore');


/**
 * lists all projects within cupboard
 */

exports.plugin = function(router) {
	
	
	
	router.on({
	
		/**
		 */
		
		'pull projects/all-projects -> command/execute/list': function(request) {
			
			
			var running = request.projects.length+1;
			
			function next() {
				
				if(!(--running) && !request.next()) {

					//drawProjects(request.projects);
					vine.result(request.projects).end(request);
					
					var rows = [];
					
					request.projects.forEach(function(project) {
						
						lastPublishedAt = project.get('lastPublishedAt');
						
						var name = project.name();
						
						// if(project.__updatedFiles.length) name = name.green;
						
						rows.push({
							name: name,
							hasUpdates: project.__updatedFiles.length ? project.__updatedFiles.length + ' updates' : ' ',
							published: 'published: ' + (lastPublishedAt ? relativeDate(lastPublishedAt) : 'never')
						});
						
					});
					
					celeri.drawTable(rows, {
						columns: [{
							minWidth: 20,
							width: 10, 
							name: 'name'
						},
						{
							name: 'hasUpdates',
							width: 10,
						},
						{
							name: 'published',
							width:10,
							minWidth: 30,
							align: 'left'
						},
						{
							name: 'padding',
							width: 10
						}]
					});
					
				}
			}
			
			request.projects.forEach(function(project)
			{
				project.getUpdatedFiles(function(err, files) {
					
					project.__updatedFiles = files;
					
					next();
				});
			})
			
			next();
		},
		
		/**
		 */
		
		'pull command/execute/list -> command/execute/updates': function(request) {
			
			//filter out only projects that have been updated
			request.projects = _.filter(request.projects, function(a)
			{
				return a.__updatedFiles.length;
			});
			
			if(!request.next())
			{
				var rows = [];
				
				
				request.projects.forEach(function(project) {
					rows.push({
						name: project.name(),
						updates: project.__updatedFiles.length + ' updates'
					})
				});
				
				celeri.drawTable(rows, {
					columns: {
						name: {
							width: 20,
							minWidth: 20
						},
						updates: 80
					}
				})
				
				vine.result(request.projects).end(request);
			}
		},
		
		
		/**
		 */
		
		'pull -multi help/item': function() {
			return {
				commands: [ {
						command: 'updates',
						desc: 'List all projects with updates.'
					},
					{
						command: 'list',
						desc: 'List all projects in cupboard organized by most recently updated.'
					} ]
			};
		}
	});
}